import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
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

// Mock data for incidents
const mockIncidents = [
  {
    id: "INC001",
    title: "Fire Safety Equipment Malfunction",
    type: "Safety Critical",
    severity: "High",
    status: "Open",
    reportedBy: "John Smith",
    reportedDate: "2024-01-15",
    location: "Building A - Floor 3",
    description: "Fire extinguisher pressure low",
  },
  {
    id: "INC002", 
    title: "Slip and Fall Incident",
    type: "Personal Injury",
    severity: "Medium",
    status: "Under Investigation",
    reportedBy: "Jane Doe",
    reportedDate: "2024-01-14",
    location: "Main Lobby",
    description: "Employee slipped on wet floor",
  },
  {
    id: "INC003",
    title: "Chemical Spill",
    type: "Environmental",
    severity: "High",
    status: "Closed",
    reportedBy: "Mike Johnson",
    reportedDate: "2024-01-12",
    location: "Laboratory - Room 205",
    description: "Minor chemical spill contained and cleaned",
  },
];

// Stats calculation
const calculateStats = (incidents: any[]) => {
  return {
    total: incidents.length,
    open: incidents.filter(i => i.status === "Open").length,
    underInvestigation: incidents.filter(i => i.status === "Under Investigation").length,
    closed: incidents.filter(i => i.status === "Closed").length,
    highSeverity: incidents.filter(i => i.severity === "High").length,
    mediumSeverity: incidents.filter(i => i.severity === "Medium").length,
    lowSeverity: incidents.filter(i => i.severity === "Low").length,
  };
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open": return "bg-blue-100 text-blue-800";
    case "Under Investigation": return "bg-yellow-100 text-yellow-800";
    case "Closed": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const IncidentDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);

  const stats = calculateStats(mockIncidents);
  const filteredIncidents = mockIncidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIncident = () => {
    navigate("/safety/incident/add");
  };

  const handleViewIncident = (incidentId: string) => {
    navigate(`/safety/incident/details/${incidentId}`);
  };

  const StatCard = ({ icon, label, value, color }: any) => (
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
            <AlertTriangle className="w-4 h-4" />
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<AlertTriangle />} label="Total Incidents" value={stats.total} />
            <StatCard icon={<Clock />} label="Open" value={stats.open} />
            <StatCard icon={<Search />} label="Under Investigation" value={stats.underInvestigation} />
            <StatCard icon={<CheckCircle />} label="Closed" value={stats.closed} />
            <StatCard icon={<XCircle />} label="High Severity" value={stats.highSeverity} />
            <StatCard icon={<AlertTriangle />} label="Medium Severity" value={stats.mediumSeverity} />
            <StatCard icon={<CheckCircle />} label="Low Severity" value={stats.lowSeverity} />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddIncident}
                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Incident
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search incidents..."
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

          {/* Incidents Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Incident ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.id}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>{incident.type}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{incident.reportedBy}</TableCell>
                    <TableCell>{incident.reportedDate}</TableCell>
                    <TableCell>{incident.location}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewIncident(incident.id)}
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
              <h3 className="text-lg font-semibold mb-4">Incident Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Open: {stats.open}</span>
                  <span>{((stats.open / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Under Investigation: {stats.underInvestigation}</span>
                  <span>{((stats.underInvestigation / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Closed: {stats.closed}</span>
                  <span>{((stats.closed / stats.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Severity Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>High: {stats.highSeverity}</span>
                  <span>{((stats.highSeverity / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium: {stats.mediumSeverity}</span>
                  <span>{((stats.mediumSeverity / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Low: {stats.lowSeverity}</span>
                  <span>{((stats.lowSeverity / stats.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};