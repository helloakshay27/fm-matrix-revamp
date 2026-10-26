import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { ArrowLeft, LayoutGrid, Paperclip } from "lucide-react";
import { TextField } from "@mui/material";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
import { AttachmentUpload } from "@/components/common/AttachmentUpload";

const requiredLabel = (text: string) => (
  <span>
    {text}
    <span className="fm-required-mark">*</span>
  </span>
);

export const AddServiceCategoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    service_cat_name: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageSelect = (file?: File) => {

    if (!file) {
      setImageFile(null);
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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    if (!formData.service_cat_name.trim()) {
      toast.error("Service category name is required");
      return false;
    }
    if (!imageFile) {
      toast.error("Service image is required");
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
      formDataToSend.append("service_category[service_cat_name]", formData.service_cat_name);
      formDataToSend.append("service_category[service_image]", imageFile!);
      formDataToSend.append("service_category[active]", "true");

      const apiUrl = getFullUrl("/service_categories.json");
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

      toast.success("Service Category created successfully!");
      navigate("/pulse/pulse-privilege/service-category");
    } catch (error: any) {
      console.error("Error creating service category:", error);
      toast.error(error.message || "Failed to create service category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/pulse/pulse-privilege/service-category");
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
          <span>Service Category List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Create New Service Category</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW SERVICE CATEGORY</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Service Category Details */}
        <FormSection title="SERVICE CATEGORY DETAILS" icon={LayoutGrid}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Service Category Name */}
            <TextField
              fullWidth
              label={requiredLabel("Service Category Name")}
              required
              value={formData.service_cat_name}
              onChange={(e) => handleInputChange("service_cat_name", e.target.value)}
              placeholder="Enter Service Category Name"
              variant="outlined"
              InputLabelProps={{ required: false, shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
          </div>
        </FormSection>

        {/* Service Image */}
        <FormSection title="SERVICE IMAGE" icon={Paperclip}>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            {requiredLabel("Upload Service Image")}
          </h3>
          <AttachmentUpload
            chooseText="Choose Image"
            uploadText="Upload Image"
            emptyText="No image chosen"
            accept="image/*"
            files={imageFile ? [imageFile] : []}
            onFilesSelected={(files) => handleImageSelect(files[0])}
            onRemove={removeImage}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Service Category Preview"
              className="mt-4 w-32 h-32 object-cover rounded-lg border border-gray-200"
            />
          )}
        </FormSection>

        <FormActionBar
          onCancel={handleCancel}
          submitLabel="Create Category"
          isSubmitting={loading}
          submitAsFormSubmit
        />
      </form>
    </div>
  );
};
