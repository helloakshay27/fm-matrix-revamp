import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Share2,
  Paperclip,
  Pencil,
  X,
} from "lucide-react";
import {
  getCategories,
  getAllSites,
  getFoldersTree,
  createDocument,
  fileToBase64,
  Category,
  Site,
  Folder,
  CreateDocumentPayload,
  FolderPermission,
} from "@/services/documentService";
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
import { Button } from "@/components/ui/button";
import { TechParkSelectionModal } from "@/components/document/TechParkSelectionModal";
import { CommunitySelectionModal } from "@/components/document/CommunitySelectionModal";
import { DocumentShareModal } from "@/components/document/DocumentShareModal";
import { toast } from "sonner";

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

interface NewDocument {
  title: string;
  documentCategory: string;
  attachment: File | null;
}

export const AddDocumentDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source");
  const isFolderDisabled = source === "new";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTechParkModal, setShowTechParkModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<
    { id: number; name: string }[]
  >([]);
  const [documentShares, setDocumentShares] = useState<
    Array<{
      id: string;
      user_type: "internal" | "external";
      user_id: number | null;
      email: string | null;
      full_name?: string;
      access_level: "viewer" | "editor";
    }>
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  const [formData, setFormData] = useState({
    documentCategory: "",
    documentFolder: "",
    title: "",
    shareWith: "all",
    shareWithCommunities: "no",
  });

  // Fetch categories and sites on mount
  useEffect(() => {
    const fetchData = async () => {
      console.warn("Starting to fetch data...");

      // Fetch categories
      try {
        const categoriesData = await getCategories();
        console.warn("Categories loaded:", categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

      // Fetch sites
      try {
        const sitesData = await getAllSites();
        console.warn("Sites loaded:", sitesData);
        setSites(sitesData.sites);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }

      // Fetch folders (may fail, that's okay)
      try {
        const foldersData = await getFoldersTree();
        console.warn("Folders loaded:", foldersData);
        setFolders(foldersData.folders || []);
      } catch (error) {
        console.warn(
          "Folders endpoint not available (500 error) - continuing without folders"
        );
        setFolders([]);
      }
    };
    fetchData();
  }, []);

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

  // Handle file upload for cover image
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

  // Handle file upload for attachments
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  // Remove file from attachments
  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.documentCategory || !formData.title) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!coverImage) {
      toast.error("Please upload a document");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isFolderDisabled) {
        // Convert file to base64 for sessionStorage
        const attachmentBase64 = coverImage
          ? await fileToBase64(coverImage)
          : "";

        // Return to CreateFolderPage with document data
        const documentData = {
          title: formData.title,
          documentCategory: formData.documentCategory,
          attachment: attachmentBase64,
          fileName: coverImage?.name || "",
          fileSize: coverImage?.size || 0,
        };

        // Store in sessionStorage and navigate back
        const existingDocs = sessionStorage.getItem("pendingDocuments");
        const docs = existingDocs ? JSON.parse(existingDocs) : [];
        docs.push(documentData);
        sessionStorage.setItem("pendingDocuments", JSON.stringify(docs));

        // Load existing folder settings to preserve move/copy documents
        const existingSettings = sessionStorage.getItem("folderSettings");
        const prevSettings = existingSettings
          ? JSON.parse(existingSettings)
          : {};

        // Store folder settings (category and share settings) while preserving move/copy
        const folderSettings = {
          ...prevSettings, // Preserve existing settings including move/copy/title
          categoryId: formData.documentCategory,
          shareWith: formData.shareWith,
          shareWithCommunities: formData.shareWithCommunities,
          selectedTechParks: selectedTechParks,
          selectedCommunities: selectedCommunities,
        };
        sessionStorage.setItem(
          "folderSettings",
          JSON.stringify(folderSettings)
        );

        toast.success("Document added to folder");
        navigate("/maintenance/documents/create-folder");
      } else {
        // Normal document creation flow
        const attachmentBase64 = await fileToBase64(coverImage);
        const contentType = coverImage.type || "application/pdf";

        const permissions: FolderPermission[] = [
          {
            access_level: formData.shareWith === "all" ? "all" : "selected",
            access_to: "Pms::Site",
            access_ids:
              formData.shareWith === "individual" ? selectedTechParks : [],
          },
          {
            access_level:
              formData.shareWithCommunities === "all" ? "all" : "selected",
            access_to: "Community",
            access_ids:
              formData.shareWithCommunities === "yes"
                ? selectedCommunities.map((c) => c.id)
                : [],
          },
        ];

        const payload: CreateDocumentPayload = {
          document: {
            title: formData.title,
            folder_id: formData.documentFolder
              ? parseInt(formData.documentFolder, 10)
              : undefined,
            category_id: parseInt(formData.documentCategory, 10),
            shares: documentShares.map((share) => ({
              user_type: share.user_type,
              user_id: share.user_id,
              email: share.email,
              access_level: share.access_level,
            })),
            attachments: [
              {
                filename: coverImage.name,
                content: `data:${contentType};base64,${attachmentBase64}`,
                content_type: contentType,
              },
            ],
          },
          permissions,
        };

        await createDocument(payload);
        toast.success("Document added successfully!");
        navigate("/maintenance/documents");
      }
    } catch (error: unknown) {
      console.error("Error submitting document:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add document. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    const confirmed = window.confirm(
      "Are you sure you want to go back? Any unsaved changes will be lost."
    );
    if (confirmed) {
      if (isFolderDisabled) {
        navigate("/maintenance/documents/create-folder");
      } else {
        navigate("/maintenance/documents");
      }
    }
  };

  const handleCancel = () => {
    if (coverImage || formData.title || formData.documentCategory) {
      const confirmed = window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      );
      if (confirmed) {
        handleGoBack();
      }
    } else {
      handleGoBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Add New Document
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto p-6 space-y-4">
        {/* Details Section */}
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
                <InputLabel id="document-category-label" shrink>
                  Document Category
                </InputLabel>
                <MuiSelect
                  labelId="document-category-label"
                  value={formData.documentCategory}
                  onChange={(e: SelectChangeEvent) =>
                    handleInputChange("documentCategory", e.target.value)
                  }
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Document Category
                  </MenuItem>
                  {categories.length === 0 ? (
                    <MenuItem disabled>Loading categories...</MenuItem>
                  ) : (
                    categories.map((category) => (
                      <MenuItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </MenuItem>
                    ))
                  )}
                </MuiSelect>
              </FormControl>

              {/* Document Folder */}
              <FormControl fullWidth>
                <InputLabel id="document-folder-label" shrink>
                  Document Folder
                </InputLabel>
                <MuiSelect
                  labelId="document-folder-label"
                  value={formData.documentFolder}
                  onChange={(e: SelectChangeEvent) =>
                    handleInputChange("documentFolder", e.target.value)
                  }
                  displayEmpty
                  disabled={isFolderDisabled}
                  sx={{
                    ...fieldStyles,
                    ...(isFolderDisabled && {
                      backgroundColor: "#f5f5f5",
                      "& .MuiOutlinedInput-root": {
                        ...fieldStyles["& .MuiOutlinedInput-root"],
                        backgroundColor: "#f5f5f5",
                      },
                    }),
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    {isFolderDisabled
                      ? "Folder will be created"
                      : "Select Document Folder"}
                  </MenuItem>
                  {folders.length === 0 ? (
                    <MenuItem disabled>Loading folders...</MenuItem>
                  ) : (
                    folders.map((folder) => (
                      <MenuItem key={folder.id} value={folder.id.toString()}>
                        {folder.name}
                      </MenuItem>
                    ))
                  )}
                </MuiSelect>
              </FormControl>

              {/* Title */}
              <div className="md:col-span-2">
                <TextField
                  label="Title"
                  placeholder="Enter Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
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
                      .map((_, i) => `Tech Parks ${i + 1}`)
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

            {/* Share with People Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={() => setShowShareModal(true)}
                className="bg-[#C72030] hover:bg-[#A01828] text-white gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share with People
                {documentShares.length > 0 && (
                  <span className="ml-2 bg-white text-[#C72030] px-2 py-0.5 rounded-full text-xs font-semibold">
                    {documentShares.length}
                  </span>
                )}
              </Button>
              {documentShares.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Shared with {documentShares.length}{" "}
                  {documentShares.length === 1 ? "person" : "people"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Attachment Section */}
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
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-4 pt-6 border-t">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90  h-11 w-40"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-40 h-11"
          >
            Cancel
          </Button>
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

      {/* Document Share Modal */}
      <DocumentShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onSave={(shares) => setDocumentShares(shares)}
        initialShares={documentShares}
      />
    </div>
  );
};
