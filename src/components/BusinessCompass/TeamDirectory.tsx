import React from 'react';
import { Search, Mail, Eye, Brain } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
    departmentColor: string;
    bgColor: string;
    borderColor: string;
    avatarColor: string;
    discScore?: string;
    discLabel?: string;
}

const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Adhip Shetty',
        role: 'Team Member',
        department: 'Business Excellance',
        departmentColor: 'bg-[#3B82F6]',
        bgColor: 'bg-[#F0F7FF]',
        borderColor: 'border-[#D1E5FF]',
        avatarColor: 'bg-[#1D4ED8]',
    },
    {
        id: '2',
        name: 'Akshay Shinde',
        role: 'Team Member',
        department: 'Front End',
        departmentColor: 'bg-[#3B82F6]',
        bgColor: 'bg-[#FAF5FF]',
        borderColor: 'border-[#F3E8FF]',
        avatarColor: 'bg-[#9333EA]',
        discScore: '7415',
        discLabel: '"Creative"',
    },
    {
        id: '3',
        name: 'Akshit Baid',
        role: 'Marketing Executive',
        department: 'Marketing',
        departmentColor: 'bg-[#3B82F6]',
        bgColor: 'bg-[#F0FDF4]',
        borderColor: 'border-[#DCFCE7]',
        avatarColor: 'bg-[#16A34A]',
    },
    {
        id: '4',
        name: 'Arun Mohan',
        role: 'Manager',
        department: 'Client Servicing',
        departmentColor: 'bg-[#3B82F6]',
        bgColor: 'bg-[#FFF7ED]',
        borderColor: 'border-[#FFEDD5]',
        avatarColor: 'bg-[#EA580C]',
    },
    {
        id: '5',
        name: 'Bilal Shaikh',
        role: 'Mobile Developer',
        department: 'Engineering',
        departmentColor: 'bg-[#3B82F6]',
        bgColor: 'bg-[#ECFEFF]',
        borderColor: 'border-[#CFFAFE]',
        avatarColor: 'bg-[#0891B2]',
    },
    {
        id: '6',
        name: 'Chetan Bafna',
        role: 'CEO',
        department: 'Management',
        departmentColor: 'bg-[#3B82F6]',
        bgColor: 'bg-[#FEF2F2]',
        borderColor: 'border-[#FEE2E2]',
        avatarColor: 'bg-[#DC2626]',
    },
    {
        id: '7',
        name: 'Common Admin Id',
        role: 'Common Admin Id',
        department: 'Admin',
        departmentColor: 'bg-[#3B82F6]',
        bgColor: 'bg-[#F0F7FF]',
        borderColor: 'border-[#D1E5FF]',
        avatarColor: 'bg-[#1D4ED8]',
        discScore: '2117',
        discLabel: '"Objective Thinker"',
    },
    {
        id: '8',
        name: 'Fatema Tashrifwala',
        role: 'HR & AVP',
        department: 'Human Resources',
        departmentColor: 'bg-[#3B82F6]',
        bgColor: 'bg-[#FAF5FF]',
        borderColor: 'border-[#F3E8FF]',
        avatarColor: 'bg-[#9333EA]',
    },
    {
        id: '9',
        name: 'Jyoti',
        role: 'HR Manager',
        department: 'HR',
        departmentColor: 'bg-[#3B82F6]',
        bgColor: 'bg-[#F0FDF4]',
        borderColor: 'border-[#DCFCE7]',
        avatarColor: 'bg-[#16A34A]',
    },
];

const TeamDirectory = () => {
    return (
        <div className="space-y-6 mt-6">
            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search directory..."
                    className="pl-10 bg-white border-gray-200 rounded-[8px] h-10 focus-visible:ring-1 focus-visible:ring-gray-200"
                />
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                    <div
                        key={member.id}
                        className={cn(
                            "rounded-2xl border p-5 flex flex-col gap-4 shadow-sm transition-all hover:shadow-md",
                            member.bgColor,
                            member.borderColor
                        )}
                    >
                        <div className="flex gap-4">
                            {/* Avatar */}
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm",
                                member.avatarColor
                            )}>
                                {member.name.charAt(0)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-[#1a1a1a] text-lg truncate">{member.name}</h3>
                                <p className="text-gray-500 text-sm truncate">{member.role}</p>
                                <div className="mt-2">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[11px] font-semibold text-white inline-block",
                                        member.departmentColor
                                    )}>
                                        {member.department}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Email Button */}
                        <Button
                            variant="outline"
                            className="w-full bg-white border-gray-200 text-gray-600 hover:bg-gray-50 h-9 rounded-lg gap-2 font-medium"
                        >
                            <Mail className="w-4 h-4" />
                            Email
                        </Button>

                        {/* DISC Score Section */}
                        {member.discScore && (
                            <div className="mt-2 p-4 rounded-xl bg-white/50 border border-white/80 space-y-3">
                                <div className="flex items-center gap-2 text-[#7C3AED]">
                                    <Brain className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">DISC Score</span>
                                </div>
                                <div>
                                    <p className="text-[#1a1a1a] font-bold text-base">
                                        {member.discScore} <span className="text-[#7C3AED] ml-1">{member.discLabel}</span>
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full h-9 rounded-lg border border-[#E9D5FF] text-[#7C3AED] hover:bg-[#F5F3FF] hover:text-[#7C3AED] gap-2 text-xs font-semibold"
                                >
                                    <Eye className="w-4 h-4" />
                                    View DISC Report
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamDirectory;
