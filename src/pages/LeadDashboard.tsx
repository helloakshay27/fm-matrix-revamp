import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/StatsCard";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Plus,
  Eye,
  Target,
  Settings,
  Mail,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

interface Lead {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  industry: string;
}

const mockLeads: Lead[] = [
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

const columns: ColumnConfig[] = [
  { key: "id", label: "Lead ID", sortable: true, hideable: true, defaultVisible: true },
  { key: "name", label: "Company", sortable: true, hideable: true, defaultVisible: true },
  { key: "contactPerson", label: "Contact Person", sortable: true, hideable: true, defaultVisible: true },
  { key: "source", label: "Source", sortable: true, hideable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, hideable: true, defaultVisible: true },
  { key: "value", label: "Value", sortable: true, hideable: true, defaultVisible: true },
  { key: "probability", label: "Probability", sortable: true, hideable: true, defaultVisible: true },
  { key: "expectedCloseDate", label: "Expected Close", sortable: true, hideable: true, defaultVisible: true },
  { key: "assignedTo", label: "Assigned To", sortable: true, hideable: true, defaultVisible: true },
];

const calculateStats = (leads: Lead[]) => {
  return {
    total: leads.length,
    new: leads.filter((l) => l.status === "New").length,
    qualified: leads.filter((l) => l.status === "Qualified").length,
    converted: leads.filter((l) => l.status === "Converted").length,
    lost: leads.filter((l) => l.status === "Lost").length,
    totalValue: leads.reduce((sum, l) => sum + l.value, 0),
    avgValue: leads.length ? leads.reduce((sum, l) => sum + l.value, 0) / leads.length : 0,
    conversionRate: leads.length
      ? (leads.filter((l) => l.status === "Converted").length / leads.length) * 100
      : 0,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-[rgba(218,119,86,0.18)] text-[#DA7756] border-0 hover:bg-[rgba(218,119,86,0.18)]";
    case "Qualified":
      return "bg-[#F2EBC9] text-[#2c2c2c] border-0 hover:bg-[#F2EBC9]";
    case "Converted":
      return "bg-[#C7EDDA] text-[#2c2c2c] border-0 hover:bg-[#C7EDDA]";
    case "Lost":
      return "bg-[#F2C8C4] text-[#2c2c2c] border-0 hover:bg-[#F2C8C4]";
    default:
      return "bg-[#E5E0D8] text-[#2c2c2c] border-0 hover:bg-[#E5E0D8]";
  }
};

export const LeadDashboard = () => {
  const { shouldShow } = useDynamicPermissions();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);

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

  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;
    const q = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.id.toLowerCase().includes(q) ||
        lead.contactPerson.toLowerCase().includes(q) ||
        lead.source.toLowerCase().includes(q) ||
        lead.status.toLowerCase().includes(q) ||
        lead.assignedTo.toLowerCase().includes(q)
    );
  }, [leads, searchTerm]);

  const handleAddLead = () => {
    navigate("/crm/lead/add");
  };

  const handleViewLead = (leadId: string) => {
    navigate(`/crm/lead/details/${leadId}`);
  };

  const handleExport = () => {
    const headers = [
      "Lead ID",
      "Company",
      "Contact Person",
      "Email",
      "Phone",
      "Source",
      "Status",
      "Value",
      "Probability",
      "Expected Close",
      "Assigned To",
    ];
    const rows = filteredLeads.map((lead) => [
      lead.id,
      lead.name,
      lead.contactPerson,
      lead.email,
      lead.phone,
      lead.source,
      lead.status,
      lead.value,
      lead.probability,
      lead.expectedCloseDate,
      lead.assignedTo,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leads-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderCell = (item: Lead, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="text-gray-900 font-medium">{item.id}</span>;
      case "name":
        return <span>{item.name}</span>;
      case "contactPerson":
        return (
          <div>
            <div className="font-medium text-gray-900">{item.contactPerson}</div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Mail className="w-3 h-3" />
              {item.email}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Phone className="w-3 h-3" />
              {item.phone}
            </div>
          </div>
        );
      case "status":
        return (
          <Badge className={getStatusColor(item.status)}>
            {item.status}
          </Badge>
        );
      case "value":
        return `$${item.value.toLocaleString()}`;
      case "probability":
        return `${item.probability}%`;
      default:
        return <span>{item[columnKey as keyof Lead] ?? "-"}</span>;
    }
  };

  const renderActions = (item: Lead) =>
    shouldShow("Lead", "show") ? (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-[#C72030] hover:bg-[#C72030]/10 hover:text-[#C72030]"
        onClick={(e) => {
          e.stopPropagation();
          handleViewLead(item.id);
        }}
        title="View lead"
      >
        <Eye className="w-4 h-4" />
      </Button>
    ) : null;

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
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

          <EnhancedTable
            data={filteredLeads}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="lead-dashboard-table"
            emptyMessage="No leads found"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search leads..."
            enableSearch
            enableExport
            handleExport={handleExport}
            pagination
            pageSize={10}
            loading={loading}
            loadingMessage="Loading..."
            onFilterClick={() => setShowFilters((prev) => !prev)}
            leftActions={
              shouldShow("Lead", "create") ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAddLead}
                    className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </div>
              ) : undefined
            }
          />
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
