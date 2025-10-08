import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { taskService } from '@/services/taskService';
import { JobSheetPDFGenerator } from '@/components/JobSheetPDFGenerator';
import { saveToken, saveBaseUrl, getOrganizationsByEmailAndAutoSelect } from '@/utils/auth';

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

  // Get URL parameters
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const orgId = searchParams.get('orgId');
  const baseUrl = searchParams.get('baseUrl');
  const comments = searchParams.get('comments') || '';

  useEffect(() => {
    // Prevent multiple downloads
    if (hasDownloaded.current) return;
    hasDownloaded.current = true;

    const downloadPDF = async () => {
      try {
        // Handle email and organization auto-selection
        if (email && orgId) {
          console.log('📧 Processing email and organization:', { email, orgId });
          
          try {
            const { organizations, selectedOrg } = await getOrganizationsByEmailAndAutoSelect(email, orgId);
            
            if (selectedOrg) {
              console.log('✅ Organization auto-selected:', selectedOrg.name);
              
              // Set baseUrl from organization's domain
              if (selectedOrg.domain || selectedOrg.sub_domain) {
                const orgBaseUrl = `https://${selectedOrg.sub_domain}.${selectedOrg.domain}`;
                saveBaseUrl(orgBaseUrl);
                console.log('✅ Base URL set from organization:', orgBaseUrl);
              }
            } else {
              console.warn('⚠️ Organization not found with ID:', orgId);
            }
          } catch (orgError) {
            console.error('❌ Error fetching organizations:', orgError);
          }
        }

        // Set base URL if provided in URL (overrides organization baseUrl)
        if (baseUrl) {
          saveBaseUrl(baseUrl);
          console.log('✅ Base URL set:', baseUrl);
        }

        // Set token if provided in URL
        if (token) {
          saveToken(token);
          console.log('✅ Token set from URL parameter');
        }

        if (!taskId) {
          console.error('❌ No task ID provided');
          return;
        }

        console.log('📥 Starting silent PDF download for task:', taskId);

        // Fetch task details
        const taskResponse = await taskService.getTaskDetails(taskId);
        console.log('✅ Task details loaded');

        // Fetch job sheet data
        const jobSheetResponse = await taskService.getJobSheet(taskId);
        console.log('✅ Job sheet data loaded');

        // Generate and download PDF
        const pdfGenerator = new JobSheetPDFGenerator();
        await pdfGenerator.generateJobSheetPDF(
          taskResponse,
          jobSheetResponse.data || jobSheetResponse,
          comments
        );

        console.log('✅ PDF downloaded successfully');
        
        // Optional: Close window after download (if opened in new tab)
        // setTimeout(() => window.close(), 1000);
        
      } catch (error: any) {
        console.error('❌ Error downloading PDF:', error);
        console.error('Error details:', error.message);
      }
    };

    downloadPDF();
  }, [taskId, token, email, orgId, baseUrl, comments]);

  // Return null - no UI needed
  return null;
};
