import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl as MuiFormControl, TextField } from "@mui/material";
import { Loader2 } from "lucide-react";
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

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

export const TACCodeTab = () => {
  const [tacCodes, setTacCodes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTacCode, setSelectedTacCode] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-4">
      <FinanceMasterTable
        data={tacCodes}
        loading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        storageKey="tax-code-table"
        emptyMessage="No TAX codes found"
        addLabel="Add TAX codes"
        onAdd={openCreateModal}
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent
          className="sm:max-w-[500px] bg-white overflow-visible"
          onPointerDownOutside={(e) => {
            if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Create TAX codes</DialogTitle>
            <DialogDescription>
              Add a new TAX codes to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <MuiFormControl fullWidth variant="outlined" required>
                <TextField
                  id="code"
                  label="Code"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter TAX codes"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  sx={fieldStyles}
                />
              </MuiFormControl>
            </div>
            <div>
              <MuiFormControl fullWidth variant="outlined" required>
                <TextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={fieldStyles}
                />
              </MuiFormControl>
            </div>
            <div>
              <MuiFormControl fullWidth variant="outlined">
                <TextField
                  id="description"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  sx={fieldStyles}
                />
              </MuiFormControl>
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
                <span className="!text-white font-medium">Create</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent
          className="sm:max-w-[500px] bg-white overflow-visible"
          onPointerDownOutside={(e) => {
            if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit TAX codes</DialogTitle>
            <DialogDescription>
              Update TAX codes details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <MuiFormControl fullWidth variant="outlined" required>
                <TextField
                  id="edit-code"
                  label="Code"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter TAX codes"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  sx={fieldStyles}
                />
              </MuiFormControl>
            </div>
            <div>
              <MuiFormControl fullWidth variant="outlined" required>
                <TextField
                  id="edit-name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={fieldStyles}
                />
              </MuiFormControl>
            </div>
            <div>
              <MuiFormControl fullWidth variant="outlined">
                <TextField
                  id="edit-description"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  sx={fieldStyles}
                />
              </MuiFormControl>
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
                <span className="!text-white font-medium">Update</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TACCodeTab;
