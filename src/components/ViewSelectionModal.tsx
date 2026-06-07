import React, { useState } from "react";
import { Users, Shield, ArrowRight, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../contexts/PermissionsContext";
import { findFirstAccessibleRoute } from "@/utils/dynamicNavigation";

interface ViewSelectionModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const ViewSelectionModal: React.FC<ViewSelectionModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [selectedView, setSelectedView] = useState<string | null>("admin"); // Default to admin
  const navigate = useNavigate();
  const { userRole } = usePermissions();

  // Helper function to get first available employee link
  const getFirstEmployeeLink = (): string => {
    if (!userRole || !userRole.lock_modules) {
      return "/vas/projects"; // Fallback
    }

    // Find first module from Employee modules (Employee Sidebar or Employee Projects Sidebar)
    for (const module of userRole.lock_modules) {
      // Only look for Employee-specific modules
      if (
        module.module_name === "Employee Sidebar" ||
        module.module_name === "Employee Projects Sidebar" ||
        module.module_name === "Employee Business Compass" ||
        module.module_name === "Employee Admin Compass"
      ) {
        // Find first active function with a react_link
        const firstActiveFunction = module.lock_functions.find(
          (func) =>
            func.function_active === 1 &&
            func.react_link &&
            !func.parent_function
        );

        if (firstActiveFunction && firstActiveFunction.react_link) {
          return firstActiveFunction.react_link;
        }
      }
    }

    return "/vas/projects"; // Fallback to projects
  };

  // Helper function to get first available admin link
  const getFirstAdminLink = (): string => {
    if (!userRole || !userRole.lock_modules) {
      return "/";
    }

    // Find first module with active functions (excluding Employee modules)
    for (const module of userRole.lock_modules) {
      // Skip Employee Sidebar and Employee Projects Sidebar modules
      if (
        module.module_name === "Employee Sidebar" ||
        module.module_name === "Employee Projects Sidebar" ||
        module.module_name === "Employee Business Compass" ||
        module.module_name === "Employee Admin Compass"
      ) {
        continue;
      }

      // Find first active function with a react_link
      const firstActiveFunction = module.lock_functions.find(
        (func) =>
          func.function_active === 1 && func.react_link && !func.parent_function
      );

      if (firstActiveFunction && firstActiveFunction.react_link) {
        return firstActiveFunction.react_link;
      }
    }

    return "/"; // Fallback to root
  };

  const handleViewSelection = (viewType: string) => {
    // Set localStorage based on selected view
    if (viewType === "admin") {
      localStorage.setItem("userType", "pms_organization_admin");
      localStorage.setItem("selectedView", "admin");
      localStorage.removeItem("tempType"); // Remove tempType to ensure admin view

      // Use getFirstAdminLink which properly excludes employee modules
      const adminLink = getFirstAdminLink();
      navigate(adminLink);
    } else if (viewType === "employee") {
      localStorage.setItem("userType", "pms_occupant");
      localStorage.setItem("tempType", "pms_organization_admin");
      localStorage.setItem("selectedView", "employee");

      // Use dynamic employee link based on permissions
      const employeeLink = getFirstEmployeeLink();
      navigate(employeeLink);
    }

    // Complete the selection and reload to apply changes
    onComplete();
    // window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-[calc(100vw-32px)] border-0 bg-white p-5 shadow-xl sm:max-w-[596px] sm:p-6 [&>button]:hidden">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-center text-[26px] font-bold leading-tight text-[#111111]">
            Welcome! Choose Your View
          </DialogTitle>
          <DialogDescription className="text-center text-[15px] text-[#5f6775]">
            Select how you want to access the system
          </DialogDescription>
        </DialogHeader>

        <div className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Admin View Card */}
          <button
            type="button"
            aria-pressed={selectedView === "admin"}
            onClick={() => setSelectedView("admin")}
            className={`relative min-h-[244px] rounded-lg border-2 p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/35 ${
              selectedView === "admin"
                ? "border-[#DA7756] bg-[#fff6f2] shadow-[0_10px_20px_rgba(218,119,86,0.18)]"
                : "border-[#e1e5ea] bg-white hover:border-[#d4d9e1] hover:shadow-md"
            }`}
          >
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  selectedView === "admin"
                    ? "bg-[#DA7756] text-white"
                    : "bg-[#f3f4f6] text-[#4b5563]"
                }`}
              >
                <Shield className="h-10 w-10" strokeWidth={2.4} />
              </div>
              <div>
                <h3 className="mb-2 text-[21px] font-bold leading-tight text-[#202027]">
                  Admin View
                </h3>
                <p className="text-[15px] leading-5 text-[#5f6775]">
                  Full access to manage projects, sites, and all system features
                </p>
              </div>
              {selectedView === "admin" && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#DA7756] text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </div>
              )}
            </div>
          </button>

          {/* Employee View Card */}
          <button
            type="button"
            aria-pressed={selectedView === "employee"}
            onClick={() => setSelectedView("employee")}
            className={`relative min-h-[244px] rounded-lg border-2 p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/35 ${
              selectedView === "employee"
                ? "border-[#DA7756] bg-[#fff6f2] shadow-[0_10px_20px_rgba(218,119,86,0.18)]"
                : "border-[#e1e5ea] bg-white hover:border-[#d4d9e1] hover:shadow-md"
            }`}
          >
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  selectedView === "employee"
                    ? "bg-[#DA7756] text-white"
                    : "bg-[#f3f4f6] text-[#4b5563]"
                }`}
              >
                <Users className="h-10 w-10" strokeWidth={2.4} />
              </div>
              <div>
                <h3 className="mb-2 text-[21px] font-bold leading-tight text-[#202027]">
                  Employee View
                </h3>
                <p className="text-[15px] leading-5 text-[#5f6775]">
                  Access your personal portal, tickets, and employee-specific
                  features
                </p>
              </div>
              {selectedView === "employee" && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#DA7756] text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <div className="mt-12 flex justify-center">
          <Button
            onClick={() => selectedView && handleViewSelection(selectedView)}
            disabled={!selectedView}
            className={`h-12 min-w-[188px] rounded-none px-8 text-[19px] font-bold transition-all duration-300 ${
              selectedView
                ? "!bg-[#F2EEE9] !text-[#111111] shadow-[0_8px_16px_rgba(17,24,39,0.12)] hover:!bg-[#ece3dc] [&_svg]:!text-[#DA7756]"
                : "cursor-not-allowed !bg-gray-200 !text-gray-400 [&_svg]:!text-gray-400"
            }`}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2.5} />
          </Button>
        </div>

        {/* Info Footer */}
        <div className="mt-10 border border-[#d1d5db] bg-[#fafafa] p-4">
          <p className="text-center text-sm text-[#1f2937]">
            <strong>Note:</strong> You can switch between views anytime from the
            header menu
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
