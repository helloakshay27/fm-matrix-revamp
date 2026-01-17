import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface OnlyOfficeEditorProps {
  attachmentId: number;
  filename: string;
  onClose: () => void;
}

export const OnlyOfficeEditor: React.FC<OnlyOfficeEditorProps> = ({
  attachmentId,
  filename,
  onClose,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to the dedicated OnlyOffice editor page
    navigate(`/maintenance/documents/editor/${attachmentId}`);
    // Close the modal since we're navigating away
    onClose();
  }, [attachmentId, navigate, onClose]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030] mx-auto"></div>
        <p className="mt-4 text-gray-600">Opening editor for {filename}...</p>
      </div>
    </div>
  );
};
