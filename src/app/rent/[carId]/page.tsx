// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import Image from 'next/image';
// import { useSession, signIn } from 'next-auth/react';
// import { useParams, useRouter, notFound } from 'next/navigation';
// import Link from 'next/link';
// import {
//     Loader2, Lock, ArrowLeft, CreditCard, Landmark, Smartphone
// } from 'lucide-react';

// import { allCarsDetailData } from '@/data/carData';
// import { CarDetail } from '@/types';
// import guest from "@/assets/images/guest.png";

// const RentCarPage: React.FC = () => {
//     const router = useRouter();
//     const params = useParams();
//     const carId = params.carId as string;
//     const { data: session, status } = useSession();
//     const [addressLine1, setAddressLine1] = useState('');
//     const [addressLine2, setAddressLine2] = useState('');
//     const [city, setCity] = useState('');
//     const [postalCode, setPostalCode] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | null>(null);
//     const [cardNumber, setCardNumber] = useState('');
//     const [expiryDate, setExpiryDate] = useState('');
//     const [cvc, setCvc] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [submitError, setSubmitError] = useState<string | null>(null);
//     const [isNotFoundState, setIsNotFoundState] = useState(false);

//     const carData = useMemo((): CarDetail | null => {
//         if (!carId) return null;
//         const id = parseInt(carId, 10);
//         if (isNaN(id)) return null;
//         return allCarsDetailData.find(car => car.id === id) || null;
//     }, [carId]);

//     useEffect(() => {
//         if (status !== 'loading') {
//             if (status === 'unauthenticated') {
//                 console.log("User not authenticated, redirecting to sign in...");
//                 signIn(undefined, { callbackUrl: `/rent/${carId}` });
//             } else if (status === 'authenticated') {
//                 if (session?.user?.mobileNumber && !phoneNumber) {
//                     setPhoneNumber(session.user.mobileNumber);
//                 }
//             }
//         }
//     }, [status, carId, session, phoneNumber]);
//     useEffect(() => {
//         if (carId && carData === null && status !== 'loading') {
//             setIsNotFoundState(true);
//         } else {
//             setIsNotFoundState(false);
//         }
//     }, [carId, carData, status]);
//     if (isNotFoundState) {
//         notFound();
//     }

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         setIsSubmitting(true);
//         setSubmitError(null);

//         if (!session?.user?.id) {
//             setSubmitError("Your session may have expired. Please log in again.");
//             setIsSubmitting(false);
//             signIn(undefined, { callbackUrl: `/rent/${carId}` });
//             return;
//         }

//         if (!paymentMethod) {
//             setSubmitError("Please select a payment method.");
//             setIsSubmitting(false);
//             return;
//         }

//         console.log("Frontend: Preparing to submit rental request to API...");

//         try {
//             const response = await fetch('/api/rent/initiate', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     carId: carData?.id,
//                     address: { addressLine1, addressLine2, city, postalCode },
//                     phoneNumber,
//                     paymentMethod,
//                 }),
//             });

//             const result = await response.json();
//             if (!response.ok) {
//                 throw new Error(result.message || `Server responded with status: ${response.status}`);
//             }

//             console.log("Frontend: API Call Successful. Booking initiated:", result);

//             router.push(`/rent/confirmation?bookingId=${result.bookingId}&car=${carData?.model}`);

//         } catch (error) {
//             console.error("Frontend: Rental Submission Error:", error);
//             setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (status === 'loading' || (carId && !carData && !isNotFoundState)) {
//         return (
//             <div className="flex justify-center items-center min-h-screen pt-20">
//                 <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
//                 <span className="ml-4 text-gray-500 font-medium">Loading Rental Details...</span>
//             </div>
//         );
//     }

//     if (status === 'unauthenticated') {
//         return (
//             <div className="container mx-auto px-4 py-8 pt-28 text-center">
//                 <h1 className="text-2xl font-semibold mb-4">Login Required</h1>
//                 <p className="mb-6 text-gray-600">Please log in to proceed with renting this car.</p>
//                 <button
//                     onClick={() => signIn(undefined, { callbackUrl: `/rent/${carId}` })}
//                     className="bg-black text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
//                 >
//                     Log In or Sign Up
//                 </button>
//             </div>
//         );
//     }

//     if (status === 'authenticated' && carData && session?.user) {
//         return (
//             <div className="container mx-auto px-4 py-8 max-w-4xl">
//                 <div className="mb-6">
//                     <Link href={`/cars/${carId}`} className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors">
//                         <ArrowLeft size={16} />
//                         Back to Car Details
//                     </Link>
//                 </div>

//                 <h1 className="text-3xl font-bold mb-8 text-gray-900">Rent: {carData.brand} {carData.model}</h1>

//                 <form onSubmit={handleSubmit} className="space-y-8">

//                     <section className="bg-gray-50 p-4 rounded-lg border flex flex-col sm:flex-row items-center gap-4">
//                         <div className="relative w-32 h-20 sm:w-24 sm:h-16 flex-shrink-0 rounded overflow-hidden shadow-sm">
//                             <Image
//                                 src={carData.image}
//                                 alt={`${carData.brand} ${carData.model}`}
//                                 layout="fill"
//                                 objectFit="cover"
//                                 priority
//                             />
//                         </div>
//                         <div className='text-center sm:text-left'>
//                             <h2 className="text-lg font-semibold">{carData.brand} {carData.model}</h2>
//                             <p className="text-xl font-bold text-gray-800">₹{carData.pricePerDay.toLocaleString('en-IN')} / day</p>
//                         </div>
//                     </section>

//                     <section>
//                         <h2 className="text-xl font-semibold mb-4 border-b pb-2">Your Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
//                             <div className='flex items-center gap-3 bg-slate-100 p-3 rounded-md border border-slate-200'>
//                                 <Image
//                                     src={session.user.image || guest}
//                                     alt="User profile"
//                                     width={32} height={32}
//                                     className='rounded-full object-cover'
//                                 />
//                                 <div>
//                                     <label className="block text-xs font-medium text-gray-500">Name</label>
//                                     <p className="text-gray-800 font-medium text-sm">{session.user.name || 'N/A'}</p>
//                                 </div>
//                             </div>
//                             <div className='bg-slate-100 p-3 rounded-md border border-slate-200'>
//                                 <label className="block text-xs font-medium text-gray-500">Email</label>
//                                 <p className="text-gray-800 font-medium text-sm">{session.user.email || 'N/A'}</p>
//                             </div>
//                             <div>
//                                 <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                                 <input
//                                     type="tel"
//                                     id="phoneNumber"
//                                     name="phoneNumber"
//                                     value={phoneNumber}
//                                     onChange={(e) => setPhoneNumber(e.target.value)}
//                                     required
//                                     className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
//                                     placeholder="Your mobile number"
//                                 />
//                             </div>
//                         </div>

//                         <h3 className="text-md font-semibold mb-2 text-gray-700 mt-4">Delivery Address</h3>
//                         <div className="grid grid-cols-1 gap-4">
//                             <div>
//                                 <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
//                                 <input type="text" id="addressLine1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" placeholder="Street Address, P.O. Box" />
//                             </div>
//                             <div>
//                                 <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 <span className='text-xs text-gray-500'>(Optional)</span></label>
//                                 <input type="text" id="addressLine2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" placeholder="Apartment, Suite, Unit, Building" />
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                             <div>
//                                 <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                                 <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" />
//                             </div>
//                             <div>
//                                 <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
//                                 <input type="text" id="postalCode" value={postalCode} onChange={e => setPostalCode(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" />
//                             </div>
//                         </div>
//                     </section>

//                     <section>
//                         <h2 className="text-xl font-semibold mb-4 border-b pb-2">Payment Method</h2>
//                         <div className="space-y-3">
//                             <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-black ring-2 ring-black bg-gray-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}>
//                                 <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-black focus:ring-black border-gray-300 mr-3" />
//                                 <CreditCard className="w-6 h-6 mr-2 text-gray-600" />
//                                 <span className="text-sm font-medium text-gray-800">Credit / Debit Card</span>
//                             </label>

//                             <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-black ring-2 ring-black bg-gray-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}>
//                                 <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="h-4 w-4 text-black focus:ring-black border-gray-300 mr-3" />
//                                 <Smartphone className="w-6 h-6 mr-2 text-gray-600" />
//                                 <span className="text-sm font-medium text-gray-800">UPI</span>
//                             </label>

//                             <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-black ring-2 ring-black bg-gray-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}>
//                                 <input type="radio" name="paymentMethod" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="h-4 w-4 text-black focus:ring-black border-gray-300 mr-3" />
//                                 <Landmark className="w-6 h-6 mr-2 text-gray-600" />
//                                 <span className="text-sm font-medium text-gray-800">Net Banking</span>
//                             </label>
//                         </div>

//                         {paymentMethod === 'card' && (
//                              <div className="mt-6 p-4 border border-red-300 bg-red-50 rounded-lg">
//                                 <p className="text-sm text-red-700 font-medium mb-3 flex items-center gap-2">
//                                     <Lock size={14} /> **Security Note:** This is a placeholder. Integrate a secure Payment Gateway (e.g., Stripe, Razorpay) here. Do not handle raw card data directly.
//                                 </p>
//                                 <div className="space-y-3">
//                                     <div>
//                                         <label className="block text-xs font-medium text-gray-700 mb-1">Card Number (Placeholder)</label>
//                                         <input type="text" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="---- ---- ---- ----"/>
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block text-xs font-medium text-gray-700 mb-1">Expiry (Placeholder)</label>
//                                             <input type="text" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="MM / YY"/>
//                                         </div>
//                                         <div>
//                                             <label className="block text-xs font-medium text-gray-700 mb-1">CVC (Placeholder)</label>
//                                             <input type="text" value={cvc} onChange={e=>setCvc(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="---"/>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </section>

//                     <div className="pt-4">
//                         {submitError && (
//                             <p className="text-sm text-red-600 mb-4 text-center">{submitError}</p>
//                         )}
//                         <button
//                             type="submit"
//                             disabled={isSubmitting || !paymentMethod}
//                             className="w-full flex justify-center items-center gap-2 bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
//                         >
//                             {isSubmitting ? (
//                                 <> <Loader2 className="h-5 w-5 animate-spin" /> Processing Rental... </>
//                             ) : ( 'Proceed to Payment / Confirm' )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         );
//     }

//     return <div className="container mx-auto px-4 py-8 pt-28 text-center">An unexpected error occurred.</div>;
// };

// export default RentCarPage;


"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import {
    Loader2, Lock, ArrowLeft, CreditCard, Landmark, Smartphone
} from 'lucide-react';

import { allCarsDetailData } from '@/data/carData';
import { CarDetail } from '@/types';
import guest from "@/assets/images/guest.png";

const RentCarPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const carId = params.carId as string;
    const { data: session, status } = useSession();
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
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
        if (status !== 'loading') {
            if (status === 'unauthenticated') {
                console.log("User not authenticated, redirecting to sign in...");
                signIn(undefined, { callbackUrl: `/rent/${carId}` });
            } else if (status === 'authenticated') {
                if (session?.user?.mobileNumber && !phoneNumber) {
                    setPhoneNumber(session.user.mobileNumber);
                }
            }
        }
    }, [status, carId, session, phoneNumber]);

    useEffect(() => {
        if (carId && carData === null && status !== 'loading') {
            setIsNotFoundState(true);
        } else {
            setIsNotFoundState(false);
        }
    }, [carId, carData, status]);

    useEffect(() => {
        if (isNotFoundState) {
            notFound();
        }
    }, [isNotFoundState]);

    


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        if (!session?.user?.id) {
            setSubmitError("Your session seems to be invalid. Please log in again.");
            setIsSubmitting(false);
            signIn(undefined, { callbackUrl: `/rent/${carId}` });
            return;
        }

        if (!paymentMethod) {
            setSubmitError("Please select a payment method.");
            setIsSubmitting(false);
            return;
        }


        console.log("Frontend: Preparing to submit rental request to API...");

        try {
            const response = await fetch('/rent/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId: carData?.id,
                    address: { addressLine1, addressLine2, city, postalCode },
                    phoneNumber,
                    paymentMethod,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Server error: ${response.statusText} (Status: ${response.status})`);
            }

            console.log("Frontend: API Call Successful. Booking initiated:", result);

            router.push(`/rent/confirmation?bookingId=${result.bookingId}&carId=${carData?.id}&carModel=${encodeURIComponent(carData?.model || 'Unknown Car')}`);

        } catch (error) {
            console.error("Frontend: Rental Submission Error:", error);
            setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred during submission. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading' || (carId && !carData && !isNotFoundState)) {
        return (
            <div className="flex justify-center items-center min-h-screen pt-20">
                <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
                <span className="ml-4 text-gray-500 font-medium">Loading Rental Details...</span>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-semibold mb-4">Authentication Required</h1>
                <p className="mb-6 text-gray-600">You need to be logged in to rent a car.</p>
                <button
                    onClick={() => signIn(undefined, { callbackUrl: `/rent/${carId}` })}
                    className="bg-black text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    Log In or Sign Up
                </button>
            </div>
        );
    }

    if (status === 'authenticated' && carData && session?.user) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <Link href={`/dashboard/cars/${carId}`} className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors">
                        <ArrowLeft size={16} />
                        Back to Car Details
                    </Link>
                </div>

                <h1 className="text-3xl font-bold mb-8 text-gray-900">Rent: {carData.brand} {carData.model}</h1>

                <form onSubmit={handleSubmit} className="space-y-8">

                    <section className="bg-gray-50 p-4 rounded-lg border flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-32 h-20 sm:w-24 sm:h-16 flex-shrink-0 rounded overflow-hidden shadow-sm">
                            <Image
                                src={carData.image}
                                alt={`${carData.brand} ${carData.model}`}
                                layout="fill"
                                objectFit="cover"
                                priority
                            />
                        </div>
                        <div className='text-center sm:text-left'>
                            <h2 className="text-lg font-semibold">{carData.brand} {carData.model}</h2>
                            <p className="text-xl font-bold text-gray-800">₹{carData.pricePerDay.toLocaleString('en-IN')} / day</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Your Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                            <div className='flex items-center gap-3 bg-slate-100 p-3 rounded-md border border-slate-200'>
                                <Image
                                    src={session.user.image || guest}
                                    alt="User profile"
                                    width={32} height={32}
                                    className='rounded-full object-cover'
                                />
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Name</label>
                                    <p className="text-gray-800 font-medium text-sm">{session.user.name || 'N/A'}</p>
                                </div>
                            </div>
                            <div className='bg-slate-100 p-3 rounded-md border border-slate-200'>
                                <label className="block text-xs font-medium text-gray-500">Email</label>
                                <p className="text-gray-800 font-medium text-sm">{session.user.email || 'N/A'}</p>
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                    pattern="^(?:\+91)?\s?\d{10}$"
                                    title="Enter a 10-digit Indian number (e.g., 9876543210 or +919876543210)"
                                    maxLength={14}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="10-digit mobile number"
                                />
                            </div>
                        </div>

                        <h3 className="text-md font-semibold mb-2 text-gray-700 mt-4">Delivery Address</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                <input type="text" id="addressLine1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" placeholder="Street Address, P.O. Box" />
                            </div>
                            <div>
                                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 <span className='text-xs text-gray-500'>(Optional)</span></label>
                                <input type="text" id="addressLine2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" placeholder="Apartment, Suite, Unit, Building" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" placeholder="Your City" />
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    value={postalCode}
                                    onChange={e => setPostalCode(e.target.value)}
                                    required
                                    pattern="\d{6}"
                                    title="Enter a 6-digit postal code"
                                    maxLength={6}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="6-digit Pincode"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Payment Method</h2>
                        <div className="space-y-3">
                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-black ring-2 ring-black bg-gray-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}>
                                <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-black focus:ring-black border-gray-300 mr-3" />
                                <CreditCard className="w-6 h-6 mr-2 text-gray-600" />
                                <span className="text-sm font-medium text-gray-800">Credit / Debit Card</span>
                            </label>

                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-black ring-2 ring-black bg-gray-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}>
                                <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="h-4 w-4 text-black focus:ring-black border-gray-300 mr-3" />
                                <Smartphone className="w-6 h-6 mr-2 text-gray-600" />
                                <span className="text-sm font-medium text-gray-800">UPI</span>
                            </label>

                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-black ring-2 ring-black bg-gray-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}>
                                <input type="radio" name="paymentMethod" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="h-4 w-4 text-black focus:ring-black border-gray-300 mr-3" />
                                <Landmark className="w-6 h-6 mr-2 text-gray-600" />
                                <span className="text-sm font-medium text-gray-800">Net Banking</span>
                            </label>
                        </div>

                        {/* Placeholder Card Details */}
                        {paymentMethod === 'card' && (
                             <div className="mt-6 p-4 border border-yellow-400 bg-yellow-50 rounded-lg">
                                <p className="text-sm text-yellow-800 font-medium mb-3 flex items-center gap-2">
                                    <Lock size={14} /> **Security Notice:** Card input below is for demonstration only. Do <span className="font-bold">NOT</span> enter real card details. Integrate a secure Payment Gateway (e.g., Stripe, Razorpay) for actual payments.
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Card Number (Demo)</label>
                                        <input type="text" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="---- ---- ---- ----" autoComplete="cc-number" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Expiry (Demo)</label>
                                            <input type="text" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="MM / YY" autoComplete="cc-exp"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">CVC (Demo)</label>
                                            <input type="text" value={cvc} onChange={e=>setCvc(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="---" autoComplete="cc-csc"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <div className="pt-4">
                        {submitError && (
                            <p className="text-sm text-red-600 mb-4 text-center p-3 bg-red-50 border border-red-200 rounded-md">{submitError}</p>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting || !paymentMethod || status !== 'authenticated'}
                            className="w-full flex justify-center items-center gap-2 bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <> <Loader2 className="h-5 w-5 animate-spin" /> Processing Rental... </>
                            ) : ( 'Proceed to Payment / Confirm' )}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 text-center">
             <p>Something went wrong while loading the rental page.</p>
             <p className='mt-2 text-sm text-gray-600'>If the problem persists, please contact support.</p>
        </div>
       );
};

export default RentCarPage;