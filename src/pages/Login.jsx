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
    confirmPassword: '',
    otp: ''
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [resetToken, setResetToken] = useState('');

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
        }
      } else {
        const endpoint = currentState === 'Sign Up' ? '/api/user/register' : '/api/user/login';
        response = await axios.post(`${backendUrl}${endpoint}`, { 
          ...formData,
          otp: formData.otp 
        });

        if (response.data.success) {
          handleAuthSuccess(response.data);
          setShowOtpModal(false);
        }
      }
    } catch (error) {
      console.error(error);
      // toast.error(error.response?.data?.message || 'OTP verification failed');
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
    
    toast.success(`${currentState} successful!`);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {!forgotPasswordMode ? (
          <>
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {currentState === 'Login' ? 'Sign in to your account' : 'Create a new account'}
              </h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {currentState === 'Sign Up' && (
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={currentState === 'Login' ? 'current-password' : 'new-password'}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
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
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setCurrentState(prev => prev === 'Login' ? 'Sign Up' : 'Login')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {currentState === 'Login' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Processing...</span>
                  ) : (
                    <span>{currentState === 'Login' ? 'Sign in' : 'Sign up'}</span>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Reset Your Password
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {resetToken ? 'Enter your new password' : 'Enter your email to receive a reset OTP'}
              </p>
            </div>

            <form 
              className="mt-8 space-y-6" 
              onSubmit={resetToken ? handleResetPassword : handleForgotPassword}
            >
              {!resetToken ? (
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="newPassword" className="sr-only">New Password</label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        minLength="8"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Confirm Password"
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
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Back to {currentState === 'Login' ? 'Login' : 'Sign Up'}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Processing...</span>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h3 className="text-xl font-semibold mb-4">
                {forgotPasswordMode ? 'Password Reset Verification' : 'Email Verification'}
              </h3>
              <p className="mb-4">
                We've sent a 6-digit OTP to <strong>{formData.email}</strong>. 
                Please enter it below to {forgotPasswordMode ? 'reset your password' : 'verify your email'}.
              </p>
              
              <form onSubmit={handleOtpSubmit}>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 border rounded mb-4 text-center text-lg font-mono"
                  maxLength="6"
                  pattern="\d{6}"
                  required
                />
                
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpCountdown > 0 || isLoading}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend OTP'}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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
  );
};

export default Login;