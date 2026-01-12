import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";

interface OnlyOfficeConfig {
  document: {
    fileType: string;
    key: string;
    title: string;
    url: string;
  };
  documentType: string;
  editorConfig: {
    mode: string;
    callbackUrl: string;
  };
  token?: string;
}

declare global {
  interface Window {
    DocsAPI: {
      DocEditor: new (elementId: string, config: OnlyOfficeConfig) => void;
    };
  }
}

export const OnlyOfficeEditorPage = () => {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId: string }>();
  const location = useLocation();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>("Document Editor");

  useEffect(() => {
    console.log("OnlyOfficeEditorPage mounted with documentId:", documentId);

    // Load OnlyOffice API script
    const script = document.createElement("script");
    const onlyOfficeBaseUrl =
      import.meta.env.VITE_ONLYOFFICE_BASE_URL || "https://office.lockated.com";
    script.src = `${onlyOfficeBaseUrl}/web-apps/apps/api/documents/api.js`;
    script.async = true;

    script.onload = () => {
      console.log("OnlyOffice API script loaded successfully");
      initializeEditor();
    };

    script.onerror = () => {
      console.error("Failed to load OnlyOffice API script");
      setError("Failed to load OnlyOffice API");
      setIsLoading(false);
      toast.error("Failed to load document editor");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [documentId]);

  const initializeEditor = async () => {
    try {
      console.log("Fetching OnlyOffice config for document:", documentId);

      // Fetch config from backend API using dynamic base URL
      const baseUrl = API_CONFIG.BASE_URL;
      const apiUrl = `${baseUrl}/attachfiles/${documentId}/onlyoffice_config.json`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch config: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Received config from API:", data);

      const { config, token } = data;

      // Set document title from config
      if (config?.document?.title) {
        setDocumentTitle(config.document.title);
        console.log("Document title:", config.document.title);
      }

      // Add token to config if provided
      if (token) {
        config.token = token;
        console.log("Token added to config");
      }

      console.log("Final OnlyOffice config:", config);

      // Initialize editor
      if (window.DocsAPI) {
        console.log("Initializing OnlyOffice DocEditor...");
        new window.DocsAPI.DocEditor("editor", config);
        console.log("OnlyOffice DocEditor initialized successfully");
        setIsLoading(false);
      } else {
        throw new Error("DocsAPI not available");
      }
    } catch (err) {
      console.error("Error initializing editor:", err);
      setError("Failed to initialize document editor");
      setIsLoading(false);
      toast.error("Failed to initialize document editor");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">
              Document Editor
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Button
              onClick={() => navigate(-1)}
              className="bg-[#C72030] hover:bg-[#A01828] text-white"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">{documentTitle}</h1>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative" style={{ height: "calc(100vh - 80px)" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#C72030] mx-auto mb-4" />
              <p className="text-gray-600">Loading document editor...</p>
            </div>
          </div>
        )}
        <div
          id="editor"
          ref={editorRef}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};
