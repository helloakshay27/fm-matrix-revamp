
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

      {/* Login Card */}
      <div className="relative z-10 bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">goPhygital.work</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Method Toggle */}
        <div className="mb-6">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login with Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'phone'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login with Phone no.
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {loginMethod === 'email' ? (
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
          ) : (
            <div>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
                required
              />
            </div>
          )}

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
};
