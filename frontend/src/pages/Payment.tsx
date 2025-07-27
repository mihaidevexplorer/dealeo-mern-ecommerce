//src/pages/Payment.tsx
import { useState } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import Stripe from '../components/Stripe';

// Define the interface for location state
interface PaymentLocationState {
  price: number;
  items: number;
  orderId: string;
}

const Payment = () => {
    const { state: {price, items, orderId} } = useLocation() as { state: PaymentLocationState };
    const [paymentMethod, setPaymentMethod] = useState('stripe')
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
           <Header/>
           
    <section className='py-12'>
        <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto'>
            {/* Page Header */}
            <div className='mb-8 text-center'>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Complete Your Order</h1>
                <p className='text-gray-600'>Choose your preferred payment method</p>
            </div>
            
            <div className='flex flex-wrap md:flex-col-reverse gap-8'>
                {/* Payment Methods Section */}
                <div className='w-7/12 md:w-full'>
                    <div className='bg-white rounded-2xl shadow-lg p-6'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center'>
                            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Payment Method
                        </h2>
                        
                        <div className='grid grid-cols-2 gap-4 mb-6'>
                            {/* Stripe Option */}
                            <div 
                                onClick={() => setPaymentMethod('stripe')} 
                                className={`relative cursor-pointer rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                                    paymentMethod === 'stripe' 
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 shadow-lg' 
                                    : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {paymentMethod === 'stripe' && (
                                    <div className='absolute top-2 right-2'>
                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                <div className='flex flex-col items-center gap-3'>
                                    <div className='w-20 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center'>
                                        <img src="http://localhost:3001/images/paymentstripe/stripe.png" alt="Stripe" className='w-16 h-16 object-contain' />
                                    </div>
                                    <div>
                                        <span className='text-gray-800 font-semibold block'>Stripe</span>
                                        <span className='text-sm text-gray-500'>Cards, wallets & more</span>
                                    </div>
                                </div>
                            </div>

                            {/* COD Option */}
                            <div 
                                onClick={() => setPaymentMethod('cod')} 
                                className={`relative cursor-pointer rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                                    paymentMethod === 'cod' 
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 shadow-lg' 
                                    : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {paymentMethod === 'cod' && (
                                    <div className='absolute top-2 right-2'>
                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                <div className='flex flex-col items-center gap-3'>
                                    <div className='w-20 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center'>
                                        <img src="http://localhost:3001/images/paymentstripe/cod.jpg" alt="COD" className='w-16 h-16 object-contain' />
                                    </div>
                                    <div>
                                        <span className='text-gray-800 font-semibold block'>Cash on Delivery</span>
                                        <span className='text-sm text-gray-500'>Pay when you receive</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form Area */}
                        <div className='mt-6'>
                            {paymentMethod === 'stripe' && (
                                <div className='transition-opacity duration-300'>
                                    <Stripe orderId={orderId} price={price} />
                                </div>
                            )}
                            
                            {paymentMethod === 'cod' && (
                                <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 transition-opacity duration-300'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className='text-lg font-semibold text-gray-800'>Cash on Delivery Selected</h3>
                                    </div>
                                    <p className='text-gray-600 mb-6'>You can pay in cash when your order is delivered to your doorstep.</p>
                                    <button 
                                        onClick={() => navigate(`/order/success/${orderId}`)}
                                        className='w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl'>
                                        Complete Order
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className='w-5/12 md:w-full'>
                    <div className='bg-white rounded-2xl shadow-lg p-6 sticky top-4'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center'>
                            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Order Summary
                        </h2>
                        
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center pb-4 border-b border-gray-200'>
                                <div>
                                    <span className='text-gray-600 block'>{items} Items</span>
                                    <span className='text-sm text-gray-500'>Shipping included</span>
                                </div>
                                <span className='text-xl font-semibold text-gray-800'>${price}</span>
                            </div>
                            
                            <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-lg font-bold text-gray-800'>Total Amount</span>
                                    <span className='text-2xl font-bold text-green-600'>${price}</span>
                                </div>
                            </div>
                            
                            <div className='pt-4'>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Secure payment</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm text-gray-600 mt-2'>
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>Money-back guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

           <Footer/>
        </div>
    );
};

export default Payment;