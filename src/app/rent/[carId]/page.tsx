/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, ArrowLeft, CreditCard, Landmark, Smartphone, CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { allCarsDetailData } from '@/data/carData';
import { CarDetail } from '@/types';
import guest from "@/assets/images/guest.png";
import { motion } from 'framer-motion';

const loadRazorpayScript = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error("Razorpay SDK failed to load.");
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

const UpiIcon = () => <Smartphone className="w-6 h-6 mr-2 text-gray-600" />;
const NetbankingIcon = () => <Landmark className="w-6 h-6 mr-2 text-gray-600" />;

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PaymentOptionProps {
    label: string;
    value: 'card' | 'upi' | 'netbanking';
    currentMethod: string | null;
    onSelect: (method: 'card' | 'upi' | 'netbanking') => void;
    icon: React.ReactNode;
}
const PaymentOption: React.FC<PaymentOptionProps> = ({ label, value, currentMethod, onSelect, icon }) => {
    const isSelected = currentMethod === value;
    return (
        <label className={clsx(
            "flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:shadow-md",
            isSelected ? 'border-black ring-2 ring-black bg-gray-50 shadow-md scale-[1.01]' : 'border-gray-300 hover:border-gray-400 bg-white'
        )} onClick={() => onSelect(value)}>
            <input type="radio" name="paymentMethod" value={value} checked={isSelected} onChange={() => onSelect(value)} className="opacity-0 w-0 h-0 absolute" />
            {icon}
            <span className="text-sm font-medium text-gray-800 flex-grow">{label}</span>
            {isSelected ? <CheckCircle className="w-5 h-5 text-black" /> : <Circle className="w-5 h-5 text-gray-300" />}
        </label>
    );
};

const RentCarPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const carId = params.carId as string;
    const { data: session, status: sessionStatus } = useSession();

    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isNotFoundState, setIsNotFoundState] = useState(false);

    const carData = useMemo((): CarDetail | null => {
        if (!carId) return null;
        const id = parseInt(carId, 10);
        if (isNaN(id)) return null;
        return allCarsDetailData.find(car => car.id === id) || null;
    }, [carId]);

    useEffect(() => {
        if (sessionStatus !== 'loading') {
            if (sessionStatus === 'unauthenticated') {
                signIn(undefined, { callbackUrl: `/rent/${carId}` });
            } else if (sessionStatus === 'authenticated') {
                if (session?.user?.mobileNumber && !phoneNumber) {
                    setPhoneNumber(session.user.mobileNumber);
                }
            }
        }
    }, [sessionStatus, carId, session, phoneNumber, router]);

    useEffect(() => {
        if (carId && carData === null && sessionStatus !== 'loading') setIsNotFoundState(true);
        else setIsNotFoundState(false);
    }, [carId, carData, sessionStatus]);

    useEffect(() => { if (isNotFoundState) notFound(); }, [isNotFoundState]);

    const handlePayment = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        if (!session?.user?.id) { setSubmitError("Session invalid. Please log in."); setIsSubmitting(false); signIn(undefined, { callbackUrl: `/rent/${carId}` }); return; }
        if (!paymentMethod) { setSubmitError("Please select a payment method."); setIsSubmitting(false); return; }
        if (!addressLine1 || !city || !postalCode || !phoneNumber) { setSubmitError("Please fill in all required address and phone fields."); setIsSubmitting(false); return; }


        try {
            console.log("Frontend: Creating payment order for method:", paymentMethod);
            const orderResponse = await fetch('/rent/create-payment-order', { // *** Ensure this path is correct ***
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId: carData?.id,
                    address: { addressLine1, addressLine2, city, postalCode },
                    phoneNumber,
                    paymentMethod,
                }),
            });

            const orderResult = await orderResponse.json();

            if (!orderResponse.ok || !orderResult.orderId) {
                throw new Error(orderResult.message || "Failed to create payment order.");
            }
            console.log("Frontend: Payment order created:", orderResult);

            const scriptLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!scriptLoaded) {
                throw new Error("Razorpay SDK failed to load. Check internet connection.");
            }

            const razorpayOptions: any = {
                key: orderResult.keyId,
                amount: orderResult.amount,
                currency: orderResult.currency,
                name: "PrimeDrive Car Rental",
                description: `Rental for ${carData?.brand} ${carData?.model}`,
                image: "/logo.png",
                order_id: orderResult.orderId,
                handler: function (response: any) {
                    console.log("Razorpay payment successful:", response);
                    setSubmitError(null);
                    router.push(
                        `/rent/confirmation?bookingId=${orderResult.internalBookingId}&paymentId=${response.razorpay_payment_id}&status=success&carModel=${encodeURIComponent(carData?.model || 'Unknown')}&carBrand=${encodeURIComponent(carData?.brand || 'Vehicle')}`
                    );
                },
                prefill: {
                    name: orderResult.userDetails.name,
                    email: orderResult.userDetails.email,
                    contact: orderResult.userDetails.contact,
                },
                notes: {
                    address: `${addressLine1}, ${city}`,
                    internalBookingId: orderResult.internalBookingId,
                },
                theme: { color: "#FF8C00" },
                modal: {
                    ondismiss: function() {
                        console.log('Razorpay checkout modal dismissed by user.');
                        setSubmitError('Payment was cancelled.');
                        setIsSubmitting(false);
                    }
                },
            };

            const rzp = new window.Razorpay(razorpayOptions);
            rzp.on('payment.failed', function (response: any){
                console.error("Razorpay payment failed:", response.error);
                setSubmitError(`Payment Failed: ${response.error.description} (Reason: ${response.error.reason || 'Unknown'})`);
                setIsSubmitting(false);
            });

            console.log("Frontend: Opening Razorpay Checkout...");
            rzp.open();

        } catch (error) {
            console.error("Frontend: Error during payment initiation or order creation:", error);
            setSubmitError(error instanceof Error ? error.message : "Could not initiate payment process. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleSubmitWrapper = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handlePayment();
    };

    if (sessionStatus === 'loading' || (carId && !carData && !isNotFoundState)) { return (<div className="flex justify-center items-center min-h-screen pt-20 bg-gray-100"><Loader2 className="h-12 w-12 animate-spin text-gray-500" /><span className="ml-4 text-gray-500 font-medium">Loading...</span></div>); }
    if (sessionStatus === 'unauthenticated') { return (<div className="container mx-auto px-4 py-8 text-center bg-gray-100 min-h-screen flex flex-col justify-center items-center"><AlertTriangle size={48} className="text-yellow-500 mb-4" /><h1 className="text-2xl font-semibold mb-4">Authentication Required</h1><p className="mb-6 text-gray-600">Please log in to continue.</p><button onClick={() => signIn(undefined, { callbackUrl: `/rent/${carId}` })} className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors">Log In</button></div>); }

    if (sessionStatus === 'authenticated' && carData && session?.user) {
        return (
            <div className="bg-gray-100 min-h-screen py-8 sm:py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-6">
                        <Link href={`/dashboard/cars/${carId}`} className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors">
                            <ArrowLeft size={16} /> Back to Car Details
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold mb-8 text-gray-900">Complete Your Rental: {carData.brand} {carData.model}</h1>
                    <form onSubmit={handleSubmitWrapper} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"> <div className="flex flex-col sm:flex-row items-start gap-6"> <div className="relative w-full sm:w-48 h-32 sm:h-auto sm:aspect-[4/3] flex-shrink-0 rounded-lg overflow-hidden shadow"> <Image src={carData.image} alt={`${carData.brand} ${carData.model}`} layout="fill" objectFit="cover" priority /> </div> <div className='flex-grow'> <h2 className="text-xl font-bold text-gray-800">{carData.brand} {carData.model}</h2> <p className="text-sm text-gray-600 mb-1">{carData.bodyType} • {carData.transmission} • {carData.seats} Seats</p> <p className="text-2xl font-extrabold text-black mt-2">₹{carData.pricePerDay.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500">/ day</span></p> </div> </div> </section>
                            <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"> <h2 className="text-xl font-semibold mb-4 border-b pb-3 text-gray-800">Your Information</h2> <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4"> <div className='flex items-center gap-3 bg-slate-50 p-3 rounded-md border border-slate-200'><Image src={session.user.image || guest} alt="User profile" width={40} height={40} className='rounded-full object-cover' /><div><label className="block text-xs font-medium text-gray-500">Logged in as</label><p className="text-gray-800 font-medium">{session.user.name || 'N/A'}</p></div></div> <div className='bg-slate-50 p-3 rounded-md border border-slate-200'><label className="block text-xs font-medium text-gray-500">Email</label><p className="text-gray-800 font-medium break-words">{session.user.email || 'N/A'}</p></div> </div> <div><label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label><input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required pattern="^(?:\+91)?\s?[6-9]\d{9}$" title="Enter a 10-digit Indian mobile number" maxLength={14} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" placeholder="9876543210" /></div> </section>
                            <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"> <h2 className="text-xl font-semibold mb-4 border-b pb-3 text-gray-800">Delivery Address</h2> <div className="grid grid-cols-1 gap-y-4"> <div><label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 <span className="text-red-500">*</span></label><input type="text" id="addressLine1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black" placeholder="Street Address, P.O. Box" /></div> <div><label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 <span className='text-xs text-gray-500'>(Optional)</span></label><input type="text" id="addressLine2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black" placeholder="Apartment, Suite, Unit" /></div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div><label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label><input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black" placeholder="Your City" /></div> <div><label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code <span className="text-red-500">*</span></label><input type="text" id="postalCode" value={postalCode} onChange={e => setPostalCode(e.target.value)} required pattern="\d{6}" title="Enter a 6-digit postal code" maxLength={6} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black" placeholder="6-digit Pincode" /></div> </div> </div> </section>
                        </div>

                        <div className="lg:col-span-1 space-y-8">
                             <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
                                <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-800">Choose Payment Method</h2>
                                <div className="space-y-4">
                                    <PaymentOption label="Credit / Debit Card" value="card" currentMethod={paymentMethod} onSelect={setPaymentMethod} icon={<CreditCard className="w-6 h-6 mr-3 text-gray-500" />} />
                                    {paymentMethod === 'card' && ( <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="pl-4 pr-2 py-4 ml-2 border-l-2 border-black space-y-3"> <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-300 flex items-center gap-1.5"><Lock size={12}/> Demo only. Do not enter real card details.</p> <div><label className="block text-xs font-medium text-gray-600 mb-0.5">Card Number</label><input type="text" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} className="text-sm block w-full px-3 py-1.5 border border-gray-300 rounded-md" placeholder="---- ---- ---- ----"/></div> <div className="grid grid-cols-2 gap-3"> <div><label className="block text-xs font-medium text-gray-600 mb-0.5">Expiry (MM/YY)</label><input type="text" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} className="text-sm block w-full px-3 py-1.5 border border-gray-300 rounded-md" placeholder="MM / YY"/></div> <div><label className="block text-xs font-medium text-gray-600 mb-0.5">CVC</label><input type="text" value={cvc} onChange={e=>setCvc(e.target.value)} className="text-sm block w-full px-3 py-1.5 border border-gray-300 rounded-md" placeholder="---"/></div> </div> </motion.div> )}
                                    
                                    <PaymentOption label="UPI" value="upi" currentMethod={paymentMethod} onSelect={setPaymentMethod} icon={<UpiIcon />} />
                                    {paymentMethod === 'upi' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pl-4 pr-2 py-4 ml-2 border-l-2 border-black">
                                            <p className="text-xs text-gray-600">You will be prompted to enter your UPI ID or choose an app in the payment window.</p>
                                        </motion.div>
                                    )}

                                    <PaymentOption label="Net Banking" value="netbanking" currentMethod={paymentMethod} onSelect={setPaymentMethod} icon={<NetbankingIcon />} />
                                    {paymentMethod === 'netbanking' && ( <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="pl-4 pr-2 py-4 ml-2 border-l-2 border-black space-y-3"><p className="text-xs text-gray-600">You will be redirected to select your bank.</p><select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} className="text-sm block w-full px-3 py-1.5 border border-gray-300 rounded-md"><option value="">Select Bank...</option><option value="hdfc">HDFC Bank</option><option value="icici">ICICI Bank</option><option value="sbi">State Bank of India</option><option value="axis">Axis Bank</option></select></motion.div> )}
                                </div>
                                <div className="mt-8 pt-6 border-t">
                                    {submitError && (<p className="text-sm text-red-600 mb-4 text-center p-3 bg-red-50 border border-red-200 rounded-md">{submitError}</p>)}
                                    <button type="submit" disabled={isSubmitting || !paymentMethod || sessionStatus !== 'authenticated'} className="w-full flex justify-center items-center gap-2 bg-black text-white font-bold py-3.5 px-8 rounded-lg hover:bg-gray-800 transition-colors text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed">
                                        {isSubmitting ? (<><Loader2 className="h-5 w-5 animate-spin"/> Processing...</>) : ('Proceed to Payment')}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1"><Lock size={12}/> Secure Payment</p>
                                </div>
                            </section>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
    return ( <div className="container mx-auto px-4 py-8 text-center bg-gray-100 min-h-screen flex flex-col justify-center items-center"><AlertTriangle size={48} className="text-red-500 mb-4" /><p className="text-xl font-semibold">Oops! Something went wrong.</p><p className='mt-2 text-sm text-gray-600'>Could not load the rental page.</p></div> );
};

export default RentCarPage;