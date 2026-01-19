import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { baseClient } from "@/utils/withoutTokenBase";

interface DocumentDetail {
  id: number;
  title: string;
  attachment: {
    id: number;
    filename: string;
    file_type: string;
  };
}

export const DocumentShareLinkPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<DocumentDetail | null>(null);

  useEffect(() => {
    const fetchDocumentAndRedirect = async () => {
      try {
        // Get org_id from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const orgId = urlParams.get("org_id");

        if (!orgId) {
          setError("Organization ID is required to access this document");
          setLoading(false);
          return;
        }

        // Fetch document details
        const response = await baseClient.get(
          `/documents/public_view?uuid=${id}`
        );
        setDocument(response.data);

        // Redirect to editor with org_id
        const attachmentId = response.data.attachment.uuid;
        navigate(`/documents/editor/${attachmentId}?org_id=${orgId}`, {
          replace: true,
        });
      } catch (err) {
        console.error("Error fetching document:", err);
        setError(
          "Failed to load document. Please check the link and try again."
        );
        setLoading(false);
      }
    };

    if (id) {
      fetchDocumentAndRedirect();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C72030] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-[#C72030] hover:bg-[#A01828] text-white"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <FileText className="w-12 h-12 text-[#C72030] mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to document editor...</p>
      </div>
    </div>
  );
};
