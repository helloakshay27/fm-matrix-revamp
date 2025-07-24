import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/02d5802a-cd33-44e2-a858-a1e149cace5f.png')`,
          }}
        />
      </div>

      {/* Right Side - Success Message */}
      <div className="w-full max-w-lg bg-white bg-opacity-90 flex flex-col justify-center items-center px-12 py-12">
        {/* Logo and Branding */}
        <div className="mb-12 self-start">
          <h1 className="text-3xl font-bold">
            <span className="text-red-600">go</span>
            <span className="text-black">Phygital.work</span>
          </h1>
        </div>

        {/* Success Icon and Message */}
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Password reset successfully!</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            You can now log in with your new password
          </p>

          <Button
            onClick={() => navigate('/login')}
            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-base"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};