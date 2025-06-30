const getToken = () => localStorage.getItem("token") || "";
const apiDomain = "https://api-tasks.lockated.com/";

let baseURL = "";
const hostname = window.location.hostname;

if (hostname === "task-management.lockated.com") {
  baseURL = "https://api-tasks.lockated.com";
} else if (hostname === "projects.lockated.com") {
  baseURL = "https://live-tasks.lockated.com";
} else if (hostname.includes("uat-projects")) {
  baseURL = "https://uat-tasks.lockated.com";
} else if (hostname === "localhost") {
  baseURL = "https://api-tasks.lockated.com";
} else {
  baseURL = "https://api-tasks.lockated.com";
}

console.log("Base URL:", baseURL, " | Hostname:", hostname);

export { baseURL, apiDomain, getToken };
