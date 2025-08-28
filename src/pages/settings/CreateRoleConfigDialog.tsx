import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from 'sonner';
import { roleConfigService, CreateRoleConfigPayload } from '@/services/roleConfigService';

interface CreateRoleConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleConfigCreated?: () => void;
}

export const CreateRoleConfigDialog = ({ open, onOpenChange, onRoleConfigCreated }: CreateRoleConfigDialogProps) => {
  const { toast } = useToast();
  const [roleName, setRoleName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [active, setActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available permissions
  const availablePermissions = [
    { id: 'create', label: 'Create' },
    { id: 'read', label: 'Read/View' },
    { id: 'update', label: 'Update/Edit' },
    { id: 'delete', label: 'Delete' },
    { id: 'approve', label: 'Approve' },
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'view_reports', label: 'View Reports' },
    { id: 'system_admin', label: 'System Administration' },
    { id: 'financial_access', label: 'Financial Access' },
    { id: 'audit_access', label: 'Audit Access' }
  ];

  const validateForm = () => {
    if (!roleName.trim()) {
      toast({
        title: "Validation Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return false;
    }

    if (permissions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one permission",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setRoleName("");
    setDescription("");
    setPermissions([]);
    setActive(true);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setPermissions(prev => [...prev, permissionId]);
    } else {
      setPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    const payload: CreateRoleConfigPayload = {
      role_config: {
        name: roleName,
        description: description,
        permissions: permissions,
        active: active
      }
    };

    try {
      await roleConfigService.createRoleConfig(payload);
      
      console.log('Role Config created successfully');

      sonnerToast.success('Role Configuration created successfully!');
      
      // Reset form
      resetForm();
      
      // Close dialog
      onOpenChange(false);
      
      // Trigger callback to refresh parent data
      if (onRoleConfigCreated) {
        onRoleConfigCreated();
      }
    } catch (error: any) {
      console.error('Error creating role config:', error);
      const errorMessage = error.message || 'Unknown error';
        
      toast({
        title: "Error",
        description: `Failed to create role configuration: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Create Role Configuration</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="roleName" className="text-sm font-medium">
              Role Name *
            </Label>
            <Input
              id="roleName"
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of the role"
              className="w-full min-h-[100px]"
            />
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Permissions * 
              <span className="text-xs text-gray-500 font-normal ml-2">
                Select all applicable permissions
              </span>
            </Label>
            <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={permission.id}
                    checked={permissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                  />
                  <Label 
                    htmlFor={permission.id} 
                    className="text-sm font-medium cursor-pointer"
                  >
                    {permission.label}
                  </Label>
                </div>
              ))}
            </div>
            {permissions.length > 0 && (
              <div className="text-xs text-gray-600">
                Selected: {permissions.map(id => availablePermissions.find(p => p.id === id)?.label).join(', ')}
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="active" 
              checked={active}
              onCheckedChange={(checked) => setActive(checked as boolean)}
            />
            <Label htmlFor="active" className="text-sm font-medium cursor-pointer">
              Active
            </Label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={isSubmitting}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Role'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleConfigDialog;
