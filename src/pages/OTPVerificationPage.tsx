
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { verifyOTP, saveUser, saveToken } from '@/utils/auth';
import { ArrowLeft } from 'lucide-react';

export const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await verifyOTP(otp);
      
      // Save user data and token
      saveUser({
        id: response.id,
        email: response.email,
        firstname: response.firstname,
        lastname: response.lastname,
        phone: response.phone
      });
      saveToken(response.access_token);
      
      navigate('/login-success');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setTimeLeft(30);
    
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your phone number.",
    });
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

      {/* Right Side - OTP Verification Form */}
      <div className="w-full max-w-lg bg-white bg-opacity-90 flex flex-col justify-center px-12 py-12">
        {/* Logo and Branding */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold">
            <span className="text-red-600">go</span>
            <span className="text-black">Phygital.work</span>
          </h1>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">OTP Verification</h2>
          <p className="text-gray-600 leading-relaxed">
            We've sent a 6-digit confirmation code on your email id. 
            Make sure you enter the correct code.
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="w-full"
          >
            <InputOTPGroup className="w-full justify-center gap-3">
              <InputOTPSlot index={0} className="w-12 h-14 text-lg border-2 border-gray-300 rounded-lg" />
              <InputOTPSlot index={1} className="w-12 h-14 text-lg border-2 border-gray-300 rounded-lg" />
              <InputOTPSlot index={2} className="w-12 h-14 text-lg border-2 border-gray-300 rounded-lg" />
              <InputOTPSlot index={3} className="w-12 h-14 text-lg border-2 border-gray-300 rounded-lg" />
              <InputOTPSlot index={4} className="w-12 h-14 text-lg border-2 border-gray-300 rounded-lg" />
              <InputOTPSlot index={5} className="w-12 h-14 text-lg border-2 border-gray-300 rounded-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-base mt-8"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              Verifying...
            </div>
          ) : (
            'Verify OTP'
          )}
        </Button>

        {/* Resend OTP */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm mb-2">
            {canResend ? (
              <button
                onClick={handleResendOTP}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Resend code in 0:45
              </button>
            ) : (
              `Resend code in 0:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`
            )}
          </p>
        </div>

        {/* Error Message */}
        <div className="text-center mt-4">
          <p className="text-red-600 text-sm">
            Entered wrong email id? <button onClick={() => navigate('/forgot-password')} className="font-medium underline">GO BACK</button>
          </p>
        </div>
      </div>
    </div>
  );
};
