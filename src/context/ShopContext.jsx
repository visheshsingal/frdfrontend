import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(() => {
        // Initialize token from localStorage if available
        const savedToken = localStorage.getItem('token');
        
        if (savedToken) {
            try {
                // Check if token is expired
                const payload = JSON.parse(atob(savedToken.split('.')[1]));
                const currentTime = Date.now() / 1000;
                
                if (payload.exp && payload.exp < currentTime) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    return '';
                }
                return savedToken;
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return '';
            }
        }
        return '';
    })
    const [user, setUser] = useState(() => {
        // Initialize user from localStorage if available
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        // if (!size) {
        //     toast.error('Select Product Size');
        //     return;
        // }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                            // If variant price exists, prefer it
                            let unitPrice = itemInfo.price;
                            const variantIdx = item !== '' ? Number(item) : null;
                            if (variantIdx !== null && itemInfo.variants && itemInfo.variants[variantIdx]) {
                                const variant = itemInfo.variants[variantIdx];
                                unitPrice = (variant.price !== undefined && variant.price !== null) ? Number(variant.price) : Number(itemInfo.price);
                                // apply variant discount if present, else product discount
                                const vDisc = (variant.discount !== undefined && variant.discount !== null && variant.discount !== '') ? Number(variant.discount) : Number(itemInfo.discount || 0);
                                if (vDisc > 0) {
                                    unitPrice = Math.round(unitPrice - (unitPrice * vDisc / 100));
                                }
                            } else {
                                // product-level discount
                                const pDisc = Number(itemInfo.discount || 0);
                                if (pDisc > 0) unitPrice = Math.round(unitPrice - (unitPrice * pDisc / 100));
                            }
                            totalAmount += unitPrice * cartItems[items][item];
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                    // backend returns newest first (sorted by date desc); keep that order
                    setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Update localStorage when token changes
    useEffect(() => {
        console.log('🔄 Token changed:', token ? 'SET' : 'CLEARED');
        if (token) {
            console.log('💾 Saving token to localStorage');
            localStorage.setItem('token', token);
        } else {
            console.log('🗑️ Removing token from localStorage');
            localStorage.removeItem('token');
        }
    }, [token]);

    // Update localStorage when user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        // Only load from localStorage if token is not already set
        if (!token) {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    // Check if token is expired
                    const payload = JSON.parse(atob(savedToken.split('.')[1]));
                    const currentTime = Date.now() / 1000;
                    if (payload.exp && payload.exp < currentTime) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        return;
                    }
                    setToken(savedToken);
                    
                    // Also load user from localStorage
                    const savedUser = localStorage.getItem('user');
                    if (savedUser) {
                        try {
                            setUser(JSON.parse(savedUser));
                        } catch (e) {
                            localStorage.removeItem('user');
                        }
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        }
        
        if (token) {
            getUserCart(token);
        }
    }, [])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token,
        user, setUser // Added these missing states
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;

