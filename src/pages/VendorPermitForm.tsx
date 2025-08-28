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
    name: string;
    designation: string;
    emergencyContact: string;
}

interface AttachmentFile {
    id: string;
    name: string;
    file: File | null;
}

export const VendorPermitForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    // If we have an id, it means we came from a permit details page
    useEffect(() => {
        if (id) {
            // You could fetch permit details here and pre-populate the form
            console.log('Permit ID:', id);
            // For now, we'll just show the form
        }
    }, [id]);

    // Basic Information State
    const [basicInfo, setBasicInfo] = useState({
        deptNo: '',
        recordDepartmentCode: '',
        permitNo: '',
        permitIssuedOn: '',
        permitType: '',
        permitValidUpto: '',
        contractorsContact: '',
        safetyOfficer: '',
        contractorsEmployees: '',
        jobSafetyAnalysis: ''
    });

    // Detailed Information State
    const [detailedInfo, setDetailedInfo] = useState({
        jobDescription: '',
        location: '',
        validationDepartment: '',
        permitInitiatedBy: '',
        deptRepresentative: '',
        validDate: '',
        addressOfContractor: '',
        vehicleEntryRequired: false,
        riskAssessmentNumber: '',
        gasTestingConducted: false,
        gasTestingResult: '',
        continuousGasMonitoring: false,
        workInExOperation: false,
        utilitiesToBeProvided: {
            waterSupply: false,
            electricalSupply: false,
            airSupply: false
        },
        ifYesLockOut: '',
        energyIsolationDoneBy: ''
    });

    // Gas Testing Records
    const [gasTestingRecords, setGasTestingRecords] = useState([
        { time: '', gas: '', result: '', ppm: '', time2: '', gas2: '', result2: '', time3: '', gas3: '', result3: '' }
    ]);

    // Check Points
    const [checkPoints, setCheckPoints] = useState([
        {
            description: 'Contractor/Sub contractor cleared area the work area is clear and clean and suitable workplace has been identified at the site',
            checked: false
        },
        {
            description: 'Installation approved entry, equipment and material cleared area work area is clear and',
            checked: false
        },
        {
            description: 'Positions and equipment can be fixed approved and clearing protected',
            checked: false
        },
        {
            description: 'Effective work schedule, numbers, time reference and the equipment to be used for the work confirming',
            checked: false
        },
        {
            description: 'Proper electrical connection with earthing cleared with earthing equipment\'s',
            checked: false
        },
        {
            description: 'Hand tools and equipment in good condition and effectively prepared and fixed',
            checked: false
        },
        {
            description: 'Protection of personal at all time until',
            checked: false
        }
    ]);

    // Persons Information
    const [personsInfo, setPersonsInfo] = useState({
        permitInitiatorName: '',
        permitInitiatorContact: '',
        safetyOfficerName: '',
        safetyOfficerContact: ''
    });

    // Manpower Details
    const [manpowerDetails, setManpowerDetails] = useState<ManpowerDetail[]>([
        { id: '1', name: '', designation: '', emergencyContact: '' }
    ]);

    // Work Permit Closure
    const [workPermitClosure, setWorkPermitClosure] = useState({
        declaration: '',
        contractorSupervisor: '',
        permitInitiator: '',
        permitIssuer: ''
    });

    // Attachments
    const [attachments, setAttachments] = useState<AttachmentFile[]>([
        { id: '1', name: 'List of people to be work', file: null }
    ]);

    const handleBasicInfoChange = (field: string, value: string) => {
        setBasicInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDetailedInfoChange = (field: string, value: any) => {
        setDetailedInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUtilityChange = (utility: string, checked: boolean) => {
        setDetailedInfo(prev => ({
            ...prev,
            utilitiesToBeProvided: {
                ...prev.utilitiesToBeProvided,
                [utility]: checked
            }
        }));
    };

    const handleCheckPointChange = (index: number, checked: boolean) => {
        setCheckPoints(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, checked } : item
            )
        );
    };

    const addManpowerDetail = () => {
        const newId = (manpowerDetails.length + 1).toString();
        setManpowerDetails(prev => [
            ...prev,
            { id: newId, name: '', designation: '', emergencyContact: '' }
        ]);
    };

    const removeManpowerDetail = (id: string) => {
        setManpowerDetails(prev => prev.filter(item => item.id !== id));
    };

    const handleManpowerChange = (id: string, field: string, value: string) => {
        setManpowerDetails(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const addAttachment = () => {
        const newId = (attachments.length + 1).toString();
        setAttachments(prev => [
            ...prev,
            { id: newId, name: '', file: null }
        ]);
    };

    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(item => item.id !== id));
    };

    const handleAttachmentChange = (id: string, field: string, value: string) => {
        setAttachments(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleFileUpload = (id: string, file: File) => {
        setAttachments(prev =>
            prev.map(item =>
                item.id === id ? { ...item, file } : item
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Here you would implement the API call to submit the form
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

            toast.success('Vendor permit form submitted successfully!');
            navigate('/permits');
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
                            LOADING UNLOADING OF HAZARDOUS MATERIAL PERMIT
                            {id && <span className="text-sm text-gray-600 ml-2">(Permit ID: {id})</span>}
                        </h1>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
                        VENDOR
                    </Badge>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-orange-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="deptNo">Dept No.</Label>
                                    <Input
                                        id="deptNo"
                                        value={basicInfo.deptNo}
                                        onChange={(e) => handleBasicInfoChange('deptNo', e.target.value)}
                                        placeholder="Enter department number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="recordDeptCode">Record Department Code</Label>
                                    <Input
                                        id="recordDeptCode"
                                        value={basicInfo.recordDepartmentCode}
                                        onChange={(e) => handleBasicInfoChange('recordDepartmentCode', e.target.value)}
                                        placeholder="PM/R/2629"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rev">Rev.</Label>
                                    <Input
                                        id="rev"
                                        defaultValue="Permit Issue Data"
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="permitNo">Permit No.</Label>
                                    <Input
                                        id="permitNo"
                                        value={basicInfo.permitNo}
                                        onChange={(e) => handleBasicInfoChange('permitNo', e.target.value)}
                                        placeholder="708"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="permitType">Permit Type</Label>
                                    <Select onValueChange={(value) => handleBasicInfoChange('permitType', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select permit type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hazardous">Hazardous Material</SelectItem>
                                            <SelectItem value="general">General Work</SelectItem>
                                            <SelectItem value="hot-work">Hot Work</SelectItem>
                                            <SelectItem value="confined-space">Confined Space</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="permitIssued">Permit Issued On</Label>
                                    <Input
                                        id="permitIssued"
                                        type="date"
                                        value={basicInfo.permitIssuedOn}
                                        onChange={(e) => handleBasicInfoChange('permitIssuedOn', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-orange-50 rounded-t-lg">
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
                                            placeholder="Gas Unloading completing work & Loading"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="permitInitiatedBy">Permit Initiated by</Label>
                                        <Input
                                            id="permitInitiatedBy"
                                            value={detailedInfo.permitInitiatedBy}
                                            onChange={(e) => handleDetailedInfoChange('permitInitiatedBy', e.target.value)}
                                            placeholder="Testing Activity"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="validDate">Valid Date</Label>
                                        <Input
                                            id="validDate"
                                            type="date"
                                            value={detailedInfo.validDate}
                                            onChange={(e) => handleDetailedInfoChange('validDate', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contractorsContact">Contractor's Contact</Label>
                                        <Input
                                            id="contractorsContact"
                                            value={basicInfo.contractorsContact}
                                            onChange={(e) => handleBasicInfoChange('contractorsContact', e.target.value)}
                                            placeholder="PHONE:95788"
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
                                            placeholder="JPS - PDH Venuri Major / Building / COMMON / Wing / Sub / Floor / Bld / Zone / Bld / Planner / Bld"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="validationDept">Validation Department</Label>
                                        <Input
                                            id="validationDept"
                                            value={detailedInfo.validationDepartment}
                                            onChange={(e) => handleDetailedInfoChange('validationDepartment', e.target.value)}
                                            placeholder="TESTING"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="deptRepresentative">Dept Representative</Label>
                                        <Input
                                            id="deptRepresentative"
                                            value={detailedInfo.deptRepresentative}
                                            onChange={(e) => handleDetailedInfoChange('deptRepresentative', e.target.value)}
                                            placeholder="Planning Solutions"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="addressOfContractor">Address of Contractor</Label>
                                        <Input
                                            id="addressOfContractor"
                                            value={detailedInfo.addressOfContractor}
                                            onChange={(e) => handleDetailedInfoChange('addressOfContractor', e.target.value)}
                                            placeholder="Shiv industrial / district Mumbai"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Options */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Vehicle Entry Required</Label>
                                        <RadioGroup
                                            value={detailedInfo.vehicleEntryRequired.toString()}
                                            onValueChange={(value) => handleDetailedInfoChange('vehicleEntryRequired', value === 'true')}
                                            className="flex gap-6 mt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="true" id="vehicle-yes" />
                                                <Label htmlFor="vehicle-yes">Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="false" id="vehicle-no" />
                                                <Label htmlFor="vehicle-no">No</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div>
                                        <Label htmlFor="riskAssessment">Risk Assessment Number</Label>
                                        <Input
                                            id="riskAssessment"
                                            value={detailedInfo.riskAssessmentNumber}
                                            onChange={(e) => handleDetailedInfoChange('riskAssessmentNumber', e.target.value)}
                                            placeholder="Respective Reference Number"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Gas Testing conducted for</Label>
                                        <div className="flex gap-4 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="hydrogen"
                                                    checked={detailedInfo.gasTestingConducted}
                                                    onCheckedChange={(checked) => handleDetailedInfoChange('gasTestingConducted', checked)}
                                                />
                                                <Label htmlFor="hydrogen">H2S</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="oxygen" />
                                                <Label htmlFor="oxygen">Oxygen</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="other" />
                                                <Label htmlFor="other">Other</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Continuous Gas Monitoring Required</Label>
                                        <RadioGroup
                                            value={detailedInfo.continuousGasMonitoring.toString()}
                                            onValueChange={(value) => handleDetailedInfoChange('continuousGasMonitoring', value === 'true')}
                                            className="flex gap-6 mt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="true" id="monitoring-yes" />
                                                <Label htmlFor="monitoring-yes">Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="false" id="monitoring-no" />
                                                <Label htmlFor="monitoring-no">No</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>

                                <div>
                                    <Label>Utilities to be provided by company</Label>
                                    <div className="flex gap-6 mt-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="water-supply"
                                                checked={detailedInfo.utilitiesToBeProvided.waterSupply}
                                                onCheckedChange={(checked) => handleUtilityChange('waterSupply', checked as boolean)}
                                            />
                                            <Label htmlFor="water-supply">Water Supply</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="electrical-supply"
                                                checked={detailedInfo.utilitiesToBeProvided.electricalSupply}
                                                onCheckedChange={(checked) => handleUtilityChange('electricalSupply', checked as boolean)}
                                            />
                                            <Label htmlFor="electrical-supply">Electrical Supply</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="air-supply"
                                                checked={detailedInfo.utilitiesToBeProvided.airSupply}
                                                onCheckedChange={(checked) => handleUtilityChange('airSupply', checked as boolean)}
                                            />
                                            <Label htmlFor="air-supply">Air Supply</Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="lockOut">If Yes, Lock Out Tag Out details</Label>
                                        <Textarea
                                            id="lockOut"
                                            value={detailedInfo.ifYesLockOut}
                                            onChange={(e) => handleDetailedInfoChange('ifYesLockOut', e.target.value)}
                                            placeholder="Enter details"
                                            rows={2}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="energyIsolation">Energy Isolation Done By</Label>
                                        <Input
                                            id="energyIsolation"
                                            value={detailedInfo.energyIsolationDoneBy}
                                            onChange={(e) => handleDetailedInfoChange('energyIsolationDoneBy', e.target.value)}
                                            placeholder="Enter name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gas Testing Record */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-orange-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Gas Testing Record
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">Time</th>
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">Gas</th>
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">Result</th>
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">PPM</th>
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">Time</th>
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">Gas</th>
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">Result</th>
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">Time</th>
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">Gas</th>
                                            <th className="border border-gray-200 p-3 text-left text-sm font-medium">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-200 p-2">
                                                <Input type="time" className="w-full" />
                                            </td>
                                            <td className="border border-gray-200 p-2">
                                                <Input className="w-full" />
                                            </td>
                                            <td className="border border-gray-200 p-2">
                                                <Input className="w-full" />
                                            </td>
                                            <td className="border border-gray-200 p-2">
                                                <Input className="w-full" />
                                            </td>
                                            <td className="border border-gray-200 p-2">
                                                <Input type="time" className="w-full" />
                                            </td>
                                            <td className="border border-gray-200 p-2">
                                                <Input className="w-full" />
                                            </td>
                                            <td className="border border-gray-200 p-2">
                                                <Input className="w-full" />
                                            </td>
                                            <td className="border border-gray-200 p-2">
                                                <Input type="time" className="w-full" />
                                            </td>
                                            <td className="border border-gray-200 p-2">
                                                <Input className="w-full" />
                                            </td>
                                            <td className="border border-gray-200 p-2">
                                                <Input className="w-full" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Check Points */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-orange-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Check Points
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {checkPoints.map((point, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Checkbox
                                            id={`checkpoint-${index}`}
                                            checked={point.checked}
                                            onCheckedChange={(checked) => handleCheckPointChange(index, checked as boolean)}
                                        />
                                        <Label htmlFor={`checkpoint-${index}`} className="text-sm leading-relaxed">
                                            {point.description}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Persons Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-orange-50 rounded-t-lg">
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
                                            placeholder="Supervisor/Sub Group"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="permitInitiatorContact">Contact Number</Label>
                                        <Input
                                            id="permitInitiatorContact"
                                            value={personsInfo.permitInitiatorContact}
                                            onChange={(e) => setPersonsInfo(prev => ({ ...prev, permitInitiatorContact: e.target.value }))}
                                            placeholder="98765432678"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="safetyOfficerName">Safety Officer</Label>
                                        <Input
                                            id="safetyOfficerName"
                                            value={personsInfo.safetyOfficerName}
                                            onChange={(e) => setPersonsInfo(prev => ({ ...prev, safetyOfficerName: e.target.value }))}
                                            placeholder="Apka added Name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="safetyOfficerContact">Contact Number</Label>
                                        <Input
                                            id="safetyOfficerContact"
                                            value={personsInfo.safetyOfficerContact}
                                            onChange={(e) => setPersonsInfo(prev => ({ ...prev, safetyOfficerContact: e.target.value }))}
                                            placeholder="98765432678"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Add Manpower Details */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-orange-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Add Manpower Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {manpowerDetails.map((detail, index) => (
                                    <div key={detail.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <Label htmlFor={`name-${detail.id}`}>Assign To</Label>
                                            <Input
                                                id={`name-${detail.id}`}
                                                value={detail.name}
                                                onChange={(e) => handleManpowerChange(detail.id, 'name', e.target.value)}
                                                placeholder="RAJAN GANGBOLE"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`designation-${detail.id}`}>Designation</Label>
                                            <Input
                                                id={`designation-${detail.id}`}
                                                value={detail.designation}
                                                onChange={(e) => handleManpowerChange(detail.id, 'designation', e.target.value)}
                                                placeholder="Supervisor"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`contact-${detail.id}`}>Emergency Cont. No.</Label>
                                            <Input
                                                id={`contact-${detail.id}`}
                                                value={detail.emergencyContact}
                                                onChange={(e) => handleManpowerChange(detail.id, 'emergencyContact', e.target.value)}
                                                placeholder="7798679467"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            {manpowerDetails.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeManpowerDetail(detail.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addManpowerDetail}
                                    className="w-full border-dashed"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add More Manpower
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work Permit Closure Format */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-orange-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Work Permit Closure Format
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="declaration">Declaration</Label>
                                    <Textarea
                                        id="declaration"
                                        value={workPermitClosure.declaration}
                                        onChange={(e) => setWorkPermitClosure(prev => ({ ...prev, declaration: e.target.value }))}
                                        placeholder="I hereby certify that all the hazard and risk associated to the activity I pledge to implement as the control measure identified in the activity through risk analysis (RA) and JSA. I thereby declare that the details given above are correct and I have been trained by our company for the above mentioned work & I will personally & physically fit, alcoholfree free to perform it, will be performed with appropriate safety and supervisors."
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label htmlFor="contractorSupervisor">Contractor Supervisor</Label>
                                        <Input
                                            id="contractorSupervisor"
                                            value={workPermitClosure.contractorSupervisor}
                                            onChange={(e) => setWorkPermitClosure(prev => ({ ...prev, contractorSupervisor: e.target.value }))}
                                            placeholder="Name & Signature"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="permitInitiatorClosure">Permit Initiator</Label>
                                        <Input
                                            id="permitInitiatorClosure"
                                            value={workPermitClosure.permitInitiator}
                                            onChange={(e) => setWorkPermitClosure(prev => ({ ...prev, permitInitiator: e.target.value }))}
                                            placeholder="Name & Signature"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="permitIssuer">Permit Issuer</Label>
                                        <Input
                                            id="permitIssuer"
                                            value={workPermitClosure.permitIssuer}
                                            onChange={(e) => setWorkPermitClosure(prev => ({ ...prev, permitIssuer: e.target.value }))}
                                            placeholder="Name & Signature"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents to be Enclosed */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-orange-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Documents to be Enclosed Here
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {attachments.map((attachment, index) => (
                                    <div key={attachment.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="font-medium text-sm">{index + 1}.</div>
                                        <div>
                                            <Input
                                                value={attachment.name}
                                                onChange={(e) => handleAttachmentChange(attachment.id, 'name', e.target.value)}
                                                placeholder="Document Name"
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(attachment.id, file);
                                                }}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-xs">
                                                {attachment.file ? 'File Selected' : 'No File Chosen'}
                                            </Badge>
                                            {attachments.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeAttachment(attachment.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addAttachment}
                                    className="w-full border-dashed"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add More Document
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-8 py-3 text-lg"
                        >
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
        </div>
    );
};

export default VendorPermitForm;
