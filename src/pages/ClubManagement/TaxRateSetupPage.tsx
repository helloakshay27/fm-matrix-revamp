import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  GripVertical,
  Info,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import axios from "axios";

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

/** Shape returned by /lock_accounts/1/tax_rates.json */
interface TaxRate {
  id: number;
  name: string;
  rate: number;
  rate_type: string;   // e.g. "CGST"
  rate_of: string;
  rate_of_id: number;
  created_at: string;
  updated_at: string;
}

/** Shape returned by /lock_accounts/1/tax_groups_view.json */
interface TaxGroup {
  id: number;
  name: string;
  tax_rates?: TaxRate[];  // associated rates
  rate?: number;          // optional aggregate
}

// ─────────────────────────── Constants ───────────────────────────────────────

/** Tax type options for the dropdown */
const RATE_TYPE_OPTIONS = [
  { value: "CGST",  label: "CGST" },
  { value: "SGST",  label: "SGST" },
  { value: "IGST",  label: "IGST" },
  { value: "UTGST", label: "UTGST" },
  { value: "Cess",  label: "Cess" },
];

// ─────────────────────────── Helpers ─────────────────────────────────────────
const getBaseUrl = () =>
  (API_CONFIG.BASE_URL?.replace(/\/$/, "") || "").replace(/\/$/, "");

const extractErrorMsg = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { message?: string; error?: string } } }).response;
    return r?.data?.message || r?.data?.error || fallback;
  }
  return fallback;
};

const authHeaders = () => {
  const token = API_CONFIG.TOKEN;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ════════════════════════════════════════════════════════════════════════════
//  TaxRatesTable  – list / create / edit for individual tax rates
//  APIs:
//    GET  /lock_accounts/1/tax_rates.json          → list
//    POST /lock_accounts/1/tax_rates.json           → create
//    POST /lock_accounts/1/tax_rates.json (patch)  → edit  (body includes id)
// ════════════════════════════════════════════════════════════════════════════
const TaxRatesTable: React.FC = () => {
  const [taxes, setTaxes] = useState<TaxRate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const emptyForm = { name: "", rate: "", rate_type: "" };

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);
  const [currentForm, setCurrentForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formBusy, setFormBusy] = useState(false);

  // ── fetch list ──────────────────────────────────────────────────────────
  const fetchTaxes = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${getBaseUrl()}/lock_accounts/1/tax_rates.json`;
      const res = await axios.get<TaxRate[]>(url, { headers: authHeaders() });
      const list: TaxRate[] = Array.isArray(res.data) ? res.data : [];
      setTaxes(list);
      setTotalRecords(list.length);
      setTotalPages(Math.ceil(list.length / perPage) || 1);
    } catch (err) {
      console.error("Failed to fetch tax rates", err);
      toast.error("Failed to load tax rates.");
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  // ── validate ─────────────────────────────────────────────────────────────
  const validate = (f: typeof emptyForm) => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Tax Name is required";
    if (!f.rate) e.rate = "Rate (%) is required";
    if (!f.rate_type) e.rate_type = "Tax Type is required";
    return e;
  };

  // ── save (create or edit) ─────────────────────────────────────────────────
  const handleSave = async () => {
    const errs = validate(currentForm);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setFormBusy(true);

    const baseUrl = getBaseUrl();

    try {
      if (editingTax) {
        // PATCH via POST with id in body
        const payload = {
          tax_rate: {
            id: editingTax.id,
            name: currentForm.name,
            rate_type: currentForm.rate_type,
            rate: parseFloat(currentForm.rate),
          },
        };
        await axios.patch(
          `${baseUrl}/lock_accounts/1/tax_rates/${editingTax.id}.json`,
          payload,
          { headers: authHeaders() }
        );
        toast.success("Tax rate updated successfully!");
      } else {
        // POST – create
        const payload = {
          tax_rate: {
            name: currentForm.name,
            rate_type: currentForm.rate_type,
            rate: parseFloat(currentForm.rate),
          },
        };
        await axios.post(
          `${baseUrl}/lock_accounts/1/tax_rates.json`,
          payload,
          { headers: authHeaders() }
        );
        toast.success("Tax rate created successfully!");
      }
      closePanel();
      fetchTaxes();
    } catch (err: unknown) {
      toast.error(extractErrorMsg(err, "Failed to save tax rate."));
    } finally {
      setFormBusy(false);
    }
  };

  // ── open panel ────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingTax(null);
    setCurrentForm(emptyForm);
    setFormErrors({});
    setPanelOpen(true);
  };

  const openEdit = (tax: TaxRate) => {
    setEditingTax(tax);
    setCurrentForm({
      name: tax.name,
      rate: tax.rate.toString(),
      rate_type: tax.rate_type,
    });
    setFormErrors({});
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingTax(null);
    setCurrentForm(emptyForm);
    setFormErrors({});
  };

  // ── table columns & rows ─────────────────────────────────────────────────
  const columns: ColumnConfig[] = [
    { key: "actions",   label: "Action",    sortable: false, hideable: false, draggable: false },
    { key: "name",      label: "Tax Name",  sortable: true,  hideable: true,  draggable: true },
    { key: "rate_type", label: "Tax Type",  sortable: true,  hideable: true,  draggable: true },
    { key: "rate",      label: "Rate (%)",  sortable: true,  hideable: true,  draggable: true },
  ];

  const paginated = taxes.slice((currentPage - 1) * perPage, currentPage * perPage);

  const renderRow = (tax: TaxRate) => ({
    actions: (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={() => openEdit(tax)}>
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    ),
    name:      <span className="font-medium">{tax.name}</span>,
    rate_type: <span className="font-semibold text-[#C72030]">{tax.rate_type}</span>,
    rate:      <span>{tax.rate}%</span>,
  });

  return (
    <div className="relative">
      <EnhancedTaskTable
        data={paginated}
        columns={columns}
        renderRow={renderRow}
        storageKey="tax-rates-main-table-v2"
        hideTableExport={true}
        enableSearch={true}
        loading={loading}
        leftActions={
          <Button className="bg-[#C72030] hover:bg-[#A01020] text-white" onClick={openAdd}>
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

      {/* ── Add / Edit modal ───────────────────────────────────────────────── */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={closePanel} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true">
            <div
              className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col"
              style={{ animation: "taxPopIn 0.18s ease-out" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  {editingTax ? "Edit Tax Rate" : "New Tax Rate"}
                </h2>
                <button onClick={closePanel} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-5">
                {/* Tax Name */}
                <div className="flex items-start gap-4">
                  <label className="w-28 pt-2 text-sm font-semibold text-[#C72030] shrink-0">
                    Tax Name<span className="text-[#C72030]">*</span>
                  </label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentForm.name}
                      onChange={(e) => {
                        setCurrentForm((s) => ({ ...s, name: e.target.value }));
                        if (e.target.value.trim()) setFormErrors((s) => ({ ...s, name: "" }));
                      }}
                      placeholder="e.g. GST10"
                      className={`w-full h-10 border rounded px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition ${formErrors.name ? "border-red-400" : "border-gray-300"}`}
                    />
                    {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                  </div>
                </div>

                {/* Tax Type (rate_type) */}
                <div className="flex items-start gap-4">
                  <label className="w-28 pt-2 text-sm font-semibold text-[#C72030] shrink-0">
                    Tax Type<span className="text-[#C72030]">*</span>
                  </label>
                  <div className="flex-1">
                    <select
                      value={currentForm.rate_type}
                      onChange={(e) => {
                        setCurrentForm((s) => ({ ...s, rate_type: e.target.value }));
                        if (e.target.value) setFormErrors((s) => ({ ...s, rate_type: "" }));
                      }}
                      className={`w-full h-10 border rounded px-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white transition ${formErrors.rate_type ? "border-red-400" : "border-gray-300"}`}
                    >
                      <option value="">Select Tax Type</option>
                      {RATE_TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    {formErrors.rate_type && <p className="text-xs text-red-500 mt-1">{formErrors.rate_type}</p>}
                  </div>
                </div>

                {/* Rate */}
                <div className="flex items-start gap-4">
                  <label className="w-28 pt-2 text-sm font-semibold text-[#C72030] shrink-0">
                    Rate (%)<span className="text-[#C72030]">*</span>
                  </label>
                  <div className="flex-1">
                    <div className="flex">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={currentForm.rate}
                        onChange={(e) => {
                          setCurrentForm((s) => ({ ...s, rate: e.target.value }));
                          if (e.target.value) setFormErrors((s) => ({ ...s, rate: "" }));
                        }}
                        className={`flex-1 h-10 border rounded-l px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition ${formErrors.rate ? "border-red-400" : "border-gray-300"}`}
                      />
                      <span className="h-10 px-4 flex items-center border border-l-0 border-gray-300 rounded-r bg-gray-50 text-sm text-gray-600 font-medium">
                        %
                      </span>
                    </div>
                    {formErrors.rate && <p className="text-xs text-red-500 mt-1">{formErrors.rate}</p>}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex gap-3 justify-end bg-white rounded-b-lg">
                <Button variant="outline" disabled={formBusy} onClick={closePanel}>Cancel</Button>
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
//  TaxSetupTab  – wraps TaxRatesTable
// ════════════════════════════════════════════════════════════════════════════
const TaxSetupTab: React.FC = () => (
  <ThemeProvider theme={muiTheme}>
    <div className="px-6 pb-8 pt-4 space-y-4">
      <TaxRatesTable />
    </div>
  </ThemeProvider>
);

// ════════════════════════════════════════════════════════════════════════════
//  GroupTaxTab  – inline form (no list, no modal)
//  APIs:
//    GET  /lock_accounts/1/tax_rates.json          → all rates to associate
//    POST /lock_accounts/1/create_tax_group.json   → create group
// ════════════════════════════════════════════════════════════════════════════
const GroupTaxTab: React.FC = () => {
  const [allRates, setAllRates] = useState<TaxRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);

  const [groupName, setGroupName]     = useState("");
  const [groupNameErr, setGroupNameErr] = useState("");
  const [checkedIds, setCheckedIds]   = useState<Set<number>>(new Set());
  const [saving, setSaving]           = useState(false);

  // ── fetch available tax rates on mount ──────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoadingRates(true);
      try {
        const url = `${getBaseUrl()}/lock_accounts/1/tax_rates.json`;
        const res = await axios.get<TaxRate[]>(url, { headers: authHeaders() });
        setAllRates(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch tax rates", err);
      } finally {
        setLoadingRates(false);
      }
    };
    fetch();
  }, []);

  // ── checkbox toggle ───────────────────────────────────────────────────────
  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ── reset form ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setGroupName("");
    setGroupNameErr("");
    setCheckedIds(new Set());
  };

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!groupName.trim()) { setGroupNameErr("Tax Group Name is required"); return; }
    setGroupNameErr("");
    setSaving(true);

    const selectedIds = allRates
      .filter((r) => checkedIds.has(r.id))
      .map((r) => r.id);

    try {
      await axios.post(
        `${getBaseUrl()}/lock_accounts/1/create_tax_group.json`,
        { tax_group: { name: groupName, tax_rates: selectedIds } },
        { headers: authHeaders() }
      );
      toast.success("Tax group created successfully!");
      resetForm();
    } catch (err: unknown) {
      toast.error(extractErrorMsg(err, "Failed to save tax group."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6">
      {/* Title */}
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">New Tax Group</h2>

      {/* Tax Group Name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#C72030] mb-1">
          Tax Group Name<span className="text-[#C72030]">*</span>
        </label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            if (e.target.value.trim()) setGroupNameErr("");
          }}
          placeholder="e.g. GST20"
          className={`w-full h-10 border rounded px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition ${
            groupNameErr ? "border-red-500" : "border-gray-300"
          }`}
        />
        {groupNameErr && <p className="text-xs text-red-500 mt-1">{groupNameErr}</p>}
      </div>

      {/* Associate Taxes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-[#C72030]">
            Associate Taxes<span className="text-[#C72030]">*</span>
          </label>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <GripVertical className="w-3 h-3" />
            <span>Drag taxes to reorder</span>
            <Info className="w-3 h-3" />
          </div>
        </div>

        {loadingRates ? (
          <div className="flex items-center justify-center py-10">
            <CircularProgress size={24} style={{ color: "#C72030" }} />
          </div>
        ) : allRates.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400 border border-gray-200 rounded">
            No tax rates available. Add individual tax rates first.
          </div>
        ) : (
          <div>
            {allRates.map((rate) => (
              <div
                key={rate.id}
                className="flex items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                style={{ minHeight: "42px" }}
              >
                <input
                  type="checkbox"
                  id={`rate-${rate.id}`}
                  checked={checkedIds.has(rate.id)}
                  onChange={() => toggleCheck(rate.id)}
                  className="w-4 h-4 mr-3 accent-[#C72030] cursor-pointer flex-shrink-0"
                />
                <label
                  htmlFor={`rate-${rate.id}`}
                  className="flex-1 text-sm text-gray-800 cursor-pointer select-none"
                >
                  {rate.name}
                </label>
                <span className="text-sm text-gray-600 ml-2">{rate.rate} %</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[72px]"
          onClick={handleSave}
          disabled={saving || loadingRates}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button
          variant="outline"
          onClick={resetForm}
          disabled={saving}
          className="min-w-[72px]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  TaxRateSetupPage  – main page with tabs
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
//  AddTaxGroupPage  – standalone full-page "New Tax Group" form
// ════════════════════════════════════════════════════════════════════════════
export const AddTaxGroupPage: React.FC = () => {
  const navigate = useNavigate();

  const [allRates, setAllRates] = useState<TaxRate[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupNameErr, setGroupNameErr] = useState("");
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [orderedRates, setOrderedRates] = useState<TaxRate[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const url = `${getBaseUrl()}/lock_accounts/1/tax_rates.json`;
        const res = await axios.get<TaxRate[]>(url, { headers: authHeaders() });
        const list = Array.isArray(res.data) ? res.data : [];
        setAllRates(list);
        setOrderedRates(list);
      } catch {
        toast.error("Failed to load tax rates.");
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const onDragStart = (idx: number) => { dragItem.current = idx; };
  const onDragEnter = (idx: number) => { dragOver.current = idx; };
  const onDragEnd = () => {
    const from = dragItem.current;
    const to   = dragOver.current;
    if (from === null || to === null || from === to) return;
    const next = [...orderedRates];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrderedRates(next);
    dragItem.current = null;
    dragOver.current = null;
  };

  const handleSave = async () => {
    if (!groupName.trim()) { setGroupNameErr("Tax Group Name is required"); return; }
    setGroupNameErr("");
    setSaving(true);
    const selectedIds = orderedRates.filter((r) => checkedIds.has(r.id)).map((r) => r.id);
    try {
      await axios.post(
        `${getBaseUrl()}/lock_accounts/1/create_tax_group.json`,
        { tax_group: { name: groupName, tax_rates: selectedIds } },
        { headers: authHeaders() }
      );
      toast.success("Tax group created!");
      navigate("/accounting/tax-rates-setup");
    } catch (err: unknown) {
      toast.error(extractErrorMsg(err, "Failed to save tax group."));
    } finally {
      setSaving(false);
    }
  };

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
              placeholder="e.g. GST20"
              className={`w-full h-10 border rounded px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition ${groupNameErr ? "border-red-400" : "border-gray-300"}`}
            />
            {groupNameErr && <p className="text-xs text-red-500 mt-1">{groupNameErr}</p>}
          </div>
        </div>

        {/* Associate Taxes */}
        <div className="flex items-start gap-6">
          <div className="w-40 pt-2 shrink-0">
            <label className="text-sm font-semibold text-[#C72030]">
              Associate Tax Rates<span className="text-[#C72030]">*</span>
            </label>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <GripVertical className="w-3 h-3" />
              <span>Drag to reorder</span>
              <Info className="w-3 h-3" />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <CircularProgress size={24} style={{ color: "#C72030" }} />
              </div>
            ) : orderedRates.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400 border border-gray-200 rounded">
                No tax rates available. Add individual tax rates first.
              </div>
            ) : (
              <div className="border border-gray-200 rounded overflow-hidden">
                {orderedRates.map((rate, idx) => (
                  <div
                    key={rate.id}
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
                        checked={checkedIds.has(rate.id)}
                        onChange={() => toggleCheck(rate.id)}
                        className="w-4 h-4 accent-[#C72030] cursor-pointer"
                      />
                    </div>
                    <span className="flex-1 text-sm text-gray-800 py-2.5">{rate.name}</span>
                    <span className="text-xs font-semibold text-[#C72030] px-2">{rate.rate_type}</span>
                    <span className="text-sm text-gray-500 pr-3">{rate.rate}%</span>
                    <div className="pr-3 text-gray-300">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-4 border-t justify-end">
          <Button variant="outline" onClick={() => navigate("/accounting/tax-rates-setup")} disabled={saving}>
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
