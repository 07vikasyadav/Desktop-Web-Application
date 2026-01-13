import React from 'react';
import AdminLogin from '../components/AdminLogin';

const Login = () => {
  // AdminLogin uses AppContext internally and accepts onLoginSuccess prop
  const handleLoginSuccess = (result) => {
    // No-op here; AppContext will already update auth state
    console.log('Login screen: login success', result);
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
};

export default Login;
