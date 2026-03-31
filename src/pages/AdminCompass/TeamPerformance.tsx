
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

      <div className="bg-white p-4 rounded-[10px] shadow-md border border-gray-100 space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name, email, or designation..."
              className="pl-10 pr-4 py-1 border-gray-200 rounded-[8px] focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 items-center">
            <Select>
              <SelectTrigger className="w-[180px] rounded-[8px] h-9">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px] rounded-[8px] h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2 font-medium rounded-[8px] h-9 !bg-white !text-gray-600 border !border-gray-200">
              <LayoutGrid className="!text-gray-600 h-4 w-4" />
              Group by Dept
            </Button>

            <Button variant="outline" className="gap-2 font-medium rounded-[8px] h-9 !bg-green-50 !text-green-600 !border-green-500">
              <Download className="!text-green-600 h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Input type="text" placeholder="Min Score" className="w-24 text-sm rounded-[8px] border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white" />
          <Input type="text" placeholder="Max" className="w-20 text-sm rounded-[8px] border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white" />
          <Input type="text" placeholder="Min Daily Reports" className="w-36 text-sm rounded-[8px] border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white" />
          <Input type="text" placeholder="Min Weekly Reports" className="w-40 text-sm rounded-[8px] border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white" />
          <Input type="text" placeholder="Min KPIs" className="w-32 text-sm rounded-[8px] border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white" />
          <Input type="text" placeholder="Min Tasks" className="w-32 text-sm rounded-[8px] border-gray-200 focus:ring-1 focus:ring-blue-500 bg-white" />
        </div>
      </div>
      <TeamMembersTable />
    </div>
  );
};

export default TeamPerformance;
