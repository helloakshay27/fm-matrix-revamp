import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";

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

export const ProductSetupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the specific product based on the ID
  const product = mockMenuItems.find(item => item.id === parseInt(id || '1')) || mockMenuItems[0];

  const handleEdit = () => {
    navigate(`/vas/fnb/restaurant-menu/edit/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Breadcrumb */}
      <div className="bg-white px-6 py-2 border-b">
        <div className="flex items-center text-sm text-gray-600">
          <span>F&B List</span>
          <span className="mx-2">{'>'}</span>
          <span>F&B Detail</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">F&B DETAIL</h1>
          </div>
          <Button className="bg-[#C72030] hover:bg-[#A61B28] text-white px-6">
            Save
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-6">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Restaurant
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Status Setup
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Categories Setup
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Sub Categories Setup
          </button>
          <button className="px-4 py-2 text-sm text-red-500 border-b-2 border-red-500">
            Restaurant Menu
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Restaurant Bookings
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Restaurant Orders
          </button>
        </div>
      </div>

      {/* Sub Breadcrumb */}
      <div className="bg-white px-6 py-2">
        <div className="flex items-center text-sm text-gray-600">
          <span>Restaurant</span>
          <span className="mx-2">{'>'}</span>
          <span>Restaurant Menu</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Product Setup Detail</h1>
          <Button
            onClick={handleEdit}
            className="bg-transparent border-0 text-gray-600 hover:text-gray-800"
            variant="ghost"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Other Info Section */}
          <div className="border-b">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-[#C72030] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">○</span>
                </div>
                <h2 className="text-lg font-semibold text-[#C72030]">Other Info</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex">
                  <span className="w-32 text-gray-600">Product Name</span>
                  <span className="mr-2">:</span>
                  <span className="text-blue-600">{product.productName}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">SKU</span>
                  <span className="mr-2">:</span>
                  <span className="text-blue-600">{product.sku}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Master Price</span>
                  <span className="mr-2">:</span>
                  <span>{product.masterPrice}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Display Price</span>
                  <span className="mr-2">:</span>
                  <span>{product.displayPrice}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Stock</span>
                  <span className="mr-2">:</span>
                  <span>20</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Active</span>
                  <span className="mr-2">:</span>
                  <span>{product.status === 'Active' ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Category</span>
                  <span className="mr-2">:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Sub-Category</span>
                  <span className="mr-2">:</span>
                  <span>{product.subCategory || "-"}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Description</span>
                  <span className="mr-2">:</span>
                  <span>-</span>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="border-b">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#C72030] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">○</span>
                </div>
                <h2 className="text-lg font-semibold text-[#C72030]">Images</h2>
              </div>
            </div>
          </div>

          {/* GST Section */}
          <div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-[#C72030] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">○</span>
                </div>
                <h2 className="text-lg font-semibold text-[#C72030]">GST</h2>
              </div>
              
              <div className="grid grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">SGST Rate</div>
                  <div className="text-gray-600">%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">SGST Amount</div>
                  <div className="text-gray-600">-</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">CGST Rate</div>
                  <div className="text-gray-600">%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">CGST Amount</div>
                  <div className="text-gray-600">-</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">IGST Rate</div>
                  <div className="text-gray-600">%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">IGST Amount</div>
                  <div className="text-gray-600">-</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
