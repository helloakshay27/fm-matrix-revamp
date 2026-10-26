import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { ArrowLeft, LayoutGrid, Paperclip, X, Loader2 } from "lucide-react";
import { TextField } from "@mui/material";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
import { AttachmentUpload } from "@/components/common/AttachmentUpload";

const requiredLabel = (text: string) => (
  <span>
    {text}
    <span className="fm-required-mark">*</span>
  </span>
);

export const EditServiceCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    service_cat_name: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    if (id) {
      fetchServiceCategory();
    }
  }, [id]);

  const fetchServiceCategory = async () => {
    if (!id) {
      toast.error("Service Category ID is required");
      navigate("/pulse/pulse-privilege/service-category");
      return;
    }

    setFetchLoading(true);
    try {
      const apiUrl = getFullUrl(`/service_categories/${id}.json`);
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
      const categoryInfo = data.service_category || data;

      setFormData({
        service_cat_name: categoryInfo.service_cat_name || "",
      });

      // Handle existing image
      let imageUrl = "";
      if (categoryInfo.service_image) {
        imageUrl = categoryInfo.service_image.document_url || categoryInfo.service_image.url || "";
      } else if (categoryInfo.service_image_url) {
        imageUrl = categoryInfo.service_image_url;
      } else if (categoryInfo.image_url) {
        imageUrl = categoryInfo.image_url;
      }

      setExistingImageUrl(imageUrl);
    } catch (error: any) {
      console.error("Error fetching service category:", error);
      toast.error(error.message || "Failed to load service category data");
      navigate("/pulse/pulse-privilege/service-category");
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

  const handleImageSelect = (file?: File) => {

    if (!file) {
      setImageFile(null);
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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageChanged(true);
  };

  const removeNewImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageChanged(false);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const removeExistingImage = () => {
    setExistingImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setImageChanged(true);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    if (!formData.service_cat_name.trim()) {
      toast.error("Service category name is required");
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
      let requestBody: any;
      let headers: any;

      if (imageChanged) {
        // Use FormData if image changed
        const formDataToSend = new FormData();
        formDataToSend.append("service_category[service_cat_name]", formData.service_cat_name);
        
        if (imageFile) {
          formDataToSend.append("service_category[service_image]", imageFile);
        } else {
          formDataToSend.append("service_category[service_image]", "");
        }

        requestBody = formDataToSend;
        headers = {
          Authorization: getAuthHeader(),
        };
      } else {
        // Use JSON if no image change
        requestBody = JSON.stringify({
          service_category: {
            service_cat_name: formData.service_cat_name,
          },
        });
        headers = {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        };
      }

      const apiUrl = getFullUrl(`/service_categories/${id}.json`);
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: headers,
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Service Category updated successfully!");
      navigate("/pulse/pulse-privilege/service-category");
    } catch (error: any) {
      console.error("Error updating service category:", error);
      toast.error(error.message || "Failed to update service category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/pulse/pulse-privilege/service-category");
  };

  const previewSrc = imageChanged ? imagePreview : existingImageUrl;

  if (fetchLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mb-4" />
          <p className="text-gray-600">Loading service category details...</p>
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
          <span>Service Category List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Edit Service Category</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EDIT SERVICE CATEGORY</h1>
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
          <AttachmentUpload
            label="Service Image"
            chooseText="Choose Image"
            uploadText={previewSrc ? "Change Image" : "Upload Image"}
            emptyText={previewSrc ? "Current image" : "No image chosen"}
            accept="image/*"
            files={imageChanged && imageFile ? [imageFile] : []}
            onFilesSelected={(files) => handleImageSelect(files[0])}
            onRemove={removeNewImage}
          />
          {previewSrc && (
            <div className="relative inline-block mt-4">
              <img
                src={previewSrc}
                alt={imageChanged ? "New Service Category Preview" : "Current Service Category Image"}
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
          submitLabel="Update Category"
          isSubmitting={loading}
          submitAsFormSubmit
        />
      </form>
    </div>
  );
};
