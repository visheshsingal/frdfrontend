import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';

// Star SVG component (Displays up to 5 stars, coloring them based on the 'rating' prop)
const StarIcon = ({ className = 'w-5 h-5', rating, maxStars = 5 }) => (
    <div className="flex items-center">
        {[...Array(maxStars)].map((_, index) => {
            const starValue = index + 1;
            // The coloring logic is handled here, using the rating prop
            return (
                <svg 
                    key={index} 
                    className={`${className} ${starValue <= Math.round(rating) ? 'text-blue-600 fill-current' : 'text-gray-300'}`} 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
                </svg>
            );
        })}
    </div>
);

// Share Icon Component
const ShareIcon = ({ className = "w-5 h-5" }) => (
    <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
    >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);

const Product = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { products, currency, addToCart, user, token } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [reviewRating, setReviewRating] = useState('5');
    const [reviewComment, setReviewComment] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
    const [groupSelections, setGroupSelections] = useState([]);
    const [revPage, setRevPage] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [showShareMessage, setShowShareMessage] = useState(false);
    const revPageSize = 3;
    const [activeTab, setActiveTab] = useState('description');

    const imageRef = useRef(null);
    const zoomRef = useRef(null);

    // --- Initial Data Load and State Setup ---
    useEffect(() => {
        const selectedProduct = products.find((item) => item._id === productId);
        if (selectedProduct) {
            setProductData(selectedProduct);
            
            const hasSimpleVariants = selectedProduct.variants && selectedProduct.variants.length > 0;
            setSelectedVariantIndex(hasSimpleVariants ? 0 : null);
            
            setSelectedImageIndex(0);
            
            const hasVariantGroups = selectedProduct.variantGroups && selectedProduct.variantGroups.length > 0;
            setGroupSelections(hasVariantGroups ? selectedProduct.variantGroups.map(() => 0) : []);
        }
    }, [productId, products]);

    // --- Image Zoom Functionality (Desktop only) ---
    const handleMouseMove = (e) => {
        if (!isZoomed || !imageRef.current || !zoomRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };

    // --- Share Product Functionality ---
    const handleShareProduct = async () => {
        const productUrl = window.location.href;
        
        try {
            // Copy to clipboard
            await navigator.clipboard.writeText(productUrl);
            
            // Show message
            setShowShareMessage(true);
            
            // Hide message after 2 seconds
            setTimeout(() => {
                setShowShareMessage(false);
            }, 2000);
            
        } catch (error) {
            console.log('Error copying:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = productUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show message
            setShowShareMessage(true);
            
            // Hide message after 2 seconds
            setTimeout(() => {
                setShowShareMessage(false);
            }, 2000);
        }
    };
    
    // --- Derived State (Prices, Images, Rating) ---
    const currentVariant = selectedVariantIndex !== null && productData
        ? productData.variants?.[selectedVariantIndex]
        : null;

    const getCarouselImages = () => {
        if (!productData) return [];
        const variantImgs = currentVariant?.images || [];
        const baseImgs = productData.image || [];
        const all = variantImgs.length > 0 ? [...variantImgs, ...baseImgs] : baseImgs;
        const seen = new Set();
        return all.filter((url) => url && !seen.has(url) && seen.add(url));
    };

    const carouselImages = getCarouselImages();
    const selectedImage = carouselImages[selectedImageIndex] || '';

    const basePrice = currentVariant?.price ?? productData?.price ?? 0;
    const discount = currentVariant?.discount ?? productData?.discount ?? 0;
    const finalPrice = discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;

    // Calculate average rating
    const averageRating = productData?.reviews?.length 
        ? (productData.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / productData.reviews.length).toFixed(1)
        : '0.0';

    // --- Handlers ---
    const handleAddToCart = () => {
        if (!user && !token) {
            toast.error('Please login first to add items to your cart.');
            navigate('/login');
            return;
        }

        let variantKey = '';
        if (productData.variantGroups?.length > 0) {
            variantKey = 'g:' + groupSelections.map((sel, gi) => `${gi}-${sel}`).join('|');
        } else {
            variantKey = selectedVariantIndex !== null ? String(selectedVariantIndex) : '';
        }

        addToCart(productData._id, variantKey);
        toast.success('Product added to cart.');
    };
    
    const submitReview = async () => {
        if (!reviewRating) return toast.error('Please select a rating');
        try {
            const payload = { productId: productData._id, rating: Number(reviewRating), comment: reviewComment };
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers.token = token;
            
            const res = await axios.post(`${(import.meta.env.VITE_BACKEND_URL || '')}/api/product/review`, payload, { headers });
            
            if (res.data.success) {
                toast.success('Review submitted successfully.');
                setProductData(prev => ({ 
                    ...prev, 
                    reviews: [...(prev.reviews||[]), res.data.review] 
                }));
                setReviewComment(''); 
                setReviewRating('5');
                setRevPage(1);
            } else {
                toast.error(res.data.message || 'Failed to submit review');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review. Please ensure you are logged in.');
        }
    };

    // --- Render Loading State ---
    if (!productData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-500">Loading product details...</div>
            </div>
        );
    }

    // --- Sub-Components for Reviews ---

    const ReviewSummary = () => (
        <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-100 shadow-inner">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0 md:w-1/3">
                    <div className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-2">{averageRating}</div>
                    <StarIcon rating={averageRating} className="w-6 h-6 mx-auto md:mx-0" />
                    <p className="text-gray-600 text-sm mt-2">
                        Based on {productData.reviews?.length || 0} customer reviews
                    </p>
                </div>
                
                <div className="w-full md:w-2/3 max-w-md">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = productData.reviews?.filter(r => r.rating === rating).length || 0;
                        const total = productData.reviews?.length || 1;
                        const percentage = (count / total) * 100;
                        
                        return (
                            <div key={rating} className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-gray-600 w-2">{rating}</span>
                                <StarIcon rating={5} className="w-3 h-3 text-blue-600 fill-current" />
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const AddReviewForm = () => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8 shadow-xl">
            <h3 className="text-xl font-bold text-black mb-4">Add Your Review</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(String(star))}
                                    className={`p-0.5 transition hover:scale-110`}
                                    aria-label={`${star} star rating`}
                                >
                                    <svg 
                                        className={`w-7 h-7 fill-current transition-colors ${star <= Number(reviewRating) ? 'text-blue-600' : 'text-gray-300'}`} 
                                        viewBox="0 0 24 24" 
                                        fill="currentColor"
                                    >
                                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                            {Number(reviewRating).toFixed(0)} / 5
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                    <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none shadow-inner"
                        placeholder="What did you like or dislike?"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={submitReview}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-base shadow-md transition transform hover:scale-[1.02]"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );

    const ReviewsList = () => {
        const rev = productData.reviews?.slice().reverse() || []; 
        const total = rev.length;
        const totalPages = Math.max(1, Math.ceil(total / revPageSize));
        const start = (revPage - 1) * revPageSize;
        const visible = rev.slice(start, start + revPageSize);

        return (
            <div className="space-y-4 pt-4">
                <h4 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">All Feedback ({total})</h4>
                
                {total > 0 ? (
                    <>
                        {visible.map((review) => (
                            <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-lg transition">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                            {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">
                                                {review.name || 'Anonymous User'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <StarIcon rating={review.rating} className="w-4 h-4" />
                                </div>
                                
                                {review.comment && (
                                    <p className="text-gray-700 leading-relaxed text-sm mt-3 border-l-4 border-blue-400 pl-4 py-1 bg-gray-50 rounded-sm">
                                        "{review.comment}"
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Pagination controls */}
                        {total > revPageSize && (
                            <div className="flex items-center justify-center gap-4 pt-6">
                                <button
                                    onClick={() => setRevPage(p => Math.max(1, p - 1))}
                                    disabled={revPage === 1}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${revPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    &larr; Previous
                                </button>
                                <div className="text-sm text-gray-700 font-medium">Page {revPage} of {totalPages}</div>
                                <button
                                    onClick={() => setRevPage(p => Math.min(totalPages, p + 1))}
                                    disabled={revPage === totalPages}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${revPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <p className="text-gray-500 text-base font-medium">No reviews found. Be the first!</p>
                    </div>
                )}
            </div>
        );
    };

    // --- Main Render ---
    return (
        <div className="bg-gray-50 min-h-screen py-4 md:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                
                {/* ==================== PRODUCT HEADER & BUYING SECTION ==================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg md:shadow-xl">

                    {/* === IMAGE GALLERY (7/12) === */}
                    <div className="lg:col-span-7 relative">
                        {/* Share Button - Top Right Corner */}
                        <div className="absolute top-3 right-3 z-20">
                            <div className="relative">
                                <button
                                    onClick={handleShareProduct}
                                    className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110 hover:shadow-xl z-10"
                                    aria-label="Share product"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                                
                                {/* Share Message */}
                                {showShareMessage && (
                                    <div className="absolute top-12 right-0 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg z-30">
                                        Link Copied!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Image View with Zoom (Desktop only) */}
                        <div 
                            className="hidden lg:block relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-lg aspect-[4/3] cursor-zoom-in"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={handleMouseMove}
                            ref={imageRef}
                        >
                            <img
                                src={selectedImage}
                                alt={productData.name}
                                className="w-full h-full object-contain p-3 md:p-4 lg:p-6 transition-transform duration-500"
                            />
                            
                            {/* Zoomed Image Overlay (Desktop only) */}
                            {isZoomed && (
                                <div 
                                    className="absolute inset-0 bg-white overflow-hidden pointer-events-none z-10"
                                    ref={zoomRef}
                                >
                                    <img
                                        src={selectedImage}
                                        alt={productData.name}
                                        className="absolute origin-top-left scale-150"
                                        style={{
                                            left: `-${zoomPosition.x * 1.5}%`,
                                            top: `-${zoomPosition.y * 1.5}%`,
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Mobile Image View (No Zoom) */}
                       {/* Mobile Image View (No Zoom) */}
<div className="lg:hidden relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
    <img
        src={selectedImage}
        alt={productData.name}
        className="w-full h-full object-contain"
    />
</div>

                        {/* Thumbnail Bar */}
                        {carouselImages.length > 1 && (
                            <div className="flex justify-start gap-2 md:gap-3 mt-2 md:mt-3 overflow-x-auto pb-1">
                                {carouselImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImageIndex(i)}
                                        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 md:min-w-18 md:min-h-18 border-2 rounded-lg transition-all ${
                                            i === selectedImageIndex ? 'border-blue-600 shadow-md p-0.5' : 'border-gray-300 hover:border-blue-400'
                                        }`}
                                        aria-label={`View image ${i + 1}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover rounded-md" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* === PRODUCT INFO & ACTIONS (5/12) === */}
                    <div className="lg:col-span-5 flex flex-col justify-start pt-3 lg:pt-0">
                        
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight sm:leading-snug mb-2">{productData.name}</h1>
                        
                        {/* Rating & Category - Now on separate lines */}
                        <div className="flex flex-col gap-2 text-sm text-gray-500 mb-3 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <StarIcon rating={averageRating} className="w-4 h-4" />
                                <span className="font-bold text-black text-base">{averageRating}</span> 
                                <span className="text-gray-500 text-sm">({productData.reviews?.length || 0} reviews)</span>
                            </div>
                            
                            {/* Categories and Subcategories on separate lines */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-500">Category:</span>
                                    <span className='text-sm font-semibold text-blue-600'>
                                        {productData.category}
                                    </span>
                                </div>
                                {productData.subCategory && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500">Subcategory:</span>
                                        <span className='text-sm font-semibold text-green-600'>
                                            {productData.subCategory}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Block */}
                        <div className="mb-4">
                            {discount > 0 ? (
                                <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4">
                                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-600">{currency}{finalPrice}</span>
                                    <span className="text-xl sm:text-2xl text-gray-500 line-through">{currency}{basePrice}</span>
                                    <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full shadow-md">
                                        SAVE {discount}%
                                    </span>
                                </div>
                            ) : (
                                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-600">{currency}{basePrice}</span>
                            )}
                        </div>
                        
                        {/* Variant Selection */}
                        {(productData.variantGroups?.length > 0 || productData.variants?.length > 0) && (
                            <div className="mt-2 space-y-2 sm:space-y-3 pb-3 border-b border-gray-100">
                                {/* Complex Variant Groups */}
                                {productData.variantGroups?.map((group, gi) => (
                                    <div key={gi}>
                                        <p className="text-sm font-bold text-black mb-1 sm:mb-2">{group.label}:</p>
                                        <div className="flex flex-wrap gap-1 sm:gap-2">
                                            {group.variants.map((opt, oi) => {
                                                const isSelected = groupSelections[gi] === oi;
                                                return (
                                                    <button
                                                        key={oi}
                                                        onClick={() => {
                                                            const newSelections = [...groupSelections];
                                                            newSelections[gi] = oi;
                                                            setGroupSelections(newSelections);
                                                            
                                                            let matchedIdx = productData.variants?.findIndex(v => v.meta?.groupIndex === gi && v.meta?.variantIndex === oi);
                                                            setSelectedVariantIndex(matchedIdx !== -1 ? matchedIdx : selectedVariantIndex);
                                                            setSelectedImageIndex(0);
                                                        }}
                                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 text-xs font-medium transition-all shadow-sm ${
                                                            isSelected
                                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                                : 'border-gray-300 bg-white text-gray-800 hover:border-blue-400'
                                                        }`}
                                                    >
                                                        {opt.name || opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Simple Variants */}
                                {productData.variants?.length > 0 && !productData.variantGroups?.length && (
                                    <div className="mt-2 sm:mt-3">
                                        <p className="text-sm font-bold text-black mb-1 sm:mb-2">Options:</p>
                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {productData.variants.map((v, i) => {
                                                const isSelected = selectedVariantIndex === i;
                                                const vPrice = v.price ?? productData.price;
                                                const vDiscount = v.discount ?? productData.discount ?? 0;
                                                const vFinal = vDiscount > 0 ? Math.round(vPrice * (1 - vDiscount / 100)) : vPrice;

                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setSelectedVariantIndex(i); setSelectedImageIndex(0); }}
                                                        className={`p-1.5 sm:p-2 rounded-lg border-2 text-left transition-all ${
                                                            isSelected 
                                                                ? 'border-blue-600 bg-blue-50 shadow-md' 
                                                                : 'border-gray-300 bg-white hover:border-blue-400'
                                                        }`}
                                                    >
                                                        <div className="font-semibold text-gray-900 text-xs sm:text-sm">{v.name}</div>
                                                        <div className="text-xs text-blue-600 font-bold">{currency}{vFinal}</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Stock Status */}
                        <p className={`mt-3 text-sm font-bold ${currentVariant?.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {currentVariant?.stock === 0 ? 'Out of Stock' : currentVariant?.stock !== undefined ? `${currentVariant.stock} in stock` : 'Available'}
                        </p>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={currentVariant?.stock === 0}
                            className={`mt-3 sm:mt-4 w-full py-2.5 sm:py-3 md:py-4 rounded-lg text-white font-black text-base sm:text-lg md:text-xl transition-all shadow-lg md:shadow-xl ${
                                currentVariant?.stock === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-2xl transform hover:-translate-y-0.5'
                            }`}
                        >
                            {currentVariant?.stock === 0 ? 'NOT AVAILABLE' : 'ADD TO CART'}
                        </button>
                    </div>
                </div>

                {/* ==================== PRODUCT DETAILS TABS (Full Width, Dedicated Section) ==================== */}
                <div className="mt-8 md:mt-12 bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg md:shadow-xl">
                    <div className="border-b border-gray-200 overflow-x-auto">
                        <nav className="-mb-px flex space-x-4 md:space-x-6 lg:space-x-8 min-w-full" aria-label="Tabs">
                            {['description', 'reviews', 'videos', 'manufacturer'].filter(tab => {
                                if (tab === 'videos') return productData.videos?.length > 0;
                                if (tab === 'manufacturer') return productData.manufacturerDetails;
                                return true;
                            }).map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg transition ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'}`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'reviews' && `(${productData.reviews?.length || 0})`}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="pt-4 sm:pt-6 md:pt-8">
                        {/* Tab Content: Description */}
                        {activeTab === 'description' && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 text-gray-700 leading-relaxed whitespace-pre-line shadow-inner text-sm sm:text-base">
                                {productData.description}
                            </div>
                        )}
                        
                        {/* Tab Content: Reviews */}
                        {activeTab === 'reviews' && (
                            <div className="max-w-full lg:max-w-4xl">
                                <ReviewSummary />
                                <AddReviewForm />
                                <ReviewsList />
                            </div>
                        )}

                        {/* Tab Content: Videos */}
                        {activeTab === 'videos' && productData.videos?.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-full lg:max-w-5xl">
                                {productData.videos.map((video, i) => (
                                    <div key={i} className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video">
                                        <video controls className="w-full h-full" poster={productData.image?.[0]}>
                                            <source src={video} type="video/mp4" />
                                            Your browser does not support video.
                                        </video>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab Content: Manufacturer Details */}
                        {activeTab === 'manufacturer' && productData.manufacturerDetails && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 text-gray-700 leading-relaxed whitespace-pre-line shadow-inner max-w-full lg:max-w-4xl text-sm sm:text-base">
                                {productData.manufacturerDetails}
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================== RELATED PRODUCTS ==================== */}
                <div className="mt-12 md:mt-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 border-b border-gray-200 pb-2 sm:pb-3">You Might Also Like</h2>
                    <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
                </div>
            </div>
        </div>
    );
};

export default Product;