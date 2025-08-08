import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Filter,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Settings,
  Search,
  Calendar,
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

// Mock data for visitors
const mockVisitors = [
  {
    id: "VIS001",
    name: "John Smith",
    company: "ABC Corp",
    purpose: "Business Meeting",
    hostName: "Jane Manager",
    checkInTime: "2024-01-15 09:30",
    checkOutTime: "2024-01-15 11:45",
    status: "Checked Out",
    phoneNumber: "+1-555-0123",
    email: "john@abccorp.com",
    idType: "Driver License",
    vehicleNumber: "ABC-123",
  },
  {
    id: "VIS002",
    name: "Sarah Johnson",
    company: "XYZ Ltd",
    purpose: "Interview",
    hostName: "HR Manager",
    checkInTime: "2024-01-15 14:00",
    checkOutTime: null,
    status: "Checked In",
    phoneNumber: "+1-555-0456",
    email: "sarah@xyz.com",
    idType: "Passport",
    vehicleNumber: null,
  },
  {
    id: "VIS003",
    name: "Mike Wilson",
    company: "DEF Services",
    purpose: "Delivery",
    hostName: "Reception",
    checkInTime: "2024-01-15 16:20",
    checkOutTime: "2024-01-15 16:35",
    status: "Checked Out",
    phoneNumber: "+1-555-0789",
    email: "mike@def.com",
    idType: "Driver License",
    vehicleNumber: "DEF-456",
  },
];

const calculateStats = (visitors: any[]) => {
  return {
    total: visitors.length,
    checkedIn: visitors.filter(v => v.status === "Checked In").length,
    checkedOut: visitors.filter(v => v.status === "Checked Out").length,
    scheduled: visitors.filter(v => v.status === "Scheduled").length,
    noShow: visitors.filter(v => v.status === "No Show").length,
    businessMeetings: visitors.filter(v => v.purpose === "Business Meeting").length,
    interviews: visitors.filter(v => v.purpose === "Interview").length,
    deliveries: visitors.filter(v => v.purpose === "Delivery").length,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Checked In": return "bg-green-100 text-green-800";
    case "Checked Out": return "bg-blue-100 text-blue-800";
    case "Scheduled": return "bg-yellow-100 text-yellow-800";
    case "No Show": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const VisitorDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const stats = calculateStats(mockVisitors);
  const filteredVisitors = mockVisitors.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVisitor = () => {
    navigate("/security/visitor/add");
  };

  const handleViewVisitor = (visitorId: string) => {
    navigate(`/security/visitor/details/${visitorId}`);
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
            <Users className="w-4 h-4" />
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
            <StatCard icon={<Users />} label="Total Visitors" value={stats.total} />
            <StatCard icon={<CheckCircle />} label="Checked In" value={stats.checkedIn} />
            <StatCard icon={<XCircle />} label="Checked Out" value={stats.checkedOut} />
            <StatCard icon={<Calendar />} label="Scheduled" value={stats.scheduled} />
            <StatCard icon={<Users />} label="Business Meetings" value={stats.businessMeetings} />
            <StatCard icon={<Users />} label="Interviews" value={stats.interviews} />
            <StatCard icon={<Users />} label="Deliveries" value={stats.deliveries} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddVisitor}
                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Visitor
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search visitors..."
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
                  <TableHead>Visitor ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{visitor.name}</div>
                        <div className="text-sm text-gray-500">{visitor.phoneNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>{visitor.company}</TableCell>
                    <TableCell>{visitor.purpose}</TableCell>
                    <TableCell>{visitor.hostName}</TableCell>
                    <TableCell>{visitor.checkInTime}</TableCell>
                    <TableCell>{visitor.checkOutTime || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(visitor.status)}>
                        {visitor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{visitor.vehicleNumber || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewVisitor(visitor.id)}
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
              <h3 className="text-lg font-semibold mb-4">Visitor Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Checked In: {stats.checkedIn}</span>
                  <span>{((stats.checkedIn / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Checked Out: {stats.checkedOut}</span>
                  <span>{((stats.checkedOut / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled: {stats.scheduled}</span>
                  <span>{((stats.scheduled / stats.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Visit Purpose Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Business Meetings: {stats.businessMeetings}</span>
                  <span>{((stats.businessMeetings / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Interviews: {stats.interviews}</span>
                  <span>{((stats.interviews / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Deliveries: {stats.deliveries}</span>
                  <span>{((stats.deliveries / stats.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};