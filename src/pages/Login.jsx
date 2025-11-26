import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const { token, setToken, navigate, backendUrl, setUser } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPurpose, setOtpPurpose] = useState('signup'); // 'signup' | 'login'

  // Fitness-related images from Pexels
  const fitnessImages = [
    "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Auth0 config (Vite env vars)
  const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
  const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const AUTH0_REDIRECT_URI = import.meta.env.VITE_AUTH0_REDIRECT_URI || `${window.location.origin}/auth0/callback`;

  const handleAuth0Redirect = () => {
    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
      toast.error('Auth0 not configured on client. Ask admin to set VITE_AUTH0_* env vars.');
      return;
    }

    // Normalize domain: allow values with or without protocol and trailing slash
    const domainClean = AUTH0_DOMAIN.replace(/^https?:\/\//i, '').replace(/\/$/, '');
    // Basic validation to avoid redirecting to a placeholder/unresolvable host
    const domainValid = /^[a-z0-9.-]*auth0\.com$/i.test(domainClean);
    if (!domainValid) {
      toast.error('Invalid Auth0 domain configured. Please set `VITE_AUTH0_DOMAIN` to your Auth0 tenant domain (example: dev-abc123.us.auth0.com)');
      return;
    }

    const params = new URLSearchParams({
      client_id: AUTH0_CLIENT_ID,
      response_type: 'id_token',
      scope: 'openid profile email',
      redirect_uri: AUTH0_REDIRECT_URI,
      nonce: Math.random().toString(36).slice(2),
      prompt: 'select_account',
      connection: 'google-oauth2'
    });
    // Redirect to Auth0 Universal Login with Google connection (use cleaned domain)
    window.location.href = `https://${domainClean}/authorize?${params.toString()}`;
  };

  // Image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === fitnessImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [fitnessImages.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthSuccess = (data) => {
    console.log('🔐 Login Success Data:', data);
    
    // Set token
    setToken(data.token);
    localStorage.setItem('token', data.token);
    
    if (data.user) {
      // Make sure we have ALL user data including _id
      const userData = {
        _id: data.user._id || data.user.id, // Try both _id and id
        name: data.user.name,
        email: data.user.email,
        isVerified: data.user.isVerified,
        // Include any other user fields
        ...data.user
      };
      
      console.log('👤 Complete user data being stored:', userData);
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      console.warn('⚠️ No user data in login response');
      // If no user data, at least store basic info from form
      const basicUserData = {
        email: formData.email,
        name: formData.name || 'User'
      };
      localStorage.setItem('user', JSON.stringify(basicUserData));
    }
    
    navigate('/');
  };

  // Helper: deep-search an object for the first occurrence of any of the given keys
  // Returns the value if found, otherwise null
  const deepFind = (obj, keys = []) => {
    if (!obj || typeof obj !== 'object') return null;
    const seen = new Set();
    const stack = [obj];
    while (stack.length) {
      const cur = stack.pop();
      if (!cur || typeof cur !== 'object' || seen.has(cur)) continue;
      seen.add(cur);
      for (const k of Object.keys(cur)) {
        try {
          if (keys.includes(k) && cur[k] != null) return cur[k];
        } catch (e) {
          // ignore
        }
        const v = cur[k];
        if (v && typeof v === 'object') stack.push(v);
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = currentState === 'Sign Up' ? '/api/user/register' : '/api/user/login';
      const payload = currentState === 'Sign Up' 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      console.log('📤 Sending request to:', endpoint);
      console.log('📦 Payload:', payload);

      const response = await axios.post(`${backendUrl}${endpoint}`, payload);

      console.log('✅ API Response:', response.data);
      console.log('👤 User object in response:', response.data.user);

      if (response.data.success) {
        // If backend indicates an OTP was sent, only prompt for OTP verification for Sign Up
        if (response.data.emailSent) {
          if (currentState === 'Sign Up') {
            setOtpPurpose('signup');
            setOtpEmail(formData.email);
            setShowOtpModal(true);
            toast.info('OTP sent to your email. Please enter it to verify your account.');
          } else {
                // For Sign In: if backend also returned a token/user (legacy or nested), proceed with login.
                // Otherwise, inform the user that OTP-based sign in is disabled.
                // Try robust detection for token/user anywhere inside the response
                const foundToken = deepFind(response.data, ['token']);
                const foundUser = deepFind(response.data, ['user']);

                if (foundToken || foundUser) {
                  const payload = {
                    token: foundToken || response.data.token,
                    user: foundUser || response.data.user
                  };
                  handleAuthSuccess(payload);
                  toast.success('Login successful!');
                } else {
                  toast.info('OTP-based sign in is disabled. Please sign in using your password.');
                }
          }
        } else {
          // No OTP flow: backend returned token and user data
          handleAuthSuccess(response.data);
          toast.success(currentState === 'Sign Up' ? 'Account created successfully!' : 'Login successful!');
        }
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      console.log('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!otpValue || !otpEmail) return toast.error('Please enter the OTP');
    setIsLoading(true);
    try {
      let endpoint;
      if (otpPurpose === 'login') endpoint = '/api/user/verify-login-otp';
      else if (otpPurpose === 'signup') endpoint = '/api/user/verify-otp';
      else if (otpPurpose === 'forgot') endpoint = '/api/user/verify-forgot-otp';

      const res = await axios.post(`${backendUrl}${endpoint}`, { email: otpEmail, otp: otpValue });
      if (res.data.success) {
        if (otpPurpose === 'forgot') {
          // For forgot-password, backend returns a resetToken
          setResetToken(res.data.resetToken || '');
          toast.success('OTP verified. You can now reset your password.');
          // keep modal closed if user used inline OTP; otherwise close popup
          setShowOtpModal(false);
        } else {
          toast.success('Email verified. Logged in.');
          setShowOtpModal(false);
          handleAuthSuccess(res.data);
        }
      } else {
        toast.error(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    // keep only digits in OTP input
    const v = (e && e.target && e.target.value) ? e.target.value.replace(/[^0-9]/g, '') : '';
    setOtpValue(v);
  };

  const handleSendLoginOtp = async () => {
    if (!formData.email) return toast.error('Please enter your email first');
    setIsLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/send-login-otp`, { email: formData.email });
      if (res.data.success && res.data.emailSent) {
        setOtpPurpose('login');
        setOtpEmail(formData.email);
        setShowOtpModal(true);
        toast.info('OTP sent to your email. Please enter it to log in.');
      } else if (res.data.success && !res.data.emailSent) {
        toast.warn('OTP generated but email sending failed. Check SMTP settings.');
      } else {
        toast.error(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Send login OTP error:', err);
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, {
        email: formData.email
      });

      if (response.data.success) {
        // New flow: backend sends OTP to email. Prompt user to enter OTP.
        setOtpPurpose('forgot');
        setOtpEmail(formData.email);
        toast.info('Password reset code sent to your email. Please enter it to continue.');
      } else {
        toast.error(response.data.message || 'Failed to initiate password reset');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to initiate password reset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
        resetToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.success) {
        toast.success('Password reset successfully! You can now login with your new password.');
        setForgotPasswordMode(false);
        setCurrentState('Login');
        setResetToken('');
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Image Carousel */}
      <div className="flex-1 relative overflow-hidden">
        {fitnessImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
              <img
                src={image}
                alt={`Fitness ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* use a dark translucent overlay so images keep color while text remains readable */}
            <div className="absolute inset-0 bg-black bg-opacity-45 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400">Transform Your Body</h2>
                <p className="text-lg md:text-xl text-slate-200">
                    {index === 0 && "Join thousands of members achieving their fitness goals"}
                    {index === 1 && "Expert trainers and world-class facilities"}
                    {index === 2 && "Start your fitness journey today"}
                  </p>
                </div>
              </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {fitnessImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl border border-gray-200">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
              {!forgotPasswordMode 
                ? (currentState === 'Login' ? 'Welcome Back!' : 'Create Account') 
                : 'Reset Password'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {!forgotPasswordMode 
                ? (currentState === 'Login' 
                    ? 'Sign in to continue your fitness journey' 
                    : 'Join us and start transforming your body today')
                : resetToken ? 'Set your new password' : 'Recover your account access'}
            </p>
          </div>

          {!forgotPasswordMode ? (
            <>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {currentState === 'Sign Up' && (
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-slate-800 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className="rounded-md shadow-sm -space-y-px">
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-slate-800 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={currentState === 'Login' ? 'current-password' : 'new-password'}
                        required
                        className="relative block w-full px-4 py-3 pr-16 border border-gray-300 placeholder-gray-500 text-slate-800 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={currentState === 'Sign Up' ? 8 : undefined}
                      />
                      <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-500">
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {currentState === 'Login' && (
                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setForgotPasswordMode(true)}
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setCurrentState(prev => prev === 'Login' ? 'Sign Up' : 'Login')}
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      {currentState === 'Login' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span>{currentState === 'Login' ? 'Sign in' : 'Sign up'}</span>
                      )}
                  </button>
                  {/* Auth0 social login button (Google) */}
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleAuth0Redirect}
                      className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <img src="/assets/google-logo.png" alt="Google" className="h-5 w-5" onError={(e)=>{e.target.style.display='none'}} />
                      <span>Continue with Google</span>
                    </button>
                  </div>
                </div>
              </form>
              {/* Extra option: send OTP for login */}
              {/* OTP sign-in option removed — OTP flow is only used for Sign Up now */}
            
              {/* OTP Modal */}
              {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
                  <div className="bg-white text-slate-800 p-6 rounded shadow-lg w-96">
                    <h3 className="text-lg font-semibold mb-3">Enter verification code</h3>
                    <p className="text-sm text-gray-300 mb-4">We sent a 6-digit code to <strong>{otpEmail}</strong>. Please enter it below.</p>
                    <form onSubmit={handleVerifyOtp}>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpValue}
                        onChange={handleOtpChange}
                        className="w-full px-3 py-2 rounded mb-3 text-black bg-blue-50 border border-blue-100 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter OTP"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 py-2 bg-blue-600 rounded text-white font-medium">Verify</button>
                        <button type="button" onClick={() => setShowOtpModal(false)} className="flex-1 py-2 bg-gray-400 rounded text-slate-800">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <form 
                className="mt-8 space-y-6" 
                onSubmit={resetToken ? handleResetPassword : handleForgotPassword}
              >
                {!resetToken ? (<>
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">Email address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-slate-800 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  {otpPurpose === 'forgot' && otpEmail && otpEmail === formData.email && !resetToken && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-600 mb-1">Enter OTP</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpValue}
                          onChange={handleOtpChange}
                          className="flex-1 px-3 py-2 rounded text-black bg-blue-50 border border-blue-100 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter OTP"
                        />
                        <button type="button" onClick={handleVerifyOtp} className="py-2 px-4 bg-blue-600 text-white rounded font-medium">Verify</button>
                      </div>
                    </div>
                  )}
                  </>
                ) : (
                  <>
                    <div className="rounded-md shadow-sm -space-y-px">
                      <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
                        <div className="relative">
                          <input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            className="relative block w-full px-4 py-3 pr-16 border border-gray-300 placeholder-gray-500 text-slate-800 bg-gray-50 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            minLength="8"
                          />
                          <button type="button" onClick={() => setShowNewPassword(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-500">{showNewPassword ? 'Hide' : 'Show'}</button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600 mb-1">Confirm Password</label>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            className="relative block w-full px-4 py-3 pr-16 border border-gray-300 placeholder-gray-500 text-slate-800 bg-gray-50 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            minLength="8"
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-500">{showConfirmPassword ? 'Hide' : 'Show'}</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(false);
                        setResetToken('');
                      }}
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Back to {currentState === 'Login' ? 'Login' : 'Sign Up'}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span>{resetToken ? 'Reset Password' : 'Reset Password'}</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;