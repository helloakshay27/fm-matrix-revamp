import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { fetchAddresses } from "@/store/slices/addressMasterSlice";
import { format } from "date-fns";
import { Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns: ColumnConfig[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "building_name",
    label: "Building Name",
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
    key: "state",
    label: "State",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "phone",
    label: "Phone Number",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "fax",
    label: "Fax",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "gst_number",
    label: "GST Number",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "created_at",
    label: "Created On",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "updated_at",
    label: "Updated On",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
]

export const AddressMasterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const response = await dispatch(fetchAddresses({ token, baseUrl })).unwrap();
        setAddresses(response)
      } catch (error) {
        console.log(error)
      }
    }

    getAddresses()
  }, [])

  const renderActions = (item: any) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => {
          navigate(`/master/address/edit/${item.id}`);
        }}
      >
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "created_at":
      case "updated_at":
        return item[columnKey] ? format(item[columnKey], "dd/MM/yyyy") : "-";
      default:
        return item[columnKey] || "-";
    }
  };

  const leftActions = (
    <Button
      className="bg-[#C72030] hover:bg-[#A01020] text-white"
      onClick={() => navigate("/master/address/add")}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  return (
    <div className="p-4 sm:p-6">
      <EnhancedTable
        data={addresses}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="address-master-table"
        className="min-w-[1000px]"
        emptyMessage="No addressed found"
      />
    </div>
  )
}