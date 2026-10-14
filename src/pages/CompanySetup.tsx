import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Plus,
  X,
  Upload,
  Building2,
  Crown,
  Eye,
  Target,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUser } from "@/utils/auth";

interface Paragraph {
  id: string;
  text: string;
  isBold: boolean;
}

interface CEOInfo {
  name: string;
  designation: string;
  description: string;
}

interface EOMHistoryItem {
  extra_field_id: number;
  month?: string;
  field_name?: string;
  full_name?: string;
  field_description?: string;
  role?: string;
  field_value?: string;
  profile_image?: string;
  id?: number | string;
}

interface OtherConfig {
  welcome?: { description: Record<string, { text: string; bold: string | boolean }> };
  vision?: { description: Record<string, { text: string; bold: string | boolean }> };
  mission?: { description: Record<string, { text: string; bold: string | boolean }> };
  ceo_info?: {
    name?: string;
    designation?: string;
    description?: string;
    photo_relation?: string;
    video_relation?: string;
  };
  employee_of_the_month?: {
    userId?: string;
    userName?: string;
    role?: string;
    month?: string;
    points?: string[];
    profileImage?: string;
  };
  [key: string]: unknown; // Allow other dynamic fields safely
}

const addParagraph = (
  setter: React.Dispatch<React.SetStateAction<Paragraph[]>>
) => {
  setter((prev) => [
    ...prev,
    { id: Math.random().toString(36).substr(2, 9), text: "", isBold: false },
  ]);
};

const updateParagraph = (
  id: string,
  field: keyof Paragraph,
  value: string | boolean,
  setter: React.Dispatch<React.SetStateAction<Paragraph[]>>
) => {
  setter((prev) =>
    prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
  );
};

const removeParagraph = (
  id: string,
  setter: React.Dispatch<React.SetStateAction<Paragraph[]>>
) => {
  setter((prev) => {
    if (prev.length === 1) return prev;
    return prev.filter((p) => p.id !== id);
  });
};

const transformParagraphs = (paragraphs: Paragraph[]) => {
  const result: Record<string, { text: string; bold: string }> = {};
  paragraphs.forEach((p, index) => {
    result[index] = {
      text: p.text,
      bold: p.isBold ? "true" : "false",
    };
  });
  return { description: result };
};

const convertMonthToAPIFormat = (monthStr: string): string => {
  const monthMap: Record<string, string> = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  const parts = monthStr.trim().split(" ");
  if (parts.length === 2) {
    const monthNum = monthMap[parts[0]];
    if (monthNum) return `${parts[1]}-${monthNum}`;
  }
  return monthStr;
};

// Repairs UTF-8 text that was stored double-encoded (e.g. "â€”" instead of "—")
const fixMojibake = (text: string) =>
  text
    .replace(/â€”/g, "—")
    .replace(/â€“/g, "–")
    .replace(/â€™/g, "’")
    .replace(/â€˜/g, "‘")
    .replace(/â€œ/g, "“")
    .replace(/â€\u009d/g, "”")
    .replace(/â€¦/g, "…")
    .replace(/â€[\u0080-\u009f]?/g, "—");

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-[var(--color-ink-68)]" />
    </span>
    <h3 className="text-sm font-semibold uppercase text-[var(--color-text)]">
      {title}
    </h3>
  </div>
);

const ParagraphCard = ({
  p,
  index,
  setter,
  title,
  placeholder,
  canRemove,
}: {
  p: Paragraph;
  index: number;
  setter: React.Dispatch<React.SetStateAction<Paragraph[]>>;
  title: string;
  placeholder: string;
  canRemove: boolean;
}) => {
  const [localText, setLocalText] = useState(p.text);

  useEffect(() => {
    setLocalText(p.text);
  }, [p.text]);

  const handleBlur = () => {
    if (localText !== p.text) {
      updateParagraph(p.id, "text", localText, setter);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <TextField
          label={`Paragraph ${index + 1}`}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          fullWidth
          multiline
          minRows={3}
          InputLabelProps={{ shrink: true }}
        />
        {canRemove && (
          <button
            type="button"
            onClick={() => removeParagraph(p.id, setter)}
            className="mt-2 w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 shrink-0"
            aria-label={`Remove paragraph ${index + 1}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id={`bold-${title}-${p.id}`}
          checked={p.isBold}
          onCheckedChange={(checked) =>
            updateParagraph(p.id, "isBold", checked === true, setter)
          }
        />
        <Label
          htmlFor={`bold-${title}-${p.id}`}
          className="text-sm text-gray-600 font-normal cursor-pointer"
        >
          Show in bold
        </Label>
      </div>
    </div>
  );
};

const DescriptionSection = ({
  title,
  icon,
  paragraphs,
  setter,
  addLabel,
  placeholder,
}: {
  title: string;
  icon: React.ElementType;
  paragraphs: Paragraph[];
  setter: React.Dispatch<React.SetStateAction<Paragraph[]>>;
  addLabel: string;
  placeholder: string;
}) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6">
    <SectionHeader icon={icon} title={title} />
    <div className="space-y-5">
      {paragraphs.map((p, index) => (
        <ParagraphCard
          key={p.id}
          p={p}
          index={index}
          setter={setter}
          title={title}
          placeholder={placeholder}
          canRemove={paragraphs.length > 1}
        />
      ))}
    </div>
    <button
      type="button"
      onClick={() => addParagraph(setter)}
      className="fm-action-secondary mt-5"
    >
      <Plus className="w-4 h-4 mr-2" />
      {addLabel}
    </button>
  </div>
);

const FileUploadField = ({
  id,
  label,
  accept,
  file,
  onChange,
}: {
  id: string;
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) => (
  <div>
    <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </Label>
    <label
      htmlFor={id}
      className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <span className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0">
        <Upload className="w-4 h-4 text-[var(--color-ink-68)]" />
      </span>
      <span className="text-sm text-gray-600 truncate">
        {file ? file.name : `Choose ${label.toLowerCase()}`}
      </span>
      <input
        type="file"
        id={id}
        className="hidden"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  </div>
);

const CompanySetup: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const companyId = localStorage.getItem("org_id") || user?.lock_role?.company_id || "116";

  const currentConfigRef = React.useRef<OtherConfig | null>(null);

  const [welcomeParagraphs, setWelcomeParagraphs] = useState<Paragraph[]>([
    { id: "1", text: "", isBold: false },
  ]);
  const [visionParagraphs, setVisionParagraphs] = useState<Paragraph[]>([
    { id: "1", text: "", isBold: false },
  ]);
  const [missionParagraphs, setMissionParagraphs] = useState<Paragraph[]>([
    { id: "1", text: "", isBold: false },
  ]);


  const [ceoInfo, setCeoInfo] = useState<CEOInfo>({
    name: "",
    designation: "CEO",
    description: "",
  });


  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl =
          localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
        const protocol = baseUrl.startsWith("http") ? "" : "https://";

        const response = await axios.get(
          `${protocol}${baseUrl}/organizations/${companyId}.json`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = response.data;
        const data = result.organization || result.data || result;

        if (data) {
          if (data && typeof data.other_config === "string") {
            try {
              data.other_config = JSON.parse(data.other_config);
            } catch (e) {
              console.error("Failed to parse other_config string:", e);
            }
          }
          if (data.other_config) {
            const config = data.other_config;

            const parseParagraphs = (section: { description?: Record<string, { text: string; bold: string | boolean }> }) => {
              if (!section || !section.description)
                return [{ id: "1", text: "", isBold: false }];
              
              // Ensure order is maintained by sorting keys (0, 1, 2...)
              const entries = Object.entries(section.description).sort(
                ([a], [b]) => Number(a) - Number(b)
              );

              return entries.map(([_, p]) => ({
                id: Math.random().toString(36).substr(2, 9),
                text: fixMojibake(p.text || ""),
                isBold: p.bold === "true" || p.bold === true,
              }));
            };

            setWelcomeParagraphs(parseParagraphs(config.welcome));
            setVisionParagraphs(parseParagraphs(config.vision));
            setMissionParagraphs(parseParagraphs(config.mission));

            if (config.ceo_info) {
              setCeoInfo({
                name: config.ceo_info.name || "",
                designation: config.ceo_info.designation || "CEO",
                description: fixMojibake(config.ceo_info.description || ""),
              });
            }

            // Store the full config to preserve other fields during update
            currentConfigRef.current = config;
          }
        }
      } catch (error) {
        console.error("Failed to fetch organization data:", error);
      }
    };

    fetchOrgData();
  }, [companyId]);

    // console.log("🏢 Active Organization ID:", companyId);

  // Convert "March 2026" → "2026-03" for the extra_fields API

  // ─── Section 1: Save company info (welcome, vision, mission, CEO) ───────────
  // No eomLoading needed here

  // ─── Section 1: Save Company Info (Welcome / Vision / Mission / CEO) ─────────
  const handleCompanyUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      const formData = new FormData();
      
      // Get existing config to preserve other fields
      const existingConfig = currentConfigRef.current || {};
      
      const otherConfig = {
        ...existingConfig,
        welcome: transformParagraphs(welcomeParagraphs),
        vision: transformParagraphs(visionParagraphs),
        mission: transformParagraphs(missionParagraphs),
        ceo_info: {
          name: ceoInfo.name,
          designation: ceoInfo.designation,
          description: ceoInfo.description,
          photo_relation: "CEOPhoto",
          video_relation: "CEOVideo",
        },
      };

      formData.append(
        "organization[other_config]",
        JSON.stringify(otherConfig)
      );
      if (photo) formData.append("organization[ceo_photo]", photo);
      if (video) formData.append("organization[ceo_video]", video);

      // console.log("📤 Updating Organization:", companyId, otherConfig);

      const response = await axios.put(
        `${protocol}${baseUrl}/organizations/${companyId}.json`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("✅ Organization Update Response:", response.data);

      // Store updated config for future use
      currentConfigRef.current = otherConfig;

      // Cache changes locally with a timestamp for immediate reflection in Hub
      const updateTime = Date.now().toString();
      localStorage.setItem("company_hub_update_time", updateTime);
      localStorage.setItem("company_hub_welcome_data", JSON.stringify(otherConfig.welcome));
      localStorage.setItem("company_hub_vision_data", JSON.stringify(otherConfig.vision));
      localStorage.setItem("company_hub_mission_data", JSON.stringify(otherConfig.mission));
      localStorage.setItem("company_hub_ceo_data", JSON.stringify(otherConfig.ceo_info));

      toast.success("Company info updated successfully");
    } catch (error) {
      console.error("Company update failed:", error);
      toast.error("Failed to update company info");
    } finally {
      setLoading(false);
    }
  };

  // ─── Section 2: Save Employee of the Month ───────────────────────────────────
  // Removed EOM and Announcement Update Handlers

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="w-full space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-[var(--color-ink-68)]" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase">
            Company Setup
          </h1>
        </div>

        <DescriptionSection
          title="Welcome Description"
          icon={MessageSquare}
          paragraphs={welcomeParagraphs}
          setter={setWelcomeParagraphs}
          addLabel="Add Description"
          placeholder="Enter welcome description"
        />
        <DescriptionSection
          title="Vision"
          icon={Eye}
          paragraphs={visionParagraphs}
          setter={setVisionParagraphs}
          addLabel="Add Vision"
          placeholder="Enter vision description"
        />
        <DescriptionSection
          title="Mission"
          icon={Target}
          paragraphs={missionParagraphs}
          setter={setMissionParagraphs}
          addLabel="Add Mission"
          placeholder="Enter mission description"
        />

        {/* CEO Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader icon={Crown} title="CEO Info" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Name"
              value={ceoInfo.name}
              onChange={(e) => setCeoInfo({ ...ceoInfo, name: e.target.value })}
              placeholder="Enter CEO name"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Designation"
              value={ceoInfo.designation}
              onChange={(e) =>
                setCeoInfo({ ...ceoInfo, designation: e.target.value })
              }
              placeholder="CEO"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <div className="md:col-span-2">
              <TextField
                label="Description"
                value={ceoInfo.description}
                onChange={(e) =>
                  setCeoInfo({ ...ceoInfo, description: e.target.value })
                }
                placeholder="Enter CEO description"
                fullWidth
                multiline
                minRows={4}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <FileUploadField
              id="photo-upload"
              label="Photo"
              accept="image/*"
              file={photo}
              onChange={setPhoto}
            />
            <FileUploadField
              id="video-upload"
              label="Video"
              accept="video/*"
              file={video}
              onChange={setVideo}
            />
          </div>
        </div>

        <div className="fm-action-bar">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="fm-action-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCompanyUpdate}
            disabled={loading}
            className="fm-action-primary"
          >
            {loading ? "Saving..." : "Save Company Info"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
