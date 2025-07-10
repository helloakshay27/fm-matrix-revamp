
import React from 'react';
import { X, History, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const AMCDetailsTab = () => {
  // Mock data matching the image
  const amcData = {
    vendor: 'Croma Electronics',
    startDate: '01/11/2019',
    endDate: '01/11/2021',
    firstService: '01/05/2020',
    paymentTerms: 'Half Yearly',
    noOfVisits: '3'
  };

  const historyData = [
    {
      srNo: 1,
      visitDate: '01/05/2020',
      technicianName: 'Rakesh K.',
      remarks: 'Demo Remarks'
    },
    {
      srNo: 2,
      visitDate: '08/01/2021',
      technicianName: 'Rakesh K.',
      remarks: 'Demo Remarks'
    },
    {
      srNo: 3,
      visitDate: '12/10/2021',
      technicianName: 'Rakesh K.',
      remarks: 'Demo Remarks'
    }
  ];

  const logsData = [
    {
      text: 'Anushree created a AMC.',
      date: '26th Apr, 2020, 12:30 pm'
    },
    {
      text: 'Rakesh K. made a visit on "01/05/2020" and updated the Remarks as "Demo Remarks".',
      date: '01st May, 2020, 04:19 pm'
    },
    {
      text: 'Anushree updated the no. of visits to "3".',
      date: '18th Oct, 2021, 10:52 am'
    }
  ];

  return (
    <div className="space-y-8">
      {/* AMC Details Section */}
      <div className="bg-white rounded-lg border-2 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
            <X className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>AMC Details</h3>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AMC History Section */}
        <div className="bg-white rounded-lg border-2 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
              <History className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>AMC History</h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-600 font-medium">Sr. No.</TableHead>
                <TableHead className="text-gray-600 font-medium">Visit Date</TableHead>
                <TableHead className="text-gray-600 font-medium">Technician Name</TableHead>
                <TableHead className="text-gray-600 font-medium">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((row) => (
                <TableRow key={row.srNo}>
                  <TableCell className="font-medium">{row.srNo}</TableCell>
                  <TableCell>{row.visitDate}</TableCell>
                  <TableCell>{row.technicianName}</TableCell>
                  <TableCell>{row.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Logs Section */}
        <div className="bg-white rounded-lg border-2 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>Logs</h3>
          </div>

          <div className="space-y-6">
            {logsData.map((log, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#C72030' }}></div>
                  {index < logsData.length - 1 && (
                    <div className="w-0.5 h-12 mt-2" style={{ backgroundColor: '#C72030', opacity: '0.3' }}></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-gray-900 text-sm mb-1">{log.text}</p>
                  <p className="text-gray-400 text-xs">{log.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
