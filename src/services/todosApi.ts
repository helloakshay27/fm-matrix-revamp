import axios from "axios";

interface PaginationInfo {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
}

interface DashboardData {
    p1_count: number;
    p2_count: number;
    p3_count: number;
    p4_count: number;
}

export interface TodosResponse {
    pagination: PaginationInfo;
    dashboard: DashboardData;
    todos: any[];
}

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem("token");
};

// Get baseUrl
const getBaseUrl = () => {
    return localStorage.getItem("baseUrl") ?? "";
};

/**
 * Fetch todos with pagination, filters, and search
 * @param page - Page number (1-indexed)
 * @param taskType - "my" for current user or "all" for all tasks
 * @param userIds - Array of user IDs to filter by (when taskType is "all")
 * @param search - Search term
 * @param fromDate - Start date for filtering (YYYY-MM-DD format)
 * @param toDate - End date for filtering (YYYY-MM-DD format)
 */
export const fetchTodos = async (
    page = 1,
    taskType: "my" | "all" = "my",
    userIds: string[] = [],
    search?: string,
    fromDate?: string,
    toDate?: string
): Promise<TodosResponse> => {
    const token = getToken();
    const baseUrl = getBaseUrl();

    if (!token || !baseUrl) {
        throw new Error("Missing token or baseUrl");
    }

    const params = new URLSearchParams();
    params.append("page", page.toString());

    // Add user filter
    if (taskType === "my") {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;
        if (userId) {
            params.append("q[user_id_eq]", userId);
        }
    } else if (taskType === "all" && userIds.length > 0) {
        userIds.forEach((id) => {
            params.append("q[user_id_in][]", id);
        });
    }

    // Add search if provided
    if (search && search.trim()) {
        params.append("q[title_cont]", search.trim());
    }

    // Add date range filters if provided
    if (fromDate) {
        params.append("q[target_date_or_updated_at_gteq]", fromDate);
    }
    if (toDate) {
        params.append("q[target_date_or_updated_at_lteq]", toDate);
    }

    const url = `https://${baseUrl}/todos.json?${params.toString()}`;

    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

/**
 * Create a new todo
 */
export const createTodo = async (todoData: any) => {
    const token = getToken();
    const baseUrl = getBaseUrl();

    if (!token || !baseUrl) {
        throw new Error("Missing token or baseUrl");
    }

    const url = `https://${baseUrl}/todos.json`;
    const response = await axios.post(url, todoData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

/**
 * Update a todo
 */
export const updateTodo = async (id: number | string, todoData: any) => {
    const token = getToken();
    const baseUrl = getBaseUrl();

    if (!token || !baseUrl) {
        throw new Error("Missing token or baseUrl");
    }

    const url = `https://${baseUrl}/todos/${id}.json`;
    const response = await axios.put(url, todoData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

/**
 * Delete a todo
 */
export const deleteTodo = async (id: number | string) => {
    const token = getToken();
    const baseUrl = getBaseUrl();

    if (!token || !baseUrl) {
        throw new Error("Missing token or baseUrl");
    }

    const url = `https://${baseUrl}/todos/${id}.json`;
    const response = await axios.delete(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

/**
 * Toggle todo completion status
 */
export const toggleTodo = async (id: number | string, completed: boolean) => {
    return updateTodo(id, {
        todo: {
            status: completed ? "completed" : "open",
        },
    });
};
