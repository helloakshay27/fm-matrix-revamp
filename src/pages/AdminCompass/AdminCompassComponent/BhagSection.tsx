import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { toast } from "sonner";

// ── Design Tokens ──
const C = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#f6f4ee",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#e8e3de",
  tealBg: "#9EC8BA",
  cardBg: "#ffffff",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  font: "'Poppins', sans-serif",
};

// ── API Helpers ──
const apiUrl = (path: string): string => {
  let base = (localStorage.getItem("baseUrl") || "").replace(/\/$/, "");
  if (!base) return path;
  if (!base.startsWith("http://") && !base.startsWith("https://"))
    base = `https://${base}`;
  return `${base}${path}`;
};

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token") || "";
  const bearer = token
    ? token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`
    : "";
  return {
    "Content-Type": "application/json",
    ...(bearer ? { Authorization: bearer } : {}),
  };
};

// ── YouTube ID extractor ──
const extractYouTubeId = (url: string) => {
  if (!url) return null;
  const m = url.match(
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  );
  return m && m[2].length === 11 ? m[2] : null;
};

// ── Date Helpers ──
const toApiDate = (s: string): string => {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const p = s.split("-");
  if (p.length === 3 && p[2].length === 4) return `${p[2]}-${p[1]}-${p[0]}`;
  return s;
};

const toDisplayDate = (s: string): string => {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-");
    return `${d}-${m}-${y}`;
  }
  return s;
};

const clamp = (val: any): number => {
  const n = Math.round(Number(val));
  return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
};

const sliderBg = (pct: number) =>
  `linear-gradient(to right, ${C.primary} ${pct}%, #e5e7eb ${pct}%)`;

// ── Icons ──
const EditIcon = () => (
  <svg
    width="15"
    height="15"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const LoaderIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      style={{ opacity: 0.25 }}
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth={4}
    />
    <path
      style={{ opacity: 0.75 }}
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// ── Global CSS ──
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    @keyframes spin { to { transform: rotate(360deg); } }
    .bh-wrap, .bh-wrap * { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }

    /* ── Inputs ── */
    .bh-fld { width:100%; border:1px solid ${C.borderLgt}; border-radius:11px; padding:10px 13px; font-size:13px; color:${C.textMain}; background:#fff; outline:none; font-family:'Poppins',sans-serif; transition:border-color .15s,box-shadow .15s; }
    .bh-fld[type="date"] { padding: 9px 13px; cursor: pointer; }
    .bh-fld:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.14); }
    .bh-fld::placeholder { color:#a3a3a3; font-weight:400; }
    .bh-select { width:100%; border:1px solid ${C.borderLgt}; border-radius:11px; padding:10px 36px 10px 12px; font-size:13px; color:${C.textMain}; background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E") no-repeat right 10px center / 16px; -webkit-appearance:none; appearance:none; cursor:pointer; outline:none; transition:border-color .15s; font-family:'Poppins',sans-serif; }
    .bh-select:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.14); }

    /* ── Sliders ── */
    .bh-slider-card { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:99px; outline:none; cursor:pointer; }
    .bh-slider-card::-webkit-slider-thumb { -webkit-appearance:none; width:15px; height:15px; border-radius:50%; background:${C.primary}; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.18); cursor:pointer; transition:transform .15s; }
    .bh-slider-card::-webkit-slider-thumb:hover { transform:scale(1.2); }
    .bh-slider-modal { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; outline:none; cursor:pointer; }
    .bh-slider-modal::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:${C.primary}; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.2); cursor:pointer; transition:transform .15s; }
    .bh-slider-modal::-webkit-slider-thumb:hover { transform:scale(1.2); }

    /* ── Skeleton ── */
    .bh-skel { background:linear-gradient(90deg,rgba(255,255,255,0.2) 25%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.2) 75%); background-size:200% 100%; animation:bh-shimmer 1.4s infinite; border-radius:8px; }
    @keyframes bh-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }


    /* ── Initiative Cards ── */
    .bh-card { background:#fff; border-radius:16px; padding:16px; box-shadow:0 1px 4px rgba(0,0,0,0.07); transition:box-shadow .15s; }
    .bh-card:hover { box-shadow:0 4px 14px rgba(0,0,0,0.10); }
    .bh-card:hover .bh-card-actions { opacity:1; }
    .bh-card-actions { display:flex; gap:4px; opacity:0; transition:opacity .15s; background:#f9f9f7; border:1px solid ${C.borderLgt}; border-radius:10px; padding:3px; }
    .bh-card-actions button { background:none; border:none; padding:5px; border-radius:7px; cursor:pointer; color:#9ca3af; display:flex; align-items:center; transition:background .1s,color .1s; }
    .bh-card-actions .edit:hover { color:${C.primary}; background:#FFF3EE; }
    .bh-card-actions .del:hover { color:#ef4444; background:#fee2e2; }

    /* ── Modal Portal ── */
    .bh-modal-portal { position:fixed; inset:0; z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(0,0,0,0.42); backdrop-filter:blur(4px); }

    /* ── BHAG Modal ── */
    .bh-modal-box { background:${C.primaryBg}; border-radius:20px; border:1px solid ${C.primaryBord}; box-shadow:0 30px 80px rgba(0,0,0,0.20); width:100%; max-width:520px; display:flex; flex-direction:column; max-height:90vh; overflow:hidden; }
    .bh-modal-hd { background:#fff; border-bottom:1px solid ${C.primaryBord}; padding:18px 22px; display:flex; align-items:center; justify-content:space-between; }
    .bh-modal-hd-inner { display:flex; align-items:center; gap:10px; }
    .bh-modal-dot { width:10px; height:10px; border-radius:50%; background:${C.primary}; flex-shrink:0; }
    .bh-modal-title { font-size:16px; font-weight:800; color:${C.textMain}; margin:0; }
    .bh-modal-body { padding:22px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:18px; }
    .bh-modal-ft { background:#fff; border-top:1px solid ${C.primaryBord}; padding:14px 22px; display:flex; justify-content:flex-end; gap:10px; align-items:center; }

    /* ── Goal Modal ── */
    .bh-goal-modal-box { background:#fff; border-radius:18px; box-shadow:0 24px 64px rgba(0,0,0,0.18); width:100%; max-width:620px; display:flex; flex-direction:column; max-height:90vh; overflow:hidden; }
    .bh-goal-modal-hd { padding:24px 26px 0; display:flex; justify-content:space-between; align-items:flex-start; }
    .bh-goal-modal-body { padding:20px 26px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:18px; }
    .bh-goal-modal-ft { padding:0 26px 26px; }

    /* ── Buttons ── */
    .bh-btn-cancel { padding:9px 18px; font-size:13px; font-weight:700; border-radius:10px; border:1px solid ${C.borderLgt}; background:#fff; color:${C.textMain}; cursor:pointer; font-family:'Poppins',sans-serif; transition:background .15s; }
    .bh-btn-cancel:hover { background:#f5f5f5; }
    .bh-btn-save { padding:9px 22px; font-size:13px; font-weight:700; border-radius:10px; border:none; background:${C.primary}; color:#fff; cursor:pointer; font-family:'Poppins',sans-serif; display:flex; align-items:center; gap:7px; transition:background .15s; }
    .bh-btn-save:hover { background:${C.primaryHov}; }
    .bh-btn-save:disabled { opacity:0.65; cursor:not-allowed; }
    .bh-btn-full { width:100%; background:${C.primary}; color:#fff; border:none; border-radius:11px; padding:14px; font-size:15px; font-weight:800; cursor:pointer; font-family:'Poppins',sans-serif; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s; }
    .bh-btn-full:hover { background:${C.primaryHov}; }
    .bh-btn-full:disabled { opacity:0.65; cursor:not-allowed; }
    .bh-close-btn { background:none; border:none; cursor:pointer; color:#9ca3af; padding:5px; border-radius:8px; display:flex; align-items:center; transition:background .1s,color .1s; }
    .bh-close-btn:hover { background:#f3f4f6; color:${C.textMain}; }

    /* ── Field Label ── */
    .bh-label { display:block; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; color:${C.textMain}; margin-bottom:6px; }
    .bh-label-sub { font-size:11px; font-weight:500; text-transform:none; color:${C.textMuted}; }
    .bh-error { background:#fee2e2; border:1px solid #fca5a5; color:#991b1b; border-radius:12px; padding:10px 14px; font-size:13px; font-weight:600; }

    /* ── Progress Box ── */
    .bh-prog-box { background:${C.primaryBg}; border:1px solid ${C.primaryBord}; border-radius:12px; padding:14px 16px; }
    .bh-prog-num { width:52px; border:1px solid ${C.borderLgt}; border-radius:8px; text-align:center; padding:4px 6px; font-size:13px; font-weight:800; color:${C.textMain}; font-family:'Poppins',sans-serif; background:#fff; outline:none; }
    .bh-prog-num:focus { border-color:${C.primary}; }
  `}</style>
);

// ── Searchable User Select Component ──
const UserSelect = ({
  value,
  onChange,
  users,
  placeholder = "Search owner...",
}: any) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedUser = users.find((u: any) => u.id === value);
  const displayValue = selectedUser
    ? selectedUser.full_name ||
      `${selectedUser.firstname || ""} ${selectedUser.lastname || ""}`.trim()
    : "";

  const filteredUsers = users.filter((u: any) => {
    const name =
      u.full_name || `${u.firstname || ""} ${u.lastname || ""}`.trim();
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ position: "relative", zIndex: open ? 9999 : 1 }} ref={ref}>
      <input
        type="text"
        className="bh-fld"
        placeholder={placeholder}
        value={open ? search : displayValue}
        onClick={() => {
          setOpen(true);
          setSearch("");
        }}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        style={{ paddingRight: "32px", width: "100%" }}
      />
      {/* Dropdown Chevron */}
      <div
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#9ca3af",
          pointerEvents: "none",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "16px", height: "16px" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            marginBottom: "4px",
            backgroundColor: "#fff",
            border: `1px solid ${C.borderLgt}`,
            borderRadius: "12px",
            boxShadow: "0 -10px 20px rgba(0,0,0,0.08)",
            maxHeight: "192px",
            overflowY: "auto",
            overflowX: "hidden",
            borderColor: C.borderLgt,
            fontFamily: C.font,
          }}
        >
          {value && (
            <div
              style={{
                padding: "10px",
                fontSize: "13px",
                cursor: "pointer",
                borderBottom: `1px solid ${C.borderLgt}`,
                color: "#ef4444",
                fontWeight: 600,
                borderColor: C.borderLgt,
              }}
              onClick={() => {
                onChange("");
                setOpen(false);
                setSearch("");
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#fef2f2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Clear Selection
            </div>
          )}
          {filteredUsers.length === 0 ? (
            <div
              style={{
                padding: "12px",
                fontSize: "14px",
                color: C.textMuted,
                textAlign: "center",
              }}
            >
              No users found
            </div>
          ) : (
            filteredUsers.map((u: any) => {
              const name =
                u.full_name ||
                `${u.firstname || ""} ${u.lastname || ""}`.trim();
              return (
                <div
                  key={u.id}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                    borderBottom: `1px solid ${C.borderLgt}`,
                    borderColor: C.borderLgt,
                    color: C.textMain,
                  }}
                  onClick={() => {
                    onChange(u.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {name}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// ── Types ──
interface Initiative {
  id?: number;
  title: string;
  progress: number;
  description?: string;
  targetValue?: string;
  currentValue?: string;
  unit?: string;
  period?: string;
  targetDate?: string;
  ownerName?: string;
  ownerId?: string | number;
  status?: string;
  updateRemarks?: string;
}

// ── Modal Portal ──
const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return ReactDOM.createPortal(
    <div
      className="bh-modal-portal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
};

// ── Skeleton ──
const SkeletonCards = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    {[1, 2, 3, 4].map((n) => (
      <div
        key={n}
        style={{
          background: "rgba(255,255,255,0.3)",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <div
          className="bh-skel"
          style={{ height: 14, width: "70%", marginBottom: 12 }}
        />
        <div
          className="bh-skel"
          style={{ height: 5, width: "100%", marginTop: 16 }}
        />
      </div>
    ))}
  </div>
);

// ── Field wrapper helpers ──
const FieldGroup = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column" as const }}>
    {children}
  </div>
);

// ══════════════════════════════════════════════════
export const BhagSection = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);

  const [bhagStatement, setBhagStatement] = useState("");
  const [bhagVideoUrl, setBhagVideoUrl] = useState("");
  const [bhagTargetDate, setBhagTargetDate] = useState("");

  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [tempStatement, setTempStatement] = useState("");
  const [tempVideoUrl, setTempVideoUrl] = useState("");
  const [tempTargetDate, setTempTargetDate] = useState("");

  const [tempGoal, setTempGoal] = useState<Initiative | null>(null);
  const [tempGoalDate, setTempGoalDate] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Fetch BHAG Statement ──
  const fetchBhagStatement = useCallback(async () => {
    try {
      const res = await fetch(
        apiUrl(
          "/extra_fields?q[group_name_in][]=business_plan_bhag&include_grouped=true"
        ),
        { method: "GET", headers: authHeaders() }
      );
      if (!res.ok) return;
      const json = await res.json();
      const record = json?.grouped_data?.business_plan_bhag;
      if (!record) return;
      const stmt = Array.isArray(record.values)
        ? record.values[0] || ""
        : typeof record.values === "string"
          ? record.values
          : "";
      if (stmt) setBhagStatement(stmt);
      if (record.video_url) setBhagVideoUrl(record.video_url);
      if (record.target_date) setBhagTargetDate(record.target_date);
    } catch (e) {
      console.warn("[BhagSection] fetchBhagStatement:", e);
    }
  }, []);

  // ── Fetch Goals ──
  const fetchGoals = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const res = await fetch(apiUrl("/goals"), {
        method: "GET",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const records: any[] = Array.isArray(json)
        ? json
        : json.goals || json.data || [];
      const bhagGoals = records.filter((g: any) => {
        const p = (g.period || "").toUpperCase();
        return p === "BHAG" || p.includes("BHAG");
      });
      setInitiatives(
        bhagGoals.map((g: any, idx: number) => ({
          id: g.id ?? idx + 1,
          title: g.title || g.name || "Untitled",
          progress: clamp(g.progress_percentage ?? g.progress ?? 0),
          description: g.description || "",
          targetValue: String(g.target_value ?? "1"),
          currentValue: String(g.current_value ?? "0"),
          unit: g.unit || "days",
          period: g.period || "BHAG",
          targetDate: g.target_date || "",
          ownerName: g.owner_name || "",
          ownerId: g.owner_id || "",
          status: "not_started",
          updateRemarks: g.update_remarks || "",
        }))
      );
    } catch (err: any) {
      setFetchError(err.message || "Failed to load BHAG data");
    } finally {
      setIsFetching(false);
    }
  }, []);

  // ── Fetch Users ──
  const fetchUsers = useCallback(async () => {
    const orgId =
      localStorage.getItem("org_id") ||
      localStorage.getItem("organization_id") ||
      "";
    if (!orgId) return;
    try {
      const res = await fetch(apiUrl(`/api/users?organization_id=${orgId}`), {
        method: "GET",
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsersList(Array.isArray(data) ? data : data.users || data.data || []);
    } catch (err) {
      console.error("[BhagSection] fetchUsers:", err);
    }
  }, []);

  useEffect(() => {
    fetchBhagStatement();
    fetchGoals();
    fetchUsers();
  }, [fetchBhagStatement, fetchGoals, fetchUsers]);

  // ── Save BHAG Statement ──
  const saveBhagStatement = async () => {
    if (!tempStatement.trim()) {
      setSaveError("BHAG Statement cannot be empty.");
      toast.error("BHAG Statement cannot be empty.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      const apiDate = tempTargetDate ? toApiDate(tempTargetDate) : "";
      const payload: any = {
        goal: {
          title: tempGoal.title.trim(),
          description: tempGoal.description || "",
          target_value: Number(tempGoal.targetValue) || 1,
          current_value: Number(tempGoal.currentValue) || 0, // send as-is, e.g. 0.75
          unit: tempGoal.unit || "days",
          period: tempGoal.period || "BHAG", // ✅ use actual period
          status: tempGoal.status || "On Track",
          target_date: tempGoalDate ? toApiDate(tempGoalDate) : "",
          update_remarks: tempGoal.updateRemarks || "",
        },
      };

      // ✅ only include owner_id if actually set (no undefined in JSON)
      if (tempGoal.ownerId) {
        payload.goal.owner_id = Number(tempGoal.ownerId);
      }
      if (tempVideoUrl.trim())
        payload.extra_field.video_url = tempVideoUrl.trim();
      if (apiDate) payload.extra_field.target_date = apiDate;
      const res = await fetch(apiUrl("/extra_fields/bulk_upsert"), {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      setBhagStatement(tempStatement.trim());
      setBhagVideoUrl(tempVideoUrl.trim());
      setBhagTargetDate(apiDate);
      closeModal();
      fetchGoals();
      toast.success("BHAG Statement saved successfully!");
    } catch (err: any) {
      setSaveError(err.message || "Failed to save BHAG statement.");
      toast.error(err.message || "Failed to save BHAG statement.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Save Goal ──
  const saveGoalDetails = async () => {
    if (!tempGoal) return;
    if (!tempGoal.title.trim()) {
      setSaveError("Goal title cannot be empty.");
      toast.error("Goal title cannot be empty.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    const payload = {
      goal: {
        title: tempGoal.title.trim(),
        description: tempGoal.description || "",
        target_value: Number(tempGoal.targetValue) || 1,
        current_value: Number(tempGoal.currentValue) || 0,
        progress_percentage: clamp(tempGoal.progress),
        unit: tempGoal.unit || "days",
        period: "BHAG",
        status: tempGoal.status || "On Track",
        owner_id: tempGoal.ownerId ? Number(tempGoal.ownerId) : undefined,
        target_date: tempGoalDate ? toApiDate(tempGoalDate) : "",
        update_remarks: tempGoal.updateRemarks || "",
      },
    };
    try {
      const res = editingGoalId
        ? await fetch(apiUrl(`/goals/${editingGoalId}`), {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(payload),
          })
        : await fetch(apiUrl("/goals"), {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(payload),
          });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      closeModal();
      fetchGoals();
      toast.success(
        editingGoalId
          ? "Goal updated successfully!"
          : "Goal created successfully!"
      );
    } catch (err: any) {
      setSaveError(err.message || "Error saving goal.");
      toast.error(err.message || "Error saving goal.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Card slider inline update ──
  const handleCardSlider = async (id: number, val: string) => {
    const c = clamp(val);
    setInitiatives((prev) =>
      prev.map((i) => (i.id === id ? { ...i, progress: c } : i))
    );
    try {
      const res = await fetch(apiUrl(`/goals/${id}`), {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({
          goal: { progress_percentage: c, current_value: c },
        }),
      });
      if (!res.ok) fetchGoals();
    } catch {
      fetchGoals();
    }
  };

  const deleteGoal = async (id: number) => {
    if (!window.confirm("Delete this initiative?")) return;
    try {
      const res = await fetch(apiUrl(`/goals/${id}`), {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchGoals();
      toast.success("Initiative deleted successfully!");
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSaveError(null);
    setTempGoal(null);
    setTempGoalDate("");
    setEditingGoalId(null);
  };

  const openBhagModal = () => {
    setTempStatement(bhagStatement);
    setTempVideoUrl(bhagVideoUrl);
    setTempTargetDate(bhagTargetDate);
    setSaveError(null);
    setActiveModal("bhag_statement");
  };

  const openGoalModal = (goal: Initiative) => {
    setTempGoal({ ...goal });
    setTempGoalDate(goal.targetDate || "");
    setEditingGoalId(goal.id ?? null);
    setSaveError(null);
    setActiveModal("goal_details");
  };

  const addInitiative = () => {
    setTempGoal({
      title: "",
      progress: 0,
      description: "",
      targetValue: "1",
      currentValue: "0",
      unit: "days",
      period: "BHAG",
      status: "On Track",
      ownerId: "",
      updateRemarks: "",
    });
    setTempGoalDate("");
    setEditingGoalId(null);
    setSaveError(null);
    setActiveModal("goal_details");
  };

  const handleProgressChange = (val: string) => {
    const c = clamp(val);
    setTempGoal((prev: any) => ({
      ...prev,
      progress: c,
      currentValue: String(c),
    }));
  };

  const ytId = extractYouTubeId(bhagVideoUrl);

  return (
    <div className="bh-wrap" style={{ padding: "24px 0", fontFamily: C.font }}>
      <Styles />

      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: C.tealBg,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* ── 1. Video (edge-to-edge) ── */}
        {!isFetching && ytId && (
          <div
            style={{
              width: "100%",
              position: "relative",
              paddingTop: "56.25%",
              background: "#000",
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
              title="BHAG Vision Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* ── 2. Dark header bar (Updated to Deep Teal) ── */}
        <div
          style={{
            background: "#1E3F36",
            color: "#fff",
            padding: "18px 22px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.7)",
                marginBottom: 7,
              }}
            >
              Long Term — BHAG
            </div>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                lineHeight: 1.45,
                color: "#fff",
                margin: 0,
              }}
            >
              {isFetching
                ? "Loading…"
                : bhagStatement ||
                  "No BHAG statement yet — click ✏️ to add one."}
            </h2>
            {!isFetching && bhagTargetDate && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.14)",
                  color: "#fff",
                }}
              >
                Target: {toDisplayDate(bhagTargetDate)}
              </span>
            )}
          </div>
          <button
            onClick={openBhagModal}
            style={{
              flexShrink: 0,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 10,
              padding: "8px 9px",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              transition: "background .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
          >
            <EditIcon />
          </button>
        </div>

        {/* ── 3. Initiatives body ── */}
        <div style={{ padding: "20px 22px 24px" }}>
          {fetchError && (
            <div
              style={{
                marginBottom: 16,
                background: "#fee2e2",
                border: "1px solid #fca5a5",
                color: "#991b1b",
                borderRadius: 12,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span>⚠ {fetchError}</span>
              <button
                onClick={() => {
                  fetchBhagStatement();
                  fetchGoals();
                }}
                style={{
                  fontSize: 12,
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#991b1b",
                }}
              >
                Retry
              </button>
            </div>
          )}

          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#1a1a1a",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Key Initiatives (BHAG)
            {isFetching && <LoaderIcon size={13} />}
          </div>

          {/* Cards Grid Updated to exactly 2 columns */}
          {isFetching ? (
            <SkeletonCards />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {initiatives.length === 0 && !fetchError && (
                <p
                  style={{
                    gridColumn: "1/-1",
                    fontSize: 13,
                    color: C.textMuted,
                    fontStyle: "italic",
                    margin: "4px 0",
                  }}
                >
                  No initiatives found. Add one below.
                </p>
              )}
              {initiatives.map((ini) => (
                <div key={ini.id} className="bh-card">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 13,
                          height: 13,
                          borderRadius: "50%",
                          border: `3px solid ${C.primary}`,
                          background: "#fff",
                          flexShrink: 0,
                          marginTop: 3,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.textMain,
                          lineHeight: 1.45,
                        }}
                      >
                        {ini.title}
                      </span>
                    </div>
                    <div className="bh-card-actions">
                      <button
                        className="edit"
                        onClick={() => openGoalModal(ini)}
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="del"
                        onClick={() => deleteGoal(ini.id as number)}
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={ini.progress}
                      onChange={(e) =>
                        handleCardSlider(ini.id as number, e.target.value)
                      }
                      className="bh-slider-card"
                      style={{ background: sliderBg(ini.progress) }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.textMuted,
                        minWidth: 34,
                        textAlign: "right",
                      }}
                    >
                      {ini.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={addInitiative}
              style={{
                fontSize: 13,
                fontWeight: 700,
                padding: "9px 20px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.5)",
                color: C.primary,
                cursor: "pointer",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.5)")
              }
            >
              + Add New Initiative
            </button>
          </div>
        </div>

        {/* ════════════════════════════
            MODAL 1 — Edit BHAG
        ════════════════════════════ */}
        {activeModal === "bhag_statement" && (
          <Modal onClose={closeModal}>
            <div className="bh-modal-box">
              <div className="bh-modal-hd">
                <div className="bh-modal-hd-inner">
                  <div className="bh-modal-dot" />
                  <h2 className="bh-modal-title">Edit BHAG</h2>
                </div>
                <button className="bh-close-btn" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>

              <div className="bh-modal-body">
                {saveError && <div className="bh-error">{saveError}</div>}

                <FieldGroup>
                  <label className="bh-label">
                    BHAG Statement <span style={{ color: C.primary }}>*</span>
                  </label>
                  <textarea
                    value={tempStatement}
                    onChange={(e) => setTempStatement(e.target.value)}
                    placeholder="e.g. Become the leading property management solution in India by 2030"
                    className="bh-fld"
                    style={{
                      minHeight: 88,
                      resize: "vertical",
                      fontWeight: 600,
                    }}
                  />
                </FieldGroup>

                <FieldGroup>
                  <label className="bh-label">
                    Video URL <span className="bh-label-sub">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={tempVideoUrl}
                    onChange={(e) => setTempVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=…"
                    className="bh-fld"
                  />
                </FieldGroup>

                <FieldGroup>
                  <label className="bh-label">
                    Target Date <span className="bh-label-sub">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={tempTargetDate}
                    onChange={(e) => setTempTargetDate(e.target.value)}
                    className="bh-fld"
                  />
                </FieldGroup>
              </div>

              <div className="bh-modal-ft">
                <button
                  className="bh-btn-cancel"
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  className="bh-btn-save"
                  onClick={saveBhagStatement}
                  disabled={isSaving}
                >
                  {isSaving ? <LoaderIcon /> : <CheckIcon />}
                  {isSaving ? "Saving…" : "Save Vision"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ════════════════════════════
            MODAL 2 — Create / Edit Goal
        ════════════════════════════ */}
        {activeModal === "goal_details" && tempGoal && (
          <Modal onClose={closeModal}>
            <div className="bh-goal-modal-box">
              <div className="bh-goal-modal-hd">
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 19,
                      fontWeight: 800,
                      color: C.textMain,
                    }}
                  >
                    {editingGoalId
                      ? "Edit Initiative"
                      : "Create New Initiative"}
                  </h2>
                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: 13,
                      color: C.textMuted,
                    }}
                  >
                    Set a measurable target that contributes to your BHAG
                  </p>
                </div>
                <button
                  className="bh-close-btn"
                  onClick={closeModal}
                  style={{ marginTop: 2 }}
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="bh-goal-modal-body">
                {saveError && <div className="bh-error">{saveError}</div>}

                <FieldGroup>
                  <label className="bh-label">
                    Initiative Title <span style={{ color: C.primary }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={tempGoal.title}
                    placeholder="e.g. Hire B2B Enterprise Sales Head"
                    onChange={(e) =>
                      setTempGoal({ ...tempGoal, title: e.target.value })
                    }
                    className="bh-fld"
                  />
                </FieldGroup>

                <FieldGroup>
                  <label className="bh-label">Description</label>
                  <textarea
                    placeholder="Add detailed description…"
                    value={tempGoal.description || ""}
                    onChange={(e) =>
                      setTempGoal({ ...tempGoal, description: e.target.value })
                    }
                    className="bh-fld"
                    style={{ minHeight: 76, resize: "vertical" }}
                  />
                </FieldGroup>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <FieldGroup>
                    <label className="bh-label">Target Value</label>
                    <input
                      type="number"
                      step="any"
                      value={tempGoal.targetValue || ""}
                      placeholder="e.g. 100"
                      onChange={(e) =>
                        setTempGoal({
                          ...tempGoal,
                          targetValue: e.target.value,
                        })
                      }
                      className="bh-fld"
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <label className="bh-label">Target Date</label>
                    <input
                      type="date"
                      value={tempGoalDate}
                      onChange={(e) => setTempGoalDate(e.target.value)}
                      className="bh-fld"
                    />
                  </FieldGroup>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 14,
                  }}
                >
                  <FieldGroup>
                    <label className="bh-label">Owner ID</label>
                    <UserSelect
                      value={tempGoal.ownerId}
                      onChange={(id: any) =>
                        setTempGoal({ ...tempGoal, ownerId: id })
                      }
                      users={usersList}
                      placeholder="Search owner..."
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <label className="bh-label">Unit</label>
                    <select
                      value={tempGoal.unit || ""}
                      onChange={(e) =>
                        setTempGoal({ ...tempGoal, unit: e.target.value })
                      }
                      className="bh-select"
                    >
                      <option value="">Select unit</option>
                      <option value="%">%</option>
                      <option value="days">Days</option>
                      <option value="Amount">Amount</option>
                      <option value="count">Count</option>
                    </select>
                  </FieldGroup>
                  <FieldGroup>
                    <label className="bh-label">Status</label>
                    <select
                      value={tempGoal.status || "not_started"}
                      onChange={(e) =>
                        setTempGoal({ ...tempGoal, status: e.target.value })
                      }
                      className="bh-select"
                    >
                      <option>Not Started</option>
                      <option>On Track</option>
                      <option>Behind</option>
                      <option value="achieved">Achieved</option>
                    </select>
                  </FieldGroup>
                </div>

                {editingGoalId && (
                  <div className="bh-prog-box">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.textMain,
                        }}
                      >
                        Current Progress
                      </label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={tempGoal.progress}
                          onChange={(e) => handleProgressChange(e.target.value)}
                          className="bh-prog-num"
                        />
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: C.textMuted,
                          }}
                        >
                          %
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={tempGoal.progress}
                      onChange={(e) => handleProgressChange(e.target.value)}
                      className="bh-slider-modal"
                      style={{ background: sliderBg(tempGoal.progress) }}
                    />
                  </div>
                )}

                {editingGoalId && (
                  <FieldGroup>
                    <label className="bh-label">Update Remarks</label>
                    <textarea
                      placeholder="Add notes about progress…"
                      value={tempGoal.updateRemarks || ""}
                      onChange={(e) =>
                        setTempGoal({
                          ...tempGoal,
                          updateRemarks: e.target.value,
                        })
                      }
                      className="bh-fld"
                      style={{ minHeight: 60, resize: "vertical" }}
                    />
                  </FieldGroup>
                )}
              </div>

              <div className="bh-goal-modal-ft">
                <button
                  onClick={saveGoalDetails}
                  disabled={isSaving}
                  className="bh-btn-full"
                >
                  {isSaving && <LoaderIcon />}
                  {isSaving
                    ? "Saving…"
                    : editingGoalId
                      ? "Save Changes"
                      : "Create Initiative"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
