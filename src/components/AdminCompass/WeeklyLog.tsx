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
        <div className="mt-6 space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">
            {/* Header and Filter Row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 min-w-fit">
                    <div className="rounded-xl border border-[#DA7756]/15 bg-[#FAECE7] p-2">
                        <FileText className="w-5 h-5 text-[#DA7756]" />
                    </div>
                    <h2 className="text-sm font-bold text-[#1a1a1a] leading-tight">Weekly Review<br />Log</h2>
                </div>

                <div className="flex-1 flex items-center gap-2 rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DA7756]/50" />
                        <Input
                            placeholder="Search by user, email..."
                            className="h-8 rounded-xl border border-[#DA7756]/25 bg-white pl-10 placeholder:text-neutral-400"
                        />
                    </div>

                    <Select defaultValue="department">
                        <SelectTrigger className="w-[140px] h-8 rounded-xl border border-[#DA7756]/25 bg-white">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="department">Department</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="meeting">
                        <SelectTrigger className="w-[120px] h-8 rounded-xl border border-[#DA7756]/25 bg-white">
                            <SelectValue placeholder="Meeting" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="all-weeks">
                        <SelectTrigger className="w-[160px] h-8 rounded-xl border border-[#DA7756]/25 bg-white">
                            <SelectValue placeholder="All Weeks" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-weeks">All Weeks</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="h-8 gap-2 rounded-xl border border-[#DA7756]/25 bg-white px-4 text-neutral-700 hover:bg-[#fef6f4]">
                        <Layers className="w-4 h-4 text-[#DA7756]" />
                        Group
                    </Button>

                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl border border-[#DA7756]/25 bg-white text-[#DA7756] hover:bg-[#fef6f4]">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-2xl border border-[#DA7756]/18 shadow-sm bg-white">
                <Table>
                    <TableHeader className="bg-[#fef6f4]">
                        <TableRow className="hover:bg-transparent border-none h-12">
                            <TableHead className="text-[13px] font-bold text-neutral-500">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                    Week Of <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-neutral-500">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                    User <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-neutral-500">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                    Score <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-neutral-500">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                    Department <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-neutral-500">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                    Rating <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-neutral-500">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                    Submitted At <ArrowUpDown className="w-3.5 h-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-neutral-500 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logEntries.map((entry) => (
                            <TableRow key={entry.id} className="h-16 border-[#f3e6df] hover:bg-[#fef6f4]/50">
                                <TableCell className="text-sm font-bold text-gray-900">{entry.weekOf}</TableCell>
                                <TableCell>
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-bold text-gray-900">{entry.userName}</div>
                                        <div className="text-[11px] font-medium text-neutral-400">{entry.userEmail}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm font-medium text-neutral-400">{entry.score}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="rounded-[8px] border-[#DA7756]/20 bg-white px-3 py-1 text-[11px] font-bold text-neutral-700 !text-center">
                                        {entry.department}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className="flex w-fit items-center gap-1.5 rounded-[8px] bg-[#DA7756] px-2.5 text-white shadow-sm hover:bg-[#DA7756]">
                                        <Star className="w-3.5 h-3.5 fill-white" />
                                        <span className="text-[11px] font-bold">{entry.rating}</span>
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-0.5">
                                        <div className="text-[11px] font-bold text-neutral-500">{entry.submittedAt}</div>
                                        <div className="text-[11px] font-medium text-neutral-400">{entry.submittedTime}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-[#DA7756] hover:bg-[#fef6f4] hover:text-[#c9673f]">
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
