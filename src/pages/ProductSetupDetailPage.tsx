import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { useAppDispatch } from '@/store/hooks';
import { fetchMenuDetails } from '@/store/slices/f&bSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  sku: string;
  active: number;
  category_id: number;
  category_name: string;
  sub_category_id: number;
  sub_category_name: string;
  restaurant_id: number;
  stock: number;
  display_price: number;
  master_price: number;
  discounted_amount: number;
  discount: number | null;
  cgst_amt: number;
  cgst_rate: number;
  sgst_amt: number;
  sgst_rate: number;
  igst_amt: number | null;
  igst_rate: number | null;
  veg_menu: boolean | null;
  created_at: string;
  updated_at: string;
}

export const ProductSetupDetailPage = () => {
  const dispatch = useAppDispatch();
  const { id, mid } = useParams();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attachments, setAttachments] = useState([])
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(fetchMenuDetails({ baseUrl, token, id: Number(id), mid: Number(mid) })).unwrap();
        setMenuItems(response);
        setAttachments(response.images.map((img: any) => img.document));
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [dispatch, baseUrl, token, id, mid]);

  const handleEdit = () => {
    navigate(`/vas/fnb/details/${id}/restaurant-menu/edit/${mid}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error || !menuItems) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{error || 'Menu item not found'}</div>;
  }

  return (
    <div className="bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => handleBack()}
            className="flex items-center gap-1 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <Button
            onClick={handleEdit}
            className="bg-transparent border-0 text-gray-600 hover:text-gray-800"
            variant="ghost"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader
            className="bg-[#F6F4EE]"
            style={{ border: "1px solid #D9D9D9" }}
          >
            <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
              <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                M
              </span>
              MENU DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent
            className="px-[80px] py-[31px] bg-[#F6F7F7]"
            style={{ border: "1px solid #D9D9D9" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Product Name</span>
                  <span className="font-medium text-16"> {menuItems.name}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Display Price</span>
                  <span className="font-medium text-16"> {menuItems.display_price}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Category</span>
                  <span className="font-medium text-16"> {menuItems.category_name}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">SGST Rate</span>
                  <span className="font-medium text-16"> {menuItems.sgst_rate}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">CGST Amount</span>
                  <span className="font-medium text-16"> {menuItems.cgst_amt}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">SKU</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.sku}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Stock</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.stock}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Subcategory</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.sub_category_name}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">SGST Amount</span>
                  <span className="font-medium text-16"> {menuItems.sgst_amt}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">IGST Rate</span>
                  <span className="font-medium text-16"> {menuItems.igst_rate}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Master Price</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.master_price}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Active</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.active ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Description</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.description}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">CGST Rate</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.cgst_rate}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">IGST Amount</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.igst_amt}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader
            className="bg-[#F6F4EE]"
            style={{ border: "1px solid #D9D9D9" }}
          >
            <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
              <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                A
              </span>
              ATTACHMENTS
            </CardTitle>
          </CardHeader>
          <CardContent
            className="px-[60px] py-[31px] bg-[#F6F7F7]"
            style={{ border: "1px solid #D9D9D9" }}
          >
            {attachments.length > 0 ? (
              <div className="grid grid-cols-8 gap-4 mt-2">
                {attachments.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Menu item ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mt-2">No existing images available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};