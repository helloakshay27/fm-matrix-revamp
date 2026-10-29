import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

const BASE_PATH = "/pms/manage/checkpoint_visits";

export class PatrollingApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "PatrollingApiError";
    this.status = status;
  }
}

export interface PatrollingListParams {
  search?: string;
  status?: string;
  patrolling_route_id?: number | string;
  schedule_date_from?: string;
  schedule_date_to?: string;
  patrol_date_from?: string;
  patrol_date_to?: string;
  submitted_by_id?: number | string;
  approved_by_id?: number | string;
  building_id?: number | string;
  wing_id?: number | string;
  area_id?: number | string;
  floor_id?: number | string;
  room_id?: number | string;
  page?: number;
  per_page?: number;
}

export interface PatrollingResponseRow {
  response_id: string;
  visit_id: number | null;
  session_id: number;
  checkpoint_id: number;
  patrol_name: string | null;
  checkpoint_name: string | null;
  building: string | null;
  wing: string | null;
  area: string | null;
  floor: string | null;
  room: string | null;
  schedule_time: string | null;
  grace_time_hours: number | null;
  status: string;
  patrolling_date: string | null;
  patrolling_time: string | null;
  start_time: string | null;
  end_time: string | null;
  submitted_by: string | null;
  approved_by: string | null;
  approved_on: string | null;
  approval_status: string | null;
}

export interface PatrollingListResponse {
  success: boolean;
  summary: {
    total_scheduled: number;
    completed: number;
    missed: number;
    tickets_raised: number;
    incidents_reported: number;
  };
  data: PatrollingResponseRow[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_entries: number;
  };
}

export interface PatrollingAttachment {
  id: number;
  file_name: string;
  file_url: string;
}

export interface PatrollingQuestion {
  question_id: number;
  question: string;
  answer: string | null;
  comments: string | null;
  submitted_by: string | null;
  attachments: PatrollingAttachment[];
  approved_by: string | null;
  approved_on: string | null;
  ticket_ids: string[];
  incident_ids: string[];
}

export interface PatrollingDetailResponse {
  success: boolean;
  data: PatrollingResponseRow & {
    notes: string | null;
    attachments: PatrollingAttachment[];
    questions: PatrollingQuestion[];
  };
}

const buildUrl = (path: string, params?: PatrollingListParams) => {
  const qs = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      qs.append(key, String(value));
    }
  });
  const query = qs.toString();
  return getFullUrl(`${BASE_PATH}${path}${query ? `?${query}` : ""}`);
};

const request = async (path: string, params?: PatrollingListParams, accept = "application/json") => {
  const res = await fetch(buildUrl(path, params), {
    headers: { Authorization: getAuthHeader(), Accept: accept },
  });
  if (!res.ok) {
    let body: any = null;
    try {
      body = await res.json();
    } catch {
      // not JSON, e.g. an HTML 500 page
    }
    throw new PatrollingApiError(
      res.status,
      body?.error || body?.message || `Request failed (${res.status})`
    );
  }
  return res;
};

export const fetchPatrollingResponses = async (
  params: PatrollingListParams
): Promise<PatrollingListResponse> => (await request("", params)).json();

export const fetchPatrollingResponseDetails = async (
  responseId: string
): Promise<PatrollingDetailResponse> =>
  (await request(`/${encodeURIComponent(responseId)}`)).json();

// Same filters as the list call, without page / per_page.
export const exportPatrollingResponses = async (
  params: PatrollingListParams
): Promise<{ blob: Blob; filename: string }> => {
  const res = await request("/export", params, "*/*");
  const match = /filename="?([^";]+)"?/.exec(res.headers.get("Content-Disposition") || "");
  return {
    blob: await res.blob(),
    filename: match ? match[1] : "patrolling_responses.xlsx",
  };
};
