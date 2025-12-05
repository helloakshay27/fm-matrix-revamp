import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil } from "lucide-react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import axios from "axios";

interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  userLimit: string;
  renewalTerms: string;
  amenities: string[];
  createdOn: string;
  createdBy: string;
  status: boolean;
}

const columns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    draggable: true,
  },
  {
    key: 'name',
    label: 'Plan Name',
    sortable: true,
    draggable: true,
  },
  {
    key: 'price',
    label: 'Price',
    sortable: true,
    draggable: true,
  },
  {
    key: 'userLimit',
    label: 'User Limit',
    sortable: true,
    draggable: true,
  },
  {
    key: 'renewalTerms',
    label: 'Renewal Terms',
    sortable: true,
    draggable: true,
  },
  {
    key: 'createdOn',
    label: 'Created On',
    sortable: true,
    draggable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    draggable: true,
  },
];

const transformData = (data) => {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price ? `₹${item.price}` : '',
    userLimit: item.user_limit,
    renewalTerms: item.renewal_terms ? item.renewal_terms.charAt(0).toUpperCase() + item.renewal_terms.slice(1) : '',
    status: item.status ? 'Active' : 'Inactive',
    createdOn: item.created_at,
  }));
}

export const MembershipPlanDashboard = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const [membershipPlanData, setMembershipPlanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const fetchMembershipPlanData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://${baseUrl}/membership_plans.json`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      setMembershipPlanData(transformData(response.data.plans));
    } catch (error) {
      console.error("Error fetching membership plan data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipPlanData();
  }, []);

  const handleAddMembership = () => {
    navigate("/club-management/vas/membership-plan/setup/add");
  };

  const handleStatusToggle = async (id: string) => {

  };

  const handleViewDetails = (id: string) => {
    navigate(`/club-management/vas/membership-plan/setup/details/${id}`);
  };

  const handleEditDetails = (id: string) => {
    navigate(`/club-management/vas/membership-plan/setup/edit/${id}`);
  };

  const renderCell = (item: MembershipPlan, columnKey: string) => {
    switch (columnKey) {
      default:
        return item[columnKey as keyof MembershipPlan]?.toString() || '';
    }
  };

  const renderActions = (plan: MembershipPlan) => (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleViewDetails(plan.id)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleEditDetails(plan.id)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setShowActionPanel(true)}
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
      >
        <Plus className="w-4 h-4" />
        Action
      </Button>
    </div>
  );

  return (
    <div className="p-6 bg-white">
      {showActionPanel && (
        <SelectionPanel
          onAdd={handleAddMembership}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      <div className="rounded-lg shadow-sm p-1 bg-transparent">
        <EnhancedTable
          data={membershipPlanData}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="membership-plan-table"
          className="min-w-full"
          emptyMessage={loading ? "Loading membership plan data..." : "No membership plan data found"}
          leftActions={leftActions}
          enableSearch={true}
          enableSelection={false}
          hideTableExport={true}
          pagination={true}
          pageSize={10}
        />
      </div>
    </div>
  );
};
