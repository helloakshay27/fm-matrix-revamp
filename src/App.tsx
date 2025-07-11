import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { LayoutProvider } from './contexts/LayoutContext';
import { AssetGroupsDashboard } from './pages/setup/AssetGroupsDashboard';
import { AddAssetGroupDashboard } from './pages/setup/AddAssetGroupDashboard';
import { EditAssetGroupDashboard } from './pages/setup/EditAssetGroupDashboard';
import { ChecklistGroupDashboard } from './pages/setup/ChecklistGroupDashboard';
import { EmailRuleDashboard } from './pages/setup/EmailRuleDashboard';
import { AddApprovalMatrixDashboard } from './pages/setup/AddApprovalMatrixDashboard';
import { EditApprovalMatrixDashboard } from './pages/setup/EditApprovalMatrixDashboard';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="min-h-screen bg-[#f6f4ee]">
          <Header />
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/maintenance/asset" replace />} />
            
            {/* Main application routes */}
            <Route path="/*" element={<Layout><div /></Layout>}>
              {/* Transitioning Routes */}
              <Route path="/transitioning/hoto" element={<div>HOTO</div>} />
              <Route path="/transitioning/snagging" element={<div>Snagging</div>} />
              <Route path="/transitioning/design-insight" element={<div>Design Insight</div>} />
              <Route path="/transitioning/fitout/setup" element={<div>Fitout Setup</div>} />
              <Route path="/transitioning/fitout/request" element={<div>Fitout Request</div>} />
              <Route path="/transitioning/fitout/checklist" element={<div>Fitout Checklist</div>} />
              <Route path="/transitioning/fitout/violation" element={<div>Fitout Violation</div>} />

              {/* Maintenance Routes */}
              <Route path="/maintenance/asset" element={<div>Assets</div>} />
              <Route path="/maintenance/amc" element={<div>AMC</div>} />
              <Route path="/maintenance/services" element={<div>Services</div>} />
              <Route path="/maintenance/attendance" element={<div>Attendance</div>} />
              <Route path="/maintenance/inventory" element={<div>Inventory</div>} />
              <Route path="/maintenance/ticket" element={<div>Ticket</div>} />
              <Route path="/maintenance/task" element={<div>Task</div>} />
              <Route path="/maintenance/schedule" element={<div>Schedule</div>} />
              <Route path="/maintenance/audit/operational/scheduled" element={<div>Operational Scheduled Audit</div>} />
              <Route path="/maintenance/audit/operational/conducted" element={<div>Operational Conducted Audit</div>} />
              <Route path="/maintenance/audit/operational/master-checklists" element={<div>Master Checklists</div>} />
              <Route path="/maintenance/audit/vendor/scheduled" element={<div>Vendor Scheduled Audit</div>} />
              <Route path="/maintenance/audit/vendor/conducted" element={<div>Vendor Conducted Audit</div>} />
              <Route path="/maintenance/audit/assets" element={<div>Assets Audit</div>} />
              <Route path="/maintenance/waste/generation" element={<div>Waste Generation</div>} />
              <Route path="/maintenance/waste/setup" element={<div>Waste Setup</div>} />
              <Route path="/maintenance/survey/list" element={<div>Survey List</div>} />
              <Route path="/maintenance/survey/mapping" element={<div>Survey Mapping</div>} />
              <Route path="/maintenance/survey/response" element={<div>Survey Response</div>} />

              {/* Safety Routes */}
              <Route path="/safety/incident" element={<div>Incident</div>} />
              <Route path="/safety/permit" element={<div>Permit to Work</div>} />
              <Route path="/safety/m-safe" element={<div>M Safe</div>} />
              <Route path="/safety/training-list" element={<div>Training List</div>} />

              {/* Finance Routes */}
              <Route path="/finance/material-pr" element={<div>Material PR</div>} />
              <Route path="/finance/service-pr" element={<div>Service PR</div>} />
              <Route path="/finance/po" element={<div>PO</div>} />
              <Route path="/finance/wo" element={<div>WO</div>} />
              <Route path="/finance/grn-srn" element={<div>GRN/SRN</div>} />
              <Route path="/finance/auto-saved-pr" element={<div>Auto Saved PR</div>} />
              <Route path="/finance/invoices" element={<div>Invoices</div>} />
              <Route path="/finance/bill-booking" element={<div>Bill Booking</div>} />
              <Route path="/finance/cost-center" element={<div>Cost Center</div>} />
              <Route path="/finance/budgeting" element={<div>Budgeting</div>} />
              <Route path="/finance/pending-approvals" element={<div>Pending Approvals</div>} />
              <Route path="/finance/wbs" element={<div>WBS</div>} />

              {/* CRM Routes */}
              <Route path="/crm/lead" element={<div>Lead</div>} />
              <Route path="/crm/opportunity" element={<div>Opportunity</div>} />
              <Route path="/crm/crm" element={<div>CRM</div>} />
              <Route path="/crm/events" element={<div>Events</div>} />
              <Route path="/crm/broadcast" element={<div>Broadcast</div>} />
              <Route path="/crm/groups" element={<div>Groups</div>} />
              <Route path="/crm/polls" element={<div>Polls</div>} />
              <Route path="/crm/campaign" element={<div>Campaign</div>} />

              {/* Utility Routes */}
              <Route path="/utility/energy" element={<div>Energy</div>} />
              <Route path="/utility/water" element={<div>Water</div>} />
              <Route path="/utility/stp" element={<div>STP</div>} />
              <Route path="/utility/ev-consumption" element={<div>EV Consumption</div>} />
              <Route path="/utility/solar-generator" element={<div>Solar Generator</div>} />

              {/* Security Routes */}
              <Route path="/security/gate-pass/inwards" element={<div>Inwards Gate Pass</div>} />
              <Route path="/security/gate-pass/outwards" element={<div>Outwards Gate Pass</div>} />
              <Route path="/security/visitor" element={<div>Visitor</div>} />
              <Route path="/security/staff" element={<div>Staff</div>} />
              <Route path="/security/vehicle/r-vehicles" element={<div>R Vehicles</div>} />
              <Route path="/security/vehicle/r-vehicles/history" element={<div>R Vehicles History</div>} />
              <Route path="/security/vehicle/g-vehicles" element={<div>G Vehicles</div>} />
              <Route path="/security/patrolling" element={<div>Patrolling</div>} />

              {/* Value Added Services Routes */}
              <Route path="/vas/fnb" element={<div>F&B</div>} />
              <Route path="/vas/parking" element={<div>Parking</div>} />
              <Route path="/vas/osr" element={<div>OSR</div>} />
              <Route path="/vas/space-management/bookings" element={<div>Space Management Bookings</div>} />
              <Route path="/vas/space-management/seat-requests" element={<div>Seat Requests</div>} />
              <Route path="/vas/space-management/setup/seat-type" element={<div>Seat Type</div>} />
              <Route path="/vas/space-management/setup/seat-setup" element={<div>Seat Setup</div>} />
              <Route path="/vas/space-management/setup/shift" element={<div>Shift</div>} />
              <Route path="/vas/space-management/setup/roster" element={<div>Roster</div>} />
              <Route path="/vas/space-management/setup/employees" element={<div>Employees</div>} />
              <Route path="/vas/space-management/setup/check-in-margin" element={<div>Check in Margin</div>} />
              <Route path="/vas/space-management/setup/roster-calendar" element={<div>Roster Calendar</div>} />
              <Route path="/vas/space-management/setup/export" element={<div>Export</div>} />
              <Route path="/vas/redemonection-marketplace" element={<div>Redemption Marketplace</div>} />

              {/* Market Place Routes */}
              <Route path="/market-place/all" element={<div>All Market Place</div>} />
              <Route path="/market-place/installed" element={<div>Installed</div>} />
              <Route path="/market-place/updates" element={<div>Updates</div>} />

              {/* Setup Routes */}
              <Route path="/setup/location/account" element={<div>Account</div>} />
              <Route path="/setup/location/building" element={<div>Building</div>} />
              <Route path="/setup/location/wing" element={<div>Wing</div>} />
              <Route path="/setup/location/area" element={<div>Area</div>} />
              <Route path="/setup/location/floor" element={<div>Floor</div>} />
              <Route path="/setup/location/unit" element={<div>Unit</div>} />
              <Route path="/setup/location/room" element={<div>Room</div>} />
              <Route path="/setup/user-role/department" element={<div>Department</div>} />
              <Route path="/setup/user-role/role" element={<div>Role</div>} />
              <Route path="/setup/fm-user" element={<div>FM User</div>} />
              <Route path="/setup/occupant-users" element={<div>Occupant Users</div>} />
              <Route path="/setup/meter-type" element={<div>Meter Type</div>} />
              <Route path="/setup/asset-groups" element={<AssetGroupsDashboard />} />
              <Route path="/setup/asset-groups/add" element={<AddAssetGroupDashboard />} />
              <Route path="/setup/asset-groups/edit/:id" element={<EditAssetGroupDashboard />} />
              <Route path="/setup/checklist-group" element={<div>Checklist Group</div>} />
              <Route path="/setup/ticket/setup" element={<div>Ticket Setup</div>} />
              <Route path="/setup/ticket/escalation" element={<div>Ticket Escalation</div>} />
              <Route path="/setup/ticket/cost-approval" element={<div>Ticket Cost Approval</div>} />
              <Route path="/setup/task-escalation" element={<div>Task Escalation</div>} />
              <Route path="/setup/approval-matrix" element={<div>Approval Matrix</div>} />
              <Route path="/setup/approval-matrix/add" element={<AddApprovalMatrixDashboard />} />
              <Route path="/setup/approval-matrix/edit/:id" element={<EditApprovalMatrixDashboard />} />
              <Route path="/setup/patrolling-approval" element={<div>Patrolling Approval</div>} />
              <Route path="/setup/fm-group" element={<div>FM Group</div>} />
              <Route path="/setup/master-checklist" element={<div>Master Checklist</div>} />
              <Route path="/setup/sac-hsn-setup" element={<div>SAC/HSN Setup</div>} />
              <Route path="/setup/address" element={<div>Address</div>} />
              <Route path="/setup/tag" element={<div>Tag</div>} />
              <Route path="/setup/export" element={<div>Export</div>} />
            </Route>

            {/* Settings Routes */}
            <Route path="/settings" element={<Layout><div /></Layout>}>
              <Route path="/settings/checklist-setup/group" element={<ChecklistGroupDashboard />} />
              <Route path="/settings/checklist-setup/email-rule" element={<EmailRuleDashboard />} />
              <Route path="/settings/checklist-setup/task-escalation" element={<div>Task Escalation</div>} />
              <Route path="/settings/ticket-management/setup" element={<div>Ticket Management Setup</div>} />
              <Route path="/settings/ticket-management/escalation-matrix" element={<div>Escalation Matrix</div>} />
              <Route path="/settings/ticket-management/cost-approval" element={<div>Cost Approval</div>} />
              <Route path="/settings/inventory-management/sac-hsn-code" element={<div>SAC/HSN Code</div>} />
              <Route path="/settings/safety/permit" element={<div>Safety Permit</div>} />
              <Route path="/settings/safety/permit-setup" element={<div>Safety Permit Setup</div>} />
              <Route path="/settings/safety/incident" element={<div>Safety Incident</div>} />
              <Route path="/settings/safety/setup" element={<div>Safety Setup</div>} />
              <Route path="/settings/waste-management/setup" element={<div>Waste Management Setup</div>} />
              <Route path="/settings/general/holiday-calendar" element={<div>Holiday Calendar</div>} />
              <Route path="/settings/general/about" element={<div>About</div>} />
              <Route path="/settings/general/language" element={<div>Language</div>} />
              <Route path="/settings/general/company-logo-upload" element={<div>Company Logo Upload</div>} />
              <Route path="/settings/general/report-setup" element={<div>Report Setup</div>} />
              <Route path="/settings/general/notification-setup" element={<div>Notification Setup</div>} />
              <Route path="/settings/account" element={<div>Account Settings</div>} />
              <Route path="/settings/users" element={<div>Users</div>} />
              <Route path="/settings/roles" element={<div>Roles (RACI)</div>} />
              <Route path="/settings/roles/department" element={<div>Department</div>} />
              <Route path="/settings/roles/role" element={<div>Role</div>} />
              <Route path="/settings/approval-matrix" element={<div>Settings Approval Matrix</div>} />
              <Route path="/settings/asset-setup/approval-matrix" element={<div>Asset Setup Approval Matrix</div>} />
              <Route path="/settings/asset-setup/asset-groups" element={<div>Asset Groups Setup</div>} />
              <Route path="/settings/module1/function1" element={<div>Module 1 Function 1</div>} />
              <Route path="/settings/module1/function2" element={<div>Module 1 Function 2</div>} />
              <Route path="/settings/module2/function1" element={<div>Module 2 Function 1</div>} />
              <Route path="/settings/module2/function2" element={<div>Module 2 Function 2</div>} />
              <Route path="/settings/masters/checklist" element={<div>Checklist Master</div>} />
              <Route path="/settings/masters/unit" element={<div>Unit Master</div>} />
              <Route path="/settings/masters/address" element={<div>Address Master</div>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;
