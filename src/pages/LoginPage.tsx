
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { loginWithEmail, loginWithPhone, saveUser, saveToken } from '@/utils/auth';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'email') {
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please enter both email and password.",
        });
        return;
      }
    } else {
      if (!phone || !password) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please enter both phone number and password.",
        });
        return;
      }
    }

    setIsLoading(true);
    
    try {
      if (loginMethod === 'email') {
        const response = await loginWithEmail(email, password);
        
        // Save user data and token
        saveUser({
          id: response.id,
          email: response.email,
          firstname: response.firstname,
          lastname: response.lastname
        });
        saveToken(response.access_token);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.firstname}!`,
        });
        
        navigate('/');
      } else {
        const response = await loginWithPhone(phone, password);
        
        if (response.success) {
          toast({
            title: "OTP Sent",
            description: response.message,
          });
          
          navigate('/otp-verification');
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
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
            backgroundImage: `url('/lovable-uploads/44a1bf2e-5f89-4408-91c4-421c8734246d.png')`,
          }}
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full max-w-lg bg-white bg-opacity-90 flex flex-col justify-center px-12 py-12">
        {/* Logo and Branding */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold">
            <span className="text-red-600">go</span>
            <span className="text-black">Phygital.work</span>
          </h1>
        </div>

        {/* Login Method Radio Buttons */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="email"
              name="loginMethod"
              value="email"
              checked={loginMethod === 'email'}
              onChange={() => setLoginMethod('email')}
              className="w-5 h-5 text-red-600 border-gray-400 focus:ring-red-500"
            />
            <label htmlFor="email" className="ml-3 text-base font-medium text-gray-900">
              Login with Email
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="phone"
              name="loginMethod"
              value="phone"
              checked={loginMethod === 'phone'}
              onChange={() => setLoginMethod('phone')}
              className="w-5 h-5 text-red-600 border-gray-400 focus:ring-red-500"
            />
            <label htmlFor="phone" className="ml-3 text-base font-medium text-gray-900">
              Login with Phone no.
            </label>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {loginMethod === 'email' ? (
            <div>
              <Input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                required
              />
            </div>
          ) : (
            <div>
              <Input
                type="tel"
                placeholder="Enter your Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-14 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                required
              />
            </div>
          )}

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-4 pr-12 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-base mt-8"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-gray-700 hover:text-gray-900 text-base font-medium"
          >
            Forgot Password ?
          </button>
        </div>

        {/* Terms & Condition Link */}
        <div className="text-center mt-8">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 text-base"
          >
            <span className="text-blue-500">Terms</span> <span className="text-gray-700">&</span> <span className="text-blue-500">Condition</span>
          </button>
        </div>
      </div>
    </div>
  );
};
