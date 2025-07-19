import React from 'react';
import { Clock, Check, Download } from 'lucide-react';

export const AssetAnalyticsTab = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Asset Analytics</h2>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-destructive" />
          <span className="text-destructive font-medium">Downtime</span>
        </div>
      </div>

      {/* Asset Config Table */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Asset Config Table</h3>
        <div className="grid grid-cols-9 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">Asset Basic</div>
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">AMC</div>
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">PPM</div>
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">Group</div>
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">Dep.</div>
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">Tagged</div>
            <span className="text-sm text-muted-foreground">Partial</span>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">Mtr.</div>
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">Audit</div>
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">Cost</div>
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Tickets */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Open 2 T</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Open 2 Tickets</span>
              <span className="text-sm font-medium">55%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '55%' }}></div>
            </div>
          </div>
        </div>

        {/* Upcoming AMC */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Upcoming AMC</h3>
          <div className="text-2xl font-bold">14/07/2025</div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PPM Comp. Rate */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">PPM Comp. Rate</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">₹ 40,000</span>
            <span className="text-lg font-medium">55%</span>
          </div>
        </div>

        {/* Last PPM */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Last PPM</h3>
          <div className="flex justify-between items-center">
            <span className="text-lg">DD.MM.YY</span>
            <Download className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>
        </div>

        {/* Next PPM Due */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Next PPM Due</h3>
          <div className="text-2xl font-bold">₹ 40,000</div>
        </div>
      </div>
    </div>
  );
};