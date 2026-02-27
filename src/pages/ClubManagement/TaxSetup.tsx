
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, FileCog, NotepadText } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";
import { API_CONFIG } from '@/config/apiConfig';
import axios from 'axios';

// Custom theme for MUI components
const muiTheme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
      defaultProps: {
        shrink: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiSelect-select": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
    },
  },
});

interface GstForm {
  gstin: string;
  compositionScheme: boolean;
  reverseCharge: boolean;
  overseasTrading: boolean;
  digitalServices: boolean;
  gstRegisteredOn: string;
  gstinUsername: string;
  reportingPeriod: string;
  generateFirstTaxReturnFrom: string;
}

const defaultForm: GstForm = {
  gstin: "",
  compositionScheme: false,
  reverseCharge: false,
  overseasTrading: false,
  digitalServices: false,
  gstRegisteredOn: "",
  gstinUsername: "",
  reportingPeriod: "",
  generateFirstTaxReturnFrom: "",
};

const TaxSetup: React.FC = () => {
  const [form, setForm] = useState<GstForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Fetch existing GST settings on mount ──────────────────────────────────
  useEffect(() => {
    const fetchGstSettings = async () => {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      if (!baseUrl) {
        toast.error("Base URL is not configured.");
        setLoading(false);
        return;
      }
      try {
        const url = `${baseUrl}/lock_accounts/1/gst_settings.json`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = response.data?.gst_setting || response.data || {};

        // Map API fields → local form state
        setForm({
          gstin: data.gstin ?? "",
          compositionScheme: !!data.composition_scheme,
          reverseCharge: !!data.reverse_charge,
          overseasTrading: !!data.overseas_trading,
          digitalServices: !!data.digi_service,
          gstRegisteredOn: data.gst_regi_on ? data.gst_regi_on.split("T")[0] : "",
          gstinUsername: data.gstin_uname ?? "",
          reportingPeriod: data.reporting_period ?? "",
          generateFirstTaxReturnFrom: data.first_return ? data.first_return.split("T")[0] : "",
        });
      } catch (error: any) {
        console.error("Error fetching GST settings:", error);
        // If 404 or empty, just use defaults (first-time setup)
        if (error?.response?.status !== 404) {
          toast.error("Failed to load GST settings.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGstSettings();
  }, []);

  // ── Text / Select field change handler ────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Submit: PATCH /lock_accounts/1/gst_settings.json ─────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;

    if (!baseUrl) {
      toast.error("Base URL is not configured.");
      return;
    }

    // Build request payload matching API shape
    const payload = {
      gst_setting: {
        gstin: form.gstin,
        composition_scheme: form.compositionScheme,
        reverse_charge: form.reverseCharge,
        overseas_trading: form.overseasTrading,
        digi_service: form.digitalServices,
        gst_regi_on: form.gstRegisteredOn || null,
        gstin_uname: form.gstinUsername,
        reporting_period: form.reportingPeriod,
        first_return: form.generateFirstTaxReturnFrom || null,
      },
    };

    setSaving(true);
    try {
      const url = `${baseUrl}/lock_accounts/1/gst_settings.json`;
      await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      toast.success("GST settings saved successfully!");
    } catch (error: any) {
      console.error("Error saving GST settings:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to save GST settings.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <CircularProgress style={{ color: "#C72030" }} />
      </div>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <form
        className="w-full bg-white p-6"
        style={{ minHeight: "100vh", boxSizing: "border-box" }}
        onSubmit={handleSubmit}
      >
        {/* ── GST Info Section ──────────────────────────────────────────── */}
        <div className="bg-white rounded-lg border-2 p-6 space-y-6 col-span-2 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">GST Info</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
            <div>
              <TextField
                label={
                  <span>
                    GSTIN <span className="text-red-600">*</span>{" "}
                    <span className="text-xs text-gray-500">(Maximum 15 digits)</span>
                  </span>
                }
                size="small"
                variant="outlined"
                name="gstin"
                value={form.gstin}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter GSTIN"
                inputProps={{ maxLength: 15 }}
              />
            </div>
            <div>
              <TextField
                label={
                  <span>
                    GST Registered On <span className="text-red-600">*</span>
                  </span>
                }
                size="small"
                variant="outlined"
                name="gstRegisteredOn"
                type="date"
                value={form.gstRegisteredOn}
                onChange={handleChange}
                className="w-full"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </div>
        </div>

        {/* ── GST Options Section ───────────────────────────────────────── */}
        <div className="bg-white rounded-lg border-2 p-6 space-y-6 col-span-2 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <FileCog className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">GST Options</h3>
          </div>
          <div className="flex flex-col gap-4">
            {/* Composition Scheme */}
            <div>
              <div className="block text-sm font-semibold text-gray-700 mb-1">Composition Scheme</div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compositionScheme"
                  checked={form.compositionScheme}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, compositionScheme: !!checked }))
                  }
                />
                <label htmlFor="compositionScheme" className="text-sm">
                  My business is registered for Composition Scheme.
                </label>
              </div>
            </div>

            {/* Reverse Charge */}
            <div>
              <div className="block text-sm font-semibold text-gray-700 mb-1">Reverse Charge</div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reverseCharge"
                  checked={form.reverseCharge}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, reverseCharge: !!checked }))
                  }
                />
                <label htmlFor="reverseCharge" className="text-sm">
                  Enable Reverse Charge in Sales transactions
                </label>
              </div>
            </div>

            {/* Overseas Trading */}
            <div>
              <div className="block text-sm font-semibold text-gray-700 mb-1">
                Import / Export (Overseas Trading)
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overseasTrading"
                  checked={form.overseasTrading}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, overseasTrading: !!checked }))
                  }
                />
                <label htmlFor="overseasTrading" className="text-sm">
                  My business is involved in Overseas Trading
                </label>
              </div>
            </div>

            {/* Digital Services */}
            <div>
              <div className="block text-sm font-semibold text-gray-700 mb-1">Digital Services</div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="digitalServices"
                  checked={form.digitalServices}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, digitalServices: !!checked }))
                  }
                />
                <label htmlFor="digitalServices" className="text-sm">
                  Track export of Digital Services
                </label>
              </div>
              <div className="text-xs text-gray-500 ml-6 mt-1">
                Enabling this option will let you record and track export of digital services to individuals.
              </div>
            </div>
          </div>
        </div>

        {/* ── Direct Filing Settings Section ────────────────────────────── */}
        <div className="bg-white rounded-lg border-2 p-6 space-y-6 col-span-2 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <NotepadText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Direct Filing Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
            {/* GSTIN Username */}
            <div>
              <TextField
                label={
                  <span>
                    GSTIN Username <span className="text-red-600">*</span>
                  </span>
                }
                size="small"
                variant="outlined"
                name="gstinUsername"
                value={form.gstinUsername}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter GSTIN Username"
              />
            </div>

            {/* Reporting Period */}
            <div>
              <FormControl size="small" fullWidth sx={{ mt: 0 }}>
                <InputLabel id="reporting-period-label">
                  Reporting Period <span style={{ color: "#C72030" }}>*</span>
                </InputLabel>
                <Select
                  labelId="reporting-period-label"
                  id="reporting-period-select"
                  name="reportingPeriod"
                  value={form.reportingPeriod}
                  label={
                    <span>
                      Reporting Period <span style={{ color: "#C72030" }}>*</span>
                    </span>
                  }
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, reportingPeriod: e.target.value as string }))
                  }
                  displayEmpty
                >
                  <MenuItem value="">
                    <span style={{ color: "#888" }}>Select</span>
                  </MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Generate First Tax Return From */}
            <div>
              <TextField
                label={
                  <span>
                    Generate First Tax Return From <span className="text-red-600">*</span>
                  </span>
                }
                size="small"
                variant="outlined"
                name="generateFirstTaxReturnFrom"
                type="date"
                value={form.generateFirstTaxReturnFrom}
                onChange={handleChange}
                className="w-full"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </div>
        </div>

        {/* ── Action Buttons ────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-5 mt-5 mb-5 justify-center">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => window.history.back()}
            className="min-w-[100px]"
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </ThemeProvider>
  );
};

export default TaxSetup;
