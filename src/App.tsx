
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SurveyListDashboard } from './pages/SurveyListDashboard';
import { SurveyResponsePage } from './pages/SurveyResponsePage';
import { SurveyResponseDetailPage } from './pages/SurveyResponseDetailPage';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<SurveyListDashboard />} />
          <Route path="/maintenance/survey" element={<SurveyListDashboard />} />
          <Route path="/maintenance/survey/response" element={<SurveyResponsePage />} />
          <Route path="/maintenance/survey/response/detail" element={<SurveyResponseDetailPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
