import React, { useState } from "react";
import { Folder, ChevronDown, ChevronRight } from "lucide-react";

interface Document {
  id: number;
  folder_title: string;
  size: string;
  created_date: string;
  status: "Active" | "Inactive";
}

interface DocumentTreeViewProps {
  documents: Document[];
  onViewDetails: (documentId: number) => void;
}

export const DocumentTreeView: React.FC<DocumentTreeViewProps> = ({
  documents,
  onViewDetails,
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );

  const toggleExpand = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-[#1a1a1a]">Documents &gt; Folders</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {documents.map((doc) => {
          const isExpanded = expandedItems[doc.id];
          return (
            <div key={doc.id} className="hover:bg-gray-50 transition-colors">
              {/* Main Row */}
              <div
                className="flex items-center p-4 cursor-pointer"
                onClick={() => onViewDetails(doc.id)}
              >
                {/* Expand/Collapse Button */}
                <button
                  onClick={(e) => toggleExpand(doc.id, e)}
                  className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="mr-3 w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Folder Icon */}
                <div className="w-10 h-10 bg-[#FFF5F5] rounded-lg flex items-center justify-center mr-3">
                  <Folder className="w-5 h-5 text-[#C72030]" />
                </div>

                {/* Folder Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[#1a1a1a]">
                        {doc.folder_title}
                      </h4>
                      <p className="text-sm text-gray-500">{doc.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {doc.created_date}
                      </p>
                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                          doc.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content (Placeholder) */}
              {isExpanded && (
                <div className="pl-16 pr-4 pb-4 space-y-2">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <Folder className="w-4 h-4 text-[#C72030]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        Subfolder 1
                      </p>
                      <p className="text-xs text-gray-500">2 items</p>
                    </div>
                    <span className="text-xs text-gray-500">12/10/2025</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <Folder className="w-4 h-4 text-[#C72030]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        Subfolder 2
                      </p>
                      <p className="text-xs text-gray-500">5 items</p>
                    </div>
                    <span className="text-xs text-gray-500">12/10/2025</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
