// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Form } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ArrowLeft } from "lucide-react";
// import { useAppDispatch } from '@/store/hooks';
// import { fetchMenuDetails, fetchRestaurantCategory, fetchSubcategory, updateMenu } from '@/store/slices/f&bSlice';
// import { toast } from 'sonner';

// interface MenuItem {
//   id: number;
//   sku: string;
//   productName: string;
//   masterPrice: number;
//   displayPrice: number;
//   category: string;
//   subCategory: string;
//   createdOn: string;
//   updatedOn: string;
//   status: 'Active' | 'Inactive';
// }

// export const ProductEditPage = () => {
//   const dispatch = useAppDispatch();
//   const { id, mid } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');
//   const baseUrl = localStorage.getItem('baseUrl');

//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [categories, setCategories] = useState([])
//   const [subCategories, setSubCategories] = useState([])
//   const [attachments, setAttachments] = useState([])
//   const [formData, setFormData] = useState({
//     productName: "",
//     sku: "",
//     masterPrice: "",
//     displayPrice: "",
//     stock: "20",
//     active: "Yes",
//     category: "",
//     subcategory: "",
//     sgstRate: "",
//     sgstAmount: "",
//     cgstRate: "",
//     cgstAmount: "",
//     igstRate: "",
//     igstAmount: "",
//     description: ""
//   });

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         setIsLoading(true);
//         const response = await dispatch(fetchMenuDetails({ baseUrl, token, id: Number(id), mid: Number(mid) })).unwrap();
//         setFormData({
//           productName: response.name,
//           sku: response.sku,
//           masterPrice: response.master_price,
//           displayPrice: response.display_price,
//           stock: response.stock, // Default stock value
//           active: response.active.toString(),
//           category: response.category_id,
//           subcategory: response.sub_category_id,
//           sgstRate: response.sgst_rate,
//           sgstAmount: response.sgst_amt,
//           cgstRate: response.cgst_rate,
//           cgstAmount: response.cgst_amt,
//           igstRate: response.igst_rate,
//           igstAmount: response.igst_amt,
//           description: response.description
//         });
//         setAttachments(response.images)
//       } catch (error) {
//         console.error('Error fetching menu items:', error);
//         setError('Failed to load menu details');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchCategories = async () => {
//       try {
//         const response = await dispatch(fetchRestaurantCategory({ baseUrl, token, id: Number(id) })).unwrap();
//         setCategories(response);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     const fetchSubCategories = async () => {
//       try {
//         const response = await dispatch(fetchSubcategory({ baseUrl, token, id: Number(id) })).unwrap();
//         setSubCategories(response);
//       } catch (error) {
//         console.error('Error fetching subcategories:', error);
//       }
//     };

//     fetchMenu();
//     fetchCategories();
//     fetchSubCategories();
//   }, [dispatch, baseUrl, token, id, mid]);

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSave = () => {
//     const dataToSend = new FormData();

//     dataToSend.append('manage_restaurant_menu[name]', formData.productName);
//     dataToSend.append('manage_restaurant_menu[restaurant_id]', id);
//     dataToSend.append('manage_restaurant_menu[sku]', formData.sku);
//     dataToSend.append('manage_restaurant_menu[master_price]', formData.masterPrice);
//     dataToSend.append('manage_restaurant_menu[display_price]', formData.displayPrice);
//     dataToSend.append('manage_restaurant_menu[stock]', formData.stock);
//     dataToSend.append('manage_restaurant_menu[active]', formData.active);
//     dataToSend.append('manage_restaurant_menu[category_id]', formData.category);
//     dataToSend.append('manage_restaurant_menu[sub_category_id]', formData.subcategory);
//     dataToSend.append('manage_restaurant_menu[sgst_rate]', formData.sgstRate);
//     dataToSend.append('manage_restaurant_menu[sgst_amt]', formData.sgstAmount);
//     dataToSend.append('manage_restaurant_menu[cgst_rate]', formData.cgstRate);
//     dataToSend.append('manage_restaurant_menu[cgst_amt]', formData.cgstAmount);
//     dataToSend.append('manage_restaurant_menu[igst_rate]', formData.igstRate);
//     dataToSend.append('manage_restaurant_menu[igst_amt]', formData.igstAmount);
//     dataToSend.append('manage_restaurant_menu[description]', formData.description);

//     try {
//       dispatch(updateMenu({ baseUrl, token, id: Number(id), mid: Number(mid), data: dataToSend })).unwrap();
//       toast.success('Menu item updated successfully');
//       navigate(-1);
//     } catch (error) {
//       console.log(error);
//       toast.error('Failed to update menu item');
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">

//       <div className="p-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-6">RESTAURANT MENU EDIT</h1>

//         <div className="bg-white rounded-lg shadow">
//           <div className="p-6">
//             <div className="flex items-center gap-2 mb-6">
//               <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs">○</span>
//               </div>
//               <h2 className="text-lg font-semibold text-[#C72030]">EDIT MENU</h2>
//             </div>

//             <div className="grid grid-cols-3 gap-6 mb-6">
//               {/* Row 1 */}
//               <div className="space-y-2">
//                 <Label htmlFor="productName">Product Name*</Label>
//                 <Input
//                   id="productName"
//                   value={formData.productName}
//                   onChange={(e) => handleInputChange("productName", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="sku">SKU*</Label>
//                 <Input
//                   id="sku"
//                   value={formData.sku}
//                   onChange={(e) => handleInputChange("sku", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="masterPrice">Master Price*</Label>
//                 <Input
//                   id="masterPrice"
//                   value={formData.masterPrice}
//                   onChange={(e) => handleInputChange("masterPrice", e.target.value)}
//                 />
//               </div>

//               {/* Row 2 */}
//               <div className="space-y-2">
//                 <Label htmlFor="displayPrice">Display Price</Label>
//                 <Input
//                   id="displayPrice"
//                   value={formData.displayPrice}
//                   onChange={(e) => handleInputChange("displayPrice", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="stock">Stock</Label>
//                 <Input
//                   id="stock"
//                   value={formData.stock}
//                   onChange={(e) => handleInputChange("stock", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="active">Active</Label>
//                 <Select value={formData.active} onValueChange={(value) => handleInputChange("active", value)}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="1">Yes</SelectItem>
//                     <SelectItem value="0">No</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Row 3 */}
//               <div className="space-y-2">
//                 <Label htmlFor="category">Category*</Label>
//                 <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Select" disabled>Select Category</SelectItem>
//                     {
//                       categories.map((category) => (
//                         <SelectItem key={category.id} value={category.id}>
//                           {category.name}
//                         </SelectItem>
//                       ))
//                     }
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="subcategory">Select Subcategory</Label>
//                 <Select value={formData.subcategory} onValueChange={(value) => handleInputChange("subcategory", value)}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select subcategory" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Select" disabled>Select Subcategory</SelectItem>
//                     {
//                       subCategories.map((subcategory) => (
//                         <SelectItem key={subcategory.id} value={subcategory.id}>
//                           {subcategory.name}
//                         </SelectItem>
//                       ))
//                     }
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="sgstRate">SGST Rate</Label>
//                 <Input
//                   id="sgstRate"
//                   value={formData.sgstRate}
//                   onChange={(e) => handleInputChange("sgstRate", e.target.value)}
//                 />
//               </div>

//               {/* Row 4 */}
//               <div className="space-y-2">
//                 <Label htmlFor="sgstAmount">SGST Amount</Label>
//                 <Input
//                   id="sgstAmount"
//                   value={formData.sgstAmount}
//                   onChange={(e) => handleInputChange("sgstAmount", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="cgstRate">CGST Rate</Label>
//                 <Input
//                   id="cgstRate"
//                   value={formData.cgstRate}
//                   onChange={(e) => handleInputChange("cgstRate", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="cgstAmount">CGST Amount</Label>
//                 <Input
//                   id="cgstAmount"
//                   value={formData.cgstAmount}
//                   onChange={(e) => handleInputChange("cgstAmount", e.target.value)}
//                 />
//               </div>

//               {/* Row 5 */}
//               <div className="space-y-2">
//                 <Label htmlFor="igstRate">IGST Rate</Label>
//                 <Input
//                   id="igstRate"
//                   value={formData.igstRate}
//                   onChange={(e) => handleInputChange("igstRate", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="igstAmount">IGST Amount</Label>
//                 <Input
//                   id="igstAmount"
//                   value={formData.igstAmount}
//                   onChange={(e) => handleInputChange("igstAmount", e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Description */}
//             <div className="mb-6">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => handleInputChange("description", e.target.value)}
//                 rows={4}
//                 className="mt-2"
//               />
//             </div>

//             {/* Manuals Upload */}
//             <div className="mb-6">
//               <Label>Manuals Upload</Label>
//               <div className="mt-2 border-2 border-dashed border-yellow-400 rounded-lg p-8 text-center bg-yellow-50">
//                 <p className="text-gray-600">
//                   <span className="text-blue-600 underline cursor-pointer">Drag & Drop or Choose Files</span>
//                   <span className="mx-2">No file chosen</span>
//                 </p>
//               </div>
//             </div>

//             {/* Save Button */}
//             <div className="flex justify-end">
//               <Button
//                 onClick={handleSave}
//                 className="bg-[#8B4B9B] hover:bg-[#7A4189] text-white px-8"
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch } from '@/store/hooks';
import { fetchMenuDetails, fetchRestaurantCategory, fetchSubcategory, updateMenu } from '@/store/slices/f&bSlice';
import { toast } from 'sonner';

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

export const ProductEditPage = () => {
  const dispatch = useAppDispatch();
  const { id, mid } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [attachments, setAttachments] = useState<string[]>([]); // Assuming attachments is an array of image URLs
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(fetchMenuDetails({ baseUrl, token, id: Number(id), mid: Number(mid) })).unwrap();
        setFormData({
          productName: response.name,
          sku: response.sku,
          masterPrice: response.master_price,
          displayPrice: response.display_price,
          stock: response.stock,
          active: response.active.toString(),
          category: response.category_id,
          subcategory: response.sub_category_id,
          sgstRate: response.sgst_rate,
          sgstAmount: response.sgst_amt,
          cgstRate: response.cgst_rate,
          cgstAmount: response.cgst_amt,
          igstRate: response.igst_rate,
          igstAmount: response.igst_amt,
          description: response.description
        });
        // Assuming response.images is an array of URLs or objects with URLs
        setAttachments(response.images.map((img: any) => img.document));
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu details');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await dispatch(fetchRestaurantCategory({ baseUrl, token, id: Number(id) })).unwrap();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await dispatch(fetchSubcategory({ baseUrl, token, id: Number(id) })).unwrap();
        setSubCategories(response);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchMenu();
    fetchCategories();
    fetchSubCategories();
  }, [dispatch, baseUrl, token, id, mid]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, JPG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSave = () => {
    const dataToSend = new FormData();

    dataToSend.append('manage_restaurant_menu[name]', formData.productName);
    dataToSend.append('manage_restaurant_menu[restaurant_id]', id);
    dataToSend.append('manage_restaurant_menu[sku]', formData.sku);
    dataToSend.append('manage_restaurant_menu[master_price]', formData.masterPrice);
    dataToSend.append('manage_restaurant_menu[display_price]', formData.displayPrice);
    dataToSend.append('manage_restaurant_menu[stock]', formData.stock);
    dataToSend.append('manage_restaurant_menu[active]', formData.active);
    dataToSend.append('manage_restaurant_menu[category_id]', formData.category);
    dataToSend.append('manage_restaurant_menu[sub_category_id]', formData.subcategory);
    dataToSend.append('manage_restaurant_menu[sgst_rate]', formData.sgstRate);
    dataToSend.append('manage_restaurant_menu[sgst_amt]', formData.sgstAmount);
    dataToSend.append('manage_restaurant_menu[cgst_rate]', formData.cgstRate);
    dataToSend.append('manage_restaurant_menu[cgst_amt]', formData.cgstAmount);
    dataToSend.append('manage_restaurant_menu[igst_rate]', formData.igstRate);
    dataToSend.append('manage_restaurant_menu[igst_amt]', formData.igstAmount);
    dataToSend.append('manage_restaurant_menu[description]', formData.description);

    if (selectedFile) {
      dataToSend.append('images[]', selectedFile);
    }

    try {
      dispatch(updateMenu({ baseUrl, token, id: Number(id), mid: Number(mid), data: dataToSend })).unwrap();
      toast.success('Menu item updated successfully');
      navigate(-1);
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">RESTAURANT MENU EDIT</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">○</span>
              </div>
              <h2 className="text-lg font-semibold text-[#C72030]">EDIT MENU</h2>
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
                    <SelectItem value="1">Yes</SelectItem>
                    <SelectItem value="0">No</SelectItem>
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
                    <SelectItem value="Select" disabled>Select Category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
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
                    <SelectItem value="Select" disabled>Select Subcategory</SelectItem>
                    {subCategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
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

            {/* Image Upload */}
            <div className="mb-6">
              <Label htmlFor="imageUpload">Image Upload</Label>
              <div className="mt-2 border-2 border-dashed border-yellow-400 rounded-lg p-8 text-center bg-yellow-50">
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label htmlFor="imageUpload" className="text-blue-600 underline cursor-pointer">
                  Drag & Drop or Choose File
                </Label>
                <span className="mx-2 text-gray-600">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Existing Images */}
            <div className="mb-6">
              <Label>Existing Images</Label>
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