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
  RotateCcw,
  ArrowRight,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUnexpectedVisitors } from "@/hooks/useUnexpectedVisitors";

const calculateStats = (visitors: any[]) => {
  return {
    total: visitors.length,
    approved: visitors.filter(v => v.status === "Approved").length,
    pending: visitors.filter(v => v.status === "Pending").length,
    rejected: visitors.filter(v => v.status === "Rejected").length,
    checkedIn: visitors.filter(v => v.check_in_available).length,
    businessMeetings: visitors.filter(v => v.visit_purpose === "Business Meeting").length,
    interviews: visitors.filter(v => v.visit_purpose === "Interview").length,
    deliveries: visitors.filter(v => v.visit_purpose === "Delivery" || v.visit_purpose === "Courier").length,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved": return "bg-green-100 text-green-800";
    case "Pending": return "bg-yellow-100 text-yellow-800";
    case "Rejected": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const VisitorDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { visitors, loading, error, refetch } = useUnexpectedVisitors();

  const stats = calculateStats(visitors);
  const filteredVisitors = visitors.filter(visitor =>
    visitor.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.guest_from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.primary_host.toLowerCase().includes(searchTerm.toLowerCase())
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
            <StatCard icon={<CheckCircle />} label="Approved" value={stats.approved} />
            <StatCard icon={<Clock />} label="Pending" value={stats.pending} />
            <StatCard icon={<XCircle />} label="Rejected" value={stats.rejected} />
            <StatCard icon={<Calendar />} label="Check In Available" value={stats.checkedIn} />
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
              <Button variant="outline" size="icon" onClick={refetch} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading visitors...
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8 text-red-600">
                <XCircle className="w-6 h-6 mr-2" />
                Error: {error}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor ID</TableHead>
                    <TableHead>Visitor Image</TableHead>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Guest From</TableHead>
                    <TableHead>Visit Purpose</TableHead>
                    <TableHead>Primary Host</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vehicle Number</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">{visitor.id}</TableCell>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={visitor.visitor_image.startsWith('http') ? visitor.visitor_image : `/images/${visitor.visitor_image}`} 
                            alt={visitor.guest_name} 
                          />
                          <AvatarFallback>
                            {visitor.guest_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{visitor.guest_name}</div>
                          <div className="text-sm text-gray-500">{visitor.guest_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>{visitor.guest_from}</TableCell>
                      <TableCell>{visitor.visit_purpose || "-"}</TableCell>
                      <TableCell>{visitor.primary_host}</TableCell>
                      <TableCell>{visitor.created_at_formatted}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(visitor.status)}>
                          {visitor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{visitor.guest_vehicle_number || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Resend OTP
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 border-gray-600 hover:bg-gray-50"
                          >
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Skip
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Visitor Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Approved: {stats.approved}</span>
                  <span>{stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending: {stats.pending}</span>
                  <span>{stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rejected: {stats.rejected}</span>
                  <span>{stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Visit Purpose Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Business Meetings: {stats.businessMeetings}</span>
                  <span>{stats.total > 0 ? ((stats.businessMeetings / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Interviews: {stats.interviews}</span>
                  <span>{stats.total > 0 ? ((stats.interviews / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Deliveries: {stats.deliveries}</span>
                  <span>{stats.total > 0 ? ((stats.deliveries / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};