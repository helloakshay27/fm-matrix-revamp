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
import Channel from "./components/Channel/Channel";

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
      </Routes>
    </Layout>
  )
}

export default App