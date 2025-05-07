import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Booking from "@/models/booking";
import crypto from 'crypto';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!RAZORPAY_WEBHOOK_SECRET) {
    console.error("FATAL ERROR: Razorpay Webhook Secret not configured.");
}

export async function POST(request: Request) {
    const logPrefix = "[Razorpay Webhook]";
    console.log(`${logPrefix} Received request.`);

    if (!RAZORPAY_WEBHOOK_SECRET) {
        console.error(`${logPrefix} Webhook secret not available.`);
        return NextResponse.json({ message: "Webhook misconfiguration" }, { status: 500 });
    }

    try {
        const requestBodyText = await request.text();
        const receivedSignature = request.headers.get('x-razorpay-signature');

        if (!receivedSignature) {
            console.error(`${logPrefix} Missing x-razorpay-signature header.`);
            return NextResponse.json({ message: "Signature missing" }, { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
            .update(requestBodyText)
            .digest('hex');

        if (expectedSignature !== receivedSignature) {
            console.error(`${logPrefix} Invalid signature.`);
            return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
        }

        console.log(`${logPrefix} Signature verified successfully.`);
        const eventPayload = JSON.parse(requestBodyText);

        if (eventPayload.event === 'payment.captured') {
            const paymentEntity = eventPayload.payload.payment.entity;
            const orderId = paymentEntity.order_id;
            const razorpayPaymentId = paymentEntity.id;
            const amountPaid = paymentEntity.amount;
            const currency = paymentEntity.currency;

            console.log(`${logPrefix} Event: payment.captured for Order ID: ${orderId}`);

            await connectMongoDB();
            const booking = await Booking.findOne({ 'paymentDetails.orderId': orderId });

            if (!booking) {
                console.warn(`${logPrefix} Booking not found for RZP Order ID: ${orderId}. Acknowledging event.`);
                return NextResponse.json({ message: "Booking not found, event acknowledged." }, { status: 200 });
            }
            if (booking.status === 'Confirmed') {
                 console.log(`${logPrefix} Booking ${booking._id} already confirmed for order ${orderId}.`);
                 return NextResponse.json({ message: "Already confirmed" }, { status: 200 });
            }

            booking.status = 'Confirmed';
            booking.paymentDetails = {
                ...(booking.paymentDetails || {}),
                paymentId: razorpayPaymentId,
                status: 'captured',
                amountPaid: amountPaid / 100,
                currency: currency,
                capturedAt: new Date(paymentEntity.created_at * 1000),
                error: null,
            };
            await booking.save();
            console.log(`${logPrefix} Booking ${booking._id} status updated to Confirmed.`);

        } else if (eventPayload.event === 'payment.failed') {
            const paymentEntity = eventPayload.payload.payment.entity;
            const orderId = paymentEntity.order_id;
            const failureReason = paymentEntity.error_description;
            console.log(`${logPrefix} Event: payment.failed for Order ID: ${orderId}. Reason: ${failureReason}`);
            await connectMongoDB();
            const booking = await Booking.findOne({ 'paymentDetails.orderId': orderId });
            if (booking && booking.status !== 'Confirmed') {
                booking.status = 'PaymentFailed';
                booking.paymentDetails = {
                     ...(booking.paymentDetails || {}),
                     status: 'failed',
                     error: failureReason || 'Payment failed at gateway.'
                };
                await booking.save();
                console.log(`${logPrefix} Booking ${booking._id} status updated to PaymentFailed.`);
            }
        }
        return NextResponse.json({ message: "Webhook received successfully" }, { status: 200 });
    } catch (error) {
        console.error(`${logPrefix} Error processing webhook:`, error);
        return NextResponse.json({ message: error instanceof Error ? error.message : "Webhook processing error." }, { status: 500 });
    }
}