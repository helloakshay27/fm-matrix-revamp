import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  CheckSquare,
  ListTodo,
  PenTool,
  Zap,
  Compass,
  Bot,
  Plus,
  ChevronRight,
  Sun,
  Activity,
  TrendingUp,
  AlertCircle,
  Award,
  BookOpen,
  Heart,
  Flame,
  Trophy,
  Clock,
  MoreVertical,
  MessageSquare,
  Volume2,
  VolumeX,
  X,
  ThumbsUp,
  Sparkles,
  Crown,
  Sparkle,
  Megaphone,
  Bell,
  Calendar,
  MapPin,
  Share2,
  Send,
  Video,
  Image,
  Search,
  FileText,
  MousePointer2,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import businessPlanIcon from "@/assets/business_plan.png";
import ourGroupIcon from "@/assets/our_group.png";
import productsIcon from "@/assets/products.png";
import documentDriveIcon from "@/assets/document_drive.png";
import hrPoliciesIcon from "@/assets/hr_policies.png";
import directoryIcon from "@/assets/directory.png";
import employeeFaqIcon from "@/assets/employee_faq.png";
import ceoImage from "@/assets/ceo/ceoimage.jpeg";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Attachment {
  id: number;
  document_content_type: string;
  url: string;
}

interface QuickLink {
  name: string;
  icon?: any;
  image: string;
  link?: string;
}

interface Comment {
  id: number;
  body: string;
  commentable_id: number;
  commentable_type: string;
  commentor_id: number;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  commentor_full_name: string;
  commentor_profile_image: string | null;
  commentor_site_name: string;
  attachments: any[];
}

interface Post {
  id: number;
  title: string | null;
  body: string;
  active: boolean;
  blocked: boolean;
  resource_id: number;
  resource_type: string;
  created_at: string;
  updated_at: string;
  creator_full_name: string;
  creator_site_name: string;
  creator_image_url: string | null;
  resource_name: string;
  total_likes: number;
  likes_with_emoji: Record<string, number>;
  isliked: boolean;
  attachments: Attachment[];
  comments: Comment[];
  poll_options?: any[];
  type?: "post" | "event" | "notice" | "document";
}

interface CompanyData {
  id: number;
  name: string;
  subdomain?: string;
  logo_url?: string | null;
  other_config?: {
    vision?: { description?: Record<string, { bold: string; text: string }> };
    mission?: { description?: Record<string, { bold: string; text: string }> };
    welcome?: { description?: Record<string, { bold: string; text: string }> };
    ceo_info?: {
      name: string;
      designation: string;
      description: string;
      photo_relation?: string;
      video_relation?: string;
    };
    employee_of_the_month?: {
      userId: string;
      userName: string;
      role: string;
      month: string;
      points: string[];
      profileImage?: string;
    };
  };
  ceo_photo?: { document_url: string };
  ceo_video?: { document_url: string };
  employee_photo?: { document_url: string };
}

interface UpcomingEvent {
  id: number;
  title?: string;
  event_name?: string;
  image_url: string;
  event_date: string;
  location: string;
}

interface CompanyHubNewProps {
  userName?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const hasContent = (obj: any) => {
  if (!obj) return false;
  const desc = obj.description;
  if (!desc) return false;
  return Object.values(desc).some(
    (p: any) => p && p.text && p.text.trim().length > 0
  );
};

const extractText = (obj: unknown): string => {
  if (!obj || typeof obj !== "object") return "";
  const rec = obj as Record<string, any>;
  if (rec.description) {
    return Object.values(rec.description)
      .map((v: any) => v?.text || "")
      .filter(Boolean)
      .join(" ");
  }
  return "";
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

// ─── Glass Card ───────────────────────────────────────────────────────────────

const GlassCard = ({
  children,
  className = "",
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) => (
  <div
    style={style}
    onClick={onClick}
    className={`bg-[rgba(255,255,255,1)] border border-[rgba(211,209,199,1)] rounded-2xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.05)] ${className}`}
  >
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CompanyHubNew: React.FC<CompanyHubNewProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [taskStats, setTaskStats] = useState({
    task_count: 0,
    todo_count: 0,
    in_progress_tasks: 0,
    overdue_tasks: 0,
    on_hold_tasks: 0,
    completed_tasks: 0,
    open_tasks: 0,
  });
  const [lifeCompassStats, setLifeCompassStats] = useState({
    journaling_consistency: 0,
    life_balance_score: 0,
    current_streak: 0,
    leaderboard_rank: 0,
  });
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "business" | "admin"
  >("dashboard");
  const [missionSlide, setMissionSlide] = useState(0);
  const [activeTimeView, setActiveTimeView] = useState<
    "hourly" | "weekly" | "monthly"
  >("hourly");
  const [activeNavMenu, setActiveNavMenu] = useState<string | null>(null);

  const navMenuOptions: Record<
    string,
    { title: string; description: string; icon: any }[]
  > = {
    Create: [
      {
        title: "Create Note",
        description: "Start a new note",
        icon: <FileText className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />,
      },
      {
        title: "Create Form",
        description: "Build a new form",
        icon: <PenTool className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />,
      },
      {
        title: "Create Booking",
        description: "Make your booking",
        icon: <Calendar className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />,
      },
      {
        title: "Create MOM",
        description: "Create MOM",
        icon: <Clock className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />,
      },
      {
        title: "Create Ticket",
        description: "Raise a Ticket",
        icon: (
          <AlertCircle className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />
        ),
      },
    ],
  };

  // Community State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    type: "post" | "comment" | null;
    id: number | string | null;
  }>({ open: false, type: null, id: null });

  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  // Post Creation
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"post" | "poll" | null>(null);
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Matrix Modal State
  const [selectedMatrixQuadrant, setSelectedMatrixQuadrant] = useState<{
    id: string;
    title: string;
    description: string;
    tasks: { id: number; title: string; status: string; date: string }[];
    color: string;
  } | null>(null);

  const user = React.useMemo(() => getUser(), []);
  const displayName =
    userName || (user ? `${user.firstname} ${user.lastname}`.trim() : "Guest");
  const userId = user?.id;
  const companyId = String(user?.lock_role?.company_id || "116");

  // Fetch Logic
  const fetchPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";
      const response = await axios.get(
        `${protocol}${baseUrl}/communities/3/posts.json`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("📡 Community Posts API Response:", response.data);
      const rawPosts =
        response.data.posts ||
        response.data.data ||
        (Array.isArray(response.data) ? response.data : []);
      const postsData = rawPosts.map((post: any) => ({
        ...post,
        type: "post" as const,
      }));
      setPosts(postsData);
    } catch (e) {
      console.error("❌ Posts fetch failed:", e);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl =
          localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
        const protocol = baseUrl.startsWith("http") ? "" : "https://";
        const effectiveCompanyId = localStorage.getItem("org_id") || companyId;

        // 1. Company Data
        const orgRes = await axios.get(
          `${protocol}${baseUrl}/organizations/${effectiveCompanyId}.json?cb=${Date.now()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data =
          orgRes.data.organization || orgRes.data.data || orgRes.data;
        if (data && typeof data.other_config === "string") {
          try {
            data.other_config = JSON.parse(data.other_config);
          } catch (e) { }
        }
        setCompanyData(data);

        // 2. Announcements & Fallback
        try {
          const annEndpoint = `${protocol}${baseUrl}/extra_fields/announcements?resource_id=${effectiveCompanyId}&resource_type=CompanySetup`;
          let fetchedAnns = [];
          const annRes = await axios.get(annEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchedAnns = Array.isArray(annRes.data?.data)
            ? annRes.data.data
            : Array.isArray(annRes.data)
              ? annRes.data
              : [];

          if (fetchedAnns.length === 0) {
            const fallbackRes = await axios.get(
              `${protocol}${baseUrl}/extra_fields?resource_id=${effectiveCompanyId}&resource_type=CompanySetup&group_name=announcement`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchedAnns = Array.isArray(fallbackRes.data)
              ? fallbackRes.data
              : Array.isArray(fallbackRes.data?.data)
                ? fallbackRes.data.data
                : [];
          }

          const processed = fetchedAnns
            .map((a: any) => {
              let desc = a.field_value || "";
              let active = true;
              if (desc.trim().startsWith("{")) {
                try {
                  const p = JSON.parse(desc);
                  desc = p.description || p.content || desc;
                  active = p.isActive !== undefined ? p.isActive : true;
                } catch (e) { }
              }
              return { ...a, displayDescription: desc, isActive: active };
            })
            .filter((a: any) => a.isActive);
          setAnnouncements(processed);
        } catch (e) {
          console.error("Anns error", e);
        }

        // 3. Employee of Month
        try {
          const eomRes = await axios.get(
            `${protocol}${baseUrl}/extra_fields/employee_of_the_month`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const rawEom = eomRes.data?.employee_of_the_month;
          if (rawEom) {
            const newest = Array.isArray(rawEom)
              ? [...rawEom].sort(
                (a, b) => (b.extra_field_id || 0) - (a.extra_field_id || 0)
              )[0]
              : rawEom;
            if (newest?.extra_field_id) {
              const detailRes = await axios.get(
                `${protocol}${baseUrl}/extra_fields/employee_of_the_month?id=${newest.extra_field_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const detail = detailRes.data?.employee_of_the_month;
              const rawRecRes = await axios.get(
                `${protocol}${baseUrl}/extra_fields/${newest.extra_field_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              let parsedRec = {};
              try {
                parsedRec = JSON.parse(
                  rawRecRes.data?.data?.field_value || "{}"
                );
              } catch (e) { }
              setCurrentEmployee({ ...newest, ...detail, ...parsedRec });
            }
          }
        } catch (e) {
          console.error("EOM error", e);
        }

        // 4. Stats
        const statsRes = await axios.get(
          `${protocol}${baseUrl}/task_managements/task_todo_counts.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTaskStats(statsRes.data);

        // 5. Life Compass
        try {
          const email = user?.email || "dhananjay.bhoyar@lockated.com";
          const lifeRes = await axios.get(
            `https://life-api.lockated.com/user_journals/metrics_by_email?email=${encodeURIComponent(email)}`
          );
          if (lifeRes.data) {
            setLifeCompassStats(lifeRes.data);
          }
        } catch (e) {
          console.error("Life compass error", e);
        }

        fetchPosts();
      } catch (e) {
        console.error("Global fetch failed", e);
      }
    };
    fetchData();
  }, [companyId, fetchPosts, user?.email]);

  const confirmDelete = async () => {
    if (!deleteConfirmation.id || !deleteConfirmation.type) return;
    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";
      await axios.delete(
        `${protocol}${baseUrl}/${deleteConfirmation.type === "post" ? "posts" : "comments"}/${deleteConfirmation.id}.json`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Deleted successfully");
      fetchPosts();
    } catch (_) {
      toast.error("Delete failed");
    } finally {
      setDeleteConfirmation({ open: false, type: null, id: null });
    }
  };

  const handlePublish = async () => {
    if (!postText.trim() && selectedFiles.length === 0 && createMode !== "poll")
      return;

    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("https") ? "" : "https://";

      const formData = new FormData();
      formData.append("body", postText);

      formData.append("resource_id", "3");
      formData.append("resource_type", "Community");

      if (createMode === "poll") {
        const validOptions = pollOptions.filter((opt) => opt.trim() !== "");
        validOptions.forEach((option, index) => {
          formData.append(`poll_options_attributes[${index}][name]`, option);
        });
      }

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("attachments[]", file);
        });
      }

      const response = await axios.post(
        `${protocol}${baseUrl}/posts.json`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(
          createMode === "poll"
            ? "Poll created successfully!"
            : "Post created successfully!"
        );
        setPostText("");
        setSelectedFiles([]);
        setPollOptions(["", ""]);
        setCreateMode(null);
        setIsCreatePostModalOpen(false);
        fetchPosts(); // Refresh the posts list
      }
    } catch (error: any) {
      console.error("Failed to publish:", error);
      toast.error(
        error.response?.data?.error || "Failed to publish. Please try again."
      );
    }
  };

  // Cached Missions/Visons
  const cachedMission = React.useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("company_hub_mission_data") || "null"
      );
    } catch {
      return null;
    }
  }, []);
  const cachedVision = React.useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("company_hub_vision_data") || "null"
      );
    } catch {
      return null;
    }
  }, []);
  const cachedWelcome = React.useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("company_hub_welcome_data") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  const isCacheFresh =
    Date.now() - Number(localStorage.getItem("company_hub_update_time") || 0) <
    3600000;

  const getPriorityData = (cached: any, api: any) => {
    if (isCacheFresh && hasContent(cached)) return cached;
    if (hasContent(api)) return api;
    if (hasContent(cached)) return cached;
    return null;
  };

  const missionText =
    extractText(
      getPriorityData(cachedMission, companyData?.other_config?.mission)
    ) ||
    "Our mission is to simplify and connect the entire real estate lifecycle through innovative technology.";
  const visionText =
    extractText(
      getPriorityData(cachedVision, companyData?.other_config?.vision)
    ) || "To build a connected and intelligent real estate world.";
  const welcomeText =
    extractText(
      getPriorityData(cachedWelcome, companyData?.other_config?.welcome)
    ) ||
    'Taking "Make in India\'s" PropTech products Global, by transforming every touch point of the real estate journey.';

  const statsList = [
    {
      label: "Total Tasks",
      value: taskStats.task_count,
      color: "#6366f1",
      bg: "#eef2ff",
    },
    {
      label: "To-Do",
      value: taskStats.todo_count,
      color: "#ef4444",
      bg: "#fef2f2",
    },
    {
      label: "Open",
      value: taskStats.open_tasks,
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      label: "In Progress",
      value: taskStats.in_progress_tasks,
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      label: "On Hold",
      value: taskStats.on_hold_tasks,
      color: "#8b5cf6",
      bg: "#f5f3ff",
    },
    {
      label: "Overdue",
      value: taskStats.overdue_tasks,
      color: "#f97316",
      bg: "#fff7ed",
    },
    {
      label: "Completed",
      value: taskStats.completed_tasks,
      color: "#10b981",
      bg: "#ecfdf5",
    },
  ];

  const quickLinks = [
    { name: "Business plan", image: businessPlanIcon },
    { name: "Our Group", image: ourGroupIcon },
    { name: "Products", image: productsIcon },
    {
      name: "Document Drive",
      image: documentDriveIcon,
      link: "/vas/documents",
    },
    { name: "HR Policies", image: hrPoliciesIcon, link: "/vas/documents" },
    { name: "Directory", image: directoryIcon },
    { name: "Employee FAQ", image: employeeFaqIcon },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 overflow-x-hidden">
      <div className="pb-10">
        {/* ── TOP NAV BAR ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 py-4 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-12 w-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900">
                LOCKATED
              </span>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              {[
                "Create",
                "Work",
                "Communicate",
                "Documents",
                "Operations",
                "Insight",
              ].map((item) => (
                <div
                  key={item}
                  onClick={() =>
                    setActiveNavMenu(activeNavMenu === item ? null : item)
                  }
                  className="flex items-center gap-1.5 cursor-pointer group"
                >
                  <span
                    className={`text-[13px] font-bold uppercase tracking-wider transition-colors ${activeNavMenu === item
                      ? "text-[#E67E5F]"
                      : "text-gray-600 group-hover:text-gray-900"
                      }`}
                  >
                    {item}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${activeNavMenu === item
                      ? "-rotate-90 text-[#E67E5F]"
                      : "rotate-90 text-gray-400"
                      }`}
                  />
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* --- NAV MENU DROPDOWN --- */}
        {activeNavMenu && navMenuOptions[activeNavMenu] && (
          <div className="absolute top-[72px] left-0 w-full bg-white border-b border-gray-200 shadow-md z-40 px-8 py-8 animate-in slide-in-from-top-2 fade-in duration-200">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
              {activeNavMenu}
            </h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {navMenuOptions[activeNavMenu].map((option, idx) => (
                <div
                  key={idx}
                  className="flex flex-shrink-0 items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all cursor-pointer bg-white min-w-[220px]"
                >
                  <div className="p-2 bg-orange-50 rounded-lg">
                    {option.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                      {option.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TOP NAV TABS ──────────────────────────────────────────────────── */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="flex gap-1 bg-[rgba(232,229,220,0.2)] border-[1.31px] border-[rgba(211,209,199,1)] rounded-full p-1 shadow-sm">
            {(
              [
                { key: "dashboard", label: "Dashboard" },
                { key: "business", label: "Business Compass" },
                { key: "admin", label: "Admin Compass" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-8 py-2.5 rounded-full text-[13px] font-black tracking-wider transition-all duration-300 ${activeTab === tab.key
                  ? "bg-white shadow-xl shadow-black/5 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-10">
          {/* ── HEADER ROW ──────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Sun className="w-6 h-6 text-yellow-500" strokeWidth={2.5} />
              <h1 className="text-2xl font-black text-[#1f1f1f] tracking-tight">
                {getGreeting()}, {displayName}.
              </h1>
            </div>
            <p className="max-w-[50%] text-right text-[14px] text-gray-400 italic font-medium leading-relaxed">
              "Success is not final, failure is not fatal: it is the courage to
              continue that counts."
            </p>
          </div>

          {/* ── MISSION / VISION / PURPOSE ROW ───────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[140px]">
            <GlassCard className="col-span-1 lg:col-span-6 h-full overflow-hidden !bg-white shadow-sm !border-none flex flex-col transition-all duration-500 group">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{
                  clickable: true,
                  renderBullet: (_, className) =>
                    `<span class="${className} custom-bullet"></span>`,
                }}
                className="h-full purpose-swiper w-full flex-1"
              >
                {[
                  { title: "PURPOSE", text: welcomeText },
                  { title: "VISION", text: visionText },
                  { title: "MISSION", text: missionText },
                ].map((slide, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="p-6 h-full flex flex-col relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black tracking-[0.2em] text-[#E67E5F] uppercase">
                          {slide.title}
                        </span>
                        <div className="text-[#E67E5F]">
                          <svg
                            width="20"
                            height="15"
                            viewBox="0 0 24 18"
                            fill="currentColor"
                            className="opacity-30 transition-opacity"
                          >
                            <path d="M0 18h8l3-8V0H0v10h4l-4 8zm13 0h8l3-8V0H13v10h4l-4 8z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-[13px] text-gray-700 leading-relaxed font-semibold max-w-[98%] mt-1">
                        {slide.text}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <style>{`
              .purpose-swiper .swiper-pagination { bottom: 12px !important; text-align: center; width: 100%; display: flex; justify-content: center; align-items: center; gap: 6px; }
              .purpose-swiper .custom-bullet { 
                width: 5px; height: 5px; background: #E5E7EB; opacity: 1; border-radius: 50%; display: inline-block; transition: all 0.3s;
              }
              .purpose-swiper .swiper-pagination-bullet-active { 
                width: 16px; border-radius: 10px; background: #5D56C1; 
              }
            `}</style>
            </GlassCard>

            <GlassCard className="col-span-1 lg:col-span-3 p-5 !bg-white shadow-sm !border-none h-full flex flex-col transition-all duration-500">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
                  Goals
                </h3>
                <button className="text-[10px] text-[#E67E5F] font-bold tracking-tight">
                  View All
                </button>
              </div>
              <ul className="space-y-2 flex-1 px-1">
                {[
                  "Increase revenue by 40% through strategic partnerships",
                  "Launch three innovative product lines by Q4",
                  "Achieve 95% customer satisfaction rate",
                ].map((goal, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[10px] font-bold text-gray-500 leading-tight"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="col-span-1 lg:col-span-3 p-5 !bg-white shadow-sm !border-none h-full flex flex-col transition-all duration-500">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
                  KRAs
                </h3>
                <button className="text-[10px] text-[#E67E5F] font-bold tracking-tight">
                  View All
                </button>
              </div>
              <ul className="space-y-2 flex-1 px-1">
                {[
                  "Maintain operational efficiency above 90% across all departments",
                  "Maintain operational efficiency above 80% across all departments",
                  "Maintain operational efficiency above 80% across all departments",
                ].map((kra, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[10px] font-bold text-gray-500 leading-tight"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                    {kra}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* ── MAIN DASHBOARD GRID (TPM, Today, Tasks, To-Do) ────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-2">
            {/* LEFT COLUMN: TASK PRIORITY MATRIX (Eisenhower) */}
            <div className="lg:col-span-6 flex flex-col">
              <GlassCard className="p-4 !bg-white w-full h-[335px] shadow-sm !border-none !rounded-[24px] flex flex-col transition-all duration-500 overflow-hidden">
                {!selectedMatrixQuadrant ? (
                  <div className="animate-fade-in-scale h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[14px] font-bold text-gray-700 tracking-tight">
                        Task Priority Matrix
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest">
                          Eisenhower
                        </p>
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full h-[240px]">
                      {[
                        {
                          q: "Q1",
                          label: "Important & Urgent",
                          val: taskStats.overdue_tasks || 8,
                          icon: <AlertCircle className="w-8 h-4" />,
                          color: "#E67E5F",
                        },
                        {
                          q: "Q2",
                          label: "Important not Urgent",
                          val: taskStats.open_tasks || 12,
                          icon: <FileText className="w-4 h-4" />,
                          focus: true,
                          color: "#5D56C1",
                        },
                        {
                          q: "Q3",
                          label: "Not Important Urgent",
                          val: taskStats.todo_count || 5,
                          icon: <Activity className="w-4 h-4" />,
                          color: "#F59E0B",
                        },
                        {
                          q: "Q4",
                          label: "Not Important not Urgent",
                          val: taskStats.on_hold_tasks || 3,
                          icon: <MousePointer2 className="w-4 h-4" />,
                          color: "#10B981",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          onClick={() =>
                            setSelectedMatrixQuadrant({
                              id: item.q,
                              title: item.label,
                              description:
                                item.q === "Q1"
                                  ? "High Priority: Do it now"
                                  : item.q === "Q2"
                                    ? "Strategic Focus: Schedule it"
                                    : item.q === "Q3"
                                      ? "Short-term Action: Delegate it"
                                      : "Lower Priority: Review/Delegate",
                              color: item.color,
                              focus: !!item.focus,
                              tasks:
                                item.q === "Q1"
                                  ? [
                                    "Finalize Quarterly Budget - 10:00 AM",
                                    "Client Crisis Call (Runwal) - 2:30 PM",
                                    "HR Compliance Audit - 4:00 PM",
                                    "Submit Monthly Tax Returns - 5:00 PM",
                                    "Server Maintenance Alert - Immediate",
                                    "Sign Vendor Contracts - Today",
                                    "Prepare AGM Slides - Today",
                                    "Resolve Customer Refund Case",
                                  ]
                                  : item.q === "Q2"
                                    ? [
                                      "Schedule quarterly strategic planning session",
                                      "Design team skill development program",
                                      "Research process improvement methodologies",
                                      "Build relationships with key stakeholders",
                                      "Create long-term product roadmap",
                                      "Develop succession planning strategy",
                                      "Review and update company policies",
                                      "Plan team building activities",
                                      "Conduct market research for new opportunities",
                                      "Document best practices and workflows",
                                      "Invest in professional development courses",
                                      "Design customer feedback collection system",
                                    ]
                                    : item.q === "Q3"
                                      ? [
                                        "Format Internal Memos",
                                        "Schedule Minor Logistics",
                                        "Respond to Routine Emails",
                                        "Update Office Inventory",
                                        "Coordinate Printing Samples",
                                      ]
                                      : [
                                        "Review Outdated HR Policies",
                                        "Archive 2024 Audit Logs",
                                        "Update Internal Wiki Fonts",
                                      ],
                            })
                          }
                          className={`rounded-[20px] p-6 border cursor-pointer transition-all flex flex-col items-center justify-center relative overflow-hidden ${item.focus
                            ? "bg-[radial-gradient(235.58%_575.5%_at_50%_50%,_#F6F4EE_0%,_#2C2C2A_100%)] border-[#D9D1BD]"
                            : "bg-[#FDFCFB] border-[#F2F0EA]"
                            }`}
                        >
                          {item.focus && (
                            <span className="absolute top-4 right-4 text-[9px] font-black bg-[#C6C0F3] text-[#5D56C1] px-2 py-0.5 rounded-full z-10 uppercase tracking-widest shadow-sm">
                              Focus
                            </span>
                          )}
                          <div className="flex flex-col items-center flex-1 justify-center py-2 text-center">
                            <span className="text-[12px] font-medium text-[rgba(106,114,130,1)] uppercase tracking-[0.1em] mb-1">
                              {item.q}
                            </span>
                            <p className="text-3xl font-black text-gray-800 tracking-tighter">
                              {item.val}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 tracking-tight mt-auto w-full justify-center opacity-60">
                            <span className="shrink-0">{item.icon}</span>
                            <span className="truncate">{item.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col origin-bottom-right animate-matrix-expand">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setSelectedMatrixQuadrant(null)}
                        className="flex items-center gap-2 text-[13px] font-bold text-gray-800 hover:text-[#E67E5F] transition-colors"
                      >
                        <ChevronRight
                          className="w-4 h-4 rotate-180"
                          strokeWidth={3}
                        />
                        Back
                      </button>
                      {selectedMatrixQuadrant.focus && (
                        <span className="bg-[#E6E0F1] text-[#5D56C1] px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest opacity-80 uppercase">
                          Focus
                        </span>
                      )}
                    </div>
                    <h2 className="text-[15px] font-black text-gray-900 tracking-tight mb-4 px-1">
                      {selectedMatrixQuadrant.id} -{" "}
                      {selectedMatrixQuadrant.title}
                    </h2>
                    <div className="flex-1 bg-[#FAF9F6] border border-[#E8E4D9] rounded-[20px] p-5 overflow-y-auto scrollbar-none shadow-inner">
                      <ul className="space-y-3">
                        {selectedMatrixQuadrant.tasks.map(
                          (task: any, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 group"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E5F]/40 mt-1.5 shrink-0 transition-transform" />
                              <p className="text-[12px] font-bold text-gray-600 leading-tight transition-colors">
                                {typeof task === "string" ? task : task.title}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* RIGHT COLUMN: TODAY + TASKS/TODO STACK */}
            <div
              className={`lg:col-span-6 flex flex-col gap-8 transition-all ${activeTimeView === "monthly" ? "!lg:col-span-12" : ""}`}
            >
              {/* Today */}
              <GlassCard
                className={`px-5 ${activeTimeView === "monthly" ? "py-4" : "py-3"} !bg-white/80 backdrop-blur-sm w-full shadow-sm !border-none !rounded-[24px] flex flex-col overflow-hidden transition-all ${activeTimeView === "monthly" ? "h-[335px]" : "h-[155px]"}`}
              >
                <div
                  className={`flex items-center justify-between ${activeTimeView === "monthly" ? "mb-2" : "mb-1"} px-1`}
                >
                  <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">
                    {activeTimeView === "monthly" ? "March 2026" : "Today"}
                  </h3>
                  <div className="flex gap-1 bg-[#F1F0EA]/50 h-7 backdrop-blur-md rounded-[12px] p-0.2 border border-white/20">
                    {["Hourly", "Weekly", "Monthly"].map((v) => (
                      <button
                        key={v}
                        onClick={() =>
                          setActiveTimeView(
                            v.toLowerCase() as "hourly" | "weekly" | "monthly"
                          )
                        }
                        className={`px-4 py-1.5 text-[11px] font-bold rounded-[8px] transition-all ${activeTimeView === v.toLowerCase()
                          ? "bg-white/80 shadow-sm text-gray-900 backdrop-blur-sm"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        {v} View
                      </button>
                    ))}
                  </div>
                </div>

                {activeTimeView === "monthly" ? (
                  <div className="flex gap-4 flex-1 mt-4 overflow-hidden">
                    {/* Calendar Grid */}
                    <div className="flex-1 rounded-xl p-1 h-full overflow-hidden">
                      <div className="grid grid-cols-7 gap-1 text-center mb-3">
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                          (d) => (
                            <span
                              key={d}
                              className="text-[9px] font-black text-gray-400 opacity-60 px-1"
                            >
                              {d}
                            </span>
                          )
                        )}
                      </div>
                      <div className="grid grid-cols-7 gap-y-1 gap-x-1.5 h-full auto-rows-max">
                        {/* Empty cells for February end */}
                        {[...Array(6)].map((_, i) => (
                          <div key={`empty-${i}`} className="h-6" />
                        ))}
                        {[...Array(31)].map((_, i) => {
                          const day = i + 1;
                          let statusClass =
                            "bg-[#FAF9F6]/80 border-[#E8E4D9] text-gray-500";
                          const textClass = "text-[10px] font-bold";
                          if (day === 12)
                            statusClass =
                              "bg-[#FDFCFB]/90 border-orange-200 text-orange-500 shadow-sm";
                          if (day === 19)
                            statusClass =
                              "bg-red-50/50 border-red-500 text-red-500 shadow-sm relative";
                          if (day === 21)
                            statusClass =
                              "bg-blue-50/50 border-blue-400 text-blue-500 shadow-sm";
                          if (day === 24 || day === 25)
                            statusClass =
                              "bg-red-50/30 border-red-200 text-red-400 shadow-sm";

                          return (
                            <div
                              key={day}
                              className={`aspect-square h-8 w-8 flex flex-col items-center justify-center rounded-[10px] border transition-all cursor-pointer ${statusClass}`}
                            >
                              <span className={textClass}>{day}</span>
                              {day === 19 && (
                                <span className="text-[6px] font-black mt-[-1px] uppercase opacity-80">
                                  Today
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Event Details Sidebar */}
                    <div className="w-[260px] bg-[#F9F7F2]/60 rounded-xl p-3 flex flex-col gap-2.5 border border-[#E8E4D9]/40 overflow-y-auto scrollbar-none">
                      {[
                        {
                          title:
                            "Schedule quarterly strategic planning session",
                          time: "21st March 2026 3 PM",
                          dot: "bg-blue-500",
                        },
                        {
                          title: "Client presentation prep for Runwal",
                          time: "24th March 2026 2 PM",
                          dot: "bg-red-400",
                        },
                        {
                          title:
                            "Runwal Client Meeting - Out of office for whole day",
                          time: "25th March 2026",
                          dot: "bg-red-400",
                        },
                      ].map((ev, i) => (
                        <div
                          key={i}
                          className="bg-white/90 border border-[#E8E4D9]/50 p-3 rounded-[12px] shadow-sm transition-all"
                        >
                          <div className="flex gap-2 mb-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${ev.dot}`}
                            />
                            <h4 className="text-[11px] font-black text-gray-800 leading-tight">
                              {ev.title}
                            </h4>
                          </div>
                          <p className="text-[9px] font-bold text-gray-400 italic pl-3.5 uppercase tracking-tight">
                            {ev.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-between items-start flex-1 mt-2">
                    {(activeTimeView === "hourly"
                      ? [
                        { t: "12 PM", tasks: 0 },
                        { t: "1 PM", tasks: 1 },
                        { t: "2 PM", tasks: 0 },
                        { t: "3 PM", tasks: 0 },
                        { t: "4 PM", tasks: 3, active: true },
                        { t: "5 PM", tasks: 0 },
                        { t: "6 PM", tasks: 1 },
                        { t: "7 PM", tasks: 0 },
                        { t: "8 PM", tasks: 0 },
                        { t: "9 PM", tasks: 0 },
                      ]
                      : [
                        { t: "Tues", v: "—" },
                        { t: "Wed", v: "1 task" },
                        { t: "Thurs", v: "3 tasks", active: true },
                        { t: "Fri", v: "—" },
                        { t: "Sat", v: "Weekly Off", off: true },
                        { t: "Sun", v: "Weekly Off", off: true },
                        { t: "Mon", v: "—" },
                        { t: "Tues", v: "1 task" },
                        { t: "Wed", v: "—" },
                        { t: "Thurs", v: "—" },
                      ]
                    ).map((item: any, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                      >
                        <p
                          className={`text-[10px] font-bold tracking-tight transition-colors ${item.active ? (activeTimeView === "weekly" ? "text-red-500" : "text-[#E67E5F]") : item.off ? "text-[#E67E5F]" : "text-gray-400"}`}
                        >
                          {item.t}
                        </p>
                        <div
                          className={`w-full max-w-[62px] h-[75px] rounded-[14px] border flex items-center justify-center text-[9px] font-bold transition-all p-1 text-center leading-tight ${item.active
                            ? activeTimeView === "weekly"
                              ? "bg-red-50/50 border-red-500 text-red-500 shadow-sm"
                              : "bg-[#FDFCFB]/90 border-[#E67E5F] text-[#E67E5F] shadow-sm"
                            : item.off
                              ? "bg-orange-50/50 border-orange-200 text-[#E67E5F]"
                              : "bg-[#FAF9F6]/80 border-[#E8E4D9] text-gray-400"
                            }`}
                        >
                          {item.v ||
                            (item.tasks > 0
                              ? `${item.tasks} task${item.tasks > 1 ? "s" : ""}`
                              : "—")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Tasks & To-Do Grid */}
              {activeTimeView !== "monthly" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                  {/* Tasks Column */}
                  <GlassCard className="px-5 pt-3 pb-5 h-[150px] w-[300px] !bg-white shadow-sm !border-none !rounded-[24px] flex flex-col hover:shadow-xl transition-all duration-500">
                    <div className="flex items-start justify-between mb-1.5 px-1">
                      <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
                        Tasks
                      </h3>
                      <button className="bg-[#E67E5F] text-white px-4 py-1 rounded-[12px] text-[8px] font-bold transition-all shadow-lg shadow-orange-500/10 active:scale-95">
                        + Create Task
                      </button>
                    </div>
                    <div className="space-y-2 flex-1 overflow-y-auto scrollbar-none pr-1">
                      {[
                        { l: "Team standup meeting", t: "9:00 AM - 0.5h" },
                        { l: "Client Presentation Prep", t: "10:00 AM - 2h" },
                        { l: "Code Review Session", t: "2:00 PM - 1.5h" },
                      ].map((task, i) => (
                        <div
                          key={i}
                          className="bg-[#FAF9F7] border border-[#E8E4D9] p-2.5 rounded-[12px] shadow-sm transition-all cursor-pointer group"
                        >
                          <h4 className="text-[10px] font-bold text-gray-700 leading-tight">
                            {task.l}
                          </h4>
                          <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tight">
                            {task.t}
                          </p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="px-5 pt-3 pb-5 h-[150px] w-[300px] !bg-white shadow-sm !border-none !rounded-[24px] flex flex-col hover:shadow-xl transition-all duration-500">
                    <div className="flex items-start justify-between mb-1.5 px-1">
                      <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
                        To-Do
                      </h3>
                      <button className="bg-[#E67E5F] text-white px-4 py-1 rounded-[12px] text-[8px] font-bold transition-all shadow-lg shadow-orange-500/10 active:scale-95">
                        + Create To-do
                      </button>
                    </div>
                    <div className="space-y-1.5 flex-1 overflow-y-auto scrollbar-none pr-1">
                      {[
                        { l: "Review design mockups", d: false },
                        { l: "Team standup meeting", d: true },
                        { l: "Review OSR-flow", d: true },
                      ].map((todo, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-white border border-gray-100/30 p-2 rounded-[10px] shadow-sm transition-all group cursor-pointer"
                        >
                          <div
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${todo.d ? "bg-[#E67E5F] border-[#E67E5F]" : "border-gray-200 group-hover:border-[#E67E5F]"}`}
                          >
                            {todo.d ? (
                              <CheckSquare
                                className="w-2 h-2 text-white"
                                strokeWidth={3}
                              />
                            ) : (
                              <Plus className="w-3 h-3 text-gray-200 group-hover:text-[#E67E5F] opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-semibold truncate ${todo.d ? "text-gray-400 line-through" : "text-gray-700"}`}
                          >
                            {todo.l}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>
          </div>

          {/* ── CONSOLIDATED COMPASS SECTION ───────────────────────────────── */}
          <div className="pt-6">
            <GlassCard className="!bg-white shadow-sm !border-gray-100/50 !rounded-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* BUSINESS COMPASS (Left Side) */}
                <div className="flex-1 p-8 lg:border-r border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                      Business Compass
                    </h3>
                    <button className="text-[11px] text-[#E67E5F] font-bold uppercase tracking-widest">
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Business Health Score",
                        val: "33 / 100",
                        icon: <Activity className="w-4 h-4" />,
                      },
                      {
                        label: "KPI Progress",
                        val: "2 / 6 KPIs Achieved",
                        icon: <TrendingUp className="w-4 h-4" />,
                      },
                      {
                        label: "Top Stuck Issue",
                        val: "Lead Conversion KPI - 4 days",
                        icon: <AlertCircle className="w-4 h-4" />,
                      },
                      {
                        label: "Best Department Performance",
                        val: "Design – 82%",
                        icon: <Award className="w-4 h-4" />,
                      },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="bg-[#FAF9F6] border border-[#D9D1BD]/20 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-tight">
                          <span className="opacity-60">{c.icon}</span>
                          <span className="truncate">{c.label}</span>
                        </div>
                        <p className="text-[15px] font-bold text-gray-700 leading-tight">
                          {c.val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LIFE COMPASS (Right Side) */}
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                      Life Compass
                    </h3>
                    <button className="text-[11px] text-[#E67E5F] font-bold uppercase tracking-widest hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Journaling Consistency",
                        val: `${lifeCompassStats.journaling_consistency}%`,
                        icon: <BookOpen className="w-4 h-4" />,
                      },
                      {
                        label: "Life Balance Score",
                        val: `${lifeCompassStats.life_balance_score}%`,
                        icon: <Heart className="w-4 h-4" />,
                      },
                      {
                        label: "Current Streak",
                        val: `${lifeCompassStats.current_streak} Days`,
                        icon: <Flame className="w-4 h-4" />,
                      },
                      {
                        label: "Leaderboard Rank",
                        val: `#${lifeCompassStats.leaderboard_rank}`,
                        icon: <Trophy className="w-4 h-4" />,
                      },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="bg-white border border-gray-100/50 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-tight">
                          <span className="opacity-60">{c.icon}</span>
                          <span className="truncate">{c.label}</span>
                        </div>
                        <p className="text-[15px] font-bold text-gray-700 leading-tight">
                          {c.val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ── COMMUNITY FEED SECTION ───────────────────────────────────── */}
          <div className="pt-10 space-y-8">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Community Feed
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
              {/* Main Feed Column */}
              <div className="lg:col-span-8 space-y-8">
                {/* Create Post Console */}
                <GlassCard className="p-0 !bg-white shadow-sm !border-gray-100/50 !rounded-2xl overflow-hidden">
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E6E0F1] flex items-center justify-center shrink-0 border border-white shadow-sm overflow-hidden text-[#5D56C1] font-black text-xs uppercase">
                      {displayName.charAt(0)}
                    </div>
                    <div
                      onClick={() => {
                        setCreateMode("post");
                        setIsCreatePostModalOpen(true);
                      }}
                      className="flex-1 bg-[#FAF9F6] border border-gray-100 rounded-full px-6 py-2 text-sm text-gray-400 cursor-pointer hover:bg-white hover:border-[#E67E5F]/30 transition-all font-medium"
                    >
                      What's on your mind?
                    </div>
                    <button
                      onClick={() => {
                        setCreateMode("post");
                        setIsCreatePostModalOpen(true);
                      }}
                      className="bg-[#E67E5F] text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 flex-shrink-0"
                    >
                      + Create Post
                    </button>
                  </div>
                  <div className="h-px bg-gray-100 mx-6" />
                  <div className="px-6 py-4 flex items-center gap-8">
                    <button className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500 hover:text-[#E67E5F] transition-colors">
                      <Image className="w-4 h-4" /> Add Photo
                    </button>
                    <button className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500 hover:text-[#E67E5F] transition-colors">
                      <Video className="w-4 h-4" /> Add Video
                    </button>
                    <button className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500 hover:text-[#E67E5F] transition-colors">
                      <Activity className="w-4 h-4" /> Add Feeling
                    </button>
                  </div>
                </GlassCard>

                {/* Feed Items */}
                {isLoadingPosts ? (
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <GlassCard key={i} className="p-8 animate-pulse">
                        <div className="flex gap-4 mb-6">
                          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 w-1/4"></div>
                            <div className="h-3 bg-gray-100 w-1/6"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-100 w-full rounded mb-3"></div>
                        <div className="h-4 bg-gray-100 w-3/4 rounded"></div>
                      </GlassCard>
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <GlassCard
                      key={post.id}
                      className="p-8 sm:p-10 !bg-white border hover:border-gray-200/50 !rounded-2xl shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-5 items-center">
                          <img
                            src={
                              post.creator_image_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.creator_full_name}`
                            }
                            alt="Creator"
                            className="w-14 h-14 rounded-full border-2 border-white shadow-sm"
                          />
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-none">
                              {post.creator_full_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5 font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                              <span>Product Manager</span>
                              <span className="w-1 h-1 rounded-full bg-gray-200" />
                              <span>{formatTimestamp(post.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-300 hover:text-gray-600 p-2">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-2xl p-2"
                          >
                            <DropdownMenuItem
                              className="text-[#E67E5F] font-bold text-xs rounded-xl"
                              onClick={() =>
                                setDeleteConfirmation({
                                  open: true,
                                  type: "post",
                                  id: post.id,
                                })
                              }
                            >
                              DELETE POST
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {post.title && (
                        <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                          {post.title}
                        </h2>
                      )}
                      <p className="text-[15px] text-gray-600 leading-relaxed mb-8 font-medium">
                        {post.body}
                      </p>
                      {post.attachments?.map(
                        (att) =>
                          att.document_content_type.startsWith("image/") && (
                            <div
                              key={att.id}
                              className="rounded-3xl overflow-hidden mb-8 border border-gray-100 shadow-sm transition-transform hover:scale-[1.01] duration-500"
                            >
                              <img src={att.url} className="w-full h-full" />
                            </div>
                          )
                      )}
                      <div className="flex items-center gap-8 pt-6 border-t border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors cursor-pointer">
                          <Heart
                            className={`w-5 h-5 ${post.total_likes > 0 ? "text-red-500 fill-red-500" : ""}`}
                          />{" "}
                          {post.total_likes}
                        </div>
                        <div className="flex items-center gap-2 hover:text-gray-600 transition-colors cursor-pointer">
                          <MessageSquare className="w-5 h-5" />{" "}
                          {post.comments.length}
                        </div>
                        <button className="ml-auto hover:text-[#E67E5F] transition-colors flex items-center gap-2">
                          <Share2 className="w-5 h-5" /> Share
                        </button>
                      </div>
                    </GlassCard>
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-400 italic">
                    No community posts yet.
                  </div>
                )}
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4 space-y-8">
                {/* CEO Message Widget */}
                <GlassCard
                  className="p-0 overflow-hidden !bg-white shadow-sm !border-gray-100/50 !rounded-2xl group cursor-pointer"
                  onClick={() => setIsVideoOpen(true)}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={ceoImage}
                      alt="CEO"
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-2xl group-hover:scale-110 transition-transform">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="text-white text-[11px] font-bold italic tracking-wide group-hover:translate-y-[-4px] transition-transform">
                        "Innovation starts with collaboration"
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-gray-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Featured: CEO Message
                      </span>
                      <button className="text-[#E67E5F] transition-transform group-hover:translate-x-1">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* Employee of the Month Widget */}
                <GlassCard className="p-6 sm:p-7 !bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] !border-none !rounded-[24px]">
                  <h3 className="text-[17px] font-bold text-[#4A4A4A] mb-8 text-left tracking-tight">
                    Employee of the Month
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="w-[112px] h-[112px] rounded-full p-[4px] border-[3px] border-[#E67E5F] relative mb-5 shadow-[0_8px_20px_-6px_rgba(230,126,95,0.4)] bg-white">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={
                            currentEmployee?.profile_image ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=winner`
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h4 className="text-[17px] font-bold text-[#3D3D3D] leading-tight mb-1">
                      {currentEmployee?.full_name || "Sarah Johnson"}
                    </h4>
                    <p className="text-[12px] font-bold text-[#8A8A8A] mb-6">
                      Product Manager
                    </p>

                    <div className="w-[95%] h-px bg-[#F0F0F0] mb-5" />

                    <div className="flex items-center justify-center gap-6 text-[13px] text-[#8A8A8A] font-medium">
                      <div className="flex items-center gap-1.5">
                        <Heart
                          className="w-[18px] h-[18px] text-[#E67E5F]"
                          strokeWidth={2}
                        />{" "}
                        127
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare
                          className="w-[18px] h-[18px] text-[#8A8A8A]"
                          strokeWidth={2}
                        />{" "}
                        34
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Other Widgets */}
                <div className="space-y-6">
                  {[
                    {
                      title: "Town Halls",
                      icon: <Megaphone className="w-4 h-4" />,
                      content: <AutoScrollTownHalls />,
                      height: "260px",
                    },
                    {
                      title: "Upcoming Events",
                      icon: <Calendar className="w-4 h-4" />,
                      content: <AutoScrollEvents />,
                      height: "480px",
                    },
                  ].map((w, i) => (
                    <GlassCard
                      key={i}
                      className={`p-7 !rounded-2xl flex flex-col !bg-white shadow-sm border-gray-50`}
                      style={{ height: w.height }}
                    >
                      <div className="flex items-center gap-2 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
                        {w.icon} {w.title}
                      </div>
                      <div className="flex-1 relative overflow-hidden">
                        {w.content}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1.5 
  backdrop-blur-sm
  bg-[rgba(0,0,0,0.1)]
  border-2 border-[rgba(255,255,255,0.4)] 
  rounded-full 
  p-2 
  shadow-[0_8px_32px_rgba(0,0,0,0.15)] 
  ring-1 ring-white/10
">
          <button
            onClick={() => setIsQuickActionsOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-sm bg-[rgba(253,253,253,0.2)] border border-[rgba(255,255,255,0.4)] text-[14px] font-medium text-gray-800 hover:bg-white/40 transition-all shadow-sm"
          >
            <Zap className="w-5 h-5 text-[#DA7756]" strokeWidth={2} /> Quick
            Actions
          </button>

          <div className="w-px h-6 bg-gray-400/20" />

          <button
            className="flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-sm bg-[rgba(253,253,253,0.2)] border border-[rgba(255,255,255,0.4)] text-[14px] font-medium text-gray-800 hover:bg-white/40 transition-all shadow-sm"
            onClick={() => setIsExploreOpen(true)}
          >
            <Compass className="w-5 h-5 text-[#DA7756]" strokeWidth={2} />{" "}
            Explore
          </button>

          <div className="w-px h-6 bg-gray-400/20" />

          <button
            className="flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-sm bg-[rgba(253,253,253,0.2)] border border-[rgba(255,255,255,0.4)] text-[14px] font-medium text-gray-800 hover:bg-white/40 transition-all shadow-sm"
            onClick={() => navigate("/ask-ai")}
          >
            <Bot className="w-5 h-5 text-[#DA7756]" strokeWidth={2} /> Ask AI
          </button>
        </div>
      </div>

      {/* Explore Dialog */}
      <Dialog open={isExploreOpen} onOpenChange={setIsExploreOpen}>
        <DialogContent className="max-w-4xl p-0 rounded-2xl overflow-hidden bg-white border-none shadow-2xl">
          <div className="p-8 bg-[#f5f0e8]/50 overflow-hidden relative">
            <div className="flex items-center justify-between mb-10 px-4">
              <h3 className="text-xl font-medium text-gray-800">Explore</h3>
              <button
                onClick={() => setIsExploreOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-4 px-2">
              {quickLinks.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                  onClick={() => {
                    setIsExploreOpen(false);
                    navigate(
                      item.link ||
                      `/${item.name.toLowerCase().replace(/\s+/g, "-")}`
                    );
                  }}
                >
                  <div className="w-full aspect-square rounded-2xl bg-[#FAF9F6] flex items-center justify-center border border-gray-100/50 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[55%] h-[55%] object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#E67E5F]/5 rounded-full blur-3xl" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Actions Dialog */}
      <Dialog open={isQuickActionsOpen} onOpenChange={setIsQuickActionsOpen}>
        <DialogContent className="max-w-3xl p-0 h-[250px] rounded-[12px] bg-white border-none shadow-xl">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[13px] font-bold text-[#4A4A4A]">
                Quick Actions
              </h3>
              <button
                onClick={() => setIsQuickActionsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex justify-center flex-wrap gap-5 pb-8">
              {[
                {
                  name: "Create Task",
                  icon: (
                    <CheckSquare
                      className="w-7 h-7 text-[#E67E5F]"
                      strokeWidth={1.5}
                    />
                  ),
                },
                {
                  name: "Raise Ticket",
                  icon: (
                    <AlertCircle
                      className="w-7 h-7 text-[#E67E5F]"
                      strokeWidth={1.5}
                    />
                  ),
                },
                {
                  name: "Add To-do",
                  icon: (
                    <ListTodo
                      className="w-7 h-7 text-[#E67E5F]"
                      strokeWidth={1.5}
                    />
                  ),
                },
                {
                  name: "Create Post",
                  icon: (
                    <PenTool
                      className="w-7 h-7 text-[#E67E5F]"
                      strokeWidth={1.5}
                    />
                  ),
                },
              ].map((action, i) => (
                <div
                  key={i}
                  onClick={() => setIsQuickActionsOpen(false)}
                  className="flex flex-col items-center justify-center w-[140px] h-[120px] bg-[#FCFBF8] rounded-xl cursor-pointer hover:bg-[#F4F2EC] transition-all group"
                >
                  <div className="w-[52px] h-[52px] bg-white rounded-xl flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#F0ECE1] group-hover:scale-105 transition-transform duration-300 mb-4">
                    {action.icon}
                  </div>
                  <span className="text-[12px] font-bold text-[#3D3D3D] tracking-tight">
                    {action.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Overlays */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <button className="absolute top-8 left-8 text-white hover:scale-110 transition-transform">
            <X className="w-10 h-10" />
          </button>
          <div
            className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={
                companyData?.ceo_video?.document_url ||
                "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-close-up-4986-large.mp4"
              }
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      <Dialog
        open={deleteConfirmation.open}
        onOpenChange={(o) =>
          !o && setDeleteConfirmation({ open: false, type: null, id: null })
        }
      >
        <DialogContent className="max-w-xs rounded-3xl p-6 text-center">
          <DialogTitle className="font-black text-xl mb-4">
            DELETE {deleteConfirmation.type?.toUpperCase()}?
          </DialogTitle>
          <div className="flex gap-2">
            <button
              className="flex-1 py-3 text-sm font-bold bg-gray-100 rounded-2xl"
              onClick={() =>
                setDeleteConfirmation({ open: false, type: null, id: null })
              }
            >
              CANCEL
            </button>
            <button
              className="flex-1 py-3 text-sm font-bold bg-[#E67E5F] text-white rounded-2xl"
              onClick={confirmDelete}
            >
              DELETE
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreatePostModalOpen}
        onOpenChange={setIsCreatePostModalOpen}
      >
        <DialogContent className="max-w-lg p-0 rounded-3xl overflow-hidden bg-white border-none shadow-2xl">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Create {createMode === "poll" ? "Poll" : "Post"}
              </h2>
              <button onClick={() => setIsCreatePostModalOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={`What's on your mind, ${displayName}?`}
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-sm min-h-[140px] focus:outline-none focus:ring-4 focus:ring-[#E67E5F]/5 transition-all"
            />

            {createMode === "poll" && (
              <div className="mt-4 space-y-2">
                {pollOptions.map((o, i) => (
                  <input
                    key={i}
                    value={o}
                    onChange={(e) => {
                      const n = [...pollOptions];
                      n[i] = e.target.value;
                      setPollOptions(n);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="w-full bg-gray-50 p-3 border border-gray-100 rounded-xl text-xs font-bold"
                  />
                ))}
                <button
                  className="text-[10px] font-black text-[#E67E5F] uppercase"
                  onClick={() => setPollOptions([...pollOptions, ""])}
                >
                  + Add Option
                </button>
              </div>
            )}

            <div className="mt-8 flex justify-between items-center">
              <div className="flex gap-3">
                <button
                  className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Activity className="w-5 h-5 text-gray-500" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  multiple
                  onChange={(e) =>
                    setSelectedFiles(Array.from(e.target.files || []))
                  }
                />
                <button
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${createMode === "poll" ? "bg-[#E67E5F] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                  onClick={() =>
                    setCreateMode(createMode === "poll" ? null : "poll")
                  }
                >
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
              <button
                disabled={!postText.trim() && selectedFiles.length === 0}
                onClick={handlePublish}
                className="bg-[#E67E5F] text-white px-10 py-3 rounded-2xl font-black shadow-xl hover:bg-[#a01a26] disabled:opacity-30 uppercase tracking-widest text-sm"
              >
                PUBLISH
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-2 rounded-lg text-[10px] font-bold flex gap-2"
                  >
                    {f.name}{" "}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setSelectedFiles(
                          selectedFiles.filter((_, idx) => idx !== i)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* End of Main Content */}
    </div>
  );
};

// Sub-components
function AutoScrollTownHalls() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          "9c321b4fe31d68572f18cbc082557777f681f283c244fa55";
        const baseUrl =
          localStorage.getItem("baseUrl") || "lockated-api.gophygital.work";
        const res = await axios.get(
          `https://${baseUrl}/pms/admin/events.json?q[event_type_eq]=town_hall&token=${token}`
        );
        setCards(res.data.classifieds || []);
      } catch (err: any) {
        console.error("Fetch Town Halls failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  if (loading || cards.length === 0)
    return (
      <div className="h-full flex items-center justify-center text-[10px] text-gray-400 italic">
        No scheduled town halls.
      </div>
    );
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 3500 }}
      pagination={{ clickable: true }}
      className="h-full"
    >
      {cards.map((c, i) => (
        <SwiperSlide key={i} className="pb-8">
          <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-100 flex gap-3 h-full">
            <div className="w-14 h-14 bg-gray-200 rounded-xl overflow-hidden shrink-0">
              <img
                src={
                  (c.documents && (c.documents[0] as any)?.document) ||
                  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=200"
                }
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-gray-900 line-clamp-1">
                {c.event_name}
              </h4>
              <p className="text-[9px] text-[#E67E5F] font-bold mt-1 uppercase tracking-tighter">
                {new Date(c.from_time).toLocaleDateString()}
              </p>
              <p className="text-[9px] text-gray-500 mt-1 line-clamp-1">
                {c.description}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function AutoScrollEvents() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl =
          localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
        const res = await axios.get(
          `https://${baseUrl}/pms/admin/events/upcoming_events.json?token=9c321b4fe31d68572f18cbc082557777f681f283c244fa55`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents(res.data.upcoming || []);
      } catch (err: any) {
        console.error("Fetch Events failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <Activity className="w-6 h-6 animate-spin text-gray-200" />
      </div>
    );
  return (
    <div className="h-full overflow-y-auto space-y-4 pr-2 scrollbar-none animate-scroll-vertical">
      {(events.length > 0 ? [...events, ...events] : []).map((ev, i) => (
        <div
          key={i}
          className="flex gap-4 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100/50"
        >
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm">
            <img
              src={
                ev.image_url ||
                `https://images.unsplash.com/photo-1511578314322-379afb476865?w=200`
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <p className="text-[9px] text-[#E67E5F] font-black mb-1 uppercase tracking-widest">
              {ev.event_date || "Upcoming"}
            </p>
            <h4 className="text-xs font-bold text-gray-900 leading-tight mb-1">
              {ev.title || ev.event_name}
            </h4>
            <div className="flex items-center gap-1 text-[8px] text-gray-400 font-bold uppercase">
              <MapPin className="w-3 h-3" />{" "}
              <span className="truncate">{ev.location || "Office"}</span>
            </div>
          </div>
        </div>
      ))}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none !important; }
        .scrollbar-none { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        @keyframes scroll-vertical { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .animate-scroll-vertical { animation: scroll-vertical 30s linear infinite; }
        .animate-scroll-vertical:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}

export default CompanyHubNew;
