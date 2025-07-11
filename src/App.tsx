
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SurveyListDashboard } from './pages/SurveyListDashboard';
import { AddSurveyPage } from './pages/AddSurveyPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SurveyListDashboard />} />
        <Route path="/surveys" element={<SurveyListDashboard />} />
        <Route path="/add-survey" element={<AddSurveyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
