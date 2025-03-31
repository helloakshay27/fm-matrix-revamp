import { Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import Home from "./pages/Home"
import TaskDetails from "./pages/TaskDetails"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"
import Sprints from "./pages/Sprints"

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/task" element={<Home />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/sprint" element={<Sprints />} />
      </Routes>
    </Layout>
  )
}

export default App