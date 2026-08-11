//src/pages/ConfirmOrder.tsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import error from '../assets/error.png';
import success from '../assets/success.png';
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import api from '../api/api';

const load = async (): Promise<Stripe | null> => {
  return await loadStripe(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY
  );
};

const ConfirmOrder: React.FC = () => {
  const [loader, setLoader] = useState<boolean>(true);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then((result) => {
      if (result.paymentIntent) {
        switch (result.paymentIntent.status) {
          case 'succeeded':
            setMessage('succeeded');
            break;
          case 'processing':
            setMessage('processing');
            break;
          case 'requires_payment_method':
            setMessage('failed');
            break;
          default:
            setMessage('failed');
        }
      }
    });
  }, [stripe]);

  const get_load = async (): Promise<void> => {
    const tempStripe = await load();
    setStripe(tempStripe);
  };

  useEffect(() => {
    get_load();
  }, []);

  const update_payment = async (): Promise<void> => {
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      try {
        await api.get(`/order/confirm/${orderId}`);
        localStorage.removeItem('orderId');
        setLoader(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (message === 'succeeded') {
      update_payment();
    }
  }, [message]);

  return (
    <div className='min-h-screen w-full flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 via-gray-50 to-orange-50'>
      <div className='w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-8 sm:p-6 flex flex-col items-center text-center gap-6'>
        {/* Title */}
        <div className='w-full'>
          <h1 className='text-2xl sm:text-xl font-bold text-gray-900'>Payment Status</h1>
          <p className='text-sm text-gray-500 mt-1'>
            We are verifying your payment. Please do not close this page.
          </p>
        </div>

        {/* Body */}
        {message === 'failed' || message === 'processing' ? (
          <>
            <img
              src={error}
              alt="Payment failed"
              className='w-28 h-28 sm:w-24 sm:h-24 object-contain'
            />

            <div className='w-full rounded-xl bg-red-50 border border-red-200 px-4 py-3'>
              <p className='text-sm font-semibold text-red-700'>
                {message === 'processing'
                  ? 'Your payment is still processing. Please check your orders later.'
                  : 'Payment failed. Please try again or use another payment method.'}
              </p>
            </div>

            <Link
              className='w-full sm:w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold shadow-lg'
              to="/dashboard/my-orders"
            >
              Back to Dashboard
            </Link>
          </>
        ) : message === 'succeeded' ? (
          loader ? (
            <div className='py-6'>
              <FadeLoader />
              <p className='text-sm text-gray-600 mt-6'>Confirming your order...</p>
            </div>
          ) : (
            <>
              <img
                src={success}
                alt="Payment succeeded"
                className='w-28 h-28 sm:w-24 sm:h-24 object-contain'
              />

              <div className='w-full rounded-xl bg-green-50 border border-green-200 px-4 py-3'>
                <p className='text-sm font-semibold text-green-700'>
                  Payment successful. Your order has been confirmed.
                </p>
              </div>

              <Link
                className='w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold shadow-lg'
                to="/dashboard/my-orders"
              >
                Back to Dashboard
              </Link>
            </>
          )
        ) : (
          <div className='py-6'>
            <FadeLoader />
            <p className='text-sm text-gray-600 mt-6'>Checking payment status...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmOrder;
