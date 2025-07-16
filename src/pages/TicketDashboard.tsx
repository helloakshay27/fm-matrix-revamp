import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Filter, Ticket, Clock, AlertCircle, CheckCircle, BarChart3, TrendingUp, Download, Upload } from 'lucide-react';
import { TicketsFilterDialog } from '@/components/TicketsFilterDialog';
import { TicketImportModal } from '@/components/modals/TicketImportModal';
import { TicketFilterModal } from '@/components/filters/TicketFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TicketSelector } from '@/components/TicketSelector';
import { RecentTicketsSidebar } from '@/components/RecentTicketsSidebar';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ticketData = [{
  id: '2189-11106',
  taskNumber: 'test',
  description: 'Test description',
  category: 'Air Conditioner',
  subCategory: 'test',
  createdBy: 'Abhishek Sharma',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'Wings',
  floor: '1',
  area: '',
  room: '',
  priority: 'p1',
  status: 'Pending',
  createdOn: '16/06/2025 5:17 PM',
  mode: 'Call'
}, {
  id: '2189-11105',
  taskNumber: 'Test 1234',
  description: 'Another test',
  category: 'FIRE SYSTEM',
  subCategory: 'NA',
  createdBy: 'Vishal Vora',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'Wings',
  floor: '1',
  area: '',
  room: '',
  priority: 'p2',
  status: 'Closed',
  createdOn: '15/06/2025 3:30 PM',
  mode: 'Email'
}, {
  id: '2189-11104',
  taskNumber: 'Cleaning Request',
  description: 'Office cleaning',
  category: 'Cleaning',
  subCategory: 'Office',
  createdBy: 'John Doe',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J2',
  wing: 'East',
  floor: '2',
  area: '',
  room: '',
  priority: 'p3',
  status: 'Pending',
  createdOn: '14/06/2025 10:15 AM',
  mode: 'Web'
}, {
  id: '2189-11103',
  taskNumber: 'Electrical Issue',
  description: 'Power outage in conference room',
  category: 'Electrical',
  subCategory: 'Power',
  createdBy: 'Sarah Johnson',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'West',
  floor: '3',
  area: 'Conference Room',
  room: 'CR-301',
  priority: 'p1',
  status: 'In Progress',
  createdOn: '13/06/2025 2:45 PM',
  mode: 'App'
}, {
  id: '2189-11102',
  taskNumber: 'Plumbing Fix',
  description: 'Leaky faucet in restroom',
  category: 'Plumbing',
  subCategory: 'Faucet',
  createdBy: 'Mike Wilson',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J2',
  wing: 'North',
  floor: '1',
  area: 'Restroom',
  room: 'RR-101',
  priority: 'p2',
  status: 'Open',
  createdOn: '12/06/2025 11:30 AM',
  mode: 'Call'
}, {
  id: '2189-11101',
  taskNumber: 'HVAC Maintenance',
  description: 'Routine HVAC system check',
  category: 'HVAC',
  subCategory: 'Maintenance',
  createdBy: 'Lisa Chen',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'Central',
  floor: '2',
  area: 'Mechanical Room',
  room: 'MR-201',
  priority: 'p3',
  status: 'Pending',
  createdOn: '11/06/2025 9:00 AM',
  mode: 'Web'
}, {
  id: '2189-11100',
  taskNumber: 'Security Issue',
  description: 'Broken door lock',
  category: 'Security',
  subCategory: 'Lock',
  createdBy: 'Robert Davis',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J2',
  wing: 'South',
  floor: '3',
  area: 'Office',
  room: 'OF-305',
  priority: 'p1',
  status: 'Closed',
  createdOn: '10/06/2025 4:20 PM',
  mode: 'Email'
}, {
  id: '2189-11099',
  taskNumber: 'Network Issue',
  description: 'Internet connectivity problem',
  category: 'IT',
  subCategory: 'Network',
  createdBy: 'Emma Brown',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'East',
  floor: '1',
  area: 'IT Room',
  room: 'IT-101',
  priority: 'p2',
  status: 'In Progress',
  createdOn: '09/06/2025 1:15 PM',
  mode: 'App'
}, {
  id: '2189-11098',
  taskNumber: 'Furniture Repair',
  description: 'Broken office chair',
  category: 'Furniture',
  subCategory: 'Chair',
  createdBy: 'David Miller',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J2',
  wing: 'West',
  floor: '2',
  area: 'Workspace',
  room: 'WS-201',
  priority: 'p3',
  status: 'Open',
  createdOn: '08/06/2025 10:45 AM',
  mode: 'Call'
}, {
  id: '2189-11097',
  taskNumber: 'Lighting Fix',
  description: 'Flickering lights in hallway',
  category: 'Electrical',
  subCategory: 'Lighting',
  createdBy: 'Jennifer Taylor',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'North',
  floor: '2',
  area: 'Hallway',
  room: '',
  priority: 'p2',
  status: 'Pending',
  createdOn: '07/06/2025 3:00 PM',
  mode: 'Web'
}];

// Sortable Chart Item Component
const SortableChartItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="cursor-move"
    >
      {children}
    </div>
  );
};

export const TicketDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([
    'statusChart', 'reactiveChart', 'categoryChart', 'agingMatrix'
  ]);
  const [chartOrder, setChartOrder] = useState<string[]>(['statusChart', 'reactiveChart', 'categoryChart', 'agingMatrix']);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const totalTickets = ticketData.length;
  const openTickets = ticketData.filter(t => t.status === 'Open').length;
  const inProgressTickets = ticketData.filter(t => t.status === 'In Progress').length;
  const pendingTickets = ticketData.filter(t => t.status === 'Pending').length;
  const closedTickets = ticketData.filter(t => t.status === 'Closed').length;

  // Analytics data with updated colors matching design
  const statusData = [
    { name: 'Open', value: openTickets, color: '#c6b692' },
    { name: 'Closed', value: closedTickets, color: '#d8dcdd' }
  ];

  const categoryData = ticketData.reduce((acc, ticket) => {
    const category = ticket.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  const agingMatrixData = [
    { priority: 'P1', '0-10': 20, '11-20': 3, '21-30': 4, '31-40': 0, '41-50': 203 },
    { priority: 'P2', '0-10': 2, '11-20': 0, '21-30': 0, '31-40': 0, '41-50': 4 },
    { priority: 'P3', '0-10': 1, '11-20': 0, '21-30': 1, '31-40': 0, '41-50': 7 },
    { priority: 'P4', '0-10': 1, '11-20': 0, '21-30': 0, '31-40': 0, '41-50': 5 }
  ];

  const reactiveTickets = Math.floor(totalTickets * 0.7);
  const proactiveTickets = totalTickets - reactiveTickets;

  const typeData = [
    { name: 'Open', value: reactiveTickets, color: '#c6b692' },
    { name: 'Closed', value: proactiveTickets, color: '#d8dcdd' }
  ];

  const handleSelectionChange = (selectedSections: string[]) => {
    setVisibleSections(selectedSections);
  };

  const handleViewDetails = (ticketId: string) => {
    navigate(`/maintenance/ticket/details/${ticketId}`);
  };

  // Handle drag end for chart reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const columns = [{
    key: 'id',
    label: 'Ticket ID',
    sortable: true
  }, {
    key: 'taskNumber',
    label: 'Task Number',
    sortable: true
  }, {
    key: 'description',
    label: 'Description',
    sortable: true
  }, {
    key: 'category',
    label: 'Category',
    sortable: true
  }, {
    key: 'subCategory',
    label: 'Sub Category',
    sortable: true
  }, {
    key: 'createdBy',
    label: 'Created By',
    sortable: true
  }, {
    key: 'assignedTo',
    label: 'Assigned To',
    sortable: true
  }, {
    key: 'status',
    label: 'Status',
    sortable: true
  }, {
    key: 'priority',
    label: 'Priority',
    sortable: true
  }, {
    key: 'site',
    label: 'Site',
    sortable: true
  }, {
    key: 'unit',
    label: 'Unit',
    sortable: true
  }, {
    key: 'createdOn',
    label: 'Created On',
    sortable: true
  }];

  const renderCustomActions = () => <div className="flex flex-wrap gap-3">
      <Button onClick={() => navigate('/maintenance/ticket/add')} className="bg-[#C72030] text-white hover:bg-[#C72030]/90 border-0">
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
      <Button variant="outline" onClick={() => navigate('/maintenance/ticket/import')} className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white">
        <Upload className="w-4 h-4 mr-2" /> Import
      </Button>
      <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white">
        <Filter className="w-4 h-4 mr-2" /> Filters
      </Button>
    </div>;

  const renderRowActions = ticket => <Button variant="ghost" size="sm" onClick={() => handleViewDetails(ticket.id)}>
      <Eye className="w-4 h-4" />
    </Button>;

  const renderCell = (item, columnKey) => {
    if (columnKey === 'status') {
      return <span className={`px-2 py-1 rounded text-xs ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : item.status === 'Closed' ? 'bg-green-100 text-green-700' : item.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
          {item.status}
        </span>;
    }
    if (columnKey === 'priority') {
      return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
          {item.priority}
        </span>;
    }
    return item[columnKey];
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[#C72030] border-none"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="tickets" 
            className="flex items-center gap-2 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[#C72030] border-none"
          >
            <Ticket className="w-4 h-4" />
            Ticket List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Header with Ticket Selector */}
          <div className="flex justify-end">
            <TicketSelector onSelectionChange={handleSelectionChange} />
          </div>

          {/* Main Analytics Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-200px)]">
            {/* Left Section - Charts */}
            <div className="xl:col-span-8 space-y-4 sm:space-y-6">
              {/* All Charts with Drag and Drop */}
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                  <div className="space-y-4 sm:space-y-6">
                    {/* Top Row - Two Donut Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {chartOrder.filter(id => ['statusChart', 'reactiveChart'].includes(id)).map((chartId) => {
                        if (chartId === 'statusChart' && visibleSections.includes('statusChart')) {
                          return (
                            <SortableChartItem key={chartId} id={chartId}>
                              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                  <h3 className="text-base sm:text-lg font-bold text-[#C72030]">Tickets</h3>
                                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030] cursor-pointer" />
                                </div>
                                <div className="relative flex items-center justify-center">
                                  <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                                    <PieChart>
                                      <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ value, name, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                          if (name === 'Open') {
                                            return (
                                              <text 
                                                x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)} 
                                                y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)}
                                                fill="black"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontSize="14"
                                                fontWeight="bold"
                                              >
                                                2
                                              </text>
                                            );
                                          }
                                          return (
                                            <text 
                                              x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)} 
                                              y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)}
                                              fill="black"
                                              textAnchor="middle"
                                              dominantBaseline="middle"
                                              fontSize="14"
                                              fontWeight="bold"
                                            >
                                              {value}
                                            </text>
                                          );
                                        }}
                                        labelLine={false}
                                      >
                                        {statusData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                      </Pie>
                                      <Tooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                      <div className="text-sm sm:text-lg font-semibold text-gray-700">Total : {totalTickets}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-center gap-3 sm:gap-6 mt-4 flex-wrap">
                                  {statusData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
                                      <span className="text-xs sm:text-sm font-medium text-gray-700">{item.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </SortableChartItem>
                          );
                        }
                        
                        if (chartId === 'reactiveChart' && visibleSections.includes('reactiveChart')) {
                          return (
                            <SortableChartItem key={chartId} id={chartId}>
                              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                  <h3 className="text-sm sm:text-lg font-bold text-[#C72030] leading-tight">Reactive Proactive Ticket</h3>
                                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030] cursor-pointer" />
                                </div>
                                <div className="relative flex items-center justify-center">
                                  <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                                    <PieChart>
                                      <Pie
                                        data={typeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ value, name, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                          if (name === 'Open') {
                                            return (
                                              <text 
                                                x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)} 
                                                y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)}
                                                fill="black"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontSize="14"
                                                fontWeight="bold"
                                              >
                                                2
                                              </text>
                                            );
                                          }
                                          return (
                                            <text 
                                              x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)} 
                                              y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)}
                                              fill="black"
                                              textAnchor="middle"
                                              dominantBaseline="middle"
                                              fontSize="14"
                                              fontWeight="bold"
                                            >
                                              {value}
                                            </text>
                                          );
                                        }}
                                        labelLine={false}
                                      >
                                        {typeData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                      </Pie>
                                      <Tooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                      <div className="text-sm sm:text-lg font-semibold text-gray-700">Total : {reactiveTickets + proactiveTickets}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-center gap-3 sm:gap-6 mt-4 flex-wrap">
                                  {typeData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
                                      <span className="text-xs sm:text-sm font-medium text-gray-700">{item.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </SortableChartItem>
                          );
                        }
                        
                        return null;
                      })}
                    </div>

                    {/* Bottom Charts - Category and Aging Matrix */}
                    {chartOrder.filter(id => ['categoryChart', 'agingMatrix'].includes(id)).map((chartId) => {
                      if (chartId === 'categoryChart' && visibleSections.includes('categoryChart')) {
                        return (
                          <SortableChartItem key={chartId} id={chartId}>
                            <div className="bg-white border border-gray-200 p-3 sm:p-6 rounded-lg">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base sm:text-lg font-bold" style={{ color: '#C72030' }}>Unit Category-wise Tickets</h3>
                                <Download className="w-4 h-4 sm:w-4 sm:h-4 cursor-pointer" style={{ color: '#C72030' }} />
                              </div>
                              <div className="w-full overflow-x-auto">
                                <ResponsiveContainer width="100%" height={200} className="sm:h-[250px] min-w-[400px]">
                                  <BarChart data={categoryChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--analytics-border))" />
                                    <XAxis 
                                      dataKey="name" 
                                      angle={-45} 
                                      textAnchor="end" 
                                      height={80}
                                      tick={{ fill: 'hsl(var(--analytics-text))', fontSize: 10 }}
                                      className="text-xs"
                                    />
                                    <YAxis tick={{ fill: 'hsl(var(--analytics-text))', fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="hsl(var(--chart-tan))" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </SortableChartItem>
                        );
                      }

                      if (chartId === 'agingMatrix' && visibleSections.includes('agingMatrix')) {
                        return (
                          <SortableChartItem key={chartId} id={chartId}>
                            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
                              <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-bold" style={{ color: '#C72030' }}>Tickets Ageing Matrix</h3>
                                <Download className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" style={{ color: '#C72030' }} />
                              </div>
                              
                              <div className="space-y-4 sm:space-y-6">
                                {/* Table - Horizontally scrollable on mobile */}
                                <div className="overflow-x-auto -mx-3 sm:mx-0">
                                  <div className="min-w-[500px] px-3 sm:px-0">
                                    <table className="w-full border-collapse border border-gray-300">
                                      <thead>
                                        <tr style={{ backgroundColor: '#EDE4D8' }}>
                                          <th className="border border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm font-medium text-black">Priority</th>
                                          <th colSpan={5} className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">No. of Days</th>
                                        </tr>
                                        <tr style={{ backgroundColor: '#EDE4D8' }}>
                                          <th className="border border-gray-300 p-2 sm:p-3"></th>
                                          <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">0-10</th>
                                          <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">11-20</th>
                                          <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">21-30</th>
                                          <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">31-40</th>
                                          <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">41-50</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {agingMatrixData.map((row, index) => (
                                          <tr key={index} className="bg-white">
                                            <td className="border border-gray-300 p-2 sm:p-3 font-medium text-black text-xs sm:text-sm">{row.priority}</td>
                                            <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['0-10']}</td>
                                            <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['11-20']}</td>
                                            <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['21-30']}</td>
                                            <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['31-40']}</td>
                                            <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['41-50']}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Summary Box - Full Width Below Table */}
                                <div className="w-full">
                                  <div className="rounded-lg p-4 sm:p-8 text-center" style={{ backgroundColor: '#EDE4D8' }}>
                                    <div className="text-2xl sm:text-4xl font-bold text-black mb-1 sm:mb-2">569 Days</div>
                                    <div className="text-sm sm:text-base text-black">Average Time Taken To Resolve A Ticket</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SortableChartItem>
                        );
                      }

                      return null;
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Right Sidebar - Recent Tickets */}
            <div className="xl:col-span-4 order-first xl:order-last">
              <RecentTicketsSidebar />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Ticket Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {[{
              label: 'Total Tickets',
              value: totalTickets,
              icon: Ticket
            }, {
              label: 'Open',
              value: openTickets,
              icon: AlertCircle
            }, {
              label: 'In Progress',
              value: inProgressTickets,
              icon: Clock
            }, {
              label: 'Pending',
              value: pendingTickets,
              icon: Clock
            }, {
              label: 'Closed',
              value: closedTickets,
              icon: CheckCircle
            }].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FBEDEC]">
                    <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate" style={{ color: '#C72030' }}>{item.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mb-4">
            {renderCustomActions()}
          </div>

          {/* Tickets Table */}
          <div className="overflow-x-auto">
            <EnhancedTable 
              data={ticketData} 
              columns={columns} 
              renderCell={renderCell} 
              renderActions={renderRowActions} 
              selectable={true} 
              pagination={true} 
              pageSize={10}
              enableExport={true} 
              exportFileName="tickets" 
              onRowClick={handleViewDetails} 
              storageKey="tickets-table" 
            />
          </div>
        </TabsContent>
      </Tabs>

      <TicketsFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApplyFilters={(filters) => {
          console.log('Applied filters:', filters);
          setIsFilterOpen(false);
        }} 
      />
    </div>
  );
};
