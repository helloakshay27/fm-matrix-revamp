import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Calendar, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Trophy, 
  AlertTriangle, 
  MessageSquare, 
  Target, 
  ChevronRight,
  TrendingDown,
  Clock
} from 'lucide-react';
import { AdminViewEmulation } from '@/components/AdminViewEmulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import './BusinessCompass.css';

const BusinessCompassDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('bc-profile-completed') === 'true';
    setIsProfileComplete(completed);
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
              Please complete your profile information to access all features and improve team collaboration.
            </p>
            <Button 
              className="bg-white text-[#ee6103] hover:bg-gray-100 font-bold px-6 h-10 rounded-[10px]"
              onClick={() => navigate('/business-compass/profile')}
            >
              Complete Profile Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Your Performance Journey Banner */}
      <Card className="bg-gradient-to-r from-[#bc181d] to-[#dc2626] text-white border-none rounded-[16px] shadow-lg overflow-hidden">
        <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-2xl font-bold tracking-tight">Your Performance Journey</div>
          <Button 
            className="bg-white text-[#bc181d] hover:bg-gray-100 flex items-center gap-2 px-6 h-12 font-bold rounded-[10px] whitespace-nowrap"
            onClick={() => navigate('/business-compass/daily-report')}
          >
            <Calendar size={18} />
            Daily Report
          </Button>
        </CardContent>
      </Card>

      {/* KPI, SOP, Top Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-[16px] border border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-[#1a1a1a]">My KPIs</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 opacity-60">
            <TrendingUp size={64} className="text-gray-300 mb-4" />
            <p className="text-sm font-medium text-gray-500">No KPIs assigned yet</p>
          </CardContent>
        </Card>

        <Card className="rounded-[16px] border-[#bae6fd] bg-[#f0f9ff] shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-[#3b82f6]" />
              <CardTitle className="text-lg font-bold text-[#1a1a1a]">My SOPs</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 opacity-60">
            <FileText size={64} className="text-[#3b82f6]/20 mb-4" />
            <p className="text-sm font-medium text-gray-500">No SOPs assigned yet</p>
          </CardContent>
        </Card>

        <Card className="rounded-[16px] border border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-[#10b981]" />
              <CardTitle className="text-lg font-bold text-[#1a1a1a]">My Top Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <CheckCircle2 size={64} className="text-[#10b981]/20 mb-4" />
            <p className="text-sm font-medium text-[#10b981]">All caught up! No pending tasks.</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-[16px] border border-gray-200 shadow-sm bg-white h-[300px] flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 font-bold text-gray-600">
              <Calendar size={20} />
              Yesterday's Review
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center py-8">
            <Calendar size={60} className="text-gray-100 mb-4" />
            <p className="text-sm font-medium text-gray-400 mb-6">No report for yesterday</p>
            <Button className="bg-[#334155] hover:bg-[#1e293b] text-white font-bold rounded-[10px] px-6 h-10">
              Submit Daily Report
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[16px] border-[#e9d5ff] bg-[#faf5ff] shadow-sm h-[300px] flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 font-bold text-[#9333ea]">
              <Calendar size={20} />
              Weekly Review
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center py-8">
            <Calendar size={60} className="text-[#f3e8ff] mb-4" />
            <p className="text-sm font-medium text-gray-400 mb-6">No weekly review submitted yet</p>
            <Button className="bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold rounded-[10px] px-6 h-10 uppercase tracking-wide">
              Submit Weekly Review
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Card */}
      <Card className="rounded-[16px] border border-[#e2e8f0] shadow-sm bg-white p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-2 text-[#4338ca] font-bold text-lg">
            <Trophy size={20} className="text-[#f59e0b]" />
            Your Achievements
          </div>
          <Badge className="bg-[#f1f5f9] text-[#475569] hover:bg-[#f1f5f9] px-4 py-1.5 rounded-full text-xs font-bold border-none shadow-none">Beginner</Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-12">
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-[#4b5563]">Total Points</span>
              <span className="text-[#4338ca]">0 / 500</span>
            </div>
            <Progress value={0} className="h-2.5 bg-[#f1f5f9]" />
            <p className="text-right text-xs text-gray-400 font-medium">
              500 points to next level
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-[12px] bg-gray-50/30">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4b5563] mb-2">
              Earned Badges <Badge className="bg-gray-200 text-gray-700 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">0</Badge>
            </div>
            <p className="text-xs text-gray-400 italic">
              No badges yet. Start submitting reports to earn!
            </p>
          </div>
        </div>
      </Card>

      {/* Alerts, Feedback, Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Alerts Card */}
        <Card className="rounded-[16px] border-[#ffedd5] bg-[#fff7ed] shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#ea580c] text-lg">
                <AlertTriangle size={20} />
                Alerts
              </div>
              <Badge className="bg-[#ea580c] text-white h-6 min-w-[24px] rounded-full flex items-center justify-center font-bold">1</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Card className="border border-red-100 bg-white rounded-[12px] p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-[#111827] font-bold text-sm">
                <Calendar size={16} className="text-[#ef4444]" />
                5 Missed Daily Reports
              </div>
              <p className="text-xs text-gray-500 font-medium pl-6">
                Last 7 days: 5 workdays without submission
              </p>
              <div className="pl-6 flex items-center gap-1 text-[#2563eb] font-bold text-sm cursor-pointer hover:underline" onClick={() => navigate('/business-compass/daily-report')}>
                Fill Reports <ChevronRight size={14} />
              </div>
            </Card>
          </CardContent>
        </Card>

        {/* Feedback Card */}
        <Card className="rounded-[16px] border-[#dcfce7] bg-[#f0fdf4] shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 font-bold text-[#16a34a] text-lg">
              <MessageSquare size={20} />
              Feedback
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-4 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-[12px] border border-gray-100 flex flex-col items-center gap-1 shadow-sm">
                <div className="flex items-center gap-2 text-gray-400 font-bold">
                  <Clock size={14} /> 0
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Received</div>
              </div>
              <div className="bg-white p-4 rounded-[12px] border border-gray-100 flex flex-col items-center gap-1 shadow-sm">
                <div className="flex items-center gap-2 text-[#111827] text-xl font-bold">
                  <TrendingUp size={16} className="text-[#16a34a]" /> 6
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Given</div>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-white border-[#dcfce7] text-[#16a34a] hover:bg-[#dcfce7]/30 font-bold h-10 rounded-[8px] flex items-center gap-2">
              View All Feedback <ChevronRight size={14} />
            </Button>
          </CardContent>
        </Card>

        {/* My Goals Card */}
        <Card className="rounded-[16px] border-[#dbeafe] bg-[#eff6ff] shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 font-bold text-[#4338ca] text-lg">
              <Target size={20} />
              My Goals
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center py-8 gap-4 text-center">
            <Target size={40} className="text-[#bfdbfe]" />
            <p className="text-sm font-medium text-gray-500">No active goals</p>
            <Button className="bg-[#4338ca] hover:bg-[#3730a3] text-white font-bold rounded-[8px] px-6 h-10 flex items-center gap-2">
              <Target size={16} /> Set Goals
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-white border-none rounded-[16px] shadow-md p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 font-bold text-lg text-[#fbbf24]">
              <Trophy size={20} /> Hall of Fame
            </div>
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 h-8 text-xs font-bold p-0 flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Button>
          </div>
          <p className="flex-1 flex items-center justify-center text-sm font-medium opacity-60 text-center pb-4 italic">
            No champions yet. Start submitting reports!
          </p>
        </Card>

        <Card className="rounded-[16px] border border-gray-200 shadow-sm bg-white p-6 flex flex-col items-center text-center gap-4 group hover:shadow-md transition-shadow">
          <Badge className="bg-[#ef4444] text-white w-full h-8 rounded-[8px] justify-center text-[10px] font-bold uppercase tracking-widest border-none pointer-events-none">Daily Reports (DR)</Badge>
          <div className="text-4xl font-black text-[#0f172a]">0</div>
        </Card>

        <Card className="rounded-[16px] border border-gray-200 shadow-sm bg-white p-6 flex flex-col items-center text-center gap-4 group hover:shadow-md transition-shadow">
          <Badge className="bg-[#DA7756] text-white w-full h-8 rounded-[8px] justify-center text-[10px] font-bold uppercase tracking-widest border-none pointer-events-none">DR Pending</Badge>
          <div className="text-4xl font-black text-[#0f172a]">0</div>
        </Card>

        <Card className="rounded-[16px] border border-gray-200 shadow-sm bg-white p-6 flex flex-col items-center text-center gap-4 group hover:shadow-md transition-shadow">
          <Badge className="bg-[#3b82f6] text-white w-full h-8 rounded-[8px] justify-center text-[10px] font-bold uppercase tracking-widest border-none pointer-events-none">KPIs</Badge>
          <div className="text-4xl font-black text-[#0f172a]">0</div>
        </Card>
      </div>
    </div>
  );
};

export default BusinessCompassDashboard;