// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Badge } from "@/components/ui/badge";
// import {
//     ArrowLeft,
//     FileText,
//     User,
//     Shield,
//     CheckCircle,
//     Calendar,
//     MapPin,
//     Building2,
//     Phone,
//     Mail,
//     Clock,
//     AlertTriangle,
//     Plus,
//     Trash2,
//     Upload
// } from "lucide-react";
// import { toast } from "sonner";

// interface PersonInfo {
//     id: string;
//     name: string;
//     contactNumber: string;
// }

// interface ExtensionEntry {
//     id: string;
//     date: string | null;
//     time: string | null;
//     description: string | null;
//     contractors_manpower: string | null;
//     contractors_supervisor: string | null;
//     permit_initiator: string | null;
//     permit_issuer: string | null;
//     safety_officer: string | null;
//     time_extension: string | null;
// }

// interface AttachmentFile {
//     id: string;
//     name: string;
//     workVoucher: boolean;
//     file: File | null;
//     sr_no?: number;
// }

// export const FillForm = () => {
//     const navigate = useNavigate();
//     const { id } = useParams<{ id: string }>();
//     const [loading, setLoading] = useState(false);

//     // Basic Information State - populated from API
//     const [basicInfo, setBasicInfo] = useState({
//         docNo: '',
//         permitRequestedDate: '28/08/2025',
//         permitId: '307',
//         rev: '',
//         permitIssueDate: ''
//     });

//     // Detailed Information State
//     const [detailedInfo, setDetailedInfo] = useState({
//         jobDescription: '',
//         location: '',
//         permitInitiatedBy: '',
//         initiatorsDepartment: '',
//         initiatorsContact: '',
//         nameOfContractor: '',
//         contractorsContact: null,
//         addressOfContractor: null,
//         contractorsManpower: 0,
//         jobSafetyAnalysisRequired: null,
//         emergencyContactName: null,
//         emergencyContactNumber: null,
//         msdsAvailableForChemicalUse: null,
//         specifyTheName: null,
//         contractorStoragePlaceRequired: null,
//         areaAllocated: null,
//         anySimultaneousOperations: null,
//         specifyTheOperation: null,
//         necessaryPpesProvided: null,
//         utilitiesToBeProvidedByCompany: {
//             waterSupply: null,
//             electricalSupply: null,
//             airSupply: null
//         },
//         energyIsolationRequired: null,
//         tagOutDetails: null,
//         energyIsolationDoneBy: null,
//         energyDeisolationDoneBy: null
//     });

//     // Emergency & Safety Information
//     const [emergencyInfo, setEmergencyInfo] = useState({
//         contractorEmployeesList: false
//     });

//     // Check Points
//     const [checkPoints, setCheckPoints] = useState([
//         {
//             id: '1',
//             description: 'Surrounding area checked, Cleaned and covered.Proper ventilation and lighting provided.',
//             req: false,
//             checked: false
//         },
//         {
//             id: '2',
//             description: 'Area Cordoned off & caution boards/tags provided',
//             req: false,
//             checked: false
//         },
//         {
//             id: '3',
//             description: 'All Lifting tool & tackles of contractor\'s are inspected & certified.',
//             req: false,
//             checked: false
//         },
//         {
//             id: '4',
//             description: 'Necessary PPEs are provided',
//             req: false,
//             checked: false
//         }
//     ]);

//     // Persons Information
//     const [personsInfo, setPersonsInfo] = useState({
//         permitInitiatorName: 'Tech Support 1',
//         permitInitiatorContact: '9867121211',
//         contractorSupervisorName: '',
//         contractorSupervisorContact: '',
//         permitIssuerName: 'Tech Support 1',
//         permitIssuerContact: '',
//         safetyOfficerName: 'Tech Support 1',
//         safetyOfficerContact: ''
//     });

//     // Dropdown options for Permit Issuer and Safety Officer
//     const permitIssuerOptions = [
//         { value: 'tech-support-1', label: 'Tech Support 1' },
//         { value: 'tech-support-2', label: 'Tech Support 2' },
//         { value: 'tech-support-3', label: 'Tech Support 3' },
//         { value: 'safety-manager', label: 'Safety Manager' },
//         { value: 'facility-manager', label: 'Facility Manager' }
//     ];

//     const safetyOfficerOptions = [
//         { value: 'tech-support-1', label: 'Tech Support 1' },
//         { value: 'safety-officer-1', label: 'Safety Officer 1' },
//         { value: 'safety-officer-2', label: 'Safety Officer 2' },
//         { value: 'safety-manager', label: 'Safety Manager' },
//         { value: 'hse-manager', label: 'HSE Manager' }
//     ];

//     // Declaration
//     const [declaration, setDeclaration] = useState('I hereby declare that all the hazard and risk associated to the activity I pledge to implement as the control measure identified in the activity through risk analysis (RA) and JSA. I thereby declare that the details given above are correct and I have been trained by our company for the above mentioned work & I will mentally and physically fit, alcohol/drug free to perform it, will be performed with appropriate safety and supervisors.');

//     // Daily Extension Sheet
//     const [dailyExtensions, setDailyExtensions] = useState<ExtensionEntry[]>([
//         {
//             id: '1',
//             date: null,
//             time: null,
//             description: null,
//             contractors_manpower: null,
//             contractors_supervisor: null,
//             permit_initiator: 'Tech Support 1',
//             permit_issuer: null,
//             safety_officer: 'Tech Support 1',
//             time_extension: null
//         }
//     ]);

//     // Work Permit Closure
//     const [workPermitClosure, setWorkPermitClosure] = useState({
//         declarations: [
//             {
//                 initiator: 'Certified that the subject work has been completed/ stopped and area cleaned.Scrap shifted to scrap yard.',
//                 issuer: 'Verified that the job is completed & Area is cleaned and safe from any hazard.',
//                 security_dept: 'Closed permit received'
//             },
//             {
//                 initiator: 'All Energy sources are re-established by authorized person.',
//                 issuer: 'Verified that all energy sources are re-established properly.',
//                 security_dept: 'Received the given safety equipment\'s'
//             },
//             {
//                 initiator: 'All safety equipment returned to security after work is completed.',
//                 issuer: '',
//                 security_dept: ''
//             }
//         ],
//         signatures: {
//             initiator: 'Tech Support 1',
//             issuer: 'Tech Support 1',
//             security_dept: ''
//         },
//         date_and_time: {
//             initiator: '',
//             issuer: '',
//             security_dept: ''
//         }
//     });

//     // Attachments
//     const [attachments, setAttachments] = useState<AttachmentFile[]>([
//         { id: '1', name: 'List of people to be work', workVoucher: false, file: null, sr_no: 1 },
//         { id: '2', name: 'ESI/WC policy', workVoucher: false, file: null, sr_no: 2 },
//         { id: '3', name: 'Medical Reports', workVoucher: false, file: null, sr_no: 3 },
//         { id: '4', name: 'Other', workVoucher: false, file: null, sr_no: 4 }
//     ]);

//     useEffect(() => {
//         if (id) {
//             console.log('Permit ID:', id);
//             fetchPermitDetails(id);
//         }
//     }, [id]);

//     const fetchPermitDetails = async (permitId: string) => {
//         try {
//             const baseUrl = localStorage.getItem('baseUrl');
//             const token = localStorage.getItem('token');

//             if (!baseUrl || !token) {
//                 toast.error('Authentication required');
//                 return;
//             }

//             // Extract just the permit ID if the permitId contains the full API path
//             let actualPermitId = permitId;
//             if (permitId.includes('.json')) {
//                 // Extract the permit ID from a URL like "fm-uat-api.lockated.com/pms/permits/11780.json"
//                 const matches = permitId.match(/\/permits\/(\d+)\.json$/);
//                 if (matches && matches[1]) {
//                     actualPermitId = matches[1];
//                 } else {
//                     // Fallback: extract numbers from the end before .json
//                     const idMatch = permitId.match(/(\d+)\.json$/);
//                     if (idMatch && idMatch[1]) {
//                         actualPermitId = idMatch[1];
//                     }
//                 }
//             }

//             console.log('Original permitId:', permitId);
//             console.log('Extracted actualPermitId:', actualPermitId);

//             setLoading(true);
//             const response = await fetch(`${baseUrl}/pms/permits/${actualPermitId}.json`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log('Permit Details:', data);

//                 const permitData = data.pms_permit;

//                 // Map API data to basic info fields
//                 setBasicInfo(prev => ({
//                     ...prev,
//                     docNo: permitData.basic_information?.doc_no || '',
//                     permitRequestedDate: permitData.basic_information?.permit_requested_date || '28/08/2025',
//                     permitId: permitData.basic_information?.permit_id || permitId,
//                     rev: permitData.basic_information?.rev || '',
//                     permitIssueDate: permitData.basic_information?.permit_issue_date || ''
//                 }));

//                 // Map detailed information
//                 setDetailedInfo(prev => ({
//                     ...prev,
//                     jobDescription: permitData.detailed_information?.job_description || '',
//                     location: permitData.detailed_information?.location || '',
//                     permitInitiatedBy: permitData.detailed_information?.permit_initiated_by || '',
//                     initiatorsDepartment: permitData.detailed_information?.initiators_department || '',
//                     initiatorsContact: permitData.detailed_information?.initiators_contact || '',
//                     nameOfContractor: permitData.detailed_information?.name_of_contractor || '',
//                     contractorsContact: permitData.detailed_information?.contractors_contact,
//                     addressOfContractor: permitData.detailed_information?.address_of_contractor,
//                     contractorsManpower: permitData.detailed_information?.contractors_manpower || 0,
//                     jobSafetyAnalysisRequired: permitData.detailed_information?.job_safety_analysis_required,
//                     emergencyContactName: permitData.detailed_information?.emergency_contact_name,
//                     emergencyContactNumber: permitData.detailed_information?.emergency_contact_number,
//                     msdsAvailableForChemicalUse: permitData.detailed_information?.msds_available_for_chemical_use,
//                     specifyTheName: permitData.detailed_information?.specify_the_name,
//                     contractorStoragePlaceRequired: permitData.detailed_information?.contractor_storage_place_required,
//                     areaAllocated: permitData.detailed_information?.area_allocated,
//                     anySimultaneousOperations: permitData.detailed_information?.any_simultaneous_operations,
//                     specifyTheOperation: permitData.detailed_information?.specify_the_operation,
//                     necessaryPpesProvided: permitData.detailed_information?.necessary_ppes_provided,
//                     utilitiesToBeProvidedByCompany: {
//                         waterSupply: permitData.detailed_information?.utilities_to_be_provided_by_company?.water_supply,
//                         electricalSupply: permitData.detailed_information?.utilities_to_be_provided_by_company?.electrical_supply,
//                         airSupply: permitData.detailed_information?.utilities_to_be_provided_by_company?.air_supply
//                     },
//                     energyIsolationRequired: permitData.detailed_information?.energy_isolation_required,
//                     tagOutDetails: permitData.detailed_information?.tag_out_details,
//                     energyIsolationDoneBy: permitData.detailed_information?.energy_isolation_done_by,
//                     energyDeisolationDoneBy: permitData.detailed_information?.energy_deisolation_done_by
//                 }));

//                 // Map check points
//                 if (permitData.check_points) {
//                     setCheckPoints(prev => prev.map(item => {
//                         switch (item.id) {
//                             case '1':
//                                 return {
//                                     ...item,
//                                     req: permitData.check_points.surrounding_area?.req_or_not === 'Yes',
//                                     checked: permitData.check_points.surrounding_area?.checked === 'Yes'
//                                 };
//                             case '2':
//                                 return {
//                                     ...item,
//                                     req: permitData.check_points.area_cordoned_off?.req_or_not === 'Yes',
//                                     checked: permitData.check_points.area_cordoned_off?.checked === 'Yes'
//                                 };
//                             case '3':
//                                 return {
//                                     ...item,
//                                     req: permitData.check_points.lifting_tool?.req_or_not === 'Yes',
//                                     checked: permitData.check_points.lifting_tool?.checked === 'Yes'
//                                 };
//                             case '4':
//                                 return {
//                                     ...item,
//                                     req: permitData.check_points.necessary_ppes?.req_or_not === 'Yes',
//                                     checked: permitData.check_points.necessary_ppes?.checked === 'Yes'
//                                 };
//                             default:
//                                 return item;
//                         }
//                     }));
//                 }

//                 // Map persons information
//                 setPersonsInfo(prev => ({
//                     ...prev,
//                     permitInitiatorName: permitData.persons_information?.permit_initiator?.name || '',
//                     permitInitiatorContact: permitData.persons_information?.permit_initiator?.contact_number || '',
//                     contractorSupervisorName: permitData.persons_information?.contractors_supervisor?.name || '',
//                     contractorSupervisorContact: permitData.persons_information?.contractors_supervisor?.contact_number || '',
//                     permitIssuerName: permitData.persons_information?.permit_issuer?.name || '',
//                     permitIssuerContact: '',
//                     safetyOfficerName: permitData.persons_information?.safety_officer?.name || '',
//                     safetyOfficerContact: ''
//                 }));

//                 // Map daily extension sheet
//                 if (permitData.daily_extension_sheet?.rows && permitData.daily_extension_sheet.rows.length > 0) {
//                     const mappedExtensions = permitData.daily_extension_sheet.rows.map((row: any, index: number) => ({
//                         id: (index + 1).toString(),
//                         date: row.date,
//                         time: row.time,
//                         description: row.description,
//                         contractors_manpower: row.contractors_manpower,
//                         contractors_supervisor: row.contractors_supervisor,
//                         permit_initiator: row.permit_initiator,
//                         permit_issuer: row.permit_issuer,
//                         safety_officer: row.safety_officer,
//                         time_extension: row.time_extension
//                     }));
//                     setDailyExtensions(mappedExtensions);
//                 }

//                 // Map work permit closure
//                 if (permitData.work_permit_closure) {
//                     setWorkPermitClosure(prev => ({
//                         declarations: permitData.work_permit_closure.declarations || prev.declarations,
//                         signatures: permitData.work_permit_closure.signatures || prev.signatures,
//                         date_and_time: permitData.work_permit_closure.date_and_time || prev.date_and_time
//                     }));
//                 }

//                 // Map documents/attachments
//                 if (permitData.documents && Array.isArray(permitData.documents)) {
//                     setAttachments(permitData.documents.map((doc: any) => ({
//                         id: doc.sr_no?.toString() || Math.random().toString(),
//                         name: doc.name || '',
//                         workVoucher: doc.status === 'Yes',
//                         file: null,
//                         sr_no: doc.sr_no || 0
//                     })));
//                 }

//             } else {
//                 console.error('Failed to fetch permit details');
//                 toast.error('Failed to load permit details');
//             }
//         } catch (error) {
//             console.error('Error fetching permit details:', error);
//             toast.error('Error loading permit details');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDetailedInfoChange = (field: string, value: any) => {
//         setDetailedInfo(prev => ({ ...prev, [field]: value }));
//     };

//     const handleEmergencyInfoChange = (field: string, value: any) => {
//         setEmergencyInfo(prev => ({ ...prev, [field]: value }));
//     };

//     const handleUtilityChange = (utility: string, checked: boolean) => {
//         if (['waterSupply', 'electricalSupply', 'airSupply'].includes(utility)) {
//             setEmergencyInfo(prev => ({
//                 ...prev,
//                 utilitiesToBeProvided: {
//                     ...prev.utilitiesToBeProvided,
//                     [utility]: checked
//                 }
//             }));
//         } else if (['byCompany', 'byContractor'].includes(utility)) {
//             setEmergencyInfo(prev => ({
//                 ...prev,
//                 necessaryPPEProvided: {
//                     ...prev.necessaryPPEProvided,
//                     [utility]: checked
//                 }
//             }));
//         }
//     };

//     const handleCheckPointChange = (id: string, field: 'req' | 'checked', checked: boolean) => {
//         setCheckPoints(prev =>
//             prev.map(item =>
//                 item.id === id ? { ...item, [field]: checked } : item
//             )
//         );
//     };

//     const addDailyExtension = () => {
//         const newId = (dailyExtensions.length + 1).toString();
//         setDailyExtensions(prev => [
//             ...prev,
//             {
//                 id: newId,
//                 date: null,
//                 time: null,
//                 description: null,
//                 contractors_manpower: null,
//                 contractors_supervisor: null,
//                 permit_initiator: 'Tech Support 1',
//                 permit_issuer: null,
//                 safety_officer: 'Tech Support 1',
//                 time_extension: null
//             }
//         ]);
//     };

//     const removeDailyExtension = (id: string) => {
//         setDailyExtensions(prev => prev.filter(item => item.id !== id));
//     };

//     const handleDailyExtensionChange = (id: string, field: string, value: string) => {
//         setDailyExtensions(prev =>
//             prev.map(item =>
//                 item.id === id ? { ...item, [field]: value } : item
//             )
//         );
//     };

//     const handleAttachmentChange = (id: string, field: string, value: any) => {
//         setAttachments(prev =>
//             prev.map(item =>
//                 item.id === id ? { ...item, [field]: value } : item
//             )
//         );
//     };

//     const addAttachment = () => {
//         const newId = (attachments.length + 1).toString();
//         setAttachments(prev => [
//             ...prev,
//             { id: newId, name: '', workVoucher: false, file: null }
//         ]);
//     };

//     const removeAttachment = (id: string) => {
//         setAttachments(prev => prev.filter(item => item.id !== id));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             // Here you would implement the API call to submit the form
//             await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

//             toast.success('Cold Work Permit form submitted successfully!');
//             navigate('/safety/permit');
//         } catch (error) {
//             toast.error('Failed to submit permit form');
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-4">
//                         <Button
//                             variant="ghost"
//                             onClick={() => navigate(-1)}
//                             className="p-0"
//                         >
//                             <ArrowLeft className="w-4 h-4 mr-2" />
//                             Back
//                         </Button>
//                         <h1 className="text-2xl font-bold text-gray-900">
//                             COLD WORK PERMIT
//                             {id && <span className="text-sm text-gray-600 ml-2">(Permit ID: {id})</span>}
//                         </h1>
//                     </div>
//                     <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
//                         FILL FORM
//                     </Badge>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Basic Information */}
//                     <Card className="shadow-sm border border-gray-200">
//                         <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
//                             <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                 <FileText className="w-5 h-5" />
//                                 Basic Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             {loading ? (
//                                 <div className="flex items-center justify-center py-8">
//                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
//                                     <span className="ml-2 text-gray-600">Loading permit details...</span>
//                                 </div>
//                             ) : (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div className="space-y-4">
//                                         <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                                             <Label className="text-sm font-medium text-gray-600">Doc No</Label>
//                                             <span className="text-sm font-medium text-gray-900">
//                                                 {basicInfo.docNo || '-'}
//                                             </span>
//                                         </div>

//                                         <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                                             <Label className="text-sm font-medium text-gray-600">Permit Requested Date</Label>
//                                             <span className="text-sm font-medium text-gray-900">
//                                                 {basicInfo.permitRequestedDate}
//                                             </span>
//                                         </div>

//                                         <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                                             <Label className="text-sm font-medium text-gray-600">Permit Id</Label>
//                                             <span className="text-sm font-medium text-gray-900">
//                                                 {basicInfo.permitId}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-4">
//                                         <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                                             <Label className="text-sm font-medium text-gray-600">Rev</Label>
//                                             <span className="text-sm font-medium text-gray-900">
//                                                 {basicInfo.rev || '-'}
//                                             </span>
//                                         </div>

//                                         <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                                             <Label className="text-sm font-medium text-gray-600">Permit Issue Date</Label>
//                                             <span className="text-sm font-medium text-gray-900">
//                                                 {basicInfo.permitIssueDate || '-'}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>

//                     {/* Detailed Information */}
//                     <Card className="shadow-sm border border-gray-200">
//                         <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
//                             <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                 <Building2 className="w-5 h-5" />
//                                 Detailed Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6 space-y-6">
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                 <div className="space-y-4">
//                                     <div>
//                                         <Label htmlFor="jobDescription">Job Description</Label>
//                                         <Textarea
//                                             id="jobDescription"
//                                             value={detailedInfo.jobDescription}
//                                             onChange={(e) => handleDetailedInfoChange('jobDescription', e.target.value)}
//                                             placeholder="Enter job description"
//                                             rows={3}
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="permitInitiatedBy">Permit Initiated by</Label>
//                                         <Input
//                                             id="permitInitiatedBy"
//                                             value={detailedInfo.permitInitiatedBy}
//                                             onChange={(e) => handleDetailedInfoChange('permitInitiatedBy', e.target.value)}
//                                             placeholder="Enter initiator name"
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="contractorsContact">Initiators Contact</Label>
//                                         <Input
//                                             id="contractorsContact"
//                                             value={detailedInfo.initiatorsContact || ''}
//                                             onChange={(e) => handleDetailedInfoChange('initiatorsContact', e.target.value)}
//                                             placeholder="7239013238"
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="contractorsContact2">Contractor's Contact</Label>
//                                         <Input
//                                             id="contractorsContact2"
//                                             value={detailedInfo.contractorsContact || ''}
//                                             onChange={(e) => handleDetailedInfoChange('contractorsContact', e.target.value)}
//                                             placeholder="Enter contractor contact"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div>
//                                         <Label htmlFor="location">Location</Label>
//                                         <Textarea
//                                             id="location"
//                                             value={detailedInfo.location}
//                                             onChange={(e) => handleDetailedInfoChange('location', e.target.value)}
//                                             rows={3}
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="validationDept">Initiators Department</Label>
//                                         <Input
//                                             id="validationDept"
//                                             value={detailedInfo.initiatorsDepartment}
//                                             onChange={(e) => handleDetailedInfoChange('initiatorsDepartment', e.target.value)}
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="nameOfContractor">Name of Contractor</Label>
//                                         <Input
//                                             id="nameOfContractor"
//                                             value={detailedInfo.nameOfContractor}
//                                             onChange={(e) => handleDetailedInfoChange('nameOfContractor', e.target.value)}
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="addressOfContractor">Address of Contractor</Label>
//                                         <Input
//                                             id="addressOfContractor"
//                                             value={detailedInfo.addressOfContractor || ''}
//                                             onChange={(e) => handleDetailedInfoChange('addressOfContractor', e.target.value)}
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="contractorsManpower">Contractors Manpower</Label>
//                                         <Input
//                                             id="contractorsManpower"
//                                             type="number"
//                                             value={detailedInfo.contractorsManpower}
//                                             onChange={(e) => handleDetailedInfoChange('contractorsManpower', parseInt(e.target.value) || 0)}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Emergency & Safety Information */}
//                     <Card className="shadow-sm border border-gray-200">
//                         <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
//                             <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                 <Shield className="w-5 h-5" />
//                                 Safety & Emergency Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6 space-y-6">
//                             <div className="space-y-6">
//                                 {/* Contractor employees list */}
//                                 <div className="p-4 bg-gray-50 rounded-lg">
//                                     <Label className="text-sm font-medium text-gray-700 block mb-2">
//                                         (Attach the list of Contractor employees)
//                                     </Label>
//                                 </div>

//                                 {/* Job Safety Analysis required */}
//                                 <div>
//                                     <Label className="text-sm font-medium text-gray-700 block mb-3">
//                                         Job Safety Analysis required :
//                                     </Label>
//                                     <div className="text-xs text-gray-500 mb-2">(if yes, do it on attached sheet)</div>
//                                     <RadioGroup
//                                         value={detailedInfo.jobSafetyAnalysisRequired === null ? 'null' : detailedInfo.jobSafetyAnalysisRequired === 'Yes' ? 'true' : 'false'}
//                                         onValueChange={(value) => handleDetailedInfoChange('jobSafetyAnalysisRequired', value === 'true' ? 'Yes' : value === 'false' ? 'No' : null)}
//                                         className="flex gap-6"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="true" id="jsa-yes" />
//                                             <Label htmlFor="jsa-yes">Yes</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="false" id="jsa-no" />
//                                             <Label htmlFor="jsa-no">No</Label>
//                                         </div>
//                                     </RadioGroup>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     {/* Emergency Contact Name */}
//                                     <div>
//                                         <Label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">
//                                             Emergency Contact Name :
//                                         </Label>
//                                         <Input
//                                             id="emergencyContactName"
//                                             value={detailedInfo.emergencyContactName || ''}
//                                             onChange={(e) => handleDetailedInfoChange('emergencyContactName', e.target.value)}
//                                             placeholder="Enter Emergency Contact Name"
//                                             className="mt-2"
//                                         />
//                                     </div>

//                                     {/* Emergency Contact Number */}
//                                     <div>
//                                         <Label htmlFor="emergencyContactNumber" className="text-sm font-medium text-gray-700">
//                                             Emergency Contact Number :
//                                         </Label>
//                                         <Input
//                                             id="emergencyContactNumber"
//                                             value={detailedInfo.emergencyContactNumber || ''}
//                                             onChange={(e) => handleDetailedInfoChange('emergencyContactNumber', e.target.value)}
//                                             placeholder="Enter Emergency Contact Number"
//                                             className="mt-2"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Any Chemicals to be used */}
//                                 <div>
//                                     <Label className="text-sm font-medium text-gray-700 block mb-3">
//                                         Any Chemicals to be used then MSDS available :
//                                     </Label>
//                                     <div className="text-xs text-gray-500 mb-2">(if yes, Please attach MSDS)</div>
//                                     <RadioGroup
//                                         value={detailedInfo.msdsAvailableForChemicalUse === null ? 'null' : detailedInfo.msdsAvailableForChemicalUse === 'Yes' ? 'true' : 'false'}
//                                         onValueChange={(value) => handleDetailedInfoChange('msdsAvailableForChemicalUse', value === 'true' ? 'Yes' : value === 'false' ? 'No' : null)}
//                                         className="flex gap-6"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="true" id="chemicals-yes" />
//                                             <Label htmlFor="chemicals-yes">Yes</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="false" id="chemicals-no" />
//                                             <Label htmlFor="chemicals-no">No</Label>
//                                         </div>
//                                     </RadioGroup>

//                                     {/* If Yes Please specify the name */}
//                                     <div className="mt-4">
//                                         <Label htmlFor="chemicalName" className="text-sm font-medium text-gray-700">
//                                             If 'Yes' Please specify the name :
//                                         </Label>
//                                         <Input
//                                             id="chemicalName"
//                                             value={detailedInfo.specifyTheName || ''}
//                                             onChange={(e) => handleDetailedInfoChange('specifyTheName', e.target.value)}
//                                             placeholder=""
//                                             className="mt-2"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Contractor's Material Storage Place required */}
//                                 <div>
//                                     <Label className="text-sm font-medium text-gray-700 block mb-3">
//                                         Contractor's Material Storage Place required :
//                                     </Label>
//                                     <RadioGroup
//                                         value={detailedInfo.contractorStoragePlaceRequired === null ? 'null' : detailedInfo.contractorStoragePlaceRequired === 'Yes' ? 'true' : 'false'}
//                                         onValueChange={(value) => handleDetailedInfoChange('contractorStoragePlaceRequired', value === 'true' ? 'Yes' : value === 'false' ? 'No' : null)}
//                                         className="flex gap-6"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="true" id="storage-yes" />
//                                             <Label htmlFor="storage-yes">Yes</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="false" id="storage-no" />
//                                             <Label htmlFor="storage-no">No</Label>
//                                         </div>
//                                     </RadioGroup>

//                                     {/* Area Allocated */}
//                                     <div className="mt-4">
//                                         <Label htmlFor="areaAllocated" className="text-sm font-medium text-gray-700">
//                                             Area Allocated :
//                                         </Label>
//                                         <Input
//                                             id="areaAllocated"
//                                             value={detailedInfo.areaAllocated || ''}
//                                             onChange={(e) => handleDetailedInfoChange('areaAllocated', e.target.value)}
//                                             placeholder=""
//                                             className="mt-2"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Any Simultaneous Operations */}
//                                 <div>
//                                     <Label className="text-sm font-medium text-gray-700 block mb-3">
//                                         Any Simultaneous Operations :
//                                     </Label>
//                                     <RadioGroup
//                                         value={detailedInfo.anySimultaneousOperations === null ? 'null' : detailedInfo.anySimultaneousOperations === 'Yes' ? 'true' : 'false'}
//                                         onValueChange={(value) => handleDetailedInfoChange('anySimultaneousOperations', value === 'true' ? 'Yes' : value === 'false' ? 'No' : null)}
//                                         className="flex gap-6"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="true" id="simultaneous-yes" />
//                                             <Label htmlFor="simultaneous-yes">Yes</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="false" id="simultaneous-no" />
//                                             <Label htmlFor="simultaneous-no">No</Label>
//                                         </div>
//                                     </RadioGroup>

//                                     {/* If Yes specify the Operation */}
//                                     <div className="mt-4">
//                                         <Label htmlFor="operationSpecification" className="text-sm font-medium text-gray-700">
//                                             If Yes specify the Operation :
//                                         </Label>
//                                         <Input
//                                             id="operationSpecification"
//                                             value={detailedInfo.specifyTheOperation || ''}
//                                             onChange={(e) => handleDetailedInfoChange('specifyTheOperation', e.target.value)}
//                                             placeholder=""
//                                             className="mt-2"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Necessary PPEs provided */}
//                                 <div>
//                                     <Label className="text-sm font-medium text-gray-700 block mb-3">
//                                         Necessary PPEs provided :
//                                     </Label>
//                                     <div className="text-xs text-gray-500 mb-2">(to be returned back to security )</div>
//                                     <RadioGroup
//                                         value={detailedInfo.necessaryPpesProvided === null ? 'null' : detailedInfo.necessaryPpesProvided === 'Yes' ? 'true' : 'false'}
//                                         onValueChange={(value) => handleDetailedInfoChange('necessaryPpesProvided', value === 'true' ? 'Yes' : value === 'false' ? 'No' : null)}
//                                         className="flex gap-6"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="true" id="ppe-yes" />
//                                             <Label htmlFor="ppe-yes">Yes</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="false" id="ppe-no" />
//                                             <Label htmlFor="ppe-no">No</Label>
//                                         </div>
//                                     </RadioGroup>
//                                 </div>

//                                 {/* Utilities to be provided by company */}
//                                 <div>
//                                     <Label className="text-sm font-medium text-gray-700 block mb-3">
//                                         Utilities to be provided by company :
//                                     </Label>
//                                     <div className="flex gap-6">
//                                         <div className="flex items-center space-x-2">
//                                             <Checkbox
//                                                 id="water-supply"
//                                                 checked={detailedInfo.utilitiesToBeProvidedByCompany.waterSupply === 'Yes'}
//                                                 onCheckedChange={(checked) => handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
//                                                     ...detailedInfo.utilitiesToBeProvidedByCompany,
//                                                     waterSupply: checked ? 'Yes' : 'No'
//                                                 })}
//                                             />
//                                             <Label htmlFor="water-supply">Water Supply</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <Checkbox
//                                                 id="electrical-supply"
//                                                 checked={detailedInfo.utilitiesToBeProvidedByCompany.electricalSupply === 'Yes'}
//                                                 onCheckedChange={(checked) => handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
//                                                     ...detailedInfo.utilitiesToBeProvidedByCompany,
//                                                     electricalSupply: checked ? 'Yes' : 'No'
//                                                 })}
//                                             />
//                                             <Label htmlFor="electrical-supply">Electrical Supply</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <Checkbox
//                                                 id="air-supply"
//                                                 checked={detailedInfo.utilitiesToBeProvidedByCompany.airSupply === 'Yes'}
//                                                 onCheckedChange={(checked) => handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
//                                                     ...detailedInfo.utilitiesToBeProvidedByCompany,
//                                                     airSupply: checked ? 'Yes' : 'No'
//                                                 })}
//                                             />
//                                             <Label htmlFor="air-supply">Air Supply</Label>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Energy Isolation is required */}
//                                 <div>
//                                     <Label className="text-sm font-medium text-gray-700 block mb-3">
//                                         Energy Isolation is required :
//                                     </Label>
//                                     <RadioGroup
//                                         value={detailedInfo.energyIsolationRequired === null ? 'null' : detailedInfo.energyIsolationRequired === 'Yes' ? 'true' : 'false'}
//                                         onValueChange={(value) => handleDetailedInfoChange('energyIsolationRequired', value === 'true' ? 'Yes' : value === 'false' ? 'No' : null)}
//                                         className="flex gap-6"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="true" id="isolation-yes" />
//                                             <Label htmlFor="isolation-yes">Yes</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="false" id="isolation-no" />
//                                             <Label htmlFor="isolation-no">No</Label>
//                                         </div>
//                                     </RadioGroup>

//                                     {/* If Yes, Lock Out Tag Out details */}
//                                     <div className="mt-4">
//                                         <Label htmlFor="lockOutTagOutDetails" className="text-sm font-medium text-gray-700">
//                                             If Yes, Lock Out Tag Out details :
//                                         </Label>
//                                         <Input
//                                             id="lockOutTagOutDetails"
//                                             value={detailedInfo.tagOutDetails || ''}
//                                             onChange={(e) => handleDetailedInfoChange('tagOutDetails', e.target.value)}
//                                             placeholder=""
//                                             className="mt-2"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     {/* Energy Isolation Done By */}
//                                     <div>
//                                         <Label htmlFor="energyIsolationDoneBy" className="text-sm font-medium text-gray-700">
//                                             Energy Isolation Done By :
//                                         </Label>
//                                         <div className="text-xs text-gray-500 mb-2">(Name & Sign)</div>
//                                         <Input
//                                             id="energyIsolationDoneBy"
//                                             value={detailedInfo.energyIsolationDoneBy || ''}
//                                             onChange={(e) => handleDetailedInfoChange('energyIsolationDoneBy', e.target.value)}
//                                             placeholder=""
//                                             className="mt-2"
//                                         />
//                                     </div>

//                                     {/* Energy De-Isolation Done By */}
//                                     <div>
//                                         <Label htmlFor="energyDeIsolationDoneBy" className="text-sm font-medium text-gray-700">
//                                             Energy De-Isolation Done By :
//                                         </Label>
//                                         <div className="text-xs text-gray-500 mb-2">(Name & Sign)</div>
//                                         <Input
//                                             id="energyDeIsolationDoneBy"
//                                             value={detailedInfo.energyDeisolationDoneBy || ''}
//                                             onChange={(e) => handleDetailedInfoChange('energyDeisolationDoneBy', e.target.value)}
//                                             placeholder=""
//                                             className="mt-2"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Check Points */}
//                     <Card className="shadow-sm border border-gray-200">
//                         <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
//                             <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                 <CheckCircle className="w-5 h-5" />
//                                 Check Points
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <div className="overflow-x-auto">
//                                 <table className="w-full border-collapse border border-gray-300">
//                                     <thead>
//                                         <tr className="bg-gray-50">
//                                             <th className="border border-gray-300 p-4 text-left text-sm font-medium text-gray-900">
//                                                 Check Points
//                                             </th>
//                                             <th className="border border-gray-300 p-4 text-center text-sm font-medium text-gray-900 w-20">
//                                                 Req.
//                                             </th>
//                                             <th className="border border-gray-300 p-4 text-center text-sm font-medium text-gray-900 w-20">
//                                                 Checked
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {checkPoints.map((point) => (
//                                             <tr key={point.id} className="hover:bg-gray-50">
//                                                 <td className="border border-gray-300 p-4 text-sm text-gray-900">
//                                                     {point.description}
//                                                 </td>
//                                                 <td className="border border-gray-300 p-4 text-center">
//                                                     <div className="flex justify-center">
//                                                         <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-50"
//                                                             onClick={() => handleCheckPointChange(point.id, 'req', !point.req)}>
//                                                             {point.req && (
//                                                                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="border border-gray-300 p-4 text-center">
//                                                     <div className="flex justify-center">
//                                                         <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-50"
//                                                             onClick={() => handleCheckPointChange(point.id, 'checked', !point.checked)}>
//                                                             {point.checked && (
//                                                                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Persons Information */}
//                     <Card className="shadow-sm border border-gray-200">
//                         <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
//                             <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                 <User className="w-5 h-5" />
//                                 Persons Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-4">
//                                     <div>
//                                         <Label htmlFor="permitInitiatorName">Permit Initiator Name</Label>
//                                         <Input
//                                             id="permitInitiatorName"
//                                             value={personsInfo.permitInitiatorName}
//                                             onChange={(e) => setPersonsInfo(prev => ({ ...prev, permitInitiatorName: e.target.value }))}
//                                             className="mt-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <Label htmlFor="permitInitiatorContact">Contact Number</Label>
//                                         <Input
//                                             id="permitInitiatorContact"
//                                             value={personsInfo.permitInitiatorContact}
//                                             onChange={(e) => setPersonsInfo(prev => ({ ...prev, permitInitiatorContact: e.target.value }))}
//                                             className="mt-2"
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="contractorSupervisorName">Contractor's Supervisor</Label>
//                                         <Input
//                                             id="contractorSupervisorName"
//                                             value={personsInfo.contractorSupervisorName}
//                                             onChange={(e) => setPersonsInfo(prev => ({ ...prev, contractorSupervisorName: e.target.value }))}
//                                             placeholder="Enter Contract Supervisor Name"
//                                             className="mt-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <Label htmlFor="contractorSupervisorContact">Contact Number</Label>
//                                         <Input
//                                             id="contractorSupervisorContact"
//                                             value={personsInfo.contractorSupervisorContact}
//                                             onChange={(e) => setPersonsInfo(prev => ({ ...prev, contractorSupervisorContact: e.target.value }))}
//                                             placeholder="Enter Contract Supervisor Number"
//                                             className="mt-2"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div>
//                                         <Label htmlFor="permitIssuerName">Permit Issuer</Label>
//                                         <Select
//                                             value={personsInfo.permitIssuerName}
//                                             onValueChange={(value) => setPersonsInfo(prev => ({ ...prev, permitIssuerName: value }))}
//                                         >
//                                             <SelectTrigger className="mt-2">
//                                                 <SelectValue placeholder="Select Permit Issuer" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {permitIssuerOptions.map((option) => (
//                                                     <SelectItem key={option.value} value={option.label}>
//                                                         {option.label}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="safetyOfficerName">Safety Officer</Label>
//                                         <Select
//                                             value={personsInfo.safetyOfficerName}
//                                             onValueChange={(value) => setPersonsInfo(prev => ({ ...prev, safetyOfficerName: value }))}
//                                         >
//                                             <SelectTrigger className="mt-2">
//                                                 <SelectValue placeholder="Select Safety Officer" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {safetyOfficerOptions.map((option) => (
//                                                     <SelectItem key={option.value} value={option.label}>
//                                                         {option.label}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Declaration */}
//                     <Card className="shadow-sm border border-gray-200">
//                         <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
//                             <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                 <FileText className="w-5 h-5" />
//                                 Declaration
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <div className="bg-gray-50 p-4 rounded-lg border">
//                                 <p className="text-sm text-gray-800 leading-relaxed">
//                                     <strong>Declaration – </strong>
//                                     I have understood all the hazard and risk associated in the activity I pledge to implement on the control measure identified in the activity through risk analyses JSA and SOP. I Hereby declare that the details given above are correct and also I have been trained by our company for the above mentioned work & I am mentally and physically fit, Alcohol/drugs free to perform it, will be performed with appropriate safety and supervision as per Panchshil Test & Norms
//                                 </p>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//                                 <div className="p-3 border border-gray-200 rounded">
//                                     <Label className="text-xs text-gray-500">Contractor supervisor</Label>
//                                     <div className="h-8 border-b border-gray-300 mt-2"></div>
//                                 </div>
//                                 <div className="p-3 border border-gray-200 rounded">
//                                     <Label className="text-xs text-gray-500">Permit Initiator</Label>
//                                     <div className="h-8 border-b border-gray-300 mt-2"></div>
//                                 </div>
//                                 <div className="p-3 border border-gray-200 rounded">
//                                     <Label className="text-xs text-gray-500">Permit Issuer</Label>
//                                     <div className="h-8 border-b border-gray-300 mt-2"></div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Daily Extension Sheet */}
//                     <Card className="shadow-sm border border-gray-200">
//                         <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
//                             <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                 <Calendar className="w-5 h-5" />
//                                 DAILY EXTENSION SHEET
//                             </CardTitle>
//                             <p className="text-sm text-gray-600 mt-1">
//                                 (Permit Issuer require if there is extension in working time)
//                             </p>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <div className="overflow-x-auto">
//                                 <table className="w-full border-collapse border border-gray-300">
//                                     <thead>
//                                         <tr className="bg-gray-50">
//                                             <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Date</th>
//                                             <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Time</th>
//                                             <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Description</th>
//                                             <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Contractor's Manpower</th>
//                                             <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Contractor's supervisor</th>
//                                             <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Permit Initiator</th>
//                                             <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Permit Issuer</th>
//                                             <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Safety Officer</th>
//                                             <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Time extension</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {dailyExtensions.map((extension) => (
//                                             <tr key={extension.id}>
//                                                 <td className="border border-gray-300 p-3 text-xs h-12">{extension.date || ''}</td>
//                                                 <td className="border border-gray-300 p-3 text-xs h-12">{extension.time || ''}</td>
//                                                 <td className="border border-gray-300 p-3 text-xs h-12">{extension.description || ''}</td>
//                                                 <td className="border border-gray-300 p-3 text-xs h-12">{extension.contractors_manpower || ''}</td>
//                                                 <td className="border border-gray-300 p-3 text-xs h-12">{extension.contractors_supervisor || ''}</td>
//                                                 <td className="border border-gray-300 p-3 text-xs h-12 text-center">{extension.permit_initiator || ''}</td>
//                                                 <td className="border border-gray-300 p-3 text-xs h-12 text-center">{extension.permit_issuer || ''}</td>
//                                                 <td className="border border-gray-300 p-3 text-xs h-12 text-center">{extension.safety_officer || ''}</td>
//                                                 <td className="border border-gray-300 p-3 text-xs h-12">{extension.time_extension || ''}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Work Permit Closure Format */}
//                     <Card className="shadow-sm border border-gray-200">
//                         <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
//                             <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                 <CheckCircle className="w-5 h-5" />
//                                 WORK PERMIT CLOSURE FORMAT
//                             </CardTitle>
//                             <p className="text-sm text-gray-600 mt-1">
//                                 This format is to be filled by the persons who had raised the Work Permit. All the below mentioned points must be checked & completed by him after the work is completed
//                             </p>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <div className="overflow-x-auto">
//                                 <table className="w-full border-collapse border border-gray-300">
//                                     <thead>
//                                         <tr className="bg-gray-50">
//                                             <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900 w-32">Attributes</th>
//                                             <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900">Initiator</th>
//                                             <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900">Issuer</th>
//                                             <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900">Security Dept</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         <tr>
//                                             <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Attributes</td>
//                                             <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[0]?.initiator || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[0]?.issuer || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[0]?.security_dept || ''}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Declaration</td>
//                                             <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[1]?.initiator || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[1]?.issuer || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[1]?.security_dept || ''}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="border border-gray-300 p-3 text-sm"></td>
//                                             <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[2]?.initiator || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[2]?.issuer || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[2]?.security_dept || ''}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Name and Signature</td>
//                                             <td className="border border-gray-300 p-3 text-sm text-center">{workPermitClosure.signatures?.initiator || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm text-center">{workPermitClosure.signatures?.issuer || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm text-center">{workPermitClosure.signatures?.security_dept || ''}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Date and time</td>
//                                             <td className="border border-gray-300 p-3 text-sm h-12">{workPermitClosure.date_and_time?.initiator || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm h-12">{workPermitClosure.date_and_time?.issuer || ''}</td>
//                                             <td className="border border-gray-300 p-3 text-sm h-12">{workPermitClosure.date_and_time?.security_dept || ''}</td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Documents to be Enclosed */}
//                     <Card className="shadow-sm border border-gray-200">
//                         <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
//                             <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                 <Upload className="w-5 h-5" />
//                                 DOCUMENTS TO BE ENCLOSED HERE
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <div className="overflow-x-auto">
//                                 <table className="w-full border-collapse border border-gray-300">
//                                     <thead>
//                                         <tr className="bg-gray-50">
//                                             <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900 w-20">Sr.No.</th>
//                                             <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900">Document Name</th>
//                                             <th className="border border-gray-300 p-3 text-center text-sm font-medium text-gray-900 w-32">Mark Yes/No</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {attachments.map((document, index) => (
//                                             <tr key={document.id}>
//                                                 <td className="border border-gray-300 p-3 text-sm text-center">{document.sr_no || index + 1}.</td>
//                                                 <td className="border border-gray-300 p-3 text-sm text-center">{document.name}</td>
//                                                 <td className="border border-gray-300 p-3 text-sm text-center">
//                                                     {document.workVoucher ? 'Yes' : 'No'}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Save Button */}
//                     <div className="flex justify-center pt-6">
//                         <Button
//                             type="submit"
//                             disabled={loading}
//                             className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-8 py-2 text-sm font-medium rounded"
//                         >
//                             {loading ? (
//                                 <>
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                     Saving...
//                                 </>
//                             ) : (
//                                 'Save'
//                             )}
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default FillForm;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    FileText,
    User,
    Shield,
    CheckCircle,
    Calendar,
    Upload
} from "lucide-react";
import { toast } from "sonner";

interface ExtensionEntry {
    id: string;
    date: string | null;
    time: string | null;
    description: string | null;
    contractors_manpower: string | null;
    contractors_supervisor: string | null;
    permit_initiator: string | null;
    permit_issuer: string | null;
    safety_officer: string | null;
    time_extension: string | null;
}

interface AttachmentFile {
    id: string;
    name: string;
    workVoucher: boolean;
    file: File | null;
    sr_no?: number;
}

export const FillForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    // Basic Information State
    const [basicInfo, setBasicInfo] = useState({
        docNo: '',
        permitRequestedDate: '',
        permitId: '',
        rev: '',
        permitIssueDate: ''
    });

    // Detailed Information State
    const [detailedInfo, setDetailedInfo] = useState({
        jobDescription: '',
        location: '',
        permitInitiatedBy: '',
        initiatorsDepartment: '',
        initiatorsContact: '',
        nameOfContractor: '',
        contractorsContact: '',
        addressOfContractor: '',
        contractorsManpower: 0,
        jobSafetyAnalysisRequired: null as string | null,
        emergencyContactName: '',
        emergencyContactNumber: '',
        msdsAvailableForChemicalUse: null as string | null,
        specifyTheName: '',
        contractorStoragePlaceRequired: null as string | null,
        areaAllocated: '',
        anySimultaneousOperations: null as string | null,
        specifyTheOperation: '',
        necessaryPpesProvided: null as string | null,
        utilitiesToBeProvidedByCompany: {
            waterSupply: null as string | null,
            electricalSupply: null as string | null,
            airSupply: null as string | null
        },
        energyIsolationRequired: null as string | null,
        tagOutDetails: '',
        energyIsolationDoneBy: '',
        energyDeisolationDoneBy: ''
    });

    // Emergency & Safety Information
    const [emergencyInfo, setEmergencyInfo] = useState({
        contractorEmployeesList: false
    });

    // Check Points
    const [checkPoints, setCheckPoints] = useState([
        {
            id: '1',
            description: 'Surrounding area checked, Cleaned and covered. Proper ventilation and lighting provided.',
            req: false,
            checked: false
        },
        {
            id: '2',
            description: 'Area Cordoned off & caution boards/tags provided',
            req: false,
            checked: false
        },
        {
            id: '3',
            description: "All Lifting tool & tackles of contractor's are inspected & certified.",
            req: false,
            checked: false
        },
        {
            id: '4',
            description: 'Necessary PPEs are provided',
            req: false,
            checked: false
        }
    ]);

    // Persons Information
    const [personsInfo, setPersonsInfo] = useState({
        permitInitiatorName: '',
        permitInitiatorContact: '',
        contractorSupervisorName: '',
        contractorSupervisorContact: '',
        permitIssuerName: '',
        permitIssuerContact: '',
        safetyOfficerName: '',
        safetyOfficerContact: ''
    });

    // Declaration
    const [declaration] = useState(
        'I have understood all the hazard and risk associated in the activity I pledge to implement on the control measure identified in the activity through risk analyses JSA and SOP. I Hereby declare that the details given above are correct and also I have been trained by our company for the above mentioned work & I am mentally and physically fit, Alcohol/drugs free to perform it, will be performed with appropriate safety and supervision as per Panchshil Test & Norms'
    );

    // Daily Extension Sheet
    const [dailyExtensions, setDailyExtensions] = useState<ExtensionEntry[]>([]);

    // Work Permit Closure
    const [workPermitClosure, setWorkPermitClosure] = useState({
        declarations: [
            { initiator: '', issuer: '', security_dept: '' },
            { initiator: '', issuer: '', security_dept: '' },
            { initiator: '', issuer: '', security_dept: '' }
        ],
        signatures: { initiator: '', issuer: '', security_dept: '' },
        date_and_time: { initiator: '', issuer: '', security_dept: '' }
    });

    // Attachments
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

    useEffect(() => {
        if (id) {
            fetchPermitDetails(id);
        }
    }, [id]);

    const fetchPermitDetails = async (permitId: string) => {
        try {
            let baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                toast.error('Authentication required');
                return;
            }

            // Add https:// prefix if not present
            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = `https://${baseUrl}`;
            }

            // Extract just the permit ID if the permitId contains the full API path
            let actualPermitId = permitId;
            if (permitId.includes('.json')) {
                // Extract the permit ID from a URL like "fm-uat-api.lockated.com/pms/permits/11780.json"
                const matches = permitId.match(/\/permits\/(\d+)\.json$/);
                if (matches && matches[1]) {
                    actualPermitId = matches[1];
                } else {
                    // Fallback: extract numbers from the end before .json
                    const idMatch = permitId.match(/(\d+)\.json$/);
                    if (idMatch && idMatch[1]) {
                        actualPermitId = idMatch[1];
                    }
                }
            }

            console.log('Original permitId:', permitId);
            console.log('Extracted actualPermitId:', actualPermitId);

            setLoading(true);
            const response = await fetch(`${baseUrl}/pms/permits/${actualPermitId}/fill_form.json`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache'
            });

            if (response.ok) {
                const data = await response.json();
                const permitData = data.pms_permit;

                setBasicInfo({
                    docNo: permitData.basic_information?.doc_no || '',
                    permitRequestedDate: permitData.basic_information?.permit_requested_date || '',
                    permitId: permitData.basic_information?.permit_id || permitId,
                    rev: permitData.basic_information?.rev || '',
                    permitIssueDate: permitData.basic_information?.permit_issue_date || ''
                });

                setDetailedInfo({
                    jobDescription: permitData.detailed_information?.job_description || '',
                    location: permitData.detailed_information?.location || '',
                    permitInitiatedBy: permitData.detailed_information?.permit_initiated_by || '',
                    initiatorsDepartment: permitData.detailed_information?.initiators_department || '',
                    initiatorsContact: permitData.detailed_information?.initiators_contact || '',
                    nameOfContractor: permitData.detailed_information?.name_of_contractor || '',
                    contractorsContact: permitData.detailed_information?.contractors_contact || '',
                    addressOfContractor: permitData.detailed_information?.address_of_contractor || '',
                    contractorsManpower: permitData.detailed_information?.contractors_manpower || 0,
                    jobSafetyAnalysisRequired: permitData.detailed_information?.job_safety_analysis_required || null,
                    emergencyContactName: permitData.detailed_information?.emergency_contact_name || '',
                    emergencyContactNumber: permitData.detailed_information?.emergency_contact_number || '',
                    msdsAvailableForChemicalUse: permitData.detailed_information?.msds_available_for_chemical_use || null,
                    specifyTheName: permitData.detailed_information?.specify_the_name || '',
                    contractorStoragePlaceRequired: permitData.detailed_information?.contractor_storage_place_required || null,
                    areaAllocated: permitData.detailed_information?.area_allocated || '',
                    anySimultaneousOperations: permitData.detailed_information?.any_simultaneous_operations || null,
                    specifyTheOperation: permitData.detailed_information?.specify_the_operation || '',
                    necessaryPpesProvided: permitData.detailed_information?.necessary_ppes_provided || null,
                    utilitiesToBeProvidedByCompany: {
                        waterSupply: permitData.detailed_information?.utilities_to_be_provided_by_company?.water_supply || null,
                        electricalSupply: permitData.detailed_information?.utilities_to_be_provided_by_company?.electrical_supply || null,
                        airSupply: permitData.detailed_information?.utilities_to_be_provided_by_company?.air_supply || null
                    },
                    energyIsolationRequired: permitData.detailed_information?.energy_isolation_required || null,
                    tagOutDetails: permitData.detailed_information?.tag_out_details || '',
                    energyIsolationDoneBy: permitData.detailed_information?.energy_isolation_done_by || '',
                    energyDeisolationDoneBy: permitData.detailed_information?.energy_deisolation_done_by || ''
                });

                setCheckPoints(prev =>
                    prev.map(item => {
                        switch (item.id) {
                            case '1':
                                return {
                                    ...item,
                                    req: permitData.check_points?.surrounding_area?.req_or_not === 'Yes',
                                    checked: permitData.check_points?.surrounding_area?.checked === 'Yes'
                                };
                            case '2':
                                return {
                                    ...item,
                                    req: permitData.check_points?.area_cordoned_off?.req_or_not === 'Yes',
                                    checked: permitData.check_points?.area_cordoned_off?.checked === 'Yes'
                                };
                            case '3':
                                return {
                                    ...item,
                                    req: permitData.check_points?.lifting_tool?.req_or_not === 'Yes',
                                    checked: permitData.check_points?.lifting_tool?.checked === 'Yes'
                                };
                            case '4':
                                return {
                                    ...item,
                                    req: permitData.check_points?.necessary_ppes?.req_or_not === 'Yes',
                                    checked: permitData.check_points?.necessary_ppes?.checked === 'Yes'
                                };
                            default:
                                return item;
                        }
                    })
                );

                setPersonsInfo({
                    permitInitiatorName: permitData.persons_information?.permit_initiator?.name || '',
                    permitInitiatorContact: permitData.persons_information?.permit_initiator?.contact_number || '',
                    contractorSupervisorName: permitData.persons_information?.contractors_supervisor?.name || '',
                    contractorSupervisorContact: permitData.persons_information?.contractors_supervisor?.contact_number || '',
                    permitIssuerName: permitData.persons_information?.permit_issuer?.name || '',
                    permitIssuerContact: permitData.persons_information?.permit_issuer?.contact_number || '',
                    safetyOfficerName: permitData.persons_information?.safety_officer?.name || '',
                    safetyOfficerContact: permitData.persons_information?.safety_officer?.contact_number || ''
                });

                setDailyExtensions(
                    permitData.daily_extension_sheet?.rows?.map((row: any, index: number) => ({
                        id: (index + 1).toString(),
                        date: row.date || null,
                        time: row.time || null,
                        description: row.description || null,
                        contractors_manpower: row.contractors_manpower || null,
                        contractors_supervisor: row.contractors_supervisor || null,
                        permit_initiator: row.permit_initiator || '',
                        permit_issuer: row.permit_issuer || null,
                        safety_officer: row.safety_officer || null,
                        time_extension: row.time_extension || null
                    })) || []
                );

                setWorkPermitClosure({
                    declarations: permitData.work_permit_closure?.declarations || [
                        { initiator: '', issuer: '', security_dept: '' },
                        { initiator: '', issuer: '', security_dept: '' },
                        { initiator: '', issuer: '', security_dept: '' }
                    ],
                    signatures: {
                        initiator: permitData.work_permit_closure?.signatures?.initiator || '',
                        issuer: permitData.work_permit_closure?.signatures?.issuer || '',
                        security_dept: permitData.work_permit_closure?.signatures?.security_dept || ''
                    },
                    date_and_time: {
                        initiator: permitData.work_permit_closure?.date_and_time?.initiator || '',
                        issuer: permitData.work_permit_closure?.date_and_time?.issuer || '',
                        security_dept: permitData.work_permit_closure?.date_and_time?.security_dept || ''
                    }
                });

                setAttachments(
                    permitData.documents?.map((doc: any) => ({
                        id: doc.sr_no?.toString() || Math.random().toString(),
                        name: doc.name || '',
                        workVoucher: doc.status === 'Yes',
                        file: null,
                        sr_no: doc.sr_no || 0
                    })) || []
                );
            } else {
                toast.error('Failed to load permit details');
            }
        } catch (error) {
            console.error('Error fetching permit details:', error);
            toast.error('Error loading permit details');
        } finally {
            setLoading(false);
        }
    };

    const handleBasicInfoChange = (field: string, value: string) => {
        setBasicInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleDetailedInfoChange = (field: string, value: any) => {
        setDetailedInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckPointChange = (id: string, field: 'req' | 'checked', checked: boolean) => {
        setCheckPoints(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: checked } : item
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token || !id) {
                toast.error('Authentication or permit ID missing');
                setLoading(false);
                return;
            }

            // Add https:// prefix if not present
            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = `https://${baseUrl}`;
            }

            // Extract just the permit ID if the id contains the full API path
            let actualPermitId = id;
            if (id.includes('.json')) {
                // Extract the permit ID from a URL like "fm-uat-api.lockated.com/pms/permits/11780.json"
                const matches = id.match(/\/permits\/(\d+)\.json$/);
                if (matches && matches[1]) {
                    actualPermitId = matches[1];
                } else {
                    // Fallback: extract numbers from the end before .json
                    const idMatch = id.match(/(\d+)\.json$/);
                    if (idMatch && idMatch[1]) {
                        actualPermitId = idMatch[1];
                    }
                }
            }

            console.log('Submit - Original id:', id);
            console.log('Submit - Extracted actualPermitId:', actualPermitId);

            // Prepare form data
            const formData = new URLSearchParams();
            formData.append('pms_permit_form[form_submitted]', 'true');
            formData.append('pms_permit_form[job_safety_analysis_required]', detailedInfo.jobSafetyAnalysisRequired || 'No');
            formData.append('pms_permit_form[emergency_contact_name]', detailedInfo.emergencyContactName || '');
            formData.append('pms_permit_form[emergency_contact_number]', detailedInfo.emergencyContactNumber || '');
            formData.append('pms_permit_form[msds_available_for_chemical_use]', detailedInfo.msdsAvailableForChemicalUse || 'No');
            formData.append('pms_permit_form[specify_the_name]', detailedInfo.specifyTheName || '');
            formData.append('pms_permit_form[contractor_storage_place_required]', detailedInfo.contractorStoragePlaceRequired || 'No');
            formData.append('pms_permit_form[area_allocated]', detailedInfo.areaAllocated || '');
            formData.append('pms_permit_form[any_simultaneous_operations]', detailedInfo.anySimultaneousOperations || 'No');
            formData.append('pms_permit_form[specify_the_operation]', detailedInfo.specifyTheOperation || '');
            formData.append('pms_permit_form[necessary_ppes_provided]', detailedInfo.necessaryPpesProvided || 'No');

            // Handle utilities_to_be_provided_by_company
            const utilities = [
                detailedInfo.utilitiesToBeProvidedByCompany.waterSupply === 'Yes' ? 'Water Supply' : '',
                detailedInfo.utilitiesToBeProvidedByCompany.electricalSupply === 'Yes' ? 'Electrical Supply' : '',
                detailedInfo.utilitiesToBeProvidedByCompany.airSupply === 'Yes' ? 'Air Supply' : ''
            ].filter(Boolean).join(', ');
            formData.append('pms_permit_form[utilities_to_be_provided_by_company2]', utilities);

            formData.append('pms_permit_form[energy_isolation_required]', detailedInfo.energyIsolationRequired || 'No');
            formData.append('pms_permit_form[tag_out_details]', detailedInfo.tagOutDetails || '');
            formData.append('pms_permit_form[energy_isolation_done_by]', detailedInfo.energyIsolationDoneBy || '');
            formData.append('pms_permit_form[energy_deisolation_done_by]', detailedInfo.energyDeisolationDoneBy || '');

            // Check Points
            formData.append('pms_permit_form[surrounding_area_checked_req_or_not]', checkPoints[0].req ? 'Req' : 'Not Req');
            formData.append('pms_permit_form[surrounding_area_checked_chk]', checkPoints[0].checked ? 'Checked' : 'Not Checked');
            formData.append('pms_permit_form[area_cordoned_off_req_or_not]', checkPoints[1].req ? 'Req' : 'Not Req');
            formData.append('pms_permit_form[area_cordoned_off_chk]', checkPoints[1].checked ? 'Checked' : 'Not Checked');
            formData.append('pms_permit_form[all_lifting_tool_req_or_not]', checkPoints[2].req ? 'Req' : 'Not Req');
            formData.append('pms_permit_form[all_lifting_tool_chk]', checkPoints[2].checked ? 'Checked' : 'Not Checked');
            formData.append('pms_permit_form[necessary_ppes_are_provided_req_or_not]', checkPoints[3].req ? 'Req' : 'Not Req');
            formData.append('pms_permit_form[necessary_ppes_are_provided_chk]', checkPoints[3].checked ? 'Checked' : 'Not Checked');

            formData.append('pms_permit_form[contract_supervisor_name]', personsInfo.contractorSupervisorName || '');
            formData.append('pms_permit_form[contract_supervisor_number]', personsInfo.contractorSupervisorContact || '');
            formData.append('pms_permit_form[permit_issuer_id]', '12437'); // Replace with dynamic value if available

            const response = await fetch(`${baseUrl}/pms/permits/${actualPermitId}/update_submit_form.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                toast.success('Cold Work Permit form submitted successfully!');
                navigate('/safety/permit');
            } else {
                const errorData = await response.json();
                toast.error(`Failed to submit permit form: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting permit form:', error);
            toast.error('Error submitting permit form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            COLD WORK PERMIT
                            {id && <span className="text-sm text-gray-600 ml-2">(Permit ID: {id})</span>}
                        </h1>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                        FILL FORM
                    </Badge>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
                                    <span className="ml-2 text-gray-600">Loading permit details...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="docNo">Doc No</Label>
                                            <Input
                                                id="docNo"
                                                value={basicInfo.docNo}
                                                onChange={(e) => handleBasicInfoChange('docNo', e.target.value)}
                                                placeholder="Enter document number"
                                                readOnly
                                                className="bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="permitRequestedDate">Permit Requested Date</Label>
                                            <Input
                                                id="permitRequestedDate"
                                                value={basicInfo.permitRequestedDate}
                                                onChange={(e) => handleBasicInfoChange('permitRequestedDate', e.target.value)}
                                                placeholder="DD/MM/YYYY"
                                                readOnly
                                                className="bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="permitId">Permit Id</Label>
                                            <Input
                                                id="permitId"
                                                value={basicInfo.permitId}
                                                onChange={(e) => handleBasicInfoChange('permitId', e.target.value)}
                                                placeholder="Enter permit ID"
                                                readOnly
                                                className="bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="rev">Rev</Label>
                                            <Input
                                                id="rev"
                                                value={basicInfo.rev}
                                                onChange={(e) => handleBasicInfoChange('rev', e.target.value)}
                                                placeholder="Enter revision"
                                                readOnly
                                                className="bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="permitIssueDate">Permit Issue Date</Label>
                                            <Input
                                                id="permitIssueDate"
                                                value={basicInfo.permitIssueDate}
                                                onChange={(e) => handleBasicInfoChange('permitIssueDate', e.target.value)}
                                                placeholder="DD/MM/YYYY"
                                                readOnly
                                                className="bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Detailed Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Detailed Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="jobDescription">Job Description</Label>
                                        <Textarea
                                            id="jobDescription"
                                            value={detailedInfo.jobDescription}
                                            onChange={(e) => handleDetailedInfoChange('jobDescription', e.target.value)}
                                            placeholder="Enter job description"
                                            rows={3}
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="permitInitiatedBy">Permit Initiated by</Label>
                                        <Input
                                            id="permitInitiatedBy"
                                            value={detailedInfo.permitInitiatedBy}
                                            onChange={(e) => handleDetailedInfoChange('permitInitiatedBy', e.target.value)}
                                            placeholder="Enter initiator name"
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="initiatorsContact">Initiator's Contact</Label>
                                        <Input
                                            id="initiatorsContact"
                                            value={detailedInfo.initiatorsContact}
                                            onChange={(e) => handleDetailedInfoChange('initiatorsContact', e.target.value)}
                                            placeholder="Enter initiator contact"
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contractorsContact">Contractor's Contact</Label>
                                        <Input
                                            id="contractorsContact"
                                            value={detailedInfo.contractorsContact}
                                            onChange={(e) => handleDetailedInfoChange('contractorsContact', e.target.value)}
                                            placeholder="Enter contractor contact"
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Textarea
                                            id="location"
                                            value={detailedInfo.location}
                                            onChange={(e) => handleDetailedInfoChange('location', e.target.value)}
                                            placeholder="Enter location"
                                            rows={3}
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="initiatorsDepartment">Initiator's Department</Label>
                                        <Input
                                            id="initiatorsDepartment"
                                            value={detailedInfo.initiatorsDepartment}
                                            onChange={(e) => handleDetailedInfoChange('initiatorsDepartment', e.target.value)}
                                            placeholder="Enter department"
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nameOfContractor">Name of Contractor</Label>
                                        <Input
                                            id="nameOfContractor"
                                            value={detailedInfo.nameOfContractor}
                                            onChange={(e) => handleDetailedInfoChange('nameOfContractor', e.target.value)}
                                            placeholder="Enter contractor name"
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="addressOfContractor">Address of Contractor</Label>
                                        <Input
                                            id="addressOfContractor"
                                            value={detailedInfo.addressOfContractor}
                                            onChange={(e) => handleDetailedInfoChange('addressOfContractor', e.target.value)}
                                            placeholder="Enter contractor address"
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contractorsManpower">Contractor's Manpower</Label>
                                        <Input
                                            id="contractorsManpower"
                                            type="number"
                                            value={detailedInfo.contractorsManpower}
                                            onChange={(e) => handleDetailedInfoChange('contractorsManpower', parseInt(e.target.value) || 0)}
                                            placeholder="Enter manpower count"
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Safety & Emergency Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Safety & Emergency Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-6">


                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Job Safety Analysis required:
                                    </Label>
                                    <div className="text-xs text-gray-500 mb-2">(if yes, do it on attached sheet)</div>
                                    <RadioGroup
                                        value={detailedInfo.jobSafetyAnalysisRequired || 'null'}
                                        onValueChange={(value) => handleDetailedInfoChange('jobSafetyAnalysisRequired', value === 'null' ? null : value)}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Yes" id="jsa-yes" />
                                            <Label htmlFor="jsa-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="No" id="jsa-no" />
                                            <Label htmlFor="jsa-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="emergencyContactName">Emergency Contact Name:</Label>
                                        <Input
                                            id="emergencyContactName"
                                            value={detailedInfo.emergencyContactName}
                                            onChange={(e) => handleDetailedInfoChange('emergencyContactName', e.target.value)}
                                            placeholder="Enter emergency contact name"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="emergencyContactNumber">Emergency Contact Number:</Label>
                                        <Input
                                            id="emergencyContactNumber"
                                            value={detailedInfo.emergencyContactNumber}
                                            onChange={(e) => handleDetailedInfoChange('emergencyContactNumber', e.target.value)}
                                            placeholder="Enter emergency contact number"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Any Chemicals to be used then MSDS available:
                                    </Label>
                                    <div className="text-xs text-gray-500 mb-2">(if yes, please attach MSDS)</div>
                                    <RadioGroup
                                        value={detailedInfo.msdsAvailableForChemicalUse || 'null'}
                                        onValueChange={(value) => handleDetailedInfoChange('msdsAvailableForChemicalUse', value === 'null' ? null : value)}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Yes" id="chemicals-yes" />
                                            <Label htmlFor="chemicals-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="No" id="chemicals-no" />
                                            <Label htmlFor="chemicals-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                    <div className="mt-4">
                                        <Label htmlFor="specifyTheName">If Yes, specify the name:</Label>
                                        <Input
                                            id="specifyTheName"
                                            value={detailedInfo.specifyTheName}
                                            onChange={(e) => handleDetailedInfoChange('specifyTheName', e.target.value)}
                                            placeholder="Specify chemical name"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Contractor's Material Storage Place required:
                                    </Label>
                                    <RadioGroup
                                        value={detailedInfo.contractorStoragePlaceRequired || 'null'}
                                        onValueChange={(value) => handleDetailedInfoChange('contractorStoragePlaceRequired', value === 'null' ? null : value)}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Yes" id="storage-yes" />
                                            <Label htmlFor="storage-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="No" id="storage-no" />
                                            <Label htmlFor="storage-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                    <div className="mt-4">
                                        <Label htmlFor="areaAllocated">Area Allocated:</Label>
                                        <Input
                                            id="areaAllocated"
                                            value={detailedInfo.areaAllocated}
                                            onChange={(e) => handleDetailedInfoChange('areaAllocated', e.target.value)}
                                            placeholder="Specify allocated area"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Any Simultaneous Operations:
                                    </Label>
                                    <RadioGroup
                                        value={detailedInfo.anySimultaneousOperations || 'null'}
                                        onValueChange={(value) => handleDetailedInfoChange('anySimultaneousOperations', value === 'null' ? null : value)}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Yes" id="simultaneous-yes" />
                                            <Label htmlFor="simultaneous-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="No" id="simultaneous-no" />
                                            <Label htmlFor="simultaneous-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                    <div className="mt-4">
                                        <Label htmlFor="specifyTheOperation">If Yes, specify the operation:</Label>
                                        <Input
                                            id="specifyTheOperation"
                                            value={detailedInfo.specifyTheOperation}
                                            onChange={(e) => handleDetailedInfoChange('specifyTheOperation', e.target.value)}
                                            placeholder="Specify operation"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Necessary PPEs provided:
                                    </Label>
                                    <div className="text-xs text-gray-500 mb-2">(to be returned back to security)</div>
                                    <RadioGroup
                                        value={detailedInfo.necessaryPpesProvided || 'null'}
                                        onValueChange={(value) => handleDetailedInfoChange('necessaryPpesProvided', value === 'null' ? null : value)}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="By Contractor" id="ppe-contractor" />
                                            <Label htmlFor="ppe-contractor">By Contractor</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="No" id="ppe-no" />
                                            <Label htmlFor="ppe-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Utilities to be provided by company:
                                    </Label>
                                    <div className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="water-supply"
                                                checked={detailedInfo.utilitiesToBeProvidedByCompany.waterSupply === 'Yes'}
                                                onCheckedChange={(checked) => handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
                                                    ...detailedInfo.utilitiesToBeProvidedByCompany,
                                                    waterSupply: checked ? 'Yes' : 'No'
                                                })}
                                            />
                                            <Label htmlFor="water-supply">Water Supply</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="electrical-supply"
                                                checked={detailedInfo.utilitiesToBeProvidedByCompany.electricalSupply === 'Yes'}
                                                onCheckedChange={(checked) => handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
                                                    ...detailedInfo.utilitiesToBeProvidedByCompany,
                                                    electricalSupply: checked ? 'Yes' : 'No'
                                                })}
                                            />
                                            <Label htmlFor="electrical-supply">Electrical Supply</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="air-supply"
                                                checked={detailedInfo.utilitiesToBeProvidedByCompany.airSupply === 'Yes'}
                                                onCheckedChange={(checked) => handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
                                                    ...detailedInfo.utilitiesToBeProvidedByCompany,
                                                    airSupply: checked ? 'Yes' : 'No'
                                                })}
                                            />
                                            <Label htmlFor="air-supply">Air Supply</Label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Energy Isolation is required:
                                    </Label>
                                    <RadioGroup
                                        value={detailedInfo.energyIsolationRequired || 'null'}
                                        onValueChange={(value) => handleDetailedInfoChange('energyIsolationRequired', value === 'null' ? null : value)}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Yes" id="isolation-yes" />
                                            <Label htmlFor="isolation-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="No" id="isolation-no" />
                                            <Label htmlFor="isolation-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                    <div className="mt-4">
                                        <Label htmlFor="tagOutDetails">If Yes, Lock Out Tag Out details:</Label>
                                        <Input
                                            id="tagOutDetails"
                                            value={detailedInfo.tagOutDetails}
                                            onChange={(e) => handleDetailedInfoChange('tagOutDetails', e.target.value)}
                                            placeholder="Specify lock out tag out details"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="energyIsolationDoneBy">Energy Isolation Done By:</Label>
                                        <div className="text-xs text-gray-500 mb-2">(Name & Sign)</div>
                                        <Input
                                            id="energyIsolationDoneBy"
                                            value={detailedInfo.energyIsolationDoneBy}
                                            onChange={(e) => handleDetailedInfoChange('energyIsolationDoneBy', e.target.value)}
                                            placeholder="Enter name and signature"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="energyDeisolationDoneBy">Energy De-Isolation Done By:</Label>
                                        <div className="text-xs text-gray-500 mb-2">(Name & Sign)</div>
                                        <Input
                                            id="energyDeisolationDoneBy"
                                            value={detailedInfo.energyDeisolationDoneBy}
                                            onChange={(e) => handleDetailedInfoChange('energyDeisolationDoneBy', e.target.value)}
                                            placeholder="Enter name and signature"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Check Points */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Check Points
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 p-4 text-left text-sm font-medium text-gray-900">
                                                Check Points
                                            </th>
                                            <th className="border border-gray-300 p-4 text-center text-sm font-medium text-gray-900 w-20">
                                                Req.
                                            </th>
                                            <th className="border border-gray-300 p-4 text-center text-sm font-medium text-gray-900 w-20">
                                                Checked
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checkPoints.map((point) => (
                                            <tr key={point.id} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 p-4 text-sm text-gray-900">
                                                    {point.description}
                                                </td>
                                                <td className="border border-gray-300 p-4 text-center">
                                                    <Checkbox
                                                        checked={point.req}
                                                        onCheckedChange={(checked) => handleCheckPointChange(point.id, 'req', !!checked)}
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-4 text-center">
                                                    <Checkbox
                                                        checked={point.checked}
                                                        onCheckedChange={(checked) => handleCheckPointChange(point.id, 'checked', !!checked)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Persons Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Persons Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label>Permit Initiator Name</Label>
                                        <div className="mt-2 text-sm text-gray-900">{personsInfo.permitInitiatorName || '-'}</div>
                                    </div>
                                    <div>
                                        <Label>Contact Number</Label>
                                        <div className="mt-2 text-sm text-gray-900">{personsInfo.permitInitiatorContact || '-'}</div>
                                    </div>
                                    <div>
                                        <Label>Contractor's Supervisor</Label>
                                        <div className="mt-2 text-sm text-gray-900">{personsInfo.contractorSupervisorName || '-'}</div>
                                    </div>
                                    <div>
                                        <Label>Contact Number</Label>
                                        <div className="mt-2 text-sm text-gray-900">{personsInfo.contractorSupervisorContact || '-'}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Permit Issuer</Label>
                                        <div className="mt-2 text-sm text-gray-900">{personsInfo.permitIssuerName || '-'}</div>
                                    </div>
                                    <div>
                                        <Label>Contact Number</Label>
                                        <div className="mt-2 text-sm text-gray-900">{personsInfo.permitIssuerContact || '-'}</div>
                                    </div>
                                    <div>
                                        <Label>Safety Officer</Label>
                                        <div className="mt-2 text-sm text-gray-900">{personsInfo.safetyOfficerName || '-'}</div>
                                    </div>
                                    <div>
                                        <Label>Contact Number</Label>
                                        <div className="mt-2 text-sm text-gray-900">{personsInfo.safetyOfficerContact || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Declaration */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Declaration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <p className="text-sm text-gray-800 leading-relaxed">
                                    <strong>Declaration – </strong>
                                    {declaration}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="p-3 border border-gray-200 rounded">
                                    <Label className="text-xs text-gray-500">Contractor supervisor</Label>
                                    <div className="h-8 border-b border-gray-300 mt-2"></div>
                                </div>
                                <div className="p-3 border border-gray-200 rounded">
                                    <Label className="text-xs text-gray-500">Permit Initiator</Label>
                                    <div className="h-8 border-b border-gray-300 mt-2"></div>
                                </div>
                                <div className="p-3 border border-gray-200 rounded">
                                    <Label className="text-xs text-gray-500">Permit Issuer</Label>
                                    <div className="h-8 border-b border-gray-300 mt-2"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily Extension Sheet */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                DAILY EXTENSION SHEET
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                (Permit Issuer require if there is extension in working time)
                            </p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Date</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Time</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Description</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Contractor's Manpower</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Contractor's supervisor</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Permit Initiator</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Permit Issuer</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Safety Officer</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Time extension</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyExtensions.map((extension) => (
                                            <tr key={extension.id}>
                                                <td className="border border-gray-300 p-3 text-xs">{extension.date || '-'}</td>
                                                <td className="border border-gray-300 p-3 text-xs">{extension.time || '-'}</td>
                                                <td className="border border-gray-300 p-3 text-xs">{extension.description || '-'}</td>
                                                <td className="border border-gray-300 p-3 text-xs">{extension.contractors_manpower || '-'}</td>
                                                <td className="border border-gray-300 p-3 text-xs">{extension.contractors_supervisor || '-'}</td>
                                                <td className="border border-gray-300 p-3 text-xs">{extension.permit_initiator || '-'}</td>
                                                <td className="border border-gray-300 p-3 text-xs">{extension.permit_issuer || '-'}</td>
                                                <td className="border border-gray-300 p-3 text-xs">{extension.safety_officer || '-'}</td>
                                                <td className="border border-gray-300 p-3 text-xs">{extension.time_extension || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work Permit Closure Format */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                WORK PERMIT CLOSURE FORMAT
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                This format is to be filled by the persons who had raised the Work Permit. All the below mentioned points must be checked & completed by him after the work is completed
                            </p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900 w-32">Attributes</th>
                                            <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900">Initiator</th>
                                            <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900">Issuer</th>
                                            <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900">Security Dept</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Attributes</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[0]?.initiator || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[0]?.issuer || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[0]?.security_dept || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Declaration</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[1]?.initiator || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[1]?.issuer || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[1]?.security_dept || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50"></td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[2]?.initiator || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[2]?.issuer || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations[2]?.security_dept || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Name and Signature</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.signatures?.initiator || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.signatures?.issuer || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.signatures?.security_dept || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Date and time</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.date_and_time?.initiator || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.date_and_time?.issuer || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.date_and_time?.security_dept || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents to be Enclosed */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                DOCUMENTS TO BE ENCLOSED HERE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900 w-20">Sr.No.</th>
                                            <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-900">Document Name</th>
                                            <th className="border border-gray-300 p-3 text-center text-sm font-medium text-gray-900 w-32">Mark Yes/No</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attachments.map((document, index) => (
                                            <tr key={document.id}>
                                                <td className="border border-gray-300 p-3 text-sm text-center">{document.sr_no || index + 1}</td>
                                                <td className="border border-gray-300 p-3 text-sm">{document.name || '-'}</td>
                                                <td className="border border-gray-300 p-3 text-sm text-center">{document.workVoucher ? 'Yes' : 'No'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-center pt-6">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-8 py-2 text-sm font-medium rounded"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FillForm;