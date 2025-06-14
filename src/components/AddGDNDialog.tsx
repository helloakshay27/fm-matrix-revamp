
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface AddGDNDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddGDNDialog = ({ open, onOpenChange }: AddGDNDialogProps) => {
  const [gdnDate, setGdnDate] = useState('');
  const [description, setDescription] = useState('');
  const [inventoryItems, setInventoryItems] = useState([
    {
      inventory: '',
      currentStock: '',
      quantity: '',
      comments: ''
    }
  ]);

  const addInventoryItem = () => {
    setInventoryItems([...inventoryItems, {
      inventory: '',
      currentStock: '',
      quantity: '',
      comments: ''
    }]);
  };

  const removeInventoryItem = (index: number) => {
    if (inventoryItems.length > 1) {
      setInventoryItems(inventoryItems.filter((_, i) => i !== index));
    }
  };

  const updateInventoryItem = (index: number, field: string, value: string) => {
    const updatedItems = inventoryItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setInventoryItems(updatedItems);
  };

  const handleSubmit = () => {
    console.log('Submitting GDN:', {
      gdnDate,
      description,
      inventoryItems
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add GDN</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Details Section */}
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚙</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-500">BASIC DETAILS</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gdnDate" className="text-sm font-medium">
                  GDN Date<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="gdnDate"
                  type="date"
                  value={gdnDate}
                  onChange={(e) => setGdnDate(e.target.value)}
                  placeholder="Enter Date"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description<span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Inventory Details Section */}
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚙</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-500">INVENTORY DETAILS</h3>
            </div>

            {inventoryItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Inventory<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={item.inventory}
                    onValueChange={(value) => updateInventoryItem(index, 'inventory', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Inventory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="chair">Chair</SelectItem>
                      <SelectItem value="desk">Desk</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Current Stock</Label>
                  <Input
                    value={item.currentStock}
                    onChange={(e) => updateInventoryItem(index, 'currentStock', e.target.value)}
                    placeholder="Current Stock"
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Quantity<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={item.quantity}
                    onChange={(e) => updateInventoryItem(index, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Comments</Label>
                  <Textarea
                    value={item.comments}
                    onChange={(e) => updateInventoryItem(index, 'comments', e.target.value)}
                    placeholder="Comments"
                    className="min-h-[40px]"
                  />
                </div>

                <div className="flex items-end">
                  {inventoryItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInventoryItem(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={addInventoryItem}
              className="bg-purple-600 hover:bg-purple-700 text-white mb-4"
            >
              + Add Inventory
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
