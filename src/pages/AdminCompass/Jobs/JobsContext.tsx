// @ts-nocheck
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  AI_KRAS,
  genAiKpis,
  DEPARTMENTS,
  TARGET_FREQ,
  DATA_SOURCES,
  MODULES_BY_SOURCE,
  INITIAL_DEPTS,
  SEED_MEMBERS,
  COLORS,
} from "./constants";
import { fetchKpiUnits, saveKpiUnits } from "./kpiUnitsApi";
import { fetchActivityLogs, LOGS_PER_PAGE } from "./activityLogsApi";
import { fetchKpis, createKpi, updateKpi, toKpiPayload } from "./kpisApi";
import { fetchJobDescriptions } from "./jobDescriptionsApi";
import { fetchKras, fetchAllKras, createKra, updateKra, updateKraStatus } from "./krasApi";
import { fetchEscalateToUsers } from "./usersApi";
import { firstDefined } from "./apiClient";
import { assignJobDescriptionMembers } from "./api/jobsApi";
import { useEscalateUsers } from "./hooks/useEscalateUsers";

const JobsContext = createContext(null);

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used within JobsProvider");
  return ctx;
}

export function JobsProvider({ children }) {
  const queryClient = useQueryClient();
  const [activeNav, setActiveNav] = useState("jobs");
  const [jobTab, setJobTab] = useState("descriptions");
  const [view, setView] = useState("list");
  const [viewingJd, setViewingJd] = useState(null);
  const [step, setStep] = useState(0);
  const [jdMethod, setJdMethod] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [kraAiDone, setKraAiDone] = useState(false);
  const [kpiAiLoading, setKpiAiLoading] = useState(false);
  const [kpiAiDone, setKpiAiDone] = useState(false);
  // Seed/demo rows nahi — dono lists API se aati hain. (Seed ke ids real ids se
  // takra jaate the, jisse KPI list me galat JD/KRA naam dikh sakte the.)
  const [allJds, setAllJds] = useState([]);
  const [allKras, setAllKras] = useState([]);
  const [allKpis, setAllKpis] = useState([]);
  const [kpisLoading, setKpisLoading] = useState(false);
  const [kpisError, setKpisError] = useState(null);
  const [kpisSaving, setKpisSaving] = useState(false);

  // Fetch escalate users from API
  const { data: escalateUsers = [] } = useEscalateUsers();

  const [jdSearch, setJdSearch] = useState("");
  const [kraSearch, setKraSearch] = useState("");
  const [kpiSearch, setKpiSearch] = useState("");
  const [assignModal, setAssignModal] = useState(null);
  // JD assign multi-select — API `assignee_ids` ki poori list leta hai.
  const [assignJdUserIds, setAssignJdUserIds] = useState([]);
  const [jdAssignSaving, setJdAssignSaving] = useState(false);
  const [expandedKra, setExpandedKra] = useState(null);
  const [showAddKra, setShowAddKra] = useState(false);
  const [krasSaving, setKrasSaving] = useState(false);
  // KRA modals me dikhaya jane wala "member ka total weightage" hint.
  const [assigneeKraUsage, setAssigneeKraUsage] = useState({
    assigneeId: null,
    used: 0,
    loading: false,
  });
  const [showAddKpi, setShowAddKpi] = useState(false);
  const [newKra, setNewKra] = useState({
    jdId: "",
    title: "",
    desc: "",
    weightage: "",
    assignee: "",
    assigneeId: "",
    effectiveFrom: "",
    effectiveTo: "",
    status: "active",
  });
  const [newKpi, setNewKpi] = useState({
    jdId: "",
    kraId: "",
    departmentId: "",
    name: "",
    unit: "",
    weightage: "",
    assignee: "",
    assigneeIds: [],
    target: "",
    freq: "",
    updateType: "manual",
    dataSource: "",
    module: "",
    measurementType: "positive",
  });
  const [kraDeptFilter, setKraDeptFilter] = useState("all");
  const [kraRoleFilter, setKraRoleFilter] = useState("all");
  const [kraMemberFilter, setKraMemberFilter] = useState("all");
  const [kpiDeptFilter, setKpiDeptFilter] = useState("all");
  const [kpiRoleFilter, setKpiRoleFilter] = useState("all");
  const [kpiMemberFilter, setKpiMemberFilter] = useState("all");
  const [kraViewMode, setKraViewMode] = useState("list");
  const [kpiViewMode, setKpiViewMode] = useState("list");
  const [actionMenuJd, setActionMenuJd] = useState(null);
  const [editingJd, setEditingJd] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    dept: "",
    deptId: "",
    reportingTo: "",
    type: "",
    level: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    summary: "",
    responsibilities: "",
    qualifications: "",
    skills: "",
    niceToHave: "",
  });
  const [actionMenuMember, setActionMenuMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [assignKraMemberModal, setAssignKraMemberModal] = useState(null);
  const [assignKraMemberKraId, setAssignKraMemberKraId] = useState("");
  const [assignKpiMemberModal, setAssignKpiMemberModal] = useState(null);
  const [assignKpiMemberKpiId, setAssignKpiMemberKpiId] = useState("");
  // [{ name, isDefault }] — sourced entirely from the API, nothing hardcoded.
  const [customUnits, setCustomUnits] = useState([]);
  const [newUnitInput, setNewUnitInput] = useState("");
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [unitsSaving, setUnitsSaving] = useState(false);
  const [unitsError, setUnitsError] = useState(null);
  // Activity logs come from /kras/activity_logs.json — no seed data.
  const [activityLogs, setActivityLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState(null);
  const [logsPage, setLogsPage] = useState(1);
  const [logsMeta, setLogsMeta] = useState({
    total: undefined,
    totalPages: undefined,
    hasMore: false,
    perPage: LOGS_PER_PAGE,
  });
  const [editingKraId, setEditingKraId] = useState(null);
  const [editKraForm, setEditKraForm] = useState({});
  const [editingKpiId, setEditingKpiId] = useState(null);
  const [editKpiForm, setEditKpiForm] = useState({});
  const [assignKraModal, setAssignKraModal] = useState(null);
  const [assignKpiModal, setAssignKpiModal] = useState(null);
  const [assignKraName, setAssignKraName] = useState("");
  const [assignKpiName, setAssignKpiName] = useState("");
  const [assignKpiUserIds, setAssignKpiUserIds] = useState([]);
  const [kpiAssignUsers, setKpiAssignUsers] = useState([]);
  const [kpiAssignUsersLoading, setKpiAssignUsersLoading] = useState(false);
  const [kpiAssignUsersError, setKpiAssignUsersError] = useState(null);
  const [kpiModalJdsLoading, setKpiModalJdsLoading] = useState(false);
  const [kpiModalJdsError, setKpiModalJdsError] = useState(null);
  const [kpiModalKras, setKpiModalKras] = useState([]);
  const [kpiModalKrasLoading, setKpiModalKrasLoading] = useState(false);
  const [kpiModalKrasError, setKpiModalKrasError] = useState(null);
  const [kpiKraSearch, setKpiKraSearch] = useState("");

  /* ── Setup / Org state ── */
  const [setupTab, setSetupTab] = useState("company");
  const [logoPreview, setLogoPreview] = useState(null);
  const [departments, setDepartments] = useState(INITIAL_DEPTS);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptSearch, setDeptSearch] = useState("");
  const [deptForm, setDeptForm] = useState({
    name: "",
    head: "",
    members: "",
    description: "",
    status: "active",
  });
  const fileRef = useRef(null);

  /* ── Members state ── */
  const [allMembers, setAllMembers] = useState(SEED_MEMBERS);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberDeptFilter, setMemberDeptFilter] = useState("all");
  const [memberStatusFilter, setMemberStatusFilter] = useState("all");
  const [memberGroupView, setMemberGroupView] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMode, setInviteMode] = useState("single");
  const [inviteRows, setInviteRows] = useState([
    { name: "", email: "", department: "" },
  ]);
  const [editingMember, setEditingMember] = useState(null);
  const [editMemberForm, setEditMemberForm] = useState({
    name: "",
    email: "",
    department: "",
    isHOD: false,
  });

  /* Stepper form */
  const [jobForm, setJobForm] = useState({
    title: "",
    dept: "",
    deptId: "",
    reportingTo: "",
    type: "",
    level: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    summary: "",
    responsibilities: "",
    qualifications: "",
    skills: "",
    niceToHave: "",
  });
  const [formKras, setFormKras] = useState([]);
  const [formKpis, setFormKpis] = useState([]);
  const sf = (k, v) => setJobForm((f) => ({ ...f, [k]: v }));

  /* Helpers */
  const sameId = (a, b) => String(a ?? "") === String(b ?? "");
  const toNum = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  };
  const jdTitle = (id) =>
    allKpis.find((p) => sameId(p.jdId, id))?.jdTitleFromApi ||
    allJds.find((j) => sameId(j.id, id))?.title ||
    "—";
  const kraName = (id) =>
    allKpis.find((p) => sameId(p.kraId, id))?.kraName ||
    allKras.find((k) => sameId(k.id, id))?.title ||
    "—";
  const kraCountFor = (jdId) => allKras.filter((k) => k.jdId === jdId).length;
  const kpiCountFor = (jdId) =>
    allKpis.filter((p) => sameId(p.jdId, jdId)).length;
  const krasForJd = (jdId) => allKras.filter((k) => sameId(k.jdId, jdId));
  const initials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  const showToast = (msg, type = "success") => toast[type](msg);
  const totalKpiWeight = formKpis.reduce(
    (s, k) => s + (Number(k.weightage) || 0),
    0
  );

  /* AI simulation */
  const simulateAiJd = () => {
    setAiLoading(true);
    setTimeout(() => {
      sf(
        "summary",
        `We are looking for a talented ${jobForm.title || "professional"} to join our ${jobForm.dept || "team"} with ${jobForm.level || "relevant"} experience.`
      );
      sf(
        "responsibilities",
        "• Lead end-to-end ownership of assigned workstreams\n• Collaborate cross-functionally with design, engineering, and business\n• Define and track key metrics\n• Conduct regular reviews\n• Present progress reports to leadership"
      );
      sf(
        "qualifications",
        `• ${jobForm.level === "Senior" || jobForm.level === "Lead" ? "5+" : "2+"}  years of relevant experience\n• Strong analytical abilities\n• Excellent communication skills\n• Relevant degree`
      );
      sf(
        "skills",
        "• Proficiency in industry tools\n• Data-driven decision making\n• Stakeholder management"
      );
      sf(
        "niceToHave",
        "• Agile experience\n• Startup background\n• Domain certifications"
      );
      setAiLoading(false);
      setJdMethod("ai");
    }, 2200);
  };
  const simulateAiKras = () => {
    setAiLoading(true);
    setTimeout(() => {
      setFormKras(
        AI_KRAS.map((k, i) => ({ ...k, assignee: "", id: Date.now() + i }))
      );
      setAiLoading(false);
      setKraAiDone(true);
    }, 1800);
  };
  const simulateAiKpis = () => {
    setKpiAiLoading(true);
    setTimeout(() => {
      const gen = [];
      formKras.forEach((kra, idx) => {
        genAiKpis(kra.title).forEach((kpi) => {
          gen.push({
            ...kpi,
            assignee: "",
            kraIdx: idx,
            id: Date.now() + Math.random() * 10000,
          });
        });
      });
      setFormKpis(gen);
      setKpiAiLoading(false);
      setKpiAiDone(true);
    }, 1800);
  };

  /* Form CRUD */
  const addFormKra = () =>
    setFormKras((k) => [
      ...k,
      {
        id: Date.now(),
        title: "",
        desc: "",
        weightage: "",
        assignee: "",
        effectiveFrom: "",
        effectiveTo: "",
        status: "active",
      },
    ]);
  const updFormKra = (id, f, v) =>
    setFormKras((ks) => ks.map((k) => (k.id === id ? { ...k, [f]: v } : k)));
  const remFormKra = (id) => {
    const idx = formKras.findIndex((k) => k.id === id);
    setFormKras((ks) => ks.filter((k) => k.id !== id));
    setFormKpis((ps) =>
      ps
        .filter((p) => p.kraIdx !== idx)
        .map((p) => ({
          ...p,
          kraIdx: p.kraIdx > idx ? p.kraIdx - 1 : p.kraIdx,
        }))
    );
  };
  const addFormKpi = (kraIdx) =>
    setFormKpis((p) => [
      ...p,
      {
        id: Date.now() + Math.random() * 1000,
        kraIdx,
        name: "",
        unit: "",
        weightage: "",
        assignee: "",
        target: "",
        freq: "",
        updateType: "manual",
        dataSource: "",
        module: "",
        measurementType: "positive",
      },
    ]);
  const updFormKpi = (id, f, v) =>
    setFormKpis((ps) => ps.map((p) => (p.id === id ? { ...p, [f]: v } : p)));
  const remFormKpi = (id) => setFormKpis((ps) => ps.filter((p) => p.id !== id));

  const canNext = () => {
    if (step === 0)
      return jobForm.title && jobForm.dept && jobForm.type && jobForm.level;
    if (step === 1) return jobForm.summary && jobForm.responsibilities;
    if (step === 2)
      return formKras.length > 0 && formKras.every((k) => k.title);
    if (step === 3)
      return formKpis.length > 0 && formKpis.every((k) => k.name && k.target);
    return true;
  };

  const saveJd = () => {
    const nid = Date.now();
    const newJd = {
      id: nid,
      title: jobForm.title,
      dept: jobForm.dept,
      level: jobForm.level,
      type: jobForm.type,
      status: "draft",
      assigned: [],
      created: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      reportingTo: jobForm.reportingTo,
      location: jobForm.location,
      salaryMin: jobForm.salaryMin,
      salaryMax: jobForm.salaryMax,
      summary: jobForm.summary,
      responsibilities: jobForm.responsibilities,
      qualifications: jobForm.qualifications,
      skills: jobForm.skills,
      niceToHave: jobForm.niceToHave,
    };
    const nKras = formKras.map((k, i) => ({
      id: `k_${nid}_${i}`,
      jdId: nid,
      title: k.title,
      desc: k.desc,
      weightage: Number(k.weightage) || 0,
      assignee: k.assignee,
      effectiveFrom: k.effectiveFrom,
      effectiveTo: k.effectiveTo,
      status: k.status,
    }));
    const nKpis = formKpis.map((p, i) => ({
      id: `p_${nid}_${i}`,
      kraId: nKras[p.kraIdx]?.id || "",
      jdId: nid,
      name: p.name,
      unit: p.unit,
      weightage: Number(p.weightage) || 0,
      assignee: p.assignee,
      target: p.target,
      freq: p.freq,
      updateType: p.updateType,
      dataSource: p.dataSource,
      module: p.module,
    }));
    setAllJds((j) => [newJd, ...j]);
    setAllKras((k) => [...k, ...nKras]);
    setAllKpis((p) => [...p, ...nKpis]);
    showToast("Job description saved as draft");
    resetCreate();
  };

  const publishJd = (id) => {
    setAllJds((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "published" } : j))
    );
    showToast("Job description published successfully");
  };

  const startEditJd = (id) => {
    const jd = allJds.find((j) => j.id === id);
    if (!jd) return;
    setEditForm({
      title: jd.title || "",
      dept: jd.dept || "",
      deptId: jd.deptId || jd.departmentId || "",
      reportingTo: jd.reportingTo || "",
      type: jd.type || "",
      level: jd.level || "",
      location: jd.location || "",
      salaryMin: jd.salaryMin || "",
      salaryMax: jd.salaryMax || "",
      summary: jd.summary || "",
      responsibilities: jd.responsibilities || "",
      qualifications: jd.qualifications || "",
      skills: jd.skills || "",
      niceToHave: jd.niceToHave || "",
    });
    setEditingJd(id);
    setViewingJd(null);
    setView("list");
  };

  const saveEditJd = () => {
    setAllJds((prev) =>
      prev.map((j) =>
        j.id === editingJd
          ? {
            ...j,
            title: editForm.title,
            dept: editForm.dept,
            reportingTo: editForm.reportingTo,
            type: editForm.type,
            level: editForm.level,
            location: editForm.location,
            salaryMin: editForm.salaryMin,
            salaryMax: editForm.salaryMax,
            summary: editForm.summary,
            responsibilities: editForm.responsibilities,
            qualifications: editForm.qualifications,
            skills: editForm.skills,
            niceToHave: editForm.niceToHave,
          }
          : j
      )
    );
    showToast("Job description updated successfully");
    setEditingJd(null);
  };

  const cancelEditJd = () => setEditingJd(null);
  const ef = (k, v) => setEditForm((f) => ({ ...f, [k]: v }));

  const resetCreate = () => {
    setView("list");
    setStep(0);
    setJdMethod(null);
    setKraAiDone(false);
    setKpiAiDone(false);
    setJobForm({
      title: "",
      dept: "",
      deptId: "",
      reportingTo: "",
      type: "",
      level: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
      summary: "",
      responsibilities: "",
      qualifications: "",
      skills: "",
      niceToHave: "",
    });
    setFormKras([]);
    setFormKpis([]);
  };

  /** JD row — pehle React Query wali list se, warna context ke allJds se. */
  const jdRowById = (id) => {
    const cached = queryClient.getQueryData(["jobs-list"]);
    return (
      (Array.isArray(cached) ? cached : []).find((j) => sameId(j?.id, id)) ||
      allJds.find((j) => sameId(j.id, id))
    );
  };

  // Modal khulte hi current assignees prefill ho jate hain, taki PUT se koi
  // purana assignee galti se hat na jaye.
  useEffect(() => {
    if (!assignModal) return;
    const row = jdRowById(assignModal);
    setAssignJdUserIds((row?.assigneeIds || []).map(String));
  }, [assignModal]);

  /** PUT /job_descriptions/:id.json — `assignee_ids` poori list replace karta hai. */
  const assignUser = async () => {
    if (!assignModal) return;
    const ids = assignJdUserIds
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id));
    const row = jdRowById(assignModal);
    const names = (escalateUsers || [])
      .filter((u) => ids.some((id) => sameId(u.id, id)))
      .map((u) => u.full_name || u.name)
      .filter(Boolean);
    setJdAssignSaving(true);
    try {
      await assignJobDescriptionMembers(assignModal, ids);
      const patch = { assigned: names, assigneeIds: ids };
      setAllJds((j) =>
        j.map((jd) => (sameId(jd.id, assignModal) ? { ...jd, ...patch } : jd))
      );
      queryClient.setQueriesData({ queryKey: ["jobs-list"] }, (current) =>
        Array.isArray(current)
          ? current.map((jd) =>
              sameId(jd?.id, assignModal) ? { ...jd, ...patch } : jd
            )
          : current
      );
      queryClient.invalidateQueries({ queryKey: ["jobs-list"] });
      addLog(
        "assign",
        "JD",
        row?.title || "",
        ids.length
          ? `Assigned to ${names.join(", ") || ids.join(", ")}`
          : "All members removed"
      );
      setAssignJdUserIds([]);
      setAssignModal(null);
      showToast(
        ids.length ? "Members assigned successfully" : "Members removed"
      );
    } catch (err) {
      toast.error(
        `Could not assign members: ${err?.response?.data?.message || err?.message || "request failed"}`
      );
    } finally {
      setJdAssignSaving(false);
    }
  };

  const saveNewKra = async () => {
    if (!newKra.jdId || !newKra.title) return;
    if (await exceedsAssigneeKraWeightage(newKra.assigneeId, newKra.weightage))
      return;
    const selectedJd = allJds.find((j) => sameId(j.id, newKra.jdId));
    setKrasSaving(true);
    try {
      const created = await createKra({
        ...newKra,
        resourceId:
          newKra.resourceId ||
          selectedJd?.deptId ||
          selectedJd?.departmentId,
      });
      if (created)
        setAllKras((ks) => [
          created,
          ...ks.filter((k) => !sameId(k.id, created.id)),
        ]);
      addLog("create", "KRA", newKra.title, "KRA created");
      setNewKra({
        jdId: "",
        title: "",
        desc: "",
        weightage: "",
        assignee: "",
        assigneeId: "",
        effectiveFrom: "",
        effectiveTo: "",
        status: "active",
      });
      setShowAddKra(false);
      showToast("KRA added successfully");
    } catch (err) {
      toast.error(`Could not create KRA: ${err?.message || "request failed"}`);
    } finally {
      setKrasSaving(false);
    }
  };

  const loadKpis = useCallback(async (filters = {}) => {
    setKpisLoading(true);
    setKpisError(null);
    try {
      const rows = await fetchKpis(filters);
      if (rows === null) return;
      setAllKpis(rows);
    } catch (err) {
      console.error("Failed to load KPIs:", err);
      setKpisError(err?.message || "request failed");
      toast.error(`Could not load KPIs: ${err?.message || "request failed"}`);
    } finally {
      setKpisLoading(false);
    }
  }, []);

  const kpiApiFilters = useCallback(() => {
    return {
      search: kpiSearch,
    };
  }, [kpiSearch]);

  const refreshKpis = useCallback(() => {
    loadKpis(kpiApiFilters());
  }, [kpiApiFilters, loadKpis]);

  const mergeKras = useCallback((rows = []) => {
    setAllKras((prev) => {
      const merged = new Map(prev.map((kra) => [String(kra.id), kra]));
      let changed = false;
      rows.forEach((kra) => {
        const key = String(kra.id);
        const previous = merged.get(key);
        const next = { ...previous, ...kra };
        if (!previous || JSON.stringify(previous) !== JSON.stringify(next))
          changed = true;
        merged.set(key, next);
      });
      return changed ? Array.from(merged.values()) : prev;
    });
  }, []);

  const loadKpiModalJds = useCallback(async () => {
    setKpiModalJdsLoading(true);
    setKpiModalJdsError(null);
    try {
      const rows = await fetchJobDescriptions();
      if (rows === null) return;
      setAllJds(rows);
    } catch (err) {
      console.error("Failed to load job descriptions:", err);
      setKpiModalJdsError(err?.message || "request failed");
      toast.error(
        `Could not load job descriptions: ${err?.message || "request failed"}`
      );
    } finally {
      setKpiModalJdsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showAddKpi && !editingKpiId) return;
    loadKpiModalJds();
  }, [editingKpiId, loadKpiModalJds, showAddKpi]);

  useEffect(() => {
    if (!showAddKra) return;
    loadKpiModalJds();
  }, [loadKpiModalJds, showAddKra]);

  useEffect(() => {
    if (jobTab !== "kpi") return;
    loadKpiModalJds();
  }, [jobTab, loadKpiModalJds]);

  // KPI list "Linked KRA" column ke liye KRAs bhi chahiye — tab khulte hi
  // ek baar fetch kar lete hain (mergeKras duplicate rows overwrite karta hai).
  useEffect(() => {
    if (jobTab !== "kpi") return;
    let active = true;
    fetchAllKras()
      .then((rows) => {
        if (active && Array.isArray(rows)) mergeKras(rows);
      })
      .catch((err) => console.error("Failed to load KRAs for KPI tab:", err));
    return () => {
      active = false;
    };
  }, [jobTab, mergeKras]);

  useEffect(() => {
    if (!showAddKpi && !editingKpiId) {
      setKpiModalKras([]);
      setKpiKraSearch("");
      return;
    }

    // The Linked KRA picker lists every KRA from GET /kras.json — it is not
    // scoped by JD / department / assignee. Searching is done client-side.
    let active = true;
    setKpiModalKrasLoading(true);
    setKpiModalKrasError(null);
    (async () => {
      try {
        const rows = await fetchAllKras();
        if (!active || rows === null) return;
        setKpiModalKras(rows);
        mergeKras(rows);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load linked KRAs:", err);
        setKpiModalKras([]);
        setKpiModalKrasError(err?.message || "request failed");
      } finally {
        if (active) setKpiModalKrasLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [editingKpiId, mergeKras, showAddKpi]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshKpis();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [refreshKpis]);

  // Ek KRA ki saari KPIs ka weightage milakar 100% se zyada nahi ho sakta —
  // chahe us KRA se 2 KPIs juddi hon ya 10. `excludeKpiId` edit ke waqt
  // current KPI ko total se hata deta hai.
  const kraWeightageUsed = (kraId, excludeKpiId = null) =>
    allKpis
      .filter(
        (kpi) =>
          sameId(kpi.kraId, kraId) &&
          (excludeKpiId === null || !sameId(kpi.id, excludeKpiId))
      )
      .reduce((sum, kpi) => sum + (Number(kpi.weightage) || 0), 0);

  // Save ke waqt total server se verify karte hain — `allKpis` sirf current
  // search ka subset ho sakta hai, isliye local sum bharosemand nahi.
  const exceedsKraWeightage = async (kraId, weightage, excludeKpiId = null) => {
    if (!kraId) return false;
    const next = Number(weightage) || 0;
    let used = kraWeightageUsed(kraId, excludeKpiId);
    try {
      const rows = await fetchKpis({ kraId });
      if (Array.isArray(rows))
        used = rows
          .filter(
            (kpi) =>
              excludeKpiId === null || !sameId(kpi.id, excludeKpiId)
          )
          .reduce((sum, kpi) => sum + (Number(kpi.weightage) || 0), 0);
    } catch {
      // Network fail — local total par hi fallback.
    }
    if (used + next <= 100) return false;
    const kraTitle =
      allKras.find((k) => sameId(k.id, kraId))?.title || "this KRA";
    toast.error(
      `Total KPI weightage for "${kraTitle}" cannot exceed 100%. Already used: ${used}%, remaining: ${Math.max(
        0,
        100 - used
      )}%.`
    );
    return true;
  };

  /* ── Ek member ke saare KRAs ka total weightage 100% se zyada nahi ho sakta ── */

  const localAssigneeKraTotal = (assigneeId, excludeKraId = null) =>
    allKras
      .filter(
        (kra) =>
          sameId(firstDefined(kra.assigneeId, kra.assignee_id), assigneeId) &&
          String(kra.status || "active").toLowerCase() === "active" &&
          (excludeKraId === null || !sameId(kra.id, excludeKraId))
      )
      .reduce((sum, kra) => sum + (Number(kra.weightage) || 0), 0);

  /**
   * Member ke active KRAs ka total server se lete hain — `allKras` sirf current
   * filter/search ka subset ho sakta hai, isliye local sum bharosemand nahi.
   */
  const assigneeKraWeightageUsed = async (assigneeId, excludeKraId = null) => {
    if (!assigneeId) return 0;
    try {
      const rows = await fetchKras({ assigneeId, kraType: null, status: "active" });
      if (Array.isArray(rows))
        return rows
          .filter((kra) => excludeKraId === null || !sameId(kra.id, excludeKraId))
          .reduce((sum, kra) => sum + (Number(kra.weightage) || 0), 0);
    } catch {
      // Network fail — local total par fallback.
    }
    return localAssigneeKraTotal(assigneeId, excludeKraId);
  };

  const memberNameById = (assigneeId) =>
    (escalateUsers || []).find((u) => sameId(u.id, assigneeId))?.full_name ||
    (escalateUsers || []).find((u) => sameId(u.id, assigneeId))?.name ||
    "this member";

  /** true = limit cross ho rahi hai (toast bhi dikha diya jata hai). */
  const exceedsAssigneeKraWeightage = async (
    assigneeId,
    weightage,
    excludeKraId = null,
    memberName = ""
  ) => {
    if (!assigneeId) return false;
    const next = Number(weightage) || 0;
    const used = await assigneeKraWeightageUsed(assigneeId, excludeKraId);
    if (used + next <= 100) return false;
    toast.error(
      `Total KRA weightage for ${memberName || memberNameById(assigneeId)} cannot exceed 100%. Already used: ${used}%, remaining: ${Math.max(
        0,
        100 - used
      )}%.`
    );
    return true;
  };

  // KRA modals ka live hint — assignee chunte hi uska total dikh jata hai.
  const loadAssigneeKraUsage = useCallback(
    async (assigneeId, excludeKraId = null) => {
      if (!assigneeId) {
        setAssigneeKraUsage({ assigneeId: null, used: 0, loading: false });
        return;
      }
      setAssigneeKraUsage({ assigneeId, used: 0, loading: true });
      let used = 0;
      try {
        const rows = await fetchKras({ assigneeId, kraType: null, status: "active" });
        if (Array.isArray(rows))
          used = rows
            .filter((kra) => excludeKraId === null || !sameId(kra.id, excludeKraId))
            .reduce((sum, kra) => sum + (Number(kra.weightage) || 0), 0);
      } catch {
        used = 0;
      }
      setAssigneeKraUsage({ assigneeId, used, loading: false });
    },
    []
  );

  const saveNewKpi = async () => {
    const missing = [
      !newKpi.jdId && "Job Description",
      !newKpi.kraId && "Linked KRA",
      !String(newKpi.name || "").trim() && "KPI Name",
      !String(newKpi.target || "").trim() && "Target Value",
    ].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return;
    }
    if (await exceedsKraWeightage(newKpi.kraId, newKpi.weightage)) return;
    const selectedJd = allJds.find((j) => sameId(j.id, newKpi.jdId));
    const selectedKra = allKras.find((k) => sameId(k.id, newKpi.kraId));
    const payloadForm = {
      ...newKpi,
      departmentId:
        newKpi.departmentId ||
        selectedJd?.departmentId ||
        selectedJd?.deptId ||
        selectedKra?.departmentId,
    };
    setKpisSaving(true);
    try {
      const created = await createKpi(payloadForm);
      if (created)
        setAllKpis((ps) => [
          created,
          ...ps.filter((p) => !sameId(p.id, created.id)),
        ]);
      else await refreshKpis();
      setNewKpi({
        jdId: "",
        kraId: "",
        departmentId: "",
        name: "",
        unit: "",
        weightage: "",
        assignee: "",
        assigneeIds: [],
        target: "",
        freq: "",
        updateType: "manual",
        dataSource: "",
        module: "",
        measurementType: "positive",
      });
      setShowAddKpi(false);
      showToast("KPI added successfully");
      addLog("create", "KPI", newKpi.name, "KPI created");
    } catch (err) {
      toast.error(`Could not create KPI: ${err?.message || "request failed"}`);
    } finally {
      setKpisSaving(false);
    }
  };

  const loadActivityLogs = useCallback(async (page = 1) => {
    setLogsLoading(true);
    setLogsError(null);
    try {
      const result = await fetchActivityLogs({ page });
      if (result === null) return;
      setActivityLogs(result.logs);
      setLogsPage(result.page);
      setLogsMeta({
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        perPage: result.perPage,
      });
    } catch (err) {
      console.error("Failed to load activity logs:", err);
      setLogsError(err?.message || "request failed");
      setActivityLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  // First page on mount; the tab also exposes explicit refresh + paging.
  useEffect(() => {
    loadActivityLogs(1);
  }, [loadActivityLogs]);

  // Local mutations in this module are still client-side, so a new entry is
  // prepended optimistically. The server list wins on the next fetch.
  const addLog = (type, entity, name, detail) => {
    setActivityLogs((l) => [
      {
        id: `local-${Date.now()}`,
        type,
        entity,
        name,
        user: "You",
        timestamp: new Date()
          .toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(",", ""),
        detail,
      },
      ...l,
    ]);
  };

  const toggleKraStatus = async (kra) => {
    if (!kra || !kra.id) return;
    const id = kra.id;
    const ns = kra.status === "active" ? "inactive" : "active";
    const previous = allKras;
    setAllKras((ks) =>
      ks.map((k) => (sameId(k.id, id) ? { ...k, status: ns } : k))
    );
    try {
      const updated = await updateKraStatus(id, ns);
      if (updated)
        setAllKras((ks) =>
          ks.map((k) => (sameId(k.id, id) ? { ...k, ...updated } : k))
        );
      addLog(
        ns === "active" ? "activate" : "deactivate",
        "KRA",
        kra.title,
        `Status changed to ${ns === "active" ? "Active" : "Inactive"}`
      );
      showToast(`KRA ${ns === "active" ? "activated" : "deactivated"}`);
    } catch (err) {
      setAllKras(previous);
      toast.error(
        `Could not update KRA status: ${err?.message || "request failed"}`
      );
    }
  };

  const toggleKpiStatus = async (id) => {
    const kpi = allKpis.find((p) => p.id === id);
    if (!kpi) return;
    const ns = kpi.status === "active" ? "inactive" : "active";
    const previous = allKpis;
    const archived = ns !== "active";
    setAllKpis((ps) =>
      ps.map((p) => (sameId(p.id, id) ? { ...p, status: ns, archived } : p))
    );
    try {
      const updated = await updateKpi(id, { archived });
      if (updated)
        setAllKpis((ps) =>
          ps.map((p) => (sameId(p.id, id) ? { ...p, ...updated } : p))
        );
      addLog(
        ns === "active" ? "activate" : "deactivate",
        "KPI",
        kpi.name,
        `Status changed to ${ns === "active" ? "Active" : "Inactive"}`
      );
      showToast(`KPI ${ns === "active" ? "activated" : "deactivated"}`);
    } catch (err) {
      setAllKpis(previous);
      toast.error(
        `Could not update KPI status: ${err?.message || "request failed"}`
      );
    }
  };

  const openEditKra = (kra) => {
    const matchedAssignee = (escalateUsers || []).find((u) =>
      sameId(u.id, kra.assigneeId) ||
      (kra.assignee && String(u.full_name || u.name || "") === String(kra.assignee))
    );
    setEditingKraId(kra.id);
    setEditKraForm({
      jdId: kra.jdId ?? kra.job_description_id ?? "",
      title: kra.title,
      desc: kra.desc,
      weightage: kra.weightage,
      effectiveFrom: kra.effectiveFrom,
      effectiveTo: kra.effectiveTo,
      status: kra.status,
      assigneeId: kra.assigneeId || matchedAssignee?.id || "",
    });
  };

  const patchKrasCache = (id, patch) => {
    queryClient.setQueriesData({ queryKey: ["kras-list"] }, (current) => {
      if (!Array.isArray(current)) return current;
      return current.map((k) =>
        sameId(k?.id, id) ? { ...k, ...patch } : k
      );
    });
  };

  const saveEditKra = async () => {
    if (!editingKraId || !editKraForm.title) return;
    // Khud ko chhodkar baaki KRAs ka total — warna apna hi weightage do baar ginta.
    if (
      await exceedsAssigneeKraWeightage(
        editKraForm.assigneeId,
        editKraForm.weightage,
        editingKraId
      )
    )
      return;
    const previous = allKras;
    const selectedJd = allJds.find((j) => sameId(j.id, editKraForm.jdId));
    const localPatch = {
      ...editKraForm,
      weightage: Number(editKraForm.weightage) || 0,
    };
    setAllKras((ks) =>
      ks.map((k) => (sameId(k.id, editingKraId) ? { ...k, ...localPatch } : k))
    );
    setKrasSaving(true);
    try {
      const updated = await updateKra(editingKraId, {
        ...editKraForm,
        resourceId:
          editKraForm.resourceId ||
          selectedJd?.deptId ||
          selectedJd?.departmentId,
      });
      if (updated)
        setAllKras((ks) =>
          ks.map((k) =>
            sameId(k.id, editingKraId) ? { ...k, ...updated } : k
          )
        );
      patchKrasCache(editingKraId, { ...localPatch, ...updated });
      addLog("edit", "KRA", editKraForm.title, "KRA details updated");
      setEditingKraId(null);
      showToast("KRA updated");
    } catch (err) {
      setAllKras(previous);
      toast.error(`Could not update KRA: ${err?.message || "request failed"}`);
    } finally {
      setKrasSaving(false);
    }
  };

  const openEditKpi = (kpi) => {
    setEditingKpiId(kpi.id);
    setEditKpiForm({
      jdId: kpi.jdId || "",
      kraId: kpi.kraId || "",
      departmentId: kpi.departmentId || "",
      name: kpi.name,
      unit: kpi.unit,
      weightage: kpi.weightage,
      target: kpi.target,
      freq: kpi.freq,
      updateType: kpi.updateType,
      dataSource: kpi.dataSource || "",
      module: kpi.module || "",
      measurementType: kpi.measurementType || "positive",
      assigneeIds: kpi.assigneeIds || [],
    });
  };

  const saveEditKpi = async () => {
    const missing = [
      !String(editKpiForm.name || "").trim() && "KPI Name",
      !String(editKpiForm.target ?? "").trim() && "Target Value",
    ].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return;
    }
    if (
      await exceedsKraWeightage(
        editKpiForm.kraId,
        editKpiForm.weightage,
        editingKpiId
      )
    )
      return;
    const previous = allKpis;
    const localPatch = {
      ...editKpiForm,
      weightage: Number(editKpiForm.weightage) || 0,
    };
    setAllKpis((ps) =>
      ps.map((p) => (sameId(p.id, editingKpiId) ? { ...p, ...localPatch } : p))
    );
    setKpisSaving(true);
    try {
      const updated = await updateKpi(editingKpiId, toKpiPayload(editKpiForm));
      if (updated)
        setAllKpis((ps) =>
          ps.map((p) => (sameId(p.id, editingKpiId) ? { ...p, ...updated } : p))
        );
      addLog("edit", "KPI", editKpiForm.name, "KPI details updated");
      setEditingKpiId(null);
      showToast("KPI updated");
    } catch (err) {
      setAllKpis(previous);
      toast.error(`Could not update KPI: ${err?.message || "request failed"}`);
    } finally {
      setKpisSaving(false);
    }
  };

  const assignToKra = () => {
    if (!assignKraName.trim()) return;
    addLog(
      "assign",
      "KRA",
      allKras.find((k) => k.id === assignKraModal)?.title || "",
      `Assigned to ${assignKraName.trim()}`
    );
    setAssignKraName("");
    setAssignKraModal(null);
    showToast("Person assigned to KRA");
  };

  const loadKpiAssignUsers = useCallback(async () => {
    setKpiAssignUsersLoading(true);
    setKpiAssignUsersError(null);
    try {
      const users = await fetchEscalateToUsers();
      if (users === null) return;
      setKpiAssignUsers(users);
    } catch (err) {
      console.error("Failed to load KPI assign users:", err);
      setKpiAssignUsersError(err?.message || "request failed");
      toast.error(`Could not load users: ${err?.message || "request failed"}`);
    } finally {
      setKpiAssignUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!assignKpiModal) return;
    const currentKpi = allKpis.find((p) => sameId(p.id, assignKpiModal));
    setAssignKpiUserIds(
      (currentKpi?.assigneeIds || []).map((id) => String(id))
    );
    loadKpiAssignUsers();
  }, [allKpis, assignKpiModal, loadKpiAssignUsers]);

  useEffect(() => {
    if ((!showAddKpi && !editingKpiId) || kpiAssignUsers.length > 0) return;
    loadKpiAssignUsers();
  }, [editingKpiId, kpiAssignUsers.length, loadKpiAssignUsers, showAddKpi]);

  /** The fields that make one KRA a copy of another (assignee excluded). */
  const kraShape = (kra) => ({
    kraType: firstDefined(kra.kraType, kra.kra_type),
    resourceType: firstDefined(kra.resourceType, kra.resource_type),
    resourceId: firstDefined(kra.resourceId, kra.resource_id),
    title: kra.title,
    desc: kra.desc,
    weightage: kra.weightage,
    status: kra.status || "active",
    jdId: kra.jdId,
    effectiveFrom: firstDefined(kra.effectiveFrom, kra.effective_from),
    effectiveTo: firstDefined(kra.effectiveTo, kra.effective_to),
  });

  const kraAssigneeOf = (kra) =>
    firstDefined(kra?.assigneeId, kra?.assignee_id);

  /** An existing copy of `kra` that already belongs to `assigneeId`, if any. */
  const findKraCopyFor = (kra, assigneeId) =>
    allKras.find(
      (k) =>
        !sameId(k.id, kra.id) &&
        String(k.title || "").trim().toLowerCase() ===
          String(kra.title || "").trim().toLowerCase() &&
        sameId(k.jdId ?? "", kra.jdId ?? "") &&
        sameId(kraAssigneeOf(k), assigneeId)
    );

  /**
   * A KPI's KRA follows the KPI's assignment. A KRA holds a single
   * `assignee_id`, so a KRA that already belongs to someone else is *copied*
   * for the new assignee (the original owner keeps their KRA and its other
   * KPIs) and the KPI is relinked to that copy.
   * Returns the KRA id the KPI should point at, or null when nothing changed.
   */
  const assignKraForKpi = async (kraId, assigneeId, assigneeName) => {
    if (!kraId || !assigneeId) return null;
    const kra = allKras.find((k) => sameId(k.id, kraId));
    if (!kra) return null;
    const owner = kraAssigneeOf(kra);
    const label = assigneeName || assigneeId;

    // Already theirs — nothing to do.
    if (owner !== undefined && owner !== null && owner !== "" && sameId(owner, assigneeId))
      return null;

    // Unowned KRA — just hand it over, no copy needed.
    if (owner === undefined || owner === null || owner === "") {
      const localPatch = {
        assigneeId,
        assignee_id: assigneeId,
        assigneeName: assigneeName || "",
      };
      setAllKras((ks) =>
        ks.map((k) => (sameId(k.id, kraId) ? { ...k, ...localPatch } : k))
      );
      try {
        const updated = await updateKra(kraId, { ...kraShape(kra), assigneeId });
        if (updated)
          setAllKras((ks) =>
            ks.map((k) => (sameId(k.id, kraId) ? { ...k, ...updated } : k))
          );
        patchKrasCache(kraId, { ...localPatch, ...(updated || {}) });
        addLog("assign", "KRA", kra.title || "", `Assigned to ${label} (via KPI assignment)`);
        return kraId;
      } catch (err) {
        setAllKras((ks) => ks.map((k) => (sameId(k.id, kraId) ? kra : k)));
        toast.error(
          `KPI assigned, but its KRA could not be: ${err?.message || "request failed"}`
        );
        return null;
      }
    }

    // Owned by someone else — reuse an earlier copy if this member already has one.
    const existingCopy = findKraCopyFor(kra, assigneeId);
    if (existingCopy) return existingCopy.id;

    try {
      const created = await createKra({
        ...kraShape(kra),
        assigneeId,
      });
      if (!created) return null;
      const copy = {
        ...created,
        assigneeId,
        assignee_id: assigneeId,
        assigneeName: assigneeName || "",
      };
      setAllKras((ks) => [copy, ...ks.filter((k) => !sameId(k.id, copy.id))]);
      queryClient.setQueriesData({ queryKey: ["kras-list"] }, (current) =>
        Array.isArray(current)
          ? [copy, ...current.filter((k) => !sameId(k?.id, copy.id))]
          : current
      );
      addLog(
        "assign",
        "KRA",
        kra.title || "",
        `Copied for ${label} (via KPI assignment)`
      );
      return copy.id;
    } catch (err) {
      toast.error(
        `KPI assigned, but its KRA could not be copied: ${err?.message || "request failed"}`
      );
      return null;
    }
  };

  const assignToKpi = async () => {
    const selectedIds = assignKpiUserIds
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id));
    if (selectedIds.length === 0) return;
    const selectedUsers = kpiAssignUsers.filter((u) =>
      selectedIds.some((id) => sameId(u.id, id))
    );
    const kpi = allKpis.find((p) => sameId(p.id, assignKpiModal));
    if (!kpi) return;
    // KRA ki copy banne wali hai to pehle check — us member ka total 100% cross
    // ho raha ho to poora assign rok dete hain (aadha-adhoora state se bachne ke liye).
    const sourceKra = kpi.kraId
      ? allKras.find((k) => sameId(k.id, kpi.kraId))
      : null;
    if (sourceKra) {
      const owner = kraAssigneeOf(sourceKra);
      const needsCopy =
        owner !== undefined &&
        !sameId(owner, selectedIds[0]) &&
        !findKraCopyFor(sourceKra, selectedIds[0]);
      if (
        needsCopy &&
        (await exceedsAssigneeKraWeightage(
          selectedIds[0],
          sourceKra.weightage,
          null,
          selectedUsers[0]?.name
        ))
      )
        return;
    }
    const previous = allKpis;
    setAllKpis((ps) =>
      ps.map((p) =>
        sameId(p.id, assignKpiModal)
          ? {
            ...p,
            assigneeIds: selectedIds,
            assigneeNames: selectedUsers.map((user) => user.name),
          }
          : p
      )
    );
    setKpisSaving(true);
    try {
      const updated = await updateKpi(assignKpiModal, {
        assignee_ids: selectedIds,
      });
      if (updated)
        setAllKpis((ps) =>
          ps.map((p) =>
            sameId(p.id, assignKpiModal) ? { ...p, ...updated } : p
          )
        );
      addLog(
        "assign",
        "KPI",
        kpi.name || "",
        `Assigned to ${selectedUsers.map((user) => user.name).join(", ") || selectedIds.join(", ")}`
      );
      // The KPI's KRA goes to the same person — copied first if it belongs to
      // someone else, so the original owner keeps their KRA and its other KPIs.
      const targetKraId = await assignKraForKpi(
        kpi.kraId,
        selectedIds[0],
        selectedUsers[0]?.name
      );
      let kraLinked = false;
      if (targetKraId && !sameId(targetKraId, kpi.kraId)) {
        try {
          const relinked = await updateKpi(assignKpiModal, { kra_id: targetKraId });
          setAllKpis((ps) =>
            ps.map((p) =>
              sameId(p.id, assignKpiModal)
                ? { ...p, kraId: targetKraId, ...(relinked || {}) }
                : p
            )
          );
          kraLinked = true;
        } catch (err) {
          toast.error(
            `KRA copied, but the KPI could not be linked to it: ${err?.message || "request failed"}`
          );
        }
      } else if (targetKraId) {
        kraLinked = true;
      }
      setAssignKpiUserIds([]);
      setAssignKpiName("");
      setAssignKpiModal(null);
      showToast(
        kraLinked ? "Person assigned to KPI and its KRA" : "Person assigned to KPI"
      );
    } catch (err) {
      setAllKpis(previous);
      toast.error(`Could not assign KPI: ${err?.message || "request failed"}`);
    } finally {
      setKpisSaving(false);
    }
  };

  // Units come entirely from the API — nothing is hardcoded.
  useEffect(() => {
    let active = true;
    setUnitsLoading(true);
    fetchKpiUnits()
      .then((units) => {
        if (!active || units === null) return;
        setCustomUnits(units);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Failed to load KPI units:", err);
        setUnitsError(err?.message || "request failed");
      })
      .finally(() => {
        if (active) setUnitsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // bulk_upsert replaces the whole group, so every add/remove sends the full
  // list. Applied optimistically and rolled back if the request fails.
  const persistUnits = async (nextUnits, successMsg) => {
    const previousUnits = customUnits;
    setCustomUnits(nextUnits);
    setUnitsSaving(true);
    try {
      await saveKpiUnits(nextUnits);
      showToast(successMsg);
    } catch (err) {
      setCustomUnits(previousUnits);
      toast.error(
        `Could not save KPI units: ${err?.message || "request failed"}`
      );
    } finally {
      setUnitsSaving(false);
    }
  };

  const addCustomUnit = () => {
    const trimmed = newUnitInput.trim();
    if (!trimmed) return;
    if (
      customUnits.some((u) => u.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error("That unit already exists.");
      return;
    }
    setNewUnitInput("");
    persistUnits(
      [...customUnits, { name: trimmed, isDefault: false }],
      "Unit added successfully"
    );
  };

  const removeCustomUnit = (unit) => {
    // Server-flagged defaults are never removable.
    if (unit?.isDefault) return;
    persistUnits(
      customUnits.filter((u) => u.name !== unit.name),
      "Unit removed"
    );
  };

  /* ── Setup / Org handlers ── */
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const openDeptModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept.id);
      setDeptForm({
        name: dept.name,
        head: dept.head,
        members: String(dept.members),
        description: dept.description || "",
        status: dept.status,
      });
    } else {
      setEditingDept(null);
      setDeptForm({
        name: "",
        head: "",
        members: "",
        description: "",
        status: "active",
      });
    }
    setShowDeptModal(true);
  };
  const saveDept = () => {
    if (editingDept) {
      setDepartments((ds) =>
        ds.map((d) =>
          d.id === editingDept
            ? {
              ...d,
              ...deptForm,
              members: Number(deptForm.members) || d.members,
            }
            : d
        )
      );
    } else {
      setDepartments((ds) => [
        ...ds,
        {
          id: Date.now(),
          name: deptForm.name,
          head: deptForm.head,
          members: Number(deptForm.members) || 0,
          color: COLORS[ds.length % COLORS.length],
          status: deptForm.status,
          description: deptForm.description,
        },
      ]);
    }
    setShowDeptModal(false);
    showToast(editingDept ? "Department updated" : "Department created");
  };
  const deleteDept = (id) =>
    setDepartments((ds) => ds.filter((d) => d.id !== id));
  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(deptSearch.toLowerCase())
  );

  /* ── Members handlers ── */
  const memberDepts = [
    ...new Set(allMembers.map((m) => m.department).filter(Boolean)),
  ];
  const filteredMembers = allMembers.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase());
    const matchDept =
      memberDeptFilter === "all" || m.department === memberDeptFilter;
    const matchStatus =
      memberStatusFilter === "all" || m.status === memberStatusFilter;
    return matchSearch && matchDept && matchStatus;
  });
  const groupedMembers = memberDepts.reduce((acc, dept) => {
    const members = filteredMembers.filter((m) => m.department === dept);
    if (members.length > 0) acc[dept] = members;
    return acc;
  }, {});
  const ungrouped = filteredMembers.filter((m) => !m.department);

  const openInvite = (mode) => {
    setInviteMode(mode);
    setInviteRows(
      mode === "bulk"
        ? [
          { name: "", email: "", department: "" },
          { name: "", email: "", department: "" },
          { name: "", email: "", department: "" },
        ]
        : [{ name: "", email: "", department: "" }]
    );
    setShowInviteModal(true);
  };
  const updateInviteRow = (idx, field, val) =>
    setInviteRows((rs) =>
      rs.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
    );
  const addInviteRow = () =>
    setInviteRows((rs) => [...rs, { name: "", email: "", department: "" }]);
  const removeInviteRow = (idx) =>
    setInviteRows((rs) => rs.filter((_, i) => i !== idx));
  const sendInvites = () => {
    const valid = inviteRows.filter((r) => r.name.trim() && r.email.trim());
    if (valid.length === 0) return;
    const newMembers = valid.map((r, i) => ({
      id: Date.now() + i,
      name: r.name.trim(),
      email: r.email.trim(),
      department: r.department || "",
      status: "active",
      isHOD: false,
    }));
    setAllMembers((ms) => [...ms, ...newMembers]);
    setShowInviteModal(false);
    showToast(
      `${valid.length} invite${valid.length > 1 ? "s" : ""} sent successfully`
    );
  };
  const openEditMember = (m) => {
    setEditingMember(m.id);
    setEditMemberForm({
      name: m.name,
      email: m.email,
      department: m.department,
      isHOD: m.isHOD,
    });
  };
  const saveEditMember = () => {
    setAllMembers((ms) =>
      ms.map((m) => (m.id === editingMember ? { ...m, ...editMemberForm } : m))
    );
    setEditingMember(null);
    showToast("Member updated");
  };
  const toggleMemberStatus = (id) => {
    setAllMembers((ms) =>
      ms.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m
      )
    );
    showToast("Member status updated");
  };
  const deleteMember = (id) => {
    setAllMembers((ms) => ms.filter((m) => m.id !== id));
    setActionMenuMember(null);
    showToast("Member removed");
  };
  const assignKraToMember = () => {
    if (!assignKraMemberKraId || !assignKraMemberModal) return;
    const member = allMembers.find((m) => m.id === assignKraMemberModal);
    const kra = allKras.find((k) => k.id === assignKraMemberKraId);
    if (member && kra)
      addLog("assign", "KRA", kra.title, `Assigned to ${member.name}`);
    setAssignKraMemberKraId("");
    setAssignKraMemberModal(null);
    showToast("KRA assigned to member");
  };
  const assignKpiToMember = () => {
    if (!assignKpiMemberKpiId || !assignKpiMemberModal) return;
    const member = allMembers.find((m) => m.id === assignKpiMemberModal);
    const kpi = allKpis.find((p) => p.id === assignKpiMemberKpiId);
    if (member && kpi)
      addLog("assign", "KPI", kpi.name, `Assigned to ${member.name}`);
    setAssignKpiMemberKpiId("");
    setAssignKpiMemberModal(null);
    showToast("KPI assigned to member");
  };

  const filteredJds = allJds.filter((j) =>
    j.title.toLowerCase().includes(jdSearch.toLowerCase())
  );
  const jdsByDept = (dept) =>
    allJds.filter((j) => j.dept === dept).map((j) => j.id);
  const jdsByRole = (role) =>
    allJds.filter((j) => j.title === role).map((j) => j.id);
  const jdsByMember = (member) =>
    allJds.filter((j) => j.assigned.includes(member)).map((j) => j.id);
  const uniqueDepts = [...new Set(allJds.map((j) => j.dept))];
  const uniqueRoles = [...new Set(allJds.map((j) => j.title))];
  const uniqueMembers = escalateUsers.map((u) => ({
    value: String(u.id),
    label: u.full_name,
  }));
  const kpiDeptFor = (p) =>
    p.departmentName || allJds.find((j) => sameId(j.id, p.jdId))?.dept || "";
  const uniqueKpiDepts = [...new Set(allKpis.map(kpiDeptFor).filter(Boolean))];
  const uniqueKpiRoles = [
    ...new Set(
      allKpis
        .map((p) => p.jdTitleFromApi || jdTitle(p.jdId))
        .filter((role) => role && role !== "—")
    ),
  ];
  const uniqueKpiMembers = [
    ...new Set(allKpis.flatMap((p) => p.assigneeNames || []).filter(Boolean)),
  ];

  const applyListFilters = (
    items,
    deptF,
    roleF,
    memberF,
    searchVal,
    searchField
  ) => {
    return items.filter((item) => {
      const matchSearch = item[searchField]
        .toLowerCase()
        .includes(searchVal.toLowerCase());
      const matchDept = deptF === "all" || jdsByDept(deptF).includes(item.jdId);
      const matchRole = roleF === "all" || jdsByRole(roleF).includes(item.jdId);
      const matchMember =
        memberF === "all" || jdsByMember(memberF).includes(item.jdId);
      return matchSearch && matchDept && matchRole && matchMember;
    });
  };
  const filteredKras = applyListFilters(
    allKras,
    kraDeptFilter,
    kraRoleFilter,
    kraMemberFilter,
    kraSearch,
    "title"
  );
  const filteredKpis = allKpis.filter((item) => {
    const matchSearch = String(item.name || "")
      .toLowerCase()
      .includes(kpiSearch.toLowerCase());
    const itemDept = kpiDeptFor(item);
    const itemRole = item.jdTitleFromApi || jdTitle(item.jdId);
    const itemMembers = item.assigneeNames || [];
    // Filter ab departments API se aata hai (value = department id), lekin
    // purane name-based selection ke liye fallback bhi rakha hai.
    const matchDept =
      kpiDeptFilter === "all" ||
      String(item.departmentId ?? "") === String(kpiDeptFilter) ||
      itemDept === kpiDeptFilter;
    const matchRole = kpiRoleFilter === "all" || itemRole === kpiRoleFilter;
    // Member filter escalate-to-users API se aata hai (value = user id);
    // purane name-based selection ke liye fallback bhi rakha hai.
    const matchMember =
      kpiMemberFilter === "all" ||
      (item.assigneeIds || []).some(
        (id) => String(id) === String(kpiMemberFilter)
      ) ||
      itemMembers.includes(kpiMemberFilter);
    return matchSearch && matchDept && matchRole && matchMember;
  });

  const value = {
    activeNav,
    setActiveNav,
    jobTab,
    setJobTab,
    view,
    setView,
    viewingJd,
    setViewingJd,
    step,
    setStep,
    jdMethod,
    setJdMethod,
    aiLoading,
    setAiLoading,
    kraAiDone,
    setKraAiDone,
    kpiAiLoading,
    setKpiAiLoading,
    kpiAiDone,
    setKpiAiDone,
    allJds,
    setAllJds,
    allKras,
    setAllKras,
    allKpis,
    setAllKpis,
    kpisLoading,
    kpisError,
    kpisSaving,
    loadKpis,
    refreshKpis,
    kpiModalJdsLoading,
    kpiModalJdsError,
    kpiModalKras,
    kpiModalKrasLoading,
    kpiModalKrasError,
    kraWeightageUsed,
    assigneeKraUsage,
    loadAssigneeKraUsage,
    kpiKraSearch,
    setKpiKraSearch,
    jdSearch,
    setJdSearch,
    kraSearch,
    setKraSearch,
    kpiSearch,
    setKpiSearch,
    assignModal,
    setAssignModal,
    assignJdUserIds,
    setAssignJdUserIds,
    jdAssignSaving,
    expandedKra,
    setExpandedKra,
    showAddKra,
    setShowAddKra,
    krasSaving,
    showAddKpi,
    setShowAddKpi,
    newKra,
    setNewKra,
    newKpi,
    setNewKpi,
    kraDeptFilter,
    setKraDeptFilter,
    kraRoleFilter,
    setKraRoleFilter,
    kraMemberFilter,
    setKraMemberFilter,
    kpiDeptFilter,
    setKpiDeptFilter,
    kpiRoleFilter,
    setKpiRoleFilter,
    kpiMemberFilter,
    setKpiMemberFilter,
    kraViewMode,
    setKraViewMode,
    kpiViewMode,
    setKpiViewMode,
    actionMenuJd,
    setActionMenuJd,
    actionMenuMember,
    setActionMenuMember,
    editingJd,
    setEditingJd,
    editForm,
    setEditForm,
    ef,
    setupTab,
    setSetupTab,
    logoPreview,
    setLogoPreview,
    departments,
    setDepartments,
    showDeptModal,
    setShowDeptModal,
    editingDept,
    setEditingDept,
    deptSearch,
    setDeptSearch,
    deptForm,
    setDeptForm,
    fileRef,
    allMembers,
    setAllMembers,
    memberSearch,
    setMemberSearch,
    memberDeptFilter,
    setMemberDeptFilter,
    memberStatusFilter,
    setMemberStatusFilter,
    memberGroupView,
    setMemberGroupView,
    viewingMember,
    setViewingMember,
    showInviteModal,
    setShowInviteModal,
    inviteMode,
    setInviteMode,
    inviteRows,
    setInviteRows,
    editingMember,
    setEditingMember,
    editMemberForm,
    setEditMemberForm,
    assignKraMemberModal,
    setAssignKraMemberModal,
    assignKraMemberKraId,
    setAssignKraMemberKraId,
    assignKpiMemberModal,
    setAssignKpiMemberModal,
    assignKpiMemberKpiId,
    setAssignKpiMemberKpiId,
    customUnits,
    setCustomUnits,
    newUnitInput,
    setNewUnitInput,
    unitsLoading,
    unitsSaving,
    unitsError,
    activityLogs,
    setActivityLogs,
    logsLoading,
    logsError,
    logsPage,
    logsMeta,
    loadActivityLogs,
    editingKraId,
    setEditingKraId,
    editKraForm,
    setEditKraForm,
    editingKpiId,
    setEditingKpiId,
    editKpiForm,
    setEditKpiForm,
    assignKraModal,
    setAssignKraModal,
    assignKraName,
    setAssignKraName,
    assignKpiModal,
    setAssignKpiModal,
    assignKpiName,
    setAssignKpiName,
    assignKpiUserIds,
    setAssignKpiUserIds,
    kpiAssignUsers,
    kpiAssignUsersLoading,
    kpiAssignUsersError,
    loadKpiAssignUsers,
    jobForm,
    setJobForm,
    formKras,
    setFormKras,
    formKpis,
    setFormKpis,
    sf,
    jdTitle,
    kraName,
    kraCountFor,
    kpiCountFor,
    krasForJd,
    initials,
    totalKpiWeight,
    simulateAiJd,
    simulateAiKras,
    simulateAiKpis,
    addFormKra,
    updFormKra,
    remFormKra,
    addFormKpi,
    updFormKpi,
    remFormKpi,
    canNext,
    saveJd,
    publishJd,
    startEditJd,
    saveEditJd,
    cancelEditJd,
    resetCreate,
    assignUser,
    saveNewKra,
    saveNewKpi,
    addLog,
    toggleKraStatus,
    toggleKpiStatus,
    openEditKra,
    saveEditKra,
    openEditKpi,
    saveEditKpi,
    assignToKra,
    assignToKpi,
    addCustomUnit,
    removeCustomUnit,
    handleLogoUpload,
    openDeptModal,
    saveDept,
    deleteDept,
    openInvite,
    updateInviteRow,
    addInviteRow,
    removeInviteRow,
    sendInvites,
    openEditMember,
    saveEditMember,
    toggleMemberStatus,
    deleteMember,
    assignKraToMember,
    assignKpiToMember,
    filteredJds,
    filteredKras,
    filteredKpis,
    filteredDepts,
    filteredMembers,
    groupedMembers,
    ungrouped,
    memberDepts,
    uniqueDepts,
    uniqueRoles,
    uniqueMembers,
    escalateUsers,
    uniqueKpiDepts,
    uniqueKpiRoles,
    uniqueKpiMembers,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}
