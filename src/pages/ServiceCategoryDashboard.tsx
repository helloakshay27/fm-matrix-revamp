import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";

interface ServiceCategory {
  id: number;
  service_cat_name: string;
  service_image?: {
    document_url?: string;
    url?: string;
  };
  active: boolean;
}

const columns: ColumnConfig[] = [
  {
    key: "service_cat_name",
    label: "Service Category Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "service_image",
    label: "Service Image",
    sortable: false,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "active",
    label: "Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

const ServiceCategoryDashboard = () => {
  const navigate = useNavigate();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const apiUrl = getFullUrl("/service_categories.json");
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different possible response formats
      let categoriesData: ServiceCategory[] = [];
      if (Array.isArray(data)) {
        categoriesData = data;
      } else if (data.service_categories) {
        categoriesData = data.service_categories;
      } else if (Array.isArray(data.data)) {
        categoriesData = data.data;
      }
      
      setServiceCategories(categoriesData);
    } catch (error: any) {
      console.error("Error fetching service categories:", error);
      toast.error("Failed to load service categories");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = async (item: ServiceCategory) => {
    const newStatus = !item.active;
    const itemId = item.id;

    if (updatingStatus[itemId]) return;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      const apiUrl = getFullUrl(`/service_categories/${itemId}.json`);
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
          service_category: {
            active: newStatus,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setServiceCategories((prevData) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, active: newStatus } : row
        )
      );

      toast.success(`Service Category ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      console.error("Error updating active status:", error);
      toast.error("Failed to update active status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleDelete = async (item: ServiceCategory) => {
    if (!confirm(`Are you sure you want to delete "${item.service_cat_name}"?`)) {
      return;
    }

    try {
      const apiUrl = getFullUrl(`/service_categories/${item.id}.json`);
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setServiceCategories((prevData) => prevData.filter((row) => row.id !== item.id));
      toast.success("Service Category deleted successfully");
    } catch (error: any) {
      console.error("Error deleting service category:", error);
      toast.error("Failed to delete service category. Please try again.");
    }
  };

  const renderCell = (item: ServiceCategory, columnKey: string) => {
    switch (columnKey) {
      case "service_image":
        const imageUrl = item.service_image?.document_url || item.service_image?.url;
        return (
          <div className="flex justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.service_cat_name}
                className="w-14 h-14 object-cover rounded"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}
          </div>
        );
      case "active":
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() => handleCheckboxChange(item)}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={updatingStatus[item.id]}
          />
        );
      default:
        return item[columnKey as keyof ServiceCategory] || "-";
    }
  };

  const renderActions = (item: ServiceCategory) => {
    return (
      <div className="flex gap-2">
        {/* <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/pulse/pulse-privilege/service-category/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button> */}
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/pulse/pulse-privilege/service-category/edit/${item.id}`)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        {/* <Button
          size="sm"
          variant="ghost"
          className="p-1 text-red-600 hover:text-red-700"
          onClick={() => handleDelete(item)}
        >
          <Trash2 className="w-4 h-4" />
        </Button> */}
      </div>
    );
  };

  const leftActions = (
    <>
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={() => navigate("/pulse/pulse-privilege/service-category/create")}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={[...serviceCategories].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        pagination={true}
        pageSize={10}
        loading={loadingData}
      />
    </div>
  );
};

export default ServiceCategoryDashboard;
