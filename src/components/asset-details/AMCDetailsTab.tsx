import React from 'react';
import { X, History, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AMCDetailsTabProps {
  asset: Asset;
  assetId?: string | number;
}

interface Asset {
  id: number;
  asset_amcs?: any[];
}

export const AMCDetailsTab: React.FC<AMCDetailsTabProps> = ({ asset }) => {
  const amcs = asset.asset_amcs || [];

  return (
    <div className="space-y-10">
      {amcs.length === 0 ? (
        <div className="text-center text-gray-400">No AMC data available.</div>
      ) : (
        amcs.map((amc, index) => {
          const amcData = {
            vendor: amc?.supplier_name || amc?.amc_vendor_name || '-',
            startDate: amc?.amc_start_date || '-',
            endDate: amc?.amc_end_date || '-',
            firstService: amc?.amc_first_service || '-',
            paymentTerms: amc?.payment_term || '-',
            noOfVisits: amc?.no_of_visits?.toString() || '-',
          };

          const historyData = Array.isArray(amc?.amc_visit_logs) && amc.amc_visit_logs.length > 0
            ? amc.amc_visit_logs.map((visit: any) => ({
               
                visitDate: visit.visit_date || '-',
                technicianName: visit.technician_name || '-',
                remarks: visit.remark || '-',
                amcPeriod: visit.amc_period || '-',
              }))
            : [];

          const logsData = Array.isArray(amc?.logs) && amc.logs.length > 0
            ? amc.logs.flat().map((log: any) => ({
                text: log.parsed_content || log.log_type || 'Log entry',
                date: log.created_at
                  ? new Date(log.created_at).toLocaleString('en-GB')
                  : '-',
                performedBy: log.user_name || '-',
              }))
            : [];

          return (
            <div key={index} className="space-y-6 border-2 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                  <X className="w-4 h-4"style={{ color: "#C72030" }} />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A">AMC Details {amcs.length > 1 ? `#${index + 1}` : ''}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-4">
                  <div className="flex">
                    <span className="text-gray-500 w-24">Vendor</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcData.vendor}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">First Service</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcData.firstService}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex">
                    <span className="text-gray-500 w-24">Start Date</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcData.startDate}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Payment Terms</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcData.paymentTerms}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex">
                    <span className="text-gray-500 w-24">End Date</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcData.endDate}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">No. Of Visits</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcData.noOfVisits}</span>
                    
                  </div>
                </div>
              </div>

              {/* History + Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* AMC History */}
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <History className="w-4 h-4 "style={{ color: "#C72030" }} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Visit History</h3>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-600 font-medium">Sr. No.</TableHead>
                        <TableHead className="text-gray-600 font-medium">Visit Date</TableHead>
                        <TableHead className="text-gray-600 font-medium">Technician Name</TableHead>
                        {/* <TableHead className="text-gray-600 font-medium">Remarks</TableHead> */}
                        <TableHead className="text-gray-600 font-medium">AMC Period</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.length > 0 ? (
                        historyData.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{row.visitDate}</TableCell>
                            <TableCell>{row.technicianName}</TableCell>
                            {/* <TableCell>{row.remarks}</TableCell> */}
                            <TableCell>{row.amcPeriod}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-400">
                            No AMC visit history available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Logs */}
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <FileText className="w-4 h-4 "style={{ color: "#C72030" }} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A">AMC History</h3>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-600 font-medium">Sr. No.</TableHead>
                        <TableHead className="text-gray-600 font-medium">Description</TableHead>
                        <TableHead className="text-gray-600 font-medium">Performed By</TableHead>
                        <TableHead className="text-gray-600 font-medium">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logsData.length > 0 ? (
                        logsData.map((log, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{log.text}</TableCell>
                            <TableCell>{log.performedBy}</TableCell>
                            <TableCell>{log.date}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400">
                            No logs available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
