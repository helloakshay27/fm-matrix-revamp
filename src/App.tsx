
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SurveyResponsePage } from './pages/SurveyResponsePage';
import { SurveyResponseDetailPage } from './pages/SurveyResponseDetailPage';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/maintenance/survey/response" element={<SurveyResponsePage />} />
          <Route path="/maintenance/survey/response/:id" element={<SurveyResponseDetailPage />} />
          <Route path="/" element={<SurveyResponsePage />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
