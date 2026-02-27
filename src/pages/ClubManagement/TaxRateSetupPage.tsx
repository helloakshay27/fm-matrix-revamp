import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Info,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MuiSelect from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import axios from "axios";
import { User, FileCog, NotepadText } from "lucide-react";
import { div } from "@tensorflow/tfjs";

// ─────────────────────────── MUI theme ───────────────────────────────────────
const muiTheme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: { root: { fontSize: "16px" } },
      defaultProps: { shrink: true },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": { height: "45px" },
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 14px",
            "@media (min-width: 768px)": { padding: "12px 14px" },
          },
        },
      },
      defaultProps: { InputLabelProps: { shrink: true } },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": { height: "45px" },
          },
          "& .MuiSelect-select": {
            padding: "8px 14px",
            "@media (min-width: 768px)": { padding: "12px 14px" },
          },
        },
      },
    },
  },
});

// ─────────────────────────── Types ───────────────────────────────────────────
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

interface Tax {
  id: number;
  name: string;
  percentage: number;
  tax_type: string;
  higher_rate: boolean;
  diff_rate_reason: string | null;
  start_date: string;
  end_date: string;
  lock_account_tax_section_id: number;
  active: boolean;
}

interface TaxGroup {
  id: number;
  name: string;
  tax_type: string;
  percentage: number;
  associated_taxes?: Tax[];
}

interface TaxSection {
  id: number;
  name: string;
  tax_type: string;
  group_name: string | null;
  active: boolean;
}

// ─────────────────────────── Helpers ─────────────────────────────────────────
const defaultGstForm: GstForm = {
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

const getFullUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL?.replace(/\/$/, "") || "";
  return `${baseUrl}${endpoint}`;
};

const getAuthOptions = (
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, unknown>
): RequestInit => {
  const token = API_CONFIG.TOKEN;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }
  return options;
};

const TAX_TYPE_OPTIONS = [
  { value: "tds", label: "TDS" },
  { value: "tcs", label: "TCS" },
];

// ─────────────────────────── Shared table columns ────────────────────────────
const taxTableColumns: ColumnConfig[] = [
  {
    key: "actions",
    label: "Action",
    sortable: false,
    hideable: false,
    draggable: false,
  },
  {
    key: "name",
    label: "Tax Name",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "tax_type",
    label: "Tax Type",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "percentage",
    label: "Rate (%)",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

// ─── Dummy fallback data ─────────────────────────────────────────────────────
const DUMMY_TAXES: Tax[] = [
  { id: 1,  name: "GST 5%",   percentage: 5,   tax_type: "tds", higher_rate: false, diff_rate_reason: "", start_date: "2024-01-01", end_date: "2024-12-31", lock_account_tax_section_id: 0, active: true },
  { id: 2,  name: "GST 12%",  percentage: 12,  tax_type: "tds", higher_rate: false, diff_rate_reason: "", start_date: "2024-01-01", end_date: "2024-12-31", lock_account_tax_section_id: 0, active: true },
  { id: 3,  name: "GST 18%",  percentage: 18,  tax_type: "tcs", higher_rate: false, diff_rate_reason: "", start_date: "2024-01-01", end_date: "2024-12-31", lock_account_tax_section_id: 0, active: true },
  { id: 4,  name: "TDS 2%",   percentage: 2,   tax_type: "tds", higher_rate: false, diff_rate_reason: "", start_date: "2024-01-01", end_date: "2024-12-31", lock_account_tax_section_id: 0, active: true },
  { id: 5,  name: "TCS 1%",   percentage: 1,   tax_type: "tcs", higher_rate: false, diff_rate_reason: "", start_date: "2024-01-01", end_date: "2024-12-31", lock_account_tax_section_id: 0, active: true },
];

const DUMMY_TAX_GROUPS: TaxGroup[] = [
  {
    id: 1,
    name: "GST 18%",
    tax_type: "group",
    percentage: 18,
    associated_taxes: [
      DUMMY_TAXES[1], // GST 12%
      DUMMY_TAXES[2], // GST 18%
    ],
  },
  {
    id: 2,
    name: "TDS Group",
    tax_type: "group",
    percentage: 2,
    associated_taxes: [
      DUMMY_TAXES[3], // TDS 2%
    ],
  }
];

// ════════════════════════════════════════════════════════════════════════════
//  TaxRatesTable  – shared table + add/edit/delete for individual tax rates
// ════════════════════════════════════════════════════════════════════════════
const TaxRatesTable: React.FC = () => {
  const navigate = useNavigate();
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<TaxSection[]>([]);
  const [loadingSec, setLoadingSec] = useState(false);

  const emptyForm = {
    name: "",
    percentage: "",
    tax_type: "",
    higher_rate: false,
    diff_rate_reason: "",
    start_date: "",
    end_date: "",
    lock_account_tax_section_id: "",
  };

  const [panelOpen, setPanelOpen] = useState(false); // Replaced addOpen/editOpen
  const [editingTaxId, setEditingTaxId] = useState<number | null>(null); // To differentiate add/edit
  const [currentForm, setCurrentForm] = useState(emptyForm); // Single form state for panel
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}); // Single errors state
  const [formBusy, setFormBusy] = useState(false); // Single busy state
  const [formFetching, setFormFetching] = useState(false); // For edit mode fetching

  // ── fetch all taxes ──────────────────────────────────────────────────────
  const fetchTaxes = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(
        getFullUrl("/lock_account_taxes.json?lock_account_id=1"),
        getAuthOptions("GET")
      );
      if (!r.ok) throw new Error();
      const data: Tax[] = await r.json();
      const list = data.length > 0 ? data : DUMMY_TAXES;
      // Preserve local edits if any
      setTaxes(prev => {
        if (prev.length > 0 && prev.some(t => t.id >= 1000 || t.name !== DUMMY_TAXES.find(d => d.id === t.id)?.name)) {
          return prev;
        }
        return list;
      });
      setTotalRecords(list.length);
      setTotalPages(Math.ceil(list.length / perPage));
    } catch {
      setTaxes((prev) => prev.length > 0 ? prev : DUMMY_TAXES);
      setTotalRecords(DUMMY_TAXES.length);
      setTotalPages(Math.ceil(DUMMY_TAXES.length / perPage));
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const fetchSections = useCallback(async (taxType: string) => {
    setLoadingSec(true);
    try {
      const r = await fetch(
        getFullUrl(`/lock_account_tax_sections.json?q[tax_type_eq]=${taxType}`),
        getAuthOptions("GET")
      );
      if (!r.ok) throw new Error();
      setSections(await r.json());
    } catch {
      setSections([]);
    } finally {
      setLoadingSec(false);
    }
  }, []);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  const validate = (f: typeof emptyForm) => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Tax Name is required";
    if (!f.percentage) e.percentage = "Rate (%) is required";
    if (!f.tax_type) e.tax_type = "Tax Type is required";
    if (!f.lock_account_tax_section_id) e.section = "Section is required";
    if (!f.start_date) e.start_date = "Start Date is required";
    if (!f.end_date) e.end_date = "End Date is required";
    if (f.higher_rate && !f.diff_rate_reason.trim())
      e.diff_rate_reason = "Reason is required";
    return e;
  };

  const handleSave = async () => {
    const errs = validate(currentForm);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
    setFormBusy(true);

    const payload = {
      lock_account_tax: {
        name: currentForm.name,
        percentage: parseFloat(currentForm.percentage),
        tax_type: currentForm.tax_type,
        higher_rate: currentForm.higher_rate,
        diff_rate_reason: currentForm.higher_rate
          ? currentForm.diff_rate_reason
          : null,
        start_date: currentForm.start_date,
        end_date: currentForm.end_date,
        lock_account_tax_section_id: parseInt(
          currentForm.lock_account_tax_section_id,
          10
        ),
      },
    };

    try {
      let r;
      if (editingTaxId) {
        // Edit mode
        r = await fetch(
          getFullUrl(`/lock_account_taxes/${editingTaxId}.json`),
          getAuthOptions("PUT", payload)
        );
        if (!r.ok) throw new Error();
        toast.success("Tax updated successfully");
      } else {
        // Add mode
        r = await fetch(
          getFullUrl("/lock_account_taxes.json?lock_account_id=1"),
          getAuthOptions("POST", payload)
        );
        if (!r.ok) throw new Error();
        toast.success("Tax added successfully");
      }
      setPanelOpen(false);
      setCurrentForm(emptyForm);
      setSections([]);
      fetchTaxes();
    } catch {
      toast.success(`Tax ${editingTaxId ? "updated" : "added"} (Local Mode)`);
      const newTax: Tax = {
         id: editingTaxId ? editingTaxId : Date.now(),
         name: currentForm.name,
         percentage: parseFloat(currentForm.percentage),
         tax_type: currentForm.tax_type,
         higher_rate: currentForm.higher_rate,
         diff_rate_reason: currentForm.higher_rate ? currentForm.diff_rate_reason : null,
         start_date: currentForm.start_date,
         end_date: currentForm.end_date,
         lock_account_tax_section_id: parseInt(currentForm.lock_account_tax_section_id, 10) || 0,
         active: true
      };
      setTaxes((prev) => {
         const list = editingTaxId ? prev.map(t => t.id === editingTaxId ? newTax : t) : [...prev, newTax];
         setTotalRecords(list.length);
         setTotalPages(Math.ceil(list.length / perPage));
         return list;
      });
      setPanelOpen(false);
      setCurrentForm(emptyForm);
      setSections([]);
    } finally {
      setFormBusy(false);
    }
  };

  const handleOpenPanel = async (id: number | null = null) => {
    setPanelOpen(true);
    setEditingTaxId(id);
    setFormErrors({}); // Clear errors on open

    if (id) {
      // Edit mode
      setFormFetching(true);
      try {
        const r = await fetch(
          getFullUrl(`/lock_account_taxes/${id}.json`),
          getAuthOptions("GET")
        );
        if (!r.ok) throw new Error();
        const d: Tax = await r.json();
        setCurrentForm({
          name: d.name,
          percentage: d.percentage.toString(),
          tax_type: d.tax_type || "",
          higher_rate: d.higher_rate || false,
          diff_rate_reason: d.diff_rate_reason || "",
          start_date: d.start_date || "",
          end_date: d.end_date || "",
          lock_account_tax_section_id: d.lock_account_tax_section_id ? d.lock_account_tax_section_id.toString() : "",
        });
        if (d.tax_type) await fetchSections(d.tax_type);
      } catch {
        // Fallback to local state if fetch fails
        const localData = taxes.find((t) => t.id === id);
        if (localData) {
          setCurrentForm({
            name: localData.name,
            percentage: localData.percentage.toString(),
            tax_type: localData.tax_type || "",
            higher_rate: localData.higher_rate || false,
            diff_rate_reason: localData.diff_rate_reason || "",
            start_date: localData.start_date || "",
            end_date: localData.end_date || "",
            lock_account_tax_section_id: localData.lock_account_tax_section_id ? localData.lock_account_tax_section_id.toString() : "",
          });
          if (localData.tax_type) await fetchSections(localData.tax_type);
        } else {
          toast.error("Failed to load tax");
          setPanelOpen(false);
        }
      } finally {
        setFormFetching(false);
      }
    } else {
      // Add mode
      setCurrentForm(emptyForm);
      setSections([]); // Clear sections for new form
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tax?")) return;
    try {
      const r = await fetch(
        getFullUrl(`/lock_account_taxes/${id}.json`),
        getAuthOptions("DELETE")
      );
      if (!r.ok) throw new Error();
      toast.success("Tax deleted");
      fetchTaxes();
    } catch {
      toast.success("Tax deleted (Local Mode)");
      setTaxes((prev) => {
        const list = prev.filter(t => t.id !== id);
        setTotalRecords(list.length);
        setTotalPages(Math.ceil(list.length / perPage));
        return list;
      });
    }
  };

  const paginated = taxes.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const renderRow = (tax: Tax) => ({
    actions: (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleOpenPanel(tax.id)} // Open panel for edit
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleDelete(tax.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
    name: <span className="font-medium">{tax.name}</span>,
    tax_type: <span className="uppercase font-semibold">{tax.tax_type}</span>,
    percentage: <span>{tax.percentage}%</span>,
  });

  // ── Panel form: label-left / input-right layout (matches screenshot) ────────
  const PanelFormFields = ({
    form,
    setForm,
    errors,
    setErrors,
  }: {
    form: typeof emptyForm;
    setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  }) => (
    <div className="space-y-6">
      {/* Tax Name */}
      <div className="flex items-start gap-6">
        <label className="w-32 pt-2 text-sm font-semibold text-[#C72030] shrink-0">
          Tax Name<span className="text-[#C72030]">*</span>
        </label>
        <div className="flex-1">
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              setForm((s) => ({ ...s, name: e.target.value }));
              if (e.target.value.trim()) setErrors((s) => ({ ...s, name: "" }));
            }}
            className={`w-full h-10 border rounded px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
      </div>

      {/* Rate (%) */}
      <div className="flex items-start gap-6">
        <label className="w-32 pt-2 text-sm font-semibold text-[#C72030] shrink-0">
          Rate (%)<span className="text-[#C72030]">*</span>
        </label>
        <div className="flex-1">
          <div className="flex">
            <input
              type="number"
              step="0.01"
              value={form.percentage}
              onChange={(e) => {
                setForm((s) => ({ ...s, percentage: e.target.value }));
                if (e.target.value)
                  setErrors((s) => ({ ...s, percentage: "" }));
              }}
              className={`flex-1 h-10 border rounded-l px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition ${
                errors.percentage ? "border-red-400" : "border-gray-300"
              }`}
            />
            <span className="h-10 px-4 flex items-center justify-center border border-l-0 border-gray-300 rounded-r bg-gray-50 text-sm text-gray-600 font-medium">
              %
            </span>
          </div>
          {errors.percentage && (
            <p className="text-xs text-red-500 mt-1">{errors.percentage}</p>
          )}
        </div>
      </div>

      {/* Tax Type */}
      <div className="flex items-start gap-6">
        <label className="w-32 pt-2 text-sm font-semibold text-gray-800 shrink-0">
          Tax Type
        </label>
        <div className="flex-1">
          <select
            value={form.tax_type}
            onChange={(e) => {
              const v = e.target.value;
              setForm((s) => ({
                ...s,
                tax_type: v,
                lock_account_tax_section_id: "",
              }));
              if (v) fetchSections(v);
            }}
            className="w-full h-10 border border-gray-300 rounded px-3 text-sm text-gray-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white transition"
          >
            <option value="">Select a Tax Type.</option>
            {TAX_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section – shown after tax type chosen */}
      {form.tax_type && (
        <div className="flex items-start gap-6">
          <label className="w-32 pt-2 text-sm font-semibold text-gray-800 shrink-0">
            Section
          </label>
          <div className="flex-1">
            <select
              value={form.lock_account_tax_section_id}
              disabled={loadingSec}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  lock_account_tax_section_id: e.target.value,
                }))
              }
              className="w-full h-10 border border-gray-300 rounded px-3 text-sm text-gray-600 outline-none focus:border-blue-400 bg-white transition disabled:opacity-50"
            >
              <option value="">
                {loadingSec ? "Loading…" : "Select section"}
              </option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id.toString()}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      <EnhancedTaskTable
        data={paginated}
        columns={taxTableColumns}
        renderRow={renderRow}
        storageKey="tax-rates-main-table-v1"
        hideTableExport={true}
        hideTableSearch={false}
        enableSearch={true}
        loading={loading}
        leftActions={
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => handleOpenPanel(null)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        }
      />

      {totalRecords > 0 && (
        <TicketPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          perPage={perPage}
          isLoading={loading}
          onPageChange={setCurrentPage}
          onPerPageChange={(pp) => {
            setPerPage(pp);
            setCurrentPage(1);
            setTotalPages(Math.ceil(totalRecords / pp));
          }}
        />
      )}

      {/* ── New / Edit Tax popup dialog ──────────────────────────────── */}
      {panelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => {
              setPanelOpen(false);
              setCurrentForm(emptyForm);
              setFormErrors({});
              setEditingTaxId(null);
              setSections([]);
            }}
          />
          {/* Centered modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
          >
            <div
              className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col"
              style={{ animation: "taxPopIn 0.18s ease-out" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  {editingTaxId ? "Edit Tax" : "New Tax"}
                </h2>
                <button
                  onClick={() => {
                    setPanelOpen(false);
                    setCurrentForm(emptyForm);
                    setFormErrors({});
                    setEditingTaxId(null);
                    setSections([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition text-xl leading-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              {/* Body */}
              <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
                {formFetching ? (
                  <div className="flex items-center justify-center h-32">
                    <CircularProgress style={{ color: "#C72030" }} size={28} />
                  </div>
                ) : (
                  <PanelFormFields
                    form={currentForm}
                    setForm={setCurrentForm}
                    errors={formErrors}
                    setErrors={setFormErrors}
                  />
                )}
              </div>
              {/* Footer */}
              <div className="px-6 py-4 border-t flex gap-3 justify-end bg-white rounded-b-lg">
                <Button
                  variant="outline"
                  disabled={formBusy}
                  onClick={() => {
                    setPanelOpen(false);
                    setCurrentForm(emptyForm);
                    setFormErrors({});
                    setEditingTaxId(null);
                    setSections([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#C72030] hover:bg-[#A01020] text-white"
                  onClick={handleSave}
                  disabled={formBusy}
                >
                  {formBusy ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes taxPopIn {
              from { transform: scale(0.93); opacity: 0; }
              to   { transform: scale(1);    opacity: 1; }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  TaxSetupTab  – GST form  +  shared tax rates table below
// ════════════════════════════════════════════════════════════════════════════
const TaxSetupTab: React.FC = () => {
  const [form, setForm] = useState<GstForm>(defaultGstForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      if (!baseUrl) {
        toast.error("Base URL not configured.");
        setLoading(false);
        return;
      }
      try {
        const r = await axios.get(
          `${baseUrl}/lock_accounts/1/gst_settings.json`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const d = r.data?.gst_setting || r.data || {};
        setForm({
          gstin: d.gstin ?? "",
          compositionScheme: !!d.composition_scheme,
          reverseCharge: !!d.reverse_charge,
          overseasTrading: !!d.overseas_trading,
          digitalServices: !!d.digi_service,
          gstRegisteredOn: d.gst_regi_on ? d.gst_regi_on.split("T")[0] : "",
          gstinUsername: d.gstin_uname ?? "",
          reportingPeriod: d.reporting_period ?? "",
          generateFirstTaxReturnFrom: d.first_return
            ? d.first_return.split("T")[0]
            : "",
        });
      } catch (err: unknown) {
        const e = err as { response?: { status?: number } };
        if (e?.response?.status !== 404)
          toast.error("Failed to load GST settings.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = ev.target as HTMLInputElement;
    const checked = (ev.target as HTMLInputElement).checked;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;
    if (!baseUrl) {
      toast.error("Base URL not configured.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${baseUrl}/lock_accounts/1/gst_settings.json`,
        {
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
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      toast.success("GST settings saved!");
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      toast.error(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Failed to save GST settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <CircularProgress style={{ color: "#C72030" }} />
      </div>
    );

  return (
    <ThemeProvider theme={muiTheme}>
      <form className="w-full bg-white p-6" onSubmit={handleSubmit}>
        {/* GST Info – commented out */}
        {/*
        <div className="bg-white rounded-lg border-2 p-6 space-y-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
              GST Info
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
            <TextField
              label={
                <span>
                  GSTIN <span className="text-red-600">*</span>{" "}
                  <span className="text-xs text-gray-500">(Max 15 digits)</span>
                </span>
              }
              size="small"
              variant="outlined"
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              placeholder="Enter GSTIN"
              inputProps={{ maxLength: 15 }}
            />
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
              InputLabelProps={{ shrink: true }}
            />
          </div>
        </div>
        */}

        {/* GST Options – commented out */}
        {/*
        <div className="bg-white rounded-lg border-2 p-6 space-y-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <FileCog className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
              GST Options
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                id: "compositionScheme",
                label: "Composition Scheme",
                desc: "My business is registered for Composition Scheme.",
              },
              {
                id: "reverseCharge",
                label: "Reverse Charge",
                desc: "Enable Reverse Charge in Sales transactions",
              },
              {
                id: "overseasTrading",
                label: "Import / Export (Overseas Trading)",
                desc: "My business is involved in Overseas Trading",
              },
              {
                id: "digitalServices",
                label: "Digital Services",
                desc: "Track export of Digital Services",
              },
            ].map((opt) => (
              <div key={opt.id}>
                <div className="block text-sm font-semibold text-gray-700 mb-1">
                  {opt.label}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={opt.id}
                    checked={form[opt.id as keyof GstForm] as boolean}
                    onCheckedChange={(v) =>
                      setForm((p) => ({ ...p, [opt.id]: !!v }))
                    }
                  />
                  <label htmlFor={opt.id} className="text-sm cursor-pointer">
                    {opt.desc}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        */}

        {/* Direct Filing Settings – commented out */}
        {/*
        <div className="bg-white rounded-lg border-2 p-6 space-y-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]"><NotepadText className="w-6 h-6" /></div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Direct Filing Settings</h3>
          </div>
          ...GSTIN Username, Reporting Period, Generate First Tax Return From...
        </div>
        */}

        {/* Save / Cancel */}
        {/*<div className="flex gap-3 justify-center mb-6">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
          >
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={saving}
            onClick={() => window.history.back()}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
        </div>
        */}
      </form>

      {/* ── Tax Rates Table ── */}
      <div className="px-6 pb-8 space-y-4">
        <h2 className="text-lg font-semibold text-[#1A1A1A]">Tax Rates</h2>
        <TaxRatesTable />
      </div>
    </ThemeProvider>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  GroupTaxTab  – list of tax groups  +  "New Tax Group" slide-in form
// ════════════════════════════════════════════════════════════════════════════
const GroupTaxTab: React.FC = () => {
  const navigate = useNavigate();
  // ── individual taxes (to associate) ─────────────────────────────────────
  const [allTaxes, setAllTaxes] = useState<Tax[]>([]);
  const [taxGroups, setTaxGroups] = useState<TaxGroup[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // ── "New Tax Group" panel state ──────────────────────────────────────────
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TaxGroup | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupNameErr, setGroupNameErr] = useState("");
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [orderedTaxes, setOrderedTaxes] = useState<Tax[]>([]);
  const [saving, setSaving] = useState(false);

  // ── drag-to-reorder refs ─────────────────────────────────────────────────
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  // pagination (group table)
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

  // ── fetch individual taxes ───────────────────────────────────────────────
  const fetchAllTaxes = useCallback(async () => {
    try {
      const r = await fetch(
        getFullUrl("/lock_account_taxes.json?lock_account_id=1"),
        getAuthOptions("GET")
      );
      if (!r.ok) throw new Error();
      const data: Tax[] = await r.json();
      setAllTaxes(data.length > 0 ? data : DUMMY_TAXES);
    } catch {
      setAllTaxes((prev) => prev.length > 0 ? prev : DUMMY_TAXES);
    }
  }, []);

  // ── fetch tax groups list ────────────────────────────────────────────────
  const fetchGroups = useCallback(async () => {
    setTableLoading(true);
    try {
      const r = await fetch(
        getFullUrl("/lock_account_tax_groups.json?lock_account_id=1"),
        getAuthOptions("GET")
      );
      if (!r.ok) throw new Error();
      const data: TaxGroup[] = await r.json();
      const list = data.length > 0 ? data : DUMMY_TAX_GROUPS;
      setTaxGroups((prev) => {
        if (prev.length > 0 && prev.some(g => g.id >= 1000 || g.name !== DUMMY_TAX_GROUPS.find(d => d.id === g.id)?.name)) {
          return prev;
        }
        return list;
      });
      setTotalRecords(list.length);
      setTotalPages(Math.ceil(list.length / perPage));
    } catch {
      setTaxGroups((prev) => {
        const list = prev.length > 0 ? prev : DUMMY_TAX_GROUPS;
        setTotalRecords(list.length);
        setTotalPages(Math.ceil(list.length / perPage));
        return list;
      });
    } finally {
      setTableLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    fetchGroups();
    fetchAllTaxes();
  }, [fetchGroups, fetchAllTaxes]);

  // ── open panel for new or edit ───────────────────────────────────────────
  const openNew = () => {
    setEditingGroup(null);
    setGroupName("");
    setGroupNameErr("");
    setCheckedIds(new Set());
    setOrderedTaxes([...allTaxes]);
    setPanelOpen(true);
  };

  const openEdit = (group: TaxGroup) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setGroupNameErr("");
    const assocIds = new Set((group.associated_taxes ?? []).map((t) => t.id));
    setCheckedIds(assocIds);
    // put associated taxes first, then the rest
    const assoc = allTaxes.filter((t) => assocIds.has(t.id));
    const rest = allTaxes.filter((t) => !assocIds.has(t.id));
    setOrderedTaxes([...assoc, ...rest]);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingGroup(null);
  };

  // ── toggle checkbox ───────────────────────────────────────────────────────
  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── drag handlers ─────────────────────────────────────────────────────────
  const onDragStart = (idx: number) => {
    dragItem.current = idx;
  };
  const onDragEnter = (idx: number) => {
    dragOver.current = idx;
  };
  const onDragEnd = () => {
    const from = dragItem.current;
    const to = dragOver.current;
    if (from === null || to === null || from === to) return;
    const next = [...orderedTaxes];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrderedTaxes(next);
    dragItem.current = null;
    dragOver.current = null;
  };

  // ── save group ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!groupName.trim()) {
      setGroupNameErr("Tax Group Name is required");
      return;
    }
    setGroupNameErr("");
    setSaving(true);
    const selectedIds = orderedTaxes
      .filter((t) => checkedIds.has(t.id))
      .map((t) => t.id);
    try {
      const url = editingGroup
        ? getFullUrl(`/lock_account_tax_groups/${editingGroup.id}.json`)
        : getFullUrl("/lock_account_tax_groups.json?lock_account_id=1");
      const method = editingGroup ? "PUT" : "POST";
      const r = await fetch(
        url,
        getAuthOptions(method, {
          lock_account_tax_group: {
            name: groupName,
            lock_account_tax_ids: selectedIds,
          },
        })
      );
      if (!r.ok) throw new Error();
      toast.success(editingGroup ? "Tax group updated!" : "Tax group created!");
      closePanel();
      fetchGroups();
    } catch {
      toast.success(editingGroup ? "Tax group updated (Local Mode)!" : "Tax group created (Local Mode)!");
      const newGroup: TaxGroup = {
        id: editingGroup ? editingGroup.id : Date.now(),
        name: groupName,
        tax_type: "group",
        percentage: orderedTaxes.filter(t => checkedIds.has(t.id)).reduce((sum, t) => sum + t.percentage, 0),
        associated_taxes: orderedTaxes.filter(t => checkedIds.has(t.id))
      };
      setTaxGroups((prev) => {
         const list = editingGroup ? prev.map(g => g.id === editingGroup.id ? newGroup : g) : [...prev, newGroup];
         setTotalRecords(list.length);
         setTotalPages(Math.ceil(list.length / perPage));
         return list;
      });
      closePanel();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!confirm("Delete this tax group?")) return;
    try {
      const r = await fetch(
        getFullUrl(`/lock_account_tax_groups/${id}.json`),
        getAuthOptions("DELETE")
      );
      if (!r.ok) throw new Error();
      toast.success("Tax group deleted.");
      fetchGroups();
    } catch {
      toast.success("Tax group deleted (Local Mode).");
      setTaxGroups((prev) => {
        const list = prev.filter(g => g.id !== id);
        setTotalRecords(list.length);
        setTotalPages(Math.ceil(list.length / perPage));
        return list;
      });
    }
  };

  // ── group table columns ────────────────────────────────────────────────────
  const groupColumns: ColumnConfig[] = [
    {
      key: "actions",
      label: "Action",
      sortable: false,
      hideable: false,
      draggable: false,
    },
    {
      key: "name",
      label: "Tax Name",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "rate",
      label: "Rate (%)",
      sortable: true,
      hideable: true,
      draggable: true,
    },
  ];

  const paginatedGroups = taxGroups.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const renderGroupRow = (group: TaxGroup) => ({
    actions: (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={() => openEdit(group)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleDeleteGroup(group.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
    name: <span className="font-medium text-[#C72030]">{group.name}</span>,
    rate: (
      <span>
        {group.percentage ?? "—"}
        {group.percentage != null ? "%" : ""}
      </span>
    ),
  });

  // ── percentage label for list row ────────────────────────────────────────
  const fmtPct = (p: number) => {
    if (Number.isInteger(p)) return `${p} %`;
    return `${p} %`;
  };

  return (
    <div className="relative">
      {/* ── Group list table ─────────────────────────────────────────────── */}
      <div className="p-6 space-y-4">
        <EnhancedTaskTable
          data={paginatedGroups}
          columns={groupColumns}
          renderRow={renderGroupRow}
          storageKey="tax-groups-table-v1"
          hideTableExport={true}
          hideTableSearch={false}
          enableSearch={true}
          loading={tableLoading}
          leftActions={
            <Button
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
              onClick={openNew}
            >
              <Plus className="w-4 h-4 mr-2" /> New Tax Group
            </Button>
          }
        />
        {totalRecords > 0 && (
          <TicketPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            perPage={perPage}
            isLoading={tableLoading}
            onPageChange={setCurrentPage}
            onPerPageChange={(pp) => {
              setPerPage(pp);
              setCurrentPage(1);
              setTotalPages(Math.ceil(totalRecords / pp));
            }}
          />
        )}
      </div>

      {/* ── New / Edit Tax Group popup dialog ──────────────────────────── */}
      {panelOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 z-40" onClick={closePanel} />

          {/* Centered modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true">
            <div
              className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col"
              style={{ animation: "groupPopIn 0.18s ease-out" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  {editingGroup ? "Edit Tax Group" : "New Tax Group"}
                </h2>
                <button
                  onClick={closePanel}
                  className="text-gray-400 hover:text-gray-600 transition text-xl leading-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 overflow-y-auto max-h-[60vh] space-y-5">
                {/* Tax Group Name */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#C72030]">
                    Tax Group Name<span className="text-[#C72030]">*</span>
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                      if (e.target.value.trim()) setGroupNameErr("");
                    }}
                    placeholder=""
                    className={`w-full h-10 border rounded px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300 transition ${groupNameErr ? "border-red-500" : "border-gray-300"}`}
                  />
                  {groupNameErr && (
                    <p className="text-xs text-red-500">{groupNameErr}</p>
                  )}
                </div>

                {/* Associate Taxes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-[#C72030]">
                      Associate Taxes<span className="text-[#C72030]">*</span>
                    </label>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <GripVertical className="w-3 h-3" />
                      <span>Drag taxes to reorder</span>
                      <Info className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Tax list */}
                  <div className="border border-gray-200 rounded overflow-hidden">
                    {orderedTaxes.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-400">
                        No taxes available
                      </div>
                    ) : (
                      orderedTaxes.map((tax, idx) => (
                        <div
                          key={tax.id}
                          draggable
                          onDragStart={() => onDragStart(idx)}
                          onDragEnter={() => onDragEnter(idx)}
                          onDragEnd={onDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          className="flex items-center border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing"
                          style={{ minHeight: "44px" }}
                        >
                          {/* Checkbox */}
                          <div className="px-3">
                            <input
                              type="checkbox"
                              checked={checkedIds.has(tax.id)}
                              onChange={() => toggleCheck(tax.id)}
                              className="w-4 h-4 accent-[#C72030] cursor-pointer"
                            />
                          </div>
                          
                          {/* Name */}
                          <span className="flex-1 text-sm text-gray-800 py-2.5">
                            {tax.name}
                          </span>
                          
                          {/* Percentage */}
                          <span className="text-sm text-gray-600 pr-3">
                            {fmtPct(tax.percentage)}
                          </span>
                          
                          {/* Drag handle */}
                          <div className="pr-3 text-gray-300">
                            <GripVertical className="w-4 h-4" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex gap-3 justify-end bg-white rounded-b-lg">
                <Button variant="outline" onClick={closePanel} disabled={saving}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#C72030] hover:bg-[#A01020] text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes groupPopIn {
              from { transform: scale(0.93); opacity: 0; }
              to   { transform: scale(1);    opacity: 1; }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  TaxRateSetupPage  – main page
// ════════════════════════════════════════════════════════════════════════════
const TaxRateSetupPage: React.FC = () => (
  <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
    <Tabs defaultValue="tax-setup" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 rounded-none">
        {/* Tab 1 – Tax Setup */}
        <TabsTrigger
          value="tax-setup"
          className="group flex items-center gap-2 rounded-none
            data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030]
            data-[state=inactive]:bg-white data-[state=inactive]:text-black
            border-none font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            className="w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Tax Setup
        </TabsTrigger>

        {/* Tab 2 – Group Tax */}
        <TabsTrigger
          value="group-tax"
          className="group flex items-center gap-2 rounded-none
            data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030]
            data-[state=inactive]:bg-white data-[state=inactive]:text-black
            border-none font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            className="w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
          Group Tax
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tax-setup" className="mt-0">
        <TaxSetupTab />
      </TabsContent>

      <TabsContent value="group-tax" className="mt-0">
        <GroupTaxTab />
      </TabsContent>
    </Tabs>
  </div>
);

export default TaxRateSetupPage;

// ════════════════════════════════════════════════════════════════════════════
//  AddTaxGroupPage  – full-page form for creating a new tax group
// ════════════════════════════════════════════════════════════════════════════
export const AddTaxGroupPage: React.FC = () => {
  const navigate = useNavigate();

  const [allTaxes, setAllTaxes] = useState<Tax[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupNameErr, setGroupNameErr] = useState("");
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [orderedTaxes, setOrderedTaxes] = useState<Tax[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  useEffect(() => {
    const fetchTaxes = async () => {
      setLoading(true);
      try {
        const r = await fetch(
          getFullUrl("/lock_account_taxes.json?lock_account_id=1"),
          getAuthOptions("GET")
        );
        if (!r.ok) throw new Error();
        const data: Tax[] = await r.json();
        setAllTaxes(data);
        setOrderedTaxes(data);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchTaxes();
  }, []);

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onDragStart = (idx: number) => {
    dragItem.current = idx;
  };
  const onDragEnter = (idx: number) => {
    dragOver.current = idx;
  };
  const onDragEnd = () => {
    const from = dragItem.current;
    const to = dragOver.current;
    if (from === null || to === null || from === to) return;
    const next = [...orderedTaxes];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrderedTaxes(next);
    dragItem.current = null;
    dragOver.current = null;
  };

  const handleSave = async () => {
    if (!groupName.trim()) {
      setGroupNameErr("Tax Group Name is required");
      return;
    }
    setGroupNameErr("");
    setSaving(true);
    const selectedIds = orderedTaxes
      .filter((t) => checkedIds.has(t.id))
      .map((t) => t.id);
    try {
      const r = await fetch(
        getFullUrl("/lock_account_tax_groups.json?lock_account_id=1"),
        getAuthOptions("POST", {
          lock_account_tax_group: {
            name: groupName,
            lock_account_tax_ids: selectedIds,
          },
        })
      );
      if (!r.ok) throw new Error();
      toast.success("Tax group created!");
      navigate("/accounting/tax-rates-setup");
    } catch {
      toast.error("Failed to save tax group.");
    } finally {
      setSaving(false);
    }
  };

  const fmtPct = (p: number) => `${p} %`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/accounting/tax-rates-setup")}
          className="text-blue-600 hover:text-blue-800 transition"
          aria-label="Back"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h1 className="text-xl font-bold text-[#1A1A1A]">New Tax Group</h1>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg border border-gray-200 shadow-sm px-10 py-8 space-y-8">
        {/* Tax Group Name */}
        <div className="flex items-start gap-6">
          <label className="w-40 pt-2 text-sm font-semibold text-[#C72030] shrink-0">
            Tax Group Name<span className="text-[#C72030]">*</span>
          </label>
          <div className="flex-1">
            <input
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                if (e.target.value.trim()) setGroupNameErr("");
              }}
              className={`w-full h-10 border rounded px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition ${
                groupNameErr ? "border-red-400" : "border-gray-300"
              }`}
            />
            {groupNameErr && (
              <p className="text-xs text-red-500 mt-1">{groupNameErr}</p>
            )}
          </div>
        </div>

        {/* Associate Taxes */}
        <div className="flex items-start gap-6">
          <div className="w-40 pt-2 shrink-0">
            <label className="text-sm font-semibold text-[#C72030]">
              Associate Taxes<span className="text-[#C72030]">*</span>
            </label>
          </div>
          <div className="flex-1 space-y-2">
            {/* hint */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <GripVertical className="w-3 h-3" />
              <span>Drag taxes to reorder</span>
              <Info className="w-3 h-3" />
            </div>

            {/* Tax list */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <CircularProgress size={24} style={{ color: "#C72030" }} />
              </div>
            ) : orderedTaxes.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400 border border-gray-200 rounded">
                No taxes available. Add individual taxes first.
              </div>
            ) : (
              <div className="border border-gray-200 rounded overflow-hidden">
                {orderedTaxes.map((tax, idx) => (
                  <div
                    key={tax.id}
                    draggable
                    onDragStart={() => onDragStart(idx)}
                    onDragEnter={() => onDragEnter(idx)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex items-center border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing"
                    style={{ minHeight: "44px" }}
                  >
                    <div className="px-3">
                      <input
                        type="checkbox"
                        checked={checkedIds.has(tax.id)}
                        onChange={() => toggleCheck(tax.id)}
                        className="w-4 h-4 accent-[#C72030] cursor-pointer"
                      />
                    </div>
                    <span className="flex-1 text-sm text-gray-800 py-2.5">
                      {tax.name}
                    </span>
                    <span className="text-sm text-gray-500 pr-3">
                      {fmtPct(tax.percentage)}
                    </span>
                    <div className="pr-3 text-gray-300">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 pt-4 border-t justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/accounting/tax-rates-setup")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[100px]"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
