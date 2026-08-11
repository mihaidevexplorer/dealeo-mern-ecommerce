//src/components/Stripe.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import api from '../api/api';
import CheckoutForm from './CheckoutForm';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeProps {
  price: number;
  orderId: string;
}

interface PaymentIntentResponse {
  clientSecret: string;
}

const Stripe: React.FC<StripeProps> = ({ price, orderId }) => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#10b981',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
      fontSizeBase: '16px',
    },
    rules: {
      '.Input': {
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
      },
      '.Input:hover': {
        borderColor: '#10b981',
      },
      '.Input:focus': {
        borderColor: '#10b981',
        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
      },
      '.Label': {
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '6px',
        color: '#374151',
      },
      '.Error': {
        fontSize: '14px',
        color: '#ef4444',
        marginTop: '4px',
      },
    },
  };

  const options: StripeElementsOptions = {
    appearance,
    clientSecret,
  };

const create_payment = async (): Promise<void> => {
  setIsLoading(true);
  try {
    const { data } = await api.post<PaymentIntentResponse>(
      '/order/create-payment',
      { price },
      { withCredentials: true }
    );
    setClientSecret(data.clientSecret);
  } catch (error) {
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className='mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg'>
      <div className='mb-4'>
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>Payment Details</h3>
        <div className='flex items-center justify-between p-3 bg-white rounded-lg shadow-sm'>
          <span className='text-gray-600 font-medium'>Total Amount:</span>
          <span className='text-2xl font-bold text-gray-800'>
            ${(price / 100).toFixed(2)}
          </span>
        </div>
      </div>
      
      {clientSecret ? (
        <div className='transition-all duration-300 ease-out opacity-100 transform translate-y-0'>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        </div>
      ) : (
        <div className='flex flex-col items-center'>
          <button
            onClick={create_payment}
            disabled={isLoading}
            className={`
              relative overflow-hidden
              px-12 py-4 
              rounded-lg 
              font-semibold text-white
              transform transition-all duration-300 ease-out
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 hover:shadow-xl'
              }
              focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-30
              active:scale-95
            `}
          >
            <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Start Secure Payment
            </span>
            
            {isLoading && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
          </button>
          
          <div className='mt-4 flex items-center gap-2 text-sm text-gray-500'>
            <svg className='w-4 h-4' fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure payment powered by Stripe</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stripe;
