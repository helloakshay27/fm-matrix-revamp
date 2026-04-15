import { ArrowUpDown, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface TeamMember {
  user_id: number;
  name: string;
  email: string;
  designation: string | null;
  department: string | null;
  department_id: number | null;
  score: number;
  daily_reports: number;
  day_rating: number;
  weekly_reports: number;
  week_rating: number;
  daily_checklists: number;
  weekly_checklists: number;
  tasks: number;
  issues: number;
  kpis: number;
  sops: number;
  goals: number;
  disc_type: string | null;
}

interface TeamMembersTableProps {
  members: TeamMember[];
  loading: boolean;
  totalMembers: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TeamMembersTable = ({ members, loading, totalMembers, currentPage, totalPages, onPageChange }: TeamMembersTableProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getScoreStyles = (score: number) => {
    if (score >= 40) return 'bg-emerald-100 text-emerald-700';
    if (score >= 20) return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-cyan-500'];
    return colors[index % colors.length];
  };

  // Generate pagination pages with ellipsis
  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    const adjacentPages = 1; // Pages to show next to current page
    const edgePages = 2; // Pages to show at the start and end

    if (totalPages <= 7) {
      // Show all pages if total <= 7
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page(s)
    for (let i = 1; i <= edgePages && i <= totalPages; i++) {
      pages.push(i);
    }

    // Add ellipsis if there's a gap
    if (currentPage - adjacentPages > edgePages + 1) {
      pages.push('...');
    }

    // Show current page with adjacent pages
    for (let i = Math.max(edgePages + 1, currentPage - adjacentPages); i <= Math.min(totalPages - edgePages, currentPage + adjacentPages); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis if there's a gap
    if (currentPage + adjacentPages < totalPages - edgePages) {
      pages.push('...');
    }

    // Always show last page(s)
    for (let i = Math.max(edgePages + 1, totalPages - edgePages + 1); i <= totalPages; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Team Members Overview</h2>
          <p className="mt-1 text-xs text-neutral-600">Daily and weekly performance snapshot by team member</p>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
          {totalMembers} Members
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#DA7756]" />
        </div>
      ) : members.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-neutral-500">
          <p>No members found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] text-sm text-center">
              <thead>
                <tr className="border-b border-[#DA7756]/20 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Score <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      User <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Designation <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Department <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Daily Reports <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Day Rating <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Weekly Reports <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Week Rating <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Tasks <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Issues <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      KPIs <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Daily Checklists <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      Weekly Checklists <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DA7756]/15">
                {members.map((member, index) => (
                  <tr key={member.user_id} className="bg-[#fef6f4]/90 transition-colors hover:bg-[#fef6f4]">
                    <td className="px-3 py-3 text-center">
                      <div className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 font-bold tabular-nums ${getScoreStyles(member.score)}`}>
                        {member.score}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${getAvatarColor(index)} text-xs font-bold text-white`}>
                          {getInitials(member.name)}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-neutral-900">{member.name}</p>
                          <p className="text-xs text-neutral-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs text-neutral-600">{member.designation || '-'}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 border border-[#DA7756]/20">
                        {member.department || '-'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-sky-100 px-2 text-xs font-bold text-sky-700 tabular-nums">
                        {member.daily_reports}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-neutral-700 border border-[#DA7756]/20 tabular-nums">
                        {member.day_rating}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-sky-100 px-2 text-xs font-bold text-sky-700 tabular-nums">
                        {member.weekly_reports}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-neutral-700 border border-[#DA7756]/20 tabular-nums">
                        {member.week_rating}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-purple-100 px-2 text-xs font-bold text-purple-700 tabular-nums">
                        {member.tasks}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-red-100 px-2 text-xs font-bold text-red-700 tabular-nums">
                        {member.issues}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-green-100 px-2 text-xs font-bold text-green-700 tabular-nums">
                        {member.kpis}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-yellow-100 px-2 text-xs font-bold text-yellow-700 tabular-nums">
                        {member.daily_checklists}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-indigo-100 px-2 text-xs font-bold text-indigo-700 tabular-nums">
                        {member.weekly_checklists}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-between border-t border-[#DA7756]/20 pt-4">
            <div className="text-xs text-neutral-600">
              Showing {totalMembers === 0 ? 0 : (currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalMembers)} of {totalMembers} members
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-2 rounded-lg border border-[#DA7756]/25 bg-white hover:bg-[#fef6f4]"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {getPaginationPages().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 py-1 text-xs text-neutral-500">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => onPageChange(page as number)}
                      className={`h-8 w-8 rounded-lg p-0 font-semibold ${currentPage === page
                        ? 'border border-[#DA7756]/25 bg-white text-neutral-700 hover:bg-[#fef6f4]'
                        : 'bg-[#DA7756] text-white hover:bg-[#DA7756] '
                        }`}
                    >
                      {page}
                    </Button>
                  )
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-2 rounded-lg border border-[#DA7756]/25 bg-white hover:bg-[#fef6f4]"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamMembersTable;
