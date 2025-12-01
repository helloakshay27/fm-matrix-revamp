import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { getCustomerList } from "@/store/slices/cusomerSlice";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "cusomer_code",
    label: "Customer Code",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "customer_type",
    label: "Customer Type",
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
    key: "mobile",
    label: "Mobile",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  // {
  //   key: "plant_code",
  //   label: "Plant Code",
  //   sortable: true,
  //   draggable: true,
  //   defaultVisible: true,
  // },
  {
    key: "company_code",
    label: "Company Code",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "lease_start_date",
    label: "Lease Start Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "lease_end_date",
    label: "Lease End Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "free_parking",
    label: "Free Parking",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "paid_parking",
    label: "Paid Parking",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "created_at",
    label: "Created At",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "updated_at",
    label: "Updated At",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "color_code",
    label: "Color Code",
    sortable: false,
    draggable: true,
    defaultVisible: true,
  },
];

const CRMCustomersDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const { shouldShow } = useDynamicPermissions();

  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await dispatch(
          getCustomerList({ baseUrl, token })
        ).unwrap();
        const transformedData = response.entities.map((item: any) => {
          const lease = item.customer_leases?.[0];
          return {
            id: item.id,
            name: item.name,
            cusomer_code: item.ext_customer_code,
            customer_type: item.customer_type,
            email: item.email,
            mobile: item.mobile,
            // plant_code: item.plant_code,
            company_code: item.company_code,
            lease_start_date: lease?.lease_start_date,
            lease_end_date: lease?.lease_end_date,
            free_parking: lease?.free_parking,
            paid_parking: lease?.paid_parking,
            created_at: item?.created_at && format(item.created_at, 'dd-MM-yyyy'),
            updated_at: item?.updated_at && format(item.updated_at, 'dd-MM-yyyy'),
            color_code: item.color_code,
          }
        })
        setCustomers(transformedData.reverse());
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };

    fetchCustomers();
  }, []);

  console.log(customers)

  const handleExport = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/entities/export.xlsx`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "customers.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Exported successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "colorCode":
        return (
          <div className="flex items-center justify-center">
            <div
              className="w-5 h-5 rounded-md border border-gray-300"
              style={{ backgroundColor: item[columnKey] }}
            />
          </div>
        );

      default:
        return item[columnKey] || "-";
    }
  };

  const renderActions = (item: any) => (
    shouldShow("customers", "view") && (
      <Button variant="ghost" size="sm" onClick={() => navigate(`/crm/customers/${item.id}`)}>
        <Eye className="w-4 h-4" />
      </Button>
    )
  );

  const leftActions = (
    <>
      {
        shouldShow("customers", "add") && (
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => navigate("/crm/customers/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        )
      }
    </>
  );

  return (
    <div className="p-6 space-y-6">
      <EnhancedTable
        data={customers}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="crm-customers-table"
        selectAllLabel="Select all customers"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search customers..."
        enableExport={true}
        exportFileName="customers"
        handleExport={handleExport}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};

export default CRMCustomersDashboard;
