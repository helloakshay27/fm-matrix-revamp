
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TaxSetup from "./TaxSetup";
import TaxSetupMaster from "./TaxSetupMaster";
import TaxRateSetupPage from "./TaxRateSetupPage";
import TaxConfigurationPage from "./TaxAndSectionTabView";

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

const TaxSetupTabView: React.FC = () => {
    // Validation state
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState<GstForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
   const lock_account_id = localStorage.getItem("lock_account_id");

   const [activeTab, setActiveTab] = useState("indirect");
const [gstApplicable, setGstApplicable] = useState(false);
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
        const url = `${baseUrl}/lock_accounts/${lock_account_id}/gst_settings.json`;
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Submit: PATCH /lock_accounts/${lock_account_id}/gst_settings.json ─────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: { [key: string]: string } = {};
    if (!form.gstin.trim()) newErrors.gstin = "GSTIN is required";
    if (!form.gstRegisteredOn) newErrors.gstRegisteredOn = "GST Registered On is required";
    if (!form.gstinUsername.trim()) newErrors.gstinUsername = "GSTIN Username is required";
    if (!form.reportingPeriod) newErrors.reportingPeriod = "Reporting Period is required";
    if (!form.generateFirstTaxReturnFrom) newErrors.generateFirstTaxReturnFrom = "First Tax Return Date is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields.");
      return;
    }

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
      const url = `${baseUrl}/lock_accounts/${lock_account_id}/gst_settings.json`;
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


<div className="mt-6">
  <Tabs defaultValue="indirect" className="w-full">

    {/* Tabs Header */}
    <TabsList className="grid w-full grid-cols-3 bg-white border-b border-gray-200 rounded-none ">

      <TabsTrigger
        value="direct"
        className="group rounded-none font-medium
          data-[state=active]:text-[#C72030]
          data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]"
      >
        Direct Taxes
      </TabsTrigger>

      <TabsTrigger
        value="indirect"
        className="group rounded-none font-medium
          data-[state=active]:text-[#C72030]
          data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]"
      >
        Indirect Taxes
      </TabsTrigger>

      <TabsTrigger
        value="rates"
        className="group rounded-none font-medium
          data-[state=active]:text-[#C72030]
          data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]"
      >
        Tax Rate Setup
      </TabsTrigger>

    </TabsList>

    {/* DIRECT */}
    <TabsContent value="direct" className="mt-4">
      {/* <div>Direct Taxes Content Here</div> */}
      <TaxConfigurationPage/>
    </TabsContent>

    {/* INDIRECT (GST) */}
    <TabsContent value="indirect" className="mt-4">

      {/* GST Applicable */}
      <div className="mb-6 flex items-center gap-2 p-4">
        <Checkbox
          checked={gstApplicable}
          onCheckedChange={(checked) => setGstApplicable(!!checked)}
        />
        <label className="text-sm font-medium">GST Applicable</label>
      </div>

      {gstApplicable && (
        <>
          {/* ✅ PUT YOUR FULL GST FORM HERE */}
          <TaxSetup/>
        </>
      )}

    </TabsContent>

    {/* TAX RATE */}
    <TabsContent value="rates" className="mt-4">
      <TaxRateSetupPage/>
    </TabsContent>

  </Tabs>
</div>

      
    </ThemeProvider>
  );
};

export default TaxSetupTabView;
