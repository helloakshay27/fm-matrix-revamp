import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AllContent = React.lazy(() => import('@/components/fm-pdf/AllContent'));
const WeeklyReport = React.lazy(() => import('@/components/WeeklyReport'));
const DailyReport = React.lazy(() => import('@/components/DailyReport'));

type ReportType = 'monthly' | 'weekly' | 'daily';

const READY_TITLE = 'PDF_EXPORT_READY';
const ERROR_TITLE = 'PDF_EXPORT_ERROR';
const READY_TIMEOUT_MS = 60000;

/**
 * Headless-render bridge for server-triggered "generate PDF + email it" flows.
 *
 * This page is NOT linked from the app UI. It exists to be opened by a
 * server-side headless browser (e.g. a Rails job driving Puppeteer/Grover),
 * never by a real user's browser tab — it overwrites the `token`/`baseUrl`
 * localStorage keys the underlying report components read from, which would
 * silently swap a real logged-in user's session if opened interactively.
 * As a defense-in-depth check (not the primary control — the primary control
 * is a short-lived, single-purpose token validated by the API on every
 * request), it refuses to run unless `navigator.webdriver` is true, which is
 * how automated browsers (Puppeteer/Playwright/Grover) identify themselves.
 *
 * URL contract:
 *   /reports/pdf-render?report_type=monthly&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&token=...&base_url=...&selected_company=...
 *   /reports/pdf-render?report_type=weekly&token=...&base_url=...&site_id=...&site_name=...
 *   /reports/pdf-render?report_type=daily&token=...&base_url=...
 *
 * `site_id` is REQUIRED for report_type=weekly — WeeklyReport scopes every
 * single data fetch by `selectedSiteId` from localStorage; without it the
 * API call omits site_id entirely and returns whatever the backend defaults
 * to, which is NOT the same report a logged-in user sees for their site.
 * `selected_company`/`site_name` are optional but affect on-page display
 * text (company name on the monthly cover page, site name labels on the
 * weekly report) — pass them so the export visually matches what a real
 * user sees instead of showing blank/placeholder text.
 *
 * Readiness contract (what the calling automation should wait for):
 *   page.waitForFunction(
 *     () => document.title === 'PDF_EXPORT_READY' || document.title === 'PDF_EXPORT_ERROR',
 *     { timeout: 90000 }
 *   )
 *   Then check document.title — on PDF_EXPORT_ERROR, read #pdf-export-error-message
 *   for details instead of generating a PDF.
 */
const ReportPdfRenderPage: React.FC = () => {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const reportType = ((params.get('report_type') || 'monthly').toLowerCase()) as ReportType;
  const token = params.get('token');
  const baseUrl = params.get('base_url');
  const selectedCompany = params.get('selected_company');
  const siteId = params.get('site_id');
  const siteName = params.get('site_name');

  const [error, setError] = useState<string>('');
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    // The navigator.webdriver guard only applies to production builds — in
    // `npm run dev` (import.meta.env.DEV) it's skipped so this page can be
    // opened directly in a normal browser tab for quick visual checks.
    if (!import.meta.env.DEV && typeof navigator !== 'undefined' && !navigator.webdriver) {
      setError('This page is only accessible via automated report generation.');
      return;
    }
    if (!token || !baseUrl) {
      setError('Missing required "token" and/or "base_url" query params.');
      return;
    }
    if (reportType === 'weekly' && !siteId) {
      setError('Missing required "site_id" query param for report_type=weekly.');
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('baseUrl', baseUrl);
    if (selectedCompany) localStorage.setItem('selectedCompany', selectedCompany);
    if (siteId) {
      localStorage.setItem('selectedSiteId', siteId);
      if (siteName) {
        localStorage.setItem('selectedSiteName', siteName);
        localStorage.setItem('selectedSite', siteName);
        localStorage.setItem('site_name', siteName);
      }
    }
    setSeeded(true);
  }, [token, baseUrl, selectedCompany, siteId, siteName, reportType]);

  useEffect(() => {
    if (error) document.title = ERROR_TITLE;
  }, [error]);

  // AllContent, WeeklyReport, and DailyReport all render a hidden
  // `[data-component][data-loading]` marker once ready (data-loading="false")
  // — reuse that instead of duplicating each report's loading logic here.
  useEffect(() => {
    if (!seeded || error) return;

    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        observer.disconnect();
        setError('Timed out waiting for report data to finish loading.');
      }
    }, READY_TIMEOUT_MS);

    const check = () => {
      const marker = document.querySelector('[data-component][data-loading]');
      if (marker?.getAttribute('data-loading') === 'false') {
        settled = true;
        clearTimeout(timeout);
        observer.disconnect();
        document.title = READY_TITLE;
      }
    };

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    check();

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [seeded, error, reportType]);

  if (error) {
    return (
      <div id="pdf-export-error-message" style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <h1>PDF export failed</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!seeded) return null;

  return (
    <React.Suspense fallback={null}>
      {reportType === 'weekly' && <WeeklyReport />}
      {reportType === 'daily' && <DailyReport />}
      {reportType === 'monthly' && <AllContent />}
    </React.Suspense>
  );
};

export default ReportPdfRenderPage;
