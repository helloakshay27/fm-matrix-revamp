const getToken = () => localStorage.getItem("token") || "";
const apiDomain = "https://api-tasks.lockated.com/";

export { apiDomain, getToken };
