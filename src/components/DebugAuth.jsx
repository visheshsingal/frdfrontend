import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const DebugAuth = () => {
  const { token, user } = useContext(ShopContext);

  const checkLocalStorage = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('=== DEBUG AUTH STATUS ===');
    console.log('Context token:', token ? 'EXISTS' : 'NULL');
    console.log('Context user:', user);
    console.log('localStorage token:', savedToken ? 'EXISTS' : 'NULL');
    console.log('localStorage user:', savedUser);
    
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token expires:', new Date(payload.exp * 1000));
        console.log('Current time:', new Date());
        console.log('Token expired?', payload.exp < Date.now() / 1000);
      } catch (error) {
        console.log('Error parsing token:', error);
      }
    }
    console.log('========================');
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#000',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>Token: {token ? '✅' : '❌'}</div>
      <div>User: {user?.email || '❌'}</div>
      <button onClick={checkLocalStorage} style={{
        background: '#007bff',
        color: 'white',
        border: 'none',
        padding: '5px',
        margin: '2px',
        borderRadius: '3px',
        cursor: 'pointer'
      }}>
        Debug
      </button>
      <button onClick={clearAuth} style={{
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '5px',
        margin: '2px',
        borderRadius: '3px',
        cursor: 'pointer'
      }}>
        Clear
      </button>
    </div>
  );
};

export default DebugAuth;