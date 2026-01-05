import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface DocumentDetail {
  id: number;
  title: string;
  category: string;
  folder: string;
  created_by: string;
  created_date: string;
  share_with: string[];
  share_with_communities: boolean;
  attachments: {
    name: string;
    type: string;
    url: string;
  }[];
  status: boolean;
}

// Mock data - would come from API
const mockDocument: DocumentDetail = {
  id: 1,
  title: "Fire Safety Drill Report",
  category: "Lease / Legal",
  folder: "Lease Agreement",
  created_by: "Abdul",
  created_date: "5 October 2025",
  share_with: ["Tech Park 1", "Tech Park 2", "Tech Park 3"],
  share_with_communities: false,
  attachments: [
    {
      name: "Document.pdf",
      type: "PDF",
      url: "#",
    },
    {
      name: "Document.pdf",
      type: "PDF",
      url: "#",
    },
  ],
  status: true,
};

export const DocumentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentDetail>(mockDocument);

  const handleEdit = () => {
    navigate(`/maintenance/documents/edit/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      // TODO: Implement delete API call
      navigate("/maintenance/documents");
    }
  };

  const handleToggleStatus = (checked: boolean) => {
    setDocument({ ...document, status: checked });
    // TODO: Implement status update API call
  };

  const handleDownload = (attachment: { name: string; url: string }) => {
    // TODO: Implement download logic
    window.open(attachment.url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Document &gt; Document Detail
          </div>
          <div className="flex items-center gap-3">
            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="w-10 h-10 border border-[#C72030] rounded flex items-center justify-center hover:bg-[#FFF5F5] transition-colors"
            >
              <Pencil className="w-5 h-5 text-[#C72030]" />
            </button>
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="w-10 h-10 border border-[#C72030] rounded flex items-center justify-center hover:bg-[#FFF5F5] transition-colors"
            >
              <Trash2 className="w-5 h-5 text-[#C72030]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Document Title Section */}
        <div className="bg-[#F6F4EE] border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
                <FileText className="w-8 h-8 text-[#C72030]" />
              </div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a]">
                {document.title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={document.status}
                onCheckedChange={handleToggleStatus}
                className="data-[state=checked]:bg-green-500"
              />
              <span
                className={`text-sm font-medium ${document.status ? "text-green-600" : "text-gray-500"}`}
              >
                {document.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Document Info Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <p className="font-medium text-[#1a1a1a]">{document.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created By</p>
              <p className="font-medium text-[#1a1a1a]">
                {document.created_by}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Folder</p>
              <p className="font-medium text-[#1a1a1a]">{document.folder}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created On</p>
              <p className="font-medium text-[#1a1a1a]">
                {document.created_date}
              </p>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#F6F4EE] rounded flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 14C14.212 14 13.5 14.31 12.966 14.807L7.91 11.629C7.96 11.424 8 11.214 8 11C8 10.786 7.96 10.576 7.91 10.371L12.96 7.193C13.5 7.69 14.212 8 15 8C16.657 8 18 6.657 18 5C18 3.343 16.657 2 15 2C13.343 2 12 3.343 12 5C12 5.214 12.04 5.424 12.09 5.629L7.04 8.807C6.5 8.31 5.788 8 5 8C3.343 8 2 9.343 2 11C2 12.657 3.343 14 5 14C5.788 14 6.5 13.69 7.034 13.193L12.09 16.371C12.04 16.576 12 16.786 12 17C12 18.657 13.343 20 15 20C16.657 20 18 18.657 18 17C18 15.343 16.657 14 15 14Z"
                  fill="#C72030"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Share</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Share With</p>
              <div className="space-y-1">
                {document.share_with.map((park, index) => (
                  <p key={index} className="font-medium text-[#1a1a1a]">
                    {park}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Share With Communities
              </p>
              <p className="font-medium text-[#1a1a1a]">
                {document.share_with_communities ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* Attachment Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#F6F4EE] rounded flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Attachment</h2>
          </div>

          <div>
            <p className="text-sm font-medium text-[#1a1a1a] mb-4">
              Upload Document
            </p>
            <div className="grid grid-cols-2 gap-4">
              {document.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-3 hover:border-[#C72030] transition-colors group cursor-pointer"
                >
                  <div className="relative">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M28 4H12C10.9 4 10 4.9 10 6V42C10 43.1 10.9 44 12 44H36C37.1 44 38 43.1 38 42V16L28 4Z"
                        fill="#E74C3C"
                      />
                      <path d="M28 4V16H38L28 4Z" fill="#C0392B" />
                      <text
                        x="24"
                        y="32"
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        PDF
                      </text>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      {attachment.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(attachment)}
                    className="absolute top-3 right-3 w-8 h-8 bg-[#C72030] rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
