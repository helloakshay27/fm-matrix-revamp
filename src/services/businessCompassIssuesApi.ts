import axios from "axios";

const getToken = () => {
  const mobileToken = sessionStorage.getItem("mobile_token");
  const webToken = localStorage.getItem("token");
  return mobileToken || webToken || "";
};

const getBaseUrl = () => {
  return localStorage.getItem("baseUrl") ?? "";
};

export const fetchBusinessCompassIssues = async (
  page = 1,
  filters = "",
  my = false,
) => {
  const token = getToken();
  const baseUrl = getBaseUrl();

  let queryString = `page=${page}`;
  if (filters) queryString += `&${filters}`;

  const { data } = await axios.get(
    `https://${baseUrl}/business_compass/issues${my ? "/my_issues" : ""}.json?${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};
