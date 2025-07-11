
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SurveyListDashboard } from './pages/SurveyListDashboard';
import { AddSurveyForm } from './pages/AddSurveyForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="surveys" element={<SurveyListDashboard />} />
          <Route path="maintenance/survey/list" element={<SurveyListDashboard />} />
          <Route path="add-survey" element={<AddSurveyForm />} />
          <Route index element={<SurveyListDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
