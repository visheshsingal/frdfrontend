import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t border-green-800 pt-16 bg-black min-h-screen text-white">
      <div className="text-3xl text-center">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="text-center text-sm text-gray-400 mb-6">
        If you want to cancel the order, please contact on this number:{' '}
        <span className="font-medium text-green-500">+91 9278160000</span>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {orderData.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            You have no orders yet.
          </p>
        ) : (
          orderData.map((item, index) => {
            // Determine image URL safely
            const imageUrl =
              Array.isArray(item.image) && item.image.length > 0
                ? item.image[0]
                : item.image || '/placeholder.png'; // fallback image

            return (
              <div
                key={index}
                className="py-5 border-t border-b border-green-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-neutral-900 transition-colors duration-300"
              >
                <div className="flex items-start gap-6 text-sm">
                  <img
                    className="w-16 sm:w-20 rounded-lg border border-green-700"
                    src={imageUrl}
                    alt={item.name}
                  />
                  <div>
                    <p className="sm:text-base font-semibold text-green-400">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-base text-gray-300">
                      <p>
                        {currency}
                        {item.price}
                      </p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <p className="mt-1 text-gray-500">
                      Date:{' '}
                      <span className="text-gray-400">
                        {new Date(item.date).toDateString()}
                      </span>
                    </p>
                    <p className="mt-1 text-gray-500">
                      Payment:{' '}
                      <span className="text-gray-400">{item.paymentMethod}</span>
                    </p>
                  </div>
                </div>

                <div className="md:w-1/3 flex justify-between md:justify-end items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-700"></span>
                    <p className="text-sm md:text-base text-green-400">
                      {item.status}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
