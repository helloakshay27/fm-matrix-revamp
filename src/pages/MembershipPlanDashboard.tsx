import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Eye, Pencil } from "lucide-react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";

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

// Static data for testing
const STATIC_MEMBERSHIP_DATA: MembershipPlan[] = [
  {
    id: "1",
    name: "Gold Membership",
    price: "50000",
    userLimit: "4",
    renewalTerms: "yearly",
    amenities: ["Swimming Pool", "Gym", "Spa", "Tennis Court", "Restaurant"],
    createdOn: "2024-01-15",
    createdBy: "Admin User",
    status: true,
  },
  {
    id: "2",
    name: "Silver Membership",
    price: "30000",
    userLimit: "2",
    renewalTerms: "quarterly",
    amenities: ["Swimming Pool", "Gym", "Cafe"],
    createdOn: "2024-02-20",
    createdBy: "Admin User",
    status: true,
  },
  {
    id: "3",
    name: "Platinum Membership",
    price: "100000",
    userLimit: "6",
    renewalTerms: "yearly",
    amenities: ["Swimming Pool", "Gym", "Spa", "Tennis Court", "Basketball Court", "Sauna", "Steam Room", "Jacuzzi", "Restaurant", "Bar"],
    createdOn: "2024-01-10",
    createdBy: "John Doe",
    status: true,
  },
  {
    id: "4",
    name: "Bronze Membership",
    price: "15000",
    userLimit: "1",
    renewalTerms: "monthly",
    amenities: ["Gym", "Yoga Studio"],
    createdOn: "2024-03-05",
    createdBy: "Jane Smith",
    status: false,
  },
  {
    id: "5",
    name: "Family Membership",
    price: "75000",
    userLimit: "8",
    renewalTerms: "yearly",
    amenities: ["Swimming Pool", "Gym", "Kids Play Area", "Game Room", "Restaurant", "Cafe"],
    createdOn: "2024-02-01",
    createdBy: "Admin User",
    status: true,
  },
];

export const MembershipPlanDashboard = () => {
  const navigate = useNavigate();
  const [membershipPlanData, setMembershipPlanData] = useState<MembershipPlan[]>(STATIC_MEMBERSHIP_DATA);
  const [loading, setLoading] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);

  // Fetch membership plan data from API
  const fetchMembershipPlanData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/pms/admin/membership_plans.json");
      
      if (response.data && response.data.membership_plans) {
        const formattedData = response.data.membership_plans.map(
          (item: any) => ({
            id: item.id.toString(),
            name: item.name || "",
            price: item.price || "",
            userLimit: item.user_limit || "",
            renewalTerms: item.renewal_terms || "",
            amenities: item.amenities || [],
            createdOn: item.created_at?.split(" ")[0] || "",
            createdBy: item.created_by || "",
            status: item.active || false,
          })
        );
        setMembershipPlanData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching membership plan data:", error);
      // Use static data as fallback
      setMembershipPlanData(STATIC_MEMBERSHIP_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Comment out API call to use static data
    // fetchMembershipPlanData();
  }, []);

  const handleAddMembership = () => {
    navigate("/club-management/vas/membership-plan/setup/add");
  };

  const handleStatusToggle = async (id: string) => {
    const planToUpdate = membershipPlanData.find((plan) => plan.id === id);
    if (!planToUpdate) return;

    const updatedStatus = !planToUpdate.status;

    try {
      await apiClient.patch(`/pms/admin/membership_plans/${id}.json`, {
        membership_plan: {
          active: updatedStatus,
        },
      });

      toast.success("Membership plan status updated successfully!");
      setMembershipPlanData((prevData) =>
        prevData.map((plan) =>
          plan.id === id ? { ...plan, status: updatedStatus } : plan
        )
      );
    } catch (error) {
      console.error("Failed to update membership plan status:", error);
      toast.error("Failed to update membership plan status");
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/club-management/vas/membership-plan/setup/details/${id}`);
  };

  const handleEditDetails = (id: string) => {
    navigate(`/club-management/vas/membership-plan/setup/edit/${id}`);
  };

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
      key: 'amenities',
      label: 'Amenities',
      sortable: false,
      draggable: true,
    },
    {
      key: 'createdOn',
      label: 'Created On',
      sortable: true,
      draggable: true,
    },
    {
      key: 'createdBy',
      label: 'Created by',
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

  const renderCell = (item: MembershipPlan, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return item.id || '';
      case 'name':
        return item.name || '';
      case 'price':
        return item.price ? `₹${item.price}` : '';
      case 'userLimit':
        return item.userLimit || '';
      case 'renewalTerms':
        return item.renewalTerms ? item.renewalTerms.charAt(0).toUpperCase() + item.renewalTerms.slice(1) : '';
      case 'amenities':
        return (
          <div className="flex flex-wrap gap-1">
            {item.amenities && item.amenities.length > 0 ? (
              item.amenities.slice(0, 2).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-[#E6E0D3] text-[#C72030]"
                >
                  {amenity}
                </span>
              ))
            ) : (
              <span className="text-gray-400">—</span>
            )}
            {item.amenities && item.amenities.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-[#E6E0D3] text-[#C72030]">
                +{item.amenities.length - 2}
              </span>
            )}
          </div>
        );
      case 'createdOn':
        return item.createdOn || '';
      case 'createdBy':
        return item.createdBy || '';
      case 'status':
        return (
          <div className="flex items-center justify-center">
            <div
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                item.status ? 'bg-green-500' : 'bg-gray-300'
              }`}
              onClick={() => handleStatusToggle(item.id)}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  item.status ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
          </div>
        );
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
