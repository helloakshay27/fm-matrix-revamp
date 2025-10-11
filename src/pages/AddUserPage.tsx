import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const AddUserPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    password: "",
    phase: "",
    status: "",
    tower: "",
    flat: "",
    category: "",
    alternateAddress: "",
    residentType: "Owner",
    membershipType: "Primary",
    livesHere: "Yes",
    allowFitout: "No",
    birthDate: "",
    anniversary: "",
    spouseBirthDate: "",
    alternateEmail1: "",
    alternateEmail2: "",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    evConnection: "",
    noOfPets: "",
    noOfAdults: "",
    noOfChildren: "",
    differentlyAbled: "No",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your submit logic here
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#e8e8e8] px-6 py-4 mb-6 border-l-4 border-orange-500">
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Add User</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Primary Details Section */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#1A1A1A]" />
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                Primary Details
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="flex gap-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 rounded-full bg-[#1e3a5f] flex items-center justify-center relative">
                  <User className="w-16 h-16 text-white" />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#C72031] rounded-full flex items-center justify-center hover:bg-[#a01828] transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Select Title
                  </Label>
                  <Select
                    value={formData.title}
                    onValueChange={(value) => handleInputChange("title", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* First Name */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> First Name
                  </Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="First Name"
                    className="border-gray-300"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Last Name
                  </Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Last Name"
                    className="border-gray-300"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="runwal.gardens@lockated.com"
                    className="border-gray-300"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Mobile</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) =>
                        handleInputChange("countryCode", value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) =>
                        handleInputChange("mobile", e.target.value)
                      }
                      placeholder="Mobile Number"
                      className="flex-1 border-gray-300"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="••••••••••"
                      className="border-gray-300 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Phase */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Select Phase
                  </Label>
                  <Select
                    value={formData.phase}
                    onValueChange={(value) => handleInputChange("phase", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phase 1">Phase 1</SelectItem>
                      <SelectItem value="Phase 2">Phase 2</SelectItem>
                      <SelectItem value="Phase 3">Phase 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Select Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tower */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Select Tower
                  </Label>
                  <Select
                    value={formData.tower}
                    onValueChange={(value) => handleInputChange("tower", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tower" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                      <SelectItem value="Tower C">Tower C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Flat */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Select Flat
                  </Label>
                  <Select
                    value={formData.flat}
                    onValueChange={(value) => handleInputChange("flat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Flat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">101</SelectItem>
                      <SelectItem value="102">102</SelectItem>
                      <SelectItem value="103">103</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Select Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Resident">Resident</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Alternate Address */}
                <div className="space-y-2 md:col-span-3">
                  <Label className="text-sm text-gray-600">
                    Alternate Address
                  </Label>
                  <Textarea
                    value={formData.alternateAddress}
                    onChange={(e) =>
                      handleInputChange("alternateAddress", e.target.value)
                    }
                    placeholder="Alternate Address"
                    className="border-gray-300 min-h-[80px]"
                  />
                </div>

                {/* Resident Type */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Resident Type:</Label>
                  <RadioGroup
                    value={formData.residentType}
                    onValueChange={(value) =>
                      handleInputChange("residentType", value)
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Owner" id="owner" />
                      <Label htmlFor="owner" className="font-normal cursor-pointer">
                        Owner
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Tenant" id="tenant" />
                      <Label htmlFor="tenant" className="font-normal cursor-pointer">
                        Tenant
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Membership Type */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Membership Type:</Label>
                  <RadioGroup
                    value={formData.membershipType}
                    onValueChange={(value) =>
                      handleInputChange("membershipType", value)
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Primary" id="primary" />
                      <Label htmlFor="primary" className="font-normal cursor-pointer">
                        Primary
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Secondary" id="secondary" />
                      <Label htmlFor="secondary" className="font-normal cursor-pointer">
                        Secondary
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Lives Here */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Lives Here:</Label>
                  <RadioGroup
                    value={formData.livesHere}
                    onValueChange={(value) =>
                      handleInputChange("livesHere", value)
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="lives-yes" />
                      <Label htmlFor="lives-yes" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="lives-no" />
                      <Label htmlFor="lives-no" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Allow Fitout */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Allow Fitout:</Label>
                  <RadioGroup
                    value={formData.allowFitout}
                    onValueChange={(value) =>
                      handleInputChange("allowFitout", value)
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="fitout-yes" />
                      <Label htmlFor="fitout-yes" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="fitout-no" />
                      <Label htmlFor="fitout-no" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="border-t border-gray-200">
            <div className="px-6 py-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#1A1A1A]" />
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                Additional Info
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Birth Date */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Birth Date:</Label>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  className="border-gray-300"
                />
              </div>

              {/* Anniversary */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Anniversary:</Label>
                <Input
                  type="date"
                  value={formData.anniversary}
                  onChange={(e) =>
                    handleInputChange("anniversary", e.target.value)
                  }
                  placeholder="Anniversary Date"
                  className="border-gray-300"
                />
              </div>

              {/* Spouse Birth Date */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  Spouse Birth Date:
                </Label>
                <Input
                  type="date"
                  value={formData.spouseBirthDate}
                  onChange={(e) =>
                    handleInputChange("spouseBirthDate", e.target.value)
                  }
                  placeholder="Spouse Birth Date"
                  className="border-gray-300"
                />
              </div>

              {/* Alternate Email 1 */}
              <div className="space-y-2">
                <Input
                  type="email"
                  value={formData.alternateEmail1}
                  onChange={(e) =>
                    handleInputChange("alternateEmail1", e.target.value)
                  }
                  placeholder="Alternate Email-1"
                  className="border-gray-300"
                />
              </div>

              {/* Alternate Email 2 */}
              <div className="space-y-2">
                <Input
                  type="email"
                  value={formData.alternateEmail2}
                  onChange={(e) =>
                    handleInputChange("alternateEmail2", e.target.value)
                  }
                  placeholder="Alternate Email-2"
                  className="border-gray-300"
                />
              </div>

              {/* Landline Number */}
              <div className="space-y-2">
                <Input
                  type="tel"
                  value={formData.landlineNumber}
                  onChange={(e) =>
                    handleInputChange("landlineNumber", e.target.value)
                  }
                  placeholder="Landline Number"
                  className="border-gray-300"
                />
              </div>

              {/* Intercom Number */}
              <div className="space-y-2">
                <Input
                  type="text"
                  value={formData.intercomNumber}
                  onChange={(e) =>
                    handleInputChange("intercomNumber", e.target.value)
                  }
                  placeholder="Intercom Number"
                  className="border-gray-300"
                />
              </div>

              {/* GST Number */}
              <div className="space-y-2">
                <Input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) =>
                    handleInputChange("gstNumber", e.target.value)
                  }
                  placeholder="Gst Number"
                  className="border-gray-300"
                />
              </div>

              {/* PAN Number */}
              <div className="space-y-2">
                <Input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) =>
                    handleInputChange("panNumber", e.target.value)
                  }
                  placeholder="Pan Number"
                  className="border-gray-300"
                />
              </div>

              {/* EV Connection */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">EV Connection:</Label>
                <Select
                  value={formData.evConnection}
                  onValueChange={(value) =>
                    handleInputChange("evConnection", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="NA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NA">NA</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* No. of Pets */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">No. of Pets:</Label>
                <Input
                  type="number"
                  value={formData.noOfPets}
                  onChange={(e) =>
                    handleInputChange("noOfPets", e.target.value)
                  }
                  placeholder="pets"
                  className="border-gray-300"
                />
              </div>

              {/* No. of Adult Family Members Residing */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  No. of Adult Family Members Residing:
                </Label>
                <Input
                  type="number"
                  value={formData.noOfAdults}
                  onChange={(e) =>
                    handleInputChange("noOfAdults", e.target.value)
                  }
                  placeholder="Adults"
                  className="border-gray-300"
                />
              </div>

              {/* No. of Children Residing */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  No. of Children Residing:
                </Label>
                <Input
                  type="number"
                  value={formData.noOfChildren}
                  onChange={(e) =>
                    handleInputChange("noOfChildren", e.target.value)
                  }
                  placeholder="Children"
                  className="border-gray-300"
                />
              </div>

              {/* Differently Abled */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  Differently Abled:
                </Label>
                <RadioGroup
                  value={formData.differentlyAbled}
                  onValueChange={(value) =>
                    handleInputChange("differentlyAbled", value)
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="abled-yes" />
                    <Label htmlFor="abled-yes" className="font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="abled-no" />
                    <Label htmlFor="abled-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-[#1e3a5f] hover:bg-[#152d4a] text-white px-12"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
