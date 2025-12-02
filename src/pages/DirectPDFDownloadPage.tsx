import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { taskService } from "@/services/taskService";
import { JobSheetPDFGenerator } from "@/components/JobSheetPDFGenerator";
import { JobSheetHTMLPreview } from "@/components/JobSheetHTMLPreview";
import {
  saveToken,
  saveBaseUrl,
  getOrganizationsByEmailAndAutoSelect,
} from "@/utils/auth";

/**
 * DirectPDFDownloadPage Component
 *
 * Silent PDF auto-download - No UI shown, just downloads PDF immediately
 *
 * URL Parameters:
 * - taskId: The task ID to download PDF for
 * - token: (Optional) Authentication token
 * - email: (Optional) User email for auto-organization selection
 * - orgId: (Optional) Organization ID to auto-select
 * - baseUrl: (Optional) Base API URL (e.g., https://ive-api.gophygital.work/pms)
 * - comments: (Optional) Additional comments for PDF
 *
 * Example URL:
 * /direct-pdf-download/46922473?email=user@example.com&orgId=13&token=xxx&baseUrl=https://ive-api.gophygital.work/pms&comments=Task+completed
 */
export const DirectPDFDownloadPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [searchParams] = useSearchParams();
  const hasDownloaded = useRef(false);
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Get URL parameters
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const orgId = searchParams.get("orgId");
  const baseUrl = searchParams.get("baseUrl");
  const comments = searchParams.get("comments") || "";
  const onlyHtml = searchParams.get("onlyHtml") === "true";

  useEffect(() => {
    // Prevent multiple downloads
    if (hasDownloaded.current) return;
    hasDownloaded.current = true;

    const downloadPDF = async () => {
      try {
        // Handle email and organization auto-selection
        if (email && orgId) {
          console.log("📧 Processing email and organization:", {
            email,
            orgId,
          });

          try {
            const { organizations, selectedOrg } =
              await getOrganizationsByEmailAndAutoSelect(email, orgId);

            if (selectedOrg) {
              console.log("✅ Organization auto-selected:", selectedOrg.name);

              // Set baseUrl from organization's domain
              if (selectedOrg.domain || selectedOrg.sub_domain) {
                const orgBaseUrl = `https://${selectedOrg.sub_domain}.${selectedOrg.domain}`;
                saveBaseUrl(orgBaseUrl);
                console.log("✅ Base URL set from organization:", orgBaseUrl);
              }
            } else {
              console.warn("⚠️ Organization not found with ID:", orgId);
            }
          } catch (orgError) {
            console.error("❌ Error fetching organizations:", orgError);
          }
        }

        // Set base URL if provided in URL (overrides organization baseUrl)
        if (baseUrl) {
          saveBaseUrl(baseUrl);
          console.log("✅ Base URL set:", baseUrl);
        }

        // Set token if provided in URL
        if (token) {
          saveToken(token);
          console.log("✅ Token set from URL parameter");
        }

        if (!taskId) {
          console.error("❌ No task ID provided");
          return;
        }

        console.log("📥 Starting silent PDF download for task:", taskId);

        // Fetch task details
        const taskResponse = await taskService.getTaskDetails(taskId);
        console.log("✅ Task details loaded");

        // Fetch job sheet data
        const jobSheetResponse = await taskService.getJobSheet(taskId);
        console.log("✅ Job sheet data loaded");

        if (onlyHtml) {
          // Generate HTML preview
          console.log("🔍 Generating HTML preview");
          const htmlPreviewGenerator = new JobSheetHTMLPreview();
          const htmlContent = htmlPreviewGenerator.generateJobSheetHTML(
            taskResponse,
            jobSheetResponse.data || jobSheetResponse,
            comments
          );
          setHtmlPreview(htmlContent);
          setIsLoading(false);
          console.log("✅ HTML preview generated");
        } else {
          // Generate and download PDF
          const pdfGenerator = new JobSheetPDFGenerator();
          await pdfGenerator.generateJobSheetPDF(
            taskResponse,
            jobSheetResponse.data || jobSheetResponse,
            comments
          );

          console.log("✅ PDF download initiated successfully");

          // Show success message briefly, then close or redirect
          document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif; background: #f0f0f0;">
              <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); text-align: center; max-width: 500px;">
                <svg width="80" height="80" viewBox="0 0 80 80" style="margin-bottom: 20px;">
                  <circle cx="40" cy="40" r="36" fill="#10b981" opacity="0.2"/>
                  <path d="M25 40 L35 50 L55 30" stroke="#10b981" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">PDF Download Started</h2>
                <p style="color: #6b7280; margin: 0; font-size: 16px;">Your job sheet PDF has been generated and should download automatically.</p>
                <p style="color: #9ca3af; margin: 20px 0 0 0; font-size: 14px;">Task ID: ${taskId}</p>
              </div>
            </div>
          `;

          // Optional: Close window after 3 seconds (if opened in new tab)
          setTimeout(() => {
            try {
              window.close();
            } catch (e) {
              console.log(
                "Cannot close window - user may need to close manually"
              );
            }
          }, 3000);
        }
      } catch (error: any) {
        console.error("❌ Error downloading PDF:", error);
        console.error("Error details:", error.message);
        setError(error.message || "Failed to load job sheet");
        setIsLoading(false);
      }
    };

    downloadPDF();
  }, [taskId, token, email, orgId, baseUrl, comments, onlyHtml]);

  // Show HTML preview when onlyHtml is true
  if (onlyHtml) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Generating preview...</p>
            <p className="text-gray-500 text-sm mt-2">Task ID: {taskId}</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Error Loading Preview
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-gray-500 text-sm">Task ID: {taskId}</p>
          </div>
        </div>
      );
    }

    if (htmlPreview) {
      return (
        <div className="w-full w-full h-full min-h-100vh">
          <iframe
            srcDoc={htmlPreview}
            className="w-full h-[100vh]"
            title="Job Sheet Preview"
            style={{ border: "none" }}
          />
        </div>
      );
    }
  }

  // Return null for PDF download mode - no UI needed
  return null;
};
