import React from 'react';
import { Calendar, Info, TrendingUp, AlertCircle, Trophy, Plus, Upload, CheckSquare, Lightbulb, AlertTriangle, X, Star, Target, MessageSquare, Activity, Send, Zap, Flag, Smile, Users, User, ChevronUp, ChevronDown } from 'lucide-react';
import { AdminViewEmulation } from '@/components/AdminViewEmulation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const BusinessWeeklyReport = () => {
    const [wins, setWins] = React.useState<string[]>([]);
    const [dayPlans, setDayPlans] = React.useState<Record<string, string[]>>({});

    const handleAddWin = () => {
        setWins([...wins, ""]);
    };

    const handleRemoveWin = (index: number) => {
        setWins(wins.filter((_, i) => i !== index));
    };

    const handleWinChange = (index: number, value: string) => {
        const newWins = [...wins];
        newWins[index] = value;
        setWins(newWins);
    };

    const handleAddPlan = (day: string) => {
        setDayPlans(prev => ({
            ...prev,
            [day]: [...(prev[day] || []), ""]
        }));
    };

    const handleRemovePlan = (day: string, index: number) => {
        setDayPlans(prev => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }));
    };

    const handlePlanChange = (day: string, index: number, value: string) => {
        const newPlans = [...(dayPlans[day] || [])];
        newPlans[index] = value;
        setDayPlans(prev => ({
            ...prev,
            [day]: newPlans
        }));
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <AdminViewEmulation />
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a]">Weekly Report</h1>
                    <p className="text-gray-500 mt-1">Track your weekly KPI performance and insights</p>
                </div>
            </div>

            <Tabs defaultValue="submit" className="w-full">
                <TabsList className="bg-[#F5F5F5] p-1 rounded-[8px] h-auto inline-flex shadow-inner">
                    <TabsTrigger
                        value="submit"
                        className="rounded-[6px] px-6 py-1.5 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm bg-transparent text-gray-500 transition-all font-medium"
                    >
                        Submit Review
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="rounded-[6px] px-6 py-1.5 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm bg-transparent text-gray-500 transition-all font-medium"
                    >
                        Review History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="submit" className="space-y-6 mt-4">
                    {/* Date Selection Card */}
                    <Card className="bg-primary text-[#2C2C2C] p-6 rounded-[12px] border border-border shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-[#2C2C2C]" />
                            <span className="text-lg font-semibold">Mar 2026</span>
                        </div>

                        <div className="bg-[hsla(42,25%,69%,0.3)] py-2 px-4 rounded-[8px] text-center mb-4 text-sm font-medium">
                            Filling Report for Week #13, Mar 23 - Mar 29
                        </div>

                        <div className="flex gap-3">
                            <div className="bg-[hsla(42,25%,69%,0.3)] flex items-center gap-3 px-4 py-2 rounded-[8px] text-[#2C2C2C]">
                                <span className="text-sm">W12 Mar 16-22</span>
                                <AlertCircle className="w-4 h-4 text-[#2C2C2C]" />
                            </div>
                            <div className="bg-[hsla(42,25%,69%,0.3)] flex items-center gap-3 px-4 py-2 rounded-[8px]">
                                <span className="text-sm font-medium">W13 Mar 23-29</span>
                                <Badge className="bg-white text-[#2C2C2C] hover:bg-white text-[10px] font-bold px-2 py-0">FILL NOW</Badge>
                            </div>
                        </div>
                    </Card>

                    {/* KPI Content Card */}
                    <Card className="border-2 border-[#805AD5] rounded-[16px] overflow-hidden bg-white shadow-sm">
                        <div className="bg-[#EDF2FF] p-4 flex justify-between items-start border-b border-[#805AD5]/20">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-[#805AD5]" />
                                    <h3 className="font-bold text-[#1a1a1a] flex items-center gap-1">
                                        Past Weeks KPIs
                                        <Info className="w-4 h-4 text-gray-400" />
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                    💡 Enter actual values for this week and plan for next week. Track your key metrics.
                                </p>
                            </div>
                            <Badge className="bg-[#805AD5] hover:bg-[#805AD5] text-white px-3 py-1 rounded-[6px] text-xs">
                                0/20 pts
                            </Badge>
                        </div>

                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <p className="text-gray-400 text-lg">No KPIs assigned for this period</p>
                        </div>
                    </Card>

                    {/* Your Achievements Card */}
                    <Card className="border-2 border-[#10B981] rounded-[16px] overflow-hidden bg-white shadow-sm">
                        <div className="bg-[#ECFDF5] p-4 flex justify-between items-center border-b border-[#10B981]/20">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-[#10B981]" />
                                <h3 className="font-bold text-[#1a1a1a] flex items-center gap-1">
                                    Your Achievements
                                    <Info className="w-4 h-4 text-gray-400" />
                                </h3>
                            </div>
                            <Badge className="bg-[#10B981] hover:bg-[#10B981] text-white px-3 py-1 rounded-[6px] text-xs font-bold">
                                0/6 pts
                            </Badge>
                        </div>

                        <div className="p-6 space-y-4">
                            {wins.map((win, index) => (
                                <div key={index} className="flex gap-3 items-start p-4 border border-gray-100 rounded-[8px] relative group bg-[#FAFAFA]">
                                    <Checkbox className="mt-1 border-blue-500 data-[state=checked]:bg-blue-500 rounded-[3px]" defaultChecked />
                                    <Star className="w-4 h-4 mt-1 text-gray-300 cursor-pointer hover:text-yellow-400" />
                                    <Textarea
                                        value={win}
                                        onChange={(e) => handleWinChange(index, e.target.value)}
                                        placeholder="Describe your win..."
                                        className="min-h-[60px] resize-none border-none focus-visible:ring-0 p-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400"
                                    />
                                    <button
                                        onClick={() => handleRemoveWin(index)}
                                        className="text-red-400 hover:text-red-600 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-dashed border-2 border-[#3182CE] text-[#3182CE] hover:bg-blue-50 h-12 rounded-[8px] font-medium"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Import Daily Wins (last week's)
                                </Button>
                                <Button
                                    onClick={handleAddWin}
                                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white h-12 rounded-[8px] font-bold"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Win
                                </Button>
                            </div>

                            <Button
                                className="w-full bg-[#E65100] hover:bg-[#D84315] text-white h-12 rounded-[8px] font-bold uppercase tracking-wide"
                            >
                                Carry Forward Uncompleted
                            </Button>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2 text-[11px] text-[#059669] font-medium">
                                    <Info className="w-4 h-4" />
                                    <span>Limits: Images 2MB, Others 5MB</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-400">0/5</span>
                                    <Button
                                        size="sm"
                                        className="bg-[#10B981] hover:bg-[#059669] text-white rounded-[6px] px-4 font-bold"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        File Upload
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Tasks & Issues Card */}
                    <Card className="border-2 border-[#C05621] rounded-[16px] overflow-hidden bg-white shadow-sm">
                        <div className="bg-[#FFF5F5] p-4 flex justify-between items-start border-b border-[#C05621]/20">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-[#C05621]" />
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[#1a1a1a]">Tasks & Issues</h3>
                                        <Badge className="bg-[#E65100] hover:bg-[#E65100] text-white px-2 py-0.5 rounded-[6px] text-[10px] font-bold">
                                            0/10 pts
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Check the box for completed items to mark them completed.
                                </p>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="bg-[#E1F5FE] text-[#0288D1] border-none rounded-[6px] px-3 py-1 font-bold text-[10px] flex items-center gap-1">
                                        <CheckSquare className="w-3 h-3" /> Closed: 0
                                    </Badge>
                                    <Badge variant="outline" className="bg-[#E3F2FD] text-[#1976D2] border-none rounded-[6px] px-3 py-1 font-bold text-[10px] flex items-center gap-1">
                                        <Info className="w-3 h-3" /> Open: 0
                                    </Badge>
                                    <Badge variant="outline" className="bg-[#FFEBEE] text-[#D32F2F] border-none rounded-[6px] px-3 py-1 font-bold text-[10px] flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Overdue: 0
                                    </Badge>
                                </div>
                            </div>
                            <Button
                                className="bg-[#E65100] hover:bg-[#D84315] text-white rounded-[8px] px-6 font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
                            <CheckSquare className="w-12 h-12 text-gray-200" />
                            <p className="text-gray-400 text-lg">No open tasks or issues</p>
                        </div>
                    </Card>

                    {/* Bottom Tip Section */}
                    <div className="bg-[#FFFFCC] border border-[#FDE68A] p-3 rounded-[8px] flex items-center gap-3 shadow-sm">
                        <Lightbulb className="w-5 h-5 text-[#D97706]" />
                        <p className="text-sm text-gray-800">
                            <span className="font-bold">The Bottleneck:</span> What is the #1 thing holding your team back this week? Put solving it on the schedule.
                        </p>
                    </div>

                    {/* Plan for Coming Week */}
                    <Card className="border-2 border-[#3182CE] rounded-[16px] overflow-hidden bg-white shadow-sm">
                        <div className="bg-[#EBF8FF] p-4 flex justify-between items-center border-b border-[#3182CE]/20">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-[#3182CE]" />
                                <h3 className="font-bold text-[#1a1a1a]">Plan for Coming Week</h3>
                                <Badge className="bg-[#E67E22] text-white px-2 py-0.5 rounded-[6px] text-[10px] font-bold">0/5</Badge>
                                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className="bg-[#5856D6] text-white px-3 py-1 rounded-[6px] text-xs font-bold">0/20 pts</Badge>
                                <Button variant="outline" className="border-[#3182CE] text-[#3182CE] h-8 text-xs font-bold rounded-[6px] hover:bg-blue-50">
                                    Important & Not Urgent
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 bg-[#F7FAFC] border-b border-[#3182CE]/10">
                            <p className="text-[11px] text-gray-600 flex items-center gap-1 italic">
                                💡 Focus on High Impact activities. What are your big rocks for next week?
                            </p>
                        </div>
                        <div className="p-4 space-y-2">
                            {[
                                { day: "Sun (29 Mar)", label: "Sunday", color: "bg-[#F7FAFC]" },
                                { day: "Mon (30 Mar)", label: "Monday", color: "bg-[#EBF8FF]", canAdd: true },
                                { day: "Tue (31 Mar)", label: "Tuesday", color: "bg-[#F0FFF4]", canAdd: true },
                                { day: "Wed (1 Apr)", label: "Wednesday", color: "bg-[#FFFFF0]", canAdd: true },
                                { day: "Thu (2 Apr)", label: "Thursday", color: "bg-[#FAF5FF]", canAdd: true },
                                { day: "Fri (3 Apr)", label: "Friday", color: "bg-[#FFF5F5]", canAdd: true },
                                { day: "Sat (4 Apr)", label: "Saturday", color: "bg-[#F7FAFC]" },
                            ].map((day, i) => (
                                <div key={i} className="space-y-2">
                                    <div className={`flex items-center justify-between p-3 rounded-[8px] border border-gray-100 ${day.color}`}>
                                        <span className={`text-sm font-bold ${day.canAdd ? "text-[#3182CE]" : "text-gray-400"}`}>{day.day}</span>
                                        {day.canAdd ? (
                                            <button
                                                onClick={() => handleAddPlan(day.day)}
                                                className="flex items-center gap-1 text-[#3182CE] text-xs font-bold hover:underline"
                                            >
                                                <Plus className="w-3 h-3" /> Add
                                            </button>
                                        ) : (
                                            <Badge variant="outline" className="text-gray-400 border-gray-300 text-[10px] rounded-[6px] px-2">{day.label}</Badge>
                                        )}
                                    </div>

                                    {dayPlans[day.day]?.map((plan, index) => (
                                        <div key={index} className="flex gap-3 items-start p-4 border border-gray-100 rounded-[8px] bg-white ml-2">
                                            <Star className="w-4 h-4 mt-1 text-gray-300 cursor-pointer hover:text-yellow-400" />
                                            <Textarea
                                                value={plan}
                                                onChange={(e) => handlePlanChange(day.day, index, e.target.value)}
                                                placeholder="What's your strategic priority?"
                                                className="min-h-[60px] resize-none border border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-400 rounded-[6px] p-3 text-sm text-gray-700 placeholder:text-gray-400 flex-1"
                                            />
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => handleRemovePlan(day.day, index)} className="text-red-400 hover:text-red-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="flex flex-col gap-1 text-gray-400">
                                                    <ChevronUp className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                                                    <ChevronDown className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                                                </div>
                                                <Calendar className="w-4 h-4 text-blue-500 cursor-pointer" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Remarks Section */}
                    <Card className="border-2 border-[#3182CE] rounded-[16px] overflow-hidden bg-white shadow-sm p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Flag className="w-5 h-5 text-[#E3342F]" />
                                <h3 className="font-bold text-[#1a1a1a]">Remarks</h3>
                            </div>
                            <Badge className="bg-[#E3342F] text-white px-3 py-1 rounded-[6px] text-xs font-bold">0/14 pts</Badge>
                        </div>

                        <div className="border-2 border-dashed border-gray-200 rounded-[12px] p-4 space-y-4">
                            <div className="flex gap-2">
                                {[
                                    { icon: Activity, label: "Breakthrough" },
                                    { icon: TrendingUp, label: "Breakdown" },
                                    { icon: MessageSquare, label: "Remark", active: true },
                                    { icon: Users, label: "Client Feedback" },
                                    { icon: Smile, label: "Employee Feedback" },
                                ].map((tab, i) => (
                                    <Button
                                        key={i}
                                        variant="outline"
                                        className={`h-8 text-[10px] px-3 gap-1.5 rounded-[6px] border border-gray-200 font-bold ${tab.active ? "bg-[#3182CE] text-white border-[#3182CE] hover:bg-[#2B6CB0] hover:text-white" : "bg-[#F7FAFC] text-gray-400 hover:bg-gray-100"}`}
                                    >
                                        <tab.icon className="w-3 h-3" />
                                        {tab.label}
                                    </Button>
                                ))}
                            </div>
                            <Textarea
                                placeholder="Enter at least one breakthrough, one breakdown, one employee and one client feedback. Link any comment to the KPIs given below by clicking on them then pressing 'Add Comment'."
                                className="min-h-[100px] rounded-[8px] px-4 py-2 focus-visible:ring-0 text-xs text-gray-600 placeholder:text-gray-400 bg-transparent resize-none shadow-md"
                            />
                            <Button className="w-full bg-[#3182CE]/50 hover:bg-[#3182CE] text-white h-10 rounded-[8px] font-bold">
                                <Plus className="w-4 h-4 mr-2" /> Add Remark
                            </Button>
                        </div>

                        {/* Automated Score Card */}
                        <div className="border border-red-200 rounded-[12px] overflow-hidden bg-[#FFF5F5]">
                            <div className="p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-[#E3342F]" />
                                        <h4 className="text-sm font-bold text-[#1a1a1a]">Automated Weekly Score <Info className="w-3 h-3 text-gray-400 inline cursor-pointer" /></h4>
                                    </div>
                                    <span className="text-2xl font-black text-[#E3342F]">0/100</span>
                                </div>
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 italic">
                                    📊 Based on KPIs, achievements, tasks, planning, SOPs, and feedback.
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { label: "Weekly KPI:", score: "0/20" },
                                        { label: "Daily KPI:", score: "0/10" },
                                        { label: "Starred Wins:", score: "0/6" },
                                        { label: "Tasks:", score: "0/10" },
                                        { label: "SOPs:", score: "0.0/20" },
                                        { label: "Planning:", score: "0/20" },
                                        { label: "Remarks:", score: "0/14" },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-2 rounded-[4px] border border-gray-100">
                                            <p className="text-[9px] text-gray-400">{stat.label}</p>
                                            <p className="text-xs font-bold text-black">{stat.score}</p>
                                        </div>
                                    ))}
                                </div>

                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="details" className="border-none">
                                        <AccordionTrigger className="hover:no-underline py-2 text-xs font-bold text-gray-700">
                                            Detailed Score Calculation <span className="text-[10px] font-normal text-gray-400 ml-2">(Click here to expand)</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-[10px] text-gray-500 p-2 bg-white/50 rounded-md mt-1">
                                            The score is calculated based on completed KPIs, recorded achievements, on-time tasks, and feedback provided.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>

                        <Button className="w-full bg-[#3182CE] hover:bg-[#2B6CB0] text-white h-12 rounded-[8px] font-bold text-sm shadow-lg">
                            <Send className="w-4 h-4 mr-2" /> Submit for 23 Mar - 29 Mar
                        </Button>
                    </Card>

                    {/* Bonus Opportunity Banner */}
                    <div className="bg-[#F0FFF4] border border-[#C6F6D5] p-3 rounded-[12px] flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#48BB78] rounded-[8px]">
                                <Zap className="w-4 h-4 text-white fill-white" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">🎯</span>
                                    <span className="text-sm font-bold text-[#276749]">Bonus Opportunity!</span>
                                    <Badge className="bg-[#38A169] text-white text-[10px] font-bold px-2 py-0.5 rounded-[6px]">🏆 +50 pts</Badge>
                                </div>
                                <p className="text-xs text-[#2F855A]">Submit within the week + 1 day to earn +50 bonus points!</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                    <Card className="p-12 text-center text-gray-500 bg-white border rounded-[12px] shadow-sm">
                        No review history found.
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BusinessWeeklyReport;