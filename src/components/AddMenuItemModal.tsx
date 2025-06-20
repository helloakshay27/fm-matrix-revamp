
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (menuItem: any) => void;
}

const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"];
const subCategories = ["Continental", "Indian", "Italian", "Chinese", "South Indian"];

export const AddMenuItemModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: AddMenuItemModalProps) => {
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    displayPrice: "",
    stock: "",
    category: "",
    subCategory: "",
    sgstAmount: "",
    sgstRate: "",
    cgstRate: "",
    cgstAmount: "",
    description: "",
    masterPrice: "",
    active: "Yes"
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (formData.productName.trim() && formData.sku.trim()) {
      onSubmit({
        ...formData,
        active: formData.active === "Yes"
      });
      setFormData({
        productName: "",
        sku: "",
        displayPrice: "",
        stock: "",
        category: "",
        subCategory: "",
        sgstAmount: "",
        sgstRate: "",
        cgstRate: "",
        cgstAmount: "",
        description: "",
        masterPrice: "",
        active: "Yes"
      });
      setSelectedFile(null);
      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
            ADD PRODUCT
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-sm">
              Product Name*
            </Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku" className="text-sm">
              SKU*
            </Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="masterPrice" className="text-sm">
              Master Price*
            </Label>
            <Input
              id="masterPrice"
              type="number"
              value={formData.masterPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, masterPrice: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayPrice" className="text-sm">
              Display Price
            </Label>
            <Input
              id="displayPrice"
              type="number"
              value={formData.displayPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, displayPrice: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock" className="text-sm">
              Stock
            </Label>
            <Input
              id="stock"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="active" className="text-sm">
              Active
            </Label>
            <Select 
              value={formData.active} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, active: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">
              Category*
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCategory" className="text-sm">
              Select Subcategory*
            </Label>
            <Select 
              value={formData.subCategory} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, subCategory: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map(subCategory => (
                  <SelectItem key={subCategory} value={subCategory}>{subCategory}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sgstRate" className="text-sm">
              SGST Rate
            </Label>
            <Input
              id="sgstRate"
              value={formData.sgstRate}
              onChange={(e) => setFormData(prev => ({ ...prev, sgstRate: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cgstRate" className="text-sm">
              CGST Rate
            </Label>
            <Input
              id="cgstRate"
              value={formData.cgstRate}
              onChange={(e) => setFormData(prev => ({ ...prev, cgstRate: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sgstAmount" className="text-sm">
              SGST Amount
            </Label>
            <Input
              id="sgstAmount"
              value={formData.sgstAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, sgstAmount: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cgstAmount" className="text-sm">
              CGST Amount
            </Label>
            <Input
              id="cgstAmount"
              value={formData.cgstAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, cgstAmount: e.target.value }))}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              Manuals Upload
            </Label>
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-gray-600 hover:text-gray-800"
              >
                <div className="text-sm">
                  {selectedFile ? (
                    <span className="text-green-600">Selected: {selectedFile.name}</span>
                  ) : (
                    <>
                      Drag & Drop or <span className="text-orange-500">Choose File</span> No file chosen
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
