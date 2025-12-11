import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/utils/apiClient";

export const TACCodeTab = () => {
  const [tacCodes, setTacCodes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTacCode, setSelectedTacCode] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTacCodes();
  }, []);

  const fetchTacCodes = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/pms/purchase_orders/get_additional_fields.json?q[fields_for_eq]=tax_code');
      setTacCodes(response.data.additional_fields || response.data || []);
      console.log('Fetched TAX codes:', response.data.additional_fields);
    } catch (error) {
      console.error('Error fetching TAX codes:', error);
      toast.error('Failed to fetch TAX codes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      if (!formData.code || !formData.name) {
        toast.error('Code and Name are required');
        return;
      }

      setIsLoading(true);
      const payload = {
        content: {
          code: formData.code,
          name: formData.name,
          description: formData.description,
        },
        fields_for: 'tax_code'
      };

      await apiClient.post('/pms/purchase_orders/create_additional_fields.json', payload);
      toast.success('TAX code created successfully');

      setFormData({ code: '', name: '', description: '' });
      setIsCreateModalOpen(false);
      fetchTacCodes();
    } catch (error: any) {
      console.error('Error creating TAX codes:', error);
      toast.error(error.response?.data?.message || 'Failed to create TAX codes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      if (!formData.code || !formData.name) {
        toast.error('Code and Name are required');
        return;
      }

      setIsLoading(true);
      const payload = {
        content: {
          code: formData.code,
          name: formData.name,
          description: formData.description,
        },
        fields_for: 'tax_code'
      };

      await apiClient.put(`/pms/purchase_orders/create_additional_fields.json?id=${selectedTacCode.id}`, payload);
      toast.success('TAX codes updated successfully');

      setFormData({ code: '', name: '', description: '' });
      setIsEditModalOpen(false);
      setSelectedTacCode(null);
      fetchTacCodes();
    } catch (error: any) {
      console.error('Error updating TAX codes:', error);
      toast.error(error.response?.data?.message || 'Failed to update TAX codes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this TAX codes?')) return;

    try {
      setIsLoading(true);
      await apiClient.delete(`/pms/purchase_orders/create_additional_fields.json?id=${id}&fields_for=tax_code`);
      toast.success('TAX codes deleted successfully');
      fetchTacCodes();
    } catch (error: any) {
      console.error('Error deleting TAX codes:', error);
      toast.error(error.response?.data?.message || 'Failed to delete TAX codes');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (tacCode: any) => {
    setSelectedTacCode(tacCode);
    setFormData({
      code: tacCode.content?.code,
      name: tacCode.content?.name,
      description: tacCode.content?.description,

    });
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ code: '', name: '', description: '' });
    setSelectedTacCode(null);
    setIsCreateModalOpen(true);
  };

  const filteredTacCodes = tacCodes.filter(tac =>
    tac.content?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tac.content?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const paginatedTacCodes = filteredTacCodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTacCodes.length / itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Search and Add Button */}
      <div className="flex gap-3 items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search TAX codes..."
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
          <Plus className="w-4 h-4" />
          Add TAX codes
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading && paginatedTacCodes.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filteredTacCodes.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-gray-500">
            No TAX codes found
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
                {paginatedTacCodes.map((tacCode) => (
                  <TableRow key={tacCode.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {tacCode.content?.code}

                    </TableCell>

                    <TableCell>
                      {tacCode.content?.name}
                    </TableCell>

                    <TableCell className="text-gray-600">
                      {tacCode.content?.description || '-'}
                    </TableCell>

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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create TAX codes</DialogTitle>
            <DialogDescription>
              Add a new TAX codes to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                placeholder="Enter TAX codes"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-[#BF213E] hover:bg-[#A01830]"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit TAX codes</DialogTitle>
            <DialogDescription>
              Update TAX codes details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Code *</Label>
              <Input
                id="edit-code"
                placeholder="Enter TAX codes"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                className="bg-[#BF213E] hover:bg-[#A01830]"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TACCodeTab;
