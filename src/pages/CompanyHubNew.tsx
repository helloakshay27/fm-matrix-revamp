import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

import "swiper/css";
import "swiper/css/pagination";

import businessPlanIcon from "@/assets/business_plan.png";
import ourGroupIcon from "@/assets/our_group.png";
import productsIcon from "@/assets/products.png";
import documentDriveIcon from "@/assets/document_drive.png";
import hrPoliciesIcon from "@/assets/hr_policies.png";
import directoryIcon from "@/assets/directory.png";
import employeeFaqIcon from "@/assets/employee_faq.png";

// Components
import TopNavigation from "../components/CompanyHub/TopNavigation";
import ExploreDialog from "../components/CompanyHub/Modals/ExploreDialog";
import QuickActionsDialog from "../components/CompanyHub/Modals/QuickActionsDialog";
import { PostModals } from "../components/CompanyHub/Modals/PostModals";

// Tabs
import DashboardTab from "../components/CompanyHub/Tabs/DashboardTab";
import BusinessCompassTab from "../components/CompanyHub/Tabs/BusinessCompassTab";
import AdminCompassTab from "../components/CompanyHub/Tabs/AdminCompassTab";

// Types & Utils
import {
  CompanyData,
  Post,
  TaskStats,
  LifeCompassStats,
  QuickLink,
} from "../components/CompanyHub/types";
import { hasContent, extractText } from "../components/CompanyHub/utils";

interface CompanyHubNewProps {
  userName?: string;
}

const CompanyHubNew: React.FC<CompanyHubNewProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    task_count: 0,
    todo_count: 0,
    in_progress_tasks: 0,
    overdue_tasks: 0,
    on_hold_tasks: 0,
    completed_tasks: 0,
    open_tasks: 0,
  });
  const [lifeCompassStats, setLifeCompassStats] = useState<LifeCompassStats>({
    journaling_consistency: 0,
    life_balance_score: 0,
    current_streak: 0,
    leaderboard_rank: 0,
  });
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "business" | "admin"
  >("dashboard");
  const [activeTimeView, setActiveTimeView] = useState<
    "hourly" | "weekly" | "monthly"
  >("hourly");
  const [activeNavMenu, setActiveNavMenu] = useState<string | null>(null);

  // Community State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [, setAnnouncements] = useState<any[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
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
  const [selectedMatrixQuadrant, setSelectedMatrixQuadrant] = useState<any>(null);

  const user = React.useMemo(() => getUser(), []);
  const displayName =
    userName || (user ? `${user.firstname} ${user.lastname}`.trim() : "Guest");
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
        fetchPosts();
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

  const quickLinks: QuickLink[] = [
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
    <div className="min-h-screen bg-[#FAF9F6] pb-24 overflow-x-hidden font-poppins">
      <div className="pb-10">
        <TopNavigation
          activeNavMenu={activeNavMenu}
          setActiveNavMenu={setActiveNavMenu}
        />

        {/* --- TOP NAV TABS --- */}
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

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
          {activeTab === "dashboard" && (
            <DashboardTab
              displayName={displayName}
              welcomeText={welcomeText}
              visionText={visionText}
              missionText={missionText}
              taskStats={taskStats}
              selectedMatrixQuadrant={selectedMatrixQuadrant}
              setSelectedMatrixQuadrant={setSelectedMatrixQuadrant}
              activeTimeView={activeTimeView}
              setActiveTimeView={setActiveTimeView}
              lifeCompassStats={lifeCompassStats}
              setIsCreatePostModalOpen={setIsCreatePostModalOpen}
              setCreateMode={setCreateMode}
              isLoadingPosts={isLoadingPosts}
              posts={posts}
              setDeleteConfirmation={setDeleteConfirmation}
              setIsVideoOpen={setIsVideoOpen}
              currentEmployee={currentEmployee}
            />
          )}

          {activeTab === "business" && <BusinessCompassTab />}

          {activeTab === "admin" && <AdminCompassTab />}
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1.5 backdrop-blur-sm bg-[rgba(0,0,0,0.1)] border-2 border-[rgba(255,255,255,0.4)] rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.15)] ring-1 ring-white/10">
          <button
            onClick={() => setIsQuickActionsOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-sm bg-[rgba(253,253,253,0.2)] border border-[rgba(255,255,255,0.4)] text-[14px] font-medium text-gray-800 hover:bg-white/40 transition-all shadow-sm"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DA7756"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            Quick Actions
          </button>
          <div className="w-px h-6 bg-gray-400/20" />
          <button
            className="flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-sm bg-[rgba(253,253,253,0.2)] border border-[rgba(255,255,255,0.4)] text-[14px] font-medium text-gray-800 hover:bg-white/40 transition-all shadow-sm"
            onClick={() => setIsExploreOpen(true)}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DA7756"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            Explore
          </button>
          <div className="w-px h-6 bg-gray-400/20" />
          <button
            className="flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-sm bg-[rgba(253,253,253,0.2)] border border-[rgba(255,255,255,0.4)] text-[14px] font-medium text-gray-800 hover:bg-white/40 transition-all shadow-sm"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DA7756"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            Ask AI
          </button>
        </div>
      </div>

      <ExploreDialog
        isExploreOpen={isExploreOpen}
        setIsExploreOpen={setIsExploreOpen}
        quickLinks={quickLinks}
      />

      <QuickActionsDialog
        isQuickActionsOpen={isQuickActionsOpen}
        setIsQuickActionsOpen={setIsQuickActionsOpen}
      />

      <PostModals
        isCreatePostModalOpen={isCreatePostModalOpen}
        setIsCreatePostModalOpen={setIsCreatePostModalOpen}
        createMode={createMode}
        setCreateMode={setCreateMode}
        postText={postText}
        setPostText={setPostText}
        displayName={displayName}
        pollOptions={pollOptions}
        setPollOptions={setPollOptions}
        fileInputRef={fileInputRef}
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
        handlePublish={handlePublish}
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
        confirmDelete={confirmDelete}
      />

      {/* CEO Video Overlay */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <button className="absolute top-8 left-8 text-white hover:scale-110 transition-transform">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
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
    </div>
  );
};

export default CompanyHubNew;
