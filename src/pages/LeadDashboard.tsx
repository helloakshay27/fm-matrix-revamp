import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Filter,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Settings,
  Search,
  Phone,
  Mail,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for leads
const mockLeads = [
  {
    id: "LEAD001",
    name: "John Corporation",
    contactPerson: "John Smith",
    email: "john@johncorp.com",
    phone: "+1-555-0123",
    source: "Website",
    status: "New",
    value: 50000,
    probability: 75,
    expectedCloseDate: "2024-02-15",
    assignedTo: "Sales Rep 1",
    industry: "Technology",
  },
  {
    id: "LEAD002",
    name: "ABC Industries",
    contactPerson: "Jane Doe",
    email: "jane@abc.com",
    phone: "+1-555-0456",
    source: "Referral",
    status: "Qualified",
    value: 125000,
    probability: 60,
    expectedCloseDate: "2024-03-01",
    assignedTo: "Sales Rep 2",
    industry: "Manufacturing",
  },
  {
    id: "LEAD003",
    name: "XYZ Services",
    contactPerson: "Mike Johnson",
    email: "mike@xyz.com",
    phone: "+1-555-0789",
    source: "Cold Call",
    status: "Converted",
    value: 75000,
    probability: 100,
    expectedCloseDate: "2024-01-20",
    assignedTo: "Sales Rep 1",
    industry: "Services",
  },
];

const calculateStats = (leads: any[]) => {
  return {
    total: leads.length,
    new: leads.filter(l => l.status === "New").length,
    qualified: leads.filter(l => l.status === "Qualified").length,
    converted: leads.filter(l => l.status === "Converted").length,
    lost: leads.filter(l => l.status === "Lost").length,
    totalValue: leads.reduce((sum, l) => sum + l.value, 0),
    avgValue: leads.reduce((sum, l) => sum + l.value, 0) / leads.length,
    conversionRate: (leads.filter(l => l.status === "Converted").length / leads.length) * 100,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "New": return "bg-blue-100 text-blue-800";
    case "Qualified": return "bg-yellow-100 text-yellow-800";
    case "Converted": return "bg-green-100 text-green-800";
    case "Lost": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const LeadDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const stats = calculateStats(mockLeads);
  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLead = () => {
    navigate("/crm/lead/add");
  };

  const handleViewLead = (leadId: string) => {
    navigate(`/crm/lead/details/${leadId}`);
  };

  const StatCard = ({ icon, label, value }: any) => (
    <div className="bg-[#f6f4ee] p-6 rounded-lg shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4">
      <div className="w-14 h-14 bg-[#FBEDEC] rounded-full flex items-center justify-center">
        {React.cloneElement(icon, { className: `w-6 h-6 text-[#C72030]` })}
      </div>
      <div>
        <div className="text-2xl font-bold text-[#C72030]">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Target className="w-4 h-4" />
            List
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Settings className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<Target />} label="Total Leads" value={stats.total} />
            <StatCard icon={<Clock />} label="New" value={stats.new} />
            <StatCard icon={<CheckCircle />} label="Qualified" value={stats.qualified} />
            <StatCard icon={<CheckCircle />} label="Converted" value={stats.converted} />
            <StatCard icon={<Target />} label="Total Value" value={`$${stats.totalValue.toLocaleString()}`} />
            <StatCard icon={<Target />} label="Avg Value" value={`$${stats.avgValue.toLocaleString()}`} />
            <StatCard icon={<CheckCircle />} label="Conversion Rate" value={`${stats.conversionRate.toFixed(1)}%`} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddLead}
                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead ID</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Expected Close</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.id}</TableCell>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.contactPerson}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${lead.value.toLocaleString()}</TableCell>
                    <TableCell>{lead.probability}%</TableCell>
                    <TableCell>{lead.expectedCloseDate}</TableCell>
                    <TableCell>{lead.assignedTo}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewLead(lead.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Lead Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>New: {stats.new}</span>
                  <span>{((stats.new / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Qualified: {stats.qualified}</span>
                  <span>{((stats.qualified / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Converted: {stats.converted}</span>
                  <span>{((stats.converted / stats.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Lead Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Pipeline Value:</span>
                  <span>${stats.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Lead Value:</span>
                  <span>${stats.avgValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate:</span>
                  <span>{stats.conversionRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};