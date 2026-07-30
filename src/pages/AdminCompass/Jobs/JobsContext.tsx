// @ts-nocheck
import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  SEED_JDS, SEED_KRAS, SEED_KPIS, AI_KRAS, genAiKpis,
  DEPARTMENTS, TARGET_FREQ, DATA_SOURCES, MODULES_BY_SOURCE,
  INITIAL_DEPTS, SEED_MEMBERS, COLORS,
} from "./constants";
import { fetchKpiUnits, saveKpiUnits } from "./kpiUnitsApi";
import { fetchActivityLogs, LOGS_PER_PAGE } from "./activityLogsApi";
import { fetchKpis, createKpi, updateKpi, toKpiPayload } from "./kpisApi";

const JobsContext = createContext(null);

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used within JobsProvider");
  return ctx;
}

export function JobsProvider({ children }) {
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
  const [allJds, setAllJds] = useState(SEED_JDS);
  const [allKras, setAllKras] = useState(SEED_KRAS);
  const [allKpis, setAllKpis] = useState(SEED_KPIS);
  const [kpisLoading, setKpisLoading] = useState(false);
  const [kpisError, setKpisError] = useState(null);
  const [kpisSaving, setKpisSaving] = useState(false);
  const [jdSearch, setJdSearch] = useState("");
  const [kraSearch, setKraSearch] = useState("");
  const [kpiSearch, setKpiSearch] = useState("");
  const [assignModal, setAssignModal] = useState(null);
  const [assignName, setAssignName] = useState("");
  const [expandedKra, setExpandedKra] = useState(null);
  const [showAddKra, setShowAddKra] = useState(false);
  const [showAddKpi, setShowAddKpi] = useState(false);
  const [newKra, setNewKra] = useState({ jdId: "", title: "", desc: "", weightage: "", assignee: "", effectiveFrom: "", effectiveTo: "", status: "active" });
  const [newKpi, setNewKpi] = useState({ jdId: "", kraId: "", departmentId: "", name: "", unit: "", weightage: "", assignee: "", assigneeIds: [], target: "", freq: "", updateType: "manual", dataSource: "", module: "", measurementType: "positive" });
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
  const [editForm, setEditForm] = useState({ title: "", dept: "", reportingTo: "", type: "", level: "", location: "", salaryMin: "", salaryMax: "", summary: "", responsibilities: "", qualifications: "", skills: "", niceToHave: "" });
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

  /* ── Setup / Org state ── */
  const [setupTab, setSetupTab] = useState("company");
  const [logoPreview, setLogoPreview] = useState(null);
  const [departments, setDepartments] = useState(INITIAL_DEPTS);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptSearch, setDeptSearch] = useState("");
  const [deptForm, setDeptForm] = useState({ name: "", head: "", members: "", description: "", status: "active" });
  const fileRef = useRef(null);

  /* ── Members state ── */
  const [allMembers, setAllMembers] = useState(SEED_MEMBERS);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberDeptFilter, setMemberDeptFilter] = useState("all");
  const [memberStatusFilter, setMemberStatusFilter] = useState("all");
  const [memberGroupView, setMemberGroupView] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMode, setInviteMode] = useState("single");
  const [inviteRows, setInviteRows] = useState([{ name: "", email: "", department: "" }]);
  const [editingMember, setEditingMember] = useState(null);
  const [editMemberForm, setEditMemberForm] = useState({ name: "", email: "", department: "", isHOD: false });

  /* Stepper form */
  const [jobForm, setJobForm] = useState({ title: "", dept: "", reportingTo: "", type: "", level: "", location: "", salaryMin: "", salaryMax: "", summary: "", responsibilities: "", qualifications: "", skills: "", niceToHave: "" });
  const [formKras, setFormKras] = useState([]);
  const [formKpis, setFormKpis] = useState([]);
  const sf = (k, v) => setJobForm((f) => ({ ...f, [k]: v }));

  /* Helpers */
  const sameId = (a, b) => String(a ?? "") === String(b ?? "");
  const jdTitle = (id) => allJds.find((j) => sameId(j.id, id))?.title || allKpis.find((p) => sameId(p.jdId, id))?.jdTitleFromApi || "—";
  const kraName = (id) => allKras.find((k) => sameId(k.id, id))?.title || allKpis.find((p) => sameId(p.kraId, id))?.kraName || "—";
  const kraCountFor = (jdId) => allKras.filter((k) => k.jdId === jdId).length;
  const kpiCountFor = (jdId) => allKpis.filter((p) => sameId(p.jdId, jdId)).length;
  const krasForJd = (jdId) => allKras.filter((k) => sameId(k.jdId, jdId));
  const initials = (name) => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const showToast = (msg, type = "success") => toast[type](msg);
  const totalKpiWeight = formKpis.reduce((s, k) => s + (Number(k.weightage) || 0), 0);

  /* AI simulation */
  const simulateAiJd = () => {
    setAiLoading(true);
    setTimeout(() => {
      sf("summary", `We are looking for a talented ${jobForm.title || "professional"} to join our ${jobForm.dept || "team"} with ${jobForm.level || "relevant"} experience.`);
      sf("responsibilities", "• Lead end-to-end ownership of assigned workstreams\n• Collaborate cross-functionally with design, engineering, and business\n• Define and track key metrics\n• Conduct regular reviews\n• Present progress reports to leadership");
      sf("qualifications", `• ${jobForm.level === "Senior" || jobForm.level === "Lead" ? "5+" : "2+"}  years of relevant experience\n• Strong analytical abilities\n• Excellent communication skills\n• Relevant degree`);
      sf("skills", "• Proficiency in industry tools\n• Data-driven decision making\n• Stakeholder management");
      sf("niceToHave", "• Agile experience\n• Startup background\n• Domain certifications");
      setAiLoading(false);
      setJdMethod("ai");
    }, 2200);
  };
  const simulateAiKras = () => {
    setAiLoading(true);
    setTimeout(() => {
      setFormKras(AI_KRAS.map((k, i) => ({ ...k, assignee: "", id: Date.now() + i })));
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
          gen.push({ ...kpi, assignee: "", kraIdx: idx, id: Date.now() + Math.random() * 10000 });
        });
      });
      setFormKpis(gen);
      setKpiAiLoading(false);
      setKpiAiDone(true);
    }, 1800);
  };

  /* Form CRUD */
  const addFormKra = () => setFormKras((k) => [...k, { id: Date.now(), title: "", desc: "", weightage: "", assignee: "", effectiveFrom: "", effectiveTo: "", status: "active" }]);
  const updFormKra = (id, f, v) => setFormKras((ks) => ks.map((k) => (k.id === id ? { ...k, [f]: v } : k)));
  const remFormKra = (id) => {
    const idx = formKras.findIndex((k) => k.id === id);
    setFormKras((ks) => ks.filter((k) => k.id !== id));
    setFormKpis((ps) => ps.filter((p) => p.kraIdx !== idx).map((p) => ({ ...p, kraIdx: p.kraIdx > idx ? p.kraIdx - 1 : p.kraIdx })));
  };
  const addFormKpi = (kraIdx) => setFormKpis((p) => [...p, { id: Date.now() + Math.random() * 1000, kraIdx, name: "", unit: "", weightage: "", assignee: "", target: "", freq: "", updateType: "manual", dataSource: "", module: "", measurementType: "positive" }]);
  const updFormKpi = (id, f, v) => setFormKpis((ps) => ps.map((p) => (p.id === id ? { ...p, [f]: v } : p)));
  const remFormKpi = (id) => setFormKpis((ps) => ps.filter((p) => p.id !== id));

  const canNext = () => {
    if (step === 0) return jobForm.title && jobForm.dept && jobForm.type && jobForm.level;
    if (step === 1) return jobForm.summary && jobForm.responsibilities;
    if (step === 2) return formKras.length > 0 && formKras.every((k) => k.title);
    if (step === 3) return formKpis.length > 0 && formKpis.every((k) => k.name && k.target);
    return true;
  };

  const saveJd = () => {
    const nid = Date.now();
    const newJd = {
      id: nid, title: jobForm.title, dept: jobForm.dept, level: jobForm.level,
      type: jobForm.type, status: "draft", assigned: [],
      created: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      reportingTo: jobForm.reportingTo, location: jobForm.location,
      salaryMin: jobForm.salaryMin, salaryMax: jobForm.salaryMax,
      summary: jobForm.summary, responsibilities: jobForm.responsibilities,
      qualifications: jobForm.qualifications, skills: jobForm.skills, niceToHave: jobForm.niceToHave,
    };
    const nKras = formKras.map((k, i) => ({ id: `k_${nid}_${i}`, jdId: nid, title: k.title, desc: k.desc, weightage: Number(k.weightage) || 0, assignee: k.assignee, effectiveFrom: k.effectiveFrom, effectiveTo: k.effectiveTo, status: k.status }));
    const nKpis = formKpis.map((p, i) => ({ id: `p_${nid}_${i}`, kraId: nKras[p.kraIdx]?.id || "", jdId: nid, name: p.name, unit: p.unit, weightage: Number(p.weightage) || 0, assignee: p.assignee, target: p.target, freq: p.freq, updateType: p.updateType, dataSource: p.dataSource, module: p.module }));
    setAllJds((j) => [newJd, ...j]);
    setAllKras((k) => [...k, ...nKras]);
    setAllKpis((p) => [...p, ...nKpis]);
    showToast("Job description saved as draft");
    resetCreate();
  };

  const publishJd = (id) => {
    setAllJds((prev) => prev.map((j) => (j.id === id ? { ...j, status: "published" } : j)));
    showToast("Job description published successfully");
  };

  const startEditJd = (id) => {
    const jd = allJds.find((j) => j.id === id);
    if (!jd) return;
    setEditForm({ title: jd.title || "", dept: jd.dept || "", reportingTo: jd.reportingTo || "", type: jd.type || "", level: jd.level || "", location: jd.location || "", salaryMin: jd.salaryMin || "", salaryMax: jd.salaryMax || "", summary: jd.summary || "", responsibilities: jd.responsibilities || "", qualifications: jd.qualifications || "", skills: jd.skills || "", niceToHave: jd.niceToHave || "" });
    setEditingJd(id);
    setViewingJd(null);
    setView("list");
  };

  const saveEditJd = () => {
    setAllJds((prev) => prev.map((j) => j.id === editingJd ? { ...j, title: editForm.title, dept: editForm.dept, reportingTo: editForm.reportingTo, type: editForm.type, level: editForm.level, location: editForm.location, salaryMin: editForm.salaryMin, salaryMax: editForm.salaryMax, summary: editForm.summary, responsibilities: editForm.responsibilities, qualifications: editForm.qualifications, skills: editForm.skills, niceToHave: editForm.niceToHave } : j));
    showToast("Job description updated successfully");
    setEditingJd(null);
  };

  const cancelEditJd = () => setEditingJd(null);
  const ef = (k, v) => setEditForm((f) => ({ ...f, [k]: v }));

  const resetCreate = () => {
    setView("list"); setStep(0); setJdMethod(null); setKraAiDone(false); setKpiAiDone(false);
    setJobForm({ title: "", dept: "", reportingTo: "", type: "", level: "", location: "", salaryMin: "", salaryMax: "", summary: "", responsibilities: "", qualifications: "", skills: "", niceToHave: "" });
    setFormKras([]); setFormKpis([]);
  };

  const assignUser = () => {
    if (!assignName.trim()) return;
    setAllJds((j) => j.map((jd) => jd.id === assignModal ? { ...jd, assigned: [...jd.assigned, assignName.trim()] } : jd));
    setAssignName(""); setAssignModal(null);
    showToast("Member assigned successfully");
  };

  const saveNewKra = () => {
    if (!newKra.jdId || !newKra.title) return;
    setAllKras((ks) => [...ks, { id: `k_new_${Date.now()}`, jdId: Number(newKra.jdId), ...newKra }]);
    setNewKra({ jdId: "", title: "", desc: "", weightage: "", assignee: "", effectiveFrom: "", effectiveTo: "", status: "active" });
    setShowAddKra(false);
    showToast("KRA added successfully");
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
    const selectedDeptJd = allJds.find((j) => j.dept === kpiDeptFilter || sameId(j.departmentId, kpiDeptFilter));
    const selectedRoleJd = allJds.find((j) => j.title === kpiRoleFilter);
    const selectedMemberJd = allJds.find((j) => Array.isArray(j.assigned) && j.assigned.includes(kpiMemberFilter));
    const numericDept = Number(kpiDeptFilter);
    return {
      search: kpiSearch,
      departmentId: selectedDeptJd?.departmentId || (Number.isFinite(numericDept) ? numericDept : undefined),
      jobDescriptionId: selectedRoleJd?.id || selectedMemberJd?.id,
    };
  }, [allJds, kpiDeptFilter, kpiMemberFilter, kpiRoleFilter, kpiSearch]);

  const refreshKpis = useCallback(() => {
    loadKpis(kpiApiFilters());
  }, [kpiApiFilters, loadKpis]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshKpis();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [refreshKpis]);

  const saveNewKpi = async () => {
    if (!newKpi.jdId || !newKpi.kraId || !newKpi.name || !newKpi.target) return;
    const selectedJd = allJds.find((j) => sameId(j.id, newKpi.jdId));
    const selectedKra = allKras.find((k) => sameId(k.id, newKpi.kraId));
    const payloadForm = {
      ...newKpi,
      departmentId: newKpi.departmentId || selectedJd?.departmentId || selectedJd?.deptId || selectedKra?.departmentId,
    };
    setKpisSaving(true);
    try {
      const created = await createKpi(payloadForm);
      if (created) setAllKpis((ps) => [created, ...ps.filter((p) => !sameId(p.id, created.id))]);
      else await refreshKpis();
      setNewKpi({ jdId: "", kraId: "", departmentId: "", name: "", unit: "", weightage: "", assignee: "", assigneeIds: [], target: "", freq: "", updateType: "manual", dataSource: "", module: "", measurementType: "positive" });
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
    setActivityLogs((l) => [{
      id: `local-${Date.now()}`, type, entity, name, user: "You",
      timestamp: new Date().toLocaleString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(",", ""),
      detail,
    }, ...l]);
  };

  const toggleKraStatus = (id) => {
    const kra = allKras.find((k) => k.id === id);
    if (!kra) return;
    const ns = kra.status === "active" ? "inactive" : "active";
    setAllKras((ks) => ks.map((k) => (k.id === id ? { ...k, status: ns } : k)));
    addLog(ns === "active" ? "activate" : "deactivate", "KRA", kra.title, `Status changed to ${ns === "active" ? "Active" : "Inactive"}`);
    showToast(`KRA ${ns === "active" ? "activated" : "deactivated"}`);
  };

  const toggleKpiStatus = async (id) => {
    const kpi = allKpis.find((p) => p.id === id);
    if (!kpi) return;
    const ns = kpi.status === "active" ? "inactive" : "active";
    const previous = allKpis;
    setAllKpis((ps) => ps.map((p) => (sameId(p.id, id) ? { ...p, status: ns } : p)));
    try {
      const updated = await updateKpi(id, kpi.hasActiveFlag ? { active: ns === "active" } : { status: ns });
      if (updated) setAllKpis((ps) => ps.map((p) => (sameId(p.id, id) ? { ...p, ...updated } : p)));
      addLog(ns === "active" ? "activate" : "deactivate", "KPI", kpi.name, `Status changed to ${ns === "active" ? "Active" : "Inactive"}`);
      showToast(`KPI ${ns === "active" ? "activated" : "deactivated"}`);
    } catch (err) {
      setAllKpis(previous);
      toast.error(`Could not update KPI status: ${err?.message || "request failed"}`);
    }
  };

  const openEditKra = (kra) => {
    setEditingKraId(kra.id);
    setEditKraForm({ title: kra.title, desc: kra.desc, weightage: kra.weightage, effectiveFrom: kra.effectiveFrom, effectiveTo: kra.effectiveTo, status: kra.status });
  };

  const saveEditKra = () => {
    setAllKras((ks) => ks.map((k) => k.id === editingKraId ? { ...k, ...editKraForm, weightage: Number(editKraForm.weightage) || 0 } : k));
    addLog("edit", "KRA", editKraForm.title, "KRA details updated");
    setEditingKraId(null);
    showToast("KRA updated");
  };

  const openEditKpi = (kpi) => {
    setEditingKpiId(kpi.id);
    setEditKpiForm({ jdId: kpi.jdId || "", kraId: kpi.kraId || "", departmentId: kpi.departmentId || "", name: kpi.name, unit: kpi.unit, weightage: kpi.weightage, target: kpi.target, freq: kpi.freq, updateType: kpi.updateType, dataSource: kpi.dataSource || "", module: kpi.module || "", measurementType: kpi.measurementType || "positive", assigneeIds: kpi.assigneeIds || [] });
  };

  const saveEditKpi = async () => {
    const previous = allKpis;
    const localPatch = { ...editKpiForm, weightage: Number(editKpiForm.weightage) || 0 };
    setAllKpis((ps) => ps.map((p) => sameId(p.id, editingKpiId) ? { ...p, ...localPatch } : p));
    setKpisSaving(true);
    try {
      const updated = await updateKpi(editingKpiId, toKpiPayload(editKpiForm));
      if (updated) setAllKpis((ps) => ps.map((p) => sameId(p.id, editingKpiId) ? { ...p, ...updated } : p));
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
    addLog("assign", "KRA", allKras.find((k) => k.id === assignKraModal)?.title || "", `Assigned to ${assignKraName.trim()}`);
    setAssignKraName(""); setAssignKraModal(null);
    showToast("Person assigned to KRA");
  };

  const assignToKpi = () => {
    if (!assignKpiName.trim()) return;
    addLog("assign", "KPI", allKpis.find((p) => p.id === assignKpiModal)?.name || "", `Assigned to ${assignKpiName.trim()}`);
    setAssignKpiName(""); setAssignKpiModal(null);
    showToast("Person assigned to KPI");
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
      toast.error(`Could not save KPI units: ${err?.message || "request failed"}`);
    } finally {
      setUnitsSaving(false);
    }
  };

  const addCustomUnit = () => {
    const trimmed = newUnitInput.trim();
    if (!trimmed) return;
    if (customUnits.some((u) => u.name.toLowerCase() === trimmed.toLowerCase())) {
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
    if (file) { const reader = new FileReader(); reader.onload = (ev) => setLogoPreview(ev.target.result); reader.readAsDataURL(file); }
  };
  const openDeptModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept.id);
      setDeptForm({ name: dept.name, head: dept.head, members: String(dept.members), description: dept.description || "", status: dept.status });
    } else {
      setEditingDept(null);
      setDeptForm({ name: "", head: "", members: "", description: "", status: "active" });
    }
    setShowDeptModal(true);
  };
  const saveDept = () => {
    if (editingDept) {
      setDepartments((ds) => ds.map((d) => d.id === editingDept ? { ...d, ...deptForm, members: Number(deptForm.members) || d.members } : d));
    } else {
      setDepartments((ds) => [...ds, { id: Date.now(), name: deptForm.name, head: deptForm.head, members: Number(deptForm.members) || 0, color: COLORS[ds.length % COLORS.length], status: deptForm.status, description: deptForm.description }]);
    }
    setShowDeptModal(false);
    showToast(editingDept ? "Department updated" : "Department created");
  };
  const deleteDept = (id) => setDepartments((ds) => ds.filter((d) => d.id !== id));
  const filteredDepts = departments.filter((d) => d.name.toLowerCase().includes(deptSearch.toLowerCase()));

  /* ── Members handlers ── */
  const memberDepts = [...new Set(allMembers.map((m) => m.department).filter(Boolean))];
  const filteredMembers = allMembers.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase());
    const matchDept = memberDeptFilter === "all" || m.department === memberDeptFilter;
    const matchStatus = memberStatusFilter === "all" || m.status === memberStatusFilter;
    return matchSearch && matchDept && matchStatus;
  });
  const groupedMembers = memberDepts.reduce((acc, dept) => { const members = filteredMembers.filter((m) => m.department === dept); if (members.length > 0) acc[dept] = members; return acc; }, {});
  const ungrouped = filteredMembers.filter((m) => !m.department);

  const openInvite = (mode) => {
    setInviteMode(mode);
    setInviteRows(mode === "bulk" ? [{ name: "", email: "", department: "" }, { name: "", email: "", department: "" }, { name: "", email: "", department: "" }] : [{ name: "", email: "", department: "" }]);
    setShowInviteModal(true);
  };
  const updateInviteRow = (idx, field, val) => setInviteRows((rs) => rs.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  const addInviteRow = () => setInviteRows((rs) => [...rs, { name: "", email: "", department: "" }]);
  const removeInviteRow = (idx) => setInviteRows((rs) => rs.filter((_, i) => i !== idx));
  const sendInvites = () => {
    const valid = inviteRows.filter((r) => r.name.trim() && r.email.trim());
    if (valid.length === 0) return;
    const newMembers = valid.map((r, i) => ({ id: Date.now() + i, name: r.name.trim(), email: r.email.trim(), department: r.department || "", status: "active", isHOD: false }));
    setAllMembers((ms) => [...ms, ...newMembers]);
    setShowInviteModal(false);
    showToast(`${valid.length} invite${valid.length > 1 ? "s" : ""} sent successfully`);
  };
  const openEditMember = (m) => { setEditingMember(m.id); setEditMemberForm({ name: m.name, email: m.email, department: m.department, isHOD: m.isHOD }); };
  const saveEditMember = () => { setAllMembers((ms) => ms.map((m) => (m.id === editingMember ? { ...m, ...editMemberForm } : m))); setEditingMember(null); showToast("Member updated"); };
  const toggleMemberStatus = (id) => { setAllMembers((ms) => ms.map((m) => m.id === id ? { ...m, status: m.status === "active" ? "inactive" : "active" } : m)); showToast("Member status updated"); };
  const deleteMember = (id) => { setAllMembers((ms) => ms.filter((m) => m.id !== id)); setActionMenuMember(null); showToast("Member removed"); };
  const assignKraToMember = () => {
    if (!assignKraMemberKraId || !assignKraMemberModal) return;
    const member = allMembers.find((m) => m.id === assignKraMemberModal);
    const kra = allKras.find((k) => k.id === assignKraMemberKraId);
    if (member && kra) addLog("assign", "KRA", kra.title, `Assigned to ${member.name}`);
    setAssignKraMemberKraId(""); setAssignKraMemberModal(null);
    showToast("KRA assigned to member");
  };
  const assignKpiToMember = () => {
    if (!assignKpiMemberKpiId || !assignKpiMemberModal) return;
    const member = allMembers.find((m) => m.id === assignKpiMemberModal);
    const kpi = allKpis.find((p) => p.id === assignKpiMemberKpiId);
    if (member && kpi) addLog("assign", "KPI", kpi.name, `Assigned to ${member.name}`);
    setAssignKpiMemberKpiId(""); setAssignKpiMemberModal(null);
    showToast("KPI assigned to member");
  };

  const filteredJds = allJds.filter((j) => j.title.toLowerCase().includes(jdSearch.toLowerCase()));
  const jdsByDept = (dept) => allJds.filter((j) => j.dept === dept).map((j) => j.id);
  const jdsByRole = (role) => allJds.filter((j) => j.title === role).map((j) => j.id);
  const jdsByMember = (member) => allJds.filter((j) => j.assigned.includes(member)).map((j) => j.id);
  const uniqueDepts = [...new Set(allJds.map((j) => j.dept))];
  const uniqueRoles = [...new Set(allJds.map((j) => j.title))];
  const uniqueMembers = [...new Set(allJds.flatMap((j) => j.assigned))];

  const applyListFilters = (items, deptF, roleF, memberF, searchVal, searchField) => {
    return items.filter((item) => {
      const matchSearch = item[searchField].toLowerCase().includes(searchVal.toLowerCase());
      const matchDept = deptF === "all" || jdsByDept(deptF).includes(item.jdId);
      const matchRole = roleF === "all" || jdsByRole(roleF).includes(item.jdId);
      const matchMember = memberF === "all" || jdsByMember(memberF).includes(item.jdId);
      return matchSearch && matchDept && matchRole && matchMember;
    });
  };
  const filteredKras = applyListFilters(allKras, kraDeptFilter, kraRoleFilter, kraMemberFilter, kraSearch, "title");
  const filteredKpis = applyListFilters(allKpis, kpiDeptFilter, kpiRoleFilter, kpiMemberFilter, kpiSearch, "name");

  const value = {
    activeNav, setActiveNav, jobTab, setJobTab, view, setView, viewingJd, setViewingJd,
    step, setStep, jdMethod, setJdMethod,
    aiLoading, setAiLoading, kraAiDone, setKraAiDone, kpiAiLoading, setKpiAiLoading, kpiAiDone, setKpiAiDone,
    allJds, setAllJds, allKras, setAllKras, allKpis, setAllKpis,
    kpisLoading, kpisError, kpisSaving, loadKpis, refreshKpis,
    jdSearch, setJdSearch, kraSearch, setKraSearch, kpiSearch, setKpiSearch,
    assignModal, setAssignModal, assignName, setAssignName,
    expandedKra, setExpandedKra,
    showAddKra, setShowAddKra, showAddKpi, setShowAddKpi, newKra, setNewKra, newKpi, setNewKpi,
    kraDeptFilter, setKraDeptFilter, kraRoleFilter, setKraRoleFilter, kraMemberFilter, setKraMemberFilter,
    kpiDeptFilter, setKpiDeptFilter, kpiRoleFilter, setKpiRoleFilter, kpiMemberFilter, setKpiMemberFilter,
    kraViewMode, setKraViewMode, kpiViewMode, setKpiViewMode,
    actionMenuJd, setActionMenuJd, actionMenuMember, setActionMenuMember,
    editingJd, setEditingJd, editForm, setEditForm, ef,
    setupTab, setSetupTab, logoPreview, setLogoPreview,
    departments, setDepartments, showDeptModal, setShowDeptModal,
    editingDept, setEditingDept, deptSearch, setDeptSearch, deptForm, setDeptForm, fileRef,
    allMembers, setAllMembers, memberSearch, setMemberSearch,
    memberDeptFilter, setMemberDeptFilter, memberStatusFilter, setMemberStatusFilter,
    memberGroupView, setMemberGroupView, viewingMember, setViewingMember,
    showInviteModal, setShowInviteModal, inviteMode, setInviteMode,
    inviteRows, setInviteRows, editingMember, setEditingMember, editMemberForm, setEditMemberForm,
    assignKraMemberModal, setAssignKraMemberModal, assignKraMemberKraId, setAssignKraMemberKraId,
    assignKpiMemberModal, setAssignKpiMemberModal, assignKpiMemberKpiId, setAssignKpiMemberKpiId,
    customUnits, setCustomUnits, newUnitInput, setNewUnitInput,
    unitsLoading, unitsSaving, unitsError,
    activityLogs, setActivityLogs,
    logsLoading, logsError, logsPage, logsMeta, loadActivityLogs,
    editingKraId, setEditingKraId, editKraForm, setEditKraForm,
    editingKpiId, setEditingKpiId, editKpiForm, setEditKpiForm,
    assignKraModal, setAssignKraModal, assignKraName, setAssignKraName,
    assignKpiModal, setAssignKpiModal, assignKpiName, setAssignKpiName,
    jobForm, setJobForm, formKras, setFormKras, formKpis, setFormKpis, sf,
    jdTitle, kraName, kraCountFor, kpiCountFor, krasForJd, initials, totalKpiWeight,
    simulateAiJd, simulateAiKras, simulateAiKpis,
    addFormKra, updFormKra, remFormKra, addFormKpi, updFormKpi, remFormKpi, canNext,
    saveJd, publishJd, startEditJd, saveEditJd, cancelEditJd, resetCreate,
    assignUser, saveNewKra, saveNewKpi, addLog,
    toggleKraStatus, toggleKpiStatus, openEditKra, saveEditKra, openEditKpi, saveEditKpi,
    assignToKra, assignToKpi, addCustomUnit, removeCustomUnit,
    handleLogoUpload, openDeptModal, saveDept, deleteDept,
    openInvite, updateInviteRow, addInviteRow, removeInviteRow, sendInvites,
    openEditMember, saveEditMember, toggleMemberStatus, deleteMember,
    assignKraToMember, assignKpiToMember,
    filteredJds, filteredKras, filteredKpis, filteredDepts,
    filteredMembers, groupedMembers, ungrouped, memberDepts,
    uniqueDepts, uniqueRoles, uniqueMembers,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}
