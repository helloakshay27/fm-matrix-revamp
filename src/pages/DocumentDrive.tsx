import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Grid3X3,
  AlignJustify,
  FolderTree,
  Folder,
  ChevronDown,
  Eye,
  ChevronsUpDown,
  FileText,
  X,
  Type,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DriveFile {
  id: string;
  title: string;
}

interface DriveItem {
  id: string;
  title: string;
  description: string;
  files?: DriveFile[];
}

const driveItems: DriveItem[] = [
  {
    id: "1",
    title: "General Policies",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    files: [
      { id: "f1-1", title: "Leave Policy" },
      { id: "f1-2", title: "Leave Policy" },
    ],
  },
  {
    id: "2",
    title: "Rewards & Recognition",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    files: [
      { id: "f2-1", title: "Leave Policy" },
      { id: "f2-2", title: "Leave Policy" },
    ],
  },
  {
    id: "3",
    title: "At Will Employment Policy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    files: [
      { id: "f3-1", title: "Leave Policy" },
      { id: "f3-2", title: "Leave Policy" },
    ],
  },
  {
    id: "4",
    title: "Business Travel Policy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  },
  {
    id: "5",
    title: "Health & Safety Policy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  },
  {
    id: "6",
    title: "Reimbursement Policy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  },
  {
    id: "7",
    title: "Termination Policy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  },
  {
    id: "8",
    title: "Leave Policy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  },
  {
    id: "9",
    title: "Code of Conduct Policy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  },
];

const DocumentDrive: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "tree">("grid");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["1", "2"]); // Default open for demo
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleFileClick = (file: DriveFile) => {
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="relative mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-center w-full max-w-5xl mx-auto pt-2">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Document Drive
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed max-w-3xl mx-auto text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search document"
            className="w-full h-12 pl-11 pr-4 rounded-full bg-[#E5E5E5]/50 border-none focus:ring-1 focus:ring-gray-300 text-sm text-gray-700 placeholder:text-gray-500/70"
          />
        </div>
      </div>

      {/* View Controls */}
      <div className="max-w-[76rem] mx-auto mb-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setViewMode("grid");
            setSelectedFile(null);
          }}
          className={`w-9 h-9 border rounded flex items-center justify-center transition-colors ${
            viewMode === "grid"
              ? "border-[#FF6B6B] bg-white text-[#FF6B6B]"
              : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setViewMode("list");
            setSelectedFile(null);
          }}
          className={`w-9 h-9 border rounded flex items-center justify-center transition-colors ${
            viewMode === "list"
              ? "border-[#FF6B6B] bg-white text-[#FF6B6B]"
              : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
          }`}
        >
          <AlignJustify className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode("tree")}
          className={`w-9 h-9 border rounded flex items-center justify-center transition-colors ${
            viewMode === "tree"
              ? "border-[#FF6B6B] bg-white text-[#FF6B6B]"
              : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
          }`}
        >
          <FolderTree className="w-5 h-5" />
        </button>
      </div>

      {/* Drive Content */}
      {viewMode === "grid" ? (
        <div className="max-w-[76rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {driveItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#F8F6F1] rounded-lg p-4 border border-gray-100/50 hover:shadow-sm transition-shadow flex gap-4 items-start group cursor-pointer"
            >
              {/* Icon Box */}
              <div className="w-12 h-12 bg-[#EAE6DB] rounded-md flex items-center justify-center shrink-0">
                <Folder
                  className="w-5 h-5 text-[#FF6B6B]"
                  fill="#FF6B6B"
                  fillOpacity={0.1}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#FF6B6B] transition-colors">
                    {item.title}
                  </h3>
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "list" ? (
        <div className="max-w-[76rem] mx-auto bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#EAE6DB]/30 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 w-24">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 w-1/4 cursor-pointer hover:bg-black/5 transition-colors group">
                  <div className="flex items-center gap-2">
                    Folder Title
                    <ChevronsUpDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 cursor-pointer hover:bg-black/5 transition-colors group">
                  <div className="flex items-center gap-2">
                    Description
                    <ChevronsUpDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {driveItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-6 py-4 text-center">
                    <Eye className="w-4 h-4 text-gray-500 hover:text-blue-600 cursor-pointer mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-[10px] text-gray-500 leading-relaxed">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tree View */
        <div className="max-w-[76rem] mx-auto flex gap-6 items-start">
          {/* Left Panel - Tree List */}
          <div
            className={`${selectedFile ? "w-1/3" : "w-full grid grid-cols-1 gap-4"} transition-all duration-300`}
          >
            <div className={`space-y-4 ${!selectedFile ? "max-w-xl" : ""}`}>
              {driveItems.map((item) => (
                <div key={item.id}>
                  {/* Folder Card */}
                  <div
                    onClick={() => toggleFolder(item.id)}
                    className={`bg-[#F8F6F1] rounded-lg p-3 border border-gray-100/50 hover:shadow-sm transition-shadow flex gap-3 items-start cursor-pointer relative z-10 ${expandedFolders.includes(item.id) && item.files ? "mb-0" : ""}`}
                  >
                    <div className="w-10 h-10 bg-[#EAE6DB] rounded-md flex items-center justify-center shrink-0">
                      <Folder
                        className="w-4 h-4 text-[#FF6B6B]"
                        fill="#FF6B6B"
                        fillOpacity={0.1}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold text-gray-900">
                          {item.title}
                        </h3>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-400 transform transition-transform ${expandedFolders.includes(item.id) ? "rotate-180" : ""}`}
                        />
                      </div>
                      <p className="text-[9px] text-gray-500 leading-relaxed line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Files Tree */}
                  {expandedFolders.includes(item.id) && item.files && (
                    <div className="pl-5 relative pt-4 -mt-2">
                      {/* Vertical Line from folder */}
                      <div className="absolute left-[1.15rem] top-0 bottom-6 w-px bg-gray-300"></div>

                      {item.files.map((file, idx) => (
                        <div
                          key={file.id}
                          className="relative flex items-center mb-3 last:mb-0 group"
                          onClick={() => handleFileClick(file)}
                        >
                          {/* Horizontal Line */}
                          <div className="w-6 h-px bg-gray-300 mr-2 relative z-0"></div>

                          <div className="flex items-center gap-2 cursor-pointer hover:text-[#2563EB]">
                            <FileText className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#2563EB]" />
                            <span
                              className={`text-[11px] font-medium ${selectedFile?.id === file.id ? "text-[#2563EB]" : "text-gray-600"} group-hover:text-[#2563EB]`}
                            >
                              {file.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Document Viewer */}
          {selectedFile && (
            <div className="flex-1 border border-gray-200 bg-white rounded-lg h-[600px] shadow-sm flex flex-col relative animate-fadeIn">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <Type className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-800 text-sm">
                    {selectedFile.title}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
                <div className="bg-white border border-blue-100 shadow-sm p-8 min-h-full mx-auto max-w-3xl">
                  <h2 className="text-xl font-bold text-blue-600 mb-6">
                    {selectedFile.title}
                  </h2>
                  <div className="space-y-4 text-justify text-xs text-gray-600 leading-loose">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Blande quis ex semper, consectetur adipiscing elit. Sed do
                      eiusmod tempor incididunt ut labore et dolore magna. Ut
                      enim ad minim veniam, quis nostrud exercitation ullamco
                      laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error sit
                      voluptatem accusantium doloremque laudantium, totam rem
                      aperiam, eaque ipsa quae ab illo inventore veritatis et
                      quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                    <p>
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur
                      aut odit aut fugit, sed quia consequuntur magni dolores
                      eos qui ratione voluptatem sequi nesciunt. Neque porro
                      quisquam est, qui dolorem ipsum quia dolor sit amet.
                    </p>
                    <p className="font-bold pt-4 text-gray-800">
                      1. Eligibility
                    </p>
                    <p>
                      Consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="font-bold pt-4 text-gray-800">
                      2. Procedures
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentDrive;
