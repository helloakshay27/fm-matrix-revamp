
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer } from "lucide-react";

export const OperationalAuditConductedDashboard = () => {
  // Sample data matching the conducted audits from image 2
  const conductedData = [
    { 
      report: null, 
      id: "46084738", 
      auditName: "clean", 
      startDateTime: "18/02/2025, 06:26PM", 
      conductedBy: "", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: true, 
      id: "44388421", 
      auditName: "This is test Audit", 
      startDateTime: "22/11/2024, 04:17PM", 
      conductedBy: "Vinayak Mane", 
      status: "Completed", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: true, 
      id: "44254888", 
      auditName: "This is test Audit", 
      startDateTime: "05/11/2024, 02:44PM", 
      conductedBy: "", 
      status: "Completed", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44247307", 
      auditName: "This is test Audit", 
      startDateTime: "30/10/2024, 04:27PM", 
      conductedBy: "Vinayak Mane", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44247306", 
      auditName: "This is test Audit", 
      startDateTime: "30/10/2024, 04:27PM", 
      conductedBy: "Vinayak Mane", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: true, 
      id: "44246870", 
      auditName: "This is test Audit", 
      startDateTime: "25/10/2024, 01:08PM", 
      conductedBy: "Vinayak Mane", 
      status: "Completed", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: true, 
      id: "44212284", 
      auditName: "This is test Audit", 
      startDateTime: "23/10/2024, 06:34PM", 
      conductedBy: "", 
      status: "Completed", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44212283", 
      auditName: "Short Audit Process Report 1", 
      startDateTime: "23/10/2024, 06:23PM", 
      conductedBy: "Deepak Gupta", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44119818", 
      auditName: "Short Audit Process Report 1", 
      startDateTime: "18/10/2024, 11:48AM", 
      conductedBy: "", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44119816", 
      auditName: "Short Audit Process Report 1", 
      startDateTime: "18/10/2024, 10:19AM", 
      conductedBy: "", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44119814", 
      auditName: "Short Audit Process Report 1", 
      startDateTime: "17/10/2024, 10:26PM", 
      conductedBy: "", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44119808", 
      auditName: "Engineering Audit Checklist 2", 
      startDateTime: "17/10/2024, 07:50PM", 
      conductedBy: "Vinayak Mane", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44119803", 
      auditName: "Short Audit Process Report 1", 
      startDateTime: "17/10/2024, 06:07PM", 
      conductedBy: "", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44119800", 
      auditName: "Short Audit Process Report 1", 
      startDateTime: "17/10/2024, 05:19PM", 
      conductedBy: "", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44117794", 
      auditName: "Short Audit Process Report 1", 
      startDateTime: "17/10/2024, 03:58PM", 
      conductedBy: "", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    },
    { 
      report: null, 
      id: "44116014", 
      auditName: "Short Audit Process Report 1", 
      startDateTime: "16/10/2024, 04:07PM", 
      conductedBy: "", 
      status: "In Progress", 
      site: "Lockated", 
      duration: "", 
      percentage: "", 
      delete: true 
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Audits Conducted &gt; Audits Conducted List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">AUDITS CONDUCTED LIST</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Report</TableHead>
              <TableHead className="font-semibold text-gray-700">ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Audit Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Start Date & Time</TableHead>
              <TableHead className="font-semibold text-gray-700">Conducted By</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Site</TableHead>
              <TableHead className="font-semibold text-gray-700">Duration</TableHead>
              <TableHead className="font-semibold text-gray-700">%</TableHead>
              <TableHead className="font-semibold text-gray-700">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conductedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {item.report && (
                    <Printer className="w-4 h-4 text-blue-600 cursor-pointer" />
                  )}
                </TableCell>
                <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                <TableCell>{item.auditName}</TableCell>
                <TableCell>{item.startDateTime}</TableCell>
                <TableCell>{item.conductedBy}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.site}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>{item.percentage}</TableCell>
                <TableCell>
                  {/* Delete functionality can be added here */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
