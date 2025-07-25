import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrganizationsByEmail, loginUser, saveUser, saveToken, saveBaseUrl, Organization } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';

const muiFieldStyles = {
  width: "100%",
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    height: "56px",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",
    "& fieldset": {
      borderColor: "#e2e8f0",
    },
    "&:hover fieldset": {
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  "& .MuiInputLabel-root": {
    color: "#64748b",
    fontSize: "15px",
    "&.Mui-focused": {
      color: "#C72030",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#1e293b",
    fontSize: "15px",
    padding: "16px 20px",
    "&::placeholder": {
      color: "#94a3b8",
      opacity: 1,
    },
  },
};


export const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address.",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

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
    localStorage.setItem("baseUrl", `${org.sub_domain}.${org.domain}`);
    setSelectedOrganization(org);
    // Save the base URL in the format: sub_domain.domain
    const baseUrl = `${org.sub_domain}.${org.domain}`;
    saveBaseUrl(baseUrl);
    setCurrentStep(3);
  };

  const handleLogin = async () => {
    if (!email || !password || !selectedOrganization) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter all required information.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setLoginLoading(true);
    try {
      const baseUrl = `${selectedOrganization.sub_domain}.${selectedOrganization.domain}`;
      const response = await loginUser(email, password, baseUrl);

      if (!response || !response.access_token) {
        throw new Error("Invalid response received from server");
      }

      // Save user data and token to localStorage
      saveUser({
        id: response.id,
        email: response.email,
        firstname: response.firstname,
        lastname: response.lastname
      });
      saveToken(response.access_token);
      saveBaseUrl(baseUrl);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.firstname}!`,
        duration: 3000,
      });

      // Add a slight delay for better UX, then redirect to dashboard
      setTimeout(() => {
        navigate('/maintenance/asset');
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        duration: 5000,
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
      <div className="flex justify-center items-center space-x-4 mb-3">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all transform ${step === currentStep
              ? "bg-[#C72030] text-white shadow-lg scale-110"
              : step < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-400"
              }`}
          >
            {step < currentStep ? (
              <Check className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <span className="font-semibold">{step}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className={`h-1 w-16 rounded-full transition-all ${currentStep >= 1 ? "bg-[#C72030]" : "bg-gray-200"}`}></div>
        <div className={`h-1 w-16 rounded-full transition-all ${currentStep >= 2 ? "bg-[#C72030]" : "bg-gray-200"}`}></div>
        <div className={`h-1 w-16 rounded-full transition-all ${currentStep >= 3 ? "bg-[#C72030]" : "bg-gray-200"}`}></div>
      </div>
      <p className="text-gray-400 text-sm mt-3 font-medium">Step {currentStep} of 3</p>
    </div>
  );

  const renderEmailStep = () => (
    <>
      <h2 className="text-lg font-medium text-[#1a1a1a] mb-4">
        Enter your email address
      </h2>
      <TextField
        variant="outlined"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={muiFieldStyles}
        onKeyPress={(e) => e.key === "Enter" && handleEmailSubmit()}
      />
      <Button
        onClick={handleEmailSubmit}
        disabled={!email || isLoading}
        className="w-full h-12 bg-[#C72030] hover:bg-[#a81c29] text-white font-medium rounded-lg text-base mt-2"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            <span>Finding Organizations...</span>
          </div>
        ) : (
          "Continue"
        )}
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
      <p className="text-black-400 text-sm mb-6">
        Email: <span className="text-white">{email}</span>
      </p>

      <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto no-scrollbar">
        {organizations && organizations.map((org) => (
          <div
            key={org.id}
            onClick={() => handleOrganizationSelect(org)}
            className="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] border border-gray-100 hover:border-[#C72030]"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#C72030] bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                {/* {org.logo?.url ? (
                  <img 
                    src={`https://uat.lockated.com${org.logo.url}`} 
                    alt={`${org.name} logo`}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Building2 className="text-[#C72030]" size={24} />
                )} */}

                <Building2 className="text-[#C72030]" size={24} />

              </div>
              <div>
                <h3 className="text-gray-900 font-medium">{org.name}</h3>
                <p className="text-gray-500 text-sm">{org.domain}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!organizations || organizations.length === 0) && (
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
              {/* {selectedOrganization.logo?.url ? (
                <img
                  src={`https://uat.lockated.com${selectedOrganization.logo.url}`}
                  alt={`${selectedOrganization.name} logo`}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <Building2 className="text-black" size={20} />
              )} */}

              <Building2 className="text-black" size={20} />

            </div>
            <div>
              <h3 className="text-black font-medium">{selectedOrganization.name}</h3>
              <p className="text-gray-400 text-sm">{email}</p>
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
        onKeyPress={(e) => e.key === "Enter" && handleLogin()}
      />

      {/* Terms and Privacy */}
      <div className="text-center text-sm text-gray-300 mb-6">
        By clicking Log in you are accepting our{" "}
        <span className="text-blue-300 hover:underline cursor-pointer">
          Privacy Policy
        </span>{" "}
        & agree to the{" "}
        <span className="text-blue-300 hover:underline cursor-pointer">
          Terms & Conditions
        </span>
        .
      </div>

      {/* Login Button */}
      <Button
        onClick={handleLogin}
        disabled={!password || loginLoading}
        className="w-full h-12 bg-[#C72030] hover:bg-[#a81c29] text-white font-semibold rounded-lg text-base transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loginLoading ? (
          <div className="flex items-center justify-center">
            <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            <span>Logging in...</span>
          </div>
        ) : (
          'LOG IN'
        )}
      </Button>

      {/* Forgot Password */}
      <div className="text-center mt-6">
        <button className="text-[#C72030] hover:text-[#a81c29] text-sm font-medium transition-colors" onClick={() => navigate('/forgot-password')}>
          Forgot your password?
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80')`
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Login Card */}
      <div className="relative z-10 bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl backdrop-blur-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 bg-[#C72030] rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">FM</span>
            </div>
          </div>
          <h1 className="text-[#1a1a1a] text-2xl font-bold tracking-tight">Facility Management</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Sign in to your account</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <div className="space-y-4 mt-6">
          {currentStep === 1 && renderEmailStep()}
          {currentStep === 2 && renderOrganizationStep()}
          {currentStep === 3 && renderPasswordStep()}
        </div>
      </div>
    </div>
  );
};