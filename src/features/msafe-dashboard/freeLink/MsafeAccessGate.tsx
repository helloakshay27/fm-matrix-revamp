import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { EXTERNAL_ORG_ID, ExternalAuthError } from './externalAuthService';
import { endFreeLink, refreshFreeLinkIfDue, startFreeLink, useFreeLinkStore } from './freeLinkStore';

function StatusScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">{children}</div>
    </div>
  );
}

function ErrorScreen({ error, onRetry }: { error: ExternalAuthError; onRetry?: () => void }) {
  return (
    <StatusScreen>
      <AlertTriangle className="h-10 w-10 text-brand-error" />
      <p role="alert" className="text-gray-700">
        {error.message}
      </p>
      {onRetry && (
        <Button className="bg-brand text-white hover:bg-brand-hover" onClick={onRetry}>
          Try again
        </Button>
      )}
    </StatusScreen>
  );
}

function FreeLinkGate({ orgId, children }: { orgId: string; children: React.ReactNode }) {
  const { orgId: activeOrgId, status, error } = useFreeLinkStore();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  // A token in the URL is never used here, so remove it from the address bar and history.
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (!params.has('access_token') && !params.has('token')) return;
    params.delete('access_token');
    params.delete('token');
    navigate({ pathname, search: params.toString(), hash }, { replace: true });
  }, [pathname, search, hash, navigate]);

  useEffect(() => {
    startFreeLink(orgId);
    return endFreeLink;
  }, [orgId]);

  // Timers can stall while the device sleeps, so check again when the page comes back.
  useEffect(() => {
    const check = () => {
      if (document.visibilityState === 'visible') refreshFreeLinkIfDue();
    };
    document.addEventListener('visibilitychange', check);
    window.addEventListener('online', check);
    return () => {
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('online', check);
    };
  }, []);

  if (activeOrgId === orgId && status === 'error' && error) {
    const canRetry = error.code !== 'INVALID_ORG';
    return <ErrorScreen error={error} onRetry={canRetry ? () => startFreeLink(orgId) : undefined} />;
  }

  // The dashboard is not mounted until the token exists, so no API call can run early.
  if (activeOrgId !== orgId || status !== 'ready') {
    return (
      <StatusScreen>
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <p className="text-gray-600">Loading dashboard...</p>
      </StatusScreen>
    );
  }

  return <>{children}</>;
}

/**
 * Route guard for the M-Safe, Vi Audit, Vi Incident and Vi Inspection dashboards.
 * - With `org_id`: always signs in through external login. A saved login or a token in the
 *   URL is ignored.
 * - Without `org_id`: ProtectedRoute, or no guard when `requireLogin` is false — in both
 *   cases the same as the route had before. If the saved login then gets a 401, `org_id` is
 *   added to the URL, which switches to external login without a page reload.
 */
export function MsafeAccessGate({
  children,
  requireLogin = true,
}: {
  children: React.ReactNode;
  requireLogin?: boolean;
}) {
  const { pathname, search, hash } = useLocation();
  const rejectedToken = useFreeLinkStore((s) => s.rejectedToken);
  const params = new URLSearchParams(search);
  const rawOrgId = params.get('org_id');

  if (rawOrgId === null) {
    // Matched against the current token, so a later fresh login is not affected.
    if (rejectedToken && rejectedToken === localStorage.getItem('token')) {
      params.set('org_id', EXTERNAL_ORG_ID);
      return <Navigate replace to={{ pathname, search: params.toString(), hash }} />;
    }
    return requireLogin ? <ProtectedRoute>{children}</ProtectedRoute> : <>{children}</>;
  }

  const orgId = rawOrgId.trim();
  if (!orgId) return <ErrorScreen error={new ExternalAuthError('MISSING_ORG_ID')} />;
  if (!/^\d+$/.test(orgId)) return <ErrorScreen error={new ExternalAuthError('INVALID_ORG')} />;

  return <FreeLinkGate orgId={orgId}>{children}</FreeLinkGate>;
}
