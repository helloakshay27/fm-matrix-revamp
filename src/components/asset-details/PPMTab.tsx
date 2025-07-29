// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Calendar, Lock, AlertTriangle, CheckCircle, Clock, Search, RotateCcw, Grid3X3, Download } from 'lucide-react';
// interface PPMTab {
//   asset: Asset;
//   assetId?: string | number;
// }
// interface Asset {
//   id: number;
//   name: string;
//   model_number: string;
//   serial_number: string;
//   purchase_cost: number;
//   purchased_on: string;
//   warranty: boolean;
//   warranty_expiry: string;
//   manufacturer: string;
//   asset_number: string;
//   asset_code: string;
//   group: string;
//   sub_group: string;
//   allocation_type: string;
//   depreciation_applicable: boolean;
//   depreciation_method: string;
//   useful_life: number;
//   salvage_value: number;
//   status: string;
//   current_book_value: number;
//   site_name: string;
//   commisioning_date: string;
//   vendor_name: string;
//   supplier_detail?: {
//     company_name: string;
//     email: string;
//     mobile1: string;
//   };
//   asset_loan_detail?: {
//     agrement_from_date: string;
//     agrement_to_date: string;
//     supplier: string;
//   };
//   depreciation_details?: {
//     period: string;
//     book_value_beginning: number;
//     depreciation: number;
//     book_value_end: number;
//   }[];
//   asset_amcs?: any[];
//   custom_fields?: any;
//   floor?: { name: string };
//   building?: { name: string };
//   wing?: { name: string };
//   area?: { name: string };
// }

// interface PPMTabProps {
//   asset: Asset;
// }
// export const PPMTab: React.FC<PPMTab> = ({ asset, assetId }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('Scheduled');
//   const statusCards = [{
//     count: 12,
//     label: 'Scheduled',
//     icon: Calendar
//   }, {
//     count: 8,
//     label: 'Open',
//     icon: Lock
//   }, {
//     count: 2,
//     label: 'In Progress',
//     icon: AlertTriangle
//   }, {
//     count: 4,
//     label: 'Closed',
//     icon: CheckCircle
//   }, {
//     count: 8,
//     label: 'Overdue',
//     icon: Clock
//   }];
//   const ppmData = [{
//     id: '11234',
//     checklist: 'Daily Test Assets Reading',
//     type: 'PPM',
//     schedule: '02/07/2021, 11:00am',
//     assignTo: 'Tech Team',
//     graceTime: '45 min',
//     duration: '01h : 20m : 35s',
//     status: 'Scheduled',
//     percentage: '0%'
//   }, {
//     id: '11234',
//     checklist: 'Daily Test Assets Reading',
//     type: 'PPM',
//     schedule: '02/07/2021, 11:00am',
//     assignTo: 'Tech Team',
//     graceTime: '45 min',
//     duration: '01h : 20m : 35s',
//     status: 'Scheduled',
//     percentage: '0%'
//   }, {
//     id: '11234',
//     checklist: 'Daily Test Assets Reading',
//     type: 'PPM',
//     schedule: '02/07/2021, 11:00am',
//     assignTo: 'Tech Team',
//     graceTime: '45 min',
//     duration: '01h : 20m : 35s',
//     status: 'Scheduled',
//     percentage: '0%'
//   }, {
//     id: '11234',
//     checklist: 'Daily Test Assets Reading',
//     type: 'PPM',
//     schedule: '02/07/2021, 11:00am',
//     assignTo: 'Tech Team',
//     graceTime: '45 min',
//     duration: '01h : 20m : 35s',
//     status: 'Scheduled',
//     percentage: '0%'
//   }, {
//     id: '11234',
//     checklist: 'Daily Test Assets Reading',
//     type: 'PPM',
//     schedule: '02/07/2021, 11:00am',
//     assignTo: 'Tech Team',
//     graceTime: '45 min',
//     duration: '01h : 20m : 35s',
//     status: 'Scheduled',
//     percentage: '0%'
//   }, {
//     id: '11234',
//     checklist: 'Daily Test Assets Reading',
//     type: 'PPM',
//     schedule: '02/07/2021, 11:00am',
//     assignTo: 'Tech Team',
//     graceTime: '45 min',
//     duration: '01h : 20m : 35s',
//     status: 'Scheduled',
//     percentage: '0%'
//   }, {
//     id: '11234',
//     checklist: 'Daily Test Assets Reading',
//     type: 'PPM',
//     schedule: '02/07/2021, 11:00am',
//     assignTo: 'Tech Team',
//     graceTime: '45 min',
//     duration: '01h : 20m : 35s',
//     status: 'Scheduled',
//     percentage: '0%'
//   }];
//   return <div className="space-y-6">
//       {/* Status Cards */}
//       <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//         {statusCards.map((card, index) => {
//         const IconComponent = card.icon;
//         return <div key={index} className="p-4 rounded-lg" style={{
//           backgroundColor: '#F6F4EE'
//         }}>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                   <IconComponent className="w-5 h-5" style={{
//                 color: '#C72030'
//               }} />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-black">{card.count.toString().padStart(2, '0')}</div>
//                   <div className="text-sm font-medium text-black">{card.label}</div>
//                 </div>
//               </div>
//             </div>;
//       })}
//       </div>

//       {/* Filters and Search */}
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-32">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Scheduled">Scheduled</SelectItem>
//               <SelectItem value="Open">Open</SelectItem>
//               <SelectItem value="In Progress">In Progress</SelectItem>
//               <SelectItem value="Closed">Closed</SelectItem>
//               <SelectItem value="Overdue">Overdue</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex items-center gap-2 flex-wrap">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64 min-w-[200px]" />
//           </div>
//           <Button variant="outline" size="sm">
//             <RotateCcw className="w-4 h-4" />
//           </Button>
//           <Button variant="outline" size="sm">
//             <Grid3X3 className="w-4 h-4" />
//           </Button>
//           <Button variant="outline" size="sm">
//             <Download className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>

//       {/* PPM Table */}
//       <div className="bg-white rounded-lg border overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Checklist</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Schedule</TableHead>
//               <TableHead>Assign To</TableHead>
//               <TableHead>Grace Time</TableHead>
//               <TableHead>Duration</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>%</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {ppmData.map((item, index) => <TableRow key={index}>
//                 <TableCell className="font-medium">{item.id}</TableCell>
//                 <TableCell>{item.checklist}</TableCell>
//                 <TableCell>{item.type}</TableCell>
//                 <TableCell>{item.schedule}</TableCell>
//                 <TableCell>{item.assignTo}</TableCell>
//                 <TableCell>{item.graceTime}</TableCell>
//                 <TableCell>{item.duration}</TableCell>
//                 <TableCell>
//                   <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1">
//                     {item.status}
//                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-700">
//                       <CheckCircle className="w-4 h-4 text-white" />
//                     </div>
//                     <span className="font-medium">{item.percentage}</span>
//                   </div>
//                 </TableCell>
//               </TableRow>)}
//           </TableBody>
//         </Table>
//       </div>
//     </div>;
// };
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  RotateCcw,
  Grid3X3,
  Download,
} from "lucide-react";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";

interface Asset {
  id: number;
  name: string;
  // ... (rest of your Asset definition)
}

interface Occurrence {
  id: number;
  checklist_name: string;
  type: string;
  schedule: string;
  assigned_to: string;
  task_status: string;
  grace_time: string;
  per: number;
}

interface PPMTabProps {
  asset: Asset;
  assetId?: string | number;
}

export const PPMTab: React.FC<PPMTabProps> = ({ assetId }) => {
  const [ppmData, setPpmData] = useState<Occurrence[]>([]);
  const [filteredData, setFilteredData] = useState<Occurrence[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Scheduled");
  const [loading, setLoading] = useState(false);

  const statusCards = [
    { label: "Scheduled", icon: Calendar },
    { label: "Open", icon: Lock },
    { label: "In Progress", icon: AlertTriangle },
    { label: "Closed", icon: CheckCircle },
    { label: "Overdue", icon: Clock },
  ];

  const fetchPPMData = async () => {
    if (!assetId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_CONFIG.BASE_URL}/pms/assets/${assetId}/occurrences.json`,
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      const occurrences: Occurrence[] = res.data.occurrences;
      setPpmData(occurrences);
    } catch (error) {
      console.error("Failed to fetch PPM data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPPMData();
  }, [assetId]);

  useEffect(() => {
    const filtered = ppmData.filter(
      (occ) =>
        occ.task_status === statusFilter &&
        (occ.checklist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          occ.schedule.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [ppmData, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusCards.map((card, index) => {
          const IconComponent = card.icon;
          const count = ppmData.filter(
            (item) => item.task_status === card.label
          ).length;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer ${
                statusFilter === card.label ? "ring-2 ring-red-600" : ""
              }`}
              style={{ backgroundColor: "#F6F4EE" }}
              onClick={() => setStatusFilter(card.label)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: "#C72030" }}
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">
                    {count.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm font-medium text-black">
                    {card.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
        {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusCards.map((card) => (
              <SelectItem key={card.label} value={card.label}>
                {card.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 min-w-[200px]"
            />
          </div>
          
          {/* <Button variant="outline" size="sm">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button> */}
        </div>
      </div>

      {/* PPM Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Checklist</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Assign To</TableHead>
              <TableHead>Grace Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.checklist_name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.schedule}</TableCell>
                  <TableCell>{item.assigned_to || "—"}</TableCell>
                  <TableCell>{item.grace_time}</TableCell>
                  <TableCell>
                    <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1">
                      {item.task_status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-700">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{item.per}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
