import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { ArrowLeft, Briefcase, Paperclip } from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
import { AttachmentUpload } from "@/components/common/AttachmentUpload";

interface ServiceCategory {
  id: number;
  service_cat_name: string;
}

const requiredLabel = (text: string) => (
  <span>
    {text}
    <span className="fm-required-mark">*</span>
  </span>
);

// Description textarea — assetFieldStyles ki fixed height multiline pe nahi lagani
const multilineFieldStyles = {
  "& .MuiOutlinedInput-root": { height: "auto" },
};

// AssetFilterDialog jaisa dropdown menu
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const AddCuratedServicePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    service_category_id: "",
    order_no: "",
    mobile: "",
    address: "",
    email: "",
    active: 1,
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  const fetchServiceCategories = async () => {
    setLoadingCategories(true);
    try {
      const apiUrl = getFullUrl("/osr_setups/osr_categories.json?q[service_tag_eq]=curated");
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched service categories:", data);
      setServiceCategories(data.osr_categories || []);
    } catch (error: any) {
      console.error("Error fetching service categories:", error);
      toast.error("Failed to load service categories", {
        duration: 5000,
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMobileChange = (value: string) => {
    // Allow only digits and limit to 10 characters
    const numbersOnly = value.replace(/\D/g, "");
    if (numbersOnly.length <= 10) {
      handleInputChange("mobile", numbersOnly);
    }
  };

  const handleImageSelect = (file?: File) => {
    if (!file) {
      setAttachment(null);
      setImagePreview("");
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please select only image files (JPEG, PNG, GIF, WebP).");
      return;
    }

    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      toast.error("Image must be less than 3MB.");
      return;
    }

    setAttachment(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setAttachment(null);
    setImagePreview("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Service name is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!formData.service_category_id) {
      toast.error("Service category is required");
      return false;
    }
    if (formData.mobile && formData.mobile.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error(
        "Please enter a valid email address (e.g., user@example.com)"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("osr_categories_id", formData.service_category_id);
      formDataToSend.append("active", formData.active.toString());
      formDataToSend.append("service_tag", "curated");

      // if (formData.order_no) {
      //   formDataToSend.append("plus_service[order_no]", formData.order_no);
      // }

      if (formData.mobile) {
        formDataToSend.append("mobile", formData.mobile);
      }
      if (formData.email) {
        formDataToSend.append("email", formData.email);
      }

      if (formData.address) {
        formDataToSend.append("address", formData.address);
      }

      if (attachment) {
        formDataToSend.append("attachment", attachment);
      }

      const apiUrl = getFullUrl("/osr_setups/create_osr_sub_category.json");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Service created successfully!");
      navigate("/pulse/curated-services/service");
    } catch (error: any) {
      console.error("Error creating plus service:", error);
      toast.error(
        error?.response?.data?.error || error.message || "Failed to create service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/pulse/curated-services/service");
  };

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Curated Service List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Create New Curated Service</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW CURATED SERVICE</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Service Details */}
        <FormSection title="SERVICE DETAILS" icon={Briefcase}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Name */}
              <TextField
                fullWidth
                label={requiredLabel("Service Name")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter Service Name"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: assetFieldStyles }}
              />

              {/* Service Category */}
              <FormControl fullWidth variant="outlined">
                <InputLabel id="curated-service-category-label" shrink>
                  {requiredLabel("Service Category")}
                </InputLabel>
                <MuiSelect
                  labelId="curated-service-category-label"
                  value={formData.service_category_id}
                  onChange={(e) =>
                    handleInputChange("service_category_id", String(e.target.value))
                  }
                  label="Service Category *"
                  notched
                  displayEmpty
                  disabled={loadingCategories}
                  MenuProps={selectMenuProps}
                  sx={assetFieldStyles}
                >
                  <MenuItem value="">
                    <em>
                      {loadingCategories
                        ? "Loading..."
                        : "Select Service Category"}
                    </em>
                  </MenuItem>
                  {serviceCategories.map((category: any) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Mobile */}
              <TextField
                fullWidth
                label="Mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleMobileChange(e.target.value)}
                placeholder="Enter 10 digit mobile number"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: assetFieldStyles }}
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]*",
                }}
                error={formData.mobile !== "" && formData.mobile.length !== 10}
              />

              {/* Address */}
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter Address"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: assetFieldStyles }}
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter Email"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: assetFieldStyles }}
              />
            </div>

            {/* Description - Full width */}
            <Box sx={{ position: "relative" }}>
              <TextField
                label={requiredLabel("Description")}
                placeholder="Enter Description"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.description}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 255) {
                    handleInputChange("description", value);
                  }
                }}
                InputLabelProps={{ shrink: true }}
                sx={multilineFieldStyles}
              />
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 12,
                  color: formData.description.length > 255 ? "red" : "gray",
                }}
              >
                {formData.description.length}/255
              </Typography>
            </Box>
          </div>
        </FormSection>

        {/* Attachments */}
        <FormSection title="ATTACHMENTS" icon={Paperclip}>
          <AttachmentUpload
            label="Service Image"
            chooseText="Choose Image"
            uploadText="Upload Image"
            emptyText="No image chosen"
            accept="image/*"
            files={attachment ? [attachment] : []}
            onFilesSelected={(files) => handleImageSelect(files[0])}
            onRemove={removeImage}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Service Preview"
              className="mt-4 w-32 h-32 object-cover rounded-lg border border-gray-200"
            />
          )}
        </FormSection>

        <FormActionBar
          onCancel={handleCancel}
          submitLabel="Create Service"
          isSubmitting={loading}
          submitAsFormSubmit
        />
      </form>
    </div>
  );
};
