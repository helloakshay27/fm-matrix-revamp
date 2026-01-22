import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Building, Globe, Flag, Image } from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";
import { Checkbox } from '@/components/ui/checkbox';

interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  countriesDropdown: Array<{ id: number; name: string }>;
  canEdit: boolean;
}

interface OrganizationFormData {
  name: string;
  description: string;
  domain: string;
  sub_domain: string;
  front_domain: string;
  front_subdomain: string;
  country_id: string;
  active: boolean;
  // API accepts one file; we'll preview multiple but submit the first
  logo: File | null;
  powered_by_logo: File | null;
}
interface WelcomeDescription {
  description: string;
  active: boolean;
}
interface VisionItem {
  description: string;
  active: boolean;
}
interface MissionItem {
  description: string;
  active: boolean;
}

interface CEOInfo {
  name: string;
  designation: string;
  description: string;
  photo: File | null;
  photoPreviewUrl: string | null;
  video: File | null;
  videoUrl: string | null;
}



const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const AddOrganizationModal: React.FC<AddOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  countriesDropdown,
  canEdit,
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Local preview URLs for selected images (support multiple previews)
  const [logoPreviewUrls, setLogoPreviewUrls] = useState<string[]>([]);
  const [poweredByPreviewUrls, setPoweredByPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    description: "",
    domain: "",
    sub_domain: "",
    front_domain: "",
    front_subdomain: "",
    country_id: "",
    active: true,
    logo: null,
    powered_by_logo: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [welcomeDescriptions, setWelcomeDescriptions] = useState<WelcomeDescription[]>([
    { description: "", active: false },
  ]);

  const addWelcomeDescription = () => {
    setWelcomeDescriptions((prev) => [
      ...prev,
      { description: "", active: false },
    ]);
  };

  const updateWelcomeDescription = (
    index: number,
    field: keyof WelcomeDescription,
    value: string | boolean
  ) => {
    setWelcomeDescriptions((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const removeWelcomeDescription = (index: number) => {
    setWelcomeDescriptions((prev) => prev.filter((_, i) => i !== index));
  };


  const [visionList, setVisionList] = useState<VisionItem[]>([
    { description: "", active: false },
  ]);
  const addVision = () => {
    setVisionList((prev) => [...prev, { description: "", active: false }]);
  };

  const updateVision = (
    index: number,
    field: keyof VisionItem,
    value: string | boolean
  ) => {
    setVisionList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const removeVision = (index: number) => {
    setVisionList((prev) => prev.filter((_, i) => i !== index));
  };

  const [missionList, setMissionList] = useState<MissionItem[]>([
    { description: "", active: false },
  ]);
  const addMission = () => {
    setMissionList((prev) => [...prev, { description: "", active: false }]);
  };

  const updateMission = (
    index: number,
    field: keyof MissionItem,
    value: string | boolean
  ) => {
    setMissionList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const removeMission = (index: number) => {
    setMissionList((prev) => prev.filter((_, i) => i !== index));
  };

  const [ceoInfo, setCeoInfo] = useState<CEOInfo>({
    name: "",
    designation: "CEO",
    description: "",
    photo: null,
    photoPreviewUrl: null,
    video: null,
    videoUrl: null,
  });

  const handleCeoPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setCeoInfo((prev) => ({
        ...prev,
        photo: file,
        photoPreviewUrl: URL.createObjectURL(file),
      }));
    } else {
      setCeoInfo((prev) => ({ ...prev, photo: null, photoPreviewUrl: null }));
    }
  };

  const handleCeoVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setCeoInfo((prev) => ({
        ...prev,
        video: file,
        videoUrl: URL.createObjectURL(file),
      }));
    } else {
      setCeoInfo((prev) => ({ ...prev, video: null, videoUrl: null }));
    }
  };

  // Validate domains like example.com and with more segments (e.g., app.example.co.in)
  const isValidDomain = (value: string) => {
    if (!value) return false;
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(value.trim());
  };


  console.log("welcomeDescriptions:", welcomeDescriptions, visionList, missionList, ceoInfo);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required";
    }
    if (!formData.domain.trim()) {
      newErrors.domain = "Main domain is required";
    }
    if (!formData.sub_domain.trim()) {
      newErrors.sub_domain = "Sub domain is required";
    }

    // Domain validation
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;

    if (formData.domain && !domainRegex.test(formData.domain)) {
      newErrors.domain = "Please enter a valid main domain (e.g., example.com)";
    }

    // No format validation for sub_domain, only required check above

    // if (formData.front_domain && !domainRegex.test(formData.front_domain)) {
    //   newErrors.front_domain = "Please enter a valid frontend domain (e.g., www.example.com)";
    // }

    // if (
    //   formData.front_subdomain &&
    //   !domainRegex.test(formData.front_subdomain)
    // ) {
    //   newErrors.front_subdomain = "Please enter a valid frontend subdomain (e.g., portal.example.com)";
    // }

    setErrors(newErrors);
    console.log("Validation errors:", newErrors, Object.keys(newErrors), errors)
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    if (!canEdit) {
      toast.error("You do not have permission to create organizations");
      return;
    }

    setIsSubmitting(true);

    const submitFormData = new FormData();
    submitFormData.append("organization[name]", formData.name);
    submitFormData.append("organization[description]", formData.description);
    submitFormData.append("organization[domain]", formData.domain);
    submitFormData.append("organization[sub_domain]", formData.sub_domain);
    submitFormData.append("organization[front_domain]", formData.front_domain);
    submitFormData.append(
      "organization[front_subdomain]",
      formData.front_subdomain
    );
    if (formData.country_id && formData.country_id !== "none") {
      submitFormData.append("organization[country_id]", formData.country_id);
    }
    submitFormData.append("organization[active]", formData.active.toString());

    if (formData.logo) {
      submitFormData.append("organization[logo]", formData.logo);
    }
    if (formData.powered_by_logo) {
      submitFormData.append(
        "organization[powered_by_logo]",
        formData.powered_by_logo
      );
    }

    if (welcomeDescriptions && welcomeDescriptions.length > 0) {
      welcomeDescriptions.forEach((desc, index) => {
        submitFormData.append(
          `organization[other_config][welcome][description][${index}][text]`,
          desc.description
        );
        submitFormData.append(
          `organization[other_config][welcome][description][${index}][bold]`,
          desc.active.toString()
        );
      });
    }

    if (visionList && visionList.length > 0) {
      visionList.forEach((desc, index) => {
        submitFormData.append(
          `organization[other_config][vision][description][${index}][text]`,
          desc.description
        );
        submitFormData.append(
          `organization[other_config][vision][description][${index}][bold]`,
          desc.active.toString()
        );
      });
    }

    if (missionList && missionList.length > 0) {
      missionList.forEach((desc, index) => {
        submitFormData.append(
          `organization[other_config][mission][description][${index}][text]`,
          desc.description
        );
        submitFormData.append(
          `organization[other_config][mission][description][${index}][bold]`,
          desc.active.toString()
        );
      });
    }

    // ---------------------
    // Add CEO info if present
    // ---------------------
    if (ceoInfo) {
      submitFormData.append(
        "organization[other_config][ceo_info][name]",
        ceoInfo.name
      );
      submitFormData.append(
        "organization[other_config][ceo_info][designation]",
        "CEO" // or ceoInfo.designation if dynamic
      );
      submitFormData.append(
        "organization[other_config][ceo_info][description]",
        ceoInfo.description
      );

      // These are references; your API may use relation names for files
      submitFormData.append(
        "organization[other_config][ceo_info][photo_relation]",
        "CEOPhoto"
      );
      submitFormData.append(
        "organization[other_config][ceo_info][video_relation]",
        "CEOVideo"
      );

      // Actual files
      if (ceoInfo.photo) {
        submitFormData.append("organization[ceo_photo]", ceoInfo.photo);
      }
      if (ceoInfo.video) {
        submitFormData.append("organization[ceo_video]", ceoInfo.video);
      }
    }


    try {
      const response = await fetch(getFullUrl("/organizations.json"), {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
        },
        body: submitFormData,
      });

      if (response.ok) {
        toast.success("Organization created successfully");
        resetForm();
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to create organization");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Error creating organization");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Keep the first file as the submitted logo if not set yet
      const first = files[0];
      setFormData((prev) => ({ ...prev, logo: prev.logo ?? first }));
      // Generate previews for all newly selected files and append to existing
      const newUrls: string[] = Array.from(files).map((f) =>
        URL.createObjectURL(f)
      );
      setLogoPreviewUrls((prev) => [...prev, ...newUrls]);
      // Clear the input value to allow selecting the same file again if needed
      event.currentTarget.value = "";
    } else {
      // Clear when no files
      logoPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      setLogoPreviewUrls([]);
      setFormData({ ...formData, logo: null });
    }
  };

  const handlePoweredByLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const first = files[0];
      setFormData((prev) => ({ ...prev, powered_by_logo: prev.powered_by_logo ?? first }));
      const newUrls: string[] = Array.from(files).map((f) =>
        URL.createObjectURL(f)
      );
      setPoweredByPreviewUrls((prev) => [...prev, ...newUrls]);
      event.currentTarget.value = "";
    } else {
      poweredByPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      setPoweredByPreviewUrls([]);
      setFormData({ ...formData, powered_by_logo: null });
    }
  };

  // Remove a logo preview at given index
  const removeLogoPreview = (index: number) => {
    setLogoPreviewUrls((prev) => {
      const copy = [...prev];
      const url = copy[index];
      if (url) URL.revokeObjectURL(url);
      copy.splice(index, 1);
      return copy;
    });
    // If submitted logo is from the first selected and we removed all, clear it
    setFormData((prev) => {
      if (logoPreviewUrls.length - 1 <= 0) {
        return { ...prev, logo: null };
      }
      return prev;
    });
  };

  // Remove a powered-by preview at given index
  const removePoweredByPreview = (index: number) => {
    setPoweredByPreviewUrls((prev) => {
      const copy = [...prev];
      const url = copy[index];
      if (url) URL.revokeObjectURL(url);
      copy.splice(index, 1);
      return copy;
    });
    setFormData((prev) => {
      if (poweredByPreviewUrls.length - 1 <= 0) {
        return { ...prev, powered_by_logo: null };
      }
      return prev;
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      domain: "",
      sub_domain: "",
      front_domain: "",
      front_subdomain: "",
      country_id: "",
      active: true,
      logo: null,
      powered_by_logo: null,
    });
    // Revoke and clear previews
    logoPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
    poweredByPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
    setLogoPreviewUrls([]);
    setPoweredByPreviewUrls([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  const removeCeoPhoto = () => {
    setCeoInfo((prev) => ({
      ...prev,
      photo: null,
      photoPreviewUrl: null,
    }));
  };


  const removeCeoVideo = () => {
    setCeoInfo((prev) => ({
      ...prev,
      video: null,
      videoUrl: null,
    }));
  };



  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            ADD NEW ORGANIZATION
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Organization Name"
                placeholder="Enter organization name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                required
                disabled={isSubmitting}
              />

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Country</InputLabel>
                <MuiSelect
                  value={formData.country_id}
                  onChange={(e) =>
                    setFormData({ ...formData, country_id: e.target.value })
                  }
                  label="Country"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                  disabled={isSubmitting}
                >
                  <MenuItem value="">
                    <em>Select Country</em>
                  </MenuItem>
                  {countriesDropdown.map((country) => (
                    <MenuItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div className="mt-6">
              <TextField
                label="Description"
                placeholder="Enter organization description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "auto !important",
                    padding: "2px !important",
                    display: "flex",
                  },
                  "& .MuiInputBase-input[aria-hidden='true']": {
                    flex: 0,
                    width: 0,
                    height: 0,
                    padding: "0 !important",
                    margin: 0,
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    resize: "none !important",
                  },
                }}
                InputProps={{ sx: fieldStyles }}
                multiline
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-6">
              <div className="space-y-1">
                <span className="text-sm font-medium">Status</span>
                <p className="text-xs text-gray-600">
                  Set whether this organization is active or inactive
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                  disabled={isSubmitting}
                />
                <Badge variant={formData.active ? "default" : "secondary"}>
                  {formData.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Domain Configuration Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Domain Configuration
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Main Domain"
                placeholder="example.com"
                value={formData.domain}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, domain: val });
                  // Clear error when valid
                  setErrors((prev) => ({
                    ...prev,
                    domain: isValidDomain(val) ? "" : prev.domain,
                  }));
                }}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  required: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
                required
                error={!!errors.domain}
                helperText={errors.domain || "Enter a valid domain (e.g., example.com)"}
              />

              <TextField
                label="Sub Domain"
                placeholder="app.example.com"
                value={formData.sub_domain}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, sub_domain: val });
                  setErrors((prev) => ({
                    ...prev,
                    sub_domain: ""
                  }));
                }}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  required: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
                required
                error={!!errors.sub_domain}
                helperText={errors.sub_domain || ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <TextField
                label="Frontend Domain"
                placeholder="example.com"
                value={formData.front_domain}
                onChange={(e) =>
                  setFormData({ ...formData, front_domain: e.target.value })
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
                helperText="Enter frontend domain (e.g., example.com)"
              />

              <TextField
                label="Frontend Subdomain"
                placeholder="portal.example.com"
                value={formData.front_subdomain}
                onChange={(e) =>
                  setFormData({ ...formData, front_subdomain: e.target.value })
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
                helperText="Enter frontend subdomain "
              />
            </div>
          </div>

          {/* Logo Upload Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Logo Upload
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-sm font-medium">Organization Logo</span>
                <input
                  type="file"
                  multiple
                  onChange={handleLogoChange}
                  accept="image/*"
                  disabled={isSubmitting}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
                />
                {logoPreviewUrls.length > 0 && (
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {formData.logo?.name}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {logoPreviewUrls.map((url, idx) => (
                        <div key={url} className="relative">
                          <img
                            src={url}
                            alt={`Organization Logo Preview ${idx + 1}`}
                            className="h-16 w-16 object-cover border border-gray-200 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeLogoPreview(idx)}
                            className="absolute -top-1.5 -right-1.5 bg-white text-[#BD2828] border border-gray-200 rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center shadow hover:bg-[#BD2828] hover:text-white"
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Powered By Logo</span>
                <input
                  type="file"
                  multiple
                  onChange={handlePoweredByLogoChange}
                  accept="image/*"
                  disabled={isSubmitting}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
                />
                {poweredByPreviewUrls.length > 0 && (
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {formData.powered_by_logo?.name}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {poweredByPreviewUrls.map((url, idx) => (
                        <div key={url} className="relative">
                          <img
                            src={url}
                            alt={`Powered By Logo Preview ${idx + 1}`}
                            className="h-16 w-16 object-cover border border-gray-200 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removePoweredByPreview(idx)}
                            className="absolute -top-1.5 -right-1.5 bg-white text-[#BD2828] border border-gray-200 rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center shadow hover:bg-[#BD2828] hover:text-white"
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#BD2828] border border-transparent rounded-lg p-4 mt-4 text-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image className="w-4 h-4 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    Upload Guidelines
                  </p>
                  <p className="text-xs text-white/90">
                    Recommended formats: PNG, JPG, SVG • Max size: 2MB • Min dimensions: 200x200px
                  </p>
                </div>
              </div>
            </div>


          </div>


          {/* Welcome Description Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Welcome Description
            </h3>

            <div className="space-y-4">
              {welcomeDescriptions.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 space-y-3"
                >
                  <TextField
                    label={`Paragraph ${index + 1}`}
                    placeholder="Enter welcome description"
                    value={item.description}
                    onChange={(e) =>
                      updateWelcomeDescription(index, "description", e.target.value)
                    }
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "auto !important",
                        padding: "2px !important",
                        display: "flex",
                      },
                      "& .MuiInputBase-input[aria-hidden='true']": {
                        flex: 0,
                        width: 0,
                        height: 0,
                        padding: "0 !important",
                        margin: 0,
                        display: "none",
                      },
                      "& .MuiInputBase-input": {
                        resize: "none !important",
                      },
                    }}
                    InputProps={{ sx: fieldStyles }}
                    multiline
                    rows={3}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    disabled={isSubmitting}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={item.active}
                        onCheckedChange={(checked) =>
                          updateWelcomeDescription(index, "active", checked)
                        }
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-700">
                        Show in bold
                      </span>
                    </div>


                    {welcomeDescriptions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWelcomeDescription(index)}
                        style={{ padding: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X style={{ color: 'red', width: 16, height: 16 }} />
                      </Button>
                    )}

                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addWelcomeDescription}
              className="mt-4 bg-[#C72030] text-white hover:bg-[#C72030]/90"
              disabled={isSubmitting}
            >
              + Add Description
            </Button>
          </div>

          {/* Vision Section */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Vision
            </h3>

            <div className="space-y-4">
              {visionList.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 space-y-3"
                >
                  <TextField
                    label={`Paragraph ${index + 1}`}
                    placeholder="Enter vision description"
                    value={item.description}
                    onChange={(e) =>
                      updateVision(index, "description", e.target.value)
                    }
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "auto !important",
                        padding: "2px !important",
                        display: "flex",
                      },
                      "& .MuiInputBase-input[aria-hidden='true']": {
                        flex: 0,
                        width: 0,
                        height: 0,
                        padding: "0 !important",
                        margin: 0,
                        display: "none",
                      },
                      "& .MuiInputBase-input": {
                        resize: "none !important",
                      },
                    }}
                    InputProps={{ sx: fieldStyles }}
                    multiline
                    rows={3}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    disabled={isSubmitting}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={item.active}
                        onCheckedChange={(checked) =>
                          updateVision(index, "active", checked)
                        }
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-700">
                        Show in bold
                      </span>
                    </div>

                    {visionList.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVision(index)}
                        // className="text-red-600 hover:text-red-700"
                        style={{ padding: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {/* Remove */}
                        <X style={{ color: 'red', width: 16, height: 16 }} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addVision}
              className="mt-4 bg-[#C72030] text-white hover:bg-[#C72030]/90"
              disabled={isSubmitting}
            >
              + Add Vision
            </Button>
          </div>
          {/* Mission Section */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Mission
            </h3>

            <div className="space-y-4">
              {missionList.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 space-y-3"
                >
                  <TextField
                    label={`Paragraph ${index + 1}`}
                    placeholder="Enter mission description"
                    value={item.description}
                    onChange={(e) =>
                      updateMission(index, "description", e.target.value)
                    }
                    fullWidth
                    // multiline
                    // rows={3}
                    // variant="outlined"
                    InputLabelProps={{ shrink: true }}

                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "auto !important",
                        padding: "2px !important",
                        display: "flex",
                      },
                      "& .MuiInputBase-input[aria-hidden='true']": {
                        flex: 0,
                        width: 0,
                        height: 0,
                        padding: "0 !important",
                        margin: 0,
                        display: "none",
                      },
                      "& .MuiInputBase-input": {
                        resize: "none !important",
                      },
                    }}
                    InputProps={{ sx: fieldStyles }}
                    multiline
                    rows={3}
                    disabled={isSubmitting}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={item.active}
                        onCheckedChange={(checked) =>
                          updateMission(index, "active", checked)
                        }
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-700">
                        Show in bold
                      </span>
                    </div>

                    {missionList.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMission(index)}
                        // className="text-red-600 hover:text-red-700"
                        style={{ padding: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {/* Remove */}
                        <X style={{ color: 'red', width: 16, height: 16 }} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addMission}
              className="mt-4 bg-[#C72030] text-white hover:bg-[#C72030]/90"
              disabled={isSubmitting}
            >
              + Add Mission
            </Button>
          </div>

          {/* CEO Info Section */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-[#C72030] mb-4">CEO Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <TextField
                label="Name"
                placeholder="Enter CEO name"
                value={ceoInfo.name}
                onChange={(e) =>
                  setCeoInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                disabled={isSubmitting}
              />

              {/* Designation */}
              <TextField
                label="Designation"
                value={ceoInfo.designation}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </div>

            {/* Description */}
            {/* <div className="mt-4">
              <TextField
                label="Description"
                placeholder="Enter CEO description"
                value={ceoInfo.description}
                onChange={(e) =>
                  setCeoInfo((prev) => ({ ...prev, description: e.target.value }))
                }
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                disabled={isSubmitting}
              />
            </div> */}

            {/* CEO Description */}
            <div className="mt-6">
              <TextField
                label="Description"
                placeholder="Enter CEO description"
                value={ceoInfo.description}
                onChange={(e) =>
                  setCeoInfo((prev) => ({ ...prev, description: e.target.value }))
                }
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "auto !important",
                    padding: "2px !important",
                    display: "flex",
                  },
                  "& .MuiInputBase-input[aria-hidden='true']": {
                    flex: 0,
                    width: 0,
                    height: 0,
                    padding: "0 !important",
                    margin: 0,
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    resize: "none !important",
                  },
                }}
                InputProps={{ sx: fieldStyles }}
                multiline
                rows={3}
                disabled={isSubmitting}
              />
            </div>


            {/* Photo Upload */}
            {/* <div className="mt-4">
              <span className="text-sm font-medium">Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCeoPhotoChange}
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
              />
              {ceoInfo.photoPreviewUrl && (
                <img
                  src={ceoInfo.photoPreviewUrl}
                  alt="CEO Photo Preview"
                  className="mt-2 h-24 w-24 object-cover rounded border border-gray-200"
                />
              )}
            </div> */}

            {/* <div className="mt-4">
              <span className="text-sm font-medium">Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCeoPhotoChange}
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
              />

              {ceoInfo.photoPreviewUrl && (
                <div className="relative inline-block mt-2">
                  <img
                    src={ceoInfo.photoPreviewUrl}
                    alt="CEO Photo Preview"
                    className="h-24 w-24 object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeCeoPhoto}
                    className="absolute -top-1.5 -right-1.5 bg-white text-[#BD2828] border border-gray-200 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow hover:bg-[#BD2828] hover:text-white"
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              )}
            </div> */}

            <div className="mt-4 space-y-2">
              <span className="text-sm font-medium">Photo</span>

              <input
                type="file"
                accept="image/*"
                onChange={handleCeoPhotoChange}
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
              />

              {ceoInfo.photoPreviewUrl && (
                <div className="flex items-center gap-3 flex-wrap mt-2">
                  <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    CEO Photo
                  </div>

                  <div className="relative">
                    <img
                      src={ceoInfo.photoPreviewUrl}
                      alt="CEO Photo Preview"
                      className="h-16 w-16 object-cover border border-gray-200 rounded"
                    />
                    <button
                      type="button"
                      onClick={removeCeoPhoto}
                      className="absolute -top-1.5 -right-1.5 bg-white text-[#BD2828] border border-gray-200 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow hover:bg-[#BD2828] hover:text-white"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>




            {/* Video Upload */}
            {/* <div className="mt-4">
              <span className="text-sm font-medium">Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleCeoVideoChange}
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
              /> */}
            {/* {ceoInfo.videoUrl && (
                <video
                  src={ceoInfo.videoUrl}
                  controls
                  className="mt-2 max-h-48 w-full object-cover rounded border border-gray-200"
                />
              )} */}
            {/* </div> */}


            <div className="mt-4 space-y-2">
              <span className="text-sm font-medium">Video</span>

              <input
                type="file"
                accept="video/*"
                onChange={handleCeoVideoChange}
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
              />

              {(ceoInfo.videoUrl || ceoInfo.video) && (
                <div className="flex items-center gap-3 flex-wrap mt-2">
                  <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    CEO Video
                  </div>

                  <div className="relative">
                    <div className="h-16 w-16 flex items-center justify-center border border-gray-200 rounded bg-gray-50 text-xs text-gray-600">
                      MP4
                    </div>

                    <button
                      type="button"
                      onClick={removeCeoVideo}
                      className="absolute -top-1.5 -right-1.5 bg-white text-[#BD2828] border border-gray-200 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow hover:bg-[#BD2828] hover:text-white"
                      aria-label="Remove video"
                    >
                      ×
                    </button>
                  </div>

                  {ceoInfo.videoUrl && !ceoInfo.video && (
                    <a
                      href={ceoInfo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-black underline decoration-red-600 decoration-2 underline-offset-4"
                    >
                      Open
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>



        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6 py-2"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canEdit}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-6 py-2"
          >
            {isSubmitting ? "Creating..." : "Create Organization"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
