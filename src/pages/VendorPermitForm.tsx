import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Upload,
    Plus,
    Trash2,
    FileText,
    Users,
    Shield,
    AlertTriangle,
    CheckCircle,
    Calendar,
    MapPin,
    Building2,
    Phone,
    Mail,
    User,
    Clock
} from "lucide-react";
import { toast } from "sonner";

interface ManpowerDetail {
    id: string;
    assignTo: string;
    designation: string;
    emergencyContact: string;
}

interface CheckPoint {
    id: number;
    description: string;
    checked: boolean;
    req: boolean;
    not_req: boolean;
    parameters?: string;
}

interface ExtensionSheet {
    id: string;
    date: string;
    time: string;
    description: string;
    contractorsManpower: string;
    contractorsSupervisor: string;
    permitInitiator: string;
    permitIssuer: string;
    safetyOfficer: string;
    timeExtension: string;
}

interface Attachment {
    id: string;
    name: string;
    markYesNo: 'Yes' | 'No' | '';
    file: File | null;
}

// Helper function to convert DD/MM/YYYY to YYYY-MM-DD format
const convertDateFormat = (dateString: string): string => {
    if (!dateString) return '';

    // Check if date is in DD/MM/YYYY format
    const ddmmyyyy = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) {
        const [, day, month, year] = ddmmyyyy;
        return `${year}-${month}-${day}`;
    }

    // If it's already in ISO format or other format, try to handle it
    if (dateString.includes('T')) {
        return dateString.split('T')[0];
    }

    return dateString;
};

export const VendorPermitForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [permitData, setPermitData] = useState<any>(null);

    useEffect(() => {
        const fetchPermitData = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.error('Missing baseUrl or token');
                return;
            }

            // Ensure protocol is present
            const baseUrlWithProtocol = /^https?:\/\//i.test(baseUrl) ? baseUrl : `https://${baseUrl}`;
            const url = `${baseUrlWithProtocol}/pms/permits/${id}/vendor_permit_fill_form.json`;
            try {
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setPermitData(data.pms_permit);

                // Update basic information with backend data
                setBasicInfo(prev => ({
                    ...prev,
                    docNo: data.pms_permit?.reference_number || '',
                    rev: data.pms_permit?.revision || '',
                    permitRequestedDate: data.pms_permit?.requested_date ? convertDateFormat(data.pms_permit.requested_date) : '',
                    permitIssueDate: data.pms_permit?.issued_at ? convertDateFormat(data.pms_permit.issued_at) : '',
                    permitId: id || data.pms_permit?.permit_id || ''
                }));

                // Update detailed information with backend data
                setDetailedInfo(prev => ({
                    ...prev,
                    jobDescription: data.pms_permit?.permit_for || '',
                    location: data.pms_permit?.location_details || '',
                    permitInitiatedBy: data.pms_permit?.initiator?.full_name || '',
                    initiatorsDepartment: data.pms_permit?.initiator?.department || '',
                    initiatorsContact: data.pms_permit?.initiator?.contact_number || '',
                    nameOfContractor: data.pms_permit?.contractor?.name || '',
                    addressOfContractor: data.pms_permit?.contractor?.address || '',
                    contractorsContact: data.pms_permit?.contractor?.contact_number || ''
                }));

                // Update persons information with backend data
                setPersonsInfo(prev => ({
                    ...prev,
                    permitInitiatorName: data.pms_permit?.initiator?.full_name || '',
                    permitInitiatorContact: data.pms_permit?.initiator?.contact_number || '',
                    permitIssuerName: data.pms_permit?.permit_issuer?.name || '',
                    permitIssuerContact: data.pms_permit?.permit_issuer?.contact_number || '',
                    safetyOfficerName: data.pms_permit?.safety_officer?.name || '',
                    safetyOfficerContact: data.pms_permit?.safety_officer?.contact_number || ''
                }));

                // Update checkpoints with backend data
                if (data.pms_permit?.safety_checkpoints) {
                    const mappedCheckpoints = data.pms_permit.safety_checkpoints.map((checkpoint, index) => ({
                        id: index,
                        description: checkpoint.label || '',
                        checked: checkpoint.checked || false,
                        req: checkpoint.req || false,
                        not_req: checkpoint.not_req || false,
                        parameters: checkpoint.parameters || ''
                    }));
                    setCheckPoints(mappedCheckpoints);
                }
            } catch (error) {
                console.error('Error fetching permit data:', error);
            }
        };
        if (id) fetchPermitData();
    }, [id]);

    // Basic Information State
    const [basicInfo, setBasicInfo] = useState({
        docNo: '',
        rev: '',
        permitRequestedDate: '',
        permitIssueDate: '',
        permitId: ''
    });

    // Detailed Information State
    const [detailedInfo, setDetailedInfo] = useState({
        jobDescription: '',
        location: '',
        permitInitiatedBy: '',
        initiatorsDepartment: '',
        initiatorsContact: '',
        nameOfContractor: '',
        addressOfContractor: '',
        contractorsContact: '',
        enterContractorsList: '',
        jobSafetyAnalysisRequired: '',
        ifYesAttachedSheet: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        anyChemicalsUsedMSDS: '',
        ifYesSpecifyName: '',
        contractorMaterialStorageRequired: '',
        areaAllocated: '',
        necessaryPPEsProvided: '',
        toBeReturnedToSecurity: '',
        utilitiesToBeProvided: {
            waterSupply: false,
            electricalSupply: false,
            airSupply: false
        },
        energyIsolationRequired: '',
        // Fields for hazardous material work
        jobSafetyAnalysisAttached: '',
        riskAssessmentNumber: '',
        vehicleEntryRequired: '',
        gasTestingConductedFor: {
            hydrocarbons: false,
            h2o: false,
            oxygen: false,
            others: false
        },
        gasTestToBeRepeatedAfter: '',
        continuousGasMonitoringRequired: '',
        worksiteExaminationBy: '',
        anySimultaneousOperation: '',
        ifYesSpecifyTheOperation: '',
        ppesProvided: '',
        isolationRequired: '',
        tagOutDetailsElectrical: '',
        energyIsolationDoneBy: '',
        energyDeIsolationDoneBy: '',
        permissionIsGivenToContractor: ''
    });

    // Check Points - will be populated from API
    const [checkPoints, setCheckPoints] = useState<CheckPoint[]>([]);

    // Persons Information
    const [personsInfo, setPersonsInfo] = useState({
        permitInitiatorName: '',
        permitInitiatorContact: '',
        contractorsSupervisorName: '',
        contractSupervisorNumber: '',
        permitIssuerName: '',
        permitIssuerContact: '',
        safetyOfficerName: '',
        safetyOfficerContact: ''
    });

    // Manpower Details
    const [manpowerDetails, setManpowerDetails] = useState<ManpowerDetail[]>([
        { id: '1', assignTo: '', designation: '', emergencyContact: '' }
    ]);

    // Daily Extension Sheet
    const [extensionSheets, setExtensionSheets] = useState<ExtensionSheet[]>([
        { id: '1', date: '', time: '', description: '', contractorsManpower: '', contractorsSupervisor: '', permitInitiator: '', permitIssuer: '', safetyOfficer: '', timeExtension: '' }
    ]);

    // Work Permit Closure
    const [workPermitClosure, setWorkPermitClosure] = useState({
        initiatorDeclaration: 'Certified that the subject work has been completed/stopped and area cleaned. Scrap shifted to scrap yard.',
        initiatorName: '',
        initiatorDateTime: '',
        issuerDeclaration: 'Verified that the job is completed & Area is cleaned and safe from any hazard. Verified that all energy sources are re-established properly.',
        issuerName: '',
        issuerDateTime: '',
        securityDeclaration: 'Received the given safety equipment’s.',
        securityName: '',
        securityDateTime: ''
    });

    // Attachments
    const [attachments, setAttachments] = useState<Attachment[]>([
        { id: '1', name: 'List of people to work', markYesNo: '', file: null },
        { id: '2', name: 'ESI/WC Policy', markYesNo: '', file: null },
        { id: '3', name: 'Medical Reports', markYesNo: '', file: null },
        { id: '4', name: 'Other', markYesNo: '', file: null }
    ]);

    const handleBasicInfoChange = (field: string, value: string) => {
        setBasicInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleDetailedInfoChange = (field: string, value: any) => {
        setDetailedInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleUtilityChange = (utility: string, checked: boolean) => {
        setDetailedInfo(prev => ({
            ...prev,
            utilitiesToBeProvided: { ...prev.utilitiesToBeProvided, [utility]: checked }
        }));
    };

    const handleGasTestingChange = (gas: string, checked: boolean) => {
        setDetailedInfo(prev => ({
            ...prev,
            gasTestingConductedFor: { ...prev.gasTestingConductedFor, [gas]: checked }
        }));
    };

    const handleCheckPointChange = (index: number, checked: boolean) => {
        setCheckPoints(prev => prev.map((item, i) => i === index ? { ...item, checked } : item));
    };

    const addManpowerDetail = () => {
        const newId = (manpowerDetails.length + 1).toString();
        setManpowerDetails(prev => [...prev, { id: newId, assignTo: '', designation: '', emergencyContact: '' }]);
    };

    const removeManpowerDetail = (id: string) => {
        setManpowerDetails(prev => prev.filter(item => item.id !== id));
    };

    const handleManpowerChange = (id: string, field: string, value: string) => {
        setManpowerDetails(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addExtensionSheet = () => {
        const newId = (extensionSheets.length + 1).toString();
        setExtensionSheets(prev => [...prev, { id: newId, date: '', time: '', description: '', contractorsManpower: '', contractorsSupervisor: '', permitInitiator: '', permitIssuer: '', safetyOfficer: '', timeExtension: '' }]);
    };

    const removeExtensionSheet = (id: string) => {
        setExtensionSheets(prev => prev.filter(item => item.id !== id));
    };

    const handleExtensionChange = (id: string, field: string, value: string) => {
        setExtensionSheets(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleClosureChange = (field: string, value: string) => {
        setWorkPermitClosure(prev => ({ ...prev, [field]: value }));
    };

    const handleAttachmentChange = (id: string, field: string, value: any) => {
        setAttachments(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleFileUpload = (id: string, file: File) => {
        setAttachments(prev => prev.map(item => item.id === id ? { ...item, file } : item));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                toast.error('Authentication token or base URL not found. Please login again.');
                return;
            }


            const formData = new FormData();

            // Check if this is hazardous material work to include additional fields
            const isHazardousMaterialWork = permitData?.permit_type === "Loading, Unloading Hazardous Material Work";

            // Common fields for all permit types
            formData.append('pms_permit_form[job_safty_analysis_required]', detailedInfo.jobSafetyAnalysisRequired || 'No');
            formData.append('pms_permit_form[emergency_contact_name]', detailedInfo.emergencyContactName || '');
            formData.append('pms_permit_form[emergency_contact_number]', detailedInfo.emergencyContactNumber || '');
            formData.append('pms_permit_form[msds_available_for_chemical_use]', detailedInfo.anyChemicalsUsedMSDS || 'No');
            formData.append('pms_permit_form[specify_the_name]', detailedInfo.ifYesSpecifyName || '');
            formData.append('pms_permit_form[contractor_storage_place_required]', detailedInfo.contractorMaterialStorageRequired || 'No');
            formData.append('pms_permit_form[area_allocated]', detailedInfo.areaAllocated || '');
            formData.append('pms_permit_form[necessary_ppes_provided]', detailedInfo.necessaryPPEsProvided || '');
            formData.append('pms_permit_form[energy_isolation_required]', detailedInfo.energyIsolationRequired || 'No');

            // Additional fields specific to hazardous material work
            if (isHazardousMaterialWork) {
                formData.append('pms_permit_form[job_safety_analysis_attached]', detailedInfo.jobSafetyAnalysisAttached || '');
                formData.append('pms_permit_form[risk_assessment_number]', detailedInfo.riskAssessmentNumber || '');
                formData.append('pms_permit_form[vehicle_entry_required]', detailedInfo.vehicleEntryRequired || 'No');


                formData.append('pms_permit_form[gas_testing_conducted_for_hydrocarbons]',
                    detailedInfo.gasTestingConductedFor.hydrocarbons ? '1' : '0');
                formData.append('pms_permit_form[gas_testing_conducted_for_h2o]',
                    detailedInfo.gasTestingConductedFor.h2o ? '1' : '0');
                formData.append('pms_permit_form[gas_testing_conducted_for_oxygen]',
                    detailedInfo.gasTestingConductedFor.oxygen ? '1' : '0');
                formData.append('pms_permit_form[gas_testing_conducted_for_others]',
                    detailedInfo.gasTestingConductedFor.others ? '1' : '0');

                formData.append('pms_permit_form[gas_test_to_be_repeated_after]', detailedInfo.gasTestToBeRepeatedAfter || '');
                formData.append('pms_permit_form[continuous_gas_monitoring_required]', detailedInfo.continuousGasMonitoringRequired || 'No');
                formData.append('pms_permit_form[worksite_examination_By]', detailedInfo.worksiteExaminationBy || 'No');
                formData.append('pms_permit_form[any_simultaneous_operation]', detailedInfo.anySimultaneousOperation || 'No');
                formData.append('pms_permit_form[if_yes_specify_the_operation]', detailedInfo.ifYesSpecifyTheOperation || '');
                formData.append('pms_permit_form[ppes_provided]', detailedInfo.ppesProvided || '');
                formData.append('pms_permit_form[isolation_required_electrical_machnical]', detailedInfo.isolationRequired || '');
                formData.append('pms_permit_form[tag_out_details_electrical]', detailedInfo.tagOutDetailsElectrical || '');
                formData.append('pms_permit_form[energy_isolation_done_by_electrical]', detailedInfo.energyIsolationDoneBy || '');
                formData.append('pms_permit_form[energy_de_isolation_done_by_electrical]', detailedInfo.energyDeIsolationDoneBy || '');
                formData.append('pms_permit_form[permission_is_given_to_contractor]', detailedInfo.permissionIsGivenToContractor || '');
                if (detailedInfo.utilitiesToBeProvided.waterSupply) {
                    formData.append('pms_permit_form[utilities_provided_by_company_water_supply]', '1');
                }
                if (detailedInfo.utilitiesToBeProvided.electricalSupply) {
                    formData.append('pms_permit_form[utilities_provided_by_company_elecrical_supply]', '1');
                }
                if (detailedInfo.utilitiesToBeProvided.airSupply) {
                    formData.append('pms_permit_form[utilities_provided_by_company_air_supply]', '1');
                }

            }

            // Handle utilities - send as separate numbered parameters
            if (detailedInfo.utilitiesToBeProvided.waterSupply) {
                formData.append('pms_permit_form[utilities_to_be_provided_by_company1]', 'Water Supply');
            }
            if (detailedInfo.utilitiesToBeProvided.electricalSupply) {
                formData.append('pms_permit_form[utilities_to_be_provided_by_company2]', 'Electrical Supply');
            }
            if (detailedInfo.utilitiesToBeProvided.airSupply) {
                formData.append('pms_permit_form[utilities_to_be_provided_by_company3]', 'Air Supply');
            }

            checkPoints.forEach((checkpoint) => {
                if (checkpoint.parameters) {
                    formData.append(`pms_permit_form[${checkpoint.parameters}]`, checkpoint.checked ? 'Req' : 'Not Req');
                }
            });

            formData.append('pms_permit_form[contract_supervisor_name]', personsInfo.contractorsSupervisorName || '');
            formData.append('pms_permit_form[contract_supervisor_number]', personsInfo.contractSupervisorNumber || '');

            // Manpower details - external assignees
            manpowerDetails.forEach((detail, index) => {
                if (detail.assignTo || detail.designation || detail.emergencyContact) {
                    const timestamp = Date.now() + index;
                    formData.append(`pms_permit_form[permit_form_external_assignees_attributes][${timestamp}][_destroy]`, 'false');
                    formData.append(`pms_permit_form[permit_form_external_assignees_attributes][${timestamp}][assignee_name]`, detail.assignTo || '');
                    formData.append(`pms_permit_form[permit_form_external_assignees_attributes][${timestamp}][designation]`, detail.designation || '');
                    formData.append(`pms_permit_form[permit_form_external_assignees_attributes][${timestamp}][phone]`, detail.emergencyContact || '');
                }
            });

            // File attachments
            attachments.forEach((attachment) => {
                if (attachment.file) {
                    switch (attachment.id) {
                        case '1':
                            formData.append('people_work_attachments[]', attachment.file);
                            break;
                        case '2':
                            formData.append('policy_attachments[]', attachment.file);
                            break;
                        case '3':
                            formData.append('medical_attachments[]', attachment.file);
                            break;
                        case '4':
                            formData.append('other_attachments[]', attachment.file);
                            break;
                    }
                }
            });

            // Ensure protocol is present
            const baseUrlWithProtocol = /^https?:\/\//i.test(baseUrl) ? baseUrl : `https://${baseUrl}`;
            const url = `${baseUrlWithProtocol}/pms/permits/${id}/submit_form.json`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });


            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);

            toast.success('permit form submitted successfully!');
            navigate(`/safety/permit/details/${id}`);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit permit form');
        } finally {
            setLoading(false);
        }
    };
    console.log(`Rendering VendorPermitForm with permitData:`, checkPoints);

    return (
        <div className="min-h-screen bg-white-50 p-4 sm:p-6">
            <div className=" mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {permitData?.permit_type || '-'}
                            {id && <span className="text-sm text-gray-600 ml-2">(Permit ID: {id})</span>}
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
                                BASIC INFORMATION
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="docNo">Doc No</Label>
                                    <Input id="docNo" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rev">Rev</Label>
                                    <Input id="rev" value={basicInfo.rev} onChange={(e) => handleBasicInfoChange('rev', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="permitRequestedDate">Permit Requested Date</Label>
                                    <Input id="permitRequestedDate" type="date" value={basicInfo.permitRequestedDate} onChange={(e) => handleBasicInfoChange('permitRequestedDate', e.target.value)} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="permitIssueDate">Permit Issue Date</Label>
                                    <Input id="permitIssueDate" type="date" value={basicInfo.permitIssueDate} onChange={(e) => handleBasicInfoChange('permitIssueDate', e.target.value)} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="permitId">Permit ID</Label>
                                    <Input id="permitId" value={basicInfo.permitId} onChange={(e) => handleBasicInfoChange('permitId', e.target.value)} disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Information */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
                                DETAILED INFORMATION
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="jobDescription">Job Description</Label>
                                        <Textarea id="jobDescription" value={detailedInfo.jobDescription} onChange={(e) => handleDetailedInfoChange('jobDescription', e.target.value)} rows={3} disabled />
                                    </div>
                                    <div>
                                        <Label htmlFor="permitInitiatedBy">Permit Initiated by</Label>
                                        <Input id="permitInitiatedBy" value={detailedInfo.permitInitiatedBy} onChange={(e) => handleDetailedInfoChange('permitInitiatedBy', e.target.value)} disabled />
                                    </div>
                                    <div>
                                        <Label htmlFor="initiatorsContact">Initiator's Contact</Label>
                                        <Input id="initiatorsContact" value={detailedInfo.initiatorsContact} onChange={(e) => handleDetailedInfoChange('initiatorsContact', e.target.value)} disabled />
                                    </div>
                                    <div>
                                        <Label htmlFor="nameOfContractor">Name of Contractor</Label>
                                        <Input id="nameOfContractor" value={detailedInfo.nameOfContractor} onChange={(e) => handleDetailedInfoChange('nameOfContractor', e.target.value)} disabled />
                                    </div>
                                    <div>
                                        <Label htmlFor="contractorsContact">Contractor's Contact</Label>
                                        <Input id="contractorsContact" value={detailedInfo.contractorsContact} onChange={(e) => handleDetailedInfoChange('contractorsContact', e.target.value)} disabled />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Textarea id="location" value={detailedInfo.location} onChange={(e) => handleDetailedInfoChange('location', e.target.value)} rows={3} disabled placeholder="Site - Panchshil Test / Building - TOWER A / Wing - Wing A / Floor - Basement / Area - Area A / Room - EV Room" />
                                    </div>
                                    <div>
                                        <Label htmlFor="initiatorsDepartment">Initiator's Department</Label>
                                        <Input id="initiatorsDepartment" value={detailedInfo.initiatorsDepartment} onChange={(e) => handleDetailedInfoChange('initiatorsDepartment', e.target.value)} disabled />
                                    </div>
                                    <div>
                                        <Label htmlFor="addressOfContractor">Address of Contractor</Label>
                                        <Textarea id="addressOfContractor" value={detailedInfo.addressOfContractor} onChange={(e) => handleDetailedInfoChange('addressOfContractor', e.target.value)} rows={2} disabled />
                                    </div>
                                </div>
                            </div>



                            {/* Additional fields in full width sections */}
                            {permitData?.permit_type === "Loading, Unloading Hazardous Material Work" ? (
                                // ✅ Hazardous Material Work Form
                                <div className="space-y-6">
                                    <Label>( Attach the list of Contractor employees )</Label>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="jobSafetyAnalysisAttached">Job Safety Analysis Attached (JSA No.)</Label>
                                            <Input
                                                id="jobSafetyAnalysisAttached"
                                                value={detailedInfo.jobSafetyAnalysisAttached}
                                                onChange={(e) => handleDetailedInfoChange('jobSafetyAnalysisAttached', e.target.value)}
                                                placeholder="Enter JSA Number"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="riskAssessmentNumber">Risk Assessment Number</Label>
                                            <Input
                                                id="riskAssessmentNumber"
                                                value={detailedInfo.riskAssessmentNumber}
                                                onChange={(e) => handleDetailedInfoChange('riskAssessmentNumber', e.target.value)}
                                                placeholder="Enter Risk Assessment Number"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm font-medium">Vehicle Entry Required</Label>
                                            <div className="mt-2">
                                                <RadioGroup
                                                    value={detailedInfo.vehicleEntryRequired}
                                                    onValueChange={(value) => handleDetailedInfoChange('vehicleEntryRequired', value)}
                                                    className="flex gap-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Yes" id="vehicle-yes" />
                                                        <Label htmlFor="vehicle-yes">Yes</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="No" id="vehicle-no" />
                                                        <Label htmlFor="vehicle-no">No</Label>
                                                    </div>
                                                </RadioGroup>
                                                <div className="mt-2">
                                                    <Label className="text-xs text-gray-500">
                                                        If Yes attach Vehicle Access checklist, driver checklist for loading/unloading of hazardous material
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">Gas Testing conducted for</Label>
                                            <div className="flex gap-4 mt-2 flex-wrap">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="hydrocarbons" checked={detailedInfo.gasTestingConductedFor.hydrocarbons}
                                                        onCheckedChange={(checked) => handleGasTestingChange('hydrocarbons', checked as boolean)} />
                                                    <Label htmlFor="hydrocarbons">Hydrocarbons</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="h2o" checked={detailedInfo.gasTestingConductedFor.h2o}
                                                        onCheckedChange={(checked) => handleGasTestingChange('h2o', checked as boolean)} />
                                                    <Label htmlFor="h2o">H2O</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="oxygen" checked={detailedInfo.gasTestingConductedFor.oxygen}
                                                        onCheckedChange={(checked) => handleGasTestingChange('oxygen', checked as boolean)} />
                                                    <Label htmlFor="oxygen">Oxygen</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="others" checked={detailedInfo.gasTestingConductedFor.others}
                                                        onCheckedChange={(checked) => handleGasTestingChange('others', checked as boolean)} />
                                                    <Label htmlFor="others">Other</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="gasTestToBeRepeatedAfter">Gas Test to be repeated after</Label>
                                            <Input
                                                id="gasTestToBeRepeatedAfter"
                                                value={detailedInfo.gasTestToBeRepeatedAfter}
                                                onChange={(e) => handleDetailedInfoChange('gasTestToBeRepeatedAfter', e.target.value)}
                                                placeholder="Hrs"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">Continuous Gas Monitoring Required</Label>
                                            <div className="mt-2">
                                                <RadioGroup
                                                    value={detailedInfo.continuousGasMonitoringRequired}
                                                    onValueChange={(value) => handleDetailedInfoChange('continuousGasMonitoringRequired', value)}
                                                    className="flex gap-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Yes" id="monitoring-yes" />
                                                        <Label htmlFor="monitoring-yes">Yes</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="No" id="monitoring-no" />
                                                        <Label htmlFor="monitoring-no">No</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm font-medium">
                                                Worksite Examination By Initiator, Issuer, Supervisor:- Every Day /First Day
                                            </Label>
                                            <div className="mt-2">
                                                <RadioGroup
                                                    value={detailedInfo.worksiteExaminationBy}
                                                    onValueChange={(value) => handleDetailedInfoChange('worksiteExaminationBy', value)}
                                                    className="flex gap-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Yes" id="worksite-yes" />
                                                        <Label htmlFor="worksite-yes">Yes</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="No" id="worksite-no" />
                                                        <Label htmlFor="worksite-no">No</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">Any Simultaneous Operation</Label>
                                            <div className="mt-2">
                                                <RadioGroup
                                                    value={detailedInfo.anySimultaneousOperation}
                                                    onValueChange={(value) => handleDetailedInfoChange('anySimultaneousOperation', value)}
                                                    className="flex gap-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Yes" id="simultaneous-yes" />
                                                        <Label htmlFor="simultaneous-yes">Yes</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="No" id="simultaneous-no" />4
                                                        <Label htmlFor="simultaneous-no">No</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="ifYesSpecifyTheOperation">If Yes Specify the Operation</Label>
                                        <Input
                                            id="ifYesSpecifyTheOperation"
                                            value={detailedInfo.ifYesSpecifyTheOperation}
                                            onChange={(e) => handleDetailedInfoChange('ifYesSpecifyTheOperation', e.target.value)}
                                            placeholder="Enter Operation"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Necessary PPEs provided</Label>
                                        <div className="mt-2">
                                            <RadioGroup
                                                value={detailedInfo.ppesProvided}
                                                onValueChange={(value) => handleDetailedInfoChange('ppesProvided', value)}
                                                className="flex gap-6"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="By Company" id="ppe-company-haz" />
                                                    <Label htmlFor="ppe-company-haz">by Company</Label>
                                                    <Label className="text-xs text-gray-500 ml-2">(to be returned back to security)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="By Contractor" id="ppe-contractor-haz" />
                                                    <Label htmlFor="ppe-contractor-haz">by Contractor</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Utilities to be provided by company</Label>
                                        <div className="flex gap-6 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="water-supply-haz" checked={detailedInfo.utilitiesToBeProvided.waterSupply}
                                                    onCheckedChange={(checked) => handleUtilityChange('waterSupply', checked as boolean)} />
                                                <Label htmlFor="water-supply-haz">Water Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="electrical-supply-haz" checked={detailedInfo.utilitiesToBeProvided.electricalSupply}
                                                    onCheckedChange={(checked) => handleUtilityChange('electricalSupply', checked as boolean)} />
                                                <Label htmlFor="electrical-supply-haz">Electrical Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="air-supply-haz" checked={detailedInfo.utilitiesToBeProvided.airSupply}
                                                    onCheckedChange={(checked) => handleUtilityChange('airSupply', checked as boolean)} />
                                                <Label htmlFor="air-supply-haz">Air Supply</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm font-medium">Isolation is required</Label>
                                            <div className="mt-2">
                                                <RadioGroup
                                                    value={detailedInfo.isolationRequired}
                                                    onValueChange={(value) => handleDetailedInfoChange('isolationRequired', value)}
                                                    className="flex gap-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Electrical" id="isolation-electrical" />
                                                        <Label htmlFor="isolation-electrical">Electrical</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Mechanical" id="isolation-mechanical" />
                                                        <Label htmlFor="isolation-mechanical">Mechanical</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="tagOutDetailsElectrical">If Yes, Lock Out Tag Out details</Label>
                                            <Input
                                                id="tagOutDetailsElectrical"
                                                value={detailedInfo.tagOutDetailsElectrical}
                                                onChange={(e) => handleDetailedInfoChange('tagOutDetailsElectrical', e.target.value)}
                                                placeholder="Enter"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="energyIsolationDoneBy">Energy Isolation Done By</Label>
                                            <Input
                                                id="energyIsolationDoneBy"
                                                value={detailedInfo.energyIsolationDoneBy}
                                                onChange={(e) => handleDetailedInfoChange('energyIsolationDoneBy', e.target.value)}
                                                placeholder="Enter"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="energyDeIsolationDoneBy">Energy De-Isolation Done By</Label>
                                            <Input
                                                id="energyDeIsolationDoneBy"
                                                value={detailedInfo.energyDeIsolationDoneBy}
                                                onChange={(e) => handleDetailedInfoChange('energyDeIsolationDoneBy', e.target.value)}
                                                placeholder="Enter"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h6 className="text-orange-600 font-semibold mb-4">Vehicle Access to restricted area</h6>
                                        <div>
                                            <Label htmlFor="permissionIsGivenToContractor">
                                                Permission is given to contractor supervisor to take vehicle(s) of following types
                                            </Label>
                                            <Input
                                                id="permissionIsGivenToContractor"
                                                value={detailedInfo.permissionIsGivenToContractor}
                                                onChange={(e) => handleDetailedInfoChange('permissionIsGivenToContractor', e.target.value)}
                                                placeholder="Enter"
                                            />
                                        </div>
                                        <Label className="text-sm text-gray-600 mt-2 block">
                                            To location subject to satisfactory gas testing, spark arrestor with the result recorded below
                                        </Label>
                                    </div>
                                    <div>
                                        <h5 className="title font-semibold mb-4">Gas Testing Record</h5>

                                        {/* First table */}
                                        <div className="overflow-x-auto border border-gray-300 rounded-md mb-6">
                                            <table className="min-w-full text-sm text-left border-collapse">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-2 py-1">Time</th>
                                                        <th className="px-2 py-1">Gas</th>
                                                        <th className="px-2 py-1">Result</th>
                                                        <th className="px-2 py-1">Sign</th>
                                                        <th className="px-2 py-1">Time</th>
                                                        <th className="px-2 py-1">Gas</th>
                                                        <th className="px-2 py-1">Result</th>
                                                        <th className="px-2 py-1">Time</th>
                                                        <th className="px-2 py-1">Gas</th>
                                                        <th className="px-2 py-1">Result</th>
                                                        <th className="px-2 py-1">Time</th>
                                                        <th className="px-2 py-1">Gas</th>
                                                        <th className="px-2 py-1">Result</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[1, 2].map((row) => (
                                                        <tr key={row} className="border-t">
                                                            {Array.from({ length: 13 }).map((_, i) => (
                                                                <td key={i} className="px-2 py-1">&nbsp;</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>



                                    </div>
                                </div>



                            ) : (
                                <div className="space-y-6">
                                    <Label>( Attach the List of Contractor’s Employees )</Label>

                                    <div>
                                        <Label className="text-sm font-medium">Job Safety Analysis required :</Label>
                                        <div className="mt-2">
                                            <RadioGroup value={detailedInfo.jobSafetyAnalysisRequired} onValueChange={(value) => handleDetailedInfoChange('jobSafetyAnalysisRequired', value)} className="flex gap-6">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Yes" id="jsa-yes" />
                                                    <Label htmlFor="jsa-yes">Yes</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="No" id="jsa-no" />
                                                    <Label htmlFor="jsa-no">No</Label>
                                                </div>
                                            </RadioGroup>
                                            <div className="mt-2">
                                                <Label className="text-xs text-gray-500">(if yes, do it on attached sheet)</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="emergencyContactName">Emergency Contact Name :</Label>
                                            <Input id="emergencyContactName" value={detailedInfo.emergencyContactName} onChange={(e) => handleDetailedInfoChange('emergencyContactName', e.target.value)} placeholder="Enter Emergency Contact Name" />
                                        </div>
                                        <div>
                                            <Label htmlFor="emergencyContactNumber">Emergency Contact Number :</Label>
                                            <Input id="emergencyContactNumber" value={detailedInfo.emergencyContactNumber} onChange={(e) => handleDetailedInfoChange('emergencyContactNumber', e.target.value)} placeholder="Enter Emergency Contact Number" />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Any Chemicals to be used then MSDS available :</Label>
                                        <div className="mt-2">
                                            <RadioGroup value={detailedInfo.anyChemicalsUsedMSDS} onValueChange={(value) => handleDetailedInfoChange('anyChemicalsUsedMSDS', value)} className="flex gap-6">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Yes" id="msds-yes" />
                                                    <Label htmlFor="msds-yes">Yes</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="No" id="msds-no" />
                                                    <Label htmlFor="msds-no">No</Label>
                                                </div>
                                            </RadioGroup>
                                            <div className="mt-2">
                                                <Label className="text-xs text-gray-500">(If yes, Please attach MSDS)</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="ifYesSpecifyName">If 'Yes' Please specify the name :</Label>
                                        <Input id="ifYesSpecifyName" value={detailedInfo.ifYesSpecifyName} onChange={(e) => handleDetailedInfoChange('ifYesSpecifyName', e.target.value)} />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Contractor's Material Storage Place required :</Label>
                                        <div className="mt-2">
                                            <RadioGroup value={detailedInfo.contractorMaterialStorageRequired} onValueChange={(value) => handleDetailedInfoChange('contractorMaterialStorageRequired', value)} className="flex gap-6">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Yes" id="storage-yes" />
                                                    <Label htmlFor="storage-yes">Yes</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="No" id="storage-no" />
                                                    <Label htmlFor="storage-no">No</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="areaAllocated">Area Allocated :</Label>
                                        <Input id="areaAllocated" value={detailedInfo.areaAllocated} onChange={(e) => handleDetailedInfoChange('areaAllocated', e.target.value)} />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Necessary PPEs provided :</Label>
                                        <div className="mt-2">
                                            <RadioGroup value={detailedInfo.necessaryPPEsProvided} onValueChange={(value) => handleDetailedInfoChange('necessaryPPEsProvided', value)} className="flex gap-6">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="By Company" id="ppe-company" />
                                                    <Label htmlFor="ppe-company">by company</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="By Contractor" id="ppe-contractor" />
                                                    <Label htmlFor="ppe-contractor">by Contractor</Label>
                                                </div>
                                            </RadioGroup>
                                            <div className="mt-2">
                                                <Label className="text-xs text-gray-500">(to be returned back to security )</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Utilities to be provided by company :</Label>
                                        <div className="flex gap-6 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="water-supply" checked={detailedInfo.utilitiesToBeProvided.waterSupply} onCheckedChange={(checked) => handleUtilityChange('waterSupply', checked as boolean)} />
                                                <Label htmlFor="water-supply">Water Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="electrical-supply" checked={detailedInfo.utilitiesToBeProvided.electricalSupply} onCheckedChange={(checked) => handleUtilityChange('electricalSupply', checked as boolean)} />
                                                <Label htmlFor="electrical-supply">Electrical Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="air-supply" checked={detailedInfo.utilitiesToBeProvided.airSupply} onCheckedChange={(checked) => handleUtilityChange('airSupply', checked as boolean)} />
                                                <Label htmlFor="air-supply">Air Supply</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Energy Isolation is required :</Label>
                                        <div className="mt-2">
                                            <RadioGroup value={detailedInfo.energyIsolationRequired} onValueChange={(value) => handleDetailedInfoChange('energyIsolationRequired', value)} className="flex gap-6">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Yes" id="energy-yes" />
                                                    <Label htmlFor="energy-yes">Yes</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="No" id="energy-no" />
                                                    <Label htmlFor="energy-no">No</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>

                            )}

                        </CardContent>
                    </Card>

                    {/* Check Points */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
                                CHECK POINTS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="space-y-4">
                                {checkPoints.length > 0 ? (
                                    checkPoints.map((point, index) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Checkbox id={`checkpoint-${index}`} checked={point.checked} onCheckedChange={(checked) => handleCheckPointChange(index, checked as boolean)} />
                                            <Label htmlFor={`checkpoint-${index}`} className="text-sm leading-relaxed">
                                                {point.description}
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <p>Loading checkpoints...</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Persons Information */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">4</span>
                                PERSONS INFORMATION
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="space-y-6">
                                {/* Permit Initiator Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="permitInitiatorName">Permit Initiator Name</Label>
                                        <Input id="permitInitiatorName" value={personsInfo.permitInitiatorName} onChange={(e) => setPersonsInfo(prev => ({ ...prev, permitInitiatorName: e.target.value }))} disabled />
                                    </div>
                                    <div>
                                        <Label htmlFor="permitInitiatorContact">Contact Number</Label>
                                        <Input id="permitInitiatorContact" value={personsInfo.permitInitiatorContact} onChange={(e) => setPersonsInfo(prev => ({ ...prev, permitInitiatorContact: e.target.value }))} disabled />
                                    </div>
                                </div>

                                {/* Contractor's Supervisor Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="contractorsSupervisorName">Contractor's Supervisor</Label>
                                        <Input id="contractorsSupervisorName" value={personsInfo.contractorsSupervisorName} onChange={(e) => setPersonsInfo(prev => ({ ...prev, contractorsSupervisorName: e.target.value }))} placeholder="Enter Contract Supervisor Name" />
                                    </div>
                                    <div>
                                        <Label htmlFor="contractSupervisorNumber">Contact Number</Label>
                                        <Input id="contractSupervisorNumber" value={personsInfo.contractSupervisorNumber} onChange={(e) => setPersonsInfo(prev => ({ ...prev, contractSupervisorNumber: e.target.value }))} placeholder="Enter Contract Supervisor Number" />
                                    </div>
                                </div>

                                {/* Permit Issuer Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="permitIssuerName">Permit Issuer</Label>
                                        <Input id="permitIssuerName" value={personsInfo.permitIssuerName} onChange={(e) => setPersonsInfo(prev => ({ ...prev, permitIssuerName: e.target.value }))} disabled />
                                    </div>
                                    <div>
                                        <Label htmlFor="permitIssuerContact">Contact Number</Label>
                                        <Input id="permitIssuerContact" value={personsInfo.permitIssuerContact} onChange={(e) => setPersonsInfo(prev => ({ ...prev, permitIssuerContact: e.target.value }))} disabled />
                                    </div>
                                </div>

                                {/* Safety Officer Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="safetyOfficerName">Safety Officer</Label>
                                        <Input id="safetyOfficerName" value={personsInfo.safetyOfficerName} onChange={(e) => setPersonsInfo(prev => ({ ...prev, safetyOfficerName: e.target.value }))} disabled />
                                    </div>
                                    <div>
                                        <Label htmlFor="safetyOfficerContact">Contact Number</Label>
                                        <Input id="safetyOfficerContact" value={personsInfo.safetyOfficerContact} onChange={(e) => setPersonsInfo(prev => ({ ...prev, safetyOfficerContact: e.target.value }))} disabled />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Add Manpower Details */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">5</span>
                                ADD MANPOWER DETAILS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="space-y-4">
                                {manpowerDetails.map((detail) => (
                                    <div key={detail.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <Label htmlFor={`assignTo-${detail.id}`}>Assign To*</Label>
                                            <Input id={`assignTo-${detail.id}`} value={detail.assignTo} onChange={(e) => handleManpowerChange(detail.id, 'assignTo', e.target.value)} />
                                        </div>
                                        <div>
                                            <Label htmlFor={`designation-${detail.id}`}>Designation</Label>
                                            <Input id={`designation-${detail.id}`} value={detail.designation} onChange={(e) => handleManpowerChange(detail.id, 'designation', e.target.value)} />
                                        </div>
                                        <div>
                                            <Label htmlFor={`emergencyContact-${detail.id}`}>Emergency Cont. No.</Label>
                                            <Input id={`emergencyContact-${detail.id}`} value={detail.emergencyContact} onChange={(e) => handleManpowerChange(detail.id, 'emergencyContact', e.target.value)} />
                                        </div>
                                        <div className="flex items-end">
                                            {manpowerDetails.length > 1 && (
                                                <Button type="button" variant="outline" size="sm" onClick={() => removeManpowerDetail(detail.id)} className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addManpowerDetail} className="w-full border-dashed">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Manpower
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Declaration */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">6</span>
                                DECLARATION
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <p className="text-sm text-gray-700 mb-4">
                                Declaration - I have understood all the hazard and risk associated in the activity I pledge to implement on the control measure identified in the activity through risk analysis JSA and SOP. I hereby declare that the details given above are correct and also I have been trained by our company for the above mentioned work & I am mentally & physically fit, Alcohol/drugs free to perform it, will be performed with appropriate safety and supervision as per Haven Infinite & Norms.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Contractor Supervisor</Label>
                                    <Input placeholder="Contractor Supervisor" disabled />
                                </div>
                                <div>
                                    <Label>Permit Initiator</Label>
                                    <Input placeholder="Permit Initiator" disabled />
                                </div>
                                <div>
                                    <Label>Permit Issuer</Label>
                                    <Input placeholder="Permit Issuer" disabled />
                                </div>
                            </div>


                        </CardContent>
                    </Card>

                    {/* Daily Extension Sheet */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center justify-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">7</span>
                                DAILY EXTENSION SHEET
                            </CardTitle>
                            <p className="text-center text-sm text-gray-600 mt-2">(Permit Issuer require if there is extension in working time)</p>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-3 text-center font-medium">Date</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Time</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Description</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Contractor's Manpower</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Contractor's supervisor</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Permit Initiator</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Permit Issuer</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Safety Officer</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Time extension</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                            <td className="border border-gray-300 p-4 text-center">{personsInfo.permitInitiatorName || ''}</td>
                                            <td className="border border-gray-300 p-4 text-center">{personsInfo.permitIssuerName || ''}</td>
                                            <td className="border border-gray-300 p-4 text-center">{personsInfo.safetyOfficerName || ''}</td>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work Permit Closure Format */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center justify-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">8</span>
                                WORK PERMIT CLOSURE FORMAT
                            </CardTitle>
                            <p className="text-center text-sm text-gray-600 mt-2">This Format is to be Filled by the persons who had raised the Work Permit.All the below mentioned points must be checked & completed by him after the work is completed</p>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-3 text-center font-medium">Attributes</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Initiator</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Issuer</th>
                                            <th className="border border-gray-300 p-3 text-center font-medium">Security Dept</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 p-3 font-medium bg-gray-50">Declaration</td>
                                            <td className="border border-gray-300 p-3 text-sm">
                                                Certified that the subject work has been completed/ stopped and area cleaned.Scrap shifted to scrap yard.
                                                <br /><br />
                                                All Energy sources are re-established by authorized person.
                                                <br /><br />
                                                All safety equipment returned to security after work is completed.
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm">
                                                Verified that the job is completed & Area is cleaned and safe from any hazard.
                                                <br /><br />
                                                Verified that all energy sources are re-established properly.
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm">
                                                Closed permit received
                                                <br /><br />
                                                Received the given safety equipment's
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 font-medium bg-gray-50">Name and Signature</td>
                                            <td className="border border-gray-300 p-4 text-center">{personsInfo.permitInitiatorName || ''}</td>
                                            <td className="border border-gray-300 p-4 text-center">{personsInfo.permitIssuerName || ''}</td>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 font-medium bg-gray-50">Date and time</td>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                            <td className="border border-gray-300 p-4 text-center">&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents to be Enclosed Here */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">9</span>
                                DOCUMENTS TO BE ENCLOSED HERE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="space-y-4">
                                {attachments.map((attachment) => (
                                    <div key={attachment.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="font-medium">{attachment.id}.</div>
                                        <div>
                                            <Label>Document Name</Label>
                                            <Input value={attachment.name} disabled={attachment.id !== '4'} onChange={(e) => handleAttachmentChange(attachment.id, 'name', e.target.value)} />
                                        </div>
                                        <div>
                                            <Label>Choose File</Label>
                                            <Input type="file" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(attachment.id, file); }} />
                                            <p className="text-xs text-gray-500 mt-1">{attachment.file ? attachment.file.name : 'No file chosen'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                        <Button type="submit" disabled={loading} className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-8 py-3 text-lg">
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Permit Form'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default VendorPermitForm;