import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  ShieldAlert,
  FileText,
  Edit2,
  Upload,
  Heart,
  Building2,
  Globe,
  Cake,
  Star,
  BriefcaseBusiness,
  ShieldCheck,
  ChevronDown,
  X,
  Save,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
import { getBaseUrl, getToken, getUser } from "@/utils/auth";
import { userService, ProfileAccountResponse, ProfileUpdateResponse } from "@/services/userService";
import { toast } from "sonner";
import "./BusinessCompass.css";

const AdvancedDatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  className
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    if (isValid(parsedDate)) return parsedDate;

    const fallbackDate = new Date(dateString);
    return isValid(fallbackDate) ? fallbackDate : null;
  };

  const selectedDate = parseDate(value);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange(format(date, "dd/MM/yyyy"));
    } else {
      onChange('');
    }
  };

  const years = Array.from({ length: 131 }, (_, i) => 1900 + i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className={cn("relative w-full", className)}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between px-2 py-2 bg-white border-b gap-1">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
              type="button"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <div className="flex gap-1">
              <select
                value={months[date.getMonth()]}
                onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                className="text-xs font-semibold bg-transparent border-0 focus:ring-0 cursor-pointer hover:text-blue-600 outline-none"
              >
                {months.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) => changeYear(parseInt(value))}
                className="text-xs font-semibold bg-transparent border-0 focus:ring-0 cursor-pointer hover:text-blue-600 outline-none"
              >
                {years.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
              type="button"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        )}
        customInput={
          <div className="relative group cursor-pointer">
            <Input
              className={cn(
                "h-[36px] text-[14px] border-gray-300 hover:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-100",
                !selectedDate && "text-gray-400"
              )}
              value={value || ""}
              readOnly
              placeholder={placeholder}
            />
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 pointer-events-none" />
          </div>
        }
      />
    </div>
  );
};

const InfoField = ({
  icon: Icon,
  label,
  value,
  isEditing = false,
  onChange,
  placeholder,
  type = "text",
  editable = true,
}: {
  icon: React.ElementType;
  label: string;
  value: string | undefined | null;
  isEditing?: boolean;
  onChange?: (val: string) => void;
  placeholder?: string;
  type?: string;
  editable?: boolean;
}) => {
  const isEmpty = !value || (typeof value === "string" && value.trim() === "");

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-[#6B9BCC]" />
        <span className="text-[#8e8e8e] text-[10px] font-bold uppercase tracking-widest leading-none">
          {label}
        </span>
      </div>
      {isEditing && editable ? (
        <div className="relative group w-full">
          {type === "date" ? (
            <AdvancedDatePicker
              value={value || ""}
              onChange={(v) => onChange?.(v)}
              placeholder="dd/MM/yyyy"
            />
          ) : (
            <Input
              className="h-[36px] text-[14px] border-gray-300 focus-visible:border-blue-500 placeholder:text-gray-400 w-full"
              placeholder={placeholder}
              value={value || ""}
              onChange={(e) => onChange?.(e.target.value)}
            />
          )}
        </div>
      ) : (
        <span
          className={cn(
            "tracking-tight",
            isEmpty && !isEditing
              ? "text-[#B91C1C] text-[11px] font-medium"
              : "text-[#1a1a1a] text-[15px] font-bold"
          )}
        >
          {isEmpty && !isEditing ? "Not provided" : value}
        </span>
      )}
    </div>
  );
};

const BusinessCompassProfile = () => {
  type ProfileFormData = {
    displayName: string;
    email: string;
    phone: string;
    jobTitle: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    dob: string;
    anniversaryDate: string;
    doj: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    cv?: string;
  };

  const getInitialProfileData = (): ProfileFormData => {
    const savedData = localStorage.getItem("bc-profile-data");
    if (savedData) {
      return JSON.parse(savedData) as ProfileFormData;
    }

    const authUser = getUser();
    const fullName = [authUser?.firstname, authUser?.lastname]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      displayName: fullName || authUser?.firstname || "Common Admin Id",
      email: authUser?.email || "operational@lockated.com",
      phone: authUser?.mobile || authUser?.phone || "9673565064",
      jobTitle: authUser?.firstname || "Common Admin Id",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      dob: "",
      anniversaryDate: "",
      doj: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
    };
  };

  const formatApiDateToUi = (dateString?: string | null): string => {
    if (!dateString) return "";
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
    return isValid(parsedDate) ? format(parsedDate, "dd/MM/yyyy") : "";
  };

  const formatUiDateToApi = (dateString?: string | null): string | null => {
    if (!dateString) return null;
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    if (!isValid(parsedDate)) return null;
    return format(parsedDate, "yyyy-MM-dd");
  };

  const mergeApiProfileIntoForm = (
    currentData: ProfileFormData,
    apiData: ProfileUpdateResponse
  ): ProfileFormData => {
    const userData = apiData.user || {};
    const firstname = userData.firstname ?? apiData.firstname ?? "";
    const lastname = userData.lastname ?? apiData.lastname ?? "";
    const displayName = [firstname, lastname].filter(Boolean).join(" ").trim();

    return {
      ...currentData,
      displayName: displayName || currentData.displayName,
      email: userData.email ?? apiData.email ?? currentData.email,
      phone: userData.mobile ?? apiData.mobile ?? currentData.phone,
      jobTitle: userData.user_title ?? currentData.jobTitle,
      address: userData.alternate_address ?? currentData.address,
      dob: formatApiDateToUi(userData.birth_date) || currentData.dob,
      emergencyContactNumber:
        userData.alternate_mobile ?? currentData.emergencyContactNumber,
    };
  };

  const mapAccountProfileToForm = (
    currentData: ProfileFormData,
    accountData: ProfileAccountResponse
  ): ProfileFormData => {
    const firstname = accountData.firstname || "";
    const lastname = accountData.lastname || "";
    const displayName = [firstname, lastname].filter(Boolean).join(" ").trim();
    const extra = accountData.extra_fields || {};

    return {
      ...currentData,
      displayName: displayName || currentData.displayName,
      email: accountData.email || currentData.email,
      phone: accountData.mobile || currentData.phone,
      jobTitle:
        accountData.designation || accountData.profile_type || currentData.jobTitle,
      address: accountData.alternate_address || currentData.address,
      city: extra.city || currentData.city,
      state: extra.state || currentData.state,
      pinCode: extra.pin_code || extra.pincode || extra.zip_code || currentData.pinCode,
      dob: formatApiDateToUi(accountData.birth_date) || currentData.dob,
      anniversaryDate:
        formatApiDateToUi(extra.anniversary_date) || currentData.anniversaryDate,
      doj: formatApiDateToUi(extra.date_of_joining) || currentData.doj,
      emergencyContactName:
        extra.emergency_contact_name || currentData.emergencyContactName,
      emergencyContactNumber:
        extra.emergency_contact_number || currentData.emergencyContactNumber,
    };
  };

  const persistProfileDataLocally = (data: ProfileFormData) => {
    localStorage.setItem("bc-profile-data", JSON.stringify(data));
    const essentialFields = [
      "address",
      "city",
      "state",
      "pinCode",
      "dob",
      "doj",
      "emergencyContactName",
      "emergencyContactNumber",
    ];
    const isComplete = essentialFields.every(
      (field) => data[field as keyof ProfileFormData]?.trim() !== ""
    );
    if (isComplete) {
      localStorage.setItem("bc-profile-completed", "true");
    } else {
      localStorage.removeItem("bc-profile-completed");
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(getInitialProfileData);
  const [profileImage, setProfileImage] = useState<string>(() => localStorage.getItem("bc-profile-avatar") || "");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setIsProfileLoading(true);
        const profileData = await userService.getAccountDetails();

        const mappedData = mapAccountProfileToForm(formData, profileData);
        setFormData(mappedData);
        persistProfileDataLocally(mappedData);

        const accountImage =
          profileData.profile_icon_url ||
          profileData.profile_photo ||
          profileData.avatar ||
          profileData.image ||
          "";

        if (accountImage) {
          setProfileImage(accountImage);
          localStorage.setItem("bc-profile-avatar", accountImage);
        }
      } catch (error) {
        if (!localStorage.getItem("bc-profile-data")) {
          const message = error instanceof Error ? error.message : "Unable to load profile details";
          toast.error(message);
        }
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  const triggerProfileUpload = () => {
    if (!isEditing || isSaving) return;
    fileInputRef.current?.click();
  };

  const handleProfileImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        setProfileImage(result);
      }
    };
    reader.readAsDataURL(file);
    setProfileImageFile(file);
    event.target.value = "";
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const firstName = formData.displayName.trim();
      const birthDate = formatUiDateToApi(formData.dob) || "";
      const useFormData = !!profileImageFile;
      let updatedProfile: ProfileUpdateResponse;

      if (useFormData) {
        const multipartPayload = new FormData();
        multipartPayload.append("firstname", firstName);
        multipartPayload.append("lastname", "");
        multipartPayload.append("email", formData.email.trim());
        multipartPayload.append("mobile", formData.phone.trim());
        multipartPayload.append("user[firstname]", firstName);
        multipartPayload.append("user[lastname]", "");
        multipartPayload.append("user[email]", formData.email.trim());
        multipartPayload.append("user[mobile]", formData.phone.trim());
        multipartPayload.append("user[alternate_address]", formData.address.trim());
        multipartPayload.append("user[user_title]", formData.jobTitle.trim());
        multipartPayload.append("user[birth_date]", birthDate);
        multipartPayload.append("user[alternate_mobile]", formData.emergencyContactNumber.trim());
        multipartPayload.append("user[avatar]", profileImageFile);

        updatedProfile = await userService.updateProfile(multipartPayload);
      } else {
        const payload = {
          firstname: firstName,
          lastname: "",
          email: formData.email.trim(),
          mobile: formData.phone.trim(),
          user: {
            firstname: firstName,
            lastname: "",
            email: formData.email.trim(),
            mobile: formData.phone.trim(),
            alternate_address: formData.address.trim(),
            user_title: formData.jobTitle.trim(),
            birth_date: birthDate || null,
            alternate_mobile: formData.emergencyContactNumber.trim(),
          },
        };

        updatedProfile = await userService.updateProfile(payload);
      }

      const mergedData = mergeApiProfileIntoForm(formData, updatedProfile);
      setFormData(mergedData);
      persistProfileDataLocally(mergedData);
      if (profileImage) {
        localStorage.setItem("bc-profile-avatar", profileImage);
      } else {
        localStorage.removeItem("bc-profile-avatar");
      }
      setProfileImageFile(null);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    const savedData = localStorage.getItem('bc-profile-data');
    if (savedData) setFormData(JSON.parse(savedData));
    setProfileImage(localStorage.getItem("bc-profile-avatar") || "");
    setProfileImageFile(null);
  };

  const profileInitials = formData.displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-poppins bg-[#F6F4EE]/30 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#DA7756] p-2.5 rounded-[12px] text-white shadow-sm">
          <User size={28} strokeWidth={2.5} />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight">My Profile</h1>
          <p className="text-gray-500 text-sm font-medium">Manage your personal and professional profile details</p>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card className="rounded-[16px] border-2 border-[#C4B89D] bg-white shadow-sm relative overflow-hidden">
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving || isProfileLoading}
                className="h-9 px-4 text-gray-600 border-gray-200 font-bold hover:bg-gray-50"
              >
                <X size={16} className="mr-2" strokeWidth={2.5} />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || isProfileLoading}
                className="bg-[#108C72] hover:bg-[#0d735e] text-white font-bold h-9 px-6 shadow-sm"
              >
                <Save size={16} className="mr-2" strokeWidth={2.5} />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              disabled={isProfileLoading}
              className="bg-[#334155] hover:bg-[#1e293b] text-white font-bold h-8 px-4 rounded-md text-[10px] tracking-wider shadow-sm uppercase"
            >
              <Edit2 size={13} className="mr-1.5" strokeWidth={3} />
              Edit Profile
            </Button>
          )}
        </div>

        <CardContent className="p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Left Column: Profile Pic */}
            <div className="flex flex-col items-center gap-6 w-full lg:w-48 pt-4">
              <div className="relative group">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-white"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-[#B91C1C] flex items-center justify-center text-white text-[48px] font-black shadow-xl border-4 border-white">
                    {profileInitials}
                  </div>
                )}
                {isEditing && (
                  <div
                    onClick={triggerProfileUpload}
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Upload size={24} className="text-white" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageSelect}
              />
              <Button
                variant="outline"
                onClick={triggerProfileUpload}
                disabled={!isEditing || isSaving || isProfileLoading}
                className="w-full text-gray-500 font-bold h-10 border-gray-200 hover:bg-gray-50 hover:text-[#DA7756]"
              >
                <Upload size={14} className="mr-2" />
                Upload Photo
              </Button>
            </div>

            {/* Right Column: Information Sections */}
            <div className="flex-1 w-full space-y-12">
              {/* Personal Information */}
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-[#1a1a1a] border-l-4 border-[#DA7756] pl-4 leading-none">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
                  <InfoField
                    icon={User}
                    label="Display Name"
                    value={formData.displayName}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("displayName", v)}
                    placeholder="Full Name"
                  />
                  <InfoField
                    icon={Mail}
                    label="Email Address"
                    value={formData.email}
                    isEditing={isEditing}
                    editable={false}
                  />
                  <InfoField
                    icon={Phone}
                    label="Phone Number"
                    value={formData.phone}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("phone", v)}
                    placeholder="Enter mobile"
                  />
                  <InfoField
                    icon={BriefcaseBusiness}
                    label="Job Position"
                    value={formData.jobTitle}
                    isEditing={isEditing}
                    editable={false}
                  />
                  <div className="md:col-span-2">
                    <InfoField
                      icon={Building2}
                      label="Mailing Address"
                      value={formData.address}
                      isEditing={isEditing}
                      onChange={(v) => handleInputChange("address", v)}
                      placeholder="Full Address"
                    />
                  </div>
                  <InfoField
                    icon={Globe}
                    label="City"
                    value={formData.city}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("city", v)}
                    placeholder="City"
                  />
                  <InfoField
                    icon={MapPin}
                    label="State"
                    value={formData.state}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("state", v)}
                    placeholder="State"
                  />
                  <InfoField
                    icon={Star}
                    label="Pin Code"
                    value={formData.pinCode}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("pinCode", v)}
                    placeholder="Zip Code"
                  />
                  <InfoField
                    icon={Cake}
                    label="Birthday"
                    value={formData.dob}
                    type="date"
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("dob", v)}
                  />
                  <InfoField
                    icon={Heart}
                    label="Anniversary"
                    value={formData.anniversaryDate}
                    type="date"
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("anniversaryDate", v)}
                  />
                  <InfoField
                    icon={Calendar}
                    label="Joined Date"
                    value={formData.doj}
                    type="date"
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("doj", v)}
                  />
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* Work & Emergency */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 font-bold text-gray-700">
                    <Briefcase size={18} className="text-blue-500" />
                    <span>Work Details</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 font-bold rounded-md">
                      Company Admin
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 px-3 py-1 font-bold rounded-md">
                      Active Member
                    </Badge>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 font-bold text-gray-700">
                    <ShieldAlert size={18} className="text-red-500" />
                    <span>Emergency Recovery</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <InfoField
                      icon={User}
                      label="Trusted Contact"
                      value={formData.emergencyContactName}
                      isEditing={isEditing}
                      onChange={(v) => handleInputChange("emergencyContactName", v)}
                      placeholder="Name"
                    />
                    <InfoField
                      icon={Phone}
                      label="Recovery Phone"
                      value={formData.emergencyContactNumber}
                      isEditing={isEditing}
                      onChange={(v) => handleInputChange("emergencyContactNumber", v)}
                      placeholder="Number"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* Documents */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 font-bold text-gray-700">
                  <FileText size={18} className="text-purple-500" />
                  <span>Professional Vault</span>
                </div>
                {!isEditing && !formData.cv ? (
                  <p className="text-sm text-gray-400 italic">No professional documents secured yet.</p>
                ) : (
                  <div className="flex gap-4 max-w-md">
                    <Input className="h-10 bg-[#FAFAFA]" placeholder="Document title..." />
                    <Button className="bg-[#3B82F6] hover:bg-blue-600 font-bold px-6 h-10 rounded-md shadow-sm">
                      <Upload size={16} className="mr-2" />
                      Add Document
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KRAs Footer */}
      <Card className="rounded-[16px] border border-green-100 bg-white shadow-sm ring-1 ring-green-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-green-700">
            <Star size={20} className="fill-green-500 text-green-500" />
            My Objectives (KPIs & KRAs)
          </CardTitle>
          <Badge className="bg-green-100 text-green-700 border-green-200 px-3 h-6 rounded-full font-bold">0 Active</Badge>
        </CardHeader>
        <CardContent className="py-12 flex items-center justify-center opacity-40">
          <p className="text-gray-400 font-bold tracking-tight">Focus targets haven't been assigned yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessCompassProfile;
