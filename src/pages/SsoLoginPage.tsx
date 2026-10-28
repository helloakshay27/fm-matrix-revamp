import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  clearAuth,
  fetchLockAccount,
  saveBaseUrl,
  saveToken,
  saveUser,
} from "@/utils/auth";

const DEFAULT_REDIRECT = "/maintenance/asset";

/**
 * Hand-off login from Hi-Society ("Switch to FM Matrix").
 *
 * Hi-Society redirects to /sso-login#token=...&baseUrl=...&org_id=...&user=...
 * The data is in the URL hash so it is never sent to the server or written to
 * access logs. We store it exactly like a normal login and then hard-reload
 * into the app so App state (token/baseUrl) is re-read from localStorage.
 */
export const SsoLoginPage = () => {
  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const token = params.get("token");
      const baseUrl = params.get("baseUrl");
      const orgId = params.get("org_id");
      const orgName = params.get("org_name");
      const redirect = params.get("redirect");

      // Drop the token from the address bar / history right away
      window.history.replaceState(null, "", window.location.pathname);

      if (!token || !baseUrl) {
        window.location.replace("/login");
        return;
      }

      let user: Record<string, unknown> | null = null;
      try {
        user = JSON.parse(params.get("user") || "null");
      } catch {
        user = null;
      }

      // Start from a clean session so a previous FM user's data doesn't leak in
      clearAuth();

      saveToken(token);
      saveBaseUrl(baseUrl);
      sessionStorage.setItem("baseUrl", baseUrl);
      if (orgId) {
        localStorage.setItem("org_id", orgId);
        sessionStorage.setItem("org_id", orgId);
      }
      if (orgName) {
        localStorage.setItem("selectedOrg", orgName);
        sessionStorage.setItem("selectedOrg", orgName);
      }
      if (user) {
        saveUser(user as Parameters<typeof saveUser>[0]);
        localStorage.setItem("userId", String(user.id ?? ""));
        localStorage.setItem("userType", String(user.user_type ?? ""));
        sessionStorage.setItem("userId", String(user.id ?? ""));
        sessionStorage.setItem("userType", String(user.user_type ?? ""));
      }

      await fetchLockAccount();

      // Only allow same-origin relative paths (no open redirect)
      const target =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : DEFAULT_REDIRECT;
      window.location.replace(target);
    };

    void run();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center gap-2 text-sm text-gray-600">
      <Loader2 className="h-5 w-5 animate-spin" />
      Signing you in to FM Matrix...
    </div>
  );
};
