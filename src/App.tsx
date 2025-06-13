
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"
import { Layout } from './components/Layout'
import { LayoutProvider } from './contexts/LayoutContext'
import Index from './pages/Index'
import AssetDashboard from './pages/AssetDashboard'
import InActiveAssetsDashboard from './pages/InActiveAssetsDashboard'
import AMCDashboard from './pages/AMCDashboard'
import ServiceDashboard from './pages/ServiceDashboard'
import AttendanceDashboard from './pages/AttendanceDashboard'
import SupplierDashboard from './pages/SupplierDashboard'
import ScheduleDashboard from './pages/ScheduleDashboard'
import TaskDashboard from './pages/TaskDashboard'
import SurveyListDashboard from './pages/SurveyListDashboard'
import SurveyMappingDashboard from './pages/SurveyMappingDashboard'
import SurveyResponseDashboard from './pages/SurveyResponseDashboard'
import { SetupDashboard } from './pages/SetupDashboard'
import NotFound from './pages/NotFound'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/setup" element={<SetupDashboard />} />
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/assets" element={<AssetDashboard />} />
                    <Route path="/assets/inactive" element={<InActiveAssetsDashboard />} />
                    <Route path="/amc" element={<AMCDashboard />} />
                    <Route path="/services" element={<ServiceDashboard />} />
                    <Route path="/attendance" element={<AttendanceDashboard />} />
                    <Route path="/suppliers" element={<SupplierDashboard />} />
                    <Route path="/schedule" element={<ScheduleDashboard />} />
                    <Route path="/tasks" element={<TaskDashboard />} />
                    <Route path="/surveys/list" element={<SurveyListDashboard />} />
                    <Route path="/surveys/mapping" element={<SurveyMappingDashboard />} />
                    <Route path="/surveys/response" element={<SurveyResponseDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </div>
        </Router>
      </LayoutProvider>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
