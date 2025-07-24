import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Settings,
  Search,
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

// Mock data for permits
const mockPermits = [
  {
    id: "PTW001",
    title: "Electrical Maintenance Work",
    type: "Electrical",
    status: "Active",
    requester: "John Smith",
    approver: "Safety Manager",
    startDate: "2024-01-15",
    endDate: "2024-01-16",
    location: "Building A - Electrical Room",
    riskLevel: "High",
  },
  {
    id: "PTW002",
    title: "HVAC System Cleaning",
    type: "Mechanical",
    status: "Pending Approval",
    requester: "Jane Doe",
    approver: "Facility Manager", 
    startDate: "2024-01-17",
    endDate: "2024-01-17",
    location: "Building B - Roof",
    riskLevel: "Medium",
  },
  {
    id: "PTW003",
    title: "Hot Work - Welding",
    type: "Hot Work",
    status: "Completed",
    requester: "Mike Johnson",
    approver: "Safety Manager",
    startDate: "2024-01-12",
    endDate: "2024-01-12",
    location: "Workshop Area",
    riskLevel: "High",
  },
];

const calculateStats = (permits: any[]) => {
  return {
    total: permits.length,
    active: permits.filter(p => p.status === "Active").length,
    pending: permits.filter(p => p.status === "Pending Approval").length,
    completed: permits.filter(p => p.status === "Completed").length,
    expired: permits.filter(p => p.status === "Expired").length,
    highRisk: permits.filter(p => p.riskLevel === "High").length,
    mediumRisk: permits.filter(p => p.riskLevel === "Medium").length,
    lowRisk: permits.filter(p => p.riskLevel === "Low").length,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Pending Approval": return "bg-yellow-100 text-yellow-800";
    case "Completed": return "bg-blue-100 text-blue-800";
    case "Expired": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const PermitToWorkDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const stats = calculateStats(mockPermits);
  const filteredPermits = mockPermits.filter(permit =>
    permit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPermit = () => {
    navigate("/safety/permit/add");
  };

  const handleViewPermit = (permitId: string) => {
    navigate(`/safety/permit/details/${permitId}`);
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
            <FileText className="w-4 h-4" />
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
            <StatCard icon={<FileText />} label="Total Permits" value={stats.total} />
            <StatCard icon={<CheckCircle />} label="Active" value={stats.active} />
            <StatCard icon={<Clock />} label="Pending Approval" value={stats.pending} />
            <StatCard icon={<CheckCircle />} label="Completed" value={stats.completed} />
            <StatCard icon={<AlertTriangle />} label="High Risk" value={stats.highRisk} />
            <StatCard icon={<AlertTriangle />} label="Medium Risk" value={stats.mediumRisk} />
            <StatCard icon={<CheckCircle />} label="Low Risk" value={stats.lowRisk} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddPermit}
                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Permit
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search permits..."
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
                  <TableHead>Permit ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermits.map((permit) => (
                  <TableRow key={permit.id}>
                    <TableCell className="font-medium">{permit.id}</TableCell>
                    <TableCell>{permit.title}</TableCell>
                    <TableCell>{permit.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(permit.status)}>
                        {permit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(permit.riskLevel)}>
                        {permit.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>{permit.requester}</TableCell>
                    <TableCell>{permit.startDate}</TableCell>
                    <TableCell>{permit.endDate}</TableCell>
                    <TableCell>{permit.location}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPermit(permit.id)}
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
              <h3 className="text-lg font-semibold mb-4">Permit Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Active: {stats.active}</span>
                  <span>{((stats.active / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending: {stats.pending}</span>
                  <span>{((stats.pending / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed: {stats.completed}</span>
                  <span>{((stats.completed / stats.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Risk Level Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>High Risk: {stats.highRisk}</span>
                  <span>{((stats.highRisk / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Risk: {stats.mediumRisk}</span>
                  <span>{((stats.mediumRisk / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Low Risk: {stats.lowRisk}</span>
                  <span>{((stats.lowRisk / stats.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};