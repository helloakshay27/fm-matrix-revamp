
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, File, Folder, FileText, Image } from "lucide-react";

const documentsData = [
  {
    id: "1110",
    type: "folder",
    name: "1110",
    children: [
      { name: "Android_QR.png", type: "image" },
      { name: "Business_Economics.docx", type: "document" },
      { name: "nmRegistrationForm_Lead_compressed.pdf", type: "pdf" }
    ]
  },
  {
    id: "512",
    type: "folder", 
    name: "512",
    children: [
      { name: "Business_Economics.docx", type: "document" },
      { name: "101 TCS", type: "text" },
      { name: "Reception", type: "text" }
    ]
  },
  {
    id: "HELP DESK",
    type: "folder",
    name: "HELP DESK", 
    children: [
      { name: "nb", type: "text" },
      { name: "278", type: "text" }
    ]
  },
  {
    id: "278",
    type: "folder",
    name: "278",
    children: [
      { name: "FM_category_incident_1_.xlsx", type: "excel" },
      { name: "278", type: "text" },
      { name: "278", type: "text" },
      { name: "111", type: "text" }
    ]
  }
];

export const DocumentsUnitDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

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

  const filteredDocuments = documentsData.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.children?.some(child => 
      child.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Documents</span>
        <span>{">"}</span>
        <span className="text-gray-900 font-medium">Unit Related</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">UNIT RELATED</h1>
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

      {/* Documents Table/Tree */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc, index) => (
              <>
                <TableRow 
                  key={doc.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleFolder(doc.id)}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.type)}
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500 capitalize">{doc.type}</span>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                {expandedFolders.includes(doc.id) && doc.children?.map((child, childIndex) => (
                  <TableRow key={`${doc.id}-${childIndex}`} className="bg-gray-50">
                    <TableCell></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 ml-4">
                        {getFileIcon(child.type)}
                        <span>{child.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500 capitalize">{child.type}</span>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
