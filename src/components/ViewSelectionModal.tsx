import React, { useState } from "react";
import { Users, Shield, ArrowRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";

interface ViewSelectionModalProps {
    isOpen: boolean;
    onComplete: () => void;
}

export const ViewSelectionModal: React.FC<ViewSelectionModalProps> = ({
    isOpen,
    onComplete,
}) => {
    const [selectedView, setSelectedView] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleViewSelection = (viewType: string) => {
        // Set localStorage based on selected view
        if (viewType === "admin") {
            localStorage.setItem("userType", "pms_organization_admin");
            localStorage.setItem("selectedView", "admin");
            navigate("/");
        } else if (viewType === "employee") {
            localStorage.setItem("userType", "pms_occupant");
            localStorage.setItem("tempType", "pms_organization_admin"); // Clear selected company for employee view
            localStorage.setItem("selectedView", "employee");
            navigate("/vas/projects");
        }

        // Complete the selection and reload to apply changes
        onComplete();
        // window.location.reload();
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[600px] bg-white [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-[#1a1a1a]">
                        Welcome! Choose Your View
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600 mt-2">
                        Select how you want to access the system
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Admin View Card */}
                    <button
                        onClick={() => setSelectedView("admin")}
                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${selectedView === "admin"
                            ? "border-[#C72030] bg-red-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div
                                className={`w-20 h-20 rounded-full flex items-center justify-center ${selectedView === "admin"
                                    ? "bg-[#C72030] text-white"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                <Shield className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                                    Admin View
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Full access to manage projects, sites, and all system features
                                </p>
                            </div>
                            {selectedView === "admin" && (
                                <div className="absolute top-3 right-3">
                                    <div className="w-6 h-6 rounded-full bg-[#C72030] flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Employee View Card */}
                    <button
                        onClick={() => setSelectedView("employee")}
                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${selectedView === "employee"
                            ? "border-[#C72030] bg-red-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div
                                className={`w-20 h-20 rounded-full flex items-center justify-center ${selectedView === "employee"
                                    ? "bg-[#C72030] text-white"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                <Users className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                                    Employee View
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Access your personal portal, tickets, and employee-specific features
                                </p>
                            </div>
                            {selectedView === "employee" && (
                                <div className="absolute top-3 right-3">
                                    <div className="w-6 h-6 rounded-full bg-[#C72030] flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </button>
                </div>

                {/* Continue Button */}
                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={() => selectedView && handleViewSelection(selectedView)}
                        disabled={!selectedView}
                        className={`px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 ${selectedView
                            ? "bg-[#C72030] hover:bg-[#a01828] text-white shadow-lg hover:shadow-xl"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Continue
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>

                {/* Info Footer */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 text-center">
                        <strong>Note:</strong> You can switch between views anytime from the header menu
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};
