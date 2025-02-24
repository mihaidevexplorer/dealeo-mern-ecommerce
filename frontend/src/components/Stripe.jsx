//src/components/Stripe.jsx
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js' 
import { Elements } from '@stripe/react-stripe-js' 
import axios from 'axios';
import CheckoutForm from './CheckoutForm';
const stripePromise = loadStripe('pk_test_51Q8QW6RoWms6BcWGoEL8utd5m6uQsqeyhaB1sIIrwneJiYDsIrCeBVx0cJCQqc5ZEKT2Na7HFFA0yj6UWEUGZfdN00DbPnH5zh')

const Stripe = ({ price, orderId }) => {
    const [clientSecret, setClientSecret] = useState('')
    const appearance = {
        theme: 'stripe'
    }
    const options = {
        appearance,
        clientSecret
    }

    const create_payment = async () => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/order/create-payment',{price},{withCredentials:true})
            setClientSecret(data.clientSecret)
        } catch (error) {
            console.log(error.response.data)
        }
    }

    return (
        <div className='mt-4'>
            {
                clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm orderId={orderId} />
                    </Elements>
                ) : <button onClick={create_payment} className='px-10 py-[6px] rounded-sm hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white'>Start Payment</button>
            }
        </div>
    );
}; 

export default Stripe;