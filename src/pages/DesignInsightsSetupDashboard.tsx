
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Plus } from "lucide-react";
// import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

// export const DesignInsightsSetupDashboard = () => {
//   const [categoryInput, setCategoryInput] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [subCategoryInput, setSubCategoryInput] = useState('');

//   const categories = [
//     'Civil Infra',
//     'Utilities, Services & Assets',
//     'Inside Units',
//     'Parking',
//     'Club House & Amenities',
//     'Security & surveillance',
//     'Landscape',
//     'Façade'
//   ];

//   // Sample subcategories data
//   const subCategories = [
//     { category: 'Civil Infra', subCategory: 'Lift Lobbies' },
//     { category: 'Civil Infra', subCategory: 'Stairs' },
//     { category: 'Utilities, Services & Assets', subCategory: 'Water supply' },
//     { category: 'Utilities, Services & Assets', subCategory: 'Sewage Treatment & Disposal' },
//     { category: 'Utilities, Services & Assets', subCategory: 'Utility or machine room' },
//     { category: 'Inside Units', subCategory: 'Other' },
//     { category: 'Inside Units', subCategory: 'Utility area' },
//     { category: 'Inside Units', subCategory: 'Bedroom' },
//     { category: 'Inside Units', subCategory: 'Hall' },
//     { category: 'Inside Units', subCategory: 'Living room' },
//     { category: 'Inside Units', subCategory: 'Balcony' },
//     { category: 'Inside Units', subCategory: 'Bathroom/Toilet' },
//     { category: 'Inside Units', subCategory: 'Kitchen' },
//     { category: 'Club House & Amenities', subCategory: 'other' },
//     { category: 'Club House & Amenities', subCategory: 'Reading room/library' },
//     { category: 'Club House & Amenities', subCategory: 'Kid play area' },
//     { category: 'Club House & Amenities', subCategory: 'Indoor game room' },
//   ];

//   const handleAddCategory = () => {
//     if (categoryInput.trim()) {
//       // Add logic to handle adding new category
//       setCategoryInput('');
//     }
//   };

//   const handleAddSubCategory = () => {
//     if (selectedCategory && subCategoryInput.trim()) {
//       // Add logic to handle adding new subcategory
//       setSubCategoryInput('');
//     }
//   };

//   const handleCategoryChange = (event: SelectChangeEvent) => {
//     setSelectedCategory(event.target.value);
//   };

//   return (
//     <div className="flex-1 p-6 bg-white min-h-screen">
//       {/* Breadcrumb */}
//       <div className="mb-4">
//         <span className="text-sm text-gray-600">Design Insight {'>'}  Design Insight Tag</span>
//       </div>

//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">DESIGN INSIGHT TAGS</h1>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="category" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 mb-6">
//           <TabsTrigger
//             value="category"
//             className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
//           >
//             <svg
//               width="18"
//               height="19"
//               viewBox="0 0 18 19"
//               fill="currentColor"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             Category
//           </TabsTrigger>
//           <TabsTrigger
//             value="subcategory"
//             className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
//           >
//             <svg
//               width="16"
//               height="15"
//               viewBox="0 0 16 15"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-4 h-4"
//             >
//               <path
//                 d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
//                 fill="currentColor"
//               />
//             </svg>
//             Sub Category
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="category" className="space-y-6 mt-5">
//           {/* Category Input Section */}
//           <div className="space-y-4">
//             <div className="flex items-end gap-4">
//               <div className="flex-1">
//                 <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
//                   Category*
//                 </label>
//                 <Input
//                   id="category"
//                   value={categoryInput}
//                   onChange={(e) => setCategoryInput(e.target.value)}
//                   placeholder="Enter category name"
//                   className="w-full"
//                 />
//               </div>
//               <Button
//                 onClick={handleAddCategory}
//                 className="bg-purple-700 hover:bg-purple-800 text-white"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add
//               </Button>
//             </div>
//           </div>

//           {/* Categories List */}
//           <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 text-center">Name</h3>
//             </div>
//             <div className="space-y-3">
//               {categories.map((category, index) => (
//                 <div
//                   key={index}
//                   className="bg-white p-3 rounded border text-center text-gray-700"
//                 >
//                   {category}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="subcategory" className="space-y-6 mt-5">
//           {/* Sub Category Input Section */}
//           <div className="space-y-4">
//             <div className="flex items-end gap-4">
//               <div className="flex-1">
//                 <FormControl fullWidth size="small">
//                   <InputLabel id="category-select-label">Category*</InputLabel>
//                   <Select
//                     labelId="category-select-label"
//                     id="category-select"
//                     value={selectedCategory}
//                     label="Category*"
//                     onChange={handleCategoryChange}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '&:hover fieldset': {
//                           borderColor: '#9333ea',
//                         },
//                         '&.Mui-focused fieldset': {
//                           borderColor: '#9333ea',
//                         },
//                       },
//                     }}
//                   >
//                     <MenuItem value="">
//                       <em>Select Category</em>
//                     </MenuItem>
//                     {categories.map((category, index) => (
//                       <MenuItem key={index} value={category}>
//                         {category}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </div>
//               <div className="flex-1">
//                 <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
//                   Sub Category Name*
//                 </label>
//                 <Input
//                   id="subcategory"
//                   value={subCategoryInput}
//                   onChange={(e) => setSubCategoryInput(e.target.value)}
//                   placeholder="Enter sub category name"
//                   className="w-full"
//                 />
//               </div>
//               <Button
//                 onClick={handleAddSubCategory}
//                 className="bg-purple-700 hover:bg-purple-800 text-white"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add
//               </Button>
//             </div>
//           </div>

//           {/* Sub Categories Table */}
//           <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
//             <div className="mb-4">
//               <div className="grid grid-cols-2 gap-4 font-semibold text-gray-900 text-center bg-white py-3 rounded border">
//                 <div>Category</div>
//                 <div>Sub Category</div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               {subCategories.map((item, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-2 gap-4 bg-white p-3 rounded border text-center text-gray-700"
//                 >
//                   <div>{item.category}</div>
//                   <div>{item.subCategory}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default DesignInsightsSetupDashboard;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

export const DesignInsightsSetupDashboard = () => {
  const [categoryInput, setCategoryInput] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const [subCategories, setSubCategories] = useState<{ category: string; subCategory: string }[]>([]);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        'https://oig-api.gophygital.work/pms/design_input_tags.json',
        {
          headers: {
            Authorization: getAuthToken(),
          },
        }
      );

      const data = response.data.data;

      const designInputCategories = data
        .filter((item: any) => item.tag_type === 'DesignInputCategory')
        .map((item: any) => ({
          id: item.id,
          name: item.name,
        }));

      const designSubCategories = data
        .filter((item: any) => item.tag_type === 'DesignInputsSubCategory' && item.parent_id)
        .map((item: any) => ({
          category: designInputCategories.find((cat) => cat.id === item.parent_id)?.name || 'Unknown',
          subCategory: item.name,
        }));

      setCategories(designInputCategories);
      setSubCategories(designSubCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (categoryInput.trim()) {
      try {
        const payload = {
          incidence_tag: {
            tag_type: 'DesignInputCategory',
            active: true,
            name: categoryInput.trim(),
          },
        };

        await axios.post(
          'https://oig-api.gophygital.work/pms/design_input_tags.json',
          payload,
          {
            headers: {
              Authorization: getAuthToken(),
            },
          }
        );

        setCategoryInput('');
        fetchCategories();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleAddSubCategory = async () => {
    if (selectedCategoryId && subCategoryInput.trim()) {
      try {
        const payload = {
          incidence_tag: {
            tag_type: 'DesignInputsSubCategory',
            active: true,
            parent_id: selectedCategoryId,
            name: subCategoryInput.trim(),
          },
        };

        await axios.post(
          'https://oig-api.gophygital.work/pms/design_input_tags.json',
          payload,
          {
            headers: {
              Authorization: getAuthToken(),
            },
          }
        );

        setSubCategoryInput('');
        fetchCategories(); // Refresh subcategories
      } catch (error) {
        console.error('Error adding subcategory:', error);
      }
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const selected = categories.find((cat) => cat.id === Number(event.target.value));
    if (selected) {
      setSelectedCategoryId(selected.id);
      setSelectedCategoryName(selected.name);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">DESIGN INSIGHT TAGS</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 mb-6">
          <TabsTrigger
            value="category"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] font-semibold"
          >
            Category
          </TabsTrigger>
          <TabsTrigger
            value="subcategory"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] font-semibold"
          >
            Sub Category
          </TabsTrigger>
        </TabsList>

        {/* === CATEGORY TAB === */}
        <TabsContent value="category" className="space-y-6 mt-5">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category*
                </label>
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <Button
                onClick={handleAddCategory}
                className="bg-purple-700 hover:bg-purple-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Name</h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white p-3 rounded border text-center text-gray-700"
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* === SUB CATEGORY TAB === */}
        <TabsContent value="subcategory" className="space-y-6 mt-5">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <FormControl fullWidth size="small">
                  <InputLabel id="category-select-label">Category*</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={selectedCategoryId?.toString() || ''}
                    label="Category*"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category Name*
                </label>
                <Input
                  value={subCategoryInput}
                  onChange={(e) => setSubCategoryInput(e.target.value)}
                  placeholder="Enter sub category name"
                />
              </div>
              <Button
                onClick={handleAddSubCategory}
                className="bg-purple-700 hover:bg-purple-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 font-semibold text-gray-900 text-center bg-white py-3 rounded border">
                <div>Category</div>
                <div>Sub Category</div>
              </div>
            </div>
            <div className="space-y-2">
              {subCategories.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 bg-white p-3 rounded border text-center text-gray-700"
                >
                  <div>{item.category}</div>
                  <div>{item.subCategory}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignInsightsSetupDashboard;
