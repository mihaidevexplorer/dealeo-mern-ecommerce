//src\views\seller\Payments.jsx
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';
import { MdCurrencyExchange } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { get_seller_payment_details, messageClear, send_withdrowal_request } from '../../store/Reducers/PaymentReducer';
import toast from 'react-hot-toast';
import moment from 'moment';

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} {...props} />
));
outerElementType.displayName = "OuterElementType";

const Payments = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const {
        successMessage,
        errorMessage,
        loader,
        pendingWithdrows,
        successWithdrows,
        totalAmount,
        withdrowAmount,
        pendingAmount,
        availableAmount,
    } = useSelector(state => state.payment);

    const [amount, setAmount] = useState(0);

    const sendRequest = (e) => {
        e.preventDefault();
        if (availableAmount - amount > 10) {
            dispatch(send_withdrowal_request({ amount, sellerId: userInfo._id }));
            setAmount(0);
        } else {
            toast.error('Insufficient Balance');
        }
    };

    const Row = ({ index, style }) => (
        <div style={style} className="flex text-sm text-white font-medium">
            <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
            <div className="w-[25%] p-2 whitespace-nowrap">${pendingWithdrows[index]?.amount}</div>
            <div className="w-[25%] p-2 whitespace-nowrap">
                <span className="py-[1px] px-[5px] bg-slate-300 text-blue-500 rounded-md text-sm">{pendingWithdrows[index]?.status}</span>
            </div>
            <div className="w-[25%] p-2 whitespace-nowrap">
                {moment(pendingWithdrows[index]?.createdAt).format('LL')}
            </div>
        </div>
    );
    Row.propTypes = {
        index: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired
    };
    

    const Rows = ({ index, style }) => (
        <div style={style} className="flex text-sm text-white font-medium">
            <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
            <div className="w-[25%] p-2 whitespace-nowrap">${pendingWithdrows[index]?.amount}</div>
            <div className="w-[25%] p-2 whitespace-nowrap">
                <span className="py-[1px] px-[5px] bg-slate-300 text-blue-500 rounded-md text-sm">{successWithdrows[index]?.status}</span>
            </div>
            <div className="w-[25%] p-2 whitespace-nowrap">
            {moment(pendingWithdrows[index]?.createdAt).format('LL')}
            </div>
        </div>
    );
    Rows.propTypes = {
        index: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired
    };

   

    useEffect(() => {
        dispatch(get_seller_payment_details(userInfo._id));
    }, [dispatch, userInfo]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <div className="px-2 md:px-7 py-5">
            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-5">
                {[
                    { label: "Total Sales", value: totalAmount, bg: "bg-gradient-to-r from-pink-500 to-red-400" },
                    { label: "Available Amount", value: availableAmount, bg: "bg-gradient-to-r from-purple-400 to-indigo-600" },
                    { label: "Withdrawal Amount", value: withdrowAmount, bg: "bg-gradient-to-r from-green-400 to-teal-500" },
                    { label: "Pending Amount", value: pendingAmount, bg: "bg-gradient-to-r from-blue-400 to-cyan-500" },
                ].map((card, index) => (
                    <div key={index} className={`p-5 rounded-xl shadow-md flex justify-between items-center text-white ${card.bg}`}>
                        <div>
                            <h2 className="text-2xl font-bold">${card.value}</h2>
                            <p className="text-sm font-medium">{card.label}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                            <MdCurrencyExchange />
                        </div>
                    </div>
                ))}
            </div>

            {/* Request and Lists Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Send Request */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Send Request</h2>
                    <form onSubmit={sendRequest} className="flex gap-4 items-center">
                        <input
                            type="number"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-3/4 p-3 rounded-md bg-indigo-600 text-white border border-indigo-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loader}
                            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-md font-medium"
                        >
                            {loader ? "Loading..." : "Submit"}
                        </button>
                    </form>
                </div>

                {/* Pending Requests */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-lg text-white shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Pending Requests</h2>
                    <div className="overflow-x-auto">
                        <div className="flex bg-blue-700 text-xs font-bold rounded-md p-2">
                            <div className="w-1/4">No</div>
                            <div className="w-1/4">Amount</div>
                            <div className="w-1/4">Status</div>
                            <div className="w-1/4">Date</div>
                        </div>
                        <List
                            className="List mt-2"
                            height={300}
                            itemCount={pendingWithdrows.length}
                            itemSize={40}
                            outerElementType={outerElementType}
                        >
                            {Row}
                        </List>
                    </div>
                </div>
            </div>
        </div>
    );
    
};


export default Payments;
