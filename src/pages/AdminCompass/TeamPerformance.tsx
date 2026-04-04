
import { Users, LineChart, CheckCircle, Crosshair, Search, Download, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import TeamMembersTable from './TeamMembersTable';

const TeamPerformance = () => {
  const performanceData = [
    {
      title: 'Active Members',
      value: '16',
      icon: <Users className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      tag: 'Team',
      tagBg: 'bg-blue-200',
    },
    {
      title: 'Total KPIs',
      value: '8',
      icon: <LineChart className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      tag: 'Tracking',
      tagBg: 'bg-green-200',
    },
    {
      title: 'Completed Actions',
      value: '1',
      icon: <CheckCircle className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      tag: 'This Week',
      tagBg: 'bg-red-200',
    },
    {
      title: 'Team Reviews',
      value: '1',
      icon: <Crosshair className="text-orange-500" />,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      tag: 'Total',
      tagBg: 'bg-orange-200',
    },
  ];

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {performanceData.map((item, index) => (
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
        ))}
      </div>

      <div className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm space-y-4 sm:p-5">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#DA7756]/60 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name, email, or designation..."
              className="pl-10 pr-4 py-1 rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]"
            />
          </div>

          <div className="flex gap-4 items-center">
            <Select>
              <SelectTrigger className="w-[180px] h-9 rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 text-neutral-700 focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
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
              variant="outline"
              className="gap-2 font-medium rounded-xl h-9 bg-white border border-[#DA7756]/25 text-neutral-700 hover:bg-[#fef6f4] hover:border-[#DA7756]/40"
            >
              <LayoutGrid className="h-4 w-4 text-[#DA7756]" />
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
          <Input type="text" placeholder="Min Score" className="w-24 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]" />
          <Input type="text" placeholder="Max" className="w-20 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]" />
          <Input type="text" placeholder="Min Daily Reports" className="w-36 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]" />
          <Input type="text" placeholder="Min Weekly Reports" className="w-40 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]" />
          <Input type="text" placeholder="Min KPIs" className="w-32 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]" />
          <Input type="text" placeholder="Min Tasks" className="w-32 text-sm rounded-xl border border-[#DA7756]/25 bg-[#fef6f4]/90 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]" />
        </div>
      </div>
      <TeamMembersTable />
    </div>
  );
};

export default TeamPerformance;
