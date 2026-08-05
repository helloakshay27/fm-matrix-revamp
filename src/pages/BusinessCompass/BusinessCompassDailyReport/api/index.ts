import axios from "axios";
import { getBaseUrl } from "@/utils/auth";

interface ApiContext {
  baseUrl: string;
  token: string;
  userId?: number | string | null;
}

const urlBase = (baseUrl: string) => `https://${baseUrl}`;

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export const fetchTodoDetails = async (
  { baseUrl, token }: ApiContext,
  sourceId: number | string
) => {
  const res = await axios.get(`${urlBase(baseUrl)}/todos/${sourceId}.json`, {
    headers: bearer(token),
  });
  return res.data?.todo ?? res.data;
};

export const fetchRosterWorkingDays = async (
  { baseUrl, token }: ApiContext,
  rosterId: number | string
) => {
  const res = await axios.get(
    `${urlBase(baseUrl)}/pms/admin/user_roasters/${rosterId}.json`,
    { headers: bearer(token) }
  );
  return res.data?.no_of_days?.[0] as Record<string, string[]> | undefined;
};

export const fetchTomorrowScheduled = async (
  ctx: ApiContext,
  nextDay: string
) => {
  const headers = bearer(ctx.token);

  const tasksParams = new URLSearchParams({
    "q[due_date_eq]": nextDay,
  });
  const issuesParams = new URLSearchParams({
    "q[end_date_eq]": nextDay,
  });
  const todosParams = new URLSearchParams({
    "q[target_date_eq]": nextDay,
  });

  const [tasksRes, issuesRes, todosRes] = await Promise.allSettled([
    axios.get(
      `${urlBase(ctx.baseUrl)}/business_compass/tasks/my_tasks.json?${tasksParams}`,
      { headers }
    ),
    axios.get(
      `${urlBase(ctx.baseUrl)}/business_compass/issues/my_issues.json?${issuesParams}`,
      { headers }
    ),
    axios.get(
      `${urlBase(ctx.baseUrl)}/business_compass/todos/my_todos.json?${todosParams}`,
      { headers }
    ),
  ]);

  return {
    tasks:
      tasksRes.status === "fulfilled"
        ? tasksRes.value.data?.task_managements ||
        tasksRes.value.data?.data?.task_managements ||
        []
        : [],
    issues:
      issuesRes.status === "fulfilled"
        ? issuesRes.value.data?.issues || []
        : [],
    todos:
      todosRes.status === "fulfilled" ? todosRes.value.data?.todos || [] : [],
  };
};

export const fetchCompletedItemsForDate = async (
  ctx: ApiContext,
  forDate: string
) => {
  const completedFrom = `${forDate}T00:00:00`;
  const completedTo = `${forDate}T23:59:59`;
  const headers = bearer(ctx.token);

  const fetchAllPages = async (
    url: string,
    baseParams: Record<string, string>,
    dataKey: string
  ) => {
    const all: any[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const params = new URLSearchParams({ ...baseParams, page: String(page) });
      const res = await axios.get(`${url}?${params.toString()}`, { headers });
      const pageItems = res.data?.[dataKey] || res.data?.data?.[dataKey] || [];
      all.push(...pageItems);
      totalPages = res.data?.meta?.total_pages || 1;
      page += 1;
    } while (page <= totalPages);
    return all;
  };

  const [tasks, issues, todos] = await Promise.all([
    fetchAllPages(`${urlBase(ctx.baseUrl)}/business_compass/tasks/my_tasks.json`, {
      "q[completed_at_gteq]": completedFrom,
      "q[completed_at_lteq]": completedTo,
    }, "tasks"),
    fetchAllPages(`${urlBase(ctx.baseUrl)}/business_compass/issues/my_issues.json`, {
      "q[completed_at_gteq]": completedFrom,
      "q[completed_at_lteq]": completedTo,
    }, "issues"),
    fetchAllPages(`${urlBase(ctx.baseUrl)}/business_compass/todos/my_todos.json`, {
      "q[completed_at_gteq]": completedFrom,
      "q[completed_at_lteq]": completedTo,
    }, "todos"),
  ]);

  return { tasks, issues, todos };
};

export const fetchKpis = async (
  startDate: string
) => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  if (!baseUrl || !token) return { kpis: [], entries: {} };
  const response = await axios.get(
    `${urlBase(baseUrl)}/kpis/due_entries.json?date=${startDate}&journal_type=daily`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const entries: { [key: number]: string } = {};
  response.data?.data?.kpis?.forEach((kpi: any) => {
    if (kpi.entry?.actual_value) entries[kpi.kpi_id] = kpi.entry.actual_value;
  });
  return { kpis: response.data?.data?.kpis || [], entries };
};

export const completeTask = async (
  { baseUrl, token }: ApiContext,
  realId: number,
  status: string
) => {
  await axios.put(
    `${urlBase(baseUrl)}/business_compass/tasks/${realId}/update_status.json`,
    { status },
    { headers: bearer(token) }
  );
};

export const completeTodo = async (
  { baseUrl, token }: ApiContext,
  realId: number,
  status: string
) => {
  await axios.put(
    `${urlBase(baseUrl)}/business_compass/todos/${realId}.json`,
    { todo: { status } },
    { headers: bearer(token) }
  );
};

export const completeIssue = async (
  { baseUrl, token }: ApiContext,
  realId: number,
  status: string
) => {
  await axios.put(
    `${urlBase(baseUrl)}/business_compass/issues/${realId}/update_status.json`,
    { status },
    { headers: bearer(token) }
  );
};

export const markItemClosedWithAttachments = async (
  { baseUrl, token }: ApiContext,
  item: { type: string; id: string },
  attachments: any[]
) => {
  const realId = Number(item.id.replace("task-", "").replace("issue-", "").replace("todo-", ""));
  const isTask = item.type === "task";
  const isTodo = item.type === "todo";

  if (isTask || !isTodo) {
    const formDataToSend = new FormData();
    formDataToSend.append(
      isTask ? "task_management[status]" : "issue[status]",
      "completed"
    );
    attachments.forEach((attachment) =>
      formDataToSend.append(
        isTask
          ? "task_management[attachments][]"
          : "issue[attachments][]",
        attachment.file
      )
    );
    await axios.put(
      isTask
        ? `${urlBase(baseUrl)}/task_managements/${realId}.json`
        : `${urlBase(baseUrl)}/issues/${realId}.json`,
      formDataToSend,
      { headers: bearer(token) }
    );
  } else {
    await axios.put(
      `${urlBase(baseUrl)}/todos/${realId}.json`,
      { todo: { status: "completed" } },
      { headers: bearer(token) }
    );
  }
  return realId;
};

export const postComment = async (
  { baseUrl, token }: ApiContext,
  comment: Record<string, unknown>
) => {
  await axios.post(
    `${urlBase(baseUrl)}/comments.json`,
    { comment },
    { headers: bearer(token) }
  );
};

export const updateTaskStatus = async (
  { baseUrl, token }: ApiContext,
  taskId: number,
  status: string
) => {
  await axios.put(
    `${urlBase(baseUrl)}/business_compass/tasks/${taskId}/update_status.json`,
    { status },
    { headers: bearer(token) }
  );
};

export const updateIssueStatus = async (
  { baseUrl, token }: ApiContext,
  issueId: number,
  status: string
) => {
  await axios.put(
    `${urlBase(baseUrl)}/business_compass/issues/${issueId}/update_status.json`,
    { status },
    { headers: bearer(token) }
  );
};

export const fetchExistingReport = async (
  startDate: string,
  prevDateStr: string
) => {
  const baseUrl = (getBaseUrl() ?? "https://fm-uat-api.lockated.com").replace(/\/+$/, "");
  const token = localStorage.getItem("token");
  if (!token) return { journals: [], prevJournals: [] };

  const queryParams = new URLSearchParams();
  queryParams.append("q[journal_type_eq]", "daily");
  queryParams.append("q[start_date_eq]", startDate);
  const url = `${baseUrl}/user_journals.json?${queryParams.toString()}`;

  const prevParams = new URLSearchParams();
  prevParams.append("q[journal_type_eq]", "daily");
  prevParams.append("q[start_date_eq]", prevDateStr);
  const prevUrl = `${baseUrl}/user_journals.json?${prevParams.toString()}`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [response, prevResponse] = await Promise.all([
    axios.get(url, { headers }),
    axios.get(prevUrl, { headers }).catch(() => null),
  ]);

  return {
    journals: response.data,
    prevJournals: prevResponse?.data || null,
  };
};

export const fetchReportsList = async (
  selectedMonth: string,
  selectedYear: string
) => {
  const baseUrl = (getBaseUrl() ?? "https://fm-uat-api.lockated.com").replace(/\/+$/, "");
  const token = localStorage.getItem("token");
  if (!token) return [];

  const queryParams = new URLSearchParams();
  queryParams.append("q[journal_type_eq]", "daily");
  const monthIndex = new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth() + 1;
  const startDate = `${selectedYear}-${monthIndex.toString().padStart(2, "0")}-01`;
  const lastDay = new Date(parseInt(selectedYear), monthIndex, 0).getDate();
  const endDate = `${selectedYear}-${monthIndex.toString().padStart(2, "0")}-${lastDay.toString().padStart(2, "0")}`;
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  queryParams.append("q[start_date_lteq]", todayDate);

  const url = `${baseUrl}/user_journals.json?${queryParams.toString()}`;
  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return Array.isArray(response.data) ? response.data : response.data?.user_journals || [];
};

export const submitUserJournal = async (
  payload: Record<string, unknown>,
  currentReportId: number | null
) => {
  const baseUrl = (getBaseUrl() ?? "https://fm-uat-api.lockated.com").replace(/\/+$/, "");
  const token = localStorage.getItem("token");

  const queryParams = new URLSearchParams();
  queryParams.append("q[journal_type_eq]", "daily");
  const endpoint = currentReportId
    ? `/user_journals/${currentReportId}.json`
    : "/user_journals.json";
  const method = currentReportId ? "PUT" : "POST";
  const url = `${baseUrl}${endpoint}?${queryParams.toString()}`;

  const response = await axios({
    method,
    url,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: payload,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Server returned ${response.status} ${response.statusText}`);
  }
  return response.data;
};

export const fetchReporteeReports = async (
  startDate: string,
  reporteeUserId: number | string | null | undefined
) => {
  const urlBaseValue = (getBaseUrl() ?? "https://fm-uat-api.lockated.com").replace(/\/+$/, "");
  const token = localStorage.getItem("token");
  const res = await axios.get(
    `${urlBaseValue}/user_journals/reportee_daily_report.json`,
    {
      params: { date: startDate, user_id: reporteeUserId },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data?.data ?? res.data ?? {};
};

export const deleteUserJournal = async (reportId: number) => {
  const baseUrl = (getBaseUrl() ?? "https://fm-uat-api.lockated.com").replace(/\/+$/, "");
  const token = localStorage.getItem("token");
  await axios.delete(`${baseUrl}/user_journals/${reportId}.json`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
