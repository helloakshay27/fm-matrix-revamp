import React from "react";
import { ArrowLeft } from "lucide-react";

const BusinessPlan: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fbf8f4]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Company Hub</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business Plan
          </h1>
          <p className="text-gray-600 text-lg">
            This page will display the business plan content. UI design coming
            soon...
          </p>
        </div>
      </main>
    </div>
  );
};

export default BusinessPlan;
