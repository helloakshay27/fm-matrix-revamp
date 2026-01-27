import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Share2,
  Paperclip,
  Pencil,
  X,
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
  SelectChangeEvent,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Label } from "@/components/ui/label";
import { TechParkSelectionModal } from "@/components/document/TechParkSelectionModal";
import { CommunitySelectionModal } from "@/components/document/CommunitySelectionModal";
import { toast } from "sonner";
import {
  getDocumentDetail,
  updateDocument,
  getCategories,
  getFoldersTree,
  getAllSites,
  UpdateDocumentPayload,
  Category,
  Folder,
  Site,
  fileToBase64,
} from "@/services/documentService";

// Field styles for Material-UI components
const fieldStyles = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "& fieldset": {
      borderColor: "#ddd",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#C72030",
    },
  },
};

const DOCUMENT_CATEGORIES = [
  { value: "tenant_legal", label: "Tenant / Legal" },
  { value: "lease_legal", label: "Lease / Legal" },
  { value: "identity_verification", label: "Identity / Verification" },
  { value: "safety_compliance", label: "Safety & Compliance" },
  { value: "financial", label: "Financial" },
  { value: "contracts", label: "Contracts" },
  { value: "reports", label: "Reports" },
  { value: "other", label: "Other" },
];

const DOCUMENT_FOLDERS = [
  { value: "tenant_documents", label: "Tenant Documents" },
  { value: "lease_agreements", label: "Lease Agreements" },
  { value: "id_proofs", label: "ID Proofs" },
  { value: "fire_safety", label: "Fire Safety Certificates" },
  { value: "annual_reports", label: "Annual Reports" },
  { value: "parking_permits", label: "Parking Permits" },
  { value: "legal_documents", label: "Legal Documents" },
  { value: "policies", label: "Policies & SOPs" },
];

// Mock data for existing document
const mockDocumentData = {
  1: {
    documentCategory: "lease_legal",
    documentFolder: "lease_agreements",
    title: "Lease Agreement - Tech Park A",
    shareWith: "individual",
    shareWithCommunities: "yes",
    techParks: [1, 3],
    communities: [
      { id: 1, name: "Building A Community" },
      { id: 2, name: "Building B Community" },
    ],
    existingFiles: [
      { name: "lease_agreement.pdf", url: "#" },
      { name: "annexure_a.pdf", url: "#" },
    ],
    coverImageUrl: "#",
  },
};

export const EditDocumentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTechParkModal, setShowTechParkModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<
    { id: number; name: string }[]
  >([]);
  const [existingFiles, setExistingFiles] = useState<
    { name: string; url: string }[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [sites, setSites] = useState<Site[]>([]);

  const [formData, setFormData] = useState({
    documentCategory: "",
    documentFolder: "",
    title: "",
    shareWith: "all",
    shareWithCommunities: "no",
  });

  // Fetch categories and folders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, foldersData, sitesData] = await Promise.all([
          getCategories(),
          getFoldersTree(),
          getAllSites(),
        ]);
        setCategories(categoriesData);
        setFolders(foldersData.folders);
        setSites(sitesData.sites);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load categories and folders");
      }
    };
    fetchData();
  }, []);

  // Load existing document data
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const document = await getDocumentDetail(parseInt(id, 10));

        // Extract site permissions
        const sitePermission = document.document_permissions?.find(
          (perm: any) => perm.access_to === "Pms::Site"
        );
        const hasSitePermissions =
          sitePermission &&
          sitePermission.access_ids &&
          sitePermission.access_ids.length > 0;

        // Extract community permissions
        const communityPermission = document.document_permissions?.find(
          (perm: any) => perm.access_to === "Community"
        );
        const hasCommunityPermissions =
          communityPermission &&
          communityPermission.access_ids &&
          communityPermission.access_ids.length > 0;

        setFormData({
          documentCategory: document.category_id?.toString() || "",
          documentFolder: document.folder_id?.toString() || "",
          title: document.title,
          shareWith: hasSitePermissions ? "individual" : "all",
          shareWithCommunities: hasCommunityPermissions ? "yes" : "no",
        });

        // Set selected tech parks if exists
        if (hasSitePermissions && sitePermission.access_ids) {
          setSelectedTechParks(sitePermission.access_ids);
        }

        // Set selected communities if exists
        if (hasCommunityPermissions && communityPermission.access_records) {
          setSelectedCommunities(communityPermission.access_records);
        }

        // Set existing file if attachment exists
        if (document.attachment) {
          setExistingFiles([
            {
              name: document.attachment.filename,
              url: document.attachment.url,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        toast.error("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Open modals when specific options are selected
    if (field === "shareWith" && value === "individual_tech_park") {
      setShowTechParkModal(true);
    }

    if (field === "shareWithCommunities" && value === "yes") {
      setShowCommunityModal(true);
    }
  };

  // Handle radio button changes
  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "shareWith" && value === "individual") {
      setShowTechParkModal(true);
    }

    if (name === "shareWithCommunities" && value === "yes") {
      setShowCommunityModal(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleCoverImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      setCoverImage(files[0]);
    }
  };

  // Handle drag and drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      if (allowedTypes.includes(file.type) || file.type.startsWith("image/")) {
        setCoverImage(file);
        toast.success(`File "${file.name}" uploaded successfully`);
      } else {
        toast.error(
          "Please upload a valid document file (PDF, DOC, XLS, PPT, or Image)"
        );
      }
    }
  };

  // Get file extension and icon
  const getFileIcon = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const fileType = file.type.toLowerCase();

    // Define icon colors and types aligned with design
    if (fileType.includes("pdf") || extension === "pdf") {
      return { color: "text-[#C72030]", bg: "bg-red-50", label: "PDF" };
    } else if (
      fileType.includes("word") ||
      ["doc", "docx"].includes(extension)
    ) {
      return { color: "text-[#2563eb]", bg: "bg-blue-50", label: "DOC" };
    } else if (
      fileType.includes("excel") ||
      fileType.includes("spreadsheet") ||
      ["xls", "xlsx"].includes(extension)
    ) {
      return { color: "text-[#16a34a]", bg: "bg-green-50", label: "XLS" };
    } else if (
      fileType.includes("powerpoint") ||
      fileType.includes("presentation") ||
      ["ppt", "pptx"].includes(extension)
    ) {
      return { color: "text-[#ea580c]", bg: "bg-orange-50", label: "PPT" };
    } else if (fileType.includes("image")) {
      return {
        color: "text-[#9333ea]",
        bg: "bg-purple-50",
        label: "IMG",
        isImage: true,
      };
    } else if (fileType.includes("text") || extension === "txt") {
      return { color: "text-gray-600", bg: "bg-gray-50", label: "TXT" };
    } else {
      return {
        color: "text-gray-600",
        bg: "bg-gray-50",
        label: extension.toUpperCase().substring(0, 3),
      };
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index: number) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!id) return;

    // Validation
    if (
      !formData.title ||
      !formData.documentCategory ||
      !formData.documentFolder
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      // Handle file upload logic:
      // - If new file uploaded (coverImage exists), replace existing file
      // - If no new file (coverImage is null), keep existing files
      let attachments = [];

      if (coverImage) {
        // New file uploaded - this will replace the existing file
        const base64Content = await fileToBase64(coverImage);
        attachments = [
          {
            filename: coverImage.name,
            content: base64Content,
            content_type: coverImage.type,
          },
        ];
      }
      // If coverImage is null and existingFiles exist, we don't need to send attachments
      // The existing file will remain unchanged

      // Build permissions array
      const permissions = [];

      // Add site permissions
      if (formData.shareWith === "individual" && selectedTechParks.length > 0) {
        permissions.push({
          access_level: "selected",
          access_to: "Pms::Site",
          access_ids: selectedTechParks,
        });
      } else if (formData.shareWith === "all") {
        permissions.push({
          access_level: "all",
          access_to: "Pms::Site",
          access_ids: [],
        });
      }

      // Add community permissions
      if (
        formData.shareWithCommunities === "yes" &&
        selectedCommunities.length > 0
      ) {
        permissions.push({
          access_level: "selected",
          access_to: "Community",
          access_ids: selectedCommunities.map((c) => c.id),
        });
      }

      const payload: UpdateDocumentPayload = {
        document: {
          title: formData.title,
          category_id: parseInt(formData.documentCategory, 10),
          folder_id: parseInt(formData.documentFolder, 10),
          ...(attachments.length > 0 && { attachments }),
        },
        ...(permissions.length > 0 && { permissions }),
      };

      await updateDocument(parseInt(id, 10), payload);
      toast.success("Document updated successfully");
      navigate("/maintenance/documents");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading document...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/maintenance/documents")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Edit Document</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto p-6 space-y-4">
        {/* Document Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E5E0D3] rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#C72030]" />
              </div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Details</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document Category */}
              <FormControl fullWidth>
                <InputLabel>Document Category</InputLabel>
                <MuiSelect
                  value={formData.documentCategory}
                  onChange={(e: SelectChangeEvent) =>
                    handleInputChange("documentCategory", e.target.value)
                  }
                  label="Document Category"
                  sx={fieldStyles}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Document Folder */}
              <FormControl fullWidth>
                <InputLabel>Document Folder</InputLabel>
                <MuiSelect
                  value={formData.documentFolder}
                  onChange={(e: SelectChangeEvent) =>
                    handleInputChange("documentFolder", e.target.value)
                  }
                  label="Document Folder"
                  sx={fieldStyles}
                >
                  {folders.map((folder) => (
                    <MenuItem key={folder.id} value={folder.id.toString()}>
                      {folder.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Title */}
              <div className="md:col-span-2">
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  sx={fieldStyles}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sharing Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E5E0D3] rounded-full flex items-center justify-center">
                <Share2 className="w-5 h-5 text-[#C72030]" />
              </div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Share</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex items-center gap-4">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  Share With:
                </Label>
                <RadioGroup
                  row
                  name="shareWith"
                  value={formData.shareWith}
                  onChange={(e) =>
                    handleRadioChange("shareWith", e.target.value)
                  }
                  className="gap-2"
                >
                  <FormControlLabel
                    value="all"
                    control={
                      <Radio
                        sx={{
                          color: "#C72030",
                          "&.Mui-checked": { color: "#C72030" },
                          "& .MuiSvgIcon-root": { fontSize: 16 },
                        }}
                      />
                    }
                    label={
                      <span className="text-sm text-gray-600">
                        All Tech Park
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="individual"
                    control={
                      <Radio
                        sx={{
                          color: "#C72030",
                          "&.Mui-checked": { color: "#C72030" },
                          "& .MuiSvgIcon-root": { fontSize: 16 },
                        }}
                      />
                    }
                    label={
                      <span className="text-sm text-gray-600">
                        Individual Tech Park
                      </span>
                    }
                  />
                </RadioGroup>
              </div>

              <div className="flex items-center gap-4">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  Share With Communities:
                </Label>
                <RadioGroup
                  row
                  name="shareWithCommunities"
                  value={formData.shareWithCommunities}
                  onChange={(e) =>
                    handleRadioChange("shareWithCommunities", e.target.value)
                  }
                  className="gap-2"
                >
                  <FormControlLabel
                    value="yes"
                    control={
                      <Radio
                        sx={{
                          color: "#C72030",
                          "&.Mui-checked": { color: "#C72030" },
                          "& .MuiSvgIcon-root": { fontSize: 16 },
                        }}
                      />
                    }
                    label={<span className="text-sm text-gray-600">Yes</span>}
                  />
                  <FormControlLabel
                    value="no"
                    control={
                      <Radio
                        sx={{
                          color: "#C72030",
                          "&.Mui-checked": { color: "#C72030" },
                          "& .MuiSvgIcon-root": { fontSize: 16 },
                        }}
                      />
                    }
                    label={<span className="text-sm text-gray-600">No</span>}
                  />
                </RadioGroup>
              </div>
            </div>

            {/* Selected Tech Parks Display */}
            {formData.shareWith === "individual" &&
              selectedTechParks.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[#C72030] text-sm">
                    {selectedTechParks
                      .map((parkId) => {
                        const site = sites.find((s) => s.id === parkId);
                        return site ? site.name : `Site ${parkId}`;
                      })
                      .join(", ")}
                    .
                  </span>
                  <button
                    onClick={() => setShowTechParkModal(true)}
                    className="text-gray-500 hover:text-[#C72030] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}

            {/* Selected Communities Display */}
            {formData.shareWithCommunities === "yes" &&
              selectedCommunities.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[#C72030] text-sm">
                    {selectedCommunities.map((c) => c.name).join(", ")}.
                  </span>
                  <button
                    onClick={() => setShowCommunityModal(true)}
                    className="text-gray-500 hover:text-[#C72030] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Attachments Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E5E0D3] rounded-full flex items-center justify-center">
                <Paperclip className="w-5 h-5 text-[#C72030]" />
              </div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Attachment
              </h2>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-4">
              Upload Document
            </h3>

            {/* Upload Area or File Display */}
            {!coverImage ? (
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? "border-[#C72030] bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <p className="text-sm text-gray-500 mb-4">
                  {isDragging
                    ? "Drop your file here"
                    : "Choose a file or drag & drop it here"}
                </p>
                <label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,image/*,.ppt,.pptx"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .querySelector<HTMLInputElement>('input[type="file"]')
                        ?.click()
                    }
                    className="px-6 py-2 bg-white border border-gray-300 rounded text-[#C72030] hover:bg-gray-50 transition-colors font-medium"
                  >
                    Browse
                  </button>
                </label>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(coverImage).isImage ? (
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                        <img
                          src={URL.createObjectURL(coverImage)}
                          alt={coverImage.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-12 h-12 ${getFileIcon(coverImage).bg} rounded flex items-center justify-center`}
                      >
                        <svg
                          className={`w-8 h-8 ${getFileIcon(coverImage).color}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                          <text
                            x="10"
                            y="14"
                            fontSize="5"
                            fill="white"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {getFileIcon(coverImage).label}
                          </text>
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-700 font-medium block truncate">
                        {coverImage.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(coverImage.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCoverImage(null)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            )}

            {/* Existing Files Display */}
            {existingFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Current Files ({existingFiles.length})
                </h4>
                <div className="space-y-2">
                  {existingFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeExistingFile(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-4 pt-6 border-t">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-11 w-40 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
          <button
            onClick={() => navigate("/maintenance/documents")}
            disabled={isSubmitting}
            className="w-40 h-11 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Tech Park Selection Modal */}
      <TechParkSelectionModal
        isOpen={showTechParkModal}
        onClose={() => setShowTechParkModal(false)}
        selectedParks={selectedTechParks}
        onSelectionChange={(selected) => {
          setSelectedTechParks(selected);
        }}
      />

      {/* Community Selection Modal */}
      <CommunitySelectionModal
        isOpen={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        selectedCommunities={selectedCommunities}
        onSelectionChange={(communities) => {
          setSelectedCommunities(communities);
        }}
      />
    </div>
  );
};
