
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Check } from 'lucide-react';

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

interface Organization {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Tech Solutions Inc.',
    description: 'Technology & Software'
  },
  {
    id: '2',
    name: 'Global Manufacturing Co.',
    description: 'Manufacturing & Production'
  },
  {
    id: '3',
    name: 'Healthcare Partners',
    description: 'Healthcare Services'
  }
];

export const LoginPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async () => {
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call to fetch organizations
    setTimeout(() => {
      setOrganizations(mockOrganizations);
      setCurrentStep(2);
      setIsLoading(false);
    }, 1000);
  };

  const handleOrganizationSelect = (org: Organization) => {
    setSelectedOrganization(org);
    setCurrentStep(3);
  };

  const handleLogin = () => {
    console.log('Login attempt:', { 
      email, 
      organization: selectedOrganization?.name, 
      password 
    });
    // Add your final login logic here
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
      <div className="flex justify-center items-center space-x-2 mb-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? 'bg-yellow-500 text-black'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {step < currentStep ? <Check size={16} /> : step}
          </div>
        ))}
      </div>
      <p className="text-gray-300 text-sm">
        Step {currentStep} of 3
      </p>
    </div>
  );

  const renderEmailStep = () => (
    <>
      <h2 className="text-xl font-semibold text-white mb-6 text-center">
        Enter your email address
      </h2>
      <TextField
        variant="outlined"
        placeholder="Email / Mobile"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={muiFieldStyles}
        onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
      />
      <Button
        onClick={handleEmailSubmit}
        disabled={!email || isLoading}
        className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full text-lg"
      >
        {isLoading ? 'Finding Organizations...' : 'CONTINUE'}
      </Button>
    </>
  );

  const renderOrganizationStep = () => (
    <>
      <div className="flex items-center mb-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white p-1"
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-white ml-2">
          Select Organization
        </h2>
      </div>
      <p className="text-gray-300 text-sm mb-6">
        Email: <span className="text-white">{email}</span>
      </p>
      
      <div className="space-y-3 mb-6">
        {organizations.map((org) => (
          <div
            key={org.id}
            onClick={() => handleOrganizationSelect(org)}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-opacity-20 transition-all duration-200 border border-transparent hover:border-yellow-500"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                <Building2 className="text-black" size={24} />
              </div>
              <div>
                <h3 className="text-white font-medium">{org.name}</h3>
                {org.description && (
                  <p className="text-gray-300 text-sm">{org.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {organizations.length === 0 && (
        <div className="text-center text-gray-300 py-8">
          <p>No organizations found for this email address.</p>
        </div>
      )}
    </>
  );

  const renderPasswordStep = () => (
    <>
      <div className="flex items-center mb-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white p-1"
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-white ml-2">
          Enter Password
        </h2>
      </div>
      
      {selectedOrganization && (
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="text-black" size={20} />
            </div>
            <div>
              <h3 className="text-white font-medium">{selectedOrganization.name}</h3>
              <p className="text-gray-300 text-sm">{email}</p>
            </div>
          </div>
        </div>
      )}

      <TextField
        variant="outlined"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={muiFieldStyles}
        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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
        disabled={!password}
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
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/6493936/pexels-photo-6493936.jpeg')`
        }}
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
            className="mx-auto mb-4 h-20 w-auto"
          />
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
