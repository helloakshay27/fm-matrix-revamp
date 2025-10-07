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
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
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

interface PersonOption {
    id: string;
    name: string;
    mobile: string;
}

interface DropdownData {
    permit_issuers: PersonOption[];
    selected_issuer: PersonOption | null;
    permit_safety_officers: PersonOption[];
    selected_safety_officer: PersonOption | null;
}

// MUI Field Styles for consistency
const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
        padding: { xs: '8px', sm: '10px', md: '12px' },
    },
};

const menuProps = {
    PaperProps: {
        style: {
            maxHeight: 200,
            border: '1px solid #e0e0e0',
        },
    },
    MenuListProps: {
        style: {
            padding: 0,
        },
    },
    anchorOrigin: {
        vertical: 'bottom' as const,
        horizontal: 'left' as const,
    },
    transformOrigin: {
        vertical: 'top' as const,
        horizontal: 'left' as const,
    },
};

interface CheckPoint {
    id: string;
    key: string; // This key corresponds to the property name in the API response
    description: string;
    req: boolean;
    checked: boolean;
    parameter1?: string; // API parameter name for form submission
    parameter2?: string; // API parameter name for form submission
}

export const FillForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [permitData, setPermitData] = useState<any>(null);

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
        energyDeisolationDoneBy: '',
        // Fields for hazardous material work
        jobSafetyAnalysisAttached: '',
        riskAssessmentNumber: '',
        vehicleEntryRequired: null as string | null,
        gasTestingConductedFor: {
            hydrocarbons: false,
            h2s: false,
            oxygen: false,
            others: false
        },
        gasTestToBeRepeatedAfter: '',
        continuousGasMonitoringRequired: null as string | null,
        worksiteExaminationBy: null as string | null,
        anySimultaneousOperation: null as string | null,
        ifYesSpecifyTheOperation: '',
        ppesProvided: null as string | null,
        isolationRequired: null as string | null,
        tagOutDetailsElectrical: '',
        energyIsolationDoneByElectrical: '',
        energyDeIsolationDoneByElectrical: '',
        permissionIsGivenToContractor: ''
    });

    // Emergency & Safety Information
    const [emergencyInfo, setEmergencyInfo] = useState({
        contractorEmployeesList: false
    });

    // Check Points - will be populated from API
    const [checkPoints, setCheckPoints] = useState<CheckPoint[]>([]);

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

    // Dropdown Data for Permit Issuer and Safety Officer
    const [dropdownData, setDropdownData] = useState<DropdownData>({
        permit_issuers: [],
        selected_issuer: null,
        permit_safety_officers: [],
        selected_safety_officer: null
    });

    // Selected values for dropdowns
    const [selectedPermitIssuerId, setSelectedPermitIssuerId] = useState<string>('');
    const [selectedSafetyOfficerId, setSelectedSafetyOfficerId] = useState<string>('');
    const [permitTypeName, setPermitTypeName] = useState<string>('COLD WORK PERMIT');

    // Declaration
    const [declaration] = useState(
        'I have understood all the hazard and risk associated in the activity I pledge to implement on the control measure identified in the activity through risk analyses JSA and SOP. I Hereby declare that the details given above are correct and also I have been trained by our company for the above mentioned work & I am mentally and physically fit, Alcohol/drugs free to perform it, will be performed with appropriate safety and supervision as per Panchshil Test & Norms'
    );

    // Daily Extension Sheet
    const [dailyExtensions, setDailyExtensions] = useState<ExtensionEntry[]>([]);

    // Work Permit Closure
    const [workPermitClosure, setWorkPermitClosure] = useState({
        declarations: {
            row1: {
                initiator: 'Certified that the subject work has been completed/ stopped and area cleaned.Scrap shifted to scrap yard.',
                issuer: 'Verified that the job is completed & Area is cleaned and safe from any hazard.',
                security_dept: 'Closed permit recived'
            },
            row2: {
                initiator: 'All Energy sources are re-established by authorized person.',
                issuer: 'Verified that all energy resources are re-established properly.',
                security_dept: ''
            },
            row3: {
                initiator: 'All safety equipment returned to security after work is completed.',
                issuer: '',
                security_dept: 'Received the given sefety equipment\'s'
            }
        },
        signatures: {
            initiator: '',
            issuer: '',
            security_dept: ''
        },
        date_and_time: {
            initiator: '',
            issuer: '',
            security_dept: ''
        }
    });

    // Attachments
    const [attachments, setAttachments] = useState<AttachmentFile[]>([
        { id: '1', name: 'List of people to be work', workVoucher: false, file: null, sr_no: 1 },
        { id: '2', name: 'ESI/WC policy', workVoucher: false, file: null, sr_no: 2 },
        { id: '3', name: 'Medical Reports', workVoucher: false, file: null, sr_no: 3 },
        { id: '4', name: 'Other', workVoucher: false, file: null, sr_no: 4 }
    ]);

    useEffect(() => {
        if (id) {
            fetchPermitDetails(id);
            fetchDropdownData(id);
        }
    }, [id]);

    const fetchDropdownData = async (permitId: string) => {
        try {
            let baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.error('Authentication required for dropdown data');
                return;
            }

            // Add https:// prefix if not present
            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = `https://${baseUrl}`;
            }

            // Extract just the permit ID if needed
            let actualPermitId = permitId;
            if (permitId.includes('.json')) {
                const matches = permitId.match(/\/permits\/(\d+)\.json$/);
                if (matches && matches[1]) {
                    actualPermitId = matches[1];
                } else {
                    const idMatch = permitId.match(/(\d+)\.json$/);
                    if (idMatch && idMatch[1]) {
                        actualPermitId = idMatch[1];
                    }
                }
            }

            const response = await fetch(`${baseUrl}/pms/permits/${actualPermitId}/issue_and_safety_officer.json`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache'
            });

            if (response.ok) {
                const data = await response.json();
                setDropdownData(data);

                // Set selected values if they exist
                if (data.selected_issuer?.id) {
                    setSelectedPermitIssuerId(data.selected_issuer.id.toString());
                }
                if (data.selected_safety_officer?.id) {
                    setSelectedSafetyOfficerId(data.selected_safety_officer.id.toString());
                }
            } else {
                console.error('Failed to load dropdown data');
            }
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

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
                const permitDataResponse = data.pms_permit;

                // Store permit data for conditional rendering
                setPermitData(permitDataResponse);

                // Log to see available fields for permit type
                console.log('Full permit data:', permitDataResponse);

                // Set permit type name from API response
                setPermitTypeName(permitDataResponse.permit_type_name || permitDataResponse.permit_type || '-');
                const isHazardousMaterialWork = permitDataResponse.permit_type === "Loading, Unloading Hazardous Material Work";

                // Map Basic Information
                setBasicInfo({
                    docNo: permitDataResponse.permit_id || '',
                    permitRequestedDate: permitDataResponse.requested_date || '',
                    permitId: permitDataResponse.permit_id || actualPermitId,
                    rev: '', // Not provided in response, set as empty
                    permitIssueDate: '' // Not provided in response, set as empty
                });

                // Map Detailed Information
                const respJson = permitDataResponse.permit_form?.resp_json || {};

                console.log(respJson)
                setDetailedInfo({
                    jobDescription: permitDataResponse.permit_for || '',
                    location: permitDataResponse.location_details || '',
                    permitInitiatedBy: permitDataResponse.initiator?.full_name || '',
                    initiatorsDepartment: permitDataResponse.initiator?.department || '',
                    initiatorsContact: permitDataResponse.initiator?.contact_number || '',
                    nameOfContractor: permitDataResponse.contractor?.name || '',
                    contractorsContact: permitDataResponse.contractor?.contact_number || '',
                    addressOfContractor: permitDataResponse.contractor?.address || '',
                    contractorsManpower: permitDataResponse.manpower_count || 0,
                    jobSafetyAnalysisRequired: respJson.job_safety_analysis_required || null,
                    emergencyContactName: respJson.emergency_contact_name || '',
                    emergencyContactNumber: respJson.emergency_contact_number || '',
                    msdsAvailableForChemicalUse: respJson.msds_available_for_chemical_use || null,
                    specifyTheName: respJson.specify_the_name || '',
                    contractorStoragePlaceRequired: respJson.contractor_storage_place_required || null,
                    areaAllocated: respJson.area_allocated || '',
                    anySimultaneousOperations: respJson.any_simultaneous_operations || null,
                    specifyTheOperation: respJson.specify_the_operation || '',
                    necessaryPpesProvided: isHazardousMaterialWork ? respJson.ppes_provided : respJson.necessary_ppes_provided,
                    // utilitiesToBeProvidedByCompany: {
                    //     waterSupply: respJson.utilities_to_be_provided_by_company?.water_supply === 'Water Supply' ? 'Yes' : 'No',
                    //     electricalSupply: respJson.utilities_to_be_provided_by_company?.electrical_supply === 'Electrical Supply' ? 'Yes' : 'No',
                    //     airSupply: respJson.utilities_to_be_provided_by_company?.air_supply === 'Air Supply' ? 'Yes' : 'No'
                    // },
                    utilitiesToBeProvidedByCompany: {
                        waterSupply: isHazardousMaterialWork
                            ? respJson.utilities_provided_by_company?.water_supply === '1' ? '1' : '0'
                            : respJson.utilities_to_be_provided_by_company?.water_supply === 'Water Supply' ? '1' : '0',
                        electricalSupply: isHazardousMaterialWork
                            ? respJson.utilities_provided_by_company?.electrical_supply === '1' ? '1' : '0'
                            : respJson.utilities_to_be_provided_by_company?.electrical_supply === 'Electrical Supply' ? '1' : '0',
                        airSupply: isHazardousMaterialWork
                            ? respJson.utilities_provided_by_company?.air_supply === '1' ? '1' : '0'
                            : respJson.utilities_to_be_provided_by_company?.air_supply === 'Air Supply' ? '1' : '0',
                    },


                    energyIsolationRequired: respJson.energy_isolation_required || null,
                    tagOutDetails: respJson.tag_out_details || '',
                    energyIsolationDoneBy: respJson.energy_isolation_done_by || '',
                    energyDeisolationDoneBy: respJson.energy_deisolation_done_by || '',
                    // Fields for hazardous material work
                    jobSafetyAnalysisAttached: respJson.job_safety_analysis_attached || '',
                    riskAssessmentNumber: respJson.risk_assessment_number || '',
                    vehicleEntryRequired: respJson.vehicle_entry_required || null,
                    // gasTestingConductedFor: {
                    //     hydrocarbons: respJson.gas_testing_conducted_for?.hydrocarbons === '1' || respJson.gas_testing_conducted_for?.hydrocarbons === true,
                    //     h2s: respJson.gas_testing_conducted_for?.h2s === '1' || respJson.gas_testing_conducted_for?.h2s === true,
                    //     oxygen: respJson.gas_testing_conducted_for?.oxygen === '1' || respJson.gas_testing_conducted_for?.oxygen === true,
                    //     others: respJson.gas_testing_conducted_for?.others === '1' || respJson.gas_testing_conducted_for?.others === true
                    // },
                    // gasTestingConductedFor: {
                    //     hydrocarbons: respJson.gas_testing_conducted_for_hydrocarbons === '1',
                    //     h2s: respJson.gas_testing_conducted_for_h2o === '1',
                    //     oxygen: respJson.gas_testing_conducted_for_oxygen === '1',
                    //     others: respJson.gas_testing_conducted_for_others === '1',
                    // },
                    gasTestingConductedFor: isHazardousMaterialWork
                        ? {
                            hydrocarbons: respJson.gas_testing_conducted_for_hydrocarbons === '1',
                            h2s: respJson.gas_testing_conducted_for_h2o === '1',
                            oxygen: respJson.gas_testing_conducted_for_oxygen === '1',
                            others: respJson.gas_testing_conducted_for_others === '1',
                        }
                        : {
                            hydrocarbons: respJson.gas_testing_conducted_for?.hydrocarbons === 'Yes' || respJson.gas_testing_conducted_for?.hydrocarbons === true,
                            h2s: respJson.gas_testing_conducted_for?.h2s === 'Yes' || respJson.gas_testing_conducted_for?.h2s === true,
                            oxygen: respJson.gas_testing_conducted_for?.oxygen === 'Yes' || respJson.gas_testing_conducted_for?.oxygen === true,
                            others: respJson.gas_testing_conducted_for?.others === 'Yes' || respJson.gas_testing_conducted_for?.others === true,
                        },
                    gasTestToBeRepeatedAfter: respJson.gas_test_to_be_repeated_after || '',
                    continuousGasMonitoringRequired: respJson.continuous_gas_monitoring_required || null,
                    worksiteExaminationBy: respJson.worksite_examination_by || null,
                    anySimultaneousOperation: respJson.any_simultaneous_operation || null,
                    ifYesSpecifyTheOperation: respJson.if_yes_specify_the_operation || '',
                    ppesProvided: respJson.ppes_provided || null,
                    isolationRequired: respJson.isolation_required_electrical_mechanical || null,
                    tagOutDetailsElectrical: respJson.tag_out_details_electrical || '',
                    energyIsolationDoneByElectrical: respJson.energy_isolation_done_by_electrical || '',
                    energyDeIsolationDoneByElectrical: respJson.energy_de_isolation_done_by_electrical || '',
                    permissionIsGivenToContractor: respJson.permission_is_given_to_contractor || ''
                });

                // Map Check Points - Handle dynamic checkpoints from API
                if (permitDataResponse.safety_checkpoints) {
                    const mappedCheckpoints = permitDataResponse.safety_checkpoints.map((checkpoint, index) => ({
                        id: (index + 1).toString(),
                        key: `checkpoint_${index}`, // Generate a key since it's not provided
                        description: checkpoint.label || '',
                        req: checkpoint.required === 'Req',
                        checked: checkpoint.checked === 'Checked' || checkpoint.checked === true,
                        parameter1: checkpoint.parameter1 || '',
                        parameter2: checkpoint.parameter2 || ''

                    }));
                    setCheckPoints(mappedCheckpoints);
                } else {
                    // Fallback to old format if safety_checkpoints is not available
                    const responseCheckPoints = respJson.check_points || {};

                    // Handle different checkpoint structures for different permit types
                    if (permitDataResponse.permit_type === "Loading, Unloading Hazardous Material Work") {
                        // Map hazardous material work specific checkpoints
                        const hazardousCheckpoints = [
                            { key: 'combustible_flammable_material_removed', description: 'Combustible flammable material removed', parameter1: 'combustible_flammable_material_removed_req_or_not', parameter2: 'combustible_flammable_material_removed_chk' },
                            { key: 'firefighting_team', description: 'Firefighting team', parameter1: 'firefighting_team_req_or_not', parameter2: 'firefighting_team_chk' },
                            { key: 'close_supervision', description: 'Close supervision', parameter1: 'close_supervision_req_or_not', parameter2: 'close_supervision_chk' },
                            { key: 'pipelines_and_equipment', description: 'Pipelines and equipment', parameter1: 'pipelines_and_equipment_req_or_not', parameter2: 'pipelines_and_equipment_chk' },
                            { key: 'cylinders_upright', description: 'Cylinders upright', parameter1: 'cylinders_upright_req_or_not', parameter2: 'cylinders_upright_chk' },
                            { key: 'electrical_connection', description: 'Electrical connection', parameter1: 'electrical_connection_req_or_not', parameter2: 'electrical_connection_chk' },
                            { key: 'hazard_consideration', description: 'Hazard consideration', parameter1: 'hazard_consideration_req_or_not', parameter2: 'hazard_consideration_chk' },
                            { key: 'provision_of_jumpers', description: 'Provision of jumpers', parameter1: 'provision_of_jumpers_req_or_not', parameter2: 'provision_of_jumpers_chk' }
                        ];

                        const mappedHazardousCheckpoints = hazardousCheckpoints.map((checkpoint, index) => {
                            const checkpointData = responseCheckPoints[checkpoint.key];
                            return {
                                id: (index + 1).toString(),
                                key: checkpoint.key,
                                description: checkpoint.description,
                                req: checkpointData?.required === 'Req',
                                checked: checkpointData?.checked === 'Checked' || checkpointData?.checked === true,
                                parameter1: checkpoint.parameter1,
                                parameter2: checkpoint.parameter2
                            };
                        });

                        setCheckPoints(mappedHazardousCheckpoints);
                    } else {
                        // Default checkpoints for regular permits
                        setCheckPoints(prev =>
                            prev.map(item => {
                                const checkpointData = responseCheckPoints[item.key];
                                if (checkpointData) {
                                    return {
                                        ...item,
                                        req: checkpointData.required === 'Yes' || checkpointData.required === true,
                                        checked: checkpointData.checked === 'Yes' || checkpointData.checked === true
                                    };
                                }
                                return item;
                            })
                        );
                    }
                }

                // Map Persons Information
                setPersonsInfo({
                    permitInitiatorName: permitDataResponse.initiator?.full_name || '',
                    permitInitiatorContact: permitDataResponse.initiator?.contact_number || '',
                    contractorSupervisorName: respJson.contract_supervisor_name || '',
                    contractorSupervisorContact: respJson.contract_supervisor_number || '',
                    permitIssuerName: permitDataResponse.permit_issuer?.name || '',
                    permitIssuerContact: permitDataResponse.permit_issuer?.contact_number || '',
                    safetyOfficerName: permitDataResponse.safety_officer?.name || '',
                    safetyOfficerContact: permitDataResponse.safety_officer?.contact_number || ''
                });

                // Map Daily Extensions (Not provided in response, set as empty)
                setDailyExtensions([]);

                // Map Work Permit Closure - Set default declarations and populate signatures with dynamic names
                setWorkPermitClosure({
                    declarations: {
                        row1: {
                            initiator: 'Certified that the subject work has been completed/ stopped and area cleaned.Scrap shifted to scrap yard.',
                            issuer: 'Verified that the job is completed & Area is cleaned and safe from any hazard.',
                            security_dept: 'Closed permit recived'
                        },
                        row2: {
                            initiator: 'All Energy sources are re-established by authorized person.',
                            issuer: 'Verified that all energy resources are re-established properly.',
                            security_dept: ''
                        },
                        row3: {
                            initiator: 'All safety equipment returned to security after work is completed.',
                            issuer: '',
                            security_dept: 'Received the given sefety equipment\'s'
                        }
                    },
                    signatures: {
                        initiator: permitData?.initiator?.full_name || '',
                        issuer: permitData?.permit_issuer?.name || '',
                        security_dept: ''
                    },
                    date_and_time: {
                        initiator: '',
                        issuer: '',
                        security_dept: ''
                    }
                });

                // Map Attachments - Fixed structure for Documents to be Enclosed
                console.log('Permit data for attachments:', {
                    attachments: permitData?.attachments
                });

                const attachmentsList = [
                    {
                        id: '1',
                        name: 'List of people to be work',
                        workVoucher: permitData?.attachments?.people_work_attachments?.length > 0 &&
                            permitData?.attachments.people_work_attachments[0]?.id &&
                            permitData?.attachments.people_work_attachments[0]?.url,
                        file: null,
                        sr_no: 1
                    },
                    {
                        id: '2',
                        name: 'ESI/WC policy',
                        workVoucher: permitData?.attachments?.policy_attachments?.length > 0 &&
                            permitData?.attachments.policy_attachments[0]?.id &&
                            permitData?.attachments.policy_attachments[0]?.url,
                        file: null,
                        sr_no: 2
                    },
                    {
                        id: '3',
                        name: 'Medical Reports',
                        workVoucher: permitData?.attachments?.medical_attachments?.length > 0 &&
                            permitData?.attachments.medical_attachments[0]?.id &&
                            permitData?.attachments.medical_attachments[0]?.url,
                        file: null,
                        sr_no: 3
                    },
                    {
                        id: '4',
                        name: 'Other',
                        workVoucher: permitData?.attachments?.other_attachments?.length > 0 &&
                            permitData?.attachments.other_attachments[0]?.id &&
                            permitData?.attachments.other_attachments[0]?.url,
                        file: null,
                        sr_no: 4
                    }
                ];
                setAttachments(attachmentsList);
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

    const handlePermitIssuerChange = (value: string) => {
        setSelectedPermitIssuerId(value);
        const selectedIssuer = dropdownData.permit_issuers.find(issuer => issuer.id === value);
        if (selectedIssuer) {
            setPersonsInfo(prev => ({
                ...prev,
                permitIssuerName: selectedIssuer.name,
                permitIssuerContact: selectedIssuer.mobile
            }));
        }
    };

    const handleSafetyOfficerChange = (value: string) => {
        setSelectedSafetyOfficerId(value);
        const selectedOfficer = dropdownData.permit_safety_officers.find(officer => officer.id === value);
        if (selectedOfficer) {
            setPersonsInfo(prev => ({
                ...prev,
                safetyOfficerName: selectedOfficer.name,
                safetyOfficerContact: selectedOfficer.mobile
            }));
        }
    };

    const handlePersonsInfoChange = (field: string, value: string) => {
        setPersonsInfo(prev => ({ ...prev, [field]: value }));
    };

    // const handleUtilityChange = (utility: string, checked: boolean) => {
    //     setDetailedInfo(prev => ({
    //         ...prev,
    //         utilitiesToBeProvidedByCompany: { ...prev.utilitiesToBeProvidedByCompany, [utility]: checked ? 'Yes' : 'No' }
    //     }));
    // };
    // const handleUtilityChange = (utility: string, checked: boolean) => {
    //     setDetailedInfo(prev => ({
    //         ...prev,
    //         utilitiesToBeProvidedByCompany: {
    //             ...prev.utilitiesToBeProvidedByCompany,
    //             [utility]: checked ? "1" : "0"
    //         }
    //     }));
    // };
    const handleUtilityChange = (utility: string, checked: boolean) => {
        setDetailedInfo(prev => ({
            ...prev,
            utilitiesToBeProvidedByCompany: {
                ...prev.utilitiesToBeProvidedByCompany,
                [utility]:
                    permitData?.permit_type === "Loading, Unloading Hazardous Material Work"
                        ? checked ? "1" : "0"
                        : checked ? "Yes" : "No"
            }
        }));
    };


    const handleGasTestingChange = (gas: string, checked: boolean) => {
        setDetailedInfo(prev => ({
            ...prev,
            gasTestingConductedFor: { ...prev.gasTestingConductedFor, [gas]: checked }
        }));
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
            const isHazardousMaterialWork = permitData?.permit_type === "Loading, Unloading Hazardous Material Work";

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

            // Additional fields specific to hazardous material work
            if (isHazardousMaterialWork) {
                formData.append('pms_permit_form[job_safety_analysis_attached]', detailedInfo.jobSafetyAnalysisAttached || '');
                formData.append('pms_permit_form[risk_assessment_number]', detailedInfo.riskAssessmentNumber || '');
                formData.append('pms_permit_form[vehicle_entry_required]', detailedInfo.vehicleEntryRequired || 'No');

                formData.append('pms_permit_form[gas_testing_conducted_for_hydrocarbons]',
                    detailedInfo.gasTestingConductedFor.hydrocarbons ? '1' : '0');
                formData.append('pms_permit_form[gas_testing_conducted_for_h2s]',
                    detailedInfo.gasTestingConductedFor.h2s ? '1' : '0');
                formData.append('pms_permit_form[gas_testing_conducted_for_oxygen]',
                    detailedInfo.gasTestingConductedFor.oxygen ? '1' : '0');
                formData.append('pms_permit_form[gas_testing_conducted_for_others]',
                    detailedInfo.gasTestingConductedFor.others ? '1' : '0');

                formData.append('pms_permit_form[gas_test_to_be_repeated_after]', detailedInfo.gasTestToBeRepeatedAfter || '');
                formData.append('pms_permit_form[continuous_gas_monitoring_required]', detailedInfo.continuousGasMonitoringRequired || 'No');
                formData.append('pms_permit_form[worksite_examination_by]', detailedInfo.worksiteExaminationBy || 'No');
                formData.append('pms_permit_form[any_simultaneous_operation]', detailedInfo.anySimultaneousOperation || 'No');
                formData.append('pms_permit_form[if_yes_specify_the_operation]', detailedInfo.ifYesSpecifyTheOperation || '');
                formData.append('pms_permit_form[ppes_provided]', detailedInfo.ppesProvided || '');
                formData.append('pms_permit_form[isolation_required_electrical_mechanical]', detailedInfo.isolationRequired || '');
                formData.append('pms_permit_form[tag_out_details_electrical]', detailedInfo.tagOutDetailsElectrical || '');
                formData.append('pms_permit_form[energy_isolation_done_by_electrical]', detailedInfo.energyIsolationDoneByElectrical || '');
                formData.append('pms_permit_form[energy_de_isolation_done_by_electrical]', detailedInfo.energyDeIsolationDoneByElectrical || '');
                formData.append('pms_permit_form[permission_is_given_to_contractor]', detailedInfo.permissionIsGivenToContractor || '');

                if (detailedInfo.utilitiesToBeProvidedByCompany.waterSupply === '1') {
                    formData.append('pms_permit_form[utilities_provided_by_company_water_supply]', '1');
                }
                if (detailedInfo.utilitiesToBeProvidedByCompany.electricalSupply === '1') {
                    formData.append('pms_permit_form[utilities_provided_by_company_elecrical_supply]', '1');
                }
                if (detailedInfo.utilitiesToBeProvidedByCompany.airSupply === '1') {
                    formData.append('pms_permit_form[utilities_provided_by_company_air_supply] ', '1');
                }

            }

            // Handle utilities - send as separate numbered parameters
            if (detailedInfo.utilitiesToBeProvidedByCompany.waterSupply === 'Yes') {
                formData.append('pms_permit_form[utilities_to_be_provided_by_company2]', 'Water Supply');
            }
            if (detailedInfo.utilitiesToBeProvidedByCompany.electricalSupply === 'Yes') {
                formData.append('pms_permit_form[utilities_to_be_provided_by_company2]', 'Electrical Supply');
            }
            if (detailedInfo.utilitiesToBeProvidedByCompany.airSupply === 'Yes') {
                formData.append('pms_permit_form[utilities_to_be_provided_by_company3]', 'Air Supply');
            }

            formData.append('pms_permit_form[energy_isolation_required]', detailedInfo.energyIsolationRequired || 'No');
            formData.append('pms_permit_form[tag_out_details]', detailedInfo.tagOutDetails || '');
            formData.append('pms_permit_form[energy_isolation_done_by]', detailedInfo.energyIsolationDoneBy || '');
            formData.append('pms_permit_form[energy_deisolation_done_by]', detailedInfo.energyDeisolationDoneBy || '');

            // Check Points - Use parameter names from API response
            checkPoints.forEach(checkpoint => {
                if (checkpoint.parameter1 && checkpoint.parameter2) {
                    // Use the specific parameter name from API response
                    formData.append(`pms_permit_form[${checkpoint.parameter1}]`, checkpoint.req ? 'Req' : 'Not Req');
                    formData.append(`pms_permit_form[${checkpoint.parameter2}]`, checkpoint.checked ? 'Checked' : 'Not Checked');
                } else {
                    // Fallback to old format for backward compatibility
                    formData.append(`pms_permit_form[check_points][${checkpoint.key}][required]`, checkpoint.req ? 'Yes' : 'No');
                    formData.append(`pms_permit_form[check_points][${checkpoint.key}][checked]`, checkpoint.checked ? 'Yes' : 'No');
                }
            });

            formData.append('pms_permit_form[contract_supervisor_name]', personsInfo.contractorSupervisorName || '');
            formData.append('pms_permit_form[contract_supervisor_number]', personsInfo.contractorSupervisorContact || '');
            formData.append('pms_permit_form[permit_issuer_id]', selectedPermitIssuerId || '');
            formData.append('pms_permit_form[safety_officer_id]', selectedSafetyOfficerId || '');

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
                toast.success(`${permitTypeName} form submitted successfully!`);
                navigate(`/safety/permit/details/${actualPermitId}`);
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

    console.log(checkPoints);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {permitTypeName}
                            {id && <span className="text-sm text-gray-600 ml-2">(Permit ID: {id})</span>}
                        </h1>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                        FILL FORM
                    </Badge>
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
                                                // value={basicInfo.docNo}
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
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
                                SAFETY & EMERGENCY INFORMATION
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white space-y-6">
                            {/* Normal Permit Form - Only for non-hazardous material work */}
                            {permitData?.permit_type !== "Loading, Unloading Hazardous Material Work" && (
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
                                                <RadioGroupItem value="By Company" id="ppe-company" />
                                                <Label htmlFor="ppe-company">By Company</Label>
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
                                                    checked={detailedInfo.utilitiesToBeProvidedByCompany.waterSupply === '1'}
                                                    onCheckedChange={(checked) => handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
                                                        ...detailedInfo.utilitiesToBeProvidedByCompany,
                                                        waterSupply: checked ? '1' : '0'
                                                    })}
                                                />
                                                <Label htmlFor="water-supply">Water Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="electrical-supply"
                                                    checked={detailedInfo.utilitiesToBeProvidedByCompany.electricalSupply === '1'}
                                                    onCheckedChange={(checked) => handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
                                                        ...detailedInfo.utilitiesToBeProvidedByCompany,
                                                        electricalSupply: checked ? '1' : '0'
                                                    })}
                                                />
                                                <Label htmlFor="electrical-supply">Electrical Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="air-supply"
                                                    checked={detailedInfo.utilitiesToBeProvidedByCompany.airSupply === '1'}
                                                    onCheckedChange={(checked) => handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
                                                        ...detailedInfo.utilitiesToBeProvidedByCompany,
                                                        airSupply: checked ? '1' : '0'
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
                            )}

                            {/* Conditional Hazardous Material Work Form */}
                            {permitData?.permit_type === "Loading, Unloading Hazardous Material Work" ? (
                                <div className="space-y-6 mt-6 pt-6 border-t border-gray-200">
                                    <Label className="text-lg font-semibold text-[#C72030]">Hazardous Material Work Requirements</Label>

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
                                                    value={detailedInfo.vehicleEntryRequired || ''}
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
                                                    <Checkbox
                                                        id="hydrocarbons"
                                                        checked={detailedInfo.gasTestingConductedFor.hydrocarbons}
                                                        onCheckedChange={(checked) => handleGasTestingChange('hydrocarbons', checked as boolean)}
                                                    />
                                                    <Label htmlFor="hydrocarbons">Hydrocarbons</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="h2s"
                                                        checked={detailedInfo.gasTestingConductedFor.h2s}
                                                        onCheckedChange={(checked) => handleGasTestingChange('h2s', checked as boolean)}
                                                    />
                                                    <Label htmlFor="h2s">H2S</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="oxygen"
                                                        checked={detailedInfo.gasTestingConductedFor.oxygen}
                                                        onCheckedChange={(checked) => handleGasTestingChange('oxygen', checked as boolean)}
                                                    />
                                                    <Label htmlFor="oxygen">Oxygen</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="others-gas"
                                                        checked={detailedInfo.gasTestingConductedFor.others}
                                                        onCheckedChange={(checked) => handleGasTestingChange('others', checked as boolean)}
                                                    />
                                                    <Label htmlFor="others-gas">Other</Label>
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
                                                    value={detailedInfo.continuousGasMonitoringRequired || ''}
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
                                                    value={detailedInfo.worksiteExaminationBy || ''}
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
                                                    value={detailedInfo.anySimultaneousOperation || ''}
                                                    onValueChange={(value) => handleDetailedInfoChange('anySimultaneousOperation', value)}
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
                                                value={detailedInfo.ppesProvided || ''}
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

                                    {/* <div>
                                        <Label className="text-sm font-medium">Utilities to be provided by company</Label>
                                        <div className="flex gap-6 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="water-supply-haz"
                                                    checked={detailedInfo.utilitiesToBeProvidedByCompany.waterSupply === 'Yes'}
                                                    onCheckedChange={(checked) => handleUtilityChange('waterSupply', checked as boolean)}
                                                />
                                                <Label htmlFor="water-supply-haz">Water Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="electrical-supply-haz"
                                                    checked={detailedInfo.utilitiesToBeProvidedByCompany.electricalSupply === 'Yes'}
                                                    onCheckedChange={(checked) => handleUtilityChange('electricalSupply', checked as boolean)}
                                                />
                                                <Label htmlFor="electrical-supply-haz">Electrical Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="air-supply-haz"
                                                    checked={detailedInfo.utilitiesToBeProvidedByCompany.airSupply === 'Yes'}
                                                    onCheckedChange={(checked) => handleUtilityChange('airSupply', checked as boolean)}
                                                />
                                                <Label htmlFor="air-supply-haz">Air Supply</Label>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 block mb-3">
                                            Utilities to be provided by company:
                                        </Label>
                                        <div className="flex gap-6">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="water-supply"
                                                    checked={detailedInfo.utilitiesToBeProvidedByCompany.waterSupply === '1'}
                                                    onCheckedChange={(checked) =>
                                                        handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
                                                            ...detailedInfo.utilitiesToBeProvidedByCompany,
                                                            waterSupply: checked ? '1' : '0',
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="water-supply">Water Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="electrical-supply"
                                                    checked={detailedInfo.utilitiesToBeProvidedByCompany.electricalSupply === '1'}
                                                    onCheckedChange={(checked) =>
                                                        handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
                                                            ...detailedInfo.utilitiesToBeProvidedByCompany,
                                                            electricalSupply: checked ? '1' : '0',
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="electrical-supply">Electrical Supply</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="air-supply"
                                                    checked={detailedInfo.utilitiesToBeProvidedByCompany.airSupply === '1'}
                                                    onCheckedChange={(checked) =>
                                                        handleDetailedInfoChange('utilitiesToBeProvidedByCompany', {
                                                            ...detailedInfo.utilitiesToBeProvidedByCompany,
                                                            airSupply: checked ? '1' : '0',
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="air-supply">Air Supply</Label>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm font-medium">Isolation is required</Label>
                                            <div className="mt-2">
                                                <RadioGroup
                                                    value={detailedInfo.isolationRequired || ''}
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
                                            <Label htmlFor="energyIsolationDoneByElectrical">Energy Isolation Done By</Label>
                                            <Input
                                                id="energyIsolationDoneByElectrical"
                                                value={detailedInfo.energyIsolationDoneByElectrical}
                                                onChange={(e) => handleDetailedInfoChange('energyIsolationDoneByElectrical', e.target.value)}
                                                placeholder="Enter"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="energyDeIsolationDoneByElectrical">Energy De-Isolation Done By</Label>
                                            <Input
                                                id="energyDeIsolationDoneByElectrical"
                                                value={detailedInfo.energyDeIsolationDoneByElectrical}
                                                onChange={(e) => handleDetailedInfoChange('energyDeIsolationDoneByElectrical', e.target.value)}
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
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* Check Points */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">4</span>
                                CHECK POINTS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
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
                                        {checkPoints.length > 0 ? (
                                            checkPoints.map((point) => (
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
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="border border-gray-300 p-8 text-center text-gray-500">
                                                    {loading ? 'Loading checkpoints...' : 'No checkpoints available'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Persons Information */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">5</span>
                                PERSONS INFORMATION
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="permitInitiatorName" className="text-sm text-gray-700 font-medium">Permit Initiator Name</Label>
                                        <Input
                                            id="permitInitiatorName"
                                            value={personsInfo.permitInitiatorName}
                                            readOnly
                                            className="mt-1 bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contractorSupervisorName" className="text-sm text-gray-700 font-medium">Contractor's Supervisor</Label>
                                        <Input
                                            id="contractorSupervisorName"
                                            value={personsInfo.contractorSupervisorName}
                                            onChange={(e) => handlePersonsInfoChange('contractorSupervisorName', e.target.value)}
                                            placeholder="Enter Contract Supervisor Name"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="permitIssuer" className="text-sm text-gray-700 font-medium mb-2 block">Permit Issuer</Label>
                                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                            <InputLabel id="permit-issuer-select-label" shrink>Permit Issuer</InputLabel>
                                            <MuiSelect
                                                labelId="permit-issuer-select-label"
                                                label="Permit Issuer"
                                                value={selectedPermitIssuerId}
                                                onChange={(e) => handlePermitIssuerChange(e.target.value)}
                                                displayEmpty
                                                MenuProps={menuProps}
                                                size="small"
                                            >
                                                <MenuItem value="">
                                                    <em>Select Permit Issuer</em>
                                                </MenuItem>
                                                {dropdownData.permit_issuers.map((issuer) => (
                                                    <MenuItem key={issuer.id} value={issuer.id}>
                                                        {issuer.name}
                                                    </MenuItem>
                                                ))}
                                            </MuiSelect>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="permitInitiatorContact" className="text-sm text-gray-700 font-medium">Contact Number</Label>
                                        <Input
                                            id="permitInitiatorContact"
                                            value={personsInfo.permitInitiatorContact}
                                            readOnly
                                            className="mt-1 bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contractorSupervisorContact" className="text-sm text-gray-700 font-medium">Contact Number</Label>
                                        <Input
                                            id="contractorSupervisorContact"
                                            value={personsInfo.contractorSupervisorContact}
                                            onChange={(e) => handlePersonsInfoChange('contractorSupervisorContact', e.target.value)}
                                            placeholder="Enter Contract Supervisor Number"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="safetyOfficer" className="text-sm text-gray-700 font-medium mb-2 block">Safety Officer</Label>
                                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                            <InputLabel id="safety-officer-select-label" shrink>Safety Officer</InputLabel>
                                            <MuiSelect
                                                labelId="safety-officer-select-label"
                                                label="Safety Officer"
                                                value={selectedSafetyOfficerId}
                                                onChange={(e) => handleSafetyOfficerChange(e.target.value)}
                                                displayEmpty
                                                MenuProps={menuProps}
                                                size="small"
                                            >
                                                <MenuItem value="">
                                                    <em>Select Safety Officer</em>
                                                </MenuItem>
                                                {dropdownData.permit_safety_officers.map((officer) => (
                                                    <MenuItem key={officer.id} value={officer.id}>
                                                        {officer.name}
                                                    </MenuItem>
                                                ))}
                                            </MuiSelect>
                                        </FormControl>
                                    </div>
                                </div>
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
                            <CardTitle className="text-lg text-black flex items-center justify-center underline">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">8</span>
                                WORK PERMIT CLOSURE FORMAT
                            </CardTitle>
                            <p className="text-center text-sm text-gray-600 mt-2 font-bold">
                                This fomat is to be filled by the persons who had raised the Work Permit.All the below mentioned points must be checked & completed by him after the work is completed
                            </p>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
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
                                            <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50" rowSpan={3}>Declaration</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations.row1.initiator}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations.row1.issuer}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations.row1.security_dept}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations.row2.initiator}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations.row2.issuer}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations.row2.security_dept || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations.row3.initiator}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations.row3.issuer || '-'}</td>
                                            <td className="border border-gray-300 p-3 text-sm">{workPermitClosure.declarations.row3.security_dept}</td>
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
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className="bg-[#F6F4EE] mb-4">
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">9</span>
                                DOCUMENTS TO BE ENCLOSED HERE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
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
                                            <td className="border border-gray-300 p-3 text-sm">List of people to be work</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">
                                                {permitData?.attachments?.people_work_attachments?.length > 0 ? 'Yes' : 'No'}
                                            </td></tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm text-center">2.</td>
                                            <td className="border border-gray-300 p-3 text-sm">ESI/WC policy</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">{permitData?.attachments?.policy_attachments?.length > 0 ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm text-center">3.</td>
                                            <td className="border border-gray-300 p-3 text-sm">Medical Reports</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">{permitData?.attachments?.medical_attachments?.length > 0 ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-3 text-sm text-center">4.</td>
                                            <td className="border border-gray-300 p-3 text-sm">Other</td>
                                            <td className="border border-gray-300 p-3 text-sm text-center">{permitData?.attachments?.other_attachments?.length > 0 ? 'Yes' : 'No'}</td>
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