import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

interface HistoryCardTabProps {
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

interface ActivityHistoryEntry {
  created_at: string;
  action: string;
  details: string[];
  owner: string;
}

export const HistoryCardTab: React.FC<HistoryCardTabProps> = ({ asset, assetId }) => {
  const [activeTab, setActiveTab] = useState<'history-details' | 'logs'>('history-details');
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      // Use assetId prop if available, otherwise fall back to asset.id
      const idToUse = assetId || asset.id;
      
      if (!idToUse) {
        console.warn('No asset ID available for history fetch');
        return;
      }

      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/assets/${idToUse}/get_asset_history.json`,
          {
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );
        setActivityHistory(response.data.activity_history || []);
      } catch (error) {
        console.error('Failed to fetch asset history:', error);
        setActivityHistory([]);
      }
    };
    fetchHistory();
  }, [assetId, asset.id]);

  // Basic asset info mapped from asset prop
  const basicAssetInfo = [
    { label: 'Asset Name', value: asset?.name || '-' },
    { label: 'Asset Code', value: asset?.asset_code || '-' },
    { label: 'Category', value: asset?.group || '-' },
    { label: 'Current Status', value: asset?.status || '-' },
    { label: 'Location', value: asset?.site_name || '-' },
    { label: 'Responsible Dept.', value: asset?.allocation_type || '-' }
  ];

  // Map API data for history table
  const mappedHistoryTable = activityHistory.map((entry) => ({
    date: entry.created_at,
    type: entry.action,
    description: entry.details && entry.details.length > 0
      ? entry.details.map((d) => `<div>${d}</div>`).join('')
      : '-',
    performedBy: entry.owner
  }));

  const renderHistoryDetails = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1A1A1A]">Basic Asset Info</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="w-full text-center"> 
                  <TableRow>
                    <TableHead className="font-medium text-center">Label</TableHead>
                    <TableHead className="font-medium text-center">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {basicAssetInfo.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="p-4 text-center font-medium text-gray-700">{item.label}</TableCell>
                      <TableCell className="p-4 text-center text-gray-900">{item.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1A1A1A]">History</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">Type of Activity</TableHead>
                    <TableHead className="font-medium">Description</TableHead>
                    <TableHead className="font-medium">Performed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedHistoryTable.length > 0 ? (
                    mappedHistoryTable.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>
                          <div dangerouslySetInnerHTML={{ __html: row.description }} />
                        </TableCell>
                        <TableCell>{row.performedBy}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-400">No history available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-[#C72030]"></div>
        <div className="space-y-8">
          {activityHistory.length > 0 ? (
            activityHistory.map((entry, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-white">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-gray-900 text-base leading-relaxed">
                          <span className="font-medium">{entry.owner}</span>
                          {entry.action ? ` (${entry.action})` : ''}
                        </p>
                        {Array.isArray(entry.details) && entry.details.length > 0 && (
                          <ul className="mt-2 list-disc list-inside text-gray-700 text-sm">
                            {entry.details.map((detail: string, i: number) => (
                              <li key={i} dangerouslySetInnerHTML={{ __html: detail }} />
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm whitespace-nowrap">
                        {entry.created_at}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center">No logs available.</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-[#C72030]" />
        <h2 className="text-lg font-semibold uppercase text-[#1A1A1A]">History In Details</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('history-details')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'history-details'
              ? 'bg-[#EDEAE3] text-lg font-semibold uppercase text-[#1A1A1A" border-[#EDEAE3]'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
          >
            History Details
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'logs'
              ? 'bg-[#EDEAE3] text-lg font-semibold uppercase text-[#1A1A1A] border-[#EDEAE3]'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
          >
            Logs
          </button>
        </div> */}
        <div className="flex border-b border-gray-200">
  <button
    onClick={() => setActiveTab('history-details')}
    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
      activeTab === 'history-details'
        ? 'bg-[#EDEAE3] text-lg font-semibold uppercase text-[#C72030] border-[#EDEAE3]'
        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
    }`}
  >
    History Details
  </button>
  <button
    onClick={() => setActiveTab('logs')}
    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
      activeTab === 'logs'
        ? 'bg-[#EDEAE3] text-lg font-semibold uppercase text-[#C72030] border-[#EDEAE3]'
        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
    }`}
  >
    Logs
  </button>
</div>


        <div className="p-4 sm:p-6 ">
          {activeTab === 'history-details' && renderHistoryDetails()}
          {activeTab === 'logs' && renderLogs()}
        </div>
      </div>
    </div>
  );
};