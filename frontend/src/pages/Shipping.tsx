//src/pages/Shipping.tsx
import { useState, type ChangeEvent, type FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { usePlaceOrder } from '../hooks/useOrder';
import { useAuthState } from '../hooks/useAuth';

interface ShippingProduct {
  shopName: string;
  products: Array<{
    productInfo: {
      _id?: string;
      images: string[];
      name: string;
      brand: string;
      price: number;
      discount: number;
      category?: string;
    };
    quantity?: number;
  }>;
}

interface ShippingLocationState {
  products: ShippingProduct[];
  price: number;
  shipping_fee: number;
  items: number;
}

type ShippingFormState = {
  name: string;
  address: string;
  phone: string;
  post: string;
  province: string;
  city: string;
  area: string;
};

const Shipping: React.FC = () => {
  const { state } = useLocation() as { state: ShippingLocationState | null };
  const placeOrderMutation = usePlaceOrder();
  const navigate = useNavigate();
  const { userInfo } = useAuthState();

  const [res, setRes] = useState<boolean>(false);
  const [shippingState, setShippingState] = useState<ShippingFormState>({
    name: '',
    address: '',
    phone: '',
    post: '',
    province: '',
    city: '',
    area: ''
  });

  if (!state) {
    return (
      <div>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No shipping data found</h2>
            <p className="text-gray-500 mb-4">Please go back to cart and try again.</p>
            <Link
              to="/cart"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Cart
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { products, price, shipping_fee, items } = state;

  const inputHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setShippingState({
      ...shippingState,
      [e.target.name]: e.target.value
    });
  };

  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, address, phone, post, province, city, area } = shippingState;
    if (name && address && phone && post && province && city && area) {
      setRes(true);
    }
  };

  const placeOrder = () => {
    if (!userInfo?.id) {
      alert('Please log in to place an order.');
      navigate('/login');
      return;
    }

    if (!res) {
      alert('Please save your shipping information first');
      return;
    }

    const requiredFields: (keyof ShippingFormState)[] = [
      'name', 'address', 'phone', 'post', 'province', 'city', 'area'
    ];

    const missingFields = requiredFields.filter((f) => !shippingState[f]?.trim());
    if (missingFields.length > 0) {
      alert(`Please fill in all fields: ${missingFields.join(', ')}`);
      return;
    }

    const transformedProducts = products
      .map((shop) => {
        const sellerProducts = shop.products
          .filter((item) => item.productInfo?._id)
          .map((item) => ({
            _id: item.productInfo._id!,
            quantity: Number(item.quantity) || 1,
            productInfo: {
              _id: item.productInfo._id!,
              name: item.productInfo.name || 'Unknown Product',
              slug: (item.productInfo.name || 'unknown').toLowerCase().replace(/\s+/g, '-'),
              category: item.productInfo.category || 'General',
              brand: item.productInfo.brand || 'Unknown Brand',
              price: Number(item.productInfo.price) || 0,
              stock: 100,
              discount: Number(item.productInfo.discount) || 0,

              // IMPORTANT: ai pus un ObjectId hardcodat. Las la fel ca în codul tău.
              // Recomandarea corectă: să vină din backend (sellerId real).
              sellerId: '66e9938219376cf9261704ba',
              shopName: shop.shopName || 'Unknown Shop',
              images: Array.isArray(item.productInfo.images) ? item.productInfo.images : []
            }
          }));

        const sellerPrice = sellerProducts.reduce((total, product) => {
          const originalPrice = Number(product.productInfo.price) || 0;
          const discount = Number(product.productInfo.discount) || 0;
          const quantity = Number(product.quantity) || 1;
          const discountAmount = Math.floor((originalPrice * discount) / 100);
          const finalPrice = originalPrice - discountAmount;
          return total + (finalPrice * quantity);
        }, 0);

        return {
          sellerId: '66e9938219376cf9261704ba',
          shopName: shop.shopName || 'Unknown Shop',
          price: Number(sellerPrice.toFixed(2)),
          products: sellerProducts
        };
      })
      .filter((seller) => seller.products.length > 0);

    const totalProductPrice = transformedProducts.reduce((total, seller) => total + seller.price, 0);

    const totalItems = transformedProducts.reduce(
      (total, seller) =>
        total + seller.products.reduce((sellerTotal, product) => sellerTotal + product.quantity, 0),
      0
    );

    if (transformedProducts.length === 0) {
      alert('No valid products found in your order');
      return;
    }

    if (totalProductPrice <= 0) {
      alert('Invalid order total');
      return;
    }

    placeOrderMutation.mutate({
      price: Number(totalProductPrice.toFixed(2)),
      products: transformedProducts,
      shipping_fee: Number(shipping_fee) || 0,
      shippingInfo: {
        name: shippingState.name.trim(),
        address: shippingState.address.trim(),
        phone: shippingState.phone.trim(),
        post: shippingState.post?.trim(),
        province: shippingState.province?.trim(),
        city: shippingState.city.trim(),
        area: shippingState.area?.trim()
      },
      userId: { id: userInfo.id },
      items: totalItems,
      navigate
    });
  };

  return (
    <div>
      <Header />

      <section className='bg-[url("/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>Shipping Page</h2>
              <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/'>Home</Link>
                <span className='pt-1'><IoIosArrowForward /></span>
                <span>Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-[#eeeeee]'>
        <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16'>
          <div className='w-full flex flex-wrap'>
            {/* Left */}
            <div className='w-[67%] md-lg:w-full'>
              <div className='flex flex-col gap-3'>
                <div className='bg-white p-6 shadow-sm rounded-md'>
                  <h2 className='text-slate-600 font-bold pb-3'>Shipping Information</h2>

                  {!res ? (
                    <form onSubmit={save}>
                      <div className='flex md:flex-col md:gap-2 w-full gap-5 text-gray-600'>
                        <div className='flex flex-col gap-1 mb-2 w-full'>
                          <label htmlFor="name">Name</label>
                          <input
                            onChange={inputHandle}
                            value={shippingState.name}
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                            name="name"
                            id="name"
                            placeholder='Name'
                          />
                        </div>

                        <div className='flex flex-col gap-1 mb-2 w-full'>
                          <label htmlFor="address">Address</label>
                          <input
                            onChange={inputHandle}
                            value={shippingState.address}
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                            name="address"
                            id="address"
                            placeholder='Address'
                          />
                        </div>
                      </div>

                      <div className='flex md:flex-col md:gap-2 w-full gap-5 text-gray-600'>
                        <div className='flex flex-col gap-1 mb-2 w-full'>
                          <label htmlFor="phone">Phone</label>
                          <input
                            onChange={inputHandle}
                            value={shippingState.phone}
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                            name="phone"
                            id="phone"
                            placeholder='Phone'
                          />
                        </div>

                        <div className='flex flex-col gap-1 mb-2 w-full'>
                          <label htmlFor="post">Post</label>
                          <input
                            onChange={inputHandle}
                            value={shippingState.post}
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                            name="post"
                            id="post"
                            placeholder='Post'
                          />
                        </div>
                      </div>

                      <div className='flex md:flex-col md:gap-2 w-full gap-5 text-gray-600'>
                        <div className='flex flex-col gap-1 mb-2 w-full'>
                          <label htmlFor="province">Province</label>
                          <input
                            onChange={inputHandle}
                            value={shippingState.province}
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                            name="province"
                            id="province"
                            placeholder='Province'
                          />
                        </div>

                        <div className='flex flex-col gap-1 mb-2 w-full'>
                          <label htmlFor="city">City</label>
                          <input
                            onChange={inputHandle}
                            value={shippingState.city}
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                            name="city"
                            id="city"
                            placeholder='City'
                          />
                        </div>
                      </div>

                      <div className='flex md:flex-col md:gap-2 w-full gap-5 text-gray-600'>
                        <div className='flex flex-col gap-1 mb-2 w-full'>
                          <label htmlFor="area">Area</label>
                          <input
                            onChange={inputHandle}
                            value={shippingState.area}
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                            name="area"
                            id="area"
                            placeholder='Area'
                          />
                        </div>

                        <div className='flex flex-col gap-1 mt-7 mb-2 w-full'>
                          <button className='px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-pink-700 hover:scale-105 hover:shadow-lg transition-all'>
                            Save Change
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className='flex flex-col gap-1'>
                      <h2 className='text-gray-600 font-semibold pb-2'>Deliver To {shippingState.name}</h2>
                      <p className='flex flex-wrap items-center gap-2'>
                        <span className='bg-blue-200 text-blue-800 text-sm font-medium px-2 py-1 rounded'>
                          Home
                        </span>
                        <span>
                          {shippingState.phone} {shippingState.address} {shippingState.province} {shippingState.city} {shippingState.area}
                        </span>
                        <span onClick={() => setRes(false)} className='text-indigo-500 cursor-pointer'>
                          Change
                        </span>
                      </p>
                      <p className='text-slate-600 text-sm'>Email To ariyan@gmail.com</p>
                    </div>
                  )}
                </div>

                {products?.map((p, i) => (
                  <div key={i} className='flex bg-white p-4 flex-col gap-2 rounded-md'>
                    <div className='flex justify-start items-center'>
                      <h2 className='text-md text-gray-600 font-bold'>{p.shopName}</h2>
                    </div>

                    {p.products?.map((pt, j) => (
                      <div key={j} className='w-full flex flex-wrap items-center py-2 border-b last:border-b-0'>
                        <div className='flex sm:w-full gap-2 w-7/12'>
                          <div className='flex gap-3 justify-start items-center'>
                            <img
                              className='w-[80px] h-[80px] object-cover rounded-md border'
                              src={pt.productInfo.images?.[0]}
                              alt={pt.productInfo.name}
                            />
                            <div className='pr-4 text-gray-600'>
                              <h2 className='text-md font-semibold'>{pt.productInfo.name}</h2>
                              <span className='text-sm'>Brand: {pt.productInfo.brand}</span>
                            </div>
                          </div>
                        </div>

                        <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                          <div className='pl-4 sm:pl-0'>
                            <h2 className='text-lg text-orange-500'>
                              ${pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100)}
                            </h2>
                            <p className='line-through text-gray-400'>${pt.productInfo.price}</p>
                            <p className='text-sm text-gray-600'>-{pt.productInfo.discount}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className='w-[33%] md-lg:w-full'>
              <div className='pl-3 md-lg:pl-0 md-lg:mt-5'>
                <div className='bg-white p-4 text-slate-600 flex flex-col gap-3 rounded-md shadow-sm'>
                  <h2 className='text-xl font-bold'>Order Summary</h2>

                  <div className='flex justify-between items-center'>
                    <span>Items Total ({items} items)</span>
                    <span>${price}</span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span>Delivery Fee</span>
                    <span>${shipping_fee}</span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span>Total Payment</span>
                    <span>${price + shipping_fee}</span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span>Total</span>
                    <span className='text-lg text-[#059473]'>${price + shipping_fee}</span>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={!res}
                    className={`px-5 py-2 rounded-md text-sm text-white uppercase transition-all ${
                      res ? 'bg-red-500 hover:bg-red-600 hover:shadow-lg' : 'bg-red-300 cursor-not-allowed'
                    }`}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping;
