import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
// import { TextField } from "@mui/material";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
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

export const EditCuratedServiceCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    service_cat_name: "",
    service_tag: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    if (id) {
      console.log("calledddd")
      fetchServiceCategory();
    }
  }, [id]);

  const fetchServiceCategory = async () => {
    if (!id) {
      toast.error("Service Category ID is required");
      navigate("/pulse/curated-services/service-category");
      return;
    }

    setFetchLoading(true);
    try {
      const apiUrl = getFullUrl(`/osr_setups/osr_category_detail.json?osr_category_id=${id}`);
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
      const categoryInfo = data.osr_category || data;

      setFormData({
        service_cat_name: categoryInfo.name || "",
        service_tag: categoryInfo.service_tag || "curated",
      });

      // Handle existing image
      let imageUrl = "";
      if (categoryInfo.attachment && categoryInfo.attachment.document_url) {
        imageUrl = categoryInfo.attachment.document_url;
      } else if (categoryInfo.service_image) {
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
      //   navigate("/pulse/pulse-privilege/service-category");
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

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
      e.target.value = "";
      return;
    }

    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      toast.error("Image must be less than 3MB.");
      e.target.value = "";
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
    if (!formData.service_tag) {
      toast.error("Service tag is required");
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

      // if (imageChanged) {
        // Use FormData if image changed
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.service_cat_name);
        formDataToSend.append("service_tag", formData.service_tag);

        if (imageFile) {
          formDataToSend.append("attachment", imageFile);
        }
        else {
          formDataToSend.append("attachment", "");
        }

        requestBody = formDataToSend;
        headers = {
          Authorization: getAuthHeader(),
        };
      // } 
      // else {
      //   // Use JSON if no image change
      //   requestBody = JSON.stringify({
      //     service_category: {
      //       name: formData.service_cat_name,
      //       service_tag: formData.service_tag,
      //     },
      //   });
      //   headers = {
      //     "Content-Type": "application/json",
      //     Authorization: getAuthHeader(),
      //   };
      // }

      const apiUrl = getFullUrl(`/osr_setups/modify_osr_category.json?id=${id}`);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Service Category updated successfully!");
      navigate("/pulse/curated-services/service-category");
    } catch (error: any) {
      console.error("Error updating service category:", error);
      toast.error(error.message || "Failed to update service category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/pulse/curated-services/service-category");
  };

  if (fetchLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030] mx-auto mb-4" />
          <p className="text-gray-600">Loading service category details...</p>
        </div>
      </div>
    );
  }

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
          <span>Service Category List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Edit Service Category</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">EDIT SERVICE CATEGORY</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Category Details Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2L10 6L14 6.5L11 9.5L11.5 14L8 12L4.5 14L5 9.5L2 6.5L6 6L8 2Z" fill="#C72030" />
                </svg>
              </span>
              Service Category Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Category Name */}
              <TextField
                fullWidth
                label="Service Category Name"
                required
                value={formData.service_cat_name}
                onChange={(e) => handleInputChange("service_cat_name", e.target.value)}
                placeholder="Enter Service Category Name"
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

              {/* Service Tag Dropdown */}
              <FormControl
                fullWidth
                required
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Service Tag</InputLabel>
                <MuiSelect
                  value={formData.service_tag}
                  onChange={(e) => handleInputChange("service_tag", e.target.value)}
                  label="Service Tag"
                  notched
                  displayEmpty
                >
                  <MenuItem value="curated">Curated</MenuItem>
                  <MenuItem value="supported">Supported</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
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
              Add Service Image
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
                Upload Image
              </Button>

              {/* Display attached image */}
              {(imagePreview && imageChanged) || existingImageUrl ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span>{imageChanged ? imageFile?.name : 'Current image'}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={imageChanged ? removeNewImage : removeExistingImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="relative inline-block">
                    <img
                      src={imageChanged ? imagePreview : existingImageUrl}
                      alt={imageChanged ? "New Service Category Preview" : "Current Service Category Image"}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm text-gray-500">No image selected</p>
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
            {loading ? 'Updating...' : 'Update Category'}
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
