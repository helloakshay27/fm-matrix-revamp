import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Paperclip, X } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { RootState, AppDispatch } from "@/store/store";
import { fetchInventoryConsumptionDetails } from "@/store/slices/inventoryConsumptionDetailsSlice";
import { fetchInventory } from "@/store/slices/inventoryEditSlice";
import {
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import { useLocationData } from "@/hooks/useLocationData";
import { getAuthHeader } from "@/config/apiConfig";

type TransactionType = "Add" | "Consume" | "Dispose";

interface HandoverUser {
  id: number;
  full_name: string;
}

// A GRN batch of this inventory that stock can be consumed/disposed from.
interface StockBatch {
  /** Unique per row — the API can return several rows for the same GRN id. */
  key: string;
  id: number; // GRN id — sent back as grns[].grn_id on submit
  grn_number: string;
  expiry_date: string; // YYYY-MM-DD, '' when the GRN has none
  available: number;
}

const toNumber = (...values: unknown[]) => {
  for (const value of values) {
    const n = typeof value === "string" ? parseFloat(value) : value;
    if (typeof n === "number" && Number.isFinite(n)) return n;
  }
  return 0;
};

// "18/12/2025" (DD/MM/YYYY, as the API sends it) → "2025-12-18"; an ISO date passes through.
const toIsoDate = (value: unknown) => {
  const text = String(value ?? "").trim();
  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy)
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : "";
};

// One row of GET /pms/grns/get_grn_for_consumption.json:
// { id: 6162, grn_number: "100021", quantity: "99.0", expiry_date: "01/01/2026" }
const toStockBatch = (
  raw: Record<string, unknown>,
  index: number
): StockBatch | null => {
  const id = toNumber(raw.id);
  if (!id) return null;
  return {
    key: `${id}-${index}`,
    id,
    grn_number: String(raw.grn_number ?? `GRN-${id}`),
    expiry_date: toIsoDate(raw.expiry_date),
    available: toNumber(raw.quantity),
  };
};

// move_type values accepted by inventory_consumption_addition.json.
const ADD_MOVE_TYPE = "1";
const CONSUME_MOVE_TYPE = "2";
// consumption_type mirrors the option label: lower case, spaces -> underscores,
// e.g. "Issue to site" -> "issue_to_site".
const CONSUME_TYPE_OPTIONS = [
  { value: "consume", label: "Consume" },
  { value: "issue_to_site", label: "Issue to site" },
  { value: "replace_old_item", label: "Replace old item" },
  { value: "lost", label: "Lost" },
];
const DISPOSAL_REASON_OPTIONS = [
  { value: "expired", label: "Expired" },
  { value: "damaged", label: "Damaged" },
  { value: "other", label: "Other" },
];

const TRANSACTION_TYPES: TransactionType[] = ["Add", "Consume", "Dispose"];
const EXPIRING_SOON_DAYS = 90;

// Fallback range when the view page was opened without start/end dates:
// current month start -> today.
const getEffectiveRange = (startDate: string, endDate: string) => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return {
    effectiveStart: startDate || `${yyyy}-${mm}-01`,
    effectiveEnd: endDate || `${yyyy}-${mm}-${dd}`,
  };
};

const daysUntil = (ymd: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round(
    (new Date(`${ymd}T00:00:00`).getTime() - today.getTime()) / 86400000
  );
};

// Attachments are sent as base64 data URLs ("data:image/png;base64,...").
const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const hasValidDate = (ymd: string) =>
  Boolean(ymd) && !Number.isNaN(new Date(`${ymd}T00:00:00`).getTime());

const formatBatchDate = (ymd: string) =>
  hasValidDate(ymd)
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(`${ymd}T00:00:00`))
    : "-";

/** Nothing left to take (the API can report 0 or a negative balance). */
const hasNoStock = (batch: StockBatch) => batch.available <= 0;

const ExpiryPill = ({ expiryDate }: { expiryDate: string }) => {
  if (!hasValidDate(expiryDate)) return null;
  const days = daysUntil(expiryDate);
  if (days < 0) {
    return (
      <span className="rounded-full px-2 py-0.5 text-[11px] font-medium bg-[var(--color-error-bg)] text-[var(--color-error)]">
        Expired
      </span>
    );
  }
  if (days <= EXPIRING_SOON_DAYS) {
    return (
      <span className="rounded-full px-2 py-0.5 text-[11px] font-medium bg-[var(--color-warning-light)] text-amber-700">
        Expiring in {days} days
      </span>
    );
  }
  return (
    <span className="rounded-full px-2 py-0.5 text-[11px] font-medium bg-[var(--color-success-bg)] text-[var(--color-success-solid)]">
      Valid
    </span>
  );
};

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="mb-1.5 block text-xs font-medium text-gray-600">
    {children}
    {required && <span className="text-brand"> *</span>}
  </label>
);

const InfoItem = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p
      className={`mt-0.5 text-sm font-semibold ${highlight ? "text-brand" : "text-gray-900"}`}
    >
      {value || "-"}
    </p>
  </div>
);

const InventoryConsumptionAddPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchParams = new URLSearchParams(location.search);
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";
  const { effectiveStart, effectiveEnd } = getEffectiveRange(
    startDate,
    endDate
  );

  // Back to the ledger, keeping the date range it was opened with.
  const viewPath = `/maintenance/inventory-consumption/view/${id}${location.search}`;

  const { fetchedInventory, loading: inventoryLoading } = useSelector(
    (state: RootState) => state.inventoryEdit
  );
  const inventory =
    fetchedInventory && String(fetchedInventory.id) === String(id)
      ? fetchedInventory
      : null;
  const uom = inventory?.unit || "";

  // GRN batches of this inventory that Consume / Dispose quantities are allocated from.
  const [batches, setBatches] = useState<StockBatch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batchesError, setBatchesError] = useState(false);

  const [transactionType, setTransactionType] =
    useState<TransactionType>("Add");
  const [quantity, setQuantity] = useState("");
  const [grnNumber, setGrnNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [moveType, setMoveType] = useState(CONSUME_TYPE_OPTIONS[0].value);
  const [comments, setComments] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  // batch row key -> quantity taken from that row
  const [allocations, setAllocations] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Handover Details (Consume only)
  const [handoverEnabled, setHandoverEnabled] = useState(false);
  const [handoverTo, setHandoverTo] = useState<HandoverUser | null>(null);
  const [handoverUsers, setHandoverUsers] = useState<HandoverUser[]>([]);
  const [buildingId, setBuildingId] = useState<number | "">("");
  const [wingId, setWingId] = useState<number | "">("");
  const [floorId, setFloorId] = useState<number | "">("");
  const [areaId, setAreaId] = useState<number | "">("");

  const {
    buildings,
    wings,
    areas,
    floors,
    loading: locationLoading,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
  } = useLocationData();

  // Resolve the current site the same way MovementToSection does — there's no
  // per-page site selector here, so fall back to the globally selected site.
  const currentSiteId = useMemo(() => {
    const raw = localStorage.getItem("selectedSiteId");
    if (!raw) return null;
    const match = raw.match(/-?\d+/);
    return match ? Number(match[0]) : null;
  }, []);

  useEffect(() => {
    if (id) dispatch(fetchInventory(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentSiteId) {
      fetchBuildings(currentSiteId);
    }
  }, [currentSiteId]);

  useEffect(() => {
    if (buildingId) {
      fetchWings(Number(buildingId));
      fetchAreas(0, Number(buildingId));
      fetchFloors(0, Number(buildingId));
      setWingId("");
      setAreaId("");
      setFloorId("");
    }
  }, [buildingId]);

  useEffect(() => {
    if (wingId && buildingId) {
      fetchAreas(Number(wingId), Number(buildingId));
      fetchFloors(0, Number(buildingId), Number(wingId));
      setAreaId("");
      setFloorId("");
    }
  }, [wingId]);

  // GET /pms/grns/get_grn_for_consumption.json?resource_id=<inventory id> → { grns: [...] }
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    const baseUrl = localStorage.getItem("baseUrl");
    setBatchesLoading(true);
    setBatchesError(false);
    axios
      .get(`https://${baseUrl}/pms/grns/get_grn_for_consumption.json`, {
        params: { resource_id: id },
        headers: { Authorization: getAuthHeader() },
        signal: controller.signal,
      })
      .then((res) => {
        const rows: Record<string, unknown>[] = Array.isArray(res.data?.grns)
          ? res.data.grns
          : Array.isArray(res.data)
            ? res.data
            : [];
        setBatches(
          rows
            .map(toStockBatch)
            .filter((b): b is StockBatch => b !== null)
            // Oldest expiry first; batches without an expiry date go last, then by GRN number.
            .sort(
              (a, b) =>
                (a.expiry_date || "9999-12-31").localeCompare(
                  b.expiry_date || "9999-12-31"
                ) ||
                a.grn_number.localeCompare(b.grn_number, undefined, {
                  numeric: true,
                })
            )
        );
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error("Error fetching GRN batches", err);
        setBatches([]);
        setBatchesError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setBatchesLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  // Fetch the "Handover To" users list once on mount.
  useEffect(() => {
    const baseUrl = localStorage.getItem("baseUrl");
    axios
      .get(`https://${baseUrl}/pms/users/get_escalate_to_users.json`, {
        headers: { Authorization: getAuthHeader() },
      })
      .then((res) => setHandoverUsers(res.data?.users || []))
      .catch((err) => console.error("Error fetching handover users", err));
  }, []);

  const isAdd = transactionType === "Add";
  const isConsume = transactionType === "Consume";
  const isDispose = transactionType === "Dispose";
  const actionWord = isDispose ? "disposed" : "consumed";

  const handleTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    setMoveType(type === "Consume" ? CONSUME_TYPE_OPTIONS[0].value : "");
    setAllocations({});
    setSubmitAttempted(false);
    if (type !== "Consume") setHandoverEnabled(false);
  };

  const quantityNumber = parseInt(quantity, 10) || 0;
  const allocatedTotal = Object.values(allocations).reduce(
    (sum, v) => sum + (parseInt(v, 10) || 0),
    0
  );

  // Fill batches in expiry order until the requested quantity is covered.
  // Expired batches are included for both Consume and Dispose.
  const handleAutoFill = () => {
    let remaining = quantityNumber;
    const next: Record<string, string> = {};
    [...batches]
      // Skip rows with nothing left (a batch without an expiry date is used after the dated ones).
      .filter((b) => !hasNoStock(b))
      .sort((a, b) =>
        (a.expiry_date || "9999-12-31").localeCompare(
          b.expiry_date || "9999-12-31"
        )
      )
      .forEach((batch) => {
        if (remaining <= 0) return;
        const take = Math.min(batch.available, remaining);
        next[batch.key] = String(take);
        remaining -= take;
      });
    setAllocations(next);
    if (remaining > 0)
      toast.error(
        `Only ${quantityNumber - remaining} ${uom} available in batches`,
        { id: "batch-shortfall" } // one toast, not one per keystroke
      );
  };

  // Auto-fill batches whenever the quantity is entered/changed, the batches load,
  // or the transaction type switches between Consume and Dispose.
  useEffect(() => {
    if (isAdd || batchesLoading) return;
    if (quantityNumber <= 0) {
      setAllocations({});
      return;
    }
    if (batches.length > 0) handleAutoFill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantityNumber, batches, transactionType, batchesLoading]);

  const toggleBatch = (batch: StockBatch, checked: boolean) =>
    setAllocations((prev) => {
      const next = { ...prev };
      if (checked) next[batch.key] = next[batch.key] || "";
      else delete next[batch.key];
      return next;
    });

  const setBatchQuantity = (batch: StockBatch, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    const capped =
      digits === ""
        ? ""
        : String(Math.min(Number(digits), Math.max(0, batch.available)));
    setAllocations((prev) => ({ ...prev, [batch.key]: capped }));
  };

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    event.target.value = "";
  };

  // Field errors, shown once the user has tried to submit.
  const errors = {
    grnNumber: "",
    quantity: !quantity
      ? "Quantity is required"
      : quantityNumber <= 0
        ? "Quantity must be greater than 0"
        : !isAdd &&
            typeof inventory?.quantity === "number" &&
            quantityNumber > inventory.quantity
          ? `Quantity cannot exceed the available stock (${inventory.quantity})`
          : "",
    expiryDate: isAdd && !expiryDate ? "Expiry date is required" : "",
    moveType:
      !isAdd && !moveType
        ? isDispose
          ? "Select a disposal reason"
          : "Select a consume type"
        : "",
    comments:
      isDispose && !comments.trim() ? "Comment is required for disposal" : "",
    batches:
      !isAdd && batches.length > 0 && allocatedTotal !== quantityNumber
        ? `Selected from batches must equal the required quantity (${quantityNumber} ${uom})`
        : "",
    handoverTo:
      isConsume && handoverEnabled && !handoverTo
        ? "Handover To is required"
        : "",
    building:
      isConsume && handoverEnabled && buildingId === ""
        ? "Building is required"
        : "",
  };
  const firstError = Object.values(errors).find(Boolean);
  const showError = (key: keyof typeof errors) =>
    submitAttempted ? errors[key] : "";

  const handleBack = () => {
    navigate(viewPath);
  };

  const handleFormSubmit = async () => {
    if (!id) return;
    setSubmitAttempted(true);
    if (firstError) {
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);

    try {
      const encodedAttachments = await Promise.all(
        attachments.map(fileToDataUrl)
      );

      // Dispose sends the same payload as Consume: the consume move_type, with the
      // disposal reason carried in consumption_type (below).
      const payload: Record<string, unknown> = {
        move_type: isAdd ? ADD_MOVE_TYPE : CONSUME_MOVE_TYPE,
        resource_id: Number(id),
        quantity: quantityNumber,
        comments,
      };

      // consumption_type: "add" for Add; selected "Consume Type" (Consume) or
      // "Disposal Reason" (Dispose) label in lower case with spaces -> underscores.
      if (isAdd) {
        payload.consumption_type = "add";
      } else {
        const typeOptions = isDispose
          ? DISPOSAL_REASON_OPTIONS
          : CONSUME_TYPE_OPTIONS;
        payload.consumption_type = (
          typeOptions.find((o) => o.value === moveType)?.label || ""
        )
          .toLowerCase()
          .replace(/\s+/g, "_");
      }

      if (isAdd) {
        payload.grn_no = grnNumber.trim();
        payload.expiry_date = expiryDate;
        payload.attachments = encodedAttachments;
      } else {
        // Per-GRN split of the quantity (Consume / Dispose batch allocation). Rows of the same GRN
        // are added up into one entry per grn_id.
        const grns: {
          grn_id: number;
          quantity: number;
          attachments?: string[];
        }[] = Object.values(
          batches.reduce<Record<number, { grn_id: number; quantity: number }>>(
            (acc, batch) => {
              const qty = parseInt(allocations[batch.key] ?? "", 10) || 0;
              if (qty > 0) {
                acc[batch.id] ??= { grn_id: batch.id, quantity: 0 };
                acc[batch.id].quantity += qty;
              }
              return acc;
            },
            {}
          )
        );
        // The form has a single attachment field, so its files go on the first GRN entry.
        if (grns.length > 0 && encodedAttachments.length > 0) {
          grns[0].attachments = encodedAttachments;
        }
        payload.grns = grns;
      }

      if (isConsume && handoverEnabled) {
        if (buildingId !== "") payload.building_id = Number(buildingId);
        if (wingId !== "") payload.wing_id = Number(wingId);
        if (floorId !== "") payload.floor_id = Number(floorId);
        if (areaId !== "") payload.area_id = Number(areaId);
        if (handoverTo) {
          payload.handover_to_id = handoverTo.id;
          payload.handover_to = handoverTo.full_name;
        }
      }

      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      if (!baseUrl || !token) throw new Error("Missing baseUrl/token");

      const resp = await axios.post(
        `https://${baseUrl}/pms/inventories/inventory_consumption_addition.json`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Backend may return 200 with success:false and an errors field
      if (resp?.data && resp.data.success === false) {
        const rawErrors =
          resp.data.errors || resp.data.message || resp.data.error;
        toast.error(mapBackendError(rawErrors) || "Submission failed");
        return;
      }

      // Refresh the ledger so the view page shows the new entry even when it
      // was opened without a date range (it only fetches when both are set).
      await dispatch(
        fetchInventoryConsumptionDetails({
          id,
          start_date: effectiveStart,
          end_date: effectiveEnd,
        })
      ).unwrap();
      toast.success("Transaction submitted successfully");
      navigate(viewPath);
    } catch (err: any) {
      console.error("Submit error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      if (err.response?.status === 500) {
        toast.error("Internal Server Error");
      } else if (err.response?.status === 404) {
        toast.error(
          "Resource not found. Please check the request and try again."
        );
      } else {
        const apiMsg = mapBackendError(
          err.response?.data?.errors ||
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message
        );
        toast.error(
          apiMsg || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const locationSelect = (
    label: string,
    value: number | "",
    onChange: (v: number | "") => void,
    options: { id: number; name: string }[],
    disabled: boolean,
    error?: string
  ) => (
    <div>
      <FieldLabel required={label === "Building"}>{label}</FieldLabel>
      <FormControl fullWidth size="small" error={Boolean(error)}>
        <Select
          value={value}
          onChange={(e) =>
            onChange(e.target.value ? Number(e.target.value) : "")
          }
          displayEmpty
          disabled={disabled}
          renderValue={(selected) => {
            if (!selected)
              return <span className="text-gray-400">Select {label}</span>;
            return options.find((o) => o.id === Number(selected))?.name || "";
          }}
        >
          <MenuItem value="">Select {label}</MenuItem>
          {options.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {o.name}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Inventory Transaction
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage inventory additions, consumption, and disposal.
        </p>
      </div>

      <SectionCard title="Inventory Information">
        {inventoryLoading && !inventory ? (
          <p className="text-sm text-gray-500">Loading inventory…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <InfoItem label="Item Name" value={inventory?.name} />
            <InfoItem label="Item Code" value={inventory?.code} />
            <InfoItem label="Category" value={inventory?.category} />
            <InfoItem label="UOM" value={uom} />
            <InfoItem
              label="Available Stock"
              value={
                inventory ? `${inventory.quantity ?? 0} ${uom}`.trim() : ""
              }
              highlight
            />
          </div>
        )}
      </SectionCard>

      <SectionCard title="Transaction Type">
        {/* Native radios inside labels rather than role="radio" buttons — theme.css
            restyles every [role="radio"] (rounded-full + brand fill on all inner spans),
            which breaks these cards. The input is visually hidden but keeps keyboard
            and screen-reader behaviour. */}
        <div className="flex flex-wrap gap-3">
          {TRANSACTION_TYPES.map((type) => {
            const selected = transactionType === type;
            return (
              <label
                key={type}
                className={`flex min-w-[130px] cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-light ${
                  selected
                    ? "border-brand bg-brand-selected text-brand"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="transaction-type"
                  value={type}
                  checked={selected}
                  onChange={() => handleTypeChange(type)}
                  className="sr-only"
                />
                <i
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 bg-white ${
                    selected ? "border-brand" : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <i className="block h-2 w-2 rounded-full bg-brand" />
                  )}
                </i>
                {type}
              </label>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Transaction Details">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isAdd && (
              <div>
                <FieldLabel>GRN No. (optional)</FieldLabel>
                <TextField
                  value={grnNumber}
                  onChange={(e) => setGrnNumber(e.target.value)}
                  placeholder="e.g. GRN-2026-0152"
                  fullWidth
                  size="small"
                  error={Boolean(showError("grnNumber"))}
                  helperText={showError("grnNumber")}
                />
              </div>
            )}

            <div>
              <FieldLabel required>Quantity</FieldLabel>
              <TextField
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter quantity"
                fullWidth
                size="small"
                inputProps={{ inputMode: "numeric" }}
                error={Boolean(showError("quantity"))}
                helperText={showError("quantity")}
              />
            </div>

            {isAdd ? (
              <div>
                <FieldLabel required>Expiry Date</FieldLabel>
                <TextField
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  fullWidth
                  size="small"
                  error={Boolean(showError("expiryDate"))}
                  helperText={showError("expiryDate")}
                />
              </div>
            ) : (
              <div>
                <FieldLabel required>
                  {isDispose ? "Disposal Reason" : "Consume Type"}
                </FieldLabel>
                <FormControl
                  fullWidth
                  size="small"
                  error={Boolean(showError("moveType"))}
                >
                  <Select
                    value={moveType}
                    onChange={(e) => setMoveType(String(e.target.value))}
                    displayEmpty
                    renderValue={(selected) => {
                      const options = isDispose
                        ? DISPOSAL_REASON_OPTIONS
                        : CONSUME_TYPE_OPTIONS;
                      if (!selected)
                        return (
                          <span className="text-gray-400">Select a reason</span>
                        );
                      return (
                        options.find((o) => o.value === selected)?.label || ""
                      );
                    }}
                  >
                    {(isDispose
                      ? DISPOSAL_REASON_OPTIONS
                      : CONSUME_TYPE_OPTIONS
                    ).map((o) => (
                      <MenuItem key={o.value} value={o.value}>
                        {o.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {showError("moveType") && (
                    <FormHelperText>{showError("moveType")}</FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
          </div>

          {!isAdd && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  Select batches to {isDispose ? "dispose" : "consume"} from
                </p>
                {/* Auto-fill now runs automatically when the quantity is entered (see auto-fill effect)
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFill}
                  disabled={batches.length === 0 || quantityNumber <= 0}
                  className="border-brand text-brand hover:bg-brand-selected hover:text-brand"
                >
                  Auto-fill, earliest expiry first
                </Button>
                */}
              </div>

              {batchesLoading ? (
                <div
                  className="space-y-3"
                  aria-busy="true"
                  aria-label="Loading batches"
                >
                  {[0, 1, 2].map((row) => (
                    <div
                      key={row}
                      className="h-[72px] animate-pulse rounded-lg border border-gray-200 bg-gray-100"
                    />
                  ))}
                </div>
              ) : batches.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 py-6 text-center text-sm text-gray-500">
                  {batchesError
                    ? "Could not load batches for this item"
                    : "No batches available for this item"}
                </div>
              ) : (
                batches.map((batch) => {
                  const checked = batch.key in allocations;
                  // Not selectable: no stock left in the batch.
                  const noStock = hasNoStock(batch);
                  const locked = noStock;
                  return (
                    <div
                      key={batch.key}
                      aria-disabled={locked}
                      title={
                        noStock ? "No stock left in this batch" : undefined
                      }
                      className={`grid grid-cols-2 md:grid-cols-[auto_1fr_1fr_1fr_1fr] items-center gap-4 rounded-lg border px-4 py-3 ${
                        checked
                          ? "border-brand bg-brand-selected"
                          : "border-gray-200"
                      } ${locked ? "opacity-50" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={locked}
                        onChange={(e) => toggleBatch(batch, e.target.checked)}
                        className="h-4 w-4 accent-[var(--color-primary)] disabled:cursor-not-allowed"
                        aria-label={`Select batch ${batch.grn_number}`}
                      />
                      <div>
                        <p className="text-xs text-gray-500">GRN / Batch</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {batch.grn_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Expiry Date</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatBatchDate(batch.expiry_date)}
                          </span>
                          <ExpiryPill expiryDate={batch.expiry_date} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Available</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {batch.available}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          To be {actionWord}
                        </p>
                        <TextField
                          value={allocations[batch.key] ?? ""}
                          onChange={(e) =>
                            setBatchQuantity(batch, e.target.value)
                          }
                          placeholder="0"
                          disabled={locked}
                          size="small"
                          fullWidth
                          inputProps={{
                            inputMode: "numeric",
                            style: { textAlign: "right" },
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}

              {/* Green once the batch split covers the quantity exactly; red when over; neutral while short. */}
              <div
                aria-live="polite"
                className={`flex flex-wrap items-center justify-between gap-2 text-sm font-semibold ${
                  quantityNumber > 0 && allocatedTotal === quantityNumber
                    ? "text-[var(--color-success-solid)]"
                    : allocatedTotal > quantityNumber
                      ? "text-[var(--color-error)]"
                      : "text-gray-900"
                }`}
              >
                <span>
                  Selected from batches: {allocatedTotal} {uom}
                </span>
                <span>
                  Required: {quantityNumber} {uom}
                </span>
              </div>
              {showError("batches") && (
                <p className="text-xs text-[var(--color-error)]">
                  {showError("batches")}
                </p>
              )}
            </div>
          )}

          <div>
            <FieldLabel required={isDispose}>
              {isDispose ? "Comment" : "Comment (optional)"}
            </FieldLabel>
            <TextField
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={
                isDispose
                  ? "Describe why the stock is being disposed"
                  : "Enter comment"
              }
              fullWidth
              multiline
              minRows={3}
              error={Boolean(showError("comments"))}
              helperText={showError("comments")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "auto !important",
                  padding: "2px !important",
                  display: "flex",
                },
                "& .MuiInputBase-input[aria-hidden='true']": {
                  flex: 0,
                  width: 0,
                  height: 0,
                  padding: "0 !important",
                  margin: 0,
                  display: "none",
                },
                "& .MuiInputBase-input": {
                  resize: "none !important",
                },
              }}
            />
          </div>

          <div>
            <FieldLabel>Attachment</FieldLabel>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={handleFilesSelected}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border border-dashed border-gray-300 py-4 text-sm text-gray-500 hover:border-brand hover:text-brand transition-colors"
            >
              Click to upload images or documents
            </button>
            {attachments.length > 0 && (
              <ul className="mt-2 space-y-1">
                {attachments.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-1.5 text-sm text-gray-700"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      <span className="truncate">{file.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="text-gray-400 hover:text-gray-700"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SectionCard>

      {isConsume && (
        <SectionCard title="Handover Details">
          <label className="flex items-center gap-3 text-sm font-medium text-gray-900 cursor-pointer w-fit">
            <Switch
              checked={handoverEnabled}
              onCheckedChange={setHandoverEnabled}
            />
            Enable Handover
          </label>

          {handoverEnabled && (
            <div className="mt-4 space-y-4">
              <div>
                <FieldLabel required>Handover To</FieldLabel>
                {/* The app theme defaults every Autocomplete to disablePortal, which
                    renders the list inline inside this card; render it in a portal
                    like the other pages do so it isn't closed by the card's layout.
                    Once portalled, the list is outside .MuiAutocomplete-root, so the global
                    MUI select-search enhancer would inject its own search box into it and steal
                    focus (closing the list instantly) — the opt-out class prevents that. */}
                <Autocomplete
                  disablePortal={false}
                  openOnFocus
                  slotProps={{
                    paper: { className: "disable-mui-select-search" },
                  }}
                  options={handoverUsers}
                  value={handoverTo}
                  onChange={(_e, user) => setHandoverTo(user)}
                  getOptionLabel={(u) => u.full_name}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search employee or user"
                      size="small"
                      error={Boolean(showError("handoverTo"))}
                      helperText={showError("handoverTo")}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationSelect(
                  "Building",
                  buildingId,
                  setBuildingId,
                  buildings,
                  !currentSiteId || locationLoading.buildings,
                  showError("building")
                )}
                {locationSelect(
                  "Wing",
                  wingId,
                  setWingId,
                  wings,
                  !buildingId || locationLoading.wings
                )}
                {locationSelect(
                  "Floor",
                  floorId,
                  setFloorId,
                  floors,
                  !buildingId || locationLoading.floors
                )}
                {locationSelect(
                  "Area",
                  areaId,
                  setAreaId,
                  areas,
                  !buildingId || locationLoading.areas
                )}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      <div className="flex justify-end gap-3 pb-6">
        <Button
          onClick={handleBack}
          disabled={isSubmitting}
          variant="outline"
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          disabled={isSubmitting}
          className="bg-brand hover:bg-brand-hover text-white px-6"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <CircularProgress size={16} sx={{ color: "white" }} />
              Submitting...
            </span>
          ) : (
            "Submit Transaction"
          )}
        </Button>
      </div>
    </div>
  );
};

// Map backend error verbiage to friendly messages
function mapBackendError(raw: any): string {
  let msg = "";
  if (!raw) return msg;
  if (Array.isArray(raw)) msg = raw.join(", ");
  else if (typeof raw === "object") {
    try {
      msg = (Object.values(raw) as any[]).flat().join(", ");
    } catch {
      msg = JSON.stringify(raw);
    }
  } else if (typeof raw === "string") {
    msg = raw;
  }
  const normalized = msg.replace(/\s+/g, " ").trim();
  // Specific remap requested by product
  if (/difference\s+quantity\s+is\s+invalid/i.test(normalized)) {
    return "Quantity exceeds available stock";
  }
  return normalized || "";
}

export default InventoryConsumptionAddPage;
