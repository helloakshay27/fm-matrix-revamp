import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  fetchLockAccount,
  saveBaseUrl,
  saveToken,
  saveUser,
} from "@/utils/auth";
import {
  appendEmbeddedParams,
  clearEmbeddedMode,
  hasEmbeddedSession,
  initializeEmbeddedNavigation,
  isEmbeddedMode,
} from "@/utils/embeddedMode";
import { initColorPatch } from "@/utils/colorPatch";

/**
 * SIGN-IN HANDOVER — /sso#access_token=…&organization_id=…&to=/accounting/items&embedded=1&backend_url=https://…
 *
 * Business Genie opens Accounting the way it opens Sales CRM and Helpdesk: with the Lockated access token it holds for the
 * person, issued by ANOTHER Lockated. It travels in the address's FRAGMENT, which a browser never sends to a server or in a
 * Referer, and is removed from the address bar at once. The Accounting server checks it with that Lockated and signs the person
 * in (POST /api/users/lockated_sso) — making their organisation there (company, site and books) and their account the first
 * time — and its own token is kept as a password sign-in keeps it. `backend_url` names that server: this app's hostname rules
 * do not know it.
 */
const MISSING = "Open Accounting from Business Genie to sign in.";
const HOME = "/accounting/items";

/** Whether main.tsx loaded the brand theme as the app started (its own rule, read before anything here changes it). */
const THEMED_AT_START =
  ["fm-matrix.lockated.com", "localhost", "club.lockated.com"].includes(window.location.hostname) ||
  isEmbeddedMode() ||
  hasEmbeddedSession();

/** Only a page of this app: a path, never an address elsewhere, and never the sign-in pages themselves. */
function pageOf(to: string | null): string {
  if (!to || !to.startsWith("/") || to.startsWith("//") || /^\/(sso|login|login-page)(\/|$|\?)/.test(to)) return HOME;
  return to;
}

/** Only a Lockated server: https on lockated.com or gophygital.work (or a server on this machine, for local work). */
function serverOf(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    const local = ["localhost", "127.0.0.1"].includes(u.hostname);
    const lockated = u.protocol === "https:" && /(^|\.)(lockated\.com|gophygital\.work)$/i.test(u.hostname);
    return local || lockated ? u.origin : null;
  } catch {
    return null;
  }
}

/** What the address carries after the #. */
function readHandover() {
  const p = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const token = p.get("access_token") ?? "";
  const org = Number(p.get("organization_id"));
  const server = serverOf(p.get("backend_url"));
  return {
    token,
    org,
    server,
    to: pageOf(p.get("to")),
    embedded: p.get("embedded") === "1" || p.get("embedded") === "true",
    ok: !!token && !!server && Number.isInteger(org) && org > 0,
  };
}

interface LockatedSsoPageProps {
  setBaseUrl: (baseUrl: string) => void;
  setToken: (token: string) => void;
}

export const LockatedSsoPage: React.FC<LockatedSsoPageProps> = ({ setBaseUrl, setToken }) => {
  const navigate = useNavigate();
  // Read from the address as the page first draws (a pure read); the effect below is what clears it.
  const [error, setError] = useState<string | null>(() => (readHandover().ok ? null : MISSING));
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // React's development double-run: the first one already cleared the address
    started.current = true;

    const { token, org, server, to, embedded, ok } = readHandover();
    window.history.replaceState(null, "", window.location.pathname);
    if (embedded && !THEMED_AT_START) {
      // Inside Business Genie the brand theme is what colours the buttons; main.tsx only loads it for an address it knows.
      import("../styles/theme.css");
      initColorPatch();
    }
    if (!ok || !server) return; // the message is already showing

    fetch(`${server}/api/users/lockated_sso.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_token: token, organization_id: org }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.access_token) {
          throw new Error(data?.error || `Accounting could not sign you in (${res.status}). Open it again from Business Genie.`);
        }
        return data;
      })
      .then(async (data) => {
        // A fresh session: whatever this browser held for an earlier sign-in goes.
        clearEmbeddedMode();
        localStorage.removeItem("lock_account_id");

        saveBaseUrl(server);
        setBaseUrl(localStorage.getItem("baseUrl") || server);
        saveToken(data.access_token);
        setToken(data.access_token);
        saveUser({
          id: data.id,
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
          mobile: data.mobile,
          latitude: data.latitude,
          longitude: data.longitude,
          country_code: data.country_code,
          user_type: data.user_type || "",
          spree_api_key: data.spree_api_key,
          lock_role: data.lock_role,
          number_verified: data.number_verified,
        });
        localStorage.setItem("userId", data.id?.toString() || "");
        localStorage.setItem("userType", data.user_type?.toString() || "");
        sessionStorage.setItem("userId", data.id?.toString() || "");
        sessionStorage.setItem("userType", data.user_type?.toString() || "");
        if (data.organization_id) localStorage.setItem("org_id", String(data.organization_id));

        if (embedded) {
          sessionStorage.setItem("embedded_mode", "true");
          sessionStorage.setItem("embedded_token", data.access_token);
          initializeEmbeddedNavigation();
        }

        // The organisation's books, as a password sign-in finds them.
        await fetchLockAccount();
        navigate(embedded ? appendEmbeddedParams(to) : to, { replace: true });
      })
      .catch((e: unknown) =>
        setError(e instanceof Error && e.message ? e.message : "Accounting could not sign you in. Open it again from Business Genie.")
      );
  }, [navigate, setBaseUrl, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      {error ? (
        <div className="max-w-md flex flex-col items-start gap-3" role="alert">
          <AlertCircle className="text-[#B3261E]" size={22} />
          <h1 className="text-xl font-semibold text-gray-900">Accounting didn't open</h1>
          <p className="text-sm text-gray-600">{error}</p>
          {error !== MISSING && (
            <p className="text-sm text-gray-600">If this keeps happening, ask your Business Genie administrator.</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 text-gray-600" role="status">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm">Signing you in to Accounting…</span>
        </div>
      )}
    </div>
  );
};

export default LockatedSsoPage;
