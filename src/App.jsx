import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import Tasks from "./pages/Tasks"
import TaskDetails from "./pages/TaskDetails"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"
import Sprints from "./pages/Sprints"
import MileStoneMain from "./Milestone/MileStoneMain"
import { useState } from "react"

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
        <Route path="tasks/:id" element={<TaskDetails />} />
        <Route path="channels" element={<></>} />
        <Route path="mom" element={<></>} />
      </Routes>
    </Layout>
  )
}

export default App