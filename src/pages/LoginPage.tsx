
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';

const muiFieldStyles = {
  width: '100%',
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    height: '56px',
    borderRadius: '28px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: 'transparent'
    },
    '&:hover fieldset': {
      borderColor: 'transparent'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent'
    }
  },
  '& .MuiInputLabel-root': {
    color: '#999999',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#999999'
    }
  },
  '& .MuiOutlinedInput-input': {
    color: '#333333',
    fontSize: '16px',
    padding: '16px 20px',
    '&::placeholder': {
      color: '#999999',
      opacity: 1
    }
  }
};

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt:', { email, password });
    // Add your login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      {/* Login Card */}
      <div className="relative z-10 bg-slate-700 bg-opacity-90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="https://app.lockated.com/assets/logo-87235e425cea36e6c4c9386959ec756051a0331c3a77aa6826425c1d9fabf82e.png"
            alt="Lockated Logo"
            className="mx-auto mb-4 h-16 w-auto"
          />
          <h1 className="text-white text-2xl font-bold">LOCKATED</h1>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <TextField
            variant="outlined"
            placeholder="Email / Mobile"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={muiFieldStyles}
          />
          
          <TextField
            variant="outlined"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={muiFieldStyles}
          />

          {/* Terms and Privacy */}
          <div className="text-center text-sm text-gray-300 mb-6">
            By clicking Log in you are accepting our{' '}
            <span className="text-blue-300 hover:underline cursor-pointer">
              Privacy Policy
            </span>{' '}
            & agree to the{' '}
            <span className="text-blue-300 hover:underline cursor-pointer">
              Terms & Conditions
            </span>
            .
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full text-lg"
          >
            LOGIN
          </Button>

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <span className="text-gray-300 hover:text-white cursor-pointer text-sm">
              Forgot Password?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
