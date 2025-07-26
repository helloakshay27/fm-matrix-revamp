
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendForgotPasswordOTP } from '@/utils/auth';
import { ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailOrPhone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter your email or phone number.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await sendForgotPasswordOTP(emailOrPhone);
      
      if (response.success) {
        toast({
          title: "OTP Sent",
          description: response.message,
        });
        
        navigate('/forgot-password-otp');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Right Side - Forgot Password Form */}
      <div className="w-full max-w-lg bg-white bg-opacity-90 flex flex-col justify-center px-12 py-12">
        {/* Logo and Branding */}
        <div className="mb-12">
           <img
                src="https://india.lockated.co/wp-content/uploads/lockated-logo-nw.png"
                alt="Logo"
                className="h-12 mx-auto"
              />
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Forgot Password</h2>
          <p className="text-gray-600 leading-relaxed">
            Enter your registered email or mobile and we'll send you an OTP to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Enter Your Email Id or Mobile No."
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full h-14 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-base mt-8"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Sending...
              </div>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-gray-700 hover:text-gray-900 text-base font-medium"
          >
            BACK TO LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};
