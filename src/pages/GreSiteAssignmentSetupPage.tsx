import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

interface GreSiteAssignment {
  id: number;
  user_name: string;
  site_name: string;
  user_email?: string;
  user_mobile?: string;
  created_at?: string;
  updated_at?: string;
}

const columns: ColumnConfig[] = [
  { key: "id", label: "Id", sortable: true, draggable: true },
  { key: "site_name", label: "Site", sortable: true, draggable: true },
  { key: "user_name", label: "GRE User", sortable: true, draggable: true },
  { key: "user_email", label: "User Email", sortable: true, draggable: true },
  { key: "user_mobile", label: "User Mobile", sortable: true, draggable: true },
  { key: "created_at", label: "Created At", sortable: true, draggable: true },
  { key: "updated_at", label: "Updated At", sortable: true, draggable: true },
];

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const GreSiteAssignmentSetupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<GreSiteAssignment[]>([]);

  const renderCell = (item: GreSiteAssignment, columnKey: string) => {
    if (columnKey === "created_at") return formatDateTime(item.created_at);
    if (columnKey === "updated_at") return formatDateTime(item.updated_at);
    return item[columnKey as keyof GreSiteAssignment] || "-";
  };

  const renderActions = (item: GreSiteAssignment) => (
    <Button
      size="sm"
      variant="ghost"
      className="p-1"
      title="Edit"
      onClick={() => navigate(`/pulse/gre-site-assignment-setup/edit/${item.id}`)}
    >
      <Edit className="w-4 h-4" />
    </Button>
  );

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        getFullUrl("/pms/admin/gre_site_assignments.json"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rows =
        data?.data ||
        data?.gre_site_assignments ||
        (Array.isArray(data) ? data : []);

      setAssignments(Array.isArray(rows) ? rows : []);
    } catch (error) {
      console.error("Failed to fetch GRE assignments", error);
      toast.error("Failed to load GRE site assignments");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const leftActions = (
    <Button onClick={() => navigate("/pulse/gre-site-assignment-setup/add")}>
      <Plus size={18} />
      Add
    </Button>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={assignments}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        loading={loading}
        emptyMessage="No GRE site assignments found"
        pagination={true}
        pageSize={10}
        hideTableSearch={true}
        hideColumnsButton={true}
        getItemId={(item: GreSiteAssignment) => String(item.id)}
      />
    </div>
  );
};

export default GreSiteAssignmentSetupPage;
