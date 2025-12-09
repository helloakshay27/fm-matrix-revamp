import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";

import { ImageCropper } from "../components/reusable/ImageCropper";
import ProjectBannerUpload from "../components/reusable/ProjectBannerUpload";
import ProjectImageVideoUpload from "../components/reusable/ProjectImageVideoUpload";

const BannerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewImg, setPreviewImg] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [showVideoTooltip, setShowVideoTooltip] = useState(false);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [videoKey, setVideoKey] = useState(Date.now());
  const [fileType, setFileType] = useState(null);
  const [originalBannerVideo, setOriginalBannerVideo] = useState(null); // Store original preview
  const [showUploader, setShowUploader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions

  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    banner_video: null,
    active: true,
    banner_video_1_by_1: null,
    banner_video_9_by_16: null,
    banner_video_16_by_9: null,
    banner_video_3_by_2: null,
  });
  console.log("formData", formData);

  useEffect(() => {
    fetchBanner();
    fetchProjects();
    return () => {
      if (previewImg) URL.revokeObjectURL(previewImg);
      if (previewVideo) URL.revokeObjectURL(previewVideo);
      if (image?.data_url) URL.revokeObjectURL(image.data_url);
    };
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await axios.get(`${baseURL}banners/${id}.json`);
      if (response.data) {
        const bannerData = response.data;
        setFormData({
          title: bannerData.title,
          project_id: bannerData.project_id,
          banner_video: bannerData.banner_video?.document_url || null,
          banner_video_1_by_1: bannerData.banner_video_1_by_1 || null,
          banner_video_9_by_16: bannerData.banner_video_9_by_16 || null,
          banner_video_16_by_9: bannerData.banner_video_16_by_9 || null,
          banner_video_3_by_2: bannerData.banner_video_3_by_2 || null,
          active: true,
        });
        setOriginalBannerVideo(bannerData.banner_video?.document_url || null); // Store original
        if (bannerData.banner_video?.document_url) {
          const isImage = isImageFile(bannerData.banner_video.document_url);
          setFileType(isImage ? "image" : "video");
          if (isImage) {
            setPreviewImg(bannerData.banner_video.document_url);
          } else {
            setPreviewVideo(bannerData.banner_video.document_url);
          }
        } else {
          setPreviewImg(null);
          setPreviewVideo(null);
          setFileType(null);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch banner data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseURL}projects.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProjects(response.data.projects || []);
    } catch (error) {
      toast.error("Failed to fetch projects");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/bmp",
      "image/tiff",
      "image/gif",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
      "video/x-flv",
    ];
    const sizeInMB = file.size / (1024 * 1024);

    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      toast.error("❌ Please upload a valid image or video file.");
      return resetFileState();
    }

    if (isImage && sizeInMB > 3) {
      toast.error("❌ Image size must be less than 3MB.");
      return resetFileState();
    }

    if (isVideo && sizeInMB > 20) {
      toast.error("❌ Video size must be less than 20MB.");
      return resetFileState();
    }

    if (previewVideo) URL.revokeObjectURL(previewVideo);
    if (previewImg) URL.revokeObjectURL(previewImg);
    if (image?.data_url) URL.revokeObjectURL(image.data_url);

    setFileType(isVideo ? "video" : "image");
    const newDataURL = URL.createObjectURL(file);
    setImage({ file, data_url: newDataURL });

    if (isVideo) {
      setPreviewVideo(newDataURL);
      setFormData((prev) => ({ ...prev, banner_video: file }));
      setPreviewImg(null);
      setVideoKey(Date.now());
    } else {
      setDialogOpen(true);
      setPreviewVideo(null);
      setCroppedImage(null);
    }
  };

  const resetFileState = () => {
    setImage(null);
    setPreviewImg(null);
    setPreviewVideo(null);
    setFormData((prev) => ({ ...prev, banner_video: originalBannerVideo }));
    setFileType(
      originalBannerVideo
        ? isImageFile(originalBannerVideo)
          ? "image"
          : "video"
        : null
    );
    if (originalBannerVideo) {
      if (isImageFile(originalBannerVideo)) {
        setPreviewImg(originalBannerVideo);
      } else {
        setPreviewVideo(originalBannerVideo);
      }
    }
  };

  // const handleCropComplete = (cropped) => {
  //   if (cropped) {
  //     setCroppedImage(cropped.base64);
  //     setPreviewImg(cropped.base64);
  //     setFormData((prev) => ({ ...prev, banner_video: cropped.file }));
  //   } else {
  //     if (image?.data_url) URL.revokeObjectURL(image.data_url);
  //     setImage(null);
  //     setPreviewImg(null);
  //     setFormData((prev) => ({ ...prev, banner_video: originalBannerVideo }));
  //     setFileType(originalBannerVideo ? (isImageFile(originalBannerVideo) ? "image" : "video") : null);
  //     if (originalBannerVideo) {
  //       if (isImageFile(originalBannerVideo)) {
  //         setPreviewImg(originalBannerVideo);
  //       } else {
  //         setPreviewVideo(originalBannerVideo);
  //       }
  //     }
  //     const fileInput = document.querySelector('input[type="file"]');
  //     if (fileInput) {
  //       fileInput.value = '';
  //     }
  //   }
  //   setDialogOpen(false);
  // };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is mandatory";
    if (!formData.project_id) newErrors.project_id = "Project is mandatory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const bannerUploadConfig = {
    "Banner Attachment": ["1:1", "9:16", "16:9", "3:2"],
  };

  const currentUploadType = "Banner Attachment"; // Can be dynamic
  const selectedRatios = bannerUploadConfig[currentUploadType] || [];
  const dynamicLabel = currentUploadType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const dynamicDescription = `Supports ${selectedRatios.join(
    ", "
  )} aspect ratios`;

  // const updateFormData = (key, files) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [key]: [...(prev[key] || []), ...files],
  //   }));
  // };

  const project_banner = [
    { key: "banner_video_1_by_1", label: "1:1" },
    { key: "banner_video_16_by_9", label: "16:9" },
    { key: "banner_video_9_by_16", label: "9:16" },
    { key: "banner_video_3_by_2", label: "3:2" },
  ];
  // const updateFormData = (key, files) => {
  //   setFormData((prev) => {
  //     const existing = Array.isArray(prev[key]) ? prev[key] : prev[key] ? [prev[key]] : [];
  //     return {
  //       ...prev,
  //       [key]: [...existing, ...files],
  //     };
  //   });
  // };

  const updateFormData = (key, files) => {
    setFormData((prev) => ({
      ...prev,
      [key]: files, // Replace existing files instead of appending
    }));
  };

  // const handleCropComplete = (validImages) => {
  //   if (!validImages || validImages.length === 0) {
  //     toast.error("No valid images selected.");
  //     setShowUploader(false);
  //     return;
  //   }

  //   validImages.forEach((img) => {
  //     const formattedRatio = img.ratio.replace(':', '_by_'); // e.g., "1:1" -> "1_by_1", "9:16" -> "9_by_16"
  //     const key = `banner_video_${formattedRatio}`; // e.g., banner_video_1_by_1, banner_video_9_by_16
  //     updateFormData(key, [img]); // send as array to preserve consistency
  //   });

  //   // setPreviewImg(validImages[0].preview); // preview first image only
  //   setShowUploader(false);
  // };

  const handleCropComplete = (validImages, videoFiles = []) => {
    // Handle video files first
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach((video) => {
        const formattedRatio = video.ratio.replace(":", "_by_");
        const key = `banner_video_${formattedRatio}`;
        updateFormData(key, [video]);

        // Set preview for the first video
        if (videoFiles[0] === video) {
          setPreviewVideo(URL.createObjectURL(video.file));
          setFileType("video");
        }
      });
      return;
    }

    // Handle images (existing logic)
    if (!validImages || validImages.length === 0) {
      toast.error("No valid files selected.");
      setShowUploader(false);
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_");
      const key = `banner_video_${formattedRatio}`;
      updateFormData(key, [img]);

      // Set preview for the first image
      if (validImages[0] === img) {
        setPreviewImg(img.preview);
        setFileType("image");
      }
    });

    setShowUploader(false);
  };
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
    if (isSubmitting) return; // Prevent multiple submissions

    // const banner1by1 = formData.banner_video_1_by_1;
    // const hasProjectBanner1by1 = Array.isArray(banner1by1)
    //   ? banner1by1.some(
    //       (img) =>
    //         img?.file instanceof File || img?.id || img?.document_file_name
    //     )
    //   : !!(
    //       banner1by1?.file instanceof File ||
    //       banner1by1?.id ||
    //       banner1by1?.document_file_name
    //     );

    // if (!hasProjectBanner1by1) {
    //   toast.error("Banner Attachment with 1:1 ratio is required.");
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    if (!validateForm()) return;

    setLoading(true);
    try {
      const sendData = new FormData();

      sendData.append("banner[title]", formData.title);
      sendData.append("banner[project_id]", formData.project_id);

      // Append the main video if it's a File
      if (formData.banner_video instanceof File) {
        sendData.append("banner[banner_video]", formData.banner_video);
      }

      // Handle banner video/image fields like banner_video_1_by_1, banner_video_9_by_16, etc.
      Object.entries(formData).forEach(([key, images]) => {
        if (
          (key.startsWith("banner_video_") ||
            key.startsWith("banner_image_")) &&
          Array.isArray(images)
        ) {
          images.forEach((img) => {
            const backendField =
              key.replace("banner_image_", "banner[banner_image_") + "]";
            if (img.file instanceof File) {
              // sendData.append(backendField, img.file);
              sendData.append(`banner[${key}]`, img.file);
            }
          });
        }
      });

      console.log("dta to be sent:", Array.from(sendData.entries()));

      await axios.put(`${baseURL}banners/${id}.json`, sendData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Banner updated successfully");
      navigate("/banner-list");
    } catch (error) {
      toast.error("Error updating banner");
    } finally {
      setLoading(false);
    }
  };

  const isImageFile = (file) => {
    if (!file) return false;
    if (typeof file === "string") {
      const ext = file.split(".").pop()?.toLowerCase();
      return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff"].includes(ext);
    }
    return file.type?.startsWith("image/");
  };

  const handleCancel = () => navigate(-1);

  const handleFetchedDiscardGallery = async (key, index, imageId) => {
    // If no imageId, it's a new image, just remove locally
    if (!imageId) {
      setFormData((prev) => {
        const updatedFiles = Array.isArray(prev[key])
          ? prev[key].filter((_, i) => i !== index)
          : [];
        return { ...prev, [key]: updatedFiles };
      });
      toast.success("Image removed successfully!");
      return;
    }

    // Existing image: delete from server, then remove locally
    try {
      const response = await fetch(
        `${baseURL}banners/${id}/remove_image/${imageId}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        // Optionally, handle 404 as a successful local delete
        if (response.status === 404) {
          const updatedFiles = Array.isArray(formData[key])
            ? formData[key].filter((_, i) => i !== index)
            : [];
          setFormData({ ...formData, [key]: updatedFiles });
          toast.success("Image removed from UI (already deleted on server).");
          return;
        }
        throw new Error("Failed to delete image");
      }

      // Remove from UI after successful delete
      setFormData((prev) => {
        const updatedFiles = Array.isArray(prev[key])
          ? prev[key].filter((_, i) => i !== index)
          : [];
        return { ...prev, [key]: updatedFiles };
      });

      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error.message);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  // return (
  //   <div className="container-fluid d-flex flex-column" style={{ height: '100vh' }}>
  //     <style>
  //       {`
  //         input[type="file"]::-webkit-file-upload-button {
  //           background: #f1f5f9;
  //           color: #1f2937;
  //           padding: 8px 16px;
  //           margin: 0;
  //           margin-right: 12px;
  //           border: none;
  //           border-right: 1px solid #cbd5e0;
  //           border-radius: 5px 0 0 5px;
  //           cursor: pointer;
  //           font-weight: 500;
  //         }

  //         input[type="file"] {
  //           border: 1px solid #cbd5e0;
  //           border-radius: 6px;
  //           padding: 0;
  //           font-family: sans-serif;
  //           color: #374151;
  //           height: 38px;
  //           margin-left: 10px;
  //         }

  //         .scrollable-content {
  //           overflow-y: auto;
  //           flex-grow: 1;
  //           padding-bottom: 120px; /* space to avoid overlap with sticky footer */
  //         }

  //         .sticky-footer {
  //           background: white;
  //           padding: 12px 0;
  //           box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  //           position: sticky;
  //           bottom: 0;
  //           z-index: 100;
  //         }
  //       `}
  //     </style>

  //     {/* Scrollable Content Area */}
  //     <div className="scrollable-content">
  //       <div className="row">
  //         <div className="col-12">
  //           <div className="card mt-4">
  //             <div className="card-header">
  //               <h3 className="card-title">Edit Banner</h3>
  //             </div>
  //             <div className="card-body">
  //               {loading ? (
  //                 <p>Loading...</p>
  //               ) : (
  //                 <div className="row">
  //                   <div className="col-md-3">
  //                     <div className="form-group">
  //                       <label>Title <span className="text-danger">*</span></label>
  //                       <input
  //                         className="form-control"
  //                         type="text"
  //                         name="title"
  //                         value={formData.title}
  //                         onChange={handleChange}
  //                       />
  //                       {errors.title && <span className="text-danger">{errors.title}</span>}
  //                     </div>
  //                   </div>

  //                   <div className="col-md-3">
  //                     <div className="form-group">
  //                       <label>Project <span className="text-danger">*</span></label>
  //                       <SelectBox
  //                         options={projects.map((p) => ({ label: p.project_name, value: p.id }))}
  //                         defaultValue={formData.project_id}
  //                         onChange={(value) => setFormData({ ...formData, project_id: value })}
  //                       />
  //                       {errors.project_id && <span className="text-danger">{errors.project_id}</span>}
  //                     </div>
  //                   </div>

  //                   <div className="col-md-3 col-sm-6 col-12">
  //                     <div className="form-group d-flex flex-column">
  //                       <label className="mb-2">
  //                         Banner Attachment{" "}
  //                         <span
  //                           className="tooltip-container"
  //                           onMouseEnter={() => setShowVideoTooltip(true)}
  //                           onMouseLeave={() => setShowVideoTooltip(false)}
  //                         >
  //                           [i]
  //                           {showVideoTooltip && (
  //                             <span className="tooltip-text">
  //                               9:16 or 1:1 Format Should Only Be Allowed
  //                             </span>
  //                           )}
  //                         </span>
  //                       </label>

  //                       <span
  //                         role="button"
  //                         tabIndex={0}
  //                         onClick={() => setShowUploader(true)}
  //                         className="custom-upload-button input-upload-button"
  //                       >
  //                         <span className="upload-button-label">Choose file</span>
  //                         <span className="upload-button-value">No file chosen</span>
  //                       </span>

  //                       {showUploader && (
  //                         <ProjectBannerUpload
  //                           onClose={() => setShowUploader(false)}
  //                           includeInvalidRatios={false}
  //                           selectedRatioProp={selectedRatios}
  //                           showAsModal={true}
  //                           label={dynamicLabel}
  //                           description={dynamicDescription}
  //                           onContinue={handleCropComplete}
  //                         />
  //                       )}
  //                     </div>
  //                   </div>
  //                 </div>
  //               )}

  //               <div className="col-md-12 mt-2">
  //                 <div className="mt-4 tbl-container">
  //                   <table className="w-100 table table-bordered">
  //                     <thead>
  //                       <tr>
  //                         <th>File Name</th>
  //                         <th>Preview</th>
  //                         <th>Ratio</th>
  //                         <th>Action</th>
  //                       </tr>
  //                     </thead>
  //                     <tbody>
  //                       {project_banner.map(({ key, label }) => {
  //                         const files = Array.isArray(formData[key]) ? formData[key] : formData[key] ? [formData[key]] : [];

  //                         return files.map((file, index) => {
  //                           const preview = file.preview || file.document_url || '';
  //                           const name = file.name || file.document_file_name || 'Unnamed';

  //                           return (
  //                             <tr key={`${key}-${index}`}>
  //                               <td>{name}</td>
  //                               <td>
  //                                 <img
  //                                   style={{ maxWidth: 100, maxHeight: 100 }}
  //                                   className="img-fluid rounded"
  //                                   src={preview}
  //                                   alt={name}
  //                                 />
  //                               </td>
  //                               <td>{file.ratio || label}</td>
  //                               <td>
  //                                 <button
  //                                   type="button"
  //                                   className="purple-btn2"
  //                                   onClick={() => handleFetchedDiscardGallery(key, index, file.id)}
  //                                 >
  //                                   x
  //                                 </button>
  //                               </td>
  //                             </tr>
  //                           );
  //                         });
  //                       })}
  //                     </tbody>
  //                   </table>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Sticky Submit/Cancel Button Footer */}
  //     <div className="row sticky-footer justify-content-center">
  //       <div className="col-md-2">
  //         <button onClick={handleSubmit} className="purple-btn2 w-100" disabled={loading}>
  //           Submit
  //         </button>
  //       </div>
  //       <div className="col-md-2">
  //         <button onClick={handleCancel} className="purple-btn2 w-100">
  //           Cancel
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="main-content">
      <style jsx>{`
        .btn-primary {
          background: #f1f5f9;
          color: #1f2937;
          padding: 8px 16px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          margin-left: 10px;
          height: 38px;
          display: inline-flex;
          align-items: center;
        }
        .btn-primary:hover {
          background: #e2e8f0;
        }
        .scrollable-table {
          max-height: 300px;
          overflow-y: auto;
        }
        .tbl-container table {
          width: 100%;
          border-collapse: collapse;
        }
        .tbl-container th,
        .tbl-container td {
          padding: 8px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .sticky-footer {
          position: sticky;
          bottom: 0;
          background: white;
          padding-top: 16px;
          z-index: 10;
        }
      `}</style>

      <div className="module-data-section container-fluid overflow-hidden">
        <div className="module-data-section">
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Banner Edit</h3>
            </div>

            <div className="card-body">
              <div className="row">
                {/* Title Input */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Title<span className="otp-asterisk"> *</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter title"
                    />
                    {errors.title && (
                      <span className="text-danger">{errors.title}</span>
                    )}
                  </div>
                </div>

                {/* Project Select */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Project <span className="text-danger">*</span>
                    </label>
                    <SelectBox
                      options={projects.map((p) => ({
                        label: p.project_name,
                        value: p.id,
                      }))}
                      defaultValue={formData.project_id}
                      onChange={(value) =>
                        setFormData({ ...formData, project_id: value })
                      }
                    />
                    {errors.project_id && (
                      <span className="text-danger">{errors.project_id}</span>
                    )}
                  </div>
                </div>

                {/* Banner Attachment Upload */}
                <div className="col-md-3 col-sm-6 col-12">
                  <div className="form-group d-flex flex-column">
                    <label className="mb-2">
                      Banner Attachment{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowVideoTooltip(true)}
                        onMouseLeave={() => setShowVideoTooltip(false)}
                      >
                        [i]
                        {showVideoTooltip && (
                          <span className="tooltip-text">
                            9:16 or 1:1 Format Should Only Be Allowed
                          </span>
                        )}
                      </span>
                      <span className="otp-asterisk"> *</span>
                    </label>

                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => setShowUploader(true)}
                      className="custom-upload-button input-upload-button"
                    >
                      <span className="upload-button-label">Choose file</span>
                      <span className="upload-button-value">
                        No file chosen
                      </span>
                    </span>

                    {showUploader && (
                      <ProjectImageVideoUpload
                        onClose={() => setShowUploader(false)}
                        includeInvalidRatios={false}
                        selectedRatioProp={selectedRatios}
                        showAsModal={true}
                        label={dynamicLabel}
                        description={dynamicDescription}
                        onContinue={handleCropComplete}
                        allowVideos={true}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Image Table */}
              <div className="col-md-12 mt-4">
                <div className="scrollable-table tbl-container">
                  <table>
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Preview</th>
                        <th>Ratio</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {/* <tbody>
                      {project_banner.map(({ key, label }) => {
                        const files = Array.isArray(formData[key]) ? formData[key] : formData[key] ? [formData[key]] : [];
  
                        return files.map((file, index) => {
                          const preview = file.preview || file.document_url || '';
                          const name = file.name || file.document_file_name || 'Unnamed';
  
                          return (
                            <tr key={`${key}-${index}`}>
                              <td>{name}</td>
                              <td>
                                <img
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  className="img-fluid rounded"
                                  src={preview}
                                  alt={name}
                                />
                              </td>
                              <td>{file.ratio || label}</td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() => handleFetchedDiscardGallery(key, index,file.id)}
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </tbody> */}
                    <tbody>
                      {(previewVideo ||
                        previewImg ||
                        formData.banner_video?.document_url) && (
                        <tr>
                          <td>
                            {/* Try to fetch name in proper fallback order */}
                            {previewVideo?.name ||
                              previewImg?.name ||
                              formData.banner_video?.document_file_name ||
                              formData.banner_video?.file_name ||
                              (typeof formData.banner_video === "object"
                                ? formData.banner_video?.document_url
                                    ?.split("/")
                                    ?.pop()
                                : formData.banner_video?.split("/")?.pop()) ||
                              "Video/Image"}
                          </td>
                          <td>
                            {isImageFile(
                              previewVideo ||
                                previewImg ||
                                formData.banner_video?.document_url
                            ) ? (
                              <img
                                src={
                                  previewImg ||
                                  formData.banner_video?.document_url
                                }
                                className="img-fluid rounded"
                                alt="Preview"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "150px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <video
                                src={
                                  previewVideo ||
                                  formData.banner_video?.document_url
                                }
                                controls
                                className="img-fluid rounded"
                                style={{
                                  maxWidth: "200px",
                                  maxHeight: "150px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </td>
                          <td>N/A</td>
                          <td>
                            <button
                              type="button"
                              className="purple-btn2"
                              onClick={() =>
                                handleFetchedDiscardGallery("banner_video")
                              }
                            >
                              x
                            </button>
                          </td>
                        </tr>
                      )}

                      {project_banner.map(({ key, label }) => {
                        const files = Array.isArray(formData[key])
                          ? formData[key]
                          : formData[key]
                          ? [formData[key]]
                          : [];

                        return files.map((file, index) => {
                          // Get the preview URL - prioritize object URL over document_url
                          const preview =
                            file.preview ||
                            (file.file
                              ? URL.createObjectURL(file.file)
                              : null) ||
                            file.document_url ||
                            "";

                          const name =
                            file.name || file.document_file_name || "Unnamed";

                          // More reliable video detection
                          const isVideo =
                            file.type === "video" ||
                            (file.file &&
                              file.file.type.startsWith("video/")) ||
                            (file.document_url &&
                              [".mp4", ".webm", ".ogg"].some((ext) =>
                                file.document_url.toLowerCase().endsWith(ext)
                              )) ||
                            (preview &&
                              [".mp4", ".webm", ".ogg"].some((ext) =>
                                preview.toLowerCase().endsWith(ext)
                              ));

                          return (
                            <tr key={`${key}-${index}`}>
                              <td>{name}</td>
                              <td>
                                {isVideo ? (
                                  <video
                                    controls
                                    style={{ maxWidth: 100, maxHeight: 100 }}
                                    className="img-fluid rounded"
                                    key={preview} // Important for re-rendering when preview changes
                                  >
                                    <source
                                      src={preview}
                                      type={
                                        file.file?.type ||
                                        (file.document_url
                                          ? `video/${file.document_url
                                              .split(".")
                                              .pop()}`
                                          : "video/mp4")
                                      }
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <img
                                    style={{ maxWidth: 100, maxHeight: 100 }}
                                    className="img-fluid rounded"
                                    src={preview}
                                    alt={name}
                                  />
                                )}
                              </td>
                              <td>{file.ratio || label}</td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() =>
                                    handleFetchedDiscardGallery(
                                      key,
                                      index,
                                      file.id
                                    )
                                  }
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

              {/* Sticky Footer Buttons */}
            </div>
          </div>
          <div className="row mt-4 sticky-footer justify-content-center">
            <div className="col-md-2">
              <button
                onClick={handleSubmit}
                className="purple-btn2 w-100"
                disabled={loading}
              >
                Submit
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="purple-btn2 w-100"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerEdit;
