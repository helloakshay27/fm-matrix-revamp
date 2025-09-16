import React, { useState, useEffect } from "react";
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
  Loader2,
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
import { incidentService, type Incident } from "@/services/incidentService";

// Stats calculation
const calculateStats = (incidents: any[]) => {
  return {
    total: incidents.length,
    open: incidents.filter(i => i.current_status === "Open").length,
    underInvestigation: incidents.filter(i => i.current_status === "Under Investigation").length,
    closed: incidents.filter(i => i.current_status === "Closed").length,
    highRisk: incidents.filter(i => i.inc_level_name === "High Risk").length,
    mediumRisk: incidents.filter(i => i.inc_level_name === "Medium Risk").length,
    lowRisk: incidents.filter(i => i.inc_level_name === "Low Risk").length,
  };
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "High Risk": return "bg-red-100 text-red-800";
    case "Medium Risk": return "bg-yellow-100 text-yellow-800";
    case "Low Risk": return "bg-green-100 text-green-800";
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
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await incidentService.getIncidents();
      setIncidents(response.data.incidents);
    } catch (err) {
      setError("Failed to fetch incidents");
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = calculateStats(incidents);
  const filteredIncidents = incidents.filter(incident =>
    incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIncident = () => {
    navigate("/safety/incident/add");
  };

  const handleViewIncident = (incidentId: string) => {
    navigate(`/safety/incident/${incidentId}`);
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
            <StatCard icon={<XCircle />} label="High Risk" value={stats.highRisk} />
            <StatCard icon={<AlertTriangle />} label="Medium Risk" value={stats.mediumRisk} />
            <StatCard icon={<CheckCircle />} label="Low Risk" value={stats.lowRisk} />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 ">
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
              <Button variant="outline" size="icon" onClick={fetchIncidents} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Incidents Table */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading incidents...</span>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 flex items-center justify-center">
              <div className="text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchIncidents} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No incidents found</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Sr. No.</TableHead>
                    <TableHead className="w-[80px]">Action</TableHead>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Tower</TableHead>
                    <TableHead>Incident Time</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sub Category</TableHead>
                    <TableHead>Support Required</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Current Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident, index) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium text-center">{index + 1}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewIncident(incident.id.toString())}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{incident.id}</TableCell>
                      <TableCell>{incident.description}</TableCell>
                      <TableCell>{incident.building_name || "-"}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{incident.tower_name || "-"}</TableCell>
                      <TableCell>
                        {incident.inc_time ? new Date(incident.inc_time).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(incident.inc_level_name)}>
                          {incident.inc_level_name}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.category_name || "-"}</TableCell>
                      <TableCell>{incident.sub_category_name || "-"}</TableCell>
                      <TableCell>
                        <Badge className={incident.support_required ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {incident.support_required ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.assigned_to_user_name || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(incident.current_status)}>
                          {incident.current_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Incident Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Open: {stats.open}</span>
                  <span>{stats.total > 0 ? ((stats.open / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Under Investigation: {stats.underInvestigation}</span>
                  <span>{stats.total > 0 ? ((stats.underInvestigation / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Closed: {stats.closed}</span>
                  <span>{stats.total > 0 ? ((stats.closed / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Risk Level Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>High Risk: {stats.highRisk}</span>
                  <span>{stats.total > 0 ? ((stats.highRisk / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Risk: {stats.mediumRisk}</span>
                  <span>{stats.total > 0 ? ((stats.mediumRisk / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Low Risk: {stats.lowRisk}</span>
                  <span>{stats.total > 0 ? ((stats.lowRisk / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};