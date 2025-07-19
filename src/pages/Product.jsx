import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId)
    if (selectedProduct) {
      setProductData(selectedProduct)
      setImage(selectedProduct.image[0])
    }
  }, [productId, products])

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 text-[#052659]">
      <div className="flex gap-12 flex-col sm:flex-row">

        {/* Images Section */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full gap-2">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-[24%] sm:w-full cursor-pointer hover:scale-105 transition ${image === item ? 'border-2 border-[#052659]' : ''}`}
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto rounded shadow" src={image} alt="" />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1 px-2">
          <h1 className="text-3xl font-semibold">{productData.name}</h1>
          {/* <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} className="w-4" alt="star" />
            ))} */}
            {/* <img src={assets.star_dull_icon} className="w-4" alt="star" /> */}
            {/* <p className="pl-2 text-gray-500">(122)</p> */}
          {/* </div> */}
          <p className="mt-5 text-3xl font-bold text-[#052659]">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-600 md:w-4/5">{productData.description}</p>

          <div className="flex flex-col gap-4 my-8">
            {/* <p className="font-medium">Select Size</p> */}
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 rounded ${item === size ? 'border-[#052659] bg-[#052659] text-white' : 'hover:border-[#052659]'}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-[#052659] hover:bg-[#031c3e] text-white px-8 py-3 rounded transition text-sm"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-600 mt-5 space-y-1">
            <p>✅ 100% Original product</p>
            <p>💵 Cash on delivery available</p>
            <p>🔄 Easy return within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20 px-2">
        <div className="flex">
          <b className="border px-5 py-3 text-sm bg-[#052659] text-white">Description</b>
          {/* <p className="border px-5 py-3 text-sm text-gray-600 cursor-pointer">Reviews (122)</p> */}
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            This product is crafted to meet the highest standards of the fitness community, supporting your strength, endurance, and recovery goals.
          </p>
          <p>
            Made with clinically tested ingredients and backed by expert formulation, it ensures safety and effective performance with every serving.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  )
}

export default Product
