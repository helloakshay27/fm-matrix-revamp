
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { WaterAssetDetailsPage } from '@/pages/WaterAssetDetailsPage';
import { EditWaterAssetPage } from '@/pages/EditWaterAssetPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/utility/water/details/:id" element={<WaterAssetDetailsPage />} />
        <Route path="/utility/water/edit/:id" element={<EditWaterAssetPage />} />
        <Route path="*" element={<Navigate to="/utility/water/details/1" />} />
      </Routes>
    </Router>
  );
}

export default App;
