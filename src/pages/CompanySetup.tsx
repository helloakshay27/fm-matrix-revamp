import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Upload, Building2, Crown, Megaphone, Bell, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUser } from "@/utils/auth";
import { Trash2, Eye, Edit } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";

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

const ParagraphCard = ({ 
  p, 
  index, 
  setter, 
  title, 
  placeholder 
}: { 
  p: Paragraph; 
  index: number; 
  setter: React.Dispatch<React.SetStateAction<Paragraph[]>>; 
  title: string; 
  placeholder: string;
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
    <Card key={p.id} className="border border-blue-100 bg-[#f8fbff]">
      <CardContent className="pt-6 relative">
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => removeParagraph(p.id, setter)}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative mb-4">
          <span className="absolute -top-3 left-4 bg-white px-2 text-xs text-gray-400 z-10">
            Paragraph {index + 1}
          </span>
          <Textarea
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="min-h-[100px] border-gray-200 focus:border-red-300 focus:ring-red-100 resize-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`bold-${title}-${p.id}`}
            checked={p.isBold}
            onCheckedChange={(checked) =>
              updateParagraph(p.id, "isBold", checked, setter)
            }
            className="border-gray-300 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
          />
          <Label
            htmlFor={`bold-${title}-${p.id}`}
            className="text-sm text-gray-600 font-normal cursor-pointer"
          >
            Show in bold
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

// AchievementPoint removed

const DescriptionSection = ({
  title,
  paragraphs,
  setter,
  addLabel,
  placeholder,
}: {
  title: string;
  paragraphs: Paragraph[];
  setter: React.Dispatch<React.SetStateAction<Paragraph[]>>;
  addLabel: string;
  placeholder: string;
}) => (
  <div className="mb-8">
    <h3 className="text-[#C72030] text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {paragraphs.map((p, index) => (
        <ParagraphCard
          key={p.id}
          p={p}
          index={index}
          setter={setter}
          title={title}
          placeholder={placeholder}
        />
      ))}
    </div>
    <Button
      variant="outline"
      onClick={() => addParagraph(setter)}
      className="mt-4 border-dashed border-[#ecdcdc] bg-[#fbf4f4] text-[#C72030] hover:bg-[#f6eaea] hover:text-[#C72030]"
    >
      <Plus className="w-4 h-4 mr-2" />
      {addLabel}
    </Button>
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
                text: p.text || "",
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
                description: config.ceo_info.description || "",
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
    <div className="p-4 sm:p-6 lg:p-8 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ═══════════════════════════════════════════════════════════
            SECTION 1 — Company Info
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[#C72030]" />
              <h1 className="text-2xl font-bold text-gray-800">
                Company Setup
              </h1>
            </div>
            <div className="flex gap-3">
              {/* Individual save buttons at bottom of card */}
            </div>
          </div>

          <div className="space-y-8">
            <DescriptionSection
              title="Welcome Description"
              paragraphs={welcomeParagraphs}
              setter={setWelcomeParagraphs}
              addLabel="Add Description"
              placeholder="Enter welcome description"
            />
            <DescriptionSection
              title="Vision"
              paragraphs={visionParagraphs}
              setter={setVisionParagraphs}
              addLabel="Add Vision"
              placeholder="Enter vision description"
            />
            <DescriptionSection
              title="Mission"
              paragraphs={missionParagraphs}
              setter={setMissionParagraphs}
              addLabel="Add Mission"
              placeholder="Enter mission description"
            />

            {/* CEO Info */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-[#C72030] text-lg font-semibold mb-4">
                CEO Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative">
                  <span className="absolute -top-2.5 left-4 bg-gray-50 px-2 text-xs text-gray-400 z-10">
                    Name
                  </span>
                  <Input
                    value={ceoInfo.name}
                    onChange={(e) =>
                      setCeoInfo({ ...ceoInfo, name: e.target.value })
                    }
                    placeholder="Enter CEO name"
                    className="border-gray-200 focus:border-red-300 focus:ring-red-100"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-2.5 left-4 bg-gray-50 px-2 text-xs text-gray-400 z-10">
                    Designation
                  </span>
                  <Input
                    value={ceoInfo.designation}
                    onChange={(e) =>
                      setCeoInfo({ ...ceoInfo, designation: e.target.value })
                    }
                    placeholder="CEO"
                    className="border-gray-200 focus:border-red-300 focus:ring-red-100"
                  />
                </div>
              </div>
              <div className="relative mb-6">
                <span className="absolute -top-2.5 left-4 bg-gray-50 px-2 text-xs text-gray-400 z-10">
                  Description
                </span>
                <Textarea
                  value={ceoInfo.description}
                  onChange={(e) =>
                    setCeoInfo({ ...ceoInfo, description: e.target.value })
                  }
                  placeholder="CEO description"
                  className="min-h-[120px] border-gray-200 focus:border-red-300 focus:ring-red-100 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-semibold mb-2">
                    Photo
                  </Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="photo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    />
                    <Button
                      asChild
                      className="bg-[#C72030] text-white hover:bg-[#a61a28]"
                    >
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                    <span className="text-sm text-gray-500">
                      {photo ? photo.name : "No file chosen"}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-semibold mb-2">
                    Video
                  </Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="video-upload"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => setVideo(e.target.files?.[0] || null)}
                    />
                    <Button
                      asChild
                      className="bg-[#C72030] text-white hover:bg-[#a61a28]"
                    >
                      <label htmlFor="video-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                    <span className="text-sm text-gray-500">
                      {video ? video.name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1 Buttons */}
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCompanyUpdate}
                disabled={loading}
                className="bg-[#C72030] text-white hover:bg-[#a61a28] font-semibold px-8"
              >
                {loading ? "Saving..." : "Save Company Info"}
              </Button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default CompanySetup;
