import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/utils/apiClient";
import { FinanceMasterTable } from "./FinanceMasterTable";

export const StorageLocationTab = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  /** =============================
   *       GET STORAGE LOCATIONS
   * ============================= */
  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        "/pms/purchase_orders/get_additional_fields.json?q[fields_for_eq]=storage_location"
      );

      setLocations(response.data.additional_fields || []);
    } catch (e) {
      toast.error("Failed to load storage locations");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *          CREATE
   * ============================= */
  const handleCreate = async () => {
    try {
      if (!formData.code || !formData.name) {
        toast.error("Code and Name are required");
        return;
      }

      setIsLoading(true);

      const payload = {
        content: { ...formData },
        fields_for: "storage_location",
      };

      await apiClient.post(
        "/pms/purchase_orders/create_additional_fields.json",
        payload
      );

      toast.success("Storage Location created");

      setFormData({ code: "", name: "", description: "" });
      setIsCreateModalOpen(false);
      fetchLocations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create location");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *          UPDATE
   * ============================= */
  const handleEdit = async () => {
    try {
      if (!formData.code || !formData.name) {
        toast.error("Code and Name are required");
        return;
      }

      setIsLoading(true);

      const payload = {
        content: { ...formData },
        fields_for: "storage_location",
      };

      await apiClient.put(
        `/pms/purchase_orders/create_additional_fields.json?id=${selectedLocation.id}`,
        payload
      );

      toast.success("Storage Location updated");

      setFormData({ code: "", name: "", description: "" });
      setSelectedLocation(null);
      setIsEditModalOpen(false);
      fetchLocations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *          DELETE
   * ============================= */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this storage location?")) return;

    try {
      setIsLoading(true);
      await apiClient.delete(
        `/pms/purchase_orders/create_additional_fields.json?id=${id}&fields_for=storage_location`
      );
      toast.success("Deleted successfully");
      fetchLocations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *       OPEN EDIT MODAL
   * ============================= */
  const openEditModal = (loc: any) => {
    setSelectedLocation(loc);
    setFormData({
      code: loc.content?.code,
      name: loc.content?.name,
      description: loc.content?.description || "",
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <FinanceMasterTable
        data={locations}
        loading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        storageKey="storage-location-table"
        emptyMessage="No Storage Locations Found"
        addLabel="Add Location"
        onAdd={() => setIsCreateModalOpen(true)}
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Storage Location</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Code *</Label>
            <Input
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />

            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>

              <Button className="bg-[#BF213E] text-white" onClick={handleCreate}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Storage Location</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Code *</Label>
            <Input
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />

            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>

              <Button className="bg-[#BF213E] text-white" onClick={handleEdit}>
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StorageLocationTab;
