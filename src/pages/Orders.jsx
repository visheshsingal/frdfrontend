import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { backendUrl, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  const loadOrderData = async () => {
    try {
      if (!token) {
        toast.error('Please login to view your orders');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId: user._id },
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
        
        if (response.data.orders.length === 0) {
          toast.info('You have no orders yet');
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, user._id]);

  if (loading) {
    return (
      <div className="border-t border-green-800 pt-16 bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-green-800 pt-16 bg-black min-h-screen text-white">
      <div className="text-3xl text-center">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="text-center text-sm text-gray-400 mb-8">
        Contact us: <span className="font-medium text-green-500">+91 9278160000</span>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl mb-4">No orders found</p>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here!</p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-gray-900 rounded-xl p-4 sm:p-6 mb-6 border border-green-800 shadow-lg">
              
              {/* Order Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-4 border-b border-gray-700">
                <div className="w-full">
                  <h3 className="text-green-400 font-bold text-lg sm:text-xl mb-2">
                    Order #{(order._id || '').substring(0, 8).toUpperCase()}
                  </h3>
                  <div className="text-gray-300 space-y-1 text-xs sm:text-sm">
                    <p>📅 {new Date(order.date).toLocaleDateString('en-IN')}</p>
                    <p>🔄 Status: <span className={`font-semibold ${
                      order.status === 'Delivered' ? 'text-green-400' : 
                      order.status === 'Cancelled' ? 'text-red-400' : 'text-yellow-400'
                    }`}>{order.status}</span></p>
                    <p>💳 Payment: <span className={
                      order.payment ? 'text-green-400' : 
                      order.status === 'Delivered' ? 'text-green-400' : 'text-red-400'
                    }>
                      {order.payment ? 'Paid' : 
                       order.status === 'Delivered' ? 'Paid' : 'Pending'}
                    </span></p>
                    <p>📦 Method: {order.paymentMethod}</p>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 w-full lg:w-auto text-left lg:text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">
                    {currency}{order.amount || 0}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {order.items?.length || 0} items
                  </p>
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 ? (
                <div className="mb-6">
                  <h4 className="text-green-400 font-semibold text-base sm:text-lg mb-4">Order Items</h4>
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.map((item, index) => {
                      const imageUrl = item.image 
                        ? (Array.isArray(item.image) ? item.image[0] : item.image)
                        : 'https://via.placeholder.com/80x80/1f2937/ffffff?text=No+Image';
                      
                      return (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            <img
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-green-600"
                              src={imageUrl}
                              alt={item.name}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80/1f2937/ffffff?text=No+Image';
                              }}
                            />
                          </div>
                          
                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-base sm:text-lg truncate">{item.name}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-gray-300 mt-2 text-xs sm:text-sm">
                              <p>💰 Price: {currency}{item.price}</p>
                              <p>📦 Quantity: {item.quantity}</p>
                              {item.size && <p>📏 Size: {item.size}</p>}
                              {item.discount > 0 && <p>🎯 Discount: {item.discount}%</p>}
                            </div>
                          </div>
                          
                          {/* Price - Now properly aligned for mobile */}
                          <div className="text-left sm:text-right mt-2 sm:mt-0">
                            <p className="font-bold text-green-400 text-lg sm:text-xl">
                              {currency}{item.price * item.quantity}
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {item.quantity} × {currency}{item.price}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-900 rounded-lg text-center">
                  <p className="text-yellow-300 font-semibold">No items found in this order</p>
                </div>
              )}

              {/* Shipping Address */}
              {order.address && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-3 text-base sm:text-lg">Shipping Address</h4>
                  <div className="text-gray-300 text-xs sm:text-sm">
                    <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}</p>
                    <p>{order.address.country} - {order.address.zipcode}</p>
                    <div className="mt-2">
                      <p>📞 {order.address.phone}</p>
                      <p>✉️ {order.address.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;