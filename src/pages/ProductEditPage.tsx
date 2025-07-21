import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

interface MenuItem {
  id: number;
  sku: string;
  productName: string;
  masterPrice: number;
  displayPrice: number;
  category: string;
  subCategory: string;
  createdOn: string;
  updatedOn: string;
  status: 'Active' | 'Inactive';
}

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    sku: "Imperial Rolls",
    productName: "Imperial Rolls",
    masterPrice: 250,
    displayPrice: 250,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "21/03/2023",
    status: 'Inactive'
  },
  {
    id: 2,
    sku: "Corn Fritters",
    productName: "Corn Fritters",
    masterPrice: 220,
    displayPrice: 220,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "20/04/2023",
    status: 'Active'
  },
  {
    id: 3,
    sku: "Spring Rolls",
    productName: "Spring Rolls",
    masterPrice: 200,
    displayPrice: 200,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 4,
    sku: "Chicken Satay",
    productName: "Chicken Satay",
    masterPrice: 300,
    displayPrice: 300,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "20/04/2023",
    status: 'Active'
  },
  {
    id: 5,
    sku: "Tofu Satay",
    productName: "Tofu Satay",
    masterPrice: 300,
    displayPrice: 300,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 6,
    sku: "Dumpling",
    productName: "Dumpling",
    masterPrice: 200,
    displayPrice: 200,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 7,
    sku: "Golden Triangles",
    productName: "Golden Triangles",
    masterPrice: 250,
    displayPrice: 250,
    category: "Appetizers",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 8,
    sku: "Tom Yum Gai",
    productName: "Tom Yum Gai",
    masterPrice: 200,
    displayPrice: 200,
    category: "Soups",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 9,
    sku: "Glass Noodles Soup",
    productName: "Glass Noodles Soup",
    masterPrice: 250,
    displayPrice: 250,
    category: "Soups",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 10,
    sku: "Beef Noodle Soup",
    productName: "Beef Noodle Soup",
    masterPrice: 280,
    displayPrice: 280,
    category: "Soups",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 11,
    sku: "Larb Gai",
    productName: "Larb Gai",
    masterPrice: 200,
    displayPrice: 200,
    category: "Soups",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 12,
    sku: "Ginger Salad",
    productName: "Ginger Salad",
    masterPrice: 200,
    displayPrice: 200,
    category: "Salads",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "18/04/2023",
    status: 'Inactive'
  },
  {
    id: 13,
    sku: "Fish Cake Salad",
    productName: "Fish Cake Salad",
    masterPrice: 280,
    displayPrice: 280,
    category: "Salads",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 14,
    sku: "Shrimp Salad",
    productName: "Shrimp Salad",
    masterPrice: 300,
    displayPrice: 300,
    category: "Salads",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  },
  {
    id: 15,
    sku: "Duck Salad",
    productName: "Duck Salad",
    masterPrice: 340,
    displayPrice: 340,
    category: "Salads",
    subCategory: "",
    createdOn: "12/10/2021",
    updatedOn: "12/10/2021",
    status: 'Active'
  }
];

export const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the specific product based on the ID
  const product = mockMenuItems.find(item => item.id === parseInt(id || '1')) || mockMenuItems[0];

  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    masterPrice: "",
    displayPrice: "",
    stock: "20",
    active: "Yes",
    category: "",
    subcategory: "",
    sgstRate: "",
    sgstAmount: "",
    cgstRate: "",
    cgstAmount: "",
    igstRate: "",
    igstAmount: "",
    description: ""
  });

  // Pre-populate form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        sku: product.sku,
        masterPrice: product.masterPrice.toString(),
        displayPrice: product.displayPrice.toString(),
        stock: "20", // Default stock value
        active: product.status === 'Active' ? "Yes" : "No",
        category: product.category,
        subcategory: product.subCategory,
        sgstRate: "",
        sgstAmount: "",
        cgstRate: "",
        cgstAmount: "",
        igstRate: "",
        igstAmount: "",
        description: ""
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving product data:", formData);
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center text-sm text-gray-600">
          <span>Restaurant</span>
          <span className="mx-2">{'>'}</span>
          <span>Restaurant Menu</span>
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">RESTAURANT MENU ADD</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">○</span>
              </div>
              <h2 className="text-lg font-semibold text-[#C72030]">ADD PRODUCT</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Row 1 */}
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name*</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU*</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="masterPrice">Master Price*</Label>
                <Input
                  id="masterPrice"
                  value={formData.masterPrice}
                  onChange={(e) => handleInputChange("masterPrice", e.target.value)}
                />
              </div>

              {/* Row 2 */}
              <div className="space-y-2">
                <Label htmlFor="displayPrice">Display Price</Label>
                <Input
                  id="displayPrice"
                  value={formData.displayPrice}
                  onChange={(e) => handleInputChange("displayPrice", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Active</Label>
                <Select value={formData.active} onValueChange={(value) => handleInputChange("active", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 3 */}
              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Appetizers">Appetizers</SelectItem>
                    <SelectItem value="Soups">Soups</SelectItem>
                    <SelectItem value="Salads">Salads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Select Subcategory</Label>
                <Select value={formData.subcategory} onValueChange={(value) => handleInputChange("subcategory", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subcategory1">Subcategory 1</SelectItem>
                    <SelectItem value="subcategory2">Subcategory 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sgstRate">SGST Rate</Label>
                <Input
                  id="sgstRate"
                  value={formData.sgstRate}
                  onChange={(e) => handleInputChange("sgstRate", e.target.value)}
                />
              </div>

              {/* Row 4 */}
              <div className="space-y-2">
                <Label htmlFor="sgstAmount">SGST Amount</Label>
                <Input
                  id="sgstAmount"
                  value={formData.sgstAmount}
                  onChange={(e) => handleInputChange("sgstAmount", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgstRate">CGST Rate</Label>
                <Input
                  id="cgstRate"
                  value={formData.cgstRate}
                  onChange={(e) => handleInputChange("cgstRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgstAmount">CGST Amount</Label>
                <Input
                  id="cgstAmount"
                  value={formData.cgstAmount}
                  onChange={(e) => handleInputChange("cgstAmount", e.target.value)}
                />
              </div>

              {/* Row 5 */}
              <div className="space-y-2">
                <Label htmlFor="igstRate">IGST Rate</Label>
                <Input
                  id="igstRate"
                  value={formData.igstRate}
                  onChange={(e) => handleInputChange("igstRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="igstAmount">IGST Amount</Label>
                <Input
                  id="igstAmount"
                  value={formData.igstAmount}
                  onChange={(e) => handleInputChange("igstAmount", e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>

            {/* Manuals Upload */}
            <div className="mb-6">
              <Label>Manuals Upload</Label>
              <div className="mt-2 border-2 border-dashed border-yellow-400 rounded-lg p-8 text-center bg-yellow-50">
                <p className="text-gray-600">
                  <span className="text-blue-600 underline cursor-pointer">Drag & Drop or Choose Files</span>
                  <span className="mx-2">No file chosen</span>
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-[#8B4B9B] hover:bg-[#7A4189] text-white px-8"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};