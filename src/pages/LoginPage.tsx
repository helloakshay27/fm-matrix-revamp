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
             

              <svg className="h-12 mx-auto" width="366" height="66" viewBox="0 0 366 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M89.5066 3.94508H69.8799V30.5684H80.3176V22.6546H88.7763C96.1038 22.6546 101.028 20.2687 101.028 13.1345C101.052 7.15785 97.3997 3.94508 89.5066 3.94508ZM87.2683 15.8748H80.3176V10.8431H87.2683C89.5537 10.8431 90.6376 11.5754 90.6376 13.229C90.6376 15.0716 89.5537 15.8748 87.2683 15.8748ZM119.453 9.78003C115.401 9.78003 113.28 11.4809 112.291 12.8274V3.96869H102.96V30.5921H112.291V19.9852C112.291 17.6938 112.903 16.0637 115.636 16.0637C118.416 16.0637 118.864 17.7411 118.864 19.9852V30.5921H128.194V18.0717C128.171 12.5203 125.249 9.78003 119.453 9.78003ZM146.644 10.2997L142.544 21.261L138.137 10.2997H128.548L138.232 30.4268L134.626 36.9232H144.122L156.256 10.2997H146.644ZM173.056 10.2997H182.385V29.0566C182.385 36.9232 175.483 37.6555 167.919 37.6555C159.036 37.6555 155.784 34.8679 155.62 30.7575H164.15C164.526 32.0804 166.435 32.2458 167.895 32.2458C170.087 32.2458 173.009 32.3166 173.009 29.0566V27.3084C171.595 28.6077 169.545 29.3164 166.671 29.3164C160.403 29.3164 155.055 26.6233 155.055 19.7254C155.055 12.851 159.696 9.75638 165.94 9.75638C169.097 9.75638 171.407 10.5596 173.009 12.1187V10.2997H173.056ZM168.885 23.7414C172.114 23.7414 173.786 22.4185 173.786 19.749C173.786 17.056 171.995 15.7095 168.885 15.7095C165.728 15.7095 164.15 17.2214 164.15 19.749C164.15 22.2531 165.657 23.7414 168.885 23.7414ZM189.337 8.78786C192.141 8.78786 194.12 7.18146 194.12 4.41754C194.12 1.60637 192.141 0 189.337 0C186.532 0 184.554 1.60637 184.554 4.41754C184.554 7.18146 186.532 8.78786 189.337 8.78786ZM184.671 30.5921H194.001V10.3234H184.671V30.5921ZM214.523 15.3788V10.3234H208.61V5.07899H199.279V10.3234H195.534V15.3788H199.279V22.1586C199.279 29.4345 202.06 30.9465 210.33 30.9465C211.743 30.9465 213.299 30.8047 214.547 30.6393V24.5682C209.505 24.828 208.633 24.639 208.633 22.135V15.3552H214.523V15.3788ZM228.944 9.78003C222.182 9.78003 217.869 11.5282 217.139 16.4654H225.48C225.739 15.2134 226.894 14.7881 228.944 14.7881C231.606 14.7881 232.242 15.7331 232.242 17.5993V18.0954C218.883 17.4575 216.032 20.2687 216.032 24.9698C216.032 29.1511 219.095 31.1355 224.844 31.1355C228.496 31.1355 230.875 29.907 232.242 28.5368V30.5448H241.572V17.5757C241.596 10.9139 235.634 9.78003 228.944 9.78003ZM232.265 25.0407C231.253 25.9855 229.651 26.6706 227.624 26.6706C226.399 26.6706 225.008 26.4108 225.008 24.8516C225.008 22.7491 227.601 22.6075 232.265 22.8437V25.0407ZM243.857 2.50405V30.5684H253.188V2.50405H243.857ZM258.466 25.9383C257.028 25.9383 255.851 27.0723 255.851 28.5133C255.851 29.9542 257.028 31.1119 258.466 31.1119C259.88 31.1119 261.058 29.9779 261.058 28.5133C261.058 27.0486 259.88 25.9383 258.466 25.9383ZM291.828 10.2997H296.754L288.79 30.5684H284.243L278.705 15.8748L273.215 30.5684H268.668L260.704 10.2997H265.629L271.048 25.1824L276.632 10.2997H280.85L286.433 25.1824L291.828 10.2997ZM309.099 9.73277C303.185 9.73277 297.53 12.9691 297.53 20.4578C297.53 27.9462 303.185 31.159 309.099 31.159C315.013 31.159 320.715 27.9699 320.715 20.4578C320.691 12.9691 315.013 9.73277 309.099 9.73277ZM309.099 27.6865C303.68 27.6865 301.818 24.0012 301.818 20.4578C301.818 16.8906 303.68 13.1817 309.099 13.1817C314.519 13.1817 316.379 16.867 316.379 20.4578C316.379 24.0012 314.519 27.6865 309.099 27.6865ZM337.28 9.73277C332.921 9.73277 330.116 12.6148 329.197 14.1031V10.2997H324.485V30.5684H329.197V20.2687C329.197 17.1032 331.13 14.1503 336.266 14.1503C337.561 14.1503 338.575 14.292 339.376 14.5283H339.518V9.89811C338.716 9.78 338.197 9.73277 337.28 9.73277ZM359.262 30.5921H364.799L355.681 18.3316L364.304 10.2997H358.46L348.023 20.1506V3.94508H343.311V30.5684H348.023V25.4658L352.382 21.3554L359.262 30.5921Z" fill="#141414" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M59.1388 34.6126H30.4678V5.53711C30.4678 3.42569 28.7676 1.72107 26.6616 1.72107C25.1354 1.72107 23.8216 2.61213 23.2227 3.90997C20.885 2.45717 18.1608 1.62421 15.2242 1.62421C6.81999 1.62421 0 8.4621 0 16.8883C0 25.3147 6.81999 32.1525 15.2242 32.1525C18.0063 32.1525 20.6145 31.3971 22.8556 30.0799C22.8556 31.6296 22.8556 33.1404 22.8556 34.6126H16.055C15.7845 34.5932 15.4947 34.5932 15.2242 34.5932C6.81999 34.5932 0 41.4311 0 49.8574C0 58.2837 6.81999 65.1215 15.2242 65.1215C23.6285 65.1215 30.4484 58.2837 30.4484 49.8574C30.4484 49.4506 30.4291 49.0438 30.3905 48.6564H30.4871V42.264H59.0035L59.1388 34.6126ZM15.2049 24.5204C11.0125 24.5204 7.59279 21.0919 7.59279 16.8883C7.59279 12.6849 11.0125 9.25629 15.2049 9.25629C19.3973 9.25629 22.8171 12.6849 22.8171 16.8883C22.8171 21.1111 19.4167 24.5204 15.2049 24.5204ZM22.8556 49.1988C22.8556 49.4312 22.8363 49.6443 22.8171 49.8574C22.8171 54.0609 19.3973 57.4894 15.2049 57.4894C11.0125 57.4894 7.59279 54.0609 7.59279 49.8574C7.59279 45.7896 10.7613 42.4772 14.7606 42.2447V42.264H22.8556C22.8556 46.1382 22.8556 48.6564 22.8556 48.6564H22.875C22.8363 48.8307 22.8556 49.0244 22.8556 49.1988ZM47.3148 9.25629C51.5074 9.25629 54.927 12.6849 54.927 16.8883C54.927 21.0919 51.5074 24.5204 47.3148 24.5204C43.1224 24.5204 39.7027 21.0919 39.7027 16.8883C39.7027 12.6849 43.1031 9.25629 47.3148 9.25629ZM47.3148 1.62421C55.7192 1.62421 62.5391 8.4621 62.5391 16.8883C62.5391 25.3147 55.7192 32.1525 47.3148 32.1525C38.9107 32.1525 32.0907 25.3147 32.0907 16.8883C32.0907 8.4621 38.9107 1.62421 47.3148 1.62421Z" fill="#C72031" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M64.1615 37.6366C62.7511 36.5907 60.2781 34.7699 58.6552 33.5688C58.346 33.3557 57.9596 33.3171 57.6119 33.4913C57.2835 33.6657 57.071 33.995 57.071 34.3824C57.071 34.4599 57.071 34.5374 57.071 34.6149H30.332V42.2663H57.071C57.071 42.3438 57.071 42.4406 57.071 42.5181C57.071 42.8861 57.2835 43.2349 57.6119 43.4093C57.9404 43.5835 58.346 43.5448 58.6552 43.3124C60.2781 42.1113 62.7511 40.2905 64.1615 39.2445C64.4126 39.0507 64.5671 38.7602 64.5671 38.4503C64.5671 38.1403 64.4126 37.8304 64.1615 37.6366Z" fill="#C72031" />
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