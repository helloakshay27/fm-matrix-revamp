import React from 'react';
import { Clock, Check, Download } from 'lucide-react';
interface AssetAnalyticsTab {
  asset: Asset;
  assetId?: string | number;
}
interface Asset {
  id: number;
  name: string;
  model_number: string;
  serial_number: string;
  purchase_cost: number;
  purchased_on: string;
  warranty: boolean;
  warranty_expiry: string;
  manufacturer: string;
  asset_number: string;
  asset_code: string;
  group: string;
  sub_group: string;
  allocation_type: string;
  depreciation_applicable: boolean;
  depreciation_method: string;
  useful_life: number;
  salvage_value: number;
  status: string;
  current_book_value: number;
  site_name: string;
  commisioning_date: string;
  vendor_name: string;
  supplier_detail?: {
    company_name: string;
    email: string;
    mobile1: string;
  };
  asset_loan_detail?: {
    agrement_from_date: string;
    agrement_to_date: string;
    supplier: string;
  };
  depreciation_details?: {
    period: string;
    book_value_beginning: number;
    depreciation: number;
    book_value_end: number;
  }[];
  asset_amcs?: any[];
  custom_fields?: any;
  floor?: { name: string };
  building?: { name: string };
  wing?: { name: string };
  area?: { name: string };
}

interface AssetAnalyticsTabProps {
  asset: Asset;
}
export const AssetAnalyticsTab: React.FC<AssetAnalyticsTab> = ({ asset, assetId }) => {
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
      <div className="rounded-xl p-3 sm:p-6 border shadow-lg bg-white">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-red-600">Asset Config Table</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-4">
          <div className="text-center p-2 sm:p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-50">
            <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-red-600">Asset Basic</div>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-2 sm:p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-50">
            <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-red-600">AMC</div>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-2 sm:p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-50">
            <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-red-600">PPM</div>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-2 sm:p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-50">
            <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-red-600">Group</div>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-2 sm:p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-50">
            <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-red-600">Dep.</div>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-2 sm:p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-50">
            <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-red-600">Tagged</div>
            <span className="text-xs sm:text-sm text-red-600 font-medium">Partial</span>
          </div>
          <div className="text-center p-2 sm:p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-50">
            <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-red-600">Mtr.</div>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-2 sm:p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-50">
            <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-red-600">Audit</div>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mx-auto" />
          </div>
          <div className="text-center p-2 sm:p-4 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-50">
            <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-red-600">Cost</div>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mx-auto" />
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Tickets */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Open 2 T</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-500">Open 2 Tickets</span>
              <span className="text-sm font-bold text-red-600 border border-red-200 px-2 py-1 rounded-full bg-white">55%</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-3 shadow-inner">
              <div className="bg-red-600 h-3 rounded-full shadow-sm" style={{ width: '55%' }}></div>
            </div>
          </div>
        </div>

        {/* Upcoming AMC */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Upcoming AMC</h3>
          <div className="text-2xl font-bold text-red-600 border border-red-200 px-3 py-2 rounded-lg inline-block bg-white">14/07/2025</div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PPM Comp. Rate */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white">
          <h3 className="text-lg font-semibold mb-4 text-red-600">PPM Comp. Rate</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-red-600">₹ 40,000</span>
            <span className="text-lg font-bold text-red-600 border border-red-200 px-3 py-1 rounded-full bg-white">55%</span>
          </div>
        </div>

        {/* Last PPM */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Last PPM</h3>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-red-600 border border-red-200 px-3 py-2 rounded-lg bg-white">DD.MM.YY</span>
            <div className="p-2 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer bg-white">
              <Download className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* Next PPM Due */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Next PPM Due</h3>
          <div className="text-2xl font-bold text-red-600 border border-red-200 px-3 py-2 rounded-lg inline-block bg-white">₹ 40,000</div>
        </div>
      </div>
    </div>
  );
};