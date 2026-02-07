import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";


const columns: ColumnConfig[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "description",
    label: "Description",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "mobile",
    label: "Mobile",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "address",
    label: "Address",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "attachment",
    label: "Attachment",
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

const SupportedServiceDashboard = () => {
  const navigate = useNavigate();
  const [plusServices, setPlusServices] = useState<any[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        throw new Error("API configuration is missing");
      }

      const apiUrl = getFullUrl("/osr_setups/osr_sub_categories.json?q[service_tag_eq]=supported");

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
      // Expecting { osr_sub_categories: [...] }
      const servicesList = Array.isArray(data.osr_sub_categories)
        ? data.osr_sub_categories.map((item: any) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            description: item.description,
            mobile: item.mobile,
            address: item.address,
            active: item.active === 1,
            attachment: item.attachment
            ? {
                document_url: item.attachment.document_url,
                document_content_type: item.attachment.document_content_type,
              }
            : undefined, // No attachment in API response
          }))
        : [];
      setPlusServices(servicesList);
    } catch (error: any) {
      console.error("Error fetching plus services:", error);
      toast.error(`Failed to load plus services: ${error.message}`, {
        duration: 5000,
      });
      setPlusServices([]);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = async (item: any) => {
    const newStatus = !item.active;
    const itemId = item.id;

    if (updatingStatus[itemId]) return;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        throw new Error("API configuration is missing");
      }

      const apiUrl = getFullUrl(`/osr_setups/modify_osr_sub_category.json?q[service_tag_eq]=supported&id=${itemId}`);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
         active: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPlusServices((prevData: any[]) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, active: newStatus } : row
        )
      );

      toast.success(`Service ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      console.error("Error updating active status:", error);
      toast.error(error.message || "Failed to update active status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleDelete = async (item: any) => {
    if (!window.confirm("Are you sure you want to delete this plus service?")) {
      return;
    }

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        throw new Error("API configuration is missing");
      }

      const apiUrl = getFullUrl(`/plus_services/${item.id}.json`);

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPlusServices((prev) => prev.filter((service: any) => service.id !== item.id));
      toast.success("Plus service deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting plus service:", error);
      toast.error(error.message || "Failed to delete plus service.");
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "attachment":
        if (item.attachment && Object.keys(item.attachment).length > 0) {
          const attachmentUrl =
            item.attachment.document_url ||
            item.attachment.url ||
            "";
          const contentType =
            item.attachment.document_content_type ||
            item.attachment.content_type ||
            "";

          if (attachmentUrl && contentType.startsWith("image/")) {
            return (
              <div className="flex justify-center">
                <img
                  src={attachmentUrl}
                  alt="Service Attachment"
                  className="w-14 h-14 object-cover rounded"
                />
              </div>
            );
          } else if (attachmentUrl && contentType.startsWith("video/")) {
            return (
              <div className="flex justify-center">
                <video
                  width="56"
                  height="56"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="rounded object-cover"
                >
                  <source src={attachmentUrl} type={contentType} />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          } else if (attachmentUrl) {
            return (
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download
              </a>
            );
          }
        }
        return <span className="text-gray-400">No attachment</span>;

      case "active":
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() => handleCheckboxChange(item)}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={updatingStatus[item.id]}
          />
        );

      case "description":
        return (
          <span className="text-sm text-gray-600">
            {item.description || "-"}
          </span>
        );

      case "email":
        return (
          <span className="text-sm text-gray-600">
            {item.email || "-"}
          </span>
        );

      default:
        return item[columnKey] || "-";
    }
  };

  const renderActions = (item: any) => {
    return (
      <div className="flex gap-2">
        {/* <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/pulse/pulse-privilege/plus-service/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button> */}
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/pulse/supported-services/service/edit/${item.id}`)}
          disabled={!item.active}
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
        onClick={() => navigate("/pulse/supported-services/service/create")}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Supported Services</h1>
      </div>

      <EnhancedTable
        data={[...plusServices].reverse()}
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

export default SupportedServiceDashboard;
