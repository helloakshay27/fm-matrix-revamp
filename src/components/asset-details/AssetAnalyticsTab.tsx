import React from 'react';
import { Clock, Check, Download } from 'lucide-react';

export const AssetAnalyticsTab = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Asset Analytics
        </h2>
        <div className="flex items-center gap-2 bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
          <Clock className="w-5 h-5 text-destructive" />
          <span className="text-destructive font-medium">Downtime</span>
        </div>
      </div>

      {/* Asset Config Table */}
      <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-xl p-6 border shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Asset Config Table</h3>
        <div className="grid grid-cols-9 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium mb-2 text-green-800">Asset Basic</div>
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium mb-2 text-blue-800">AMC</div>
            <Check className="w-5 h-5 text-blue-600 mx-auto" />
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium mb-2 text-purple-800">PPM</div>
            <Check className="w-5 h-5 text-purple-600 mx-auto" />
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium mb-2 text-indigo-800">Group</div>
            <Check className="w-5 h-5 text-indigo-600 mx-auto" />
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium mb-2 text-emerald-800">Dep.</div>
            <Check className="w-5 h-5 text-emerald-600 mx-auto" />
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium mb-2 text-orange-800">Tagged</div>
            <span className="text-sm text-orange-600 font-medium">Partial</span>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium mb-2 text-teal-800">Mtr.</div>
            <Check className="w-5 h-5 text-teal-600 mx-auto" />
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium mb-2 text-pink-800">Audit</div>
            <Check className="w-5 h-5 text-pink-600 mx-auto" />
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium mb-2 text-yellow-800">Cost</div>
            <Check className="w-5 h-5 text-yellow-600 mx-auto" />
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Tickets */}
        <div className="bg-gradient-to-br from-card via-card to-blue-50/50 rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Open 2 T</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Open 2 Tickets</span>
              <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">55%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 shadow-inner">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm" style={{ width: '55%' }}></div>
            </div>
          </div>
        </div>

        {/* Upcoming AMC */}
        <div className="bg-gradient-to-br from-card via-card to-green-50/50 rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Upcoming AMC</h3>
          <div className="text-2xl font-bold text-green-600 bg-green-100 px-3 py-2 rounded-lg inline-block">14/07/2025</div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PPM Comp. Rate */}
        <div className="bg-gradient-to-br from-card via-card to-purple-50/50 rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">PPM Comp. Rate</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-purple-600">₹ 40,000</span>
            <span className="text-lg font-bold text-purple-500 bg-purple-100 px-3 py-1 rounded-full">55%</span>
          </div>
        </div>

        {/* Last PPM */}
        <div className="bg-gradient-to-br from-card via-card to-orange-50/50 rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-orange-700">Last PPM</h3>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-orange-600 bg-orange-100 px-3 py-2 rounded-lg">DD.MM.YY</span>
            <div className="p-2 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer">
              <Download className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Next PPM Due */}
        <div className="bg-gradient-to-br from-card via-card to-red-50/50 rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-red-700">Next PPM Due</h3>
          <div className="text-2xl font-bold text-red-600 bg-red-100 px-3 py-2 rounded-lg inline-block">₹ 40,000</div>
        </div>
      </div>
    </div>
  );
};