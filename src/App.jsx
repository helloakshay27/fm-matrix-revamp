import { Navigate, Route, Routes } from "react-router-dom"
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
import TypesTable from "./components/Setup/ProjectTypes/Table";
import StatusTable from "./components/Setup/Status/Table";
import Modal from "./components/Setup/Status/Modal";
import InternalUsers from "./pages/Setup/InternalUsers";
import Details from "./components/Setup/Internal_Users/Details";
import ExternalUsers from "./pages/Setup/ExternalUsers";
import TeamDetails from "./components/Setup/ProjectTeams/Details.jsx";
import ProjectTypes from "./pages/Setup/ProjectTypes.jsx";
import ProjectTags from "./pages/Setup/ProjectTags.jsx";
import Status from "./pages/Setup/Status.jsx";
// import {Details as ExternalDetails} from "./components/Setup/ProjectTeams/Details";
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" />} />
        <Route path="/task" element={<Tasks setIsSidebarOpen={setIsSidebarOpen} />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/projects" element={<Projects setIsSidebarOpen={setIsSidebarOpen} />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/sprint" element={<Sprints />} />
        <Route path="/milestones" element={<MileStoneMain />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/mom" element={<MinutesOfMeeting />} />
        <Route path="/new-mom" element={<MoMAdd />} />
        <Route path="/channels" element={<Channel />} />



        <Route path="/setup" element={<Navigate to="/setup/roles" />} />
        <Route path="/setup/roles" element={<Role />} />
        <Route path="/setup/matrix" element={<EscalationMatrix />} />
        <Route path="/setup/project-teams" element={<ProjectTeams />} />
        <Route path="/setup/project-teams/details" element={<TeamDetails />} />
        <Route path="/setup/internal-users" element={<InternalUsers />} />
        <Route path="/setup/internal-users/details" element={<Details/>} />
        <Route path="/setup/external-users" element={<ExternalUsers />} />
        <Route path="/setup/types" element={<ProjectTypes />} />
        <Route path="/setup/tags" element={<ProjectTags />} />
         
        <Route path="/setup/status" element={<Status />} />
        
      </Routes>
    </Layout>
  )
}

export default App