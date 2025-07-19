import React from 'react';
import { Clock, Check, Download } from 'lucide-react';

export const AssetAnalyticsTab = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-600">
          Asset Analytics
        </h2>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200" style={{ backgroundColor: '#f6f4ee' }}>
          <Clock className="w-5 h-5 text-red-600" />
          <span className="text-red-600 font-medium">Downtime</span>
        </div>
      </div>

      {/* Asset Config Table */}
      <div style={{ backgroundColor: '#f6f4ee' }} className="rounded-xl p-6 border shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Asset Config Table</h3>
        <div className="grid grid-cols-9 gap-4">
          <div className="text-center p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
            <div className="text-sm font-medium mb-2 text-red-600">Asset Basic</div>
            <Check className="w-5 h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
            <div className="text-sm font-medium mb-2 text-red-600">AMC</div>
            <Check className="w-5 h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
            <div className="text-sm font-medium mb-2 text-red-600">PPM</div>
            <Check className="w-5 h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
            <div className="text-sm font-medium mb-2 text-red-600">Group</div>
            <Check className="w-5 h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
            <div className="text-sm font-medium mb-2 text-red-600">Dep.</div>
            <Check className="w-5 h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
            <div className="text-sm font-medium mb-2 text-red-600">Tagged</div>
            <span className="text-sm text-red-600 font-medium">Partial</span>
          </div>
          <div className="text-center p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
            <div className="text-sm font-medium mb-2 text-red-600">Mtr.</div>
            <Check className="w-5 h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
            <div className="text-sm font-medium mb-2 text-red-600">Audit</div>
            <Check className="w-5 h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
            <div className="text-sm font-medium mb-2 text-red-600">Cost</div>
            <Check className="w-5 h-5 text-red-600 mx-auto" />
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Tickets */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Open 2 T</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-500">Open 2 Tickets</span>
              <span className="text-sm font-bold text-red-600 border border-red-200 px-2 py-1 rounded-full" style={{ backgroundColor: '#f6f4ee' }}>55%</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-3 shadow-inner">
              <div className="bg-red-600 h-3 rounded-full shadow-sm" style={{ width: '55%' }}></div>
            </div>
          </div>
        </div>

        {/* Upcoming AMC */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Upcoming AMC</h3>
          <div className="text-2xl font-bold text-red-600 border border-red-200 px-3 py-2 rounded-lg inline-block" style={{ backgroundColor: '#f6f4ee' }}>14/07/2025</div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PPM Comp. Rate */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">PPM Comp. Rate</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-red-600">₹ 40,000</span>
            <span className="text-lg font-bold text-red-600 border border-red-200 px-3 py-1 rounded-full" style={{ backgroundColor: '#f6f4ee' }}>55%</span>
          </div>
        </div>

        {/* Last PPM */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Last PPM</h3>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-red-600 border border-red-200 px-3 py-2 rounded-lg" style={{ backgroundColor: '#f6f4ee' }}>DD.MM.YY</span>
            <div className="p-2 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer" style={{ backgroundColor: '#f6f4ee' }}>
              <Download className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* Next PPM Due */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#f6f4ee' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Next PPM Due</h3>
          <div className="text-2xl font-bold text-red-600 border border-red-200 px-3 py-2 rounded-lg inline-block" style={{ backgroundColor: '#f6f4ee' }}>₹ 40,000</div>
        </div>
      </div>
    </div>
  );
};