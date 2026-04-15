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
} from "lucide-react";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import "./BusinessCompass.css";
import { getBaseUrl, getToken } from "@/utils/auth";

// Type definitions based on API response
interface CriticalNumber {
  id: number;
  name: string;
  frequency: string;
  frequency_label: string;
  current_value: number;
  target_value: number;
  unit: string;
  progress_percentage: number;
  department: string;
}

interface TopStuckIssue {
  id: number;
  title: string;
  status: string;
  priority: string;
  responsible_person: string;
  due_date: string;
  updated_at: string;
}

interface TeamChatMessage {
  id: number;
  body: string;
  sender_name: string;
  project_space: string;
  created_at: string;
  label: string;
}

interface HallOfFameMember {
  user_id: number;
  name: string;
  total_points: number;
  daily_points: number;
  weekly_points: number;
  feedback_points: number;
}

interface BusinessHealthComponents {
  kpi: {
    percentage: number;
    count: number;
  };
  issues: {
    count: number;
  };
  systems: {
    healthy: number;
    total: number;
    average_health_score: number;
  };
  goals: {
    achieved: number;
    total: number;
    percentage: number;
  };
}

interface BusinessHealthScore {
  score: number;
  out_of: number;
  label: string;
  components: BusinessHealthComponents;
}

interface Counters {
  daily_reports: number;
  daily_pending: number;
  kpis: number;
  weekly_reports: number;
  weekly_pending: number;
  job_descriptions: number;
}

interface DashboardData {
  success: boolean;
  data: {
    profile: {
      organization_name: string;
      user_name: string;
      department: string;
      designation: string;
    };
    critical_numbers: {
      total: number;
      items: CriticalNumber[];
    };
    business_health_score: BusinessHealthScore;
    top_stuck_issues: {
      total: number;
      items: TopStuckIssue[];
    };
    latest_team_chat: {
      total: number;
      items: TeamChatMessage[];
    };
    hall_of_fame: {
      items: HallOfFameMember[];
    };
    counters: Counters;
  };
}

const BusinessCompassDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [dailyReportCount, setDailyReportCount] = useState<number>(0);
  const [weeklyReportCount, setWeeklyReportCount] = useState<number>(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem("bc-profile-completed") === "true";
    setIsProfileComplete(completed);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const baseUrl = getBaseUrl() ?? "https://fm-uat-api.lockated.com";
        const token = getToken();
        if (!token) return;

        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch dashboard data
        const dashboardUrl = `${baseUrl.replace(/\/$/, "")}/business_compass/dashboard`;
        const dashboardRes = await fetch(dashboardUrl, { headers });
        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          setDashboardData(data);
        }

        // Fetch Daily
        const dailyParams = new URLSearchParams();
        dailyParams.append("q[:journal_type]", "daily");
        if (token) dailyParams.append("token", token);
        const dailyUrl = `${baseUrl.replace(/\/$/, "")}/user_journals.json?${dailyParams.toString()}`;
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
        const weeklyUrl = `${baseUrl.replace(/\/$/, "")}/user_journals.json?${weeklyParams.toString()}`;
        const weeklyRes = await fetch(weeklyUrl, { headers });
        if (weeklyRes.ok) {
          const data = await weeklyRes.json();
          const reports = Array.isArray(data) ? data : data.user_journals || [];
          setWeeklyReportCount(reports.length);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#f6f4ee] p-6 font-poppins">
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

      {/* Critical Numbers (KPIs) */}
      <Card className="rounded-[8px] bg-[#f8f6f0] border-none shadow-none overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex items-center gap-2 text-xl font-bold text-[#1a1a1a]">
            <Target className="text-[#1a1a1a]" size={22} strokeWidth={2.5} />
            Critical Numbers (KPIs)
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {dashboardData?.data?.critical_numbers?.items?.map((kpi: any, idx: number) => (
              <Card key={idx} className="w-full border-none rounded-[4px] shadow-sm bg-white p-4 flex flex-col gap-3">
                <div>
                  <Badge className="bg-[#C4B89D] hover:bg-[#C4B89D] text-white px-3 py-0.5 rounded-full text-[10px] font-bold border-none shadow-none pointer-events-none mb-3 inline-flex">
                    {kpi.frequency_label}
                  </Badge>
                  <div className="text-[13px] font-bold text-[#374151] leading-snug min-h-[40px] flex items-center pr-2">
                    {kpi.name}
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-[28px] font-black text-[#1a1a1a] leading-none">{kpi.current_value}</span>
                    <span className="text-[12px] font-semibold text-[#64748b]">/ {kpi.target_value} {kpi.unit}</span>
                  </div>
                  <Progress value={kpi.progress_percentage} className="h-1.5 mb-2 bg-[#e2e8f0]" />
                  <div className="text-[10px] font-medium text-[#64748b]">
                    {kpi.progress_percentage}% achieved
                  </div>
                </div>
              </Card>
            )) || (
              <div className="col-span-full text-center py-8 text-gray-500">
                No KPI data available
              </div>
            )}
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
                  strokeDashoffset={282.7 - (282.7 * (dashboardData?.data?.business_health_score?.score || 0)) / 100}
                  className="transition-all duration-1000 ease-out"
                />
                <circle cx="50" cy="5" r="4" fill="#DA7756" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-[#0f172a] leading-none mb-1">
                  {dashboardData?.data?.business_health_score?.score || 0}
                </span>
                <span className="text-[11px] font-bold text-gray-500">
                  / {dashboardData?.data?.business_health_score?.out_of || 100}
                </span>
              </div>
            </div>
            <Badge className="rounded-[6px] border-none bg-[#fef6f4] px-3 py-1 text-xs font-bold text-[#DA7756] shadow-none hover:bg-[#fef6f4]">
              {dashboardData?.data?.business_health_score?.label || 'Needs Attention'}
            </Badge>
          </div>

          {/* 4-Grid Metrics */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* KPI Card */}
            <div className="relative flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                KPI
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">{dashboardData?.data?.business_health_score?.components?.kpi?.percentage || 0}%</span>
              <div className="absolute bottom-3 left-0 right-0 px-6">
                <div className="h-1.5 bg-white/70 rounded-full overflow-hidden w-full">
                  <div className="h-full rounded-full bg-[#DA7756]" style={{width: `${dashboardData?.data?.business_health_score?.components?.kpi?.percentage || 0}%`}} />
                </div>
              </div>
            </div>

            {/* Issues Card */}
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                Issues
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">{dashboardData?.data?.business_health_score?.components?.issues?.count || 0}</span>
            </div>

            {/* Systems Card */}
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                Systems
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">{dashboardData?.data?.business_health_score?.components?.systems?.healthy || 0}/{dashboardData?.data?.business_health_score?.components?.systems?.total || 0}</span>
            </div>

            {/* Goals Card */}
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4">
              <span className="text-[12px] font-bold text-[#4b5563] mb-1">
                Goals
              </span>
              <span className="text-[28px] font-black text-[#1a1a1a]">{dashboardData?.data?.business_health_score?.components?.goals?.achieved || 0}/{dashboardData?.data?.business_health_score?.components?.goals?.total || 0}</span>
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
          <CardContent className="flex-1 flex flex-col p-6 gap-3">
            {dashboardData?.data?.top_stuck_issues?.items?.length > 0 ? (
              dashboardData.data.top_stuck_issues.items.slice(0, 5).map((issue: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-[#DA7756]/10">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DA7756] text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{issue.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs px-2 py-0.5 rounded-full ${
                        issue.priority === 'High' ? 'bg-red-100 text-red-700' : 
                        issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {issue.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{issue.responsible_person}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 h-full">
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
              </div>
            )}
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
          <CardContent className="flex-1 flex flex-col p-6 gap-3">
            {dashboardData?.data?.latest_team_chat?.items?.length > 0 ? (
              dashboardData.data.latest_team_chat.items.slice(0, 5).map((message: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-[#DA7756]/10">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DA7756] text-white text-xs font-bold flex items-center justify-center">
                    {message.sender_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{message.sender_name}</h4>
                      <span className="text-xs text-gray-500">{message.label}</span>
                    </div>
                    <p className="text-sm text-gray-700 truncate">{message.body}</p>
                    <p className="text-xs text-gray-500 mt-1">{message.project_space}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 h-full">
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
              </div>
            )}
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
              >
                View All <ChevronRight size={14} />
              </Button>
            </div>
            <div className="flex flex-1 flex-col gap-3 pb-4">
              {dashboardData?.data?.hall_of_fame?.items?.length > 0 ? (
                dashboardData.data.hall_of_fame.items.slice(0, 3).map((member: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-white/50 border border-[#DA7756]/10">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DA7756] text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{member.total_points} pts</span>
                        <span>•</span>
                        <span>{member.weekly_points} this week</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="flex flex-1 items-center justify-center text-center text-[13px] font-medium italic text-neutral-600">
                  No champions yet. Start submitting reports!
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Smaller Stats Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              Daily Reports (DR)
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">
              {dashboardData?.data?.counters?.daily_reports || 0}
            </div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              DR Pending
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">{dashboardData?.data?.counters?.daily_pending || 0}</div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              KPIs
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">{dashboardData?.data?.counters?.kpis || 0}</div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              Weekly Reports (WR)
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">
              {dashboardData?.data?.counters?.weekly_reports || 0}
            </div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              WR Pending
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">{dashboardData?.data?.counters?.weekly_pending || 0}</div>
          </Card>

          <Card className="flex flex-col items-center gap-2 rounded-2xl border border-[#DA7756]/15 bg-[#fffaf8] p-4 text-center shadow-sm">
            <Badge className="mb-1 h-[22px] justify-center rounded-full border-none bg-[#DA7756] px-3 text-[10px] font-bold tracking-tight text-white shadow-none pointer-events-none">
              JDs
            </Badge>
            <div className="text-3xl font-black text-[#0f172a]">{dashboardData?.data?.counters?.job_descriptions || 0}</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessCompassDashboard;
