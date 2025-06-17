
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FitoutProject {
  id: number;
  user: string;
  category: string;
  description: string;
  tower: string;
  unit: string;
  supplier: string;
  masterStatus: string;
  createdOn: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: FitoutProject | null;
  onSubmit: (project: FitoutProject) => void;
}

export const EditProjectModal = ({ isOpen, onClose, project, onSubmit }: EditProjectModalProps) => {
  const [formData, setFormData] = useState({
    user: '',
    category: '',
    description: '',
    tower: '',
    unit: '',
    supplier: '',
    masterStatus: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        user: project.user,
        category: project.category,
        description: project.description,
        tower: project.tower,
        unit: project.unit,
        supplier: project.supplier,
        masterStatus: project.masterStatus
      });
    }
  }, [project]);

  const handleSubmit = () => {
    if (project) {
      onSubmit({
        ...project,
        user: formData.user,
        category: formData.category,
        description: formData.description,
        tower: formData.tower,
        unit: formData.unit,
        supplier: formData.supplier,
        masterStatus: formData.masterStatus
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Fitout Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-user">User</Label>
              <Select value={formData.user} onValueChange={(value) => setFormData(prev => ({...prev, user: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Renovation">Renovation</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Flooring">Flooring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tower">Tower</Label>
              <Select value={formData.tower} onValueChange={(value) => setFormData(prev => ({...prev, tower: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tower" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Building A">Building A</SelectItem>
                  <SelectItem value="Building B">Building B</SelectItem>
                  <SelectItem value="Building C">Building C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({...prev, unit: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unit 101">Unit 101</SelectItem>
                  <SelectItem value="Unit 102">Unit 102</SelectItem>
                  <SelectItem value="Unit 103">Unit 103</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-supplier">Supplier</Label>
              <Select value={formData.supplier} onValueChange={(value) => setFormData(prev => ({...prev, supplier: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vendor A">Vendor A</SelectItem>
                  <SelectItem value="Vendor B">Vendor B</SelectItem>
                  <SelectItem value="Vendor C">Vendor C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.masterStatus} onValueChange={(value) => setFormData(prev => ({...prev, masterStatus: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="outline"
            onClick={onClose}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
