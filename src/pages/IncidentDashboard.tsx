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
import { Badge } from "@/components/ui/badge";
import { incidentService, type Incident } from "@/services/incidentService";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

// Stats calculation
const calculateStats = (incidents: any[]) => {
  return {
    total: incidents.length,
    open: incidents.filter(i => i.current_status === "Open").length,
    underObservation: incidents.filter(i => i.current_status === "Under Observation").length,
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
    case "Under Observation": return "bg-yellow-100 text-yellow-800";
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

  // Define columns for the EnhancedTable
  const columns: ColumnConfig[] = [
    {
      key: "srNo",
      label: "Sr. No.",
      sortable: false,
      defaultVisible: true,
      draggable: false,
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "building_name",
      label: "Site",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "region",
      label: "Region",
      sortable: false,
      defaultVisible: false,
      draggable: true,
    },
    {
      key: "tower_name",
      label: "Tower",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "inc_time",
      label: "Incident Time",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "inc_level_name",
      label: "Level",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "category_name",
      label: "Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "sub_category_name",
      label: "Sub Category",
      sortable: true,
      defaultVisible: false,
      draggable: true,
    },
    {
      key: "support_required",
      label: "Support Required",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "assigned_to_user_name",
      label: "Assigned To",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "current_status",
      label: "Current Status",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
  ];

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

  // Render cell function for custom formatting
  const renderCell = (item: Incident, columnKey: string): React.ReactNode => {
    const index = incidents.findIndex(incident => incident.id === item.id);

    switch (columnKey) {
      case "srNo":
        return <span className="font-medium">{index + 1}</span>;
      case "id":
        return <span className="font-medium">{item.id}</span>;
      case "description":
        return <div className="w-[15rem] overflow-hidden text-ellipsis text-center">{item.description}</div>;
      case "building_name":
        return <span>{item.building_name || "-"}</span>;
      case "region":
        return <span>-</span>;
      case "tower_name":
        return <span>{item.tower_name || "-"}</span>;
      case "inc_time":
        return (
          <span>
            {item.inc_time ? new Date(item.inc_time).toLocaleString() : "-"}
          </span>
        );
      case "inc_level_name":
        return (
          <Badge className={getLevelColor(item.inc_level_name)}>
            {item.inc_level_name}
          </Badge>
        );
      case "category_name":
        return <span>{item.category_name || "-"}</span>;
      case "sub_category_name":
        return <span>{item.sub_category_name || "-"}</span>;
      case "support_required":
        return (
          <Badge className={item.support_required ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {item.support_required ? "Yes" : "No"}
          </Badge>
        );
      case "assigned_to_user_name":
        return <span>{item.assigned_to_user_name || "-"}</span>;
      case "current_status":
        return (
          <Badge className={getStatusColor(item.current_status)}>
            {item.current_status}
          </Badge>
        );
      default:
        const value = item[columnKey as keyof Incident];
        return <span>{String(value) || "-"}</span>;
    }
  };

  // Render actions function
  const renderActions = (item: Incident): React.ReactNode => {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewIncident(item.id.toString())}
        title="View Incident"
      >
        <Eye className="w-4 h-4" />
      </Button>
    );
  };

  const stats = calculateStats(incidents);

  const handleAddIncident = () => {
    navigate("/safety/incident/add");
  };

  const handleViewIncident = (incidentId: string) => {
    navigate(`/safety/incident/${incidentId}`);
  };

  // Handle export functionality
  const handleExport = async () => {
    try {
      // Create CSV content
      const headers = columns
        .filter(col => col.defaultVisible !== false)
        .map(col => col.label)
        .join(',');

      const csvContent = [
        headers,
        ...incidents.map(incident =>
          columns
            .filter(col => col.defaultVisible !== false)
            .map(col => {
              let value = '';
              switch (col.key) {
                case 'srNo':
                  value = String(incidents.findIndex(inc => inc.id === incident.id) + 1);
                  break;
                case 'inc_time':
                  value = incident.inc_time ? new Date(incident.inc_time).toLocaleString() : '-';
                  break;
                case 'support_required':
                  value = incident.support_required ? 'Yes' : 'No';
                  break;
                default:
                  const fieldValue = incident[col.key as keyof Incident];
                  value = String(fieldValue || '-');
              }

              // Handle values that might contain commas or quotes
              const stringValue = String(value).replace(/"/g, '""');
              return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
                ? `"${stringValue}"`
                : stringValue;
            })
            .join(',')
        )
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting incidents:', error);
      alert('Failed to export incidents');
    }
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
            <StatCard icon={<Search />} label="Under Observation" value={stats.underObservation} />
            <StatCard icon={<CheckCircle />} label="Closed" value={stats.closed} />
            {/* <StatCard icon={<XCircle />} label="High Risk" value={stats.highRisk} />
            <StatCard icon={<AlertTriangle />} label="Medium Risk" value={stats.mediumRisk} />
            <StatCard icon={<CheckCircle />} label="Low Risk" value={stats.lowRisk} /> */}
          </div>

          {/* Enhanced Table */}
          <EnhancedTable
            data={incidents}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            onRowClick={(item) => handleViewIncident(item.id.toString())}
            loading={loading}
            emptyMessage={error ? error : "No incidents found"}
            enableSearch={true}
            searchPlaceholder="Search incidents..."
            enableExport={true}
            onExport={handleExport}
            exportFileName="incidents"
            storageKey="incidents-table"
            className="min-w-full"
            pagination={true}
            pageSize={10}
            leftActions={
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleAddIncident}
                  className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Incident
                </Button>
              </div>
            }
            rightActions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={fetchIncidents} disabled={loading} title="Refresh">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
              </div>
            }
          />
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
                  <span>Under Observation: {stats.underObservation}</span>
                  <span>{stats.total > 0 ? ((stats.underObservation / stats.total) * 100).toFixed(1) : 0}%</span>
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