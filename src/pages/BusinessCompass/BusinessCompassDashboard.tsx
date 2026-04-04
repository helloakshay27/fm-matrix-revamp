import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  TrendingUp,
  FileText,
  CheckCircle2,
  Trophy,
  MessageSquare,
  ChevronRight,
  Clock,
  Activity,
  Building2,
  Target,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Video,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import "./BusinessCompass.css";
import { getBaseUrl, getToken } from "@/utils/auth";

const BusinessCompassDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [dailyReportCount, setDailyReportCount] = useState<number>(0);
  const [weeklyReportCount, setWeeklyReportCount] = useState<number>(0);
  const [isBusinessPlanExpanded, setIsBusinessPlanExpanded] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState<"images" | "video">("images");
  const [planImages, setPlanImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [planVideoUrl, setPlanVideoUrl] = useState("");
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setPlanImages([...planImages, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  useEffect(() => {
    const completed = localStorage.getItem("bc-profile-completed") === "true";
    setIsProfileComplete(completed);
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const baseUrl = getBaseUrl() ?? "https://fm-uat-api.lockated.com";
        const token = getToken();
        if (!token) return;

        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch Daily
        const dailyParams = new URLSearchParams();
        dailyParams.append("q[:journal_type]", "daily");
        if (token) dailyParams.append("token", token);
        const dailyUrl = `${baseUrl.replace(/\/+$/, "")}/user_journals.json?${dailyParams.toString()}`;
        const dailyRes = await fetch(dailyUrl, { headers });
        if (dailyRes.ok) {
          const data = await dailyRes.json();
          const reports = Array.isArray(data) ? data : data.user_journals || [];
          setDailyReportCount(reports.length);
        }

        // Fetch Weekly
        const weeklyParams = new URLSearchParams();
        weeklyParams.append("q[:journal_type]", "weekly");
        if (token) weeklyParams.append("token", token);
        const weeklyUrl = `${baseUrl.replace(/\/+$/, "")}/user_journals.json?${weeklyParams.toString()}`;
        const weeklyRes = await fetch(weeklyUrl, { headers });
        if (weeklyRes.ok) {
          const data = await weeklyRes.json();
          const reports = Array.isArray(data) ? data : data.user_journals || [];
          setWeeklyReportCount(reports.length);
        }
      } catch (err) {
        console.error("Failed to fetch report counts:", err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#f6f4ee] p-6 font-poppins">
      {/* Complete Your Profile Banner */}
      {!isProfileComplete && (
        <Card className="overflow-hidden rounded-[16px] border border-[#DA7756]/20 bg-[#DA7756]/10 text-[#1a1a1a] shadow-sm">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-[#1a1a1a]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DA7756] text-white shadow-sm">
                <AlertCircle size={24} />
              </div>
              Complete Your Profile
            </div>
            <p className="max-w-2xl text-sm font-medium text-neutral-600">
              Please complete your profile information to access all features
              and improve team collaboration.
            </p>
            <Button
              className="h-10 rounded-[10px] bg-[#DA7756] px-6 font-bold text-white hover:bg-[#c9673f]"
              onClick={() => navigate("/business-compass/profile")}
            >
              Complete Profile Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Your Performance Journey Banner */}
      <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
        <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
            Your Performance Journey
          </div>
          <div className="flex flex-col gap-3 shrink-0 mt-4 md:mt-0">
            <Button
              className="flex h-10 w-full items-center justify-start gap-2 whitespace-nowrap rounded-xl border border-[#DA7756]/25 bg-white px-8 font-bold text-[#DA7756] shadow-sm hover:bg-[#fef6f4] sm:w-auto"
              onClick={() => navigate("/business-compass/daily-report")}
            >
              <Calendar size={16} />
              Daily Report
            </Button>
            <Button
              className="flex h-10 w-full items-center justify-start gap-2 whitespace-nowrap rounded-xl border border-[#DA7756]/25 bg-white px-8 font-bold text-[#DA7756] shadow-sm hover:bg-[#fef6f4] sm:w-auto"
              onClick={() => navigate("/business-compass/weekly-report")}
            >
              <FileText size={16} />
              Weekly Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Essentials (Core Values & Business Plan) */}
      <Card className="rounded-[8px] bg-[#9EC8BA] border-none shadow-none overflow-hidden p-6">
        <div className="space-y-6">
          {/* Core Values Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-black tracking-[0.15em] text-[#000000] uppercase">
                Core Values
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#DA7756] text-white hover:bg-[#DA7756] border-none px-4 py-1.5 rounded-[4px] text-[12px] font-bold shadow-none">
                dsadsadsad
              </Badge>
            </div>
          </div>

          <div className="h-[1px] bg-white/10 w-full" />

          {/* Business Plan Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full border border-[#DA7756]">
                <Target size={12} className="text-[#DA7756]" />
              </div>
              <span className="text-[12px] font-black tracking-[0.15em] text-[#070707] uppercase">
                Business Plan
              </span>
            </div>

            <div 
              className="bg-[#fdfaff] rounded-[12px] p-3 flex items-center justify-between group cursor-pointer hover:bg-white transition-all shadow-sm"
              onClick={() => setIsBusinessPlanExpanded(!isBusinessPlanExpanded)}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#f0ebff] p-2 rounded-full">
                    <Eye className="text-[#7c3aed]" size={18} />
                  </div>
                  <span className="text-[14px] font-black text-[#1a1c2e] tracking-tight">
                    Our Business Plan
                  </span>
                </div>
                <Button className="h-7 text-[10px] font-black bg-[#fff3e0] text-[#000000] hover:bg-[#ffeac3] border border-[#ffd180] px-3 shadow-none rounded-[6px]">
                  Add Content
                </Button>
              </div>
              {isBusinessPlanExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {/* Expanded Content */}
            {isBusinessPlanExpanded && (
              <div className="mt-4 bg-white rounded-[12px] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Tabs */}
                <div className="flex items-center border-b border-gray-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePlanTab("images"); }}
                    className={cn(
                      "flex-1 py-3 text-[13px] font-bold transition-all",
                      activePlanTab === "images" 
                        ? "bg-[#DA7756] text-white" 
                        : "bg-transparent text-gray-500 hover:text-[#DA7756]"
                    )}
                  >
                    Images
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePlanTab("video"); }}
                    className={cn(
                      "flex-1 py-3 text-[13px] font-bold transition-all",
                      activePlanTab === "video" 
                        ? "bg-[#DA7756] text-white" 
                        : "bg-transparent text-gray-500 hover:text-[#DA7756]"
                    )}
                  >
                    Explainer Video
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[240px]">
                  {activePlanTab === "images" ? (
                    planImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                        {planImages.map((img, i) => (
                          <div key={i} className="group relative aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <img src={img} alt="Plan" className="w-full h-full object-cover" />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlanImages(planImages.filter((_, idx) => idx !== i));
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-[#F6F4EE] rounded-2xl flex items-center justify-center mb-4">
                          <ImageIcon size={32} className="text-[#DA7756]/40" />
                        </div>
                        <p className="text-[14px] font-black text-gray-400 mb-6">No images added yet</p>
                        <Button className="bg-[#DA7756] hover:bg-[#DA7756]/90 text-white font-black h-9 px-6 rounded-[8px] flex items-center gap-2">
                          <Plus size={16} /> Add Images
                        </Button>
                      </>
                    )
                  ) : (
                    planVideoUrl ? (
                      <div className="w-full aspect-video rounded-xl bg-black overflow-hidden relative group">
                        <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                          Video Linked: {planVideoUrl}
                        </div>
                        <video controls className="w-full h-full">
                          <source src={planVideoUrl} type="video/mp4" />
                        </video>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-[#F6F4EE] rounded-2xl flex items-center justify-center mb-4">
                          <Video size={32} className="text-[#DA7756]/40" />
                        </div>
                        <p className="text-[14px] font-black text-gray-400 mb-6">No video added yet</p>
                        <Button className="bg-[#DA7756] hover:bg-[#DA7756]/90 text-white font-black h-9 px-6 rounded-[8px] flex items-center gap-2">
                          <Plus size={16} /> Add Video
                        </Button>
                      </>
                    )
                  )}
                </div>

                {/* Footer Section (Image Upload UI) */}
                {activePlanTab === "images" && (
                  <div className="p-6 border-t border-gray-100 bg-[#F6F4EE]/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[13px] font-black text-[#DA7756]">Add Images</span>
                      <X 
                        size={16} 
                        className="text-gray-400 cursor-pointer" 
                        onClick={() => setIsBusinessPlanExpanded(false)}
                      />
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Paste image URL or Google Drive link..." 
                        className="flex-1 h-10 px-4 rounded-[8px] border border-gray-200 text-[13px] outline-none focus:border-[#DA7756] transition-all"
                      />
                      <Button 
                        onClick={() => handleAddImage()}
                        className="h-10 bg-[#DA7756]/10 hover:bg-[#DA7756]/20 text-[#DA7756] font-black px-4 rounded-[8px] flex items-center gap-2 border border-[#DA7756]/20 shadow-none hover:shadow-none"
                      >
                        <Plus size={16} /> Add
                      </Button>
                      <Button className="h-10 bg-[#DA7756] hover:bg-[#DA7756]/90 text-white font-black px-4 rounded-[8px] flex items-center gap-2 shadow-sm">
                        <Upload size={16} /> Upload
                      </Button>
                    </div>

                    <div className="space-y-1 mb-4">
                      <p className="text-[10px] font-bold text-gray-400">0/12 images • Max 1 MB per image. <span className="text-[#DA7756] underline cursor-pointer">Compress images here</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 h-10 rounded-[8px] border border-gray-200 bg-white hover:bg-gray-50 transition-all text-[11px] font-bold text-[#DA7756]">
                        <ImageIcon size={14} /> Create Image (overview)
                      </button>
                      <button className="flex items-center justify-center gap-2 h-10 rounded-[8px] border border-gray-200 bg-white hover:bg-gray-50 transition-all text-[11px] font-bold text-[#DA7756]">
                        <ImageIcon size={14} /> Create Image (detailed)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Critical Numbers (KPIs) */}
      <Card className="rounded-[8px] bg-[#F6F4EE] border-none shadow-none overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex items-center gap-2 text-xl font-bold text-[#010101]">
            <Target className="text-[#DA7756]" size={22} strokeWidth={2.5} />
            Critical Numbers (KPIs)
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                title: "AI Task Completion Rate",
                achieved: 0,
                target: 80,
                percentage: 0,
              },
              {
                title: "Customer Satisfaction Score",
                achieved: 0,
                target: 95,
                percentage: 0,
              },
              {
                title: "Lead Conversion Rate",
                achieved: 0,
                target: 20,
                percentage: 0,
              },
              {
                title: "Monthly Revenue",
                achieved: 0,
                target: 0,
                percentage: "NaN",
              },
              {
                title: "New Partnerships Formed",
                achieved: 0,
                target: 5,
                percentage: 0,
              },
              {
                title: "Project Completion Rate",
                achieved: 0,
                target: 90,
                percentage: 0,
              },
            ].map((kpi, idx) => (
              <Card
                key={idx}
                className="w-full border-none rounded-[4px] shadow-sm bg-white p-4 flex flex-col gap-3"
              >
                <div>
                  <Badge className="bg-[#C4B89D] hover:bg-[#C4B89D] text-white px-3 py-0.5 rounded-full text-[10px] font-bold border-none shadow-none pointer-events-none mb-3 inline-flex">
                    Weekly
                  </Badge>
                  <div className="text-[13px] font-bold text-[#374151] leading-snug min-h-[40px] flex items-center pr-2">
                    {kpi.title}
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-[28px] font-black text-[#1a1a1a] leading-none">
                      {kpi.achieved}
                    </span>
                    <span className="text-[12px] font-semibold text-[#64748b]">
                      / {kpi.target} #
                    </span>
                  </div>
                  <Progress
                    value={kpi.percentage === "NaN" ? 0 : kpi.percentage}
                    className="h-1.5 mb-2 bg-[#e2e8f0]"
                  />
                  <div className="text-[10px] font-medium text-[#64748b]">
                    {kpi.percentage}% achieved
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Health Score */}
      <Card className="mb-6 overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] shadow-sm">
        <CardHeader className="pb-4 pt-5 px-6">
          <div className="flex items-center gap-2 text-lg font-bold text-[#1a1a1a]">
            <Activity className="text-[#DA7756]" size={20} />
            Business Health Score
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 flex flex-col md:flex-row gap-8 items-center">
          {/* Circular Score Area */}
          <div className="flex flex-col items-center justify-center min-w-[200px] md:border-r border-gray-100 pr-0 md:pr-4">
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f3e6df"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#DA7756"
                  strokeWidth="8"
                  strokeDasharray="282.7"
                  strokeDashoffset="282.7"
                  className="transition-all duration-1000 ease-out"
                />
                <circle cx="50" cy="5" r="4" fill="#DA7756" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-[#0f172a] leading-none mb-1">
                  0
                </span>
                <span className="text-[11px] font-bold text-gray-500">
                  / 100
                </span>
              </div>
            </div>
            <Badge className="rounded-[6px] border-none bg-[#fef6f4] px-3 py-1 text-xs font-bold text-[#DA7756] shadow-none hover:bg-[#fef6f4]">
              Needs Attention
            </Badge>
          </div>

          {/* 4-Grid Metrics */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* KPI Card */}
            <div className="relative flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                KPI
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">0%</span>
              <div className="absolute bottom-3 left-0 right-0 px-6">
                <div className="h-1.5 bg-white/70 rounded-full overflow-hidden w-full">
                  <div className="h-full w-0 rounded-full bg-[#DA7756]" />
                </div>
              </div>
            </div>

            {/* Issues Card */}
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                Issues
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">0</span>
            </div>

            {/* Systems Card */}
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                Systems
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">0/0</span>
            </div>

            {/* Goals Card */}
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                Goals
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">0/0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Stuck Issues & Latest Team Chat Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Stuck Issues */}
        <Card className="flex min-h-[360px] flex-col rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] shadow-sm">
          <CardHeader className="py-5 px-6 border-b-0 space-y-0 relative">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 font-bold text-[#1f2937] text-[15px]">
                <AlertCircle
                  size={18}
                  className="text-[#DA7756]"
                  strokeWidth={2.5}
                />
                Top Stuck Issues
              </div>
              <button
                onClick={() => navigate("/business-compass/tasks-and-issues")}
                className="flex items-center gap-1 text-[13px] font-bold text-[#DA7756] hover:underline"
              >
                View All →
              </button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-6 gap-3">
            <div className="mb-2">
              <AlertCircle
                size={48}
                className="text-[#cbd5e1]"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-[14px] font-medium text-[#64748b]">
              No stuck issues
            </p>
          </CardContent>
        </Card>

        {/* Latest Team Chat */}
        <Card className="flex min-h-[360px] flex-col rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] shadow-sm">
          <CardHeader className="py-5 px-6 border-b-0 space-y-0 relative">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 font-bold text-[#1f2937] text-[15px]">
                <MessageSquare
                  size={18}
                  className="text-[#DA7756]"
                  strokeWidth={2.5}
                />
                Latest Team Chat
              </div>
              <button
                onClick={() => navigate("/business-compass/directory-and-chat")}
                className="flex items-center gap-1 text-[13px] font-bold text-[#DA7756] hover:underline"
              >
                View All →
              </button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-6 gap-3">
            <div className="mb-2">
              <MessageSquare
                size={48}
                className="text-[#cbd5e1]"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-[14px] font-medium text-[#64748b]">
              No messages yet
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Empty State Banner */}
      <Card className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 py-10 shadow-sm">
        <Building2
          size={40}
          className="mb-3 text-[#DA7756]/35"
          strokeWidth={1.5}
        />
        <p className="text-[14px] font-medium text-neutral-600">
          No active departments or KPI data available yet
        </p>
      </Card>

      {/* Footer Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Hall of Fame (spans vertically) */}
        <div className="w-full lg:w-1/4 flex">
          <Card className="flex w-full min-h-[220px] flex-col rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-6 text-[#1a1a1a] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-[15px] font-bold text-[#1a1a1a]">
                <Trophy size={18} className="text-[#DA7756]" /> Hall of Fame
              </div>
              <Button
                variant="ghost"
                className="h-6 p-0 text-[11px] font-bold text-[#DA7756] hover:bg-transparent hover:text-[#c9673f] flex items-center gap-0.5"
                onClick={() => navigate("/business-compass/leaderboard")}
              >
                View All <ChevronRight size={14} />
              </Button>
            </div>
            <p className="flex flex-1 items-center justify-center pb-4 text-center text-[13px] font-medium italic text-neutral-600">
              No champions yet. Start submitting reports!
            </p>
          </Card>
        </div>

        {/* Smaller Stats Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              Daily Reports (DR)
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">
              {dailyReportCount}
            </div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              DR Pending
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">0</div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              KPIs
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">0</div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              Weekly Reports (WR)
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">
              {weeklyReportCount}
            </div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              WR Pending
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">0</div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              JDs
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">0</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessCompassDashboard;
