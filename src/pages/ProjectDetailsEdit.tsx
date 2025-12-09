import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

import "../mor.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import MultiSelectBox from "../components/ui/multi-selector";
import { API_CONFIG } from "@/config/apiConfig";

import PropertySelect from "../components/base/PropertySelect";
import { ImageUploadingButton } from "../components/reusable/ImageUploadingButton";
import { ImageCropper } from "../components/reusable/ImageCropper";
import ProjectBannerUpload from "../components/reusable/ProjectBannerUpload";
import ProjectImageVideoUpload from "../components/reusable/ProjectImageVideoUpload";

const ProjectDetailsEdit = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Property_Type: "",
    Property_type_id: "",
    building_type: "",
    SFDC_Project_Id: "",
    Project_Construction_Status: "",
    Configuration_Type1: [],
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
    Amenities1: [],
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
    fetched_gallery_image: [],
    project_ppt: [],
    fetched_Project_PPT: [],
    project_creatives: [],
    plans: [],
    project_creative_generics: [],
    project_creative_offers: [],
    project_interiors: [],
    project_exteriors: [],
    project_emailer_templetes: [],
    KnwYrApt_Technical: [],
    project_layout: [],
    project_sales_type: "",
    video_preview_image_url: "",
    document_url: "",
    order_no: "",
    enable_enquiry: false,
    rera_url: "",
    disclaimer: "",
    project_qrcode_image: [],
    cover_images: [],
    is_sold: false,
    bannerPreviewImage: "",
    coverPreviewImage: "",
  });

  const [projectsType, setProjectsType] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [towerName, setTowerName] = useState("");
  const [reraNumber, setReraNumber] = useState("");
  const [reraUrl, setReraUrl] = useState("");
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [virtualTourName, setVirtualTourName] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  // const [filteredAmenities, setFilteredAmenities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [projectCreatives, setProjectCreatives] = useState([]);
  const [plan, setPlan] = useState([]);
  const [coverImages, setCoverImages] = useState([]);

  const [categoryTypes, setCategoryTypes] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const [nameSend, setNameSend] = useState([]);
  const [nameSends, setNameSends] = useState([]);
  const [planName, setPlanName] = useState("");
  const [planImages, setPlanImages] = useState([]);
  const [plans, setPlans] = useState([]);
  const [mainImageUpload, setMainImageUpload] = useState([]);
  const [coverImageUpload, setCoverImageUpload] = useState([]);
  const [galleryImageUpload, setGalleryImageUpload] = useState([]);
  const [floorPlanImageUpload, setFloorPlanImageUpload] = useState([]);
  const [pendingImageUpload, setPendingImageUpload] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  });

  const projectUploadConfig = {
    image: ["9:16", "16:9", "1:1", "3:2"],
    "cover images": ["1:1", "9:16", "16:9", "3:2"],
    "gallery image": ["16:9", "1:1", "9:16", "3:2"],
    "project 2d image": ["16:9", "1:1", "3:2", "9:16"],
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
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ...files],
    }));
  };

  const handleCroppedCoverImages = (
    validImages,
    videoFiles = [],
    type = "cover"
  ) => {
    // Handle video files first
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach((video) => {
        const formattedRatio = video.ratio.replace(":", "_by_");
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
        updateFormData(key, [video]);

        // Set preview for the first video if it's cover type
        if (type === "cover" && videoFiles[0] === video) {
          setCoverPreviewImage(URL.createObjectURL(video.file));
        }
      });
      closeModal(type);
      return;
    }

    // Handle images
    if (!validImages || validImages.length === 0) {
      toast.error(`No valid ${type} files selected.`);
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

      // Set preview for the first image if it's cover type
      if (type === "cover" && validImages[0] === img) {
        setCoverPreviewImage(img.preview);
      }
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
      
      // Add file_name property with timestamp-based default name for gallery images
      if (type === "gallery") {
        img.file_name = `gallery_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        img.order_no = ""; // Initialize order_no as empty string
      }
      
      updateFormData(key, [img]); // Append the new image
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

  // console.log(statusOptions);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  // const API_BASE_URL = "https://panchshil-super.lockated.com";
  // const AUTH_TOKEN = "Bearer RnPRz2AhXvnFIrbcRZKpJqA8aqMAP_JEraLesGnu43Q";

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await axios.get(`${baseURL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setter(response.data);
      // console.log("response:---", response.data);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
    }
  };
  useEffect(() => {
    axios
      .get(`${baseURL}/property_types.json`)
      .then((response) => {
        const options = response.data
          .filter((item) => item.active) // Ensure only active types are included
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
  }, []);

  const fetchBuildingTypes = async () => {
    // setLoading(tru/e);
    try {
      const response = await axios.get(`${baseURL}/building_types.json`);
      const options = response.data
        .filter((item) => item.active) // optional: only include active types
        .map((type) => ({
          value: type.building_type,
          label: type.building_type,
        }));
      setBuildingTypes(options);
    } catch (error) {
      console.error("Error fetching building types:", error);
      toast.error("Failed to fetch building types");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildingTypes();
  }, []);

  useEffect(() => {
    // fetchData("get_property_types.json", (data) =>
    //   setProjectsType(data?.property_types || [])
    // );
    fetchData("configuration_setups.json", (data) =>
      setConfigurations(data || [])
    );
    fetchData("specification_setups.json", (data) =>
      setSpecifications(data?.specification_setups || [])
    );
    fetchData("amenity_setups.json", (data) =>
      setAmenities(data?.amenities_setups || [])
    );
  }, []);

  // console.log("projectsType", projectsType);
  useEffect(() => {
    const fetchConstructionStatuses = async () => {
      try {
        const response = await axios.get(
          `${baseURL}construction_statuses.json`
        );
        const options = response.data
          .filter((status) => status.active) // Filter only active statuses
          .map((status) => ({
            label: status.construction_status, // Display name
            value: status.construction_status, // Unique identifier
            name: status.Project_Construction_Status_Name,
          }));
        setStatusOptions(options); // Set the options for the dropdown
      } catch (error) {
        console.error("Error fetching construction statuses:", error);
      }
    };

    fetchConstructionStatuses();
  }, []);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}category_types.json`);

        if (response.data) {
          // Extract only category_type from each object
          const formattedCategories = response.data.map((item) => ({
            value: item.category_type, // Assign category_type as value
            label: item.category_type, // Assign category_type as label
          }));

          setCategoryTypes(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };

    fetchCategoryTypes();
  }, []);

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
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
  }, []);

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

  // console.log("data", projectsType);

  const project_banner = [
    { key: "image_1_by_1", label: "1:1" },
    { key: "image_16_by_9", label: "16:9" },
    { key: "image_9_by_16", label: "9:16" },
    { key: "image_3_by_2", label: "3:2" },
  ];
  const gallery_images = [
    { key: "gallery_image_16_by_9", label: "16:9" },
    { key: "gallery_image_1_by_1", label: "1:1" },
    { key: "gallery_image_9_by_16", label: "9:16" },
    { key: "gallery_image_3_by_2", label: "3:2" },
  ];
  const floorPlanRatios = [
    { key: "project_2d_image_16_by_9", label: "16:9" },
    { key: "project_2d_image_1_by_1", label: "1:1" },
    { key: "project_2d_image_3_by_2", label: "3:2" },
    { key: "project_2d_image_9_by_16", label: "9:16" },
  ];

  const coverImageRatios = [
    { key: "cover_images_1_by_1", label: "1:1" },
    { key: "cover_images_16_by_9", label: "16:9" },
    { key: "cover_images_9_by_16", label: "9:16" },
    { key: "cover_images_3_by_2", label: "3:2" },
  ];

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}projects/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const projectData = response.data;
        // console.log("projectData", projectData);
        setPlans(
          (projectData.plans || []).map((plan) => ({
            id: plan.id, // ✅ include this
            name: plan.name,
            images: (plan.images || []).map((img) =>
              img.document_url ? { ...img, isApi: true } : img
            ),
          }))
        );

        // Step 1: Combine all image ratio keys
        const allImageKeys = [
          ...project_banner,
          ...floorPlanRatios,
          ...coverImageRatios,
        ];

        const galleryImages = {
          gallery_image_1_by_1: [],
          gallery_image_9_by_16: [],
          gallery_image_16_by_9: [],
          gallery_image_3_by_2: [],
        };

        // Step 2: Dynamically extract image arrays
        const dynamicImageData = {};
        allImageKeys.forEach(({ key }) => {
          const value = projectData[key];
          dynamicImageData[key] = Array.isArray(value)
            ? value
            : value
            ? [value]
            : [];
        });

        const seenImages = new Set();

        // (projectData.gallery_image || []).forEach((item) => {
        //   Object.keys(galleryImages).forEach((key) => {
        //     if (Array.isArray(item[key])) {
        //       galleryImages[key] = galleryImages[key].concat(item[key]);
        //     }
        //   });
        // });

        (projectData.gallery_image || []).forEach((item) => {
          Object.keys(galleryImages).forEach((key) => {
            if (Array.isArray(item[key])) {
              const uniqueImages = item[key].filter((img) => {
                const id = img.id || img.document_url;
                if (seenImages.has(id)) return false;
                seenImages.add(id);
                return true;
              }).map((img) => ({
                ...img,
                // Add file_name property for existing images if not present
                file_name: img.file_name || img.document_file_name || img.title || `existing_image_${img.id || Date.now()}`,
                // Preserve order_no field from existing images
                order_no: img.order_no || ""
              }));

              galleryImages[key] = galleryImages[key].concat(uniqueImages);
            }
          });
        });

        // Also process gallery images that are directly in the projectData structure  
        Object.keys(galleryImages).forEach((key) => {
          if (Array.isArray(projectData[key])) {
            const directImages = projectData[key].filter((img) => {
              const id = img.id || img.document_url;
              if (seenImages.has(id)) return false;
              seenImages.add(id);
              return true;
            }).map((img) => ({
              ...img,
              // Add file_name property for existing images if not present
              file_name: img.file_name || img.document_file_name || img.title || `existing_image_${img.id || Date.now()}`,
              // Preserve order_no field from existing images
              order_no: img.order_no || ""
            }));

            galleryImages[key] = galleryImages[key].concat(directImages);
          }
        });

        // Step 3: Set static + dynamic formData
        setFormData({
          Property_Type: projectData.property_type || "",
          Property_type_id: projectData.property_type_id || "",
          SFDC_Project_Id: projectData.SFDC_Project_Id || "",
          building_type: projectData.building_type || "",
          Project_Construction_Status:
            projectData.Project_Construction_Status || "",
          Configuration_Type1: Array.isArray(projectData.configurations)
            ? projectData.configurations.map((config) => ({
                id: config.id,
                name: config.name,
              }))
            : [],
          Project_Name: projectData.project_name || "",
          project_address: projectData.project_address || "",
          Project_Description: projectData.project_description || "",
          Price_Onward: projectData.price || "",
          Project_Size_Sq_Mtr: projectData.project_size_sq_mtr || "",
          Project_Size_Sq_Ft: projectData.project_size_sq_ft || "",
          development_area_sqmt: projectData.development_area_sqmt || "",
          development_area_sqft: projectData.development_area_sqft || "",
          Rera_Carpet_Area_Sq_M: projectData.rera_carpet_area_sq_mtr || "",
          Rera_Carpet_Area_sqft: projectData.rera_carpet_area_sqft || "",
          Rera_Sellable_Area: projectData.Rera_Sellable_Area || "",
          Number_Of_Towers: projectData.no_of_towers || "",
          no_of_floors: projectData.no_of_floors || "",
          Number_Of_Units: projectData.no_of_apartments || "",
          Rera_Number_multiple: projectData.rera_number_multiple || [],
          Amenities1: Array.isArray(projectData.amenities)
            ? projectData.amenities.map((ammit) => ({
                id: ammit.id,
                name: ammit.name,
              }))
            : [],
          Specifications: Array.isArray(projectData.specifications)
            ? projectData.specifications.map((s) => s.name)
            : [],
          Land_Area: projectData.land_area || "",
          land_uom: projectData.land_uom || "",
          project_tag: projectData.project_tag || "",
          virtual_tour_url_multiple:
            projectData.virtual_tour_url_multiple || [],
          map_url: projectData.map_url || "",
          image: Array.isArray(projectData.image_url)
            ? projectData.image_url.map((url) => ({ document_url: url }))
            : projectData.image_url
            ? [{ document_url: projectData.image_url }]
            : [],
          previewImage: Array.isArray(projectData.image_url)
            ? projectData.image_url[0] || ""
            : projectData.image_url || "",
          Address: {
            address_line_1: projectData.location?.address || "",
            address_line_2: projectData.location?.address_line_two || "",
            city: projectData.location?.city || "",
            state: projectData.location?.state || "",
            pin_code: projectData.location?.pin_code || "",
            country: projectData.location?.country || "",
          },
          brochure: projectData.brochure || [],
          two_d_images: projectData.two_d_images || [],
          videos: projectData.videos || [],
          fetched_gallery_image: projectData.gallery_image || [],
          project_layout: projectData.project_layout || [],
          project_creatives: projectData.project_creatives || [],
          project_creative_generics:
            projectData.project_creative_generics || [],
          project_creative_offers: projectData.project_creative_offers || [],
          project_interiors: projectData.project_interiors || [],
          project_exteriors: projectData.project_exteriors || [],
          project_emailer_templetes:
            projectData.project_emailer_templetes || [],
          KnwYrApt_Technical: projectData.KnwYrApt_Technical || [],
          project_ppt: Array.isArray(projectData.ProjectPPT)
            ? projectData.ProjectPPT
            : projectData.ProjectPPT
            ? [projectData.ProjectPPT]
            : [],
          // Remove ppt_name from state, not needed if you always use array of objects
          project_sales_type: projectData.project_sales_type || "",
          order_no: projectData.order_no || "",
          enable_enquiry: projectData.enable_enquiry || false,
          is_sold: projectData.is_sold || false,
          disclaimer: projectData.project_disclaimer || "",
          project_qrcode_image: projectData.project_qrcode_images || [],
          rera_url: projectData.rera_url || "",
          cover_images: projectData.cover_images || [],

          // ✅ Dynamically spread image ratios
          ...dynamicImageData,
          ...galleryImages,
        });

        // Set floor plans
        setPlans(
          (projectData.plans || []).map((plan) => ({
            name: plan.name,
            images: (plan.images || []).map((img) =>
              img.document_url ? { ...img, isApi: true } : img
            ),
          }))
        );

        setProject(projectData);
      } catch (err) {
        setError("Failed to fetch project details.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, []);

  // console.log(formData);

  const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB (changed from 100MB)
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB (changed from 10MB)
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

  // console.log("this is the form data", formData);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      if (name === "brochure") {
        const file = files[0];
        const sizeCheck = isFileSizeValid(file, MAX_BROCHURE_SIZE);

        if (!sizeCheck.valid) {
          toast.error(
            `Brochure file too large: ${sizeCheck.name} (${
              sizeCheck.size
            }). Maximum allowed size is ${formatFileSize(MAX_BROCHURE_SIZE)}.`
          );
          e.target.value = ""; // Reset input
          return;
        }

        setFormData((prev) => ({
          ...prev,
          brochure: file,
        }));
      } else if (name === "two_d_images") {
        const newImages = Array.from(files);
        const validImages = [];
        const tooLargeFiles = [];

        newImages.forEach((file) => {
          const sizeCheck = isFileSizeValid(file, MAX_IMAGE_SIZE);
          if (!sizeCheck.valid) {
            tooLargeFiles.push(sizeCheck);
          } else {
            validImages.push(file);
          }
        });

        if (tooLargeFiles.length > 0) {
          const fileList = tooLargeFiles
            .map((f) => `${f.name} (${f.size})`)
            .join(", ");
          toast.error("Image size must be less than 3MB.", {
            duration: 5000,
          });

          if (tooLargeFiles.length === newImages.length) {
            e.target.value = ""; // Reset input if all files are invalid
            return;
          }
        }

        if (validImages.length > 0) {
          setFormData((prev) => ({
            ...prev,
            two_d_images: [...prev.two_d_images, ...validImages],
          }));
        }
      } else if (name === "videos") {
        const newVideos = Array.from(files);
        const validVideos = [];
        const tooLargeFiles = [];

        newVideos.forEach((file) => {
          const sizeCheck = isFileSizeValid(file, MAX_VIDEO_SIZE);
          if (!sizeCheck.valid) {
            tooLargeFiles.push(sizeCheck);
          } else {
            validVideos.push(file);
          }
        });

        if (tooLargeFiles.length > 0) {
          const fileList = tooLargeFiles
            .map((f) => `${f.name} (${f.size})`)
            .join(", ");
          toast.error("Video size must be less than 10MB.", {
            duration: 5000,
          });

          if (tooLargeFiles.length === newVideos.length) {
            e.target.value = ""; // Reset input if all files are invalid
            return;
          }
        }

        if (validVideos.length > 0) {
          setFormData((prev) => ({
            ...prev,
            videos: [...prev.videos, ...validVideos],
          }));
        }
      } else if (name === "image") {
        const files = Array.from(e.target.files);
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];

        // First check file type
        const validTypeFiles = files.filter((file) =>
          allowedTypes.includes(file.type)
        );

        if (validTypeFiles.length !== files.length) {
          toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed.");
          e.target.value = "";
          return;
        }

        // Then check file size
        const file = validTypeFiles[0];
        const sizeCheck = isFileSizeValid(file, MAX_IMAGE_SIZE);

        if (!sizeCheck.valid) {
          toast.error(
            `Image file too large: ${sizeCheck.name} (${
              sizeCheck.size
            }). Maximum allowed size is ${formatFileSize(MAX_IMAGE_SIZE)}.`
          );
          e.target.value = ""; // Reset input
          return;
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          image: file,
        }));
      }
    } else if (name === "video_preview_image_url") {
      const files = Array.from(e.target.files);
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      // First check file type
      const validTypeFiles = files.filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (validTypeFiles.length !== files.length) {
        toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed.");
        e.target.value = "";
        return;
      }

      // Then check file size
      const file = validTypeFiles[0];
      const sizeCheck = isFileSizeValid(file, MAX_IMAGE_SIZE);

      if (!sizeCheck.valid) {
        toast.error(
          `Image file too large: ${sizeCheck.name} (${
            sizeCheck.size
          }). Maximum allowed size is ${formatFileSize(MAX_IMAGE_SIZE)}.`
        );
        e.target.value = ""; // Reset input
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        video_preview_image_url: file,
      }));
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
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleFileChange = (e, fieldName) => {
    if (fieldName === "image") {
      const files = Array.from(e.target.files);
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      const validTypeFiles = files.filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (validTypeFiles.length !== files.length) {
        toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed.");
        e.target.value = "";
        return;
      }

      // Check file size
      const file = validTypeFiles[0];
      const sizeCheck = isFileSizeValid(file, MAX_IMAGE_SIZE);

      if (!sizeCheck.valid) {
        toast.error(
          `Image file too large: ${sizeCheck.name} (${
            sizeCheck.size
          }). Maximum allowed size is ${formatFileSize(MAX_IMAGE_SIZE)}.`
        );
        e.target.value = ""; // Reset input
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        image: file,
      }));
    }
  };

  const handleDiscardTwoDImage = async (key, index) => {
    const image = formData[key][index]; // Get the selected image
    if (!image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_twoD_image/${image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${image.id} deleted successfully`);
      toast.success("Image removed successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

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

  const handleImageNameChange = (e, index) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedGallery = [...prev.gallery_image];
      updatedGallery[index].gallery_image_file_name = value;
      return { ...prev, gallery_image: updatedGallery };
    });
  };

  // Function to handle gallery image name changes for different ratios
  const handleGalleryImageNameChange = (key, index, newName) => {
    setFormData((prev) => {
      const updatedImages = [...(prev[key] || [])];
      if (updatedImages[index]) {
        updatedImages[index] = {
          ...updatedImages[index],
          file_name: newName,
        };
      }
      return {
        ...prev,
        [key]: updatedImages,
      };
    });
  };

  // Function to handle gallery image order_no changes for different ratios
  const handleGalleryImageOrderChange = (key, index, newOrderNo) => {
    setFormData((prev) => {
      const updatedImages = [...(prev[key] || [])];
      if (updatedImages[index]) {
        updatedImages[index] = {
          ...updatedImages[index],
          order_no: newOrderNo,
        };
      }
      return {
        ...prev,
        [key]: updatedImages,
      };
    });
  };

  const handleFetchedDiscardGallery = async (key, index, imageId) => {
    // If no imageId, it's a new image, just remove locally
    if (!imageId) {
      setFormData((prev) => {
        const updatedFiles = (prev[key] || []).filter((_, i) => i !== index);
        return { ...prev, [key]: updatedFiles };
      });
      toast.success("Image removed successfully!");
      return;
    }

    // Existing image: delete from server, then remove locally
    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_gallery_image/${imageId}.json`,
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
          const updatedFiles = formData[key].filter((_, i) => i !== index);
          setFormData({ ...formData, [key]: updatedFiles });
          toast.success("Image removed from UI (already deleted on server).");
          return;
        }
        throw new Error("Failed to delete image");
      }

      // Remove from UI after successful delete
      setFormData((prev) => {
        const updatedFiles = (prev[key] || []).filter((_, i) => i !== index);
        return { ...prev, [key]: updatedFiles };
      });

      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error.message);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  const discardImage = (key, fileToRemove) => {
    setFormData((prev) => {
      const updatedFiles = prev[key].filter((file) => file !== fileToRemove);

      return {
        ...prev,
        [key]: updatedFiles,
      };
    });

    toast.success("Image removed successfully!");
  };

  const handleDiscardBroucher = async (key) => {
    const brochure = formData[key];

    // If the brochure doesn't have an ID, just remove it locally
    if (!brochure.id) {
      setFormData({ ...formData, [key]: {} });
      toast.success("Brochure removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_brochures/${brochure.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete brochure");
      }

      // Remove brochure from state
      setFormData({ ...formData, [key]: {} });
      toast.success("Brochure removed successfully!");
    } catch (error) {
      console.error("Error deleting brochure:", error);
      alert("Failed to delete brochure. Please try again.");
    }
  };

  const handleFileDiscard = async (key, index) => {
    const videos = formData[key][index]; // Get the selected image
    if (!videos.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_videos/${videos.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${videos.id} deleted successfully`);
      toast.success("Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardCreative = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_creative_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${Image.id} deleted successfully`);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handlePlanDelete = async (planId, index) => {
    console.log("Deleting Plan ID:", planId);

    // If planId is missing (locally added plan), just delete from UI
    if (!planId) {
      setPlans((prev) => prev.filter((_, idx) => idx !== index));
      toast.success("Local plan removed!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}plans/${planId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete from backend");
      }

      // Remove from local state
      setPlans((prev) => prev.filter((_, idx) => idx !== index));
      toast.success("Plan deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete plan from backend.");
    }
  };

  const handleFileDiscardCoverImage = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_creative_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        // Optionally, handle 404 as a successful local delete
        if (response.status === 404) {
          const updatedFiles = formData[key].filter((_, i) => i !== index);
          setFormData({ ...formData, [key]: updatedFiles });
          toast.success("Image removed from UI (already deleted on server).");
          return;
        }
        throw new Error("Failed to delete image");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${Image.id} deleted successfully`);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardCreativeGenerics = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_creative_generics_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${Image.id} deleted successfully`);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardCreativeOffers = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_creative_offers_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${Image.id} deleted successfully`);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardInteriors = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_ineteriors_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${Image.id} deleted successfully`);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardExteriors = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_exterios_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${Image.id} deleted successfully`);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardEmailerTemplate = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_emailer_templetes_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete Templetes");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${Image.id} deleted successfully`);
      toast.success("Emailer Template deleted successfully!");
    } catch (error) {
      console.error("Error deleting Templetes:", error);
      alert("Failed to delete Templete. Please try again.");
    }
  };

  const handleFileDiscardTechnical = async (key, index) => {
    const file = formData[key][index]; // Get the selected file
    if (!file.id) {
      // If the file has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("File removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_technical_file/${file.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete Technical File");
      }

      // Remove the deleted file from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      toast.success("Technical File deleted successfully!");
    } catch (error) {
      console.error("Error deleting Technical File:", error);
      alert("Failed to delete Technical File. Please try again.");
    }
  };

  const handleDiscardFilePpt = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_ppt/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete Templetes");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${Image.id} deleted successfully`);
      toast.success("PPT deleted successfully!");
    } catch (error) {
      console.error("Error deleting Templetes:", error);
      alert("Failed to delete Templete. Please try again.");
    }
  };

  const handleFileDiscardLayout = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_layout_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      // console.log(`Image with ID ${Image.id} deleted successfully`);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const validateForm = (formData) => {
    // Clear previous toasts
    toast.dismiss();

    // if (formData.image.length === 0) {
    //   toast.error("Project Logo is required.");
    //   return false;
    // }
    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }
    // if (!formData.building_type) {
    //   toast.error("Building Type is required.");
    //   return false;
    // }
    if (!formData.Project_Construction_Status) {
      toast.error("Construction Status is required.");
      return false;
    }
    // if (!formData.Configuration_Type.length) {
    //   toast.error("Configuration Type is required.");
    //   return false;
    // }
    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }
    // if (!formData.project_tag) {
    //   toast.error("Project Tag is required.");
    //   return false;
    // }
    // if (!formData.Project_Description) {
    //   toast.error("Project Description is required.");
    //   return false;
    // }
    // if (!formData.Price_Onward) {
    //   toast.error("Price Onward is required.");
    //   return false;
    // }
    // if (!formData.Project_Size_Sq_Mtr) {
    //   toast.error("Project Size (Sq. Mtr.) is required.");
    //   return false;
    // }
    // if (!formData.Project_Size_Sq_Ft) {
    //   toast.error("Project Size (Sq. Ft.) is required.");
    //   return false;
    // }
    // if (!formData.development_area_sqmt) {
    //   toast.error("Development Area (Sq. Mtr.) is required.");
    //   return false;
    // }
    // if (!formData.development_area_sqft) {
    //   toast.error("Development Area (Sq. Ft.) is required.");
    //   return false;
    // }
    // if (!formData.Rera_Carpet_Area_Sq_M) {
    //   toast.error("RERA Carpet Area (Sq. M) is required.");
    //   return false;
    // }
    // if (!formData.Rera_Carpet_Area_sqft) {
    //   toast.error("RERA Carpet Area (Sq. Ft.) is required.");
    //   return false;
    // }
    // if (!formData.Number_Of_Towers) {
    //   toast.error("Number of Towers is required.");
    //   return false;
    // }
    // if (!formData.no_of_floors) {
    //   toast.error("Number of Floors is required.");
    //   return false;
    // }
    // if (!formData.Number_Of_Units) {
    //   toast.error("Number of Units is required.");
    //   return false;
    // }
    // if (!formData.Land_Area) {
    //   toast.error("Land Area is required.");
    //   return false;
    // }
    // if (!formData.land_uom) {
    //   toast.error("Land UOM is required.");
    //   return false;
    // }
    // if (!formData.Rera_Number_multiple) {
    //   toast.error("RERA Number is required.");
    //   return false;
    // }

    // if (!formData.Amenities.length) {
    //   toast.error("Amenities are required.");
    //   return false;
    // }
    // if (!formData.Address || !formData.Address.address_line_1) {
    //   toast.error("Address Line 1 is required.");
    //   return false;
    // }
    // if (!formData.Address || !formData.Address.city) {
    //   toast.error("City is required.");
    //   return false;
    // }
    // if (!formData.Address || !formData.Address.state) {
    //   toast.error("State is required.");
    //   return false;
    // }
    // if (!formData.Address || !formData.Address.pin_code) {
    //   toast.error("Pin Code is required.");
    //   return false;
    // }
    // if (!formData.Address || !formData.Address.country) {
    //   toast.error("Country is required.");
    //   return false;
    // }
    // if (!formData.map_url) {
    //   toast.error("Map URL is required.");
    //   return false;
    // }
    // if (!formData.brochure.length === 0) {
    //   toast.error("Brochure is required.");
    //   return false;
    // }
    // if (formData.two_d_images.length === 0) {
    //   toast.error("At least one 2D image is required.");
    //   return false;
    // }
    // if (formData.videos.length === 0) {
    //   toast.error("At least one video is required.");
    //   return false;
    // }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      setLoading(false);
      return;
    }

    // Check for required images
    // const gallery16By9Files = Array.isArray(formData.gallery_image_16_by_9)
    // ? formData.gallery_image_16_by_9.filter(
    //     (img) =>
    //       img.file instanceof File ||
    //       !!img.id ||
    //       !!img.document_file_name
    //   )
    // : [];

    //     const gallery16By9Files = Array.isArray(formData.gallery_image_16_by_9)
    //   ? formData.gallery_image_16_by_9.filter(
    //       (img) =>
    //         img?.file instanceof File || !!img?.id || !!img?.document_file_name
    //     )
    //   : [];
    //     const hasFloorPlan16by9 = formData.project_2d_image_16_by_9 && formData.project_2d_image_16_by_9.some(img => img.file instanceof File || img.id || img.document_file_name);
    //     const hasProjectBanner9by16 = formData.image_9_by_16 && formData.image_9_by_16.some(img => img.file instanceof File || img.id || img.document_file_name);
    //     const hasProjectBanner1by1 = Array.isArray(formData.image_1_by_1) && formData.image_1_by_1.some(
    //       img => img?.file instanceof File || img?.id || img?.document_file_name
    //     );
    //     const hasProjectCover16by9 = formData.cover_images_16_by_9 && formData.cover_images_16_by_9.some(img => img.file instanceof File || img.id || img.document_file_name);

    //     // Check if all required images are present
    //     const allImagesPresent = gallery16By9Files.length >= 3 && hasFloorPlan16by9 && hasProjectBanner9by16 && hasProjectCover16by9;

    //     console.log("allImagesPresent:", allImagesPresent);

    //     const galleryImageCount = gallery16By9Files.length;

    //     if (galleryImageCount < 3 || galleryImageCount % 3 !== 0) {
    //   const remainder = galleryImageCount % 3;
    //   const imagesNeeded = 3 - remainder;
    //   const nextValidCount = galleryImageCount + imagesNeeded;
    //   const previousValidCount = galleryImageCount - remainder;

    //   let message = `Currently ${galleryImageCount} gallery image${galleryImageCount !== 1 ? "s" : ""} uploaded. `;

    //   if (galleryImageCount < 3) {
    //     // Case: User uploaded less than 3
    //     message += `Please upload at least 3 gallery images with 16:9 ratio to proceed.`;
    //   } else {
    //     // Case: User uploaded more than 3 but not a multiple of 3
    //     message += `Please upload ${imagesNeeded} more to make it ${nextValidCount}, or remove ${remainder} to make it ${previousValidCount} (multiples of 3 only) with 16:9 ratio to proceed.`;
    //   }

    //   toast.error(message);
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    //     // Perform individual validation checks only if not all images are present
    //     if (!allImagesPresent) {
    //       if (gallery16By9Files.length < 3) {
    //         toast.error("At least 3 gallery images with 16:9 ratio are required.");
    //         setLoading(false);
    //         setIsSubmitting(false);
    //         return;
    //       }
    //       if (!hasFloorPlan16by9) {
    //         toast.error("Floor plans with 16:9 ratio are required.");
    //         setLoading(false);
    //         setIsSubmitting(false);
    //         return;
    //       }
    //       if (!hasProjectBanner9by16 && !hasProjectBanner1by1) {
    //         toast.error("Project banner one of them or both(9:16) and (1:1) is required.");
    //         setLoading(false);
    //         setIsSubmitting(false);
    //         return;
    //       }
    //       if (!hasProjectCover16by9) {
    //         toast.error("Project cover (16:9) is required.");
    //         setLoading(false);
    //         setIsSubmitting(false);
    //         return;
    //       }
    //     }

    // const gallery16By9Files = Array.isArray(formData.gallery_image_16_by_9)
    //   ? formData.gallery_image_16_by_9.filter(
    //       (img) =>
    //         img?.file instanceof File || !!img?.id || !!img?.document_file_name
    //     )
    //   : [];

    // const galleryImageCount = gallery16By9Files.length;

    // // Only validate if at least one image is uploaded
    // if (galleryImageCount > 0 && (galleryImageCount < 3 || galleryImageCount % 3 !== 0)) {
    //   const remainder = galleryImageCount % 3;
    //   const imagesNeeded = 3 - remainder;
    //   const nextValidCount = galleryImageCount + imagesNeeded;
    //   const previousValidCount = galleryImageCount - remainder;

    //   let message = `Currently ${galleryImageCount} gallery image${galleryImageCount !== 1 ? "s" : ""} uploaded. `;

    //   if (galleryImageCount < 3) {
    //     message += `Please upload at least 3 gallery images with 16:9 ratio to proceed.`;
    //   } else {
    //     message += `Please upload ${imagesNeeded} more to make it ${nextValidCount}, or remove ${remainder} to make it ${previousValidCount} (multiples of 3 only) with 16:9 ratio to proceed.`;
    //   }

    //   toast.error(message);
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    // const hasProjectBanner9by16 =
    //   formData.image_9_by_16 &&
    //   formData.image_9_by_16.some(
    //     (img) => img.file instanceof File || img.id || img.document_file_name
    //   );

    // const hasProjectBanner1by1 =
    //   Array.isArray(formData.image_1_by_1) &&
    //   formData.image_1_by_1.some(
    //     (img) => img?.file instanceof File || img?.id || img?.document_file_name
    //   );

    // const allImagesPresent = hasProjectBanner9by16 || hasProjectBanner1by1;

    // console.log("allImagesPresent:", allImagesPresent);

    // if (!allImagesPresent) {
    //   toast.error(
    //     "Project banner one of them or both (9:16) and (1:1) is required."
    //   );
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    // const gallery_images = [
    //   "gallery_image_16_by_9",
    //   "gallery_image_1_by_1",
    //   "gallery_image_9_by_16",
    //   "gallery_image_3_by_2",
    // ];

    // const isValidImage = (img) =>
    //   img?.file instanceof File || !!img?.id || !!img?.document_file_name;

    // // Combine all valid images from all gallery fields
    // let totalValidGalleryImages = 0;

    // for (const key of gallery_images) {
    //   const images = Array.isArray(formData[key])
    //     ? formData[key].filter(isValidImage)
    //     : [];
    //   totalValidGalleryImages += images.length;
    // }

    // if (totalValidGalleryImages > 0 && totalValidGalleryImages % 3 !== 0) {
    //   const remainder = totalValidGalleryImages % 3;
    //   const imagesNeeded = 3 - remainder;
    //   const previousValidCount = totalValidGalleryImages - remainder;

    //   const message = `Currently in Gallery ${totalValidGalleryImages} image${
    //     totalValidGalleryImages !== 1 ? "s" : ""
    //   } uploaded. Please upload ${imagesNeeded} more or remove ${remainder} to make it a multiple of 3.`;

    //   toast.error(message);
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    const data = new FormData();

    data.append("project[Amenities]", nameSend);
    data.append("project[Configuration_Type]", nameSends);

    if (plans.length > 0) {
      plans.forEach((plan, idx) => {
        data.append(`project[plans][${idx}][name]`, plan.name);
        if (Array.isArray(plan.images)) {
          plan.images.forEach((img) => {
            data.append(`project[plans][${idx}][images][]`, img);
          });
        }
      });
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && Array.isArray(value) && value[0] instanceof File) {
        data.append("project[image]", value[0]);
      } else if (key === "Address") {
        Object.entries(value).forEach(([addressKey, addressValue]) => {
          data.append(`project[Address][${addressKey}]`, addressValue);
        });
      } else if (key === "brochure" && value) {
        const file = value instanceof File ? value : value.file;
        if (file) {
          data.append("project[ProjectBrochure][]", file);
        }
      } else if (
        key === "project_emailer_templetes" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[ProjectEmailerTempletes][]", file);
          }
        });
      } else if (
        key === "KnwYrApt_Technical" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[KnwYrApt_Technical][]", file);
          }
        });
      } else if (
        key === "project_ppt" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[ProjectPPT][]", file);
          }
        });
      } else if (
        key === "two_d_images" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[Project2DImage][]", file);
          }
        });
      } else if (
        key === "project_creatives" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[ProjectCreatives][]", file);
          }
        });
      } else if (
        key === "cover_images" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[cover_images][]", file);
          }
        });
      } else if (
        key === "project_creative_generics" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[ProjectCreativeGenerics][]", file);
          }
        });
      } else if (
        key === "project_creative_offers" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[ProjectCreativeOffers][]", file);
          }
        });
      } else if (
        key === "project_interiors" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[ProjectInteriors][]", file);
          }
        });
      } else if (
        key === "project_exteriors" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[ProjectExteriors][]", file);
          }
        });
      } else if (
        key === "project_layout" &&
        Array.isArray(value) &&
        value.length
      ) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[ProjectLayout][]", file);
          }
        });
      } else if (key === "videos" && Array.isArray(value) && value.length) {
        value.forEach((fileObj) => {
          const file = fileObj instanceof File ? fileObj : fileObj.file;
          if (file) {
            data.append("project[ProjectVideo][]", file);
          }
        });
      } else if (key === "gallery_image_" && Array.isArray(value)) {
        value.forEach((fileObj, index) => {
          if (fileObj.gallery_image_ instanceof File) {
            data.append("project[gallery_image_][]", fileObj.gallery_image_);
            data.append(
              `project[gallery_image_file_name]`,
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
      } else if (key === "project_qrcode_image" && Array.isArray(value)) {
        const newTitles = [];
        const existingUpdates = [];
        
        value.forEach((fileObj) => {
          if (fileObj.project_qrcode_image instanceof File) {
            // New QR code image
            data.append(
              "project[project_qrcode_image][]",
              fileObj.project_qrcode_image
            );
          }
          
          if (fileObj.isNew) {
            // Title for new image
            newTitles.push(fileObj.file_name || "");
          } else if (fileObj.id && fileObj.file_name) {
            // Existing image with updated title
            existingUpdates.push({
              id: fileObj.id,
              file_name: fileObj.file_name
            });
          }
        });
        
        // Send titles for new images
        newTitles.forEach((file_name) => {
          data.append("project[project_qrcode_image_titles][]", file_name);
        });
        
        // Send updates for existing images
        existingUpdates.forEach((update, index) => {
          data.append(`project[project_qrcode_image_updates][${index}][id]`, update.id);
          data.append(`project[project_qrcode_image_updates][${index}][file_name]`, update.file_name);
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
            console.log("Virtual Tour URL:", item.virtual_tour_url);
            console.log("Virtual Tour Name:", item.virtual_tour_name);
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
        value.forEach((img, imgIndex) => {
          if (img.file instanceof File) {
            // New image upload - send as array without indices
            data.append(`project[${key}][][file]`, img.file);
            data.append(`project[${key}][][file_name]`, img.file_name || img.file.name);
            data.append(`project[${key}][][order_no]`, img.order_no || "");
          } else if (img.id && img.file_name) {
            // Existing image with updated name - send id and file_name
            data.append(`project[${key}][][id]`, img.id);
            data.append(`project[${key}][][file_name]`, img.file_name);
            data.append(`project[${key}][][order_no]`, img.order_no || "");
            
          }
        });
      } else if (key.startsWith("project_2d_image_") && Array.isArray(value)) {
        value.forEach((img) => {
          const backendField =
            key.replace("project_2d_image_", "project[project_2d_image_") + "]";
          if (img.file instanceof File) {
            data.append(backendField, img.file);
          }
        });
      } else if (key !== "image" && key !== "previewImage") {
        data.append(`project[${key}]`, value);
      }
    });

    // Debug FormData entries
    console.log("FormData entries:", Array.from(data.entries()));
    console.log("Gallery image data being sent:", {
      gallery_16_by_9: formData.gallery_image_16_by_9,
      gallery_1_by_1: formData.gallery_image_1_by_1,
      gallery_9_by_16: formData.gallery_image_9_by_16,
      gallery_3_by_2: formData.gallery_image_3_by_2
    });
    console.log("QR code image data being sent:", formData.project_qrcode_image);
    console.log("Gallery images structure: Arrays without numeric indices");

    try {
      const response = await axios.put(`${baseURL}projects/${id}.json`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("Project updated successfully");
      sessionStorage.removeItem("cached_projects");
      navigate("/project-list");
    } catch (error) {
      console.error("Error updating the project:", error);
      toast.error("Failed to update the project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, newImageList, type) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      const maxSizeInBytes = 3 * 1024 * 1024; // 3MB

      if (file.size > maxSizeInBytes) {
        toast.error("Image size must be less than 3MB.");
        return;
      }

      const imageURL = URL.createObjectURL(file);

      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
        previewImage: imageURL,
      }));
    }
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

    const imageURL = URL.createObjectURL(file);

    if (type === "image") {
      setPendingImageUpload(newImageList);
      setFormData((prevData) => ({
        ...prevData,
        bannerPreviewImage: imageURL,
      }));
      setDialogOpen((prev) => ({ ...prev, image: true }));
    }
    // else if (type === "cover_images") {
    //   setCoverImageUpload(newImageList);
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     coverPreviewImage: imageURL,
    //   }));
    //   setDialogOpen((prev) => ({ ...prev, cover_images: true }));
    // }
    else if (type === "cover_images") {
      // Skip cropper for GIFs
      if (fileType === "image/gif") {
        setFormData((prevData) => ({
          ...prevData,
          cover_images: Array.isArray(prevData.cover_images)
            ? [...prevData.cover_images, file]
            : [file],
          coverPreviewImage: imageURL,
        }));
        setCoverImageUpload([]); // Reset ImageUploadingButton
        setDialogOpen((prev) => ({ ...prev, cover_images: false }));
        return;
      }
      setCoverImageUpload(newImageList);
      setFormData((prevData) => ({
        ...prevData,
        coverPreviewImage: imageURL,
      }));
      setDialogOpen((prev) => ({ ...prev, cover_images: true }));
    } else if (type === "gallery_image") {
      setGalleryImageUpload(newImageList);
      setFormData((prevData) => ({
        ...prevData,
        previewImage: imageURL,
      }));
      setDialogOpen((prev) => ({ ...prev, gallery_image: true }));
    } else if (type === "two_d_images") {
      setFloorPlanImageUpload(newImageList);
      setFormData((prevData) => ({
        ...prevData,
        previewImage: imageURL,
      }));
      setDialogOpen((prev) => ({ ...prev, two_d_images: true }));
    }
  };

  // const statusOptions = {
  //   "Office Parks": [
  //     { value: "Completed", label: "Completed" },
  //     // { value: "Under-Construction", label: "Under Construction" },
  //     { value: "Ready-To-Move-in", label: "Ready To Move in" },
  //     { value: "Upcoming", label: "Upcoming" },
  //   ],
  //   Residential: [
  //     { value: "Completed", label: "Completed" },
  //     { value: "Ready-To-Move-in", label: "Ready To Move in" },
  //     { value: "Upcoming", label: "Upcoming" },
  //   ],
  // };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleCancel = () => {
    navigate(-1);
  };

  const handleTowerChange = (e) => {
    setTowerName(e.target.value);
  };

  const handleReraNumberChange = (e) => {
    setReraNumber(e.target.value);
  };

  const handleReraUrlChange = (e) => {
    setReraUrl(e.target.value);
  };

  // Handles adding a new RERA entry
  const handleAddRera = () => {
    if (!towerName || !reraNumber) {
      toast.error("Both fields are required.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      Rera_Number_multiple: [
        ...prevData.Rera_Number_multiple,
        { tower_name: towerName, rera_number: reraNumber, rera_url: reraUrl },
      ],
    }));

    // Clear input fields after adding
    setTowerName("");
    setReraNumber("");
  };

  // Handles editing existing RERA entries
  const handleEditRera = (index, field, value) => {
    setFormData((prevData) => {
      const updatedRera = [...prevData.Rera_Number_multiple];
      updatedRera[index][field] = value; // Update the correct field
      return { ...prevData, Rera_Number_multiple: updatedRera };
    });
  };

  // Handles deleting an entry
  const handleDeleteRera = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      Rera_Number_multiple: prevData.Rera_Number_multiple.filter(
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
    toast.dismiss(); // Clear previous toasts
    if (!virtualTourName || !virtualTourUrl) {
      toast.error("Please enter both Tour Name and URL.");
      return;
    }

    setFormData((prev) => {
      // console.log("Previous state:", prev);
      return {
        ...prev,
        virtual_tour_url_multiple: [
          ...(Array.isArray(prev.virtual_tour_url_multiple)
            ? prev.virtual_tour_url_multiple
            : []),
          {
            virtual_tour_name: virtualTourName,
            virtual_tour_url: virtualTourUrl,
          },
        ],
      };
    });

    // Clear input fields after adding
    setVirtualTourName("");
    setVirtualTourUrl("");
  };

  const handleEditVirtualTour = (index, field, value) => {
    setFormData((prevData) => {
      const updatedTours = [...prevData.virtual_tour_url_multiple]; // Create a new array
      updatedTours[index] = { ...updatedTours[index], [field]: value }; // Update specific entry

      return {
        ...prevData,
        virtual_tour_url_multiple: updatedTours, // Update state immutably
      };
    });
  };

  const handleDeleteVirtualTour = (index) => {
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: prev.virtual_tour_url_multiple.filter(
        (_, i) => i !== index
      ),
    }));

    toast.success("Virtual tour removed!");
  };

  const amenityTypes = [
    ...new Set(amenities.map((ammit) => ammit.amenity_type)),
  ].map((type) => ({ value: type, label: type }));

  const configurationTypes = [
    ...new Set(configurations.map((config) => config.configuration_type)),
  ].map((type) => ({ value: type, label: type }));

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB

    const validFiles = [];
    const rejectedFiles = [];

    files.forEach((file) => {
      if (file.size <= maxSizeInBytes) {
        validFiles.push(file);
      } else {
        rejectedFiles.push(file.name);
      }
    });

    if (rejectedFiles.length > 0) {
      toast.error("Image size must be less than 3MB.");
    }

    if (validFiles.length === 0) {
      return;
    }

    const updatedImages = validFiles.map((file) => ({
      gallery_image: file,
      gallery_image_file_name: file.name,
      gallery_image_file_type: selectedCategory, // Assuming selectedCategory exists in scope
      attachfile: { document_url: URL.createObjectURL(file) },
    }));

    setFormData((prev) => ({
      ...prev,
      gallery_image: [...(prev.gallery_image || []), ...updatedImages],
    }));

    event.target.value = "";
  };

  const handleQRCodeImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      project_qrcode_image: file, // Store the file
      file_name: file.name, // Default title is the file name
      isNew: true, // Mark as a new image
    }));

    setFormData((prev) => ({
      ...prev,
      project_qrcode_image: [
        ...(prev.project_qrcode_image || []),
        ...newImages,
      ],
    }));

    e.target.value = ""; // Reset the input box after upload
  };

  const handleQRCodeImageNameChange = (index, newName) => {
    setFormData((prev) => {
      const updatedImages = [...prev.project_qrcode_image];
      updatedImages[index].file_name = newName; // Update the title
      return { ...prev, project_qrcode_image: updatedImages };
    });
  };

  const handleRemoveQRCodeImage = async (key, index, imageId) => {
    // If no imageId, just remove locally (newly added, not yet saved)
    if (!imageId) {
      setFormData((prev) => {
        const updatedImages = prev[key].filter((_, i) => i !== index);
        return {
          ...prev,
          [key]: updatedImages,
        };
      });
      toast.success("QR Code image removed!");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}projects/${id}/remove_qr_code_images/${imageId}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete image. Server response: ${errorText}`
        );
      }

      // Remove the image from the state
      setFormData((prev) => {
        const updatedImages = prev[key].filter((_, i) => i !== index);
        return {
          ...prev,
          [key]: updatedImages,
        };
      });

      toast.success("QR Code image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error.message);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  const handleDiscardPpt = (key, index) => {
    setFormData((prev) => {
      if (!prev[key] || !Array.isArray(prev[key])) return prev;

      const updatedFiles = prev[key].filter((_, i) => i !== index);

      // console.log(`Updated ${key} after deletion:`, updatedFiles);

      return { ...prev, [key]: updatedFiles };
    });
  };

  //   const MAX_VIDEO_SIZE = 10 * 1024 * 1024; 3.
  // const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
  // const MAX_BROCHURE_SIZE = 20 * 1024 * 1024;
  const MAX_PPT_SIZE = 10 * 1024 * 1024; // 10MB

  // Modify the handleFileUpload function to handle gallery_images
  const handleFileUpload = (name, files) => {
    const MAX_SIZES = {
      brochure: MAX_BROCHURE_SIZE,
      two_d_images: MAX_IMAGE_SIZE, // 3MB
      videos: MAX_VIDEO_SIZE, // 10MB
      image: MAX_IMAGE_SIZE, // 3MB
      video_preview_image_url: MAX_IMAGE_SIZE, // 3MB
      gallery_image: MAX_IMAGE_SIZE, // 3MB
      project_qrcode_image: MAX_IMAGE_SIZE, // 3MB
      project_ppt: MAX_PPT_SIZE, // 10MB
      project_creatives: MAX_IMAGE_SIZE, // 3MB
      plans: MAX_IMAGE_SIZE, // 3MB
      cover_images: MAX_IMAGE_SIZE, // 3MB
      project_creative_generics: MAX_IMAGE_SIZE, // 3MB
      project_creative_offers: MAX_IMAGE_SIZE, // 3MB
      project_interiors: MAX_IMAGE_SIZE, // 3MB
      project_exteriors: MAX_IMAGE_SIZE, // 3MB
      project_emailer_templetes: MAX_BROCHURE_SIZE,
      KnwYrApt_Technical: MAX_BROCHURE_SIZE,
      project_layout: MAX_IMAGE_SIZE, // 3MB
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
      project_qrcode_image: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      videos: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
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
      plans: ["image/jpeg", "image/png", "image/gif", "image/webp"],
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
      const MAX_SIZE = 3 * 1024 * 1024; // 3MB limit (updated)

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

    if (name === "project_emailer_templetes") {
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.project_emailer_templetes.includes(file.type)) {
          toast.error(
            "Only PDF and DOCX files are allowed for Project Email Templates."
          );
          return;
        }

        if (file.size > MAX_SIZES.project_emailer_templetes) {
          toast.error(`File too large: ${file.name}. Max size is 20MB.`);
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => {
          // Make sure we're properly handling all possible states of prev.project_emailer_templetes
          let currentTemplates = [];

          // If project_emailer_templetes exists and is an array, use it
          if (
            prev.project_emailer_templetes &&
            Array.isArray(prev.project_emailer_templetes)
          ) {
            currentTemplates = [...prev.project_emailer_templetes];
          }
          // If project_emailer_templetes exists but is not an array (single file object), convert to array
          else if (prev.project_emailer_templetes) {
            currentTemplates = [prev.project_emailer_templetes];
          }

          // Return updated state with combined files
          return {
            ...prev,
            project_emailer_templetes: [...currentTemplates, ...validFiles],
          };
        });
      }
    }

    if (name === "KnwYrApt_Technical") {
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.KnwYrApt_Technical.includes(file.type)) {
          toast.error(
            "Only PDF and DOCX files are allowed for Project Technical Files."
          );
          return;
        }

        if (file.size > MAX_SIZES.KnwYrApt_Technical) {
          toast.error(`File too large: ${file.name}. Max size is 20MB.`);
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => {
          // Make sure we're properly handling all possible states of prev.KnwYrApt_Technical
          let currentTechnicalFiles = [];

          // If KnwYrApt_Technical exists and is an array, use it
          if (
            prev.KnwYrApt_Technical &&
            Array.isArray(prev.KnwYrApt_Technical)
          ) {
            currentTechnicalFiles = [...prev.KnwYrApt_Technical];
          }
          // If KnwYrApt_Technical exists but is not an array (single file object), convert to array
          else if (prev.KnwYrApt_Technical) {
            currentTechnicalFiles = [prev.KnwYrApt_Technical];
          }

          // Return updated state with combined files
          return {
            ...prev,
            KnwYrApt_Technical: [...currentTechnicalFiles, ...validFiles],
          };
        });
      }
    }

    if (name === "project_exteriors") {
      const newFiles = Array.from(files);
      const validFiles = [];

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
          ],
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
          ],
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

    if (name === "plans") {
      setFormData((prev) => ({
        ...prev,
        plans: [...(prev.plans || []), ...validFiles], // ✅ Fix: Ensure existing files are kept
      }));
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
        setFormData((prev) => {
          // Make sure we're properly handling all possible states of prev.project_ppt
          let currentPPTs = [];

          // If project_ppt exists and is an array, use it
          if (prev.project_ppt && Array.isArray(prev.project_ppt)) {
            currentPPTs = [...prev.project_ppt];
          }
          // If project_ppt exists but is not an array (single file object), convert to array
          else if (prev.project_ppt) {
            currentPPTs = [prev.project_ppt];
          }

          // Return updated state with combined files
          return {
            ...prev,
            project_ppt: [...currentPPTs, ...validFiles],
          };
        });
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
          toast.error(
            `File too large: ${file.name} (${
              file.size
            }). Max size: ${formatFileSize(MAX_SIZES[name])}`
          );
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
  };
  // const handleFetchedDiscardPPT = (index, id) => {
  //   setFormData((prev) => {
  //     const updatedPPT = prev.fetched_Project_PPT.filter(
  //       (file) => file.id !== id
  //     );
  //     return { ...prev, fetched_Project_PPT: updatedPPT };
  //   });
  // };

  // const propertyTypeOptions = [
  //   { value: "Office Parks", label: "Office Parks" },
  //   { value: "Residential", label: "Residential" },
  // ];

  // const buildingTypeOptions = [
  //   buildingTypes.map((type) => ({  value: type.building_type, label: type.building_type })),
  //   // { value: "Office Parks", label: "Office Parks" },
  //   // { value: "Residential", label: "Residential" },
  // ];

  // const buildingTypeOptions = {
  //   "Office Parks": [
  //     { value: "Mixed-Use-Development", label: "Mixed Use Development" },
  //     { value: "Special-Economic-Zone", label: "Special Economic Zone" },
  //     { value: "Tech-Parks", label: "Tech Parks" },
  //     { value: "Built-to-Suit", label: "Built to Suit" },
  //     { value: "Upcoming-Developments", label: "Upcoming Developments" },
  //   ],
  //   // Residential: [
  //   //   { value: "Completed", label: "Completed" },
  //   //   { value: "Ready-To-Move-In", label: "Ready To Move In" },
  //   //   { value: "Upcoming-Developments", label: "Upcoming Developments" },
  //   // ],
  // };

  const handlePropertyTypeChange = async (selectedOption) => {
    const { value, id } = selectedOption;

    setFormData((prev) => ({
      ...prev,
      Property_Type: value,
      Property_type_id: id, // Store the ID for API calls
      building_type: "", // Reset building type when property type changes
    }));

    try {
      // Fetch building types based on the selected property type
      const response = await axios.get(
        `${baseURL}/building_types.json?q[property_type_id_eq]=${id}`
      );

      const formattedBuildingTypes = response.data.map((item) => ({
        value: item.building_type,
        label: item.building_type,
      }));

      setBuildingTypes(formattedBuildingTypes);
    } catch (error) {
      console.error("Error fetching building types:", error);
    }
  };

  const handleDayNightChange = (index, isDay) => {
    setFormData((prev) => {
      const updatedGallery = [...(prev.gallery_image || [])];
      if (updatedGallery[index]) {
        updatedGallery[index].isDay = isDay;
      }
      return { ...prev, gallery_image: updatedGallery };
    });
  };

  const handleAmenitiesChange = async (selectedOptions) => {
    const newAmenities = selectedOptions.map((option) => ({
      id: option.value,
      name: option.label,
    }));

    setNameSend(newAmenities.map((amenity) => amenity.name));

    // Detect removed amenities
    const removed = formData.Amenities1.filter(
      (oldAmenity) =>
        !newAmenities.some((newAmenity) => newAmenity.id === oldAmenity.id)
    );

    for (const amenity of removed) {
      try {
        await axios.delete(`${baseURL}amenities/${amenity.id}.json`);
        console.log(`Deleted amenity with ID: ${amenity.id}`);
      } catch (error) {
        console.error("Error deleting amenity:", error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      Amenities1: newAmenities,
    }));
  };

  const selectedAmenityNames = formData.Amenities1.map((a) => a.name);

  const filteredAmenities = amenities.filter(
    (ammit) => !selectedAmenityNames.includes(ammit.name)
  );

  const handleConfigurationChange = async (selectedOptions) => {
    const newConfigurations = selectedOptions.map((option) => ({
      id: option.value,
      name: option.label,
    }));

    setNameSends(newConfigurations.map((config) => config.name));

    // Detect removed configurations
    const removed = formData.Configuration_Type1.filter(
      (oldConfig) =>
        !newConfigurations.some((newConfig) => newConfig.id === oldConfig.id)
    );

    for (const config of removed) {
      try {
        await axios.delete(
          `${baseURL}projects/${id}/configurations/${config.id}.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        console.log(`Deleted configuration with ID: ${config.id}`);
      } catch (error) {
        console.error("Error deleting configuration:", error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      Configuration_Type1: newConfigurations,
    }));
  };

  const selectedConfigurationNames = formData.Configuration_Type1.map(
    (c) => c.name
  );

  const filteredConfigurations = configurations.filter(
    (config) => !selectedConfigurationNames.includes(config.name)
  );

  return (
    <>
      {/* <Header /> */}

      <div className="module-data-section p-3">
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header">
            <h3 className="card-title">Edit Project</h3>
          </div>
          <div className="card-body">
            <div className="row">
              {/* <div className="col-md-3">
                <div className="form-group">
                  <label>
                    Project Banner Image
                    <span
                      className="tooltip-container"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      [i]
                      {showTooltip && (
                        <span className="tooltip-text">
                          Max Upload Size 3 MB
                        </span>
                      )}
                    </span>
                    <span className="otp-asterisk"> *</span>
                  </label>

                  <ImageUploadingButton
                    value={mainImageUpload}
                    onChange={(list) => handleImageUploaded(list, "image")}
                    variant="custom"
                  />
                  <small className="form-text text-muted">
                    Required ratio must be 9:16
                  </small>
                  <ImageCropper
                    open={dialogOpen.image}
                    image={pendingImageUpload?.[0]?.dataURL}
                    originalFile={pendingImageUpload?.[0]?.file}
                    onComplete={(cropped) => {
                      if (cropped) {
                        setFormData((prev) => ({
                          ...prev,
                          image: [cropped.file],
                          bannerPreviewImage: URL.createObjectURL(cropped.file),
                        }));

                        setMainImageUpload([
                          {
                            file: cropped.file,
                            dataURL: URL.createObjectURL(cropped.file),
                          },
                        ]);
                      }
                      setDialogOpen((prev) => ({ ...prev, image: false }));
                      setPendingImageUpload([]);
                    }}
                    requiredRatios={[9 / 16, 1, 16 / 9]}
                    requiredRatioLabel="9:16"
                    allowedRatios={[
                      { label: "16:9", ratio: 16 / 9 },
                      { label: "9:16", ratio: 9 / 16 },
                      { label: "1:1", ratio: 1 },
                    ]}
                  />
                </div>

                {formData.bannerPreviewImage ? (
                  <img
                    src={formData.bannerPreviewImage}
                    alt="Banner Preview"
                    className="img-fluid rounded mt-2"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      objectFit: "cover",
                    }}
                  />
                ) : Array.isArray(formData.image) &&
                  formData.image.length > 0 ? (
                  formData.image.map((img, index) => {
                    let src = "";
                    if (img.document_url) {
                      src = img.document_url;
                    }
                    return (
                      <img
                        key={index}
                        src={src}
                        alt={`Uploaded ${index}`}
                        className="img-fluid rounded mt-2"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                          marginBottom: "15px",
                          marginRight: "10px",
                        }}
                      />
                    );
                  })
                ) : (
                  <span>No image selected</span>
                )}


              </div> */}
              {/* <div className="col-md-3">
  <div className="form-group">
    <label>
      Property Type
      <span className="otp-asterisk"> *</span>
    </label>
    <PropertySelect

      options={propertyTypeOptions.map((type) => ({

        value: type.property_type,

        label: type.property_type,
      }))} 
      defaultValue={
        propertyTypeOptions.find(
          (type) => type.property_type === formData.Property_Type
        ) || null // ✅ Ensure defaultValue is set correctly
      }
      
      // value={
      //   propertyTypeOptions.find(
      //     (type) => type.property_type === formData.Property_Type
      //   ) || null
      // }
      onChange={(selectedOption) => {
        setFormData((prev) => ({
          ...prev,
          Property_Type: selectedOption?.value || "", // ✅ Ensure value is set correctly
          building_type: null, // Reset building type when property type changes
        }));
      }}
      isDisabled={false} // ✅ Enable the select box
      isClearable={true} // ✅ Allow clearing the selection
      isSearchable={true} // ✅ Enable search functionality
      placeholder="Select Property Type"
      
      // onChange={(selectedOption) =>
      //   setFormData((prev) => ({
      //     ...prev,
      //     Property_Type: selectedOption?.value || "",
      //   }))
      // }
    />
  </div>
</div> */}
              <div className="col-md-3">
                <div className="form-group">
                  <label>
                    Property Type
                    <span className="otp-asterisk"> *</span>
                  </label>
                  {propertyTypeOptions.length > 0 ? (
                    <PropertySelect
                      options={propertyTypeOptions}
                      defaultValue={formData.Property_Type}
                      value={
                        propertyTypeOptions.find(
                          (type) => type.value === formData.Property_Type
                        ) || null // Ensure defaultValue is set correctly
                      }
                      // defaultValue={propertyTypeOptions.find(
                      //   (type) => type.value === formData.Property_Type
                      // )}
                      onChange={(value) => handlePropertyTypeChange(value)}
                      isClearable
                      isSearchable
                      placeholder="Select Property Type"
                    />
                  ) : (
                    <p>No property types available</p>
                  )}
                </div>
              </div>

              <div className="col-md-3 mt-1">
                <div className="form-group">
                  <label>Project Building Type</label>
                  <SelectBox
                    options={buildingTypes || []}
                    defaultValue={formData.building_type}
                    onChange={(selectedValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        building_type: selectedValue,
                      }))
                    }
                    isDisabled={!formData.Property_Type}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-0">
                <div className="form-group">
                  <label>
                    Project Construction Status
                    <span className="otp-asterisk"> *</span>
                  </label>
                  <SelectBox
                    options={statusOptions || []}
                    defaultValue={formData.Project_Construction_Status}
                    // options={ statusOptions.map((status) => ({
                    //   value: status.value,
                    //   label: status.label,
                    // }))}
                    // defaultValue={parseInt(formData.Project_Construction_Status)}
                    onChange={(selectedValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        Project_Construction_Status: selectedValue,
                      }))
                    }
                  />
                </div>
              </div>

              {/* <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Configuration Type
                    
                  </label>
                  <MultiSelectBox
                    options={configurations.map((config) => ({
                      value: config.name,
                      label: config.name,
                    }))}
                    value={formData.Configuration_Type.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        Configuration_Type: selectedOptions.map(
                          (option) => option.value
                        ),
                      }))
                    }
                    placeholder="Select Type"
                  />
                </div>
              </div> */}

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Configuration Type
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <MultiSelectBox
                    options={filteredConfigurations.map((config) => ({
                      value: config.id,
                      label: config.name,
                    }))}
                    value={formData.Configuration_Type1.map((type) => ({
                      value: type.id,
                      label: type.name,
                    }))}
                    onChange={handleConfigurationChange}
                    placeholder="Select Configuration"
                  />
                  {/* {console.log("amenities", amenities)} */}
                  {/* {console.log("project_amenities", formData.project_amenities)} */}
                </div>
              </div>

              <div className="col-md-3 mt-1">
                <div className="form-group">
                  <label>
                    Project Name
                    <span className="otp-asterisk"> *</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="Project_Name"
                    value={formData.Project_Name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* {baseURL === "https://dev-panchshil-super-app.lockated.com/" && ( */}
              <div className="col-md-3 mt-1">
                <div className="form-group">
                  <label>
                    SFDC Project ID
                    <span className="otp-asterisk"> *</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="SFDC_Project_Id"
                    placeholder="Enter SFDC Project ID"
                    maxLength={18}
                    value={formData.SFDC_Project_Id}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* )} */}

              <div className="col-md-3 mt-1">
                <div className="form-group">
                  <label>
                    Location
                    <span className="otp-asterisk"> *</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Default input"
                    name="project_address"
                    value={formData.project_address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>Project Tag</label>
                  <SelectBox
                    options={[
                      //{ value: "", label: "Select status", isDisabled: true },
                      { value: "Featured", label: "Featured" },
                      { value: "Upcoming", label: "Upcoming" },
                    ]}
                    defaultValue={formData.project_tag}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        project_tag: value,
                      }))
                    }
                    // isDisableFirstOption={true}
                  />
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label>Project Description</label>
                  <textarea
                    className="form-control"
                    rows={1}
                    placeholder="Enter ..."
                    name="Project_Description"
                    value={formData.Project_Description}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Price Onward
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>

                  <input
                    className="form-control"
                    type="text-number"
                    placeholder="Default input"
                    name="Price_Onward"
                    value={formData.Price_Onward}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Project Size (Sq. Mtr.) (For Residential)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Project_Size_Sq_Mtr"
                    value={formData.Project_Size_Sq_Mtr}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Project Size (Sq. Ft.) (For Residential)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Project_Size_Sq_Ft"
                    value={formData.Project_Size_Sq_Ft}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Development Area (Sq. Mtr.) (For Office Park)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="development_area_sqmt"
                    placeholder="Enter Area Sq. Mt."
                    value={formData.development_area_sqmt}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Development Area (Sq. Ft.) (For Office Park)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="development_area_sqft"
                    placeholder="Enter Area in Sq. Ft."
                    value={formData.development_area_sqft}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Rera Carpet Area (Sq. M)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Rera_Carpet_Area_Sq_M"
                    value={formData.Rera_Carpet_Area_Sq_M}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Rare Carpet Area (Sq. Ft.)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Rera_Carpet_Area_sqft"
                    value={formData.Rera_Carpet_Area_sqft}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Rare Sellable Area
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text-number"
                    placeholder="Default input"
                    name="Rera_Sellable_Area"
                    value={formData.Rera_Sellable_Area}
                    onChange={handleChange}
                  />
                </div>
              </div> */}
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Number of Towers
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Number_Of_Towers"
                    value={formData.Number_Of_Towers}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Number of Floors
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="no_of_floors"
                    placeholder="Enter Number of Floors"
                    value={formData.no_of_floors}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Number of Units
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Number_Of_Units"
                    value={formData.Number_Of_Units}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Rera Number
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text-number"
                    placeholder="Default input"
                    name="Rera_Number"
                    value={formData.Rera_Number}
                    onChange={handleChange}
                  />
                </div>
              </div> */}
              {/* <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Amenities
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <MultiSelectBox
                    options={amenities.map((ammit) => ({
                      value: ammit.name,
                      label: ammit.name,
                    }))}
                    // value={formData?.Amenities
                    //   ?.map((id) => {
                    //     const ammit = amenities.find(
                    //       (ammit) => ammit.id === id
                    //     );
                    //     return ammit
                    //       ? { value: ammit.id, label: ammit.name }
                    //       : null;
                    //   })
                    //   .filter(Boolean)}

                    value={formData.Amenities.map((amenitie) => ({
                      value: amenitie,
                      label: amenitie,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        Amenities: selectedOptions.map(
                          (option) => option.value
                        ),
                      }))
                    }
                    placeholder="Select Amenities"
                  />
               
                </div>
              </div> */}

              {/* <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Specifications
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <MultiSelectBox
                    options={specifications.map((spec) => ({
                      value: spec.name,
                      label: spec.name,
                    }))}
                    // value={specifications
                    //   .filter((spec) =>
                    //     formData.Specifications.includes(spec.id)
                    //   )
                    //   .map((spec) => ({
                    //     value: spec.id,
                    //     label: spec.name,
                    //   }))}
                    value={formData.Specifications.map((spec) => ({
                      value: spec,
                      label: spec,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        Specifications: selectedOptions.map(
                          (option) => option.value
                        ),
                      }))
                    }
                    placeholder="Select Specifications"
                  />
                
                </div>
              </div> */}

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Land Area (Acres)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Land_Area"
                    value={formData.Land_Area}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Land UOM
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <SelectBox
                    options={[
                      { value: "Square Meter", label: "Square Meter" },
                      {
                        value: "Square Feet",
                        label: "Square Feet",
                      },
                      {
                        value: "Acre",
                        label: "Acre",
                      },
                      { value: "Hectare", label: "Hectare" },
                      { value: "Yard", label: "Yard" },
                      {
                        value: "Guntha",
                        label: "Guntha",
                      },
                      { value: "Bigha", label: "Bigha" },
                      { value: "Kanal", label: "Kanal" },
                      { value: "Marla", label: "Marla" },
                      { value: "Cent", label: "Cent" },
                      { value: "Ropani", label: "Ropani" },
                    ]}
                    defaultValue={formData.land_uom}
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        land_uom: selectedOption,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>Project Sales Type</label>
                  <SelectBox
                    options={[
                      { value: "Sales", label: "Sales" },
                      {
                        value: "Lease",
                        label: "Lease",
                      },
                    ]}
                    defaultValue={formData.project_sales_type}
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        project_sales_type: selectedOption,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Order Number
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>

                  <input
                    className="form-control"
                    type="text-number"
                    placeholder="Default input"
                    name="order_no"
                    value={formData.order_no}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>Disclaimer</label>
                  <textarea
                    className="form-control"
                    rows={1}
                    placeholder="Enter disclaimer..."
                    name="disclaimer"
                    value={formData.disclaimer}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Project QR Code Images
                    <span
                      className="tooltip-container"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      [i]
                      {showTooltip && (
                        <span className="tooltip-text">
                          Max Upload Size 50 MB
                        </span>
                      )}
                    </span>
                    <span className="otp-asterisk"> *</span>
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    name="project_qrcode_image"
                    accept="image/*"
                    multiple
                    onChange={handleQRCodeImageChange}
                  />
                </div>

                {/* Display uploaded or existing QR code images */}
                <div className="mt-2">
                  {formData.project_qrcode_image.length > 0 ? (
                    formData.project_qrcode_image.map((image, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <img
                          src={
                            image.isNew
                              ? URL.createObjectURL(image.project_qrcode_image) // Preview for new images
                              : image.document_url // URL for existing images
                          }
                          alt="QR Code Preview"
                          className="img-fluid rounded"
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "cover",
                            marginRight: "10px",
                          }}
                        />
                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder="Enter image name"
                          value={image.file_name || ""} // Always use title, don't fallback to file_name
                          onChange={(e) =>
                            handleQRCodeImageNameChange(index, e.target.value)
                          }
                          disabled={!image.isNew} // Disable input for existing images
                        />
                        <button
                          type="button"
                          className="purple-btn2"
                          onClick={() =>
                            handleRemoveQRCodeImage(
                              "project_qrcode_image",
                              index,
                              image.id
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <span>No images selected</span>
                  )}
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <label>Enable Enquiry</label>
                <div className="form-group">
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        enable_enquiry: !prev.enable_enquiry, // Toggle the boolean value
                      }))
                    }
                    className="toggle-button"
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      padding: 0,
                      width: "35px",
                    }}
                  >
                    {formData.enable_enquiry ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="30"
                        fill="var(--red)"
                        className="bi bi-toggle-on"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="30"
                        fill="#667085"
                        className="bi bi-toggle-off"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <label>Is Sold</label>
                <div className="form-group">
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        is_sold: !prev.is_sold, // Toggle the boolean value
                      }))
                    }
                    className="toggle-button"
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      padding: 0,
                      width: "35px",
                    }}
                  >
                    {formData.is_sold ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="30"
                        fill="var(--red)"
                        className="bi bi-toggle-on"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="30"
                        fill="#667085"
                        className="bi bi-toggle-off"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>Order Number</label>
                  <input
                    className="form-control"
                    type="number"
                    name="order_no"
                    placeholder="Enter Order Number"
                    value={formData.order_no}
                    onChange={handleChange}
                  />
                </div>
              </div> */}
              {/* <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Virtual Tour URL
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="virtual_tour_url"
                    placeholder="Enter Location"
                    value={formData.virtual_tour_url}
                    onChange={handleChange}
                  />
                </div>
              </div>              */}
            </div>
          </div>
        </div>
        {baseURL !== "https://dev-panchshil-super-app.lockated.com/" && (
                  <>
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3 d-flex justify-content-between align-items-center">
            <h3 className="card-title">RERA Number</h3>
          </div>
          <div className="card-body mt-0 pb-0">
            {/* Input Fields for New Entry */}
            <div className="row align-items-center">
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>Tower </label>
                  <input
                    className="form-control"
                    type="text"
                    name="tower_name"
                    placeholder="Enter Tower Name"
                    value={towerName}
                    onChange={handleTowerChange}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>RERA Number </label>
                  <input
                    className="form-control"
                    type="text"
                    name="rera_number"
                    placeholder="Enter RERA Number"
                    value={reraNumber}
                    onChange={handleReraNumberChange}
                    maxLength={12}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>RERA URL </label>
                  <input
                    className="form-control"
                    type="text"
                    name="rera_url"
                    placeholder="Enter RERA URL"
                    value={reraUrl}
                    onChange={handleReraUrlChange}
                  />
                </div>
              </div>

              {/* Add Button */}
              <div className="col-md-3 mt-2">
                <button
                  className="purple-btn2 rounded-3"
                  style={{ marginTop: "23px" }}
                  onClick={handleAddRera}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={26}
                    height={20}
                    fill="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span> Add</span>
                </button>
              </div>
            </div>

            {/* Editable RERA List Table */}
            {formData.Rera_Number_multiple.length > 0 && (
              <div className="col-md-12 mt-2">
                <div className="mt-4 tbl-container w-100">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr No</th>
                        <th>Tower Name</th>
                        <th>RERA Number</th>
                        <th>Rera URL</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.Rera_Number_multiple.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={item.tower_name}
                              onChange={(e) =>
                                handleEditRera(
                                  index,
                                  "tower_name",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={item.rera_number}
                              onChange={(e) =>
                                handleEditRera(
                                  index,
                                  "rera_number",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={item.rera_url}
                              onChange={(e) =>
                                handleEditRera(
                                  index,
                                  "rera_url",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="purple-btn2"
                              onClick={() => handleDeleteRera(index)}
                            >
                              x
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        </>
        )}

        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">Amenities</h3>
          </div>
          <div className="card-body mt-0 pb-0">
            <div className="row">
              {/* Amenity Type Dropdown */}
              {/* <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>Amenity Type</label>
                  <Select
                    options={amenityTypes}
                    value={selectedType}
                    onChange={setSelectedType}
                    placeholder="Select Amenity Type"
                  />
                </div>
              </div> */}

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Amenities
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <MultiSelectBox
                    options={filteredAmenities.map((ammit) => ({
                      value: ammit.id,
                      label: ammit.name,
                    }))}
                    value={formData.Amenities1.map((amenitie) => ({
                      value: amenitie.id,
                      label: amenitie.name,
                    }))}
                    onChange={handleAmenitiesChange}
                    placeholder="Select Amenities"
                  />
                  {/* {console.log("amenities", amenities)} */}
                  {/* {console.log("project_amenities", formData.project_amenities)} */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">Address</h3>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Address Section */}
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Address Line 1{" "}
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>{" "} */}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Address Line 1"
                    name="address_line_1"
                    value={formData.Address.address_line_1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Address Line 2
                    {/* <span style={{ color: "red", fontSize: "16px" }}>*</span>{" "} */}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Address Line 2"
                    name="address_line_2"
                    value={formData.Address.address_line_2}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* City, State, Pin, Country Section */}
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    City
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="City"
                    name="city"
                    value={formData.Address.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    State
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="State"
                    name="state"
                    value={formData.Address.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Pin Code
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Pin Code"
                    name="pin_code"
                    value={formData.Address.pin_code}
                    maxLength={6} // Restricts input to 6 characters
                    onChange={(e) => {
                      const { name, value } = e.target;
                      // Allow only numbers and ensure max 6 digits
                      if (/^\d*$/.test(value) && value.length <= 6) {
                        setFormData((prevData) => ({
                          ...prevData,
                          Address: { ...prevData.Address, [name]: value },
                        }));
                      }
                    }}
                    onBlur={(e) => {
                      const { name, value } = e.target;
                      if (value.length !== 6) {
                        toast.error("Pin Code must be exactly 6 digits");
                        setFormData((prevData) => ({
                          ...prevData,
                          Address: { ...prevData.Address, [name]: "" }, // Reset field on incorrect input
                        }));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Country
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={formData.Address.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Map URL
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="map_url"
                    placeholder="Enter Location"
                    value={formData.map_url}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {baseURL === "https://dev-panchshil-super-app.lockated.com/" && (
          <div className="card mt-3 pb-4 mx-4">
            <div className="card-header3">
              <h3 className="card-title">Plans</h3>
            </div>
            <div className="card-body mt-0 pb-0">
              <div className="row">
                <div className="d-flex justify-content-between align-items-end mx-1">
                  <h5 className="mt-3">
                    Project Plans{" "}
                    <span
                      className="tooltip-container"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      [i]
                      {showTooltip && (
                        <span className="tooltip-text">
                          Max Upload Size 10 MB per image
                        </span>
                      )}
                    </span>
                  </h5>
                </div>
                {/* <div className="row align-items-end"> */}
                <div className="col-md-3 mt-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Plan Name"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                </div>
                <div className="col-md-3 mt-2">
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPlanImages(Array.from(e.target.files))}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    className="purple-btn2"
                    type="button"
                    onClick={() => {
                      if (!planName || planImages.length === 0) {
                        toast.error(
                          "Please enter plan name and select images."
                        );
                        return;
                      }
                      setPlans((prev) => [
                        ...prev,
                        { name: planName, images: planImages },
                      ]);
                      setPlanName("");
                      setPlanImages([]);
                    }}
                  >
                    + Add
                  </button>
                </div>
                {/* </div> */}
                <div className="col-md-12">
                  <div className="mt-4 tbl-container">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th>Plan Name</th>
                          <th>Images</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plans.map((plan, pIdx) => (
                          <tr key={pIdx}>
                            <td>{plan.name}</td>
                            <td>
                              {plan.images.map((img, iIdx) => (
                                <img
                                  key={iIdx}
                                  src={
                                    img instanceof File || img instanceof Blob
                                      ? URL.createObjectURL(img)
                                      : typeof img === "string"
                                      ? img
                                      : img?.document_url || "" // fallback if img is an object like { url: "..." }
                                  }
                                  alt="Plan"
                                  style={{
                                    maxWidth: 60,
                                    maxHeight: 60,
                                    marginRight: 5,
                                  }}
                                />
                              ))}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="purple-btn2"
                                onClick={() => handlePlanDelete(plan.id, pIdx)}
                              >
                                x
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">
              File Upload
              {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
            </h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="d-flex justify-content-between align-items-end mx-1">
                <h5 className="mt-3">
                  Project Banner{" "}
                  <span
                    className="tooltip-container"
                    onMouseEnter={() => setShowTooltipBanner(true)}
                    onMouseLeave={() => setShowTooltipBanner(false)}
                  >
                    [i]
                    {showTooltipBanner && (
                      <span className="tooltip-text">
                        Max Upload Size 3 MB and {getDynamicRatiosText("ProjectImage")}
                      </span>
                    )}
                  </span>
                  <span className="otp-asterisk"> *</span>
                </h5>

                <button
                  className="purple-btn2 rounded-3"
                  fdprocessedid="xn3e6n"
                  type="button"
                  onClick={() => setShowBannerModal(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span>Add</span>
                </button>

                {showBannerModal && (
                  <ProjectBannerUpload
                    onClose={() => setShowBannerModal(false)}
                    includeInvalidRatios={false}
                    selectedRatioProp={selectedBannerRatios}
                    showAsModal={true}
                    label={bannerImageLabel}
                    description={dynamicDescription3}
                    onContinue={(validImages) =>
                      handleCroppedImages(validImages, "banner")
                    }
                  />
                )}
              </div>

              <div className="col-md-12 mt-2">
                <div className="mt-4 tbl-container">
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
                      {Array.isArray(formData.image) &&
                        formData.image.map((img, index) => (
                          <tr key={`banner-image-${index}`}>
                            <td>
                              {img.document_file_name ||
                                img.document_url ||
                                `Image ${index + 1}`}
                            </td>
                            <td>
                              {img.document_url && (
                                <img
                                  src={img.document_url}
                                  alt={
                                    img.document_file_name ||
                                    `Image ${index + 1}`
                                  }
                                  style={{
                                    maxWidth: 100,
                                    maxHeight: 100,
                                    objectFit: "cover",
                                  }}
                                  className="img-fluid rounded"
                                />
                              )}
                            </td>
                            <td>N/A</td>
                            <td>
                              <button
                                type="button"
                                className="purple-btn2"
                                onClick={() =>
                                  handleFileDiscardCoverImage("image", index)
                                }
                              >
                                x
                              </button>
                            </td>
                          </tr>
                        ))}

                      {project_banner.map(({ key, label }) => {
                        const files = formData[key] || [];
                        return files.map((file, index) => (
                          <tr key={`${key}-${index}`}>
                            <td>
                              {file.document_file_name ||
                                file.name ||
                                `Image ${index + 1}`}
                            </td>
                            <td>
                              <img
                                style={{ maxWidth: 100, maxHeight: 100 }}
                                className="img-fluid rounded"
                                src={file.document_url || file.preview}
                                alt={
                                  file.document_file_name ||
                                  file.name ||
                                  `Image ${index + 1}`
                                }
                              />
                            </td>
                            <td>{file.ratio || label}</td>
                            <td>
                              <button
                                type="button"
                                className="purple-btn2"
                                onClick={() =>
                                  handleFileDiscardCoverImage(key, index)
                                }
                              >
                                x
                              </button>
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gallery Section */}
              <div className="d-flex justify-content-between align-items-end mx-1">
                <h5 className="mt-3">
                  Project Cover Images{" "}
                  <span
                    className="tooltip-container"
                    onMouseEnter={() => setShowTooltipCover(true)}
                    onMouseLeave={() => setShowTooltipCover(false)}
                  >
                    [i]
                    {showTooltipCover && (
                      <span className="tooltip-text">
                        Max Upload Size 5 MB and {getDynamicRatiosText("ProjectCoverImage")}
                      </span>
                    )}
                  </span>
                  {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                </h5>

                {
                  <button
                    className="purple-btn2 rounded-3"
                    fdprocessedid="xn3e6n"
                    type="button"
                    onClick={() => setShowUploader(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      className="bi bi-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                    </svg>
                    <span>Add</span>
                  </button>
                }

                {showUploader && (
                  <ProjectImageVideoUpload
                    onClose={() => setShowUploader(false)}
                    includeInvalidRatios={false}
                    selectedRatioProp={selectedCoverRatios}
                    showAsModal={true}
                    label={coverImageLabel}
                    description={dynamicDescription}
                    onContinue={(validImages, videoFiles) =>
                      handleCroppedCoverImages(validImages, videoFiles, "cover")
                    }
                    allowVideos={true}
                  />
                )}
              </div>

              <div className="col-md-12 mt-2">
                <div className="mt-4 tbl-container">
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
                      {formData.cover_images?.map((file, index) => (
                        <tr key={index}>
                          <td>{file.document_file_name || file.name}</td>{" "}
                          {/* Show name from API or uploaded file */}
                          <td>
                            <img
                              style={{ maxWidth: 100, maxHeight: 100 }}
                              className="img-fluid rounded"
                              src={
                                file.document_url // API response images
                                  ? file.document_url
                                  : file.type && file.type.startsWith("image") // Avoid error if file.type is undefined
                                  ? URL.createObjectURL(file)
                                  : null
                              }
                              alt={
                                file.document_file_name || file.name || "Image"
                              }
                            />
                          </td>
                          <td>N/A</td>
                          <td>
                            <button
                              type="button"
                              className="purple-btn2"
                              onClick={() =>
                                handleFileDiscardCoverImage(
                                  "cover_images",
                                  index
                                )
                              }
                            >
                              x
                            </button>
                          </td>
                        </tr>
                      ))}
                      {coverImageRatios.map(({ key, label }) => {
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
                                    handleFileDiscardCoverImage(key, index)
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

                {/* Uploader Component */}
                {showUploader && (
                  <ProjectBannerUpload
                    onClose={() => setShowUploader(false)}
                    includeInvalidRatios={false}
                    selectedRatioProp={selectedCoverRatios}
                    showAsModal={true}
                    label={coverImageLabel}
                    description={dynamicDescription}
                    onContinue={(validImages) =>
                      handleCroppedImages(validImages, "cover")
                    }
                  />
                )}
              </div>

              <div className="d-flex justify-content-between align-items-end mx-1">
                <h5 className="mt-3">
                  Gallery Images{" "}
                  <span
                    className="tooltip-container"
                    onMouseEnter={() => setShowTooltipGallery(true)}
                    onMouseLeave={() => setShowTooltipGallery(false)}
                  >
                    [i]
                    {showTooltipGallery && (
                      <span className="tooltip-text">
                        Max Upload Size 3 MB and {getDynamicRatiosText("ProjectGallery")}
                      </span>
                    )}
                  </span>
                  {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                </h5>

                <div className="d-flex align-items-center">
                </div>

                <button
                  className="purple-btn2 rounded-3"
                  fdprocessedid="xn3e6n"
                  type="button"
                  onClick={() => setShowGalleryModal(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span>Add</span>
                </button>
                
                {/* MODIFIED: Replaced ProjectBannerUpload with ProjectImageVideoUpload for Gallery */}
                {showGalleryModal && (
                  <ProjectImageVideoUpload
                    onClose={() => setShowGalleryModal(false)}
                    selectedRatioProp={selectedGalleryRatios}
                    showAsModal={true}
                    label={galleryImageLabel}
                    description={dynamicDescription1}
                    onContinue={(validImages, videoFiles) =>
                      handleCroppedCoverImages(validImages, videoFiles, "gallery")
                    }
                    allowVideos={true}
                  />
                )}
              </div>

              {/* Main Section */}
              <div className="col-md-12 mt-2">
                <div
                  className="mt-4 tbl-container"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Image Name</th>
                        <th>Preview</th>
                        <th>Ratio</th>
                        <th>Order No.</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.fetched_gallery_image?.map((file, index) =>
                        file.attachfiles?.map((attachment, idx) => (
                          <tr key={`fetched-${index}-${idx}`}>
                            <td>{attachment.document_file_name || "N/A"}</td>
                            <td>
                              {attachment.document_url && (
                                <img
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  className="img-fluid rounded"
                                  src={attachment.document_url}
                                  alt={
                                    attachment.document_file_name ||
                                    "Fetched Image"
                                  }
                                />
                              )}
                            </td>
                            <td>
                              N/A
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={attachment.order_no || ""}
                                onChange={(e) => {
                                  // Update fetched gallery image order_no
                                  // Note: This would need backend support for persistence
                                }}
                                placeholder="Enter order no."
                                style={{
                                  minWidth: "100px",
                                  fontSize: "14px",
                                }}
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="purple-btn2"
                                onClick={() =>
                                  handleFetchedDiscardGallery(
                                    "fetched_gallery_image",
                                    index,
                                    attachment.id
                                  )
                                }
                              >
                                x
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                      {/* MODIFIED: Updated gallery table to render videos */}
                      {gallery_images.map(({ key, label }) => {
                        const files = formData[key] || [];
                        return files.map((file, index) => {
                          const preview = file.preview || (file.file ? URL.createObjectURL(file.file) : null) || file.document_url || "";
                          const name = file.file_name || file.document_file_name || file.name || "Unnamed";
                          const isVideo = file.type === "video" || (file.file && file.file.type.startsWith("video/")) || (file.document_url && [".mp4", ".webm", ".ogg"].some(ext => file.document_url.toLowerCase().endsWith(ext))) || (preview && [".mp4", ".webm", ".ogg"].some(ext => preview.toLowerCase().endsWith(ext)));

                          return (
                            <tr key={`${key}-${index}`}>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={file.file_name || ""}
                                  onChange={(e) =>
                                    handleGalleryImageNameChange(key, index, e.target.value)
                                  }
                                  placeholder="Enter image name"
                                  style={{
                                    minWidth: "150px",
                                    fontSize: "14px",
                                  }}
                                />
                              </td>
                              <td>
                                {isVideo ? (
                                  <video
                                    controls
                                    style={{ maxWidth: 100, maxHeight: 100 }}
                                    className="img-fluid rounded"
                                    key={preview}
                                  >
                                    <source
                                      src={preview}
                                      type={
                                        file.file?.type ||
                                        (file.document_url
                                          ? `video/${file.document_url.split(".").pop()}`
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
                                <input
                                  type="number"
                                  className="form-control"
                                  value={file.order_no || ""}
                                  onChange={(e) =>
                                    handleGalleryImageOrderChange(key, index, e.target.value)
                                  }
                                  placeholder="Enter order no."
                                 style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    padding: "5px 8px",
                                    fontSize: "14px",
                                    width: "80px"
                                  }}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() => {
                                    handleFetchedDiscardGallery(
                                      key,
                                      index,
                                      file.id
                                    );
                                  }}
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

              {baseURL !== "https://dev-panchshil-super-app.lockated.com/" && (
                  <>
                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Floor Plan{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltipFloor(true)}
                        onMouseLeave={() => setShowTooltipFloor(false)}
                      >
                        [i]
                        {showTooltipFloor && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB and {getDynamicRatiosText("Project2DImage")}
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                    </h5>
                    <button
                      className="purple-btn2 rounded-3"
                      fdprocessedid="xn3e6n"
                      type="button"
                      onClick={() => setShowFloorPlanModal(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>

                    {showFloorPlanModal && (
                      <ProjectBannerUpload
                        onClose={() => setShowFloorPlanModal(false)}
                        selectedRatioProp={selectedFloorRatios}
                        showAsModal={true}
                        label={floorImageLabel}
                        description={dynamicDescription2}
                        onContinue={(validImages) =>
                          handleCroppedImages(validImages, "floor")
                        }
                      />
                    )}
                  </div>

                  {/* Table to Display Images */}
                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
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
                          {formData.two_d_images.map((file, index) => (
                            <tr key={index}>
                              <td>{file.document_file_name || file.name}</td>{" "}
                              {/* Show name from API or uploaded file */}
                              <td>
                                <img
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  className="img-fluid rounded"
                                  src={
                                    file.document_url // API response images
                                      ? file.document_url
                                      : file.type &&
                                        file.type.startsWith("image") // Avoid error if file.type is undefined
                                      ? URL.createObjectURL(file)
                                      : null
                                  }
                                  alt={
                                    file.document_file_name ||
                                    file.name ||
                                    "Image"
                                  }
                                />
                              </td>
                              <td>N/A</td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() =>
                                    handleDiscardTwoDImage(
                                      "two_d_images",
                                      index
                                    )
                                  }
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          ))}
                          {floorPlanRatios.map(({ key, label }) => {
                            const files = formData[key] || [];

                            return files.map((file, index) => (
                              <tr key={`${key}-${index}`}>
                                <td>
                                  {file.document_file_name ||
                                    file.name ||
                                    `Image ${index + 1}`}
                                </td>
                                <td>
                                  <img
                                    style={{ maxWidth: 100, maxHeight: 100 }}
                                    className="img-fluid rounded"
                                    src={file.document_url || file.preview}
                                    alt={
                                      file.document_file_name ||
                                      file.name ||
                                      `Image ${index + 1}`
                                    }
                                  />
                                </td>
                                <td>{file.ratio || label}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="purple-btn2"
                                    onClick={() =>
                                      handleFileDiscardCoverImage(key, index)
                                    }
                                  >
                                    x
                                  </button>
                                </td>
                              </tr>
                            ));
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              <div className="d-flex justify-content-between align-items-end mx-1">
                <h5 className="mt-3">
                  Brochure{" "}
                  <span
                    className="tooltip-container"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    [i]
                    {showTooltip && (
                      <span className="tooltip-text">Max Upload Size 5 MB</span>
                    )}
                  </span>
                  {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                </h5>

                <button
                  className="purple-btn2 rounded-3"
                  onClick={() => document.getElementById("brochure").click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={26}
                    height={20}
                    fill="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span>Add</span>
                </button>

                <input
                  id="brochure"
                  className="form-control"
                  type="file"
                  name="brochure"
                  accept=".pdf,.docx"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </div>

              <div className="col-md-12 mt-2">
                <div className="mt-4 tbl-container w-100">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {formData.brochure &&
                        (formData.brochure.name ||
                          formData.brochure.document_file_name) && (
                          <tr>
                            <td>
                              {formData.brochure.name ||
                                formData.brochure.document_file_name}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="purple-btn2"
                                onClick={() =>
                                  handleDiscardBroucher("brochure")
                                }
                              >
                                x
                              </button>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>

             {baseURL !== "https://dev-panchshil-super-app.lockated.com/" && (
                  <>
                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Project PPT{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 5 MB
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}>*</span> */}
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      onClick={() =>
                        document.getElementById("project_ppt").click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>

                    <input
                      id="project_ppt"
                      className="form-control"
                      type="file"
                      name="project_ppt"
                      accept=".ppt, .pptx"
                      onChange={(e) =>
                        handleFileUpload("project_ppt", e.target.files)
                      }
                      multiple
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(formData.project_ppt ?? []).length > 0 ? (
                            formData.project_ppt.map((file, index) => (
                              <tr key={`ppt-${index}`}>
                                <td>
                                  {file.name ||
                                    file.document_file_name ||
                                    file ||
                                    "No File"}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="purple-btn2"
                                    onClick={() =>
                                      handleDiscardFilePpt("project_ppt", index)
                                    }
                                  >
                                    x
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              {/* <td colSpan={2}>No PPT files uploaded</td> */}
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2D Images */}

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Project Layout{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      fdprocessedid="xn3e6n"
                      onClick={() =>
                        document.getElementById("project_layout").click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>

                    <input
                      id="project_layout"
                      className="form-control"
                      type="file"
                      name="project_layout"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("project_layout", e.target.files)
                      }
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Preview</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 2D Images */}
                          {formData.project_layout.map((file, index) => (
                            <tr key={index}>
                              <td>{file.document_file_name || file.name}</td>{" "}
                              {/* Show name from API or uploaded file */}
                              <td>
                                <img
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  className="img-fluid rounded"
                                  src={
                                    file.document_url // API response images
                                      ? file.document_url
                                      : file.type &&
                                        file.type.startsWith("image") // Avoid error if file.type is undefined
                                      ? URL.createObjectURL(file)
                                      : null
                                  }
                                  alt={
                                    file.document_file_name ||
                                    file.name ||
                                    "Image"
                                  }
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() =>
                                    handleFileDiscardLayout(
                                      "project_layout",
                                      index
                                    )
                                  }
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Project Creatives{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      fdprocessedid="xn3e6n"
                      onClick={() =>
                        document.getElementById("project_creatives").click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    <input
                      id="project_creatives"
                      className="form-control"
                      type="file"
                      name="project_creatives"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("project_creatives", e.target.files)
                      }
                      multiple
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Preview</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 2D Images */}
                          {formData.project_creatives.map((file, index) => (
                            <tr key={index}>
                              <td>{file.document_file_name || file.name}</td>{" "}
                              {/* Show name from API or uploaded file */}
                              <td>
                                <img
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  className="img-fluid rounded"
                                  src={
                                    file.document_url // API response images
                                      ? file.document_url
                                      : file.type &&
                                        file.type.startsWith("image") // Avoid error if file.type is undefined
                                      ? URL.createObjectURL(file)
                                      : null
                                  }
                                  alt={
                                    file.document_file_name ||
                                    file.name ||
                                    "Image"
                                  }
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() =>
                                    handleFileDiscardCreative(
                                      "project_creatives",
                                      index
                                    )
                                  }
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Project Creative Generics{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      fdprocessedid="xn3e6n"
                      onClick={() =>
                        document
                          .getElementById("project_creative_generics")
                          .click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    <input
                      id="project_creative_generics"
                      className="form-control"
                      type="file"
                      name="project_creative_generics"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          "project_creative_generics",
                          e.target.files
                        )
                      }
                      multiple
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Preview</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 2D Images */}
                          {formData.project_creative_generics.map(
                            (file, index) => (
                              <tr key={index}>
                                <td>{file.document_file_name || file.name}</td>{" "}
                                {/* Show name from API or uploaded file */}
                                <td>
                                  <img
                                    style={{ maxWidth: 100, maxHeight: 100 }}
                                    className="img-fluid rounded"
                                    src={
                                      file.document_url // API response images
                                        ? file.document_url
                                        : file.type &&
                                          file.type.startsWith("image") // Avoid error if file.type is undefined
                                        ? URL.createObjectURL(file)
                                        : null
                                    }
                                    alt={
                                      file.document_file_name ||
                                      file.name ||
                                      "Image"
                                    }
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="purple-btn2"
                                    onClick={() =>
                                      handleFileDiscardCreativeGenerics(
                                        "project_creative_generics",
                                        index
                                      )
                                    }
                                  >
                                    x
                                  </button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Project Creative Offers{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      fdprocessedid="xn3e6n"
                      onClick={() =>
                        document
                          .getElementById("project_creative_offers")
                          .click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    <input
                      id="project_creative_offers"
                      className="form-control"
                      type="file"
                      name="project_creative_offers"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          "project_creative_offers",
                          e.target.files
                        )
                      }
                      multiple
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Preview</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 2D Images */}
                          {formData.project_creative_offers.map(
                            (file, index) => (
                              <tr key={index}>
                                <td>{file.document_file_name || file.name}</td>{" "}
                                {/* Show name from API or uploaded file */}
                                <td>
                                  <img
                                    style={{ maxWidth: 100, maxHeight: 100 }}
                                    className="img-fluid rounded"
                                    src={
                                      file.document_url // API response images
                                        ? file.document_url
                                        : file.type &&
                                          file.type.startsWith("image") // Avoid error if file.type is undefined
                                        ? URL.createObjectURL(file)
                                        : null
                                    }
                                    alt={
                                      file.document_file_name ||
                                      file.name ||
                                      "Image"
                                    }
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="purple-btn2"
                                    onClick={() =>
                                      handleFileDiscardCreativeOffers(
                                        "project_creative_offers",
                                        index
                                      )
                                    }
                                  >
                                    x
                                  </button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Project Interiors{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      fdprocessedid="xn3e6n"
                      onClick={() =>
                        document.getElementById("project_interiors").click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    <input
                      id="project_interiors"
                      className="form-control"
                      type="file"
                      name="project_interiors"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("project_interiors", e.target.files)
                      }
                      multiple
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Preview</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 2D Images */}
                          {formData.project_interiors.map((file, index) => (
                            <tr key={index}>
                              <td>{file.document_file_name || file.name}</td>{" "}
                              {/* Show name from API or uploaded file */}
                              <td>
                                <img
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  className="img-fluid rounded"
                                  src={
                                    file.document_url // API response images
                                      ? file.document_url
                                      : file.type &&
                                        file.type.startsWith("image") // Avoid error if file.type is undefined
                                      ? URL.createObjectURL(file)
                                      : null
                                  }
                                  alt={
                                    file.document_file_name ||
                                    file.name ||
                                    "Image"
                                  }
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() =>
                                    handleFileDiscardInteriors(
                                      "project_interiors",
                                      index
                                    )
                                  }
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Project Exteriors{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      fdprocessedid="xn3e6n"
                      onClick={() =>
                        document.getElementById("project_exteriors").click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    <input
                      id="project_exteriors"
                      className="form-control"
                      type="file"
                      name="project_exteriors"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("project_exteriors", e.target.files)
                      }
                      multiple
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Preview</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 2D Images */}
                          {formData.project_exteriors.map((file, index) => (
                            <tr key={index}>
                              <td>{file.document_file_name || file.name}</td>{" "}
                              {/* Show name from API or uploaded file */}
                              <td>
                                <img
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  className="img-fluid rounded"
                                  src={
                                    file.document_url // API response images
                                      ? file.document_url
                                      : file.type &&
                                        file.type.startsWith("image") // Avoid error if file.type is undefined
                                      ? URL.createObjectURL(file)
                                      : null
                                  }
                                  alt={
                                    file.document_file_name ||
                                    file.name ||
                                    "Image"
                                  }
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() =>
                                    handleFileDiscardExteriors(
                                      "project_exteriors",
                                      index
                                    )
                                  }
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Project Emailer Template{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 5 MB
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      onClick={() =>
                        document
                          .getElementById("project_emailer_templetes")
                          .click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    <input
                      id="project_emailer_templetes"
                      className="form-control"
                      type="file"
                      name="project_emailer_templetes"
                      accept=".pdf,.docx"
                      onChange={(e) =>
                        handleFileUpload(
                          "project_emailer_templetes",
                          e.target.files
                        )
                      }
                      multiple
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Project PPT Files */}
                          {formData.project_emailer_templetes &&
                            (Array.isArray(
                              formData.project_emailer_templetes
                            ) ? (
                              // If it's an array of files
                              formData.project_emailer_templetes.map(
                                (file, index) => (
                                  <tr key={`emailer-${index}`}>
                                    <td>
                                      {file?.name ||
                                        file?.document_file_name ||
                                        "No File"}
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        className="purple-btn2"
                                        onClick={() =>
                                          handleFileDiscardEmailerTemplate(
                                            "project_emailer_templetes",
                                            index
                                          )
                                        }
                                      >
                                        x
                                      </button>
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td>
                                  {formData.project_emailer_templetes?.name ||
                                    formData.project_emailer_templetes
                                      ?.document_file_name ||
                                    "No File"}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="purple-btn2"
                                    onClick={() =>
                                      handleDiscardFile(
                                        "project_emailer_templetes",
                                        0
                                      )
                                    }
                                  >
                                    x
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Project Know Your Apartment Files{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 20 MB
                          </span>
                        )}
                      </span>
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      onClick={() =>
                        document
                          .getElementById("KnwYrApt_Technical")
                          .click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    <input
                      id="KnwYrApt_Technical"
                      className="form-control"
                      type="file"
                      name="KnwYrApt_Technical"
                      accept=".pdf,.docx"
                      onChange={(e) =>
                        handleFileUpload(
                          "KnwYrApt_Technical",
                          e.target.files
                        )
                      }
                      multiple
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Technical Files */}
                          {formData.KnwYrApt_Technical &&
                            (Array.isArray(
                              formData.KnwYrApt_Technical
                            ) ? (
                              // If it's an array of files
                              formData.KnwYrApt_Technical.map(
                                (file, index) => (
                                  <tr key={`technical-${index}`}>
                                    <td>
                                      {file?.name ||
                                        file?.document_file_name ||
                                        "No File"}
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        className="purple-btn2"
                                        onClick={() =>
                                          handleFileDiscardTechnical(
                                            "KnwYrApt_Technical",
                                            index
                                          )
                                        }
                                      >
                                        x
                                      </button>
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td>
                                  {formData.KnwYrApt_Technical?.name ||
                                    formData.KnwYrApt_Technical
                                      ?.document_file_name ||
                                    "No File"}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="purple-btn2"
                                    onClick={() =>
                                      handleDiscardFile(
                                        "KnwYrApt_Technical",
                                        0
                                      )
                                    }
                                  >
                                    x
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Videos{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 10 MB
                          </span>
                        )}
                      </span>
                      {/* <span style={{ color: "#de7008", fontSize: "16px" }}> *</span> */}
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      fdprocessedid="xn3e6n"
                      onClick={() => document.getElementById("videos").click()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    <input
                      id="videos"
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      name="videos"
                      onChange={handleChange}
                      multiple
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Videos</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Videos */}
                          {formData.videos.map((file, index) => (
                            <tr key={index}>
                              {/* Ensure filename is displayed correctly */}
                              <td>
                                {file.document_file_name ||
                                  file.name ||
                                  "No Name"}
                              </td>
                              <td>
                                <video
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  className="img-fluid rounded"
                                  src={
                                    file.document_url // API response video
                                      ? file.document_url
                                      : file instanceof File // Uploaded video file
                                      ? URL.createObjectURL(file)
                                      : ""
                                  }
                                  autoPlay
                                  muted
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() =>
                                    handleFileDiscard("videos", index)
                                  }
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Video Preview Image Url</label>
                    <input
                      className="form-control"
                      rows={1}
                      name="video_preview_image_url"
                      placeholder="Enter Video Url"
                      value={formData.video_preview_image_url}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {baseURL !== "https://dev-panchshil-super-app.lockated.com/" && (
                  <>
            <div className="card mt-3 pb-4 mx-4">
              <div className="card-header3 d-flex justify-content-between align-items-center">
                <h3 className="card-title">Virtual Tour</h3>
              </div>
              <div className="card-body mt-0 pb-0">
                {/* Input Fields */}
                <div className="row align-items-center">
                  <div className="col-md-3 mt-2">
                    <div className="form-group">
                      <label>
                        Virtual Tour Name{" "}
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="virtual_tour_name"
                        placeholder="Enter Virtual Tour Name"
                        value={virtualTourName}
                        onChange={handleVirtualTourNameChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mt-2">
                    <div className="form-group">
                      <label>
                        Virtual Tour URL{" "}
                      </label>
                      <input
                        className="form-control"
                        type="url"
                        name="virtual_tour_url"
                        placeholder="Enter Virtual Tour URL"
                        value={virtualTourUrl}
                        onChange={handleVirtualTourChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mt-2">
                    <button
                      className="purple-btn2 rounded-3"
                      style={{ marginTop: "23px" }}
                      onClick={handleAddVirtualTour}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={26}
                        height={20}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span> Add</span>
                    </button>
                  </div>
                </div>

                {formData.virtual_tour_url_multiple.length > 0 && (
                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container w-100">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr No</th>
                            <th>Tour Name</th>
                            <th>Tour URL</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.virtual_tour_url_multiple.map(
                            (tour, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {/* Editable Tour Name */}
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={tour.virtual_tour_name}
                                    onChange={(e) =>
                                      handleEditVirtualTour(
                                        index,
                                        "virtual_tour_name",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                {/* Editable Tour URL */}
                                <td>
                                  <input
                                    type="url"
                                    className="form-control"
                                    value={tour.virtual_tour_url}
                                    onChange={(e) =>
                                      handleEditVirtualTour(
                                        index,
                                        "virtual_tour_url",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                {/* Delete Button */}
                                <td>
                                  <button
                                    type="button"
                                    className="purple-btn2"
                                    onClick={() =>
                                      handleDeleteVirtualTour(index)
                                    }
                                  >
                                    x
                                  </button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <div className="row mt-2 justify-content-center">
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
    </>
  );
};

export default ProjectDetailsEdit;