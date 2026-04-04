import React from "react";
import { FileIcon } from "./FileIcon";

interface Document {
  id: number;
  folder_title: string;
  type?: "file" | "folder";
  category?: string;
  document_count?: number;
  size: string;
  status: "Active" | "Inactive";
  created_by?: string;
  created_date: string;
  modified_date?: string;
  files_count?: number;
  folders_count?: number;
  format?: string;
  preview_url?: string;
}

interface DocumentGridViewProps {
  documents: Document[];
  onViewDetails: (documentId: number) => void;
  selectedItems?: string[];
  onSelectItem?: (itemId: string, checked: boolean) => void;
  renderActions?: (document: Document) => React.ReactNode;
}

export const DocumentGridView: React.FC<DocumentGridViewProps> = ({
  documents,
  onViewDetails,
  selectedItems = [],
  onSelectItem,
  renderActions,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {documents.map((doc) => {
        const isFile = doc.type === "file";

        if (isFile) {
          // File Card Style (Thumbnail look)
          return (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#C72030] hover:shadow-md transition-all bg-white relative group"
            >
              {/* Three-dot menu */}
              <div className="absolute top-2 right-2 z-10">
                {renderActions && renderActions(doc as any)}
              </div>

              {/* Checkbox */}
              {onSelectItem && (
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(doc.id.toString())}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectItem(doc.id.toString(), e.target.checked);
                    }}
                    className="w-4 h-4 text-[#C72030] focus:ring-[#C72030] border-gray-300 rounded cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Image preview area - click to preview */}
              <div
                className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => onViewDetails(doc.id)}
              >
                {doc.format &&
                ["JPG", "JPEG", "PNG", "GIF", "WEBP", "BMP"].includes(
                  doc.format.toUpperCase()
                ) &&
                doc.preview_url ? (
                  <img
                    src={doc.preview_url}
                    alt={doc.folder_title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const icon = document.createElement("div");
                        icon.className = "w-16 h-16";
                        parent.appendChild(icon);
                      }
                    }}
                  />
                ) : (
                  <FileIcon
                    fileName={
                      doc.format
                        ? `file.${doc.format.toLowerCase()}`
                        : doc.folder_title
                    }
                    isFolder={false}
                    className="w-16 h-16"
                  />
                )}
              </div>

              {/* File info */}
              <div className="p-3">
                <p
                  className="text-sm font-medium text-gray-900 truncate"
                  title={doc.folder_title}
                >
                  {doc.folder_title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{doc.created_date}</p>
                {doc.size && (
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                    {doc.size}
                  </span>
                )}
              </div>
            </div>
          );
        } else {
          // Folder Card Style (Beige look)
          return (
            <div
              key={doc.id}
              onClick={() => onViewDetails(doc.id)}
              className="bg-[#F6F4EE] rounded border border-[#E5E0D3] cursor-pointer hover:shadow-lg transition-all duration-300 p-4 h-full flex flex-col justify-between"
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
                  <h3 className="font-semibold text-[#1A1A1A] text-base leading-tight mb-1 truncate">
                    {doc.folder_title}
                  </h3>

                  <p className="text-sm text-[#666666]">
                    {doc.files_count !== undefined &&
                      `${doc.files_count} File${doc.files_count !== 1 ? "s" : ""}`}
                    {doc.files_count !== undefined &&
                      doc.folders_count !== undefined &&
                      doc.folders_count > 0 &&
                      ` ${doc.folders_count} Folder${doc.folders_count !== 1 ? "s" : ""}`}
                    {doc.size && doc.size !== "0 B" && ` ${doc.size}`}
                  </p>

                  <div className="mt-1 text-sm text-[#666666]">
                    {doc.modified_date ? "Modified: " : "Created: "}
                    {doc.modified_date || doc.created_date}
                  </div>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};
