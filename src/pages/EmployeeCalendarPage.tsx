import React from "react";
import { EmployeeHeader } from "@/components/EmployeeHeader";
import { EmployeeUnifiedCalendar } from "@/components/employee/EmployeeUnifiedCalendar";
import { useNavigate } from "react-router-dom";
import { Calendar, Briefcase, CheckSquare, Users } from "lucide-react";

export const EmployeeCalendarPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToDetails = (type: string, id: string) => {
    // Navigate to appropriate detail pages based on event type
    switch (type) {
      case "project":
        navigate(`/employee/projects/${id}`);
        break;
      case "booking":
        navigate(`/bookings/${id}`);
        break;
      case "todo":
        navigate(`/employee/tasks/${id}`);
        break;
      case "meeting":
        navigate(`/bookings/${id}`);
        break;
      default:
        console.log("Unknown event type:", type);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeHeader />

      <main className="pt-6 pb-8 px-6 max-w-[1600px] mx-auto">
        {/* Page Header */}

        {/* Unified Calendar Component */}
        <EmployeeUnifiedCalendar
          onNavigateToDetails={handleNavigateToDetails}
        />
      </main>
    </div>
  );
};

export default EmployeeCalendarPage;
