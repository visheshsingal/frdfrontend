import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products, currency, addToCart, user, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      // Set the first image as default
      if (selectedProduct.image?.[0]) {
        setSelectedImage(selectedProduct.image[0]);
      }
    }
  }, [productId, products]);

  if (!productData) {
    return (
      <div className="p-10 text-center text-gray-400 bg-black min-h-screen">
        Loading product...
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user && !token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    addToCart(productData._id);
    toast.success('Product added to cart successfully!');
  };

  return (
    <div className="border-t border-gray-800 pt-10 bg-black text-white min-h-screen">
      <div className="flex gap-12 flex-col sm:flex-row">

        {/* Images Section */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full gap-2">
            {productData.image?.map((item, index) => (
              <img
                onClick={() => setSelectedImage(item)}
                src={item}
                key={index}
                className={`w-[24%] sm:w-full cursor-pointer hover:scale-105 transition rounded-lg ${
                  selectedImage === item ? 'border-2 border-green-500' : 'border border-gray-700'
                }`}
                alt={`product-thumbnail-${index}`}
              />
            ))}
          </div>
          
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto rounded-lg shadow-lg border border-gray-800"
              src={selectedImage}
              alt="main product"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1 px-2">
          <h1 className="text-3xl font-bold text-green-500">{productData.name}</h1>
          <p className="mt-2 text-sm text-gray-400">
            Category: <span className="text-green-400 font-medium">{productData.category}</span>
          </p>
          <p className="text-sm text-gray-400 mb-2">
            Subcategory: <span className="text-green-400 font-medium">{productData.subCategory}</span>
          </p>

          {/* Price Section with Discount */}
          {productData.discount > 0 ? (
            <div className="mt-4 text-3xl font-bold space-x-3">
              <span className="text-gray-500 line-through text-2xl">
                {currency}{productData.price}
              </span>
              <span className="text-green-400">
                {currency}{Math.round(productData.price - (productData.price * productData.discount / 100))}
              </span>
              <span className="bg-green-900 text-green-400 text-sm px-2 py-1 rounded">
                -{productData.discount}%
              </span>
            </div>
          ) : (
            <p className="mt-4 text-3xl font-bold text-green-400">
              {currency}{productData.price}
            </p>
          )}

          <p className="mt-4 text-gray-300 md:w-4/5">{productData.description}</p>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-lg transition text-sm mt-8 shadow"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5 border-gray-700" />
          <div className="text-sm text-gray-400 mt-5 space-y-1">
            <p>✅ 100% Original product</p>
            <p>💵 Cash on delivery available</p>
            <p>🔄 Easy return within 7 days</p>
          </div>
        </div>
      </div>

      {/* Videos Section - Below Images */}
      {productData.videos && productData.videos.length > 0 && (
        <div className="mt-12 px-2">
          <h2 className="text-2xl font-bold text-green-500 mb-6">Product Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productData.videos.map((video, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-3">
                  Video {index + 1}
                </h3>
                <video 
                  controls 
                  className="w-full h-auto rounded-lg"
                  poster={productData.image?.[0]} // Use first image as thumbnail
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mt-12 px-2">
        <div className="flex">
          <b className="border border-green-500 px-5 py-3 text-sm bg-green-500 text-black rounded-t">
            Description
          </b>
        </div>
        <div className="flex flex-col gap-4 border border-green-500 border-t-0 px-6 py-6 text-sm text-gray-300 rounded-b">
          <p>
            This product is crafted to meet the highest standards of the fitness community, supporting your strength, endurance, and recovery goals.
          </p>
          <p>
            Made with clinically tested ingredients and backed by expert formulation, it ensures safety and effective performance with every serving.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;