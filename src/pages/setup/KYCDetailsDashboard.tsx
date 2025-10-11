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
import { Plus, Edit2, X } from "lucide-react";
import { toast } from "sonner";

interface KYCDetail {
  id: string;
  userName: string;
  userEmail: string;
  userMobile: string;
}

export const KYCDetailsDashboard = () => {
  // Sample data - empty initially to match the design
  const [kycDetails, setKycDetails] = useState<KYCDetail[]>([]);
  
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
      key: "actions",
      label: "Actions",
      sortable: false,
      draggable: false,
    },
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

  const handleEditKYCDetail = (kycDetailId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit KYC Detail:", kycDetailId);
    toast.info("Edit functionality coming soon!");
  };

  const handleDeleteKYCDetail = (kycDetailId: string) => {
    setKycDetails(kycDetails.filter((detail) => detail.id !== kycDetailId));
    toast.success("KYC Detail deleted successfully!");
  };

  // Custom cell renderer
  const renderCell = (item: KYCDetail, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleEditKYCDetail(item.id)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteKYCDetail(item.id)}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
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
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            KYC Details
          </h1>

          <EnhancedTable
            data={kycDetails}
            columns={columns}
            selectedItems={selectedKYCDetails}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectKYCDetail}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            renderCell={renderCell}
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
      </div>

      {/* Add KYC Detail Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add KYC Detail</DialogTitle>
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
