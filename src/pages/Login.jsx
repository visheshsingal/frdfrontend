import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const { token, setToken, navigate, backendUrl, setUser  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    otp: ''
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [resetToken, setResetToken] = useState('');
  const [requiresOTP, setRequiresOTP] = useState(false);

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

  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = currentState === 'Sign Up' ? '/api/user/register' : '/api/user/login';
      const payload = currentState === 'Sign Up' 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (response.data.requiresOTP) {
        setShowOtpModal(true);
        setOtpCountdown(60);
        setRequiresOTP(true);
        toast.info('OTP sent to your email');
      } else if (response.data.success) {
        handleAuthSuccess(response.data);
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Login failed');
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
        setShowOtpModal(true);
        setOtpCountdown(60);
        setRequiresOTP(true);
        toast.info('Password reset OTP sent to your email');
      } else {
        toast.error(response.data.message || 'Failed to send reset OTP');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send reset OTP');
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
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: '',
          otp: ''
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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      
      if (forgotPasswordMode) {
        response = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, {
          email: formData.email,
          otp: formData.otp
        });
        
        if (response.data.success) {
          setResetToken(response.data.resetToken);
          setShowOtpModal(false);
          setRequiresOTP(false);
          toast.success('OTP verified successfully!');
        }
      } else {
        // For login with OTP verification
        response = await axios.post(`${backendUrl}/api/user/verify-otp`, { 
          email: formData.email,
          otp: formData.otp 
        });

        if (response.data.success) {
          if (currentState === 'Sign Up') {
            // After successful signup with OTP
            toast.success('Account created successfully! Please login with your credentials.');
            setCurrentState('Login');
            setShowOtpModal(false);
            setRequiresOTP(false);
            setFormData({
              name: '',
              email: '',
              password: '',
              newPassword: '',
              confirmPassword: '',
              otp: ''
            });
          } else {
            // For login - THIS IS THE FIXED PART
            handleAuthSuccess(response.data);
            setShowOtpModal(false);
            setRequiresOTP(false);
            toast.success('Login successful!');
          }
        }
      }
    // } catch (error) {
    //   console.error(error);
    //   toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const endpoint = forgotPasswordMode ? '/api/user/forgot-password' : '/api/user/send-otp';
      const response = await axios.post(`${backendUrl}${endpoint}`, { 
        email: formData.email 
      });

      if (response.data.success) {
        setOtpCountdown(60);
        toast.success('New OTP sent to your email');
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleAuthSuccess = (data) => {
    setToken(data.token);
    localStorage.setItem('token', data.token);
    
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Left side - Image Carousel (Visible on both desktop and mobile) */}
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
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Transform Your Body</h2>
                <p className="text-lg md:text-xl text-gray-300">
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
                index === currentImageIndex ? 'bg-green-400' : 'bg-gray-600'
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl border border-gray-800">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              {!forgotPasswordMode 
                ? (currentState === 'Login' ? 'Welcome Back!' : 'Create Account') 
                : 'Reset Password'}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {!forgotPasswordMode 
                ? (currentState === 'Login' 
                    ? 'Sign in to continue your fitness journey' 
                    : 'Join us and start transforming your body today')
                : 'Recover your account access'}
            </p>
          </div>

          {!forgotPasswordMode ? (
            <>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {currentState === 'Sign Up' && (
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className="rounded-md shadow-sm -space-y-px">
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={currentState === 'Login' ? 'current-password' : 'new-password'}
                      required
                      className="relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={currentState === 'Sign Up' ? 8 : undefined}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {currentState === 'Login' && (
                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setForgotPasswordMode(true)}
                        className="font-medium text-green-400 hover:text-green-300 transition-colors"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setCurrentState(prev => prev === 'Login' ? 'Sign Up' : 'Login')}
                      className="font-medium text-green-400 hover:text-green-300 transition-colors"
                    >
                      {currentState === 'Login' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
              </form>

              {/* Social login options */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    {/* <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span> */}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {/* Social login buttons can be added here */}
                </div>
              </div>
            </>
          ) : (
            <>
              <form 
                className="mt-8 space-y-6" 
                onSubmit={resetToken ? handleResetPassword : handleForgotPassword}
              >
                {!resetToken ? (
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md shadow-sm -space-y-px">
                      <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          required
                          className="relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter new password"
                          value={formData.newPassword}
                          onChange={handleChange}
                          minLength="8"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          className="relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          minLength="8"
                        />
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
                      className="font-medium text-green-400 hover:text-green-300 transition-colors"
                    >
                      Back to {currentState === 'Login' ? 'Login' : 'Sign Up'}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span>{resetToken ? 'Reset Password' : 'Send Reset OTP'}</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* OTP Modal */}
          {showOtpModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 p-6 rounded-xl max-w-sm w-full border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {forgotPasswordMode ? 'Password Reset Verification' : 'Email Verification'}
                </h3>
                <p className="mb-4 text-gray-400">
                  We've sent a 6-digit OTP to <strong className="text-green-400">{formData.email}</strong>. 
                  Please enter it below to {forgotPasswordMode ? 'reset your password' : 'verify your email'}.
                </p>
                
                <form onSubmit={handleOtpSubmit}>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg mb-4 text-center text-lg font-mono tracking-widest bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    maxLength="6"
                    pattern="\d{6}"
                    required
                  />
                  
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpCountdown > 0 || isLoading}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend OTP'}
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;