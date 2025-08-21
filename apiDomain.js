const getToken = () => localStorage.getItem("token") || "";
const apiDomain = "https://api-tasks.lockated.com/";

let baseURL = "";

const hostname = window.location.hostname;

switch (hostname) {
  case "task-management.lockated.com":
    baseURL = "https://api-tasks.lockated.com";
    break;
  case "projects.lockated.com":
    baseURL = "https://live-tasks.lockated.com";
    break;
  case "uat-projects.lockated.com":
    baseURL = "https://uat-tasks.lockated.com";
    break;
  case "projects.gophygital.work":
    baseURL = "https://live-tasks.gophygital.work";
    break;
  case "localhost":
    baseURL = "https://uat-tasks.lockated.com";
    break;
  default:
    baseURL = "https://api-tasks.lockated.com";
    break;
}

console.log("Base URL:", baseURL, " | Hostname:", hostname);

export { baseURL, apiDomain, getToken };
