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
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-poppins">
      {/* Complete Your Profile Banner */}
      {!isProfileComplete && (
        <Card className="bg-gradient-to-r from-[#ee6103] to-[#ff8c42] text-white border-none rounded-[16px] shadow-lg overflow-hidden">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
              <AlertCircle size={28} />
              Complete Your Profile
            </div>
            <p className="text-white/90 text-sm max-w-2xl font-medium">
              Please complete your profile information to access all features
              and improve team collaboration.
            </p>
            <Button
              className="bg-white text-[#ee6103] hover:bg-gray-100 font-bold px-6 h-10 rounded-[10px]"
              onClick={() => navigate("/business-compass/profile")}
            >
              Complete Profile Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Your Performance Journey Banner */}
      <Card className="bg-gradient-to-r from-[#798C5E]/15 to-[#798C5E]/15 text-white border-[#C4B89D] rounded-[8px] overflow-hidden">
        <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-2xl font-bold tracking-tight">
            Your Performance Journey
          </div>
          <div className="flex flex-col gap-3 shrink-0 mt-4 md:mt-0">
            <Button
              className="bg-white text-[#DA7756] flex items-center justify-start gap-2 px-8 h-10 font-bold rounded-[8px] whitespace-nowrap w-full sm:w-auto dark:bg-white dark:text-[#DA7756] dark:hover:bg-gray-100"
              onClick={() => navigate("/business-compass/daily-report")}
            >
              <Calendar size={16} />
              Daily Report
            </Button>
            <Button
              className="bg-white text-[#DA7756] hover:bg-gray-100 flex items-center justify-start gap-2 px-8 h-10 font-bold rounded-[8px] whitespace-nowrap w-full sm:w-auto dark:bg-white dark:text-[#DA7756] dark:hover:bg-gray-100"
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
              <div className="flex items-center gap-3 text-[#1a1c2e]/40 relative">
                <div 
                  className="cursor-help py-1"
                  onMouseEnter={() => setShowInfoTooltip(true)}
                  onMouseLeave={() => setShowInfoTooltip(false)}
                >
                  <Info size={18} />
                </div>
                {showInfoTooltip && (
                  <div className="absolute right-0 top-8 z-50 w-[420px] bg-[#0f172a] text-white p-6 rounded-xl shadow-2xl border border-gray-800 pointer-events-none animate-in fade-in zoom-in duration-200">
                    <h4 className="text-[16px] font-black mb-6 text-center text-[#c084fc]">
                      How to Create Business Plan Infographics
                    </h4>
                    <div className="space-y-4 text-[13px] font-bold">
                      <div className="flex gap-3">
                        <span className="text-[#c084fc] shrink-0">1.</span>
                        <p className="leading-relaxed">First, complete your business plan sections above (Core Values, Purpose, Brand Promises, BHAG, Goals, etc.)</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#c084fc] shrink-0">2.</span>
                        <p className="leading-relaxed">Click the 'Copy Text' button at the top of the page to copy your plan</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#c084fc] shrink-0">3.</span>
                        <p className="leading-relaxed">Go to <span className="underline">gemini.google.com</span></p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#c084fc] shrink-0">4.</span>
                        <div className="flex-1">
                          <p className="mb-3">Use this prompt:</p>
                          <div className="bg-[#1e293b] p-4 rounded-lg border border-gray-700/50 italic text-[#cbd5e1] font-medium leading-relaxed">
                            "Create an infographic for the business plan of my company in landscape mode (red, black & white colors) from the plan given below: &lt;paste your business plan here&gt;"
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#c084fc] shrink-0">5.</span>
                        <p className="leading-relaxed">Download the generated infographic and add it here using the image URL or upload feature</p>
                      </div>
                    </div>
                  </div>
                )}
                {isBusinessPlanExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
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
      <Card className="rounded-[8px] border-[2px] border-[#C4B89D] bg-white shadow-sm overflow-hidden mb-6">
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
                  stroke="#f1f5f9"
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
            <Badge className="bg-[#DA7756]/10 text-[#DA7756] hover:bg-[#DA7756]/20 px-3 py-1 rounded-[6px] text-xs font-bold border-none shadow-none">
              Needs Attention
            </Badge>
          </div>

          {/* 4-Grid Metrics */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* KPI Card */}
            <div className="bg-[#e8fbf0] rounded-[8px] p-4 flex flex-col justify-center items-center relative min-h-[100px]">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                KPI
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">0%</span>
              <div className="absolute bottom-3 left-0 right-0 px-6">
                <div className="h-1.5 bg-white/70 rounded-full overflow-hidden w-full">
                  <div className="h-full bg-white w-0 rounded-full" />
                </div>
              </div>
            </div>

            {/* Issues Card */}
            <div className="bg-[#fff0ed] rounded-[8px] p-4 flex flex-col justify-center items-center min-h-[100px]">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                Issues
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">0</span>
            </div>

            {/* Systems Card */}
            <div className="bg-[#e8f8fc] rounded-[8px] p-4 flex flex-col justify-center items-center min-h-[100px]">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                Systems
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">0/0</span>
            </div>

            {/* Goals Card */}
            <div className="bg-[#f4f0fc] rounded-[8px] p-4 flex flex-col justify-center items-center min-h-[100px]">
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
        <Card className="rounded-[8px] border-[2px] border-[#C4B89D] bg-white shadow-sm min-h-[360px] flex flex-col">
          <CardHeader className="py-5 px-6 border-b-0 space-y-0 relative">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 font-bold text-[#1f2937] text-[15px]">
                <AlertCircle
                  size={18}
                  className="text-[#f97316]"
                  strokeWidth={2.5}
                />
                Top Stuck Issues
              </div>
              <button
                onClick={() => navigate("/business-compass/tasks-and-issues")}
                className="text-[13px] font-bold text-[#3b82f6] hover:underline flex items-center gap-1"
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
        <Card className="rounded-[8px] border-[2px] border-[#C4B89D] bg-white shadow-sm min-h-[360px] flex flex-col">
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
                className="text-[13px] font-bold text-[#3b82f6] hover:underline flex items-center gap-1"
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
      <Card className="rounded-[16px] border border-gray-200 bg-white shadow-sm mb-6 flex flex-col items-center justify-center py-10">
        <Building2
          size={40}
          className="text-[#cbd5e1] mb-3"
          strokeWidth={1.5}
        />
        <p className="text-[14px] font-medium text-[#64748b]">
          No active departments or KPI data available yet
        </p>
      </Card>

      {/* Footer Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Hall of Fame (spans vertically) */}
        <div className="w-full lg:w-1/4 flex">
          <Card className="bg-gradient-to-br from-[#DA7756] to-[#DA7756] text-white border-[#C4B89D] rounded-[8px] shadow-md p-6 flex flex-col w-full min-h-[220px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-bold text-[15px] text-[#000000]">
                <Trophy size={18} /> Hall of Fame
              </div>
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-[#DA7756]/15 h-6 text-[11px] font-bold p-0 flex items-center gap-0.5"
                onClick={() => navigate("/business-compass/leaderboard")}
              >
                View All <ChevronRight size={14} />
              </Button>
            </div>
            <p className="flex-1 flex items-center justify-center text-[13px] font-medium opacity-60 text-center pb-4 italic">
              No champions yet. Start submitting reports!
            </p>
          </Card>
        </div>

        {/* Smaller Stats Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-[12px] border-none shadow-sm bg-[#feeaed] p-4 flex flex-col items-center text-center gap-2">
            <Badge className="bg-[#DA7756] text-white px-3 h-[22px] rounded-full justify-center text-[10px] font-bold tracking-tight border-none shadow-none pointer-events-none mb-1">
              Daily Reports (DR)
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">
              {dailyReportCount}
            </div>
          </Card>

          <Card className="rounded-[12px] border-none shadow-sm bg-[#fef5d1] p-4 flex flex-col items-center text-center gap-2">
            <Badge className="bg-[#ea580c] text-white px-3 h-[22px] rounded-full justify-center text-[10px] font-bold tracking-tight border-none shadow-none pointer-events-none mb-1">
              DR Pending
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">0</div>
          </Card>

          <Card className="rounded-[12px] border-none shadow-sm bg-[#e4ecff] p-4 flex flex-col items-center text-center gap-2">
            <Badge className="bg-[#2563eb] text-white px-3 h-[22px] rounded-full justify-center text-[10px] font-bold tracking-tight border-none shadow-none pointer-events-none mb-1">
              KPIs
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">0</div>
          </Card>

          <Card className="rounded-[12px] border-none shadow-sm bg-[#f3e8ff] p-4 flex flex-col items-center text-center gap-2">
            <Badge className="bg-[#9333ea] text-white px-3 h-[22px] rounded-full justify-center text-[10px] font-bold tracking-tight border-none shadow-none pointer-events-none mb-1">
              Weekly Reports (WR)
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">
              {weeklyReportCount}
            </div>
          </Card>

          <Card className="rounded-[12px] border-none shadow-sm bg-[#e0fafe] p-4 flex flex-col items-center text-center gap-2">
            <Badge className="bg-[#0d9488] text-white px-3 h-[22px] rounded-full justify-center text-[10px] font-bold tracking-tight border-none shadow-none pointer-events-none mb-1">
              WR Pending
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">0</div>
          </Card>

          <Card className="rounded-[12px] border-none shadow-sm bg-[#dcfce7] p-4 flex flex-col items-center text-center gap-2">
            <Badge className="bg-[#16a34a] text-white px-3 h-[22px] rounded-full justify-center text-[10px] font-bold tracking-tight border-none shadow-none pointer-events-none mb-1">
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
