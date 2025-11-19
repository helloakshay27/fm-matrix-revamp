import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { taskService } from '@/services/taskService';
import { JobSheetPDFGenerator } from '@/components/JobSheetPDFGenerator';
import { saveToken, saveBaseUrl, getOrganizationsByEmailAndAutoSelect } from '@/utils/auth';

/**
 * DirectPDFDownloadAPIPage Component
 * 
 * Enhanced PDF download page that works with mobile apps and API calls
 * Forces browser download dialog to appear
 * 
 * URL Parameters:
 * - taskId: The task ID to download PDF for
 * - token: (Optional) Authentication token
 * - email: (Optional) User email for auto-organization selection
 * - orgId: (Optional) Organization ID to auto-select
 * - baseUrl: (Optional) Base API URL
 * - comments: (Optional) Additional comments for PDF
 * - format: (Optional) 'blob' to get PDF as blob URL, default triggers download
 * 
 * Example URLs:
 * /api/pdf-download/46922473?email=user@example.com&orgId=13&token=xxx
 * /api/pdf-download/46922473?email=user@example.com&orgId=13&token=xxx&format=blob
 */
export const DirectPDFDownloadAPIPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Preparing PDF download...');
  const [progress, setProgress] = useState(0);

  // Get URL parameters
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const orgId = searchParams.get('orgId');
  const baseUrl = searchParams.get('baseUrl');
  const comments = searchParams.get('comments') || '';
  const format = searchParams.get('format') || 'download'; // 'download' or 'blob'

  // Detect if running in mobile webview
  const isMobileWebView = () => {
    const ua = navigator.userAgent.toLowerCase();
    return (
      ua.includes('wv') || // Android WebView
      ua.includes('webview') ||
      (ua.includes('android') && !ua.includes('chrome')) || // Android WebView without Chrome
      (window as any).ReactNativeWebView !== undefined || // React Native WebView
      (window as any).flutter_inappwebview !== undefined // Flutter WebView
    );
  }

  useEffect(() => {
    // Prevent multiple downloads
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processPDF = async () => {
      try {
        setProgress(10);
        setMessage('Authenticating...');

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

        setProgress(30);
        setMessage('Loading task details...');

        if (!taskId) {
          throw new Error('No task ID provided');
        }

        console.log('📥 Starting PDF generation for task:', taskId);

        // Fetch task details
        const taskResponse = await taskService.getTaskDetails(taskId);
        console.log('✅ Task details loaded');
        
        setProgress(50);
        setMessage('Loading job sheet data...');

        // Fetch job sheet data
        const jobSheetResponse = await taskService.getJobSheet(taskId);
        console.log('✅ Job sheet data loaded');

        setProgress(70);
        setMessage('Generating PDF...');

        // Generate PDF
        const pdfGenerator = new JobSheetPDFGenerator();
        
        // Generate PDF - this saves the file automatically
        await pdfGenerator.generateJobSheetPDF(
          taskResponse,
          jobSheetResponse.data || jobSheetResponse,
          comments
        );

        setProgress(100);
        setMessage('PDF download started successfully!');
        setStatus('success');
        
        console.log('✅ PDF generation completed');
        
        // For mobile webview, show success message longer
        const isWebView = isMobileWebView();
        const autoCloseDelay = isWebView ? 8000 : 4000; // 8s for mobile, 4s for browser
        
        console.log('🔍 Environment:', isWebView ? 'Mobile WebView' : 'Browser');
        console.log(`⏱️ Auto-close in ${autoCloseDelay / 1000} seconds`);
        
        // Auto-close after delay
        setTimeout(() => {
          try {
            window.close();
          } catch (e) {
            console.log('Cannot auto-close window');
          }
        }, autoCloseDelay);
        
      } catch (error: any) {
        console.error('❌ Error processing PDF:', error);
        setStatus('error');
        setMessage(`Error: ${error.message || 'Failed to generate PDF'}`);
      }
    };

    processPDF();
  }, [taskId, token, email, orgId, baseUrl, comments, format]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Status Icon */}
        {status === 'loading' && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto',
              border: '6px solid #f3f4f6',
              borderTop: '6px solid #C72030',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {status === 'success' && (
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginBottom: '24px' }}>
            <circle cx="40" cy="40" r="36" fill="#10b981" opacity="0.2"/>
            <path d="M25 40 L35 50 L55 30" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}

        {status === 'error' && (
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginBottom: '24px' }}>
            <circle cx="40" cy="40" r="36" fill="#ef4444" opacity="0.2"/>
            <path d="M30 30 L50 50 M50 30 L30 50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        )}

        {/* Title */}
        <h2 style={{
          color: '#1f2937',
          margin: '0 0 12px 0',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          {status === 'loading' && 'Processing PDF'}
          {status === 'success' && 'Download Started'}
          {status === 'error' && 'Download Failed'}
        </h2>

        {/* Message */}
        <p style={{
          color: '#6b7280',
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        {/* Progress Bar */}
        {status === 'loading' && (
          <div style={{
            width: '100%',
            height: '8px',
            background: '#f3f4f6',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #C72030, #A01828)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        )}

        {/* Task Info */}
        <div style={{
          background: '#f9fafb',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{
            color: '#9ca3af',
            margin: '0',
            fontSize: '14px'
          }}>
            <strong style={{ color: '#6b7280' }}>Task ID:</strong> {taskId}
          </p>
          {status === 'success' && (
            <p style={{
              color: '#9ca3af',
              margin: '8px 0 0 0',
              fontSize: '12px',
              fontStyle: 'italic'
            }}>
              {isMobileWebView() ? 
                'Check your downloads folder. This window will close automatically...' :
                'This window will close automatically in a few seconds...'
              }
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {status === 'error' && (
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              background: '#C72030',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#A01828'}
            onMouseOut={(e) => e.currentTarget.style.background = '#C72030'}
          >
            Try Again
          </button>
        )}

        {status === 'success' && (
          <button
            onClick={() => window.close()}
            style={{
              marginTop: '20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
          >
            Close Window
          </button>
        )}
      </div>

      {/* Powered By */}
      <div style={{
        marginTop: '24px',
        color: 'white',
        fontSize: '14px',
        opacity: 0.9
      }}>
        Powered by <strong>FMMatrix</strong>
      </div>
    </div>
  );
};
