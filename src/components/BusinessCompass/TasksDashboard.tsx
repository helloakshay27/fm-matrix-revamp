import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Info,
    CheckCircle2,
    Clock,
    AlertTriangle,
    TrendingUp,
    Activity,
    Target,
    Calendar,
    Trophy,
    User
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const selfTrendData = [
    { name: 'W11', value: 0 },
    { name: 'W12', value: 0 },
    { name: 'W13', value: 0 },
    { name: 'W14', value: 0 },
];

const allTrendData = [
    { name: 'W11', value: 19 },
    { name: 'W12', value: 11 },
    { name: 'W13', value: 24 },
    { name: 'W14', value: 0 },
];

const departmentBreakdown = [
    { name: 'Engineering', total: 27, open: 4, closed: 23, stuck: 0, completion: '85%' },
    { name: 'Design', total: 16, open: 3, closed: 13, stuck: 0, completion: '81%' },
    { name: 'QA', total: 2, open: 2, closed: 0, stuck: 0, completion: '0%' },
    { name: 'Front End', total: 5, open: 3, closed: 2, stuck: 0, completion: '40%' },
    { name: 'Business Excellance', total: 19, open: 4, closed: 15, stuck: 0, completion: '79%' },
    { name: 'Client Servicing', total: 5, open: 1, closed: 4, stuck: 0, completion: '80%' },
    { name: 'Accounts', total: 3, open: 0, closed: 3, stuck: 0, completion: '100%' },
];

const topPerformers = [
    { name: 'Bilal Shaikh', tasks: 13, rank: 1, color: 'bg-orange-500' },
    { name: 'Kshitij Rasal', tasks: 13, rank: 2, color: 'bg-blue-300' },
    { name: 'Mahendra Lungare', tasks: 10, rank: 3, color: 'bg-orange-300' },
    { name: 'Adhip Shetty', tasks: 8, rank: 4, color: 'bg-blue-100' },
    { name: 'Yash Rathod', tasks: 7, rank: 5, color: 'bg-green-100' },
];

const overdueItems = [
    { title: 'New Webpages', user: 'Adhip Shetty', overdue: '1 days overdue', priority: 'medium', due: 'Mar 29, 2026' },
    { title: 'Shwan has been irresponsive on the webpage, slow and absent to connect almost every alternate day', user: 'Yash Rathod', overdue: '4 days overdue', priority: 'critical', due: 'Mar 26, 2026' },
    { title: 'Constant issues in Chennai Metro, Trill & Vi. Why?', user: 'Sadanand Gupta', overdue: '14 days overdue', priority: 'critical', due: 'Mar 16, 2026' },
    { title: 'Life compass issues', user: 'Akshay Shinde', overdue: '15 days overdue', priority: 'high', due: 'Mar 15, 2026' },
    { title: 'Spam Email Authentication', user: 'Fatema Tashrifwala', overdue: '25 days overdue', priority: 'medium', due: 'Mar 5, 2026' },
];

interface TasksDashboardProps {
    viewType: 'self' | 'all';
}

const TasksDashboard: React.FC<TasksDashboardProps> = ({ viewType }) => {
    const trendData = viewType === 'self' ? selfTrendData : allTrendData;
    const yAxisTicks = viewType === 'self' ? [0, 1, 2, 3, 4] : [0, 6, 12, 18, 24];
    const yAxisDomain = viewType === 'self' ? [0, 4] : [0, 24];

    return (
        <div className="space-y-6">
            {/* Filters Row — Business Compass theme */}
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm md:grid-cols-3">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-600">Time Range</label>
                    <Select defaultValue="this-month">
                        <SelectTrigger className="h-10 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="last-month">Last Month</SelectItem>
                            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">User</label>
                    <Select defaultValue="all-users">
                        <SelectTrigger className="h-10 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                            <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-users">All Users</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-600">Department</label>
                    <Select defaultValue="all-departments">
                        <SelectTrigger className="h-10 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-departments">All Departments</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Items */}
                <Card className="bg-[#EFF6FF] border-[#DBEAFE] shadow-none rounded-xl overflow-hidden relative group">
                    <CardContent className="p-5 flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#2563EB]">
                                <Info className="w-5 h-5" />
                                <span className="font-semibold text-sm">Total Items</span>
                            </div>
                            <div className="text-xs text-[#2563EB]/70 font-medium">
                                {viewType === 'self' ? '0 tasks, 0 issues' : '77 tasks, 0 issues'}
                            </div>
                        </div>
                        <div className="bg-[#2563EB] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            {viewType === 'self' ? '0' : '77'}
                        </div>
                    </CardContent>
                </Card>

                {/* Closed */}
                <Card className="bg-[#F0FDF4] border-[#DCFCE7] shadow-none rounded-xl overflow-hidden relative group">
                    <CardContent className="p-5 flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#16A34A]">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-semibold text-sm">Closed</span>
                            </div>
                            <div className="text-xs text-[#16A34A]/70 font-medium">
                                {viewType === 'self' ? '0% completion rate' : '78% completion rate'}
                            </div>
                        </div>
                        <div className="bg-[#16A34A] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            {viewType === 'self' ? '0' : '60'}
                        </div>
                    </CardContent>
                </Card>

                {/* In Progress */}
                <Card className="bg-[#FFF7ED] border-[#FFEDD5] shadow-none rounded-xl overflow-hidden relative group">
                    <CardContent className="p-5 flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#EA580C]">
                                <Clock className="w-5 h-5" />
                                <span className="font-semibold text-sm">In Progress</span>
                            </div>
                            <div className="text-xs text-[#EA580C]/70 font-medium">
                                {viewType === 'self' ? 'Avg 0% complete' : 'Avg 22% complete'}
                            </div>
                        </div>
                        <div className="bg-[#EA580C] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            {viewType === 'self' ? '0' : '17'}
                        </div>
                    </CardContent>
                </Card>

                {/* Overdue */}
                <Card className="bg-[#FEF2F2] border-[#FEE2E2] shadow-none rounded-xl overflow-hidden relative group">
                    <CardContent className="p-5 flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#DC2626]">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="font-semibold text-sm">Overdue</span>
                            </div>
                            <div className="text-xs text-[#DC2626]/70 font-medium">0 critical, 0 high priority</div>
                        </div>
                        <div className="bg-[#DC2626] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            0
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Distribution Row — Business Compass theme (not stark white) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
                    <CardHeader className="border-b border-[#DA7756]/15 bg-[#fef6f4]/60 pb-3">
                        <div className="flex items-center gap-2 text-neutral-900">
                            <TrendingUp className="h-4 w-4 text-[#DA7756]" />
                            <CardTitle className="text-base font-bold">Status Distribution</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center justify-center bg-[#f6f4ee]/40 text-sm font-medium text-neutral-500">
                        No data available
                    </CardContent>
                </Card>

                <Card className="flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
                    <CardHeader className="border-b border-[#DA7756]/15 bg-[#fef6f4]/60 pb-3">
                        <div className="flex items-center gap-2 text-neutral-900">
                            <Target className="h-4 w-4 text-[#DA7756]" />
                            <CardTitle className="text-base font-bold">Priority Breakdown</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center justify-center bg-[#f6f4ee]/40 text-sm font-medium text-neutral-500">
                        No data available
                    </CardContent>
                </Card>
            </div>

            {/* Trend Row */}
            <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
                <CardHeader className="border-b border-[#DA7756]/15 bg-[#fef6f4]/60 pb-3">
                    <div className="flex items-center gap-2 text-neutral-900">
                        <Calendar className="h-4 w-4 text-[#DA7756]" />
                        <CardTitle className="text-base font-bold">Completion Trend (Last 4 Weeks)</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="h-[300px] bg-[#f6f4ee]/40 pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="rgba(218, 119, 86, 0.18)" />
                            <XAxis
                                dataKey="name"
                                axisLine={true}
                                tickLine={true}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                                stroke="#E5E7EB"
                            />
                            <YAxis
                                axisLine={true}
                                tickLine={true}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dx={-10}
                                domain={yAxisDomain}
                                ticks={yAxisTicks}
                                stroke="#E5E7EB"
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid rgba(218, 119, 86, 0.35)',
                                    background: '#fef6f4',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
                                }}
                                labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#1a1a1a' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#DA7756"
                                strokeWidth={2}
                                dot={{ fill: '#DA7756', strokeWidth: 2, r: 4, stroke: '#fef6f4' }}
                                activeDot={{ r: 6 }}
                                name="closed"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Department Breakdown Row - Only for 'all' view */}
            {viewType === 'all' && (
                <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
                    <CardHeader className="border-b border-[#DA7756]/15 bg-[#fef6f4]/60 pb-3">
                        <div className="flex items-center gap-2 text-neutral-900">
                            <TrendingUp className="h-4 w-4 text-[#DA7756]" />
                            <CardTitle className="text-base font-bold">Department Breakdown</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="bg-[#f6f4ee]/40 p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#fef6f4]/80 hover:bg-[#fef6f4]/80">
                                        <TableHead className="text-xs font-bold text-gray-600 h-11">Department</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-600 h-11 text-center">Total</TableHead>
                                        <TableHead className="text-xs font-bold text-[#2563EB] h-11 text-center">Open</TableHead>
                                        <TableHead className="text-xs font-bold text-[#16A34A] h-11 text-center">Closed</TableHead>
                                        <TableHead className="text-xs font-bold text-[#DC2626] h-11 text-center">Stuck</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-600 h-11 text-center">Completion %</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {departmentBreakdown.map((dept) => (
                                        <TableRow key={dept.name} className="hover:bg-[#fef6f4]/70">
                                            <TableCell className="text-sm font-medium text-gray-700 py-3">{dept.name}</TableCell>
                                            <TableCell className="text-sm text-center font-medium text-gray-900">{dept.total}</TableCell>
                                            <TableCell className="text-center py-3">
                                                <span className="bg-blue-50 text-[#2563EB] text-xs font-bold px-3 py-1 rounded-md min-w-[32px] inline-block">
                                                    {dept.open}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center py-3">
                                                <span className="bg-green-50 text-[#16A34A] text-xs font-bold px-3 py-1 rounded-md min-w-[32px] inline-block">
                                                    {dept.closed}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center py-3">
                                                <span className="bg-red-50 text-[#DC2626] text-xs font-bold px-3 py-1 rounded-md min-w-[32px] inline-block">
                                                    {dept.stuck}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-center font-bold text-gray-900">{dept.completion}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Top Performers and Overdue Items - Only for 'all' view */}
            {viewType === 'all' && (
                <div className="grid grid-cols-1 gap-6 mt-6">
                    {/* Top Performers */}
                    <Card className="border-[#FFEDD5] bg-[#FFFBF5] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="pb-3 pt-4 px-6 border-b border-[#FFEDD5]/50">
                            <div className="flex items-center gap-2 text-[#EA580C]">
                                <Trophy className="w-5 h-5" />
                                <CardTitle className="text-base font-bold">Top Performers (Most Tasks Closed)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {topPerformers.map((performer) => (
                                <div key={performer.rank} className="flex items-center justify-between rounded-xl border border-[#FFEDD5] bg-[#fef6f4] p-3 transition-all group hover:shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm",
                                            performer.rank === 1 ? "bg-[#F59E0B]" :
                                                performer.rank === 2 ? "bg-[#94A3B8]" :
                                                    performer.rank === 3 ? "bg-[#D97706]" : "bg-[#CBD5E1]"
                                        )}>
                                            {performer.rank}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800">{performer.name}</h4>
                                            <p className="text-[11px] text-gray-500 font-medium">{performer.tasks} tasks completed</p>
                                        </div>
                                    </div>
                                    {performer.rank <= 3 && (
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shadow-sm border",
                                            performer.rank === 1 ? "bg-orange-50 border-orange-200 text-orange-500" :
                                                performer.rank === 2 ? "bg-blue-50 border-blue-200 text-blue-500" :
                                                    "bg-orange-50 border-orange-200 text-orange-500"
                                        )}>
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Overdue Items */}
                    <Card className="border-[#FEE2E2] bg-[#FFF5F5] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="pb-3 pt-4 px-6 border-b border-[#FEE2E2]/50">
                            <div className="flex items-center gap-2 text-[#DC2626]">
                                <AlertTriangle className="w-5 h-5" />
                                <CardTitle className="text-base font-bold">Overdue Items (6)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <ScrollArea className="h-[450px] pr-4">
                                <div className="space-y-3">
                                    {overdueItems.map((item, idx) => (
                                        <div key={idx} className="relative space-y-3 rounded-xl border border-[#FEE2E2] bg-[#fef6f4] p-4 transition-all group hover:shadow-sm">
                                            <div className="flex justify-between items-start gap-4">
                                                <h4 className="text-sm font-bold text-gray-800 flex-1 leading-snug">{item.title}</h4>
                                                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">Due: {item.due}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="outline" className="bg-gray-50 border-gray-100 text-gray-600 rounded-[8px] flex items-center gap-1.5 text-[11px]">
                                                    <User className="w-3 h-3" />
                                                    {item.user}
                                                </Badge>
                                                <Badge className="bg-red-50 hover:bg-red-50 border-red-100 text-[#DC2626] rounded-[8px] flex items-center gap-1.5 text-[11px]">
                                                    <Calendar className="w-3 h-3" />
                                                    {item.overdue}
                                                </Badge>
                                                <Badge
                                                    className={cn(
                                                        "uppercase rounded-[8px] text-[11px]",
                                                        item.priority === 'critical' ? "bg-[#F59E0B] hover:bg-[#F59E0B] text-white" :
                                                            item.priority === 'high' ? "bg-slate-500 hover:bg-slate-500 text-white" :
                                                                "bg-slate-400 hover:bg-slate-400 text-white"
                                                    )}
                                                >
                                                    {item.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TasksDashboard;
