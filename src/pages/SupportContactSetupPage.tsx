import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

interface SupportContact {
  call_us: string;
  mail_us: string;
  whatsapp_support: string;
}

const columns: ColumnConfig[] = [
  { key: "call_us", label: "Call Us", sortable: true, draggable: true },
  { key: "mail_us", label: "Mail Us", sortable: true, draggable: true },
  {
    key: "whatsapp_support",
    label: "WhatsApp Support",
    sortable: true,
    draggable: true,
  },
];

const SupportContactSetupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<SupportContact[]>([]);

  const fetchSupportContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(getFullUrl("/api/pms/support_contacts"), {
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
      const contactData = data?.data || {};
      setContacts(
        contactData && Object.keys(contactData).length > 0 ? [contactData] : []
      );
    } catch (error) {
      console.error("Failed to fetch support contacts", error);
      toast.error("Failed to load support contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportContacts();
  }, []);

  const renderCell = (item: SupportContact, columnKey: string) => {
    return item[columnKey as keyof SupportContact] || "-";
  };

  const renderActions = (item: SupportContact) => {
    const encodedData = encodeURIComponent(JSON.stringify(item));
    return (
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() =>
          navigate(`/pulse/support-contact-setup/add?prefill=${encodedData}`)
        }
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Button>
    );
  };

  const leftActions = (
    <Button onClick={() => navigate("/pulse/support-contact-setup/add")}>
      <Plus size={18} />
      Add
    </Button>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={contacts}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        loading={loading}
        emptyMessage="No support contacts found"
        pagination={false}
        hideTableSearch={true}
        hideColumnsButton={true}
        getItemId={(item: SupportContact) =>
          `${item.call_us}-${item.mail_us}-${item.whatsapp_support}`
        }
      />
    </div>
  );
};

export default SupportContactSetupPage;
