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
import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, File, FileSpreadsheet, Upload } from "lucide-react";

type Doc = { id: number; document: string; document_name: string };

interface AttachmentsTabProps {
  asset: {
    id: number;
    asset_image?: { document: string; document_name: string } | null;
    asset_manuals?: Doc[];
    asset_insurances?: Doc[];
    asset_purchases?: Doc[];
    asset_other_uploads?: Doc[];
  };
  assetId?: string | number;
}

export const AttachmentsTab: React.FC<AttachmentsTabProps> = ({ asset, assetId }) => {
  const navigate = useNavigate();

  const sections: { name: string; files: Doc[] }[] = [
    {
      name: "Asset Image",
      files: asset.asset_image?.document
        ? [{ id: 0, document: asset.asset_image.document, document_name: asset.asset_image.document_name || "Asset Image" }]
        : [],
    },
    { name: "Manuals", files: asset.asset_manuals || [] },
    { name: "Insurance Details", files: asset.asset_insurances || [] },
    { name: "Purchase Invoice", files: asset.asset_purchases || [] },
    { name: "Other Documents", files: asset.asset_other_uploads || [] },
  ];

  const FileIcon = ({ name }: { name: string }) => {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (ext === "pdf") return <File className="w-4 h-4 shrink-0 text-red-600" />;
    if (["xlsx", "xls", "csv"].includes(ext)) return <FileSpreadsheet className="w-4 h-4 shrink-0 text-green-600" />;
    return <FileText className="w-4 h-4 shrink-0 text-[rgba(26,26,24,0.68)]" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-[rgba(26,26,24,0.12)] p-6">
      <h3 className="text-base font-semibold text-[#1A1A18] mb-4">Attachments</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {sections.map((sec) => (
          <div
            key={sec.name}
            className="attachment-dropzone flex flex-col items-center gap-2 text-center rounded-xl bg-white border-2 border-dashed border-[rgba(26,26,24,0.12)] p-[18px] transition-colors hover:border-[rgba(26,26,24,0.28)]"
          >
            <FileText className="w-[18px] h-[18px] text-[#1A1A18]" />
            <div className="text-[12.5px] font-semibold text-[#1A1A18]">{sec.name}</div>
            {sec.files.length === 0 ? (
              <div className="text-[11px] text-[rgba(26,26,24,0.48)]">Nothing uploaded</div>
            ) : (
              <ul className="w-full space-y-1">
                {sec.files.map((f, i) => (
                  <li key={f.id || i}>
                    <a
                      href={f.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={f.document_name}
                      className="flex items-center justify-center gap-1.5 text-[11px] text-[#1A1A18] hover:underline"
                    >
                      <FileIcon name={f.document_name || ""} />
                      <span className="truncate max-w-[140px]">{f.document_name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => navigate(`/maintenance/asset/edit/${assetId ?? asset.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1A1A18] bg-transparent hover:bg-transparent hover:underline transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
