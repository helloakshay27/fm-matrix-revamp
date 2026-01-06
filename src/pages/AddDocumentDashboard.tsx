import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export const AddDocumentDashboard = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [showTechParkModal, setShowTechParkModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<
    { id: number; name: string }[]
  >([]);

  const [formData, setFormData] = useState({
    documentCategory: "",
    documentFolder: "",
    title: "",
    shareWith: "all_tech_park",
    shareWithCommunities: "no",
  });

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
    if (
      !formData.documentCategory ||
      !formData.documentFolder ||
      !formData.title
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create document
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Document added successfully!");
      navigate("/maintenance/documents");
    } catch (error) {
      console.error("Error submitting document:", error);
      alert("Failed to add document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    const confirmed = window.confirm(
      "Are you sure you want to go back? Any unsaved changes will be lost."
    );
    if (confirmed) {
      navigate("/maintenance/documents");
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
      <div className="max-w-[1400px] mx-auto p-6 space-y-4">
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
                >
                  <MenuItem value="" disabled>
                    Select Document Category
                  </MenuItem>
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
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
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    Select Document Folder
                  </MenuItem>
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Choose a file or drag & drop it here
                </p>
                <label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
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
                    <div className="w-12 h-12 bg-red-50 rounded flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-red-600"
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
                          fontSize="6"
                          fill="white"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          PDF
                        </text>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {coverImage.name}
                    </span>
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

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-12 py-3 bg-[#C72030] text-white rounded-lg hover:bg-[#A01828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
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
