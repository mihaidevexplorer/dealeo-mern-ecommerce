//src/pages/ConfirmOrder.tsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import error from '../assets/error.png';
import success from '../assets/success.png';
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import axios from 'axios';

const load = async (): Promise<Stripe | null> => {
    return await loadStripe('pk_test_51Q8QW6RoWms6BcWGoEL8utd5m6uQsqeyhaB1sIIrwneJiYDsIrCeBVx0cJCQqc5ZEKT2Na7HFFA0yj6UWEUGZfdN00DbPnH5zh');
}

const ConfirmOrder: React.FC = () => {
    const [loader, setLoader] = useState<boolean>(true);
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!stripe) {
            return;
        }
        const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
        if (!clientSecret) {
            return;
        }
        stripe.retrievePaymentIntent(clientSecret).then((result) => {
            if (result.paymentIntent) {
                switch(result.paymentIntent.status){
                    case "succeeded":
                        setMessage('succeeded');
                        break;
                    case "processing":
                        setMessage('processing');
                        break;
                    case "requires_payment_method":
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
    }
    
    useEffect(() => {
        get_load();
    }, []);

    const update_payment = async (): Promise<void> => {
        const orderId = localStorage.getItem('orderId');
        if (orderId) {
            try {
                await axios.get(`http://localhost:5000/api/order/confirm/${orderId}`);
                localStorage.removeItem('orderId');
                setLoader(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(error.response?.data);
                } else {
                    console.log('An unexpected error occurred');
                }
            }
        }
    }

    useEffect(() => {
        if (message === 'succeeded') {
            update_payment();
        }
    }, [message]);

    return (
        <div className='w-screen h-screen flex justify-center items-center flex-col gap-4'>
            {
                (message === 'failed' || message === 'processing') ? (
                    <>
                        <img src={error} alt="" />
                        <Link className='px-5 py-2 bg-orange-500 rounded-sm text-white' to="/dashboard/my-orders">
                            Back to Dashboard
                        </Link>
                    </>
                ) : message === 'succeeded' ? (
                    loader ? (
                        <FadeLoader />
                    ) : (
                        <>
                            <img src={success} alt="" />
                            <Link className='px-5 py-2 bg-orange-500 rounded-sm text-white' to="/dashboard/my-orders">
                                Back to Dashboard
                            </Link>
                        </>
                    )
                ) : (
                    <FadeLoader />
                )
            }
        </div>
    );
};

export default ConfirmOrder;//modificat