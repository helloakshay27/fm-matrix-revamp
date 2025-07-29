// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Lock, MessageSquareHeart, AlertTriangle, FileText, Grid3X3, RotateCcw, Search, Eye, ChevronDown } from 'lucide-react';

// interface TicketTab {
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

// interface AssetAnalyticsTabProps {
//   asset: Asset;
// }
// export const TicketTab: React.FC<TicketTab> = ({ asset, assetId }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');

//   const statusCards = [
//     { count: 8, label: 'Open', icon: Lock },
//     { count: 4, label: 'Closed', icon: Lock },
//     { count: 8, label: 'Complaints', icon: MessageSquareHeart },
//     { count: 2, label: 'Suggestion', icon: AlertTriangle },
//     { count: 12, label: 'Requests', icon: FileText }
//   ];

//   const ticketData = [
//     {
//       id: '#1123',
//       title: 'Test Title',
//       description: 'Not Working',
//       priority: 'High',
//       createdBy: 'Amit J',
//       assignee: 'Rakesh K.',
//       status: 'Open',
//       attachments: 2
//     },
//     {
//       id: '#1123',
//       title: 'Test Title',
//       description: 'Not Working',
//       priority: 'High',
//       createdBy: 'Amit J',
//       assignee: 'Rakesh K.',
//       status: 'Open',
//       attachments: 2
//     },
//     {
//       id: '#1123',
//       title: 'Test Title',
//       description: 'Not Working',
//       priority: 'High',
//       createdBy: 'Amit J',
//       assignee: 'Rakesh K.',
//       status: 'Open',
//       attachments: 2
//     },
//     {
//       id: '#1123',
//       title: 'Test Title',
//       description: 'Not Working',
//       priority: 'High',
//       createdBy: 'Amit J',
//       assignee: 'Rakesh K.',
//       status: 'Closed',
//       attachments: 2
//     },
//     {
//       id: '#1123',
//       title: 'Test Title',
//       description: 'Not Working',
//       priority: 'High',
//       createdBy: 'Amit J',
//       assignee: 'Rakesh K.',
//       status: 'Closed',
//       attachments: 2
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Status Cards */}
//       <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//         {statusCards.map((card, index) => {
//           const IconComponent = card.icon;
//           return (
//             <div 
//               key={index} 
//               className="p-4 rounded-lg flex items-center gap-3"
//               style={{ backgroundColor: '#F6F4EE' }}
//             >
//               <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                 <IconComponent className="w-5 h-5" style={{ color: '#C72030' }} />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-black">
//                   {card.count.toString().padStart(2, '0')}
//                 </div>
//                 <div className="text-sm font-medium text-black">
//                   {card.label}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Filters and Search */}
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-32">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="All">All</SelectItem>
//               <SelectItem value="Open">Open</SelectItem>
//               <SelectItem value="Closed">Closed</SelectItem>
//               <SelectItem value="Complaints">Complaints</SelectItem>
//               <SelectItem value="Suggestion">Suggestion</SelectItem>
//               <SelectItem value="Requests">Requests</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex items-center gap-2 flex-wrap">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 w-64 min-w-[200px]"
//             />
//           </div>
//           <Button variant="outline" size="sm">
//             <RotateCcw className="w-4 h-4" />
//           </Button>
//           <Button variant="outline" size="sm">
//             <Grid3X3 className="w-4 h-4" />
//           </Button>
//           <Button variant="outline" size="sm">
//             <ChevronDown className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Ticket Table */}
//       <div className="bg-white rounded-lg border overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Title</TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead>Priority</TableHead>
//               <TableHead>Created By</TableHead>
//               <TableHead>Assignee</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Attachments</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {ticketData.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell className="font-medium">{item.id}</TableCell>
//                 <TableCell>{item.title}</TableCell>
//                 <TableCell>{item.description}</TableCell>
//                 <TableCell>{item.priority}</TableCell>
//                 <TableCell>{item.createdBy}</TableCell>
//                 <TableCell>{item.assignee}</TableCell>
//                 <TableCell>
//                   <div className={`px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1 ${
//                     item.status === 'Open' 
//                       ? 'bg-[#FF6B5A] text-white' 
//                       : 'bg-[#2DD4BF] text-white'
//                   }`}>
//                     {item.status}
//                     <ChevronDown className="w-3 h-3" />
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <span className="font-medium">{item.attachments}</span>
//                     <Eye className="w-4 h-4 text-gray-500" />
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Lock, MessageSquareHeart, AlertTriangle, FileText, Grid3X3, RotateCcw, Search, Eye, ChevronDown } from 'lucide-react';
// import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// interface TicketTabProps {
//   asset: Asset;
//   assetId?: string | number;
// }
// interface Asset {
//   id: number;
//   name: string;
// }

// interface Ticket {
//   id: number;
//   heading: string;
//   status: string;
//   updated_by: string;
//   category_type: string;
//   documents: any[];
//   created_at: string;
// }

// interface TicketCounts {
//   open: number;
//   closed: number;
//   pending: number;
//   complaints: number;
//   suggestions: number;
//   requests: number;
//   duplicate: number;
// }

// const statusMapping: Record<string, string> = {
//   Open: 'open',
//   Closed: 'closed',
//   Pending: 'pending',
//   ComplaintS: 'Complaint',
//   Suggestions: 'Suggestion',
//   Requests: 'Request',
//   Duplicate: 'Duplicate',
// };

// export const TicketTab: React.FC<TicketTabProps> = ({ assetId }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('pending');
//   const [ticketCounts, setTicketCounts] = useState<TicketCounts>({
//     open: 0,
//     closed: 0,
//     pending: 0,
//     complaints: 0,
//     suggestions: 0,
//     requests: 0,
//     duplicate: 0,
//   });
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [params, setParams] = useState('complaint_status_fixed_state_eq');

//   // Fetch tickets and counts from API
//   const fetchTickets = async (statusKey: string, params: any) => {
//     try {
//       const formattedDate = new Date().toLocaleDateString('en-GB').split('/').join('/');
//       const response = await axios.get(
//         `${API_CONFIG.BASE_URL}/pms/assets/${assetId}/tickets.json`,
//         {
//           params: {
//             id: assetId,
//             date: formattedDate,
//             [`q[${params}]`]: statusKey,
//           },
//           headers: {
//             Authorization: getAuthHeader(),
//           },
//         }
//       );
//       const data = response.data;

//       setTicketCounts({
//         open: data.open || 0,
//         closed: data.closed || 0,
//         pending: data.pending || 0,
//         complaints: data.complaints || 0,
//         suggestions: data.suggestions || 0,
//         requests: data.requests || 0,
//         duplicate: data.duplicate || 0,
//       });

//       setTickets(data.tickets || []);
//     } catch (error) {
//       console.error('Failed to fetch tickets', error);
//     }
//   };

//   useEffect(() => {
//     if (statusFilter === 'open') {
//       setParams('complaint_status_fixed_state_eq');
//     } else if (statusFilter === 'closed') {
//       setParams('complaint_status_fixed_state_eq');
//     } else if (statusFilter === 'pending') {
//       setParams('complaint_status_fixed_state_eq');
//     } else if (statusFilter === 'Complaint') {
//       setParams('complaint_type_eq');
//     } else if (statusFilter === 'Suggestion') {
//       setParams('complaint_type_eq');
//     } else if (statusFilter === 'Request') {
//       setParams('complaint_type_eq');
//     } else if (statusFilter === 'Duplicate') {
//       setParams('complaint_status_fixed_state_eq');
//     }
//     fetchTickets(statusFilter, params);
//   }, [statusFilter, assetId, params]);

//   const statusCards = [
//     { label: 'Open', icon: Lock },
//     { label: 'Closed', icon: Lock },
//     { label: 'Pending', icon: RotateCcw },
//     { label: 'Complaints', icon: MessageSquareHeart },
//     { label: 'Suggestion', icon: AlertTriangle },
//     { label: 'Requests', icon: FileText },
//     { label: 'Duplicate', icon: Grid3X3 },
//   ];

//   // Filter tickets by search term
//   const filteredTickets = tickets.filter(ticket =>
//     ticket.heading?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-6">
//       {/* Status Cards */}
//       <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//         {statusCards.map((card, index) => {
//           const IconComponent = card.icon;
//           const key = statusMapping[card.label];
//           const count = ticketCounts[key as keyof TicketCounts] || 0;

//           return (
//             <div
//               key={index}
//               className={`p-4 rounded-lg flex items-center gap-3 cursor-pointer ${statusFilter === key ? 'border-2 border-[#C72030]' : ''}`}
//               style={{ backgroundColor: '#F6F4EE' }}
//               onClick={() => setStatusFilter(key)}
//             >
//               <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                 <IconComponent className="w-5 h-5" style={{ color: '#C72030' }} />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-black">
//                   {count.toString().padStart(2, '0')}
//                 </div>
//                 <div className="text-sm font-medium text-black">
//                   {card.label}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Filters and Search */}
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-32">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             {Object.entries(statusMapping).map(([label, value]) => (
//               <SelectItem key={value} value={value}>{label}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <div className="flex items-center gap-2 flex-wrap">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 w-64 min-w-[200px]"
//             />
//           </div>
//           <Button variant="outline" size="sm">
//             <RotateCcw className="w-4 h-4" />
//           </Button>
//           <Button variant="outline" size="sm">
//             <Grid3X3 className="w-4 h-4" />
//           </Button>
//           <Button variant="outline" size="sm">
//             <ChevronDown className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Ticket Table */}
//       <div className="bg-white rounded-lg border overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Title</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Updated By</TableHead>
//               <TableHead>Created At</TableHead>
//               <TableHead>Attachments</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredTickets.map((item) => (
//               <TableRow key={item.id}>
//                 <TableCell className="font-medium">#{item.id}</TableCell>
//                 <TableCell>{item.heading}</TableCell>
//                 <TableCell>{item.category_type}</TableCell>
//                 <TableCell>
//                   <div className={`px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1 ${item.status === 'Open'
//                     ? 'bg-[#FF6B5A] text-white'
//                     : 'bg-[#2DD4BF] text-white'
//                     }`}>
//                     {item.status}
//                     <ChevronDown className="w-3 h-3" />
//                   </div>
//                 </TableCell>
//                 <TableCell>{item.updated_by}</TableCell>
//                 <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <span className="font-medium">{item.documents?.length || 0}</span>
//                     <Eye className="w-4 h-4 text-gray-500" />
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//             {filteredTickets.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center text-gray-500 py-4">
//                   No tickets found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Lock,
  MessageSquareHeart,
  AlertTriangle,
  FileText,
  Grid3X3,
  RotateCcw,
  Search,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

interface TicketTabProps {
  asset: Asset;
  assetId?: string | number;
}

interface Asset {
  id: number;
  name: string;
}

interface Ticket {
  id: number;
  heading: string;
  status: string;
  updated_by: string;
  category_type: string;
  documents: any[];
  created_at: string;
}

interface TicketCounts {
  open: number;
  closed: number;
  // pending: number;
  complaints: number;
  suggestions: number;
  requests: number;
  // duplicate: number;
}

const statusMapping: Record<string, string> = {
  Open: 'open',
  Closed: 'closed',
  // Pending: 'pending',
  Complaints: 'complaints',
  Suggestion: 'suggestions',
  Requests: 'requests',
  // Duplicate: 'duplicate',
};

export const TicketTab: React.FC<TicketTabProps> = ({ assetId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  const [ticketCounts, setTicketCounts] = useState<TicketCounts>({
    open: 0,
    closed: 0,
    // pending: 0,
    complaints: 0,
    suggestions: 0,
    requests: 0,
    // duplicate: 0,
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Fetch all counts on mount
  const fetchTicketCounts = async () => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/pms/assets/${assetId}/tickets.json`,
        {
          params: { id: assetId },
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      const data = response.data;
      setTicketCounts({
        open: data.open || 0,
        closed: data.closed || 0,
        // pending: data.pending || 0,
        complaints: data.complaints || 0,
        suggestions: data.suggestions || 0,
        requests: data.requests || 0,
        // duplicate: data.duplicate || 0,
      });
    } catch (err) {
      console.error('Failed to fetch ticket counts', err);
    }
  };

  // Fetch filtered tickets
  const fetchTickets = async (statusKey: string) => {
    try {
      const params: any = { id: assetId };

      if (['open', 'closed', 'pending', 'duplicate'].includes(statusKey)) {
        params['q[complaint_status_fixed_state_eq]'] = statusKey;
      } else if (['complaints', 'suggestions', 'requests'].includes(statusKey)) {
        params['q[complaint_type_eq]'] = statusKey.slice(0, -1); // complaint, suggestion, request
      }

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/pms/assets/${assetId}/tickets.json`,
        {
          params,
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    }
  };

  useEffect(() => {
    fetchTicketCounts();
    fetchTickets(statusFilter);
  }, [assetId]);

  useEffect(() => {
    fetchTickets(statusFilter);
  }, [statusFilter]);

  const statusCards = [
    { label: 'Open', icon: Lock },
    { label: 'Closed', icon: Lock },
    { label: 'Complaints', icon: MessageSquareHeart },
    { label: 'Suggestion', icon: AlertTriangle },
    { label: 'Requests', icon: FileText },
    // { label: 'Duplicate', icon: Grid3X3 },
  ];

  const filteredTickets = tickets.filter((ticket) =>
    ticket.heading?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          const key = statusMapping[card.label];
          const count = ticketCounts[key as keyof TicketCounts] || 0;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg flex items-center gap-3 cursor-pointer ${statusFilter === key ? 'border-2 border-[#C72030]' : ''
                }`}
              style={{ backgroundColor: '#F6F4EE' }}
              onClick={() => setStatusFilter(key)}
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5" style={{ color: '#C72030' }} />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {count.toString().padStart(2, '0')}
                </div>
                <div className="text-sm font-medium text-black">
                  {card.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusMapping).map(([label, value]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
            <RotateCcw className="w-4 h-4" />
          </Button> */}
          {/* <Button variant="outline" size="sm">
            <Grid3X3 className="w-4 h-4" />
          </Button> */}
          {/* <Button variant="outline" size="sm">
            <ChevronDown className="w-4 h-4" />
          </Button> */}
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Attachments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">#{item.id}</TableCell>
                <TableCell>{item.heading}</TableCell>
                <TableCell>{item.category_type}</TableCell>
                <TableCell>
                  <div
                    className={`px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1 ${item.status === 'Open'
                        ? 'bg-[#FF6B5A] text-white'
                        : 'bg-[#2DD4BF] text-white'
                      }`}
                  >
                    {item.status}
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </TableCell>
                <TableCell>{item.updated_by}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.documents?.length || 0}</span>
                    <Eye className="w-4 h-4 text-gray-500" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

