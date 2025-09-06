import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    navigate,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products
  } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) =>
    setFormData((data) => ({ ...data, [e.target.name]: e.target.value }))

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const payWithRazorpay = async () => {
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      toast.error('Razorpay SDK failed to load.')
      return
    }

    // Calculate total amount in paise
    const totalAmount = (getCartAmount() + delivery_fee) * 100

    const options = {
      key: 'rzp_test_REIvz0GDMFHatN',
      amount: totalAmount,
      currency: 'INR',
      name: 'Fitness Store',
      description: 'Order Payment',
      handler: function (response) {
        console.log('Razorpay payment success:', response)
        toast.success('Payment successful! Order placed.')
        setCartItems({})
        navigate('/orders')
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: '#16a34a' },
      modal: { ondismiss: () => toast.info('Payment cancelled') }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Basic validation
    const requiredFields = ['firstName','lastName','email','street','city','zipcode','country','phone']
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error('Please fill all required fields')
        setIsProcessing(false)
        return
      }
    }

    if (Object.keys(cartItems).length === 0) {
      toast.error('Your cart is empty')
      setIsProcessing(false)
      return
    }

    if (method === 'cod') {
      toast.success('Order placed successfully! (COD)')
      setCartItems({})
      navigate('/orders')
    } else if (method === 'razorpay') {
      await payWithRazorpay()
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-8 pt-8 sm:pt-14 min-h-[80vh] border-t border-green-800 bg-black text-white px-4">
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-3xl my-3 text-green-500">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500" type="text" placeholder="First name" />
          <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500" type="text" placeholder="Last name" />
        </div>
        <input required onChange={onChangeHandler} name="email" value={formData.email} className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500" type="email" placeholder="Email" />
        <input required onChange={onChangeHandler} name="street" value={formData.street} className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500" type="text" placeholder="Street" />
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="city" value={formData.city} className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500" type="text" placeholder="City" />
          <input onChange={onChangeHandler} name="state" value={formData.state} className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500" type="text" placeholder="State" />
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500" type="number" placeholder="Zipcode" />
          <input required onChange={onChangeHandler} name="country" value={formData.country} className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500" type="text" placeholder="Country" />
        </div>
        <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="bg-neutral-900 border border-green-800 rounded py-2 px-4 w-full focus:outline-green-500" type="tel" placeholder="Phone" />
      </div>

      {/* Right Side */}
      <div className="sm:max-w-md w-full">
        <div className="my-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex gap-3 flex-col lg:flex-row mt-4">
            {['razorpay','cod'].map(opt => (
              <div key={opt} onClick={() => setMethod(opt)} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded transition hover:bg-neutral-900 ${method===opt?'border-green-500':'border-green-800'}`}>
                <span className={`min-w-4 h-4 border rounded-full ${method===opt?'bg-green-500':'border-green-500'}`}></span>
                {opt!=='cod'?<img className="h-5 mx-4" src={assets.razorpay_logo} alt="Razorpay"/>:<p className="text-gray-400 text-sm mx-4">Cash on Delivery</p>}
              </div>
            ))}
          </div>

          <div className="w-full text-end mt-8">
            <button type="submit" disabled={isProcessing} className="bg-green-500 text-black font-semibold px-12 py-3 text-sm rounded hover:bg-green-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing?'Processing...':'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
