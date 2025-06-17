
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: { status: string; fixedState: string; color: string; order: string }) => void;
}

export const AddStatusModal = ({ isOpen, onClose, onSubmit }: AddStatusModalProps) => {
  const [formData, setFormData] = useState({
    status: "",
    fixedState: "",
    color: "#000000",
    order: ""
  });

  const handleSubmit = () => {
    if (formData.status.trim() && formData.fixedState && formData.order) {
      onSubmit(formData);
      setFormData({ status: "", fixedState: "", color: "#000000", order: "" });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Status <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Fixed State <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.fixedState} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, fixedState: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Fixed State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="state1">State 1</SelectItem>
                  <SelectItem value="state2">State 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Order <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter status order"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10 p-1"
                />
                <div 
                  className="w-10 h-10 border rounded"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
