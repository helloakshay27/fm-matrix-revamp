// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { FileText, File, Image } from 'lucide-react';

// interface AttachmentsTab {
//   asset: Asset;
//   assetId?: string | number;
// }
// interface Asset {
//   id: number;
//   name: string;
//   model_number: string;
//   serial_number: string;
//   purchase_cost: number;
//   purchased_on: string;
//   warranty: boolean;
//   warranty_expiry: string;
//   manufacturer: string;
//   asset_number: string;
//   asset_code: string;
//   group: string;
//   sub_group: string;
//   allocation_type: string;
//   depreciation_applicable: boolean;
//   depreciation_method: string;
//   useful_life: number;
//   salvage_value: number;
//   status: string;
//   current_book_value: number;
//   site_name: string;
//   commisioning_date: string;
//   vendor_name: string;
//   supplier_detail?: {
//     company_name: string;
//     email: string;
//     mobile1: string;
//   };
//   asset_loan_detail?: {
//     agrement_from_date: string;
//     agrement_to_date: string;
//     supplier: string;
//   };
//   depreciation_details?: {
//     period: string;
//     book_value_beginning: number;
//     depreciation: number;
//     book_value_end: number;
//   }[];
//   asset_amcs?: any[];
//   custom_fields?: any;
//   floor?: { name: string };
//   building?: { name: string };
//   wing?: { name: string };
//   area?: { name: string };
// }

// interface AttachmentsTabProps {
//   asset: Asset;
// }
// export const AttachmentsTab: React.FC<AttachmentsTab> = ({ asset, assetId }) => {
//   const [activeType, setActiveType] = useState('Manuals Upload');
//   const attachmentTypes = [{
//     name: 'Manuals Upload',
//     count: 10,
//     active: true
//   }, {
//     name: 'Insurance Details',
//     count: 5,
//     active: false
//   }, {
//     name: 'Purchase Invoice',
//     count: 1,
//     active: false
//   }, {
//     name: 'Other Uploads',
//     count: 1,
//     active: false
//   }];
//   const fileData = [{
//     name: 'Image.png',
//     type: 'image'
//   }, {
//     name: 'File1.pdf',
//     type: 'pdf'
//   }, {
//     name: 'Image.jpg',
//     type: 'image'
//   }, {
//     name: 'File1.pdf',
//     type: 'pdf'
//   }, {
//     name: 'File2.pdf',
//     type: 'pdf'
//   }, {
//     name: 'Image.png',
//     type: 'image'
//   }, {
//     name: 'Image.png',
//     type: 'image'
//   }, {
//     name: 'Image.png',
//     type: 'image'
//   }, {
//     name: 'File2.pdf',
//     type: 'pdf'
//   }, {
//     name: 'Image.png',
//     type: 'image'
//   }];
//   const getFileIcon = (type: string) => {
//     switch (type) {
//       case 'image':
//         return <Image className="w-6 h-6 text-gray-600" />;
//       case 'pdf':
//         return <File className="w-6 h-6 text-red-600" />;
//       default:
//         return <FileText className="w-6 h-6 text-gray-600" />;
//     }
//   };
//   return <div className="space-y-6">
//       {/* Attachment Type Buttons */}
//       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 overflow-x-auto pb-2">
//         {attachmentTypes.map((type, index) => <Button key={index} variant={type.name === activeType ? "default" : "outline"} className={`flex items-center gap-2 whitespace-nowrap min-w-fit px-4 py-2 rounded-lg ${type.name === activeType ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`} onClick={() => setActiveType(type.name)}>
//             <div className="w-4 h-4 rounded flex-shrink-0 bg-red-700"></div>
//             <span className="text-sm font-medium">{type.name}</span>
//             <span className="text-xs">{type.count} Files</span>
//           </Button>)}
//       </div>

//       {/* Files Section */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-medium text-gray-900">Files</h3>

//         {/* Files Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//           {fileData.map((file, index) => <div key={index} className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
//               {/* File Preview */}
//               <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center border">
//                 {file.type === 'image' ? <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center">
//                     <Image className="w-8 h-8 text-gray-400" />
//                   </div> : <div className="w-full h-full bg-white rounded flex flex-col items-center justify-center p-2">
//                     <div className="text-xs text-gray-600 font-mono leading-tight text-center">
//                       {/* Simulated document content lines */}
//                       <div className="space-y-1">
//                         <div className="h-1 bg-gray-300 rounded w-full"></div>
//                         <div className="h-1 bg-gray-300 rounded w-3/4"></div>
//                         <div className="h-1 bg-gray-300 rounded w-full"></div>
//                         <div className="h-1 bg-gray-300 rounded w-2/3"></div>
//                       </div>
//                     </div>
//                     <div className="mt-2">
//                       {getFileIcon(file.type)}
//                     </div>
//                   </div>}
//               </div>

//               {/* File Name */}
//               <p className="text-sm text-gray-700 text-center font-medium">
//                 {file.name}
//               </p>
//             </div>)}
//         </div>
//       </div>
//     </div>;
// };
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, File, Image, FileSpreadsheet } from "lucide-react";

interface AttachmentsTab {
  asset: Asset;
  assetId?: string | number;
}
interface Asset {
  id: number;
  name: string;
  asset_manuals?: { id: number; document: string; document_name: string }[];
  asset_other_uploads?: {
    id: number;
    document: string;
    document_name: string;
  }[];
  asset_insurances?: { id: number; document: string; document_name: string }[];
  asset_purchases?: { id: number; document: string; document_name: string }[];
}

const attachmentTypes = [
  { name: "Manuals Upload", key: "asset_manuals" },
  { name: "Insurance Details", key: "asset_insurances" },
  { name: "Purchase Invoice", key: "asset_purchases" },
  { name: "Other Uploads", key: "asset_other_uploads" },
];

export const AttachmentsTab: React.FC<AttachmentsTab> = ({ asset }) => {
  const defaultType =
    attachmentTypes.find((type) => (asset as any)[type.key]?.length > 0)
      ?.name || attachmentTypes[0].name;
  const [activeType, setActiveType] = useState(defaultType);

  const filesMap: Record<
    string,
    { id: number; document: string; document_name: string }[]
  > = {
    "Manuals Upload": asset.asset_manuals || [],
    "Insurance Details": asset.asset_insurances || [],
    "Purchase Invoice": asset.asset_purchases || [],
    "Other Uploads": asset.asset_other_uploads || [],
  };

  const getFileIcon = (name: string, url: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png"].includes(ext || "")) {
      return (
        <img
          src={url}
          alt={name}
          className="object-contain w-full h-full rounded"
        />
      );
    }
    if (ext === "pdf") {
      return <File className="w-8 h-8 text-red-600" />;
    }
    if (["xlsx", "xls", "csv"].includes(ext || "")) {
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    }
    return <FileText className="w-8 h-8 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Attachment Type Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 overflow-x-auto pb-2">
        {attachmentTypes.map((type, index) => {
          const isActive = type.name === activeType;
          return (
            <Button
              key={index}
              variant={isActive ? "default" : "outline"}
              className={`flex items-center gap-2 whitespace-nowrap min-w-fit px-4 py-2 rounded-lg 
        ${
          isActive
            ? "bg-[#FBE8EA] border-[#C72030]"
            : "border-gray-300 bg-white hover:bg-gray-50"
        }`}
              onClick={() => setActiveType(type.name)}
            >
              <div className="w-4 h-4 rounded flex-shrink-0 bg-red-700"></div>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-[#C72030]" : "text-black"
                }`}
              >
                {type.name}
              </span>
              <span
                className={`text-xs ${
                  isActive ? "text-[#C72030]" : "text-black"
                }`}
              >
                {filesMap[type.name].length} Files
              </span>
            </Button>
          );
        })}
      </div>

      {/* Files Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Files</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filesMap[activeType].length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              No files available.
            </div>
          ) : (
            filesMap[activeType].map((file, index) => (
              <div
                key={file.id || index}
                className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
              >
                {/* File Preview */}
                <a
                  href={file.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center border overflow-hidden"
                >
                  {getFileIcon(file.document_name, file.document)}
                </a>
                {/* File Name */}
                <p className="text-sm text-gray-700 text-center font-medium break-all">
                  {file.document_name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
