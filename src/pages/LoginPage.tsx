
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
    <div className="text-center mb-6">
      <div className="flex justify-center items-center space-x-3 mb-3">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
              step === currentStep
                ? 'bg-slate-600 text-slate-200 border border-slate-500'
                : step < currentStep
                ? 'bg-slate-700 text-slate-300 border border-slate-600'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            {step < currentStep ? <Check size={14} /> : step}
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-xs">
        Step {currentStep} of 3
      </p>
    </div>
  );

  const renderEmailStep = () => (
    <>
      <h2 className="text-xl font-medium text-slate-200 mb-6 text-center">
        Enter your email address
      </h2>
      <div className="space-y-4">
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
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
        />
        <Button
          onClick={handleEmailSubmit}
          disabled={!email || isLoading}
          className="w-full h-12 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-xl transition-all duration-200 border border-slate-500/50 disabled:opacity-50"
        >
          {isLoading ? 'Finding Organizations...' : 'CONTINUE'}
        </Button>
      </div>
    </>
  );

  const renderOrganizationStep = () => (
    <>
      <div className="flex items-center mb-5">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
        >
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-xl font-medium text-slate-200 ml-3">
          Select Organization
        </h2>
      </div>
      <p className="text-slate-400 text-sm mb-6">
        Email: <span className="text-slate-200">{email}</span>
      </p>
      
      <div className="space-y-3 mb-6">
        {organizations.map((org) => (
          <div
            key={org.id}
            onClick={() => handleOrganizationSelect(org)}
            className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mr-4">
                {org.logo?.url ? (
                  <img 
                    src={`https://uat.lockated.com${org.logo.url}`} 
                    alt={`${org.name} logo`}
                    className="w-7 h-7 object-contain"
                  />
                ) : (
                  <Building2 className="text-slate-300" size={22} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-slate-200 font-medium">{org.name}</h3>
                <p className="text-slate-400 text-sm">{org.domain}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {organizations.length === 0 && (
        <div className="text-center text-slate-400 py-8">
          <Building2 className="mx-auto mb-3 text-slate-500" size={40} />
          <p>No organizations found for this email address.</p>
        </div>
      )}
    </>
  );

  const renderPasswordStep = () => (
    <>
      <div className="flex items-center mb-5">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
        >
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-xl font-medium text-slate-200 ml-3">
          Enter Password
        </h2>
      </div>
      
      {selectedOrganization && (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-600/50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-3">
              {selectedOrganization.logo?.url ? (
                <img 
                  src={`https://uat.lockated.com${selectedOrganization.logo.url}`} 
                  alt={`${selectedOrganization.name} logo`}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <Building2 className="text-slate-300" size={18} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-slate-200 font-medium">{selectedOrganization.name}</h3>
              <p className="text-slate-400 text-sm">{email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
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
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />

        {/* Terms and Privacy */}
        <div className="text-center text-xs text-slate-400 leading-relaxed">
          By clicking Log in you are accepting our{' '}
          <span className="text-slate-300 hover:text-slate-200 cursor-pointer transition-colors duration-200">
            Privacy Policy
          </span>{' '}
          & agree to the{' '}
          <span className="text-slate-300 hover:text-slate-200 cursor-pointer transition-colors duration-200">
            Terms & Conditions
          </span>
          .
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={!password || loginLoading}
          className="w-full h-12 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-xl transition-all duration-200 border border-slate-500/50 disabled:opacity-50"
        >
          {loginLoading ? 'Logging in...' : 'LOGIN'}
        </Button>

        {/* Forgot Password */}
        <div className="text-center">
          <span className="text-slate-400 hover:text-slate-300 cursor-pointer text-sm transition-colors duration-200">
            Forgot Password?
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Background Image with subtle overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url(${cityscapeBackground})`
        }}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/90 to-slate-900/80" />
      
      {/* Login Card */}
      <div className="relative z-10 bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl border border-slate-700/50">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center shadow-sm">
              <MapPin className="text-slate-200" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-slate-200 tracking-wide">
            LOCKATED
          </h1>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <div className="space-y-4">
          {currentStep === 1 && renderEmailStep()}
          {currentStep === 2 && renderOrganizationStep()}
          {currentStep === 3 && renderPasswordStep()}
        </div>
      </div>
    </div>
  );
};
