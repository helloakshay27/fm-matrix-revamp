import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrganizationsByEmail, loginUser, saveUser, saveToken, saveBaseUrl, Organization } from '@/utils/auth';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");


  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      toast.error("Email Required", {
        description: "Please enter your email address."
      });
      return;
    }


    if (!validateEmail(email)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address."
      });
      return;
    }

    setIsLoading(true);
    try {
      const orgs = await getOrganizationsByEmail(email);
      setOrganizations(orgs);
      setCurrentStep(2);
      if (orgs.length === 0) {
        toast.error("No Organizations Found", {
          description: "No organizations found for this email address."
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to fetch organizations. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handlePhoneSubmit = async () => {
    if (!phone) {
      toast.error("Phone Number Required", {
        description: "Please enter your phone number."
      });
      return;
    }

    setIsLoading(true);
    try {
      const orgs = await getOrganizationsByEmail(phone);
      setOrganizations(orgs);
      setCurrentStep(2);
      if (orgs.length === 0) {
        toast.error("No Organizations Found", {
          description: "No organizations found for this phone number."
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to fetch organizations. Please try again."
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
      toast.error("Missing Information", {
        description: "Please enter all required information."
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Invalid Password", {
        description: "Password must be at least 6 characters long."
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
      localStorage.setItem("userId", response.id.toString());
      toast.success("Login Successful", {
        description: `Welcome back, ${response.firstname}!`
      });

      // Add a slight delay for better UX, then redirect to dashboard
      setTimeout(() => {
        navigate('/maintenance/asset');
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login Failed", {
        description: "Invalid email or password. Please try again."
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

      <RadioGroup value={loginMethod} onValueChange={setLoginMethod} className="flex gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="email" id="email" />
          <Label htmlFor="email" className="text-gray-700 font-medium cursor-pointer">
            Login with Email
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="phone" id="phone" />
          <Label htmlFor="phone" className="text-gray-700 font-medium cursor-pointer">
            Login with Phone no.
          </Label>
        </div>
      </RadioGroup>

      {/* Input Field */}
      <TextField
        variant="outlined"
        placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
        type={loginMethod === 'email' ? 'email' : 'tel'}
        value={loginMethod === 'email' ? email : phone}
        onChange={(e) => loginMethod === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && (loginMethod === 'email' ? handleEmailSubmit() : handlePhoneSubmit())}
        sx={{
          ...muiFieldStyles,
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.5rem',
          },
        }}
        fullWidth
      />

      {/* Submit Button */}
      <Button
        onClick={loginMethod === 'email' ? handleEmailSubmit : handlePhoneSubmit}
        disabled={isLoading || (loginMethod === 'email' ? !email : !phone)}
        className="w-full h-12 bg-[#C72030] hover:bg-[#a81c29] text-white font-medium rounded-lg text-base mt-2"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            <span>Finding Organizations...</span>
          </div>
        ) : (
          'Continue'
        )}
      </Button>
    </>
  );

  const renderOrganizationStep = () => (
    <>
      <div className="flex items-center mb-4 ">
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
        Email: <span className="text-black-300">{email}</span>
      </p>

      <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto scrollbar">
        {organizations && organizations.map((org) => (
          <div
            key={org.id}
            onClick={() => handleOrganizationSelect(org)}
            className="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:bg-gray-50 border border-gray-100 hover:border-[#C72030]"
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
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg p-4 rounded-xl flex flex-col justify-center px-12 py-12">
        {/* Logo and Branding */}

        {/* Title and Description */}
        <div className="w-full max-w-md">
          <div className=" rounded-2xl  p-8 sm:p-10 relative z-10 animate-fade-in">
            {/* Logo */}
            <div className="text-center mb-6 flex flex-col items-center space-y-2">


            

              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                 width="500" height="115"
                viewBox="0 0 208 181"
                fill="none"
              >
                <g filter="url(#filter0_d_815_36)">
                  <rect
                    x={4}
                    width={200}
                    height={173}
                    fill="url(#pattern0_815_36)"
                    shapeRendering="crispEdges"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_815_36"
                    x={0}
                    y={0}
                    width={208}
                    height={181}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy={4} />
                    <feGaussianBlur stdDeviation={2} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_815_36"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_815_36"
                      result="shape"
                    />
                  </filter>
                  <pattern
                    id="pattern0_815_36"
                    patternContentUnits="objectBoundingBox"
                    width={1}
                    height={1}
                  >
                    <use
                      xlinkHref="#image0_815_36"
                      transform="matrix(0.005 0 0 0.00578035 0 -0.156069)"
                    />
                  </pattern>
                  <image
                    id="image0_815_36"
                    width={200}
                    height={200}
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,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7Nmz510AUu1fi0ajprm5eX5FRcVJgwcPPryysvLsFStWjCGiI4YPH34VgD9rrQHAEhGVEyoi2lqfuX8rY4wvItBaaxHRImIvW7bs4I0bN3br1q3bltGjR19UXV09bdGiRV6u/P8adhj9/l+EmU0ikdgigQYp1FpLXV3dlD333HP84YcffjkAWylVyMymtLS0kojiiUQir71B2y9DRMVERIlEopKZDQcmjhaRHWL/WmsyxmQBYNvjIsKWZXUXEdtxnFpm3lFCALz++usyZcqUqnQ6/Yxt2xMOPvjgE40xqYULF944cuTI/CeeeEIsywoREcaPH/9Av379ju7Zs+fYaDQ6vqqq6u9z5851mVls264SkVA4HC4TkQ7zCgBs244Skdp99903RyIRw8wdAu95nptKpZ4tLy//ctmyZSMBjANgjDFaRISZkUgktOM4m+rr65+yLOvk0aNHnyEi7oIFC64dNmxYkpl1eXl5PRGpeDyez8yKiDoGB2NMEoAkEokNRKSZ2SIie8899/xiv/32uxzAxk2bNoV836+dP39+u3D+V/FfISCPP/64AfBprkOPSKfT1ssvv5yeOXNmvTFmCwJH3RCRP3DgwOlEFCotLd03F63RzCzGmGgmkxkmIo6IfKyU0kopm4gyIiK2bVsAcOmllxIAeJ4H13VTRGSMMRkAhpkBIH/9+vVjiEg5jvOOUqrdad4pb7zxhsyePTvT1tb25ujRo98goohSKv/0008n3/ddADqbzVYtWLCg+ZNPPkktXLgwO2fOHAMARKQty3qfiNgYc2A6nVYvvviivPTSS3LcccdRXl7engCcwsLC2R999JGmYCzQEjjKIiINgwcP/gMRYcaMGT8hoojv+82e5+mXXnpJiAhvvPGGzJw5U8+dO7e1sbFxysiRI19nZseyrELHccxuu+02DYAqKire2/M8hVw9GGPCmUxmfyKyXNf98I033tDMrETEaK3rqqur3zrkkENuBlCwatWqew499NDijkr5L+K/QkAAoK6ublZpaeknb7zxxiX5+fkTJk6cmJw0aVJ+PB7fA4Dj+75mZm2MeU5EWj755JNbwuHw8JaWlrxsNltq2/ZxL7/88ullZWWfb968edrTTz9tbMt2RES1trYWDxgw4Jxrr/3tpLz8/NMvvviS0Z6n833fzwLgUChULkAfEO0fDoevmD59+hFl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d8HODADH3PVJRBPhkTN+lT/s+vedfMF3fSbStoJWFLz8p12zh97wvpUrBFETMCmloDXlXrl899UmLI+982MXgHrsrB261zz/z61TiAWOb4ynSTlGxHvuop27R6WDrn/fefGSXbxj7pziAMSPnzUuAIADr53k2pYiAAUm2M9ftEt3/Sfc+AEZFvf5S3bJH3jdJMrm/LgJWClQYDk69/rVe8oh102mTN6PCZEmRWIJJGJT7vk/724Ov2WK+/T5O67mgB5120eu1mQeP2uH4MBrJ0W9gG1jmLUiuLb2X/zzboWjbpviMEvw1Pk7MQDsf9W7EW0pfulPu3kAcORtUxQLnKfP23GNvK4JN36gsjkvahiWAolS5L1y5e55ANjvmkmuCdg2zLAUwbaU/6/Ldi8ccduHjgj46fN2CgBg32snOVqBX750twAA9r9msiUg9eplP7bNwTd94Lxw4c4eABx07SRVKAQx37BSSvlvXrtXDgD2veq9iGGxDYtYihCxlPfiZbt5+1/1nuMH7IphApGxLJV97ao9NliD9NFHH3300UcfffTRRx999NFHH3300UcfffTRRx999NFHH3300UcfffTRRx999NFHH338r/J/ALIZ/B3Wj7MaAAAAAElFTkSuQmCC"
                  />
                </defs>
              </svg>


              <p className="text-gray-600 text-sm font-medium">
                Sign in to your account
              </p>
            </div>


            {/* Step Form */}
            <div className="mt-8 space-y-5">
              {currentStep === 1 && renderEmailStep()}
              {currentStep === 2 && renderOrganizationStep()}
              {currentStep === 3 && renderPasswordStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};