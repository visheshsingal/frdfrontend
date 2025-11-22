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
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showViewNotesModal, setShowViewNotesModal] = useState(false);
  const [viewNotesText, setViewNotesText] = useState('');
  const [uploadFiles, setUploadFiles] = useState({});
  const [uploadingOrderId, setUploadingOrderId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  const loadOrderData = async () => {
    try {
      if (!backendUrl) {
        console.error('backendUrl is not configured (import.meta.env.VITE_BACKEND_URL)');
        toast.error('Backend URL not configured. Check environment.');
        setLoading(false);
        return;
      }
      if (!token) {
        toast.error('Please login to view your orders');
        navigate('/login');x
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId: user._id },
        { headers: { token } }
      );

      if (response.data.success) {
        // ✅ ADD THIS FILTER: Remove failed Razorpay payments
        const filteredOrders = (response.data.orders || []).filter(order => {
          // Razorpay orders mein sirf paid wale rakhna hai
          if (order.paymentMethod === 'Razorpay' && order.payment !== true) {
            return false; // Failed Razorpay payments ko remove karo
          }
          // COD orders aur successful Razorpay payments ko rakhna hai
          return true;
        });
        
        setOrders(filteredOrders);
        
        if (filteredOrders.length === 0) {
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

  const handleDownloadBill = async (order) => {
    try {
      // Try direct download from Cloudinary URL (no backend required)
      if (!order.billImage) return toast.error('No invoice available');
      const res = await axios.get(order.billImage, { responseType: 'blob' });
      // derive filename from URL or fallback
      let filename = `invoice-${order._id}`;
      try {
        const urlParts = order.billImage.split('/');
        const last = urlParts[urlParts.length - 1];
        if (last) filename = decodeURIComponent(last.split('?')[0]);
      } catch (e) { /* ignore */ }
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download error:', err);
      toast.error(err.response?.data?.message || 'Download failed');
    }
  }

  const handleAddNote = async (orderId, currentNotes) => {
    setCurrentOrderId(orderId);
    setNoteText(currentNotes || '');
    setShowNotesModal(true);
  };

  const handleViewNotes = (notes) => {
    setViewNotesText(notes);
    setShowViewNotesModal(true);
  };

  const saveUserNotes = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/order/user-notes`,
        { 
          orderId: currentOrderId, 
          userNotes: noteText
        },
        { headers: { token } }
      );
      
      toast.success('Special request updated successfully!');
      setShowNotesModal(false);
      setNoteText('');
      setCurrentOrderId('');
      await loadOrderData();
    } catch (error) {
      console.error('Error updating notes:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update special request');
      }
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, user._id]);

  if (loading) {
    return (
      <div className="border-t border-blue-600 pt-16 bg-white min-h-screen text-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-blue-600 pt-16 bg-white min-h-screen text-slate-800">
      <div className="text-3xl text-center">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="text-center text-sm text-slate-600 mb-8">
        Contact us: <span className="font-medium text-blue-600">+91 9278160000</span>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-xl mb-4">No orders found</p>
            <p className="text-slate-600 mb-6">Start shopping to see your orders here!</p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 border border-blue-600 shadow-lg">
              
              {/* Order Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-4 border-b border-gray-200">
                <div className="w-full">
                  <h3 className="text-blue-600 font-bold text-lg sm:text-xl mb-2">
                    Order #{(order._id || '').substring(0, 8).toUpperCase()}
                  </h3>
                  <div className="text-slate-700 space-y-1 text-xs sm:text-sm">
                    <p>📅 {new Date(order.date).toLocaleDateString('en-IN')}</p>
                    <p>🔄 Status: <span className={`font-semibold ${
                      order.status === 'Delivered' ? 'text-blue-600' : 
                      order.status === 'Cancelled' ? 'text-red-400' : 'text-yellow-400'
                    }`}>{order.status}</span></p>
                    <p>💳 Payment: <span className={
                      order.payment ? 'text-blue-600' : 
                      order.status === 'Delivered' ? 'text-blue-600' : 'text-red-400'
                    }>
                      {order.payment ? 'Paid' : 
                       order.status === 'Delivered' ? 'Paid' : 'Pending'}
                    </span></p>
                    <p>📦 Method: {order.paymentMethod}</p>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 w-full lg:w-auto text-left lg:text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {currency}{order.amount || 0}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {order.items?.length || 0} items
                  </p>
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 ? (
                <div className="mb-6">
                  <h4 className="text-blue-600 font-semibold text-base sm:text-lg mb-4">Order Items</h4>
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.map((item, index) => {
                      const imageUrl = item.image 
                        ? (Array.isArray(item.image) ? item.image[0] : item.image)
                        : 'https://via.placeholder.com/80x80/1f2937/ffffff?text=No+Image';
                      
                      return (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg hover:bg-gray-750 transition-colors">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            <img
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-blue-600"
                              src={imageUrl}
                              alt={item.name}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80/1f2937/ffffff?text=No+Image';
                              }}
                            />
                          </div>
                          
                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-base sm:text-lg truncate">{item.name}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-slate-700 mt-2 text-xs sm:text-sm">
                              <p>💰 Unit: {currency}{item.finalPrice !== undefined ? item.finalPrice : item.price}</p>
                              <p>📦 Quantity: {item.quantity}</p>
                              {/* Size field removed - use variantName/groupLabel instead */}
                              {item.discount > 0 && <p>🎯 Discount: {item.discount}%</p>}
                              {item.selectedOptions && item.selectedOptions.length > 0 && (
                                <div className="col-span-1 sm:col-span-2">
                                  {item.selectedOptions.map((so, i) => (
                                    <p key={i}>🔖 {so.groupLabel ? `${so.groupLabel}: ` : ''}{so.optionName}</p>
                                  ))}
                                </div>
                              )}
                              {!item.selectedOptions && item.variantName && <p>🔖 Variant: {item.variantName}</p>}
                              {!item.selectedOptions && item.groupLabel && <p>🏷 {item.groupLabel}</p>}
                            </div>
                          </div>
                          
                          {/* Price - Now properly aligned for mobile */}
                          <div className="text-left sm:text-right mt-2 sm:mt-0">
                            {(() => {
                              const unit = item.finalPrice !== undefined ? Number(item.finalPrice) : Number(item.price || 0);
                              const orig = item.unitPrice !== undefined ? Number(item.unitPrice) : (item.price !== undefined ? Number(item.price) : unit);
                              return (
                                <>
                                  <p className="font-bold text-blue-600 text-lg sm:text-xl">
                                    {currency}{unit * item.quantity}
                                  </p>
                                  <p className="text-slate-600 text-xs sm:text-sm">
                                    {item.quantity} × {currency}{unit}
                                  </p>
                                  {orig !== unit && (
                                    <p className="text-xs text-slate-600">Orig: {currency}{orig}</p>
                                  )}
                                </>
                              )
                            })()}
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
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="text-blue-600 font-semibold mb-3 text-base sm:text-lg">Shipping Address</h4>
                  <div className="text-slate-700 text-xs sm:text-sm">
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

              {/* Bill Upload / Display */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-blue-600 font-semibold text-base sm:text-lg">Order Bill</h4>
                </div>
                {order.billImage ? (
                  <div className="flex items-center gap-4">
                    <img src={order.billImage} alt="Bill" className="w-40 h-28 object-cover rounded-lg border" />
                    <div className="flex flex-col">
                      <div className="text-sm text-slate-700">Uploaded on: {order.billUploadedAt ? new Date(order.billUploadedAt).toLocaleString() : '—'}</div>
                      <div className="mt-2 flex gap-2">
                        <a href={order.billImage} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-gray-200 text-slate-800 rounded text-xs">View</a>
                        <button onClick={() => handleDownloadBill(order)} className="px-3 py-1 bg-yellow-400 text-black rounded text-xs">Download</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600">No bill uploaded by admin yet.</div>
                )}
              </div>

              {/* Special Request Section */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-blue-600 font-semibold text-base sm:text-lg">Special Request</h4>
                  <button
                    onClick={() => handleAddNote(order._id, order.userNotes || '')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    {order.userNotes ? '✏️ Edit' : '➕ Add'}
                  </button>
                </div>
                
                {order.userNotes ? (
                  <div className="text-slate-700 text-xs sm:text-sm">
                    {order.userNotes.length > 150 ? (
                      <>
                        <p className="break-words">{order.userNotes.substring(0, 150)}...</p>
                        <button 
                          onClick={() => handleViewNotes(order.userNotes)}
                          className="text-blue-600 hover:text-green-300 underline mt-2 text-xs"
                        >
                          View Full Request
                        </button>
                      </>
                    ) : (
                      <p className="break-words">{order.userNotes}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs sm:text-sm italic">
                    No special requests added. Click "Add" to include delivery instructions or special requests.
                  </p>
                )}
              </div>

              {/* Order Tracking Section */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-blue-600 font-semibold text-base sm:text-lg mb-3">📦 Order Tracking</h4>
                {order.trackingUrl ? (
                  <>
                    <p className="text-slate-600 text-xs sm:text-sm mb-3">
                      Your order has been shipped! Click below to track its progress.
                    </p>
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      🚚 Track Order
                    </a>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    </div>
                    <p className="text-yellow-400 text-xs sm:text-sm font-medium">
                      We will update the tracking soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-md border border-blue-600">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Add Special Request</h3>
            <p className="text-slate-600 text-sm mb-4">
              Add delivery instructions, special requests, or any notes for this order.
            </p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your special request or delivery instructions..."
              className="w-full h-32 p-3 bg-white border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-gray-400"
              maxLength={500}
            />
            <p className="text-slate-500 text-xs mt-1">{noteText.length}/500 characters</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveUserNotes}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Request
              </button>
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setNoteText('');
                  setCurrentOrderId('');
                }}
                className="flex-1 bg-gray-300 text-slate-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Notes Modal */}
      {showViewNotesModal && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-md border border-blue-600">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Special Request</h3>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded p-3 bg-white">
              <p className="text-slate-700 text-sm break-words whitespace-pre-wrap">{viewNotesText}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowViewNotesModal(false);
                  setViewNotesText('');
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;