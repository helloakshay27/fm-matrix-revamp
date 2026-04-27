const getBaseUrl = (): string => {
  const raw = (localStorage.getItem("baseUrl") || "").replace(/\/$/, "");
  if (!raw) return "";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
};

const BASE_URL = getBaseUrl();

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };
};

let cachedGoals: any[] | null = null;
let goalsPromise: Promise<any[]> | null = null;

let cachedUsers: any[] | null = null;
let usersPromise: Promise<any[]> | null = null;

export const clearCachedGoals = () => {
  cachedGoals = null;
  goalsPromise = null;
};

export const clearCachedUsers = () => {
  cachedUsers = null;
  usersPromise = null;
};

export const fetchCachedGoals = async (): Promise<any[]> => {
  if (cachedGoals) return cachedGoals;
  if (goalsPromise) return goalsPromise;

  goalsPromise = (async () => {
    const res = await fetch(`${BASE_URL}/goals`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const raw = await res.text();
    if (!res.ok) {
      throw new Error(`Goals fetch failed ${res.status}: ${raw.slice(0, 200)}`);
    }

    let json: any;
    try {
      json = JSON.parse(raw);
    } catch {
      json = raw;
    }

    const records: any[] = Array.isArray(json)
      ? json
      : Array.isArray(json.goals)
      ? json.goals
      : Array.isArray(json.data)
      ? json.data
      : [];

    cachedGoals = records;
    return records;
  })().catch((err) => {
    goalsPromise = null;
    throw err;
  });

  return goalsPromise;
};

export const fetchCachedUsers = async (): Promise<any[]> => {
  if (cachedUsers) return cachedUsers;
  if (usersPromise) return usersPromise;

  const orgId =
    localStorage.getItem("org_id") ||
    localStorage.getItem("organization_id") ||
    "";
  if (!orgId) return [];

  usersPromise = (async () => {
    const res = await fetch(
      `${BASE_URL}/api/users?organization_id=${encodeURIComponent(orgId)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const users: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data.users)
      ? data.users
      : Array.isArray(data.data)
      ? data.data
      : [];

    cachedUsers = users;
    return users;
  })().catch((err) => {
    usersPromise = null;
    throw err;
  });

  return usersPromise;
};
