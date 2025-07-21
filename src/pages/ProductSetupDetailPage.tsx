import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";

interface ProductDetail {
  id: number;
  productName: string;
  masterPrice: number;
  stock: number;
  category: string;
  sku: string;
  displayPrice: number;
  active: string;
  subCategory: string;
  description: string;
}

const mockProductData: ProductDetail = {
  id: 1,
  productName: "Imperial Rolls",
  masterPrice: 250,
  stock: 20,
  category: "Appetizers",
  sku: "Imperial Rolls",
  displayPrice: 250,
  active: "No",
  subCategory: "",
  description: ""
};

export const ProductSetupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/vas/fnb/restaurant-menu/edit/${id}`);
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
          <span>Status Setup</span>
          <span className="mx-2">{'>'}</span>
          <span>Categories Setup</span>
          <span className="mx-2">{'>'}</span>
          <span>Sub Categories Setup</span>
          <span className="mx-2">{'>'}</span>
          <span className="text-[#C72030]">Restaurant Menu</span>
          <span className="mx-2">{'>'}</span>
          <span>Restaurant Bookings</span>
          <span className="mx-2">{'>'}</span>
          <span>Restaurant Orders</span>
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
                  <span className="text-blue-600">{mockProductData.productName}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">SKU</span>
                  <span className="mr-2">:</span>
                  <span className="text-blue-600">{mockProductData.sku}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Master Price</span>
                  <span className="mr-2">:</span>
                  <span>{mockProductData.masterPrice}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Display Price</span>
                  <span className="mr-2">:</span>
                  <span>{mockProductData.displayPrice}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Stock</span>
                  <span className="mr-2">:</span>
                  <span>{mockProductData.stock}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Active</span>
                  <span className="mr-2">:</span>
                  <span>{mockProductData.active}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Category</span>
                  <span className="mr-2">:</span>
                  <span>{mockProductData.category}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Sub-Category</span>
                  <span className="mr-2">:</span>
                  <span>{mockProductData.subCategory || "-"}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Description</span>
                  <span className="mr-2">:</span>
                  <span>{mockProductData.description || "-"}</span>
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
