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
  hsnCode: string
  amenities: string[];
  createdOn: string;
  createdBy: string;
  status: string;
  active: boolean;
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
    label: 'Membership Type',
    sortable: true,
    draggable: true,
  },
  {
    key: 'hsnCode',
    label: 'HSN Code',
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
    hsnCode: item.hsn_code || '',
    status: item.active ? 'Active' : 'Inactive',
    active: item.active,
    createdOn: item.created_at ? (() => {
      // Handles ISO string, 'YYYY-MM-DD', 'YYYY-MM-DD, HH:mm', 'YYYY-MM-DD HH:mm'
      let formattedDate = '';
      let formattedTime = '';
      // Try ISO or Date parsing
      const dateObj = new Date(item.created_at);
      if (!isNaN(dateObj.getTime())) {
        const d = String(dateObj.getDate()).padStart(2, '0');
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const y = dateObj.getFullYear();
        formattedDate = `${d}/${m}/${y}`;
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const mins = String(dateObj.getMinutes()).padStart(2, '0');
        formattedTime = `${hours}:${mins}`;
        return `${formattedDate}, ${formattedTime}`;
      }
      // fallback: try to split manually
      let datePart = item.created_at;
      let timePart = '';
      if (item.created_at.includes(',')) {
        [datePart, timePart] = item.created_at.split(',').map(s => s.trim());
      } else if (item.created_at.includes(' ')) {
        [datePart, timePart] = item.created_at.split(' ').map(s => s.trim());
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        const [year, month, day] = datePart.split('-');
        formattedDate = `${day}/${month}/${year}`;
      } else {
        formattedDate = item.created_at;
      }
      if (timePart) {
        return `${formattedDate}, ${timePart}`;
      }
      return formattedDate;
    })() : '',
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
    navigate("/settings/vas/membership-plan/setup/add");
  };

  const handleStatusToggle = async (plan: MembershipPlan) => {
    const loadingToast = toast.loading(`${plan.active ? 'Deactivating' : 'Activating'} ${plan.name}...`);
    try {
      const newStatus = !plan.active;
      
      const response = await axios.patch(`https://${baseUrl}/membership_plans/${plan.id}.json`, 
        { plan: { active: newStatus } },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200 || response.status === 204) {
        toast.success('Status updated successfully', { id: loadingToast });
        fetchMembershipPlanData();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error("Error updating membership plan status:", error);
      toast.error('Failed to update status', { id: loadingToast });
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/settings/vas/membership-plan/setup/details/${id}`);
  };

  const handleEditDetails = (id: string) => {
    navigate(`/settings/vas/membership-plan/setup/edit/${id}`);
  };

  const renderCell = (item: MembershipPlan, columnKey: string) => {
    if (columnKey === 'status') {
      const active = item.active;
      return (
        <div className="flex items-center gap-3">
          <div 
            onClick={() => handleStatusToggle(item)}
            className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${active ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
          </div>
          {/* <span className={`text-xs font-medium ${active ? 'text-green-600' : 'text-red-600'}`}>
            {active ? 'Active' : 'Inactive'}
          </span> */}
        </div>
      );
    }

    switch (columnKey) {
      default:
        return item[columnKey as keyof MembershipPlan]?.toString() || '--';
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
