import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@mui/material";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

const fieldStyles = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "& fieldset": {
      borderColor: "#ddd",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
};

export const AddSupportContactPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillRaw = searchParams.get("prefill");

  const prefillData = useMemo(() => {
    if (!prefillRaw) return null;
    try {
      return JSON.parse(decodeURIComponent(prefillRaw));
    } catch {
      return null;
    }
  }, [prefillRaw]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    call_us: "",
    mail_us: "",
    whatsapp_support: "",
  });
  const [errors, setErrors] = useState({
    call_us: "",
    mail_us: "",
    whatsapp_support: "",
  });

  useEffect(() => {
    if (prefillData) {
      setFormData({
        call_us: prefillData.call_us || "",
        mail_us: prefillData.mail_us || "",
        whatsapp_support: prefillData.whatsapp_support || "",
      });
    }
  }, [prefillData]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePhoneChange = (
    field: "call_us" | "whatsapp_support",
    value: string
  ) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, [field]: digitsOnly }));
    setErrors((prev) => ({
      ...prev,
      [field]:
        digitsOnly.length === 0 || digitsOnly.length === 10
          ? ""
          : "Must be exactly 10 digits",
    }));
  };

  const handleEmailChange = (value: string) => {
    setFormData((prev) => ({ ...prev, mail_us: value }));
    const trimmed = value.trim();
    setErrors((prev) => ({
      ...prev,
      mail_us: trimmed.length === 0 || isValidEmail(trimmed) ? "" : "Invalid email format",
    }));
  };

  const validateForm = () => {
    if (!formData.call_us.trim()) {
      toast.error("Call Us is required");
      return false;
    }
    if (!formData.mail_us.trim()) {
      toast.error("Mail Us is required");
      return false;
    }
    if (!isValidEmail(formData.mail_us.trim())) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (formData.call_us.trim().length !== 10) {
      toast.error("Call Us must be exactly 10 digits");
      return false;
    }
    if (!formData.whatsapp_support.trim()) {
      toast.error("WhatsApp Support is required");
      return false;
    }
    if (formData.whatsapp_support.trim().length !== 10) {
      toast.error("WhatsApp Support must be exactly 10 digits");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        getFullUrl("/pms/admin/support_contacts/upsert"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
          body: JSON.stringify({
            support_contact: {
              call_us: formData.call_us.trim(),
              mail_us: formData.mail_us.trim(),
              whatsapp_support: formData.whatsapp_support.trim(),
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Support contact saved successfully");
      navigate("/pulse/support-contact-setup");
    } catch (error: any) {
      console.error("Failed to save support contact", error);
      toast.error(error.message || "Failed to save support contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <button
            onClick={() => navigate("/pulse/support-contact-setup")}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Support Contact Setup</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Add / Edit</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">SUPPORT CONTACT SETUP</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Contact Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              fullWidth
              label="Call Us"
              required
              value={formData.call_us}
              onChange={(e) => handlePhoneChange("call_us", e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              inputProps={{ inputMode: "numeric", maxLength: 10 }}
              error={!!errors.call_us}
              helperText={errors.call_us}
            />
            <TextField
              fullWidth
              label="Mail Us"
              required
              value={formData.mail_us}
              onChange={(e) => handleEmailChange(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              error={!!errors.mail_us}
              helperText={errors.mail_us}
            />
            <TextField
              fullWidth
              label="WhatsApp Support"
              required
              value={formData.whatsapp_support}
              onChange={(e) => handlePhoneChange("whatsapp_support", e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              inputProps={{ inputMode: "numeric", maxLength: 10 }}
              error={!!errors.whatsapp_support}
              helperText={errors.whatsapp_support}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#C72030] hover:bg-[#A01828] text-white px-8 py-2"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/pulse/support-contact-setup")}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
