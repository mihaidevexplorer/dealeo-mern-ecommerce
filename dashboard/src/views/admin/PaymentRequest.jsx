//src\views\admin\PaymentRequest.jsx
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { confirm_payment_request, get_payment_request,messageClear } from '../../store/Reducers/PaymentReducer';
import moment from 'moment';
import toast from 'react-hot-toast';

function handleOnWheel({ deltaY }) {
    console.log('handleOnWheel',deltaY)
}

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} /> 
 ));
 outerElementType.displayName = "OuterElementType";
 
const PaymentRequest = () => {

    const dispatch = useDispatch()
    const {successMessage, errorMessage, pendingWithdrows,loader } = useSelector(state => state.payment)
    const [paymentId, setPaymentId] = useState('')

    useEffect(() => { 
        dispatch(get_payment_request())
    },[])

    const confirm_request = (id) => {
        setPaymentId(id)
        dispatch(confirm_payment_request(id))
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    },[successMessage,errorMessage])
     

    const Row = ({ index, style }) => {
        return (
        <div style={style} className='flex text-sm text-white font-medium'>
        <div className='w-[25%] p-2 whitespace-nowrap'>{index + 1}</div>
        <div className='w-[25%] p-2 whitespace-nowrap'>${pendingWithdrows[index]?.amount}</div>
        <div className='w-[25%] p-2 whitespace-nowrap'>
            <span className='py-[1px] px-[5px] bg-gray-300 text-blue-500 rounded-md text-sm'>{pendingWithdrows[index]?.status}</span>
         </div>
        <div className='w-[25%] p-2 whitespace-nowrap'> {moment(pendingWithdrows[index]?.createdAt).format('LL')} </div>
        <div className='w-[25%] p-2 whitespace-nowrap'>
            
            <button disabled={loader} onClick={() => confirm_request(pendingWithdrows[index]?._id)} className='bg-red-500 shadow-lg hover:shadow-red-500/50 px-3 py-[2px cursor-pointer text-white rounded-sm text-sm]'>{(loader && paymentId === pendingWithdrows[index]?._id) ? 'loading..' : 'Confirm'}</button>
        </div>

            </div>
        )
        
    }
    Row.propTypes = {
        index: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired
    };





    return (
<div className='px-4 lg:px-8 pt-6'>
    <div className='w-full p-6 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-xl shadow-lg'>
        <h2 className='text-2xl font-semibold pb-5 text-white'>Withdrawal Request</h2>
        <div className='w-full'>
            <div className='w-full overflow-x-auto'>
                <div className='flex bg-gray-700 text-white uppercase text-xs font-bold min-w-[340px] rounded-lg p-2 shadow-md'>
                    <div className='w-[25%] p-2'> No </div>
                    <div className='w-[25%] p-2'> Amount </div>
                    <div className='w-[25%] p-2'> Status </div>
                    <div className='w-[25%] p-2'> Date </div>
                    <div className='w-[25%] p-2'> Action </div> 
                </div>
                {
                    <List
                    style={{ minWidth : '340px'}}
                    className='List'
                    height={350}
                    itemCount={pendingWithdrows.length}
                    itemSize={35}
                    outerElementType={outerElementType}                    
                    >
                        {Row}

                    </List>
                }

            </div>

        </div>

    </div>
    
</div>
    );
};

export default PaymentRequest;