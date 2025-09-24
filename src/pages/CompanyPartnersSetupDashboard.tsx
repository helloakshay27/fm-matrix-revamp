
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { AddCompanyPartnerModal } from "@/components/AddCompanyPartnerModal";
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { editCompanyPartner, fetchCompanyPartners } from '@/store/slices/companyPartnerSlice';
import { useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner';

const columns: ColumnConfig[] = [
  {
    key: "category_name",
    label: "Company Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "image",
    label: "Company Banner",
    sortable: true,
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
]

export const CompanyPartnersSetupDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [record, setRecord] = useState({})
  const [companyPartners, setCompanyPartners] = useState([])
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
  const [loadingData, setLoadingData] = useState(true)

  const fetchData = async () => {
    setLoadingData(true)
    try {
      const response = await dispatch(fetchCompanyPartners({ baseUrl, token })).unwrap();
      setCompanyPartners(response)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCheckboxChange = async (item: any) => {
    const newStatus = !item.active;
    const itemId = item.id;

    if (updatingStatus[itemId]) return;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      await dispatch(
        editCompanyPartner({
          baseUrl,
          token,
          id: itemId,
          data: {
            pms_generic_tag: {
              active: newStatus,
            },
          },
        })
      ).unwrap();

      setCompanyPartners((prevData: any[]) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, active: newStatus } : row
        )
      );

      toast.success(`Banner ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error(error || "Failed to update active status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return <div className='flex justify-center'>
          <img src={item.image} alt={item.category_name} className="w-14 h-14" />
        </div>
      case "active":
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() =>
              handleCheckboxChange(item)
            }
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={updatingStatus[item.id]}
          />
        );
      default:
        return item[columnKey] || "-";
    }
  };

  const renderActions = (item: any) => {
    return (
      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => {
            setIsEditing(true)
            setRecord(item)
            setIsAddModalOpen(true)
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    )
  };

  const leftActions = (
    <>
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={() => setIsAddModalOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={[...companyPartners].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        pagination={true}
        pageSize={10}
        loading={loadingData}
      />

      <AddCompanyPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setIsEditing(false)
          setRecord({})
        }}
        fetchData={fetchData}
        isEditing={isEditing}
        record={record}
      />
    </div>
  );
};
