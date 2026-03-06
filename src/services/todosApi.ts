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
 * @param selectedAssignedTo - Array of user IDs to filter by (assigned to filter)
 * @param selectedCreators - Array of user IDs to filter by (created by filter)
 */
export const fetchTodos = async (
    page = 1,
    taskType: "my" | "all" = "my",
    userIds: string[] = [],
    search?: string,
    fromDate?: string,
    toDate?: string,
    selectedAssignedTo: string[] = [],
    selectedCreators: string[] = []
): Promise<TodosResponse> => {
    const token = getToken();
    const baseUrl = getBaseUrl();

    if (!token || !baseUrl) {
        throw new Error("Missing token or baseUrl");
    }

    let url = `https://${baseUrl}/todos.json`;

    // Build query parameters conditionally
    const queryParts: string[] = [];

    // Add page parameter
    queryParts.push(`page=${page}`);

    // Add user filter
    if (taskType === "my") {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;
        if (userId) {
            queryParts.push(`q[user_id_eq]=${userId}`);
        }
    } else if (taskType === "all" && userIds.length > 0) {
        userIds.forEach((id) => {
            queryParts.push(`q[user_id_in][]=${id}`);
        });
    }

    // Add "assigned to" filter if provided
    if (selectedAssignedTo.length > 0) {
        selectedAssignedTo.forEach((id) => {
            queryParts.push(`q[user_id_in][]=${id}`);
        });
    }

    // Add "created by" filter if provided
    if (selectedCreators.length > 0) {
        selectedCreators.forEach((id) => {
            queryParts.push(`q[created_by_id_in][]=${id}`);
        });
    }

    // Add search if provided
    if (search && search.trim()) {
        queryParts.push(`q[title_cont]=${encodeURIComponent(search.trim())}`);
    }

    // Add date range filters if provided
    if (fromDate) {
        queryParts.push(`q[target_date_or_updated_at_gteq]=${fromDate}`);
    }
    if (toDate) {
        queryParts.push(`q[target_date_or_updated_at_lteq]=${toDate}`);
    }

    // Append query parameters to URL
    if (queryParts.length > 0) {
        url += `?${queryParts.join("&")}`;
    }

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

/**
 * Fetch todos by priority with pagination and filters
 * @param page - Page number (1-indexed)
 * @param priority - Priority level (P1, P2, P3, P4)
 * @param taskType - "my" for current user or "all" for all tasks
 * @param excludeCompleted - Whether to exclude completed todos (default: true)
 * @param fromDate - Start date for filtering (YYYY-MM-DD format)
 * @param toDate - End date for filtering (YYYY-MM-DD format)
 * @param selectedAssignedTo - Array of user IDs to filter by (assigned to filter)
 * @param selectedCreators - Array of user IDs to filter by (created by filter)
 */
export const fetchPriorityTodos = async (
    page = 1,
    priority: string,
    taskType: "my" | "all" = "my",
    excludeCompleted = true,
    fromDate?: string,
    toDate?: string,
    selectedAssignedTo: string[] = [],
    selectedCreators: string[] = []
): Promise<TodosResponse> => {
    const token = getToken();
    const baseUrl = getBaseUrl();

    if (!token || !baseUrl) {
        throw new Error("Missing token or baseUrl");
    }

    let url = `https://${baseUrl}/todos.json`;

    // Build query parameters
    const queryParts: string[] = [];

    // Add page parameter
    queryParts.push(`page=${page}`);

    // Add priority filter
    queryParts.push(`q[priority_eq]=${priority}`);

    // Add completed status filter
    if (excludeCompleted) {
        queryParts.push(`q[status_not_eq]=completed`);
    }

    // Add user filter
    if (taskType === "my") {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;
        if (userId) {
            queryParts.push(`q[user_id_eq]=${userId}`);
        }
    }

    // Add "assigned to" filter if provided
    if (selectedAssignedTo.length > 0) {
        selectedAssignedTo.forEach((id) => {
            queryParts.push(`q[user_id_in][]=${id}`);
        });
    }

    // Add "created by" filter if provided
    if (selectedCreators.length > 0) {
        selectedCreators.forEach((id) => {
            queryParts.push(`q[created_by_id_in][]=${id}`);
        });
    }

    // Add date range filters if provided
    if (fromDate) {
        queryParts.push(`q[target_date_or_updated_at_gteq]=${fromDate}`);
    }
    if (toDate) {
        queryParts.push(`q[target_date_or_updated_at_lteq]=${toDate}`);
    }

    // Append query parameters to URL
    if (queryParts.length > 0) {
        url += `?${queryParts.join("&")}`;
    }

    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
