
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { incidentService, type Incident } from '@/services/incidentService';
import { toast } from 'sonner';
import ReportStep from './Reportstep';
import InvestigateStep from './InvestigateStep';
import ProvisionalStep from './ProvisionalStep';
import FinalClosureStep from '../components/FinalClosureStep';

// Interfaces
export interface Investigator {
    id: string;
    name: string;
    email: string;
    role: string;
    contactNo: string;
    type: 'internal' | 'external';
    company?: string;
}

export interface Condition {
    id: string;
    condition: string;
    act: string;
    description: string;
}

export interface RootCause {
    id: string;
    causeId: string;
    description: string;
}

export interface InjuredPerson {
    id: string;
    type: 'internal' | 'external';
    name: string;
    age: string;
    company?: string;
    role: string;
    injuryType?: string;
    injuryNumber?: string;
    mobile?: string;
    injuryTypes?: string[];
    bodyParts: {
        head: boolean;
        neck: boolean;
        arms: boolean;
        eyes: boolean;
        legs: boolean;
        skin: boolean;
        mouth: boolean;
        ears: boolean;
    };
    attachments: File[];
}

export interface PropertyDamage {
    id: string;
    propertyType: string;
    attachments: File[];
}

export interface CorrectiveAction {
    id: string;
    action: string;
    responsiblePerson: string;
    targetDate: string;
    description: string;
}

export interface PreventiveAction {
    id: string;
    action: string;
    responsiblePerson: string;
    targetDate: string;
    description: string;
}

export const IncidentNewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [incident, setIncident] = useState<Incident | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [investigators, setInvestigators] = useState<Investigator[]>([]);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [rootCauses, setRootCauses] = useState<RootCause[]>([
        { id: Date.now().toString(), causeId: '', description: '' }
    ]);
    const [injuredPersons, setInjuredPersons] = useState<InjuredPerson[]>([]);
    const [propertyDamages, setPropertyDamages] = useState<PropertyDamage[]>([]);
    const [showInvestigateDetails, setShowInvestigateDetails] = useState(false);

    const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
    const [preventiveActions, setPreventiveActions] = useState<PreventiveAction[]>([]);
    const [nextReviewDate, setNextReviewDate] = useState('');
    const [nextReviewResponsible, setNextReviewResponsible] = useState('');

    const [showInvestigatorForm, setShowInvestigatorForm] = useState(false);
    const [investigatorTab, setInvestigatorTab] = useState<'internal' | 'external'>('internal');

    const [hasInjury, setHasInjury] = useState(false);
    const [hasPropertyDamage, setHasPropertyDamage] = useState(false);
    const [incidentOverTime, setIncidentOverTime] = useState('');

    const [internalUsers, setInternalUsers] = useState<any[]>([]);
    const [selectedInternalUser, setSelectedInternalUser] = useState('');

    const [propertyDamageCategories, setPropertyDamageCategories] = useState<any[]>([]);
    const [rcaCategories, setRcaCategories] = useState<any[]>([]);
    const [correctiveActionsCategories, setCorrectiveActionsCategories] = useState<any[]>([]);
    const [preventiveActionsCategories, setPreventiveActionsCategories] = useState<any[]>([]);
    const [substandardConditionCategories, setSubstandardConditionCategories] = useState<any[]>([]);
    const [substandardActCategories, setSubstandardActCategories] = useState<any[]>([]);

    const [selectedCorrectiveAction, setSelectedCorrectiveAction] = useState('');
    const [selectedPreventiveAction, setSelectedPreventiveAction] = useState('');
    const [selectedRootCause, setSelectedRootCause] = useState('');
    const [selectedPropertyDamage, setSelectedPropertyDamage] = useState('');

    const [rootCauseDescription, setRootCauseDescription] = useState('');
    const [propertyDamageDescription, setPropertyDamageDescription] = useState('');

    const [injuryType, setInjuryType] = useState('');
    const [injuryNumber, setInjuryNumber] = useState('');
    const [injuredPersonName, setInjuredPersonName] = useState('');
    const [injuredPersonMobile, setInjuredPersonMobile] = useState('');
    const [injuredPersonAge, setInjuredPersonAge] = useState('');
    const [injuredPersonCompany, setInjuredPersonCompany] = useState('');
    const [injuredPersonRole, setInjuredPersonRole] = useState('');
    const [injuredUserType, setInjuredUserType] = useState<'internal' | 'external'>('external');
    const [injuryTypes, setInjuryTypes] = useState<string[]>([]);

    const [correctiveActionDescription, setCorrectiveActionDescription] = useState('');
    const [correctiveActionResponsiblePerson, setCorrectiveActionResponsiblePerson] = useState('');
    const [correctiveActionDate, setCorrectiveActionDate] = useState('');

    const [preventiveActionDescription, setPreventiveActionDescription] = useState('');
    const [preventiveActionResponsiblePerson, setPreventiveActionResponsiblePerson] = useState('');
    const [preventiveActionDate, setPreventiveActionDate] = useState('');

    const [finalClosureCorrectiveDescription, setFinalClosureCorrectiveDescription] = useState('');
    const [finalClosurePreventiveDescription, setFinalClosurePreventiveDescription] = useState('');

    const [subStandardConditionId, setSubStandardConditionId] = useState('');
    const [subStandardActId, setSubStandardActId] = useState('');
    const [investigationDescription, setInvestigationDescription] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);

    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        email?: string;
        contactNo?: string;
    }>({});

    const [newInvestigator, setNewInvestigator] = useState({
        name: '',
        email: '',
        role: '',
        contactNo: '',
        company: '',
    });

    const [reportDownloadLoading, setReportDownloadLoading] = useState(false);

    // Fetch functions
    const fetchInternalUsers = useCallback(async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/users/get_escalate_to_users.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setInternalUsers(data);
                } else if (data && typeof data === 'object' && data.users) {
                    setInternalUsers(Array.isArray(data.users) ? data.users : []);
                } else {
                    setInternalUsers([]);
                }
            } else {
                setInternalUsers([]);
            }
        } catch (error) {
            console.error('Error fetching internal users:', error);
            setInternalUsers([]);
        }
    }, []);

    const fetchPropertyDamageCategories = useCallback(async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json?q[tag_type_eq]=PropertyDamageCategory`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const propertyDamageTypes = result.data
                    ?.filter((item: any) => item.tag_type === 'PropertyDamageCategory')
                    .map(({ id, name }: any) => ({ id, name })) || [];
                setPropertyDamageCategories(propertyDamageTypes);
            } else {
                setPropertyDamageCategories([]);
            }
        } catch (error) {
            console.error('Error fetching property damage categories:', error);
            setPropertyDamageCategories([]);
        }
    }, []);

    const fetchRcaCategories = useCallback(async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json?q[tag_type_eq]=RCACategory`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const rcaTypes = result.data
                    ?.filter((item: any) => item.tag_type === 'RCACategory')
                    .map(({ id, name }: any) => ({ id, name })) || [];
                setRcaCategories(rcaTypes);
            } else {
                setRcaCategories([]);
            }
        } catch (error) {
            console.error('Error fetching RCA categories:', error);
            setRcaCategories([]);
        }
    }, []);

    const fetchCorrectiveActionsCategories = useCallback(async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json?q[tag_type_eq]=CorrectiveAction`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const correctiveTypes = result.data
                    ?.filter((item: any) => item.tag_type === 'CorrectiveAction')
                    .map(({ id, name }: any) => ({ id, name })) || [];
                setCorrectiveActionsCategories(correctiveTypes);
            } else {
                setCorrectiveActionsCategories([]);
            }
        } catch (error) {
            console.error('Error fetching Corrective Actions categories:', error);
            setCorrectiveActionsCategories([]);
        }
    }, []);

    const fetchPreventiveActionsCategories = useCallback(async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json?q[tag_type_eq]=PreventiveAction`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const preventiveTypes = result.data
                    ?.filter((item: any) => item.tag_type === 'PreventiveAction')
                    .map(({ id, name }: any) => ({ id, name })) || [];
                setPreventiveActionsCategories(preventiveTypes);
            } else {
                setPreventiveActionsCategories([]);
            }
        } catch (error) {
            console.error('Error fetching Preventive Actions categories:', error);
            setPreventiveActionsCategories([]);
        }
    }, []);

    const fetchSubstandardConditionCategories = useCallback(async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/{+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json?q[tag_type_eq]=SubstandardCondition`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const substandardConditionTypes = result.data
                    ?.filter((item: any) => item.tag_type === 'SubstandardCondition')
                    .map(({ id, name }: any) => ({ id, name })) || [];
                setSubstandardConditionCategories(substandardConditionTypes);
            } else {
                setSubstandardConditionCategories([]);
            }
        } catch (error) {
            console.error('Error fetching Substandard Condition categories:', error);
            setSubstandardConditionCategories([]);
        }
    }, []);

    const fetchSubstandardActCategories = useCallback(async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/{+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json?q[tag_type_eq]=SubstandardAct`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const substandardActTypes = result.data
                    ?.filter((item: any) => item.tag_type === 'SubstandardAct')
                    .map(({ id, name }: any) => ({ id, name })) || [];
                setSubstandardActCategories(substandardActTypes);
            } else {
                setSubstandardActCategories([]);
            }
        } catch (error) {
            console.error('Error fetching Substandard Act categories:', error);
            setSubstandardActCategories([]);
        }
    }, []);

    const fetchIncidentDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const incidentData = await incidentService.getIncidentById(id!);
            if (incidentData) {
                console.log('Fetched incident data:', incidentData);
                setIncident(incidentData);

                // Prefill all form fields from API response
                // Basic fields
                if (incidentData.incident_over_time) {
                    setIncidentOverTime(incidentData.incident_over_time);
                }

                if (incidentData.description) {
                    setInvestigationDescription(incidentData.description);
                }

                // Investigators
                if (incidentData.incident_investigations && incidentData.incident_investigations.length > 0) {
                    const mappedInvestigators = incidentData.incident_investigations.map((inv) => ({
                        id: inv.id?.toString() || Date.now().toString(),
                        name: inv.name,
                        email: '',
                        role: inv.designation,
                        contactNo: inv.mobile,
                        type: 'internal' as 'internal' | 'external',
                    }));
                    setInvestigators(mappedInvestigators);
                }

                // Root causes
                if (incidentData.rca_category_id) {
                    setSelectedRootCause(incidentData.rca_category_id.toString());
                    // If there are multiple root causes in an array, handle them
                    if (incidentData.root_causes && Array.isArray(incidentData.root_causes) && incidentData.root_causes.length > 0) {
                        const mappedRootCauses = incidentData.root_causes.map((rc: any) => ({
                            id: rc.id?.toString() || Date.now().toString(),
                            causeId: rc.rca_category_id?.toString() || rc.cause_id?.toString() || '',
                            description: rc.description || rc.rca || '',
                        }));
                        setRootCauses(mappedRootCauses);
                    } else if (incidentData.rca) {
                        // Single root cause
                        setRootCauses([{
                            id: Date.now().toString(),
                            causeId: incidentData.rca_category_id.toString(),
                            description: incidentData.rca,
                        }]);
                    }
                }

                // Substandard conditions and acts
                if (incidentData.substandard_condition_id) {
                    setSubStandardConditionId(incidentData.substandard_condition_id.toString());
                }
                if (incidentData.substandard_act_id) {
                    setSubStandardActId(incidentData.substandard_act_id.toString());
                }

                // Property damage
                const propertyDamageValue = String(incidentData.property_damage).toLowerCase();
                if (propertyDamageValue === 'true' || propertyDamageValue === '1' || propertyDamageValue === 'yes') {
                    setHasPropertyDamage(true);
                    if (incidentData.property_damage_id) {
                        setSelectedPropertyDamage(incidentData.property_damage_id.toString());
                    }
                    if (incidentData.damage_evaluation) {
                        setPropertyDamageDescription(incidentData.damage_evaluation);
                    }
                }

                // Injuries
                if (incidentData.injuries && Array.isArray(incidentData.injuries) && incidentData.injuries.length > 0) {
                    setHasInjury(true);
                    const mappedInjuries = incidentData.injuries.map((injury: any) => {
                        const rawInjuryTypes = injury.injury_types ?? injury.types ?? [];
                        const normalizedInjuryTypes = Array.isArray(rawInjuryTypes)
                            ? rawInjuryTypes
                            : typeof rawInjuryTypes === 'string'
                                ? rawInjuryTypes.split(',').map((item: string) => item.trim()).filter(Boolean)
                                : [];

                        return {
                            id: injury.id?.toString() || Date.now().toString(),
                            type: injury.user_type || injury.injured_user_type || 'external',
                            name: injury.name || '',
                            age: injury.age?.toString() || '',
                            company: injury.company || '',
                            role: injury.role || '',
                            injuryType: injury.injury_type || '',
                            injuryNumber: injury.injury_number || '',
                            mobile: injury.mobile || '',
                            injuryTypes: normalizedInjuryTypes,
                            bodyParts: {
                                head: injury.body_parts?.includes('head') || false,
                                neck: injury.body_parts?.includes('neck') || false,
                                arms: injury.body_parts?.includes('arms') || false,
                                eyes: injury.body_parts?.includes('eyes') || false,
                                legs: injury.body_parts?.includes('legs') || false,
                                skin: injury.body_parts?.includes('skin') || false,
                                mouth: injury.body_parts?.includes('mouth') || false,
                                ears: injury.body_parts?.includes('ears') || false,
                            },
                            attachments: [],
                        };
                    });
                    setInjuredPersons(mappedInjuries);
                }

                console.log("Corrective Actions:", incidentData.corrective_fields);
                console.log("Preventive Actions:", incidentData.preventive_fields);

                // Corrective actions from API
                if (incidentData.corrective_fields && Array.isArray(incidentData.corrective_fields) && incidentData.corrective_fields.length > 0) {
                    const mappedCorrectiveActions = incidentData.corrective_fields.map((action: any) => ({
                        id: action.id?.toString() || Date.now().toString(),
                        action: action.tag_type_id?.toString() || action.action?.toString() || '',
                        responsiblePerson: action.responsible_person_id?.toString() || '',
                        targetDate: action.date || action.target_date || '',
                        description: action.description || '',
                    }));
                    setCorrectiveActions(mappedCorrectiveActions);
                } else if (incidentData.corrective_action) {
                    // Fallback if single corrective action string exists
                    setCorrectiveActionDescription(incidentData.corrective_action);
                }

                // Preventive actions from API
                if (incidentData.preventive_fields && Array.isArray(incidentData.preventive_fields) && incidentData.preventive_fields.length > 0) {
                    const mappedPreventiveActions = incidentData.preventive_fields.map((action: any) => ({
                        id: action.id?.toString() || Date.now().toString(),
                        action: action.tag_type_id?.toString() || action.action?.toString() || '',
                        responsiblePerson: action.responsible_person_id?.toString() || '',
                        targetDate: action.date || action.target_date || '',
                        description: action.description || '',
                    }));
                    setPreventiveActions(mappedPreventiveActions);
                } else if (incidentData.preventive_action) {
                    // Fallback if single preventive action string exists
                    setPreventiveActionDescription(incidentData.preventive_action);
                }

                // Final closure summaries
                if (incidentData.corrective_summary) {
                    setFinalClosureCorrectiveDescription(incidentData.corrective_summary);
                }
                if (incidentData.preventive_summary) {
                    setFinalClosurePreventiveDescription(incidentData.preventive_summary);
                }

                // Next review
                if (incidentData.next_review_date) {
                    setNextReviewDate(incidentData.next_review_date);
                }
                if (incidentData.next_review_responsible_person_id) {
                    setNextReviewResponsible(incidentData.next_review_responsible_person_id.toString());
                } else if (incidentData.assigned_to) {
                    setNextReviewResponsible(incidentData.assigned_to.toString());
                }

                // Mark data as loaded
                setDataLoaded(true);
                console.log('Data prefill completed');

                // Auto-navigate to step based on current_status
                if (incidentData.current_status) {
                    const status = incidentData.current_status.toLowerCase().replace(/\s+/g, '_');

                    switch (status) {
                        case 'reported':
                        case 'open':
                            if (incidentData.incident_over_time) {
                                if (
                                    incidentData.investigator_details?.length > 0 ||
                                    incidentData.incident_investigations?.length > 0 ||
                                    incidentData.root_causes?.length > 0
                                ) {
                                    if (
                                        incidentData.corrective_fields?.length > 0 ||
                                        incidentData.preventive_fields?.length > 0
                                    ) {
                                        // has everything → step 4
                                        setCurrentStep(4);
                                    } else {
                                        // has over_time + investigation but no corrective/preventive → step 3
                                        setCurrentStep(3);
                                    }
                                } else {
                                    // has over_time but no investigation details → step 2
                                    setCurrentStep(2);
                                }
                            } else {
                                // nothing filled → step 1
                                setCurrentStep(1);
                            }
                            break;
                        case 'investigation':
                        case 'investigating':
                            setCurrentStep(2);
                            break;
                        case 'provisional_closure':
                        case 'provisional':
                            setCurrentStep(4);
                            break;
                        case 'final_closure':
                        case 'closed':
                            setCurrentStep(4);
                            break;
                        default:
                            setCurrentStep(1);
                            break;
                    }
                }
            } else {
                setError('Incident not found');
                toast.error('Incident not found');
            }
        } catch (err) {
            setError('Failed to fetch incident details');
            console.error('Error fetching incident:', err);
            toast.error('Failed to fetch incident details');
        } finally {
            setLoading(false);
        }
    }, [id]);


    // Effects
    useEffect(() => {
        if (id && !dataLoaded) {
            fetchIncidentDetails();
        }
        fetchPropertyDamageCategories();
        fetchRcaCategories();
        fetchCorrectiveActionsCategories();
        fetchPreventiveActionsCategories();
        fetchSubstandardConditionCategories();
        fetchSubstandardActCategories();
    }, [id, fetchIncidentDetails, fetchPropertyDamageCategories, fetchRcaCategories,
        fetchCorrectiveActionsCategories, fetchPreventiveActionsCategories,
        fetchSubstandardConditionCategories, fetchSubstandardActCategories]);

    useEffect(() => {
        if ((showInvestigatorForm && investigatorTab === 'internal') || currentStep === 3) {
            fetchInternalUsers();
        }
    }, [showInvestigatorForm, investigatorTab, currentStep, fetchInternalUsers]);

    useEffect(() => {
        if (currentStep === 3) {
            fetchCorrectiveActionsCategories();
            fetchPreventiveActionsCategories();
        }
    }, [currentStep, fetchCorrectiveActionsCategories, fetchPreventiveActionsCategories]);

    // Auto-navigate to step 3 if all required investigation fields are present
    useEffect(() => {
        if (incident) {
            const status = incident.current_status?.toLowerCase().replace(/\s+/g, '_') || '';

            // Don't override step navigation if incident is already in closure stages
            if (status === 'provisional_closure' || status === 'provisional' ||
                status === 'final_closure' || status === 'closed') {
                return;
            }
            const hasRootCauses = Array.isArray(incident.root_causes) && incident.root_causes.length > 0;
            const hasPropertyDamages = Array.isArray(incident.property_damages) && incident.property_damages.length > 0;
            const hasInjuries = Array.isArray(incident.injuries) && incident.injuries.length > 0;
            const hasInvestigations = Array.isArray(incident.incident_investigations) && incident.incident_investigations.length > 0;
            if (hasRootCauses && hasPropertyDamages && hasInjuries && hasInvestigations) {
                setCurrentStep(3);
            }
        }

    }, [incident]);

    // Memoized handlers
    const handleBack = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    }, [currentStep, navigate]);

    const handleDownloadIncidentReport = useCallback(async () => {
        if (!id) {
            toast.error('Incident ID not found');
            return;
        }

        try {
            setReportDownloadLoading(true);

            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidents/${id}/incident_report?access_token=${token}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `incident-report-${id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success('Incident report downloaded successfully');
            } else {
                toast.error('Failed to download incident report');
            }
        } catch (error) {
            console.error('Error downloading incident report:', error);
            toast.error('Failed to download incident report. Please try again.');
        } finally {
            setReportDownloadLoading(false);
        }
    }, [id]);

    const handleNext = useCallback(async () => {
        try {
            setLoading(true);

            if (currentStep === 1 && id && incidentOverTime) {
                let baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';

                if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                    baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                }

                const formData = new FormData();
                formData.append('incident[incident_over_time]', incidentOverTime);

                const response = await fetch(`${baseUrl}/pms/incidents/${id}.json`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    console.log('Incident over time saved:', incidentOverTime);
                } else {
                    console.error('Failed to save incident over time');
                }
            }

            if (currentStep < 4) {
                setCurrentStep(currentStep + 1);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Failed to save data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [currentStep, id, incidentOverTime]);

    const handleSaveAsDraft = useCallback(() => {
        console.log('Saving as draft...');
    }, []);

    const handleSubmit = useCallback(async () => {
        console.log('Submitting...');
        try {
            if (currentStep === 2) {
                setLoading(true);
                console.log(investigators)

                if (!investigators || investigators.length === 0) {
                    toast.error('Please add at least one investigator');
                    setLoading(false);
                    return;
                }

                const hasValidInvestigation = investigationDescription || subStandardConditionId || subStandardActId;
                if (!hasValidInvestigation) {
                    toast.error('Please fill in the investigation details');
                    setLoading(false);
                    return;
                }

                const validRootCauses = rootCauses.filter(rc => rc.causeId && rc.description);
                if (validRootCauses.length === 0) {
                    toast.error('Please add at least one root cause with category and description');
                    setLoading(false);
                    return;
                }


                let baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';

                if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                    baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                }

                const investigator_details = investigators.map(inv => {
                    if (inv.type === 'internal') {
                        return {
                            user_id: inv.id ? parseInt(inv.id) : null,
                            name: inv.name,
                            role: inv.role,
                            email: inv.email,
                            investigator_type: 'internal'
                        };
                    } else {
                        return {
                            user_id: null,
                            name: inv.name,
                            role: inv.role,
                            email: inv.email,
                            investigator_type: 'external'
                        };
                    }
                });

                const incident_investigations = [];
                if (investigationDescription || subStandardConditionId || subStandardActId) {
                    incident_investigations.push({
                        name: investigators[0]?.name || '',
                        mobile: investigators[0]?.contactNo || '',
                        designation: investigators[0]?.role || '',
                        sub_standard_condition_id: subStandardConditionId ? parseInt(subStandardConditionId) : null,
                        sub_standard_act_id: subStandardActId ? parseInt(subStandardActId) : null,
                        description: investigationDescription
                    });
                }

                const inc_root_causes = rootCauses
                    .filter(rc => rc.causeId && rc.description)
                    .map(rc => ({
                        rca_category_id: parseInt(rc.causeId),
                        description: rc.description
                    }));

                const property_damages = [];
                if (hasPropertyDamage && selectedPropertyDamage) {
                    // Find the property damage object for attachments
                    const propertyDamageObj = propertyDamages.find(pd => pd.propertyType === selectedPropertyDamage);
                    let attachmentsBase64: string[] = [];
                    if (propertyDamageObj && propertyDamageObj.attachments && propertyDamageObj.attachments.length > 0) {
                        attachmentsBase64 = await Promise.all(
                            propertyDamageObj.attachments.map(file => {
                                return new Promise<string>((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = () => resolve(reader.result as string);
                                    reader.onerror = reject;
                                    reader.readAsDataURL(file);
                                });
                            })
                        );
                    }
                    property_damages.push({
                        property_type_id: parseInt(selectedPropertyDamage),
                        attachments: attachmentsBase64
                    });
                }

                // const injuries = [];
                // if (hasInjury && injuredPersons.length > 0) {
                //     for (const person of injuredPersons) {
                //         let attachmentsBase64: string[] = [];
                //         if (person.attachments && person.attachments.length > 0) {
                //             attachmentsBase64 = await Promise.all(
                //                 person.attachments.map(file => {
                //                     return new Promise<string>((resolve, reject) => {
                //                         const reader = new FileReader();
                //                         reader.onload = () => resolve(reader.result as string);
                //                         reader.onerror = reject;
                //                         reader.readAsDataURL(file);
                //                     });
                //                 })
                //             );
                //         }

                //         const bodyPartsArray: string[] = [];
                //         if (person.bodyParts.head) bodyPartsArray.push('head');
                //         if (person.bodyParts.neck) bodyPartsArray.push('neck');
                //         if (person.bodyParts.arms) bodyPartsArray.push('arms');
                //         if (person.bodyParts.eyes) bodyPartsArray.push('eyes');
                //         if (person.bodyParts.legs) bodyPartsArray.push('legs');
                //         if (person.bodyParts.skin) bodyPartsArray.push('skin');
                //         if (person.bodyParts.mouth) bodyPartsArray.push('mouth');
                //         if (person.bodyParts.ears) bodyPartsArray.push('ears');

                //         const normalizedInjuryTypes = Array.isArray(person.injuryTypes)
                //             ? person.injuryTypes
                //             : typeof person.injuryTypes === 'string'
                //                 ? person.injuryTypes.split(',').map(item => item.trim()).filter(Boolean)
                //                 : [];

                //         const typesToSend = bodyPartsArray.length > 0 ? bodyPartsArray : normalizedInjuryTypes;

                //         const whoGotInjuredId = person.id && !isNaN(Number(person.id)) ? Number(person.id) : null;

                //         injuries.push({
                //             injury_type: person.injuryType || '',
                //             injury_number: person.injuryNumber || '',
                //             who_got_injured_id: whoGotInjuredId,
                //             name: person.name,
                //             mobile: person.mobile || '',
                //             age: parseInt(person.age) || 0,
                //             company_name: person.company || '',
                //             role: person.role,
                //             injured_user_type: person.type,
                //             types: typesToSend,
                //             injury_types: normalizedInjuryTypes.length > 0
                //                 ? normalizedInjuryTypes.join(', ')
                //                 : (person.injuryType || ''),
                //             body_parts: bodyPartsArray,
                //             attachments: attachmentsBase64
                //         });
                //     }
                // }
                const injuries = [];
                if (hasInjury && injuredPersons.length > 0) {
                    for (const person of injuredPersons) {
                        let attachmentsBase64: string[] = [];
                        if (person.attachments && person.attachments.length > 0) {
                            attachmentsBase64 = await Promise.all(
                                person.attachments.map(file => {
                                    return new Promise<string>((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onload = () => resolve(reader.result as string);
                                        reader.onerror = reject;
                                        reader.readAsDataURL(file);
                                    });
                                })
                            );
                        }

                        const bodyPartsArray: string[] = [];
                        if (person.bodyParts.head) bodyPartsArray.push('head');
                        if (person.bodyParts.neck) bodyPartsArray.push('neck');
                        if (person.bodyParts.arms) bodyPartsArray.push('arms');
                        if (person.bodyParts.eyes) bodyPartsArray.push('eyes');
                        if (person.bodyParts.legs) bodyPartsArray.push('legs');
                        if (person.bodyParts.skin) bodyPartsArray.push('skin');
                        if (person.bodyParts.mouth) bodyPartsArray.push('mouth');
                        if (person.bodyParts.ears) bodyPartsArray.push('ears');

                        injuries.push({
                            injury_type: person.injuryType || '',
                            injury_number: person.injuryNumber || '',
                            who_got_injured_id: person.type === 'internal'
                                ? (person.who_got_injured_id ? Number(person.who_got_injured_id) : null)
                                : null,                    // ← FIXED: Use who_got_injured_id for internal
                            name: person.name || '',
                            mobile: person.mobile || '',
                            age: parseInt(person.age) || 0,
                            company_name: person.company || '',
                            role: person.role || '',
                            injured_user_type: person.type,
                            types: bodyPartsArray,
                            // injury_types: bodyPartsArray.join(', '),
                            body_parts: bodyPartsArray,
                            attachments: attachmentsBase64
                        });
                    }
                }

                console.log("injuries", injuries)
                const payload: any = {
                    incident_id: parseInt(id),
                    investigator_details
                };

                if (incident_investigations.length > 0) {
                    payload.incident_investigations = incident_investigations;
                }
                if (inc_root_causes.length > 0) {
                    payload.inc_root_causes = inc_root_causes;
                }
                if (property_damages.length > 0) {
                    payload.property_damages = property_damages;
                }
                if (injuries.length > 0) {
                    payload.injuries = injuries;
                }

                console.log('Sending investigation payload:', JSON.stringify(payload, null, 2));

                const response = await fetch(`${baseUrl}/pms/incidents/add_inc_details.json`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('API Error:', errorData);
                    throw new Error('Failed to save investigation details');
                }

                const result = await response.json();
                console.log('Investigation details saved successfully:', result);

                toast.success('Investigation details submitted successfully!');
                setCurrentStep(3);

            } else if (currentStep === 3) {
                setLoading(true);
                const validCorrectiveActions = correctiveActions?.filter(a => a.action && a.description) || [];
                const hasCorrectiveAction = validCorrectiveActions.length > 0 || (selectedCorrectiveAction && correctiveActionDescription);

                const validPreventiveActions = preventiveActions?.filter(a => a.action && a.description) || [];
                const hasPreventiveAction = validPreventiveActions.length > 0 || (selectedPreventiveAction && preventiveActionDescription);

                if (!hasCorrectiveAction) {
                    toast.error('Please add at least one corrective action with action type and description');
                    setLoading(false);
                    return;
                }

                if (!hasPreventiveAction) {
                    toast.error('Please add at least one preventive action with action type and description');
                    setLoading(false);
                    return;
                }
                let baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';

                if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                    baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                }

                const corrective_fields = [];

                if (correctiveActions && correctiveActions.length > 0) {
                    correctiveActions.forEach(action => {
                        if (action.action && action.description) {
                            corrective_fields.push({
                                tag_type_id: parseInt(action.action),
                                tag_type: 'corrective',
                                description: action.description,
                                responsible_person_id: action.responsiblePerson
                                    ? parseInt(action.responsiblePerson)
                                    : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
                                date: action.targetDate || new Date().toISOString().split('T')[0]
                            });
                        }
                    });
                }

                if (selectedCorrectiveAction && correctiveActionDescription) {
                    corrective_fields.push({
                        tag_type_id: parseInt(selectedCorrectiveAction),
                        tag_type: 'corrective',
                        description: correctiveActionDescription,
                        responsible_person_id: correctiveActionResponsiblePerson
                            ? parseInt(correctiveActionResponsiblePerson)
                            : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
                        date: correctiveActionDate || new Date().toISOString().split('T')[0]
                    });
                }

                const preventive_fields = [];

                if (preventiveActions && preventiveActions.length > 0) {
                    preventiveActions.forEach(action => {
                        if (action.action && action.description) {
                            preventive_fields.push({
                                tag_type_id: parseInt(action.action),
                                tag_type: 'preventive',
                                description: action.description,
                                responsible_person_id: action.responsiblePerson
                                    ? parseInt(action.responsiblePerson)
                                    : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
                                date: action.targetDate || new Date().toISOString().split('T')[0]
                            });
                        }
                    });
                }

                if (selectedPreventiveAction && preventiveActionDescription) {
                    preventive_fields.push({
                        tag_type_id: parseInt(selectedPreventiveAction),
                        tag_type: 'preventive',
                        description: preventiveActionDescription,
                        responsible_person_id: preventiveActionResponsiblePerson
                            ? parseInt(preventiveActionResponsiblePerson)
                            : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
                        date: preventiveActionDate || new Date().toISOString().split('T')[0]
                    });
                }

                const payload = {
                    about: 'Pms::Incident',
                    about_id: parseInt(id!),
                    comment: 'Provisional closure update',
                    priority: 'medium',
                    current_status: 'provisional_closure',
                    osr_staff_id: investigators[0]?.id ? parseInt(investigators[0].id) : null,
                    corrective_fields,
                    preventive_fields,
                    assigned_to: investigators[0]?.id ? parseInt(investigators[0].id) : null
                };

                console.log('Sending provisional closure payload:', JSON.stringify(payload, null, 2));

                const response = await fetch(`${baseUrl}/pms/incidents/inc_clousure_details.json?access_token=${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('API Error:', errorData);
                    throw new Error('Failed to submit provisional closure');
                }

                const result = await response.json();
                console.log('Provisional closure submitted successfully:', result);


                toast.success('Provisional closure submitted successfully!');
                fetchIncidentDetails();
                setCurrentStep(4);
            } else if (currentStep === 4) {
                // Final Closure Submission
                setLoading(true);

                let baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';

                if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                    baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                }

                // Prepare corrective actions for final closure
                const corrective_fields = [];
                if (correctiveActions && correctiveActions.length > 0) {
                    correctiveActions.forEach(action => {
                        if (action.action && action.description) {
                            corrective_fields.push({
                                tag_type_id: parseInt(action.action),
                                id: action.id ? parseInt(action.id) : null,
                                tag_type: 'corrective',
                                description: action.description,
                                responsible_person_id: action.responsiblePerson
                                    ? parseInt(action.responsiblePerson)
                                    : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
                                date: action.targetDate || new Date().toISOString().split('T')[0]
                            });
                        }
                    });
                }
                console.log()
                // Prepare preventive actions for final closure
                const preventive_fields = [];
                if (preventiveActions && preventiveActions.length > 0) {
                    preventiveActions.forEach(action => {
                        if (action.action && action.description) {
                            preventive_fields.push({
                                tag_type_id: parseInt(action.action),
                                id: action.id ? parseInt(action.id) : null,
                                tag_type: 'preventive',
                                description: action.description,
                                responsible_person_id: action.responsiblePerson
                                    ? parseInt(action.responsiblePerson)
                                    : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
                                date: action.targetDate || new Date().toISOString().split('T')[0]
                            });
                        }
                    });
                }

                console.log('Corrective Actions:', correctiveActions);
                console.log('Preventive Actions:', preventiveActions);
                const payload = {
                    about: 'Pms::Incident',
                    about_id: parseInt(id!),
                    comment: finalClosureCorrectiveDescription || 'Final closure update',
                    priority: 'high',
                    current_status: 'final_closure',
                    osr_staff_id: investigators[0]?.id ? parseInt(investigators[0].id) : null,
                    corrective_fields,
                    preventive_fields,
                    corrective_summary: finalClosureCorrectiveDescription || '',
                    preventive_summary: finalClosurePreventiveDescription || '',
                    next_review_date: nextReviewDate || '',
                    next_review_responsible_person_id: nextReviewResponsible ? parseInt(nextReviewResponsible) : null,
                    assigned_to: nextReviewResponsible ? parseInt(nextReviewResponsible) : (investigators[0]?.id ? parseInt(investigators[0].id) : null)
                };

                console.log('Sending final closure payload:', JSON.stringify(payload, null, 2));

                try {
                    const response = await fetch(`${baseUrl}/pms/incidents/inc_clousure_details.json?access_token=${token}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error('API Error:', errorData);
                        throw new Error('Failed to submit final closure');
                    }

                    const result = await response.json();
                    console.log('Final closure submitted successfully:', result);

                    toast.success('Final closure submitted successfully! Incident has been closed.');

                    // Navigate back to incidents list or dashboard
                    navigate('/safety/incident');

                } catch (error) {
                    console.error('Error submitting final closure:', error);
                    toast.error('Failed to submit final closure. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Error submitting:', error);
            toast.error('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [currentStep, id, investigators, investigationDescription, subStandardConditionId, subStandardActId,
        rootCauses, hasPropertyDamage, selectedPropertyDamage, hasInjury, injuredPersonName, injuryType,
        injuryNumber, injuredUserType, injuredPersonMobile, injuredPersonAge, injuredPersonCompany,
        injuredPersonRole, injuryTypes, correctiveActions, selectedCorrectiveAction, correctiveActionDescription,
        correctiveActionResponsiblePerson, correctiveActionDate, preventiveActions, selectedPreventiveAction,
        preventiveActionDescription, preventiveActionResponsiblePerson, preventiveActionDate,
        finalClosureCorrectiveDescription, finalClosurePreventiveDescription, nextReviewDate,
        nextReviewResponsible, navigate]);

    // const handleSubmit = useCallback(async () => {
    //     if (!id) {
    //         toast.error('Incident ID is missing');
    //         return;
    //     }

    //     console.log('Submitting... Current Step:', currentStep);

    //     setLoading(true);

    //     try {
    //         let baseUrl = localStorage.getItem('baseUrl') || '';
    //         const token = localStorage.getItem('token') || '';

    //         if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    //             baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    //         }

    //         if (currentStep === 2) {
    //             // Validation
    //             if (!investigators || investigators.length === 0) {
    //                 toast.error('Please add at least one investigator');
    //                 return;
    //             }

    //             const hasValidInvestigation = investigationDescription || subStandardConditionId || subStandardActId;
    //             if (!hasValidInvestigation) {
    //                 toast.error('Please fill in the investigation details');
    //                 return;
    //             }

    //             const validRootCauses = rootCauses.filter(rc => rc.causeId && rc.description.trim());
    //             if (validRootCauses.length === 0) {
    //                 toast.error('Please add at least one root cause with category and description');
    //                 return;
    //             }

    //             // ==================== INVESTIGATOR DETAILS ====================
    //             const investigator_details = investigators.map(inv => ({
    //                 user_id: inv.type === 'internal' && inv.id ? parseInt(inv.id) : null,
    //                 name: inv.name?.trim() || '',
    //                 role: inv.role?.trim() || '',
    //                 email: inv.email?.trim() || '',
    //                 investigator_type: inv.type
    //             }));

    //             // ==================== INCIDENT INVESTIGATIONS ====================
    //             const incident_investigations = [{
    //                 name: investigators[0]?.name || '',
    //                 mobile: investigators[0]?.contactNo || '',
    //                 designation: investigators[0]?.role || '',
    //                 sub_standard_condition_id: subStandardConditionId ? parseInt(subStandardConditionId) : null,
    //                 sub_standard_act_id: subStandardActId ? parseInt(subStandardActId) : null,
    //                 description: investigationDescription?.trim() || ''
    //             }];

    //             // ==================== ROOT CAUSES ====================
    //             const inc_root_causes = validRootCauses.map(rc => ({
    //                 rca_category_id: parseInt(rc.causeId),
    //                 description: rc.description.trim()
    //             }));

    //             // ==================== PROPERTY DAMAGES ====================
    //             const property_damages: any[] = [];
    //             if (hasPropertyDamage && selectedPropertyDamage) {
    //                 const propertyDamageObj = propertyDamages.find(pd => pd.propertyType === selectedPropertyDamage);
    //                 let attachmentsBase64: string[] = [];

    //                 if (propertyDamageObj?.attachments?.length > 0) {
    //                     attachmentsBase64 = await Promise.all(
    //                         propertyDamageObj.attachments.map((file: File) =>
    //                             new Promise<string>((resolve, reject) => {
    //                                 const reader = new FileReader();
    //                                 reader.onload = () => resolve(reader.result as string);
    //                                 reader.onerror = reject;
    //                                 reader.readAsDataURL(file);
    //                             })
    //                         )
    //                     );
    //                 }

    //                 property_damages.push({
    //                     property_type_id: parseInt(selectedPropertyDamage),
    //                     attachments: attachmentsBase64
    //                 });
    //             }

    //             // ==================== INJURIES - FIXED VERSION ====================

    //             // if (hasInjury && injuredPersons && injuredPersons.length > 0) {
    //             //     for (const person of injuredPersons) {
    //             //         // Convert bodyParts object to array (this was the main issue)
    //             //         const bodyPartsArray: string[] = [];
    //             //         if (person.bodyParts?.head) bodyPartsArray.push('head');
    //             //         if (person.bodyParts?.neck) bodyPartsArray.push('neck');
    //             //         if (person.bodyParts?.arms) bodyPartsArray.push('arms');
    //             //         if (person.bodyParts?.eyes) bodyPartsArray.push('eyes');
    //             //         if (person.bodyParts?.legs) bodyPartsArray.push('legs');
    //             //         if (person.bodyParts?.skin) bodyPartsArray.push('skin');
    //             //         if (person.bodyParts?.mouth) bodyPartsArray.push('mouth');
    //             //         if (person.bodyParts?.ears) bodyPartsArray.push('ears');

    //             //         let attachmentsBase64: string[] = [];
    //             //         if (person.attachments?.length > 0) {
    //             //             attachmentsBase64 = await Promise.all(
    //             //                 person.attachments.map((file: File) =>
    //             //                     new Promise<string>((resolve, reject) => {
    //             //                         const reader = new FileReader();
    //             //                         reader.onload = () => resolve(reader.result as string);
    //             //                         reader.onerror = reject;
    //             //                         reader.readAsDataURL(file);
    //             //                     })
    //             //                 )
    //             //             );
    //             //         }

    //             //         injuries.push({
    //             //             name: person.name?.trim() || '',
    //             //             age: parseInt(person.age || '0'),
    //             //             mobile: person.mobile?.trim() || '',
    //             //             company_name: person.company?.trim() || '',
    //             //             role: person.role?.trim() || '',
    //             //             injured_user_type: person.type || 'external',

    //             //             // Key fixes for injuries
    //             //             body_parts: bodyPartsArray,           // ← Important: array, not object
    //             //             injury_type: person.injuryType || '',
    //             //             injury_number: person.injuryNumber || '',

    //             //             types: Array.isArray(person.injuryTypes) ? person.injuryTypes : [],
    //             //             injury_types: Array.isArray(person.injuryTypes) ? person.injuryTypes : [],

    //             //             // Remove or set to null - usually not needed when sending full details
    //             //             who_got_injured_id: null,

    //             //             attachments: attachmentsBase64
    //             //         });
    //             //     }
    //             // }

    //             // ==================== INJURIES - FINAL FIX ====================

    //             // ==================== INJURIES - FINAL FIXED VERSION ====================
    //             const injuries: any[] = [];

    //             if (hasInjury && injuredPersons && injuredPersons.length > 0) {
    //                 for (const person of injuredPersons) {
    //                     let attachmentsBase64: string[] = [];
    //                     if (person.attachments?.length > 0) {
    //                         attachmentsBase64 = await Promise.all(
    //                             person.attachments.map((file: File) =>
    //                                 new Promise<string>((resolve, reject) => {
    //                                     const reader = new FileReader();
    //                                     reader.onload = () => resolve(reader.result as string);
    //                                     reader.onerror = reject;
    //                                     reader.readAsDataURL(file);
    //                                 })
    //                             )
    //                         );
    //                     }

    //                     const bodyPartsArray: string[] = [];
    //                     if (person.bodyParts?.head) bodyPartsArray.push('head');
    //                     if (person.bodyParts?.neck) bodyPartsArray.push('neck');
    //                     if (person.bodyParts?.arms) bodyPartsArray.push('arms');
    //                     if (person.bodyParts?.eyes) bodyPartsArray.push('eyes');
    //                     if (person.bodyParts?.legs) bodyPartsArray.push('legs');
    //                     if (person.bodyParts?.skin) bodyPartsArray.push('skin');
    //                     if (person.bodyParts?.mouth) bodyPartsArray.push('mouth');
    //                     if (person.bodyParts?.ears) bodyPartsArray.push('ears');

    //                     const injuryObj: any = {
    //                         name: person.name?.trim() || '',
    //                         age: parseInt(person.age || '0') || 0,
    //                         mobile: person.mobile?.trim() || '',
    //                         company_name: person.company?.trim() || '',
    //                         role: person.role?.trim() || '',
    //                         injured_user_type: person.type || 'external',

    //                         injury_type: person.injuryType || '',
    //                         injury_number: person.injuryNumber || '',

    //                         types: Array.isArray(person.injuryTypes) ? person.injuryTypes : [],
    //                         injury_types: Array.isArray(person.injuryTypes)
    //                             ? person.injuryTypes.join(', ')
    //                             : (person.injuryType || ''),

    //                         body_parts: bodyPartsArray,
    //                         attachments: attachmentsBase64
    //                     };

    //                     // === IMPORTANT: Add who_got_injured_id for internal users ===
    //                     if (person.type === 'internal' && person.id) {
    //                         const userId = Number(person.id);
    //                         if (!isNaN(userId) && userId > 0 && userId <= 2147483647) {
    //                             injuryObj.who_got_injured_id = userId;
    //                         } else {
    //                             console.warn('Invalid who_got_injured_id skipped:', person.id);
    //                         }
    //                     }

    //                     injuries.push(injuryObj);
    //                 }
    //             }

    //             // ==================== FINAL PAYLOAD ====================
    //             const payload: any = {
    //                 incident_id: parseInt(id),
    //                 investigator_details,
    //                 incident_investigations,
    //                 inc_root_causes
    //             };

    //             if (property_damages.length > 0) {
    //                 payload.property_damages = property_damages;
    //             }

    //             if (injuries.length > 0) {
    //                 payload.injuries = injuries;
    //             }

    //             console.log('🚀 FINAL PAYLOAD (Step 2):', JSON.stringify(payload, null, 2));

    //             // API Call
    //             const response = await fetch(`${baseUrl}/pms/incidents/add_inc_details.json`, {
    //                 method: 'PUT',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`
    //                 },
    //                 body: JSON.stringify(payload)
    //             });

    //             if (!response.ok) {
    //                 const errorData = await response.json().catch(() => ({}));
    //                 console.error('API Error:', errorData);
    //                 throw new Error(errorData.message || 'Failed to save investigation details');
    //             }

    //             const result = await response.json();
    //             console.log('✅ Success:', result);

    //             toast.success('Investigation details submitted successfully!');
    //             setCurrentStep(3);   // Move to Provisional step

    //         } else if (currentStep === 3) {

    //             let baseUrl = localStorage.getItem('baseUrl') || '';
    //             const token = localStorage.getItem('token') || '';

    //             if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    //                 baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    //             }

    //             const corrective_fields: any[] = [];
    //             const preventive_fields: any[] = [];

    //             // ✅ Corrective
    //             correctiveActions?.forEach(action => {
    //                 if (action.action && action.description) {
    //                     corrective_fields.push({
    //                         tag_type_id: parseInt(action.action),
    //                         tag_type: 'corrective',
    //                         description: action.description,
    //                         responsible_person_id: action.responsiblePerson
    //                             ? parseInt(action.responsiblePerson)
    //                             : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
    //                         date: action.targetDate || new Date().toISOString().split('T')[0]
    //                     });
    //                 }
    //             });

    //             // ✅ Preventive
    //             preventiveActions?.forEach(action => {
    //                 if (action.action && action.description) {
    //                     preventive_fields.push({
    //                         tag_type_id: parseInt(action.action),
    //                         tag_type: 'preventive',
    //                         description: action.description,
    //                         responsible_person_id: action.responsiblePerson
    //                             ? parseInt(action.responsiblePerson)
    //                             : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
    //                         date: action.targetDate || new Date().toISOString().split('T')[0]
    //                     });
    //                 }
    //             });

    //             if (corrective_fields.length === 0) {
    //                 toast.error('Add at least one corrective action');
    //                 return;
    //             }

    //             if (preventive_fields.length === 0) {
    //                 toast.error('Add at least one preventive action');
    //                 return;
    //             }

    //             const payload = {
    //                 about: 'Pms::Incident',
    //                 about_id: parseInt(id),
    //                 comment: 'Provisional closure update',
    //                 priority: 'medium',
    //                 current_status: 'provisional_closure',
    //                 osr_staff_id: investigators[0]?.id ? parseInt(investigators[0].id) : null,
    //                 corrective_fields,
    //                 preventive_fields,
    //                 assigned_to: investigators[0]?.id ? parseInt(investigators[0].id) : null
    //             };

    //             console.log('🚀 STEP 3 PAYLOAD:', payload);

    //             const response = await fetch(`${baseUrl}/pms/incidents/inc_clousure_details.json`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`
    //                 },
    //                 body: JSON.stringify(payload)
    //             });

    //             if (!response.ok) {
    //                 const err = await response.json().catch(() => ({}));
    //                 console.error(err);
    //                 throw new Error('Step 3 failed');
    //             }

    //             toast.success('Provisional closure submitted!');
    //             setCurrentStep(4);

    //         } else if (currentStep === 4) {

    //             let baseUrl = localStorage.getItem('baseUrl') || '';
    //             const token = localStorage.getItem('token') || '';

    //             if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    //                 baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    //             }

    //             const corrective_fields: any[] = [];
    //             const preventive_fields: any[] = [];

    //             correctiveActions?.forEach(action => {
    //                 if (action.action && action.description) {
    //                     corrective_fields.push({
    //                         tag_type_id: parseInt(action.action),
    //                         tag_type: 'corrective',
    //                         description: action.description,
    //                         responsible_person_id: action.responsiblePerson
    //                             ? parseInt(action.responsiblePerson)
    //                             : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
    //                         date: action.targetDate || new Date().toISOString().split('T')[0]
    //                     });
    //                 }
    //             });

    //             preventiveActions?.forEach(action => {
    //                 if (action.action && action.description) {
    //                     preventive_fields.push({
    //                         tag_type_id: parseInt(action.action),
    //                         tag_type: 'preventive',
    //                         description: action.description,
    //                         responsible_person_id: action.responsiblePerson
    //                             ? parseInt(action.responsiblePerson)
    //                             : (investigators[0]?.id ? parseInt(investigators[0].id) : null),
    //                         date: action.targetDate || new Date().toISOString().split('T')[0]
    //                     });
    //                 }
    //             });

    //             const payload = {
    //                 about: 'Pms::Incident',
    //                 about_id: parseInt(id),
    //                 comment: finalClosureCorrectiveDescription || 'Final closure update',
    //                 priority: 'high',
    //                 current_status: 'final_closure',
    //                 osr_staff_id: investigators[0]?.id ? parseInt(investigators[0].id) : null,
    //                 corrective_fields,
    //                 preventive_fields,
    //                 corrective_summary: finalClosureCorrectiveDescription || '',
    //                 preventive_summary: finalClosurePreventiveDescription || '',
    //                 next_review_date: nextReviewDate || null,
    //                 next_review_responsible_person_id: nextReviewResponsible ? parseInt(nextReviewResponsible) : null,
    //                 assigned_to: nextReviewResponsible
    //                     ? parseInt(nextReviewResponsible)
    //                     : (investigators[0]?.id ? parseInt(investigators[0].id) : null)
    //             };

    //             console.log('🚀 STEP 4 PAYLOAD:', payload);

    //             const response = await fetch(`${baseUrl}/pms/incidents/inc_clousure_details.json`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`
    //                 },
    //                 body: JSON.stringify(payload)
    //             });

    //             if (!response.ok) {
    //                 const err = await response.json().catch(() => ({}));
    //                 console.error(err);
    //                 throw new Error('Step 4 failed');
    //             }

    //             toast.success('Final closure submitted!');
    //             navigate('/safety/incident');
    //         }

    //     } catch (error: any) {
    //         console.error('Submission Error:', error);
    //         toast.error(error.message || 'Failed to submit. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [
    //     currentStep,
    //     id,
    //     investigators,
    //     investigationDescription,
    //     subStandardConditionId,
    //     subStandardActId,
    //     rootCauses,
    //     hasPropertyDamage,
    //     selectedPropertyDamage,
    //     propertyDamages,
    //     hasInjury,
    //     injuredPersons
    // ]);


    const steps = [
        { number: 1, label: 'Report' },
        { number: 2, label: 'Investigate' },
        { number: 3, label: 'Provisional' },
        { number: 4, label: 'Final Closure' },
    ];

    // Closed Incident Summary View with Numbered Sections
    const ClosedIncidentSummaryView = () => {
        const SectionBadge = ({ number }: { number: number }) => (
            <div className="flex items-center justify-center w-8 h-8 bg-[#BF213E] text-white rounded-full text-xs font-bold">
                {number}
            </div>
        );

        return (
            <div className="p-4 space-y-6 overflow-y-auto flex-1 bg-gray-50">
                {/* Section 1: Report Details */}
                <div className="bg-white rounded-md shadow-sm">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                        <SectionBadge number={1} />
                        <h3 className="text-base font-semibold text-[#BF213E] uppercase">Report Details</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Incident ID</label>
                                <p className="text-sm text-gray-900 font-medium">{incident?.id || '-'}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Status</label>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold w-fit">
                                    ✓ {incident?.current_status || 'Closed'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Reported By</label>
                                <p className="text-sm text-gray-900 font-medium">{incident?.created_by || '-'}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Building</label>
                                <p className="text-sm text-gray-900 font-medium">{incident?.building_name || '-'}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Occurred On</label>
                                <p className="text-sm text-gray-900 font-medium">
                                    {incident?.inc_time ? new Date(incident.inc_time).toLocaleString() : '-'}
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Reported On</label>
                                <p className="text-sm text-gray-900 font-medium">
                                    {incident?.created_at ? new Date(incident.created_at).toLocaleString() : '-'}
                                </p>
                            </div>
                            <div className='flex flex-col'>
                                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">
                                    Incident Over Time
                                </label>
                                <p className="text-sm text-gray-900 font-medium">
                                    {incident?.incident_over_time
                                        ? new Date(incident.incident_over_time).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })
                                        : '-'}
                                </p>
                            </div>
                        </div>
                        {/* Description */}
                        <div className="pt-4 border-t border-gray-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Description</label>
                            <p className="text-sm text-gray-700 mt-2">{incident?.description || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Category & Investigation */}
                <div className="bg-white rounded-md shadow-sm">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                        <SectionBadge number={2} />
                        <h3 className="text-base font-semibold text-[#BF213E] uppercase">Incident Category</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Primary Category */}
                        {(incident?.category_name || incident?.sub_category_name) && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-4">Primary Category</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {incident?.category_name && (
                                        <div className="flex flex-col">
                                            <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Category</label>
                                            <p className="text-sm text-gray-900 font-medium">{incident.category_name}</p>
                                        </div>
                                    )}
                                    {incident?.sub_category_name && (
                                        <div className="flex flex-col">
                                            <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Sub-Category</label>
                                            <p className="text-sm text-gray-900 font-medium">{incident.sub_category_name}</p>
                                        </div>
                                    )}
                                    {incident?.sub_sub_category_name && (
                                        <div className="flex flex-col">
                                            <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Sub-Sub-Category</label>
                                            <p className="text-sm text-gray-900 font-medium">{incident.sub_sub_category_name}</p>
                                        </div>
                                    )}
                                    {incident?.sub_sub_sub_category_name && (
                                        <div className="flex flex-col">
                                            <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Sub-Sub-Sub-Category</label>
                                            <p className="text-sm text-gray-900 font-medium">{incident.sub_sub_sub_category_name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Incident Level */}
                        <div className="pt-4 border-t border-gray-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Incident Level</label>
                            <p className="text-sm text-gray-900 font-medium">{incident?.inc_level_name || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Section 3: Investigation Details */}
                {(Array.isArray(incident?.incident_investigations) && incident.incident_investigations.length > 0) ||
                    (Array.isArray(incident?.root_causes) && incident.root_causes.length > 0) ? (
                    <div className="bg-white rounded-md shadow-sm">
                        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                            <SectionBadge number={3} />
                            <h3 className="text-base font-semibold text-[#BF213E] uppercase">Investigation</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Investigators */}
                            {Array.isArray(incident?.incident_investigations) && incident.incident_investigations.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Investigators</h4>
                                    <div className="space-y-3">
                                        {incident.incident_investigations.map((inv, idx) => (
                                            <div key={idx} className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1">Name</label>
                                                        <p className="text-sm text-gray-900 font-medium">{inv.name || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1">Mobile</label>
                                                        <p className="text-sm text-gray-900 font-medium">{inv.mobile || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1">Designation</label>
                                                        <p className="text-sm text-gray-900 font-medium">{inv.designation || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Root Causes */}
                            {Array.isArray(incident?.root_causes) && incident.root_causes.length > 0 && (
                                <div className={Array.isArray(incident?.incident_investigations) && incident.incident_investigations.length > 0 ? "pt-4 border-t border-gray-200" : ""}>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Root Causes Analysis</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-300 bg-gray-50">
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Sr No.</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Category</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incident.root_causes.map((rc, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                                        <td className="py-3 px-4 text-gray-900 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 text-gray-900 font-medium">{rc.category_name || rc.name || '-'}</td>
                                                        <td className="py-3 px-4 text-gray-700">{rc.description || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Section 4: Injuries & Property */}
                {(Array.isArray(incident?.injuries) && incident.injuries.length > 0) ||
                    (Array.isArray(incident?.property_damages) && incident.property_damages.length > 0) ? (
                    <div className="bg-white rounded-md shadow-sm">
                        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                            <SectionBadge number={4} />
                            <h3 className="text-base font-semibold text-[#BF213E] uppercase">Impact Assessment</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Injuries */}
                            {Array.isArray(incident?.injuries) && incident.injuries.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Injuries</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-300 bg-gray-50">
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Name</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Age</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Type</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Role</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Injury Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incident.injuries.map((injury, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                                        <td className="py-3 px-4 text-gray-900 font-medium">{injury.name || '-'}</td>
                                                        <td className="py-3 px-4 text-gray-900">{injury.age || '-'}</td>
                                                        <td className="py-3 px-4 text-gray-900">{injury.injured_user_type || '-'}</td>
                                                        <td className="py-3 px-4 text-gray-900">{injury.role || '-'}</td>
                                                        <td className="py-3 px-4 text-gray-900">
                                                            {injury.injury_type || (Array.isArray(injury.injury_types) && injury.injury_types.length > 0
                                                                ? injury.injury_types.join(', ')
                                                                : '-')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Property Damages */}
                            {Array.isArray(incident?.property_damages) && incident.property_damages.length > 0 && (
                                <div className={Array.isArray(incident?.injuries) && incident.injuries.length > 0 ? "pt-4 border-t border-gray-200" : ""}>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Property Damages</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-300 bg-gray-50">
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Sr No.</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Property Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incident.property_damages.map((pd, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                                        <td className="py-3 px-4 text-gray-900 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 text-gray-900">{pd.property_type || pd.name || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Section 5: Actions */}
                {(Array.isArray(incident?.corrective_fields) && incident.corrective_fields.length > 0) ||
                    (Array.isArray(incident?.preventive_fields) && incident.preventive_fields.length > 0) ? (
                    <div className="bg-white rounded-md shadow-sm">
                        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                            <SectionBadge number={5} />
                            <h3 className="text-base font-semibold text-[#BF213E] uppercase">Actions & Follow-up</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Corrective Actions */}
                            {Array.isArray(incident?.corrective_fields) && incident.corrective_fields.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Corrective Actions</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-300 bg-gray-50">
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Action</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Description</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Target Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incident.corrective_fields.map((action, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                                        <td className="py-3 px-4 text-gray-900 font-medium">{action.action_name || '-'}</td>
                                                        <td className="py-3 px-4 text-gray-700">{action.description || '-'}</td>
                                                        <td className="py-3 px-4 text-gray-900">{action.date ? new Date(action.date).toLocaleDateString() : '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Preventive Actions */}
                            {Array.isArray(incident?.preventive_fields) && incident.preventive_fields.length > 0 && (
                                <div className={Array.isArray(incident?.corrective_fields) && incident.corrective_fields.length > 0 ? "pt-4 border-t border-gray-200" : ""}>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Preventive Actions</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-300 bg-gray-50">
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Action</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Description</th>
                                                    <th className="text-left font-semibold text-gray-700 py-3 px-4">Target Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incident.preventive_fields.map((action, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                                        <td className="py-3 px-4 text-gray-900 font-medium">{action.action_name || '-'}</td>
                                                        <td className="py-3 px-4 text-gray-700">{action.description || '-'}</td>
                                                        <td className="py-3 px-4 text-gray-900">{action.date ? new Date(action.date).toLocaleDateString() : '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Section 6: Next Review (if exists) */}
                {incident?.next_review_date && (
                    <div className="bg-white rounded-md shadow-sm">
                        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                            <SectionBadge number={6} />
                            <h3 className="text-base font-semibold text-[#BF213E] uppercase">Next Review</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Review Date</label>
                                    <p className="text-sm text-gray-900 font-medium">
                                        {new Date(incident.next_review_date).toLocaleDateString()}
                                    </p>
                                </div>
                                {incident.next_review_responsible_person_id && (
                                    <div className="flex flex-col">
                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Responsible Person</label>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {incident.next_review_responsible_person_id}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Spacing */}
                <div className="h-4" />
            </div>
        );
    };

    const ProgressStepper = () => (
        <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
            {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center flex-1">
                        <div
                            className={`w-32 h-10 flex items-center justify-center text-sm font-semibold border border-gray-300 rounded-md ${currentStep === step.number
                                ? 'bg-[#BF213E] text-white'
                                : 'bg-white text-gray-600'
                                }`}
                        >
                            {step.label}
                        </div>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className="flex-1 border-t border-dashed border-gray-300"
                            style={{ marginBottom: '20px' }}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack}>
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold">Incident Details</h1>
                </div>

                {/* ✅ Buttons wrapper */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadIncidentReport}
                        disabled={reportDownloadLoading}
                        className="flex items-center gap-2 border-[#BF213E] text-[#BF213E] hover:bg-[#F5E6D3]"
                    >
                        <Download className="w-4 h-4" />
                        {reportDownloadLoading ? 'Downloading...' : 'Incident Report'}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/safety/incident/edit/${id}`)}
                        className="flex items-center gap-2 border-[#BF213E] text-[#BF213E] hover:bg-[#F5E6D3]"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Button>
                </div>
            </div>

            {/* Check if incident is closed or in final closure */}
            {incident && (incident.current_status?.toLowerCase() === 'final_closure' || incident.current_status?.toLowerCase() === 'closed' || incident.current_status === 'Final_closure') ? (
                // Closed Incident Summary View
                <ClosedIncidentSummaryView />
            ) : (
                <>
                    {/* Progress Stepper */}
                    <ProgressStepper />

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {currentStep === 1 && (
                            <ReportStep
                                loading={loading}
                                error={error}
                                incident={incident}
                                incidentOverTime={incidentOverTime}
                                setIncidentOverTime={setIncidentOverTime}
                            />
                        )}
                        {currentStep === 2 && (
                            <InvestigateStep
                                incident={incident}
                                investigators={investigators}
                                setInvestigators={setInvestigators}
                                incidentOverTime={incidentOverTime}
                                showInvestigateDetails={showInvestigateDetails}
                                showInvestigatorForm={showInvestigatorForm}
                                setShowInvestigatorForm={setShowInvestigatorForm}
                                internalUsers={internalUsers}
                                conditions={conditions}
                                setConditions={setConditions}
                                subStandardConditionId={subStandardConditionId}
                                setSubStandardConditionId={setSubStandardConditionId}
                                subStandardActId={subStandardActId}
                                setSubStandardActId={setSubStandardActId}
                                investigationDescription={investigationDescription}
                                setInvestigationDescription={setInvestigationDescription}
                                substandardConditionCategories={substandardConditionCategories}
                                substandardActCategories={substandardActCategories}
                                rootCauses={rootCauses}
                                setRootCauses={setRootCauses}
                                rcaCategories={rcaCategories}
                                hasInjury={hasInjury}
                                setHasInjury={setHasInjury}
                                injuredPersons={injuredPersons}
                                setInjuredPersons={setInjuredPersons}
                                hasPropertyDamage={hasPropertyDamage}
                                setHasPropertyDamage={setHasPropertyDamage}
                                selectedPropertyDamage={selectedPropertyDamage}
                                setSelectedPropertyDamage={setSelectedPropertyDamage}
                                propertyDamageCategories={propertyDamageCategories}
                                propertyDamages={propertyDamages}
                                setPropertyDamages={setPropertyDamages}
                            />
                        )}
                        {currentStep === 3 && (
                            <ProvisionalStep
                                incident={incident}
                                investigators={investigators}
                                incidentOverTime={incidentOverTime}
                                correctiveActions={correctiveActions}
                                setCorrectiveActions={setCorrectiveActions}
                                preventiveActions={preventiveActions}
                                setPreventiveActions={setPreventiveActions}
                                selectedCorrectiveAction={selectedCorrectiveAction}
                                setSelectedCorrectiveAction={setSelectedCorrectiveAction}
                                correctiveActionDescription={correctiveActionDescription}
                                setCorrectiveActionDescription={setCorrectiveActionDescription}
                                correctiveActionResponsiblePerson={correctiveActionResponsiblePerson}
                                setCorrectiveActionResponsiblePerson={setCorrectiveActionResponsiblePerson}
                                correctiveActionDate={correctiveActionDate}
                                setCorrectiveActionDate={setCorrectiveActionDate}
                                selectedPreventiveAction={selectedPreventiveAction}
                                setSelectedPreventiveAction={setSelectedPreventiveAction}
                                preventiveActionDescription={preventiveActionDescription}
                                setPreventiveActionDescription={setPreventiveActionDescription}
                                preventiveActionResponsiblePerson={preventiveActionResponsiblePerson}
                                setPreventiveActionResponsiblePerson={setPreventiveActionResponsiblePerson}
                                preventiveActionDate={preventiveActionDate}
                                setPreventiveActionDate={setPreventiveActionDate}
                                nextReviewDate={nextReviewDate}
                                setNextReviewDate={setNextReviewDate}
                                nextReviewResponsible={nextReviewResponsible}
                                setNextReviewResponsible={setNextReviewResponsible}
                                correctiveActionsCategories={correctiveActionsCategories}
                                preventiveActionsCategories={preventiveActionsCategories}
                                internalUsers={internalUsers}
                            />
                        )}
                        {currentStep === 4 && (
                            <FinalClosureStep
                                incident={incident}
                                investigators={investigators}
                                incidentOverTime={incidentOverTime}
                                correctiveActions={correctiveActions}
                                setCorrectiveActions={setCorrectiveActions}
                                preventiveActions={preventiveActions}
                                setPreventiveActions={setPreventiveActions}
                                finalClosureCorrectiveDescription={finalClosureCorrectiveDescription}
                                setFinalClosureCorrectiveDescription={setFinalClosureCorrectiveDescription}
                                finalClosurePreventiveDescription={finalClosurePreventiveDescription}
                                setFinalClosurePreventiveDescription={setFinalClosurePreventiveDescription}
                                nextReviewDate={nextReviewDate}
                                setNextReviewDate={setNextReviewDate}
                                nextReviewResponsible={nextReviewResponsible}
                                setNextReviewResponsible={setNextReviewResponsible}
                                correctiveActionsCategories={correctiveActionsCategories}
                                preventiveActionsCategories={preventiveActionsCategories}
                                internalUsers={internalUsers}
                            />
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="border-t p-4 space-y-2">
                        {currentStep === 1 && (
                            <Button
                                className="w-full bg-[#BF213E] text-white hover:bg-[#9d1a32]"
                                onClick={handleNext}
                            >
                                Next
                            </Button>
                        )}

                        {currentStep === 2 && (
                            <>
                                <div className="flex justify-center items-center gap-3 p-4">
                                    <Button
                                        variant="outline"
                                        className="w-25 mx-3"
                                        onClick={handleSaveAsDraft}
                                    >
                                        Save as draft
                                    </Button>
                                    <Button
                                        className="w-50 bg-[#BF213E] text-white hover:bg-[#9d1a32]"
                                        onClick={handleSubmit}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        )}

                        {currentStep === 3 && (
                            <div className="flex justify-center">
                                <Button
                                    className="w-50 bg-[#BF213E] text-white hover:bg-[#9d1a32]"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="flex justify-center">
                                <Button
                                    className="w-50 bg-[#BF213E] text-white hover:bg-[#9d1a32]"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default IncidentNewDetails;