
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScheduleListDashboard } from './pages/ScheduleListDashboard';
import { AddSchedulePage } from './pages/AddSchedulePage';
import { ExportSchedulePage } from './pages/ExportSchedulePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ScheduleListDashboard />} />
          <Route path="/maintenance/schedule" element={<ScheduleListDashboard />} />
          <Route path="/maintenance/schedule/add" element={<AddSchedulePage />} />
          <Route path="/maintenance/schedule/export" element={<ExportSchedulePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
