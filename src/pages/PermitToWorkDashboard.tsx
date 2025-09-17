import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { API_CONFIG } from "@/config/apiConfig";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { PermitFilterModal } from "@/components/PermitFilterModal";

// Type definitions for permit data
interface Permit {
  id: number;
  created_at: string;
  updated_at: string;
  status: string;
  permit_for: string;
  reference_number: string;
  permit_type: string;
  location: string;
  requested_by: string;
  jsa_submitted: boolean;
  form_submitted: string | null;
  department_name: string;
  status_color_code: string;
  jsa_data: any;
  permit_jsa_url: string;
  print_jsa: any;
  vender_name?: string;
  expiry_date?: string;
}

interface PermitsResponse {
  total_permits: number;
  permits: Permit[];
}

// Type definition for permit counts response
interface PermitCounts {
  total: number;
  draft: number;
  hold: number;
  open: number;
  approved: number;
  rejected: number;
  extended: number;
  closed: number;
}

// Column configuration for EnhancedTable
const permitColumns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'reference_number',
    label: 'Ref No.',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'permit_type',
    label: 'Permit Type',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'permit_for',
    label: 'Permit For',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'requested_by',
    label: 'Created By',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'department_name',
    label: 'Designation',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'vender_name',
    label: 'Vendor Name',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'created_at',
    label: 'Created On',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'expiry_date',
    label: 'Permit Expiry/Extend Date',
    sortable: true,
    draggable: true,
    defaultVisible: true
  }
];

// API function to fetch permits
const fetchPermits = async (): Promise<PermitsResponse> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERMITS}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch permits');
  }

  return await response.json();
};

// API function to fetch permit counts
const fetchPermitCounts = async (): Promise<PermitCounts> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERMIT_COUNTS}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch permit counts');
  }

  return await response.json();
};

const calculateStats = (permits: Permit[]) => {
  return {
    total: permits.length,
    active: permits.filter(p => p.status === "Active").length,
    pending: permits.filter(p => p.status === "Pending Approval").length,
    completed: permits.filter(p => p.status === "Completed").length,
    expired: permits.filter(p => p.status === "Expired").length,
    draft: permits.filter(p => p.status === "Draft").length,
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
  const [permits, setPermits] = useState<Permit[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [permitCounts, setPermitCounts] = useState<PermitCounts>({
    total: 0,
    draft: 0,
    hold: 0,
    open: 0,
    approved: 0,
    rejected: 0,
    extended: 0,
    closed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch permits on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch both permits and counts in parallel
        const [permitsResponse, countsResponse] = await Promise.all([
          fetchPermits(),
          fetchPermitCounts()
        ]);

        setPermits(permitsResponse.permits);
        setPermitCounts(countsResponse);
        setError(null);
      } catch (err) {
        setError('Failed to load permit data');
        console.error('Error fetching permit data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = calculateStats(permits);

  const handleAddPermit = () => {
    navigate("/safety/permit/add");
  };

  const handleViewPermit = (permitId: number) => {
    navigate(`/safety/permit/details/${permitId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Refresh permits data
  const handleRefresh = async () => {
    try {
      setLoading(true);

      // Fetch both permits and counts in parallel
      const [permitsResponse, countsResponse] = await Promise.all([
        fetchPermits(),
        fetchPermitCounts()
      ]);

      setPermits(permitsResponse.permits);
      setPermitCounts(countsResponse);
      setError(null);
    } catch (err) {
      setError('Failed to load permit data');
      console.error('Error fetching permit data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render cell content for EnhancedTable
  const renderCell = (permit: Permit, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-medium">{permit.id}</span>;
      case 'reference_number':
        return permit.reference_number;
      case 'permit_type':
        return permit.permit_type;
      case 'permit_for':
        return permit.permit_for;
      case 'requested_by':
        return permit.requested_by;
      case 'department_name':
        return permit.department_name;
      case 'status':
        return (
          <Badge
            className="text-white"
            style={{ backgroundColor: permit.status_color_code }}
          >
            {permit.status}
          </Badge>
        );
      case 'location':
        return (
          <span className="max-w-xs truncate block" title={permit.location}>
            {permit.location}
          </span>
        );
      case 'vendor_name':
        return permit.vender_name || '-';
      case 'created_at':
        return formatDate(permit.created_at);
      case 'expiry_date':
        return permit.expiry_date ? formatDate(permit.expiry_date) : '-';
      default:
        return permit[columnKey as keyof Permit] || '-';
    }
  };

  // Render actions for each row
  const renderActions = (permit: Permit) => (
    <div className="flex items-center gap-2">
      <div title="View permit details">
        <Eye
          className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#C72030]"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Eye clicked for permit:", permit.id);
            handleViewPermit(permit.id);
          }}
        />
      </div>
    </div>
  );

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
            <StatCard icon={<FileText />} label="Total Permits" value={permitCounts.total} />
            <StatCard icon={<CheckCircle />} label="Approved" value={permitCounts.approved} />
            <StatCard icon={<Clock />} label="Open" value={permitCounts.open} />
            <StatCard icon={<CheckCircle />} label="Closed" value={permitCounts.closed} />
            <StatCard icon={<AlertTriangle />} label="Draft" value={permitCounts.draft} />
            <StatCard icon={<AlertTriangle />} label="Hold" value={permitCounts.hold} />
            <StatCard icon={<AlertTriangle />} label="Rejected" value={permitCounts.rejected} />
            <StatCard icon={<AlertTriangle />} label="Extended" value={permitCounts.extended} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 ">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddPermit}
                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Permit
              </Button>
            </div>
          </div>

          <EnhancedTable
            data={permits}
            columns={permitColumns}
            renderCell={renderCell}
            renderActions={renderActions}
            onRowClick={(permit) => handleViewPermit(permit.id)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search permits..."
            enableExport={true}
            exportFileName="permits-export"
            pagination={true}
            pageSize={20}
            loading={loading}
            onFilterClick={() => setIsFilterModalOpen(true)}
            emptyMessage={error || "No permits found"}
            storageKey="permit-dashboard-table"
          // leftActions={
          //   <Button
          //     variant="outline"
          //     size="icon"
          //     onClick={handleRefresh}
          //     disabled={loading}
          //     title="Refresh"
          //   >
          //     <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          //   </Button>
          // }
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Permit Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total: {permitCounts.total}</span>
                  <span>100%</span>
                </div>
                <div className="flex justify-between">
                  <span>Approved: {permitCounts.approved}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.approved / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Open: {permitCounts.open}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.open / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Closed: {permitCounts.closed}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.closed / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Draft: {permitCounts.draft}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.draft / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Hold: {permitCounts.hold}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.hold / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rejected: {permitCounts.rejected}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.rejected / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Extended: {permitCounts.extended}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.extended / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Permit Types</h3>
              <div className="space-y-2">
                {permits.reduce((acc: any[], permit) => {
                  const existingType = acc.find(item => item.type === permit.permit_type);
                  if (existingType) {
                    existingType.count++;
                  } else {
                    acc.push({ type: permit.permit_type, count: 1 });
                  }
                  return acc;
                }, []).map((typeData, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{typeData.type}: {typeData.count}</span>
                    <span>{permits.length > 0 ? ((typeData.count / permits.length) * 100).toFixed(1) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <PermitFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(filters) => {
          console.log('Applied filters:', filters);
          // Implement filter logic here
        }}
      />
    </div>
  );
};