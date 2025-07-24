
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80')`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Forgot Password Card */}
      <div className="relative z-10 bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="p-2 -ml-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">Forgot Password</h1>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Enter your email or phone number and we'll send you an OTP to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter your email or phone number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Sending OTP...
              </div>
            ) : (
              'Send OTP'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
