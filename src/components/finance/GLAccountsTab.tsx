import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/utils/apiClient";
import { FinanceMasterTable } from "./FinanceMasterTable";

export const GLAccountsTab = () => {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  /** =============================
   *  GET ADDITIONAL FIELDS
   * ============================= */
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        '/pms/purchase_orders/get_additional_fields.json?q[fields_for_eq]=gl_account'
      );

      setItems(response.data.additional_fields || []);
    } catch (error) {
      console.error("Error fetching GL Accounts:", error);
      toast.error("Failed to fetch GL Accounts");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *  CREATE NEW RECORD
   * ============================= */
  const handleCreate = async () => {
    try {
      if (!formData.code || !formData.name) {
        toast.error("Code and Name are required");
        return;
      }

      setIsLoading(true);

      const payload = {
        content: {
          code: formData.code,
          name: formData.name,
          description: formData.description
        },
        fields_for: "gl_account"
      };

      await apiClient.post('/pms/purchase_orders/create_additional_fields.json', payload);

      toast.success("Created successfully");
      setFormData({ code: '', name: '', description: '' });
      setIsCreateModalOpen(false);
      fetchItems();

    } catch (error: any) {
      console.error("Error creating record:", error);
      toast.error(error.response?.data?.message || "Failed to create record");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *  UPDATE RECORD
   * ============================= */
  const handleEdit = async () => {
    try {
      if (!formData.code || !formData.name) {
        toast.error("Code and Name are required");
        return;
      }

      setIsLoading(true);

      const payload = {
        content: {
          code: formData.code,
          name: formData.name,
          description: formData.description
        },
        fields_for: "gl_account"
      };

      await apiClient.put(
        `/pms/purchase_orders/create_additional_fields.json?id=${selectedItem.id}`,
        payload
      );

      toast.success("Updated successfully");
      setFormData({ code: '', name: '', description: '' });
      setIsEditModalOpen(false);
      setSelectedItem(null);
      fetchItems();

    } catch (error: any) {
      console.error("Error updating record:", error);
      toast.error(error.response?.data?.message || "Failed to update record");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *  DELETE RECORD
   * ============================= */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      setIsLoading(true);
      await apiClient.delete(
        `/pms/purchase_orders/create_additional_fields.json?id=${id}&fields_for=gl_account`
      );

      toast.success("Deleted successfully");
      fetchItems();

    } catch (error: any) {
      console.error("Error deleting:", error);
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *  OPEN EDIT MODAL
   * ============================= */
  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setFormData({
      code: item.content?.code,
      name: item.content?.name,
      description: item.content?.description || ""
    });
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ code: '', name: '', description: '' });
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <FinanceMasterTable
        data={items}
        loading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        storageKey="gl-accounts-table"
        emptyMessage="No records found"
        addLabel="Add"
        onAdd={openCreateModal}
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Code *</Label>
            <Input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />

            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handleCreate} className="bg-[#BF213E] text-white">
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
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Code *</Label>
            <Input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />

            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handleEdit} className="bg-[#BF213E] text-white">
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default GLAccountsTab;
