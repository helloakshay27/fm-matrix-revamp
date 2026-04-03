import React from 'react';
import {
    Search,
    ChevronDown,
    RefreshCw,
    Layers,
    Eye,
    FileText,
    ArrowUpDown,
    Star
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface WeeklyLogEntry {
    id: string;
    weekOf: string;
    userName: string;
    userEmail: string;
    score: string;
    department: string;
    rating: string;
    submittedAt: string;
    submittedTime: string;
}

const logEntries: WeeklyLogEntry[] = [
    {
        id: '1',
        weekOf: 'Wk 5, Jan 26',
        userName: 'Yash Rathod',
        userEmail: 'yash.rathod@lockated.com',
        score: '-',
        department: 'Business Excellance',
        rating: '10/10',
        submittedAt: 'Feb 6, 2026',
        submittedTime: '6:31 PM'
    }
];

const WeeklyLog = () => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6 mt-6">
            {/* Header and Filter Row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 min-w-fit">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-sm font-bold text-[#1a1a1a] leading-tight">Weekly Review<br />Log</h2>
                </div>

                <div className="flex-1 flex items-center gap-2 bg-primary p-3 rounded-xl border border-gray-100">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by user, email..."
                            className="h-8 pl-10 bg-white border-gray-200 rounded-[8px] placeholder:text-gray-400"
                        />
                    </div>

                    <Select defaultValue="department">
                        <SelectTrigger className="w-[140px] h-8 bg-white border-gray-200 rounded-[8px]">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="department">Department</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="meeting">
                        <SelectTrigger className="w-[120px] h-8 bg-white border-gray-200 rounded-[8px]">
                            <SelectValue placeholder="Meeting" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="all-weeks">
                        <SelectTrigger className="w-[160px] h-8 bg-white border-gray-200 rounded-[8px]">
                            <SelectValue placeholder="All Weeks" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-weeks">All Weeks</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="h-8 px-4 !bg-white !border-gray-200 rounded-[8px] !text-gray-700 gap-2">
                        <Layers className="w-4 h-4" />
                        Group
                    </Button>

                    <Button variant="outline" size="icon" className="h-8 w-8 !bg-white !border-gray-200 rounded-[8px] !text-gray-500">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-[#F8F7FF]">
                        <TableRow className="hover:bg-transparent border-none h-12">
                            <TableHead className="text-[13px] font-bold text-[#6B7280]">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">
                                    Week Of <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-[#6B7280]">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">
                                    User <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-[#6B7280]">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">
                                    Score <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-[#6B7280]">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">
                                    Department <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-[#6B7280]">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">
                                    Rating <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-[#6B7280]">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">
                                    Submitted At <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-[#6B7280] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logEntries.map((entry) => (
                            <TableRow key={entry.id} className="hover:bg-gray-50/50 border-gray-50 h-16">
                                <TableCell className="text-sm font-bold text-gray-900">{entry.weekOf}</TableCell>
                                <TableCell>
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-bold text-gray-900">{entry.userName}</div>
                                        <div className="text-[11px] font-medium text-gray-400">{entry.userEmail}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm font-medium text-gray-400">{entry.score}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-white border-gray-200 text-gray-700 font-bold px-3 py-1 rounded-[8px] text-[11px] !text-center">
                                        {entry.department}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-[#EA580C] hover:bg-[#EA580C] text-white px-2.5 rounded-[8px] flex items-center gap-1.5 w-fit shadow-sm">
                                        <Star className="w-3.5 h-3.5 fill-white" />
                                        <span className="text-[11px] font-bold">{entry.rating}</span>
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-0.5">
                                        <div className="text-[11px] font-bold text-gray-500">{entry.submittedAt}</div>
                                        <div className="text-[11px] font-medium text-gray-400">{entry.submittedTime}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-500 hover:text-purple-700 hover:bg-purple-50">
                                        <Eye size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default WeeklyLog;
