
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import { TrainingListPage } from './pages/TrainingListPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/training-list" element={<TrainingListPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
