import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ImageUploadingButton } from "../components/reusable/ImageUploadingButton";
import { ImageCropper } from "../components/reusable/ImageCropper";
import ProjectBannerUpload from "../components/reusable/ProjectBannerUpload";
import { API_CONFIG } from "@/config/apiConfig";

const TestimonialEdit = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { testimonial } = state || {};
  console.log(testimonial);

  const [formData, setFormData] = useState({
    user_name: testimonial?.user_name || "",
    user_profile: testimonial?.profile_of_user || "",
    building_id: testimonial?.building_id ?? null,
    content: testimonial?.content || "",
    video_url: testimonial?.video_url || "",
    preview_image: testimonial?.preview_image || "",
    preview_image_16_by_9: testimonial?.preview_image_16_by_9 || [],
    preview_image_3_by_2: testimonial?.preview_image_3_by_2 || [],
    preview_image_1_by_1: testimonial?.preview_image_1_by_1 || [],
    preview_image_9_by_16: testimonial?.preview_image_9_by_16 || [],
    testimonial_video: null, // Initialize with null, will be set on file upload
  });

  const [buildingTypeOptions, setBuildingTypeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingVideoUrl, setExistingVideoUrl] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [errors, setErrors] = useState({});
  const [showVideoTooltip, setShowVideoTooltip] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [image, setImage] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTestimonialData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}testimonials/${testimonial.id}.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        setFormData({
          user_name: response.data.user_name || "",
          user_profile: response.data.profile_of_user || "",
          building_id: response.data.building_id ?? null,
          content: response.data.content || "",
          video_url: response.data.video_url || "",
          preview_image: response.data.preview_image || "",
          preview_image_16_by_9: response.data.preview_image_16_by_9 || [],
          preview_image_3_by_2: response.data.preview_image_3_by_2 || [],
          preview_image_1_by_1: response.data.preview_image_1_by_1 || [],
          preview_image_9_by_16: response.data.preview_image_9_by_16 || [],

        });

        // Set existing video URL if available
        const videoUrl = response.data?.testimonial_video?.document_url;
        if (videoUrl) {
          setExistingVideoUrl(videoUrl);
        }

        // Set existing preview image if available
        const imageUrl = response.data?.preview_image_16_by_9?.document_url;
        if (imageUrl) {
          setExistingImageUrl(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching testimonial data:", error);
        toast.error("Error loading testimonial details.");
      }
    };

    if (testimonial?.id) {
      fetchTestimonialData();
    }
  }, [testimonial?.id]);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}building_types.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setBuildingTypeOptions(response.data);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setBuildingTypeOptions([]);
        }
      } catch (error) {
        console.error("Error fetching building type data:", error);
        toast.error("Error loading building types.");
      }
    };

    fetchBuildingTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const TestimonialImageRatios = [
    { key: "preview_image_1_by_1", label: "1:1" },
    { key: "preview_image_16_by_9", label: "16:9" },
    { key: "preview_image_9_by_16", label: "9:16" },
    { key: "preview_image_3_by_2", label: "3:2" },
  ];

  const handleBannerVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          testimonial_video: "",
        }));
        toast.error("Video size must be less than 10MB.");
        return;
      }

      const videoUrl = URL.createObjectURL(file);
      setPreviewVideo(videoUrl);
      setFormData((prev) => ({
        ...prev,
        testimonial_video: file,
      }));
      setErrors((prev) => ({
        ...prev,
        testimonial_video: null,
      }));
      setExistingVideoUrl(null);
    }
  };

  const handleImageUpload = (newImageList) => {
    if (!newImageList || newImageList.length === 0) return;

    const file = newImageList[0].file;
    if (!file) return;

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ];

    const fileType = file.type;
    const sizeInMB = file.size / (1024 * 1024);

    if (!allowedImageTypes.includes(fileType)) {
      toast.error("❌ Please upload a valid image file.");
      return;
    }

    if (sizeInMB > 3) {
      toast.error("❌ Image size must be less than 3MB.");
      return;
    }

    setImage(newImageList);
    setDialogOpen(true); // Open cropper for images
  };

  const isImageFile = (file) => {
    if (!file) return false;
    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",
    ];
    if (typeof file === "string") {
      if (file.startsWith("data:image")) return true;
      const extension = file.split(".").pop().toLowerCase();
      return [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg",
        "bmp",
        "tiff",
      ].includes(extension);
    }

    return imageTypes.includes(file.type);
  };

  const bannerUploadConfig = {
    "preview image": ["16:9", "1:1", "9:16", "3:2"],
  };

  const currentUploadType = "preview image"; // Can be dynamic
  const selectedRatios = bannerUploadConfig[currentUploadType] || [];
  const dynamicLabel = currentUploadType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const dynamicDescription = `Supports ${selectedRatios.join(
    ", "
  )} aspect ratios`;

  // const updateFormData = (key, files) => {
  //   setFormData((prev) => {
  //     // Normalize previous entries: ensure it's always an array
  //     const existing = Array.isArray(prev[key])
  //       ? prev[key]
  //       : prev[key]
  //       ? [prev[key]]
  //       : [];

  //     // Append new files without overwriting
  //     const merged = [...existing, ...files];

  //     console.log(`✅ Merged formData[${key}]:`, merged);

  //     return {
  //       ...prev,
  //       [key]: merged,
  //     };
  //   });
  // };
  const updateFormData = (key, files) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [key]: files,
      };
      console.log(`✅ Replaced formData[${key}]:`, newData[key]);
      return newData;
    });
  };


  const handleCropComplete = (validImages) => {
    if (!validImages || validImages.length === 0) {
      toast.error("No valid images selected.");
      setShowUploader(false);
      return;
    }

    const ratioKeyMap = {
      "1:1": "preview_image_1_by_1",
      "16:9": "preview_image_16_by_9",
      "9:16": "preview_image_9_by_16",
      "3:2": "preview_image_3_by_2",
    };

    validImages.forEach((img) => {
      const key = ratioKeyMap[img.ratio];
      if (key) {
        updateFormData(key, [img]); // Append new image to existing ones
      }
    });

    // Only update preview if needed (e.g., for UI display of the latest image)
    setPreviewImg(validImages[0].preview);
    setShowUploader(false);
  };

  console.log("formData", formData);

  const discardImage = (key, imageToRemove) => {
    setFormData((prev) => {
      const updatedArray = (prev[key] || []).filter(
        (img) => img.id !== imageToRemove.id
      );

      // Remove the key if the array becomes empty
      const newFormData = { ...prev };
      if (updatedArray.length === 0) {
        delete newFormData[key];
      } else {
        newFormData[key] = updatedArray;
      }

      return newFormData;
    });

    // If the removed image is being previewed, reset previewImg
    if (previewImg === imageToRemove.preview) {
      setPreviewImg(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    // Optional: Add validation here if needed

    // const testimonial16by9 = formData.preview_image_16_by_9;;
    // const hasTestimonial16by9 = Array.isArray(testimonial16by9)
    //   ? testimonial16by9.some(img => img?.file instanceof File || img?.id || img?.document_file_name)
    //   : !!(testimonial16by9?.file instanceof File || testimonial16by9?.id || testimonial16by9?.document_file_name);

    // if (!hasTestimonial16by9) {
    //   toast.error("Please upload at least one 16:9 preview image.");
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }


    setLoading(true);
    try {
      const sendData = new FormData();
      sendData.append("testimonial[user_name]", formData.user_name);
      sendData.append("testimonial[profile_of_user]", formData.user_profile);
      sendData.append("testimonial[building_id]", formData.building_id);
      sendData.append("testimonial[content]", formData.content);

      // Append video URL if provided
      if (formData.video_url && formData.video_url.trim()) {
        sendData.append("testimonial[video_url]", formData.video_url.trim());
      }

      // Always use the cropped image file if present
      // if (image[0] && image[0].file instanceof File) {
      //   sendData.append("testimonial[preview_image]", image[0].file);
      // } else

      // Object.entries(formData).forEach(([key, images]) => {
      //   if (key.startsWith("preview_image_") && Array.isArray(images)) {
      //     images.forEach((img) => {
      //       const backendField =
      //         key.replace("video_preview_image_url", "testimonial[video_preview_image_url") + "]";
      //       // e.g., preview[preview_image_1by1]

      //       if (img.file instanceof File) {
      //         sendData.append(backendField, img.file);
      //       }
      //     });
      //   }
      // });
      // Append all preview image files
      TestimonialImageRatios.forEach(({ key }) => {
        const images = formData[key];
        if (Array.isArray(images) && images.length > 0) {
          const img = images[0];
          if (img?.file instanceof File) {
            sendData.append(`testimonial[${key}]`, img.file);
          }
        }
      });



      // Handle 16:9 preview image from new structure
      if (Array.isArray(formData.preview_image_16_by_9)) {
        formData.preview_image_16_by_9.forEach((img) => {
          if (img.file instanceof File) {
            sendData.append("testimonial[preview_image_16_by_9]", img.file);
          }
        });
      }


      // Append video file if present
      if (formData.testimonial_video) {
        sendData.append(
          "testimonial[testimonial_video]",
          formData.testimonial_video
        );
      }

      await axios.put(
        `${baseURL}testimonials/${testimonial.id}.json`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Testimonial updated successfully!");
      sessionStorage.removeItem("editTestimonialId");
      navigate("/testimonial-list");
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Error updating testimonial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // const handleFileDiscardCoverImage = async (key, index) => {
  //   const Image = formData[key][index]; // Get the selected image
  //   if (!Image.id) {
  //     // If the image has no ID, it's a newly uploaded file. Just remove it locally.
  //     const updatedFiles = formData[key].filter((_, i) => i !== index);
  //     setFormData({ ...formData, [key]: updatedFiles });
  //     toast.success("Image removed successfully!");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `${baseURL}projects/${id}/remove_creative_image/${Image.id}.json`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to delete videos");
  //     }

  //     // Remove the deleted image from the state
  //     const updatedFiles = formData[key].filter((_, i) => i !== index);
  //     setFormData({ ...formData, [key]: updatedFiles });

  //     // console.log(`Image with ID ${Image.id} deleted successfully`);
  //     toast.success("Image deleted successfully!");
  //   } catch (error) {
  //     console.error("Error deleting image:", error);
  //     alert("Failed to delete image. Please try again.");
  //   }
  // };
  // const handleFetchedDiscardGallery = async (key, index, imageId) => {
  //   if (!imageId) {
  //     setFormData((prev) => {
  //       const currentFiles = Array.isArray(prev[key]) ? prev[key] : [prev[key]];
  //       const updatedFiles = currentFiles.filter((_, i) => i !== index);
  //       return { ...prev, [key]: updatedFiles };
  //     });
  //     toast.success("Image removed successfully!");
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch(
  //       `${baseURL}testimonials/${testimonial.id}/remove_image/${imageId}.json`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       }
  //     );
  
  //     if (!response.ok) {
  //       if (response.status === 404) {
  //         const currentFiles = Array.isArray(formData[key])
  //           ? formData[key]
  //           : [formData[key]];
  //         const updatedFiles = currentFiles.filter((_, i) => i !== index);
  //         setFormData({ ...formData, [key]: updatedFiles });
  //         toast.success("Image removed from UI (already deleted on server).");
  //         return;
  //       }
  //       throw new Error("Failed to delete image");
  //     }
  
  //     // Successful deletion
  //     setFormData((prev) => {
  //       const currentFiles = Array.isArray(prev[key]) ? prev[key] : [prev[key]];
  //       const updatedFiles = currentFiles.filter((_, i) => i !== index);
  //       return { ...prev, [key]: updatedFiles };
  //     });
  
  //     toast.success("Image deleted successfully!");
  //   } catch (error) {
  //     console.error("Error deleting image:", error.message);
  //     toast.error("Failed to delete image. Please try again.");
  //   }
  // };

  const handleFetchedDiscardGallery = async (key, index = null, imageId = null) => {
  // Handle preview image case (single URL)
  if (key === "video_preview_image_url") {
    setFormData(prev => ({ ...prev, video_preview_image_url: "" }));
    toast.success("Preview image removed successfully!");
    return;
  }

  // Handle array cases (for other images)
  if (!imageId) {
    setFormData((prev) => {
      const currentFiles = Array.isArray(prev[key]) ? prev[key] : [prev[key]];
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      return { ...prev, [key]: updatedFiles };
    });
    toast.success("Image removed successfully!");
    return;
  }

  try {
    const response = await fetch(
      `${baseURL}testimonials/${testimonial.id}/remove_image/${imageId}.json`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        const currentFiles = Array.isArray(formData[key])
          ? formData[key]
          : [formData[key]];
        const updatedFiles = currentFiles.filter((_, i) => i !== index);
        setFormData({ ...formData, [key]: updatedFiles });
        toast.success("Image removed from UI (already deleted on server).");
        return;
      }
      throw new Error("Failed to delete image");
    }

    // Successful deletion
    setFormData((prev) => {
      const currentFiles = Array.isArray(prev[key]) ? prev[key] : [prev[key]];
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      return { ...prev, [key]: updatedFiles };
    });

    toast.success("Image deleted successfully!");
  } catch (error) {
    console.error("Error deleting image:", error.message);
    toast.error("Failed to delete image. Please try again.");
  }
};
  
  return (
    <div className="">
      <div className="">
        <div className="module-data-section p-3">
          {/* <form onSubmit={handleSubmit}> */}
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Testimonial Edit</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>User Name</label>
                    <input
                      className="form-control"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>Building Type</label>
                    <SelectBox
                      options={buildingTypeOptions.map((option) => ({
                        label: option.building_type,
                        value: option.id,
                      }))}
                      defaultValue={formData.building_id}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, building_id: value }))
                      }
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      className="form-control"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>Video URL</label>
                    <input
                      className="form-control"
                      type="text"
                      name="video_url"
                      placeholder="Enter video URL"
                      value={formData.video_url}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Testimonial Video{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowVideoTooltip(true)}
                        onMouseLeave={() => setShowVideoTooltip(false)}
                      >
                        [i]
                        {showVideoTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 10 MB
                          </span>
                        )}
                      </span>
                      <span className="otp-asterisk"> *</span>
                    </label>

                    <input
                      className="form-control"
                      type="file"
                      name="testimonial_video"
                      accept="video/*"
                      onChange={handleBannerVideoChange}
                    />

                    {errors.testimonial_video && (
                      <span className="error text-danger">
                        {errors.testimonial_video}
                      </span>
                    )}

                    {previewVideo && (
                      <div className="mt-2">
                        <video
                          src={previewVideo}
                          controls
                          className="img-fluid rounded"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    {!previewVideo && existingVideoUrl && (
                      <div className="mt-2">
                        <video
                          src={existingVideoUrl}
                          controls
                          className="img-fluid rounded"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label className="d-flex align-items-center gap-1 mb-2">
                      <span>Preview Image</span>

                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowVideoTooltip(true)}
                        onMouseLeave={() => setShowVideoTooltip(false)}
                      >
                        [i]
                        {showVideoTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB and Required ratio is 16:9
                          </span>
                        )}
                      </span>

                      <span className="otp-asterisk text-danger">*</span>
                    </label>

                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => setShowUploader(true)}
                      className="custom-upload-button input-upload-button"
                    >
                      <span className="upload-button-label">Choose file</span>
                      <span className="upload-button-value">No file chosen</span>
                    </span>

                    {showUploader && (
                      <ProjectBannerUpload
                        onClose={() => setShowUploader(false)}
                        includeInvalidRatios={false}
                        selectedRatioProp={selectedRatios}
                        showAsModal={true}
                        label={dynamicLabel}
                        description={dynamicDescription}
                        onContinue={handleCropComplete}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-12 mt-4">
                <div className="tbl-container">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Preview</th>
                        <th>Ratio</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TestimonialImageRatios.flatMap(({ key, label }) => {
                        const files = Array.isArray(formData[key])
                          ? formData[key]
                          : formData[key]
                            ? [formData[key]]
                            : [];

                        return files.map((file, index) => {
                          const preview = file.preview || file.document_url || '';
                          const name = file.name || file.document_file_name || `Image ${index + 1}`;
                          const ratio = file.ratio || label;

                          return (
                            <tr key={`${key}-${index}`}>
                              <td>{name}</td>
                              <td>
                                <img
                                  style={{ maxWidth: 100, maxHeight: 100, objectFit: "cover" }}
                                  className="img-fluid rounded"
                                  src={preview}
                                  alt={name}
                                />
                              </td>
                              <td>{ratio}</td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() => handleFetchedDiscardGallery(key, index, file.id)}
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>

                  </table>
                </div>
              </div>


            </div>
          </div>

          <div className="row mt-2 justify-content-center">
            <div className="col-md-2 mt-3">
              <button
                type="submit"
                className="purple-btn2 w-100"
                disabled={loading}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
            <div className="col-md-2 mt-3">
              <button
                type="button"
                className="purple-btn2 w-100"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
          {/* </form> */}
        </div>
      </div>
    </div>
  );
};

export default TestimonialEdit;