import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X } from "lucide-react";
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

interface ServiceCategory {
  id: number;
  service_cat_name: string;
}

const fieldStyles = {
  height: '45px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '45px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

export const AddCuratedServicePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
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
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length <= 10) {
      handleInputChange('mobile', numbersOnly);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

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
      e.target.value = "";
      return;
    }

    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      toast.error("Image must be less than 3MB.");
      e.target.value = "";
      return;
    }

    setAttachment(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setAttachment(null);
    setImagePreview("");
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
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
      toast.error("Please enter a valid email address (e.g., user@example.com)");
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
      toast.error(error.message || "Failed to create service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/pulse/curated-services/service");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <button
            onClick={handleCancel}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span> Curated Service List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Create New Curated Service</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">NEW CURATED SERVICE</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6">
        {/* Service Details Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2L10 6L14 6.5L11 9.5L11.5 14L8 12L4.5 14L5 9.5L2 6.5L6 6L8 2Z" fill="#C72030" />
                </svg>
              </span>
              Service Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Name */}
              <TextField
                fullWidth
                label="Service Name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter Service Name"
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: {
                      "& .MuiFormLabel-asterisk": {
                        color: "red",
                      },
                    },
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              {/* Service Category */}
              <FormControl
                fullWidth
                required
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink
                  sx={{
                    "& .MuiFormLabel-asterisk": {
                      color: "red",   // or #d32f2f
                    },
                  }}
                >Service Category</InputLabel>
                <MuiSelect
                  value={formData.service_category_id}
                  onChange={(e) => handleInputChange("service_category_id", e.target.value)}
                  label="Service Category"
                  notched
                  displayEmpty
                  disabled={loadingCategories}
                >
                  <MenuItem value="">
                    {loadingCategories ? "Loading..." : "Select Service Category"}
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
                InputProps={{
                  sx: fieldStyles,
                }}
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
                InputProps={{
                  sx: fieldStyles,
                }}
                inputProps={{
                  maxLength: 10,
                  pattern: '[0-9]*',
                }}
                helperText={formData.mobile && formData.mobile.length !== 10 ? '' : ''}
                error={formData.mobile !== '' && formData.mobile.length !== 10}
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
                InputProps={{
                  sx: fieldStyles,
                }}
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
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>

            {/* Description - Full width */}
            <Box sx={{ position: "relative" }}>
              <TextField
                label={<span>Description<span className="text-red-500">*</span></span>}
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
        </div>

        {/* Add Attachments */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 2C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V5.41421C14 5.149 13.8946 4.89464 13.7071 4.70711L11.2929 2.29289C11.1054 2.10536 10.851 2 10.5858 2H3Z" fill="#C72030" />
                  <path d="M10 2V5C10 5.55228 10.4477 6 11 6H14" fill="#E5E0D3" />
                </svg>
              </span>
              Add Attachments
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                variant="outline"
                className="border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 bg-white hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>

              {/* Display attached image */}
              {imagePreview && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span>{attachment?.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Service Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
          >
            {loading ? 'Creating...' : 'Create Service'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
