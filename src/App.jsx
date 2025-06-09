import { Navigate, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./pages/Login/ProtectedRoute.jsx";
import { useState } from "react"
import Layout from "./Layout"
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
import IssuesTable from "./components/Home/Issues/Table.jsx";
// import TypesTable from "./components/Setup/ProjectTypes/Table";
// import StatusTable from "./components/Setup/Status/Table";
// import Modal from "./components/Setup/Status/Modal";
import InternalUsers from "./pages/Setup/InternalUsers";
import Details from "./components/Setup/Internal_Users/Details";
import ExternalUsers from "./pages/Setup/ExternalUsers";
import TeamDetails from "./components/Setup/ProjectTeams/Details.jsx";
import ProjectTypes from "./pages/Setup/ProjectTypes.jsx";
import ProjectTags from "./pages/Setup/ProjectTags.jsx";
import Status from "./pages/Setup/Status.jsx";
// import {Details as ExternalDetails} from "./components/Setup/ProjectTeams/Details";
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

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (

    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="*"
        element={
          <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
            <Routes>
              <Route path="/" element={<Navigate to="/projects" />} />
              <Route path="projects/:id/milestones/:mid/tasks" element={<Tasks setIsSidebarOpen={setIsSidebarOpen} />} />
              <Route path="/projects" element={<Projects setIsSidebarOpen={setIsSidebarOpen} />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/sprint-list" element={<SprintTable />} />
              <Route path="/sprint/:id" element={<Sprints />} />
              <Route path="/projects/:id/milestones" element={<MileStoneMain />} />
              {/* <Route path="/task-list/:id" element={<Tasks setIsSidebarOpen={setIsSidebarOpen} />} /> */}
              <Route path="/tasks-detail/:id" element={<TaskDetails />} />
              <Route path="/issues" element={<IssuesTable />} />
              <Route path="/mom" element={<MinutesOfMeeting />} />
              <Route path="/new-mom" element={<MoMAdd />} />
              <Route path="/channels" element={<Channel />} />

              {/* Setup Routes */}
              <Route path="/setup" element={<Navigate to="/setup/roles" />} />
              <Route path="/setup/roles" element={<Role />} />
              <Route path="/setup/internal-users" element={<InternalUser />} />
              <Route path="/setup/internal-users/details" element={<Details />} />
              <Route path="/setup/external-users" element={<ExternalTable />} />
              <Route path="/setup/project-teams" element={<ProjectTeams />} />
              <Route path="/setup/project-teams/project-details" element={<ProjectDetail />} />
              <Route path="/setup/project-teams/details" element={<TeamDetails />} />
              <Route path="/setup/matrix" element={<EscalationMatrix />} />
              <Route path="/setup/types" element={<ProjectTypes />} />
              <Route path="/setup/tags" element={<ProjectTags />} />
              <Route path="/setup/status" element={<Status />} />
              <Route path="/setup/project-group" element={<ProjectGroup />} />
              <Route path="/setup/project-template" element={<ProjectTemplates />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  )
}

export default App