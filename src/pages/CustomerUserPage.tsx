import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GoPhygitalLogo } from "@/components/GoPhygitalLogo";
import loginBg from "@/assets/banner_logo/login_bg.png";
import { clearAuth, getUser, isCustomerUser, logoutUser } from "@/utils/auth";

// Customer portal host. Override per environment with VITE_CUSTOMER_PORTAL_URL.
const CUSTOMER_PORTAL_HOST: string = (
  (import.meta as any).env?.VITE_CUSTOMER_PORTAL_URL || "customer.lockated.com"
)
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");
const CUSTOMER_PORTAL_URL = `https://${CUSTOMER_PORTAL_HOST}`;

const ADMIN_PORTAL_NAME = "Panchshil Admin Portal";

const CustomerUserPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [loggingOut, setLoggingOut] = useState(false);

  // Page is only for customer users; send everyone else to the app home
  if (!isCustomerUser()) {
    return <Navigate to="/" replace />;
  }

  const firstName = user?.firstname?.trim() || "there";
  const adminHost = window.location.hostname;

  const copyLink = async (message: string) => {
    try {
      await navigator.clipboard.writeText(CUSTOMER_PORTAL_URL);
      toast.success(message);
    } catch {
      toast.error("Couldn't copy the link. Please copy it manually.");
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutUser();
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left - background image (same as login) */}
      <div className="relative hidden flex-1 md:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${loginBg}')` }}
        />
      </div>

      {/* Right - redirect panel */}
      <div className="w-full md:max-w-lg flex flex-col justify-center px-4 py-10 sm:px-12">
        <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
          <GoPhygitalLogo width={180} />
          <p className="mt-2 text-sm font-medium text-gray-600">
            {ADMIN_PORTAL_NAME}
          </p>

          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-light px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Customer Portal Redirect
          </span>

          <h1 className="mt-5 text-2xl sm:text-[26px] font-bold leading-snug text-[var(--color-text)]">
            Hi {firstName}, you're on the Admin Portal
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-light)]">
            You've reached the {ADMIN_PORTAL_NAME} (
            <span className="font-medium text-[var(--color-text)]">
              {adminHost}
            </span>
            ). To access your customer dashboard, please sign in using the
            dedicated Customer Portal link below.
          </p>

          <div className="mt-6 w-full text-left">
            <label className="mb-2 block text-xs font-medium text-[var(--color-text)]">
              Customer Portal Address
            </label>
            <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5">
                <Link2 className="h-4 w-4 shrink-0 text-brand" />
                <span className="truncate text-sm font-medium text-[var(--color-text)]">
                  {CUSTOMER_PORTAL_HOST}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyLink("Customer portal link copied")}
                className="flex items-center gap-1.5 border-l border-gray-200 bg-white px-4 text-sm font-medium text-brand hover:bg-brand-selected"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
          </div>

          <Button
            asChild
            className="mt-5 h-11 w-full rounded-full bg-brand text-white hover:bg-brand-hover"
          >
            <a
              href={CUSTOMER_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Customer Portal
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              copyLink("Link copied — press Ctrl+D (⌘+D on Mac) to bookmark it")
            }
            className="mt-3 h-11 w-full rounded-full border border-gray-300 bg-white text-[var(--color-text)] hover:bg-gray-50"
          >
            <Bookmark className="mr-2 h-4 w-4" />
            Copy &amp; Bookmark Link
          </Button>

          {/* Logout section */}
          <div className="mt-8 flex w-full items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-light)]">
              or
            </span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="mt-4 text-sm text-[var(--color-text-light)]">
            Not a customer? Log out and sign in with your admin credentials.
          </p>

          <Button
            type="button"
            variant="ghost"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-busy={loggingOut}
            className="group mt-3 h-11 w-full rounded-full border border-gray-300 bg-white font-medium text-brand-error hover:border-brand-error hover:bg-brand-error-bg hover:text-brand-error disabled:opacity-70"
          >
            {loggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Log out
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerUserPage;
