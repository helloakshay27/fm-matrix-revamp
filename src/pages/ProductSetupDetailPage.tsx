// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Pencil } from "lucide-react";
// import { useAppDispatch } from '@/store/hooks';
// import { fetchMenuDetails, fetchOrderDetails } from '@/store/slices/f&bSlice';

// interface MenuItem {
//   id: number;
//   name: string;
//   description: string;
//   sku: string;
//   active: number;
//   category_id: number;
//   sub_category_id: number;
//   restaurant_id: number;
//   stock: number;
//   display_price: number;
//   master_price: number;
//   discounted_amount: number;
//   discount: number | null;
//   cgst_amt: number;
//   cgst_rate: number;
//   sgst_amt: number;
//   sgst_rate: number;
//   igst_amt: number | null;
//   igst_rate: number | null;
//   veg_menu: boolean | null; // assuming boolean if it's a veg indicator
//   created_at: string;
//   updated_at: string;

// }

// export const ProductSetupDetailPage = () => {
//   const dispatch = useAppDispatch();
//   const baseUrl = localStorage.getItem('baseUrl');
//   const token = localStorage.getItem('token');
//   const { id, mid } = useParams();
//   const navigate = useNavigate();
//   const [menuItems, setMenuItems] = useState<MenuItem>();

//   // Find the specific product based on the ID
//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const response = await dispatch(fetchMenuDetails({ baseUrl, token, id: Number(id), mid: Number(mid) })).unwrap();
//         setMenuItems(response);
//       } catch (error) {
//         console.error('Error fetching menu items:', error);
//       }
//     }

//     fetchMenu();
//   }, [])

//   const handleEdit = () => {
//     navigate(`/vas/fnb/restaurant-menu/edit/${id}`);
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Breadcrumb */}
//       <div className="bg-white px-6 py-2 border-b">
//         <div className="flex items-center text-sm text-gray-600">
//           <span>F&B List</span>
//           <span className="mx-2">{'>'}</span>
//           <span>F&B Detail</span>
//         </div>
//       </div>

//       {/* Main Header */}
//       <div className="bg-white px-6 py-4 border-b">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button
//               onClick={handleBack}
//               variant="ghost"
//               size="sm"
//               className="p-1"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </Button>
//             <h1 className="text-xl font-bold text-gray-900">F&B DETAIL</h1>
//           </div>
//         </div>
//       </div>

//       {/* Sub Breadcrumb */}
//       <div className="bg-white px-6 py-2">
//         <div className="flex items-center text-sm text-gray-600">
//           <span>Restaurant</span>
//           <span className="mx-2">{'>'}</span>
//           <span>Restaurant Menu</span>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Product Setup Detail</h1>
//           <Button
//             onClick={handleEdit}
//             className="bg-transparent border-0 text-gray-600 hover:text-gray-800"
//             variant="ghost"
//           >
//             <Pencil className="w-5 h-5" />
//           </Button>
//         </div>

//         <div className="bg-white rounded-lg shadow">
//           {/* Other Info Section */}
//           <div className="border-b">
//             <div className="p-4">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-4 h-4 bg-[#C72030] rounded-full flex items-center justify-center">
//                   <span className="text-white text-xs">○</span>
//                 </div>
//                 <h2 className="text-lg font-semibold text-[#C72030]">Other Info</h2>
//               </div>

//               <div className="grid grid-cols-2 gap-x-8 gap-y-4">
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Product Name</span>
//                   <span className="mr-2">:</span>
//                   <span className="text-blue-600">{menuItems.name}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">SKU</span>
//                   <span className="mr-2">:</span>
//                   <span className="text-blue-600">{menuItems.sku}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Master Price</span>
//                   <span className="mr-2">:</span>
//                   <span>{menuItems.master_price}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Display Price</span>
//                   <span className="mr-2">:</span>
//                   <span>{menuItems.display_price}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Stock</span>
//                   <span className="mr-2">:</span>
//                   <span>{menuItems.stock}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Active</span>
//                   <span className="mr-2">:</span>
//                   <span>{menuItems.active ? 'Yes' : 'No'}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Category</span>
//                   <span className="mr-2">:</span>
//                   <span>{menuItems.category_id}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Sub-Category</span>
//                   <span className="mr-2">:</span>
//                   <span>{menuItems.sub_category_id}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Description</span>
//                   <span className="mr-2">:</span>
//                   <span>{menuItems.description}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Images Section */}
//           <div className="border-b">
//             <div className="p-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 bg-[#C72030] rounded-full flex items-center justify-center">
//                   <span className="text-white text-xs">○</span>
//                 </div>
//                 <h2 className="text-lg font-semibold text-[#C72030]">Images</h2>
//               </div>
//             </div>
//           </div>

//           {/* GST Section */}
//           <div>
//             <div className="p-4">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-4 h-4 bg-[#C72030] rounded-full flex items-center justify-center">
//                   <span className="text-white text-xs">○</span>
//                 </div>
//                 <h2 className="text-lg font-semibold text-[#C72030]">GST</h2>
//               </div>

//               <div className="grid grid-cols-6 gap-4">
//                 <div className="text-center">
//                   <div className="font-medium text-gray-700 mb-2">SGST Rate</div>
//                   <div className="text-gray-600">{menuItems.sgst_rate}%</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="font-medium text-gray-700 mb-2">SGST Amount</div>
//                   <div className="text-gray-600">{menuItems.sgst_amt}</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="font-medium text-gray-700 mb-2">CGST Rate</div>
//                   <div className="text-gray-600">{menuItems.cgst_rate}%</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="font-medium text-gray-700 mb-2">CGST Amount</div>
//                   <div className="text-gray-600">{menuItems.cgst_amt}</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="font-medium text-gray-700 mb-2">IGST Rate</div>
//                   <div className="text-gray-600">{menuItems.igst_rate}%</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="font-medium text-gray-700 mb-2">IGST Amount</div>
//                   <div className="text-gray-600">{menuItems.igst_amt}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { useAppDispatch } from '@/store/hooks';
import { fetchMenuDetails } from '@/store/slices/f&bSlice';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  sku: string;
  active: number;
  category_id: number;
  sub_category_id: number;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(fetchMenuDetails({ baseUrl, token, id: Number(id), mid: Number(mid) })).unwrap();
        setMenuItems(response);
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
    navigate(`/vas/fnb/restaurant-menu/edit/${id}`);
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
        <div className="flex items-center justify-end mb-2">
          {/* <h1 className="text-2xl font-bold text-gray-900">Product Setup Detail</h1> */}
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
                  <span className="text-blue-600">{menuItems.name}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">SKU</span>
                  <span className="mr-2">:</span>
                  <span className="text-blue-600">{menuItems.sku}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Master Price</span>
                  <span className="mr-2">:</span>
                  <span>{menuItems.master_price}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Display Price</span>
                  <span className="mr-2">:</span>
                  <span>{menuItems.display_price}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Stock</span>
                  <span className="mr-2">:</span>
                  <span>{menuItems.stock}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Active</span>
                  <span className="mr-2">:</span>
                  <span>{menuItems.active ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Category</span>
                  <span className="mr-2">:</span>
                  <span>{menuItems.category_id}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Sub-Category</span>
                  <span className="mr-2">:</span>
                  <span>{menuItems.sub_category_id}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Description</span>
                  <span className="mr-2">:</span>
                  <span>{menuItems.description || 'N/A'}</span>
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
              {/* Add image rendering logic here if available */}
              <div className="text-gray-600">No images available</div>
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
                  <div className="text-gray-600">{menuItems.sgst_rate}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">SGST Amount</div>
                  <div className="text-gray-600">{menuItems.sgst_amt}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">CGST Rate</div>
                  <div className="text-gray-600">{menuItems.cgst_rate}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">CGST Amount</div>
                  <div className="text-gray-600">{menuItems.cgst_amt}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">IGST Rate</div>
                  <div className="text-gray-600">{menuItems.igst_rate ? `${menuItems.igst_rate}%` : 'N/A'}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700 mb-2">IGST Amount</div>
                  <div className="text-gray-600">{menuItems.igst_amt ?? 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};