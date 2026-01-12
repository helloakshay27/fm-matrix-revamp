import React from "react";
import { FileIcon } from "./FileIcon";

interface Document {
  id: number;
  folder_title: string;
  category?: string;
  document_count?: number;
  size: string;
  status: "Active" | "Inactive";
  created_by?: string;
  created_date: string;
  modified_date?: string;
  files_count?: number;
  folders_count?: number;
}

interface DocumentGridViewProps {
  documents: Document[];
  onViewDetails: (documentId: number) => void;
}

export const DocumentGridView: React.FC<DocumentGridViewProps> = ({
  documents,
  onViewDetails,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onViewDetails(doc.id)}
          className="bg-[#F6F4EE] rounded border border-[#E5E0D3] cursor-pointer hover:shadow-lg transition-all duration-300 p-4"
        >
          {/* Top Section with Icon and Title */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-[#E5E0D3] rounded flex items-center justify-center flex-shrink-0">
              <FileIcon
                fileName={doc.folder_title}
                isFolder={true}
                className="w-6 h-6"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#1A1A1A] text-base leading-tight mb-1">
                {doc.folder_title}
              </h3>
              {(doc.files_count !== undefined ||
                doc.folders_count !== undefined) && (
                <p className="text-sm text-[#666666]">
                  {doc.files_count !== undefined &&
                    `${doc.files_count} File${doc.files_count !== 1 ? "s" : ""}`}
                  {doc.files_count !== undefined &&
                    doc.folders_count !== undefined &&
                    " "}
                  {doc.folders_count !== undefined &&
                    doc.folders_count > 0 &&
                    `${doc.folders_count} Folder${doc.folders_count !== 1 ? "s" : ""} `}
                  {doc.size}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div className="text-[#666666]">
                  {doc.modified_date ? "Modified: " : "Created: "}
                  {doc.modified_date || doc.created_date}
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
        </div>
      ))}
    </div>
  );
};
