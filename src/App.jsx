import { Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import Home from "./pages/Home"
import TaskDetails from "./pages/TaskDetails"

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task-details" element={<TaskDetails />} />
      </Routes>
    </Layout>
  )
}

export default App