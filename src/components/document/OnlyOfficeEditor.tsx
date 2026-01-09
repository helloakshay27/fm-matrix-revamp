import React, { useState } from "react";
import { X, ExternalLink } from "lucide-react";

interface OnlyOfficeEditorProps {
  documentId: number;
  filename: string;
  fileUrl: string;
  onClose: () => void;
}

export const OnlyOfficeEditor: React.FC<OnlyOfficeEditorProps> = ({
  documentId,
  filename,
  fileUrl,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl") || "";
  const cleanBaseUrl = baseUrl.replace(/^https?:\/\//, "");
  const fullUrl = `https://${cleanBaseUrl}${decodeURIComponent(fileUrl)}`;

  // Construct OnlyOffice editor URL
  const editorUrl = `https://office.lockated.com/editor?documentId=${documentId}&filename=${encodeURIComponent(filename)}&fileUrl=${encodeURIComponent(fullUrl)}`;

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const handleOpenInNewTab = () => {
    window.open(editorUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{filename}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#C72030] hover:bg-[#A01828] rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading editor...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white p-6">
            <div className="text-center max-w-md">
              <div className="text-gray-400 mb-4">
                <ExternalLink className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unable to Load Editor
              </h3>
              <p className="text-gray-600 mb-4">
                The document editor cannot be loaded inline due to security
                restrictions. Please open it in a new tab to view and edit the
                document.
              </p>
              <button
                onClick={handleOpenInNewTab}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm text-white bg-[#C72030] hover:bg-[#A01828] rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </button>
            </div>
          </div>
        )}
        <iframe
          src={editorUrl}
          className="w-full h-full border-0"
          title={filename}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-downloads"
        />
      </div>
    </div>
  );
};
