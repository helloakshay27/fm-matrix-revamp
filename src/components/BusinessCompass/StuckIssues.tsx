import React from 'react';
import {
    AlertTriangle,
    ChevronDown,
    RefreshCw,
    Search,
    ChevronRight,
    User,
    Calendar
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface StuckUser {
    id: string;
    name: string;
    department: string;
    email: string;
    criticalCount: number;
    totalIssues: number;
    bgColor: string;
    borderColor: string;
    tagColor: string;
    issues: StuckIssueData[];
}

interface StuckIssueData {
    id: string;
    title: string;
    createdBy: string;
    createdDate: string;
    daysStuck: number;
}

const stuckUsers: StuckUser[] = [
    {
        id: '1',
        name: 'Bilal Shaikh',
        department: 'Engineering',
        email: 'bilal.shaikh@lockated.com',
        criticalCount: 1,
        totalIssues: 1,
        bgColor: 'bg-[#FFF1F2]',
        borderColor: 'border-[#FECDD3]',
        tagColor: 'bg-[#E11D48]',
        issues: [
            {
                id: 'i1',
                title: "FM 'App is still not live on IOS, causing a lot of client impact",
                createdBy: 'chetan.bafna@lockated.com',
                createdDate: 'Mar 4, 2026',
                daysStuck: 26
            }
        ]
    },
    {
        id: '2',
        name: 'Yash Rathod',
        department: 'Business Excellance',
        email: 'yash.rathod@lockated.com',
        criticalCount: 0,
        totalIssues: 1,
        bgColor: 'bg-[#FFFBEB]',
        borderColor: 'border-[#FEF3C7]',
        tagColor: 'bg-[#D97706]',
        issues: [
            {
                id: 'i2',
                title: "Integration issues with client reporting system",
                createdBy: 'yash.rathod@lockated.com',
                createdDate: 'Mar 15, 2026',
                daysStuck: 15
            }
        ]
    }
];

const IssueCard = ({ issue }: { issue: StuckIssueData }) => {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4 shadow-sm transition-all group hover:border-[#DA7756]/25 hover:shadow-md">
            <Checkbox className="mt-1.5 border-gray-300 rounded-[4px] shrink-0" />

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <h4 className="text-[15px] font-bold text-[#1a1a1a] leading-tight">
                        {issue.title}
                    </h4>
                    <Badge className="bg-[#DC2626] hover:bg-[#DC2626] text-white px-2.5 py-1 rounded-[6px] text-xs font-bold shrink-0">
                        {issue.daysStuck} days
                    </Badge>
                </div>

                <div className="flex items-center gap-4 mt-2.5 text-[13px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Created by: {issue.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{issue.createdDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StuckIssues = () => {
    return (
        <div className="space-y-6">
            {/* One framed surface: stats + filters (no stacked white cards) */}
            <div className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="stats" className="border-0 shadow-none">
                    <AccordionTrigger className="border-b border-[#DA7756]/15 bg-[#f6f4ee]/80 px-4 py-4 hover:no-underline [&>svg]:text-gray-400">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-[#EA580C] font-bold">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Stuck Issues Statistics</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-[#EA580C] hover:bg-[#EA580C] text-white px-3 rounded-[8px] text-xs">
                                    Total: 2
                                </Badge>
                                <Badge className="bg-[#DC2626] hover:bg-[#DC2626] text-white px-3 rounded-[8px] text-xs">
                                    Critical (7+ days): 1
                                </Badge>
                                <Badge className="bg-[#D97706] hover:bg-[#D97706] text-white px-3 rounded-[8px] text-xs">
                                    Avg: 15 days
                                </Badge>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-[#DA7756]/10 bg-[#f6f4ee]/70 px-4 pb-6 pt-4">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">By Department:</h4>
                            <div className="flex flex-wrap gap-4">
                                <div className="min-w-[180px] space-y-1 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] p-4">
                                    <div className="text-2xl font-bold text-[#1a1a1a]">1</div>
                                    <div className="text-xs font-medium text-gray-500">Engineering</div>
                                </div>
                                <div className="min-w-[180px] space-y-1 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] p-4">
                                    <div className="text-2xl font-bold text-[#1a1a1a]">1</div>
                                    <div className="text-xs font-medium text-gray-500">Business Excellance</div>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="space-y-5 border-t border-[#DA7756]/15 bg-[#f6f4ee]/70 p-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-500">Filter by User</label>
                        <Select defaultValue="all-users">
                            <SelectTrigger className="h-10 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                                <SelectValue placeholder="All Users" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-users">All Users</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-500">Filter by Days Stuck</label>
                        <Select defaultValue="all-days">
                            <SelectTrigger className="h-10 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                                <SelectValue placeholder="All Days" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-days">All Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-500">Sort By</label>
                        <Select defaultValue="days-stuck">
                            <SelectTrigger className="h-10 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                                <SelectValue placeholder="Days Stuck" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="days-stuck">Days Stuck</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-500">Search Keywords</label>
                        <Input
                            placeholder="Search..."
                            className="h-10 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] pl-4 shadow-sm placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Checkbox id="select-all" className="border-gray-300 rounded-[4px]" />
                    <label htmlFor="select-all" className="text-[13px] font-medium text-gray-600 cursor-pointer">
                        Select All Filtered Issues (2)
                    </label>
                </div>

                <Separator className="bg-[#DA7756]/15" />

                <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" className="h-9 gap-2 rounded-xl border-[#DA7756]/25 px-4 font-medium text-gray-700 shadow-sm hover:bg-[#fef6f4]">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </Button>
                    <Button variant="outline" className="h-9 rounded-xl border-[#DA7756]/25 px-4 font-medium text-gray-700 shadow-sm hover:bg-[#fef6f4]">
                        Show Resolved
                    </Button>
                </div>
            </div>
            </div>

            {/* Stuck Users List */}
            <div className="space-y-4">
                <Accordion type="single" collapsible className="w-full space-y-4 border-none">
                    {stuckUsers.map((user) => (
                        <AccordionItem
                            key={user.id}
                            value={user.id}
                            className={cn(
                                "border rounded-[20px] px-6 py-2 transition-all shadow-sm overflow-hidden",
                                user.bgColor,
                                user.borderColor
                            )}
                        >
                            <AccordionTrigger className="hover:no-underline py-4 [&>svg]:hidden">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-[#1a1a1a]">{user.name}</h3>
                                                <Badge className={cn(
                                                    "text-[10px] font-bold px-2 rounded-[8px] text-white uppercase",
                                                    user.tagColor
                                                )}>
                                                    {user.department}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-gray-500 mt-0.5">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mr-4">
                                        {user.criticalCount > 0 && (
                                            <Badge className="bg-[#E11D48] hover:bg-[#E11D48] text-white px-3 rounded-[8px] text-xs font-bold shadow-sm">
                                                {user.criticalCount} Critical (7+ days)
                                            </Badge>
                                        )}
                                        <Badge className={cn(
                                            "text-white px-3 rounded-[8px] text-xs font-bold shadow-sm",
                                            user.tagColor,
                                            "hover:" + user.tagColor
                                        )}>
                                            {user.totalIssues} Issue
                                        </Badge>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-6 border-t border-black/5 mt-2 px-4">
                                <div className="space-y-3">
                                    {user.issues.map((issue) => (
                                        <IssueCard key={issue.id} issue={issue} />
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default StuckIssues;
