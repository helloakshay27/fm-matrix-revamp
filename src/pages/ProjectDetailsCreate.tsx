import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import "../styles/mor.css"

import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../config/apiConfig";
import PropertySelect from "../components/ui/property-select";
import SelectBox from "../components/ui/select-box";
import MultiSelectBox from "../components/ui/multi-selector";

import { ImageCropper } from "../components/reusable/ImageCropper";
import { ImageUploadingButton } from "../components/reusable/ImageUploadingButton";
import ProjectBannerUpload from "../components/reusable/ProjectBannerUpload";
import ProjectImageVideoUpload from "../components/reusable/ProjectImageVideoUpload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const ProjectDetailsCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const accessToken = localStorage.getItem("access_token");
  const [formData, setFormData] = useState({
    Property_Type: "",
    Property_type_id: "",
    building_type: "",
    SFDC_Project_Id: "",
    Project_Construction_Status: "",
    Configuration_Type: [],
    Project_Name: "",
    project_address: "",
    Project_Description: "",
    Price_Onward: "",
    Project_Size_Sq_Mtr: "",
    Project_Size_Sq_Ft: "",
    development_area_sqft: "",
    development_area_sqmt: "",
    Rera_Carpet_Area_Sq_M: "",
    Rera_Carpet_Area_sqft: "",
    Rera_Sellable_Area: "",
    Number_Of_Towers: "",
    Number_Of_Units: "",
    no_of_floors: "",
    Rera_Number_multiple: [],
    Amenities: [],
    Specifications: [],
    Land_Area: "",
    land_uom: "",
    project_tag: "",
    virtual_tour_url_multiple: [],
    map_url: "",
    image: [],
    Address: {
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      pin_code: "",
      country: "",
    },
    brochure: [],
    two_d_images: [],
    videos: [],
    gallery_image: [],
    project_ppt: [],
    //project_creatives: [],
    project_creatives: [],
    project_creative_generics: [],
    project_creative_offers: [],
    project_interiors: [],
    project_exteriors: [],
    project_emailer_templetes: [],
    KnwYrApt_Technical: [],
    project_layout: [],
    project_sales_type: "",
    order_no: null,
    video_preview_image_url: [],
    enable_enquiry: false,
    rera_url: "",
    isDay: true,
    disclaimer: "",
    project_qrcode_image: [],
    cover_images: [],
    is_sold: false,
    plans: [],
  });

  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  const [projectsType, setprojectsType] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [activeToastId, setActiveToastId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [virtualTourName, setVirtualTourName] = useState("");
  const [towerName, setTowerName] = useState("");
  const [reraNumber, setReraNumber] = useState("");
  const [reraUrl, setReraUrl] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [filteredAmenities, setFilteredAmenities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [projectCreatives, setProjectCreatives] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [selectedCreativeType, setSelectedCreativeType] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [allBuildingTypes, setAllBuildingTypes] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  // const [showTooltip, setShowTooltip] = useState(false);
  const [showQrTooltip, setShowQrTooltip] = useState(false);
  // const [image, setImage] = useState([]);
  const [mainImageUpload, setMainImageUpload] = useState([]);
  const [coverImageUpload, setCoverImageUpload] = useState([]);
  const [galleryImageUpload, setGalleryImageUpload] = useState([]);
  const [floorPlanImageUpload, setFloorPlanImageUpload] = useState([]);
  const [planName, setPlanName] = useState("");
  const [planImages, setPlanImages] = useState([]);
  const [plans, setPlans] = useState([]);
  const [pendingImageUpload, setPendingImageUpload] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [imageConfigurations, setImageConfigurations] = useState({});
  const [showTooltipBanner, setShowTooltipBanner] = useState(false);
  const [showTooltipCover, setShowTooltipCover] = useState(false);
  const [showTooltipGallery, setShowTooltipGallery] = useState(false);
  const [showTooltipFloor, setShowTooltipFloor] = useState(false);

  const [dialogOpen, setDialogOpen] = useState({
    image: false,
    cover_images: false,
    gallery_image: false,
    two_d_images: false,
    plan_images: false,
  });

  const projectUploadConfig = {
    image: ["9:16", "1:1", "16:9", "3:2"],
    "cover images": ["1:1", "16:9", "9:16", "3:2"],
    "gallery image": ["16:9", "1:1", "9:16", "3:2"],
    "project 2d image": ["16:9", "1:1", "9:16", "3:2"],
  };

  const coverImageType = "cover images";
  const galleryImageType = "gallery image";
  const floorImageType = "project 2d image";
  const bannerImageType = "image";

  const selectedCoverRatios = projectUploadConfig[coverImageType] || [];
  const selectedGalleryRatios = projectUploadConfig[galleryImageType] || [];
  const selectedFloorRatios = projectUploadConfig[floorImageType] || [];
  const selectedBannerRatios = projectUploadConfig[bannerImageType] || [];

  const coverImageLabel = coverImageType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const galleryImageLabel = galleryImageType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const floorImageLabel = floorImageType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const bannerImageLabel = bannerImageType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );

  const dynamicDescription = `Supports ${selectedCoverRatios.join(
    ", "
  )} aspect ratios`;
  const dynamicDescription1 = `Supports ${selectedGalleryRatios.join(
    ", "
  )} aspect ratios`;
  const dynamicDescription2 = `Supports ${selectedFloorRatios.join(
    ", "
  )} aspect ratios`;
  const dynamicDescription3 = `Supports ${selectedBannerRatios.join(
    ", "
  )} aspect ratios`;

  const updateFormData = (key, files) => {
    setFormData((prev) => {
      const existing = Array.isArray(prev[key]) ? prev[key] : [];
      return {
        ...prev,
        [key]: [...existing, ...files],
      };
    });
  };

  // Function to handle gallery image name and order changes
  const handleGalleryImageNameChange = (groupKey, imageIndex, newValue, fieldType = 'file_name') => {
    setFormData(prevData => ({
      ...prevData,
      [groupKey]: prevData[groupKey].map((img, index) =>
        index === imageIndex
          ? { ...img, [fieldType]: newValue }
          : img
      )
    }));
  };

  const handleCroppedCoverImages = (
    validImages,
    type = "cover",
    videoFiles = []
  ) => {
    // Handle video files first (including GIFs)
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach((video) => {
        const formattedRatio = video.ratio.replace(":", "_by_");
        let prefix = "";

        switch (type) {
          case "gallery":
            prefix = galleryImageType; // "gallery image"
            break;
          case "floor":
            prefix = floorImageType; // "floor plan"
            break;
          case "banner":
            prefix = bannerImageType; // "banner image" for banner
            break;
          case "cover":
          default:
            prefix = coverImageType; // "cover image"
            break;
        }

        const key = `${prefix}_${formattedRatio}`
          .replace(/\s+/g, "_")
          .toLowerCase();
        updateFormData(key, [video]);
      });

      closeModal(type);
      return;
    }

    // Handle images if no videos
    if (!validImages || validImages.length === 0) {
      toast.error(
        `No valid ${type} image${
          ["cover", "banner"].includes(type) ? "" : "s"
        } selected.`
      );
      closeModal(type);
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_");
      let prefix = "";

      switch (type) {
        case "gallery":
          prefix = galleryImageType;
          break;
        case "floor":
          prefix = floorImageType;
          break;
        case "banner":
          prefix = bannerImageType;
          break;
        case "cover":
        default:
          prefix = coverImageType;
          break;
      }

      const key = `${prefix}_${formattedRatio}`
        .replace(/\s+/g, "_")
        .toLowerCase();
      updateFormData(key, [img]);
    });

    closeModal(type);
  };

  const handleCroppedImages = (validImages, type = "cover") => {
    if (!validImages || validImages.length === 0) {
      toast.error(
        `No valid ${type} image${
          ["cover", "banner"].includes(type) ? "" : "s"
        } selected.`
      );
      closeModal(type);
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_");
      let prefix = "";

      switch (type) {
        case "gallery":
          prefix = galleryImageType; // "gallery image"
          break;
        case "floor":
          prefix = floorImageType; // "floor plan"
          break;
        case "banner":
          prefix = bannerImageType; // "banner image" for banner
          break;
        case "cover":
        default:
          prefix = coverImageType; // "cover image"
          break;
      }

      const key = `${prefix}_${formattedRatio}`
        .replace(/\s+/g, "_")
        .toLowerCase();

      // Add file_name property to the image object
      const imageWithName = {
        ...img,
        file_name: img.name || `${type} Image ${Date.now()}`
      };

      updateFormData(key, [imageWithName]);
    });

    closeModal(type);
  };

  const closeModal = (type) => {
    switch (type) {
      case "gallery":
        setShowGalleryModal(false);
        break;
      case "floor":
        setShowFloorPlanModal(false);
        break;

      case "banner":
        setShowBannerModal(false);
        break;
      case "cover":
      default:
        setShowUploader(false);
        break;
    }
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
  };

  const errorToastRef = useRef(null);
  const Navigate = useNavigate();

  const [reraList, setReraList] = useState([{ tower: "", reraNumber: "" }]);

  const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
  const MAX_BROCHURE_SIZE = 20 * 1024 * 1024; // 20MB

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  // Function to check file size
  const isFileSizeValid = (file, maxSize) => {
    if (file.size > maxSize) {
      return {
        valid: false,
        name: file.name,
        size: formatFileSize(file.size),
      };
    }
    return { valid: true };
  };

  const handleImageUploaded = (newImageList, type) => {
    if (!newImageList || newImageList.length === 0) return;

    const file = newImageList[0].file;
    if (!file) return;

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const fileType = file.type;
    const sizeInMB = file.size / (1024 * 1024);

    if (!allowedImageTypes.includes(fileType)) {
      toast.error("❌ Please upload a valid image.");
      return;
    }

    if (sizeInMB > 5) {
      toast.error("❌ Image size must be less than 5MB.");
      return;
    }

    if (type === "cover_images") {
      // Skip cropper for GIFs
      if (fileType === "image/gif") {
        setFormData((prev) => ({
          ...prev,
          cover_images: Array.isArray(prev.cover_images)
            ? [...prev.cover_images, file]
            : [file],
        }));
        setCoverImageUpload([]);
        setDialogOpen((prev) => ({ ...prev, cover_images: false }));
        return;
      }
      setCoverImageUpload(newImageList);
      setDialogOpen((prev) => ({ ...prev, cover_images: true }));
    } else if (type === "image") {
      setPendingImageUpload(newImageList);
      setDialogOpen((prev) => ({ ...prev, image: true }));
    } else if (type === "gallery_image") {
      setGalleryImageUpload(newImageList);
      setDialogOpen((prev) => ({ ...prev, gallery_image: true }));
    } else if (type === "two_d_images") {
      setFloorPlanImageUpload(newImageList);
      setDialogOpen((prev) => ({ ...prev, two_d_images: true }));
    }
  };

  const amenityTypes = [
    ...new Set(amenities.map((ammit) => ammit.amenity_type)),
  ].map((type) => ({ value: type, label: type }));

  // Filter amenities based on selected type
  useEffect(() => {
    if (selectedType) {
      Area;
      setFilteredAmenities(
        amenities.filter((ammit) => ammit.amenity_type === selectedType.value)
      );
    } else {
      setFilteredAmenities([]);
    }
  }, [selectedType, amenities]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      handleFileUpload(name, files);
    } else {
      if (
        [
          "address_line_1",
          "address_line_2",
          "city",
          "state",
          "pin_code",
          "country",
        ].includes(name)
      ) {
        setFormData((prev) => ({
          ...prev,
          Address: {
            ...prev.Address,
            [name]: value,
          },
        }));
      } else if (name === "virtual_tour_url_multiple") {
        setVirtualTour(value); // Update temporary input state
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleProjectCreativesUpload = (files) => {
    if (!files || files.length === 0) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "video/mp4",
      "video/mov",
    ];

    const MAX_SIZE = 50 * 1024 * 1024; // 50MB max per file

    const newFiles = Array.from(files);
    const validFiles = [];

    newFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return;
      }

      if (file.size > MAX_SIZE) {
        toast.error(`File too large: ${file.name}. Max size is 50MB.`);
        return;
      }

      validFiles.push({ file, type: "" }); // Default type empty, user will select
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        project_creatives: [...prev.project_creatives, ...validFiles],
      }));
    }
  };

  const MAX_PPT_SIZE = 10 * 1024 * 1024; // 10MB

  // Modify the handleFileUpload function to handle gallery_images
  const handleFileUpload = (name, files) => {
    const MAX_SIZES = {
      brochure: MAX_BROCHURE_SIZE,
      two_d_images: MAX_IMAGE_SIZE,
      videos: MAX_VIDEO_SIZE,
      image: MAX_IMAGE_SIZE,
      video_preview_image_url: MAX_IMAGE_SIZE,
      gallery_image: MAX_IMAGE_SIZE,
      project_ppt: MAX_PPT_SIZE, // ✅ Ensure project_ppt is included
      project_creatives: MAX_IMAGE_SIZE, // Add creatives support
      cover_images: MAX_IMAGE_SIZE,
      project_creative_generics: MAX_IMAGE_SIZE,
      project_creative_offers: MAX_IMAGE_SIZE,
      project_interiors: MAX_IMAGE_SIZE,
      project_exteriors: MAX_IMAGE_SIZE,
      project_emailer_templetes: MAX_BROCHURE_SIZE,
      KnwYrApt_Technical: MAX_BROCHURE_SIZE,
      project_layout: MAX_IMAGE_SIZE,
      project_qrcode_image: MAX_IMAGE_SIZE,
      plans: MAX_IMAGE_SIZE, // 3MB
    };

    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video_preview_image_url: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      two_d_images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      gallery_image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      videos: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
      plans: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      project_qrcode_image: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      brochure: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      project_ppt: [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ], // ✅ PPT & PPTX support
      project_emailer_templetes: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      KnwYrApt_Technical: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      project_creatives: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      cover_images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      project_creative_generics: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      project_creative_offers: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      project_interiors: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      project_exteriors: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      project_layout: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    };

    if (!files || !files.length) return;

    if (name === "project_layout") {
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit

      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (file.size > MAX_SIZE) {
          toast.error("Image size must be less than 3MB.");
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          project_layout: [...(prev.project_layout || []), ...validFiles],
        }));
      }
    } else {
      // toast.error("⚠️ Invalid upload category.");
    }

    if (name === "plans") {
      setFormData((prev) => ({
        ...prev,
        plans: [...(prev.plans || []), ...validFiles], // ✅ Fix: Ensure existing files are kept
      }));
    }

    if (name === "project_emailer_templetes") {
      // Handle multiple brochure files
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.project_emailer_templetes.includes(file.type)) {
          toast.error(
            "Only PDF and DOCX files are allowed for project emailer templetes."
          );
          return;
        }

        if (!validateFile(file, MAX_SIZES[name])) return;
        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          project_emailer_templetes: [
            ...prev.project_emailer_templetes,
            ...validFiles,
          ],
        }));
      }
    }

    if (name === "KnwYrApt_Technical") {
      // Handle multiple technical files
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.KnwYrApt_Technical.includes(file.type)) {
          toast.error(
            "Only PDF and DOCX files are allowed for project technical files."
          );
          return;
        }

        if (!validateFile(file, MAX_SIZES[name])) return;
        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          KnwYrApt_Technical: [
            ...prev.KnwYrApt_Technical,
            ...validFiles,
          ],
        }));
      }
    }

    if (name === "project_exteriors") {
      const newFiles = Array.from(files);
      const validFiles = [];
      // Area;
      newFiles.forEach((file) => {
        if (!allowedTypes.project_exteriors.includes(file.type)) {
          toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
          return;
        }

        if (file.size > MAX_SIZES.project_exteriors) {
          toast.error("Image size must be less than 3MB.");
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          project_exteriors: [...(prev.project_exteriors || []), ...validFiles], // ✅ Fix: Ensure existing files are kept
        }));
      }
    }

    if (name === "project_interiors") {
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.project_interiors.includes(file.type)) {
          toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
          return;
        }

        if (file.size > MAX_SIZES.project_interiors) {
          toast.error("Image size must be less than 3MB.");
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          project_interiors: [...(prev.project_interiors || []), ...validFiles], // ✅ Fix: Ensure existing files are kept
        }));
      }
    }

    if (name === "project_creative_offers") {
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.project_creative_offers.includes(file.type)) {
          toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
          return;
        }

        if (file.size > MAX_SIZES.project_creative_offers) {
          toast.error("Image size must be less than 3MB.");
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          project_creative_offers: [
            ...(prev.project_creative_offers || []),
            ...validFiles,
          ], // ✅ Fix: Ensure existing files are kept
        }));
      }
    }

    if (name === "project_creative_generics") {
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.project_creative_generics.includes(file.type)) {
          toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
          return;
        }

        if (file.size > MAX_SIZES.project_creative_generics) {
          toast.error("Image size must be less than 3MB.");
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          project_creative_generics: [
            ...(prev.project_creative_generics || []),
            ...validFiles,
          ], // ✅ Fix: Ensure existing files are kept
        }));
      }
    }

    if (name === "project_creatives") {
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.project_creatives.includes(file.type)) {
          toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
          return;
        }

        if (file.size > MAX_SIZES.project_creatives) {
          toast.error("Image size must be less than 3MB.");
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          project_creatives: [...(prev.project_creatives || []), ...validFiles], // ✅ Fix: Ensure existing files are kept
        }));
      }
    }

    if (name === "cover_images") {
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.cover_images.includes(file.type)) {
          toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
          return;
        }

        if (file.size > MAX_SIZES.cover_images) {
          toast.error("Image size must be less than 3MB.");
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          cover_images: [...(prev.cover_images || []), ...validFiles], // ✅ Fix: Ensure existing files are kept
        }));
      }
    }

    if (name === "project_ppt") {
      // Handle multiple PPT files
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.project_ppt.includes(file.type)) {
          toast.error("Only PPT and PPTX files are allowed for Project PPT.");
          return;
        }

        if (file.size > MAX_SIZES.project_ppt) {
          toast.error(`File too large: ${file.name}. Max size is 10MB.`);
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          project_ppt: [...prev.project_ppt, ...validFiles], // ✅ Ensure multiple files are added
        }));
      }
    }

    if (name === "brochure") {
      // Handle multiple brochure files
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.brochure.includes(file.type)) {
          toast.error("Only PDF and DOCX files are allowed for brochure.");
          return;
        }

        if (!validateFile(file, MAX_SIZES[name])) return;
        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          brochure: [...prev.brochure, ...validFiles],
        }));
      }
    } else if (
      name === "two_d_images" ||
      name === "videos" ||
      name === "gallery_image" ||
      name === "project_qrcode_image"
    ) {
      // Handle multiple files for images, videos, gallery
      const newFiles = Array.from(files);
      const validFiles = [];
      const tooLargeFiles = [];

      newFiles.forEach((file) => {
        // Check file type if there are allowed types specified
        if (allowedTypes[name] && !allowedTypes[name].includes(file.type)) {
          const fileType = name === "videos" ? "video" : "image";
          toast.error(
            `Only supported ${fileType} formats are allowed for ${name.replace(
              "_",
              " "
            )}.`
          );
          return;
        }

        const sizeCheck = isFileSizeValid(file, MAX_SIZES[name]);
        if (!sizeCheck.valid) {
          tooLargeFiles.push(sizeCheck);
          return;
        }

        validFiles.push(file);
      });

      if (tooLargeFiles.length > 0) {
        tooLargeFiles.forEach((file) => {
          if (name === "videos") {
            toast.error("Video size must be less than 10MB.");
          } else {
            toast.error("Image size must be less than 3MB.");
          }
        });
      }

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          [name]: [...(prev[name] || []), ...validFiles],
        }));
      }
    } else if (name === "image") {
      // Handle single image
      const file = files[0];
      if (!allowedTypes.image.includes(file.type)) {
        toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
        return;
      }

      const sizeCheck = isFileSizeValid(file, MAX_SIZES.image);
      if (!sizeCheck.valid) {
        toast.error(
          `File too large: ${sizeCheck.name} (${
            sizeCheck.size
          }). Max size: ${formatFileSize(MAX_SIZES.image)}`
        );
        return;
      }

      setFormData((prev) => ({ ...prev, video_preview_image_url: file }));
    } else if (name === "video_preview_image_url") {
      // Handle single image
      const file = files[0];
      if (!allowedTypes.video_preview_image_url.includes(file.type)) {
        toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
        return;
      }

      const sizeCheck = isFileSizeValid(
        file,
        MAX_SIZES.video_preview_image_url
      );
      if (!sizeCheck.valid) {
        toast.error(
          `File too large: ${sizeCheck.name} (${
            sizeCheck.size
          }). Max size: ${formatFileSize(MAX_SIZES.video_preview_image_url)}`
        );
        return;
      }

      setFormData((prev) => ({ ...prev, video_preview_image_url: file }));
    }
  }; // Add this to your file:
  // File Validation
  const validateFile = (file, maxSize, tooLargeFiles = null) => {
    const sizeCheck = isFileSizeValid(file, maxSize);
    if (!sizeCheck.valid) {
      if (tooLargeFiles) {
        tooLargeFiles.push(sizeCheck);
      } else {
        toast.error(
          `File too large: ${sizeCheck.name} (${
            sizeCheck.size
          }). Max size: ${formatFileSize(maxSize)}`
        );
      }
      return false;
    }
    return true;
  };

  // 3. Update handleDiscardFile to handle gallery_images
  const handleDiscardFile = (fileType, index) => {
    if (fileType === "brochure") {
      if (index !== undefined) {
        // Remove specific brochure by index
        const updatedBrochures = [...formData.brochure];
        updatedBrochures.splice(index, 1);
        setFormData({ ...formData, brochure: updatedBrochures });
      } else {
        // Clear all brochures if no index specified
        setFormData({ ...formData, brochure: [] });
      }
    } else if (fileType === "two_d_images") {
      const updatedFiles = [...formData.two_d_images];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, two_d_images: updatedFiles });
    } else if (fileType === "project_creatives") {
      const updatedFiles = [...formData.project_creatives];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, project_creatives: updatedFiles });
    } else if (fileType === "cover_images") {
      const updatedFiles = [...formData.cover_images];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, cover_images: updatedFiles });
    } else if (fileType === "project_creative_generics") {
      const updatedFiles = [...formData.project_creative_generics];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, project_creative_generics: updatedFiles });
    } else if (fileType === "project_creative_offers") {
      const updatedFiles = [...formData.project_creative_offers];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, project_creative_offers: updatedFiles });
    } else if (fileType === "project_interiors") {
      const updatedFiles = [...formData.project_interiors];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, project_interiors: updatedFiles });
    } else if (fileType === "project_exteriors") {
      const updatedFiles = [...formData.project_exteriors];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, project_exteriors: updatedFiles });
    } else if (fileType === "project_emailer_templetes") {
      const updatedFiles = [...formData.project_emailer_templetes];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, project_emailer_templetes: updatedFiles });
    } else if (fileType === "KnwYrApt_Technical") {
      const updatedFiles = [...formData.KnwYrApt_Technical];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, KnwYrApt_Technical: updatedFiles });
    } else if (fileType === "project_layout") {
      const updatedFiles = [...formData.project_layout];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, project_layout: updatedFiles });
    } else if (fileType === "videos") {
      const updatedVideos = [...formData.videos];
      updatedVideos.splice(index, 1);
      setFormData({ ...formData, videos: updatedVideos });
    } else if (fileType === "gallery_image") {
      const updatedGallery = [...formData.gallery_image];
      updatedGallery.splice(index, 1);
      setFormData({ ...formData, gallery_image: updatedGallery });
    } else if (fileType === "plans") {
      const updatedFiles = [...formData.plans];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, plans: updatedFiles });
    }
  };

  const handlePlanDelete = async (planId, index) => {
    if (!planId) {
      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan removed successfully!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}plans/${planId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan and all images deleted successfully!");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  const validateForm = (formData) => {
    // Clear previous toasts
    toast.dismiss();

    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }

    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (!validateForm(formData)) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const gallery_images = [
      "gallery_image_16_by_9",
      "gallery_image_1_by_1",
      "gallery_image_9_by_16",
      "gallery_image_3_by_2",
    ];

    const isValidImage = (img) =>
      img?.file instanceof File || !!img?.id || !!img?.document_file_name;

    // Combine all valid images from all gallery fields
    let totalValidGalleryImages = 0;

    for (const key of gallery_images) {
      const images = Array.isArray(formData[key])
        ? formData[key].filter(isValidImage)
        : [];
      totalValidGalleryImages += images.length;
    }

    if (totalValidGalleryImages > 0 && totalValidGalleryImages % 3 !== 0) {
      const remainder = totalValidGalleryImages % 3;
      const imagesNeeded = 3 - remainder;
      const previousValidCount = totalValidGalleryImages - remainder;

      const message = `Currently in Gallery ${totalValidGalleryImages} image${
        totalValidGalleryImages !== 1 ? "s" : ""
      } uploaded. Please upload ${imagesNeeded} more or remove ${remainder} to make it a multiple of 3.`;

      toast.error(message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }


    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {

      if (key === "plans" && Array.isArray(value)) {
        value.forEach((plan, index) => {
          data.append(`project[plans][${index}][name]`, plan.name);
          if (Array.isArray(plan.images)) {
            plan.images.forEach((img) => {
              data.append(`project[plans][${index}][images][]`, img);
            });
          }
        });
      } else if (key === "Address") {
        for (const addressKey in value) {
          data.append(`project[Address][${addressKey}]`, value[addressKey]);
        }
      } else if (key === "brochure" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectBrochure][]", file);
          }
        });
      } else if (key === "project_emailer_templetes" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectEmailerTempletes][]", file);
          }
        });
      } else if (key === "KnwYrApt_Technical" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[KnwYrApt_Technical][]", file);
          }
        });
      } else if (key === "two_d_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[Project2DImage][]", file));
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreatives][]", file)
        );
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[cover_images][]", file));
      } else if (key === "project_creative_generics" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeGenerics][]", file)
        );
      } else if (key === "project_creative_offers" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeOffers][]", file)
        );
      } else if (key === "project_interiors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectInteriors][]", file)
        );
      } else if (key === "project_exteriors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectExteriors][]", file)
        );
      } else if (key === "project_layout" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectLayout][]", file));
      } else if (key === "videos" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectVideo][]", file));
      } else if (key === "gallery_image" && Array.isArray(value)) {
        value.forEach((fileObj, index) => {
          if (fileObj.gallery_image instanceof File) {
            data.append("project[gallery_image][]", fileObj.gallery_image);
            data.append(
              `project[gallery_image_file_name][${index}]`,
              fileObj.gallery_image_file_name
            );
            data.append(
              `project[gallery_type]`,
              fileObj.gallery_image_file_type
            );
            data.append(
              `project[gallery_image_is_day][${index}]`,
              fileObj.isDay
            );
          }
        });
      } else if (key === "image" && mainImageUpload[0]?.file instanceof File) {
        data.append("project[image]", mainImageUpload[0]?.file);
      } else if (key === "video_preview_image_url" && value instanceof File) {
        data.append("project[video_preview_image_url]", value);
      }
      else if (key === "project_qrcode_image" && Array.isArray(value)) {
        value.forEach((fileObj) => {
          if (fileObj.project_qrcode_image instanceof File) {
            data.append(
              "project[project_qrcode_image][]",
              fileObj.project_qrcode_image
            );
            data.append(
              "project[project_qrcode_image_titles][]",
              fileObj.title || ""
            );
          }
        });
      } else if (key === "virtual_tour_url_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.virtual_tour_url && item.virtual_tour_name) {
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_url]`,
              item.virtual_tour_url
            );
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_name]`,
              item.virtual_tour_name
            );
          }
        });
      } else if (key === "Rera_Number_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.tower_name && item.rera_number) {
            data.append(
              `project[Rera_Number_multiple][${index}][tower_name]`,
              item.tower_name
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_number]`,
              item.rera_number
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_url]`,
              item.rera_url
            );
          }
        });
      } else if (key === "project_ppt" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectPPT]", file);
          }
        });
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[project_creatives][]", file);
            data.append(`project[project_creatives_types][]`, type);
          }
        });
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[cover_images][]", file);
            data.append(`project[cover_images_types][]`, type);
          }
        });
      } else if (key === "project_sales_type" && Array.isArray(value)) {
        data.append("project[project_sales_type][]", value);
      } else if (key.startsWith("image") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField = key.replace("image", "project[image") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("cover_images_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("cover_images_", "project[cover_images_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("gallery_image_") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            // Send as array without indices
            data.append(`project[${key}][][file]`, img.file);
            data.append(`project[${key}][][file_name]`, img.file_name || img.file.name);
          }
        });
      } else if (key.startsWith("floor_plans_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("floor_plans_", "project[floor_plans_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("project_2d_image") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            const backendField =
              key.replace("project_2d_image", "project[project_2d_image") +
              "][]";
            data.append(backendField, img.file);
          }
        });
      } else {
        data.append(`project[${key}]`, value);
      }
    });

    try {
      const response = await axios.post(`${baseURL}projects.json`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("data to be sent:", Array.from(data.entries()));
      toast.success("Project submitted successfully");
      sessionStorage.removeItem("cached_projects");
      Navigate("/project-list");
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data &&
        (error.response.data.project_name || error.response.data.Project_Name)
      ) {
        toast.error("Project name already exists.");
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}get_property_types.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setprojectsType(response.data?.property_types);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const url = `${baseURL}configuration_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setConfigurations(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigurations();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchSpecifications = async () => {
      const url = `${baseURL}specification_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data && response.data.specification_setups) {
          setSpecifications(response.data.specification_setups);
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };
    fetchSpecifications();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}amenity_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setAmenities(response.data?.amenities_setups);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}category_types.json`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          const formattedCategories = response.data.map((item) => ({
            value: item.category_type,
            label: item.category_type,
          }));
          setCategoryTypes(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };
    fetchCategoryTypes();
  }, [baseURL, accessToken]);

  useEffect(() => {
    axios
      .get(`${baseURL}property_types.json`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const options = response.data
          .filter((item) => item.active)
          .map((type) => ({
            value: type.property_type,
            label: type.property_type,
            id: type.id,
          }));
        setPropertyTypeOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
      });
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      const url = `${baseURL}building_types.json?q[property_type_id_eq]=${formData.Property_Type}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBuildingTypeOptions(response.data);
      } catch (error) {
        console.error("Error fetching building types:", error);
      }
    };
  }, [formData.Property_Type, baseURL, accessToken]);

  const handlePropertyTypeChange = async (selectedOption) => {
    const { value, id } = selectedOption;
    setFormData((prev) => ({
      ...prev,
      Property_Type: value,
      Property_type_id: id,
      building_type: "",
    }));
    try {
      const response = await axios.get(
        `${baseURL}building_types.json?q[property_type_id_eq]=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const buildingTypes = response.data || [];
      const formattedOptions = buildingTypes.map((item) => ({
        value: item.building_type,
        label: item.building_type,
        id: item.id,
      }));
      setBuildingTypeOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching building types:", error);
    }
  };

  useEffect(() => {
    const fetchConstructionStatuses = async () => {
      try {
        const response = await axios.get(
          `${baseURL}construction_statuses.json`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const options = response.data
          .filter((status) => status.active)
          .map((status) => ({
            label: status.construction_status,
            value: status.construction_status,
            name: status.Project_Construction_Status_Name,
          }));
        setStatusOptions(options);
      } catch (error) {
        console.error("Error fetching construction statuses:", error);
      }
    };
    fetchConstructionStatuses();
  }, [baseURL, accessToken]);

  // Fetch image configurations for dynamic tooltips
  useEffect(() => {
    const fetchImageConfigurations = async () => {
      try {
        const configNames = [
          "ProjectImage",
          "ProjectCoverImage",
          "ProjectGallery",
          "Project2DImage"
        ];
        
        const configs = {};
        
        for (const name of configNames) {
          const response = await axios.get(
            `${baseURL}system_constants.json?q[description_eq]=ImagesConfiguration&q[name_eq]=${name}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (response.data && Array.isArray(response.data)) {
            configs[name] = response.data.map(item => item.value);
          }
        }
        
        setImageConfigurations(configs);
      } catch (error) {
        console.error("Error fetching image configurations:", error);
      }
    };
    
    fetchImageConfigurations();
  }, [baseURL, accessToken]);

  // Helper function to format ratio from value like "image_16_by_9" to "16:9"
  const formatRatio = (value) => {
    if (!value) return "";
    const match = value.match(/(\d+)_by_(\d+)/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return value;
  };

  // Get dynamic ratios text for tooltips
  const getDynamicRatiosText = (configName) => {
    const ratios = imageConfigurations[configName];
    if (!ratios || ratios.length === 0) return "No ratios configured";
    
    const formattedRatios = ratios.map(formatRatio).join(", ");
    return `Required ratio${ratios.length > 1 ? 's' : ''}: ${formattedRatios}`;
  };

  const handleToggle = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }
    try {
      await axios.put(
        `${baseURL}projects/${id}.json`,
        { project: { published: updatedStatus } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: updatedStatus } : item
        )
      );
      const newToastId = toast.success("Status updated successfully!", {
        duration: 3000,
        position: "top-center",
        id: `toggle-${id}`,
      });
      setActiveToastId(newToastId);
    } catch (error) {
      console.error("Error updating status:", error);
      const newToastId = toast.error("Failed to update status.", {
        duration: 3000,
        position: "top-center",
        id: `toggle-error-${id}`,
      });
      setActiveToastId(newToastId);
    }
  };

  const handlePlanDelete = async (planId, index) => {
    if (!planId) {
      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan removed successfully!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}plans/${planId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan and all images deleted successfully!");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  const validateForm = (formData) => {
    // Clear previous toasts
    toast.dismiss();

    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }

    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (!validateForm(formData)) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const gallery_images = [
      "gallery_image_16_by_9",
      "gallery_image_1_by_1",
      "gallery_image_9_by_16",
      "gallery_image_3_by_2",
    ];

    const isValidImage = (img) =>
      img?.file instanceof File || !!img?.id || !!img?.document_file_name;

    // Combine all valid images from all gallery fields
    let totalValidGalleryImages = 0;

    for (const key of gallery_images) {
      const images = Array.isArray(formData[key])
        ? formData[key].filter(isValidImage)
        : [];
      totalValidGalleryImages += images.length;
    }

    if (totalValidGalleryImages > 0 && totalValidGalleryImages % 3 !== 0) {
      const remainder = totalValidGalleryImages % 3;
      const imagesNeeded = 3 - remainder;
      const previousValidCount = totalValidGalleryImages - remainder;

      const message = `Currently in Gallery ${totalValidGalleryImages} image${
        totalValidGalleryImages !== 1 ? "s" : ""
      } uploaded. Please upload ${imagesNeeded} more or remove ${remainder} to make it a multiple of 3.`;

      toast.error(message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }


    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {

      if (key === "plans" && Array.isArray(value)) {
        value.forEach((plan, index) => {
          data.append(`project[plans][${index}][name]`, plan.name);
          if (Array.isArray(plan.images)) {
            plan.images.forEach((img) => {
              data.append(`project[plans][${index}][images][]`, img);
            });
          }
        });
      } else if (key === "Address") {
        for (const addressKey in value) {
          data.append(`project[Address][${addressKey}]`, value[addressKey]);
        }
      } else if (key === "brochure" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectBrochure][]", file);
          }
        });
      } else if (key === "project_emailer_templetes" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectEmailerTempletes][]", file);
          }
        });
      } else if (key === "KnwYrApt_Technical" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[KnwYrApt_Technical][]", file);
          }
        });
      } else if (key === "two_d_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[Project2DImage][]", file));
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreatives][]", file)
        );
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[cover_images][]", file));
      } else if (key === "project_creative_generics" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeGenerics][]", file)
        );
      } else if (key === "project_creative_offers" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeOffers][]", file)
        );
      } else if (key === "project_interiors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectInteriors][]", file)
        );
      } else if (key === "project_exteriors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectExteriors][]", file)
        );
      } else if (key === "project_layout" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectLayout][]", file));
      } else if (key === "videos" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectVideo][]", file));
      } else if (key === "gallery_image" && Array.isArray(value)) {
        value.forEach((fileObj, index) => {
          if (fileObj.gallery_image instanceof File) {
            data.append("project[gallery_image][]", fileObj.gallery_image);
            data.append(
              `project[gallery_image_file_name][${index}]`,
              fileObj.gallery_image_file_name
            );
            data.append(
              `project[gallery_type]`,
              fileObj.gallery_image_file_type
            );
            data.append(
              `project[gallery_image_is_day][${index}]`,
              fileObj.isDay
            );
          }
        });
      } else if (key === "image" && mainImageUpload[0]?.file instanceof File) {
        data.append("project[image]", mainImageUpload[0]?.file);
      } else if (key === "video_preview_image_url" && value instanceof File) {
        data.append("project[video_preview_image_url]", value);
      }
      else if (key === "project_qrcode_image" && Array.isArray(value)) {
        value.forEach((fileObj) => {
          if (fileObj.project_qrcode_image instanceof File) {
            data.append(
              "project[project_qrcode_image][]",
              fileObj.project_qrcode_image
            );
            data.append(
              "project[project_qrcode_image_titles][]",
              fileObj.title || ""
            );
          }
        });
      } else if (key === "virtual_tour_url_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.virtual_tour_url && item.virtual_tour_name) {
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_url]`,
              item.virtual_tour_url
            );
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_name]`,
              item.virtual_tour_name
            );
          }
        });
      } else if (key === "Rera_Number_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.tower_name && item.rera_number) {
            data.append(
              `project[Rera_Number_multiple][${index}][tower_name]`,
              item.tower_name
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_number]`,
              item.rera_number
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_url]`,
              item.rera_url
            );
          }
        });
      } else if (key === "project_ppt" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectPPT]", file);
          }
        });
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[project_creatives][]", file);
            data.append(`project[project_creatives_types][]`, type);
          }
        });
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[cover_images][]", file);
            data.append(`project[cover_images_types][]`, type);
          }
        });
      } else if (key === "project_sales_type" && Array.isArray(value)) {
        data.append("project[project_sales_type][]", value);
      } else if (key.startsWith("image") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField = key.replace("image", "project[image") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("cover_images_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("cover_images_", "project[cover_images_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("gallery_image_") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            // Send as array without indices
            data.append(`project[${key}][][file]`, img.file);
            data.append(`project[${key}][][file_name]`, img.file_name || img.file.name);
          }
        });
      } else if (key.startsWith("floor_plans_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("floor_plans_", "project[floor_plans_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("project_2d_image") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            const backendField =
              key.replace("project_2d_image", "project[project_2d_image") +
              "][]";
            data.append(backendField, img.file);
          }
        });
      } else {
        data.append(`project[${key}]`, value);
      }
    });

    try {
      const response = await axios.post(`${baseURL}projects.json`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("data to be sent:", Array.from(data.entries()));
      toast.success("Project submitted successfully");
      sessionStorage.removeItem("cached_projects");
      Navigate("/project-list");
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data &&
        (error.response.data.project_name || error.response.data.Project_Name)
      ) {
        toast.error("Project name already exists.");
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}get_property_types.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setprojectsType(response.data?.property_types);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const url = `${baseURL}configuration_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setConfigurations(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigurations();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchSpecifications = async () => {
      const url = `${baseURL}specification_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data && response.data.specification_setups) {
          setSpecifications(response.data.specification_setups);
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };
    fetchSpecifications();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}amenity_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setAmenities(response.data?.amenities_setups);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}category_types.json`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          const formattedCategories = response.data.map((item) => ({
            value: item.category_type,
            label: item.category_type,
          }));
          setCategoryTypes(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };
    fetchCategoryTypes();
  }, [baseURL, accessToken]);

  useEffect(() => {
    axios
      .get(`${baseURL}property_types.json`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const options = response.data
          .filter((item) => item.active)
          .map((type) => ({
            value: type.property_type,
            label: type.property_type,
            id: type.id,
          }));
        setPropertyTypeOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
      });
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      const url = `${baseURL}building_types.json?q[property_type_id_eq]=${formData.Property_Type}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
                   },
        });
        setBuildingTypeOptions(response.data);
      } catch (error) {
        console.error("Error fetching building types:", error);
      }
    };
  }, [formData.Property_Type, baseURL, accessToken]);

  const handlePropertyTypeChange = async (selectedOption) => {
    const { value, id } = selectedOption;
    setFormData((prev) => ({
      ...prev,
      Property_Type: value,
      Property_type_id: id,
      building_type: "",
    }));
    try {
      const response = await axios.get(
        `${baseURL}building_types.json?q[property_type_id_eq]=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const buildingTypes = response.data || [];
      const formattedOptions = buildingTypes.map((item) => ({
        value: item.building_type,
        label: item.building_type,
        id: item.id,
      }));
      setBuildingTypeOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching building types:", error);
    }
  };

  useEffect(() => {
    const fetchConstructionStatuses = async () => {
      try {
        const response = await axios.get(
          `${baseURL}construction_statuses.json`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const options = response.data
          .filter((status) => status.active)
          .map((status) => ({
            label: status.construction_status,
            value: status.construction_status,
            name: status.Project_Construction_Status_Name,
          }));
        setStatusOptions(options);
      } catch (error) {
        console.error("Error fetching construction statuses:", error);
      }
    };
    fetchConstructionStatuses();
  }, [baseURL, accessToken]);

  // Fetch image configurations for dynamic tooltips
  useEffect(() => {
    const fetchImageConfigurations = async () => {
      try {
        const configNames = [
          "ProjectImage",
          "ProjectCoverImage",
          "ProjectGallery",
          "Project2DImage"
        ];
        
        const configs = {};
        
        for (const name of configNames) {
          const response = await axios.get(
            `${baseURL}system_constants.json?q[description_eq]=ImagesConfiguration&q[name_eq]=${name}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (response.data && Array.isArray(response.data)) {
            configs[name] = response.data.map(item => item.value);
          }
        }
        
        setImageConfigurations(configs);
      } catch (error) {
        console.error("Error fetching image configurations:", error);
      }
    };
    
    fetchImageConfigurations();
  }, [baseURL, accessToken]);

  // Helper function to format ratio from value like "image_16_by_9" to "16:9"
  const formatRatio = (value) => {
    if (!value) return "";
    const match = value.match(/(\d+)_by_(\d+)/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return value;
  };

  // Get dynamic ratios text for tooltips
  const getDynamicRatiosText = (configName) => {
    const ratios = imageConfigurations[configName];
    if (!ratios || ratios.length === 0) return "No ratios configured";
    
    const formattedRatios = ratios.map(formatRatio).join(", ");
    return `Required ratio${ratios.length > 1 ? 's' : ''}: ${formattedRatios}`;
  };

  const handleToggle = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }
    try {
      await axios.put(
        `${baseURL}projects/${id}.json`,
        { project: { published: updatedStatus } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: updatedStatus } : item
        )
      );
      const newToastId = toast.success("Status updated successfully!", {
        duration: 3000,
        position: "top-center",
        id: `toggle-${id}`,
      });
      setActiveToastId(newToastId);
    } catch (error) {
      console.error("Error updating status:", error);
      const newToastId = toast.error("Failed to update status.", {
        duration: 3000,
        position: "top-center",
        id: `toggle-error-${id}`,
      });
      setActiveToastId(newToastId);
    }
  };

  const handlePlanDelete = async (planId, index) => {
    if (!planId) {
      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan removed successfully!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}plans/${planId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan and all images deleted successfully!");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  const validateForm = (formData) => {
    // Clear previous toasts
    toast.dismiss();

    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }

    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (!validateForm(formData)) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const gallery_images = [
      "gallery_image_16_by_9",
      "gallery_image_1_by_1",
      "gallery_image_9_by_16",
      "gallery_image_3_by_2",
    ];

    const isValidImage = (img) =>
      img?.file instanceof File || !!img?.id || !!img?.document_file_name;

    // Combine all valid images from all gallery fields
    let totalValidGalleryImages = 0;

    for (const key of gallery_images) {
      const images = Array.isArray(formData[key])
        ? formData[key].filter(isValidImage)
        : [];
      totalValidGalleryImages += images.length;
    }

    if (totalValidGalleryImages > 0 && totalValidGalleryImages % 3 !== 0) {
      const remainder = totalValidGalleryImages % 3;
      const imagesNeeded = 3 - remainder;
      const previousValidCount = totalValidGalleryImages - remainder;

      const message = `Currently in Gallery ${totalValidGalleryImages} image${
        totalValidGalleryImages !== 1 ? "s" : ""
      } uploaded. Please upload ${imagesNeeded} more or remove ${remainder} to make it a multiple of 3.`;

      toast.error(message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }


    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {

      if (key === "plans" && Array.isArray(value)) {
        value.forEach((plan, index) => {
          data.append(`project[plans][${index}][name]`, plan.name);
          if (Array.isArray(plan.images)) {
            plan.images.forEach((img) => {
              data.append(`project[plans][${index}][images][]`, img);
            });
          }
        });
      } else if (key === "Address") {
        for (const addressKey in value) {
          data.append(`project[Address][${addressKey}]`, value[addressKey]);
        }
      } else if (key === "brochure" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectBrochure][]", file);
          }
        });
      } else if (key === "project_emailer_templetes" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectEmailerTempletes][]", file);
          }
        });
      } else if (key === "KnwYrApt_Technical" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[KnwYrApt_Technical][]", file);
          }
        });
      } else if (key === "two_d_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[Project2DImage][]", file));
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreatives][]", file)
        );
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[cover_images][]", file));
      } else if (key === "project_creative_generics" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeGenerics][]", file)
        );
      } else if (key === "project_creative_offers" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeOffers][]", file)
        );
      } else if (key === "project_interiors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectInteriors][]", file)
        );
      } else if (key === "project_exteriors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectExteriors][]", file)
        );
      } else if (key === "project_layout" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectLayout][]", file));
      } else if (key === "videos" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectVideo][]", file));
      } else if (key === "gallery_image" && Array.isArray(value)) {
        value.forEach((fileObj, index) => {
          if (fileObj.gallery_image instanceof File) {
            data.append("project[gallery_image][]", fileObj.gallery_image);
            data.append(
              `project[gallery_image_file_name][${index}]`,
              fileObj.gallery_image_file_name
            );
            data.append(
              `project[gallery_type]`,
              fileObj.gallery_image_file_type
            );
            data.append(
              `project[gallery_image_is_day][${index}]`,
              fileObj.isDay
            );
          }
        });
      } else if (key === "image" && mainImageUpload[0]?.file instanceof File) {
        data.append("project[image]", mainImageUpload[0]?.file);
      } else if (key === "video_preview_image_url" && value instanceof File) {
        data.append("project[video_preview_image_url]", value);
      }
      else if (key === "project_qrcode_image" && Array.isArray(value)) {
        value.forEach((fileObj) => {
          if (fileObj.project_qrcode_image instanceof File) {
            data.append(
              "project[project_qrcode_image][]",
              fileObj.project_qrcode_image
            );
            data.append(
              "project[project_qrcode_image_titles][]",
              fileObj.title || ""
            );
          }
        });
      } else if (key === "virtual_tour_url_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.virtual_tour_url && item.virtual_tour_name) {
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_url]`,
              item.virtual_tour_url
            );
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_name]`,
              item.virtual_tour_name
            );
          }
        });
      } else if (key === "Rera_Number_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.tower_name && item.rera_number) {
            data.append(
              `project[Rera_Number_multiple][${index}][tower_name]`,
              item.tower_name
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_number]`,
              item.rera_number
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_url]`,
              item.rera_url
            );
          }
        });
      } else if (key === "project_ppt" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectPPT]", file);
          }
        });
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[project_creatives][]", file);
            data.append(`project[project_creatives_types][]`, type);
          }
        });
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[cover_images][]", file);
            data.append(`project[cover_images_types][]`, type);
          }
        });
      } else if (key === "project_sales_type" && Array.isArray(value)) {
        data.append("project[project_sales_type][]", value);
      } else if (key.startsWith("image") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField = key.replace("image", "project[image") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("cover_images_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("cover_images_", "project[cover_images_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("gallery_image_") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            // Send as array without indices
            data.append(`project[${key}][][file]`, img.file);
            data.append(`project[${key}][][file_name]`, img.file_name || img.file.name);
          }
        });
      } else if (key.startsWith("floor_plans_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("floor_plans_", "project[floor_plans_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("project_2d_image") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            const backendField =
              key.replace("project_2d_image", "project[project_2d_image") +
              "][]";
            data.append(backendField, img.file);
          }
        });
      } else {
        data.append(`project[${key}]`, value);
      }
    });

    try {
      const response = await axios.post(`${baseURL}projects.json`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("data to be sent:", Array.from(data.entries()));
      toast.success("Project submitted successfully");
      sessionStorage.removeItem("cached_projects");
      Navigate("/project-list");
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data &&
        (error.response.data.project_name || error.response.data.Project_Name)
      ) {
        toast.error("Project name already exists.");
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}get_property_types.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setprojectsType(response.data?.property_types);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const url = `${baseURL}configuration_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setConfigurations(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigurations();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchSpecifications = async () => {
      const url = `${baseURL}specification_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data && response.data.specification_setups) {
          setSpecifications(response.data.specification_setups);
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };
    fetchSpecifications();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}amenity_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setAmenities(response.data?.amenities_setups);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}category_types.json`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          const formattedCategories = response.data.map((item) => ({
            value: item.category_type,
            label: item.category_type,
          }));
          setCategoryTypes(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };
    fetchCategoryTypes();
  }, [baseURL, accessToken]);

  const handleCancel = () => {
    setFormData({
      Property_Type: "",
      SFDC_Project_Id: "",
      Project_Construction_Status: "",
      Configuration_Type: [],
      Project_Name: "",
      project_address: "",
      Project_Description: "",
      Price_Onward: "",
      Project_Size_Sq_Mtr: "",
      Project_Size_Sq_Ft: "",
      development_area_sqft: "",
      development_area_sqmt: "",
      Rera_Carpet_Area_Sq_M: "",
      Rera_Carpet_Area_sqft: "",
      Number_Of_Towers: "",
      Number_Of_Units: "",
      no_of_floors: "",
      Rera_Number_multiple: [],
      Amenities: [],
      Specifications: [],
      Land_Area: "",
      land_uom: "",
      project_tag: "",
      virtual_tour_url_multiple: [],
      map_url: "",
      image: [],
      Address: {
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pin_code: "",
        country: "",
      },
      brochure: [],
      two_d_images: [],
      videos: [],
      gallery_image: [],
    });
    Navigate(-1);
  };

  const handleTowerChange = (e) => {
    setTowerName(e.target.value);
  };

  const handleDayNightChange = (index, isDay) => {
    setFormData((prev) => {
      const updatedGallery = [...prev.gallery_image];
      updatedGallery[index].isDay = isDay;
      return { ...prev, gallery_image: updatedGallery };
    });
  };

  const handleReraNumberChange = (e) => {
    const { value } = e.target;
    if (/^[a-zA-Z0-9]{0,12}$/.test(value)) {
      setReraNumber(value);
    }
  };

  const handleReraUrlChange = (e) => {
    setReraUrl(e.target.value);
  };

  const handleReraNumberBlur = () => {
    if (reraNumber.length !== 12) {
      toast.error("RERA Number must be exactly 12 alphanumeric characters!", {
        position: "top-right",
        autoClose: 3000,
      });
      setReraNumber("");
    }
  };

  const handleAddRera = () => {
    toast.dismiss();
    if (!towerName.trim() || !reraNumber.trim()) {
      toast.error("Both Tower and RERA Number are required.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: [
        ...prev.Rera_Number_multiple,
        {
          tower_name: towerName,
          rera_number: reraNumber,
          rera_url: reraUrl,
        },
      ],
    }));
    setTowerName("");
    setReraNumber("");
    setReraUrl("");
  };

  const handleDeleteRera = (index) => {
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: prev.Rera_Number_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleVirtualTourChange = (e) => {
    setVirtualTourUrl(e.target.value);
  };

  const handleVirtualTourNameChange = (e) => {
    setVirtualTourName(e.target.value);
  };

  const handleAddVirtualTour = () => {
    toast.dismiss();
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: [
        ...prev.virtual_tour_url_multiple,
        {
          virtual_tour_url: virtualTourUrl,
          virtual_tour_name: virtualTourName,
        },
      ],
    }));
    setVirtualTourUrl("");
    setVirtualTourName("");
  };

  const handleDeleteVirtualTour = (index) => {
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: prev.virtual_tour_url_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      let isValid = false;
      let maxSize = 0;
      let fileTypeDescription = "";

      if (allowedImageTypes.includes(file.type)) {
        maxSize = MAX_IMAGE_SIZE;
        fileTypeDescription = "image";
        isValid = true;
      } else if (allowedVideoTypes.includes(file.type)) {
        maxSize = MAX_VIDEO_SIZE;
        fileTypeDescription = "video";
        isValid = true;
      } else {
        toast.error(
          `Invalid file type: ${file.name}. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, QuickTime, AVI) are allowed.`
        );
        invalidFiles.push(file);
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image size must be less than 3MB.");
        invalidFiles.push(file);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const updatedImages = validFiles.map((file) => ({
        gallery_image: file,
        gallery_image_file_name: file.name,
        gallery_image_file_type: selectedCategory,
        isDay: true,
      }));
      setFormData((prev) => ({
        ...prev,
        gallery_image: [...(prev.gallery_image || []), ...updatedImages],
      }));
      toast.success(`${validFiles.length} file(s) uploaded successfully.`);
    }
    event.target.value = "";
  };

  const handleDiscardGallery = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery_image: prev.gallery_image.filter((_, i) => i !== index),
    }));
  };

  const handleDiscardPpt = (key, index) => {
    setFormData((prev) => {
      if (!prev[key] || !Array.isArray(prev[key])) return prev;
      const updatedFiles = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: updatedFiles };
    });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}property_types.json`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const options = response.data
          .filter((item) => item.active)
          .map((type) => ({
            value: type.property_type,
            label: type.property_type,
            id: type.id,
          }));
        setPropertyTypeOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
      });
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      const url = `${baseURL}building_types.json?q[property_type_id_eq]=${formData.Property_Type}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBuildingTypeOptions(response.data);
      } catch (error) {
        console.error("Error fetching building types:", error);
      }
    };
  }, [formData.Property_Type, baseURL, accessToken]);

  const [buildingTypeOptions, setBuildingTypeOptions] = useState([]);

  const handlePropertyTypeChange = async (selectedOption) => {
    const { value, id } = selectedOption;
    setFormData((prev) => ({
      ...prev,
      Property_Type: value,
      Property_type_id: id,
      building_type: "",
    }));
    try {
      const response = await axios.get(
        `${baseURL}building_types.json?q[property_type_id_eq]=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const buildingTypes = response.data || [];
      const formattedOptions = buildingTypes.map((item) => ({
        value: item.building_type,
        label: item.building_type,
        id: item.id,
      }));
      setBuildingTypeOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching building types:", error);
    }
  };

  useEffect(() => {
    const fetchConstructionStatuses = async () => {
      try {
        const response = await axios.get(
          `${baseURL}construction_statuses.json`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const options = response.data
          .filter((status) => status.active)
          .map((status) => ({
            label: status.construction_status,
            value: status.construction_status,
            name: status.Project_Construction_Status_Name,
          }));
        setStatusOptions(options);
      } catch (error) {
        console.error("Error fetching construction statuses:", error);
      }
    };
    fetchConstructionStatuses();
  }, [baseURL, accessToken]);

  // Fetch image configurations for dynamic tooltips
  useEffect(() => {
    const fetchImageConfigurations = async () => {
      try {
        const configNames = [
          "ProjectImage",
          "ProjectCoverImage",
          "ProjectGallery",
          "Project2DImage"
        ];
        
        const configs = {};
        
        for (const name of configNames) {
          const response = await axios.get(
            `${baseURL}system_constants.json?q[description_eq]=ImagesConfiguration&q[name_eq]=${name}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (response.data && Array.isArray(response.data)) {
            configs[name] = response.data.map(item => item.value);
          }
        }
        
        setImageConfigurations(configs);
      } catch (error) {
        console.error("Error fetching image configurations:", error);
      }
    };
    
    fetchImageConfigurations();
  }, [baseURL, accessToken]);

  // Helper function to format ratio from value like "image_16_by_9" to "16:9"
  const formatRatio = (value) => {
    if (!value) return "";
    const match = value.match(/(\d+)_by_(\d+)/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return value;
  };

  // Get dynamic ratios text for tooltips
  const getDynamicRatiosText = (configName) => {
    const ratios = imageConfigurations[configName];
    if (!ratios || ratios.length === 0) return "No ratios configured";
    
    const formattedRatios = ratios.map(formatRatio).join(", ");
    return `Required ratio${ratios.length > 1 ? 's' : ''}: ${formattedRatios}`;
  };

  const handleToggle = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }
    try {
      await axios.put(
        `${baseURL}projects/${id}.json`,
        { project: { published: updatedStatus } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: updatedStatus } : item
        )
      );
      const newToastId = toast.success("Status updated successfully!", {
        duration: 3000,
        position: "top-center",
        id: `toggle-${id}`,
      });
      setActiveToastId(newToastId);
    } catch (error) {
      console.error("Error updating status:", error);
      const newToastId = toast.error("Failed to update status.", {
        duration: 3000,
        position: "top-center",
        id: `toggle-error-${id}`,
      });
      setActiveToastId(newToastId);
    }
  };

  const handlePlanDelete = async (planId, index) => {
    if (!planId) {
      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan removed successfully!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}plans/${planId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan and all images deleted successfully!");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  const validateForm = (formData) => {
    // Clear previous toasts
    toast.dismiss();

    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }

    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (!validateForm(formData)) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const gallery_images = [
      "gallery_image_16_by_9",
      "gallery_image_1_by_1",
      "gallery_image_9_by_16",
      "gallery_image_3_by_2",
    ];

    const isValidImage = (img) =>
      img?.file instanceof File || !!img?.id || !!img?.document_file_name;

    // Combine all valid images from all gallery fields
    let totalValidGalleryImages = 0;

    for (const key of gallery_images) {
      const images = Array.isArray(formData[key])
        ? formData[key].filter(isValidImage)
        : [];
      totalValidGalleryImages += images.length;
    }

    if (totalValidGalleryImages > 0 && totalValidGalleryImages % 3 !== 0) {
      const remainder = totalValidGalleryImages % 3;
      const imagesNeeded = 3 - remainder;
      const previousValidCount = totalValidGalleryImages - remainder;

      const message = `Currently in Gallery ${totalValidGalleryImages} image${
        totalValidGalleryImages !== 1 ? "s" : ""
      } uploaded. Please upload ${imagesNeeded} more or remove ${remainder} to make it a multiple of 3.`;

      toast.error(message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }


    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {

      if (key === "plans" && Array.isArray(value)) {
        value.forEach((plan, index) => {
          data.append(`project[plans][${index}][name]`, plan.name);
          if (Array.isArray(plan.images)) {
            plan.images.forEach((img) => {
              data.append(`project[plans][${index}][images][]`, img);
            });
          }
        });
      } else if (key === "Address") {
        for (const addressKey in value) {
          data.append(`project[Address][${addressKey}]`, value[addressKey]);
        }
      } else if (key === "brochure" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectBrochure][]", file);
          }
        });
      } else if (key === "project_emailer_templetes" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectEmailerTempletes][]", file);
          }
        });
      } else if (key === "KnwYrApt_Technical" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[KnwYrApt_Technical][]", file);
          }
        });
      } else if (key === "two_d_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[Project2DImage][]", file));
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreatives][]", file)
        );
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[cover_images][]", file));
      } else if (key === "project_creative_generics" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeGenerics][]", file)
        );
      } else if (key === "project_creative_offers" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeOffers][]", file)
        );
      } else if (key === "project_interiors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectInteriors][]", file)
        );
      } else if (key === "project_exteriors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectExteriors][]", file)
        );
      } else if (key === "project_layout" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectLayout][]", file));
      } else if (key === "videos" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectVideo][]", file));
      } else if (key === "gallery_image" && Array.isArray(value)) {
        value.forEach((fileObj, index) => {
          if (fileObj.gallery_image instanceof File) {
            data.append("project[gallery_image][]", fileObj.gallery_image);
            data.append(
              `project[gallery_image_file_name][${index}]`,
              fileObj.gallery_image_file_name
            );
            data.append(
              `project[gallery_type]`,
              fileObj.gallery_image_file_type
            );
            data.append(
              `project[gallery_image_is_day][${index}]`,
              fileObj.isDay
            );
          }
        });
      } else if (key === "image" && mainImageUpload[0]?.file instanceof File) {
        data.append("project[image]", mainImageUpload[0]?.file);
      } else if (key === "video_preview_image_url" && value instanceof File) {
        data.append("project[video_preview_image_url]", value);
      }
      else if (key === "project_qrcode_image" && Array.isArray(value)) {
        value.forEach((fileObj) => {
          if (fileObj.project_qrcode_image instanceof File) {
            data.append(
              "project[project_qrcode_image][]",
              fileObj.project_qrcode_image
            );
            data.append(
              "project[project_qrcode_image_titles][]",
              fileObj.title || ""
            );
          }
        });
      } else if (key === "virtual_tour_url_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.virtual_tour_url && item.virtual_tour_name) {
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_url]`,
              item.virtual_tour_url
            );
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_name]`,
              item.virtual_tour_name
            );
          }
        });
      } else if (key === "Rera_Number_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.tower_name && item.rera_number) {
            data.append(
              `project[Rera_Number_multiple][${index}][tower_name]`,
              item.tower_name
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_number]`,
              item.rera_number
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_url]`,
              item.rera_url
            );
          }
        });
      } else if (key === "project_ppt" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectPPT]", file);
          }
        });
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[project_creatives][]", file);
            data.append(`project[project_creatives_types][]`, type);
          }
        });
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[cover_images][]", file);
            data.append(`project[cover_images_types][]`, type);
          }
        });
      } else if (key === "project_sales_type" && Array.isArray(value)) {
        data.append("project[project_sales_type][]", value);
      } else if (key.startsWith("image") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField = key.replace("image", "project[image") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("cover_images_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("cover_images_", "project[cover_images_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("gallery_image_") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            // Send as array without indices
            data.append(`project[${key}][][file]`, img.file);
            data.append(`project[${key}][][file_name]`, img.file_name || img.file.name);
          }
        });
      } else if (key.startsWith("floor_plans_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("floor_plans_", "project[floor_plans_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("project_2d_image") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            const backendField =
              key.replace("project_2d_image", "project[project_2d_image") +
              "][]";
            data.append(backendField, img.file);
          }
        });
      } else {
        data.append(`project[${key}]`, value);
      }
    });

    try {
      const response = await axios.post(`${baseURL}projects.json`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("data to be sent:", Array.from(data.entries()));
      toast.success("Project submitted successfully");
      sessionStorage.removeItem("cached_projects");
      Navigate("/project-list");
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data &&
        (error.response.data.project_name || error.response.data.Project_Name)
      ) {
        toast.error("Project name already exists.");
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}get_property_types.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setprojectsType(response.data?.property_types);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const url = `${baseURL}configuration_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setConfigurations(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigurations();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchSpecifications = async () => {
      const url = `${baseURL}specification_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data && response.data.specification_setups) {
          setSpecifications(response.data.specification_setups);
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };
    fetchSpecifications();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}amenity_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setAmenities(response.data?.amenities_setups);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}category_types.json`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          const formattedCategories = response.data.map((item) => ({
            value: item.category_type,
            label: item.category_type,
          }));
          setCategoryTypes(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };
    fetchCategoryTypes();
  }, [baseURL, accessToken]);

  const handleCancel = () => {
    setFormData({
      Property_Type: "",
      SFDC_Project_Id: "",
      Project_Construction_Status: "",
      Configuration_Type: [],
      Project_Name: "",
      project_address: "",
      Project_Description: "",
      Price_Onward: "",
      Project_Size_Sq_Mtr: "",
      Project_Size_Sq_Ft: "",
      development_area_sqft: "",
      development_area_sqmt: "",
      Rera_Carpet_Area_Sq_M: "",
      Rera_Carpet_Area_sqft: "",
      Number_Of_Towers: "",
      Number_Of_Units: "",
      no_of_floors: "",
      Rera_Number_multiple: [],
      Amenities: [],
      Specifications: [],
      Land_Area: "",
      land_uom: "",
      project_tag: "",
      virtual_tour_url_multiple: [],
      map_url: "",
      image: [],
      Address: {
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pin_code: "",
        country: "",
      },
      brochure: [],
      two_d_images: [],
      videos: [],
      gallery_image: [],
    });
    Navigate(-1);
  };

  const handleTowerChange = (e) => {
    setTowerName(e.target.value);
  };

  const handleDayNightChange = (index, isDay) => {
    setFormData((prev) => {
      const updatedGallery = [...prev.gallery_image];
      updatedGallery[index].isDay = isDay;
      return { ...prev, gallery_image: updatedGallery };
    });
  };

  const handleReraNumberChange = (e) => {
    const { value } = e.target;
    if (/^[a-zA-Z0-9]{0,12}$/.test(value)) {
      setReraNumber(value);
    }
  };

  const handleReraUrlChange = (e) => {
    setReraUrl(e.target.value);
  };

  const handleReraNumberBlur = () => {
    if (reraNumber.length !== 12) {
      toast.error("RERA Number must be exactly 12 alphanumeric characters!", {
        position: "top-right",
        autoClose: 3000,
      });
      setReraNumber("");
    }
  };

  const handleAddRera = () => {
    toast.dismiss();
    if (!towerName.trim() || !reraNumber.trim()) {
      toast.error("Both Tower and RERA Number are required.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: [
        ...prev.Rera_Number_multiple,
        {
          tower_name: towerName,
          rera_number: reraNumber,
          rera_url: reraUrl,
        },
      ],
    }));
    setTowerName("");
    setReraNumber("");
    setReraUrl("");
  };

  const handleDeleteRera = (index) => {
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: prev.Rera_Number_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleVirtualTourChange = (e) => {
    setVirtualTourUrl(e.target.value);
  };

  const handleVirtualTourNameChange = (e) => {
    setVirtualTourName(e.target.value);
  };

  const handleAddVirtualTour = () => {
    toast.dismiss();
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: [
        ...prev.virtual_tour_url_multiple,
        {
          virtual_tour_url: virtualTourUrl,
          virtual_tour_name: virtualTourName,
        },
      ],
    }));
    setVirtualTourUrl("");
    setVirtualTourName("");
  };

  const handleDeleteVirtualTour = (index) => {
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: prev.virtual_tour_url_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      let isValid = false;
      let maxSize = 0;
      let fileTypeDescription = "";

      if (allowedImageTypes.includes(file.type)) {
        maxSize = MAX_IMAGE_SIZE;
        fileTypeDescription = "image";
        isValid = true;
      } else if (allowedVideoTypes.includes(file.type)) {
        maxSize = MAX_VIDEO_SIZE;
        fileTypeDescription = "video";
        isValid = true;
      } else {
        toast.error(
          `Invalid file type: ${file.name}. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, QuickTime, AVI) are allowed.`
        );
        invalidFiles.push(file);
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image size must be less than 3MB.");
        invalidFiles.push(file);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const updatedImages = validFiles.map((file) => ({
        gallery_image: file,
        gallery_image_file_name: file.name,
        gallery_image_file_type: selectedCategory,
        isDay: true,
      }));
      setFormData((prev) => ({
        ...prev,
        gallery_image: [...(prev.gallery_image || []), ...updatedImages],
      }));
      toast.success(`${validFiles.length} file(s) uploaded successfully.`);
    }
    event.target.value = "";
  };

  const handleDiscardGallery = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery_image: prev.gallery_image.filter((_, i) => i !== index),
    }));
  };

  const handleDiscardPpt = (key, index) => {
    setFormData((prev) => {
      if (!prev[key] || !Array.isArray(prev[key])) return prev;
      const updatedFiles = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: updatedFiles };
    });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}property_types.json`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const options = response.data
          .filter((item) => item.active)
          .map((type) => ({
            value: type.property_type,
            label: type.property_type,
            id: type.id,
          }));
        setPropertyTypeOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
      });
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      const url = `${baseURL}building_types.json?q[property_type_id_eq]=${formData.Property_Type}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBuildingTypeOptions(response.data);
      } catch (error) {
        console.error("Error fetching building types:", error);
      }
    };
  }, [formData.Property_Type, baseURL, accessToken]);

  const [buildingTypeOptions, setBuildingTypeOptions] = useState([]);

  const handlePropertyTypeChange = async (selectedOption) => {
    const { value, id } = selectedOption;
    setFormData((prev) => ({
      ...prev,
      Property_Type: value,
      Property_type_id: id,
      building_type: "",
    }));
    try {
      const response = await axios.get(
        `${baseURL}building_types.json?q[property_type_id_eq]=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const buildingTypes = response.data || [];
      const formattedOptions = buildingTypes.map((item) => ({
        value: item.building_type,
        label: item.building_type,
        id: item.id,
      }));
      setBuildingTypeOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching building types:", error);
    }
  };

  useEffect(() => {
    const fetchConstructionStatuses = async () => {
      try {
        const response = await axios.get(
          `${baseURL}construction_statuses.json`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const options = response.data
          .filter((status) => status.active)
          .map((status) => ({
            label: status.construction_status,
            value: status.construction_status,
            name: status.Project_Construction_Status_Name,
          }));
        setStatusOptions(options);
      } catch (error) {
        console.error("Error fetching construction statuses:", error);
      }
    };
    fetchConstructionStatuses();
  }, [baseURL, accessToken]);

  // Fetch image configurations for dynamic tooltips
  useEffect(() => {
    const fetchImageConfigurations = async () => {
      try {
        const configNames = [
          "ProjectImage",
          "ProjectCoverImage",
          "ProjectGallery",
          "Project2DImage"
        ];
        
        const configs = {};
        
        for (const name of configNames) {
          const response = await axios.get(
            `${baseURL}system_constants.json?q[description_eq]=ImagesConfiguration&q[name_eq]=${name}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (response.data && Array.isArray(response.data)) {
            configs[name] = response.data.map(item => item.value);
          }
        }
        
        setImageConfigurations(configs);
      } catch (error) {
        console.error("Error fetching image configurations:", error);
      }
    };
    
    fetchImageConfigurations();
  }, [baseURL, accessToken]);

  // Helper function to format ratio from value like "image_16_by_9" to "16:9"
  const formatRatio = (value) => {
    if (!value) return "";
    const match = value.match(/(\d+)_by_(\d+)/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return value;
  };

  // Get dynamic ratios text for tooltips
  const getDynamicRatiosText = (configName) => {
    const ratios = imageConfigurations[configName];
    if (!ratios || ratios.length === 0) return "No ratios configured";
    
    const formattedRatios = ratios.map(formatRatio).join(", ");
    return `Required ratio${ratios.length > 1 ? 's' : ''}: ${formattedRatios}`;
  };

  const handleToggle = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }
    try {
      await axios.put(
        `${baseURL}projects/${id}.json`,
        { project: { published: updatedStatus } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: updatedStatus } : item
        )
      );
      const newToastId = toast.success("Status updated successfully!", {
        duration: 3000,
        position: "top-center",
        id: `toggle-${id}`,
      });
      setActiveToastId(newToastId);
    } catch (error) {
      console.error("Error updating status:", error);
      const newToastId = toast.error("Failed to update status.", {
        duration: 3000,
        position: "top-center",
        id: `toggle-error-${id}`,
      });
      setActiveToastId(newToastId);
    }
  };

  const handlePlanDelete = async (planId, index) => {
    if (!planId) {
      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan removed successfully!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}plans/${planId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan and all images deleted successfully!");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  const validateForm = (formData) => {
    // Clear previous toasts
    toast.dismiss();

    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }

    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (!validateForm(formData)) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const gallery_images = [
      "gallery_image_16_by_9",
      "gallery_image_1_by_1",
      "gallery_image_9_by_16",
      "gallery_image_3_by_2",
    ];

    const isValidImage = (img) =>
      img?.file instanceof File || !!img?.id || !!img?.document_file_name;

    // Combine all valid images from all gallery fields
    let totalValidGalleryImages = 0;

    for (const key of gallery_images) {
      const images = Array.isArray(formData[key])
        ? formData[key].filter(isValidImage)
        : [];
      totalValidGalleryImages += images.length;
    }

    if (totalValidGalleryImages > 0 && totalValidGalleryImages % 3 !== 0) {
      const remainder = totalValidGalleryImages % 3;
      const imagesNeeded = 3 - remainder;
      const previousValidCount = totalValidGalleryImages - remainder;

      const message = `Currently in Gallery ${totalValidGalleryImages} image${
        totalValidGalleryImages !== 1 ? "s" : ""
      } uploaded. Please upload ${imagesNeeded} more or remove ${remainder} to make it a multiple of 3.`;

      toast.error(message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }


    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {

      if (key === "plans" && Array.isArray(value)) {
        value.forEach((plan, index) => {
          data.append(`project[plans][${index}][name]`, plan.name);
          if (Array.isArray(plan.images)) {
            plan.images.forEach((img) => {
              data.append(`project[plans][${index}][images][]`, img);
            });
          }
        });
      } else if (key === "Address") {
        for (const addressKey in value) {
          data.append(`project[Address][${addressKey}]`, value[addressKey]);
        }
      } else if (key === "brochure" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectBrochure][]", file);
          }
        });
      } else if (key === "project_emailer_templetes" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectEmailerTempletes][]", file);
          }
        });
      } else if (key === "KnwYrApt_Technical" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[KnwYrApt_Technical][]", file);
          }
        });
      } else if (key === "two_d_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[Project2DImage][]", file));
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreatives][]", file)
        );
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[cover_images][]", file));
      } else if (key === "project_creative_generics" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeGenerics][]", file)
        );
      } else if (key === "project_creative_offers" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeOffers][]", file)
        );
      } else if (key === "project_interiors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectInteriors][]", file)
        );
      } else if (key === "project_exteriors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectExteriors][]", file)
        );
      } else if (key === "project_layout" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectLayout][]", file));
      } else if (key === "videos" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectVideo][]", file));
      } else if (key === "gallery_image" && Array.isArray(value)) {
        value.forEach((fileObj, index) => {
          if (fileObj.gallery_image instanceof File) {
            data.append("project[gallery_image][]", fileObj.gallery_image);
            data.append(
              `project[gallery_image_file_name][${index}]`,
              fileObj.gallery_image_file_name
            );
            data.append(
              `project[gallery_type]`,
              fileObj.gallery_image_file_type
            );
            data.append(
              `project[gallery_image_is_day][${index}]`,
              fileObj.isDay
            );
          }
        });
      } else if (key === "image" && mainImageUpload[0]?.file instanceof File) {
        data.append("project[image]", mainImageUpload[0]?.file);
      } else if (key === "video_preview_image_url" && value instanceof File) {
        data.append("project[video_preview_image_url]", value);
      }
      else if (key === "project_qrcode_image" && Array.isArray(value)) {
        value.forEach((fileObj) => {
          if (fileObj.project_qrcode_image instanceof File) {
            data.append(
              "project[project_qrcode_image][]",
              fileObj.project_qrcode_image
            );
            data.append(
              "project[project_qrcode_image_titles][]",
              fileObj.title || ""
            );
          }
        });
      } else if (key === "virtual_tour_url_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.virtual_tour_url && item.virtual_tour_name) {
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_url]`,
              item.virtual_tour_url
            );
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_name]`,
              item.virtual_tour_name
            );
          }
        });
      } else if (key === "Rera_Number_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.tower_name && item.rera_number) {
            data.append(
              `project[Rera_Number_multiple][${index}][tower_name]`,
              item.tower_name
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_number]`,
              item.rera_number
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_url]`,
              item.rera_url
            );
          }
        });
      } else if (key === "project_ppt" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectPPT]", file);
          }
        });
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[project_creatives][]", file);
            data.append(`project[project_creatives_types][]`, type);
          }
        });
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[cover_images][]", file);
            data.append(`project[cover_images_types][]`, type);
          }
        });
      } else if (key === "project_sales_type" && Array.isArray(value)) {
        data.append("project[project_sales_type][]", value);
      } else if (key.startsWith("image") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField = key.replace("image", "project[image") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("cover_images_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("cover_images_", "project[cover_images_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("gallery_image_") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            // Send as array without indices
            data.append(`project[${key}][][file]`, img.file);
            data.append(`project[${key}][][file_name]`, img.file_name || img.file.name);
          }
        });
      } else if (key.startsWith("floor_plans_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("floor_plans_", "project[floor_plans_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("project_2d_image") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            const backendField =
              key.replace("project_2d_image", "project[project_2d_image") +
              "][]";
            data.append(backendField, img.file);
          }
        });
      } else {
        data.append(`project[${key}]`, value);
      }
    });

    try {
      const response = await axios.post(`${baseURL}projects.json`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("data to be sent:", Array.from(data.entries()));
      toast.success("Project submitted successfully");
      sessionStorage.removeItem("cached_projects");
      Navigate("/project-list");
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data &&
        (error.response.data.project_name || error.response.data.Project_Name)
      ) {
        toast.error("Project name already exists.");
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}get_property_types.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setprojectsType(response.data?.property_types);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const url = `${baseURL}configuration_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setConfigurations(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigurations();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchSpecifications = async () => {
      const url = `${baseURL}specification_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data && response.data.specification_setups) {
          setSpecifications(response.data.specification_setups);
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };
    fetchSpecifications();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}amenity_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setAmenities(response.data?.amenities_setups);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}category_types.json`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          const formattedCategories = response.data.map((item) => ({
            value: item.category_type,
            label: item.category_type,
          }));
          setCategoryTypes(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };
    fetchCategoryTypes();
  }, [baseURL, accessToken]);

  const handleCancel = () => {
    setFormData({
      Property_Type: "",
      SFDC_Project_Id: "",
      Project_Construction_Status: "",
      Configuration_Type: [],
      Project_Name: "",
      project_address: "",
      Project_Description: "",
      Price_Onward: "",
      Project_Size_Sq_Mtr: "",
      Project_Size_Sq_Ft: "",
      development_area_sqft: "",
      development_area_sqmt: "",
      Rera_Carpet_Area_Sq_M: "",
      Rera_Carpet_Area_sqft: "",
      Number_Of_Towers: "",
      Number_Of_Units: "",
      no_of_floors: "",
      Rera_Number_multiple: [],
      Amenities: [],
      Specifications: [],
      Land_Area: "",
      land_uom: "",
      project_tag: "",
      virtual_tour_url_multiple: [],
      map_url: "",
      image: [],
      Address: {
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pin_code: "",
        country: "",
      },
      brochure: [],
      two_d_images: [],
      videos: [],
      gallery_image: [],
    });
    Navigate(-1);
  };

  const handleTowerChange = (e) => {
    setTowerName(e.target.value);
  };

  const handleDayNightChange = (index, isDay) => {
    setFormData((prev) => {
      const updatedGallery = [...prev.gallery_image];
      updatedGallery[index].isDay = isDay;
      return { ...prev, gallery_image: updatedGallery };
    });
  };

  const handleReraNumberChange = (e) => {
    const { value } = e.target;
    if (/^[a-zA-Z0-9]{0,12}$/.test(value)) {
      setReraNumber(value);
    }
  };

  const handleReraUrlChange = (e) => {
    setReraUrl(e.target.value);
  };

  const handleReraNumberBlur = () => {
    if (reraNumber.length !== 12) {
      toast.error("RERA Number must be exactly 12 alphanumeric characters!", {
        position: "top-right",
        autoClose: 3000,
      });
      setReraNumber("");
    }
  };

  const handleAddRera = () => {
    toast.dismiss();
    if (!towerName.trim() || !reraNumber.trim()) {
      toast.error("Both Tower and RERA Number are required.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: [
        ...prev.Rera_Number_multiple,
        {
          tower_name: towerName,
          rera_number: reraNumber,
          rera_url: reraUrl,
        },
      ],
    }));
    setTowerName("");
    setReraNumber("");
    setReraUrl("");
  };

  const handleDeleteRera = (index) => {
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: prev.Rera_Number_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleVirtualTourChange = (e) => {
    setVirtualTourUrl(e.target.value);
  };

  const handleVirtualTourNameChange = (e) => {
    setVirtualTourName(e.target.value);
  };

  const handleAddVirtualTour = () => {
    toast.dismiss();
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: [
        ...prev.virtual_tour_url_multiple,
        {
          virtual_tour_url: virtualTourUrl,
          virtual_tour_name: virtualTourName,
        },
      ],
    }));
    setVirtualTourUrl("");
    setVirtualTourName("");
  };

  const handleDeleteVirtualTour = (index) => {
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: prev.virtual_tour_url_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      let isValid = false;
      let maxSize = 0;
      let fileTypeDescription = "";

      if (allowedImageTypes.includes(file.type)) {
        maxSize = MAX_IMAGE_SIZE;
        fileTypeDescription = "image";
        isValid = true;
      } else if (allowedVideoTypes.includes(file.type)) {
        maxSize = MAX_VIDEO_SIZE;
        fileTypeDescription = "video";
        isValid = true;
      } else {
        toast.error(
          `Invalid file type: ${file.name}. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, QuickTime, AVI) are allowed.`
        );
        invalidFiles.push(file);
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image size must be less than 3MB.");
        invalidFiles.push(file);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const updatedImages = validFiles.map((file) => ({
        gallery_image: file,
        gallery_image_file_name: file.name,
        gallery_image_file_type: selectedCategory,
        isDay: true,
      }));
      setFormData((prev) => ({
        ...prev,
        gallery_image: [...(prev.gallery_image || []), ...updatedImages],
      }));
      toast.success(`${validFiles.length} file(s) uploaded successfully.`);
    }
    event.target.value = "";
  };

  const handleDiscardGallery = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery_image: prev.gallery_image.filter((_, i) => i !== index),
    }));
  };

  const handleDiscardPpt = (key, index) => {
    setFormData((prev) => {
      if (!prev[key] || !Array.isArray(prev[key])) return prev;
      const updatedFiles = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: updatedFiles };
    });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}property_types.json`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const options = response.data
          .filter((item) => item.active)
          .map((type) => ({
            value: type.property_type,
            label: type.property_type,
            id: type.id,
          }));
        setPropertyTypeOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
      });
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      const url = `${baseURL}building_types.json?q[property_type_id_eq]=${formData.Property_Type}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBuildingTypeOptions(response.data);
      } catch (error) {
        console.error("Error fetching building types:", error);
      }
    };
  }, [formData.Property_Type, baseURL, accessToken]);

  const [buildingTypeOptions, setBuildingTypeOptions] = useState([]);

  const handlePropertyTypeChange = async (selectedOption) => {
    const { value, id } = selectedOption;
    setFormData((prev) => ({
      ...prev,
      Property_Type: value,
      Property_type_id: id,
      building_type: "",
    }));
    try {
      const response = await axios.get(
        `${baseURL}building_types.json?q[property_type_id_eq]=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const buildingTypes = response.data || [];
      const formattedOptions = buildingTypes.map((item) => ({
        value: item.building_type,
        label: item.building_type,
        id: item.id,
      }));
      setBuildingTypeOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching building types:", error);
    }
  };

  useEffect(() => {
    const fetchConstructionStatuses = async () => {
      try {
        const response = await axios.get(
          `${baseURL}construction_statuses.json`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const options = response.data
          .filter((status) => status.active)
          .map((status) => ({
            label: status.construction_status,
            value: status.construction_status,
            name: status.Project_Construction_Status_Name,
          }));
        setStatusOptions(options);
      } catch (error) {
        console.error("Error fetching construction statuses:", error);
      }
    };
    fetchConstructionStatuses();
  }, [baseURL, accessToken]);

  // Fetch image configurations for dynamic tooltips
  useEffect(() => {
    const fetchImageConfigurations = async () => {
      try {
        const configNames = [
          "ProjectImage",
          "ProjectCoverImage",
          "ProjectGallery",
          "Project2DImage"
        ];
        
        const configs = {};
        
        for (const name of configNames) {
          const response = await axios.get(
            `${baseURL}system_constants.json?q[description_eq]=ImagesConfiguration&q[name_eq]=${name}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (response.data && Array.isArray(response.data)) {
            configs[name] = response.data.map(item => item.value);
          }
        }
        
        setImageConfigurations(configs);
      } catch (error) {
        console.error("Error fetching image configurations:", error);
      }
    };
    
    fetchImageConfigurations();
  }, [baseURL, accessToken]);

  // Helper function to format ratio from value like "image_16_by_9" to "16:9"
  const formatRatio = (value) => {
    if (!value) return "";
    const match = value.match(/(\d+)_by_(\d+)/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return value;
  };

  // Get dynamic ratios text for tooltips
  const getDynamicRatiosText = (configName) => {
    const ratios = imageConfigurations[configName];
    if (!ratios || ratios.length === 0) return "No ratios configured";
    
    const formattedRatios = ratios.map(formatRatio).join(", ");
    return `Required ratio${ratios.length > 1 ? 's' : ''}: ${formattedRatios}`;
  };

  const handleToggle = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }
    try {
      await axios.put(
        `${baseURL}projects/${id}.json`,
        { project: { published: updatedStatus } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: updatedStatus } : item
        )
      );
      const newToastId = toast.success("Status updated successfully!", {
        duration: 3000,
        position: "top-center",
        id: `toggle-${id}`,
      });
      setActiveToastId(newToastId);
    } catch (error) {
      console.error("Error updating status:", error);
      const newToastId = toast.error("Failed to update status.", {
        duration: 3000,
        position: "top-center",
        id: `toggle-error-${id}`,
      });
      setActiveToastId(newToastId);
    }
  };

  const handlePlanDelete = async (planId, index) => {
    if (!planId) {
      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan removed successfully!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}plans/${planId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan and all images deleted successfully!");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  const validateForm = (formData) => {
    // Clear previous toasts
    toast.dismiss();

    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }

    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (!validateForm(formData)) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const gallery_images = [
      "gallery_image_16_by_9",
      "gallery_image_1_by_1",
      "gallery_image_9_by_16",
      "gallery_image_3_by_2",
    ];

    const isValidImage = (img) =>
      img?.file instanceof File || !!img?.id || !!img?.document_file_name;

    // Combine all valid images from all gallery fields
    let totalValidGalleryImages = 0;

    for (const key of gallery_images) {
      const images = Array.isArray(formData[key])
        ? formData[key].filter(isValidImage)
        : [];
      totalValidGalleryImages += images.length;
    }

    if (totalValidGalleryImages > 0 && totalValidGalleryImages % 3 !== 0) {
      const remainder = totalValidGalleryImages % 3;
      const imagesNeeded = 3 - remainder;
      const previousValidCount = totalValidGalleryImages - remainder;

      const message = `Currently in Gallery ${totalValidGalleryImages} image${
        totalValidGalleryImages !== 1 ? "s" : ""
      } uploaded. Please upload ${imagesNeeded} more or remove ${remainder} to make it a multiple of 3.`;

      toast.error(message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }


    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {

      if (key === "plans" && Array.isArray(value)) {
        value.forEach((plan, index) => {
          data.append(`project[plans][${index}][name]`, plan.name);
          if (Array.isArray(plan.images)) {
            plan.images.forEach((img) => {
              data.append(`project[plans][${index}][images][]`, img);
            });
          }
        });
      } else if (key === "Address") {
        for (const addressKey in value) {
          data.append(`project[Address][${addressKey}]`, value[addressKey]);
        }
      } else if (key === "brochure" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectBrochure][]", file);
          }
        });
      } else if (key === "project_emailer_templetes" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectEmailerTempletes][]", file);
          }
        });
      } else if (key === "KnwYrApt_Technical" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[KnwYrApt_Technical][]", file);
          }
        });
      } else if (key === "two_d_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[Project2DImage][]", file));
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreatives][]", file)
        );
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[cover_images][]", file));
      } else if (key === "project_creative_generics" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeGenerics][]", file)
        );
      } else if (key === "project_creative_offers" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeOffers][]", file)
        );
      } else if (key === "project_interiors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectInteriors][]", file)
        );
      } else if (key === "project_exteriors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectExteriors][]", file)
        );
      } else if (key === "project_layout" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectLayout][]", file));
      } else if (key === "videos" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectVideo][]", file));
      } else if (key === "gallery_image" && Array.isArray(value)) {
        value.forEach((fileObj, index) => {
          if (fileObj.gallery_image instanceof File) {
            data.append("project[gallery_image][]", fileObj.gallery_image);
            data.append(
              `project[gallery_image_file_name][${index}]`,
              fileObj.gallery_image_file_name
            );
            data.append(
              `project[gallery_type]`,
              fileObj.gallery_image_file_type
            );
            data.append(
              `project[gallery_image_is_day][${index}]`,
              fileObj.isDay
            );
          }
        });
      } else if (key === "image" && mainImageUpload[0]?.file instanceof File) {
        data.append("project[image]", mainImageUpload[0]?.file);
      } else if (key === "video_preview_image_url" && value instanceof File) {
        data.append("project[video_preview_image_url]", value);
      }
      else if (key === "project_qrcode_image" && Array.isArray(value)) {
        value.forEach((fileObj) => {
          if (fileObj.project_qrcode_image instanceof File) {
            data.append(
              "project[project_qrcode_image][]",
              fileObj.project_qrcode_image
            );
            data.append(
              "project[project_qrcode_image_titles][]",
              fileObj.title || ""
            );
          }
        });
      } else if (key === "virtual_tour_url_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.virtual_tour_url && item.virtual_tour_name) {
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_url]`,
              item.virtual_tour_url
            );
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_name]`,
              item.virtual_tour_name
            );
          }
        });
      } else if (key === "Rera_Number_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.tower_name && item.rera_number) {
            data.append(
              `project[Rera_Number_multiple][${index}][tower_name]`,
              item.tower_name
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_number]`,
              item.rera_number
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_url]`,
              item.rera_url
            );
          }
        });
      } else if (key === "project_ppt" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectPPT]", file);
          }
        });
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[project_creatives][]", file);
            data.append(`project[project_creatives_types][]`, type);
          }
        });
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[cover_images][]", file);
            data.append(`project[cover_images_types][]`, type);
          }
        });
      } else if (key === "project_sales_type" && Array.isArray(value)) {
        data.append("project[project_sales_type][]", value);
      } else if (key.startsWith("image") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField = key.replace("image", "project[image") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("cover_images_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("cover_images_", "project[cover_images_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("gallery_image_") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            // Send as array without indices
            data.append(`project[${key}][][file]`, img.file);
            data.append(`project[${key}][][file_name]`, img.file_name || img.file.name);
          }
        });
      } else if (key.startsWith("floor_plans_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("floor_plans_", "project[floor_plans_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("project_2d_image") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            const backendField =
              key.replace("project_2d_image", "project[project_2d_image") +
              "][]";
            data.append(backendField, img.file);
          }
        });
      } else {
        data.append(`project[${key}]`, value);
      }
    });

    try {
      const response = await axios.post(`${baseURL}projects.json`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("data to be sent:", Array.from(data.entries()));
      toast.success("Project submitted successfully");
      sessionStorage.removeItem("cached_projects");
      Navigate("/project-list");
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data &&
        (error.response.data.project_name || error.response.data.Project_Name)
      ) {
        toast.error("Project name already exists.");
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}get_property_types.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setprojectsType(response.data?.property_types);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const url = `${baseURL}configuration_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setConfigurations(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigurations();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchSpecifications = async () => {
      const url = `${baseURL}specification_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data && response.data.specification_setups) {
          setSpecifications(response.data.specification_setups);
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };
    fetchSpecifications();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}amenity_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setAmenities(response.data?.amenities_setups);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}category_types.json`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          const formattedCategories = response.data.map((item) => ({
            value: item.category_type,
            label: item.category_type,
          }));
          setCategoryTypes(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };
    fetchCategoryTypes();
  }, [baseURL, accessToken]);

  const handleCancel = () => {
    setFormData({
      Property_Type: "",
      SFDC_Project_Id: "",
      Project_Construction_Status: "",
      Configuration_Type: [],
      Project_Name: "",
      project_address: "",
      Project_Description: "",
      Price_Onward: "",
      Project_Size_Sq_Mtr: "",
      Project_Size_Sq_Ft: "",
      development_area_sqft: "",
      development_area_sqmt: "",
      Rera_Carpet_Area_Sq_M: "",
      Rera_Carpet_Area_sqft: "",
      Number_Of_Towers: "",
      Number_Of_Units: "",
      no_of_floors: "",
      Rera_Number_multiple: [],
      Amenities: [],
      Specifications: [],
      Land_Area: "",
      land_uom: "",
      project_tag: "",
      virtual_tour_url_multiple: [],
      map_url: "",
      image: [],
      Address: {
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pin_code: "",
        country: "",
      },
      brochure: [],
      two_d_images: [],
      videos: [],
      gallery_image: [],
    });
    Navigate(-1);
  };

  const handleTowerChange = (e) => {
    setTowerName(e.target.value);
  };

  const handleDayNightChange = (index, isDay) => {
    setFormData((prev) => {
      const updatedGallery = [...prev.gallery_image];
      updatedGallery[index].isDay = isDay;
      return { ...prev, gallery_image: updatedGallery };
    });
  };

  const handleReraNumberChange = (e) => {
    const { value } = e.target;
    if (/^[a-zA-Z0-9]{0,12}$/.test(value)) {
      setReraNumber(value);
    }
  };

  const handleReraUrlChange = (e) => {
    setReraUrl(e.target.value);
  };

  const handleReraNumberBlur = () => {
    if (reraNumber.length !== 12) {
      toast.error("RERA Number must be exactly 12 alphanumeric characters!", {
        position: "top-right",
        autoClose: 3000,
      });
      setReraNumber("");
    }
  };

  const handleAddRera = () => {
    toast.dismiss();
    if (!towerName.trim() || !reraNumber.trim()) {
      toast.error("Both Tower and RERA Number are required.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: [
        ...prev.Rera_Number_multiple,
        {
          tower_name: towerName,
          rera_number: reraNumber,
          rera_url: reraUrl,
        },
      ],
    }));
    setTowerName("");
    setReraNumber("");
    setReraUrl("");
  };

  const handleDeleteRera = (index) => {
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: prev.Rera_Number_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleVirtualTourChange = (e) => {
    setVirtualTourUrl(e.target.value);
  };

  const handleVirtualTourNameChange = (e) => {
    setVirtualTourName(e.target.value);
  };

  const handleAddVirtualTour = () => {
    toast.dismiss();
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: [
        ...prev.virtual_tour_url_multiple,
        {
          virtual_tour_url: virtualTourUrl,
          virtual_tour_name: virtualTourName,
        },
      ],
    }));
    setVirtualTourUrl("");
    setVirtualTourName("");
  };

  const handleDeleteVirtualTour = (index) => {
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: prev.virtual_tour_url_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      let isValid = false;
      let maxSize = 0;
      let fileTypeDescription = "";

      if (allowedImageTypes.includes(file.type)) {
        maxSize = MAX_IMAGE_SIZE;
        fileTypeDescription = "image";
        isValid = true;
      } else if (allowedVideoTypes.includes(file.type)) {
        maxSize = MAX_VIDEO_SIZE;
        fileTypeDescription = "video";
        isValid = true;
      } else {
        toast.error(
          `Invalid file type: ${file.name}. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, QuickTime, AVI) are allowed.`
        );
        invalidFiles.push(file);
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image size must be less than 3MB.");
        invalidFiles.push(file);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const updatedImages = validFiles.map((file) => ({
        gallery_image: file,
        gallery_image_file_name: file.name,
        gallery_image_file_type: selectedCategory,
        isDay: true,
      }));
      setFormData((prev) => ({
        ...prev,
        gallery_image: [...(prev.gallery_image || []), ...updatedImages],
      }));
      toast.success(`${validFiles.length} file(s) uploaded successfully.`);
    }
    event.target.value = "";
  };

  const handleDiscardGallery = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery_image: prev.gallery_image.filter((_, i) => i !== index),
    }));
  };

  const handleDiscardPpt = (key, index) => {
    setFormData((prev) => {
      if (!prev[key] || !Array.isArray(prev[key])) return prev;
      const updatedFiles = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: updatedFiles };
    });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}property_types.json`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const options = response.data
          .filter((item) => item.active)
          .map((type) => ({
            value: type.property_type,
            label: type.property_type,
            id: type.id,
          }));
        setPropertyTypeOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
      });
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      const url = `${baseURL}building_types.json?q[property_type_id_eq]=${formData.Property_Type}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBuildingTypeOptions(response.data);
      } catch (error) {
        console.error("Error fetching building types:", error);
      }
    };
  }, [formData.Property_Type, baseURL, accessToken]);

  const [buildingTypeOptions, setBuildingTypeOptions] = useState([]);

  const handlePropertyTypeChange = async (selectedOption) => {
    const { value, id } = selectedOption;
    setFormData((prev) => ({
      ...prev,
      Property_Type: value,
      Property_type_id: id,
      building_type: "",
    }));
    try {
      const response = await axios.get(
        `${baseURL}building_types.json?q[property_type_id_eq]=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const buildingTypes = response.data || [];
      const formattedOptions = buildingTypes.map((item) => ({
        value: item.building_type,
        label: item.building_type,
        id: item.id,
      }));
      setBuildingTypeOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching building types:", error);
    }
  };

  useEffect(() => {
    const fetchConstructionStatuses = async () => {
      try {
        const response = await axios.get(
          `${baseURL}construction_statuses.json`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const options = response.data
          .filter((status) => status.active)
          .map((status) => ({
            label: status.construction_status,
            value: status.construction_status,
            name: status.Project_Construction_Status_Name,
          }));
        setStatusOptions(options);
      } catch (error) {
        console.error("Error fetching construction statuses:", error);
      }
    };
    fetchConstructionStatuses();
  }, [baseURL, accessToken]);

  // Fetch image configurations for dynamic tooltips
  useEffect(() => {
    const fetchImageConfigurations = async () => {
      try {
        const configNames = [
          "ProjectImage",
          "ProjectCoverImage",
          "ProjectGallery",
          "Project2DImage"
        ];
        
        const configs = {};
        
        for (const name of configNames) {
          const response = await axios.get(
            `${baseURL}system_constants.json?q[description_eq]=ImagesConfiguration&q[name_eq]=${name}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (response.data && Array.isArray(response.data)) {
            configs[name] = response.data.map(item => item.value);
          }
        }
        
        setImageConfigurations(configs);
      } catch (error) {
        console.error("Error fetching image configurations:", error);
      }
    };
    
    fetchImageConfigurations();
  }, [baseURL, accessToken]);

  // Helper function to format ratio from value like "image_16_by_9" to "16:9"
  const formatRatio = (value) => {
    if (!value) return "";
    const match = value.match(/(\d+)_by_(\d+)/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return value;
  };

  // Get dynamic ratios text for tooltips
  const getDynamicRatiosText = (configName) => {
    const ratios = imageConfigurations[configName];
    if (!ratios || ratios.length === 0) return "No ratios configured";
    
    const formattedRatios = ratios.map(formatRatio).join(", ");
    return `Required ratio${ratios.length > 1 ? 's' : ''}: ${formattedRatios}`;
  };

  const handleToggle = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }
    try {
      await axios.put(
        `${baseURL}projects/${id}.json`,
        { project: { published: updatedStatus } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: updatedStatus } : item
        )
      );
      const newToastId = toast.success("Status updated successfully!", {
        duration: 3000,
        position: "top-center",
        id: `toggle-${id}`,
      });
      setActiveToastId(newToastId);
    } catch (error) {
      console.error("Error updating status:", error);
      const newToastId = toast.error("Failed to update status.", {
        duration: 3000,
        position: "top-center",
        id: `toggle-error-${id}`,
      });
      setActiveToastId(newToastId);
    }
  };

  const handlePlanDelete = async (planId, index) => {
    if (!planId) {
      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan removed successfully!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}plans/${planId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan and all images deleted successfully!");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  const validateForm = (formData) => {
    // Clear previous toasts
    toast.dismiss();

    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }

    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (!validateForm(formData)) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const gallery_images = [
      "gallery_image_16_by_9",
      "gallery_image_1_by_1",
      "gallery_image_9_by_16",
      "gallery_image_3_by_2",
    ];

    const isValidImage = (img) =>
      img?.file instanceof File || !!img?.id || !!img?.document_file_name;

    // Combine all valid images from all gallery fields
    let totalValidGalleryImages = 0;

    for (const key of gallery_images) {
      const images = Array.isArray(formData[key])
        ? formData[key].filter(isValidImage)
        : [];
      totalValidGalleryImages += images.length;
    }

    if (totalValidGalleryImages > 0 && totalValidGalleryImages % 3 !== 0) {
      const remainder = totalValidGalleryImages % 3;
      const imagesNeeded = 3 - remainder;
      const previousValidCount = totalValidGalleryImages - remainder;

      const message = `Currently in Gallery ${totalValidGalleryImages} image${
        totalValidGalleryImages !== 1 ? "s" : ""
      } uploaded. Please upload ${imagesNeeded} more or remove ${remainder} to make it a multiple of 3.`;

      toast.error(message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }


    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {

      if (key === "plans" && Array.isArray(value)) {
        value.forEach((plan, index) => {
          data.append(`project[plans][${index}][name]`, plan.name);
          if (Array.isArray(plan.images)) {
            plan.images.forEach((img) => {
              data.append(`project[plans][${index}][images][]`, img);
            });
          }
        });
      } else if (key === "Address") {
        for (const addressKey in value) {
          data.append(`project[Address][${addressKey}]`, value[addressKey]);
        }
      } else if (key === "brochure" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectBrochure][]", file);
          }
        });
      } else if (key === "project_emailer_templetes" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectEmailerTempletes][]", file);
          }
        });
      } else if (key === "KnwYrApt_Technical" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[KnwYrApt_Technical][]", file);
          }
        });
      } else if (key === "two_d_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[Project2DImage][]", file));
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreatives][]", file)
        );
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[cover_images][]", file));
      } else if (key === "project_creative_generics" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeGenerics][]", file)
        );
      } else if (key === "project_creative_offers" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeOffers][]", file)
        );
      } else if (key === "project_interiors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectInteriors][]", file)
        );
      } else if (key === "project_exteriors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectExteriors][]", file)
        );
      } else if (key === "project_layout" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectLayout][]", file));
      } else if (key === "videos" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectVideo][]", file));
      } else if (key === "gallery_image" && Array.isArray(value)) {
        value.forEach((fileObj, index) => {
          if (fileObj.gallery_image instanceof File) {
            data.append("project[gallery_image][]", fileObj.gallery_image);
            data.append(
              `project[gallery_image_file_name][${index}]`,
              fileObj.gallery_image_file_name
            );
            data.append(
              `project[gallery_type]`,
              fileObj.gallery_image_file_type
            );
            data.append(
              `project[gallery_image_is_day][${index}]`,
              fileObj.isDay
            );
          }
        });
      } else if (key === "image" && mainImageUpload[0]?.file instanceof File) {
        data.append("project[image]", mainImageUpload[0]?.file);
      } else if (key === "video_preview_image_url" && value instanceof File) {
        data.append("project[video_preview_image_url]", value);
      }
      else if (key === "project_qrcode_image" && Array.isArray(value)) {
        value.forEach((fileObj) => {
          if (fileObj.project_qrcode_image instanceof File) {
            data.append(
              "project[project_qrcode_image][]",
              fileObj.project_qrcode_image
            );
            data.append(
              "project[project_qrcode_image_titles][]",
              fileObj.title || ""
            );
          }
        });
      } else if (key === "virtual_tour_url_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.virtual_tour_url && item.virtual_tour_name) {
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_url]`,
              item.virtual_tour_url
            );
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_name]`,
              item.virtual_tour_name
            );
          }
        });
      } else if (key === "Rera_Number_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.tower_name && item.rera_number) {
            data.append(
              `project[Rera_Number_multiple][${index}][tower_name]`,
              item.tower_name
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_number]`,
              item.rera_number
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_url]`,
              item.rera_url
            );
          }
        });
      } else if (key === "project_ppt" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectPPT]", file);
          }
        });
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[project_creatives][]", file);
            data.append(`project[project_creatives_types][]`, type);
          }
        });
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[cover_images][]", file);
            data.append(`project[cover_images_types][]`, type);
          }
        });
      } else if (key === "project_sales_type" && Array.isArray(value)) {
        data.append("project[project_sales_type][]", value);
      } else if (key.startsWith("image") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField = key.replace("image", "project[image") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("cover_images_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("cover_images_", "project[cover_images_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("gallery_image_") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            // Send as array without indices
            data.append(`project[${key}][][file]`, img.file);
            data.append(`project[${key}][][file_name]`, img.file_name || img.file.name);
          }
        });
      } else if (key.startsWith("floor_plans_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("floor_plans_", "project[floor_plans_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("project_2d_image") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            const backendField =
              key.replace("project_2d_image", "project[project_2d_image") +
              "][]";
            data.append(backendField, img.file);
          }
        });
      } else {
        data.append(`project[${key}]`, value);
      }
    });

    try {
      const response = await axios.post(`${baseURL}projects.json`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("data to be sent:", Array.from(data.entries()));
      toast.success("Project submitted successfully");
      sessionStorage.removeItem("cached_projects");
      Navigate("/project-list");
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data &&
        (error.response.data.project_name || error.response.data.Project_Name)
      ) {
        toast.error("Project name already exists.");
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}get_property_types.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setprojectsType(response.data?.property_types);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const url = `${baseURL}configuration_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setConfigurations(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigurations();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchSpecifications = async () => {
      const url = `${baseURL}specification_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data && response.data.specification_setups) {
          setSpecifications(response.data.specification_setups);
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };
    fetchSpecifications();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchProjects = async () => {
      const url = `${baseURL}amenity_setups.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setAmenities(response.data?.amenities_setups);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}category_types.json`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          const formattedCategories = response.data.map((item) => ({
            value: item.category_type,
            label: item.category_type,
          }));
          setCategoryTypes(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };
    fetchCategoryTypes();
  }, [baseURL, accessToken]);

  const handleCancel = () => {
    setFormData({
      Property_Type: "",
      SFDC_Project_Id: "",
      Project_Construction_Status: "",
      Configuration_Type: [],
      Project_Name: "",
      project_address: "",
      Project_Description: "",
      Price_Onward: "",
      Project_Size_Sq_Mtr: "",
      Project_Size_Sq_Ft: "",
      development_area_sqft: "",
      development_area_sqmt: "",
      Rera_Carpet_Area_Sq_M: "",
      Rera_Carpet_Area_sqft: "",
      Number_Of_Towers: "",
      Number_Of_Units: "",
      no_of_floors: "",
      Rera_Number_multiple: [],
      Amenities: [],
      Specifications: [],
      Land_Area: "",
      land_uom: "",
      project_tag: "",
      virtual_tour_url_multiple: [],
      map_url: "",
      image: [],
      Address: {
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pin_code: "",
        country: "",
      },
      brochure: [],
      two_d_images: [],
      videos: [],
      gallery_image: [],
    });
    Navigate(-1);
  };

  const handleTowerChange = (e) => {
    setTowerName(e.target.value);
  };

  const handleDayNightChange = (index, isDay) => {
    setFormData((prev) => {
      const updatedGallery = [...prev.gallery_image];
      updatedGallery[index].isDay = isDay;
      return { ...prev, gallery_image: updatedGallery };
    });
  };

  const handleReraNumberChange = (e) => {
    const { value } = e.target;
    if (/^[a-zA-Z0-9]{0,12}$/.test(value)) {
      setReraNumber(value);
    }
  };

  const handleReraUrlChange = (e) => {
    setReraUrl(e.target.value);
  };

  const handleReraNumberBlur = () => {
    if (reraNumber.length !== 12) {
      toast.error("RERA Number must be exactly 12 alphanumeric characters!", {
        position: "top-right",
        autoClose: 3000,
      });
      setReraNumber("");
    }
  };

  const handleAddRera = () => {
    toast.dismiss();
    if (!towerName.trim() || !reraNumber.trim()) {
      toast.error("Both Tower and RERA Number are required.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: [
        ...prev.Rera_Number_multiple,
        {
          tower_name: towerName,
          rera_number: reraNumber,
          rera_url: reraUrl,
        },
      ],
    }));
    setTowerName("");
    setReraNumber("");
    setReraUrl("");
  };

  const handleDeleteRera = (index) => {
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: prev.Rera_Number_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleVirtualTourChange = (e) => {
    setVirtualTourUrl(e.target.value);
  };

  const handleVirtualTourNameChange = (e) => {
    setVirtualTourName(e.target.value);
  };

  const handleAddVirtualTour = () => {
    toast.dismiss();
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: [
        ...prev.virtual_tour_url_multiple,
        {
          virtual_tour_url: virtualTourUrl,
          virtual_tour_name: virtualTourName,
        },
      ],
    }));
    setVirtualTourUrl("");
    setVirtualTourName("");
  };

  const handleDeleteVirtualTour = (index) => {
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: prev.virtual_tour_url_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      let isValid = false;
      let maxSize = 0;
      let fileTypeDescription = "";

      if (allowedImageTypes.includes(file.type)) {
        maxSize = MAX_IMAGE_SIZE;
        fileTypeDescription = "image";
        isValid = true;
      } else if (allowedVideoTypes.includes(file.type)) {
        maxSize = MAX_VIDEO_SIZE;
        fileTypeDescription = "video";
        isValid = true;
      } else {
        toast.error(
          `Invalid file type: ${file.name}. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, QuickTime, AVI) are allowed.`
        );
        invalidFiles.push(file);
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image size must be less than 3MB.");
        invalidFiles.push(file);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const updatedImages = validFiles.map((file) => ({
        gallery_image: file,
        gallery_image_file_name: file.name,
        gallery_image_file_type: selectedCategory,
        isDay: true,
      }));
      setFormData((prev) => ({
        ...prev,
        gallery_image: [...(prev.gallery_image || []), ...updatedImages],
      }));
      toast.success(`${validFiles.length} file(s) uploaded successfully.`);
    }
    event.target.value = "";
  };

  const handleDiscardGallery = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery_image: prev.gallery_image.filter((_, i) => i !== index),
    }));
  };

  const handleDiscardPpt = (key, index) => {
    setFormData((prev) => {
      if (!prev[key] || !Array.isArray(prev[key])) return prev;
      const updatedFiles = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: updatedFiles };
    });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}property_types.json`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const options = response.data
          .filter((item) => item.active)
          .map((type) => ({
            value: type.property_type,
            label: type.property_type,
            id: type.id,
          }));
        setPropertyTypeOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
      });
  }, [baseURL, accessToken]);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      const url = `${baseURL}building_types.json?q[property_type_id_eq]=${formData.Property_Type}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBuildingTypeOptions(response.data);
      } catch (error) {
        console.error("Error fetching building types:", error);
      }
    };
  }, [formData.Property_Type, baseURL, accessToken]);

  const [buildingTypeOptions, setBuildingTypeOptions] = useState([]);

  const handlePropertyTypeChange = async (selectedOption) => {
    const { value, id } = selectedOption;
    setFormData((prev) => ({
      ...prev,
      Property_Type: value,
      Property_type_id: id,
      building_type: "",
    }));
    try {
      const response = await axios.get(
        `${baseURL}building_types.json?q[property_type_id_eq]=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const buildingTypes = response.data || [];
      const formattedOptions = buildingTypes.map((item) => ({
        value: item.building_type,
        label: item.building_type,
        id: item.id,
      }));
      setBuildingTypeOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching building types:", error);
    }
  };

  useEffect(() => {
    const fetchConstructionStatuses = async () => {
      try {
        const response = await axios.get(
          `${baseURL}construction_statuses.json`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const options = response.data
          .filter((status) => status.active)
          .map((status) => ({
            label: status.construction_status,
            value: status.construction_status,
            name: status.Project_Construction_Status_Name,
          }));
        setStatusOptions(options);
      } catch (error) {
        console.error("Error fetching construction statuses:", error);
      }
    };
    fetchConstructionStatuses();
  }, [baseURL, accessToken]);

  // Fetch image configurations for dynamic tooltips
  useEffect(() => {
    const fetchImageConfigurations = async () => {
      try {
        const configNames = [
          "ProjectImage",
          "ProjectCoverImage",
          "ProjectGallery",
          "Project2DImage"
        ];
        
        const configs = {};
        
        for (const name of configNames) {
          const response = await axios.get(
            `${baseURL}system_constants.json?q[description_eq]=ImagesConfiguration&q[name_eq]=${name}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (response.data && Array.isArray(response.data)) {
            configs[name] = response.data.map(item => item.value);
          }
        }
        
        setImageConfigurations(configs);
      } catch (error) {
        console.error("Error fetching image configurations:", error);
      }
    };
    
    fetchImageConfigurations();
  }, [baseURL, accessToken]);

  // Helper function to format ratio from value like "image_16_by_9" to "16:9"
  const formatRatio = (value) => {
    if (!value) return "";
    const match = value.match(/(\d+)_by_(\d+)/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    return value;
  };

  // Get dynamic ratios text for tooltips
  const getDynamicRatiosText = (configName) => {
    const ratios = imageConfigurations[configName];
    if (!ratios || ratios.length === 0) return "No ratios configured";
    
    const formattedRatios = ratios.map(formatRatio).join(", ");
    return `Required ratio${ratios.length > 1 ? 's' : ''}: ${formattedRatios}`;
  };

  const handleToggle = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }
    try {
      await axios.put(
        `${baseURL}projects/${id}.json`,
        { project: { published: updatedStatus } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: updatedStatus } : item
        )
      );
      const newToastId = toast.success("Status updated successfully!", {
        duration: 3000,
        position: "top-center",
        id: `toggle-${id}`,
      });
      setActiveToastId(newToastId);
    } catch (error) {
      console.error("Error updating status:", error);
      const newToastId = toast.error("Failed to update status.", {
        duration: 3000,
        position: "top-center",
        id: `toggle-error-${id}`,
      });
      setActiveToastId(newToastId);
    }
  };

  const handlePlanDelete = async (planId, index) => {
    if (!planId) {
      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan removed successfully!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}plans/${planId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      setPlans(plans.filter((_, idx) => idx !== index));
      toast.success("Plan and all images deleted successfully!");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  const validateForm = (formData) => {
    // Clear previous toasts
    toast.dismiss();

    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }

    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (!validateForm(formData)) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const gallery_images = [
      "gallery_image_16_by_9",
      "gallery_image_1_by_1",
      "gallery_image_9_by_16",
      "gallery_image_3_by_2",
    ];

    const isValidImage = (img) =>
      img?.file instanceof File || !!img?.id || !!img?.document_file_name;

    // Combine all valid images from all gallery fields
    let totalValidGalleryImages = 0;

    for (const key of gallery_images) {
      const images = Array.isArray(formData[key])
        ? formData[key].filter(isValidImage)
        : [];
      totalValidGalleryImages += images.length;
    }

    if (totalValidGalleryImages > 0 && totalValidGalleryImages % 3 !== 0) {
      const remainder = totalValidGalleryImages % 3;
      const imagesNeeded = 3 - remainder;
      const previousValidCount = totalValidGalleryImages - remainder;

      const message = `Currently in Gallery ${totalValidGalleryImages} image${
        totalValidGalleryImages !== 1 ? "s" : ""
      } uploaded. Please upload ${imagesNeeded} more or remove ${remainder} to make it a multiple of 3.`;

      toast.error(message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }


    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {

      if (key === "plans" && Array.isArray(value)) {
        value.forEach((plan, index) => {
          data.append(`project[plans][${index}][name]`, plan.name);
          if (Array.isArray(plan.images)) {
            plan.images.forEach((img) => {
              data.append(`project[plans][${index}][images][]`, img);
            });
          }
        });
      } else if (key === "Address") {
        for (const addressKey in value) {
          data.append(`project[Address][${addressKey}]`, value[addressKey]);
        }
      } else if (key === "brochure" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectBrochure][]", file);
          }
        });
      } else if (key === "project_emailer_templetes" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectEmailerTempletes][]", file);
          }
        });
      } else if (key === "KnwYrApt_Technical" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[KnwYrApt_Technical][]", file);
          }
        });
      } else if (key === "two_d_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[Project2DImage][]", file));
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreatives][]", file)
        );
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[cover_images][]", file));
      } else if (key === "project_creative_generics" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeGenerics][]", file)
        );
      } else if (key === "project_creative_offers" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectCreativeOffers][]", file)
        );
      } else if (key === "project_interiors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectInteriors][]", file)
        );
      } else if (key === "project_exteriors" && Array.isArray(value)) {
        value.forEach((file) =>
          data.append("project[ProjectExteriors][]", file)
        );
      } else if (key === "project_layout" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectLayout][]", file));
      } else if (key === "videos" && Array.isArray(value)) {
        value.forEach((file) => data.append("project[ProjectVideo][]", file));
      } else if (key === "gallery_image" && Array.isArray(value)) {
        value.forEach((fileObj, index) => {
          if (fileObj.gallery_image instanceof File) {
            data.append("project[gallery_image][]", fileObj.gallery_image);
            data.append(
              `project[gallery_image_file_name][${index}]`,
              fileObj.gallery_image_file_name
            );
            data.append(
              `project[gallery_type]`,
              fileObj.gallery_image_file_type
            );
            data.append(
              `project[gallery_image_is_day][${index}]`,
              fileObj.isDay
            );
          }
        });
      } else if (key === "image" && mainImageUpload[0]?.file instanceof File) {
        data.append("project[image]", mainImageUpload[0]?.file);
      } else if (key === "video_preview_image_url" && value instanceof File) {
        data.append("project[video_preview_image_url]", value);
      }
      else if (key === "project_qrcode_image" && Array.isArray(value)) {
        value.forEach((fileObj) => {
          if (fileObj.project_qrcode_image instanceof File) {
            data.append(
              "project[project_qrcode_image][]",
              fileObj.project_qrcode_image
            );
            data.append(
              "project[project_qrcode_image_titles][]",
              fileObj.title || ""
            );
          }
        });
      } else if (key === "virtual_tour_url_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.virtual_tour_url && item.virtual_tour_name) {
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_url]`,
              item.virtual_tour_url
            );
            data.append(
              `project[virtual_tour_url_multiple][${index}][virtual_tour_name]`,
              item.virtual_tour_name
            );
          }
        });
      } else if (key === "Rera_Number_multiple" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item.tower_name && item.rera_number) {
            data.append(
              `project[Rera_Number_multiple][${index}][tower_name]`,
              item.tower_name
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_number]`,
              item.rera_number
            );
            data.append(
              `project[Rera_Number_multiple][${index}][rera_url]`,
              item.rera_url
            );
          }
        });
      } else if (key === "project_ppt" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            data.append("project[ProjectPPT]", file);
          }
        });
      } else if (key === "project_creatives" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[project_creatives][]", file);
            data.append(`project[project_creatives_types][]`, type);
          }
        });
      } else if (key === "cover_images" && Array.isArray(value)) {
        value.forEach(({ file, type }) => {
          if (file instanceof File) {
            data.append("project[cover_images][]", file);
            data.append(`project[cover_images_types][]`, type);
          }
        });
      } else if (key === "project_sales_type" && Array.isArray(value)) {
        data.append("project[project_sales_type][]", value);
      } else if (key.startsWith("image") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField = key.replace("image", "project[image") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("cover_images_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("cover_images_", "project[cover_images_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key.startsWith("gallery_image_") && Array.isArray(value)) {
        value.forEach((img) => {
          if (img.file instanceof File) {
            // Send as array without indices
            data.append(`project[${key}][][file]`, img.file);
            data.append(`project[${key}][][file_name]`, img.file_name || img.file.name);
          }
        });
      } else if (key.startsWith("floor_plans_") && Array.isArray(value)) {
        value.forEach((