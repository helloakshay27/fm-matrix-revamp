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
import { TechParkSelectionModal } from "@/components/document/TechParkSelectionModal";
import { CommunitySelectionModal } from "@/components/document/CommunitySelectionModal";

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
    shareWith: "individual_tech_park",
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
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [showTechParkModal, setShowTechParkModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<
    { id: number; name: string }[]
  >([]);
  const [existingFiles, setExistingFiles] = useState<
    { name: string; url: string }[]
  >([]);

  const [formData, setFormData] = useState({
    documentCategory: "",
    documentFolder: "",
    title: "",
    shareWith: "all_tech_park",
    shareWithCommunities: "no",
  });

  // Load existing document data
  useEffect(() => {
    if (id) {
      const documentId = parseInt(id, 10);
      const existingData =
        mockDocumentData[documentId as keyof typeof mockDocumentData];

      if (existingData) {
        setFormData({
          documentCategory: existingData.documentCategory,
          documentFolder: existingData.documentFolder,
          title: existingData.title,
          shareWith: existingData.shareWith,
          shareWithCommunities: existingData.shareWithCommunities,
        });
        setSelectedTechParks(existingData.techParks);
        setSelectedCommunities(existingData.communities);
        setExistingFiles(existingData.existingFiles);
      }
    }
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleCoverImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index: number) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Implement API call to update document
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/maintenance/documents");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
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
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Document Details Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#FFF5F5] rounded-lg">
              <FileText className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              Document Details
            </h2>
          </div>

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
                {DOCUMENT_CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
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
                {DOCUMENT_FOLDERS.map((folder) => (
                  <MenuItem key={folder.value} value={folder.value}>
                    {folder.label}
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

        {/* Sharing Settings Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#FFF5F5] rounded-lg">
              <Share2 className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              Sharing Settings
            </h2>
          </div>

          <div className="space-y-6">
            {/* Share With Tech Parks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Share With
              </label>
              <RadioGroup
                value={formData.shareWith}
                onChange={(e) => handleInputChange("shareWith", e.target.value)}
              >
                <FormControlLabel
                  value="all_tech_park"
                  control={
                    <Radio
                      sx={{
                        color: "#C72030",
                        "&.Mui-checked": { color: "#C72030" },
                      }}
                    />
                  }
                  label="All Tech Park"
                />
                <FormControlLabel
                  value="individual_tech_park"
                  control={
                    <Radio
                      sx={{
                        color: "#C72030",
                        "&.Mui-checked": { color: "#C72030" },
                      }}
                    />
                  }
                  label="Individual Tech Park"
                />
              </RadioGroup>
              {formData.shareWith === "individual_tech_park" &&
                selectedTechParks.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-[#C72030] cursor-pointer hover:underline">
                      Tech Parks{" "}
                      {selectedTechParks
                        .map(
                          (id, idx) =>
                            `${id}${idx < selectedTechParks.length - 1 ? ", Tech Parks " : ""}`
                        )
                        .join("")}
                    </span>
                    <button
                      onClick={() => setShowTechParkModal(true)}
                      className="text-[#C72030] hover:text-[#A01828] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
            </div>

            {/* Share With Communities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Share With Communities
              </label>
              <RadioGroup
                value={formData.shareWithCommunities}
                onChange={(e) =>
                  handleInputChange("shareWithCommunities", e.target.value)
                }
              >
                <FormControlLabel
                  value="no"
                  control={
                    <Radio
                      sx={{
                        color: "#C72030",
                        "&.Mui-checked": { color: "#C72030" },
                      }}
                    />
                  }
                  label="No"
                />
                <FormControlLabel
                  value="yes"
                  control={
                    <Radio
                      sx={{
                        color: "#C72030",
                        "&.Mui-checked": { color: "#C72030" },
                      }}
                    />
                  }
                  label="Yes"
                />
              </RadioGroup>
              {formData.shareWithCommunities === "yes" &&
                selectedCommunities.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedCommunities.length} Community(s) selected:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCommunities.map((community) => (
                        <span
                          key={community.id}
                          className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                        >
                          {community.name}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowCommunityModal(true)}
                      className="mt-2 text-sm text-[#C72030] hover:underline"
                    >
                      Change Selection
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Attachments Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#FFF5F5] rounded-lg">
              <Paperclip className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              Attachments
            </h2>
          </div>

          <div className="space-y-6">
            {/* Existing Files */}
            {existingFiles.length > 0 && (
              <div>
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

            {/* Upload Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cover Image */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-4">Cover Image</p>
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .querySelectorAll<HTMLInputElement>(
                          'input[type="file"]'
                        )[0]
                        ?.click()
                    }
                    className="px-6 py-2 bg-white border border-gray-300 rounded text-[#C72030] hover:bg-gray-50 transition-colors"
                  >
                    Browse
                  </button>
                </label>
                {coverImage && (
                  <p className="mt-2 text-sm text-gray-600">
                    {coverImage.name}
                  </p>
                )}
              </div>

              {/* Add New Button */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
                <label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const inputs =
                        document.querySelectorAll<HTMLInputElement>(
                          'input[type="file"]'
                        );
                      inputs[1]?.click();
                    }}
                    className="px-6 py-2 bg-[#FFF5F5] text-[#C72030] rounded hover:bg-[#FFE5E5] transition-colors"
                  >
                    Add New Files
                  </button>
                </label>
              </div>
            </div>

            {/* Newly Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  New Files to Upload ({attachedFiles.length})
                </h4>
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
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
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => navigate("/maintenance/documents")}
            className="px-12 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-12 py-3 bg-[#C72030] text-white rounded-lg hover:bg-[#A01828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Updating..." : "Update Document"}
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
