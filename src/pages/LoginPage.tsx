
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Check, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrganizationsByEmail, loginUser, saveUser, saveToken, saveBaseUrl, Organization } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import cityscapeBackground from '@/assets/cityscape-background.jpg';
import lockatedLogo from '@/assets/lockated-logo.png';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleEmailSubmit = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const orgs = await getOrganizationsByEmail(email);
      setOrganizations(orgs);
      setCurrentStep(2);
      if (orgs.length === 0) {
        toast({
          variant: "destructive",
          title: "No Organizations Found",
          description: "No organizations found for this email address.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch organizations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrganizationSelect = (org: Organization) => {
    setSelectedOrganization(org);
    // Save the base URL in the format: sub_domain.domain
    const baseUrl = `${org.sub_domain}.${org.domain}`;
    saveBaseUrl(baseUrl);
    setCurrentStep(3);
  };

  const handleLogin = async () => {
    if (!email || !password || !selectedOrganization) return;
    
    setLoginLoading(true);
    try {
      const baseUrl = `${selectedOrganization.sub_domain}.${selectedOrganization.domain}`;
      const response = await loginUser(email, password, baseUrl);
      
      // Save user data and token to localStorage
      saveUser({
        id: response.id,
        email: response.email,
        firstname: response.firstname,
        lastname: response.lastname
      });
      saveToken(response.access_token);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setOrganizations([]);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setSelectedOrganization(null);
    }
  };

  const renderStepIndicator = () => (
    <div className="text-center mb-8">
      <div className="flex justify-center items-center space-x-3 mb-3">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step === currentStep
                ? 'bg-yellow-500 text-black shadow-lg transform scale-110'
                : step < currentStep
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-500/50 text-gray-300 border border-gray-400/30'
            }`}
          >
            {step < currentStep ? <Check size={18} /> : step}
          </div>
        ))}
      </div>
      <p className="text-gray-400 text-sm font-medium">
        Step {currentStep} of 3
      </p>
    </div>
  );

  const renderEmailStep = () => (
    <>
      <h2 className="text-2xl font-medium text-white mb-8 text-center">
        Enter your email address
      </h2>
      <div className="space-y-6">
        <TextField
          variant="outlined"
          placeholder="Email / Mobile"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            ...muiFieldStyles,
            '& .MuiOutlinedInput-root': {
              ...muiFieldStyles['& .MuiOutlinedInput-root'],
              height: '60px',
              borderRadius: '16px',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
        />
        <Button
          onClick={handleEmailSubmit}
          disabled={!email || isLoading}
          className="w-full h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
        >
          {isLoading ? 'Finding Organizations...' : 'CONTINUE'}
        </Button>
      </div>
    </>
  );

  const renderOrganizationStep = () => (
    <>
      <div className="flex items-center mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-2xl font-medium text-white ml-3">
          Select Organization
        </h2>
      </div>
      <p className="text-gray-400 text-sm mb-8">
        Email: <span className="text-white font-medium">{email}</span>
      </p>
      
      <div className="space-y-4 mb-6">
        {organizations.map((org) => (
          <div
            key={org.id}
            onClick={() => handleOrganizationSelect(org)}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-yellow-500/50 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                {org.logo?.url ? (
                  <img 
                    src={`https://uat.lockated.com${org.logo.url}`} 
                    alt={`${org.name} logo`}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Building2 className="text-black" size={26} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">{org.name}</h3>
                <p className="text-gray-400 text-sm">{org.domain}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {organizations.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <Building2 className="mx-auto mb-4 text-gray-500" size={48} />
          <p className="text-lg">No organizations found for this email address.</p>
        </div>
      )}
    </>
  );

  const renderPasswordStep = () => (
    <>
      <div className="flex items-center mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-2xl font-medium text-white ml-3">
          Enter Password
        </h2>
      </div>
      
      {selectedOrganization && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-white/10">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
              {selectedOrganization.logo?.url ? (
                <img 
                  src={`https://uat.lockated.com${selectedOrganization.logo.url}`} 
                  alt={`${selectedOrganization.name} logo`}
                  className="w-7 h-7 object-contain"
                />
              ) : (
                <Building2 className="text-black" size={22} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">{selectedOrganization.name}</h3>
              <p className="text-gray-400 text-sm">{email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <TextField
          variant="outlined"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            ...muiFieldStyles,
            '& .MuiOutlinedInput-root': {
              ...muiFieldStyles['& .MuiOutlinedInput-root'],
              height: '60px',
              borderRadius: '16px',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />

        {/* Terms and Privacy */}
        <div className="text-center text-sm text-gray-400 leading-relaxed">
          By clicking Log in you are accepting our{' '}
          <span className="text-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors duration-200">
            Privacy Policy
          </span>{' '}
          & agree to the{' '}
          <span className="text-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors duration-200">
            Terms & Conditions
          </span>
          .
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={!password || loginLoading}
          className="w-full h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
        >
          {loginLoading ? 'Logging in...' : 'LOGIN'}
        </Button>

        {/* Forgot Password */}
        <div className="text-center">
          <span className="text-gray-400 hover:text-yellow-400 cursor-pointer text-sm transition-colors duration-200">
            Forgot Password?
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${cityscapeBackground})`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
      
      {/* Login Card */}
      <div className="relative z-10 bg-slate-800/95 backdrop-blur-lg rounded-3xl p-10 w-full max-w-lg mx-4 shadow-2xl border border-white/10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <MapPin className="text-black" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wider">
            LOCKATED
          </h1>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <div className="space-y-6">
          {currentStep === 1 && renderEmailStep()}
          {currentStep === 2 && renderOrganizationStep()}
          {currentStep === 3 && renderPasswordStep()}
        </div>
      </div>
    </div>
  );
};
