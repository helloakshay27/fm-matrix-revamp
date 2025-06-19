import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Settings Pages
import { ApprovalMatrixDashboard } from './pages/settings/ApprovalMatrixDashboard';
import { AddApprovalMatrixDashboard } from './pages/settings/AddApprovalMatrixDashboard';

// Setup Pages
import { DepartmentDashboard } from './pages/setup/DepartmentDashboard';

// Other Pages
import { GRNSRNDashboard } from './pages/GRNSRNDashboard';
import { InvoicesDashboard } from './pages/InvoicesDashboard';
import { InvoicesSESDashboard } from './pages/InvoicesSESDashboard';
import { PendingApprovalsDashboard } from './pages/PendingApprovalsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Settings Routes */}
        <Route path="/settings/approval-matrix" element={<ApprovalMatrixDashboard />} />
        <Route path="/settings/approval-matrix/add" element={<AddApprovalMatrixDashboard />} />
        
        {/* Setup Routes */}
        <Route path="/setup/department" element={<DepartmentDashboard />} />
        
        {/* Other Routes */}
        <Route path="/grn-srn" element={<GRNSRNDashboard />} />
        <Route path="/invoices" element={<InvoicesDashboard />} />
        <Route path="/invoices-ses" element={<InvoicesSESDashboard />} />
        <Route path="/pending-approvals" element={<PendingApprovalsDashboard />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
