import axios from "axios";

const getToken = () => {
  const mobileToken = sessionStorage.getItem("mobile_token");
  const webToken = localStorage.getItem("token");
  return mobileToken || webToken || "";
};

const getBaseUrl = () => {
  return localStorage.getItem("baseUrl") ?? "";
};

export const fetchBusinessCompassTasks = async (
  page = 1,
  filters: Record<string, any> = {},
  my = false,
): Promise<any> => {
  const token = getToken();
  const baseUrl = getBaseUrl();

  const params: Record<string, any> = {
    page,
    ...filters,
  };

  const { data } = await axios.get(
    `https://${baseUrl}/business_compass/tasks${my ? "/my_tasks" : ""}.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params,
    }
  );
  return data;
};
