import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const onChangeHandler = (e) =>
    setFormData(data => ({ ...data, [e.target.name]: e.target.value }));

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/order/verifyRazorpay',
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate('/orders');
            setCartItems({});
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = { address: formData, items: orderItems, amount: getCartAmount() + delivery_fee };

      switch (method) {
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else toast.error(response.data.message);
          break;
        case 'razorpay':
          const razorRes = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } });
          if (razorRes.data.success) initPay(razorRes.data.order);
          break;
        default:
          break;
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-8 pt-8 sm:pt-14 min-h-[80vh] border-t border-green-800 bg-black text-white px-4"
    >
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-3xl my-3 text-green-500">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="firstName" value={formData.firstName}
            className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500"
            type="text" placeholder="First name" />
          <input required onChange={onChangeHandler} name="lastName" value={formData.lastName}
            className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500"
            type="text" placeholder="Last name" />
        </div>
        <input required onChange={onChangeHandler} name="email" value={formData.email}
          className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500"
          type="email" placeholder="Email address" />
        <input required onChange={onChangeHandler} name="street" value={formData.street}
          className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500"
          type="text" placeholder="Street" />
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="city" value={formData.city}
            className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500"
            type="text" placeholder="City" />
          <input onChange={onChangeHandler} name="state" value={formData.state}
            className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500"
            type="text" placeholder="State" />
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode}
            className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500"
            type="number" placeholder="Zipcode" />
          <input required onChange={onChangeHandler} name="country" value={formData.country}
            className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500"
            type="text" placeholder="Country" />
        </div>
        <input required onChange={onChangeHandler} name="phone" value={formData.phone}
          className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500"
          type="number" placeholder="Phone" />
      </div>

      {/* Right Side */}
      <div className="sm:max-w-md w-full">
        <div className="my-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex gap-3 flex-col lg:flex-row mt-4">
            {['razorpay', 'cod'].map((opt) => (
              <div
                key={opt}
                onClick={() => setMethod(opt)}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded transition hover:bg-neutral-900 ${method === opt ? 'border-green-500' : 'border-green-800'}`}
              >
                <span className={`min-w-4 h-4 border rounded-full ${method === opt ? 'bg-green-500' : 'border-green-500'}`}></span>
                {opt !== 'cod' ? (
                  <img className="h-5 mx-4" src={opt === 'stripe' ? assets.stripe_logo : assets.razorpay_logo} alt="" />
                ) : (
                  <p className="text-gray-400 text-sm mx-4">Cash on Delivery</p>
                )}
              </div>
            ))}
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-green-500 text-black font-semibold px-12 py-3 text-sm rounded hover:bg-green-600 transition-colors duration-300"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
