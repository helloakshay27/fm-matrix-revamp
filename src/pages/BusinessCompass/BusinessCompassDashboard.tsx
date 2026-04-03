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
      <AdminViewEmulation />

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
              className="bg-white text-[#bc181d] flex items-center justify-start gap-2 px-8 h-10 font-bold rounded-[8px] whitespace-nowrap w-full sm:w-auto dark:bg-white dark:text-[#bc181d] dark:hover:bg-gray-100"
              onClick={() => navigate("/business-compass/daily-report")}
            >
              <Calendar size={16} />
              Daily Report
            </Button>
            <Button
              className="bg-white text-[#bc181d] hover:bg-gray-100 flex items-center justify-start gap-2 px-8 h-10 font-bold rounded-[8px] whitespace-nowrap w-full sm:w-auto dark:bg-white dark:text-[#bc181d] dark:hover:bg-gray-100"
              onClick={() => navigate("/business-compass/weekly-report")}
            >
              <FileText size={16} />
              Weekly Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Health Score */}
      <Card className="rounded-[8px] border-[2px] border-[#C4B89D] bg-white shadow-sm overflow-hidden mb-6">
        <CardHeader className="pb-4 pt-5 px-6">
          <div className="flex items-center gap-2 text-lg font-bold text-[#1a1a1a]">
            <Activity className="text-[#dc2626]" size={20} />
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
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray="282.7"
                  strokeDashoffset="282.7"
                  className="transition-all duration-1000 ease-out"
                />
                <circle cx="50" cy="5" r="4" fill="#ef4444" />
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
            <Badge className="bg-[#fee2e2] text-[#ef4444] hover:bg-[#fee2e2] px-3 py-1 rounded-[6px] text-xs font-bold border-none shadow-none">
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
                  className="text-[#ef4444]"
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
            <Badge className="bg-[#dc2626] text-white px-3 h-[22px] rounded-full justify-center text-[10px] font-bold tracking-tight border-none shadow-none pointer-events-none mb-1">
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
