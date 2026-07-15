import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, type LockatedOrg } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { setToken } from "@/api/client";
import Spinner from "@/components/common/Spinner";

type Step = "email" | "auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgs, setOrgs] = useState<LockatedOrg[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setFetching(true);
    try {
      const fetchedOrgs = await authApi.getLockatedOrganizations(email.trim());
      setOrgs(fetchedOrgs);
      setSelectedOrgId(fetchedOrgs.length === 1 ? fetchedOrgs[0].id : null);
    } catch {
      setOrgs([]);
      setSelectedOrgId(null);
    } finally {
      setFetching(false);
      setStep("auth");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    if (orgs.length > 1 && !selectedOrgId) return;
    setError("");
    setLoading(true);
    try {
      let res: any;
      const selectedOrg = orgs.find((o) => o.id === selectedOrgId);

      if (selectedOrg) {
        res = await authApi.lockatedLogin({
          email: email.trim(),
          password,
          organization_id: selectedOrg.id,
          backend_url: selectedOrg.backend_url,
          org_name: selectedOrg.name,
        });
      } else {
        res = await authApi.login(email.trim(), password);
      }

      const token = res.token ?? "";
      setToken(token);
      login(
        {
          id: res.data.id,
          email: res.data.email,
          name: res.data.name ?? "",
          role: res.data.role ?? null,
          organizationId: res.data.organization_id ?? null,
          lockatedAccessToken: res.access_token ?? null,
        },
        token
      );
      navigate("/");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown } };
      const raw = axiosErr?.response?.data;
      const msg =
        typeof raw === "string"
          ? raw
          : typeof raw === "object" && raw !== null
            ? ((raw as Record<string, unknown>).error as string) ||
              "Invalid email or password."
            : "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className="font-display text-3xl"
              style={{ color: "var(--coral)" }}
            >
              go
            </span>
            <span
              className="font-body text-2xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              Helpdesk
            </span>
          </div>
          <p className="text-small" style={{ color: "var(--text-muted)" }}>
            Sign in to your workspace
          </p>
        </div>

        <div className="card p-8">
          {/* Step 1 — Email */}
          {step === "email" && (
            <form
              onSubmit={handleEmailContinue}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="form-label">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="form-input"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div
                  className="rounded-lg px-3 py-2 text-xs"
                  style={{
                    backgroundColor: "var(--crimson-10)",
                    color: "var(--crimson)",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={fetching}
                className="btn-primary mt-1 w-full justify-center"
              >
                {fetching && <Spinner className="h-4 w-4" />}
                Continue
              </button>
            </form>
          )}

          {/* Step 2 — Org picker + password */}
          {step === "auth" && (
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              {/* Email display with back link */}
              <div
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <span style={{ color: "var(--text)" }}>{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError("");
                    setPassword("");
                  }}
                  className="text-xs font-medium"
                  style={{ color: "var(--coral)" }}
                >
                  Change
                </button>
              </div>

              {/* Organisation selector — shown only when multiple orgs */}
              {orgs.length > 1 && (
                <div>
                  <label className="form-label">Organisation</label>
                  <select
                    value={selectedOrgId ?? ""}
                    onChange={(e) => setSelectedOrgId(Number(e.target.value))}
                    className="form-input"
                    required
                  >
                    <option value="" disabled>
                      Select an organisation…
                    </option>
                    {orgs.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Single org badge */}
              {orgs.length === 1 && (
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                  style={{
                    backgroundColor: "var(--violet-10)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <svg
                    className="h-3.5 w-3.5 flex-shrink-0"
                    style={{ color: "var(--violet)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span
                    style={{ color: "var(--violet)" }}
                    className="font-medium"
                  >
                    {orgs[0].name}
                  </span>
                </div>
              )}

              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="form-input"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div
                  className="rounded-lg px-3 py-2 text-xs"
                  style={{
                    backgroundColor: "var(--crimson-10)",
                    color: "var(--crimson)",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (orgs.length > 1 && !selectedOrgId)}
                className="btn-primary mt-1 w-full justify-center"
              >
                {loading && <Spinner className="h-4 w-4" />}
                Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
