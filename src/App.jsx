import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/Login/ProtectedRoute.jsx";
import { useState } from "react";
import Layout from "./Layout";
import Tasks from "./pages/Home/Tasks";
import TaskDetails from "./pages/Home/TaskDetails";
import Projects from "./pages/Home/Projects";
import ProjectDetails from "./pages/Home/ProjectDetails";
import Sprints from "./pages/Home/Sprints";
import MileStoneMain from "./Milestone/MileStoneMain";
import MinutesOfMeeting from "./pages/Home/MinutesOfMeeting";
import MoMAdd from "./pages/Home/MoMAdd";
import Channel from "./components/Home/Channel/Channel";
import Role from "./pages/Setup/Role";
import EscalationMatrix from "./pages/Setup/EscalationMatrix";
import ProjectTeams from "./pages/Setup/ProjectTeams";
import Details from "./components/Setup/Internal_Users/Details";
import ExternalUsers from "./pages/Setup/ExternalUsers";
import TeamDetails from "./components/Setup/ProjectTeams/Details.jsx";
import ProjectTypes from "./pages/Setup/ProjectTypes.jsx";
import ProjectTags from "./pages/Setup/ProjectTags.jsx";
import Status from "./pages/Setup/Status.jsx";
import InternalUser from "./pages/Setup/InternalUser";
import InternalDetails from "./components/Setup/Internal_Users/InternalDetails";
import ExternalTable from "./components/Setup/External_Users/ExternalTable";
import ProjectTable from "./components/Setup/Project/ProjectTable";
import ProjectDetail from "./components/Setup/Project/ProjectDetail";
import SprintTable from "./pages/Home/SprintTable.jsx";

import Login from "./pages/Login/Login";
import GroupTable from "./components/Setup/ProjectGroup/Table.jsx";
import ProjectGroup from "./pages/Setup/ProjectGroup.jsx";
import ProjectTemplates from "./pages/Setup/ProjectTemplates.jsx";
import { Toaster } from "react-hot-toast";
import Table from "./components/Setup/Issues_Type/Table.jsx";
import IssuesType from "./pages/Setup/IssueType.jsx";
import SprintDetails from "./components/Home/Sprints/SprintDetails.jsx";
import ChatLayout from "./components/Home/Channel/ChatLayout.jsx";
import Issues from "./pages/Home/Issues.jsx";
import Documents from "./pages/Home/Documents.jsx";
import IssueDetails from "./pages/Home/IssueDetails.jsx";
import MomDetails from "./pages/Home/MomDetails.jsx";
import Zone from "./pages/Setup/Zone.jsx";
import Region from "./pages/Setup/Region.jsx";
import Country from "./pages/Setup/Country.jsx";
import Company from "./pages/Setup/Company.jsx";
import Organizations from "./pages/Setup/Organizations.jsx";
import { WebSocketProvider } from "./contexts/WebSocketContext.jsx";

const App = () => {
  const token = localStorage.getItem('token');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      {/* <WebSocketProvider accessToken={token} wsUrl={'wss://uat-tasks.lockated.com/cable'}> */}
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* All Routes - Layout will conditionally show/hide sidebar and header */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              >
                <Routes>
                  {/* External Portal Routes */}
                  <Route path="/cloud-projects" element={<Projects />} />
                  <Route path="/cloud-projects/:id" element={<ProjectDetails />} />
                  <Route path="/cloud-projects/:id/milestones" element={<MileStoneMain />} />
                  <Route path="/cloud-projects/:id/milestones/:mid/tasks" element={<Tasks />} />
                  <Route path="/cloud-projects/:id/milestones/:mid/tasks/:tid" element={<TaskDetails />} />
                  <Route path="/cloud-mom" element={<MinutesOfMeeting />} />
                  <Route path="/cloud-mom/:id" element={<MomDetails />} />
                  <Route path="/cloud-mom/new-mom" element={<MoMAdd />} />
                  <Route path="/cloud-tasks" element={<Tasks />} />
                  <Route path="/cloud-tasks/:tid" element={<TaskDetails />} />
                  <Route path="/cloud-issues" element={<Issues />} />
                  <Route path="/cloud-issues/:id" element={<IssueDetails />} />

                  {/* Internal Routes */}
                  <Route path="/" element={<Navigate to="/projects" />} />
                  <Route
                    path="projects/:id/milestones/:mid/tasks"
                    element={<Tasks setIsSidebarOpen={setIsSidebarOpen} />}
                  />
                  <Route
                    path="/projects"
                    element={<Projects setIsSidebarOpen={setIsSidebarOpen} />}
                  />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/sprint" element={<SprintTable />} />
                  <Route path="/sprint/sprintdetails/:sid" element={<SprintDetails />} />
                  <Route path="/sprint/:id" element={<Sprints />} />
                  <Route
                    path="/projects/:id/milestones"
                    element={<MileStoneMain />}
                  />
                  <Route
                    path="/projects/:id/milestones/:mid/tasks/:tid"
                    element={<TaskDetails />}
                  />
                  <Route
                    path="/tasks/:tid"
                    element={<TaskDetails />}
                  />
                  <Route path="/tasks" element={<Tasks setIsSidebarOpen={setIsSidebarOpen} />} />
                  <Route path="/issues" element={<Issues setIsSidebarOpen={setIsSidebarOpen} />} />
                  <Route path="/issues/:id" element={<IssueDetails />} />
                  <Route path="/mom" element={<MinutesOfMeeting />} />
                  <Route path="/mom/:id" element={<MomDetails />} />
                  <Route path="/new-mom" element={<MoMAdd />} />

                  <Route path="/channels/*" element={<Channel />} />
                  <Route path="/documents" element={<Documents />} />

                  {/* Setup Routes */}
                  <Route
                    path="/setup"
                    element={<Navigate to="/setup/roles" />}
                  />
                  <Route path="/setup/roles" element={<Role />} />
                  <Route
                    path="/setup/internal-users"
                    element={<InternalUser />}
                  />
                  <Route
                    path="/setup/internal-users/details/:id"
                    element={<Details />}
                  />
                  <Route
                    path="/setup/external-users"
                    element={<ExternalTable />}
                  />
                  <Route
                    path="/setup/project-teams"
                    element={<ProjectTeams />}
                  />
                  <Route
                    path="/setup/project-teams/project-details"
                    element={<ProjectDetail />}
                  />
                  <Route
                    path="/setup/project-teams/details/:id"
                    element={<TeamDetails />}
                  />
                  <Route path="/setup/matrix" element={<EscalationMatrix />} />
                  <Route path="/setup/types" element={<ProjectTypes />} />
                  <Route path="/setup/tags" element={<ProjectTags />} />
                  <Route path="/setup/status" element={<Status />} />
                  <Route path="/setup/zone" element={<Zone />} />
                  <Route path="/setup/region" element={<Region />} />
                  <Route path="/setup/country" element={<Country />} />
                  <Route path="/setup/company" element={<Company />} />
                  <Route path="/setup/organizations" element={<Organizations />} />
                  <Route
                    path="/setup/project-group"
                    element={<ProjectGroup />}
                  />
                  <Route
                    path="/setup/project-template"
                    element={<ProjectTemplates />}
                  />
                  <Route
                    path="/setup/issues/types"
                    element={<IssuesType />}
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* </WebSocketProvider> */}
    </>
  );
};

export default App;
