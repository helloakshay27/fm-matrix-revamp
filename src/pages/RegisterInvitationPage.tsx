import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import "./BusinessCompass/BusinessCompass.css";

const COMPLETE_REGISTRATION_URL =
  "https://fm-uat-api.lockated.com/business_compass/complete_registration";

const getRegistrationErrorMessage = (data: any) => {
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join(", ");
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error;
  }

  return "Failed to complete registration. Please try again.";
};

export const RegisterInvitationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const invitationToken = useMemo(() => {
    return new URLSearchParams(location.search).get("token") || "";
  }, [location.search]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (value: string) => value.trim().length >= 8;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!invitationToken) {
      toast.error("The invitation token is missing from this link.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your first and last name.");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Please make sure both passwords are the same.");
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationUrl = `${COMPLETE_REGISTRATION_URL}?token=${encodeURIComponent(
        invitationToken
      )}`;

      const response = await fetch(registrationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: invitationToken,
          invitation_token: invitationToken,
          firstname: firstName.trim(),
          lastname: lastName.trim(),
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        throw new Error(getRegistrationErrorMessage(data));
      }

      toast.success(data?.message || "Your Business Compass account is ready.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to complete registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#2C2C2C] text-[#1f2933]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(218,119,86,0.28),transparent_30%),radial-gradient(circle_at_76%_68%,rgba(158,200,186,0.24),transparent_32%)]" />
      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px]">
        <section className="relative hidden overflow-hidden lg:block">
          <div className="relative flex h-full flex-col justify-between px-14 py-12">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DA7756]">
                <Building2 size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#EDC488]">
                  Business Compass
                </p>
                <h1 className="text-2xl font-bold !text-white">
                  Team onboarding
                </h1>
              </div>
            </div>

            <div className="max-w-xl">
              <h2
                className="mb-5 text-5xl font-bold leading-tight"
                style={{
                  color: "#F08A67",
                  textShadow: "0 2px 12px rgba(0, 0, 0, 0.28)",
                }}
              >
                Set up your Business Compass account
              </h2>
              <div
                className="font-semibold leading-8"
                style={{
                  color: "#F8FAFC",
                  fontSize: "18px",
                  textShadow: "0 1px 3px rgba(255, 255, 255, 0.12)",
                  WebkitTextFillColor: "#F8FAFC",
                }}
              >
                Create your profile, protect your access, and join your
                organization workspace from the invitation shared by your admin.
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {["Plan", "Report", "Grow"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-lg"
                >
                  <CheckCircle2 className="mb-3 text-[#9EC8BA]" size={22} />
                  <p className="text-sm font-semibold !text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
          <div className="relative w-full max-w-md">
            <div className="mb-7 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DA7756] text-white">
                <Building2 size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-[#DA7756]">
                  Business Compass
                </p>
                <p className="text-lg font-bold !text-white">
                  Team onboarding
                </p>
              </div>
            </div>

            <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6F4EE] text-[#DA7756]">
                  <LockKeyhole size={26} />
                </div>
                <h1 className="text-2xl font-bold text-[#2C2C2C]">
                  Complete Your Registration
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Set up your Business Compass account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="First Name"
                    className="h-12 rounded-lg border-[#D5DBDB] bg-[#F8FAFC] px-4 text-sm focus-visible:border-[#DA7756]"
                    autoComplete="given-name"
                  />
                  <Input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Last Name"
                    className="h-12 rounded-lg border-[#D5DBDB] bg-[#F8FAFC] px-4 text-sm focus-visible:border-[#DA7756]"
                    autoComplete="family-name"
                  />
                </div>

                <div className="relative">
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-12 rounded-lg border-[#D5DBDB] bg-[#F8FAFC] px-4 pr-11 text-sm focus-visible:border-[#DA7756]"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-[#2C2C2C]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="h-12 rounded-lg border-[#D5DBDB] bg-[#F8FAFC] px-4 pr-11 text-sm focus-visible:border-[#DA7756]"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-[#2C2C2C]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#DA7756] px-5 text-sm font-semibold text-white shadow-md shadow-[#DA7756]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C9684B] hover:shadow-lg hover:shadow-[#DA7756]/30 focus:outline-none focus:ring-2 focus:ring-[#DA7756]/35 focus:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Completing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Complete Registration
                      <ArrowRight size={17} />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegisterInvitationPage;
