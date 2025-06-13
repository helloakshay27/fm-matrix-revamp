
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, File, Folder, FileText, Image, ChevronRight, ChevronDown } from "lucide-react";

const commonDocumentsData = [
  {
    id: "common-files",
    type: "folder",
    name: "Common Files",
    children: [
      {
        id: "leave-policy",
        type: "folder",
        name: "Leave Policy & Holiday List",
        children: [
          { name: "ATTENDANCE___LEAVE_POLICY.docx", type: "document" },
          { name: "Public_Holiday_List_2022_LOCKATED.pdf", type: "pdf" }
        ]
      },
      {
        id: "reimbursement",
        type: "folder", 
        name: "Reimbursement Policy",
        children: [
          { name: "Reimbursement.png", type: "image" },
          { name: "Expense_and_Travel_Reimbursement.pdf", type: "pdf" }
        ]
      }
    ]
  },
  {
    id: "my-documents",
    type: "folder",
    name: "My Documents",
    children: [
      { name: "48CN2.docx.pdf", type: "pdf" },
      { name: "FM_category_incident.xlsx", type: "excel" },
      { name: "sample_ptd.pdf", type: "pdf" }
    ]
  }
];

export const DocumentsCommonDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["common-files"]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="w-4 h-4 text-blue-500" />;
      case "image":
        return <Image className="w-4 h-4 text-green-500" />;
      case "document":
      case "pdf":
        return <FileText className="w-4 h-4 text-red-500" />;
      case "excel":
        return <FileText className="w-4 h-4 text-green-600" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderTreeItem = (item: any, depth = 0) => {
    const isExpanded = expandedFolders.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id || item.name}>
        <div 
          className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-50 cursor-pointer`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => item.id && toggleFolder(item.id)}
        >
          {hasChildren && (
            <div className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-600" />
              )}
            </div>
          )}
          {!hasChildren && <div className="w-4 h-4" />}
          {getFileIcon(item.type)}
          <span className="text-sm text-gray-700">{item.name}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {item.children.map((child: any, index: number) => 
              renderTreeItem(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const filteredDocuments = commonDocumentsData.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.children?.some(child => 
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (child.children && child.children.some((subChild: any) => 
        subChild.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    )
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Documents</span>
        <span>{">"}</span>
        <span className="text-gray-900 font-medium">Common</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">COMMON</h1>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Documents Tree */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4">
          {filteredDocuments.map((doc) => renderTreeItem(doc))}
        </div>
      </div>
    </div>
  );
};
