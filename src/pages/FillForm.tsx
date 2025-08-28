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
    FileText,
    User,
    Shield,
    CheckCircle,
    Calendar,
    MapPin,
    Building2,
    Phone,
    Mail,
    Clock,
    AlertTriangle,
    Plus,
    Trash2,
    Upload
} from "lucide-react";
import { toast } from "sonner";

interface PersonInfo {
    id: string;
    name: string;
    contactNumber: string;
}

interface ExtensionEntry {
    id: string;
    date: string;
    time: string;
    description: string;
    contractorSupervisor: string;
    contractorSupervisorSign: string;
    permitInitiator: string;
    safetyOfficer: string;
    timeSchedule: string;
}

interface AttachmentFile {
    id: string;
    name: string;
    workVoucher: boolean;
    file: File | null;
}

export const FillForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    // Basic Information State - populated from API
    const [basicInfo, setBasicInfo] = useState({
        docNo: '',
        permitRequestedDate: '28/08/2025',
        permitId: '307',
        rev: '',
        permitIssueDate: ''
    });

    // Detailed Information State
    const [detailedInfo, setDetailedInfo] = useState({
        jobDescription: '',
        location: 'Site : Faridabad Temp / Building : TOWER-6-2 / Wing : N/A / Floor : N/A / Zone / Bld / Room : N/A',
        validationDepartment: 'TESTING',
        permitInitiatedBy: '',
        nameOfContractor: 'M Pharma a Energy',
        contractorsContact: '9876532111',
        addressOfContractor: 'Shivambu Nagar, Amaravati',
        contractorsContact2: 'M Pharma a Energy',
        contractorsDesignee: ''
    });

    // Emergency & Safety Information
    const [emergencyInfo, setEmergencyInfo] = useState({
        contractorEmployeesList: false,
        jobSafetyAnalysisRequired: false,
        emergencyContactName: '',
        emergencyContactNumber: '',
        anyChemicalsToBeUsed: false,
        chemicalName: '',
        contractorMaterialStoragePlaceRequired: false,
        areaAllocated: '',
        anySimultaneousOperations: false,
        operationSpecification: '',
        necessaryPPEProvided: {
            byCompany: false,
            byContractor: false
        },
        utilitiesToBeProvided: {
            waterSupply: false,
            electricalSupply: false,
            airSupply: false
        },
        energyIsolationRequired: false,
        lockOutTagOutDetails: '',
        energyIsolationDoneBy: '',
        energyDeIsolationDoneBy: ''
    });

    // Check Points
    const [checkPoints, setCheckPoints] = useState([
        {
            id: '1',
            description: 'Surrounding area checked, Cleaned and covered.Proper ventilation and lighting provided.',
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
            description: 'All Lifting tool & tackles of contractor\'s are inspected & certified.',
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
        permitInitiatorName: 'Tech Support 1',
        permitInitiatorContact: '9867121211',
        contractorSupervisorName: '',
        contractorSupervisorContact: '',
        permitIssuerName: 'Tech Support 1',
        permitIssuerContact: '',
        safetyOfficerName: 'Tech Support 1',
        safetyOfficerContact: ''
    });

    // Dropdown options for Permit Issuer and Safety Officer
    const permitIssuerOptions = [
        { value: 'tech-support-1', label: 'Tech Support 1' },
        { value: 'tech-support-2', label: 'Tech Support 2' },
        { value: 'tech-support-3', label: 'Tech Support 3' },
        { value: 'safety-manager', label: 'Safety Manager' },
        { value: 'facility-manager', label: 'Facility Manager' }
    ];

    const safetyOfficerOptions = [
        { value: 'tech-support-1', label: 'Tech Support 1' },
        { value: 'safety-officer-1', label: 'Safety Officer 1' },
        { value: 'safety-officer-2', label: 'Safety Officer 2' },
        { value: 'safety-manager', label: 'Safety Manager' },
        { value: 'hse-manager', label: 'HSE Manager' }
    ];

    // Declaration
    const [declaration, setDeclaration] = useState('I hereby declare that all the hazard and risk associated to the activity I pledge to implement as the control measure identified in the activity through risk analysis (RA) and JSA. I thereby declare that the details given above are correct and I have been trained by our company for the above mentioned work & I will mentally and physically fit, alcohol/drug free to perform it, will be performed with appropriate safety and supervisors.');

    // Daily Extension Sheet
    const [dailyExtensions, setDailyExtensions] = useState<ExtensionEntry[]>([
        {
            id: '1',
            date: '',
            time: '',
            description: '',
            contractorSupervisor: '',
            contractorSupervisorSign: 'Tech Support 1',
            permitInitiator: 'Tech Support 1',
            safetyOfficer: 'Tech Support 1',
            timeSchedule: ''
        }
    ]);

    // Work Permit Closure
    const [workPermitClosure, setWorkPermitClosure] = useState({
        attachments: '',
        initiator: 'Verified that this site is completed. close permit work has from time forward. Verified that all energy sources are de-identified provided',
        declaration: 'At all Energy sources are de-identified by authorized person',
        nameSupervisor: 'All safety equipment returned to safety office After Work is Completed',
        nameSignature: 'Tech Support 1',
        dateTime: 'Tech Support 1'
    });

    // Attachments
    const [attachments, setAttachments] = useState<AttachmentFile[]>([
        { id: '1', name: 'List of people to be work', workVoucher: false, file: null },
        { id: '2', name: 'Vendor policy', workVoucher: false, file: null },
        { id: '3', name: 'Medical Reports', workVoucher: false, file: null },
        { id: '4', name: 'Other', workVoucher: false, file: null }
    ]);

    useEffect(() => {
        if (id) {
            console.log('Permit ID:', id);
            fetchPermitDetails(id);
        }
    }, [id]);

    const fetchPermitDetails = async (permitId: string) => {
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                toast.error('Authentication required');
                return;
            }

            setLoading(true);
            const response = await fetch(`${baseUrl}/pms/permits/${permitId}.json`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Permit Details:', data);

                // Map API data to basic info fields
                setBasicInfo(prev => ({
                    ...prev,
                    docNo: data.doc_no || '',
                    permitRequestedDate: data.permit_requested_date || '28/08/2025',
                    permitId: data.id?.toString() || permitId,
                    rev: data.revision || '',
                    permitIssueDate: data.permit_issue_date || ''
                }));

                // You can also populate other form fields here if needed
                // setDetailedInfo, setEmergencyInfo, etc.

            } else {
                console.error('Failed to fetch permit details');
                toast.error('Failed to load permit details');
            }
        } catch (error) {
            console.error('Error fetching permit details:', error);
            toast.error('Error loading permit details');
        } finally {
            setLoading(false);
        }
    };

    const handleDetailedInfoChange = (field: string, value: any) => {
        setDetailedInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleEmergencyInfoChange = (field: string, value: any) => {
        setEmergencyInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleUtilityChange = (utility: string, checked: boolean) => {
        if (['waterSupply', 'electricalSupply', 'airSupply'].includes(utility)) {
            setEmergencyInfo(prev => ({
                ...prev,
                utilitiesToBeProvided: {
                    ...prev.utilitiesToBeProvided,
                    [utility]: checked
                }
            }));
        } else if (['byCompany', 'byContractor'].includes(utility)) {
            setEmergencyInfo(prev => ({
                ...prev,
                necessaryPPEProvided: {
                    ...prev.necessaryPPEProvided,
                    [utility]: checked
                }
            }));
        }
    };

    const handleCheckPointChange = (id: string, field: 'req' | 'checked', checked: boolean) => {
        setCheckPoints(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: checked } : item
            )
        );
    };

    const addDailyExtension = () => {
        const newId = (dailyExtensions.length + 1).toString();
        setDailyExtensions(prev => [
            ...prev,
            {
                id: newId,
                date: '',
                time: '',
                description: '',
                contractorSupervisor: '',
                contractorSupervisorSign: 'Tech Support 1',
                permitInitiator: 'Tech Support 1',
                safetyOfficer: 'Tech Support 1',
                timeSchedule: ''
            }
        ]);
    };

    const removeDailyExtension = (id: string) => {
        setDailyExtensions(prev => prev.filter(item => item.id !== id));
    };

    const handleDailyExtensionChange = (id: string, field: string, value: string) => {
        setDailyExtensions(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleAttachmentChange = (id: string, field: string, value: any) => {
        setAttachments(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const addAttachment = () => {
        const newId = (attachments.length + 1).toString();
        setAttachments(prev => [
            ...prev,
            { id: newId, name: '', workVoucher: false, file: null }
        ]);
    };

    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(item => item.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Here you would implement the API call to submit the form
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

            toast.success('Cold Work Permit form submitted successfully!');
            navigate('/safety/permit');
        } catch (error) {
            toast.error('Failed to submit permit form');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="p-0"
                        >
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
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600">Doc No</Label>
                                            <span className="text-sm font-medium text-gray-900">
                                                {basicInfo.docNo || '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600">Permit Requested Date</Label>
                                            <span className="text-sm font-medium text-gray-900">
                                                {basicInfo.permitRequestedDate}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600">Permit Id</Label>
                                            <span className="text-sm font-medium text-gray-900">
                                                {basicInfo.permitId}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600">Rev</Label>
                                            <span className="text-sm font-medium text-gray-900">
                                                {basicInfo.rev || '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600">Permit Issue Date</Label>
                                            <span className="text-sm font-medium text-gray-900">
                                                {basicInfo.permitIssueDate || '-'}
                                            </span>
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
                                <Building2 className="w-5 h-5" />
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
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="permitInitiatedBy">Permit Initiated by</Label>
                                        <Input
                                            id="permitInitiatedBy"
                                            value={detailedInfo.permitInitiatedBy}
                                            onChange={(e) => handleDetailedInfoChange('permitInitiatedBy', e.target.value)}
                                            placeholder="Enter initiator name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contractorsContact">Contractor's Contact</Label>
                                        <Input
                                            id="contractorsContact"
                                            value={detailedInfo.contractorsContact}
                                            onChange={(e) => handleDetailedInfoChange('contractorsContact', e.target.value)}
                                            placeholder="9876532111"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contractorsContact2">Contractor's Contact</Label>
                                        <Input
                                            id="contractorsContact2"
                                            value={detailedInfo.contractorsContact2}
                                            onChange={(e) => handleDetailedInfoChange('contractorsContact2', e.target.value)}
                                            placeholder="M Pharma a Energy"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contractorsDesignee">Contractor's Designee</Label>
                                        <Input
                                            id="contractorsDesignee"
                                            value={detailedInfo.contractorsDesignee}
                                            onChange={(e) => handleDetailedInfoChange('contractorsDesignee', e.target.value)}
                                            placeholder="Enter designee name"
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
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="validationDept">Validation Department</Label>
                                        <Input
                                            id="validationDept"
                                            value={detailedInfo.validationDepartment}
                                            onChange={(e) => handleDetailedInfoChange('validationDepartment', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="nameOfContractor">Name of Contractor</Label>
                                        <Input
                                            id="nameOfContractor"
                                            value={detailedInfo.nameOfContractor}
                                            onChange={(e) => handleDetailedInfoChange('nameOfContractor', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="addressOfContractor">Address of Contractor</Label>
                                        <Input
                                            id="addressOfContractor"
                                            value={detailedInfo.addressOfContractor}
                                            onChange={(e) => handleDetailedInfoChange('addressOfContractor', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emergency & Safety Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Safety & Emergency Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-6">
                                {/* Contractor employees list */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Label className="text-sm font-medium text-gray-700 block mb-2">
                                        (Attach the list of Contractor employees)
                                    </Label>
                                </div>

                                {/* Job Safety Analysis required */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Job Safety Analysis required :
                                    </Label>
                                    <div className="text-xs text-gray-500 mb-2">(if yes, do it on attached sheet)</div>
                                    <RadioGroup
                                        value={emergencyInfo.jobSafetyAnalysisRequired.toString()}
                                        onValueChange={(value) => handleEmergencyInfoChange('jobSafetyAnalysisRequired', value === 'true')}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="jsa-yes" />
                                            <Label htmlFor="jsa-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="jsa-no" />
                                            <Label htmlFor="jsa-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Emergency Contact Name */}
                                    <div>
                                        <Label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">
                                            Emergency Contact Name :
                                        </Label>
                                        <Input
                                            id="emergencyContactName"
                                            value={emergencyInfo.emergencyContactName}
                                            onChange={(e) => handleEmergencyInfoChange('emergencyContactName', e.target.value)}
                                            placeholder="Enter Emergency Contact Name"
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Emergency Contact Number */}
                                    <div>
                                        <Label htmlFor="emergencyContactNumber" className="text-sm font-medium text-gray-700">
                                            Emergency Contact Number :
                                        </Label>
                                        <Input
                                            id="emergencyContactNumber"
                                            value={emergencyInfo.emergencyContactNumber}
                                            onChange={(e) => handleEmergencyInfoChange('emergencyContactNumber', e.target.value)}
                                            placeholder="Enter Emergency Contact Number"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Any Chemicals to be used */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Any Chemicals to be used then MSDS available :
                                    </Label>
                                    <div className="text-xs text-gray-500 mb-2">(if yes, Please attach MSDS)</div>
                                    <RadioGroup
                                        value={emergencyInfo.anyChemicalsToBeUsed.toString()}
                                        onValueChange={(value) => handleEmergencyInfoChange('anyChemicalsToBeUsed', value === 'true')}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="chemicals-yes" />
                                            <Label htmlFor="chemicals-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="chemicals-no" />
                                            <Label htmlFor="chemicals-no">No</Label>
                                        </div>
                                    </RadioGroup>

                                    {/* If Yes Please specify the name */}
                                    <div className="mt-4">
                                        <Label htmlFor="chemicalName" className="text-sm font-medium text-gray-700">
                                            If 'Yes' Please specify the name :
                                        </Label>
                                        <Input
                                            id="chemicalName"
                                            value={emergencyInfo.chemicalName}
                                            onChange={(e) => handleEmergencyInfoChange('chemicalName', e.target.value)}
                                            placeholder=""
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Contractor's Material Storage Place required */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Contractor's Material Storage Place required :
                                    </Label>
                                    <RadioGroup
                                        value={emergencyInfo.contractorMaterialStoragePlaceRequired.toString()}
                                        onValueChange={(value) => handleEmergencyInfoChange('contractorMaterialStoragePlaceRequired', value === 'true')}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="storage-yes" />
                                            <Label htmlFor="storage-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="storage-no" />
                                            <Label htmlFor="storage-no">No</Label>
                                        </div>
                                    </RadioGroup>

                                    {/* Area Allocated */}
                                    <div className="mt-4">
                                        <Label htmlFor="areaAllocated" className="text-sm font-medium text-gray-700">
                                            Area Allocated :
                                        </Label>
                                        <Input
                                            id="areaAllocated"
                                            value={emergencyInfo.areaAllocated}
                                            onChange={(e) => handleEmergencyInfoChange('areaAllocated', e.target.value)}
                                            placeholder=""
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Any Simultaneous Operations */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Any Simultaneous Operations :
                                    </Label>
                                    <RadioGroup
                                        value={emergencyInfo.anySimultaneousOperations.toString()}
                                        onValueChange={(value) => handleEmergencyInfoChange('anySimultaneousOperations', value === 'true')}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="simultaneous-yes" />
                                            <Label htmlFor="simultaneous-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="simultaneous-no" />
                                            <Label htmlFor="simultaneous-no">No</Label>
                                        </div>
                                    </RadioGroup>

                                    {/* If Yes specify the Operation */}
                                    <div className="mt-4">
                                        <Label htmlFor="operationSpecification" className="text-sm font-medium text-gray-700">
                                            If Yes specify the Operation :
                                        </Label>
                                        <Input
                                            id="operationSpecification"
                                            value={emergencyInfo.operationSpecification}
                                            onChange={(e) => handleEmergencyInfoChange('operationSpecification', e.target.value)}
                                            placeholder=""
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Necessary PPEs provided */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Necessary PPEs provided :
                                    </Label>
                                    <div className="text-xs text-gray-500 mb-2">(to be returned back to security )</div>
                                    <div className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="ppe-company"
                                                checked={emergencyInfo.necessaryPPEProvided.byCompany}
                                                onCheckedChange={(checked) => handleUtilityChange('byCompany', checked as boolean)}
                                            />
                                            <Label htmlFor="ppe-company">by company</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="ppe-contractor"
                                                checked={emergencyInfo.necessaryPPEProvided.byContractor}
                                                onCheckedChange={(checked) => handleUtilityChange('byContractor', checked as boolean)}
                                            />
                                            <Label htmlFor="ppe-contractor">by Contractor</Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Utilities to be provided by company */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Utilities to be provided by company :
                                    </Label>
                                    <div className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="water-supply"
                                                checked={emergencyInfo.utilitiesToBeProvided.waterSupply}
                                                onCheckedChange={(checked) => handleUtilityChange('waterSupply', checked as boolean)}
                                            />
                                            <Label htmlFor="water-supply">Water Supply</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="electrical-supply"
                                                checked={emergencyInfo.utilitiesToBeProvided.electricalSupply}
                                                onCheckedChange={(checked) => handleUtilityChange('electricalSupply', checked as boolean)}
                                            />
                                            <Label htmlFor="electrical-supply">Electrical Supply</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="air-supply"
                                                checked={emergencyInfo.utilitiesToBeProvided.airSupply}
                                                onCheckedChange={(checked) => handleUtilityChange('airSupply', checked as boolean)}
                                            />
                                            <Label htmlFor="air-supply">Air Supply</Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Energy Isolation is required */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                                        Energy Isolation is required :
                                    </Label>
                                    <RadioGroup
                                        value={emergencyInfo.energyIsolationRequired.toString()}
                                        onValueChange={(value) => handleEmergencyInfoChange('energyIsolationRequired', value === 'true')}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="isolation-yes" />
                                            <Label htmlFor="isolation-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="isolation-no" />
                                            <Label htmlFor="isolation-no">No</Label>
                                        </div>
                                    </RadioGroup>

                                    {/* If Yes, Lock Out Tag Out details */}
                                    <div className="mt-4">
                                        <Label htmlFor="lockOutTagOutDetails" className="text-sm font-medium text-gray-700">
                                            If Yes, Lock Out Tag Out details :
                                        </Label>
                                        <Input
                                            id="lockOutTagOutDetails"
                                            value={emergencyInfo.lockOutTagOutDetails}
                                            onChange={(e) => handleEmergencyInfoChange('lockOutTagOutDetails', e.target.value)}
                                            placeholder=""
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Energy Isolation Done By */}
                                    <div>
                                        <Label htmlFor="energyIsolationDoneBy" className="text-sm font-medium text-gray-700">
                                            Energy Isolation Done By :
                                        </Label>
                                        <div className="text-xs text-gray-500 mb-2">(Name & Sign)</div>
                                        <Input
                                            id="energyIsolationDoneBy"
                                            value={emergencyInfo.energyIsolationDoneBy}
                                            onChange={(e) => handleEmergencyInfoChange('energyIsolationDoneBy', e.target.value)}
                                            placeholder=""
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Energy De-Isolation Done By */}
                                    <div>
                                        <Label htmlFor="energyDeIsolationDoneBy" className="text-sm font-medium text-gray-700">
                                            Energy De-Isolation Done By :
                                        </Label>
                                        <div className="text-xs text-gray-500 mb-2">(Name & Sign)</div>
                                        <Input
                                            id="energyDeIsolationDoneBy"
                                            value={emergencyInfo.energyDeIsolationDoneBy}
                                            onChange={(e) => handleEmergencyInfoChange('energyDeIsolationDoneBy', e.target.value)}
                                            placeholder=""
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
                                                    <div className="flex justify-center">
                                                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-50"
                                                            onClick={() => handleCheckPointChange(point.id, 'req', !point.req)}>
                                                            {point.req && (
                                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 p-4 text-center">
                                                    <div className="flex justify-center">
                                                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-50"
                                                            onClick={() => handleCheckPointChange(point.id, 'checked', !point.checked)}>
                                                            {point.checked && (
                                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                            )}
                                                        </div>
                                                    </div>
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
                                        <Label htmlFor="permitInitiatorName">Permit Initiator Name</Label>
                                        <Input
                                            id="permitInitiatorName"
                                            value={personsInfo.permitInitiatorName}
                                            onChange={(e) => setPersonsInfo(prev => ({ ...prev, permitInitiatorName: e.target.value }))}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="permitInitiatorContact">Contact Number</Label>
                                        <Input
                                            id="permitInitiatorContact"
                                            value={personsInfo.permitInitiatorContact}
                                            onChange={(e) => setPersonsInfo(prev => ({ ...prev, permitInitiatorContact: e.target.value }))}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contractorSupervisorName">Contractor's Supervisor</Label>
                                        <Input
                                            id="contractorSupervisorName"
                                            value={personsInfo.contractorSupervisorName}
                                            onChange={(e) => setPersonsInfo(prev => ({ ...prev, contractorSupervisorName: e.target.value }))}
                                            placeholder="Enter Contract Supervisor Name"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contractorSupervisorContact">Contact Number</Label>
                                        <Input
                                            id="contractorSupervisorContact"
                                            value={personsInfo.contractorSupervisorContact}
                                            onChange={(e) => setPersonsInfo(prev => ({ ...prev, contractorSupervisorContact: e.target.value }))}
                                            placeholder="Enter Contract Supervisor Number"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="permitIssuerName">Permit Issuer</Label>
                                        <Select
                                            value={personsInfo.permitIssuerName}
                                            onValueChange={(value) => setPersonsInfo(prev => ({ ...prev, permitIssuerName: value }))}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select Permit Issuer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {permitIssuerOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.label}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="safetyOfficerName">Safety Officer</Label>
                                        <Select
                                            value={personsInfo.safetyOfficerName}
                                            onValueChange={(value) => setPersonsInfo(prev => ({ ...prev, safetyOfficerName: value }))}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select Safety Officer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {safetyOfficerOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.label}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                    I have understood all the hazard and risk associated in the activity I pledge to implement on the control measure identified in the activity through risk analyses JSA and SOP. I Hereby declare that the details given above are correct and also I have been trained by our company for the above mentioned work & I am mentally and physically fit, Alcohol/drugs free to perform it, will be performed with appropriate safety and supervision as per Panchshil Test & Norms
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
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-xs h-12"></td>
                                            <td className="border border-gray-300 p-3 text-xs h-12"></td>
                                            <td className="border border-gray-300 p-3 text-xs h-12"></td>
                                            <td className="border border-gray-300 p-3 text-xs h-12"></td>
                                            <td className="border border-gray-300 p-3 text-xs h-12"></td>
                                            <td className="border border-gray-300 p-3 text-xs h-12 text-center">Tech Support 1</td>
                                            <td className="border border-gray-300 p-3 text-xs h-12 text-center">Tech Support 1</td>
                                            <td className="border border-gray-300 p-3 text-xs h-12 text-center">Tech Support 1</td>
                                            <td className="border border-gray-300 p-3 text-xs h-12"></td>
                                        </tr>
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
                                            <td className="border border-gray-300 p-3 text-sm">Certified that the subject work has been completed/ stopped and area cleaned.Scrap shifted to scrap yard.</td>
                                            <td className="border border-gray-300 p-3 text-sm">Verified that the job is completed & Area is cleaned and safe from any hazard.</td>
                                            <td className="border border-gray-300 p-3 text-sm">Closed permit received</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Declaration</td>
                                            <td className="border border-gray-300 p-3 text-sm">All Energy sources are re-established by authorized person.</td>
                                            <td className="border border-gray-300 p-3 text-sm">Verified that all energy sources are re-established properly.</td>
                                            <td className="border border-gray-300 p-3 text-sm">Received the given safety equipment's</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm"></td>
                                            <td className="border border-gray-300 p-3 text-sm">All safety equipment returned to security after work is completed.</td>
                                            <td className="border border-gray-300 p-3 text-sm"></td>
                                            <td className="border border-gray-300 p-3 text-sm"></td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Name and Signature</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">Tech Support 1</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">Tech Support 1</td>
                                            <td className="border border-gray-300 p-3 text-sm"></td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">Date and time</td>
                                            <td className="border border-gray-300 p-3 text-sm h-12"></td>
                                            <td className="border border-gray-300 p-3 text-sm h-12"></td>
                                            <td className="border border-gray-300 p-3 text-sm h-12"></td>
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
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm text-center">1.</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">List of people to be work</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">No</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm text-center">2.</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">ESI/WC policy</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">No</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm text-center">3.</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">Medical Reports</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">No</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm text-center">4.</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">Other</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">No</td>
                                        </tr>
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
