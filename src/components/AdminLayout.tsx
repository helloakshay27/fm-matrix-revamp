import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Header } from "./Header";

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen">


              <Header />
              <AdminSidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Welcome, Admin</span>
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">A</span>
                    </div>
                  </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-auto  bg-gray-50">
                  <Outlet />
                </main>
              </div>
            </div>
  );
};
