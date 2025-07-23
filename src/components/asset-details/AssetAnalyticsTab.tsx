import React, { useEffect, useState } from 'react';
import { Clock, Check, Download, X } from 'lucide-react';
import axios from 'axios';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { useParams } from 'react-router-dom';

interface AssetAnalyticsTab {
  asset: Asset;
  assetId?: string | number;
}
interface Asset {
  id: number;
  name: string;
  // ...other fields...
}

interface ConfigStatus {
  asset_basic: boolean;
  amc: boolean;
  ppm: boolean;
  group: boolean;
  depreciation: boolean;
  tagged: boolean;
  mtr: boolean;
  audit: boolean;
  cost: boolean;
}

interface DashboardSummary {
  ppm_comp_rate: string;
  next_amc_due: string | null;
  last_ppm: string | null;
  next_ppm_due: string | null;
  upcoming_amc_date: string | null;
}

export const AssetAnalyticsTab: React.FC<AssetAnalyticsTab> = ({ asset, assetId }) => {
  const { id } = useParams();
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const fetchConfigStatus = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/assets/config_status.json?id=${id}`,
          {
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );
        setConfigStatus(response.data);
      } catch (error) {
        setConfigStatus(null);
      }
    };

    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/assets/dashboard_summary.json?id=${id}`,
          {
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );
        setDashboardSummary(response.data);
      } catch (error) {
        setDashboardSummary(null);
      }
    };

    fetchConfigStatus();
    fetchDashboardSummary();
  }, [id]);

  const configHeaders = [
    'Asset Basic',
    'AMC',
    'PPM',
    'Group',
    'Dep.',
    'Tagged',
    'Mtr.',
    'Audit',
    'Cost'
  ];

  const configKeys: (keyof ConfigStatus)[] = [
    'asset_basic',
    'amc',
    'ppm',
    'group',
    'depreciation',
    'tagged',
    'mtr',
    'audit',
    'cost'
  ];

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
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr>
                {configHeaders.map((header, idx) => (
                  <th key={idx} className="p-3 text-center text-gray-600 font-medium border-b bg-[hsl(var(--analytics-background))]">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {configKeys.map((key, idx) => (
                  <td key={idx} className="p-3 text-center border-b border-red-100">
                    {configStatus ? (
                      configStatus[key] ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Tickets */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white" style={{ backgroundColor: '#F6F4EE' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Open Tickets</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-500">Open Tickets</span>
              <span className="text-sm font-bold text-red-600 border border-red-200 px-2 py-1 rounded-full bg-white">
                
              </span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-3 shadow-inner">
              <div
                className="bg-red-600 h-3 rounded-full shadow-sm"
                style={{
                  width: dashboardSummary?.ppm_comp_rate
                    ? dashboardSummary.ppm_comp_rate
                    : '0%'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upcoming AMC */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white" style={{ backgroundColor: '#F6F4EE' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Upcoming AMC</h3>
          <div className="text-2xl font-bold text-red-600 border border-red-200 px-3 py-2 rounded-lg inline-block bg-white">
            {dashboardSummary?.upcoming_amc_date && dashboardSummary.upcoming_amc_date !== 'NA'
              ? dashboardSummary.upcoming_amc_date
              : 'NA'}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PPM Comp. Rate */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white" style={{ backgroundColor: '#F6F4EE' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">PPM Comp. Rate</h3>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-red-600 border border-red-200 px-3 py-1 rounded-full bg-white">
              {dashboardSummary?.ppm_comp_rate || '-'}
            </span>
          </div>
        </div>

        {/* Last PPM */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white" style={{ backgroundColor: '#F6F4EE' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Last PPM</h3>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-red-600 border border-red-200 px-3 py-2 rounded-lg bg-white">
              {dashboardSummary?.last_ppm || '-'}
            </span>
            <div className="p-2 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer bg-white">
              <Download className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* Next PPM Due */}
        <div className="rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow bg-white"style={{ backgroundColor: '#F6F4EE' }}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Next PPM Due</h3>
          <div className="text-2xl font-bold text-red-600 border border-red-200 px-3 py-2 rounded-lg inline-block bg-white">
            {dashboardSummary?.next_ppm_due || '-'}
          </div>
        </div>
      </div>
    </div>
  );
};