
import React from 'react';
import { ArrowLeft, Star, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountingDetailPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#C72030]">
      {/* Header */}
      <div className="bg-[#C72030] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={() => navigate('/market-place/all')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <Calculator className="w-8 h-8 text-[#C72030]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Accounting</h1>
              <p className="text-white/80">Complete accounting management system</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm">by FM Solutions</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm">(15)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Install
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-6 border-b border-white/20">
          <button className="pb-3 border-b-2 border-white text-white font-medium">Overview</button>
          <button className="pb-3 text-white/70 hover:text-white">Screenshots</button>
          <button className="pb-3 text-white/70 hover:text-white">Ratings & Reviews</button>
          <button className="pb-3 text-white/70 hover:text-white">Vendor</button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">About this Extension</h2>
                <p className="text-gray-600 mb-4">
                  Streamline your financial operations with our comprehensive Accounting solution. Designed for businesses 
                  of all sizes, this powerful tool provides complete financial management capabilities including invoicing, 
                  expense tracking, financial reporting, and seamless integration with existing business systems.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Automated invoicing and billing with customizable templates</li>
                  <li>• Real-time financial reporting and dashboard analytics</li>
                  <li>• Expense tracking and categorization with receipt management</li>
                  <li>• Multi-currency support and tax compliance features</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#C72030] text-white px-3 py-1 rounded text-sm">Finance</span>
                  <span className="bg-[#C72030] text-white px-3 py-1 rounded text-sm">Accounting</span>
                  <span className="bg-[#C72030] text-white px-3 py-1 rounded text-sm">Business</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">App Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Development team:</span>
                    <span>FM Solutions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span>Apr 18, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span>English</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span>Finance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pricing:</span>
                    <span>Free</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Compatible Editions</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Standard Plus</li>
                  <li>• CRM Plus</li>
                  <li>• CRM One</li>
                  <li>• Ultimate</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Share This App</h3>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">f</button>
                  <button className="p-2 bg-blue-400 text-white rounded hover:bg-blue-500">t</button>
                  <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800">in</button>
                  <button className="p-2 bg-red-600 text-white rounded hover:bg-red-700">g+</button>
                </div>
              </div>

              <button className="w-full bg-[#C72030] text-white py-2 rounded-lg hover:bg-[#A01A28] transition-colors">
                Request a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDetailPage;
