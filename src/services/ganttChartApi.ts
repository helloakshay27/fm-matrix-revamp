import axios from "axios";

export const fetchGanttTasks = async (
  params: Record<string, any>,
  taskType: "all" | "my"
): Promise<any[]> => {
  const baseURL = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const endpoint =
    taskType === "my"
      ? `${baseURL}/task_managements/kanban.json?q[responsible_person_id_eq]=${localStorage.getItem("userId")}&order_direction=asc&order_by=created_at`
      : `${baseURL}/task_managements/kanban.json?order_direction=asc&order_by=created_at`;

  const response = await axios.get(endpoint, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data;
  return (
    data?.task_managements ||
    data?.data?.task_managements ||
    (Array.isArray(data) ? data : [])
  );
};

export const updateGanttTask = async (
  id: string,
  payload: Record<string, any>
): Promise<any> => {
  const baseURL = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${baseURL}/task_managements/${id}.json`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
