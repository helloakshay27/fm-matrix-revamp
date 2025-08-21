import React, { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  MapPin,
  Package,
  Shield,
  Activity,
  TrendingUp,
  BarChart,
  Paperclip,
  Zap,
  Sun,
  Droplet,
  Recycle,
  BarChart3,
  Plug,
  Frown,
  Wind,
  ArrowDown,
  ArrowUp,
  Building,
  Truck,
  CloudRain,
  Percent,
  Users,
  Settings,
  ArrowLeft,
  Layers,
  FileText,
  Building2,
  Ruler,
  Construction,
  Archive,
  Calendar,
  DollarSign,
  CheckCircle,
  Wrench,
  Car,
  Cog,
  Users2,
  TrendingUp as Performance,
  ShieldCheck,
  Edit3,
  Check,
  Info,
} from "lucide-react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AddCustomFieldModal } from "@/components/AddCustomFieldModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocationData } from "@/hooks/useLocationData";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import apiClient from "@/utils/apiClient";
import { MeterMeasureFields } from "@/components/asset/MeterMeasureFields";
import { FormatShapes } from "@mui/icons-material";
import { toast } from "sonner";
import { assetFieldsConfig } from "../config/assetFieldsConfig";

// Image compression function
const compressImage = async (
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

// Asset Image Upload Component
const AssetImageUpload = ({
  categoryName,
  categoryKey,
  onImageUpload,
  onImageRemove,
  images = [],
}: {
  categoryName: string;
  categoryKey: string;
  onImageUpload: (key: string, files: FileList | null) => void;
  onImageRemove: (key: string, index: number) => void;
  images: File[];
}) => {
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Only allow one image per asset
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File Type", {
        description: "Please upload only image files (JPG, PNG, GIF, etc.)",
      });
      return;
    }

    // Check file size
    if (file.size > maxFileSize) {
      toast.error("File Too Large", {
        description: "Image size should be less than 10MB",
      });
      return;
    }

    try {
      // Compress image if needed
      const compressedFile = await compressImage(file, 1200, 0.8);
      // Create a FileList-like object with the compressed file
      const fileList = Object.assign([compressedFile], {
        item: (index: number) => (index === 0 ? compressedFile : null),
        length: 1,
      }) as unknown as FileList;
      onImageUpload(categoryKey, fileList);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Processing Error", {
        description: "Error processing image. Please try again.",
      });
    }
  };

  return (
    <> </>
    // <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
    //   <div className="border-l-4 border-l-[#C72030] p-4 bg-white">
    //     <div className="flex items-center gap-2 text-[#C72030] text-sm font-semibold mb-4">
    //       <span className="bg-[#C72030] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
    //         <Package className="w-3 h-3" />
    //       </span>
    //       {categoryName.toUpperCase()} ASSET IMAGE
    //     </div>

    //     {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    //       {images.length > 0 ? (
    //         <div className="space-y-4">
    //           <div className="relative inline-block">
    //             <img
    //               src={URL.createObjectURL(images[0])}
    //               alt="Asset preview"
    //               className="max-w-full h-48 object-cover rounded-lg shadow-md"
    //             />
    //             <button
    //               onClick={() => onImageRemove(categoryKey, 0)}
    //               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
    //             >
    //               <X className="w-4 h-4" />
    //             </button>
    //           </div>
    //           <div className="text-sm text-gray-600">
    //             <p className="font-medium">{images[0].name}</p>
    //             <p className="text-xs text-gray-500">
    //               {(images[0].size / 1024 / 1024).toFixed(2)} MB
    //             </p>
    //           </div>
    //           <div>
    //             <input
    //               type="file"
    //               accept="image/*"
    //               onChange={(e) => handleImageUpload(e.target.files)}
    //               className="hidden"
    //               id={`${categoryKey}-image-replace`}
    //             />
    //             <label
    //               htmlFor={`${categoryKey}-image-replace`}
    //               className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 cursor-pointer transition-colors"
    //             >
    //               <Package className="w-4 h-4" />
    //               Replace Image
    //             </label>
    //           </div>
    //         </div>
    //       ) : (
    //         <div>
    //           <input
    //             type="file"
    //             accept="image/*"
    //             onChange={(e) => handleImageUpload(e.target.files)}
    //             className="hidden"
    //             id={`${categoryKey}-image-upload`}
    //           />
    //           <label htmlFor={`${categoryKey}-image-upload`} className="cursor-pointer">
    //             <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
    //             <p className="text-lg font-medium text-gray-700 mb-2">Upload Asset Image</p>
    //             <p className="text-sm text-gray-500 mb-4">
    //               Click to upload an image of your {categoryName.toLowerCase()}
    //             </p>
    //             <div className="inline-flex items-center gap-2 bg-[#f6f4ee] text-[#C72030] px-6 py-3 rounded-md hover:bg-[#f0ebe0] transition-colors">
    //               <Package className="w-5 h-5" />
    //               Choose Image
    //             </div>
    //             <p className="text-xs text-gray-400 mt-3">
    //               Supported formats: JPG, PNG, GIF (Max 10MB)
    //             </p>
    //           </label>
    //         </div>
    //       )}
    //     </div> */}
    //   </div>
    // </div>
  );
};

const AddAssetPage = () => {
  const navigate = useNavigate();

  // Location data hook
  const {
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    loading,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
    fetchRooms,
  } = useLocationData();

  const [submitting, setSubmitting] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    location: true,
    asset: true,
    warranty: true,
    meterCategory: true,
    consumption: true,
    nonConsumption: true,
    assetAllocation: true,
    assetLoaned: true,
    amcDetails: true,
    attachments: true,
  });

  // Location state
  const [selectedLocation, setSelectedLocation] = useState({
    site: "",
    building: "",
    wing: "",
    area: "",
    floor: "",
    room: "",
  });

  // ...existing code...
  const sectionGroupMap = {
    // Land
    basicIdentification: {
      group_name: "Basic Identification",
      category_name: "Land",
    },
    locationOwnership: {
      group_name: "Location & Ownership",
      category_name: "Land",
    },
    landSizeValue: { group_name: "Land Size & Value", category_name: "Land" },
    landUsageDevelopment: {
      group_name: "Land Usage & Development",
      category_name: "Land",
    },
    miscellaneous: { group_name: "Miscellaneous", category_name: "Land" },
    // Leasehold Improvement
    leaseholdBasicId: {
      group_name: "Basic Identification",
      category_name: "Leasehold Improvement",
    },
    leaseholdLocationAssoc: {
      group_name: "Location & Association",
      category_name: "Leasehold Improvement",
    },
    improvementDetails: {
      group_name: "Improvement Details",
      category_name: "Leasehold Improvement",
    },
    leaseholdFinancial: {
      group_name: "Financial & Depreciation",
      category_name: "Leasehold Improvement",
    },
    leaseholdLease: {
      group_name: "Lease & Maintenance Linkages",
      category_name: "Leasehold Improvement",
    },
    leaseholdOversight: {
      group_name: "Oversight & Documentation",
      category_name: "Leasehold Improvement",
    },
    // Vehicle
    vehicleBasicId: {
      group_name: "Basic Identification",
      category_name: "Vehicle",
    },
    vehicleTechnicalSpecs: {
      group_name: "Technical Specifications",
      category_name: "Vehicle",
    },
    vehicleOwnership: {
      group_name: "Ownership & Usage",
      category_name: "Vehicle",
    },
    vehicleFinancial: {
      group_name: "Financial & Depreciation",
      category_name: "Vehicle",
    },
    vehiclePerformance: {
      group_name: "Performance Tracking",
      category_name: "Vehicle",
    },
    vehicleLegal: {
      group_name: "Legal & Compliance",
      category_name: "Vehicle",
    },
    vehicleMiscellaneous: {
      group_name: "Miscellaneous",
      category_name: "Vehicle",
    },
    // Building
    buildingBasicId: {
      group_name: "Basic Identification",
      category_name: "Building",
    },
    buildingLocation: {
      group_name: "Location & Ownership",
      category_name: "Building",
    },
    buildingConstruction: {
      group_name: "Construction Details",
      category_name: "Building",
    },
    buildingAcquisition: {
      group_name: "Acquisition & Value",
      category_name: "Building",
    },
    buildingUsage: {
      group_name: "Usage & Compliance",
      category_name: "Building",
    },
    buildingMaintenance: {
      group_name: "Maintenance & Linkages",
      category_name: "Building",
    },
    buildingMiscellaneous: {
      group_name: "Miscellaneous",
      category_name: "Building",
    },
  };
  // ...existing code...

  // Group and Subgroup state
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSubgroup, setSelectedSubgroup] = useState("");
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [subgroupsLoading, setSubgroupsLoading] = useState(false);
  const [parentMeters, setParentMeters] = useState<
    { id: number; name: string }[]
  >([]);
  const [parentMeterLoading, setParentMeterLoading] = useState(false);
  const [selectedParentMeterId, setSelectedParentMeterId] =
    useState<string>("");

  // Vendors state
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [selectedAmcVendorId, setSelectedAmcVendorId] = useState<string>("");
  const [selectedLoanedVendorId, setSelectedLoanedVendorId] =
    useState<string>("");

  // Departments and Users state
  const [departments, setDepartments] = useState<
    { id: number; department_name: string }[]
  >([]);
  const [users, setUsers] = useState<{ id: number; full_name: string }[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  // const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  // const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Depreciation similar product states
  const [assets, setAssets] = useState<{ id: number; name: string }[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [subGroups, setSubGroups] = useState<{ id: number; name: string }[]>(
    []
  );
  const [subGroupsLoading, setSubGroupsLoading] = useState(false);

  const [itAssetsToggle, setItAssetsToggle] = useState(false);
  const [meterDetailsToggle, setMeterDetailsToggle] = useState(false);
  const [assetLoanedToggle, setAssetLoanedToggle] = useState(false);
  const [depreciationToggle, setDepreciationToggle] = useState(false);
  const [meterCategoryType, setMeterCategoryType] = useState("");
  const [subCategoryType, setSubCategoryType] = useState("");
  const [meterType, setMeterType] = useState("");
  const [criticalStatus, setCriticalStatus] = useState("");
  const [showBoardRatioOptions, setShowBoardRatioOptions] = useState(false);
  const [showRenewableOptions, setShowRenewableOptions] = useState(false);
  const [showFreshWaterOptions, setShowFreshWaterOptions] = useState(false);
  const [showWaterSourceOptions, setShowWaterSourceOptions] = useState(false);
  const [showWaterDistributionOptions, setShowWaterDistributionOptions] = useState(false);

  // Additional state for tracking the third level selection
  const [tertiaryCategory, setTertiaryCategory] = useState("");
  const [allocationBasedOn, setAllocationBasedOn] = useState("department");
  const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [itAssetsCustomFieldModalOpen, setItAssetsCustomFieldModalOpen] =
    useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [underWarranty, setUnderWarranty] = useState("");

  const [hardDiskHeading, setHardDiskHeading] = useState(() => {
    return localStorage.getItem("hardDiskHeading") || "HARDWARE DETAILS";
  });
  interface ExtraFormField {
    value: string;
    fieldType: string;
    groupType: string;
    fieldDescription: string;
  }
  const [extraFormFields, setExtraFormFields] = useState<
    Record<string, ExtraFormField>
  >({});
  const [isEditingHardDiskHeading, setIsEditingHardDiskHeading] =
    useState(false);
  const [editingHardDiskHeadingText, setEditingHardDiskHeadingText] = useState(
    () => {
      return localStorage.getItem("hardDiskHeading") || "HARDWARE DETAILS";
    }
  );
  console.log("Hard Disk Heading:", extraFormFields);
  const [formData, setFormData] = useState({
    name: "",
    asset_number: "",
    model_number: "",
    serial_number: "",
    manufacturer: "",
    status: "in_use",
    critical: false,
    breakdown: false,
    pms_site_id: "",
    pms_building_id: "",
    pms_wing_id: "",
    pms_area_id: "",
    pms_floor_id: "",
    pms_room_id: "",
    loaned_from_vendor_id: "",
    asset_type: "true",
    agreement_from_date: "",
    agreement_to_date: "",
    commisioning_date: "",
    pms_asset_group_id: "",
    pms_asset_sub_group_id: "",
    pms_supplier_id: "",
    salvage_value: "",
    depreciation_rate: "",
    depreciation_method: "",
    it_asset: false,
    it_meter: false,
    meter_tag_type: "",
    parent_meter_id: "",
    is_meter: false,
    asset_loaned: false,
    depreciation_applicable: false,
    useful_life: "",
    purchase_cost: "",
    purchased_on: "",
    warranty: "",
    warranty_period: "",
    warranty_expiry: "",
    depreciation_applicable_for: "",
    indiv_group: "",
    similar_product_type: "",
    selected_asset_id: "",
    selected_asset_ids: [],
    selected_group_id: "",
    selected_sub_group_id: "",
    allocation_type: "department",
    asset_ids: [],
    // Leasehold Improvement specific fields
    location_site: "",
    improvement_description: "",
    group_id: "",
    sub_group_id: "",
    consumption_pms_asset_measures_attributes: [],
    non_consumption_pms_asset_measures_attributes: [],
    allocation_id: "",
    asset_move_to: {
      site_id: "",
      building_id: "",
      wing_id: "",
      area_id: "",
      floor_id: "",
      room_id: "",
    },
    amc_detail: {
      supplier_id: "",
      amc_start_date: "",
      amc_end_date: "",
      amc_first_service: "",
      payment_term: "",
      no_of_visits: "",
      amc_cost: "",
    },
    asset_manuals: [],
    asset_insurances: [],
    asset_purchases: [],
    asset_other_uploads: [],
    extra_fields_attributes: [],
    custom_fields: {
      system_details: {},
      hardware: {},
    },
  });

  const [itAssetDetails, setItAssetDetails] = useState({
    system_details: {
      os: "",
      memory: "",
      processor: "",
    },
    hardware: {
      model: "",
      serial_no: "",
      capacity: "",
    },
  });

  const buildCustomFieldsPayload = () => {
    const result: Record<string, Record<string, string>> = {};

    // Start with the default IT asset details (system_details and hardware)
    Object.entries(itAssetDetails).forEach(([section, fields]) => {
      const nonEmptyFields = {};
      Object.entries(fields).forEach(([key, value]) => {
        // Only include fields with values (not empty, null, or undefined)
        if (value && value.toString().trim() !== "") {
          nonEmptyFields[key] = value;
        }
      });
      // Only add section if it has non-empty fields
      if (Object.keys(nonEmptyFields).length > 0) {
        result[section] = nonEmptyFields;
      }
    });

    // Add any additional custom fields from itAssetsCustomFields
    Object.entries(itAssetsCustomFields).forEach(([section, fields]) => {
      // Map section names to the correct backend structure
      let sectionKey;
      if (section === "System Details") {
        sectionKey = "system_details";
      } else if (section === "Hardware Details") {
        sectionKey = "hardware";
      } else {
        // Fallback to snake_case conversion
        sectionKey = section.trim().toLowerCase().replace(/\s+/g, "_");
      }

      if (!result[sectionKey]) {
        result[sectionKey] = {};
      }
      fields.forEach((field) => {
        // Only add field if it has a value (not empty, null, or undefined)
        if (field.value && field.value.toString().trim() !== "") {
          // Convert field name to snake_case as well
          const fieldKey = field.name.trim().toLowerCase().replace(/\s+/g, "_");
          result[sectionKey][fieldKey] = field.value;
        }
      });
    });

    return result;
  };

  // Initialize IT asset details only once on component mount, not on every formData change
  const [itAssetCustomFields, setItAssetCustomFields] = useState([]); // [{name, value, row}]

  // Meter measure fields state
  interface MeterMeasureField {
    id: string;
    name: string;
    unitType: string;
    min: string;
    max: string;
    alertBelowVal: string;
    alertAboveVal: string;
    multiplierFactor: string;
    checkPreviousReading?: boolean;
  }

  //   const [attachments, setAttachments] = useState({
  //   landAttachments: [],
  //   manualsUpload: [],
  //   insuranceDetails: [],
  //   purchaseInvoice: [],
  //   amc: []
  // });

  // Helper function to compress images
  const compressImage = (
    file: File,
    maxWidth = 1200,
    quality = 0.8
  ): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve(file);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // const handleFileUpload = async (category: string, files: FileList | null) => {
  //   if (!files) return;

  //   const maxFileSize = 10 * 1024 * 1024; // 10MB per file
  //   const maxTotalSize = 50 * 1024 * 1024; // 50MB total
  //   const allowedTypes = [
  //     "application/pdf",
  //     "application/msword",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     "image/jpeg",
  //     "image/jpg",
  //     "image/png",
  //   ];

  //   const fileArray = Array.from(files);
  //   const processedFiles: File[] = [];
  //   let totalSize = 0;

  //   // Calculate current total size
  //   Object.values(attachments).forEach((fileList) => {
  //     if (Array.isArray(fileList)) {
  //       fileList.forEach((file) => {
  //         totalSize += file.size || 0;
  //       });
  //     }
  //   });

  //   // Validate and compress each file
  //   for (const file of fileArray) {
  //     // Check file type
  //     if (!allowedTypes.includes(file.type)) {
  //       toast.error("Unsupported File Format", {
  //         description: `File "${file.name}" is not supported. Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG files only.`,
  //       });
  //       continue;
  //     }

  //     // Compress image files
  //     let processedFile = file;
  //     if (file.type.startsWith("image/")) {
  //       try {
  //         processedFile = await compressImage(file);
  //         console.log(
  //           `Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(
  //             2
  //           )}MB → ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`
  //         );
  //       } catch (error) {
  //         console.warn(
  //           `Failed to compress ${file.name}, using original file:`,
  //           error
  //         );
  //         processedFile = file;
  //       }
  //     }

  //     // Check individual file size (after compression)
  //     if (processedFile.size > maxFileSize) {
  //       toast.error("File Too Large", {
  //         description: `File "${file.name}" is too large (${(
  //           processedFile.size /
  //           1024 /
  //           1024
  //         ).toFixed(2)}MB). Maximum file size is 10MB.`,
  //       });
  //       continue;
  //     }

  //     // Check total size
  //     if (totalSize + processedFile.size > maxTotalSize) {
  //       toast.error("Upload Limit Exceeded", {
  //         description: `Adding "${file.name}" would exceed the total upload limit of 50MB. Please remove some files first.`,
  //       });
  //       continue;
  //     }

  //     totalSize += processedFile.size;
  //     processedFiles.push(processedFile);
  //   }

  //   if (processedFiles.length > 0) {
  //     setAttachments((prev) => ({
  //       ...prev,
  //       [category]: [...(prev[category] || []), ...processedFiles],
  //     }));

  //     // Show success message
  //     if (processedFiles.length === 1) {
  //       console.log(`Successfully added "${processedFiles[0].name}"`);
  //     } else {
  //       console.log(`Successfully added ${processedFiles.length} files`);
  //     }
  //   }
  // };

  const handleFileUpload = async (category: string, files: FileList | null) => {
    if (!files) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB per file
    const maxTotalSize = 50 * 1024 * 1024; // 50MB total
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    const fileArray = Array.from(files);
    const processedFiles: File[] = [];
    let totalSize = 0;

    // Calculate current total size
    Object.values(attachments).forEach((fileList) => {
      if (Array.isArray(fileList)) {
        fileList.forEach((file) => {
          totalSize += file.size || 0;
        });
      }
    });

    // For Asset Image, restrict to only one file
    if (
      category.endsWith("AssetImage") &&
      (fileArray.length > 1 || attachments[category]?.length > 0)
    ) {
      toast.error("Asset Image Limit", {
        description:
          "Only one Asset Image is allowed. Please remove the existing image or select a single image.",
      });
      return;
    }

    // Validate and compress each file
    for (const file of fileArray) {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        toast.error("Unsupported File Format", {
          description: `File "${file.name}" is not supported. Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG files only.`,
        });
        continue;
      }

      // Compress image files
      let processedFile = file;
      if (file.type.startsWith("image/")) {
        try {
          processedFile = await compressImage(file);
          console.log(
            `Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(
              2
            )}MB → ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`
          );
        } catch (error) {
          console.warn(
            `Failed to compress ${file.name}, using original file:`,
            error
          );
          processedFile = file;
        }
      }

      // Check individual file size (after compression)
      if (processedFile.size > maxFileSize) {
        toast.error("File Too Large", {
          description: `File "${file.name}" is too large (${(
            processedFile.size /
            1024 /
            1024
          ).toFixed(2)}MB). Maximum file size is 10MB.`,
        });
        continue;
      }

      // Check total size
      if (totalSize + processedFile.size > maxTotalSize) {
        toast.error("Upload Limit Exceeded", {
          description: `Adding "${file.name}" would exceed the total upload limit of 50MB. Please remove some files first.`,
        });
        continue;
      }

      totalSize += processedFile.size;
      processedFiles.push(processedFile);
    }

    if (processedFiles.length > 0) {
      setAttachments((prev) => ({
        ...prev,
        [category]: category.endsWith("AssetImage")
          ? processedFiles
          : [...(prev[category] || []), ...processedFiles],
      }));

      // Show success message
      if (processedFiles.length === 1) {
        console.log(`Successfully added "${processedFiles[0].name}"`);
      } else {
        console.log(`Successfully added ${processedFiles.length} files`);
      }
    }
  };

  const removeFile = (category, index) => {
    setAttachments((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const [meterUnitTypes, setMeterUnitTypes] = useState<
    Array<{ id: number; unit_name: string }>
  >([]);
  const [loadingUnitTypes, setLoadingUnitTypes] = useState(false);
  const [consumptionMeasureFields, setConsumptionMeasureFields] = useState<
    MeterMeasureField[]
  >([]);
  const [nonConsumptionMeasureFields, setNonConsumptionMeasureFields] =
    useState<MeterMeasureField[]>([]);
  const [customFields, setCustomFields] = useState({
    // Land sections
    basicIdentification: [],
    locationOwnership: [],
    landSizeValue: [],
    landUsageDevelopment: [],
    miscellaneous: [],
    // Leasehold Improvement sections
    leaseholdBasicId: [],
    leaseholdLocationAssoc: [],
    improvementDetails: [],
    leaseholdFinancial: [],
    leaseholdLease: [],
    leaseholdOversight: [],
    // Vehicle sections
    vehicleBasicId: [],
    vehicleTechnicalSpecs: [],
    vehicleOwnership: [],
    vehicleFinancial: [],
    vehiclePerformance: [],
    vehicleLegal: [],
    vehicleMiscellaneous: [],
    // Building sections
    buildingBasicId: [],
    buildingLocation: [],
    buildingConstruction: [],
    buildingAcquisition: [],
    buildingUsage: [],
    buildingMaintenance: [],
    buildingMiscellaneous: [],
    // Furniture & Fixtures sections
    furnitureBasicDetails: [],
    furnitureSpecifications: [],
    furnitureMaintenance: [],
    // IT Equipment sections
    itEquipmentBasicDetails: [],
    itEquipmentSpecifications: [],
    itEquipmentMaintenance: [],
    // Machinery & Equipment sections
    machineryBasicDetails: [],
    machinerySpecifications: [],
    machineryMaintenance: [],
    // Tools & Instruments sections
    toolsBasicDetails: [],
    toolsSpecifications: [],
    toolsMaintenance: [],
    // Meter sections
    meterBasicDetails: [],
    meterSpecifications: [],
    meterMaintenance: [],
    // General sections
    locationDetails: [],
    purchaseDetails: [],
    depreciationRule: [],
    assetDetails: [],
  });

  const [itAssetsCustomFields, setItAssetsCustomFields] = useState({
    "System Details": [],
    "Hardware Details": [],
  });
  const [consumptionMeasures, setConsumptionMeasures] = useState([
    {
      id: 1,
      name: "",
      unitType: "",
      min: "",
      max: "",
      alertBelowVal: "",
      alertAboveVal: "",
      multiplierFactor: "",
      checkPreviousReading: false,
    },
  ]);
  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([
    {
      id: 1,
      name: "",
      unitType: "",
      min: "",
      max: "",
      alertBelowVal: "",
      alertAboveVal: "",
      multiplierFactor: "",
      checkPreviousReading: false,
    },
  ]);

  console.log("It Assets Custom Fields:", itAssetsCustomFields);

  const [attachments, setAttachments] = useState({
    // Category-specific attachments (existing category documents)
    landAttachments: [], // Land documents
    vehicleAttachments: [], // Vehicle documents (RC, insurance, etc.)
    leaseholdAttachments: [], // Leasehold improvement documents
    buildingAttachments: [], // Building documents
    furnitureAttachments: [], // Furniture & Fixtures documents
    itEquipmentAttachments: [], // IT Equipment documents
    machineryAttachments: [], // Machinery & Equipment documents
    toolsAttachments: [], // Tools & Instruments documents
    meterAttachments: [], // Meter documents

    // Common sections for all categories - Asset Manuals
    landManualsUpload: [], // Land - Asset manuals
    vehicleManualsUpload: [], // Vehicle - Asset manuals
    leaseholdimprovementManualsUpload: [], // Leasehold Improvement - Asset manuals
    buildingManualsUpload: [], // Building - Asset manuals
    furniturefixturesManualsUpload: [], // Furniture & Fixtures - Asset manuals
    itequipmentManualsUpload: [], // IT Equipment - Asset manuals
    machineryequipmentManualsUpload: [], // Machinery & Equipment - Asset manuals
    toolsinstrumentsManualsUpload: [], // Tools & Instruments - Asset manuals
    meterManualsUpload: [], // Meter - Asset manuals

    // Common sections for all categories - Insurance Details
    landInsuranceDetails: [], // Land - Insurance documents
    vehicleInsuranceDetails: [], // Vehicle - Insurance documents
    leaseholdimprovementInsuranceDetails: [], // Leasehold Improvement - Insurance documents
    buildingInsuranceDetails: [], // Building - Insurance documents
    furniturefixturesInsuranceDetails: [], // Furniture & Fixtures - Insurance documents
    itequipmentInsuranceDetails: [], // IT Equipment - Insurance documents
    machineryequipmentInsuranceDetails: [], // Machinery & Equipment - Insurance documents
    toolsinstrumentsInsuranceDetails: [], // Tools & Instruments - Insurance documents
    meterInsuranceDetails: [], // Meter - Insurance documents

    // Common sections for all categories - Purchase Invoices
    landPurchaseInvoice: [], // Land - Purchase invoices
    vehiclePurchaseInvoice: [], // Vehicle - Purchase invoices
    leaseholdimprovementPurchaseInvoice: [], // Leasehold Improvement - Purchase invoices
    buildingPurchaseInvoice: [], // Building - Purchase invoices
    furniturefixturesPurchaseInvoice: [], // Furniture & Fixtures - Purchase invoices
    itequipmentPurchaseInvoice: [], // IT Equipment - Purchase invoices
    machineryequipmentPurchaseInvoice: [], // Machinery & Equipment - Purchase invoices
    toolsinstrumentsPurchaseInvoice: [], // Tools & Instruments - Purchase invoices
    meterPurchaseInvoice: [], // Meter - Purchase invoices

    // Common sections for all categories - Other Documents
    landOtherDocuments: [], // Land - Other documents
    vehicleOtherDocuments: [], // Vehicle - Other documents
    leaseholdimprovementOtherDocuments: [], // Leasehold Improvement - Other documents
    buildingOtherDocuments: [], // Building - Other documents
    furniturefixturesOtherDocuments: [], // Furniture & Fixtures - Other documents
    itequipmentOtherDocuments: [], // IT Equipment - Other documents
    machineryequipmentOtherDocuments: [], // Machinery & Equipment - Other documents
    toolsinstrumentsOtherDocuments: [], // Tools & Instruments - Other documents
    meterOtherDocuments: [], // Meter - Other documents

    // AMC documents for all categories
    landAmc: [], // Land - AMC documents
    vehicleAmc: [], // Vehicle - AMC documents
    leaseholdimprovementAmc: [], // Leasehold Improvement - AMC documents
    buildingAmc: [], // Building - AMC documents
    furniturefixturesAmc: [], // Furniture & Fixtures - AMC documents
    itequipmentAmc: [], // IT Equipment - AMC documents
    machineryequipmentAmc: [], // Machinery & Equipment - AMC documents
    toolsinstrumentsAmc: [], // Tools & Instruments - AMC documents
    meterAmc: [], // Meter - AMC documents

    // Asset images for each category
    landAssetImage: [],
    vehicleAssetImage: [],
    leaseholdimprovementAssetImage: [],
    buildingAssetImage: [],
    furniturefixturesAssetImage: [],
    itequipmentAssetImage: [],
    machineryequipmentAssetImage: [],
    toolsinstrumentsAssetImage: [],
    meterAssetImage: [],
  });
  const [selectedAssetCategory, setSelectedAssetCategory] = useState("");

  const handleGoBack = () => {
    navigate("/maintenance/asset");
  };

  // Location change handlers
  const handleLocationChange = async (field, value) => {
    setSelectedLocation((prev) => {
      const newLocation = { ...prev, [field]: value };

      // Reset dependent fields when parent changes
      if (field === "site") {
        newLocation.building = "";
        newLocation.wing = "";
        newLocation.area = "";
        newLocation.floor = "";
        newLocation.room = "";
        if (value) fetchBuildings(parseInt(value));
      } else if (field === "building") {
        newLocation.wing = "";
        newLocation.area = "";
        newLocation.floor = "";
        newLocation.room = "";
        if (value) fetchWings(parseInt(value));
      } else if (field === "wing") {
        newLocation.area = "";
        newLocation.floor = "";
        newLocation.room = "";
        if (value) fetchAreas(parseInt(value));
      } else if (field === "area") {
        newLocation.floor = "";
        newLocation.room = "";
        if (value) fetchFloors(parseInt(value));
      } else if (field === "floor") {
        newLocation.room = "";
        if (value) fetchRooms(parseInt(value));
      }

      return newLocation;
    });
  };

  // Meter category options matching the images
  const getMeterCategoryOptions = () => [
    {
      value: "board",
      label: "Board",
      icon: BarChart3,
    },
    {
      value: "dg",
      label: "DG",
      icon: Zap,
    },
    {
      value: "renewable",
      label: "Renewable",
      icon: Sun,
    },
    {
      value: "fresh-water",
      label: "Fresh Water",
      icon: Droplet,
    },
    {
      value: "recycled",
      label: "Recycled",
      icon: Recycle,
    },
    {
      value: "water-distribution",
      label: "Water Distribution",
      icon: Building,
    },
    {
      value: "iex-gdam",
      label: "IEX-GDAM",
      icon: BarChart,
    },
  ];

  // Board Ratio sub-options (second image)
  const getBoardRatioOptions = () => [
    {
      value: "ht-panel",
      label: "HT Panel",
      icon: Plug,
    },
    {
      value: "vcb",
      label: "VCB",
      icon: Activity,
    },
    {
      value: "transformer",
      label: "Transformer",
      icon: Zap,
    },
    {
      value: "lt-panel",
      label: "LT Panel",
      icon: Frown,
    },
  ];

  // Renewable energy sub-options
  const getRenewableOptions = () => [
    {
      value: "solar",
      label: "Solar",
      icon: Sun,
    },
    {
      value: "bio-methanol",
      label: "Bio Methanol",
      icon: Droplet,
    },
    {
      value: "wind",
      label: "Wind",
      icon: Wind,
    },
  ];

  // Fresh water main options (Source and Destination)
  const getFreshWaterOptions = () => [
    {
      value: "source",
      label: "Source",
      icon: ArrowDown,
    },
    {
      value: "destination",
      label: "Destination",
      icon: ArrowUp,
    },
  ];

  // Water source sub-options (shown when Source is selected)
  const getWaterSourceOptions = () => [
    {
      value: "municipal-corporation",
      label: "Municipal Corporation",
      icon: Building,
    },
    {
      value: "tanker",
      label: "Tanker",
      icon: Truck,
    },
    {
      value: "borewell",
      label: "Borewell",
      icon: ArrowDown,
    },
    {
      value: "rainwater",
      label: "Rainwater",
      icon: CloudRain,
    },
    {
      value: "jackwell",
      label: "Jackwell",
      icon: ArrowUp,
    },
    {
      value: "pump",
      label: "Pump",
      icon: Zap,
    },
  ];

  // Water distribution sub-options
  const getWaterDistributionOptions = () => [
    {
      value: "irrigation",
      label: "Irrigation",
      icon: Droplet,
    },
    {
      value: "domestic",
      label: "Domestic",
      icon: Building,
    },
    {
      value: "flushing",
      label: "Flushing",
      icon: ArrowDown,
    },
  ];

  // Asset Meter Type ID mapping based on database values
  const getAssetMeterTypeId = (meterCategory, subCategory = null, tertiaryCategory = null) => {
    // Create mapping from UI selections to database IDs
    const meterTypeMapping = {
      // Board category mappings
      "board": {
        "ht-panel": 5, // HT Panel
        "vcb": 8,      // VCB
        "transformer": 2, // Transformer
        "lt-panel": 9,  // LT Panel
      },
      // DG category
      "dg": 1, // DG

      // Renewable energy mappings
      "renewable": {
        "solar": 7,      // Solar Panel
        "bio-methanol": 10, // Bio Methanol
        "wind": 11,       // Wind
      },

      // Fresh water mappings (three-level hierarchy)
      "fresh-water": {
        "source": {
          "municipal-corporation": 12, // Municipal Corporation
          "tanker": 13,               // Tanker  
          "borewell": 14,             // Borewell
          "rainwater": 15,            // Rainwater
          "jackwell": 16,             // Jackwell
          "pump": 3,                  // Pump (general pump type)
        },
        "destination": {
          // You can add destination-specific mappings here if needed
          // For now, using a generic mapping
          "output": 18, // Domestic (as a placeholder for destination)
        }
      },

      // Recycled water
      "recycled": 6, // Recycled Water

      // Water distribution mappings
      "water-distribution": {
        "irrigation": 17,  // Irrigation
        "domestic": 18,    // Domestic
        "flushing": 19,    // Flushing
      },

      // IEX-GDAM
      "iex-gdam": 21, // IEX GDAM
    };

    // Handle three-level hierarchy (for fresh-water with source/destination)
    if (tertiaryCategory && meterTypeMapping[meterCategory] &&
      meterTypeMapping[meterCategory][subCategory] &&
      typeof meterTypeMapping[meterCategory][subCategory] === 'object') {
      return meterTypeMapping[meterCategory][subCategory][tertiaryCategory] || null;
    }
    // Handle two-level hierarchy - but make sure we don't return nested objects
    else if (subCategory && meterTypeMapping[meterCategory] && typeof meterTypeMapping[meterCategory] === 'object') {
      const result = meterTypeMapping[meterCategory][subCategory];
      // If the result is still an object (nested structure), return null instead
      return (typeof result === 'number') ? result : null;
    }
    // Handle single-level
    else if (typeof meterTypeMapping[meterCategory] === 'number') {
      return meterTypeMapping[meterCategory];
    }

    return null;
  };

  // Handle meter category change
  const handleMeterCategoryChange = (value) => {
    console.log('Meter category changed:', value);
    setMeterCategoryType(value);
    setSubCategoryType(""); // Reset sub-category when main category changes
    setTertiaryCategory(""); // Reset tertiary category when main category changes

    // Log the meter type ID that will be used
    const meterTypeId = getAssetMeterTypeId(value, null, null);
    console.log('Asset Meter Type ID for category:', value, '=', meterTypeId, typeof meterTypeId);

    // Show appropriate sub-options based on selection
    if (value === "board") {
      setShowBoardRatioOptions(true);
      setShowRenewableOptions(false);
      setShowFreshWaterOptions(false);
      setShowWaterSourceOptions(false);
      setShowWaterDistributionOptions(false);
    } else if (value === "renewable") {
      sp
      setShowRenewableOptions(true);
      setShowBoardRatioOptions(false);
      setShowFreshWaterOptions(false);
      setShowWaterSourceOptions(false);
      setShowWaterDistributionOptions(false);
    } else if (value === "fresh-water") {
      setShowFreshWaterOptions(true);
      setShowBoardRatioOptions(false);
      setShowRenewableOptions(false);
      setShowWaterSourceOptions(false);
      setShowWaterDistributionOptions(false);
    } else if (value === "water-distribution") {
      setShowWaterDistributionOptions(true);
      setShowBoardRatioOptions(false);
      setShowRenewableOptions(false);
      setShowFreshWaterOptions(false);
      setShowWaterSourceOptions(false);
    } else {
      setShowBoardRatioOptions(false);
      setShowRenewableOptions(false);
      setShowFreshWaterOptions(false);
      setShowWaterSourceOptions(false);
      setShowWaterDistributionOptions(false);
    }
  };

  // Handle sub-category change
  const handleSubCategoryChange = (value) => {
    console.log('Sub-category changed:', value);
    setSubCategoryType(value);
    setTertiaryCategory(""); // Reset tertiary category when sub-category changes

    // Special handling for fresh-water source/destination
    if (meterCategoryType === "fresh-water" && value === "source") {
      setShowWaterSourceOptions(true);
    } else {
      setShowWaterSourceOptions(false);
    }

    // Log the meter type ID that will be used with the sub-category
    const meterTypeId = getAssetMeterTypeId(meterCategoryType, value, null);
    console.log('Asset Meter Type ID for category:', meterCategoryType, 'sub-category:', value, '=', meterTypeId, typeof meterTypeId);
  };

  // Handle tertiary category change (for water sources)
  const handleTertiaryCategoryChange = (value) => {
    console.log('Tertiary category changed:', value);
    setTertiaryCategory(value);

    // Log the meter type ID that will be used with all three levels
    const meterTypeId = getAssetMeterTypeId(meterCategoryType, subCategoryType, value);
    console.log('Asset Meter Type ID for category:', meterCategoryType, 'sub-category:', subCategoryType, 'tertiary:', value, '=', meterTypeId, typeof meterTypeId);
  };

  interface HandleFieldChangeFn {
    (field: keyof typeof formData, value: any): void;
  }

  const handleFieldChange: HandleFieldChangeFn = (field, value) => {
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      const fieldErrorExists = validationErrors.some(
        (error) =>
          error.toLowerCase().includes(field.toLowerCase()) ||
          (field === "name" && error.includes("Asset Name")) ||
          (field === "model_number" && error.includes("Model No")) ||
          (field === "manufacturer" && error.includes("Manufacturer"))
      );

      if (fieldErrorExists) {
        setValidationErrors((prev) =>
          prev.filter(
            (error) =>
              !error.toLowerCase().includes(field.toLowerCase()) &&
              !(field === "name" && error.includes("Asset Name")) &&
              !(field === "model_number" && error.includes("Model No")) &&
              !(field === "manufacturer" && error.includes("Manufacturer"))
          )
        );
      }
    }

    // Warranty date validation - ensure warranty expiry is not before purchase date
    if (field === "warranty_expiry" && value) {
      const purchaseDate = new Date(formData.purchased_on);
      const warrantyDate = new Date(value);

      if (formData.purchased_on && warrantyDate < purchaseDate) {
        setFormData((prev) => ({
          ...prev,
          warranty_expiry: "",
        }));
        toast.error("Invalid Warranty Date", {
          description:
            "Warranty expiry date cannot be before the purchase date.",
          duration: 4000,
        });
        return; // Don't update the field if validation fails
      }
    }

    // Purchase date validation - ensure warranty expiry is not before purchase date
    if (field === "purchased_on" && value) {
      const purchaseDate = new Date(value);
      const warrantyDate = new Date(formData.warranty_expiry);

      if (formData.warranty_expiry && warrantyDate < purchaseDate) {
        setFormData((prev) => ({
          ...prev,
          warranty_expiry: "", // Reset warranty expiry if purchase date is updated
        }));

        toast.error("Invalid Purchase Date", {
          description:
            "Purchase date cannot be after the warranty expiry date.",
          duration: 4000,
        });
        return; // Don't update the field if validation fails
      }
    }

    // Agreement end date validation - ensure agreement end date is not before agreement start date
    if (field === "agreement_to_date" && value) {
      const startDate = new Date(formData.agreement_from_date);
      const endDate = new Date(value);

      if (formData.agreement_from_date && endDate < startDate) {
        setAgreementDateError(
          "Agreement end date cannot be before the agreement start date."
        );
        toast.error("Invalid Agreement End Date", {
          description:
            "Agreement end date cannot be before the agreement start date.",
          duration: 4000,
        });
        return; // Don't update the field if validation fails
      } else {
        setAgreementDateError(""); // Clear error if validation passes
      }
    }

    // Agreement start date validation - ensure agreement end date is not before agreement start date
    if (field === "agreement_from_date" && value) {
      const startDate = new Date(value);
      const endDate = new Date(formData.agreement_to_date);

      if (formData.agreement_to_date && endDate < startDate) {
        setFormData((prev) => ({
          ...prev,
          agreement_to_date: "", // Reset agreement end date if start date is updated
        }));
        setAgreementDateError(""); // Clear error since we're resetting the end date

        toast.error("Invalid Agreement Start Date", {
          description:
            "Agreement start date cannot be after the agreement end date.",
          duration: 4000,
        });
        return; // Don't update the field if validation fails
      } else {
        setAgreementDateError(""); // Clear error if validation passes
      }
    }

    // Commissioning date validation - ensure AMC First Service is not before commissioning date
    if (field === "commisioning_date" && value) {
      if (formData.amc_detail.amc_first_service) {
        const commissioningDate = new Date(value);
        const firstServiceDate = new Date(
          formData.amc_detail.amc_first_service
        );

        if (firstServiceDate < commissioningDate) {
          setFormData((prev) => ({
            ...prev,
            amc_detail: {
              ...prev.amc_detail,
              amc_first_service: "", // Reset first service date
            },
          }));
          setAmcDateError(""); // Clear error since we're resetting the first service date

          toast.error("Invalid Commissioning Date", {
            description:
              "Commissioning date cannot be after the AMC First Service date. First Service date has been reset.",
            duration: 4000,
          });
          // Continue to update the commissioning date since it's the primary field being changed
        }
      }
    }

    // Provide instant positive feedback when required fields are filled
    if (value && value.toString().trim()) {
      const fieldDisplayNames = {
        name: "Asset Name",
        model_number: "Model No.",
        manufacturer: "Manufacturer",
        purchase_cost: "Purchase Cost",
        purchased_on: "Purchase Date",
        commisioning_date: "Commissioning Date",
        warranty_expiry: "Warranty Expiry",
        useful_life: "Useful Life",
        salvage_value: "Salvage Value",
        depreciation_rate: "Depreciation Rate",
      };

      if (fieldDisplayNames[field]) {
        // Show a subtle success toast for required fields when they're filled
        const existingToastContent = document.querySelector(
          "[data-sonner-toast]"
        );
        if (
          !existingToastContent ||
          !existingToastContent.textContent?.includes("completed")
        ) {
          toast.success(`${fieldDisplayNames[field]} completed`, {
            duration: 1500,
            style: { backgroundColor: "#f0f9ff", borderColor: "#38bdf8" },
          });
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(`Field changed: ${field} = ${value}`);
  };
  console.log("Form data updatedyyyyyyyyyy:", formData);
  console.log("Asset type value:", formData.asset_type);

  // --- For nested fields like asset_move_to, amc_detail ---
  const handleNestedFieldChange = (section, field, value) => {
    // AMC First Service date validation - ensure it's on or after commissioning date
    if (section === "amc_detail" && field === "amc_first_service" && value) {
      if (formData.commisioning_date) {
        const commissioningDate = new Date(formData.commisioning_date);
        const firstServiceDate = new Date(value);

        if (firstServiceDate < commissioningDate) {
          setAmcDateError(
            "AMC First Service date cannot be before the commissioning date."
          );
          toast.error("Invalid AMC First Service Date", {
            description:
              "AMC First Service date cannot be before the commissioning date.",
            duration: 4000,
          });
          return; // Don't update the field if validation fails
        } else {
          setAmcDateError(""); // Clear error if validation passes
        }
      }
    }

    // AMC End Date validation - ensure it's not before AMC Start Date
    if (section === "amc_detail" && field === "amc_end_date" && value) {
      if (formData.amc_detail.amc_start_date) {
        const startDate = new Date(formData.amc_detail.amc_start_date);
        const endDate = new Date(value);

        if (endDate < startDate) {
          setAmcDateError("AMC End date cannot be before the AMC start date.");
          toast.error("Invalid AMC End Date", {
            description: "AMC End date cannot be before the AMC start date.",
            duration: 4000,
          });
          return; // Don't update the field if validation fails
        } else {
          setAmcDateError(""); // Clear error if validation passes
        }
      }
    }

    // AMC Start Date validation - reset end date if start date is changed to after current end date
    if (section === "amc_detail" && field === "amc_start_date" && value) {
      if (formData.amc_detail.amc_end_date) {
        const startDate = new Date(value);
        const endDate = new Date(formData.amc_detail.amc_end_date);

        if (startDate > endDate) {
          setFormData((prev) => ({
            ...prev,
            amc_detail: {
              ...prev.amc_detail,
              amc_end_date: "", // Reset end date
              [field]: value,
            },
          }));
          setAmcDateError(""); // Clear error since we're resetting the end date
          toast.error("Invalid AMC Start Date", {
            description:
              "AMC Start date cannot be after the AMC end date. End date has been reset.",
            duration: 4000,
          });
          return; // Exit early since we've manually updated the state
        } else {
          setAmcDateError(""); // Clear error if validation passes
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // --- For array fields like asset_ids ---
  const handleArrayFieldChange = (field, valueArray) => {
    setFormData((prev) => ({
      ...prev,
      [field]: valueArray,
    }));
  };

  // --- For single field changes like allocation_id ---
  const handleSingleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --- For IT Asset details (system_details and hardware) ---
  const handleItAssetDetailsChange = (section, field, value) => {
    setItAssetDetails((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };
  console.log(customFields);
  const buildExtraFieldsAttributes = () => {
    let extraFields = [];
    console.log("Building extra fields attributes...", customFields);

    // Helper function to check if a value is empty
    const isEmpty = (value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      if (Array.isArray(value) && value.length === 0) return true;
      return false;
    };

    // Helper function to format dates properly
    const formatDateValue = (value, fieldType) => {
      if (fieldType === "date" && value) {
        // If it's already a Date object, format it to YYYY-MM-DD
        if (value instanceof Date) {
          return value.toISOString().split("T")[0];
        }
        // If it's a string, try to parse and format it
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0];
        }
      }
      return value;
    };

    // Custom fields - only include fields with non-empty values
    Object.keys(customFields).forEach((sectionKey) => {
      (customFields[sectionKey] || []).forEach((field) => {
        // Only add field if it has a non-empty value
        if (!isEmpty(field.value)) {
          console.log(`Including custom field: ${field.name} = ${field.value}`);
          extraFields.push({
            field_name: field.name,
            field_value: field.value,
            group_name: sectionKey,
            field_description: field.name,
            _destroy: false,
          });
        } else {
          console.log(`Skipping empty custom field: ${field.name} (value: ${field.value})`);
        }
      });
    });

    // IT Assets custom fields - only include fields with non-empty values
    Object.keys(itAssetsCustomFields).forEach((sectionKey) => {
      (itAssetsCustomFields[sectionKey] || []).forEach((field) => {
        // Only add field if it has a non-empty value
        if (!isEmpty(field.value)) {
          console.log(`Including IT assets field: ${field.name} = ${field.value}`);
          extraFields.push({
            field_name: field.name,
            field_value: field.value,
            group_name: sectionKey,
            field_description: field.name,
            _destroy: false,
          });
        } else {
          console.log(`Skipping empty IT assets field: ${field.name} (value: ${field.value})`);
        }
      });
    });

    // Standard extra fields (dynamic) - with proper date formatting
    Object.entries(extraFormFields).forEach(([key, fieldObj]) => {
      if (!isEmpty(fieldObj?.value)) {
        console.log(`Including standard field: ${key} = ${fieldObj.value}`);
        // Format date values properly
        let processedValue = formatDateValue(
          fieldObj.value,
          fieldObj.fieldType
        );

        extraFields.push({
          field_name: key,
          field_value: processedValue,
          group_name: fieldObj.groupType,
          field_description: fieldObj.fieldDescription,
          _destroy: false,
        });
      } else {
        console.log(`Skipping empty standard field: ${key} (value: ${fieldObj?.value})`);
      }
    });

    console.log("Final extra fields to send:", extraFields);
    return extraFields;
  };

  const handleItAssetsToggleChange = (checked) => {
    setItAssetsToggle(checked);
    handleFieldChange("it_asset", checked);
    setExpandedSections((prev) => ({
      ...prev,
      warranty: checked,
    }));
  };
  const handleMeterDetailsToggleChange = (checked) => {
    setMeterDetailsToggle(checked);
    handleFieldChange("is_meter", checked);
    setExpandedSections((prev) => ({
      ...prev,
      meterCategory: checked,
    }));
  };
  const handleAssetLoanedToggleChange = (checked) => {
    setAssetLoanedToggle(checked);
    handleFieldChange("asset_loaned", checked);
    setExpandedSections((prev) => ({
      ...prev,
      assetLoaned: checked,
    }));
  };
  const handleDepreciationToggleChange = (checked) => {
    setDepreciationToggle(checked);
    handleFieldChange("depreciation_applicable", checked);
    setExpandedSections((prev) => ({
      ...prev,
      nonConsumption: checked,
    }));
  };

  // Fetch groups
  const fetchGroups = async () => {
    setGroupsLoading(true);
    try {
      const response = await apiClient.get(
        "/pms/assets/get_asset_group_sub_group.json"
      );
      setGroups(response.data.asset_groups || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  };

  // Fetch subgroups based on selected group
  const fetchSubgroups = async (groupId) => {
    if (!groupId) {
      setSubgroups([]);
      return;
    }

    setSubgroupsLoading(true);
    try {
      const response = await apiClient.get(
        `/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`
      );
      setSubgroups(response.data.asset_groups || []);
    } catch (error) {
      console.error("Error fetching subgroups:", error);
      setSubgroups([]);
    } finally {
      setSubgroupsLoading(false);
    }
  };
  const handleExtraFieldChange = (
    key,
    value,
    fieldType,
    groupType,
    fieldDescription
  ) => {
    // Helper function to format date values
    const formatDateForBackend = (dateValue, type) => {
      if (type !== "date" || !dateValue) return dateValue;

      // If it's already a Date object
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split("T")[0];
      }

      // If it's a string, try to parse it
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }

      return dateValue; // Return as-is if not a valid date
    };

    const processedValue = formatDateForBackend(value, fieldType);

    setExtraFormFields((prev) => ({
      ...prev,
      [key]: { value: processedValue, fieldType, groupType, fieldDescription },
    }));
    console.log(
      "Extra field updated:",
      key,
      processedValue,
      fieldType,
      groupType,
      fieldDescription
    );
    console.log("Changes in the fields ", buildExtraFieldsAttributes());
  };

  // Handle group change
  const handleGroupChange = (groupId) => {
    setFormData((prev) => ({
      ...prev,
      pms_asset_group_id: groupId,
      pms_asset_sub_group_id: "",
    }));
    setSelectedGroup(groupId);
    setSelectedSubgroup(""); // Reset subgroup when group changes
    fetchSubgroups(groupId);
  };

  // Fetch groups and other data on component mount
  useEffect(() => {
    fetchGroups();
    fetchVendors();
    fetchDepartments();
    fetchUsers();
    fetchMeterUnitTypes();
    fetchAssets();
    fetchDepreciationGroups();
  }, []);

  // Fetch meter unit types
  const fetchMeterUnitTypes = async () => {
    try {
      setLoadingUnitTypes(true);
      const response = await apiClient.get(
        `${API_CONFIG.BASE_URL}/pms/meter_types/meter_unit_types.json`,
        {
          headers: { Authorization: getAuthHeader() },
        }
      );
      setMeterUnitTypes(response.data);
    } catch (error) {
      console.error("Error fetching meter unit types:", error);
    } finally {
      setLoadingUnitTypes(false);
    }
  };

  // Fetch parent meters when Sub Meter is selected
  useEffect(() => {
    if (meterType === "SubMeter") {
      fetchParentMeters();
    } else {
      setSelectedParentMeterId("");
    }
  }, [meterType]);

  // Fetch parent meters function
  const fetchParentMeters = async () => {
    setParentMeterLoading(true);
    try {
      const response = await apiClient.get("/pms/assets/get_parent_asset.json");

      // Transform the nested array format to object format
      const transformedData = response.data.assets.map(
        (asset: [number, string]) => ({
          id: asset[0],
          name: asset[1],
        })
      );

      setParentMeters(transformedData);
    } catch (error) {
      console.error("Error fetching parent meters:", error);
      setParentMeters([]);
    } finally {
      setParentMeterLoading(false);
    }
  };

  // Fetch vendors function
  const fetchVendors = async () => {
    setVendorsLoading(true);
    try {
      const response = await apiClient.get("/pms/suppliers/get_suppliers.json");
      setVendors(response.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setVendorsLoading(false);
    }
  };

  // Fetch departments function
  const fetchDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const response = await apiClient.get("/pms/departments.json");
      setDepartments(response.data?.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // Fetch users function
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await apiClient.get(
        "/pms/users/get_escalate_to_users.json"
      );
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch assets function for depreciation similar product
  const fetchAssets = async () => {
    setAssetsLoading(true);
    try {
      const response = await apiClient.get("/pms/assets/get_assets.json");
      // Handle the array response format
      const assetsData = Array.isArray(response.data) ? response.data : [];
      setAssets(assetsData);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssets([]);
    } finally {
      setAssetsLoading(false);
    }
  };

  // Fetch groups function for depreciation similar product
  const fetchDepreciationGroups = async () => {
    setGroupsLoading(true);
    try {
      const response = await apiClient.get(
        "/pms/assets/get_asset_group_sub_group.json"
      );
      // Handle the asset_groups array in response
      const groupsData = response.data?.asset_groups || [];
      setGroups(groupsData);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  };

  // Fetch sub groups function for depreciation similar product
  const fetchSubGroups = async (groupId: string) => {
    if (!groupId) return;
    setSubGroupsLoading(true);
    try {
      const response = await apiClient.get(
        `/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`
      );
      // Handle the asset_groups array in response for sub groups
      const subGroupsData = response.data?.asset_groups || [];
      setSubGroups(subGroupsData);
    } catch (error) {
      console.error("Error fetching sub groups:", error);
      setSubGroups([]);
    } finally {
      setSubGroupsLoading(false);
    }
  };

  // Custom field functions - Updated to handle sections
  const openCustomFieldModal = (section) => {
    setCurrentSection(section);
    setCustomFieldModalOpen(true);
  };

  const handleAddCustomField = () => {
    if (newFieldName.trim() && currentSection) {
      const newField = {
        id: Date.now(),
        name: newFieldName.trim(),
        value: "",
      };
      setCustomFields((prev) => ({
        ...prev,
        [currentSection]: [...(prev[currentSection] || []), newField],
      }));
      setNewFieldName("");
      setCustomFieldModalOpen(false);
      setCurrentSection("");
    }
  };
  const handleCustomFieldChange = (section, id, value) => {
    setCustomFields((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((field) =>
        field.id === id ? { ...field, value } : field
      ),
    }));
  };

  // const removeCustomField = (section, id) => {
  //   setCustomFields(prev => ({
  //     ...prev,
  //     [section]: prev[section].filter(field => field.id !== id)
  //   }));
  // };
  const removeCustomField = (section, id) => {
    setCustomFields((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((field) => field.id !== id),
    }));

    // Remove from extraFormFields as well
    setExtraFormFields((prev) => {
      // Find the field name to remove
      const fieldToRemove = (customFields[section] || []).find(
        (field) => field.id === id
      );
      if (!fieldToRemove) return prev;
      const newFields = { ...prev };
      delete newFields[fieldToRemove.name];
      return newFields;
    });
  };

  // Custom field functions for IT Assets
  // const handleAddItAssetsCustomField = (fieldName, section = 'System Details') => {
  //   const newField = {
  //     id: Date.now(),
  //     name: fieldName,
  //     value: ''
  //   };
  //   setItAssetsCustomFields(prev => ({
  //     ...prev,
  //     [section]: [...prev[section], newField]
  //   }));
  // };
  const handleAddItAssetsCustomField = (
    fieldName,
    section = "system_details"
  ) => {
    console.log(
      "handleAddItAssetsCustomField called with:",
      fieldName,
      section
    );

    const newField = {
      id: Date.now(),
      name: fieldName,
      value: "",
    };

    // Map section values from modal to display keys
    let displaySection = "";
    if (section === "system_details") {
      displaySection = "System Details";
    } else if (section === "hardware") {
      displaySection = "Hardware Details";
    } else {
      // fallback for old format
      displaySection = section;
    }

    console.log("Mapped to displaySection:", displaySection);

    // Add to modal-specific IT asset custom fields (for UI)
    setItAssetsCustomFields((prev) => {
      const updated = {
        ...prev,
        [displaySection]: [...(prev[displaySection] || []), newField],
      };
      console.log("Updated itAssetsCustomFields:", updated);
      return updated;
    });

    // Also add to main customFields state for IT Equipment payload
    setCustomFields((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newField],
    }));
  };
  const handleItAssetsCustomFieldChange = (section, id, value) => {
    setItAssetsCustomFields((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((field) =>
        field.id === id
          ? {
            ...field,
            value,
          }
          : field
      ),
    }));

    // Also update the main customFields state
    let customFieldSection = "";
    if (section === "System Details") {
      customFieldSection = "system_details";
    } else if (section === "Hardware Details") {
      customFieldSection = "hardware";
    }

    if (customFieldSection) {
      setCustomFields((prev) => ({
        ...prev,
        [customFieldSection]: (prev[customFieldSection] || []).map((field) =>
          field.id === id
            ? {
              ...field,
              value,
            }
            : field
        ),
      }));
    }
  };
  const removeItAssetsCustomField = (section, id) => {
    setItAssetsCustomFields((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((field) => field.id !== id),
    }));

    // Also remove from main customFields state
    let customFieldSection = "";
    if (section === "System Details") {
      customFieldSection = "system_details";
    } else if (section === "Hardware Details") {
      customFieldSection = "hardware";
    }

    if (customFieldSection) {
      setCustomFields((prev) => ({
        ...prev,
        [customFieldSection]: (prev[customFieldSection] || []).filter(
          (field) => field.id !== id
        ),
      }));
    }
  };

  // Meter measure field functions
  const handleMeterMeasureFieldChange = (
    type: "consumption" | "nonConsumption",
    id: string,
    field: keyof MeterMeasureField,
    value: string | boolean
  ) => {
    if (type === "consumption") {
      setConsumptionMeasureFields((prev) =>
        prev.map((measure) =>
          measure.id === id ? { ...measure, [field]: value } : measure
        )
      );
    } else {
      setNonConsumptionMeasureFields((prev) =>
        prev.map((measure) =>
          measure.id === id ? { ...measure, [field]: value } : measure
        )
      );
    }
  };
  console.log("NON CONSUMPTION MEASURE FIELDS", nonConsumptionMeasureFields);

  const addMeterMeasureField = (type: "consumption" | "nonConsumption") => {
    const newField: MeterMeasureField = {
      id: Date.now().toString(),
      name: "",
      unitType: "",
      min: "",
      max: "",
      alertBelowVal: "",
      alertAboveVal: "",
      multiplierFactor: "",
      checkPreviousReading: false,
    };

    if (type === "consumption") {
      setConsumptionMeasureFields((prev) => [...prev, newField]);
    } else {
      setNonConsumptionMeasureFields((prev) => [...prev, newField]);
    }
  };

  const removeMeterMeasureField = (
    type: "consumption" | "nonConsumption",
    id: string
  ) => {
    if (type === "consumption") {
      setConsumptionMeasureFields((prev) =>
        prev.filter((field) => field.id !== id)
      );
    } else {
      setNonConsumptionMeasureFields((prev) =>
        prev.filter((field) => field.id !== id)
      );
    }
  };
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [agreementDateError, setAgreementDateError] = useState<string>("");
  const [amcDateError, setAmcDateError] = useState<string>("");

  // Function to check if a field has validation error
  const hasValidationError = (fieldName: string) => {
    return validationErrors.some((error) =>
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };
  // Function to check if a category-specific section is completed
  const isSectionCompleted = (sectionType: string) => {
    if (!selectedAssetCategory) return false;

    // Get the validation rules for the current category
    const baseValidationRules = {
      baseFields: ["name", "asset_code"],
      groupFields: ["pms_asset_group_id", "pms_asset_sub_group_id"],
      purchaseFields: ["purchase_cost", "purchased_on"],
      // datesFields: ['commisioning_date'],
    };

    const categoryRules = {
      Land: {
        ...baseValidationRules,
        locationFields: [],
        warrantyFields: [],
        categorySpecificFields: ["land_type", "location", "area"],
      },
      Building: {
        ...baseValidationRules,
        locationFields: [],
        warrantyFields: [],
        categorySpecificFields: ["building_type", "location", "built_up_area"],
      },
      "Leasehold Improvement": {
        ...baseValidationRules,
        locationFields: [],
        warrantyFields: [],
        categorySpecificFields: ["improvement_description", "location_site"],
      },
      Vehicle: {
        ...baseValidationRules,
        locationFields: [],
        warrantyFields: ["warranty_expiry"],
        categorySpecificFields: [
          "vehicle_type",
          "make_model",
          "registration_number",
        ],
      },
      "Furniture & Fixtures": {
        ...baseValidationRules,
        locationFields: ["site", "building"],
        warrantyFields: ["warranty_expiry"],
        categorySpecificFields: [],
      },
      "IT Equipment": {
        ...baseValidationRules,
        locationFields: ["site", "building"],
        warrantyFields: ["warranty_expiry"],
        categorySpecificFields: [],
      },
      "Machinery & Equipment": {
        ...baseValidationRules,
        locationFields: ["site", "building"],
        warrantyFields: ["warranty_expiry"],
        categorySpecificFields: [],
      },
      "Tools & Instruments": {
        ...baseValidationRules,
        locationFields: ["site", "building"],
        warrantyFields: ["warranty_expiry"],
        categorySpecificFields: [],
      },
      Meter: {
        ...baseValidationRules,
        locationFields: ["site", "building"],
        warrantyFields: ["warranty_expiry"],
        categorySpecificFields: [],
      },
    };

    const rules = categoryRules[selectedAssetCategory];
    if (!rules) return false;

    const checkFieldsCompleted = (
      fields: string[] = [],
      checkExtraFields = false
    ) => {
      for (const field of fields) {
        if (checkExtraFields) {
          // Check in extraFormFields for category-specific fields
          const extraField = extraFormFields[field];
          if (
            !extraField ||
            !extraField.value ||
            !extraField.value.toString().trim()
          ) {
            return false;
          }
        } else if (field === "pms_asset_group_id") {
          if (!selectedGroup) return false;
        } else if (field.startsWith("site") || field.startsWith("building")) {
          // For location fields, check selectedLocation
          const locationField =
            field === "site"
              ? "site"
              : field === "building"
                ? "building"
                : field;
          if (!selectedLocation[locationField]) return false;
        } else {
          // Check in formData
          if (!formData[field]) return false;
        }
      }
      return true;
    };

    switch (sectionType) {
      case "basic":
        return (
          checkFieldsCompleted(rules.baseFields || []) &&
          checkFieldsCompleted(rules.categorySpecificFields || [], true)
        );
      case "group":
        return checkFieldsCompleted(rules.groupFields || []);
      case "location":
        return checkFieldsCompleted(rules.locationFields || []);
      case "purchase":
        return checkFieldsCompleted(rules.purchaseFields || []);
      case "dates":
        return checkFieldsCompleted(rules.datesFields || []);
      case "warranty":
        return checkFieldsCompleted(rules.warrantyFields || []);
      default:
        return false;
    }
  };

  // Function to get completion status icon
  const getCompletionStatusIcon = (sectionType: string) => {
    const isCompleted = isSectionCompleted(sectionType);
    return isCompleted ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
    );
  };

  // Function to get category-specific validation summary
  const getCategoryValidationSummary = (category: string) => {
    const validationSummaries = {
      Land: {
        description:
          "Land assets require basic identification (Land Type, Location, Area), group selection, and purchase details. Location selection and warranty fields are not required as land is a location itself.",
        requiredSections: [
          "Asset Name",
          "Group & Subgroup",
          "Land Type",
          "Location",
          "Area (sq ft)",
          "Purchase Details",
          "Commissioning Date",
        ],
      },
      Building: {
        description:
          "Building assets require basic identification (Building Type, Location, Built-up Area), group selection, and purchase details. Buildings serve as locations themselves so location selection is not required.",
        requiredSections: [
          "Asset Name",
          "Group & Subgroup",
          "Building Type",
          "Location",
          "Built-up Area",
          "Purchase Details",
          "Commissioning Date",
        ],
      },
      "Leasehold Improvement": {
        description:
          "Leasehold improvement assets require basic identification (Improvement Description, Location Site), group selection, and purchase details. They are tied to specific leased properties.",
        requiredSections: [
          "Asset Name",
          "Group & Subgroup",
          "Improvement Description",
          "Location Site",
          "Purchase Details",
          "Commissioning Date",
        ],
      },
      Vehicle: {
        description:
          "Vehicle assets require basic identification (Vehicle Type, Make & Model, Registration Number), group selection, purchase details, and warranty information. Location is not required as vehicles are mobile.",
        requiredSections: [
          "Asset Name",
          "Group & Subgroup",
          "Vehicle Type",
          "Make & Model",
          "Registration Number",
          "Purchase Details",
          "Commissioning Date",
          "Warranty Expiry",
        ],
      },
      "Furniture & Fixtures": {
        description:
          "Furniture assets require basic identification, group selection, purchase details, warranty, and location information (Site & Building minimum) as they are fixed to specific locations.",
        requiredSections: [
          "Asset Name",
          "Group & Subgroup",
          "Location (Site & Building)",
          "Purchase Details",
          "Commissioning Date",
          "Warranty Expiry",
        ],
      },
      "IT Equipment": {
        description:
          "IT Equipment requires basic identification, group selection, purchase details, warranty, and location information (Site & Building minimum) for proper asset tracking.",
        requiredSections: [
          "Asset Name",
          "Group & Subgroup",
          "Location (Site & Building)",
          "Purchase Details",
          "Commissioning Date",
          "Warranty Expiry",
        ],
      },
      "Machinery & Equipment": {
        description:
          "Machinery requires basic identification, group selection, purchase details, warranty, and location information (Site & Building minimum) for maintenance and tracking.",
        requiredSections: [
          "Asset Name",
          "Group & Subgroup",
          "Location (Site & Building)",
          "Purchase Details",
          "Commissioning Date",
          "Warranty Expiry",
        ],
      },
      "Tools & Instruments": {
        description:
          "Tools require basic identification, group selection, purchase details, warranty, and location information (Site & Building minimum) for inventory management.",
        requiredSections: [
          "Asset Name",
          "Group & Subgroup",
          "Location (Site & Building)",
          "Purchase Details",
          "Commissioning Date",
          "Warranty Expiry",
        ],
      },
      Meter: {
        description:
          "Meter assets require basic identification, group selection, purchase details, warranty, and location information (Site & Building minimum) for utility monitoring and maintenance.",
        requiredSections: [
          "Asset Name",
          "Group & Subgroup",
          "Location (Site & Building)",
          "Purchase Details",
          "Commissioning Date",
          "Warranty Expiry",
        ],
      },
    };

    return (
      validationSummaries[category] || {
        description: "Please select a category to see validation requirements.",
        requiredSections: [],
      }
    );
  };

  // Helper function to get category-specific attachment arrays
  const getCategoryAttachments = () => {
    if (!selectedAssetCategory) return {};

    const categoryKey = selectedAssetCategory
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace("&", "");

    return {
      asset_image: attachments[`${categoryKey}AssetImage`] || [],
      asset_manuals: attachments[`${categoryKey}ManualsUpload`] || [],
      asset_insurances: attachments[`${categoryKey}InsuranceDetails`] || [],
      asset_purchases: attachments[`${categoryKey}PurchaseInvoice`] || [],
      asset_other_uploads: attachments[`${categoryKey}OtherDocuments`] || [],
      amc_documents: attachments[`${categoryKey}Amc`] || [],
      // Category-specific documents (if any)
      category_attachments: attachments[`${categoryKey}Attachments`] || [],
    };
  };

  const validateMandatoryFields = () => {
    const errors: string[] = [];

    // Base validation rules for all categories
    const baseValidationRules = {
      // Common required fields across all categories
      baseFields: ["name"], // Asset name is always required
      // groupFields: ['pms_asset_group_id', 'pms_asset_sub_group_id'], // Group and subgroup always required
      // purchaseFields: ['purchase_cost', 'purchased_on'], // Purchase details always required
      // datesFields: ['commisioning_date'], // Commissioning date always required
    };

    // Category-specific validation rules based on actual field configs
    const categoryValidationRules = {
      Land: {
        ...baseValidationRules,
        locationFields: [], // Land doesn't require location selection as it IS a location
        warrantyFields: [], // Land typically doesn't have warranty
        categorySpecificFields: [
          // From assetFieldsConfig - required fields for Land
          // 'land_type', // From Basic Identification (required: true)
          "location", // From Location & Ownership (required: true)
          "area", // From Land Size and Value (required: true) - using 'area' as defined in config
        ],
      },
      Building: {
        ...baseValidationRules,
        locationFields: [], // Buildings are locations themselves
        warrantyFields: [], // Buildings typically don't have warranty expiry
        categorySpecificFields: [
          // From assetFieldsConfig - required fields for Building
          "building_type", // From Basic Identification (required: true)
          "location", // From Location & Ownership (required: true)
          "built_up_area", // From Construction Details (required: true)
        ],
      },
      "Leasehold Improvement": {
        ...baseValidationRules,
        locationFields: [], // Improvements are tied to specific leased properties
        warrantyFields: [], // Improvements typically don't have warranty expiry
        categorySpecificFields: [
          // From assetFieldsConfig - required fields for Leasehold Improvement
          "improvement_description", // From Basic Identification (required: true)
          "location_site", // From Location & Association (required: true)
        ],
      },
      Vehicle: {
        ...baseValidationRules,
        locationFields: [], // Vehicles are mobile, don't require fixed location
        warrantyFields: ["warranty_expiry"], // Vehicles typically have warranty
        categorySpecificFields: [
          // From assetFieldsConfig - required fields for Vehicle
          "vehicle_type", // From Basic Identification (required: true)
          "make_model", // From Basic Identification (required: true)
          "registration_number", // From Basic Identification (required: true)
        ],
      },
      "Furniture & Fixtures": {
        ...baseValidationRules,
        locationFields: ["site", "building"], // Furniture needs location
        warrantyFields: ["warranty_expiry"], // Furniture typically has warranty
        categorySpecificFields: [], // No specific required fields beyond base ones
      },
      "IT Equipment": {
        ...baseValidationRules,
        locationFields: ["site", "building"], // IT Equipment needs location
        warrantyFields: ["warranty_expiry"], // IT Equipment typically has warranty
        categorySpecificFields: [], // No specific required fields beyond base ones
      },
      "Machinery & Equipment": {
        ...baseValidationRules,
        locationFields: ["site", "building"], // Machinery needs location
        warrantyFields: ["warranty_expiry"], // Machinery typically has warranty
        categorySpecificFields: [], // No specific required fields beyond base ones
      },
      "Tools & Instruments": {
        ...baseValidationRules,
        locationFields: ["site", "building"], // Tools need location
        warrantyFields: ["warranty_expiry"], // Tools typically have warranty
        categorySpecificFields: [], // No specific required fields beyond base ones
      },
      Meter: {
        ...baseValidationRules,
        locationFields: ["site", "building"], // Meters need location
        warrantyFields: ["warranty_expiry"], // Meters typically have warranty
        categorySpecificFields: [], // No specific required fields beyond base ones
      },
    };

    // Get validation rules for current category
    const currentCategoryRules = categoryValidationRules[selectedAssetCategory];

    if (!currentCategoryRules) {
      toast.error("Category Not Selected", {
        description: "Please select an asset category to continue.",
        duration: 4000,
      });
      return ["Asset category is required"];
    }

    // Field display names mapping
    const fieldDisplayNames = {
      // Base fields
      name: "Asset Name",
      asset_code: "Asset Code",
      pms_asset_group_id: "Group",
      pms_asset_sub_group_id: "Subgroup",
      purchase_cost: "Purchase Cost",
      purchased_on: "Purchase Date",
      commisioning_date: "Commissioning Date",
      warranty_expiry: "Warranty Expiry Date",

      // Location fields
      site: "Site",
      building: "Building",
      wing: "Wing",
      area: "Area",
      floor: "Floor",
      room: "Room",

      // Category-specific field display names from assetFieldsConfig
      // Land fields
      land_type: "Land Type",
      location: "Location",
      land_area: "Area (sq ft)", // Using land_area to avoid conflict

      // Building fields
      building_type: "Building Type",
      built_up_area: "Built-up Area (sq ft)",

      // Leasehold Improvement fields
      improvement_description: "Improvement Description",
      location_site: "Location Site",

      // Vehicle fields
      vehicle_type: "Vehicle Type",
      make_model: "Make & Model",
      registration_number: "Registration Number",

      // Generic fallback
      model_number: "Model Number",
      manufacturer: "Manufacturer",
    };

    // Helper function to validate fields from extraFormFields (dynamic fields)
    const validateExtraField = (fieldName: string, displayName: string) => {
      const extraField = extraFormFields[fieldName];
      if (
        !extraField ||
        !extraField.value ||
        !extraField.value.toString().trim()
      ) {
        toast.error(`${displayName} Required`, {
          description: `Please enter the ${displayName.toLowerCase()} for ${selectedAssetCategory}.`,
          duration: 4000,
        });
        return [`${displayName} is required for ${selectedAssetCategory}`];
      }
      return [];
    };

    // 1. Validate base fields (common to all categories)
    for (const field of currentCategoryRules.baseFields || []) {
      if (!formData[field]) {
        const fieldDisplayName =
          fieldDisplayNames[field] ||
          field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        toast.error(`${fieldDisplayName} Required`, {
          description: `Please enter the ${fieldDisplayName.toLowerCase()} to continue.`,
          duration: 4000,
        });
        return [`${fieldDisplayName} is required`];
      }
    }

    // 2. Validate group fields
    // for (const field of currentCategoryRules.groupFields) {
    // if (field === 'pms_asset_group_id' && !selectedGroup) {
    //   toast.error(`${fieldDisplayNames[field]} Required`, {
    //     description: `Please select an asset ${fieldDisplayNames[field].toLowerCase()} to continue.`,
    //     duration: 4000,
    //   });
    //   return [`${fieldDisplayNames[field]} is required`];
    // }
    //   if (field === 'pms_asset_sub_group_id' && !formData[field]) {
    //     toast.error(`${fieldDisplayNames[field]} Required`, {
    //       description: `Please select an asset ${fieldDisplayNames[field].toLowerCase()} to continue.`,
    //       duration: 4000,
    //     });
    //     return [`${fieldDisplayNames[field]} is required`];
    //   }
    // }

    // 3. Validate location fields (category-specific)
    for (const locationField of currentCategoryRules.locationFields || []) {
      if (!selectedLocation[locationField]) {
        const fieldDisplayName =
          fieldDisplayNames[locationField] ||
          locationField
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        toast.error(`${fieldDisplayName} Required`, {
          description: `Please select a ${fieldDisplayName.toLowerCase()} for ${selectedAssetCategory}.`,
          duration: 4000,
        });
        return [`${fieldDisplayName} is required for ${selectedAssetCategory}`];
      }
    }

    // // 4. Validate purchase fields
    // for (const field of currentCategoryRules.purchaseFields) {
    //   if (!formData[field]) {
    //     toast.error(`${fieldDisplayNames[field]} Required`, {
    //       description: `Please ${field.includes('date') ? 'select' : 'enter'} the ${fieldDisplayNames[field].toLowerCase()} to continue.`,
    //       duration: 4000,
    //     });
    //     return [`${fieldDisplayNames[field]} is required`];
    //   }
    // }

    // 5. Validate date fields
    for (const field of currentCategoryRules.datesFields || []) {
      if (!formData[field]) {
        const fieldDisplayName =
          fieldDisplayNames[field] ||
          field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        toast.error(`${fieldDisplayName} Required`, {
          description: `Please select the ${fieldDisplayName.toLowerCase()} to continue.`,
          duration: 4000,
        });
        return [`${fieldDisplayName} is required`];
      }
    }

    // 6. Validate warranty fields (category-specific)
    for (const field of currentCategoryRules.warrantyFields || []) {
      if (!formData[field]) {
        const fieldDisplayName =
          fieldDisplayNames[field] ||
          field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        toast.error(`${fieldDisplayName} Required`, {
          description: `Please select the ${fieldDisplayName.toLowerCase()} for ${selectedAssetCategory}.`,
          duration: 4000,
        });
        return [`${fieldDisplayName} is required for ${selectedAssetCategory}`];
      }
    }

    // 7. Validate category-specific required fields from assetFieldsConfig
    for (const fieldName of currentCategoryRules.categorySpecificFields || []) {
      const displayName =
        fieldDisplayNames[fieldName] ||
        fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

      // Check if field is in extraFormFields (dynamic fields from the category forms)
      const validationError = validateExtraField(fieldName, displayName);
      if (validationError.length > 0) {
        return validationError;
      }
    }

    // Asset Loaned validation (if applicable toggle is on)
    if (assetLoanedToggle) {
      if (!selectedLoanedVendorId) {
        toast.error("Vendor Required for Asset Loaned", {
          description: "Please select a vendor since Asset Loaned is enabled.",
          duration: 4000,
        });
        return ["Vendor Name is required for Asset Loaned"];
      }

      if (!formData.agreement_from_date) {
        toast.error("Agreement Start Date Required", {
          description:
            "Please select the agreement start date for Asset Loaned.",
          duration: 4000,
        });
        return ["Agreement Start Date is required for Asset Loaned"];
      }

      if (!formData.agreement_to_date) {
        toast.error("Agreement End Date Required", {
          description: "Please select the agreement end date for Asset Loaned.",
          duration: 4000,
        });
        return ["Agreement End Date is required for Asset Loaned"];
      }
    }

    // Depreciation validation (if applicable toggle is on)
    if (depreciationToggle) {
      if (!formData.useful_life) {
        toast.error("Useful Life Required", {
          description:
            "Please enter the useful life since Depreciation is enabled.",
          duration: 4000,
        });
        return ["Useful Life is required for Depreciation"];
      }

      if (!formData.salvage_value) {
        toast.error("Salvage Value Required", {
          description:
            "Please enter the salvage value since Depreciation is enabled.",
          duration: 4000,
        });
        return ["Salvage Value is required for Depreciation"];
      }

      if (!formData.depreciation_rate) {
        toast.error("Depreciation Rate Required", {
          description:
            "Please enter the depreciation rate since Depreciation is enabled.",
          duration: 4000,
        });
        return ["Depreciation Rate is required for Depreciation"];
      }
    }

    // Meter Details validation (if applicable toggle is on)
    if (
      meterDetailsToggle &&
      meterType === "SubMeter" &&
      !selectedParentMeterId
    ) {
      toast.error("Parent Meter Required", {
        description: "Please select a parent meter for Sub Meter type.",
        duration: 4000,
      });
      return ["Parent Meter is required for Sub Meter"];
    }

    // AMC Details validation (if any AMC field is filled, all are required)
    if (
      formData.amc_detail.supplier_id ||
      formData.amc_detail.amc_start_date ||
      formData.amc_detail.amc_end_date ||
      formData.amc_detail.amc_cost
    ) {
      if (!formData.amc_detail.supplier_id) {
        toast.error("AMC Vendor Required", {
          description:
            "Please select an AMC vendor since AMC details are being filled.",
          duration: 4000,
        });
        return ["AMC Vendor is required"];
      }

      if (!formData.amc_detail.amc_start_date) {
        toast.error("AMC Start Date Required", {
          description: "Please select the AMC start date.",
          duration: 4000,
        });
        return ["AMC Start Date is required"];
      }

      if (!formData.amc_detail.amc_end_date) {
        toast.error("AMC End Date Required", {
          description: "Please select the AMC end date.",
          duration: 4000,
        });
        return ["AMC End Date is required"];
      }

      if (!formData.amc_detail.amc_cost) {
        toast.error("AMC Cost Required", {
          description: "Please enter the AMC cost.",
          duration: 4000,
        });
        return ["AMC Cost is required"];
      }

      // AMC First Service date validation - ensure it's on or after commissioning date
      if (formData.amc_detail.amc_first_service && formData.commisioning_date) {
        const commissioningDate = new Date(formData.commisioning_date);
        const firstServiceDate = new Date(
          formData.amc_detail.amc_first_service
        );

        if (firstServiceDate < commissioningDate) {
          toast.error("Invalid AMC First Service Date", {
            description:
              "AMC First Service date cannot be before the commissioning date.",
            duration: 4000,
          });
          return ["AMC First Service date cannot be before commissioning date"];
        }
      }
    }

    // Warranty date validation - ensure warranty expiry is not before purchase date
    if (formData.warranty_expiry && formData.purchased_on) {
      const purchaseDate = new Date(formData.purchased_on);
      const warrantyDate = new Date(formData.warranty_expiry);

      if (warrantyDate < purchaseDate) {
        setFormData((prev) => ({
          ...prev,
          warranty_expiry: "", // Reset warranty expiry if invalid
        }));
        toast.error("Invalid Warranty Date", {
          description:
            "Warranty expiry date cannot be before the purchase date.",
          duration: 4000,
        });
        return ["Warranty expiry date cannot be before purchase date"];
      }
    }

    // If we reach here, all validations passed
    return [];
  };

  const handleSaveAndShow = () => {
    setSubmitting(true);
    // Validate mandatory fields one by one
    const validationErrors = validateMandatoryFields();
    setValidationErrors(validationErrors);

    if (validationErrors.length > 0) {
      // Since we're showing individual toasts in validateMandatoryFields,
      // we just need to scroll to the first error field and return
      setTimeout(() => {
        const firstErrorField = document.querySelector(
          ".MuiTextField-root .Mui-error input, .MuiFormControl-root .Mui-error, input:invalid"
        );
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Focus the field if it's an input
          if (
            firstErrorField instanceof HTMLInputElement ||
            firstErrorField instanceof HTMLSelectElement
          ) {
            firstErrorField.focus();
          }
        }
      }, 100);
      return;
    }

    // Clear validation errors if all fields are valid
    setValidationErrors([]);

    // Show success message before proceeding
    toast.success("Validation Complete", {
      description: "All required fields are filled. Creating asset...",
      duration: 2000,
    });

    // Build the complete payload
    const payload = {
      pms_asset: {
        // Basic asset fields
        name: formData.name,
        asset_number: formData.asset_number,
        model_number: formData.model_number,
        serial_number: formData.serial_number,
        manufacturer: formData.manufacturer,
        status: formData.status,
        critical: formData.critical,
        breakdown: formData.breakdown,

        // Location fields
        pms_site_id: selectedLocation.site,
        pms_building_id: selectedLocation.building,
        pms_wing_id: selectedLocation.wing,
        pms_area_id: selectedLocation.area,
        pms_floor_id: selectedLocation.floor,
        pms_room_id: selectedLocation.room,

        // Vendor and supplier fields
        loaned_from_vendor_id: formData.loaned_from_vendor_id,
        pms_supplier_id: formData.pms_supplier_id,

        // Dates
        agreement_from_date: formData.agreement_from_date,
        agreement_to_date: formData.agreement_to_date,
        commisioning_date: formData.commisioning_date,
        purchased_on: formData.purchased_on,
        warranty_expiry: formData.warranty_expiry,

        // Asset grouping
        pms_asset_group_id: formData.pms_asset_group_id,
        pms_asset_sub_group_id: formData.pms_asset_sub_group_id,

        // Financial fields
        salvage_value: formData.salvage_value,
        depreciation_rate: formData.depreciation_rate,
        depreciation_method: formData.depreciation_method,
        useful_life: formData.useful_life,
        purchase_cost: formData.purchase_cost,

        // Asset type flags
        it_asset: selectedAssetCategory === "IT Equipment" ? true : formData.it_asset,
        it_meter: formData.it_meter,
        is_meter: formData.is_meter,
        asset_loaned: formData.asset_loaned,
        depreciation_applicable: formData.depreciation_applicable,

        // Meter fields
        meter_tag_type: formData.meter_tag_type,
        parent_meter_id: formData.parent_meter_id,
        asset_meter_type_id: (() => {
          const meterTypeId = getAssetMeterTypeId(meterCategoryType, subCategoryType, tertiaryCategory);
          return typeof meterTypeId === 'number' ? meterTypeId : null;
        })(),

        // Warranty
        warranty: formData.warranty === "Yes" ? true : false,
        warranty_period: formData.warranty_period,

        // Other fields
        depreciation_applicable_for: formData.depreciation_applicable_for,
        indiv_group: formData.depreciation_applicable_for === "similar_product"
          ? formData.similar_product_type === "individual"
            ? "individual"
            : formData.similar_product_type === "group"
              ? "group"
              : formData.indiv_group
          : formData.indiv_group,
        allocation_type: formData.allocation_type,

        // Depreciation similar product fields
        similar_product_type: formData.similar_product_type,
        selected_asset_id: formData.selected_asset_id,
        selected_asset_ids: formData.selected_asset_ids,
        // Include group_id and sub_group_id when asset group is selected for depreciation
        ...(formData.depreciation_applicable_for === "similar_product" &&
          formData.similar_product_type === "group" && {
          group_id: formData.selected_group_id,
          sub_group_id: formData.selected_sub_group_id,
        }),

        // Array fields - include selected asset IDs when individual asset is selected for depreciation
        asset_ids: formData.depreciation_applicable_for === "similar_product" &&
          formData.similar_product_type === "individual" &&
          formData.selected_asset_ids && formData.selected_asset_ids.length > 0
          ? formData.selected_asset_ids
          : formData.asset_ids,

        // Single allocation field
        allocation_id: formData.allocation_id,

        // Nested objects
        asset_move_to: formData.asset_move_to,
        amc_detail: formData.amc_detail,

        // IT Asset custom fields (as nested object)
        custom_fields: buildCustomFieldsPayload(),

        // Asset type
        asset_type: formData.asset_type,

        // Extra fields for other categories (as array)
        extra_fields_attributes: buildExtraFieldsAttributes(),

        // Meter measures
        consumption_pms_asset_measures_attributes: consumptionMeasureFields.map(
          (field) => ({
            name: field.name,
            meter_unit_id: field.unitType,
            min_value: field.min,
            max_value: field.max,
            alert_below: field.alertBelowVal,
            alert_above: field.alertAboveVal,
            multiplier_factor: field.multiplierFactor,
            active: true,
            meter_tag: "Consumption",
            check_previous_reading: field.checkPreviousReading || false,
            _destroy: false,
          })
        ),

        non_consumption_pms_asset_measures_attributes:
          nonConsumptionMeasureFields.map((field) => ({
            name: field.name,
            meter_unit_id: field.unitType,
            min_value: field.min,
            max_value: field.max,
            alert_below: field.alertBelowVal,
            alert_above: field.alertAboveVal,
            multiplier_factor: field.multiplierFactor,
            active: true,
            meter_tag: "Non Consumption",
            check_previous_reading: field.checkPreviousReading || false,
            _destroy: false,
          })),

        // Category-specific file attachments
        ...getCategoryAttachments(),
      },
    };

    console.log("Final payload:", payload);
    console.log("AMC Detail being sent:", payload.pms_asset.amc_detail);
    console.log(
      "Loan details - loaned_from_vendor_id:",
      payload.pms_asset.loaned_from_vendor_id
    );
    console.log(
      "Loan details - agreement_from_date:",
      payload.pms_asset.agreement_from_date
    );
    console.log(
      "Loan details - agreement_to_date:",
      payload.pms_asset.agreement_to_date
    );
    console.log(
      "Loan details - asset_loaned flag:",
      payload.pms_asset.asset_loaned
    );
    console.log("Selected Loaned Vendor ID State:", selectedLoanedVendorId);
    console.log("Asset Loaned Toggle State:", assetLoanedToggle);
    console.log(
      "Extra fields attributes being sent:",
      payload.pms_asset.extra_fields_attributes
    );
    console.log("Using FormData:", hasFiles());

    // If sending files, use FormData
    if (hasFiles()) {
      const formDataObj = new FormData();

      // Add all non-file fields
      Object.entries(payload.pms_asset).forEach(([key, value]) => {
        if (
          ![
            "asset_manuals",
            "asset_insurances",
            "asset_purchases",
            "asset_other_uploads",
            "land_attachments",
            "extra_fields_attributes",
            "consumption_pms_asset_measures_attributes",
            "non_consumption_pms_asset_measures_attributes",
            "amc_detail",
            "asset_move_to",
          ].includes(key)
        ) {
          if (typeof value === "object" && value !== null) {
            formDataObj.append(`pms_asset[${key}]`, JSON.stringify(value));
          } else {
            // Ensure value is string or Blob for FormData
            if (typeof value === "string" || value instanceof Blob) {
              formDataObj.append(`pms_asset[${key}]`, value);
            } else if (
              typeof value === "boolean" ||
              typeof value === "number"
            ) {
              formDataObj.append(`pms_asset[${key}]`, value.toString());
            } else if (value !== null && value !== undefined) {
              formDataObj.append(`pms_asset[${key}]`, JSON.stringify(value));
            }
          }
        }
      });

      // Handle nested objects specially for FormData - flatten them
      // Handle amc_detail
      if (
        payload.pms_asset.amc_detail &&
        typeof payload.pms_asset.amc_detail === "object"
      ) {
        Object.entries(payload.pms_asset.amc_detail).forEach(
          ([fieldKey, fieldValue]) => {
            if (
              fieldValue !== null &&
              fieldValue !== undefined &&
              fieldValue !== ""
            ) {
              formDataObj.append(
                `pms_asset[amc_detail][${fieldKey}]`,
                String(fieldValue)
              );
            }
          }
        );
      }

      // Handle asset_move_to
      if (
        payload.pms_asset.asset_move_to &&
        typeof payload.pms_asset.asset_move_to === "object"
      ) {
        Object.entries(payload.pms_asset.asset_move_to).forEach(
          ([fieldKey, fieldValue]) => {
            if (
              fieldValue !== null &&
              fieldValue !== undefined &&
              fieldValue !== ""
            ) {
              formDataObj.append(
                `pms_asset[asset_move_to][${fieldKey}]`,
                String(fieldValue)
              );
            }
          }
        );
      }

      // Handle extra_fields_attributes specially for FormData
      if (
        payload.pms_asset.extra_fields_attributes &&
        Array.isArray(payload.pms_asset.extra_fields_attributes)
      ) {
        payload.pms_asset.extra_fields_attributes.forEach((field, index) => {
          Object.entries(field).forEach(([fieldKey, fieldValue]) => {
            formDataObj.append(
              `pms_asset[extra_fields_attributes][${index}][${fieldKey}]`,
              String(fieldValue)
            );
          });
        });
      }

      // Handle consumption measures
      if (
        payload.pms_asset.consumption_pms_asset_measures_attributes &&
        Array.isArray(
          payload.pms_asset.consumption_pms_asset_measures_attributes
        )
      ) {
        payload.pms_asset.consumption_pms_asset_measures_attributes.forEach(
          (measure, index) => {
            Object.entries(measure).forEach(([measureKey, measureValue]) => {
              formDataObj.append(
                `pms_asset[consumption_pms_asset_measures_attributes][${index}][${measureKey}]`,
                String(measureValue)
              );
            });
          }
        );
      }

      // Handle non-consumption measures
      if (
        payload.pms_asset.non_consumption_pms_asset_measures_attributes &&
        Array.isArray(
          payload.pms_asset.non_consumption_pms_asset_measures_attributes
        )
      ) {
        payload.pms_asset.non_consumption_pms_asset_measures_attributes.forEach(
          (measure, index) => {
            Object.entries(measure).forEach(([measureKey, measureValue]) => {
              formDataObj.append(
                `pms_asset[non_consumption_pms_asset_measures_attributes][${index}][${measureKey}]`,
                String(measureValue)
              );
            });
          }
        );
      }

      // Add category-specific files dynamically
      if (selectedAssetCategory) {
        const categoryKey = selectedAssetCategory
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace("&", "");
        const categoryAttachments = getCategoryAttachments();

        // Add asset image
        if (
          categoryAttachments.asset_image &&
          categoryAttachments.asset_image.length > 0
        ) {
          formDataObj.append(
            "pms_asset[asset_image]",
            categoryAttachments.asset_image[0]
          );
        }

        // Add category-specific documents
        if (categoryAttachments.asset_manuals) {
          categoryAttachments.asset_manuals.forEach((file) =>
            formDataObj.append("asset_manuals[]", file)
          );
        }

        if (categoryAttachments.asset_insurances) {
          categoryAttachments.asset_insurances.forEach((file) =>
            formDataObj.append("asset_insurances[]", file)
          );
        }

        if (categoryAttachments.asset_purchases) {
          categoryAttachments.asset_purchases.forEach((file) =>
            formDataObj.append("asset_purchases[]", file)
          );
        }

        if (categoryAttachments.asset_other_uploads) {
          categoryAttachments.asset_other_uploads.forEach((file) =>
            formDataObj.append("asset_other_uploads[]", file)
          );
        }

        if (categoryAttachments.amc_documents) {
          categoryAttachments.amc_documents.forEach((file) =>
            formDataObj.append("amc_documents[]", file)
          );
        }

        // Add category-specific attachments (if any)
        if (categoryAttachments.category_attachments) {
          categoryAttachments.category_attachments.forEach((file) =>
            formDataObj.append(`${categoryKey}_attachments[]`, file)
          );
        }
      }
      // Debug: Log FormData contents
      console.log("FormData contents:");
      const amcKeys = [];
      const loanKeys = [];
      for (let [key, value] of formDataObj.entries()) {
        if (key.includes("amc_detail")) {
          amcKeys.push(`${key}: ${value}`);
        }
        if (
          key.includes("loaned_from_vendor") ||
          key.includes("agreement_") ||
          key.includes("asset_loaned")
        ) {
          loanKeys.push(`${key}: ${value}`);
        }
        console.log(key, value);
      }
      console.log("AMC FormData entries:", amcKeys);
      console.log("Loan FormData entries:", loanKeys);

      // Submit with FormData
      apiClient
        .post("pms/assets.json", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 300000, // 5 minutes timeout for large files
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          },
        })
        .then((response) => {
          console.log("Asset created successfully:", response.data);
          toast.success("Asset Created Successfully", {
            description: "The asset has been created and saved.",
            duration: 3000,
          });
          // Small delay to show the toast before redirect
          setTimeout(() => {
            window.location.href = "/maintenance/asset";
          }, 1000);
        })
        .catch((err) => {
          console.error("Error creating asset:", err);

          if (err.response?.status === 413) {
            toast.error("Upload Failed", {
              description:
                "Request too large. Please reduce the number or size of files and try again.",
              duration: 6000,
            });
          } else if (err.response?.status === 422) {
            toast.error("Validation Error", {
              description: "Please check your form data and try again.",
              duration: 6000,
            });
          } else if (err.code === "ECONNABORTED") {
            toast.error("Upload Timeout", {
              description:
                "Please try with smaller files or check your internet connection.",
              duration: 6000,
            });
          } else {
            toast.error("Upload Failed", {
              description:
                err.response?.data?.message ||
                err.message ||
                "An unknown error occurred",
              duration: 6000,
            });
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      // Submit as JSON
      apiClient
        .post("pms/assets.json", payload, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log("Asset created successfully:", response.data);
          // navigate('/maintenance/asset');
          location.reload();
        })
        .catch((err) => {
          console.error("Error creating asset:", err);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  // Helper function to check if there are files to upload
  const hasFiles = () => {
    if (!selectedAssetCategory) return false;

    const categoryAttachments = getCategoryAttachments();

    return (
      (categoryAttachments.asset_image &&
        categoryAttachments.asset_image.length > 0) ||
      (categoryAttachments.asset_manuals &&
        categoryAttachments.asset_manuals.length > 0) ||
      (categoryAttachments.asset_insurances &&
        categoryAttachments.asset_insurances.length > 0) ||
      (categoryAttachments.asset_purchases &&
        categoryAttachments.asset_purchases.length > 0) ||
      (categoryAttachments.asset_other_uploads &&
        categoryAttachments.asset_other_uploads.length > 0) ||
      (categoryAttachments.amc_documents &&
        categoryAttachments.amc_documents.length > 0) ||
      (categoryAttachments.category_attachments &&
        categoryAttachments.category_attachments.length > 0)
    );
  };
  // ...existing code...

  const handleSaveAndCreate = () => {
    // Validate mandatory fields one by one
    const validationErrors = validateMandatoryFields();
    setValidationErrors(validationErrors);

    if (validationErrors.length > 0) {
      // Since we're showing individual toasts in validateMandatoryFields,
      // we just need to scroll to the first error field and return
      setTimeout(() => {
        const firstErrorField = document.querySelector(
          ".MuiTextField-root .Mui-error input, .MuiFormControl-root .Mui-error, input:invalid"
        );
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Focus the field if it's an input
          if (
            firstErrorField instanceof HTMLInputElement ||
            firstErrorField instanceof HTMLSelectElement
          ) {
            firstErrorField.focus();
          }
        }
      }, 100);
      return;
    }

    // Clear validation errors if all fields are valid
    setValidationErrors([]);

    // Show success message before proceeding
    toast.success("Validation Complete", {
      description: "All required fields are filled. Creating asset...",
      duration: 2000,
    });
    // Build the complete payload
    const payload = {
      pms_asset: {
        // Basic asset fields
        name: formData.name,
        asset_number: formData.asset_number,
        model_number: formData.model_number,
        serial_number: formData.serial_number,
        manufacturer: formData.manufacturer,
        status: formData.status,
        critical: formData.critical,
        breakdown: formData.breakdown,

        // Location fields
        pms_site_id: selectedLocation.site,
        pms_building_id: selectedLocation.building,
        pms_wing_id: selectedLocation.wing,
        pms_area_id: selectedLocation.area,
        pms_floor_id: selectedLocation.floor,
        pms_room_id: selectedLocation.room,

        // Vendor and supplier fields
        loaned_from_vendor_id: formData.loaned_from_vendor_id,
        pms_supplier_id: formData.pms_supplier_id,

        // Dates
        agreement_from_date: formData.agreement_from_date,
        agreement_to_date: formData.agreement_to_date,
        commisioning_date: formData.commisioning_date,
        purchased_on: formData.purchased_on,
        warranty_expiry: formData.warranty_expiry,

        // Asset grouping
        pms_asset_group_id: formData.pms_asset_group_id,
        pms_asset_sub_group_id: formData.pms_asset_sub_group_id,

        // Financial fields
        salvage_value: formData.salvage_value,
        depreciation_rate: formData.depreciation_rate,
        depreciation_method: formData.depreciation_method,
        useful_life: formData.useful_life,
        purchase_cost: formData.purchase_cost,

        // Asset type flags
        it_asset: selectedAssetCategory === "IT Equipment" ? true : formData.it_asset,
        it_meter: formData.it_meter,
        is_meter: formData.is_meter,
        asset_loaned: formData.asset_loaned,
        depreciation_applicable: formData.depreciation_applicable,
        it_asset_eq: selectedAssetCategory === "IT Equipment",

        // Meter fields
        meter_tag_type: formData.meter_tag_type,
        parent_meter_id: formData.parent_meter_id,

        // Warranty
        warranty: formData.warranty,
        warranty_period: formData.warranty_period,

        // Other fields
        depreciation_applicable_for: formData.depreciation_applicable_for,
        indiv_group: formData.depreciation_applicable_for === "similar_product"
          ? formData.similar_product_type === "individual"
            ? "individual"
            : formData.similar_product_type === "group"
              ? "group"
              : formData.indiv_group
          : formData.indiv_group,
        allocation_type: formData.allocation_type,

        // Depreciation similar product fields
        similar_product_type: formData.similar_product_type,
        selected_asset_id: formData.selected_asset_id,
        selected_asset_ids: formData.selected_asset_ids,
        // Include group_id and sub_group_id when asset group is selected for depreciation
        ...(formData.depreciation_applicable_for === "similar_product" &&
          formData.similar_product_type === "group" && {
          group_id: formData.selected_group_id,
          sub_group_id: formData.selected_sub_group_id,
        }),

        // Array fields - include selected asset IDs when individual asset is selected for depreciation
        asset_ids: formData.depreciation_applicable_for === "similar_product" &&
          formData.similar_product_type === "individual" &&
          formData.selected_asset_ids && formData.selected_asset_ids.length > 0
          ? formData.selected_asset_ids
          : formData.asset_ids,

        // Single allocation field
        allocation_id: formData.allocation_id,

        // Nested objects
        asset_move_to: formData.asset_move_to,
        amc_detail: formData.amc_detail,

        // Asset type
        asset_type: formData.asset_type,

        ...(selectedAssetCategory === "IT Equipment"
          ? { custom_fields: buildCustomFieldsPayload() }
          : {}),

        // Extra fields for other categories (as array)
        extra_fields_attributes: buildExtraFieldsAttributes(),

        // Meter measures
        consumption_pms_asset_measures_attributes: consumptionMeasureFields.map(
          (field) => ({
            name: field.name,
            meter_unit_id: field.unitType,
            min_value: field.min,
            max_value: field.max,
            alert_below: field.alertBelowVal,
            alert_above: field.alertAboveVal,
            multiplier_factor: field.multiplierFactor,
            active: true,
            meter_tag: "Consumption",
            check_previous_reading: field.checkPreviousReading || false,
            _destroy: false,
          })
        ),

        non_consumption_pms_asset_measures_attributes:
          nonConsumptionMeasureFields.map((field) => ({
            name: field.name,
            meter_unit_id: field.unitType,
            min_value: field.min,
            max_value: field.max,
            alert_below: field.alertBelowVal,
            alert_above: field.alertAboveVal,
            multiplier_factor: field.multiplierFactor,
            active: true,
            meter_tag: "Non Consumption",
            check_previous_reading: field.checkPreviousReading || false,
            _destroy: false,
          })),

        // Category-specific file attachments
        ...getCategoryAttachments(),
      },
    };

    console.log("Final payload:", payload);
    console.log("AMC Detail being sent:", payload.pms_asset.amc_detail);
    console.log(
      "Loan details - loaned_from_vendor_id:",
      payload.pms_asset.loaned_from_vendor_id
    );
    console.log(
      "Loan details - agreement_from_date:",
      payload.pms_asset.agreement_from_date
    );
    console.log(
      "Loan details - agreement_to_date:",
      payload.pms_asset.agreement_to_date
    );
    console.log(
      "Loan details - asset_loaned flag:",
      payload.pms_asset.asset_loaned
    );
    console.log("Selected Loaned Vendor ID State:", selectedLoanedVendorId);
    console.log("Asset Loaned Toggle State:", assetLoanedToggle);
    console.log(
      "Extra fields attributes being sent:",
      payload.pms_asset.extra_fields_attributes
    );
    console.log("Using FormData:", hasFiles());

    // If sending files, use FormData
    if (hasFiles()) {
      const formDataObj = new FormData();

      // Add all non-file fields
      Object.entries(payload.pms_asset).forEach(([key, value]) => {
        if (
          ![
            "asset_manuals",
            "asset_insurances",
            "asset_purchases",
            "asset_other_uploads",
            "land_attachments",
            "extra_fields_attributes",
            "consumption_pms_asset_measures_attributes",
            "non_consumption_pms_asset_measures_attributes",
            "amc_detail",
            "asset_move_to",
          ].includes(key)
        ) {
          if (typeof value === "object" && value !== null) {
            formDataObj.append(`pms_asset[${key}]`, JSON.stringify(value));
          } else {
            // Ensure value is string or Blob for FormData
            if (typeof value === "string" || value instanceof Blob) {
              formDataObj.append(`pms_asset[${key}]`, value);
            } else if (
              typeof value === "boolean" ||
              typeof value === "number"
            ) {
              formDataObj.append(`pms_asset[${key}]`, value.toString());
            } else if (value !== null && value !== undefined) {
              formDataObj.append(`pms_asset[${key}]`, JSON.stringify(value));
            }
          }
        }
      });

      // Handle nested objects specially for FormData - flatten them
      // Handle amc_detail
      if (
        payload.pms_asset.amc_detail &&
        typeof payload.pms_asset.amc_detail === "object"
      ) {
        Object.entries(payload.pms_asset.amc_detail).forEach(
          ([fieldKey, fieldValue]) => {
            if (
              fieldValue !== null &&
              fieldValue !== undefined &&
              fieldValue !== ""
            ) {
              formDataObj.append(
                `pms_asset[amc_detail][${fieldKey}]`,
                String(fieldValue)
              );
            }
          }
        );
      }

      // Handle asset_move_to
      if (
        payload.pms_asset.asset_move_to &&
        typeof payload.pms_asset.asset_move_to === "object"
      ) {
        Object.entries(payload.pms_asset.asset_move_to).forEach(
          ([fieldKey, fieldValue]) => {
            if (
              fieldValue !== null &&
              fieldValue !== undefined &&
              fieldValue !== ""
            ) {
              formDataObj.append(
                `pms_asset[asset_move_to][${fieldKey}]`,
                String(fieldValue)
              );
            }
          }
        );
      }

      // Handle extra_fields_attributes specially for FormData
      if (
        payload.pms_asset.extra_fields_attributes &&
        Array.isArray(payload.pms_asset.extra_fields_attributes)
      ) {
        payload.pms_asset.extra_fields_attributes.forEach((field, index) => {
          Object.entries(field).forEach(([fieldKey, fieldValue]) => {
            formDataObj.append(
              `pms_asset[extra_fields_attributes][${index}][${fieldKey}]`,
              String(fieldValue)
            );
          });
        });
      }

      // Handle consumption measures
      if (
        payload.pms_asset.consumption_pms_asset_measures_attributes &&
        Array.isArray(
          payload.pms_asset.consumption_pms_asset_measures_attributes
        )
      ) {
        payload.pms_asset.consumption_pms_asset_measures_attributes.forEach(
          (measure, index) => {
            Object.entries(measure).forEach(([measureKey, measureValue]) => {
              formDataObj.append(
                `pms_asset[consumption_pms_asset_measures_attributes][${index}][${measureKey}]`,
                String(measureValue)
              );
            });
          }
        );
      }

      // Handle non-consumption measures
      if (
        payload.pms_asset.non_consumption_pms_asset_measures_attributes &&
        Array.isArray(
          payload.pms_asset.non_consumption_pms_asset_measures_attributes
        )
      ) {
        payload.pms_asset.non_consumption_pms_asset_measures_attributes.forEach(
          (measure, index) => {
            Object.entries(measure).forEach(([measureKey, measureValue]) => {
              formDataObj.append(
                `pms_asset[non_consumption_pms_asset_measures_attributes][${index}][${measureKey}]`,
                String(measureValue)
              );
            });
          }
        );
      }

      // Add category-specific files dynamically
      if (selectedAssetCategory) {
        const categoryKey = selectedAssetCategory
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace("&", "");
        const categoryAttachments = getCategoryAttachments();

        // Add asset image
        if (
          categoryAttachments.asset_image &&
          categoryAttachments.asset_image.length > 0
        ) {
          formDataObj.append(
            "pms_asset[asset_image]",
            categoryAttachments.asset_image[0]
          );
        }

        // Add category-specific documents
        if (categoryAttachments.asset_manuals) {
          categoryAttachments.asset_manuals.forEach((file) =>
            formDataObj.append("asset_manuals[]", file)
          );
        }

        if (categoryAttachments.asset_insurances) {
          categoryAttachments.asset_insurances.forEach((file) =>
            formDataObj.append("asset_insurances[]", file)
          );
        }

        if (categoryAttachments.asset_purchases) {
          categoryAttachments.asset_purchases.forEach((file) =>
            formDataObj.append("asset_purchases[]", file)
          );
        }

        if (categoryAttachments.asset_other_uploads) {
          categoryAttachments.asset_other_uploads.forEach((file) =>
            formDataObj.append("asset_other_uploads[]", file)
          );
        }

        if (categoryAttachments.amc_documents) {
          categoryAttachments.amc_documents.forEach((file) =>
            formDataObj.append("amc_documents[]", file)
          );
        }

        // Add category-specific attachments (if any)
        if (categoryAttachments.category_attachments) {
          categoryAttachments.category_attachments.forEach((file) =>
            formDataObj.append(`${categoryKey}_attachments[]`, file)
          );
        }
      }
      // Debug: Log FormData contents
      console.log("FormData contents:");
      const amcKeys = [];
      const loanKeys = [];
      for (let [key, value] of formDataObj.entries()) {
        if (key.includes("amc_detail")) {
          amcKeys.push(`${key}: ${value}`);
        }
        if (
          key.includes("loaned_from_vendor") ||
          key.includes("agreement_") ||
          key.includes("asset_loaned")
        ) {
          loanKeys.push(`${key}: ${value}`);
        }
        console.log(key, value);
      }
      console.log("AMC FormData entries:", amcKeys);
      console.log("Loan FormData entries:", loanKeys);

      // Submit with FormData
      apiClient
        .post("pms/assets.json", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 300000, // 5 minutes timeout for large files
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          },
        })
        .then((response) => {
          console.log("Asset created successfully:", response.data);
          toast.success("Asset Created Successfully", {
            description: "The asset has been created and saved.",
            duration: 3000,
          });
          // Small delay to show the toast before redirect
          setTimeout(() => {
            // window.location.href = "/maintenance/asset";
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          console.error("Error creating asset:", err);

          if (err.response?.status === 413) {
            toast.error("Upload Failed", {
              description:
                "Request too large. Please reduce the number or size of files and try again.",
              duration: 6000,
            });
          } else if (err.response?.status === 422) {
            toast.error("Validation Error", {
              description: "Please check your form data and try again.",
              duration: 6000,
            });
          } else if (err.code === "ECONNABORTED") {
            toast.error("Upload Timeout", {
              description:
                "Please try with smaller files or check your internet connection.",
              duration: 6000,
            });
          } else {
            toast.error("Upload Failed", {
              description:
                err.response?.data?.message ||
                err.message ||
                "An unknown error occurred",
              duration: 6000,
            });
          }
        });
    } else {
      // Submit as JSON
      apiClient
        .post("pms/assets.json", payload, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log("Asset created successfully:", response.data);
          // navigate('/maintenance/asset');
          location.reload(); // Reload to show the new asset in the list
          toast.success("Asset Created Successfully", {
            description: "The asset has been created and saved.",
            duration: 3000,
          });
        })
        .catch((err) => {
          console.error("Error creating asset:", err);
        });
    }
  };
  const fieldStyles = {
    height: {
      xs: 28,
      sm: 36,
      md: 45,
    },
    "& .MuiInputBase-input, & .MuiSelect-select": {
      padding: {
        xs: "8px",
        sm: "10px",
        md: "12px",
      },
    },
  };
  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Asset List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Create New Asset</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          NEW ASSET
        </h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Asset Category Selection */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-l-4 border-l-[#C72030] p-2 sm:p-6 bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-6">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              ASSET CATEGORY
            </div>
            <div className="w-full">
              <RadioGroup
                value={selectedAssetCategory}
                onValueChange={(category) => {
                  setSelectedAssetCategory(category);
                  // handleFieldChange('asset_category', category);
                  handleExtraFieldChange(
                    "asset_category",
                    category,
                    "text",
                    "basicIdentification",
                    "Asset Category"
                  );
                  // Reset form data when category changes
                  setFormData((prevData) => ({
                    ...prevData,
                    asset_category: category,
                    name: "",
                    asset_number: "",
                    // Preserve these fields for Leasehold Improvement
                    location_site:
                      category === "Leasehold Improvement"
                        ? prevData.location_site
                        : "",
                    improvement_description:
                      category === "Leasehold Improvement"
                        ? prevData.improvement_description
                        : "",
                  }));
                }}
                className="flex flex-wrap gap-2 lg:gap-3"
              >
                {[
                  "Land",
                  "Building",
                  "Leasehold Improvement",
                  "Vehicle",
                  "Furniture & Fixtures",
                  "IT Equipment",
                  "Machinery & Equipment",
                  "Tools & Instruments",
                  "Meter",
                ].map((category) => (
                  <div
                    key={category}
                    className="flex flex-col items-center space-y-1 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer min-w-[90px] flex-1"
                  >
                    <RadioGroupItem
                      value={category}
                      id={category}
                      className="mx-auto"
                    />
                    <label
                      htmlFor={category}
                      className="text-xs font-medium cursor-pointer text-center leading-tight"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Validation Requirements Info - Show when category is selected */}
            {/* {selectedAssetCategory && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    {selectedAssetCategory} - Required Fields
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    {getCategoryValidationSummary(selectedAssetCategory).description}
                  </p>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-blue-700">Required Sections:</span>
                    <div className="flex flex-wrap gap-2">
                      {getCategoryValidationSummary(selectedAssetCategory).requiredSections.map((section, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
          </div>
        </div>

        {/* Land Asset Details - Show when Land is selected */}
        {selectedAssetCategory === "Land" && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="space-y-6">
              {/* Asset Image Upload */}

              {/* Basic Identification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Basic Identification
                    </div>
                    <button
                      onClick={() =>
                        openCustomFieldModal("basicIdentification")
                      }
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Asset Id/Code"
                      placeholder="Enter unique identifier"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) => {
                        handleFieldChange("asset_number", e.target.value);
                        handleExtraFieldChange(
                          "asset_number",
                          e.target.value,
                          "text",
                          "basicIdentification",
                          "Asset Id/Code"
                        );
                      }}
                    />
                    <TextField
                      label="Asset Name"
                      placeholder="Enter land name"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) => {
                        handleFieldChange("name", e.target.value);
                        handleExtraFieldChange(
                          "asset_name",
                          e.target.value,
                          "text",
                          "basicIdentification",
                          "Asset Name"
                        );
                      }}
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Land Type</InputLabel>
                      <MuiSelect
                        label="Land Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "landType",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "basicIdentification",
                            "Land Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Land Type</MenuItem>
                        <MenuItem value="raw">Raw Land</MenuItem>
                        <MenuItem value="developed">Developed Land</MenuItem>
                        <MenuItem value="leased">Leased</MenuItem>
                        <MenuItem value="agricultural">Agricultural</MenuItem>
                        <MenuItem value="special">Special Use</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    {/* Custom Fields */}
                    {(customFields.basicIdentification || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "basicIdentification",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("basicIdentification", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location & Ownership */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location & Ownership
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("locationOwnership")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Location"
                      placeholder="Full address or GPS coordinates"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "location",
                          e.target.value,
                          "text",
                          "locationOwnership",
                          "Location"
                        )
                      }
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Ownership Type</InputLabel>
                      <MuiSelect
                        label="Ownership Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "ownership_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "basicIdentification",
                            "Ownership Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Ownership Type</MenuItem>
                        <MenuItem value="owned">Owned</MenuItem>
                        <MenuItem value="leased">Leased</MenuItem>
                        <MenuItem value="allotted">Allotted</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Legal Document Ref No."
                      placeholder="Title deed, lease ID, etc."
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "legal_document_ref_no",
                          e.target.value,
                          "text",
                          "locationOwnership",
                          "Legal Document Ref No"
                        )
                      }
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Zoning Classification</InputLabel>
                      <MuiSelect
                        label="Zoning Classification"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "zoning_classification",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "locationOwnership",
                            "Zoning Classification"
                          )
                        }
                      >
                        <MenuItem value="">Select Zoning</MenuItem>
                        <MenuItem value="residential">Residential</MenuItem>
                        <MenuItem value="commercial">Commercial</MenuItem>
                        <MenuItem value="agricultural">Agricultural</MenuItem>
                        <MenuItem value="industrial">Industrial</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Encumbrance Status</InputLabel>
                      <MuiSelect
                        label="Encumbrance Status"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "encumbrance_status",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "locationOwnership",
                            "Encumbrance Status"
                          )
                        }
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="clear">Clear</MenuItem>
                        <MenuItem value="mortgage">Under Mortgage</MenuItem>
                        <MenuItem value="disputed">Disputed</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    {/* Custom Fields */}
                    {(customFields.locationOwnership || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "locationOwnership",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("locationOwnership", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Land Size & Value */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-5 h-5" />
                      Land Size & Value
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("landSizeValue")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <TextField
                        label="Area"
                        placeholder="Enter area"
                        variant="outlined"
                        type="number"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "area",
                            (e.target as HTMLInputElement).value,
                            "number",
                            "landSizeValue",
                            "Area"
                          )
                        }
                      />
                      <FormControl
                        sx={{
                          minWidth: 100,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      >
                        <InputLabel>Unit</InputLabel>
                        <MuiSelect
                          label="Unit"
                          defaultValue="sqft"
                          onChange={(e) =>
                            handleExtraFieldChange(
                              "land_unit",
                              (e.target as HTMLInputElement).value,
                              "select",
                              "landSizeValue",
                              "Land Unit"
                            )
                          }
                        >
                          <MenuItem value="sqft">Sq. Ft.</MenuItem>
                          <MenuItem value="acres">Acres</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>

                    <TextField
                      label="Date of Acquisition"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true, // Ensures label doesn't overlap with the date value
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value; // This will be in YYYY-MM-DD format
                        handleExtraFieldChange(
                          "date_of_acquisition",
                          selectedDate,
                          "date",
                          "landSizeValue",
                          "Date of Acquisition"
                        );
                      }}
                    />

                    <div className="flex gap-2">
                      <FormControl
                        sx={{
                          minWidth: 80,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      >
                        <InputLabel>Currency</InputLabel>
                        <MuiSelect
                          label="Currency"
                          defaultValue="inr"
                          onChange={(e) =>
                            handleExtraFieldChange(
                              "currency",
                              (e.target as HTMLInputElement).value,
                              "select",
                              "landSizeValue",
                              "Currency"
                            )
                          }
                        >
                          <MenuItem value="inr">OMR</MenuItem>
                        </MuiSelect>
                      </FormControl>
                      <TextField
                        label="Acquisition Cost"
                        placeholder="Enter cost"
                        variant="outlined"
                        type="number"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "acquisition_cost",
                            (e.target as HTMLInputElement).value,
                            "number",
                            "landSizeValue",
                            "Acquisition Cost"
                          )
                        }
                      />
                    </div>
                    <TextField
                      label="Current Market Value (OMR)"
                      placeholder="Enter current value"
                      variant="outlined"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {localStorage.getItem("currency")}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "current_market_value",
                          (e.target as HTMLInputElement).value,
                          "number",
                          "landSizeValue",
                          "Current Market Value"
                        )
                      }
                    />
                  </div>
                  {/* Custom Fields */}
                  {(customFields.landSizeValue || []).map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange(
                            "landSizeValue",
                            field.id,
                            e.target.value
                          );
                        }}
                      />
                      <button
                        onClick={() =>
                          removeCustomField("landSizeValue", field.id)
                        }
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Land Usage & Development */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Construction className="w-5 h-5" />
                      Land Usage & Development
                    </div>
                    <button
                      onClick={() =>
                        openCustomFieldModal("landUsageDevelopment")
                      }
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Purpose / Use</InputLabel>
                      <MuiSelect
                        label="Purpose / Use"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "purpose_use",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "landUsageDevelopment",
                            "Purpose / Use"
                          )
                        }
                      >
                        <MenuItem value="">Select Purpose</MenuItem>
                        <MenuItem value="commercial">Commercial</MenuItem>
                        <MenuItem value="residential">Residential</MenuItem>
                        <MenuItem value="reserved">Reserved</MenuItem>
                        <MenuItem value="institutional">Institutional</MenuItem>
                        <MenuItem value="industrial">Industrial</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Land Improvements</InputLabel>
                      <MuiSelect
                        label="Land Improvements"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "land_improvements",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "landUsageDevelopment",
                            "Land Improvements"
                          )
                        }
                      >
                        <MenuItem value="">Select Improvements</MenuItem>
                        <MenuItem value="fencing">Fencing</MenuItem>
                        <MenuItem value="landscaping">Landscaping</MenuItem>
                        <MenuItem value="roads"> Internal Roads</MenuItem>
                        <MenuItem value="electricity">Electricity</MenuItem>
                        <MenuItem value="wateracess">Water Access</MenuItem>
                        <MenuItem value="other">Other </MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Responsible Department"
                      placeholder="Enter department or user"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "reaponsible_department",
                          (e.target as HTMLInputElement).value,
                          "select",
                          "landUsageDevelopment",
                          "Responsible Department"
                        )
                      }
                    />

                    {/* Custom Fields */}
                    {(customFields.landUsageDevelopment || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "landUsageDevelopment",
                              field.id,
                              e.target.value
                            );
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("landUsageDevelopment", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Miscellaneous */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Archive className="w-5 h-5" />
                      Miscellaneous
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("miscellaneous")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TextField
                    label="Remarks / Notes"
                    placeholder="Special remarks, legal concerns, or development plans"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        // height: { xs: '36px', md: '45px' }
                      },
                    }}
                    // onChange={e => handleFieldChange('remarks', e.target.value)}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        "remarks",
                        e.target.value,
                        "text",
                        "miscellaneous",
                        "Remarks / Notes"
                      )
                    }
                  />
                  {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="land-attachments"
                    onChange={e => handleFileUpload('landAttachments', e.target.files)}
                  />
                  <label htmlFor="land-attachments" className="cursor-pointer">
                    <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload attachments
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload deed copy, layout, map, lease, etc.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Max 10MB per file, 50MB total. Images will be compressed automatically.
                    </p>
                  </label>
                  {attachments.landAttachments && attachments.landAttachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {attachments.landAttachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                          <div className="flex flex-col truncate">
                            <span className="text-xs sm:text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <button onClick={() => removeFile('landAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-1">
                        Total: {attachments.landAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                          ? `${(attachments.landAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                          : `${(attachments.landAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                        }
                      </div>
                        

                    </div>
                    
                  )}
                </div> */}

                  {/* Custom Fields */}
                  {(customFields.miscellaneous || []).map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange(
                            "miscellaneous",
                            field.id,
                            e.target.value
                          );
                        }}
                      />
                      <button
                        onClick={() =>
                          removeCustomField("miscellaneous", field.id)
                        }
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <AssetImageUpload
                categoryName="Land"
                categoryKey="landAssetImage"
                onImageUpload={handleFileUpload}
                onImageRemove={removeFile}
                images={attachments.landAssetImage}
              />
            </div>
          </LocalizationProvider>
        )}

        {/* Leasehold Improvement Asset Details - Show when Leasehold Improvement is selected */}
        {selectedAssetCategory === "Leasehold Improvement" && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="space-y-6">
              {/* Asset Image Upload */}

              {/* Basic Identification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Basic Identification
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("leaseholdBasicId")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Asset ID / Code"
                      placeholder="Enter alphanumeric code"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) => {
                        handleFieldChange("asset_number", e.target.value);
                        handleExtraFieldChange(
                          "asset_number",
                          e.target.value,
                          "text",
                          "basicIdentification",
                          "Asset Id/Code"
                        );
                      }}
                    />
                    <TextField
                      label="Improvement Description"
                      placeholder="e.g., Flooring, IT Cabling"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                    />

                    {/* Custom Fields */}
                    {(customFields.leaseholdBasicId || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('leaseholdBasicId', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "leaseholdBasicId",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("leaseholdBasicId", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location & Association */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location & Association
                    </div>
                    <button
                      onClick={() =>
                        openCustomFieldModal("leaseholdLocationAssoc")
                      }
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Location / Site"
                      placeholder="Enter location"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        handleExtraFieldChange(
                          "location_site",
                          value,
                          "text",
                          "leaseholdLocationAssoc",
                          "Location Site"
                        );
                        handleFieldChange("location_site", value);
                      }}
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Leased Property ID</InputLabel>
                      <MuiSelect
                        label="Leased Property ID"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "leased_property_id",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "leaseholdLocationAssoc",
                            "Leased Property ID"
                          )
                        }
                      >
                        <MenuItem value="">Select Property</MenuItem>
                        <MenuItem value="prop001">Property 001</MenuItem>
                        <MenuItem value="prop002">Property 002</MenuItem>
                        <MenuItem value="prop003">Property 003</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    {/* <TextField
                    label="Ownership Type"
                    value="Lessee"
                    variant="outlined"
                    fullWidth
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}

                  /> */}

                    {/* Custom Fields */}
                    {(customFields.leaseholdLocationAssoc || []).map(
                      (field) => (
                        <div key={field.id} className="relative">
                          <TextField
                            label={field.name}
                            placeholder={`Enter ${field.name}`}
                            variant="outlined"
                            fullWidth
                            value={field.value}
                            // onChange={(e) => handleCustomFieldChange('leaseholdLocationAssoc', field.id, e.target.value)}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: { xs: "36px", md: "45px" },
                              },
                            }}
                            onChange={(e) => {
                              handleCustomFieldChange(
                                "leaseholdLocationAssoc",
                                field.id,
                                e.target.value
                              );
                            }}
                          />
                          <button
                            onClick={() =>
                              removeCustomField(
                                "leaseholdLocationAssoc",
                                field.id
                              )
                            }
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Improvement Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Construction className="w-5 h-5" />
                      Improvement Details
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("improvementDetails")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Improvement Description"
                      placeholder="Describe the improvement work"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{
                        gridColumn: { md: "span 2" },
                        "& .MuiOutlinedInput-root": {
                          minHeight: { xs: "60px", md: "70px" },
                        },
                      }}
                      onChange={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        handleExtraFieldChange(
                          "improvement_description",
                          value,
                          "text",
                          "improvementDetails",
                          "Improvement Description"
                        );
                        // handleFieldChange('improvement_description', value);
                      }}
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Type of Improvement</InputLabel>
                      <MuiSelect
                        label="Type of Improvement"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "improvement_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "improvementDetails",
                            "Type of Improvement"
                          )
                        }
                      >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="civil">Civil</MenuItem>
                        <MenuItem value="electrical">Electrical</MenuItem>
                        <MenuItem value="hvac">HVAC</MenuItem>
                        <MenuItem value="plumbing">Plumbing</MenuItem>
                        <MenuItem value="Security">Security</MenuItem>
                        <MenuItem value="it">IT Infrastructure</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Vendor / Contractor Name</InputLabel>
                      <MuiSelect
                        label="Vendor / Contractor Name"
                        value={selectedVendorId}
                        onChange={(e) => {
                          setSelectedVendorId(e.target.value);
                          const selectedVendor = vendors.find(
                            (vendor) => vendor.id === Number(e.target.value)
                          );
                          if (selectedVendor) {
                            handleExtraFieldChange(
                              "vendor_contractor_name",
                              selectedVendor.name,
                              "text",
                              "improvementDetails",
                              "Vendor / Contractor Name"
                            );
                          }
                        }}
                        disabled={vendorsLoading}
                      >
                        <MenuItem value="">
                          {vendorsLoading
                            ? "Loading vendors..."
                            : "Select Vendor"}
                        </MenuItem>
                        {vendors.map((vendor) => (
                          <MenuItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Invoice Number"
                      placeholder="Enter invoice number"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "invoice_number",
                          (e.target as HTMLInputElement).value,
                          "text",
                          "improvementDetails",
                          "Invoice Number"
                        )
                      }
                    />
                    {/* <DatePicker
                      label="Date of Improvement"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD for backend compatibility
                        const formattedDate = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        handleExtraFieldChange(
                          "improvement_date",
                          formattedDate,
                          "date",
                          "improvementDetails",
                          "Improvement Date"
                        );
                      }}
                    /> */}
                    <TextField
                      label="Date of Improvement"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true, // Ensures label stays above the input
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value; // Already in YYYY-MM-DD format
                        handleExtraFieldChange(
                          "improvement_date",
                          selectedDate,
                          "date",
                          "improvementDetails",
                          "Improvement Date"
                        );
                      }}
                    />

                    <TextField
                      label="Improvement Cost (INR)"
                      placeholder="Enter cost"
                      variant="outlined"
                      fullWidth
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {localStorage.getItem("currency")}
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "improvement_cost",
                          (e.target as HTMLInputElement).value,
                          "number",
                          "improvementDetails",
                          "Improvement Cost"
                        )
                      }
                    />

                    {/* Custom Fields */}
                    {(customFields.improvementDetails || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('improvementDetails', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "improvementDetails",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("improvementDetails", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Financial & Depreciation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Financial & Depreciation
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("leaseholdFinancial")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Depreciation Method</InputLabel>
                      <MuiSelect
                        label="Depreciation Method"
                        defaultValue=""
                        onChange={(e) => {
                          handleExtraFieldChange(
                            "depreciation_method",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "leaseholdFinancial",
                            "Depreciation Method"
                          );
                          handleFieldChange(
                            "depreciation_method",
                            e.target.value
                          );
                        }}
                      >
                        <MenuItem value="">Select Method</MenuItem>
                        <MenuItem value="straight_line">Straight Line</MenuItem>
                        <MenuItem value="wdv">Written Down Value</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Useful Life (Years)"
                      placeholder="Enter years"
                      variant="outlined"
                      fullWidth
                      type="number"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      inputProps={{
                        min: 0,
                        onKeyDown: (e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault(); // prevent negative or exponent
                          }
                        },
                      }}
                      onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value)); // auto-correct to 0 if negative
                        handleExtraFieldChange(
                          "useful_life_years",
                          value,
                          "number",
                          "leaseholdFinancial",
                          "Useful Life (Years)"
                        );
                        handleFieldChange("useful_life", value);
                      }}
                    />

                    <TextField
                      label="Depreciation Rate (%)"
                      placeholder="Enter rate"
                      variant="outlined"
                      fullWidth
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      inputProps={{
                        min: 0,
                        max: 100,
                        step: 0.1,
                        onKeyDown: (e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault(); // prevent negative or exponent
                          }
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) => {
                        let value = parseFloat(e.target.value);

                        // Validate range 0-100
                        if (value < 0) {
                          value = 0;
                          e.target.value = "0";
                        } else if (value > 100) {
                          value = 100;
                          e.target.value = "100";
                        }

                        handleExtraFieldChange(
                          "depreciation_rate",
                          value.toString(),
                          "number",
                          "leaseholdFinancial",
                          "Depreciation Rate"
                        );
                        handleFieldChange(
                          "depreciation_rate",
                          value.toString()
                        );
                      }}
                    />
                    <TextField
                      label="Current Book Value (OMR)"
                      placeholder="Enter value"
                      variant="outlined"
                      fullWidth
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {localStorage.getItem("currency")}
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "current_book_value",
                          (e.target as HTMLInputElement).value,
                          "number",
                          "leaseholdFinancial",
                          "Current Book Value"
                        )
                      }
                    />
                    {/* <DatePicker
                      label="Asset Capitalized On"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) =>
                        handleExtraFieldChange(
                          "capitalization_date",
                          date,
                          "date",
                          "leaseholdFinancial",
                          "Capitalization Date"
                        )
                      }
                    /> */}

                    <TextField
                      label="Asset Capitalized On"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true, // Ensures label displays properly with date value
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value; // Format: YYYY-MM-DD
                        handleExtraFieldChange(
                          "capitalization_date",
                          selectedDate,
                          "date",
                          "leaseholdFinancial",
                          "Capitalization Date"
                        );
                      }}
                    />

                    {/* Custom Fields */}
                    {(customFields.leaseholdFinancial || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('leaseholdFinancial', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "leaseholdFinancial",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("leaseholdFinancial", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lease & Maintenance Linkages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Lease & Maintenance Linkages
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("leaseholdLease")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <DatePicker
                      label="Lease Start Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD for backend compatibility
                        const formattedDate = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        handleExtraFieldChange(
                          "lease_start_date",
                          formattedDate,
                          "date",
                          "leaseholdLease",
                          "Lease Start Date"
                        );
                      }}
                    />
                    <DatePicker
                      label="Lease End Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD for backend compatibility
                        const formattedDate = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        handleExtraFieldChange(
                          "lease_end_date",
                          formattedDate,
                          "date",
                          "leaseholdLease",
                          "Lease End Date"
                        );
                      }}
                    /> */}
                    <TextField
                      label="Lease Start Date"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value;
                        handleExtraFieldChange(
                          "lease_start_date",
                          selectedDate,
                          "date",
                          "leaseholdLease",
                          "Lease Start Date"
                        );
                      }}
                    />

                    <TextField
                      label="Lease End Date"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value;
                        handleExtraFieldChange(
                          "lease_end_date",
                          selectedDate,
                          "date",
                          "leaseholdLease",
                          "Lease End Date"
                        );
                      }}
                    />

                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>AMC / PPM Linked</InputLabel>
                      <MuiSelect
                        label="AMC / PPM Linked"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "amc_ppm_linked",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "leaseholdLease",
                            "AMC / PPM Linked"
                          )
                        }
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    {/* Custom Fields */}
                    {(customFields.leaseholdLease || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('leaseholdLease', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "leaseholdLease",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("leaseholdLease", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Oversight & Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users2 className="w-5 h-5" />
                      Oversight & Documentation
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("leaseholdOversight")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {},
                      }}
                    >
                      <InputLabel>Responsible Department</InputLabel>
                      <MuiSelect
                        label="Responsible Department"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "responsible_department",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "leaseholdOversight",
                            "Responsible Department"
                          )
                        }
                      >
                        <MenuItem value="">Select Department</MenuItem>
                        <MenuItem value="facilities">
                          Facilities Management
                        </MenuItem>
                        <MenuItem value="admin">Administration</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                        <MenuItem value="it">IT Department</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <div className="md:col-span-2">
                      <TextField
                        label="Remarks / Notes"
                        placeholder="Enter remarks or notes"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        sx={{
                          "& .MuiOutlinedInput-root": {},
                        }}
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "remarks_notes",
                            (e.target as HTMLInputElement).value,
                            "text",
                            "leaseholdOversight",
                            "Remarks / Notes"
                          )
                        }
                      />
                    </div>
                    {/* <div className="md:col-span-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        id="leasehold-attachments"
                        onChange={e => handleFileUpload('leaseholdAttachments', e.target.files)}
                      />
                      <label htmlFor="leasehold-attachments" className="cursor-pointer">
                        <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload attachments
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload invoices, contracts, improvement photos, etc.
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          Max 10MB per file, 50MB total. Images will be compressed automatically.
                        </p>
                      </label>
                      {attachments.leaseholdAttachments && attachments.leaseholdAttachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {attachments.leaseholdAttachments.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                              <div className="flex flex-col truncate">
                                <span className="text-xs sm:text-sm truncate">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                              <button onClick={() => removeFile('leaseholdAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="text-xs text-gray-500 mt-1">
                            Total: {attachments.leaseholdAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                              ? `${(attachments.leaseholdAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                              : `${(attachments.leaseholdAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div> */}

                    {/* Custom Fields */}
                    {(customFields.leaseholdOversight || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "leaseholdOversight",
                              field.id,
                              e.target.value
                            );
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("leaseholdOversight", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </LocalizationProvider>
        )}

        {/* Vehicle Asset Details - Show when Vehicle is selected */}
        {selectedAssetCategory === "Vehicle" && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="space-y-6">
              {/* Asset Image Upload */}

              {/* Basic Identification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Basic Identification
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("vehicleBasicId")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Asset ID / Code"
                      placeholder="System-generated or manually entered"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) => {
                        handleFieldChange("serial_number", e.target.value);
                        handleExtraFieldChange(
                          "asset_number",
                          e.target.value,
                          "text",
                          "basicIdentification",
                          "Asset Id/Code"
                        );
                      }}
                    />
                    <TextField
                      label="Asset Name"
                      placeholder="Name "
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Vehicle Type</InputLabel>
                      <MuiSelect
                        label="Vehicle Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "vehicle_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "vehicleBasicId",
                            "Vehicle Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Vehicle Type</MenuItem>
                        <MenuItem value="car">Car</MenuItem>
                        <MenuItem value="truck">Truck</MenuItem>
                        <MenuItem value="van">Van</MenuItem>
                        <MenuItem value="forklift">Forklift</MenuItem>
                        <MenuItem value="electric-cart">Electric Cart</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Make & Model"
                      placeholder="e.g., Tata Ace, Honda Activa"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "make_model",
                          (e.target as HTMLInputElement).value,
                          "select",
                          "vehicleBasicId",
                          "Make & Model"
                        )
                      }
                    />
                    <TextField
                      label="Registration Number"
                      placeholder="e.g., MH01AB1234"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "registration_number",
                          (e.target as HTMLInputElement).value,
                          "select",
                          "vehicleBasicId",
                          "Registration Number"
                        )
                      }
                    />

                    {/* Custom Fields */}
                    {(customFields.vehicleBasicId || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('vehicleBasicId', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "vehicleBasicId",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("vehicleBasicId", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Technical Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cog className="w-5 h-5" />
                      Technical Specifications
                    </div>
                    <button
                      onClick={() =>
                        openCustomFieldModal("vehicleTechnicalSpecs")
                      }
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Chassis Number"
                      placeholder="Enter chassis number"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "chassis_number",
                          (e.target as HTMLInputElement).value,
                          "text",
                          "vehicleTechnicalSpecs",
                          "Chassis Number"
                        )
                      }
                    />
                    <TextField
                      label="Engine Number"
                      placeholder="Enter engine number"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "engine_number",
                          (e.target as HTMLInputElement).value,
                          "text",
                          "vehicleTechnicalSpecs",
                          "Engine Number"
                        )
                      }
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Fuel Type</InputLabel>
                      <MuiSelect
                        label="Fuel Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "fuel_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "vehicleTechnicalSpecs",
                            "Fuel Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Fuel Type</MenuItem>
                        <MenuItem value="petrol">Petrol</MenuItem>
                        <MenuItem value="diesel">Diesel</MenuItem>
                        <MenuItem value="cng">CNG</MenuItem>
                        <MenuItem value="electric">Electric</MenuItem>
                        <MenuItem value="hybrid">Hybrid</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Custom Fields for Technical Specifications */}
                  {(customFields.vehicleTechnicalSpecs || []).map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 mb-2"
                    >
                      <TextField
                        label={field.name}
                        value={field.value}
                        onChange={(e) => {
                          handleCustomFieldChange(
                            "vehicleTechnicalSpecs",
                            field.id,
                            e.target.value
                          );
                        }}
                        variant="outlined"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      />
                      <button
                        onClick={() =>
                          removeCustomField("vehicleTechnicalSpecs", field.id)
                        }
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Ownership & Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users2 className="w-5 h-5" />
                      Ownership & Usage
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("vehicleOwnership")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Ownership Type</InputLabel>
                      <MuiSelect
                        label="Ownership Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "ownership_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "vehicleOwnership",
                            "Ownership Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Ownership Type</MenuItem>
                        <MenuItem value="owned">Owned</MenuItem>
                        <MenuItem value="leased">Leased</MenuItem>
                        <MenuItem value="company-owned">Company-Owned</MenuItem>
                        <MenuItem value="departmental">Departmental</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Assigned To / Department</InputLabel>
                      <MuiSelect
                        label="Assigned To / Department"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "assigned_to_department",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "vehicleOwnership",
                            "Assigned To / Department"
                          )
                        }
                      >
                        <MenuItem value="">Select Department/User</MenuItem>
                        <MenuItem value="admin">Administration</MenuItem>
                        <MenuItem value="hr">Human Resources</MenuItem>
                        <MenuItem value="logistics">Logistics</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Usage Type</InputLabel>
                      <MuiSelect
                        label="Usage Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "usage_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "vehicleOwnership",
                            "Usage Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Usage Type</MenuItem>
                        <MenuItem value="official">Official</MenuItem>
                        <MenuItem value="delivery">Delivery</MenuItem>
                        <MenuItem value="emergency">Emergency</MenuItem>
                        <MenuItem value="transport">Transport</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Permit Type</InputLabel>
                      <MuiSelect
                        label="Permit Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "permit_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "vehicleOwnership",
                            "Permit Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Permit Type</MenuItem>
                        <MenuItem value="private">Private</MenuItem>
                        <MenuItem value="commercial">Commercial</MenuItem>
                        <MenuItem value="transport">Transport Permit</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    {/* Custom Fields */}
                    {(customFields.vehicleOwnership || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('vehicleOwnership', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "vehicleOwnership",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("vehicleOwnership", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Financial & Depreciation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Financial & Depreciation
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("vehicleFinancial")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <DatePicker
                      label="Date of Purchase"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD for backend compatibility
                        const formattedDate = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        handleExtraFieldChange(
                          "purchase_date",
                          formattedDate,
                          "date",
                          "vehicleFinancial",
                          "Date of Purchase"
                        );
                        handleFieldChange("commisioning_date", formattedDate);
                      }}

                    /> */}
                    <TextField
                      label="Date of Purchase"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value; // Format: YYYY-MM-DD
                        handleExtraFieldChange(
                          "purchase_date",
                          selectedDate,
                          "date",
                          "vehicleFinancial",
                          "Date of Purchase"
                        );
                        handleFieldChange("commisioning_date", selectedDate);
                      }}
                    />

                    <div className="flex gap-2">
                      <FormControl
                        sx={{
                          minWidth: 80,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      >
                        <InputLabel>Currency</InputLabel>
                        <MuiSelect
                          label="Currency"
                          defaultValue="inr"
                          onChange={(e) => {
                            handleExtraFieldChange(
                              "currency",
                              (e.target as HTMLInputElement).value,
                              "select",
                              "vehicleFinancial",
                              "Currency"
                            );
                          }}
                        >
                          <MenuItem value="inr">OMR</MenuItem>
                        </MuiSelect>
                      </FormControl>
                      <TextField
                        label="Purchase Cost"
                        placeholder="Enter purchase cost"
                        variant="outlined"
                        type="number"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {localStorage.getItem("currency")}
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          handleFieldChange("purchase_cost", e.target.value);
                          handleExtraFieldChange(
                            "purchase_cost",
                            (e.target as HTMLInputElement).value,
                            "number",
                            "vehicleFinancial",
                            "Purchase Cost"
                          );
                        }}
                      />
                    </div>
                    {/* <DatePicker
                      label="Warranty Expires On"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD for backend compatibility
                        const formattedDate = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        handleFieldChange("warranty_expiry", formattedDate);
                      }}
                    /> */}
                    <TextField
                      label="Warranty Expires On"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value; // Already in YYYY-MM-DD format
                        handleFieldChange("warranty_expiry", selectedDate);
                      }}
                    />

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Under Warranty
                      </label>
                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="vehicle-warranty-yes"
                            name="vehicle-warranty"
                            value="yes"
                            checked={underWarranty === "yes"}
                            onChange={(e) => {
                              setUnderWarranty(e.target.value);
                              handleFieldChange(
                                "warranty",
                                e.target.value === "yes"
                              );
                            }}
                            className="w-4 h-4 text-[#C72030] border-gray-300"
                            style={{ accentColor: "#C72030" }}
                          />
                          <label
                            htmlFor="vehicle-warranty-yes"
                            className="text-sm"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="vehicle-warranty-no"
                            name="vehicle-warranty"
                            value="no"
                            checked={underWarranty === "no"}
                            onChange={(e) => {
                              setUnderWarranty(e.target.value);
                              handleFieldChange(
                                "warranty",
                                e.target.value === "no"
                              );
                            }}
                            className="w-4 h-4 text-[#C72030] border-gray-300"
                            style={{ accentColor: "#C72030" }}
                          />
                          <label
                            htmlFor="vehicle-warranty-no"
                            className="text-sm"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    {underWarranty === "yes" && (
                      <TextField
                        label="Warranty Period"
                        placeholder="e.g. 24 months"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formData.warranty_period}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow positive numbers
                          if (
                            value === "" ||
                            (Number(value) >= 0 && !value.includes("-"))
                          ) {
                            handleFieldChange("warranty_period", value);
                          }
                        }}
                        inputProps={{
                          min: 0,
                          step: 1,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      />
                    )}
                    <TextField
                      label="Depreciation Rate (%)"
                      placeholder="Linked to depreciation module"
                      variant="outlined"
                      fullWidth
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "depreciation_rate",
                          (e.target as HTMLInputElement).value,
                          "number",
                          "vehicleFinancial",
                          "Depreciation Rate"
                        )
                      }
                    />
                    <TextField
                      label="Current Book Value (OMR)"
                      placeholder="Calculated or manually entered"
                      variant="outlined"
                      fullWidth
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {localStorage.getItem("currency")}
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "current_book_value",
                          (e.target as HTMLInputElement).value,
                          "number",
                          "vehicleFinancial",
                          "Current Book Value"
                        )
                      }
                    />

                    {/* Custom Fields */}
                    {(customFields.vehicleFinancial || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) =>
                            handleCustomFieldChange(
                              "vehicleFinancial",
                              field.id,
                              e.target.value
                            )
                          }
                        />
                        <button
                          onClick={() =>
                            removeCustomField("vehicleFinancial", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Performance className="w-5 h-5" />
                      Performance Tracking
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("vehiclePerformance")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <TextField
                        label="Odometer Reading"
                        placeholder="Enter reading"
                        variant="outlined"
                        type="number"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">KM</InputAdornment>
                          ),
                        }}
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "odometer_reading",
                            (e.target as HTMLInputElement).value,
                            "number",
                            "vehiclePerformance",
                            "Odometer Reading"
                          )
                        }
                      />
                      <FormControl
                        sx={{
                          minWidth: 80,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      >
                        <InputLabel>Unit</InputLabel>
                        <MuiSelect
                          label="Unit"
                          defaultValue="km"
                          onChange={(e) =>
                            handleExtraFieldChange(
                              "odometer_unit",
                              (e.target as HTMLInputElement).value,
                              "select",
                              "vehiclePerformance",
                              "Odometer Unit"
                            )
                          }
                        >
                          <MenuItem value="km">KM</MenuItem>
                          <MenuItem value="miles">Miles</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>
                    <TextField
                      label="Service Schedule (PPM)"
                      placeholder="Enter PPM schedule details"
                      variant="outlined"
                      fullWidth
                      value={extraFormFields.service_schedule_ppm?.value || ""}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "service_schedule_ppm",
                          (e.target as HTMLInputElement).value,
                          "text",
                          "vehiclePerformance",
                          "Service Schedule (PPM)"
                        )
                      }
                    />
                    {/* <DatePicker
                      label="Last Service Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD for backend compatibility
                        const formattedDate = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        handleExtraFieldChange(
                          "last_service_date",
                          formattedDate,
                          "date",
                          "vehiclePerformance",
                          "Last Service Date"
                        );
                      }}
                    /> */}
                    <TextField
                      label="Last Service Date"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value; // Format: YYYY-MM-DD
                        handleExtraFieldChange(
                          "last_service_date",
                          selectedDate,
                          "date",
                          "vehiclePerformance",
                          "Last Service Date"
                        );
                      }}
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>AMC Linked</InputLabel>
                      <MuiSelect
                        label="AMC Linked"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "amc_linked",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "vehiclePerformance",
                            "AMC Linked"
                          )
                        }
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Custom Fields for Performance Tracking */}
                  {(customFields.vehiclePerformance || []).map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 mb-2"
                    >
                      <TextField
                        label={field.name}
                        value={field.value}
                        onChange={(e) => {
                          handleCustomFieldChange(
                            "vehiclePerformance",
                            field.id,
                            e.target.value
                          );
                        }}
                        variant="outlined"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      />
                      <button
                        onClick={() =>
                          removeCustomField("vehiclePerformance", field.id)
                        }
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Legal & Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Legal & Compliance
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("vehicleLegal")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Insurance Provider"
                      placeholder="Enter insurance provider name"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "insurance_provider",
                          (e.target as HTMLInputElement).value,
                          "text",
                          "vehicleLegal",
                          "Insurance Provider"
                        )
                      }
                    />
                    <TextField
                      label="Insurance Policy No."
                      placeholder="Enter policy number"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "insurance_policy_no",
                          (e.target as HTMLInputElement).value,
                          "text",
                          "vehicleLegal",
                          "Insurance Policy No."
                        )
                      }
                    />
                    {/* <DatePicker
                      label="Insurance Expiry Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD for backend compatibility
                        const formattedDate = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        handleExtraFieldChange(
                          "insurance_expiry_date",
                          formattedDate,
                          "date",
                          "vehicleLegal",
                          "Insurance Expiry Date"
                        );
                      }}
                    />
                    <DatePicker
                      label="Fitness Certificate Expiry"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD for backend compatibility
                        const formattedDate = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        handleExtraFieldChange(
                          "fitness_certificate_expiry",
                          formattedDate,
                          "date",
                          "vehicleLegal",
                          "Fitness Certificate Expiry"
                        );
                      }}
                    />
                    <DatePicker
                      label="PUC Expiry Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD for backend compatibility
                        const formattedDate = date
                          ? date.toISOString().split("T")[0]
                          : "";
                        handleExtraFieldChange(
                          "puc_expiry_date",
                          formattedDate,
                          "date",
                          "vehicleLegal",
                          "PUC Expiry Date"
                        );
                      }}
                    /> */}
                    <TextField
                      label="Insurance Expiry Date"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value;
                        handleExtraFieldChange(
                          "insurance_expiry_date",
                          selectedDate,
                          "date",
                          "vehicleLegal",
                          "Insurance Expiry Date"
                        );
                      }}
                    />


                    <TextField
                      label="Fitness Certificate Expiry"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value;
                        handleExtraFieldChange(
                          "fitness_certificate_expiry",
                          selectedDate,
                          "date",
                          "vehicleLegal",
                          "Fitness Certificate Expiry"
                        );
                      }}
                    />


                    <TextField
                      label="PUC Expiry Date"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value;
                        handleExtraFieldChange(
                          "puc_expiry_date",
                          selectedDate,
                          "date",
                          "vehicleLegal",
                          "PUC Expiry Date"
                        );
                      }}
                    />

                    {/* Custom Fields */}
                    {(customFields.vehicleLegal || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('vehicleLegal', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "vehicleLegal",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("vehicleLegal", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Miscellaneous */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Archive className="w-5 h-5" />
                      Miscellaneous
                    </div>
                    <button
                      onClick={() =>
                        openCustomFieldModal("vehicleMiscellaneous")
                      }
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TextField
                    label="Remarks / Notes"
                    placeholder="Comments, issues, or notes"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        // height: { xs: '80px', md: '100px' }
                      },
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        "remarks_notes",
                        (e.target as HTMLInputElement).value,
                        "text",
                        "vehicleMiscellaneous",
                        "Remarks / Notes"
                      )
                    }
                  />
                  {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="vehicle-attachments"
                    onChange={(e) => handleFileUpload('vehicleAttachments', e.target.files)}
                  />
                  <label htmlFor="vehicle-attachments" className="cursor-pointer">
                    <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload attachments
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload RC copy, insurance, permit, fitness, PUC, etc.
                    </p>
                  </label>
                </div> */}

                  {/* Display uploaded vehicle attachments */}
                  {attachments.vehicleAttachments &&
                    attachments.vehicleAttachments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Uploaded Vehicle Documents:
                        </h4>
                        <div className="space-y-2">
                          {attachments.vehicleAttachments.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                            >
                              <div className="flex items-center space-x-2">
                                <Archive className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700 truncate max-w-xs">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  removeFile("vehicleAttachments", index)
                                }
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove file"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Custom Fields */}
                  {(customFields.vehicleMiscellaneous || []).map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('vehicleMiscellaneous', field.id, e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange(
                            "vehicleMiscellaneous",
                            field.id,
                            e.target.value
                          );
                        }}
                      />
                      <button
                        onClick={() =>
                          removeCustomField("vehicleMiscellaneous", field.id)
                        }
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </LocalizationProvider>
        )}

        {/* Building Asset Details - Show when Building is selected */}
        {selectedAssetCategory === "Building" && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="space-y-6">
              {/* Asset Image Upload */}

              {/* Basic Identification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Basic Identification
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("buildingBasicId")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Asset ID / Code"
                      placeholder="Enter unique identifier"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) => {
                        handleFieldChange("asset_number", e.target.value);
                        handleExtraFieldChange(
                          "asset_number",
                          e.target.value,
                          "text",
                          "basicIdentification",
                          "Asset Id/Code"
                        );
                      }}
                    />
                    <TextField
                      label="Asset Name"
                      placeholder="Enter building name"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Building Type</InputLabel>
                      <MuiSelect
                        label="Building Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "building_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "buildingBasicId",
                            "Building Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Building Type</MenuItem>
                        <MenuItem value="office">Office</MenuItem>
                        <MenuItem value="residential">Residential</MenuItem>
                        <MenuItem value="industrial">Industrial</MenuItem>
                        <MenuItem value="mixed">Mixed Use</MenuItem>
                        <MenuItem value="other">Other (Manual Entry)</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    {/* Custom Fields */}
                    {(customFields.buildingBasicId || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('buildingBasicId', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "buildingBasicId",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("buildingBasicId", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location & Ownership */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location & Ownership
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("buildingLocation")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Location"
                      placeholder="Full address"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "location",
                          (e.target as HTMLInputElement).value,
                          "text",
                          "buildingLocation",
                          "Location"
                        )
                      }
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Ownership Type</InputLabel>
                      <MuiSelect
                        label="Ownership Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "ownership_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "buildingLocation",
                            "Ownership Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Ownership Type</MenuItem>
                        <MenuItem value="owned">Owned</MenuItem>
                        <MenuItem value="rented">Rented</MenuItem>
                        <MenuItem value="leased">Leased</MenuItem>
                        <MenuItem value="government">
                          Government Allotted
                        </MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Linked Land Asset"
                      placeholder="Enter Asset ID or name of land"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) => {
                        handleExtraFieldChange(
                          "linked_land_asset",
                          (e.target as HTMLInputElement).value,
                          "text",
                          "buildingLocation",
                          "Linked Land Asset"
                        );
                        // handleFieldChange('linked_land_asset', e.target.value);
                      }}
                    />

                    {/* Custom Fields */}
                    {(customFields.buildingLocation || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('buildingLocation', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "buildingLocation",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("buildingLocation", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Construction Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Construction className="w-5 h-5" />
                      Construction Details
                    </div>
                    <button
                      onClick={() =>
                        openCustomFieldModal("buildingConstruction")
                      }
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Construction Type</InputLabel>
                      <MuiSelect
                        label="Construction Type"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "construction_type",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "buildingConstruction",
                            "Construction Type"
                          )
                        }
                      >
                        <MenuItem value="">Select Construction Type</MenuItem>
                        <MenuItem value="rcc">RCC</MenuItem>
                        <MenuItem value="steel">Steel</MenuItem>
                        <MenuItem value="prefab">Pre-Fab</MenuItem>
                        <MenuItem value="loadbearing">Load Bearing</MenuItem>
                        <MenuItem value="other">Other (Manual Entry)</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Number of Floors"
                      placeholder="e.g., G + 3 = 4"
                      variant="outlined"
                      fullWidth
                      type="number"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "number_of_floors",
                          (e.target as HTMLInputElement).value,
                          "number",
                          "buildingConstruction",
                          "Number of Floors"
                        )
                      }
                    />
                    <div className="flex gap-2">
                      <TextField
                        label="Built-up Area"
                        placeholder="Enter area"
                        variant="outlined"
                        type="number"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "built_up_area",
                            (e.target as HTMLInputElement).value,
                            "number",
                            "buildingConstruction",
                            "Built-up Area"
                          )
                        }
                      />
                      <FormControl
                        sx={{
                          minWidth: 100,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      >
                        <InputLabel>Unit</InputLabel>
                        <MuiSelect
                          label="Unit"
                          defaultValue="sqft"
                          onChange={(e) =>
                            handleExtraFieldChange(
                              "built_up_area_unit",
                              (e.target as HTMLInputElement).value,
                              "select",
                              "buildingConstruction",
                              "Built-up Area Unit"
                            )
                          }
                        >
                          <MenuItem value="sqft">Sq. Ft.</MenuItem>
                          <MenuItem value="sqm">Sq. M.</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>
                    {/* <DatePicker
                      label="Date of Construction"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) =>
                        handleExtraFieldChange(
                          "date_of_construction",
                          date,
                          "date",
                          "buildingConstruction",
                          "Date of Construction"
                        )
                      }
                    /> */}
                    <TextField
                      label="Date of Construction"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true, // Ensures label stays above the input when a date is selected
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value; // This will be in YYYY-MM-DD format
                        handleExtraFieldChange(
                          "date_of_construction",
                          selectedDate,
                          "date",
                          "buildingConstruction",
                          "Date of Construction"
                        );
                      }}
                    />


                    {/* Custom Fields */}
                    {(customFields.buildingConstruction || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('buildingConstruction', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "buildingConstruction",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("buildingConstruction", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Acquisition & Value */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Acquisition & Value
                    </div>
                    <button
                      onClick={() =>
                        openCustomFieldModal("buildingAcquisition")
                      }
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <DatePicker
                      label="Date of Acquisition"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          },
                        },
                      }}
                      onChange={(date) =>
                        handleExtraFieldChange(
                          "date_of_acquisition",
                          date,
                          "date",
                          "buildingAcquisition",
                          "Date of Acquisition"
                        )
                      }
                    /> */}
                    <TextField
                      label="Date of Acquisition"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true, // Keeps the label above the field
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(event) => {
                        const selectedDate = event.target.value; // Format: YYYY-MM-DD
                        handleExtraFieldChange(
                          "date_of_acquisition",
                          selectedDate,
                          "date",
                          "buildingAcquisition",
                          "Date of Acquisition"
                        );
                      }}
                    />

                    <div className="flex gap-2">
                      <FormControl
                        sx={{
                          minWidth: 80,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      >
                        <InputLabel>Currency</InputLabel>
                        <MuiSelect
                          label="Currency"
                          defaultValue="inr"
                          onChange={(e) =>
                            handleExtraFieldChange(
                              "acquisition_currency",
                              (e.target as HTMLInputElement).value,
                              "select",
                              "buildingAcquisition",
                              "Acquisition Currency"
                            )
                          }
                        >
                          <MenuItem value="inr">OMR</MenuItem>
                        </MuiSelect>
                      </FormControl>
                      <TextField
                        label="Acquisition Cost"
                        placeholder="Enter cost"
                        variant="outlined"
                        type="number"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "acquisition_cost",
                            (e.target as HTMLInputElement).value,
                            "number",
                            "buildingAcquisition",
                            "Acquisition Cost"
                          )
                        }
                      />
                    </div>
                    <TextField
                      label="Depreciation Rate (%)"
                      placeholder="Enter depreciation rate"
                      variant="outlined"
                      fullWidth
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "depreciation_rate",
                          (e.target as HTMLInputElement).value,
                          "number",
                          "buildingAcquisition",
                          "Depreciation Rate"
                        )
                      }
                    />
                    <div className="flex gap-2">
                      <FormControl
                        sx={{
                          minWidth: 80,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      >
                        <InputLabel>Currency</InputLabel>
                        <MuiSelect
                          label="Currency"
                          defaultValue="inr"
                          onChange={(e) =>
                            handleExtraFieldChange(
                              "book_value_currency",
                              (e.target as HTMLInputElement).value,
                              "select",
                              "buildingAcquisition",
                              "Book Value Currency"
                            )
                          }
                        >
                          <MenuItem value="inr">OMR</MenuItem>
                        </MuiSelect>
                      </FormControl>
                      <TextField
                        label="Current Book Value"
                        placeholder="Enter book value"
                        variant="outlined"
                        type="number"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "current_book_value",
                            (e.target as HTMLInputElement).value,
                            "number",
                            "buildingAcquisition",
                            "Current Book Value"
                          )
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <FormControl
                        sx={{
                          minWidth: 80,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                      >
                        <InputLabel>Currency</InputLabel>
                        <MuiSelect
                          label="Currency"
                          defaultValue="inr"
                          onChange={(e) =>
                            handleExtraFieldChange(
                              "market_value_currency",
                              (e.target as HTMLInputElement).value,
                              "select",
                              "buildingAcquisition",
                              "Market Value Currency"
                            )
                          }
                        >
                          <MenuItem value="inr">OMR</MenuItem>
                        </MuiSelect>
                      </FormControl>
                      <TextField
                        label="Current Market Value"
                        placeholder="Enter market value"
                        variant="outlined"
                        type="number"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "market_value",
                            (e.target as HTMLInputElement).value,
                            "number",
                            "buildingAcquisition",
                            "Market Value"
                          )
                        }
                      />
                    </div>

                    {/* Custom Fields */}
                    {(customFields.buildingAcquisition || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('buildingAcquisition', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "buildingAcquisition",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("buildingAcquisition", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Usage & Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Usage & Compliance
                    </div>
                    <button
                      onClick={() => openCustomFieldModal("buildingUsage")}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Building Use</InputLabel>
                      <MuiSelect
                        label="Building Use"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "usage_and_compliance",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "usage_and_compliance",
                            "Building Use"
                          )
                        }
                      >
                        <MenuItem value="">Select Building Use</MenuItem>
                        <MenuItem value="office">Office</MenuItem>
                        <MenuItem value="warehouse">Warehouse</MenuItem>
                        <MenuItem value="school">School</MenuItem>
                        <MenuItem value="other">Other (Manual Entry)</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Fire Safety Certification</InputLabel>
                      <MuiSelect
                        label="Fire Safety Certification"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "fire_safety_certification",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "usage_and_compliance",
                            "Fire Safety Certification"
                          )
                        }
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Occupancy Certificate No."
                      placeholder="Enter certificate ID"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          "occupancy_certificate_no",
                          (e.target as HTMLInputElement).value,
                          "text",
                          "usage_and_compliance",
                          "Occupancy Certificate No."
                        )
                      }
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Structural Safety Certificate</InputLabel>
                      <MuiSelect
                        label="Structural Safety Certificate"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "structural_safety_certificate",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "usage_and_compliance",
                            "Structural Safety Certificate"
                          )
                        }
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="lastUpdated">
                          Last Updated Date Option
                        </MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Utility Connections</InputLabel>
                      <MuiSelect
                        label="Utility Connections"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "utility_connections",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "usage_and_compliance",
                            "Utility Connections"
                          )
                        }
                      >
                        <MenuItem value="">Select Utilities</MenuItem>
                        <MenuItem value="water">Water</MenuItem>
                        <MenuItem value="electricity">Electricity</MenuItem>
                        <MenuItem value="both">Water & Electricity</MenuItem>
                        <MenuItem value="other">Other (Manual Entry)</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    {/* Custom Fields */}
                    {(customFields.buildingUsage || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          onChange={(e) =>
                            handleCustomFieldChange(
                              "buildingUsage",
                              field.id,
                              e.target.value
                            )
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("buildingUsage", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Maintenance & Linkages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Maintenance & Linkages
                    </div>
                    <button
                      onClick={() =>
                        openCustomFieldModal("buildingMaintenance")
                      }
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>Maintenance Responsibility</InputLabel>
                      <MuiSelect
                        label="Maintenance Responsibility"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "maintenance_responsibility",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "buildingMaintenance",
                            "Maintenance Responsibility"
                          )
                        }
                      >
                        <MenuItem value="">Select Department/Team</MenuItem>
                        <MenuItem value="facilities">
                          Facilities Management
                        </MenuItem>
                        <MenuItem value="admin">Administration</MenuItem>
                        <MenuItem value="outsourced">Outsourced</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: { xs: "36px", md: "45px" },
                        },
                      }}
                    >
                      <InputLabel>AMC / PPM Linked</InputLabel>
                      <MuiSelect
                        label="AMC / PPM Linked"
                        defaultValue=""
                        onChange={(e) =>
                          handleExtraFieldChange(
                            "amc_ppm_linked",
                            (e.target as HTMLInputElement).value,
                            "select",
                            "buildingMaintenance",
                            "AMC / PPM Linked"
                          )
                        }
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    {/* Custom Fields */}
                    {(customFields.buildingMaintenance || []).map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          // onChange={(e) => handleCustomFieldChange('buildingMaintenance', field.id, e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "buildingMaintenance",
                              field.id,
                              e.target.value
                            );
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("buildingMaintenance", field.id)
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Miscellaneous */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Archive className="w-5 h-5" />
                      Miscellaneous
                    </div>
                    <button
                      onClick={() =>
                        openCustomFieldModal("buildingMiscellaneous")
                      }
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TextField
                    label="Remarks / Notes"
                    placeholder="Special remarks like shared floor, rent info, etc."
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{
                      "& .MuiOutlinedInput-root": {},
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        "remarks",
                        (e.target as HTMLInputElement).value,
                        "text",
                        "buildingMiscellaneous",
                        "Remarks / Notes"
                      )
                    }
                  />
                  {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                    className="hidden"
                    id="building-attachments"
                    onChange={e => handleFileUpload('buildingAttachments', e.target.files)}
                  />
                  <label htmlFor="building-attachments" className="cursor-pointer">
                    <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload attachments
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload blueprints, tax receipts, occupancy certificate, etc.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Max 10MB per file, 50MB total. Images will be compressed automatically.
                    </p>
                  </label>
                  {attachments.buildingAttachments && attachments.buildingAttachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {attachments.buildingAttachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                          <div className="flex flex-col truncate">
                            <span className="text-xs sm:text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <button onClick={() => removeFile('buildingAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-1">
                        Total: {attachments.buildingAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                          ? `${(attachments.buildingAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                          : `${(attachments.buildingAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                        }
                      </div>
                    </div>
                  )}
                </div> */}

                  {/* Custom Fields */}
                  {(customFields.buildingMiscellaneous || []).map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('buildingMiscellaneous', field.id, e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: { xs: "36px", md: "45px" },
                          },
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange(
                            "buildingMiscellaneous",
                            field.id,
                            e.target.value
                          );
                        }}
                      />
                      <button
                        onClick={() =>
                          removeCustomField("buildingMiscellaneous", field.id)
                        }
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </LocalizationProvider>
        )}

        {/* Conditional Sections - Show only for specific asset categories */}
        {(selectedAssetCategory === "Furniture & Fixtures" ||
          selectedAssetCategory === "IT Equipment" ||
          selectedAssetCategory === "Machinery & Equipment" ||
          selectedAssetCategory === "Meter" ||
          selectedAssetCategory === "Tools & Instruments") && (
            <>
              {/* Location Details */}

              {/* Asset Details */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSection("asset")}
                  className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
                >
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    ASSET DETAILS
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCustomFieldModal("assetDetails");
                      }}
                      className="px-3 py-1 rounded text-sm flex items-center gap-1"
                      style={{
                        backgroundColor: "#F6F4EE",
                        color: "#C72030",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                    {expandedSections.asset ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
                {expandedSections.asset && (
                  <div className="p-4 sm:p-6">
                    {/* First row: Asset Name, Model No., Manufacturer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <TextField
                        required
                        label="Asset Name"
                        placeholder="Enter Asset Name"
                        name="assetName"
                        fullWidth
                        variant="outlined"
                        value={formData.name || ""}
                        error={hasValidationError("Asset Name")}
                        helperText={
                          hasValidationError("Asset Name")
                            ? "Asset Name is required"
                            : ""
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: fieldStyles,
                        }}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Model No."
                        placeholder="Enter Model No"
                        name="modelNo"
                        fullWidth
                        variant="outlined"
                        value={formData.model_number || ""}
                        error={hasValidationError("Model No")}
                        helperText={
                          hasValidationError("Model No")
                            ? "Model No. is required"
                            : ""
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: fieldStyles,
                        }}
                        onChange={(e) =>
                          handleFieldChange("model_number", e.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Manufacturer"
                        placeholder="Enter Manufacturer"
                        name="manufacturer"
                        fullWidth
                        variant="outlined"
                        value={formData.manufacturer || ""}
                        error={hasValidationError("Manufacturer")}
                        helperText={
                          hasValidationError("Manufacturer")
                            ? "Manufacturer is required"
                            : ""
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: fieldStyles,
                        }}
                        onChange={(e) =>
                          handleFieldChange("manufacturer", e.target.value)
                        }
                      />
                      {/* }}
                    onChange={e => handleFieldChange('manufacturer', e.target.value)}

                  /> */}
                    </div>

                    {/* Second row: Group, Subgroup */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          minWidth: 120,
                        }}
                      >
                        <InputLabel id="group-select-label" shrink>
                          Group
                        </InputLabel>
                        <MuiSelect
                          labelId="group-select-label"
                          label="Group"
                          displayEmpty
                          value={selectedGroup}
                          onChange={(e) => {
                            handleGroupChange(e.target.value);
                            handleFieldChange(
                              "pms_asset_group_id",
                              e.target.value
                            );
                          }}
                          sx={fieldStyles}
                          required
                          disabled={groupsLoading}
                        >
                          <MenuItem value="">
                            <em>
                              {groupsLoading ? "Loading..." : "Select Group"}
                            </em>
                          </MenuItem>
                          {groups.map((group) => (
                            <MenuItem key={group.id} value={group.id}>
                              {group.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          minWidth: 120,
                        }}
                      >
                        <InputLabel id="subgroup-select-label" shrink>
                          Subgroup
                        </InputLabel>
                        <MuiSelect
                          labelId="subgroup-select-label"
                          label="Subgroup"
                          displayEmpty
                          value={formData.pms_asset_sub_group_id}
                          // onChange={(e) => setSelectedSubgroup(e.target.value)}
                          onChange={(e) =>
                            handleFieldChange(
                              "pms_asset_sub_group_id",
                              e.target.value
                            )
                          }
                          sx={fieldStyles}
                          required
                          disabled={subgroupsLoading || !selectedGroup}
                        >
                          <MenuItem value="">
                            <em>
                              {subgroupsLoading
                                ? "Loading..."
                                : "Select Sub-Group"}
                            </em>
                          </MenuItem>
                          {subgroups.map((subgroup) => (
                            <MenuItem key={subgroup.id} value={subgroup.id}>
                              {subgroup.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          minWidth: 120,
                        }}
                      >
                        <InputLabel id="vendor-select-label" shrink>
                          Vendor Name*
                        </InputLabel>
                        <MuiSelect
                          labelId="vendor-select-label"
                          label="Vendor Name"
                          displayEmpty
                          value={formData.pms_supplier_id || ""}
                          onChange={(e) => {
                            // setSelectedLoanedVendorId(e.target.value);
                            handleFieldChange(
                              "pms_supplier_id",
                              e.target.value
                            );
                          }}
                          sx={fieldStyles}
                          required
                        >
                          <MenuItem value="">
                            <em>
                              {vendorsLoading
                                ? "Loading vendors..."
                                : "Select Vendor"}
                            </em>
                          </MenuItem>
                          {vendors.map((vendor) => (
                            <MenuItem key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>

                    {/* Custom Fields are now handled per section */}

                    {/* Third row: Status and Critical in single row */}
                    <div className="mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-[#C72030] mb-2 block">
                            Status
                          </label>
                          <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="status-inuse"
                                name="status"
                                value="false"
                                defaultChecked
                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                style={{
                                  accentColor: "#C72030",
                                }}
                                onChange={(e) =>
                                  {handleFieldChange("breakdown", e.target.value)
                                  handleFieldChange("status", "in_use")
                                  }
                                }
                              />
                              <label htmlFor="status-inuse" className="text-sm">
                                In Use
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="status-breakdown"
                                name="status"
                                value="true"
                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                style={{
                                  accentColor: "#C72030",
                                }}
                                onChange={(e) =>
                                 {handleFieldChange("breakdown", e.target.value)
                                  handleFieldChange("status", "breakdown")
                                  }
                                }
                              />
                              <label htmlFor="status-breakdown" className="text-sm">
                                Breakdown
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#C72030] mb-2 block">
                            Critical
                          </label>
                          <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="critical-yes"
                                name="critical"
                                value="yes"
                                checked={criticalStatus === "yes"}
                                onChange={(e) => {
                                  setCriticalStatus(e.target.value);
                                  handleFieldChange("critical", e.target.value);
                                }}
                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                style={{
                                  accentColor: "#C72030",
                                }}
                              />
                              <label htmlFor="critical-yes" className="text-sm">
                                Yes
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="critical-no"
                                name="critical"
                                value="no"
                                checked={criticalStatus === "no"}
                                onChange={(e) => {
                                  setCriticalStatus(e.target.value);
                                  handleFieldChange("critical", e.target.value);
                                }}
                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                style={{
                                  accentColor: "#C72030",
                                }}
                              />
                              <label htmlFor="critical-no" className="text-sm">
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fourth row: Asset Type */}
                    <div className="mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-[#C72030] mb-2 block">
                            Asset Type
                          </label>
                          <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="asset-type-comprehensive"
                                name="assetType"
                                value="true"
                                checked={formData.asset_type === "true"}
                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                style={{
                                  accentColor: "#C72030",
                                }}
                                onChange={(e) =>
                                  handleFieldChange("asset_type", e.target.value)
                                }
                              />
                              <label htmlFor="asset-type-comprehensive" className="text-sm">
                                Comprehensive
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="asset-type-non-comprehensive"
                                name="assetType"
                                value="false"
                                checked={formData.asset_type === "false"}
                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                style={{
                                  accentColor: "#C72030",
                                }}
                                onChange={(e) =>
                                  handleFieldChange("asset_type", e.target.value)
                                }
                              />
                              <label htmlFor="asset-type-non-comprehensive" className="text-sm">
                                Non-Comprehensive
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          {/* Empty div to maintain grid structure */}
                        </div>
                      </div>
                    </div>




                    {/* Custom Fields for Asset Details */}
                    {(customFields.assetDetails || []).map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <TextField
                          label={field.name}
                          value={field.value}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "assetDetails",
                              field.id,
                              e.target.value
                            );
                          }}
                          variant="outlined"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("assetDetails", field.id)
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSection("location")}
                  className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
                >
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    LOCATION DETAILS
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedSections.location ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
                {expandedSections.location && (
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      {/* Site Dropdown */}
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                      >
                        <InputLabel id="site-select-label" shrink>
                          Site
                        </InputLabel>
                        <MuiSelect
                          labelId="site-select-label"
                          label="Site"
                          displayEmpty
                          value={selectedLocation.site}
                          onChange={(e) => {
                            handleLocationChange("site", e.target.value);
                            handleFieldChange("pms_site_id", e.target.value);
                          }}
                          sx={fieldStyles}
                        >
                          <MenuItem value="">
                            <em>Select Site</em>
                          </MenuItem>
                          {sites.map((site) => (
                            <MenuItem key={site.id} value={site.id.toString()}>
                              {site.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>

                      {/* Building Dropdown */}
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                      >
                        <InputLabel id="building-select-label" shrink>
                          Building
                        </InputLabel>
                        <MuiSelect
                          labelId="building-select-label"
                          label="Building"
                          displayEmpty
                          value={selectedLocation.building}
                          onChange={(e) => {
                            handleLocationChange("building", e.target.value);
                            handleFieldChange("pms_building_id", e.target.value);
                          }}
                          sx={fieldStyles}
                          disabled={!selectedLocation.site || loading.buildings}
                        >
                          <MenuItem value="">
                            <em>Select Building</em>
                          </MenuItem>
                          {buildings.map((building) => (
                            <MenuItem
                              key={building.id}
                              value={building.id.toString()}
                            >
                              {building.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>

                      {/* Wing Dropdown */}
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                      >
                        <InputLabel id="wing-select-label" shrink>
                          Wing
                        </InputLabel>
                        <MuiSelect
                          labelId="wing-select-label"
                          label="Wing"
                          displayEmpty
                          value={selectedLocation.wing}
                          onChange={(e) => {
                            handleLocationChange("wing", e.target.value);
                            handleFieldChange("pms_wing_id", e.target.value);
                          }}
                          sx={fieldStyles}
                          disabled={!selectedLocation.building || loading.wings}
                        >
                          <MenuItem value="">
                            <em>Select Wing</em>
                          </MenuItem>
                          {wings.map((wing) => (
                            <MenuItem
                              key={wing.wings.id}
                              value={wing.wings.id.toString()}
                            >
                              {wing.wings.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>

                      {/* Area Dropdown */}
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                      >
                        <InputLabel id="area-select-label" shrink>
                          Area
                        </InputLabel>
                        <MuiSelect
                          labelId="area-select-label"
                          label="Area"
                          displayEmpty
                          value={selectedLocation.area}
                          onChange={(e) => {
                            handleLocationChange("area", e.target.value);
                            handleFieldChange("pms_area_id", e.target.value);
                          }}
                          sx={fieldStyles}
                          disabled={!selectedLocation.wing || loading.areas}
                        >
                          <MenuItem value="">
                            <em>Select Area</em>
                          </MenuItem>
                          {areas.map((area) => (
                            <MenuItem key={area.id} value={area.id.toString()}>
                              {area.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>

                      {/* Floor Dropdown */}
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                      >
                        <InputLabel id="floor-select-label" shrink>
                          Floor
                        </InputLabel>
                        <MuiSelect
                          labelId="floor-select-label"
                          label="Floor"
                          displayEmpty
                          value={selectedLocation.floor}
                          onChange={(e) => {
                            handleLocationChange("floor", e.target.value);
                            handleFieldChange("pms_floor_id", e.target.value);
                          }}
                          sx={fieldStyles}
                          disabled={!selectedLocation.area || loading.floors}
                        >
                          <MenuItem value="">
                            <em>Select Floor</em>
                          </MenuItem>
                          {floors.map((floor) => (
                            <MenuItem key={floor.id} value={floor.id.toString()}>
                              {floor.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      {/* Room Dropdown */}
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                      >
                        <InputLabel id="room-select-label" shrink>
                          Room
                        </InputLabel>
                        <MuiSelect
                          labelId="room-select-label"
                          label="Room"
                          displayEmpty
                          value={selectedLocation.room}
                          onChange={(e) => {
                            handleLocationChange("room", e.target.value);
                            handleFieldChange("pms_room_id", e.target.value);
                          }}
                          sx={fieldStyles}
                          disabled={!selectedLocation.floor || loading.rooms}
                        >
                          <MenuItem value="">
                            <em>Select Room</em>
                          </MenuItem>
                          {rooms.map((room) => (
                            <MenuItem
                              key={room.rooms.id}
                              value={room.rooms.id.toString()}
                            >
                              {room.rooms.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>

                    {/* Custom Fields */}
                    {(customFields.locationDetails || []).map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <TextField
                          label={field.name}
                          value={field.value}
                          onChange={(e) => {
                            handleCustomFieldChange(
                              "locationDetails",
                              field.id,
                              e.target.value
                            );
                          }}
                          variant="outlined"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                        />
                        <button
                          onClick={() =>
                            removeCustomField("locationDetails", field.id)
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* IT Assets Details - Show only for IT Equipment */}
              {selectedAssetCategory === "IT Equipment" && (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div
                    onClick={() => toggleSection("warranty")}
                    className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
                  >
                    <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                      <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                      </span>
                      IT ASSETS DETAILS
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          If Applicable
                        </span>
                        <div className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            id="it-assets-toggle"
                            checked={itAssetsToggle}
                            onChange={(e) =>
                              handleItAssetsToggleChange(e.target.checked)
                            }
                          />
                          <label
                            htmlFor="it-assets-toggle"
                            className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${itAssetsToggle ? "bg-green-400" : "bg-gray-300"
                              }`}
                          >
                            <span
                              className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${itAssetsToggle ? "translate-x-6" : "translate-x-1"
                                }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setItAssetsCustomFieldModalOpen(true);
                        }}
                        className="px-3 py-1 rounded text-sm flex items-center gap-1 hover:opacity-80"
                        style={{
                          backgroundColor: "#F6F4EE",
                          color: "#C72030",
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Custom Field
                      </button>
                      {expandedSections.warranty ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  {expandedSections.warranty && (
                    <div
                      className={`p-4 sm:p-6 ${!itAssetsToggle ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                      {/* System Details */}
                      <div className="mb-6">
                        <h3
                          className="font-semibold mb-4"
                          style={{
                            color: itAssetsToggle ? "#C72030" : "#9CA3AF",
                          }}
                        >
                          SYSTEM DETAILS
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <TextField
                            label="OS"
                            placeholder="Enter OS"
                            name="os"
                            fullWidth
                            variant="outlined"
                            value={itAssetDetails.system_details.os}
                            onChange={(e) =>
                              handleItAssetDetailsChange(
                                "system_details",
                                "os",
                                e.target.value
                              )
                            }
                            disabled={!itAssetsToggle}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              sx: fieldStyles,
                            }}
                          />

                          <TextField
                            label="Total Memory"
                            placeholder="Enter Total Memory"
                            name="totalMemory"
                            fullWidth
                            variant="outlined"
                            value={itAssetDetails.system_details.memory}
                            onChange={(e) =>
                              handleItAssetDetailsChange(
                                "system_details",
                                "memory",
                                e.target.value
                              )
                            }
                            disabled={!itAssetsToggle}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              sx: fieldStyles,
                            }}
                          />
                          <TextField
                            label="Processor"
                            placeholder="Enter Processor"
                            name="processor"
                            fullWidth
                            variant="outlined"
                            value={itAssetDetails.system_details.processor}
                            onChange={(e) =>
                              handleItAssetDetailsChange(
                                "system_details",
                                "processor",
                                e.target.value
                              )
                            }
                            disabled={!itAssetsToggle}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              sx: fieldStyles,
                            }}
                          />

                          {/* Custom Fields for System Details */}
                          {(itAssetsCustomFields["System Details"] || []).map(
                            (field) => (
                              <div key={field.id} className="relative">
                                <TextField
                                  label={field.name}
                                  placeholder={`Enter ${field.name}`}
                                  value={field.value}
                                  onChange={(e) =>
                                    handleItAssetsCustomFieldChange(
                                      "System Details",
                                      field.id,
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                  variant="outlined"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    sx: fieldStyles,
                                  }}
                                />
                                <button
                                  onClick={() =>
                                    removeItAssetsCustomField(
                                      "System Details",
                                      field.id
                                    )
                                  }
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Hardware Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          {isEditingHardDiskHeading ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingHardDiskHeadingText}
                                onChange={(e) =>
                                  setEditingHardDiskHeadingText(e.target.value)
                                }
                                className="font-semibold text-sm bg-transparent border-b focus:outline-none"
                                style={{
                                  color: "#C72030",
                                  borderColor: "#C72030",
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    setHardDiskHeading(
                                      editingHardDiskHeadingText
                                    );
                                    localStorage.setItem(
                                      "hardDiskHeading",
                                      editingHardDiskHeadingText
                                    );
                                    setIsEditingHardDiskHeading(false);
                                  }
                                  if (e.key === "Escape") {
                                    setEditingHardDiskHeadingText(
                                      hardDiskHeading
                                    );
                                    setIsEditingHardDiskHeading(false);
                                  }
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => {
                                  setHardDiskHeading(editingHardDiskHeadingText);
                                  localStorage.setItem(
                                    "hardDiskHeading",
                                    editingHardDiskHeadingText
                                  );
                                  setIsEditingHardDiskHeading(false);
                                }}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h3
                                className="font-semibold"
                                style={{ color: "#C72030" }}
                              >
                                {hardDiskHeading}
                              </h3>
                              <button
                                onClick={() => {
                                  setEditingHardDiskHeadingText(hardDiskHeading);
                                  setIsEditingHardDiskHeading(true);
                                }}
                                className="text-gray-500 hover:text-red-600 transition-colors"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <TextField
                            label="Model"
                            placeholder="Enter Model"
                            name="hdModel"
                            fullWidth
                            variant="outlined"
                            value={itAssetDetails.hardware.model}
                            onChange={(e) =>
                              handleItAssetDetailsChange(
                                "hardware",
                                "model",
                                e.target.value
                              )
                            }
                            disabled={!itAssetsToggle}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              sx: fieldStyles,
                            }}
                          />
                          <TextField
                            label="Serial No."
                            placeholder="Enter Serial No."
                            name="hdSerialNo"
                            fullWidth
                            variant="outlined"
                            value={itAssetDetails.hardware.serial_no}
                            onChange={(e) =>
                              handleItAssetDetailsChange(
                                "hardware",
                                "serial_no",
                                e.target.value
                              )
                            }
                            disabled={!itAssetsToggle}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              sx: fieldStyles,
                            }}
                          />
                          <TextField
                            label="Capacity"
                            placeholder="Enter Capacity"
                            name="hdCapacity"
                            fullWidth
                            variant="outlined"
                            value={itAssetDetails.hardware.capacity}
                            onChange={(e) =>
                              handleItAssetDetailsChange(
                                "hardware",
                                "capacity",
                                e.target.value
                              )
                            }
                            disabled={!itAssetsToggle}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              sx: fieldStyles,
                            }}
                          />

                          {/* Custom Fields for Hardware Details */}
                          {(itAssetsCustomFields["Hardware Details"] || []).map(
                            (field) => (
                              <div key={field.id} className="relative">
                                <TextField
                                  label={field.name}
                                  placeholder={`Enter ${field.name}`}
                                  value={field.value}
                                  onChange={(e) =>
                                    handleItAssetsCustomFieldChange(
                                      "Hardware Details",
                                      field.id,
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                  variant="outlined"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    sx: fieldStyles,
                                  }}
                                />
                                <button
                                  onClick={() =>
                                    removeItAssetsCustomField(
                                      "Hardware Details",
                                      field.id
                                    )
                                  }
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Meter Details */}
              {selectedAssetCategory !== "Tools & Instruments" &&
                selectedAssetCategory !== "Furniture & Fixtures" &&
                selectedAssetCategory !== "IT Equipment" && (
                  <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div
                      onClick={() => toggleSection("meterCategory")}
                      className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
                    >
                      <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                        <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                          <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                        </span>
                        METER DETAILS
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            If Applicable
                          </span>
                          <div className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              id="meter-details-toggle"
                              checked={meterDetailsToggle}
                              onChange={(e) =>
                                handleMeterDetailsToggleChange(e.target.checked)
                              }
                            />
                            <label
                              htmlFor="meter-details-toggle"
                              className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${meterDetailsToggle
                                ? "bg-green-400"
                                : "bg-gray-300"
                                }`}
                            >
                              <span
                                className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${meterDetailsToggle
                                  ? "translate-x-6"
                                  : "translate-x-1"
                                  }`}
                              ></span>
                            </label>
                          </div>
                        </div>
                        {expandedSections.meterCategory ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    {expandedSections.meterCategory && (
                      <div
                        className={`p-4 sm:p-6 ${!meterDetailsToggle
                          ? "opacity-50 pointer-events-none"
                          : ""
                          }`}
                      >
                        {/* Meter Type */}
                        <div className="mb-6">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-[#C72030] font-medium text-sm sm:text-base">
                              Meter Type
                            </span>
                            <div className="flex gap-6">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="meter-type-parent"
                                  name="meter_tag_type"
                                  value="ParentMeter"
                                  checked={meterType === "ParentMeter"}
                                  onChange={(e) => {
                                    setMeterType(e.target.value);
                                    handleFieldChange(
                                      "meter_tag_type",
                                      e.target.value
                                    );
                                  }}
                                  disabled={!meterDetailsToggle}
                                  className="w-4 h-4 text-[#C72030] border-gray-300"
                                  style={{
                                    accentColor: "#C72030",
                                  }}
                                />
                                <label
                                  htmlFor="meter-type-parent"
                                  className={`text-sm ${!meterDetailsToggle ? "text-gray-400" : ""
                                    }`}
                                >
                                  Parent
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="meter-type-sub"
                                  name="meter_tag_type"
                                  value="SubMeter"
                                  checked={meterType === "SubMeter"}
                                  onChange={(e) => {
                                    setMeterType(e.target.value);
                                    handleFieldChange(
                                      "meter_tag_type",
                                      e.target.value
                                    );
                                  }}
                                  disabled={!meterDetailsToggle}
                                  className="w-4 h-4 text-[#C72030] border-gray-300"
                                  style={{
                                    accentColor: "#C72030",
                                  }}
                                />
                                <label
                                  htmlFor="meter-type-sub"
                                  className={`text-sm ${!meterDetailsToggle ? "text-gray-400" : ""
                                    }`}
                                >
                                  Sub
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Parent Meter Dropdown - Show only when Sub Meter is selected */}
                        {meterType === "SubMeter" && (
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Parent Meter <span className="text-red-500">*</span>
                            </label>
                            <Select
                              value={selectedParentMeterId}
                              onValueChange={(value) => {
                                setSelectedParentMeterId(value);
                                handleFieldChange("parent_meter_id", value);
                              }}
                              disabled={parentMeterLoading || !meterDetailsToggle}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    parentMeterLoading
                                      ? "Loading..."
                                      : "Select Parent Meter"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {parentMeters.map((meter) => (
                                  <SelectItem
                                    key={meter.id}
                                    value={meter.id.toString()}
                                  >
                                    {meter.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Meter Category Type */}
                        <div className="mb-6">
                          <div className="rounded-lg p-4 bg-[#f6f4ee]">
                            <h3 className="font-medium mb-4 text-sm sm:text-base text-orange-700">
                              METER DETAILS
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
                              {getMeterCategoryOptions().map((option) => {
                                const IconComponent = option.icon;
                                return (
                                  <div
                                    key={option.value}
                                    className="p-3 sm:p-4 rounded-lg text-center bg-white border"
                                  >
                                    <div className="flex items-center justify-center space-x-2">
                                      <input
                                        type="radio"
                                        id={option.value}
                                        name="meterCategory"
                                        value={option.value}
                                        checked={
                                          meterCategoryType === option.value
                                        }
                                        onChange={(e) =>
                                          handleMeterCategoryChange(
                                            e.target.value
                                          )
                                        }
                                        className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                        style={{
                                          accentColor: "#C72030",
                                        }}
                                      />
                                      <IconComponent className="w-4 h-4 text-gray-600" />
                                      <label
                                        htmlFor={option.value}
                                        className="text-xs sm:text-sm cursor-pointer"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Meter Type ID Indicator */}
                            {(meterCategoryType || subCategoryType || tertiaryCategory) && (
                              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm text-blue-700">
                                    <strong>Selected Meter Type:</strong> {meterCategoryType}
                                    {subCategoryType && ` → ${subCategoryType}`}
                                    {tertiaryCategory && ` → ${tertiaryCategory}`}
                                  </span>
                                </div>
                                <div className="text-xs text-blue-600 mt-1">
                                  Asset Meter Type ID: {(() => {
                                    const meterTypeId = getAssetMeterTypeId(meterCategoryType, subCategoryType, tertiaryCategory);
                                    return typeof meterTypeId === 'number' ? meterTypeId : 'Not mapped';
                                  })()}
                                </div>
                              </div>
                            )}

                            {/* Board Ratio Options (Second Image) */}
                            {showBoardRatioOptions && (
                              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                {getBoardRatioOptions().map((option) => {
                                  const IconComponent = option.icon;
                                  return (
                                    <div
                                      key={option.value}
                                      className="p-3 sm:p-4 rounded-lg text-center bg-white border"
                                    >
                                      <div className="flex items-center justify-center space-x-2">
                                        <input
                                          type="radio"
                                          id={`board-${option.value}`}
                                          name="boardRatioCategory"
                                          value={option.value}
                                          checked={
                                            subCategoryType === option.value
                                          }
                                          onChange={(e) => {
                                            handleSubCategoryChange(e.target.value);
                                          }}
                                          className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                          style={{
                                            accentColor: "#C72030",
                                          }}
                                        />
                                        <IconComponent className="w-4 h-4 text-gray-600" />
                                        <label
                                          htmlFor={`board-${option.value}`}
                                          className="text-xs sm:text-sm cursor-pointer"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Renewable Options */}
                            {showRenewableOptions && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {getRenewableOptions().map((option) => {
                                  const IconComponent = option.icon;
                                  return (
                                    <div
                                      key={option.value}
                                      className="p-3 sm:p-4 rounded-lg text-center bg-white border"
                                    >
                                      <div className="flex items-center justify-center space-x-2">
                                        <input
                                          type="radio"
                                          id={`renewable-${option.value}`}
                                          name="renewableCategory"
                                          value={option.value}
                                          checked={
                                            subCategoryType === option.value
                                          }
                                          onChange={(e) => {
                                            handleSubCategoryChange(e.target.value);
                                          }}
                                          className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                          style={{
                                            accentColor: "#C72030",
                                          }}
                                        />
                                        <IconComponent className="w-4 h-4 text-gray-600" />
                                        <label
                                          htmlFor={`renewable-${option.value}`}
                                          className="text-xs sm:text-sm cursor-pointer"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Fresh Water Options */}
                            {showFreshWaterOptions && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {getFreshWaterOptions().map((option) => {
                                  const IconComponent = option.icon;
                                  return (
                                    <div
                                      key={option.value}
                                      className="p-3 sm:p-4 rounded-lg text-center bg-white border"
                                    >
                                      <div className="flex items-center justify-center space-x-2">
                                        <input
                                          type="radio"
                                          id={`fresh-water-${option.value}`}
                                          name="freshWaterCategory"
                                          value={option.value}
                                          checked={
                                            subCategoryType === option.value
                                          }
                                          onChange={(e) => {
                                            handleSubCategoryChange(e.target.value);
                                          }}
                                          className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                          style={{
                                            accentColor: "#C72030",
                                          }}
                                        />
                                        <IconComponent className="w-4 h-4 text-gray-600" />
                                        <label
                                          htmlFor={`fresh-water-${option.value}`}
                                          className="text-xs sm:text-sm cursor-pointer"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Water Source Options (shown when Source is selected) */}
                            {showWaterSourceOptions && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                                {getWaterSourceOptions().map((option) => {
                                  const IconComponent = option.icon;
                                  return (
                                    <div
                                      key={option.value}
                                      className="p-3 sm:p-4 rounded-lg text-center bg-white border"
                                    >
                                      <div className="flex items-center justify-center space-x-2">
                                        <input
                                          type="radio"
                                          id={`water-source-${option.value}`}
                                          name="waterSourceCategory"
                                          value={option.value}
                                          checked={
                                            tertiaryCategory === option.value
                                          }
                                          onChange={(e) => {
                                            handleTertiaryCategoryChange(e.target.value);
                                          }}
                                          className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                          style={{
                                            accentColor: "#C72030",
                                          }}
                                        />
                                        <IconComponent className="w-4 h-4 text-gray-600" />
                                        <label
                                          htmlFor={`water-source-${option.value}`}
                                          className="text-xs sm:text-sm cursor-pointer"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Water Distribution Options */}
                            {showWaterDistributionOptions && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {getWaterDistributionOptions().map((option) => {
                                  const IconComponent = option.icon;
                                  return (
                                    <div
                                      key={option.value}
                                      className="p-3 sm:p-4 rounded-lg text-center bg-white border"
                                    >
                                      <div className="flex items-center justify-center space-x-2">
                                        <input
                                          type="radio"
                                          id={`water-distribution-${option.value}`}
                                          name="waterDistributionCategory"
                                          value={option.value}
                                          checked={
                                            subCategoryType === option.value
                                          }
                                          onChange={(e) => {
                                            handleSubCategoryChange(e.target.value);
                                          }}
                                          className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                          style={{
                                            accentColor: "#C72030",
                                          }}
                                        />
                                        <IconComponent className="w-4 h-4 text-gray-600" />
                                        <label
                                          htmlFor={`water-distribution-${option.value}`}
                                          className="text-xs sm:text-sm cursor-pointer"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Meter Measure Fields - Show based on meter type selection */}
                        {meterType === "ParentMeter" && (
                          <>
                            <MeterMeasureFields
                              title="CONSUMPTION METER MEASURE"
                              fields={consumptionMeasureFields}
                              showCheckPreviousReading={true}
                              onFieldChange={(id, field, value) =>
                                handleMeterMeasureFieldChange(
                                  "consumption",
                                  id,
                                  field,
                                  value
                                )
                              }
                              onAddField={() =>
                                addMeterMeasureField("consumption")
                              }
                              onRemoveField={(id) =>
                                removeMeterMeasureField("consumption", id)
                              }
                              unitTypes={meterUnitTypes}
                              loadingUnitTypes={loadingUnitTypes}
                            />
                            <MeterMeasureFields
                              title="NON CONSUMPTION METER MEASURE"
                              fields={nonConsumptionMeasureFields}
                              showCheckPreviousReading={false}
                              onFieldChange={(id, field, value) =>
                                handleMeterMeasureFieldChange(
                                  "nonConsumption",
                                  id,
                                  field,
                                  value
                                )
                              }
                              onAddField={() =>
                                addMeterMeasureField("nonConsumption")
                              }
                              onRemoveField={(id) =>
                                removeMeterMeasureField("nonConsumption", id)
                              }
                              unitTypes={meterUnitTypes}
                              loadingUnitTypes={loadingUnitTypes}
                            />
                          </>
                        )}

                        {meterType === "SubMeter" && (
                          <MeterMeasureFields
                            title="NON CONSUMPTION METER MEASURE"
                            fields={nonConsumptionMeasureFields}
                            showCheckPreviousReading={false}
                            onFieldChange={(id, field, value) =>
                              handleMeterMeasureFieldChange(
                                "nonConsumption",
                                id,
                                field,
                                value
                              )
                            }
                            onAddField={() =>
                              addMeterMeasureField("nonConsumption")
                            }
                            onRemoveField={(id) =>
                              removeMeterMeasureField("nonConsumption", id)
                            }
                            unitTypes={meterUnitTypes}
                            loadingUnitTypes={loadingUnitTypes}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

              {/* Purchase Details */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSection("consumption")}
                  className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
                >
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    PURCHASE DETAILS
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCustomFieldModal("purchaseDetails");
                      }}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                    {expandedSections.consumption ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
                {expandedSections.consumption && (
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <TextField
                        required
                        label="Purchase Cost"
                        placeholder="Enter cost"
                        name="purchaseCost"
                        fullWidth
                        type="number"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: fieldStyles,
                        }}
                        onChange={(e) =>
                          handleFieldChange("purchase_cost", e.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Purchase Date"
                        placeholder="dd/mm/yyyy"
                        name="purchaseDate"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: fieldStyles,
                        }}
                        inputProps={{
                          max: new Date().toISOString().split("T")[0],
                        }}
                        onChange={(e) =>
                          handleFieldChange("purchased_on", e.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Commissioning Date"
                        placeholder="dd/mm/yyyy"
                        name="commisioning_date"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: fieldStyles,
                        }}
                        onChange={(e) =>
                          handleFieldChange("commisioning_date", e.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Warranty Expires On"
                        placeholder="dd/mm/yyyy"
                        name="warrantyExpiresOn"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: fieldStyles,
                        }}
                        onChange={(e) =>
                          handleFieldChange("warranty_expiry", e.target.value)
                        }
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Under Warranty
                        </label>
                        <div className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="warranty-yes"
                              name="underWarranty"
                              value="yes"
                              className="w-4 h-4 text-[#C72030] border-gray-300"
                              style={{
                                accentColor: "#C72030",
                              }}
                              checked={underWarranty === "yes"}
                              onChange={(e) => {
                                setUnderWarranty(e.target.value);
                                handleFieldChange("warranty", "Yes");
                              }}
                            />
                            <label htmlFor="warranty-yes" className="text-sm">
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="warranty-no"
                              name="underWarranty"
                              value="no"
                              className="w-4 h-4 text-[#C72030] border-gray-300"
                              style={{
                                accentColor: "#C72030",
                              }}
                              onChange={(e) => {
                                setUnderWarranty(e.target.value);
                                handleFieldChange("warranty", "No");
                                handleFieldChange("warranty_period", ""); // Clear period if No
                              }}
                            />
                            <label htmlFor="warranty-no" className="text-sm">
                              No
                            </label>
                          </div>
                        </div>
                      </div>

                      {underWarranty === "yes" && (
                        <div className="mt-4">
                          <TextField
                            label="Warranty Period"
                            placeholder="e.g. 24 months"
                            fullWidth
                            type="number"
                            value={formData.warranty_period}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Only allow positive numbers
                              if (
                                value === "" ||
                                (Number(value) >= 0 && !value.includes("-"))
                              ) {
                                handleFieldChange("warranty_period", value);
                              }
                            }}
                            inputProps={{
                              min: 0,
                              step: 1,
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: { xs: "36px", md: "45px" },
                              },
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Custom Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {(customFields.purchaseDetails || []).map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center gap-2 mb-2"
                        >
                          <TextField
                            label={field.name}
                            value={field.value}
                            onChange={(e) => {
                              handleCustomFieldChange(
                                "purchaseDetails",
                                field.id,
                                e.target.value
                              );
                            }}
                            variant="outlined"
                            fullWidth
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: { xs: "36px", md: "45px" },
                              },
                            }}
                          />
                          <button
                            onClick={() =>
                              removeCustomField("purchaseDetails", field.id)
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Depreciation Rule */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSection("nonConsumption")}
                  className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
                >
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    DEPRECIATION RULE
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCustomFieldModal('depreciationRule');
                    }}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button> */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">If Applicable</span>
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          id="depreciation-toggle"
                          checked={depreciationToggle}
                          onChange={(e) =>
                            handleDepreciationToggleChange(e.target.checked)
                          }
                        />
                        <label
                          htmlFor="depreciation-toggle"
                          className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${depreciationToggle ? "bg-green-400" : "bg-gray-300"
                            }`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${depreciationToggle
                              ? "translate-x-6"
                              : "translate-x-1"
                              }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    {expandedSections.nonConsumption ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
                {expandedSections.nonConsumption && (
                  <div
                    className={`p-4 sm:p-6 ${!depreciationToggle ? "opacity-50 pointer-events-none" : ""
                      }`}
                  >
                    <div className="space-y-6">
                      {/* Method Section */}
                      <div>
                        <label
                          className={`text-sm font-medium mb-4 block ${!depreciationToggle
                            ? "text-gray-400"
                            : "text-gray-700"
                            }`}
                        >
                          Method
                        </label>
                        <div className="flex gap-8">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="straight-line"
                              name="depreciationMethod"
                              value="straight_line"
                              disabled={!depreciationToggle}
                              className="w-4 h-4 text-[#C72030] border-gray-300"
                              style={{
                                accentColor: "#C72030",
                              }}
                              onChange={(e) =>
                                handleFieldChange(
                                  "depreciation_method",
                                  e.target.value
                                )
                              }
                            />
                            <label
                              htmlFor="straight-line"
                              className={`text-sm ${!depreciationToggle ? "text-gray-400" : ""
                                }`}
                            >
                              Straight Line
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="wdv"
                              name="depreciationMethod"
                              value="wdv"
                              disabled={!depreciationToggle}
                              className="w-4 h-4 text-[#C72030] border-gray-300"
                              style={{
                                accentColor: "#C72030",
                              }}
                              onChange={(e) =>
                                handleFieldChange(
                                  "depreciation_method",
                                  e.target.value
                                )
                              }
                            />
                            <label
                              htmlFor="wdv"
                              className={`text-sm ${!depreciationToggle ? "text-gray-400" : ""
                                }`}
                            >
                              WDV
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Input Fields Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <TextField
                          label="Useful Life (Years)"
                          placeholder="Enter years"
                          variant="outlined"
                          fullWidth
                          type="number"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "36px", md: "45px" },
                            },
                          }}
                          inputProps={{
                            min: 0,
                            onKeyDown: (e) => {
                              if (
                                e.key === "-" ||
                                e.key === "e" ||
                                e.key === "E"
                              ) {
                                e.preventDefault(); // prevent negative or exponent
                              }
                            },
                          }}
                          onChange={(e) => {
                            const value = Math.max(0, Number(e.target.value)); // auto-correct to 0 if negative

                            handleFieldChange("useful_life", value);
                          }}
                        />

                        <TextField
                          required={
                            depreciationToggle && !!formData.depreciation_method
                          }
                          label="Salvage Value"
                          placeholder="Enter Value"
                          name="salvageValue"
                          fullWidth
                          variant="outlined"
                          type="number"
                          disabled={!depreciationToggle}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                          inputProps={{
                            min: 0,
                            onKeyDown: (e) => {
                              if (
                                e.key === "-" ||
                                e.key === "e" ||
                                e.key === "E"
                              ) {
                                e.preventDefault(); // prevent negative or exponent
                              }
                            },
                          }}
                          error={
                            depreciationToggle &&
                            !!formData.depreciation_method &&
                            !formData.salvage_value
                          }
                          helperText={
                            depreciationToggle &&
                              !!formData.depreciation_method &&
                              !formData.salvage_value
                              ? "Required"
                              : ""
                          }
                          onChange={(e) =>
                            handleFieldChange("salvage_value", e.target.value)
                          }
                        />
                        <TextField
                          required={
                            depreciationToggle && !!formData.depreciation_method
                          }
                          label="Depreciation Rate"
                          placeholder="Enter Value"
                          name="depreciationRate"
                          fullWidth
                          type="number"
                          variant="outlined"
                          disabled={!depreciationToggle}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                          error={
                            depreciationToggle &&
                            !!formData.depreciation_method &&
                            !formData.depreciation_rate
                          }
                          helperText={
                            depreciationToggle &&
                              !!formData.depreciation_method &&
                              !formData.depreciation_rate
                              ? "Required"
                              : ""
                          }
                          onChange={(e) =>
                            handleFieldChange("depreciation_rate", e.target.value)
                          }
                        />
                      </div>

                      {/* Radio Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="configure-this"
                              name="depreciation_applicable_for"
                              value="only_this"
                              defaultChecked
                              className="w-4 h-4 text-[#C72030] border-gray-300"
                              style={{
                                accentColor: "#C72030",
                              }}
                              onChange={(e) =>
                                handleFieldChange(
                                  "depreciation_applicable_for",
                                  e.target.value
                                )
                              }
                            />
                            <label htmlFor="configure-this" className="text-sm">
                              Configure Depreciation Only For This
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="similar-product"
                              name="depreciation_applicable_for"
                              value="similar_product"
                              className="w-4 h-4 text-[#C72030] border-gray-300"
                              style={{
                                accentColor: "#C72030",
                              }}
                              onChange={(e) =>
                                handleFieldChange(
                                  "depreciation_applicable_for",
                                  e.target.value
                                )
                              }
                            />
                            <label htmlFor="similar-product" className="text-sm">
                              For Similar Product
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Similar Product Sub Options */}
                      {formData.depreciation_applicable_for ===
                        "similar_product" && (
                          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-l-gray-300">
                            <div className="mb-4">
                              <label className="text-sm font-medium text-gray-700 mb-3 block">
                                Choose Configuration Type
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="individual-asset"
                                      name="similar_product_type"
                                      value="individual"
                                      disabled={!depreciationToggle}
                                      className="w-4 h-4 text-[#C72030] border-gray-300"
                                      style={{
                                        accentColor: "#C72030",
                                      }}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          "similar_product_type",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor="individual-asset"
                                      className={`text-sm font-medium ${!depreciationToggle
                                        ? "text-gray-400"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      Individual Asset
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="group-asset"
                                      name="similar_product_type"
                                      value="group"
                                      disabled={!depreciationToggle}
                                      className="w-4 h-4 text-[#C72030] border-gray-300"
                                      style={{
                                        accentColor: "#C72030",
                                      }}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          "similar_product_type",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor="group-asset"
                                      className={`text-sm font-medium ${!depreciationToggle
                                        ? "text-gray-400"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      Asset Group
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Individual Asset Dropdown */}
                            {formData.similar_product_type === "individual" && (
                              <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Select Assets{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <Select
                                  value=""
                                  onValueChange={(value) => {
                                    // Handle multiple selection
                                    const currentAssets = formData.selected_asset_ids || [];
                                    if (!currentAssets.includes(value)) {
                                      const newAssets = [...currentAssets, value];
                                      handleFieldChange("selected_asset_ids", newAssets);
                                    }
                                  }}
                                  disabled={!depreciationToggle || assetsLoading}
                                >
                                  <SelectTrigger className="w-full h-[45px] bg-white">
                                    <SelectValue
                                      placeholder={
                                        assetsLoading
                                          ? "Loading assets..."
                                          : "Select assets"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {assets.map((asset) => (
                                      <SelectItem
                                        key={asset.id}
                                        value={asset.id.toString()}
                                      >
                                        {asset.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {/* Display selected assets */}
                                {formData.selected_asset_ids && formData.selected_asset_ids.length > 0 && (
                                  <div className="mt-3">
                                    <div className="flex flex-wrap gap-2">
                                      {formData.selected_asset_ids.map((assetId) => {
                                        const asset = assets.find(a => a.id.toString() === assetId);
                                        return asset ? (
                                          <div
                                            key={assetId}
                                            className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                          >
                                            {asset.name}
                                            <button
                                              type="button"
                                              className="ml-2 text-blue-600 hover:text-blue-800"
                                              onClick={() => {
                                                const newAssets = formData.selected_asset_ids.filter(id => id !== assetId);
                                                handleFieldChange("selected_asset_ids", newAssets);
                                              }}
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Group and Sub Group Dropdowns */}
                            {formData.similar_product_type === "group" && (
                              <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Select Group{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                      value={formData.selected_group_id || ""}
                                      onValueChange={(value) => {
                                        handleFieldChange(
                                          "selected_group_id",
                                          value
                                        );
                                        handleFieldChange(
                                          "selected_sub_group_id",
                                          ""
                                        ); // Reset sub group
                                        fetchSubGroups(value);
                                      }}
                                      disabled={
                                        !depreciationToggle || groupsLoading
                                      }
                                    >
                                      <SelectTrigger className="w-full h-[45px] bg-white">
                                        <SelectValue
                                          placeholder={
                                            groupsLoading
                                              ? "Loading groups..."
                                              : "Select a group"
                                          }
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {groups.map((group) => (
                                          <SelectItem
                                            key={group.id}
                                            value={group.id.toString()}
                                          >
                                            {group.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Select Sub Group
                                    </label>
                                    <Select
                                      value={formData.selected_sub_group_id || ""}
                                      onValueChange={(value) =>
                                        handleFieldChange(
                                          "selected_sub_group_id",
                                          value
                                        )
                                      }
                                      disabled={
                                        !depreciationToggle ||
                                        !formData.selected_group_id ||
                                        subGroupsLoading
                                      }
                                    >
                                      <SelectTrigger className="w-full h-[45px] bg-white">
                                        <SelectValue
                                          placeholder={
                                            !formData.selected_group_id
                                              ? "Select group first"
                                              : subGroupsLoading
                                                ? "Loading sub groups..."
                                                : "Select a sub group"
                                          }
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {subGroups.map((subGroup) => (
                                          <SelectItem
                                            key={subGroup.id}
                                            value={subGroup.id.toString()}
                                          >
                                            {subGroup.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      {/* Custom Fields */}
                      {(customFields.depreciationRule || []).map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center gap-2 mb-2"
                        >
                          <TextField
                            label={field.name}
                            value={field.value}
                            onChange={(e) => {
                              handleCustomFieldChange(
                                "depreciationRule",
                                field.id,
                                e.target.value
                              );
                            }}
                            variant="outlined"
                            fullWidth
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: { xs: "36px", md: "45px" },
                              },
                            }}
                          />
                          <button
                            onClick={() =>
                              removeCustomField("depreciationRule", field.id)
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Asset Allocation */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSection("assetAllocation")}
                  className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
                >
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    ASSET ALLOCATION
                  </div>
                  {expandedSections.assetAllocation ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
                {expandedSections.assetAllocation && (
                  <div className="p-4 sm:p-6">
                    <div className="space-y-6">
                      {/* Based On Section */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-4 block">
                          Based On
                        </label>
                        <div className="flex gap-8">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="allocation-department"
                              name="allocationBasedOn"
                              value="department"
                              checked={allocationBasedOn === "department"}
                              onChange={(e) => {
                                setAllocationBasedOn(e.target.value);
                                // Clear selection when switching
                                setSelectedDepartmentId("");
                                setSelectedUserId("");
                                handleSingleFieldChange("allocation_id", "");
                              }}
                              className="w-4 h-4 text-[#C72030] border-gray-300"
                              style={{
                                accentColor: "#C72030",
                              }}
                            />
                            <label
                              htmlFor="allocation-department"
                              className="text-sm"
                            >
                              Department
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="allocation-users"
                              name="allocationBasedOn"
                              value="users"
                              checked={allocationBasedOn === "users"}
                              onChange={(e) => {
                                setAllocationBasedOn(e.target.value);
                                // Clear selection when switching
                                setSelectedDepartmentId("");
                                setSelectedUserId("");
                                handleSingleFieldChange("allocation_id", "");
                              }}
                              className="w-4 h-4 text-[#C72030] border-gray-300"
                              style={{
                                accentColor: "#C72030",
                              }}
                            />
                            <label htmlFor="allocation-users" className="text-sm">
                              Users
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Department/Users Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{
                            minWidth: 120,
                          }}
                        >
                          <InputLabel id="allocation-select-label" shrink>
                            {allocationBasedOn === "department"
                              ? "Department"
                              : "Users"}
                            *
                          </InputLabel>
                          <MuiSelect
                            labelId="allocation-select-label"
                            label={
                              allocationBasedOn === "department"
                                ? "Department"
                                : "Users"
                            }
                            displayEmpty
                            value={
                              allocationBasedOn === "department"
                                ? selectedDepartmentId
                                : selectedUserId
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              if (allocationBasedOn === "department") {
                                setSelectedDepartmentId(value);
                                handleSingleFieldChange("allocation_id", value);
                                handleFieldChange(
                                  "allocation_type",
                                  "department"
                                );
                              } else {
                                setSelectedUserId(value);
                                handleSingleFieldChange("allocation_id", value);
                                handleFieldChange("allocation_type", "users");
                              }
                            }}
                            sx={fieldStyles}
                            required
                            disabled={
                              allocationBasedOn === "department"
                                ? departmentsLoading
                                : usersLoading
                            }
                          >
                            <MenuItem value="">
                              <em>
                                {allocationBasedOn === "department"
                                  ? departmentsLoading
                                    ? "Loading departments..."
                                    : "Select Department"
                                  : usersLoading
                                    ? "Loading users..."
                                    : "Select User"}
                              </em>
                            </MenuItem>
                            {allocationBasedOn === "department"
                              ? departments.map((department) => (
                                <MenuItem
                                  key={department.id}
                                  value={department.id.toString()}
                                >
                                  {department.department_name}
                                </MenuItem>
                              ))
                              : users.map((user) => (
                                <MenuItem
                                  key={user.id}
                                  value={user.id.toString()}
                                >
                                  {user.full_name}
                                </MenuItem>
                              ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Asset Loaned */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSection("assetLoaned")}
                  className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
                >
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    ASSET LOANED
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">If Applicable</span>
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          id="asset-loaned-toggle"
                          checked={assetLoanedToggle}
                          onChange={(e) =>
                            handleAssetLoanedToggleChange(e.target.checked)
                          }
                        />
                        <label
                          htmlFor="asset-loaned-toggle"
                          className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${assetLoanedToggle ? "bg-green-400" : "bg-gray-300"
                            }`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${assetLoanedToggle
                              ? "translate-x-6"
                              : "translate-x-1"
                              }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    {expandedSections.assetLoaned ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
                {expandedSections.assetLoaned && (
                  <div
                    className={`p-4 sm:p-6 ${!assetLoanedToggle ? "opacity-50 pointer-events-none" : ""
                      }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          minWidth: 120,
                        }}
                      >
                        <InputLabel id="vendor-select-label" shrink>
                          Vendor Name*
                        </InputLabel>
                        <MuiSelect
                          labelId="vendor-select-label"
                          label="Vendor Name"
                          displayEmpty
                          value={selectedLoanedVendorId}
                          onChange={(e) => {
                            setSelectedLoanedVendorId(e.target.value);
                            handleFieldChange(
                              "loaned_from_vendor_id",
                              e.target.value
                            );
                          }}
                          sx={fieldStyles}
                          required
                          disabled={vendorsLoading || !assetLoanedToggle}
                        >
                          <MenuItem value="">
                            <em>
                              {vendorsLoading
                                ? "Loading vendors..."
                                : "Select Vendor"}
                            </em>
                          </MenuItem>
                          {vendors.map((vendor) => (
                            <MenuItem key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                      <TextField
                        required
                        label="Agreement Start Date*"
                        placeholder="dd/mm/yyyy"
                        name="agreementStartDate"
                        type="date"
                        fullWidth
                        variant="outlined"
                        disabled={!assetLoanedToggle}
                        value={formData.agreement_from_date || ""}
                        error={
                          !!agreementDateError &&
                          agreementDateError.includes("start")
                        }
                        helperText={
                          agreementDateError &&
                            agreementDateError.includes("start")
                            ? agreementDateError
                            : ""
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: fieldStyles,
                        }}
                        onChange={(e) =>
                          handleFieldChange("agreement_from_date", e.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Agreement End Date*"
                        placeholder="dd/mm/yyyy"
                        name="agreementEndDate"
                        type="date"
                        fullWidth
                        variant="outlined"
                        disabled={!assetLoanedToggle}
                        value={formData.agreement_to_date || ""}
                        error={!!agreementDateError}
                        helperText={agreementDateError || ""}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          sx: fieldStyles,
                        }}
                        inputProps={{
                          min: formData.agreement_from_date || undefined,
                        }}
                        onChange={(e) =>
                          handleFieldChange("agreement_to_date", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* AMC Details */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSection("amcDetails")}
                  className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
                >
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    AMC DETAILS
                  </div>
                  {expandedSections.amcDetails ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
                {expandedSections.amcDetails && (
                  <div className="p-4 sm:p-6">
                    <div className="space-y-6">
                      {/* First Row - Vendor, Start Date, End Date, First Service, Payment Terms, No. of Visits */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{
                            minWidth: 120,
                          }}
                        >
                          <InputLabel id="amc-vendor-select-label" shrink>
                            Vendor
                          </InputLabel>
                          <MuiSelect
                            labelId="amc-vendor-select-label"
                            label="Vendor"
                            displayEmpty
                            value={selectedAmcVendorId}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedAmcVendorId(value);
                              handleNestedFieldChange(
                                "amc_detail",
                                "supplier_id",
                                Number(value)
                              );
                            }}
                            sx={fieldStyles}
                            disabled={vendorsLoading}
                          >
                            <MenuItem value="">
                              <em>
                                {vendorsLoading
                                  ? "Loading vendors..."
                                  : "Select Vendor"}
                              </em>
                            </MenuItem>
                            {vendors.map((vendor) => (
                              <MenuItem key={vendor.id} value={vendor.id}>
                                {vendor.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>

                        <TextField
                          label="Start Date"
                          placeholder="dd/mm/yyyy"
                          name="amcStartDate"
                          type="date"
                          fullWidth
                          variant="outlined"
                          value={formData.amc_detail.amc_start_date || ""}
                          error={!!amcDateError && amcDateError.includes("start")}
                          helperText={
                            amcDateError && amcDateError.includes("start")
                              ? amcDateError
                              : ""
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                          onChange={(e) =>
                            handleNestedFieldChange(
                              "amc_detail",
                              "amc_start_date",
                              e.target.value
                            )
                          }
                        />

                        <TextField
                          label="End Date"
                          placeholder="dd/mm/yyyy"
                          name="amcEndDate"
                          type="date"
                          fullWidth
                          variant="outlined"
                          value={formData.amc_detail.amc_end_date || ""}
                          error={!!amcDateError && amcDateError.includes("End")}
                          helperText={
                            amcDateError && amcDateError.includes("End")
                              ? amcDateError
                              : ""
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                          inputProps={{
                            min: formData.amc_detail.amc_start_date || undefined,
                          }}
                          onChange={(e) =>
                            handleNestedFieldChange(
                              "amc_detail",
                              "amc_end_date",
                              e.target.value
                            )
                          }
                        />

                        {/* <TextField
                          label="First Service"
                          placeholder="dd/mm/yyyy"
                          name="amcFirstService"
                          type="date"
                          fullWidth
                          variant="outlined"
                          value={formData.amc_detail.amc_first_service || ""}
                          error={!!amcDateError && amcDateError.includes("First Service")}
                          helperText={
                            amcDateError && amcDateError.includes("First Service")
                              ? amcDateError
                              : ""
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                          inputProps={{
                            min: formData.commisioning_date || undefined,
                          }}
                          onChange={(e) =>
                            handleNestedFieldChange(
                              "amc_detail",
                              "amc_first_service",
                              e.target.value
                            )
                          }
                        /> */}
                        <TextField
                          label="First Service"
                          placeholder="dd/mm/yyyy"
                          name="amcFirstService"
                          type="date"
                          fullWidth
                          variant="outlined"
                          value={formData.amc_detail.amc_first_service || ""}
                          error={
                            !!amcDateError &&
                            amcDateError.includes("First Service")
                          }
                          helperText={
                            amcDateError && amcDateError.includes("First Service")
                              ? amcDateError
                              : ""
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                          inputProps={{
                            min: formData.amc_detail.amc_start_date || undefined,
                          }}
                          onChange={(e) =>
                            handleNestedFieldChange(
                              "amc_detail",
                              "amc_first_service",
                              e.target.value
                            )
                          }
                        />

                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{
                            minWidth: 120,
                          }}
                        >
                          <InputLabel id="payment-terms-select-label" shrink>
                            Payment Terms
                          </InputLabel>
                          <MuiSelect
                            labelId="payment-terms-select-label"
                            label="Payment Terms"
                            value={formData.amc_detail.payment_term}
                            sx={fieldStyles}
                            onChange={(e) =>
                              handleNestedFieldChange(
                                "amc_detail",
                                "payment_term",
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="">
                              <em>Select Payment Terms</em>
                            </MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="quarterly">Quarterly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                          </MuiSelect>
                        </FormControl>

                        <TextField
                          label="No. of Visits"
                          placeholder="Enter Value"
                          name="amcVisits"
                          fullWidth
                          type="number"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                          inputProps={{
                            min: 0,
                            step: 1,
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow positive numbers
                            if (
                              value === "" ||
                              (Number(value) >= 0 && !value.includes("-"))
                            ) {
                              handleNestedFieldChange(
                                "amc_detail",
                                "no_of_visits",
                                value === "" ? 0 : Number(value)
                              );
                            }
                          }}
                        />
                      </div>

                      {/* Second Row - AMC Cost */}
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                        <TextField
                          label="AMC Cost"
                          placeholder="Enter AMC Cost"
                          name="amcCost"
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles,
                          }}
                          onChange={(e) =>
                            handleNestedFieldChange(
                              "amc_detail",
                              "amc_cost",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Asset Image Upload for these categories */}

              {/* Attachments */}
            </>
          )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div
            onClick={() => toggleSection("attachments")}
            className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
          >
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              ATTACHMENTS
            </div>
            {expandedSections.attachments ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
          {expandedSections.attachments && (
            // <div className="p-4 sm:p-6">
            //   {/* Category-specific Asset Image */}
            //   <div className="mb-6">
            //     <h3 className="text-sm font-semibold text-gray-700 mb-4">
            //       Asset Image
            //     </h3>
            //     <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            //       <input
            //         type="file"
            //         accept=".jpg,.jpeg,.png,.gif"
            //         onChange={(e) =>
            //           handleFileUpload(
            //             `${selectedAssetCategory
            //               .toLowerCase()
            //               .replace(/\s+/g, "")
            //               .replace("&", "")}AssetImage`,
            //             e.target.files
            //           )
            //         }
            //         className="hidden"
            //         id="asset-image-upload"
            //         multiple={false}
            //       />
            //       <label
            //         htmlFor="asset-image-upload"
            //         className="cursor-pointer block"
            //       >
            //         <div className="flex items-center justify-center space-x-2 mb-2">
            //           <span className="text-[#C72030] font-medium text-xs sm:text-sm">
            //             Choose Asset Image
            //           </span>
            //           <span className="text-gray-500 text-xs sm:text-sm">
            //             {(() => {
            //               const categoryKey = `${selectedAssetCategory
            //                 .toLowerCase()
            //                 .replace(/\s+/g, "")
            //                 .replace("&", "")}AssetImage`;
            //               return attachments[categoryKey]?.length > 0
            //                 ? `${attachments[categoryKey].length} image(s) selected`
            //                 : "No image chosen";
            //             })()}
            //           </span>
            //         </div>
            //       </label>
            //       {(() => {
            //         const categoryKey = `${selectedAssetCategory
            //           .toLowerCase()
            //           .replace(/\s+/g, "")
            //           .replace("&", "")}AssetImage`;
            //         return (
            //           attachments[categoryKey]?.length > 0 && (
            //             <div className="mt-2 space-y-1">
            //               {attachments[categoryKey].map((file, index) => (
            //                 <div
            //                   key={index}
            //                   className="flex items-center justify-between bg-gray-100 p-2 rounded text-left"
            //                 >
            //                   <span className="text-xs sm:text-sm truncate">
            //                     {file.name}
            //                   </span>
            //                   <button
            //                     onClick={() => removeFile(categoryKey, index)}
            //                     className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
            //                   >
            //                     <X className="w-4 h-4" />
            //                   </button>
            //                 </div>
            //               ))}
            //             </div>
            //           )
            //         );
            //       })()}
            //       <div className="mt-2">
            //         <button
            //           type="button"
            //           onClick={() =>
            //             document.getElementById("asset-image-upload")?.click()
            //           }
            //           className="text-xs sm:text-sm bg-[#f6f4ee] text-[#C72030] px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#f0ebe0] flex items-center mx-auto"
            //         >
            //           <Plus className="w-4 h-4 mr-1 sm:mr-2 text-[#C72030]" />
            //           Upload Asset Image
            //         </button>
            //       </div>
            //     </div>
            //   </div>

            //   {/* Common Document Sections for All Categories */}
            //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            //     {[
            //       {
            //         label: "Manuals Upload",
            //         id: "manuals-upload",
            //         category: `${selectedAssetCategory
            //           .toLowerCase()
            //           .replace(/\s+/g, "")
            //           .replace("&", "")}ManualsUpload`,
            //         accept: ".pdf,.doc,.docx,.txt",
            //       },
            //       {
            //         label: "Insurance Details",
            //         id: "insurance-upload",
            //         category: `${selectedAssetCategory
            //           .toLowerCase()
            //           .replace(/\s+/g, "")
            //           .replace("&", "")}InsuranceDetails`,
            //         accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
            //       },
            //       {
            //         label: "Purchase Invoice",
            //         id: "invoice-upload",
            //         category: `${selectedAssetCategory
            //           .toLowerCase()
            //           .replace(/\s+/g, "")
            //           .replace("&", "")}PurchaseInvoice`,
            //         accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
            //       },
            //       {
            //         label: "Other Documents",
            //         id: "other-upload",
            //         category: `${selectedAssetCategory
            //           .toLowerCase()
            //           .replace(/\s+/g, "")
            //           .replace("&", "")}OtherDocuments`,
            //         accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
            //       },
            //     ].map((field) => (
            //       <div key={field.id}>
            //         <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
            //           {field.label}
            //         </label>
            //         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            //           <input
            //             type="file"
            //             multiple
            //             accept={field.accept}
            //             onChange={(e) =>
            //               handleFileUpload(field.category, e.target.files)
            //             }
            //             className="hidden"
            //             id={field.id}
            //           />
            //           <label
            //             htmlFor={field.id}
            //             className="cursor-pointer block"
            //           >
            //             <div className="flex items-center justify-center space-x-2 mb-2">
            //               <span className="text-[#C72030] font-medium text-xs sm:text-sm">
            //                 Choose File
            //               </span>
            //               <span className="text-gray-500 text-xs sm:text-sm">
            //                 {attachments[field.category]?.length > 0
            //                   ? `${
            //                       attachments[field.category].length
            //                     } file(s) selected`
            //                   : "No file chosen"}
            //               </span>
            //             </div>
            //           </label>
            //           {attachments[field.category]?.length > 0 && (
            //             <div className="mt-2 space-y-1">
            //               {attachments[field.category].map((file, index) => (
            //                 <div
            //                   key={index}
            //                   className="flex items-center justify-between bg-gray-100 p-2 rounded text-left"
            //                 >
            //                   <span className="text-xs sm:text-sm truncate">
            //                     {file.name}
            //                   </span>
            //                   <button
            //                     onClick={() =>
            //                       removeFile(field.category, index)
            //                     }
            //                     className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
            //                   >
            //                     <X className="w-4 h-4" />
            //                   </button>
            //                 </div>
            //               ))}
            //             </div>
            //           )}
            //           <div className="mt-2">
            //             <button
            //               type="button"
            //               onClick={() =>
            //                 document.getElementById(field.id)?.click()
            //               }
            //               className="text-xs sm:text-sm bg-[#f6f4ee] text-[#C72030] px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#f0ebe0] flex items-center mx-auto"
            //             >
            //               <Plus className="w-4 h-4 mr-1 sm:mr-2 text-[#C72030]" />
            //               Upload Files
            //             </button>
            //           </div>
            //         </div>
            //       </div>
            //     ))}
            //   </div>
            // </div>

            <div className="p-4 sm:p-6">
              {/* Category-specific Asset Image */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Asset Image
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={(e) =>
                      handleFileUpload(
                        `${selectedAssetCategory
                          .toLowerCase()
                          .replace(/\s+/g, "")
                          .replace("&", "")}AssetImage`,
                        e.target.files
                      )
                    }
                    className="hidden"
                    id="asset-image-upload"
                    multiple={false} // Explicitly disable multiple file selection
                  />
                  <label
                    htmlFor="asset-image-upload"
                    className="cursor-pointer block"
                  >
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-[#C72030] font-medium text-xs sm:text-sm">
                        Choose Asset Image
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        {(() => {
                          const categoryKey = `${selectedAssetCategory
                            .toLowerCase()
                            .replace(/\s+/g, "")
                            .replace("&", "")}AssetImage`;
                          return attachments[categoryKey]?.length > 0
                            ? `${attachments[categoryKey].length} image selected`
                            : "No image chosen";
                        })()}
                      </span>
                    </div>
                  </label>
                  {(() => {
                    const categoryKey = `${selectedAssetCategory
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .replace("&", "")}AssetImage`;
                    return (
                      attachments[categoryKey]?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {attachments[categoryKey].map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-100 p-2 rounded text-left"
                            >
                              <span className="text-xs sm:text-sm truncate">
                                {file.name}
                              </span>
                              <button
                                onClick={() => removeFile(categoryKey, index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )
                    );
                  })()}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("asset-image-upload")?.click()
                      }
                      className="text-xs sm:text-sm bg-[#f6f4ee] text-[#C72030] px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#f0ebe0] flex items-center mx-auto"
                    >
                      <Plus className="w-4 h-4 mr-1 sm:mr-2 text-[#C72030]" />
                      Upload Asset Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Common Document Sections for All Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    label: "Manuals Upload",
                    id: "manuals-upload",
                    category: `${selectedAssetCategory
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .replace("&", "")}ManualsUpload`,
                    accept: ".pdf,.doc,.docx,.txt",
                  },
                  {
                    label: "Insurance Details",
                    id: "insurance-upload",
                    category: `${selectedAssetCategory
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .replace("&", "")}InsuranceDetails`,
                    accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                  },
                  {
                    label: "Purchase Invoice",
                    id: "invoice-upload",
                    category: `${selectedAssetCategory
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .replace("&", "")}PurchaseInvoice`,
                    accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                  },
                  {
                    label: "Other Documents",
                    id: "other-upload",
                    category: `${selectedAssetCategory
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .replace("&", "")}OtherDocuments`,
                    accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                      {field.label}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        multiple
                        accept={field.accept}
                        onChange={(e) =>
                          handleFileUpload(field.category, e.target.files)
                        }
                        className="hidden"
                        id={field.id}
                      />
                      <label
                        htmlFor={field.id}
                        className="cursor-pointer block"
                      >
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-[#C72030] font-medium text-xs sm:text-sm">
                            Choose File
                          </span>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            {attachments[field.category]?.length > 0
                              ? `${attachments[field.category].length
                              } file(s) selected`
                              : "No file chosen"}
                          </span>
                        </div>
                      </label>
                      {attachments[field.category]?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {attachments[field.category].map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-100 p-2 rounded text-left"
                            >
                              <span className="text-xs sm:text-sm truncate">
                                {file.name}
                              </span>
                              <button
                                onClick={() =>
                                  removeFile(field.category, index)
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById(field.id)?.click()
                          }
                          className="text-xs sm:text-sm bg-[#f6f4ee] text-[#C72030] px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#f0ebe0] flex items-center mx-auto"
                        >
                          <Plus className="w-4 h-4 mr-1 sm:mr-2 text-[#C72030]" />
                          Upload Files
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 sm:pt-6">
          <button
            onClick={handleSaveAndShow}
            className="border border-[#C72030] text-[#C72030] px-6 sm:px-8 py-2 rounded-md   text-sm sm:text-base"
            disabled={submitting}
          >
            Save & Show Details
          </button>
          <button
            onClick={handleSaveAndCreate}
            className="px-6 sm:px-8 py-2 rounded-md text-sm sm:text-base bg-[#f6f4ee] text-red-700"
          >
            Save & Create New Asset
          </button>
        </div>
      </div>

      {/* Custom Field Modal for Asset Details */}
      <Dialog
        open={customFieldModalOpen}
        onOpenChange={setCustomFieldModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add Custom Field
              </DialogTitle>
              <button
                onClick={() => {
                  setCustomFieldModalOpen(false);
                  setNewFieldName("");
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>
          <div className="py-4">
            <TextField
              label="New Field Name"
              placeholder="New Field Name"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                sx: {
                  height: 45,
                  "& .MuiInputBase-input": {
                    padding: "12px",
                  },
                },
              }}
            />
          </div>
          <DialogFooter className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCustomFieldModalOpen(false);
                setNewFieldName("");
              }}
              className="px-6 py-2 border border-[#C72030] rounded-md hover:bg-gray-50 text-sm text-orange-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCustomField}
              className="px-6 py-2 rounded-md text-sm bg-[#f6f4ee] text-red-700"
            >
              Add Field
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Field Modal for IT Assets */}

      <AddCustomFieldModal
        isOpen={itAssetsCustomFieldModalOpen}
        onClose={() => setItAssetsCustomFieldModalOpen(false)}
        onAddField={(fieldName, sectionName) =>
          handleAddItAssetsCustomField(fieldName, sectionName)
        }
        isItAsset={true}
      />
      {/* <AddCustomFieldModal isOpen={itAssetsCustomFieldModalOpen} onClose={() => setItAssetsCustomFieldModalOpen(false)} onAddField={handleAddItAssetsCustomField} isItAsset={true} /> */}
    </div>
  );
};
export default AddAssetPage;
