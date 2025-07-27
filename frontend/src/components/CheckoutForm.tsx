//src/components/CheckoutForm.tsx
import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { 
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements 
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  orderId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ orderId }) => {
  localStorage.setItem('orderId', orderId);
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const paymentElementOptions = {
    layout: 'tabs' as const
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3001/order/confirm'
      }
    });
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || null);
    } else {
      setMessage('An Unexpected error occured'); // Note: keeping the typo from JSX (should be 'occurred')
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={submit} id='payment-form'>
      <LinkAuthenticationElement id='link-authentication-element' />
      <PaymentElement id='payment-element' options={paymentElementOptions} />

      <button 
        disabled={isLoading || !stripe || !elements} 
        id='submit' 
        className='px-10 py-[6px] rounded-sm hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white'
      >
        <span id='button-text'>
          {
            isLoading ? <div>Loading...</div> : "Pay Now"
          }
        </span>
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default CheckoutForm;//modificat