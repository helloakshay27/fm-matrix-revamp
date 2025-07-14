import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Filter, Ticket, Clock, AlertCircle, CheckCircle, BarChart3, TrendingUp, Download } from 'lucide-react';
import { TicketsFilterDialog } from '@/components/TicketsFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TicketSelector } from '@/components/TicketSelector';
import { RecentTicketsSidebar } from '@/components/RecentTicketsSidebar';

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

export const TicketDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const totalTickets = ticketData.length;
  const openTickets = ticketData.filter(t => t.status === 'Open').length;
  const inProgressTickets = ticketData.filter(t => t.status === 'In Progress').length;
  const pendingTickets = ticketData.filter(t => t.status === 'Pending').length;
  const closedTickets = ticketData.filter(t => t.status === 'Closed').length;

  // Analytics data with updated colors matching design
  const statusData = [
    { name: 'Open', value: openTickets, color: 'hsl(35, 35%, 75%)' },
    { name: 'Closed', value: closedTickets, color: 'hsl(25, 45%, 55%)' }
  ];

  const categoryData = ticketData.reduce((acc, ticket) => {
    const category = ticket.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  const agingMatrixData = [
    { priority: 'P1', '0-10': 5, '11-20': 3, '21-30': 2, '31-40': 1, '41-50': 0 },
    { priority: 'P2', '0-10': 8, '11-20': 4, '21-30': 2, '31-40': 1, '41-50': 1 },
    { priority: 'P3', '0-10': 12, '11-20': 6, '21-30': 3, '31-40': 2, '41-50': 1 },
    { priority: 'P4', '0-10': 15, '11-20': 8, '21-30': 4, '31-40': 2, '41-50': 1 }
  ];

  const reactiveTickets = Math.floor(totalTickets * 0.7);
  const proactiveTickets = totalTickets - reactiveTickets;

  const typeData = [
    { name: 'Reactive', value: reactiveTickets, color: 'hsl(35, 35%, 75%)' },
    { name: 'Proactive', value: proactiveTickets, color: 'hsl(25, 45%, 55%)' }
  ];

  const handleViewDetails = (ticketId: string) => {
    navigate(`/maintenance/ticket/details/${ticketId}`);
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
      <Button onClick={() => navigate('/maintenance/ticket/add')} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
      <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
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
    <div className="p-4 sm:p-6">
 

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Ticket List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Header with Ticket Selector */}
          <div className="flex justify-end">
            <TicketSelector />
          </div>

          {/* Main Analytics Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Section - Charts (3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Top Row - Two Donut Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tickets Chart */}
                <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[hsl(var(--analytics-text))]">Tickets</h3>
                    <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {statusData.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-[hsl(var(--analytics-text))]">{item.name}</span>
                        </div>
                        <div className="text-lg font-semibold text-[hsl(var(--analytics-text))]">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reactive Proactive Tickets Chart */}
                <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[hsl(var(--analytics-text))]">Reactive Proactive Ticket</h3>
                    <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={typeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {typeData.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-[hsl(var(--analytics-text))]">{item.name}</span>
                        </div>
                        <div className="text-lg font-semibold text-[hsl(var(--analytics-text))]">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Unit Category Wise Tickets Bar Chart */}
              <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[hsl(var(--analytics-text))]">Unit Category-wise Tickets</h3>
                  <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--analytics-border))" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      tick={{ fill: 'hsl(var(--analytics-text))', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--analytics-text))', fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--chart-tan))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Aging Matrix */}
                <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[hsl(var(--analytics-text))]">Aging Matrix</h3>
                    <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[hsl(var(--analytics-background))]">
                          <th className="border border-[hsl(var(--analytics-border))] p-2 text-left text-sm font-medium text-[hsl(var(--analytics-text))]">Priority</th>
                          <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">0-10</th>
                          <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">11-20</th>
                          <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">21-30</th>
                          <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">31-40</th>
                          <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">41-50</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agingMatrixData.map((row, index) => (
                          <tr key={index}>
                            <td className="border border-[hsl(var(--analytics-border))] p-2 font-medium text-[hsl(var(--analytics-text))]">{row.priority}</td>
                            <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['0-10']}</td>
                            <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['11-20']}</td>
                            <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['21-30']}</td>
                            <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['31-40']}</td>
                            <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['41-50']}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Average Resolution Time */}
                <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[hsl(var(--analytics-text))]">569 Days Average Time Taken To Resolve A Ticket</h3>
                    <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[hsl(var(--analytics-accent))] mb-2">569</div>
                      <div className="text-lg text-[hsl(var(--analytics-text))]">Days</div>
                      <div className="text-sm text-[hsl(var(--analytics-muted))] mt-2">Average Resolution Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Recent Tickets */}
            <div className="lg:col-span-1">
              <RecentTicketsSidebar />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6 mt-6">
          {/* Ticket Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                <div key={i} className="p-4 rounded-lg shadow-sm h-[132px] flex items-center gap-4 bg-[#f6f4ee]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FBEDEC]">
                    <IconComponent className="w-6 h-6" style={{ color: '#C72030' }} />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold leading-tight" style={{ color: '#C72030' }}>{item.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{item.label}</div>
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
