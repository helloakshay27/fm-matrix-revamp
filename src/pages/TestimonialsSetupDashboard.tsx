import { AddTestimonialModal } from "@/components/AddTestimonialModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { useAppDispatch } from "@/store/hooks";
import { editTestimonial, fetchTestimonials } from "@/store/slices/testimonialSlice";
import { Eye, Edit, Plus } from 'lucide-react'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const columns: ColumnConfig[] = [
  {
    key: "name",
    label: "Testimonial Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "designation",
    label: "Designation",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "company_name",
    label: "Company Name",
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
    key: "profile",
    label: "Profile Image",
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

const data = [
  {
    id: 1,
    siteName: "Site 1",
    testimonialName: "Testimonial 1",
    designation: "Designation 1",
    companyName: "Company 1",
    description: "Description 1",
    profile: "Profile 1",
    status: "Active",
  },
  {
    id: 2,
    siteName: "Site 2",
    testimonialName: "Testimonial 2",
    designation: "Designation 2",
    companyName: "Company 2",
    description: "Description 2",
    profile: "Profile 2",
    status: "Inactive",
  },
]

export const TestimonialsSetupDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const siteId = localStorage.getItem("selectedSiteId");

  const [showAddModal, setShowAddModal] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [isEditing, setIsEditing] = useState(false)
  const [record, setRecord] = useState({})
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchTestimonials({ baseUrl, token, siteId })).unwrap();
      setTestimonials(response.data);
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleCheckboxChange = async (item: any) => {
    const newStatus = !item.active;
    const itemId = item.id;

    if (updatingStatus[itemId]) return;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      await dispatch(
        editTestimonial({
          baseUrl,
          token,
          id: itemId,
          data: {
            testimonial: {
              active: newStatus,
            },
          },
        })
      ).unwrap();

      setTestimonials((prevData: any[]) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, active: newStatus } : row
        )
      );

      toast.success(`Testimonial ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error(error || "Failed to update active status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "description":
        return <div className="w-[20rem] text-ellipsis overflow-hidden">{item.description}</div>
      case "profile":
        return <div className="flex justify-center">
          <img src={item.video_preview_image} className="w-14 h-14 object-cover" />
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
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/settings/community-modules/testimonial-setup/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => {
            setIsEditing(true)
            setShowAddModal(true)
            setRecord(item)
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
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={testimonials}
        columns={columns}
        renderActions={renderActions}
        renderCell={renderCell}
        leftActions={leftActions}
        pagination={true}
        pageSize={10}
      />

      <AddTestimonialModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setIsEditing(false)
          setRecord({})
        }}
        fetchData={fetchData}
        isEditing={isEditing}
        record={record}
      />
    </div>
  )
}