import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Recessed-strip tab trigger: muted text at rest, raised white segment when active.
const historyTabTriggerClass =
  'rounded-[9px] px-4 py-2 text-[13px] font-semibold text-[rgba(26,26,24,0.68)] shadow-none transition-colors hover:text-[#1A1A18] data-[state=active]:bg-white data-[state=active]:text-[#1A1A18] data-[state=active]:shadow-[0_1px_3px_rgba(26,26,24,0.08)]';

// Standard tinted status pills — same tone mapping as the other status pills
// (danger / warning / info / success), low-saturation fill with matching text.
const SEVERITY_PILL_CLASS: Record<string, string> = {
  Critical: 'bg-[rgba(231,132,142,0.15)] text-[#B04A55]',
  High: 'bg-[rgba(237,196,136,0.28)] text-[#8A6420]',
  Medium: 'bg-[rgba(107,155,204,0.15)] text-[#3F6E9E]',
  Low: 'bg-[rgba(121,140,94,0.15)] text-[#56683F]',
};

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
  asset_type_category?: string;
  asset_breakdown_histories?: {
    reason: string;
    type: string;
    severity: string;
    date: string;
    expected_repair_duration: string;
    in_use_date: string | null;
    submitted_by: string;
    breakdown_attachments: any[];
  }[];
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
  const [breakdownHistories, setBreakdownHistories] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      // Use assetId prop if available, otherwise fall back to asset.id
      const idToUse = assetId || asset.id;

      if (!idToUse) {
        console.warn('No asset ID available for history fetch');
        return;
      }

      try {
        // Fetch from history API - returns both activity_history and asset_breakdown_histories
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/assets/${idToUse}/get_asset_history.json`,
          {
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );
        
        console.log('Full API Response:', response.data);
        
        // Extract activity history
        if (response.data.activity_history) {
          console.log('Activity history:', response.data.activity_history);
          setActivityHistory(response.data.activity_history);
        } else {
          console.log('No activity_history found');
          setActivityHistory([]);
        }
        
        // Extract breakdown histories from root level
        if (response.data.asset_breakdown_histories && Array.isArray(response.data.asset_breakdown_histories)) {
          console.log('Breakdown histories found:', response.data.asset_breakdown_histories);
          console.log('Breakdown count:', response.data.asset_breakdown_histories.length);
          setBreakdownHistories(response.data.asset_breakdown_histories);
        } else {
          console.log('No asset_breakdown_histories found in response');
          console.log('Available keys:', Object.keys(response.data));
          setBreakdownHistories([]);
        }
      } catch (error) {
        console.error('Failed to fetch asset history:', error);
        setActivityHistory([]);
        setBreakdownHistories([]);
      }
    };
    fetchHistory();
  }, [assetId, asset.id]);

  const calcDuration = (from: string | null | undefined, to: string | null | undefined): string => {
    if (!from) return '—';
    const start = new Date(from).getTime();
    const end = to ? new Date(to).getTime() : Date.now();
    const diffMs = end - start;
    if (isNaN(diffMs) || diffMs < 0) return '—';
    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
    return (to ? '' : '') + parts.join(' ');
  };

  // Basic asset info mapped from asset prop
  const basicAssetInfo = [
    { label: 'Asset Name', value: asset?.name || '-' },
    { label: 'Asset Code', value: asset?.asset_code || '-' },
    { label: 'Category', value: asset?.asset_type_category || '-' },
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

      {/* Breakdown History Table */}
      {breakdownHistories && breakdownHistories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#1A1A1A]">Asset Breakdown History</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Breakdown Date</TableHead>
                      <TableHead className="font-medium">Reported By</TableHead>

                      <TableHead className="font-medium">Failure Reason</TableHead>
                      <TableHead className="font-medium">Type</TableHead>
                      <TableHead className="font-medium">Severity Level</TableHead>
                      <TableHead className="font-medium">Target Restoration Date</TableHead>
                      <TableHead className="font-medium">Actual Restoration Date</TableHead>
                      <TableHead className="font-medium">Duration</TableHead>
                      <TableHead className="font-medium">Restored By</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breakdownHistories.map((breakdown, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-sm">
                          {breakdown.date ? new Date(breakdown.date).toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-sm">{breakdown.submitted_by || '-'}</TableCell>

                        <TableCell className="text-sm">{breakdown.reason || '-'}</TableCell>
                        
                        <TableCell className="text-sm">{breakdown.type || '-'}</TableCell>
                        <TableCell>
                          {breakdown.severity ? (
                            <span
                              className={`inline-flex items-center rounded-full px-[10px] py-[3px] text-[11px] font-medium ${
                                SEVERITY_PILL_CLASS[breakdown.severity] ?? SEVERITY_PILL_CLASS.Low
                              }`}
                            >
                              {breakdown.severity}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{breakdown.expected_repair_duration || '-'}</TableCell>
                        <TableCell className="text-sm">
                          {breakdown.in_use_date ? new Date(breakdown.in_use_date).toLocaleString() : 'Not restored'}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          <span className={breakdown.in_use_date ? 'text-[#56683F]' : 'text-[#8A6420]'}>
                            {calcDuration(breakdown.date, breakdown.in_use_date)}
                          </span>
                          {!breakdown.in_use_date && breakdown.date && (
                            <span className="block text-xs text-gray-400 font-normal">ongoing</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{breakdown.marked_in_use_by || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-4 top-8 bottom-0 w-px bg-[rgba(26,26,24,0.12)]"></div>
        <div className="space-y-8">
          {activityHistory.length > 0 ? (
            activityHistory.map((entry, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                <div className="w-8 h-8 bg-[#F5F4F0] border border-[rgba(26,26,24,0.12)] rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <div className="w-2.5 h-2.5 bg-[rgba(26,26,24,0.48)] rounded-full"></div>
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
        <span className="w-9 h-9 rounded-[10px] bg-[#F5F4F0] flex items-center justify-center shrink-0">
          <FileText className="w-[18px] h-[18px] text-[rgba(26,26,24,0.68)]" />
        </span>
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
        {/* Standard tab treatment: recessed neutral strip, raised neutral active segment */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'history-details' | 'logs')}
          className="w-full"
        >
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <TabsList className="inline-flex h-auto gap-1 rounded-[12px] border border-[rgba(26,26,24,0.06)] bg-[#F5F4F0] p-1">
              <TabsTrigger value="history-details" className={historyTabTriggerClass}>
                History Details
              </TabsTrigger>
              <TabsTrigger value="logs" className={historyTabTriggerClass}>
                Logs
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="history-details" className="mt-0 p-4 sm:p-6">
            {renderHistoryDetails()}
          </TabsContent>
          <TabsContent value="logs" className="mt-0 p-4 sm:p-6">
            {renderLogs()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};