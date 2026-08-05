import axios from "axios";

const getToken = () => {
  const mobileToken = sessionStorage.getItem("mobile_token");
  const webToken = localStorage.getItem("token");
  return mobileToken || webToken || "";
};

const getBaseUrl = () => {
  return localStorage.getItem("baseUrl") ?? "";
};

export const fetchBusinessCompassTodos = async (
  page = 1,
  filters: Record<string, string> = {},
) => {
  const token = getToken();
  const baseUrl = getBaseUrl();

  const params = new URLSearchParams({ page: String(page) });
  for (const [key, value] of Object.entries(filters)) {
    params.append(key, value);
  }

  const response = await axios.get(
    `https://${baseUrl}/business_compass/todos?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
