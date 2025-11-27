// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Plus, Eye, AlertTriangle, Clock, CheckCircle, XCircle, Download, Settings, Search, Filter as FilterIcon, PauseCircle, LifeBuoy } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import IncidentFilterModal from "@/components/IncidentFilterModal";
// import { incidentService, type Incident } from "@/services/incidentService";
// import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
// import { ColumnConfig } from "@/hooks/useEnhancedTable";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

// // Stats calculation
// const calculateStats = (incidents: any[]) => {
//   return {
//     total: incidents.length,
//     open: incidents.filter(i => i.current_status === "Open").length,
//     underObservation: incidents.filter(i => i.current_status === "Under Observation").length,
//     closed: incidents.filter(i => i.current_status === "Closed").length,
//     highRisk: incidents.filter(i => i.inc_level_name === "High Risk").length,
//     mediumRisk: incidents.filter(i => i.inc_level_name === "Medium Risk").length,
//     lowRisk: incidents.filter(i => i.inc_level_name === "Low Risks").length,
//   };
// };

// const getLevelColor = (level: string) => {
//   switch (level) {
//     case "High Risk": return "bg-red-100 text-red-800";
//     case "Medium Risk": return "bg-yellow-100 text-yellow-800";
//     case "Low Risk": return "bg-green-100 text-green-800";
//     default: return "bg-gray-100 text-gray-800";
//   }
// };

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "Open": return "bg-blue-100 text-blue-800";
//     case "Under Observation": return "bg-yellow-100 text-yellow-800";
//     case "Closed": return "bg-green-100 text-green-800";
//     default: return "bg-gray-100 text-gray-800";
//   }
// };

// export const IncidentDashboard = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
//   const [incidents, setIncidents] = useState<Incident[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [originalIncidents, setOriginalIncidents] = useState<Incident[]>([]);
//   const [countStats, setCountStats] = useState<{ total_incidents: number; open: number; under_investigation: number; closed: number; pending: number; support_required: number } | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   // Define columns for the EnhancedTable
//   const columns: ColumnConfig[] = [
//     {
//       key: "srNo",
//       label: "Sr. No.",
//       sortable: false,
//       defaultVisible: true,
//       draggable: false,
//     },
//     {
//       key: "id",
//       label: "ID",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "description",
//       label: "Description",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "region",
//       label: "Region",
//       sortable: false,
//       defaultVisible: false,
//       draggable: true,
//     },
//     {
//       key: "site_name",
//       label: "Site",
//       sortable: true,
//       defaultVisible: true,
//       draggable: false, // Make it non-draggable to test
//     },
//     {
//       key: "test_site",
//       label: "Test Site",
//       sortable: false,
//       defaultVisible: true,
//       draggable: false,
//     },
//     {
//       key: "building_name",
//       label: "Tower",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "inc_time",
//       label: "Incident Time",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "inc_level_name",
//       label: " Incident Level",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "category_name",
//       label: "Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sub_category_name",
//       label: "Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sub_sub_category_name",
//       label: "Sub Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sub_sub_sub_category_name",
//       label: "Sub Sub Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sec_category_name",
//       label: "Secondary Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sec_sub_category_name",
//       label: "Secondary Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sec_sub_sub_category_name",
//       label: "Secondary Sub Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sec_sub_sub_sub_category_name",
//       label: "Secondary Sub Sub Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "support_required",
//       label: "Support Required",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "assigned_to_user_name",
//       label: "Assigned To",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "current_status",
//       label: "Status",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//   ];

//   // Debug: Log columns configuration
//   console.log("Columns configuration:", columns);

//   useEffect(() => {
//     // Clear old table settings to force refresh
//     localStorage.removeItem('incidents-table');
//     localStorage.removeItem('incidents-table-columns');
//     localStorage.removeItem('incidents-table-visibility');

//     fetchIncidents(currentPage);
//     fetchCounts();
//   }, [currentPage]);

//   const fetchIncidents = async (page: number = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const query = `page=${page}`;
//       const response = await incidentService.getIncidents(query);
//       console.log("API Response - First incident:", response.data.incidents[0]); // Debug log
//       setIncidents(response.data.incidents);
//       setOriginalIncidents(response.data.incidents);
//       if (response.data.pagination) {
//         setCurrentPage(response.data.pagination.current_page || 1);
//         setTotalPages(response.data.pagination.total_pages || 1);
//         setTotalCount(response.data.pagination.total_count || 0);
//       } else {
//         setTotalPages(1);
//         setTotalCount(response.data.total || response.data.incidents.length || 0);
//       }
//     } catch (err) {
//       setError("Failed to fetch incidents");
//       console.error("Error fetching incidents:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCounts = async () => {
//     try {
//       const counts = await incidentService.getIncidentCounts();
//       setCountStats(counts);
//     } catch (err) {
//       console.error('Failed to fetch incident counts:', err);
//     }
//   };

//   // Render cell function for custom formatting
//   const renderCell = (item: Incident, columnKey: string): React.ReactNode => {
//     const index = incidents.findIndex(incident => incident.id === item.id);

//     switch (columnKey) {
//       case "srNo":
//         return <span className="font-medium">{index + 1}</span>;
//       case "id":
//         return <span className="font-medium">{item.id}</span>;
//       case "description":
//         return <div className="w-[15rem] overflow-hidden text-ellipsis text-center">{item.description}</div>;
//       case "site_name":
//         console.log("Rendering site_name:", item.site_name, "building_name:", item.building_name);
//         return <span>{item.site_name || item.building_name || "-"}</span>;
//       case "test_site":
//         return <span style={{ color: 'red', fontWeight: 'bold' }}>TEST SITE</span>;
//       case "region":
//         return <span>-</span>;
//       case "building_name":
//         return <span>{item.building_name || "-"}</span>;
//       case "inc_time":
//         return (
//           <span>
//             {item.inc_time ? new Date(item.inc_time).toLocaleString() : "-"}
//           </span>
//         );
//       case "inc_level_name":
//         return (
//           <Badge className={getLevelColor(item.inc_level_name)}>
//             {item.inc_level_name}
//           </Badge>
//         );
//       case "category_name":
//         return <span>{item.category_name || "-"}</span>;
//       case "sub_category_name":
//         return <span>{item.sub_category_name || "-"}</span>;
//       case "sub_sub_category_name":
//         return <span>{item.sub_sub_category_name || "-"}</span>;
//       case "sub_sub_sub_category_name":
//         return <span>{item.sub_sub_sub_category_name || "-"}</span>;
//       case "sec_category_name":
//         return <span>{item.sec_category_name || "-"}</span>;
//       case "sec_sub_category_name":
//         return <span>{item.sec_sub_category_name || "-"}</span>;
//       case "sec_sub_sub_category_name":
//         return <span>{item.sec_sub_sub_category_name || "-"}</span>;
//       case "sec_sub_sub_sub_category_name":
//         return <span>{item.sec_sub_sub_sub_category_name || "-"}</span>;
//       case "support_required":
//         return (
//           <Badge className={item.support_required ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
//             {item.support_required ? "Yes" : "No"}
//           </Badge>
//         );
//       case "assigned_to_user_name":
//         return <span>{item.assigned_to_user_name || "-"}</span>;
//       case "current_status":
//         return (
//           <Badge className={getStatusColor(item.current_status)}>
//             {item.current_status}
//           </Badge>
//         );
//       default:
//         const value = item[columnKey as keyof Incident];
//         if (value === null || value === undefined) {
//           return <span>-</span>;
//         }
//         return <span>{String(value)}</span>;
//     }
//   };

//   // Render actions function
//   const renderActions = (item: Incident): React.ReactNode => {
//     return (
//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={() => handleViewIncident(item.id.toString())}
//         title="View Incident"
//       >
//         <Eye className="w-4 h-4" />
//       </Button>
//     );
//   };

//   const stats = calculateStats(incidents);

//   // Prefer API counts if available for analytics
//   const totalForAnalytics = countStats ? countStats.total_incidents : stats.total;
//   const openCount = countStats ? countStats.open : stats.open;
//   const underInvestigationCount = countStats ? countStats.under_investigation : stats.underObservation;
//   const closedCount = countStats ? countStats.closed : stats.closed;
//   const pendingCount = countStats ? countStats.pending : 0;
//   const supportRequiredCount = countStats ? countStats.support_required : 0;

//   const handleAddIncident = () => {
//     navigate("/safety/incident/add");
//   };

//   const handleCardClick = async (type: 'total' | 'open' | 'closed' | 'pending' | 'under_investigation' | 'support_required') => {
//     try {
//       setLoading(true);
//       setError(null);
//       let query = '';
//       if (type === 'open') query = 'q[current_status_eq]=Open';
//       else if (type === 'closed') query = 'q[current_status_eq]=Closed';
//       else if (type === 'pending') query = 'q[current_status_eq]=Pending';
//       else if (type === 'under_investigation') query = 'q[current_status_eq]=Under%20Investigation';
//       else if (type === 'support_required') query = 'q[current_status_eq]=Support%20Required';
//       // total => no query

//       const response = await incidentService.getIncidents(query);
//       setIncidents(response.data.incidents);
//       setOriginalIncidents(response.data.incidents);
//     } catch (err) {
//       setError('Failed to fetch incidents');
//       console.error('Error fetching incidents by card:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewIncident = (incidentId: string) => {
//     navigate(`/safety/incident/${incidentId}`);
//   };

//   // Handle export functionality
//   const handleExport = async () => {
//     try {
//       // Create CSV content
//       const headers = columns
//         .filter(col => col.defaultVisible !== false)
//         .map(col => col.label)
//         .join(',');

//       const csvContent = [
//         headers,
//         ...incidents.map(incident =>
//           columns
//             .filter(col => col.defaultVisible !== false)
//             .map(col => {
//               let value = '';
//               switch (col.key) {
//                 case 'srNo':
//                   value = String(incidents.findIndex(inc => inc.id === incident.id) + 1);
//                   break;
//                 case 'inc_time':
//                   value = incident.inc_time ? new Date(incident.inc_time).toLocaleString() : '-';
//                   break;
//                 case 'support_required':
//                   value = incident.support_required ? 'Yes' : 'No';
//                   break;
//                 case 'site_name':
//                   value = incident.site_name || incident.building_name || '-';
//                   break;
//                 default:
//                   const fieldValue = incident[col.key as keyof Incident];
//                   value = String(fieldValue || '-');
//               }

//               // Handle values that might contain commas or quotes
//               const stringValue = String(value).replace(/"/g, '""');
//               return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
//                 ? `"${stringValue}"`
//                 : stringValue;
//             })
//             .join(',')
//         )
//       ].join('\n');

//       // Create and trigger download
//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error exporting incidents:', error);
//       alert('Failed to export incidents');
//     }
//   };

//   const StatCard = ({ icon, label, value, color }: any) => (
//     <div className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 hover:shadow-lg transition-shadow">
//       <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
//         {React.cloneElement(icon, { className: `w-6 h-6 text-[#C72030]` })}
//       </div>
//       <div>
//         <div className="text-2xl font-semibold text-[#1A1A1A]">{value}</div>
//         <div className="text-sm font-medium text-[#1A1A1A]">{label}</div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 sm:p-6">
//       <Tabs defaultValue="list" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
//           <TabsTrigger
//             value="list"
//             className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
//           >
//             <AlertTriangle className="w-4 h-4" />
//             List
//           </TabsTrigger>
//           <TabsTrigger
//             value="analytics"
//             className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
//           >
//             <Settings className="w-4 h-4" />
//             Analytics
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="list" className="mt-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
//             <div onClick={() => handleCardClick('total')} className="cursor-pointer">
//               <StatCard icon={<AlertTriangle />} label="Total Incidents" value={countStats ? countStats.total_incidents : stats.total} />
//             </div>
//             <div onClick={() => handleCardClick('open')} className="cursor-pointer">
//               <StatCard icon={<Clock />} label="Open" value={countStats ? countStats.open : stats.open} />
//             </div>
//             <div onClick={() => handleCardClick('under_investigation')} className="cursor-pointer">
//               <StatCard icon={<Search />} label="Under Investigation" value={countStats ? countStats.under_investigation : stats.underObservation} />
//             </div>
//             <div onClick={() => handleCardClick('closed')} className="cursor-pointer">
//               <StatCard icon={<CheckCircle />} label="Closed" value={countStats ? countStats.closed : stats.closed} />
//             </div>
//             <div onClick={() => handleCardClick('pending')} className="cursor-pointer">
//               <StatCard icon={<PauseCircle />} label="Pending" value={countStats ? countStats.pending : 0} />
//             </div>
//             <div onClick={() => handleCardClick('support_required')} className="cursor-pointer">
//               <StatCard icon={<LifeBuoy />} label="Support Required" value={countStats ? countStats.support_required : 0} />
//             </div>
//             {/* <StatCard icon={<XCircle />} label="High Risk" value={stats.highRisk} />
//             <StatCard icon={<AlertTriangle />} label="Medium Risk" value={stats.mediumRisk} />
//             <StatCard icon={<CheckCircle />} label="Low Risk" value={stats.lowRisk} /> */}
//           </div>

//           {/* Enhanced Table */}
//           <EnhancedTable
//             data={incidents}
//             columns={columns}
//             renderCell={renderCell}
//             renderActions={renderActions}
//             onRowClick={(item) => handleViewIncident(item.id.toString())}
//             loading={loading}
//             emptyMessage={error ? error : "No incidents found"}
//             enableSearch={true}
//             searchPlaceholder="Search incidents..."
//             enableExport={true}
//             onExport={handleExport}
//             exportFileName="incidents"
//             storageKey="incidents-dashboard-new"
//             className="min-w-full"
//             pagination={false}
//             leftActions={
//               <div className="flex items-center gap-2">
//                 <Button
//                   onClick={handleAddIncident}
//                   className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Incident
//                 </Button>
//               </div>
//             }
//             onFilterClick={() => setIsFilterModalOpen(true)}
//           />

//           {/* API-driven Pagination (same as AssetDashboard) */}
//           <div className="mt-6">
//             <Pagination>
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     onClick={() => {
//                       if (currentPage > 1) {
//                         setCurrentPage(currentPage - 1);
//                       }
//                     }}
//                     className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
//                   />
//                 </PaginationItem>

//                 <PaginationItem>
//                   <PaginationLink
//                     onClick={() => setCurrentPage(1)}
//                     isActive={currentPage === 1}
//                   >
//                     1
//                   </PaginationLink>
//                 </PaginationItem>

//                 {currentPage > 4 && (
//                   <PaginationItem>
//                     <PaginationEllipsis />
//                   </PaginationItem>
//                 )}

//                 {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
//                   .filter((page) => page > 1 && page < totalPages)
//                   .map((page) => (
//                     <PaginationItem key={page}>
//                       <PaginationLink
//                         onClick={() => setCurrentPage(page)}
//                         isActive={currentPage === page}
//                       >
//                         {page}
//                       </PaginationLink>
//                     </PaginationItem>
//                   ))}

//                 {currentPage < totalPages - 3 && (
//                   <PaginationItem>
//                     <PaginationEllipsis />
//                   </PaginationItem>
//                 )}

//                 {totalPages > 1 && (
//                   <PaginationItem>
//                     <PaginationLink
//                       onClick={() => setCurrentPage(totalPages)}
//                       isActive={currentPage === totalPages}
//                     >
//                       {totalPages}
//                     </PaginationLink>
//                   </PaginationItem>
//                 )}

//                 <PaginationItem>
//                   <PaginationNext
//                     onClick={() => {
//                       if (currentPage < totalPages) {
//                         setCurrentPage(currentPage + 1);
//                       }
//                     }}
//                     className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>

//             <div className="text-center mt-2 text-sm text-gray-600">
//               Showing page {currentPage} of {totalPages} ({totalCount} total incidents)
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="analytics" className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-4">Incident Status Distribution</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>Open: {openCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((openCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Under Investigation: {underInvestigationCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((underInvestigationCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Closed: {closedCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((closedCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Pending: {pendingCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((pendingCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Support Required: {supportRequiredCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((supportRequiredCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-4">Risk Level Distribution</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>High Risk: {stats.highRisk}</span>
//                   <span>{totalForAnalytics > 0 ? ((stats.highRisk / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Medium Risk: {stats.mediumRisk}</span>
//                   <span>{totalForAnalytics > 0 ? ((stats.mediumRisk / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Low Risk: {stats.lowRisk}</span>
//                   <span>{totalForAnalytics > 0 ? ((stats.lowRisk / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//       <IncidentFilterModal
//         isOpen={isFilterModalOpen}
//         onClose={() => setIsFilterModalOpen(false)}
//         incidents={originalIncidents}
//         onApply={(filtered) => setIncidents(filtered)}
//         onReset={() => setIncidents(originalIncidents)}
//       />
//     </div>
//   );
// };

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Plus, Eye, AlertTriangle, Clock, CheckCircle, XCircle, Download, Settings, Search, Filter as FilterIcon, PauseCircle, LifeBuoy } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import IncidentFilterModal from "@/components/IncidentFilterModal";
// import { incidentService, type Incident } from "@/services/incidentService";
// import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
// import { ColumnConfig } from "@/hooks/useEnhancedTable";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

// // Stats calculation
// const calculateStats = (incidents: any[]) => {
//   return {
//     total: incidents.length,
//     open: incidents.filter(i => i.current_status === "Open").length,
//     underObservation: incidents.filter(i => i.current_status === "Under Observation").length,
//     closed: incidents.filter(i => i.current_status === "Closed").length,
//     highRisk: incidents.filter(i => i.inc_level_name === "High Risk").length,
//     mediumRisk: incidents.filter(i => i.inc_level_name === "Medium Risk").length,
//     lowRisk: incidents.filter(i => i.inc_level_name === "Low Risks").length,
//   };
// };

// const getLevelColor = (level: string) => {
//   switch (level) {
//     case "High Risk": return "bg-red-100 text-red-800";
//     case "Medium Risk": return "bg-yellow-100 text-yellow-800";
//     case "Low Risk": return "bg-green-100 text-green-800";
//     default: return "bg-gray-100 text-gray-800";
//   }
// };

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "Open": return "bg-blue-100 text-blue-800";
//     case "Under Observation": return "bg-yellow-100 text-yellow-800";
//     case "Closed": return "bg-green-100 text-green-800";
//     default: return "bg-gray-100 text-gray-800";
//   }
// };

// export const IncidentDashboard = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
//   const [incidents, setIncidents] = useState<Incident[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [originalIncidents, setOriginalIncidents] = useState<Incident[]>([]);
//   const [countStats, setCountStats] = useState<{ total_incidents: number; open: number; under_investigation: number; closed: number; pending: number; support_required: number } | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);


//   // Define columns for the EnhancedTable
//   const columns: ColumnConfig[] = [
//     {
//       key: "srNo",
//       label: "Sr. No.",
//       sortable: false,
//       defaultVisible: true,
//       draggable: false,
//     },
//     {
//       key: "id",
//       label: "ID",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "description",
//       label: "Description",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     // {
//     //   key: "region",
//     //   label: "Region",
//     //   sortable: false,
//     //   defaultVisible: false,
//     //   draggable: true,
//     // },
//     {
//       key: "site_name",
//       label: "Site",
//       sortable: true,
//       defaultVisible: true,
//       draggable: false, // Make it non-draggable to test
//     },
//     // {
//     //   key: "test_site",
//     //   label: "Test Site",
//     //   sortable: false,
//     //   defaultVisible: true,
//     //   draggable: false,
//     // },
//     {
//       key: "building_name",
//       label: "Building",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "inc_time",
//       label: "Incident Time",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "inc_level_name",
//       label: " Incident Level",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "category_name",
//       label: "Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sub_category_name",
//       label: "Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sub_sub_category_name",
//       label: "Sub Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sub_sub_sub_category_name",
//       label: "Sub Sub Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sec_category_name",
//       label: "Secondary Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sec_sub_category_name",
//       label: "Secondary Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sec_sub_sub_category_name",
//       label: "Secondary Sub Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//     {
//       key: "sec_sub_sub_sub_category_name",
//       label: "Secondary Sub Sub Sub Category",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },


//     {
//       key: "current_status",
//       label: "Status",
//       sortable: true,
//       defaultVisible: true,
//       draggable: true,
//     },
//   ];

//   // Debug: Log columns configuration
//   console.log("Columns configuration:", columns);

//   useEffect(() => {
//     // Clear old table settings to force refresh
//     localStorage.removeItem('incidents-table');
//     localStorage.removeItem('incidents-table-columns');
//     localStorage.removeItem('incidents-table-visibility');

//     fetchIncidents(currentPage);
//     fetchCounts();
//   }, [currentPage]);

//   const fetchIncidents = async (page: number = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const query = `page=${page}`;
//       const response = await incidentService.getIncidents(query);

//       // Extract data based on provided API response structure
//       const incidentsArr = response.data?.incidents || [];
//       setIncidents(incidentsArr);
//       setOriginalIncidents(incidentsArr);

//       // Extract pagination data
//       const pagination = response.pagination || {};
//       setCurrentPage(pagination.current_page || 1);
//       setTotalPages(pagination.total_pages || 1);
//       setTotalCount(pagination.total_count || incidentsArr.length || 0);
//     } catch (err) {
//       setError("Failed to fetch incidents");
//       console.error("Error fetching incidents:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCounts = async () => {
//     try {
//       const counts = await incidentService.getIncidentCounts();
//       setCountStats(counts);
//     } catch (err) {
//       console.error('Failed to fetch incident counts:', err);
//     }
//   };

//   // Calculate page size for Sr. No. calculation
//   // const pageSize = incidents.length > 0 && totalPages > 0 ? Math.ceil(totalCount / totalPages) : incidents.length;

//   // Render cell function for custom formatting
//   const renderCell = (item: Incident, columnKey: string): React.ReactNode => {
//     const index = incidents.findIndex(incident => incident.id === item.id);

//     switch (columnKey) {
//       case "srNo":
//         // Continuous Sr. No. across pages
//         return <span className="font-medium">{(currentPage - 1) * 20 + index + 1}</span>;
//       case "id":
//         return <span className="font-medium">{item.id}</span>;
//       case "description":
//         return <div className="w-[15rem] overflow-hidden text-ellipsis text-center">{item.description}</div>;
//       case "site_name":
//         console.log("Rendering site_name:", item.site_name, "building_name:", item.building_name);
//         return <span>{item.site_name || item.building_name || "-"}</span>;
//       case "test_site":
//         return <span style={{ color: 'red', fontWeight: 'bold' }}>TEST SITE</span>;
//       case "region":
//         return <span>-</span>;
//       case "building_name":
//         return <span>{item.building_name || "-"}</span>;
//       case "inc_time":
//         return (
//           <span>
//             {item.inc_time ? new Date(item.inc_time).toLocaleString() : "-"}
//           </span>
//         );
//       case "inc_level_name":
//         return (
//           <Badge className={getLevelColor(item.inc_level_name)}>
//             {item.inc_level_name}
//           </Badge>
//         );
//       case "category_name":
//         return <span>{item.category_name || "-"}</span>;
//       case "sub_category_name":
//         return <span>{item.sub_category_name || "-"}</span>;
//       case "sub_sub_category_name":
//         return <span>{item.sub_sub_category_name || "-"}</span>;
//       case "sub_sub_sub_category_name":
//         return <span>{item.sub_sub_sub_category_name || "-"}</span>;
//       case "sec_category_name":
//         return <span>{item.sec_category_name || "-"}</span>;
//       case "sec_sub_category_name":
//         return <span>{item.sec_sub_category_name || "-"}</span>;
//       case "sec_sub_sub_category_name":
//         return <span>{item.sec_sub_sub_category_name || "-"}</span>;
//       case "sec_sub_sub_sub_category_name":
//         return <span>{item.sec_sub_sub_sub_category_name || "-"}</span>;
//       case "support_required":
//         return (
//           <Badge className={item.support_required ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
//             {item.support_required ? "Yes" : "No"}
//           </Badge>
//         );
//       case "assigned_to_user_name":
//         return <span>{item.assigned_to_user_name || "-"}</span>;
//       case "current_status":
//         return (
//           <Badge className={getStatusColor(item.current_status)}>
//             {item.current_status}
//           </Badge>
//         );
//       default:
//         const value = item[columnKey as keyof Incident];
//         if (value === null || value === undefined) {
//           return <span>-</span>;
//         }
//         return <span>{String(value)}</span>;
//     }
//   };

//   // Render actions function
//   const renderActions = (item: Incident): React.ReactNode => {
//     return (
//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={() => handleViewIncident(item.id.toString())}
//         title="View Incident"
//       >
//         <Eye className="w-4 h-4" />
//       </Button>
//     );
//   };

//   const stats = calculateStats(incidents);

//   // Prefer API counts if available for analytics
//   const totalForAnalytics = countStats ? countStats.total_incidents : stats.total;
//   const openCount = countStats ? countStats.open : stats.open;
//   const underInvestigationCount = countStats ? countStats.under_investigation : stats.underObservation;
//   const closedCount = countStats ? countStats.closed : stats.closed;
//   const pendingCount = countStats ? countStats.pending : 0;
//   const supportRequiredCount = countStats ? countStats.support_required : 0;

//   const handleAddIncident = () => {
//     navigate("/safety/incident/add");
//   };

//   const handleCardClick = async (type: 'total' | 'open' | 'closed' | 'pending' | 'under_investigation' | 'support_required') => {
//     try {
//       setLoading(true);
//       setError(null);
//       let query = `page=1`; // Reset to page 1 for filtered results
//       if (type === 'open') query += '&q[current_status_eq]=Open';
//       else if (type === 'closed') query += '&q[current_status_eq]=Closed';
//       else if (type === 'pending') query += '&q[current_status_eq]=Pending';
//       else if (type === 'under_investigation') query += '&q[current_status_eq]=Under%20Investigation';
//       else if (type === 'support_required') query += '&q[current_status_eq]=Support%20Required';

//       const response = await incidentService.getIncidents(query);
//       const incidentsArr = response.data?.incidents || [];
//       setIncidents(incidentsArr);
//       setOriginalIncidents(incidentsArr);
//       setCurrentPage(1); // Reset to first page
//       const pagination = response.pagination || {};
//       setTotalPages(pagination.total_pages || 1);
//       setTotalCount(pagination.total_count || incidentsArr.length || 0);
//     } catch (err) {
//       setError('Failed to fetch incidents');
//       console.error('Error fetching incidents by card:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewIncident = (incidentId: string) => {
//     navigate(`/safety/incident/${incidentId}`);
//   };

//   // Handle export functionality using API
//   // const handleExport = async () => {
//   //   try {

//   //     const baseUrl = localStorage.getItem('baseUrl') || '';
//   //     const token = localStorage.getItem('token') || '';
//   //     if (!baseUrl || !token) {
//   //       alert('API base URL or token not found in localStorage.');
//   //       return;
//   //     }


//   //     const exportUrl = `${baseUrl}/pms/incidents/export.json`;


//   //     const response = await fetch(exportUrl, {
//   //       method: 'GET',
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`,
//   //       },
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error('Failed to export incidents');
//   //     }


//   //     let filename = `incidents_${new Date().toISOString().split('T')[0]}.csv`;
//   //     const disposition = response.headers.get('Content-Disposition');
//   //     if (disposition && disposition.includes('filename=')) {
//   //       const match = disposition.match(/filename="?([^";]+)"?/);
//   //       if (match && match[1]) filename = match[1];
//   //     }

//   //     const blob = await response.blob();
//   //     const url = window.URL.createObjectURL(blob);
//   //     const link = document.createElement('a');
//   //     link.href = url;
//   //     link.setAttribute('download', filename);
//   //     document.body.appendChild(link);
//   //     link.click();
//   //     document.body.removeChild(link);
//   //     window.URL.revokeObjectURL(url);
//   //   } catch (error) {
//   //     console.error('Error exporting incidents:', error);
//   //     alert('Failed to export incidents');
//   //   }
//   // };
//   // Handle export functionality using API
//   const handleExport = async () => {
//     try {
//       const baseUrl = localStorage.getItem("baseUrl") || "";
//       const token = localStorage.getItem("token") || "";
//       if (!baseUrl || !token) {
//         alert("API base URL or token not found in localStorage.");
//         return;
//       }

//       const exportUrl = `https://${baseUrl}/pms/incidents/export.xlsx`;

//       const response = await fetch(exportUrl, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to export incidents");
//       }

//       let filename = `incidents_${new Date().toISOString().split("T")[0]}.xlsx`;
//       const disposition = response.headers.get("Content-Disposition");
//       if (disposition && disposition.includes("filename=")) {
//         const match = disposition.match(/filename="?([^";]+)"?/);
//         if (match && match[1]) filename = match[1];
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error exporting incidents:", error);
//       alert("Failed to export incidents");
//     }
//   };



//   const StatCard = ({ icon, label, value, color }: any) => (
//     <div className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 hover:shadow-lg transition-shadow">
//       <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
//         {React.cloneElement(icon, { className: `w-6 h-6 text-[#C72030]` })}
//       </div>
//       <div>
//         <div className="text-2xl font-semibold text-[#1A1A1A]">{value}</div>
//         <div className="text-sm font-medium text-[#1A1A1A]">{label}</div>
//       </div>
//     </div>
//   );

//   // Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const maxPagesToShow = 3; // Show up to 3 page numbers around current page
//     const pages: (number | string)[] = [];

//     if (totalPages <= 5) {
//       // Show all pages if total pages are 5 or fewer
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // Always show first page
//       pages.push(1);

//       // Calculate start and end page for the middle range
//       let startPage = Math.max(2, currentPage - 1);
//       let endPage = Math.min(totalPages - 1, currentPage + 1);

//       // Adjust start and end to ensure 3 pages are shown if possible
//       if (endPage - startPage < 2) {
//         if (currentPage <= 3) {
//           endPage = Math.min(4, totalPages - 1);
//         } else if (currentPage >= totalPages - 2) {
//           startPage = Math.max(totalPages - 3, 2);
//         }
//       }

//       // Add ellipsis after first page if needed
//       if (startPage > 2) {
//         pages.push('...');
//       }

//       // Add middle pages
//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }

//       // Add ellipsis before last page if needed
//       if (endPage < totalPages - 1) {
//         pages.push('...');
//       }

//       // Always show last page if more than one page
//       if (totalPages > 1) {
//         pages.push(totalPages);
//       }
//     }

//     return pages;
//   };

//   return (
//     <div className="p-4 sm:p-6">
//       <Tabs defaultValue="list" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
//           <TabsTrigger
//             value="list"
//             className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
//           >
//             <AlertTriangle className="w-4 h-4" />
//             List
//           </TabsTrigger>
//           <TabsTrigger
//             value="analytics"
//             className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
//           >
//             <Settings className="w-4 h-4" />
//             Analytics
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="list" className="mt-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
//             <div onClick={() => handleCardClick('total')} className="cursor-pointer">
//               <StatCard icon={<AlertTriangle />} label="Total Incidents" value={countStats ? countStats.total_incidents : stats.total} />
//             </div>
//             <div onClick={() => handleCardClick('open')} className="cursor-pointer">
//               <StatCard icon={<Clock />} label="Open" value={countStats ? countStats.open : stats.open} />
//             </div>
//             <div onClick={() => handleCardClick('under_investigation')} className="cursor-pointer">
//               <StatCard icon={<Search />} label="Under Investigation" value={countStats ? countStats.under_investigation : stats.underObservation} />
//             </div>
//             <div onClick={() => handleCardClick('closed')} className="cursor-pointer">
//               <StatCard icon={<CheckCircle />} label="Closed" value={countStats ? countStats.closed : stats.closed} />
//             </div>
//             <div onClick={() => handleCardClick('pending')} className="cursor-pointer">
//               <StatCard icon={<PauseCircle />} label="Pending" value={countStats ? countStats.pending : 0} />
//             </div>
//             <div onClick={() => handleCardClick('support_required')} className="cursor-pointer">
//               <StatCard icon={<LifeBuoy />} label="Support Required" value={countStats ? countStats.support_required : 0} />
//             </div>
//             {/* <StatCard icon={<XCircle />} label="High Risk" value={stats.highRisk} />
//             <StatCard icon={<AlertTriangle />} label="Medium Risk" value={stats.mediumRisk} />
//             <StatCard icon={<CheckCircle />} label="Low Risk" value={stats.lowRisk} /> */}
//           </div>

//           {/* Enhanced Table */}
//           <EnhancedTable
//             data={incidents}
//             columns={columns}
//             renderCell={renderCell}
//             renderActions={renderActions}
//             onRowClick={(item) => handleViewIncident(item.id.toString())}
//             loading={loading}
//             emptyMessage={error ? error : "No incidents found"}
//             enableSearch={true}
//             searchPlaceholder="Search incidents..."
//             enableExport={true}
//             handleExport={handleExport}
//             exportFileName="incidents"
//             storageKey="incidents-dashboard-new"
//             className="min-w-full"
//             pagination={false}
//             leftActions={
//               <div className="flex items-center gap-2">
//                 <Button
//                   onClick={handleAddIncident}
//                   className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Incident
//                 </Button>
//               </div>
//             }
//             onFilterClick={() => setIsFilterModalOpen(true)}
//           />

//           {/* Updated Pagination */}
//           {totalPages > 0 && (
//             <div className="mt-6">
//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={() => {
//                         if (currentPage > 1) {
//                           setCurrentPage(currentPage - 1);
//                         }
//                       }}
//                       className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
//                     />
//                   </PaginationItem>

//                   {getPageNumbers().map((page, index) => (
//                     <PaginationItem key={index}>
//                       {page === '...' ? (
//                         <PaginationEllipsis />
//                       ) : (
//                         <PaginationLink
//                           onClick={() => setCurrentPage(Number(page))}
//                           isActive={currentPage === Number(page)}
//                         >
//                           {page}
//                         </PaginationLink>
//                       )}
//                     </PaginationItem>
//                   ))}

//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={() => {
//                         if (currentPage < totalPages) {
//                           setCurrentPage(currentPage + 1);
//                         }
//                       }}
//                       className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>

//               <div className="text-center mt-2 text-sm text-gray-600">
//                 Showing page {currentPage} of {totalPages} ({totalCount} total incidents)
//               </div>
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="analytics" className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-4">Incident Status Distribution</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>Open: {openCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((openCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Under Investigation: {underInvestigationCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((underInvestigationCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Closed: {closedCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((closedCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Pending: {pendingCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((pendingCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Support Required: {supportRequiredCount}</span>
//                   <span>{totalForAnalytics > 0 ? ((supportRequiredCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-4">Risk Level Distribution</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>High Risk: {stats.highRisk}</span>
//                   <span>{totalForAnalytics > 0 ? ((stats.highRisk / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Medium Risk: {stats.mediumRisk}</span>
//                   <span>{totalForAnalytics > 0 ? ((stats.mediumRisk / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Low Risk: {stats.lowRisk}</span>
//                   <span>{totalForAnalytics > 0 ? ((stats.lowRisk / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//       <IncidentFilterModal
//         isOpen={isFilterModalOpen}
//         onClose={() => setIsFilterModalOpen(false)}
//         incidents={originalIncidents}
//         onApply={(filtered) => setIncidents(filtered)}
//         onReset={() => setIncidents(originalIncidents)}
//         setCurrentPage={setCurrentPage}
//         setTotalPages={setTotalPages}
//         setTotalCount={setTotalCount}
//       />
//     </div>
//   );
// };






import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, AlertTriangle, Clock, CheckCircle, XCircle, Download, Settings, Search, Filter as FilterIcon, PauseCircle, LifeBuoy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import IncidentFilterModal from "@/components/IncidentFilterModal";
import { incidentService, type Incident } from "@/services/incidentService";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const calculateStats = (incidents: any[]) => {
  return {
    total: incidents.length,
    open: incidents.filter(i => i.current_status === "Open").length,
    underObservation: incidents.filter(i => i.current_status === "Under Observation").length,
    closed: incidents.filter(i => i.current_status === "Closed").length,
    highRisk: incidents.filter(i => i.inc_level_name === "High Risk").length,
    mediumRisk: incidents.filter(i => i.inc_level_name === "Medium Risk").length,
    lowRisk: incidents.filter(i => i.inc_level_name === "Low Risks").length,
  };
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "High Risk": return "bg-red-100 text-red-800";
    case "Medium Risk": return "bg-yellow-100 text-yellow-800";
    case "Low Risk": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open": return "bg-blue-100 text-blue-800";
    case "Under Observation": return "bg-yellow-100 text-yellow-800";
    case "Closed": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const IncidentDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [originalIncidents, setOriginalIncidents] = useState<Incident[]>([]);
  const [countStats, setCountStats] = useState<{ total_incidents: number; open: number; under_investigation: number; closed: number; pending: number; support_required: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilterQuery, setActiveFilterQuery] = useState<string>("");

  const columns: ColumnConfig[] = [
    {
      key: "srNo",
      label: "Sr. No.",
      sortable: false,
      defaultVisible: true,
      draggable: false,
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "site_name",
      label: "Site",
      sortable: true,
      defaultVisible: true,
      draggable: false,
    },
    {
      key: "building_name",
      label: "Building",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "inc_time",
      label: "Incident Time",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "inc_level_name",
      label: " Incident Level",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "category_name",
      label: "Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "sub_category_name",
      label: "Sub Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "sub_sub_category_name",
      label: "Sub Sub Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "sub_sub_sub_category_name",
      label: "Sub Sub Sub Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "sec_category_name",
      label: "Secondary Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "sec_sub_category_name",
      label: "Secondary Sub Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "sec_sub_sub_category_name",
      label: "Secondary Sub Sub Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "sec_sub_sub_sub_category_name",
      label: "Secondary Sub Sub Sub Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "current_status",
      label: "Status",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
  ];

  useEffect(() => {
    localStorage.removeItem('incidents-table');
    localStorage.removeItem('incidents-table-columns');
    localStorage.removeItem('incidents-table-visibility');

    fetchIncidents(currentPage, activeFilterQuery);
    fetchCounts();
  }, [currentPage, activeFilterQuery]);

  const fetchIncidents = async (page: number = 1, filterQuery: string = "") => {
    try {
      setLoading(true);
      setError(null);
      let query = `page=${page}`;
      if (filterQuery) {
        query += `&${filterQuery}`;
      }
      const response = await incidentService.getIncidents(query);

      const incidentsArr = response.data?.incidents || [];
      setIncidents(incidentsArr);
      setOriginalIncidents(incidentsArr);

      const pagination = response.pagination || {};
      setCurrentPage(pagination.current_page || 1);
      setTotalPages(pagination.total_pages || 1);
      setTotalCount(pagination.total_count || incidentsArr.length || 0);
    } catch (err) {
      setError("Failed to fetch incidents");
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const counts = await incidentService.getIncidentCounts();
      setCountStats(counts);
    } catch (err) {
      console.error('Failed to fetch incident counts:', err);
    }
  };

  const renderCell = (item: Incident, columnKey: string): React.ReactNode => {
    const index = incidents.findIndex(incident => incident.id === item.id);

    switch (columnKey) {
      case "srNo":
        return <span className="font-medium">{(currentPage - 1) * 20 + index + 1}</span>;
      case "id":
        return <span className="font-medium">{item.id}</span>;
      case "description":
        return <div className="w-[15rem] overflow-hidden text-ellipsis text-center">{item.description}</div>;
      case "site_name":
        return <span>{item.site_name || item.building_name || "-"}</span>;
      case "building_name":
        return <span>{item.building_name || "-"}</span>;
      case "inc_time":
        return (
          <span>
            {item.inc_time ? new Date(item.inc_time).toLocaleString() : "-"}
          </span>
        );
      case "inc_level_name":
        return (
          <Badge className={getLevelColor(item.inc_level_name)}>
            {item.inc_level_name}
          </Badge>
        );
      case "category_name":
        return <span>{item.category_name || "-"}</span>;
      case "sub_category_name":
        return <span>{item.sub_category_name || "-"}</span>;
      case "sub_sub_category_name":
        return <span>{item.sub_sub_category_name || "-"}</span>;
      case "sub_sub_sub_category_name":
        return <span>{item.sub_sub_sub_category_name || "-"}</span>;
      case "sec_category_name":
        return <span>{item.sec_category_name || "-"}</span>;
      case "sec_sub_category_name":
        return <span>{item.sec_sub_category_name || "-"}</span>;
      case "sec_sub_sub_category_name":
        return <span>{item.sec_sub_sub_category_name || "-"}</span>;
      case "sec_sub_sub_sub_category_name":
        return <span>{item.sec_sub_sub_sub_category_name || "-"}</span>;
      case "support_required":
        return (
          <Badge className={item.support_required ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {item.support_required ? "Yes" : "No"}
          </Badge>
        );
      case "assigned_to_user_name":
        return <span>{item.assigned_to_user_name || "-"}</span>;
      case "current_status":
        return (
          <Badge className={getStatusColor(item.current_status)}>
            {item.current_status}
          </Badge>
        );
      default:
        const value = item[columnKey as keyof Incident];
        if (value === null || value === undefined) {
          return <span>-</span>;
        }
        return <span>{String(value)}</span>;
    }
  };

  const renderActions = (item: Incident): React.ReactNode => {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewIncident(item.id.toString())}
        title="View Incident"
      >
        <Eye className="w-4 h-4" />
      </Button>
    );
  };

  const stats = calculateStats(incidents);

  const totalForAnalytics = countStats ? countStats.total_incidents : stats.total;
  const openCount = countStats ? countStats.open : stats.open;
  const underInvestigationCount = countStats ? countStats.under_investigation : stats.underObservation;
  const closedCount = countStats ? countStats.closed : stats.closed;
  const pendingCount = countStats ? countStats.pending : 0;
  const supportRequiredCount = countStats ? countStats.support_required : 0;

  const handleAddIncident = () => {
    navigate("/safety/incident/add");
  };

  const handleCardClick = async (type: 'total' | 'open' | 'closed' | 'pending' | 'under_investigation' | 'support_required') => {
    try {
      setLoading(true);
      setError(null);
      let filterQuery = '';
      if (type === 'open') filterQuery = 'q[current_status_eq]=Open';
      else if (type === 'closed') filterQuery = 'q[current_status_eq]=Closed';
      else if (type === 'pending') filterQuery = 'q[current_status_eq]=Pending';
      else if (type === 'under_investigation') filterQuery = 'q[current_status_eq]=Under%20Investigation';
      else if (type === 'support_required') filterQuery = 'q[support_required_eq]=true';

      setActiveFilterQuery(filterQuery);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to fetch incidents');
      console.error('Error fetching incidents by card:', err);
      setLoading(false);
    }
  };

  const handleViewIncident = (incidentId: string) => {
    // navigate(`/safety/incident/${incidentId}`);
    navigate(`/safety/incident/new-details/${incidentId}`);
  };

  const handleExport = async () => {
    try {
      const baseUrl = localStorage.getItem("baseUrl") || "";
      const token = localStorage.getItem("token") || "";
      if (!baseUrl || !token) {
        alert("API base URL or token not found in localStorage.");
        return;
      }

      const exportUrl = `https://${baseUrl}/pms/incidents/export.xlsx`;

      const response = await fetch(exportUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export incidents");
      }
      let filename = `incidents_${new Date().toISOString().split("T")[0]}.xlsx`;
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting incidents:", error);
      alert("Failed to export incidents");
    }
  };

  const StatCard = ({ icon, label, value, color }: any) => (
    <div className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 hover:shadow-lg transition-shadow">
      <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
        {React.cloneElement(icon, { className: `w-6 h-6 text-[#C72030]` })}
      </div>
      <div>
        <div className="text-2xl font-semibold text-[#1A1A1A]">{value}</div>
        <div className="text-sm font-medium text-[#1A1A1A]">{label}</div>
      </div>
    </div>
  );

  const getPageNumbers = () => {
    const maxPagesToShow = 3;
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (endPage - startPage < 2) {
        if (currentPage <= 3) {
          endPage = Math.min(4, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
          startPage = Math.max(totalPages - 3, 2);
        }
      }

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <AlertTriangle className="w-4 h-4" />
            List
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Settings className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
            <div onClick={() => handleCardClick('total')} className="cursor-pointer">
              <StatCard icon={<AlertTriangle />} label="Total Incidents" value={countStats ? countStats.total_incidents : stats.total} />
            </div>
            <div onClick={() => handleCardClick('open')} className="cursor-pointer">
              <StatCard icon={<Clock />} label="Open" value={countStats ? countStats.open : stats.open} />
            </div>
            <div onClick={() => handleCardClick('under_investigation')} className="cursor-pointer">
              <StatCard icon={<Search />} label="Under Investigation" value={countStats ? countStats.under_investigation : stats.underObservation} />
            </div>
            <div onClick={() => handleCardClick('closed')} className="cursor-pointer">
              <StatCard icon={<CheckCircle />} label="Closed" value={countStats ? countStats.closed : stats.closed} />
            </div>
            <div onClick={() => handleCardClick('pending')} className="cursor-pointer">
              <StatCard icon={<PauseCircle />} label="Pending" value={countStats ? countStats.pending : 0} />
            </div>
            <div onClick={() => handleCardClick('support_required')} className="cursor-pointer">
              <StatCard icon={<LifeBuoy />} label="Support Required" value={countStats ? countStats.support_required : 0} />
            </div>
          </div>

          <EnhancedTable
            data={incidents}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            onRowClick={(item) => handleViewIncident(item.id.toString())}
            loading={loading}
            emptyMessage={error ? error : "No incidents found"}
            enableSearch={true}
            searchPlaceholder="Search incidents..."
            enableExport={true}
            handleExport={handleExport}
            exportFileName="incidents"
            storageKey="incidents-dashboard-new"
            className="min-w-full"
            pagination={false}
            leftActions={
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleAddIncident}
                  className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Incident
                </Button>
              </div>
            }
            onFilterClick={() => setIsFilterModalOpen(true)}
          />

          {totalPages > 0 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === '...' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(Number(page))}
                          isActive={currentPage === Number(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="text-center mt-2 text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({totalCount} total incidents)
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Incident Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Open: {openCount}</span>
                  <span>{totalForAnalytics > 0 ? ((openCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Under Investigation: {underInvestigationCount}</span>
                  <span>{totalForAnalytics > 0 ? ((underInvestigationCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Closed: {closedCount}</span>
                  <span>{totalForAnalytics > 0 ? ((closedCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending: {pendingCount}</span>
                  <span>{totalForAnalytics > 0 ? ((pendingCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Support Required: {supportRequiredCount}</span>
                  <span>{totalForAnalytics > 0 ? ((supportRequiredCount / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Risk Level Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>High Risk: {stats.highRisk}</span>
                  <span>{totalForAnalytics > 0 ? ((stats.highRisk / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Risk: {stats.mediumRisk}</span>
                  <span>{totalForAnalytics > 0 ? ((stats.mediumRisk / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Low Risk: {stats.lowRisk}</span>
                  <span>{totalForAnalytics > 0 ? ((stats.lowRisk / totalForAnalytics) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <IncidentFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        incidents={originalIncidents}
        onApply={(filtered, filterQuery) => {
          setIncidents(filtered);
          setActiveFilterQuery(filterQuery || "");
          setCurrentPage(1);
        }}
        onReset={() => {
          setIncidents(originalIncidents);
          setActiveFilterQuery("");
          setCurrentPage(1);
          fetchIncidents(1, "");
        }}
        setCurrentPage={setCurrentPage}
        setTotalPages={setTotalPages}
        setTotalCount={setTotalCount}
      />
    </div>
  );
};