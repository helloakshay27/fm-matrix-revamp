// // import React, { useCallback, useState } from 'react';
// // import { Clock, ChevronLeft } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { Textarea } from '@/components/ui/textarea';
// // import { FormControl, Select as MuiSelect, MenuItem, InputLabel, TextField } from '@mui/material';
// // import { Incident } from '@/services/incidentService';
// // import dayjs from 'dayjs';
// // import type { Investigator, CorrectiveAction, PreventiveAction } from '../IncidentNewDetails';

// // interface FinalClosureStepProps {
// //     incident: Incident | null;
// //     investigators: Investigator[];
// //     incidentOverTime: string;
// //     correctiveActions: CorrectiveAction[];
// //     preventiveActions: PreventiveAction[];
// //     finalClosureCorrectiveDescription: string;
// //     setFinalClosureCorrectiveDescription: React.Dispatch<React.SetStateAction<string>>;
// //     finalClosurePreventiveDescription: string;
// //     setFinalClosurePreventiveDescription: React.Dispatch<React.SetStateAction<string>>;
// //     nextReviewDate: string;
// //     setNextReviewDate: React.Dispatch<React.SetStateAction<string>>;
// //     nextReviewResponsible: string;
// //     setNextReviewResponsible: React.Dispatch<React.SetStateAction<string>>;
// // }

// // const FinalClosureStep: React.FC<FinalClosureStepProps> = ({
// //     incident,
// //     investigators,
// //     incidentOverTime,
// //     correctiveActions,
// //     preventiveActions,
// //     finalClosureCorrectiveDescription,
// //     setFinalClosureCorrectiveDescription,
// //     finalClosurePreventiveDescription,
// //     setFinalClosurePreventiveDescription,
// //     nextReviewDate,
// //     setNextReviewDate,
// //     nextReviewResponsible,
// //     setNextReviewResponsible
// // }) => {
// //     const [selectedCorrectiveAction, setSelectedCorrectiveAction] = useState('');
// //     const [selectedCorrectiveResponsible, setSelectedCorrectiveResponsible] = useState('');
// //     const [correctiveActionDate, setCorrectiveActionDate] = useState('');
// //     const [selectedPreventiveAction, setSelectedPreventiveAction] = useState('');
// //     const [selectedPreventiveResponsible, setSelectedPreventiveResponsible] = useState('');
// //     const [preventiveActionDate, setPreventiveActionDate] = useState('');
// //     const formatTime = (dateTimeString: string | null | undefined) => {
// //         if (!dateTimeString) return '-';
// //         try {
// //             const date = new Date(dateTimeString);
// //             return date.toLocaleTimeString('en-IN', {
// //                 hour: '2-digit',
// //                 minute: '2-digit',
// //                 hour12: true,
// //                 timeZone: 'Asia/Kolkata'
// //             });
// //         } catch (e) {
// //             return '-';
// //         }
// //     };

// //     const formatIncidentOverTime = (timeString: string | null | undefined) => {
// //         if (!timeString) return '-';
// //         try {
// //             if (timeString.includes(':') && !timeString.includes('T')) {
// //                 return dayjs(timeString, "HH:mm").format("hh:mm A");
// //             }
// //             const date = new Date(timeString);
// //             return date.toLocaleTimeString('en-IN', {
// //                 hour: '2-digit',
// //                 minute: '2-digit',
// //                 hour12: true,
// //                 timeZone: 'Asia/Kolkata'
// //             });
// //         } catch (e) {
// //             return '-';
// //         }
// //     };

// //     const handleFinalClosureCorrectiveDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
// //         setFinalClosureCorrectiveDescription(e.target.value);
// //     }, [setFinalClosureCorrectiveDescription]);

// //     const calculateTotalDuration = () => {
// //         if (!incident?.inci_date_time || !incidentOverTime) return '0 Hrs. 0 Min.';
// //         try {
// //             const start = new Date(incident.inci_date_time);
// //             const [hours, minutes] = incidentOverTime.split(':').map(Number);
// //             const end = new Date(start);
// //             end.setHours(hours, minutes);
// //             const diffMs = end - start;
// //             const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
// //             const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
// //             return `${diffHrs} Hrs. ${diffMins} Min.`;
// //         } catch (e) {
// //             return '0 Hrs. 0 Min.';
// //         }
// //     };

// //     return (
// //         <div className="p-4 space-y-4">
// //             {/* Time and Duration */}
// //             <div className="flex items-center justify-between p-3 rounded">
// //                 <div className="flex items-center gap-2">
// //                     <Clock className="w-4 h-4" />
// //                     <span className="text-sm">Occurred Time</span>
// //                     <span className="font-medium text-sm">{incident?.inci_date_time ? formatTime(incident.inci_date_time) : '-'}</span>
// //                 </div>
// //                 <div className="text-sm">
// //                     <span className="text-red-500 font-medium">Total Duration</span>
// //                     <span className="ml-2">{calculateTotalDuration()}</span>
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                     <Clock className="w-4 h-4" />
// //                     <span className="text-sm">Incident Over Time</span>
// //                     <span className="font-medium text-sm">{formatIncidentOverTime(incidentOverTime)}</span>
// //                 </div>
// //             </div>

// //             {/* Investigators */}
// //             <div className="p-3 rounded">
// //                 <div className="flex items-center justify-between">
// //                     <div className="flex flex-wrap gap-2 items-center">
// //                         {investigators.length > 0 ? (
// //                             investigators.map((inv, idx) => (
// //                                 <React.Fragment key={inv.id}>
// //                                     <span className="font-medium text-sm">{inv.name}</span>
// //                                     {idx < investigators.length - 1 && <span className="text-gray-400">,</span>}
// //                                 </React.Fragment>
// //                             ))
// //                         ) : (
// //                             <span className="font-medium text-sm text-gray-400">No investigators added yet</span>
// //                         )}
// //                     </div>
// //                     <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
// //                         + Investigator
// //                     </Button>
// //                 </div>
// //             </div>

// //             {/* Final Closure Section */}
// //             <div className="rounded">
// //                 <div className="flex items-center justify-between p-3 border-b border-gray-300">
// //                     <h3 className="font-semibold">Final Closure</h3>
// //                     <Button variant="ghost" size="sm" className="text-xs bg-gray-800 text-white hover:bg-gray-700">
// //                         Open
// //                     </Button>
// //                 </div>

// //                 <div className="p-3 space-y-4">
// //                     {/* 1. Corrective Actions */}
// //                     <div>
// //                         <h4 className="font-semibold text-sm mb-3">1. Corrective Actions</h4>

// //                         <div className="bg-white p-3 rounded mb-3 space-y-2">
// //                             <div className="flex items-center justify-between">
// //                                 <span className="text-sm">Insulate or replace exposed wiring immediately.</span>
// //                                 <Button variant="ghost" size="icon" className="h-6 w-6">
// //                                     <ChevronLeft className="w-4 h-4 rotate-[-90deg]" />
// //                                 </Button>
// //                             </div>

// //                             <FormControl fullWidth size="small">
// //                                 <InputLabel>Responsible Person</InputLabel>
// //                                 <MuiSelect
// //                                     value=""
// //                                     onChange={(e) => { }}
// //                                     label="Responsible Person"
// //                                     sx={{ backgroundColor: 'rgb(249, 250, 251)' }}
// //                                 >
// //                                     <MenuItem value="person1">John Doe</MenuItem>
// //                                     <MenuItem value="person2">Jane Smith</MenuItem>
// //                                 </MuiSelect>
// //                             </FormControl>

// //                             <div className="flex items-center gap-2">
// //                                 <TextField
// //                                     fullWidth
// //                                     size="small"
// //                                     type="date"
// //                                     defaultValue={new Date().toISOString().split('T')[0]}
// //                                     sx={{ backgroundColor: 'rgb(249, 250, 251)', flex: 1 }}
// //                                 />
// //                             </div>

// //                             <div className="text-xs text-gray-600 mb-1">Description:</div>
// //                             <div className="bg-gray-50 p-2 rounded text-sm">
// //                                 This is how description will look like if the user has put description at the time of creation.
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* 2. Corrective Actions */}
// //                     <div>
// //                         <h4 className="font-semibold text-sm mb-3">2. Corrective Actions</h4>

// //                         <div className="space-y-3">
// //                             <FormControl fullWidth size="small">
// //                                 <InputLabel>Shut down and tag faulty circuits</InputLabel>
// //                                 <MuiSelect
// //                                     value={selectedCorrectiveAction}
// //                                     onChange={(e) => setSelectedCorrectiveAction(e.target.value)}
// //                                     label="Shut down and tag faulty circuits"
// //                                     sx={{ backgroundColor: 'white' }}
// //                                 >
// //                                     <MenuItem value="shutdown">Shut down and tag faulty circuits.</MenuItem>
// //                                     <MenuItem value="other">Other actions...</MenuItem>
// //                                 </MuiSelect>
// //                             </FormControl>

// //                             <FormControl fullWidth size="small">
// //                                 <InputLabel>Responsible Person</InputLabel>
// //                                 <MuiSelect
// //                                     value={selectedCorrectiveResponsible}
// //                                     onChange={(e) => setSelectedCorrectiveResponsible(e.target.value)}
// //                                     label="Responsible Person"
// //                                     sx={{ backgroundColor: 'white' }}
// //                                 >
// //                                     <MenuItem value="person1">John Doe</MenuItem>
// //                                     <MenuItem value="person2">Jane Smith</MenuItem>
// //                                 </MuiSelect>
// //                             </FormControl>

// //                             <div className="flex items-center gap-2">
// //                                 <TextField
// //                                     fullWidth
// //                                     size="small"
// //                                     type="date"
// //                                     value={correctiveActionDate}
// //                                     onChange={(e) => setCorrectiveActionDate(e.target.value)}
// //                                     sx={{ backgroundColor: 'white', flex: 1 }}
// //                                 />
// //                             </div>

// //                             <div className="text-sm text-gray-600 mb-1">Description:</div>
// //                             <Textarea
// //                                 value={finalClosureCorrectiveDescription}
// //                                 onChange={handleFinalClosureCorrectiveDescriptionChange}
// //                                 placeholder="This is how description will look like if the user has put description at the time of creation."
// //                                 className="bg-white min-h-[80px]"
// //                             />

// //                             <Button
// //                                 variant="outline"
// //                                 className="w-full border-[#BF213E] text-[#BF213E]"
// //                             >
// //                                 + Add Action
// //                             </Button>
// //                         </div>
// //                     </div>

// //                     {/* Preventive Actions */}
// //                     <div className="border-t border-gray-300 pt-4">
// //                         <h4 className="font-semibold text-sm mb-3">Preventive Actions</h4>

// //                         <div className="space-y-3">
// //                             <FormControl fullWidth size="small">
// //                                 <InputLabel>Select preventive action</InputLabel>
// //                                 <MuiSelect
// //                                     value={selectedPreventiveAction}
// //                                     onChange={(e) => setSelectedPreventiveAction(e.target.value)}
// //                                     label="Select preventive action"
// //                                     sx={{ backgroundColor: 'white' }}
// //                                 >
// //                                     <MenuItem value="loto">Implement and enforce LOTO procedure.</MenuItem>
// //                                     <MenuItem value="training">Conduct safety training.</MenuItem>
// //                                     <MenuItem value="other">Other actions...</MenuItem>
// //                                 </MuiSelect>
// //                             </FormControl>

// //                             <FormControl fullWidth size="small">
// //                                 <InputLabel>Responsible Person</InputLabel>
// //                                 <MuiSelect
// //                                     value={selectedPreventiveResponsible}
// //                                     onChange={(e) => setSelectedPreventiveResponsible(e.target.value)}
// //                                     label="Responsible Person"
// //                                     sx={{ backgroundColor: 'white' }}
// //                                 >
// //                                     <MenuItem value="person1">John Doe</MenuItem>
// //                                     <MenuItem value="person2">Jane Smith</MenuItem>
// //                                 </MuiSelect>
// //                             </FormControl>

// //                             <div className="flex items-center gap-2">
// //                                 <TextField
// //                                     fullWidth
// //                                     size="small"
// //                                     type="date"
// //                                     value={preventiveActionDate}
// //                                     onChange={(e) => setPreventiveActionDate(e.target.value)}
// //                                     sx={{ backgroundColor: 'white', flex: 1 }}
// //                                 />
// //                             </div>

// //                             <div className="text-sm text-gray-600 mb-1">Description:</div>
// //                             <Textarea
// //                                 value={finalClosurePreventiveDescription}
// //                                 onChange={handleFinalClosurePreventiveDescriptionChange}
// //                                 placeholder="This is how description will look like if the user has put description at the time of creation."
// //                                 className="bg-white min-h-[80px]"
// //                             />

// //                             <Button
// //                                 variant="outline"
// //                                 className="w-full border-[#BF213E] text-[#BF213E]"
// //                             >
// //                                 + Add Action
// //                             </Button>
// //                         </div>
// //                     </div>

// //                     {/* Schedule Next Review */}
// //                     <div className="border-t border-gray-300 pt-4">
// //                         <h4 className="font-semibold text-sm mb-3 text-[#BF213E]">Schedule Next Review</h4>

// //                         <div className="space-y-3">
// //                             <FormControl fullWidth size="small">
// //                                 <InputLabel>Responsible Person</InputLabel>
// //                                 <MuiSelect
// //                                     value={nextReviewResponsible}
// //                                     onChange={(e) => setNextReviewResponsible(e.target.value)}
// //                                     label="Responsible Person"
// //                                     sx={{ backgroundColor: 'white' }}
// //                                 >
// //                                     <MenuItem value="person1">John Doe</MenuItem>
// //                                     <MenuItem value="person2">Jane Smith</MenuItem>
// //                                 </MuiSelect>
// //                             </FormControl>

// //                             <div className="flex items-center gap-2">
// //                                 <TextField
// //                                     fullWidth
// //                                     size="small"
// //                                     type="date"
// //                                     value={nextReviewDate}
// //                                     onChange={(e) => setNextReviewDate(e.target.value)}
// //                                     defaultValue="2025-10-30"
// //                                     sx={{ backgroundColor: 'white', flex: 1 }}
// //                                 />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default FinalClosureStep;
// import React, { useCallback, useState } from 'react';
// import { Clock, ChevronLeft } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { FormControl, Select as MuiSelect, MenuItem, InputLabel, TextField } from '@mui/material';
// import { Incident } from '@/services/incidentService';
// import dayjs from 'dayjs';
// import type { Investigator, CorrectiveAction, PreventiveAction } from '../IncidentNewDetails';

// interface FinalClosureStepProps {
//     incident: Incident | null;
//     investigators: Investigator[];
//     incidentOverTime: string;
//     correctiveActions: CorrectiveAction[];
//     preventiveActions: PreventiveAction[];
//     finalClosureCorrectiveDescription: string;
//     setFinalClosureCorrectiveDescription: React.Dispatch<React.SetStateAction<string>>;
//     finalClosurePreventiveDescription: string;
//     setFinalClosurePreventiveDescription: React.Dispatch<React.SetStateAction<string>>;
//     nextReviewDate: string;
//     setNextReviewDate: React.Dispatch<React.SetStateAction<string>>;
//     nextReviewResponsible: string;
//     setNextReviewResponsible: React.Dispatch<React.SetStateAction<string>>;
// }

// const FinalClosureStep: React.FC<FinalClosureStepProps> = ({
//     incident,
//     investigators,
//     incidentOverTime,
//     correctiveActions,
//     preventiveActions,
//     finalClosureCorrectiveDescription,
//     setFinalClosureCorrectiveDescription,
//     finalClosurePreventiveDescription,
//     setFinalClosurePreventiveDescription,
//     nextReviewDate,
//     setNextReviewDate,
//     nextReviewResponsible,
//     setNextReviewResponsible
// }) => {
//     // Removed unused states to clean up
//     // If you plan to add dynamic actions later, you can re-add them

//     const formatTime = (dateTimeString: string | null | undefined) => {
//         if (!dateTimeString) return '-';
//         try {
//             const date = new Date(dateTimeString);
//             return date.toLocaleTimeString('en-IN', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true,
//                 timeZone: 'Asia/Kolkata'
//             });
//         } catch (e) {
//             return '-';
//         }
//     };

//     const formatIncidentOverTime = (timeString: string | null | undefined) => {
//         if (!timeString) return '-';
//         try {
//             if (timeString.includes(':') && !timeString.includes('T')) {
//                 return dayjs(timeString, "HH:mm").format("hh:mm A");
//             }
//             const date = new Date(timeString);
//             return date.toLocaleTimeString('en-IN', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true,
//                 timeZone: 'Asia/Kolkata'
//             });
//         } catch (e) {
//             return '-';
//         }
//     };

//     const calculateTotalDuration = () => {
//         if (!incident?.inci_date_time || !incidentOverTime) return '0 Hrs. 0 Min.';
//         try {
//             const start = new Date(incident.inci_date_time);
//             const [hours, minutes] = incidentOverTime.split(':').map(Number);
//             const end = new Date(start);
//             end.setHours(hours, minutes);
//             const diffMs = end - start;
//             const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
//             const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//             return `${diffHrs} Hrs. ${diffMins} Min.`;
//         } catch (e) {
//             return '0 Hrs. 0 Min.';
//         }
//     };

//     // Handlers for description changes
//     const handleFinalClosureCorrectiveDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setFinalClosureCorrectiveDescription(e.target.value);
//     }, [setFinalClosureCorrectiveDescription]);

//     const handleFinalClosurePreventiveDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setFinalClosurePreventiveDescription(e.target.value);
//     }, [setFinalClosurePreventiveDescription]);

//     return (
//         <div className="p-4 space-y-4">
//             {/* Time and Duration */}
//             <div className="flex items-center justify-between p-3 rounded bg-gray-50">
//                 <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4" />
//                     <span className="text-sm">Occurred Time</span>
//                     <span className="font-medium text-sm">{incident?.inci_date_time ? formatTime(incident.inci_date_time) : '-'}</span>
//                 </div>
//                 <div className="text-sm">
//                     <span className="text-red-500 font-medium">Total Duration</span>
//                     <span className="ml-2">{calculateTotalDuration()}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4" />
//                     <span className="text-sm">Incident Over Time</span>
//                     <span className="font-medium text-sm">{formatIncidentOverTime(incidentOverTime)}</span>
//                 </div>
//             </div>

//             {/* Investigators */}
//             <div className="p-3 rounded bg-gray-50">
//                 <div className="flex items-center justify-between">
//                     <div className="flex flex-wrap gap-2 items-center">
//                         {investigators.length > 0 ? (
//                             investigators.map((inv, idx) => (
//                                 <React.Fragment key={inv.id}>
//                                     <span className="font-medium text-sm">{inv.name}</span>
//                                     {idx < investigators.length - 1 && <span className="text-gray-400">,</span>}
//                                 </React.Fragment>
//                             ))
//                         ) : (
//                             <span className="font-medium text-sm text-gray-400">No investigators added yet</span>
//                         )}
//                     </div>
//                     <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
//                         + Investigator
//                     </Button>
//                 </div>
//             </div>

//             {/* Final Closure Section */}
//             <div className="rounded bg-white border">
//                 <div className="flex items-center justify-between p-3 border-b border-gray-300">
//                     <h3 className="font-semibold">Final Closure</h3>
//                     <Button variant="ghost" size="sm" className="text-xs bg-gray-800 text-white hover:bg-gray-700">
//                         Open
//                     </Button>
//                 </div>

//                 <div className="p-3 space-y-6">
//                     {/* Corrective Actions */}
//                     <div>
//                         <h4 className="font-semibold text-sm mb-4">Corrective Actions</h4>

//                         {/* Example of existing action (read-only) */}
//                         <div className="bg-gray-50 p-4 rounded mb-4 space-y-3">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-sm font-medium">Insulate or replace exposed wiring immediately.</span>
//                                 <Button variant="ghost" size="icon" className="h-6 w-6">
//                                     <ChevronLeft className="w-4 h-4 rotate-[-90deg]" />
//                                 </Button>
//                             </div>
//                             <div className="text-sm text-gray-600">
//                                 Responsible: John Doe | Target Date: 2025-12-30
//                             </div>
//                             <div className="text-xs text-gray-600">Description:</div>
//                             <div className="bg-white p-3 rounded text-sm border">
//                                 This is how description will look like if the user has put description at the time of creation.
//                             </div>
//                         </div>

//                         {/* Final Description for Corrective Actions */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium">Final Corrective Action Summary</label>
//                             <Textarea
//                                 value={finalClosureCorrectiveDescription}
//                                 onChange={handleFinalClosureCorrectiveDescriptionChange}
//                                 placeholder="Provide the final summary of all corrective actions taken..."
//                                 className="bg-white min-h-[100px]"
//                             />
//                         </div>
//                     </div>

//                     {/* Preventive Actions */}
//                     <div className="border-t border-gray-300 pt-6">
//                         <h4 className="font-semibold text-sm mb-4">Preventive Actions</h4>

//                         {/* Example of existing action */}
//                         <div className="bg-gray-50 p-4 rounded mb-4 space-y-3">
//                             <div className="text-sm font-medium">Implement and enforce LOTO procedure.</div>
//                             <div className="text-sm text-gray-600">
//                                 Responsible: Jane Smith | Target Date: 2026-01-15
//                             </div>
//                         </div>

//                         {/* Final Description for Preventive Actions */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium">Final Preventive Action Summary</label>
//                             <Textarea
//                                 value={finalClosurePreventiveDescription}
//                                 onChange={handleFinalClosurePreventiveDescriptionChange}
//                                 placeholder="Provide the final summary of all preventive actions implemented..."
//                                 className="bg-white min-h-[100px]"
//                             />
//                         </div>
//                     </div>

//                     {/* Schedule Next Review */}
//                     <div className="border-t border-gray-300 pt-6">
//                         <h4 className="font-semibold text-sm mb-4 text-[#BF213E]">Schedule Next Review</h4>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <FormControl fullWidth size="small">
//                                 <InputLabel>Responsible Person</InputLabel>
//                                 <MuiSelect
//                                     value={nextReviewResponsible}
//                                     onChange={(e) => setNextReviewResponsible(e.target.value)}
//                                     label="Responsible Person"
//                                     sx={{ backgroundColor: 'white' }}
//                                 >
//                                     <MenuItem value="">Select...</MenuItem>
//                                     {investigators.map(inv => (
//                                         <MenuItem key={inv.id} value={inv.id}>{inv.name}</MenuItem>
//                                     ))}
//                                 </MuiSelect>
//                             </FormControl>

//                             <TextField
//                                 fullWidth
//                                 size="small"
//                                 type="date"
//                                 label="Next Review Date"
//                                 value={nextReviewDate}
//                                 onChange={(e) => setNextReviewDate(e.target.value)}
//                                 InputLabelProps={{ shrink: true }}
//                                 sx={{ backgroundColor: 'white' }}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FinalClosureStep;

import React, { useEffect, useState, useCallback } from "react";
import { Clock } from 'lucide-react';
import { Incident } from '@/services/incidentService';
import dayjs from 'dayjs';

import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { FormControl, InputLabel, MenuItem, Select as MuiSelect, TextField } from "@mui/material";
import type { Investigator, CorrectiveAction, PreventiveAction } from '../pages/IncidentNewDetails';

/* ----------------------------- TYPES ----------------------------- */
interface FinalClosureStepProps {
  incident: Incident | null;
  investigators: Investigator[];
  incidentOverTime: string;
  correctiveActions: CorrectiveAction[];
  setCorrectiveActions?: React.Dispatch<React.SetStateAction<CorrectiveAction[]>>;
  preventiveActions: PreventiveAction[];
  setPreventiveActions?: React.Dispatch<React.SetStateAction<PreventiveAction[]>>;
  finalClosureCorrectiveDescription: string;
  setFinalClosureCorrectiveDescription: React.Dispatch<React.SetStateAction<string>>;
  finalClosurePreventiveDescription: string;
  setFinalClosurePreventiveDescription: React.Dispatch<React.SetStateAction<string>>;
  nextReviewDate: string;
  setNextReviewDate: React.Dispatch<React.SetStateAction<string>>;
  nextReviewResponsible: string;
  setNextReviewResponsible: React.Dispatch<React.SetStateAction<string>>;
  correctiveActionsCategories?: any[];
  preventiveActionsCategories?: any[];
  internalUsers?: any[];
}

/* ----------------------------- COMPONENT ----------------------------- */
const FinalClosureStep: React.FC<FinalClosureStepProps> = ({
  incident,
  investigators,
  incidentOverTime,
  correctiveActions,
  setCorrectiveActions,
  preventiveActions,
  setPreventiveActions,
  finalClosureCorrectiveDescription,
  setFinalClosureCorrectiveDescription,
  finalClosurePreventiveDescription,
  setFinalClosurePreventiveDescription,
  nextReviewDate,
  setNextReviewDate,
  nextReviewResponsible,
  setNextReviewResponsible,
  correctiveActionsCategories = [],
  preventiveActionsCategories = [],
  internalUsers = []
}) => {
  const [localInternalUsers, setLocalInternalUsers] = useState<any[]>([]);
  const [localCorrectiveCategories, setLocalCorrectiveCategories] = useState<any[]>([]);
  const [localPreventiveCategories, setLocalPreventiveCategories] = useState<any[]>([]);

  // Use provided categories or fetch if not provided
  useEffect(() => {
    if (internalUsers && internalUsers.length > 0) {
      setLocalInternalUsers(internalUsers);
    } else {
      fetchInternalUsers();
    }

    if (correctiveActionsCategories && correctiveActionsCategories.length > 0) {
      setLocalCorrectiveCategories(correctiveActionsCategories);
    } else {
      fetchCorrectiveActionsCategories();
    }

    if (preventiveActionsCategories && preventiveActionsCategories.length > 0) {
      setLocalPreventiveCategories(preventiveActionsCategories);
    } else {
      fetchPreventiveActionsCategories();
    }
  }, [internalUsers, correctiveActionsCategories, preventiveActionsCategories]);

  const fetchInternalUsers = useCallback(async () => {
    try {
      let baseUrl = localStorage.getItem("baseUrl") || "";
      const token = localStorage.getItem("token") || "";

      if (baseUrl && !baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
        baseUrl = "https://" + baseUrl.replace(/^\/+/, "");
      }

      const response = await fetch(`${baseUrl}/pms/users/get_escalate_to_users.json`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setLocalInternalUsers(data);
        else if (data?.users) setLocalInternalUsers(Array.isArray(data.users) ? data.users : []);
        else setLocalInternalUsers([]);
      } else setLocalInternalUsers([]);
    } catch (error) {
      console.error("Error fetching internal users:", error);
      setLocalInternalUsers([]);
    }
  }, []);

  const fetchCorrectiveActionsCategories = useCallback(async () => {
    try {
      let baseUrl = localStorage.getItem("baseUrl") || "";
      const token = localStorage.getItem("token") || "";

      if (baseUrl && !baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
        baseUrl = "https://" + baseUrl.replace(/^\/+/, "");
      }

      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        const correctiveTypes =
          result.data
            ?.filter((item: any) => item.tag_type === "CorrectiveAction")
            .map(({ id, name }: any) => ({ id, name })) || [];
        setLocalCorrectiveCategories(correctiveTypes);
      } else setLocalCorrectiveCategories([]);
    } catch (error) {
      console.error("Error fetching Corrective Actions categories:", error);
      setLocalCorrectiveCategories([]);
    }
  }, []);

  const fetchPreventiveActionsCategories = useCallback(async () => {
    try {
      let baseUrl = localStorage.getItem("baseUrl") || "";
      const token = localStorage.getItem("token") || "";

      if (baseUrl && !baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
        baseUrl = "https://" + baseUrl.replace(/^\/+/, "");
      }

      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        const preventiveTypes =
          result.data
            ?.filter((item: any) => item.tag_type === "PreventiveAction")
            .map(({ id, name }: any) => ({ id, name })) || [];
        setLocalPreventiveCategories(preventiveTypes);
      } else setLocalPreventiveCategories([]);
    } catch (error) {
      console.error("Error fetching Preventive Actions categories:", error);
      setLocalPreventiveCategories([]);
    }
  }, []);

  const formatTime = (dateTimeString: string | null | undefined) => {
    if (!dateTimeString) return '-';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
    } catch (e) {
      return '-';
    }
  };

  const formatIncidentOverTime = (timeString: string | null | undefined) => {
    if (!timeString) return '-';
    try {
      if (timeString.includes(':') && !timeString.includes('T')) {
        return dayjs(timeString, "HH:mm").format("hh:mm A");
      }
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
    } catch (e) {
      return '-';
    }
  };

  const calculateTotalDuration = (
    incident: Incident | null,
    incidentOverTime: string
  ) => {
    if (!incident?.inc_time || !incidentOverTime) return '-';

    const occurredDate = dayjs(incident.inc_time);
    if (!occurredDate.isValid()) return '-';

    let overDate: dayjs.Dayjs;

    if (incidentOverTime.includes(':') && !incidentOverTime.includes('T')) {
      const [h, m] = incidentOverTime.split(':').map(Number);
      overDate = occurredDate.hour(h).minute(m).second(0).millisecond(0);
      if (overDate.isBefore(occurredDate)) {
        overDate = overDate.add(1, 'day');
      }
    } else {
      overDate = dayjs(incidentOverTime);
    }

    if (!overDate.isValid()) return '-';

    const diffMinutes = overDate.diff(occurredDate, 'minute');
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours} Hrs. ${minutes} Min.`;
  };

  const handleFinalClosureCorrectiveDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFinalClosureCorrectiveDescription(e.target.value);
  }, [setFinalClosureCorrectiveDescription]);

  const handleFinalClosurePreventiveDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFinalClosurePreventiveDescription(e.target.value);
  }, [setFinalClosurePreventiveDescription]);

  // Helper function to get category name by ID
  const getCategoryName = (categories: any[], id: string) => {
    const category = categories.find(cat => cat.id.toString() === id);
    return category?.name || 'Unknown';
  };

  // Helper function to get user name by ID
  const getUserName = (userId: string) => {
    const user = localInternalUsers.find(u => u.id?.toString() === userId);
    return user?.full_name || user?.name || 'Unknown';
  };

  // Handlers for updating corrective actions
  const updateCorrectiveAction = useCallback((id: string, field: string, value: any) => {
    if (setCorrectiveActions) {
      setCorrectiveActions(prev => prev.map(action =>
        action.id === id ? { ...action, [field]: value } : action
      ));
    }
  }, [setCorrectiveActions]);

  // Handlers for updating preventive actions
  const updatePreventiveAction = useCallback((id: string, field: string, value: any) => {
    if (setPreventiveActions) {
      setPreventiveActions(prev => prev.map(action =>
        action.id === id ? { ...action, [field]: value } : action
      ));
    }
  }, [setPreventiveActions]);

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="p-4 space-y-4">
      {/* Time and Duration */}
      <div className="flex items-center justify-between p-3 rounded">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Occurred Time</span>
          <span className="font-medium text-sm">{incident?.inc_time ? formatTime(incident.inc_time) : '-'}</span>
        </div>
        <div className="text-sm">
          <span className="text-red-500 font-medium">Total Duration</span>
          <span className="ml-2">{calculateTotalDuration(incident, incidentOverTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Incident Over Time</span>
          <span className="font-medium text-sm">
            {formatIncidentOverTime(incidentOverTime)}
          </span>
        </div>
      </div>

      {/* Investigators */}
      <div className="p-3 rounded">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            {investigators.length > 0 ? (
              investigators.map((inv, idx) => (
                <React.Fragment key={inv.id}>
                  <span className="font-medium text-sm">{inv.name}</span>
                  {idx < investigators.length - 1 && <span className="text-gray-400">,</span>}
                </React.Fragment>
              ))
            ) : (
              <span className="font-medium text-sm text-gray-400">No investigators added yet</span>
            )}
          </div>
          <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
            + Investigator
          </Button>
        </div>
      </div>

      {/* Final Closure Section */}
      <div className="rounded">
        <div className="flex items-center justify-between p-3 border-b border-gray-300">
          <h3 className="font-semibold">Final Closure</h3>
          <Button variant="ghost" size="sm" className="text-xs bg-gray-800 text-white hover:bg-gray-700 h-7">
            Open
          </Button>
        </div>

        <div className="p-3 space-y-4">
          {/* Corrective Actions */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Corrective Actions:</h4>

            {correctiveActions.length > 0 && (
              <div className="space-y-4 mb-4">
                {correctiveActions.map((action, index) => (
                  <div key={action.id} className="p-4 rounded-lg border border-gray-200 space-y-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold">Action #{index + 1}</h5>
                    </div>

                    <FormControl fullWidth size="small">
                      <InputLabel>Select corrective action</InputLabel>
                      <MuiSelect
                        value={action.action || ''}
                        onChange={(e) => updateCorrectiveAction(action.id, 'action', e.target.value)}
                        label="Select corrective action"
                        sx={{ backgroundColor: 'white' }}
                      >
                        {localCorrectiveCategories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id.toString()}>{cat.name}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <InputLabel>Responsible Person</InputLabel>
                      <MuiSelect
                        value={action.responsiblePerson || ''}
                        onChange={(e) => updateCorrectiveAction(action.id, 'responsiblePerson', e.target.value)}
                        label="Responsible Person"
                        sx={{ backgroundColor: 'white' }}
                      >
                        {localInternalUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id.toString()}>{user.full_name || user.name}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      value={action.targetDate || ''}
                      onChange={(e) => updateCorrectiveAction(action.id, 'targetDate', e.target.value)}
                      sx={{ backgroundColor: 'white' }}
                      InputLabelProps={{ shrink: true }}
                    />

                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Description:</div>
                      <Textarea
                        value={action.description || ''}
                        onChange={(e) => updateCorrectiveAction(action.id, 'description', e.target.value)}
                        placeholder="Enter description"
                        className="bg-white min-h-[80px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Final Corrective Action Summary</label>
              <Textarea
                value={finalClosureCorrectiveDescription}
                onChange={handleFinalClosureCorrectiveDescriptionChange}
                placeholder="Provide the final summary of all corrective actions taken..."
                className="bg-white min-h-[100px]"
              />
            </div> */}
          </div>

          {/* Preventive Actions */}
          <div className="border-t border-gray-300 pt-4">
            <h4 className="font-semibold text-sm mb-3">Preventive Actions:</h4>

            {preventiveActions.length > 0 && (
              <div className="space-y-4 mb-4">
                {preventiveActions.map((action, index) => (
                  <div key={action.id} className="p-4 rounded-lg border border-gray-200 space-y-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold">Action #{index + 1}</h5>
                    </div>

                    <FormControl fullWidth size="small">
                      <InputLabel>Select preventive action</InputLabel>
                      <MuiSelect
                        value={action.action || ''}
                        onChange={(e) => updatePreventiveAction(action.id, 'action', e.target.value)}
                        label="Select preventive action"
                        sx={{ backgroundColor: 'white' }}
                      >
                        {localPreventiveCategories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id.toString()}>{cat.name}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <InputLabel>Responsible Person</InputLabel>
                      <MuiSelect
                        value={action.responsiblePerson || ''}
                        onChange={(e) => updatePreventiveAction(action.id, 'responsiblePerson', e.target.value)}
                        label="Responsible Person"
                        sx={{ backgroundColor: 'white' }}
                      >
                        {localInternalUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id.toString()}>{user.full_name || user.name}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      value={action.targetDate || ''}
                      onChange={(e) => updatePreventiveAction(action.id, 'targetDate', e.target.value)}
                      sx={{ backgroundColor: 'white' }}
                      InputLabelProps={{ shrink: true }}
                    />

                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Description:</div>
                      <Textarea
                        value={action.description || ''}
                        onChange={(e) => updatePreventiveAction(action.id, 'description', e.target.value)}
                        placeholder="Enter description"
                        className="bg-white min-h-[80px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Final Preventive Action Summary</label>
              <Textarea
                value={finalClosurePreventiveDescription}
                onChange={handleFinalClosurePreventiveDescriptionChange}
                placeholder="Provide the final summary of all preventive actions implemented..."
                className="bg-white min-h-[100px]"
              />
            </div> */}
          </div>

          {/* Schedule Next Review */}
          <div className="border-t border-gray-300 pt-4">
            <h4 className="font-semibold text-sm mb-3 text-[#BF213E]">Schedule Next Review</h4>

            <div className="space-y-3">
              <FormControl fullWidth size="small">
                <InputLabel>Responsible Person</InputLabel>
                <MuiSelect
                  value={nextReviewResponsible}
                  onChange={(e) => setNextReviewResponsible(e.target.value)}
                  label="Responsible Person"
                  sx={{ backgroundColor: 'white' }}
                >
                  {localInternalUsers.length > 0 ? (
                    localInternalUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id?.toString() || ''}>
                        {user.full_name || user.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No users available
                    </MenuItem>
                  )}
                </MuiSelect>
              </FormControl>

              <div className="flex items-center gap-2">
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={nextReviewDate}
                  onChange={(e) => setNextReviewDate(e.target.value)}
                  sx={{ backgroundColor: 'white', flex: 1 }}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalClosureStep;