import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Briefcase, Paperclip } from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  TextField,
  CircularProgress,
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

export const SupportedServiceAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );
  const [showTooltip, setShowTooltip] = useState(false);

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
      const apiUrl = getFullUrl("/osr_setups/osr_categories.json?q[service_tag_eq]=supported");
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
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
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
      formDataToSend.append("service_tag", "supported");

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
      navigate("/pulse/supported-services/service");
    } catch (error: any) {
      console.error("Error creating plus service:", error);
      toast.error(
        error.message || "Failed to create service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/pulse/supported-services/service");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
          <span>Supported Service List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Create New Supported Service</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW SUPPORTED SERVICE</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Service Details */}
        <FormSection title="SERVICE DETAILS" icon={Briefcase}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Name */}
              <TextField
                fullWidth
                label={requiredLabel("Service Name")}
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter Service Name"
                variant="outlined"
                InputLabelProps={{ required: false, shrink: true }}
                InputProps={{ sx: assetFieldStyles }}
              />

              {/* Service Category */}
              <FormControl
                fullWidth
                required
                variant="outlined"
                sx={{ "& .MuiInputBase-root": assetFieldStyles }}
              >
                <InputLabel required={false} shrink>{requiredLabel("Service Category")}</InputLabel>
                <MuiSelect
                  value={formData.service_category_id}
                  onChange={(e) =>
                    handleInputChange("service_category_id", e.target.value)
                  }
                  label="Service Category *"
                  notched
                  displayEmpty
                  disabled={loadingCategories}
                >
                  <MenuItem value="">
                    {loadingCategories
                      ? "Loading..."
                      : "Select Service Category"}
                  </MenuItem>
                  {serviceCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Order Number */}
              {/* <TextField
                fullWidth
                label="Order Number"
                type="number"
                value={formData.order_no}
                onChange={(e) => handleInputChange("order_no", e.target.value)}
                placeholder="Enter Order Number"
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{ sx: assetFieldStyles }}
              /> */}

              {/* Mobile */}
              <TextField
                fullWidth
                label="Mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleMobileChange(e.target.value)}
                placeholder="Enter 10 digit mobile number"
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{ sx: assetFieldStyles }}
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]*",
                }}
                helperText={
                  formData.mobile && formData.mobile.length !== 10 ? "" : ""
                }
                error={formData.mobile !== "" && formData.mobile.length !== 10}
              />
            </div>

            {/* Second Row - Mobile and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              {/* Address */}
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter Address"
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{ sx: assetFieldStyles }}
              />

              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter Email"
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
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
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    height: "auto !important",
                    padding: "2px !important",
                    display: "flex",
                  },
                  "& .MuiInputBase-input[aria-hidden='true']": {
                    flex: 0,
                    width: 0,
                    height: 0,
                    padding: "0 !important",
                    margin: 0,
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    resize: "none !important",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  bottom: -4,
                  right: 8,
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
