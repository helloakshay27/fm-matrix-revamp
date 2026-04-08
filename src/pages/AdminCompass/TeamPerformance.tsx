
import React, { useState, useEffect } from 'react';
import { Users, LineChart, CheckCircle, Crosshair, Search, Download, LayoutGrid, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { toast } from 'sonner';
import TeamMembersTable from './TeamMembersTable';

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

interface DepartmentGroup {
  department: string;
  count: number;
  members: TeamMember[];
}

interface TeamDashboardData {
  summary: {
    active_members: number;
    total_kpis: number;
    completed_actions: number;
    team_reviews: number;
  };
  period: {
    from: string;
    to: string;
  };
  total_members: number;
  members?: TeamMember[];
  grouped_by_department?: DepartmentGroup[];
}

export const TeamPerformance = () => {
  const [dashboardData, setDashboardData] = useState<TeamDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentId, setDepartmentId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Score filters
  const [minScore, setMinScore] = useState<string>('');
  const [maxScore, setMaxScore] = useState<string>('');

  // Reports filters
  const [minDailyReports, setMinDailyReports] = useState<string>('');
  const [minWeeklyReports, setMinWeeklyReports] = useState<string>('');

  // KPIs and tasks filters
  const [minKpis, setMinKpis] = useState<string>('');
  const [minTasks, setMinTasks] = useState<string>('');

  // Group by department
  const [groupByDept, setGroupByDept] = useState(false);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());

  // Helper function to toggle department expansion
  const toggleDeptExpansion = (deptName: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptName)) {
      newExpanded.delete(deptName);
    } else {
      newExpanded.add(deptName);
    }
    setExpandedDepts(newExpanded);
  };

  // Fetch team dashboard data with filters
  useEffect(() => {
    const fetchTeamDashboard = async () => {
      try {
        setLoading(true);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');

        if (!baseUrl || !token) {
          toast.error('Missing authentication credentials');
          return;
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('search', searchTerm);
        if (departmentId) queryParams.append('department_id', departmentId);
        queryParams.append('group_by_dept', groupByDept.toString());
        if (minScore) queryParams.append('min_score', minScore);
        if (maxScore) queryParams.append('max_score', maxScore);
        if (minDailyReports) queryParams.append('min_daily_reports', minDailyReports);
        if (minWeeklyReports) queryParams.append('min_weekly_reports', minWeeklyReports);
        if (minKpis) queryParams.append('min_kpis', minKpis);
        if (minTasks) queryParams.append('min_tasks', minTasks);

        const response = await axios.get(
          `https://${baseUrl}/team_dashboard?${queryParams.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const data = response.data.data;
        setDashboardData(data);

        // Extract unique departments
        const uniqueDepts = Array.from(
          new Set(data.members.map((m: TeamMember) => m.department).filter(Boolean))
        ) as string[];
        setDepartments(uniqueDepts);
      } catch (error) {
        console.error('Error fetching team dashboard:', error);
        toast.error('Failed to load team dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDashboard();
  }, [searchTerm, departmentId, groupByDept, minScore, maxScore, minDailyReports, minWeeklyReports, minKpis, minTasks]);

  // Filter members based on search and filters (client-side fallback)
  const filteredMembers = (dashboardData?.members || []).filter(member => {
    const matchesSearch = !searchTerm ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.designation || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'all' || member.department === departmentFilter;

    const matchesScore = (!minScore || member.score >= parseInt(minScore)) &&
      (!maxScore || member.score <= parseInt(maxScore));

    const matchesDailyReports = !minDailyReports || member.daily_reports >= parseInt(minDailyReports);
    const matchesWeeklyReports = !minWeeklyReports || member.weekly_reports >= parseInt(minWeeklyReports);
    const matchesKpis = !minKpis || member.kpis >= parseInt(minKpis);
    const matchesTasks = !minTasks || member.tasks >= parseInt(minTasks);

    return matchesSearch && matchesDept && matchesScore && matchesDailyReports && matchesWeeklyReports && matchesKpis && matchesTasks;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, minScore, maxScore, minDailyReports, minWeeklyReports, minKpis, minTasks]);

  const performanceData = [
    {
      title: 'Active Members',
      value: dashboardData?.summary.active_members || '0',
      icon: <Users className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      tag: 'Team',
      tagBg: 'bg-blue-200',
    },
    {
      title: 'Total KPIs',
      value: dashboardData?.summary.total_kpis || '0',
      icon: <LineChart className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      tag: 'Tracking',
      tagBg: 'bg-green-200',
    },
    {
      title: 'Completed Actions',
      value: dashboardData?.summary.completed_actions || '0',
      icon: <CheckCircle className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      tag: 'This Week',
      tagBg: 'bg-red-200',
    },
    {
      title: 'Team Reviews',
      value: dashboardData?.summary.team_reviews || '0',
      icon: <Crosshair className="text-orange-500" />,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      tag: 'Total',
      tagBg: 'bg-orange-200',
    },
  ];

  return (
    <div className="space-y-6 mt-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-4 rounded-[8px] shadow-md bg-white/50">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col space-y-2 flex-1">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-8 w-16 rounded" />
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
              </div>
            ))}
          </>
        ) : (
          performanceData.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-[8px] shadow-md flex items-start justify-between ${item.bgColor}`}
            >
              <div className="flex flex-col space-y-2">
                <p className={`text-sm font-medium ${item.textColor}`}>{item.title}</p>
                <p className={`text-3xl font-bold ${item.textColor}`}>{item.value}</p>
                <span className={`text-xs px-2 py-1 rounded-md w-fit ${item.tagBg} ${item.textColor}`}>
                  {item.tag}
                </span>
              </div>
              <div className={`p-2 rounded-lg ${item.tagBg}`}>
                {item.icon}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters Section */}
      <div className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm space-y-4 sm:p-5">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#DA7756]/60 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name, email, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-1 rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]"
            />
          </div>

          <div className="flex gap-4 items-center">
            <Select value={departmentFilter} onValueChange={(value) => {
              setDepartmentFilter(value);
              // No need to set departmentId here - API uses 'all' approach instead
            }}>
              <SelectTrigger className="w-[180px] h-9 rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 text-neutral-700 focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px] h-9 rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 text-neutral-700 focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setGroupByDept(!groupByDept)}
              variant="outline"
              className={`gap-2 font-medium rounded-xl h-9 border border-[#DA7756]/25 ${groupByDept
                ? 'bg-[#DA7756] text-white border-[#DA7756]/40 hover:bg-[#DA7756]/90'
                : 'bg-white text-neutral-700 hover:bg-[#fef6f4] hover:border-[#DA7756]/40'
                }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Group by Dept
            </Button>

            <Button
              variant="outline"
              className="gap-2 font-medium rounded-xl h-9 bg-[#fef6f4] text-[#DA7756] border border-[#DA7756]/40 hover:bg-[#fdf0eb]"
            >
              <Download className="h-4 w-4 text-[#DA7756]" />
              CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2 items-center">
            <label className="text-xs font-medium text-neutral-600">Score Range:</label>
            <Input
              type="number"
              placeholder="Min"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-20 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]"
            />
            <span className="text-xs text-neutral-500">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className="w-20 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]"
            />
          </div>

          <Input
            type="number"
            placeholder="Min Daily Reports"
            value={minDailyReports}
            onChange={(e) => setMinDailyReports(e.target.value)}
            className="w-36 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]"
          />

          <Input
            type="number"
            placeholder="Min Weekly Reports"
            value={minWeeklyReports}
            onChange={(e) => setMinWeeklyReports(e.target.value)}
            className="w-40 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]"
          />

          <Input
            type="number"
            placeholder="Min KPIs"
            value={minKpis}
            onChange={(e) => setMinKpis(e.target.value)}
            className="w-32 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]"
          />

          <Input
            type="number"
            placeholder="Min Tasks"
            value={minTasks}
            onChange={(e) => setMinTasks(e.target.value)}
            className="w-32 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]"
          />

          <Button
            onClick={() => {
              setSearchTerm('');
              setDepartmentFilter('all');
              setMinScore('');
              setMaxScore('');
              setMinDailyReports('');
              setMinWeeklyReports('');
              setMinKpis('');
              setMinTasks('');
              setGroupByDept(false);
              setExpandedDepts(new Set());
              setCurrentPage(1);
            }}
            variant="outline"
            className="text-xs rounded-xl h-9 border border-[#DA7756]/25 text-[#DA7756] hover:bg-[#fef6f4] hover:border-[#DA7756]/40"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Members Table - Grouped or Flat View */}
      {groupByDept && dashboardData?.grouped_by_department ? (
        <div className="space-y-4">
          {dashboardData.grouped_by_department.map((group) => (
            <div key={group.department} className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 overflow-hidden">
              {/* Department Header */}
              <button
                onClick={() => toggleDeptExpansion(group.department)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#DA7756]/5 transition-colors"
              >
                {expandedDepts.has(group.department) ? (
                  <ChevronDown className="h-5 w-5 text-[#DA7756]" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-[#DA7756]" />
                )}
                <Users className="h-5 w-5 text-[#DA7756]" />
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-neutral-900">{group.department}</h3>
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {group.count} members
                  </span>
                </div>
              </button>

              {/* Department Members Table */}
              {expandedDepts.has(group.department) && (
                <div className="border-t border-[#DA7756]/20 p-4 bg-[#fef6f4]/50">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1400px] text-sm text-center">
                      <thead>
                        <tr className="border-b border-[#DA7756]/20 text-xs uppercase tracking-wide text-neutral-500">
                          <th className="px-3 py-3 font-semibold text-center">Score</th>
                          <th className="px-3 py-3 font-semibold text-center">User</th>
                          <th className="px-3 py-3 font-semibold text-center">Designation</th>
                          <th className="px-3 py-3 font-semibold text-center">Department</th>
                          <th className="px-3 py-3 font-semibold text-center">Daily Reports</th>
                          <th className="px-3 py-3 font-semibold text-center">Day Rating</th>
                          <th className="px-3 py-3 font-semibold text-center">Weekly Reports</th>
                          <th className="px-3 py-3 font-semibold text-center">Week Rating</th>
                          <th className="px-3 py-3 font-semibold text-center">Tasks</th>
                          <th className="px-3 py-3 font-semibold text-center">Issues</th>
                          <th className="px-3 py-3 font-semibold text-center">KPIs</th>
                          <th className="px-3 py-3 font-semibold text-center">Daily Checklists</th>
                          <th className="px-3 py-3 font-semibold text-center">Weekly Checklists</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DA7756]/15">
                        {group.members.map((member, index) => (
                          <tr key={member.user_id} className="bg-white hover:bg-[#fef6f4] transition-colors">
                            <td className="px-3 py-3 text-center">
                              <div className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 font-bold ${member.score >= 40 ? 'bg-emerald-100 text-emerald-700' :
                                member.score >= 20 ? 'bg-amber-100 text-amber-700' :
                                  'bg-rose-100 text-rose-700'
                                }`}>
                                {member.score}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-cyan-500'][index % 8]
                                  } text-xs font-bold text-white`}>
                                  {member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </div>
                                <div className="text-left">
                                  <p className="font-medium text-neutral-900">{member.name}</p>
                                  <p className="text-xs text-neutral-500">{member.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center text-xs text-neutral-600">{member.designation || '-'}</td>
                            <td className="px-3 py-3 text-center">
                              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 border border-[#DA7756]/20">
                                {member.department || '-'}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-sky-100 px-2 text-xs font-bold text-sky-700">
                                {member.daily_reports}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-neutral-700 border border-[#DA7756]/20">
                                {member.day_rating}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-sky-100 px-2 text-xs font-bold text-sky-700">
                                {member.weekly_reports}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-neutral-700 border border-[#DA7756]/20">
                                {member.week_rating}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-purple-100 px-2 text-xs font-bold text-purple-700">
                                {member.tasks}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-red-100 px-2 text-xs font-bold text-red-700">
                                {member.issues}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-green-100 px-2 text-xs font-bold text-green-700">
                                {member.kpis}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-yellow-100 px-2 text-xs font-bold text-yellow-700">
                                {member.daily_checklists}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-indigo-100 px-2 text-xs font-bold text-indigo-700">
                                {member.weekly_checklists}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <TeamMembersTable
          members={paginatedMembers}
          loading={loading}
          totalMembers={filteredMembers.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
