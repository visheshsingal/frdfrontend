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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [groupSelections, setGroupSelections] = useState([]); // stores selected variant index per group

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      // Default variant selection
      if (selectedProduct.variants && selectedProduct.variants.length > 0) {
        setSelectedVariantIndex(0);
      } else {
        setSelectedVariantIndex(null);
      }
      // reset selected image index to 0; thumbnails will be computed client-side
      setSelectedImageIndex(0);
      // reset group selections based on productData.variantGroups
      if (selectedProduct && selectedProduct.variantGroups && selectedProduct.variantGroups.length > 0) {
        // initialize with first variant index (0) for each group
        setGroupSelections(selectedProduct.variantGroups.map(g => 0));
      } else {
        setGroupSelections([]);
      }
    }
  }, [productId, products]);

  // Helper to get currently selected variant object
  const currentVariant = selectedVariantIndex !== null && productData ? productData.variants?.[selectedVariantIndex] : null;

  // Build the list of images to show in the carousel (variant images first, then product images), deduped
  const getCarouselImages = () => {
    if (!productData) return [];
    const variantImgs = (productData.variants && selectedVariantIndex !== null) ? (productData.variants[selectedVariantIndex]?.images || []) : [];
    let thumbs = (variantImgs && variantImgs.length > 0) ? [...variantImgs, ...(productData.image || [])] : (productData.image || []);
    const seen = new Set();
    thumbs = thumbs.filter((u) => {
      if (!u) return false;
      if (seen.has(u)) return false;
      seen.add(u);
      return true;
    });
    return thumbs;
  };

  const carouselImages = getCarouselImages();
  const selectedImage = carouselImages[selectedImageIndex] || (carouselImages[0] || '');

  if (!productData) {
    return (
      <div className="p-10 text-center text-slate-600 bg-white min-h-screen">
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
    let variantKey = '';
    // If product has grouped variant selections, encode group selections into a composite key
    if (productData.variantGroups && productData.variantGroups.length > 0 && groupSelections && groupSelections.length > 0) {
      // format: g:gi-vi|gi-vi ... (groupIndex-variantIndex pairs)
      variantKey = 'g:' + groupSelections.map((sel, gi) => `${gi}-${sel}`).join('|');
    } else {
      variantKey = selectedVariantIndex !== null ? String(selectedVariantIndex) : '';
    }
    // pass variantKey as size argument to keep existing cart structure
    addToCart(productData._id, variantKey);
    toast.success('Product added to cart successfully!');
  };

  return (
    <div className="border-t border-gray-200 pt-10 bg-white text-slate-800 min-h-screen">
      <div className="flex gap-12 flex-col sm:flex-row">

        {/* Images Section */}
          <div className="flex-1 flex flex-col sm:flex-row gap-6">
            {/* Carousel: single image with left/right controls */}
            <div className="w-full sm:w-1/2 flex flex-col items-center">
              <div className="relative w-full">
                <img
                  className="w-full h-auto rounded-lg shadow-lg border border-gray-200 object-cover max-h-[60vh]"
                  src={selectedImage}
                  alt="main product"
                />
                {carouselImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-slate-800 p-2 rounded-full"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex((prev) => (prev + 1) % carouselImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-slate-800 p-2 rounded-full"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Dots */}
              {carouselImages.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {carouselImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-2 h-2 rounded-full ${i === selectedImageIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="w-full sm:w-1/2">
              <h1 className="text-3xl font-bold text-blue-600">{productData.name}</h1>
              <p className="mt-2 text-sm text-slate-600">
                Category: <span className="text-blue-600 font-medium">{productData.category}</span>
              </p>
              <p className="text-sm text-slate-600 mb-2">
                Subcategory: <span className="text-blue-600 font-medium">{productData.subCategory}</span>
              </p>

              {/* Price Section with Discount (use variant price if provided) */}
              {(() => {
                const basePrice = (currentVariant && currentVariant.price !== undefined && currentVariant.price !== null) ? Number(currentVariant.price) : Number(productData.price);
                // prefer variant discount if present
                const discountToUse = (currentVariant && currentVariant.discount !== undefined && currentVariant.discount !== null && currentVariant.discount !== '') ? Number(currentVariant.discount) : Number(productData.discount || 0);
                const discounted = discountToUse > 0 ? Math.round(basePrice - (basePrice * discountToUse / 100)) : basePrice;

                return discountToUse > 0 ? (
                  <div className="mt-4 text-3xl font-bold space-x-3">
                    <span className="text-gray-500 line-through text-2xl">
                      {currency}{basePrice}
                    </span>
                    <span className="text-blue-600">
                      {currency}{discounted}
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded">
                      -{discountToUse}%
                    </span>
                  </div>
                ) : (
                  <p className="mt-4 text-3xl font-bold text-blue-600">
                    {currency}{basePrice}
                  </p>
                );
              })()}

              <p className="mt-4 text-slate-700 md:w-4/5">{productData.description}</p>

              {/* Variant Options (if available) - show label then option boxes */}
              {productData.variants && productData.variants.length > 0 && (
                <div className="mt-4">
                  {/* If variantGroups exist, render grouped option selectors */}
                  {productData.variantGroups && productData.variantGroups.length > 0 ? (
                    <div className="mt-2 space-y-3">
                      {productData.variantGroups.map((g, gi) => (
                        <div key={gi}>
                          <div className="text-sm text-slate-700 mb-2">{g.label}:</div>
                          <div className="flex flex-wrap gap-2">
                            {g.variants && g.variants.map((opt, oi) => {
                              const isSelected = groupSelections[gi] === oi;
                              return (
                                <button
                                  key={oi}
                                  type="button"
                                  onClick={() => {
                                    const ns = [...groupSelections];
                                    ns[gi] = oi;
                                    setGroupSelections(ns);
                                    // Try to find corresponding flattened variant using meta (if present)
                                    let matchedIdx = null;
                                    for (let vi = 0; vi < (productData.variants || []).length; vi++) {
                                      const v = productData.variants[vi];
                                      if (v.uid && v.meta) {
                                        if (v.meta.groupIndex === gi && v.meta.variantIndex === oi) { matchedIdx = vi; break; }
                                      }
                                    }
                                    // Fallback: try match by name
                                    if (matchedIdx === null) {
                                      for (let vi = 0; vi < (productData.variants || []).length; vi++) {
                                        const v = productData.variants[vi];
                                        const nameLower = (v.name || '').toLowerCase();
                                        if ((opt.name || opt).toString().toLowerCase && nameLower.includes((opt.name || opt).toString().toLowerCase())) { matchedIdx = vi; break; }
                                      }
                                    }
                                    setSelectedVariantIndex(matchedIdx);
                                    setSelectedImageIndex(0);
                                  }}
                                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-transform transform ${isSelected ? 'scale-105 border-blue-600 bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg ring-2 ring-blue-300' : 'hover:scale-105 border-gray-300 bg-gray-50 hover:shadow-md'}`}
                                >
                                  {isSelected && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">✓</span>
                                  )}
                                  <span className="truncate">{opt.name || opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-3">
                      {productData.variants.map((v, i) => {
                        const isSelected = selectedVariantIndex === i;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setSelectedVariantIndex(i); setSelectedImageIndex(0); }}
                            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-transform transform ${isSelected ? 'scale-105 border-blue-600 bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg ring-2 ring-blue-300' : 'border-gray-300 bg-gray-50 hover:scale-105 hover:shadow-md'}`}
                          >
                            {isSelected && (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">✓</span>
                            )}
                            <div className="flex flex-col text-sm">
                              <span className="font-medium">{v.name}</span>
                              {(() => {
                                const base = v.price !== undefined && v.price !== null ? Number(v.price) : Number(productData.price);
                                const vDiscount = v.discount !== undefined && v.discount !== null && v.discount !== '' ? Number(v.discount) : productData.discount;
                                const final = vDiscount > 0 ? Math.round(base - (base * vDiscount / 100)) : base;
                                return <span className="text-xs text-gray-400">{currency}{final}</span>;
                              })()}
                              <span className="text-xs text-gray-500">{v.stock !== undefined ? `${v.stock} in stock` : ''}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ADD TO CART */}
              <div className="mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={productData.variants && productData.variants[selectedVariantIndex]?.stock === 0}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition text-sm mt-4 shadow ${productData.variants && productData.variants[selectedVariantIndex]?.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {productData.variants && productData.variants[selectedVariantIndex]?.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
                </button>
              </div>

              <hr className="mt-8 sm:w-4/5 border-gray-200" />
              <div className="text-sm text-slate-600 mt-5 space-y-1">
                <p>✅ 100% Original product</p>
                <p>💵 Cash on delivery available</p>
                <p>🔄 Easy return within 7 days</p>
              </div>
            </div>
          </div>

 
      </div>

      {/* Videos Section - Below Images */}
      {productData.videos && productData.videos.length > 0 && (
        <div className="mt-12 px-2">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Product Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productData.videos.map((video, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
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
          <b className="border border-blue-600 px-5 py-3 text-sm bg-blue-600 text-white rounded-t">
            Description
          </b>
        </div>
        <div className="flex flex-col gap-4 border border-blue-600 border-t-0 px-6 py-6 text-sm text-slate-700 rounded-b">
          <div>{productData.description}</div>
        </div>
      </div>

      {/* Manufacturer Box - separate from Description */}
      {productData.manufacturerDetails && (
        <div className="mt-6 px-2">
          <div className="flex">
            <b className="border border-blue-600 px-5 py-3 text-sm bg-blue-600 text-white rounded-t">
              {productData.manufacturerLabel || 'Manufacturer Details'}
            </b>
          </div>
          <div className="flex flex-col gap-4 border border-blue-600 border-t-0 px-6 py-6 text-sm text-slate-700 rounded-b">
            <div>{productData.manufacturerDetails}</div>
          </div>
        </div>
      )}
      

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;