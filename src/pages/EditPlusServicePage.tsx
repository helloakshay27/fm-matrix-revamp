import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Briefcase, Paperclip, X, Loader2 } from "lucide-react";
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

export const EditPlusServicePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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
    active: true,
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    fetchServiceCategories();
    if (id) {
      fetchPlusService();
    }
  }, [id]);

  const fetchServiceCategories = async () => {
    setLoadingCategories(true);
    try {
      const apiUrl = getFullUrl("/service_categories.json");
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
      setServiceCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching service categories:", error);
      toast.error("Failed to load service categories", {
        duration: 5000,
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchPlusService = async () => {
    if (!id) {
      toast.error("Service ID is required");
      navigate("/pulse/pulse-privilege/plus-service");
      return;
    }

    setFetchLoading(true);
    try {
      const apiUrl = getFullUrl(`/plus_services/${id}.json`);
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
      const serviceInfo = data.plus_service || data;

      setFormData({
        name: serviceInfo.name || "",
        description: serviceInfo.description || "",
        service_category_id: serviceInfo.service_category_id?.toString() || "",
        order_no: serviceInfo.order_no?.toString() || "",
        mobile: serviceInfo.mobile || "",
        address: serviceInfo.address || "",
        active: serviceInfo.active !== undefined ? serviceInfo.active : true,
      });

      // Handle existing image
      let imageUrl = "";
      if (serviceInfo.attachment) {
        imageUrl = serviceInfo.attachment.document_url || serviceInfo.attachment.url || "";
      } else if (serviceInfo.attachment_url) {
        imageUrl = serviceInfo.attachment_url;
      } else if (serviceInfo.image_url) {
        imageUrl = serviceInfo.image_url;
      }

      setExistingImageUrl(imageUrl);
    } catch (error: any) {
      console.error("Error fetching plus service:", error);
      toast.error(error.message || "Failed to load plus service data");
      navigate("/pulse/pulse-privilege/plus-service");
    } finally {
      setFetchLoading(false);
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

  const handleImageSelect = (file?: File) => {

    if (!file) {
      setAttachment(null);
      setImagePreview("");
      setImageChanged(false);
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
    setImageChanged(true);
  };

  const removeNewImage = () => {
    setAttachment(null);
    setImagePreview("");
    setImageChanged(false);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const removeExistingImage = () => {
    setExistingImageUrl("");
    setAttachment(null);
    setImagePreview("");
    setImageChanged(true);
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
      formDataToSend.append("plus_service[name]", formData.name);
      formDataToSend.append("plus_service[description]", formData.description);
      formDataToSend.append("plus_service[service_category_id]", formData.service_category_id);
      formDataToSend.append("plus_service[active]", formData?.active?.toString());

      // if (formData.order_no) {
      formDataToSend.append("plus_service[order_no]", formData.order_no);
      // }

      // if (formData.mobile) {
      formDataToSend.append("plus_service[mobile]", formData.mobile);
      // }

      // if (formData.address) {
      formDataToSend.append("plus_service[address]", formData.address);
      // }

      if (imageChanged) {
        if (attachment) {
          formDataToSend.append("plus_service[attachment]", attachment);
        } else {
          formDataToSend.append("plus_service[attachment]", "");
        }
      }

      const apiUrl = getFullUrl(`/plus_services/${id}.json`);
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          Authorization: getAuthHeader(),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Plus Service updated successfully!");
      navigate("/pulse/pulse-privilege/plus-service");
    } catch (error: any) {
      console.error("Error updating plus service:", error);
      toast.error(error.message || "Failed to update plus service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/pulse/pulse-privilege/plus-service");
  };

  const previewSrc = imageChanged ? imagePreview : existingImageUrl;

  if (fetchLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mb-4" />
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

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
          <span>Service List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Edit Service</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EDIT SERVICE</h1>
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
                sx={{ '& .MuiInputBase-root': assetFieldStyles }}
              >
                <InputLabel required={false} shrink>{requiredLabel("Service Category")}</InputLabel>
                <MuiSelect
                  value={formData.service_category_id}
                  onChange={(e) => handleInputChange("service_category_id", e.target.value)}
                  label="Service Category *"
                  notched
                  displayEmpty
                  disabled={loadingCategories}
                >
                  <MenuItem value="">
                    {loadingCategories ? "Loading..." : "Select Service Category"}
                  </MenuItem>
                  {serviceCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.service_cat_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Order Number */}
              <TextField
                fullWidth
                label="Order Number"
                type="number"
                value={formData.order_no}
                onChange={(e) => handleInputChange("order_no", e.target.value)}
                placeholder="Enter Order Number"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: assetFieldStyles }}
              />

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
                  pattern: '[0-9]*',
                }}
                error={formData.mobile !== '' && formData.mobile.length !== 10}
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
                sx={{ "& .MuiOutlinedInput-root": { height: "auto" } }}
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
            uploadText={previewSrc ? "Change Image" : "Upload Image"}
            emptyText={previewSrc ? "Current image" : "No image chosen"}
            accept="image/*"
            files={imageChanged && attachment ? [attachment] : []}
            onFilesSelected={(files) => handleImageSelect(files[0])}
            onRemove={removeNewImage}
          />
          {previewSrc && (
            <div className="relative inline-block mt-4">
              <img
                src={previewSrc}
                alt={imageChanged ? "New Service Preview" : "Current Service Image"}
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={imageChanged ? removeNewImage : removeExistingImage}
                aria-label="Remove image"
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </FormSection>

        <FormActionBar
          onCancel={handleCancel}
          submitLabel="Update Service"
          isSubmitting={loading}
          submitAsFormSubmit
        />
      </form>
    </div>
  );
};
