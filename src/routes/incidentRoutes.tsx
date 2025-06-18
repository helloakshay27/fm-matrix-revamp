
import { IncidentListDashboard } from '@/pages/IncidentListDashboard';
import { AddIncidentPage } from '@/pages/AddIncidentPage';
import { IncidentDetailsPage } from '@/pages/IncidentDetailsPage';
import { EditIncidentDetailsPage } from '@/pages/EditIncidentDetailsPage';

export const incidentRoutes = [
  {
    path: "/maintenance/safety/incident",
    element: <IncidentListDashboard />
  },
  {
    path: "/maintenance/safety/incident/add", 
    element: <AddIncidentPage />
  },
  {
    path: "/maintenance/safety/incident/:id",
    element: <IncidentDetailsPage />
  },
  {
    path: "/maintenance/safety/incident/:id/edit",
    element: <EditIncidentDetailsPage />
  }
];
