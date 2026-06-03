import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type Provider = "google" | "outlook" | "zimbra" | "nextcloud" | null;

interface Props {
  open: boolean;
  onClose: () => void;
  userEmail: string;
  baseUrl: string;
  onConnected: () => void;
}

const PROVIDERS = [
  {
    id: "google" as Provider,
    label: "Google Calendar",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8">
        <path fill="#4285F4" d="M46 24.6c0-1.5-.1-3-.4-4.6H24v8.7h12.4c-.5 2.7-2.1 5-4.5 6.5v5.4h7.3C43.4 36.7 46 31.1 46 24.6z"/>
        <path fill="#34A853" d="M24 47c6.2 0 11.4-2 15.2-5.5l-7.3-5.4c-2.1 1.4-4.7 2.2-7.9 2.2-6 0-11.2-4.1-13-9.6H3.4v5.6C7.2 41.6 15 47 24 47z"/>
        <path fill="#FBBC05" d="M11 28.7c-.5-1.4-.7-2.9-.7-4.7s.3-3.3.7-4.7V13.7H3.4C1.9 16.7 1 20.2 1 24s.9 7.3 2.4 10.3L11 28.7z"/>
        <path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.1 8.6 3.3l6.5-6.5C35.3 2.8 30 .9 24 .9 15 .9 7.2 6.3 3.4 13.7l7.6 5.9c1.8-5.5 7-9.5 13-9.5-.1-.3 0-.6 0-.6z"/>
      </svg>
    ),
    description: "Connect via Google OAuth",
    type: "oauth",
  },
  {
    id: "outlook" as Provider,
    label: "Microsoft Outlook",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8">
        <path fill="#0078D4" d="M48 24c0 13.3-10.7 24-24 24S0 37.3 0 24 10.7 0 24 0s24 10.7 24 24z"/>
        <path fill="white" d="M24 12c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm0 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
        <rect fill="white" x="22" y="18" width="2" height="7"/>
        <rect fill="white" x="22" y="25" width="6" height="2"/>
      </svg>
    ),
    description: "Connect via Microsoft OAuth",
    type: "oauth",
  },
  {
    id: "zimbra" as Provider,
    label: "Zimbra",
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#E51937] flex items-center justify-center text-white font-bold text-sm">Z</div>
    ),
    description: "Connect with email & password",
    type: "form",
  },
  {
    id: "nextcloud" as Provider,
    label: "Nextcloud",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8">
        <circle cx="24" cy="24" r="24" fill="#0082C9"/>
        <path fill="white" d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 16c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
      </svg>
    ),
    description: "Connect with app password",
    type: "form",
  },
];

export function CalendarProviderSelectModal({ open, onClose, userEmail, baseUrl, onConnected }: Props) {
  const [selected, setSelected] = useState<Provider>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    app_password: "",
    server_url: "",
  });

  const reset = () => {
    setSelected(null);
    setLoading(false);
    setFormData({ username: "", password: "", app_password: "", server_url: "" });
  };

  const handleClose = () => { reset(); onClose(); };

  const handleOAuth = (provider: "google" | "outlook") => {
    const urls: Record<string, string> = {
      google:  `${baseUrl}/google_oauth/connect?email=${encodeURIComponent(userEmail)}`,
      outlook: `${baseUrl}/outlook_calendar/connect?email=${encodeURIComponent(userEmail)}`,
    };
    window.open(urls[provider], "_blank");
    toast.info(`Complete the ${provider === "google" ? "Google" : "Microsoft"} sign-in in the new tab, then come back and refresh.`);
    handleClose();
  };

  const handleFormConnect = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      let body: Record<string, string> = { email: userEmail };

      if (selected === "zimbra") {
        if (!formData.username || !formData.password) {
          toast.error("Please enter username and password");
          setLoading(false);
          return;
        }
        endpoint = `${baseUrl}/zimbra_calendar/connect`;
        body = { ...body, username: formData.username, password: formData.password,
                  server_url: formData.server_url || "https://mail.lockated.com" };
      } else if (selected === "nextcloud") {
        if (!formData.username || !formData.app_password) {
          toast.error("Please enter username and app password");
          setLoading(false);
          return;
        }
        endpoint = `${baseUrl}/nextcloud_calendar/connect`;
        body = { ...body, username: formData.username, app_password: formData.app_password };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok && data.connected) {
        toast.success(`${selected === "zimbra" ? "Zimbra" : "Nextcloud"} connected! Syncing events...`);
        const syncEndpoint = selected === "zimbra"
          ? `${baseUrl}/zimbra_calendar/sync?email=${encodeURIComponent(userEmail)}`
          : `${baseUrl}/nextcloud_calendar/sync?email=${encodeURIComponent(userEmail)}`;
        await fetch(syncEndpoint);
        handleClose();
        onConnected();
      } else {
        toast.error(data.error || "Connection failed. Check your credentials.");
      }
    } catch {
      toast.error("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {selected ? `Connect ${PROVIDERS.find(p => p.id === selected)?.label}` : "Connect Calendar"}
          </DialogTitle>
        </DialogHeader>

        {/* Provider Selection */}
        {!selected && (
          <div className="py-2">
            <p className="text-sm text-gray-500 mb-4">
              No calendar connected for <strong>{userEmail}</strong>.<br/>
              Select a provider to get started:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => p.type === "oauth" ? handleOAuth(p.id as "google" | "outlook") : setSelected(p.id)}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-[#C72030] hover:bg-red-50 transition-all cursor-pointer group"
                >
                  {p.icon}
                  <span className="text-sm font-medium text-gray-800 group-hover:text-[#C72030]">{p.label}</span>
                  <span className="text-xs text-gray-400">{p.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Zimbra Form */}
        {selected === "zimbra" && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600">Enter your Zimbra webmail credentials.</p>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Email / Username</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder={userEmail} value={formData.username}
                onChange={e => setFormData(p => ({ ...p, username: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Password</label>
              <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Zimbra password" value={formData.password}
                onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Server URL <span className="text-gray-400">(optional, default: mail.lockated.com)</span>
              </label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="https://mail.lockated.com" value={formData.server_url}
                onChange={e => setFormData(p => ({ ...p, server_url: e.target.value }))} />
            </div>
            <FormActions loading={loading} onBack={() => setSelected(null)} onConnect={handleFormConnect} />
          </div>
        )}

        {/* Nextcloud Form */}
        {selected === "nextcloud" && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600">
              Generate an <strong>App Password</strong> in Nextcloud: <em>Settings → Security → App Passwords</em>
            </p>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Nextcloud Username</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="your.username" value={formData.username}
                onChange={e => setFormData(p => ({ ...p, username: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">App Password</label>
              <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="xxxx-xxxx-xxxx-xxxx" value={formData.app_password}
                onChange={e => setFormData(p => ({ ...p, app_password: e.target.value }))} />
            </div>
            <FormActions loading={loading} onBack={() => setSelected(null)} onConnect={handleFormConnect} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FormActions({ loading, onBack, onConnect }: { loading: boolean; onBack: () => void; onConnect: () => void }) {
  return (
    <div className="flex justify-between pt-2 border-t">
      <button onClick={onBack} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
        ← Back
      </button>
      <button onClick={onConnect} disabled={loading}
        className="px-4 py-2 bg-[#C72030] text-white rounded-md hover:bg-[#a01828] text-sm font-medium disabled:opacity-50">
        {loading ? "Connecting..." : "Connect & Sync"}
      </button>
    </div>
  );
}
