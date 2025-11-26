import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Auth0Callback = () => {
  const { backendUrl, setToken, setUser, navigate } = useContext(ShopContext);

  useEffect(() => {
    const handle = async () => {
      // Auth0 by default returns values in the URL hash for implicit flow
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hash);
      const id_token = params.get('id_token');
      const error = params.get('error');

      if (error) {
        toast.error('Auth0 error during login');
        navigate('/login');
        return;
      }

      if (!id_token) {
        toast.error('No id_token found in redirect URL');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.post(`${backendUrl}/api/user/auth0`, { id_token });
        if (res.data && res.data.success) {
          const data = res.data;
          setToken(data.token);
          localStorage.setItem('token', data.token);
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          toast.success('Logged in successfully');
          navigate('/');
        } else {
          toast.error(res.data?.message || 'Auth0 login failed');
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth0 callback error:', err);
        toast.error(err.response?.data?.message || 'Auth0 callback failed');
        navigate('/login');
      }
    };

    handle();
  }, [backendUrl, setToken, setUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Signing you in...</h2>
        <p className="text-sm text-gray-500">If you are not redirected, close this page and try again.</p>
      </div>
    </div>
  );
};

export default Auth0Callback;
