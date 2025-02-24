//src\views\seller\OrderDetails.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller_order, messageClear, seller_order_status_update } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('');

  const { order, errorMessage, successMessage } = useSelector((state) => state.order);

  useEffect(() => {
    setStatus(order?.delivery_status);
  }, [order]);

  useEffect(() => {
    dispatch(get_seller_order(orderId));
  }, [orderId]);

  const status_update = (e) => {
    dispatch(seller_order_status_update({ orderId, info: { status: e.target.value } }));
    setStatus(e.target.value);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="px-4 lg:px-10 py-6">
      {/* Gradient Background */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold drop-shadow-md">Order Details</h2>
          <select
            onChange={status_update}
            value={status}
            className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="warehouse">Warehouse</option>
            <option value="placed">Placed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Order Information */}
        <div className="bg-white rounded-lg p-8 text-gray-800 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Order ID: #{order._id}</h2>
            <span className="text-sm text-gray-500">{order.date}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
              <p className="text-gray-700 mb-2">{order.shippingInfo}</p>
              <div className="mt-4 text-sm">
                <p>
                  <strong>Payment Status:</strong> {order.payment_status}
                </p>
                <p>
                  <strong>Total Price:</strong> ${order.price}
                </p>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Products</h3>
              <div className="space-y-6">
                {order?.products?.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      className="w-20 h-20 object-cover rounded-lg"
                      src={p.images[0]}
                      alt={p.name}
                    />
                    <div>
                      <h4 className="text-lg font-semibold">{p.name}</h4>
                      <p className="text-sm text-gray-600">
                        <strong>Brand:</strong> {p.brand}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Quantity:</strong> {p.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

