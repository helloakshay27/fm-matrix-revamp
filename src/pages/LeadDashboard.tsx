import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/StatsCard";
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
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

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
    avgValue: leads.length ? leads.reduce((sum, l) => sum + l.value, 0) / leads.length : 0,
    conversionRate: leads.length
      ? (leads.filter(l => l.status === "Converted").length / leads.length) * 100
      : 0,
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
  const { shouldShow } = useDynamicPermissions();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Loading state
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<typeof mockLeads>([]);

  
  useEffect(() => {
    let active = true;
    const fetchLeads = async () => {
      setLoading(true);
      try {
       
        await new Promise((res) => setTimeout(res, 800));
        if (active) setLeads(mockLeads);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchLeads();
    return () => {
      active = false;
    };
  }, []);

  const stats = calculateStats(leads);
  const filteredLeads = leads.filter(lead =>
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
            <StatsCard
              title="Total Leads"
              value={stats.total}
              icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
            />
            <StatsCard
              title="New"
              value={stats.new}
              icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
            />
            <StatsCard
              title="Qualified"
              value={stats.qualified}
              icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
            />
            <StatsCard
              title="Converted"
              value={stats.converted}
              icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
            />
            <StatsCard
              title="Total Value"
              value={`$${stats.totalValue.toLocaleString()}`}
              icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
            />
            <StatsCard
              title="Avg Value"
              value={`$${stats.avgValue.toLocaleString()}`}
              icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
            />
            <StatsCard
              title="Conversion Rate"
              value={`${stats.conversionRate.toFixed(1)}%`}
              icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              {shouldShow("Lead", "create") && (
              <Button
                onClick={handleAddLead}
                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </Button>
              )}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="pt-4 pb-16">
                      <div className="w-full flex items-center justify-start gap-3 pl-4">
                        <div
                          className="h-5 w-5 rounded-full animate-spin"
                          style={{
                            border: "2px solid #000000",
                            borderTopColor: "transparent",
                          }}
                        />
                        <span className="text-sm" style={{ color: "#000000" }}>
                          Loading ...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="py-12 text-center text-gray-500">
                      No leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
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
                        {shouldShow("Lead", "show") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLead(lead.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Lead Status Distribution</h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div
                    className="h-5 w-5 rounded-full animate-spin"
                    style={{ border: "2px solid #000000", borderTopColor: "transparent" }}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>New: {stats.new}</span>
                    <span>{stats.total ? ((stats.new / stats.total) * 100).toFixed(1) : "0.0"}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Qualified: {stats.qualified}</span>
                    <span>{stats.total ? ((stats.qualified / stats.total) * 100).toFixed(1) : "0.0"}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Converted: {stats.converted}</span>
                    <span>{stats.total ? ((stats.converted / stats.total) * 100).toFixed(1) : "0.0"}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Lead Performance</h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div
                    className="h-5 w-5 rounded-full animate-spin"
                    style={{ border: "2px solid #000000", borderTopColor: "transparent" }}
                  />
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};