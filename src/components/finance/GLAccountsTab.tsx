import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/utils/apiClient";

export const GLAccountsTab = () => {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  /** =============================
   *  SEARCH & PAGINATION
   * ============================= */
  const filtered = items.filter(i =>
    i.content?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.content?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="space-y-4">

      {/* Search + Add */}
      <div className="flex gap-3 items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-[#BF213E] hover:bg-[#A01830] text-white gap-2"
        >
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading && paginated.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-gray-500">
            No records found
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Code</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.map(item => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>{item.content?.code}</TableCell>
                    <TableCell>{item.content?.name}</TableCell>
                    <TableCell>{item.content?.description || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
