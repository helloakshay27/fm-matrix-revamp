import { AddTestimonialModal } from "@/components/AddTestimonialModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Eye, Edit, Plus } from 'lucide-react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const columns: ColumnConfig[] = [
  {
    key: "siteName",
    label: "Site",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "testimonialName",
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
    key: "companyName",
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
    key: "status",
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

  const [showAddModal, setShowAddModal] = useState(false);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return (
          <Switch
            checked={item.status}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
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
        data={data}
        columns={columns}
        renderActions={renderActions}
        renderCell={renderCell}
        leftActions={leftActions}
      />

      <AddTestimonialModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  )
}