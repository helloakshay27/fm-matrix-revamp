
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const AddProductModal = ({ isOpen, onClose, onSubmit }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    masterPrice: '',
    displayPrice: '',
    stock: '',
    category: '',
    subcategory: '',
    active: 'Yes',
    sgstRate: '',
    cgstRate: '',
    sgstAmount: '',
    igstRate: '',
    igstAmount: '',
    cgstAmount: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      productName: '',
      sku: '',
      masterPrice: '',
      displayPrice: '',
      stock: '',
      category: '',
      subcategory: '',
      active: 'Yes',
      sgstRate: '',
      cgstRate: '',
      sgstAmount: '',
      igstRate: '',
      igstAmount: '',
      cgstAmount: '',
      description: ''
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
            <h2 className="text-lg font-semibold text-orange-500">ADD PRODUCT</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="productName" className="text-sm font-medium">
                Product Name*
              </Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="sku" className="text-sm font-medium">
                SKU*
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="masterPrice" className="text-sm font-medium">
                Master Price*
              </Label>
              <Input
                id="masterPrice"
                type="number"
                value={formData.masterPrice}
                onChange={(e) => handleInputChange('masterPrice', e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="displayPrice" className="text-sm font-medium">
                Display Price
              </Label>
              <Input
                id="displayPrice"
                type="number"
                value={formData.displayPrice}
                onChange={(e) => handleInputChange('displayPrice', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="stock" className="text-sm font-medium">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="active" className="text-sm font-medium">
                Active
              </Label>
              <Select onValueChange={(value) => handleInputChange('active', value)} defaultValue="Yes">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category*
              </Label>
              <Select onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subcategory" className="text-sm font-medium">
                Select Subcategory
              </Label>
              <Select onValueChange={(value) => handleInputChange('subcategory', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="continental">Continental</SelectItem>
                  <SelectItem value="north-indian">North Indian</SelectItem>
                  <SelectItem value="south-indian">South Indian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tax Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sgstAmount" className="text-sm font-medium">
                SGST Amount
              </Label>
              <Input
                id="sgstAmount"
                type="number"
                value={formData.sgstAmount}
                onChange={(e) => handleInputChange('sgstAmount', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sgstRate" className="text-sm font-medium">
                SGST Rate
              </Label>
              <Input
                id="sgstRate"
                type="number"
                value={formData.sgstRate}
                onChange={(e) => handleInputChange('sgstRate', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cgstRate" className="text-sm font-medium">
                CGST Rate
              </Label>
              <Input
                id="cgstRate"
                type="number"
                value={formData.cgstRate}
                onChange={(e) => handleInputChange('cgstRate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cgstAmount" className="text-sm font-medium">
                CGST Amount
              </Label>
              <Input
                id="cgstAmount"
                type="number"
                value={formData.cgstAmount}
                onChange={(e) => handleInputChange('cgstAmount', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="igstRate" className="text-sm font-medium">
                IGST Rate
              </Label>
              <Input
                id="igstRate"
                type="number"
                value={formData.igstRate}
                onChange={(e) => handleInputChange('igstRate', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="igstAmount" className="text-sm font-medium">
                IGST Amount
              </Label>
              <Input
                id="igstAmount"
                type="number"
                value={formData.igstAmount}
                onChange={(e) => handleInputChange('igstAmount', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* File Upload */}
          <div>
            <Label className="text-sm font-medium">
              Manuals Upload
            </Label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">Drag & Drop or Choose Files. No file chosen</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-[#8B5A3C] hover:bg-[#8B5A3C]/90 text-white px-8"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
