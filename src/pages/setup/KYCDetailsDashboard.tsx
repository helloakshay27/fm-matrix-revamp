import React, { useState } from "react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface KYCDetail {
  id: string;
  userName: string;
  userEmail: string;
  userMobile: string;
}

// Sample data to match the reference image
const sampleKYCDetails: KYCDetail[] = [
  {
    id: "kyc-1",
    userName: "Nupura Waradkar",
    userEmail: "Nupura@Stnc.In",
    userMobile: "9864181000",
  },
  {
    id: "kyc-2",
    userName: "Demo Demo",
    userEmail: "Demo@Lockated.Com",
    userMobile: "5889965447",
  },
];

export const KYCDetailsDashboard = () => {
  const navigate = useNavigate();
  
  // Sample data populated from reference image
  const [kycDetails, setKycDetails] = useState<KYCDetail[]>(sampleKYCDetails);
  
  const [selectedKYCDetails, setSelectedKYCDetails] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userMobile: "",
  });

  // Define columns for the table
  const columns = [
    {
      key: "userName",
      label: "User Name",
      sortable: true,
      draggable: true,
    },
    {
      key: "userEmail",
      label: "User Email",
      sortable: true,
      draggable: true,
    },
    {
      key: "userMobile",
      label: "User Mobile",
      sortable: true,
      draggable: true,
    },
  ];

  // Handlers
  const handleAddKYCDetail = () => {
    setShowAddDialog(true);
  };

  const handleSubmitKYCDetail = () => {
    // Validate form
    if (!formData.userName.trim()) {
      toast.error("Please enter user name");
      return;
    }
    if (!formData.userEmail.trim()) {
      toast.error("Please enter user email");
      return;
    }
    if (!formData.userMobile.trim()) {
      toast.error("Please enter user mobile");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate mobile format (basic validation)
    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(formData.userMobile.replace(/[\s\-\(\)]/g, ""))) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    const newKYCDetail: KYCDetail = {
      id: `kyc-${Date.now()}`,
      userName: formData.userName,
      userEmail: formData.userEmail,
      userMobile: formData.userMobile,
    };

    setKycDetails([...kycDetails, newKYCDetail]);
    setFormData({ userName: "", userEmail: "", userMobile: "" });
    setShowAddDialog(false);
    toast.success("KYC Detail added successfully!");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedKYCDetails(kycDetails.map((detail) => detail.id));
    } else {
      setSelectedKYCDetails([]);
    }
  };

  const handleSelectKYCDetail = (kycDetailId: string, checked: boolean) => {
    if (checked) {
      setSelectedKYCDetails([...selectedKYCDetails, kycDetailId]);
    } else {
      setSelectedKYCDetails(
        selectedKYCDetails.filter((id) => id !== kycDetailId)
      );
    }
  };

  const handleViewKYCDetail = (kycDetailId: string) => {
    navigate(`/kyc-details/${kycDetailId}`);
  };

  // Render actions for each row
  const renderActions = (item: KYCDetail) => {
    return (
      <button
        onClick={() => handleViewKYCDetail(item.id)}
        className="text-black hover:text-gray-700"
        title="View"
      >
        <Eye className="w-4 h-4" />
      </button>
    );
  };

  // Custom cell renderer
  const renderCell = (item: KYCDetail, columnKey: string) => {
    switch (columnKey) {
      case "userName":
        return <span>{item.userName}</span>;
      case "userEmail":
        return <span>{item.userEmail}</span>;
      case "userMobile":
        return <span>{item.userMobile}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">
      {/* Separate Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            KYC Details
          </h1>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <EnhancedTable
          data={kycDetails}
          columns={columns}
          selectedItems={selectedKYCDetails}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectKYCDetail}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          renderCell={renderCell}
          renderActions={renderActions}
          leftActions={
            <Button
              onClick={handleAddKYCDetail}
              className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          }
        />
      </div>

      {/* Add KYC Detail Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add KYC Detail</DialogTitle>
            <button
              onClick={() => {
                setShowAddDialog(false);
                setFormData({ userName: "", userEmail: "", userMobile: "" });
              }}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">
                User Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userName"
                placeholder="Enter User Name"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">
                User Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="Enter User Email"
                value={formData.userEmail}
                onChange={(e) =>
                  setFormData({ ...formData, userEmail: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userMobile">
                User Mobile <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userMobile"
                type="tel"
                placeholder="Enter User Mobile"
                value={formData.userMobile}
                onChange={(e) =>
                  setFormData({ ...formData, userMobile: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setFormData({ userName: "", userEmail: "", userMobile: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitKYCDetail}
              className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
