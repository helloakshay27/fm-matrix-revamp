import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  UploadCloud,
  Download,
  FileText,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ImportRetainerInvoicesPage = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          Retainer Invoices - Select File
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        {/* Stepper */}
        <div className="flex justify-center items-center mb-12">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-semibold text-sm">
              1
            </div>
            <span className="ml-2 font-semibold text-gray-800">Configure</span>
          </div>
          <div className="w-24 h-px bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-400 font-semibold text-sm">
              2
            </div>
            <span className="ml-2 text-gray-400">Map Fields</span>
          </div>
          <div className="w-24 h-px bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-400 font-semibold text-sm">
              3
            </div>
            <span className="ml-2 text-gray-400">Preview</span>
          </div>
        </div>

        {/* Main Upload Box */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 mb-8 flex flex-col items-center justify-center transition-colors
                        ${dragActive ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50/50"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <UploadCloud className="w-8 h-8 text-gray-400" />
          </div>

          <h3 className="text-lg font-medium text-gray-700 mb-6">
            Drag and drop file to import
          </h3>

          <div className="relative mb-6">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleChange}
              accept=".csv,.tsv,.xls,.xlsx"
            />
            {/* Dropdown Menu Structure */}
            <div className="relative group inline-block">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 pr-4 rounded-md flex items-center gap-2">
                Choose File
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>

              {/* Dropdown Content */}
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-1 hidden group-hover:block z-10">
                <label
                  htmlFor="file-upload"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white cursor-pointer transition-colors"
                >
                  Attach From Desktop
                </label>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white transition-colors">
                  Attach From Cloud
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white transition-colors">
                  Attach From Documents
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center uppercase tracking-wide">
            Maximum File Size: 25 MB • File Format: CSV or TSV or XLS
          </p>
          {selectedFile && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-1 rounded shadow-sm border border-gray-200">
              <FileText className="w-4 h-4 text-red-500" />
              {selectedFile.name}
            </div>
          )}
        </div>

        {/* Helpers */}
        <p className="text-sm text-gray-600 mb-12">
          Download a{" "}
          <a href="#" className="text-blue-500 hover:underline">
            sample csv file
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-500 hover:underline">
            sample xls file
          </a>{" "}
          and compare it to your import file to ensure you have the file perfect
          for the import.
        </p>

        {/* Settings */}
        <div className="grid grid-cols-12 gap-4 items-center mb-8">
          <div className="col-span-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Character Encoding{" "}
              <HelpCircle className="w-3 h-3 text-gray-400" />
            </label>
          </div>
          <div className="col-span-5">
            <Select defaultValue="utf8">
              <SelectTrigger className="w-full bg-white border-gray-300">
                <SelectValue placeholder="Select encoding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utf8">UTF-8 (Unicode)</SelectItem>
                <SelectItem value="utf16">UTF-16 (Unicode)</SelectItem>
                <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                <SelectItem value="iso-8859-2">ISO-8859-2</SelectItem>
                <SelectItem value="iso-8859-9">ISO-8859-9 (Turkish)</SelectItem>
                <SelectItem value="gb2312">
                  GB2312 (Simplified Chinese)
                </SelectItem>
                <SelectItem value="big5">Big5 (Traditional Chinese)</SelectItem>
                <SelectItem value="shift_jis">Shift_JIS (Japanese)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Page Tips */}
        <div className="bg-blue-50/50 p-6 rounded-lg mb-8">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
            <span className="text-yellow-500 text-lg">💡</span> Page Tips
          </h4>
          <ul className="text-sm text-gray-700 space-y-3 pl-2">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-500 shrink-0"></span>
              <span>
                Import data with the details of GST Treatment by referring these{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  accepted formats
                </a>
                .
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-500 shrink-0"></span>
              <span>
                You can download the{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  sample xls file
                </a>{" "}
                to get detailed information about the data fields used while
                importing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-500 shrink-0"></span>
              <span>
                If you have files in other formats, you can convert it to an
                accepted file format using any online/offline converter.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-500 shrink-0"></span>
              <span>
                You can configure your import settings and save them for future
                too!
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 flex items-center justify-center gap-4 shrink-0">
        <Button className="bg-red-600 hover:bg-red-700 text-white px-6">
          Next
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
