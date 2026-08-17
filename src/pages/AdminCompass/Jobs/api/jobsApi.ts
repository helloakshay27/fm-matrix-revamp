// @ts-nocheck
import axios from "axios";
import { getAuthHeader } from "@/config/apiConfig";

const LEVEL_MAP = {
  "Entry Level": "entry",
  "Mid Level": "mid",
  Senior: "senior",
  Lead: "lead",
  Manager: "manager",
  Director: "director",
  VP: "vp",
  "C-Suite": "c_suite",
};

const TYPE_MAP = {
  "Full-time": "full_time",
  "Part-time": "part_time",
  Contract: "contract",
  Internship: "internship",
};

function getBaseUrl() {
  return (localStorage.getItem("baseUrl") || "").replace(/\/$/, "");
}

function getDepartmentId(departments, jobForm) {
  const deptIdValue = jobForm?.deptId ?? jobForm?.departmentId ?? jobForm?.dept;
  if (deptIdValue !== undefined && deptIdValue !== null && deptIdValue !== "") {
    const matchedById = departments.find((d) => String(d.id) === String(deptIdValue));
    if (matchedById) return matchedById.id;

    const matchedByName = departments.find((d) =>
      [d.department_name, d.name, d.title].some((label) =>
        String(label || "").trim().toLowerCase() === String(deptIdValue).trim().toLowerCase()
      )
    );
    if (matchedByName) return matchedByName.id;
  }

  return null;
}

export function buildJobPayload(jobForm, formKras, formKpis, departments) {
  return {
    job_title: jobForm.title,
    department_id: getDepartmentId(departments, jobForm),
    experience_level: LEVEL_MAP[jobForm.level] || jobForm.level,
    employment_type: TYPE_MAP[jobForm.type] || jobForm.type,
    reports_to: jobForm.reportingTo || null,
    location: jobForm.location || null,
    salary_min: jobForm.salaryMin ? Number(jobForm.salaryMin) : null,
    salary_max: jobForm.salaryMax ? Number(jobForm.salaryMax) : null,
    summary: jobForm.summary || null,
    responsibilities: jobForm.responsibilities || null,
    qualifications: jobForm.qualifications || null,
    skills: jobForm.skills || null,
    nice_to_have: jobForm.niceToHave || null,
    kras: formKras.map((kra) => ({
      title: kra.title,
      description: kra.desc || null,
      weightage: Number(kra.weightage) || 0,
      effective_from: kra.effectiveFrom || null,
      effective_to: kra.effectiveTo || null,
      status: kra.status || "active",
      track_daily: false,
      track_weekly: true,
      kpis: formKpis
        .filter((p) => p.kraIdx === formKras.indexOf(kra))
        .map((kpi) => ({
          name: kpi.name,
          unit: kpi.unit || null,
          weightage: Number(kpi.weightage) || 0,
          target: kpi.target || null,
          freq: kpi.freq || null,
          measurement_type: kpi.measurementType || "positive",
          update_type: kpi.updateType || "manual",
          data_source: kpi.dataSource || null,
          module: kpi.module || null,
          description: null,
        })),
    })),
  };
}

export async function createJobDescription(payload) {
  const baseUrl = getBaseUrl();

  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const url = `https://${baseUrl}/job_descriptions`;

  const res = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
  });

  return res.data;
}

const LEVEL_MAP_REVERSE = Object.fromEntries(
  Object.entries(LEVEL_MAP).map(([k, v]) => [v, k])
);

const TYPE_MAP_REVERSE = Object.fromEntries(
  Object.entries(TYPE_MAP).map(([k, v]) => [v, k])
);

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getDeptName(department) {
  if (!department) return "—";
  if (typeof department === "object") return department.name || department.department_name || department.title || "—";
  return department;
}

function getDeptId(department) {
  if (!department || typeof department !== "object") return null;
  return department.id ?? department.department_id ?? null;
}

/**
 * Assignees ke liye API kai shapes bhejta hai — objects ki list, sirf ids, ya
 * comma-separated names. Sab handle karke { ids, names } return karte hain.
 */
function mapJdAssignees(apiJd) {
  const ids = [];
  const names = [];
  const raw = apiJd?.assignees ?? apiJd?.assigned_users ?? apiJd?.users;
  if (Array.isArray(raw))
    raw.forEach((entry) => {
      if (entry && typeof entry === "object") {
        const id = entry.id ?? entry.user_id;
        if (id !== undefined && id !== null) ids.push(Number(id));
        const name = entry.full_name || entry.name || entry.user_name || "";
        if (name) names.push(String(name).trim());
      } else if (entry !== undefined && entry !== null) {
        ids.push(Number(entry));
      }
    });
  if (!ids.length && Array.isArray(apiJd?.assignee_ids))
    apiJd.assignee_ids.forEach((id) => {
      if (id !== undefined && id !== null) ids.push(Number(id));
    });
  // List API singular `assignee_id`/`assignee_name` bhi bhejta hai jab
  // `assignees` array khali ho — usse bhi uthate hain.
  if (!ids.length && apiJd?.assignee_id !== undefined && apiJd?.assignee_id !== null)
    ids.push(Number(apiJd.assignee_id));
  if (!names.length && apiJd?.assignee_name)
    names.push(String(apiJd.assignee_name).trim());
  if (!names.length) {
    const rawNames = apiJd?.assignee_names ?? apiJd?.assigned_to;
    if (Array.isArray(rawNames))
      names.push(...rawNames.filter(Boolean).map((n) => String(n).trim()));
    else if (typeof rawNames === "string" && rawNames.trim())
      names.push(...rawNames.split(",").map((n) => n.trim()).filter(Boolean));
  }
  return {
    ids: [...new Set(ids.filter((id) => Number.isFinite(id)))],
    names: names.filter(Boolean),
  };
}

export function mapApiJdToUi(apiJd) {
  const department = apiJd.department || null;
  const assignees = mapJdAssignees(apiJd);
  return {
    id: apiJd.id,
    title: apiJd.job_title || "—",
    dept: getDeptName(department),
    deptId: getDeptId(department),
    departmentId: getDeptId(department),
    level: LEVEL_MAP_REVERSE[apiJd.experience_level] || apiJd.experience_level || "—",
    type: TYPE_MAP_REVERSE[apiJd.employment_type] || apiJd.employment_type || "—",
    status: apiJd.status || "active",
    created: formatDate(apiJd.created_at),
    assigned: assignees.names,
    assigneeIds: assignees.ids,
    reportingTo: null,
    location: null,
    salaryMin: null,
    salaryMax: null,
    summary: null,
    responsibilities: null,
    qualifications: null,
    skills: null,
    niceToHave: null,
    krasCount: apiJd.kras_count ?? 0,
    kpisCount: apiJd.kpis_count ?? 0,
  };
}

export async function fetchJobDescriptions() {
  const baseUrl = getBaseUrl();

  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const url = `https://${baseUrl}/job_descriptions`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: getAuthHeader(),
    },
  });

  const body = res.data;
  if (!body?.success) throw new Error(body?.message || "Failed to fetch job descriptions");

  const rawList = body.data?.job_descriptions || [];
  return rawList.map(mapApiJdToUi);
}

function mapApiKraToUi(apiKra) {
  const assignees = Array.isArray(apiKra.assignees) ? apiKra.assignees : [];
  const assigneeIdsFromUsers = assignees
    .map((user) => user?.id ?? user?.user_id)
    .filter((id) => id !== undefined && id !== null);
  const assigneeNamesFromUsers = assignees
    .map((user) => user?.name || user?.full_name)
    .filter(Boolean);
  const assigneeIds = assigneeIdsFromUsers.length
    ? assigneeIdsFromUsers
    : Array.isArray(apiKra.assignee_ids)
      ? apiKra.assignee_ids
      : apiKra.assignee_id != null
        ? [apiKra.assignee_id]
        : [];

  return {
    id: apiKra.id,
    jdId: apiKra.job_description_id ?? null,
    title: apiKra.title || "—",
    desc: apiKra.description || "",
    weightage: Number(apiKra.weightage) || 0,
    assignee: apiKra.assignee_name || assigneeNamesFromUsers[0] || "",
    assigneeNames: assigneeNamesFromUsers,
    // Assign modal current assignees ko in ids se pre-select karta hai.
    assigneeId: apiKra.assignee_id ?? assigneeIds[0] ?? null,
    assigneeIds,
    assignees,
    effectiveFrom: apiKra.effective_from || "",
    effectiveTo: apiKra.effective_to || "",
    status: apiKra.status || "active",
    departmentName: apiKra.department_name || "",
    roleTitle: apiKra.job_title || "",
    kpis: (apiKra.kpis || []).map((apiKpi) => {
      const kpiAssignees = Array.isArray(apiKpi.assignees)
        ? apiKpi.assignees
        : [];
      return {
        id: apiKpi.id,
        kraId: apiKra.id,
        jdId: apiKra.job_description_id ?? null,
        name: apiKpi.name || "—",
        unit: apiKpi.unit || "",
        weight: Number(apiKpi.weight || apiKpi.weightage) || 0,
        weightage: Number(apiKpi.weight || apiKpi.weightage) || 0,
        targetValue: apiKpi.target_value || "",
        target: apiKpi.target_value || "",
        frequency: apiKpi.frequency || "",
        freq: apiKpi.frequency || "",
        measurementType: apiKpi.measurement_type || "positive",
        dataSource: apiKpi.data_source || "",
        moduleName: apiKpi.module_name || "",
        status: apiKpi.status || "active",
        assigneeIds: kpiAssignees
          .map((user) => user?.id ?? user?.user_id)
          .filter((id) => id !== undefined && id !== null),
        assigneeNames: kpiAssignees
          .map((user) => user?.name || user?.full_name)
          .filter(Boolean),
      };
    }),
    kpiCount: apiKra.kpis_count ?? (apiKra.kpis || []).length,
  };
}

function mapApiKpiToUi(apiKpi) {
  return {
    id: apiKpi.id,
    jdId: null,
    kraId: null,
    name: apiKpi.name || "—",
    unit: apiKpi.unit || "",
    weightage: Number(apiKpi.weight || apiKpi.weightage) || 0,
    target: apiKpi.target_value || "",
    freq: apiKpi.frequency || "",
    updateType: apiKpi.data_source ? "automatic" : "manual",
    dataSource: apiKpi.data_source || "",
    module: apiKpi.module_name || "",
    measurementType: apiKpi.measurement_type || "positive",
    status: apiKpi.status || "active",
  };
}

export async function fetchKras(departmentId = null, assigneeId = null) {
  const baseUrl = getBaseUrl();

  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const params = new URLSearchParams();
  params.set("access_token", localStorage.getItem("token") || "");
  if (departmentId) {
    params.set("department_id", String(departmentId));
  }
  if (assigneeId !== null && assigneeId !== undefined && assigneeId !== "" && assigneeId !== "all") {
    params.set("assignee_id", String(assigneeId));
  }

  const url = `https://${baseUrl}/kras.json?${params.toString()}`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: getAuthHeader(),
    },
  });

  const body = res.data;
  if (!body?.success) throw new Error(body?.message || "Failed to fetch KRAs");

  const rawList = body.data?.kras || [];
  return rawList.map(mapApiKraToUi);
}

export async function fetchJobDetail(jobId) {
  const baseUrl = getBaseUrl();

  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const url = `https://${baseUrl}/job_descriptions/${jobId}`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: getAuthHeader(),
    },
  });

  const body = res.data;
  if (!body?.success) throw new Error(body?.message || "Failed to fetch job detail");

  const d = body.data;
  const jd = {
    ...mapApiJdToUi(d),
    summary: d.summary || null,
    reportingTo: d.reports_to || null,
    location: d.location || null,
    salaryMin: d.salary_min ?? null,
    salaryMax: d.salary_max ?? null,
    responsibilities: d.responsibilities || null,
    qualifications: d.qualifications || null,
    skills: d.skills || null,
    niceToHave: d.nice_to_have || null,
  };

  const kras = (d.kras || []).map((ak) => ({
    ...mapApiKraToUi(ak),
    jdId: jd.id,
  }));

  const kpis = (d.kpis || []).map((ak) => ({
    ...mapApiKpiToUi(ak),
    jdId: jd.id,
  }));

  kras.forEach((kra) => {
    const apiKra = (d.kras || []).find((ak) => ak.id === kra.id);
    (apiKra?.kpis || []).forEach((apiKpi) => {
      const matched = kpis.find((kp) => kp.id === apiKpi.id);
      if (matched) matched.kraId = kra.id;
    });
  });

  return { jd, kras, kpis };
}

export function buildEditJobPayload(editForm, departments) {
  const deptIdValue = editForm.deptId ?? editForm.departmentId ?? editForm.dept ?? null;
  const department = departments.find((d) => String(d.id) === String(deptIdValue))
    || departments.find((d) => [d.department_name, d.name, d.title].some((label) => String(label || "").trim().toLowerCase() === String(editForm.dept || "").trim().toLowerCase()));
  const departmentId = deptIdValue !== null && deptIdValue !== "" && deptIdValue !== undefined
    ? Number(deptIdValue)
    : department?.id ?? null;

  return {
    job_title: editForm.title,
    department_id: departmentId,
    experience_level: LEVEL_MAP[editForm.level] || editForm.level,
    employment_type: TYPE_MAP[editForm.type] || editForm.type,
    reports_to: editForm.reportingTo || null,
    location: editForm.location || null,
    salary_min: editForm.salaryMin ? Number(editForm.salaryMin) : null,
    salary_max: editForm.salaryMax ? Number(editForm.salaryMax) : null,
    summary: editForm.summary || null,
    responsibilities: editForm.responsibilities || null,
    qualifications: editForm.qualifications || null,
    skills: editForm.skills || null,
    nice_to_have: editForm.niceToHave || null,
  };
}

/**
 * PUT {BASE_URL}/job_descriptions/:id.json?access_token=…
 *   body: { "assignee_ids": [45532, 291179] }
 * Poori list replace hoti hai — isliye caller ko existing + naye ids saath
 * bhejne padte hain. Khali array bhejne se saare assignees hat jate hain.
 */
export async function assignJobDescriptionMembers(jobId, assigneeIds = []) {
  const baseUrl = getBaseUrl();

  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const token = localStorage.getItem("token") || "";
  const url = `https://${baseUrl}/job_descriptions/${jobId}.json?access_token=${encodeURIComponent(token)}`;

  const ids = (assigneeIds || [])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));

  const res = await axios.put(
    url,
    { assignee_ids: ids },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
    }
  );

  const body = res.data;
  if (body && body.success === false)
    throw new Error(body?.message || "Failed to assign job description");
  return body;
}

export async function updateJobDescription(jobId, payload) {
  const baseUrl = getBaseUrl();

  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const url = `https://${baseUrl}/job_descriptions/${jobId}`;

  const res = await axios.patch(url, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
  });

  return res.data;
}
