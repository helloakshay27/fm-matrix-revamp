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
import { Plus, X, Upload, Building2, Crown, Megaphone, Bell } from "lucide-react";
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

interface EmployeeOfTheMonth {
  userId: string;
  userName: string;
  role: string;
  month: string;
  points: string[];
  profileImage?: string;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  dbId?: number;
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

const AchievementPoint = ({
  point,
  index,
  onUpdate,
  onRemove,
  showRemove,
}: {
  point: string;
  index: number;
  onUpdate: (val: string) => void;
  onRemove: () => void;
  showRemove: boolean;
}) => {
  const [localVal, setLocalVal] = useState(point);

  useEffect(() => {
    setLocalVal(point);
  }, [point]);

  return (
    <div className="flex gap-2">
      <Input
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={() => onUpdate(localVal)}
        placeholder={`Achievement ${index + 1}`}
        className="border-gray-200 focus:border-red-300 focus:ring-red-100"
      />
      {showRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 px-2"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

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

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: "1", title: "Welcome News", description: "", isActive: true },
  ]);

  const [ceoInfo, setCeoInfo] = useState<CEOInfo>({
    name: "",
    designation: "CEO",
    description: "",
  });

  const [employeeOfTheMonth, setEmployeeOfTheMonth] =
    useState<EmployeeOfTheMonth>({
      userId: "",
      userName: "",
      role: "",
      month: "",
      points: [""],
    });

  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [users, setUsers] = useState<
    {
      id: string;
      full_name: string;
      role_name?: string;
      profile_image?: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = React.useMemo(() => {
    if (!searchTerm) return users.slice(0, 50);
    return users
      .filter((u) => u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 50);
  }, [users, searchTerm]);

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

            if (config.employee_of_the_month) {
              setEmployeeOfTheMonth({
                userId: config.employee_of_the_month.userId || "",
                userName: config.employee_of_the_month.userName || "",
                role: config.employee_of_the_month.role || "",
                month: config.employee_of_the_month.month || "",
                points: config.employee_of_the_month.points || [""],
                profileImage: config.employee_of_the_month.profileImage || "",
              });
            }

            // Store the full config to preserve other fields during update
            currentConfigRef.current = config;
          }
        }

        // Fetch Announcements from extra_fields
        try {
          const annEndpoint = `${protocol}${baseUrl}/extra_fields/announcements?resource_id=${companyId}&resource_type=CompanySetup`;
          let fetchedAnns = [];
          
          try {
            const annRes = await axios.get(annEndpoint, { headers: { Authorization: `Bearer ${token}` } });
            if (annRes.data?.data && Array.isArray(annRes.data.data)) {
              fetchedAnns = annRes.data.data;
            } else if (Array.isArray(annRes.data)) {
              fetchedAnns = annRes.data;
            }
          } catch (e) {
            console.error("Primary announcement fetch failed in setup", e);
          }

          if (fetchedAnns.length === 0) {
            try {
              const fallbackEndpoint = `${protocol}${baseUrl}/extra_fields?resource_id=${companyId}&resource_type=CompanySetup&group_name=announcement`;
              const fallbackRes = await axios.get(fallbackEndpoint, { headers: { Authorization: `Bearer ${token}` } });
              
              if (Array.isArray(fallbackRes.data)) {
                 fetchedAnns = fallbackRes.data;
              } else if (Array.isArray(fallbackRes.data?.data)) {
                 fetchedAnns = fallbackRes.data.data;
              } else if (Array.isArray(fallbackRes.data?.announcement)) {
                 fetchedAnns = fallbackRes.data.announcement;
              }
            } catch (fallbackError) {
              console.error("Fallback announcement fetch failed in setup", fallbackError);
            }
          }

          if (fetchedAnns.length > 0) {
            setAnnouncements(
              fetchedAnns.map((a: { id?: number; extra_field_id?: number; field_name?: string; field_value?: string }) => ({
                id: String(a.id || a.extra_field_id),
                title: a.field_name || "",
                description: a.field_value || "",
                isActive: true, 
                dbId: a.id || a.extra_field_id
              }))
            );
          }
        } catch (annErr) {
          console.error("Failed to fetch announcements:", annErr);
        }

        // Fetch Users for dropdown
        const usersResponse = await axios.get(
          `${protocol}${baseUrl}/pms/users/get_escalate_to_users.json?per_page=1000`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (usersResponse.data && usersResponse.data.users) {
          setUsers(usersResponse.data.users);
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
  const [eomLoading, setEomLoading] = useState(false);

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
        // Preserve existing EOM data accurately from current config to prevent wiping it out
        employee_of_the_month: existingConfig.employee_of_the_month || {
          ...employeeOfTheMonth,
          photo_relation: "EmployeePhoto",
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

      // Cache changes locally for immediate reflection in Hub
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
  const handleEOMUpdate = async () => {
    if (!employeeOfTheMonth.userId || !employeeOfTheMonth.month) {
      toast.error("Please select an employee and a month");
      return;
    }
    setEomLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      // GET existing config to preserve other fields
      const existingConfig = currentConfigRef.current || {};

      // Build org payload — only updates employee_of_the_month inside other_config
      const formData = new FormData();
      const otherConfig = {
        ...existingConfig,
        welcome: transformParagraphs(welcomeParagraphs),
        vision: transformParagraphs(visionParagraphs),
        mission: transformParagraphs(missionParagraphs),
        ceo_info: {
          ...existingConfig.ceo_info,
          name: ceoInfo.name,
          designation: ceoInfo.designation,
          description: ceoInfo.description,
          photo_relation: "CEOPhoto",
          video_relation: "CEOVideo",
        },
        employee_of_the_month: {
          userId: employeeOfTheMonth.userId,
          userName: employeeOfTheMonth.userName,
          role: employeeOfTheMonth.role,
          month: employeeOfTheMonth.month,
          points: employeeOfTheMonth.points,
          profileImage: employeeOfTheMonth.profileImage,
        },
      };

      formData.append(
        "organization[other_config]",
        JSON.stringify(otherConfig)
      );

      await axios.put(
        `${protocol}${baseUrl}/organizations/${companyId}.json`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Store updated config for future use
      currentConfigRef.current = otherConfig;

      // Cache in localStorage immediately so CompanyHub reads the latest data
      localStorage.setItem(
        "company_hub_eom",
        JSON.stringify({
          name: employeeOfTheMonth.userName,
          role: employeeOfTheMonth.role,
          month: employeeOfTheMonth.month,
          points: employeeOfTheMonth.points,
          userId: employeeOfTheMonth.userId,
          profileImage: employeeOfTheMonth.profileImage,
        })
      );

      toast.success("Employee of the Month updated successfully");
      setEomLoading(false); // Reset loading sooner

      // Sync extra_fields record (non-blocking - don't await this for UI)
      (async () => {
        try {
          const formattedMonth = convertMonthToAPIFormat(
            employeeOfTheMonth.month
          );
          const selectedUser = users.find(
            (u) => String(u.id) === employeeOfTheMonth.userId
          );

          const extraFieldPayload = {
            extra_field: {
              resource_id: parseInt(String(companyId), 10),
              resource_type: "Organization",
              field_name: formattedMonth,
              group_name: "employee_of_the_month",
              field_description: selectedUser?.profile_image || "",
            },
          };
          const xHeaders = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };

          let existingId: number | null = null;
          try {
            const historyRes = await axios.get(
              `${protocol}${baseUrl}/extra_fields/employee_of_the_month`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const historyData = historyRes.data?.employee_of_the_month;
            if (Array.isArray(historyData) && historyData.length > 0) {
              const newest = historyData.reduce((prev: { extra_field_id?: number }, curr: { extra_field_id?: number }) =>
                (curr.extra_field_id ?? 0) > (prev.extra_field_id ?? 0)
                  ? curr
                  : prev
              );
              if (newest?.extra_field_id) existingId = newest.extra_field_id;
            }
          } catch {
            /* ignore */
          }

          if (existingId) {
            await axios.put(
              `${protocol}${baseUrl}/extra_fields/${existingId}`,
              extraFieldPayload,
              { headers: xHeaders }
            );
          } else {
            await axios.post(
              `${protocol}${baseUrl}/extra_fields`,
              extraFieldPayload,
              { headers: xHeaders }
            );
          }
          // console.log("✅ Extra fields sync completed in background");
        } catch (efError) {
          console.error("Extra fields sync failed (non-critical):", efError);
        }
      })();
    } catch (error) {
      console.error("EOM update failed:", error);
      toast.error("Failed to update Employee of the Month");
      setEomLoading(false);
    }
  };

  const [announcementLoading, setAnnouncementLoading] = useState(false);

  const handleAnnouncementsUpdate = async () => {
    setAnnouncementLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      for (let i = 0; i < announcements.length; i++) {
        const ann = announcements[i];
        if (!ann.title.trim() && !ann.description.trim()) continue;

        const payload = {
          extra_field: {
            resource_id: parseInt(String(companyId), 10),
            resource_type: "CompanySetup",
            field_name: ann.title,
            field_value: ann.description,
            group_name: "announcement",
          },
        };

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const dbId = ann.dbId;

        if (dbId) {
          // Update existing
          await axios.put(
            `${protocol}${baseUrl}/extra_fields/${dbId}`,
            payload,
            { headers }
          );
        } else {
          // Create new
          const response = await axios.post(
            `${protocol}${baseUrl}/extra_fields`,
            payload,
            { headers }
          );
          
          if (response.data?.success && response.data?.data?.id) {
            setAnnouncements((prev) => {
              const updated = [...prev];
              updated[i] = {
                ...updated[i],
                dbId: response.data.data.id,
                id: String(response.data.data.id),
              };
              return updated;
            });
          }
        }
      }

      toast.success("Announcements updated successfully");
    } catch (error) {
      console.error("Failed to save announcements:", error);
      toast.error("Failed to save some announcements");
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (annId: string, dbId?: number) => {
    if (dbId) {
      if (!window.confirm("Are you sure you want to delete this announcement?")) return;

      try {
        const token = localStorage.getItem("token");
        const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
        const protocol = baseUrl.startsWith("http") ? "" : "https://";

        await axios.delete(`${protocol}${baseUrl}/extra_fields/${dbId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Announcement deleted successfully");
      } catch (error) {
        console.error("Failed to delete announcement:", error);
        toast.error("Failed to delete announcement from server");
        return; // Don't remove from UI if server delete fails
      }
    }

    setAnnouncements((prev) => prev.filter((a) => a.id !== annId));
  };

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


        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-[#C72030]" />
              <h2 className="text-2xl font-bold text-gray-800">
                Employee of the Month Setup
              </h2>
            </div>
            <div className="flex gap-3">
              {/* Button moved to bottom of card */}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Select Employee
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between border-gray-300 font-normal hover:bg-white text-gray-700 text-sm h-11 px-4 rounded-md shadow-sm transition-all",
                        open && "border-blue-500 ring-1 ring-blue-500"
                      )}
                    >
                      <span className="truncate">
                        {employeeOfTheMonth.userId
                          ? users.find(
                              (u) => String(u.id) === employeeOfTheMonth.userId
                            )?.full_name
                          : "Select Employee"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0 bg-[#f8f9fa] border border-gray-200 shadow-xl rounded-md overflow-hidden"
                    align="start"
                    side="bottom"
                    sideOffset={5}
                    avoidCollisions={true}
                  >
                    <Command className="w-full bg-transparent">
                      <div className="p-3 bg-white border-b border-gray-100">
                        <div className="relative flex items-center border-2 border-blue-400 rounded-xl px-3 py-1 bg-white shadow-inner">
                          <Search className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                          <CommandInput
                            placeholder="Type to search..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            className="h-9 border-none focus:ring-0 bg-transparent text-sm w-full placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                      <CommandList className="max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                        <CommandEmpty className="py-4 text-center text-gray-500 text-sm">
                          No employee found.
                        </CommandEmpty>
                        <CommandGroup className="p-1">
                          {filteredUsers.map((u) => (
                            <CommandItem
                              key={u.id}
                              value={u.full_name}
                              onSelect={() => {
                                setEmployeeOfTheMonth({
                                  ...employeeOfTheMonth,
                                  userId: String(u.id),
                                  userName: u.full_name,
                                  role: u.role_name || "Employee",
                                  profileImage: u.profile_image || "",
                                });
                                setOpen(false);
                                setSearchTerm("");
                              }}
                              className="flex items-center px-3 py-2.5 cursor-pointer text-gray-700 hover:bg-blue-50 rounded-md transition-colors text-sm"
                            >
                              <Check
                                className={cn(
                                  "mr-3 h-4 w-4 text-blue-600",
                                  employeeOfTheMonth.userId === String(u.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span className="flex-1">{u.full_name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        {users.length > 50 && !searchTerm && (
                          <div className="p-2 text-center text-xs text-gray-400 italic">
                            Showing first 50 users. Type to search more...
                          </div>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {employeeOfTheMonth.userName && (
                  <p className="text-xs text-gray-500">
                    Selected:{" "}
                    <span className="font-semibold text-[#C72030]">
                      {employeeOfTheMonth.userName}
                    </span>{" "}
                    — {employeeOfTheMonth.role}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Select Month
                </Label>
                <Select
                  value={employeeOfTheMonth.month}
                  onValueChange={(value) =>
                    setEmployeeOfTheMonth({
                      ...employeeOfTheMonth,
                      month: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full border-gray-200 focus:ring-red-100 focus:border-red-300">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m) => (
                      <SelectItem
                        key={m}
                        value={`${m} ${new Date().getFullYear()}`}
                      >
                        {m} {new Date().getFullYear()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 block mb-3">
                Achievement Points
              </Label>
              <div className="space-y-3">
                {employeeOfTheMonth.points.map((point, idx) => (
                  <AchievementPoint
                    key={idx}
                    point={point}
                    index={idx}
                    showRemove={employeeOfTheMonth.points.length > 1}
                    onUpdate={(newVal) => {
                      const newPoints = [...employeeOfTheMonth.points];
                      newPoints[idx] = newVal;
                      setEmployeeOfTheMonth({
                        ...employeeOfTheMonth,
                        points: newPoints,
                      });
                    }}
                    onRemove={() => {
                      const newPoints = employeeOfTheMonth.points.filter(
                        (_, i) => i !== idx
                      );
                      setEmployeeOfTheMonth({
                        ...employeeOfTheMonth,
                        points: newPoints,
                      });
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEmployeeOfTheMonth({
                      ...employeeOfTheMonth,
                      points: [...employeeOfTheMonth.points, ""],
                    })
                  }
                  className="border-dashed py-0 h-8 text-xs text-gray-500"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Achievement Point
                </Button>
              </div>
            </div>

            {/* Section 2 Buttons */}
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEOMUpdate}
                disabled={eomLoading}
                className="bg-[#C72030] text-white hover:bg-[#a61a28] font-semibold px-8"
              >
                {eomLoading ? "Saving..." : "Save Employee of Month"}
              </Button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 — Announcements Setup
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Megaphone className="w-6 h-6 text-[#C72030]" />
              <h2 className="text-2xl font-bold text-gray-800">
                Announcements Setup
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {announcements.map((ann, idx) => (
                <Card key={ann.id} className="border border-red-50 bg-[#fff5f5]/30">
                  <CardContent className="pt-6 relative">
                    <div className="absolute top-2 right-2 flex gap-2">
                       <Checkbox
                          id={`active-${ann.id}`}
                          checked={ann.isActive}
                          onCheckedChange={(checked) => {
                            const newAnns = [...announcements];
                            newAnns[idx].isActive = checked as boolean;
                            setAnnouncements(newAnns);
                          }}
                          className="border-gray-300 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                        />
                        <Label htmlFor={`active-${ann.id}`} className="text-xs text-gray-500 cursor-pointer">Active</Label>
                      
                      {announcements.length > 1 && (
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id, ann.dbId)}
                          className="text-gray-400 hover:text-red-500 ml-4"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="relative">
                        <span className="absolute -top-2.5 left-4 bg-white px-2 text-xs text-gray-400 z-10">
                          Title
                        </span>
                        <Input
                          value={ann.title}
                          onChange={(e) => {
                            const newAnns = [...announcements];
                            newAnns[idx].title = e.target.value;
                            setAnnouncements(newAnns);
                          }}
                          placeholder="e.g. New Joiner, System Update..."
                          className="border-gray-200 focus:border-red-300 focus:ring-red-100"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute -top-2.5 left-4 bg-white px-2 text-xs text-gray-400 z-10">
                        Content / Description
                      </span>
                      <Textarea
                        value={ann.description}
                        onChange={(e) => {
                          const newAnns = [...announcements];
                          newAnns[idx].description = e.target.value;
                          setAnnouncements(newAnns);
                        }}
                        placeholder="Enter announcement details..."
                        className="min-h-[100px] border-gray-200 focus:border-red-300 focus:ring-red-100 resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={() => setAnnouncements([...announcements, { id: Math.random().toString(36).substr(2, 9), title: "", description: "", isActive: true }])}
                className="border-dashed border-red-200 bg-red-50/50 text-[#C72030] hover:bg-red-100/50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Announcement
              </Button>
            </div>

            {/* Section 3 Buttons */}
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-[#C72030] text-[#C72030] hover:bg-red-50 px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAnnouncementsUpdate}
                disabled={announcementLoading}
                className="bg-[#C72030] text-white hover:bg-[#a61a28] font-semibold px-8"
              >
                {announcementLoading ? "Saving..." : "Save Announcements"}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanySetup;
