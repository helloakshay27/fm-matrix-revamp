import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Clock, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FormControl, Select as MuiSelect, MenuItem, InputLabel, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentService, type Incident } from '@/services/incidentService';
import { InvestigatorRepeater } from '@/components/InvestigatorRepeater';
import { InvestigatorData } from '@/components/InvestigatorBlock';

interface Investigator {
    id: string;
    name: string;
    email: string;
    role: string;
    contactNo: string;
    type: 'internal' | 'external';
    company?: string;
}

interface Condition {
    id: string;
    condition: string;
    act: string;
    description: string;
}

interface RootCause {
    id: string;
    causeId: string;
    description: string;
}

interface InjuredPerson {
    id: string;
    type: 'internal' | 'external';
    name: string;
    age: string;
    company?: string;
    role: string;
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

interface PropertyDamage {
    id: string;
    propertyType: string;
    attachments: File[];
}

interface CorrectiveAction {
    id: string;
    action: string;
    responsiblePerson: string;
    targetDate: string;
    description: string;
}

interface PreventiveAction {
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
    const [rootCauses, setRootCauses] = useState<RootCause[]>([]);
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

    // Corrective and Preventive Action details
    const [correctiveActionDescription, setCorrectiveActionDescription] = useState('');
    const [correctiveActionResponsiblePerson, setCorrectiveActionResponsiblePerson] = useState('');
    const [correctiveActionDate, setCorrectiveActionDate] = useState('');

    const [preventiveActionDescription, setPreventiveActionDescription] = useState('');
    const [preventiveActionResponsiblePerson, setPreventiveActionResponsiblePerson] = useState('');
    const [preventiveActionDate, setPreventiveActionDate] = useState('');

    // Final Closure descriptions
    const [finalClosureCorrectiveDescription, setFinalClosureCorrectiveDescription] = useState('');
    const [finalClosurePreventiveDescription, setFinalClosurePreventiveDescription] = useState('');

    // Sub-standard condition and act
    const [subStandardConditionId, setSubStandardConditionId] = useState('');
    const [subStandardActId, setSubStandardActId] = useState('');
    const [investigationDescription, setInvestigationDescription] = useState('');

    // Validation errors
    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        email?: string;
        contactNo?: string;
    }>({});

    // New Investigator Form
    const [newInvestigator, setNewInvestigator] = useState({
        name: '',
        email: '',
        role: '',
        contactNo: '',
        company: '',
    });

    // Fetch internal users for investigator dropdown
    const fetchInternalUsers = async () => {
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
                // Handle different response structures
                if (Array.isArray(data)) {
                    setInternalUsers(data);
                } else if (data && typeof data === 'object' && data.users) {
                    // Extract users array from response
                    setInternalUsers(Array.isArray(data.users) ? data.users : []);
                } else {
                    console.warn('Unexpected API response format:', data);
                    setInternalUsers([]);
                }
            } else {
                setInternalUsers([]);
            }
        } catch (error) {
            console.error('Error fetching internal users:', error);
            setInternalUsers([]);
        }
    };

    // Fetch property damage categories
    const fetchPropertyDamageCategories = async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
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
    };

    // Fetch RCA categories
    const fetchRcaCategories = async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
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
    };

    // Fetch Corrective Actions categories
    const fetchCorrectiveActionsCategories = async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            console.log('Fetching Corrective Actions from:', `${baseUrl}/pms/incidence_tags.json`);

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Corrective Actions API Response:', result);
                console.log('First item in response:', result.data?.[0]);
                console.log('All tag_types in response:', result.data?.map((item: any) => item.tag_type));
                const correctiveTypes = result.data
                    ?.filter((item: any) => item.tag_type === 'CorrectiveAction')
                    .map(({ id, name }: any) => ({ id, name })) || [];
                console.log('Filtered Corrective Actions:', correctiveTypes);
                setCorrectiveActionsCategories(correctiveTypes);
            } else {
                console.error('Failed to fetch Corrective Actions, status:', response.status);
                setCorrectiveActionsCategories([]);
            }
        } catch (error) {
            console.error('Error fetching Corrective Actions categories:', error);
            setCorrectiveActionsCategories([]);
        }
    };

    // Fetch Preventive Actions categories
    const fetchPreventiveActionsCategories = async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            console.log('Fetching Preventive Actions from:', `${baseUrl}/pms/incidence_tags.json`);

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Preventive Actions API Response:', result);
                console.log('All tag_types in response:', result.data?.map((item: any) => item.tag_type));
                const preventiveTypes = result.data
                    ?.filter((item: any) => item.tag_type === 'PreventiveAction')
                    .map(({ id, name }: any) => ({ id, name })) || [];
                console.log('Filtered Preventive Actions:', preventiveTypes);
                setPreventiveActionsCategories(preventiveTypes);
            } else {
                console.error('Failed to fetch Preventive Actions, status:', response.status);
                setPreventiveActionsCategories([]);
            }
        } catch (error) {
            console.error('Error fetching Preventive Actions categories:', error);
            setPreventiveActionsCategories([]);
        }
    };

    // Fetch Substandard Condition categories
    const fetchSubstandardConditionCategories = async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/{+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
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
    };

    // Fetch Substandard Act categories
    const fetchSubstandardActCategories = async () => {
        try {
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/{+/, '');
            }

            const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
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
    };

    // Fetch incident data on component mount
    useEffect(() => {
        if (id) {
            fetchIncidentDetails();
        }
        // Fetch property damage categories
        fetchPropertyDamageCategories();
        // Fetch RCA categories
        fetchRcaCategories();
        // Fetch Corrective Actions categories
        fetchCorrectiveActionsCategories();
        // Fetch Preventive Actions categories
        fetchPreventiveActionsCategories();
        // Fetch Substandard Condition categories
        fetchSubstandardConditionCategories();
        // Fetch Substandard Act categories
        fetchSubstandardActCategories();
    }, [id]);

    // Fetch internal users when form is shown
    useEffect(() => {
        if (showInvestigatorForm && investigatorTab === 'internal') {
            fetchInternalUsers();
        }
    }, [showInvestigatorForm, investigatorTab]);

    // Fetch corrective and preventive actions when user reaches step 3
    useEffect(() => {
        if (currentStep === 3) {
            console.log('User reached step 3, fetching actions...');
            fetchCorrectiveActionsCategories();
            fetchPreventiveActionsCategories();
        }
    }, [currentStep]);

    const fetchIncidentDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const incidentData = await incidentService.getIncidentById(id!);
            if (incidentData) {
                setIncident(incidentData);
                // Map investigators from API data if available
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
            } else {
                setError('Incident not found');
            }
        } catch (err) {
            setError('Failed to fetch incident details');
            console.error('Error fetching incident:', err);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, label: 'Report' },
        { number: 2, label: 'Investigate' },
        { number: 3, label: 'Provisional' },
        { number: 4, label: 'Final Closure' },
    ];

    // Handlers
    const handleAddInvestigator = () => {
        setValidationErrors({});

        if (investigatorTab === 'internal') {
            // Handle internal investigator
            if (!selectedInternalUser) {
                alert('Please select an internal user');
                return;
            }

            const selectedUser = internalUsers.find(u => u.id?.toString() === selectedInternalUser);
            if (selectedUser) {
                const investigator: Investigator = {
                    id: selectedUser.id?.toString() || Date.now().toString(),
                    name: selectedUser.full_name || '',
                    email: selectedUser.email || '',
                    role: selectedUser.role || 'Investigator',
                    contactNo: selectedUser.mobile || '',
                    type: 'internal',
                };
                setInvestigators([...investigators, investigator]);
                setSelectedInternalUser('');
                setShowInvestigatorForm(false);
            }
        } else {
            // Handle external investigator with validation
            const errors: any = {};

            // Validate name - only alphabets
            if (!newInvestigator.name.trim()) {
                errors.name = 'Name is required';
            } else if (!/^[a-zA-Z\s]+$/.test(newInvestigator.name)) {
                errors.name = 'Name should contain only alphabets';
            }

            // Validate email
            if (!newInvestigator.email.trim()) {
                errors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newInvestigator.email)) {
                errors.email = 'Please enter a valid email address';
            }

            // Validate contact number - only 10 digits
            if (!newInvestigator.contactNo.trim()) {
                errors.contactNo = 'Contact number is required';
            } else if (!/^\d{10}$/.test(newInvestigator.contactNo)) {
                errors.contactNo = 'Contact number must be exactly 10 digits';
            }

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                return;
            }

            const investigator: Investigator = {
                id: Date.now().toString(),
                ...newInvestigator,
                type: 'external',
            };
            setInvestigators([...investigators, investigator]);
            setNewInvestigator({ name: '', email: '', role: '', contactNo: '', company: '' });
            setValidationErrors({});
            setShowInvestigatorForm(false);
        }
    };

    const handleAddSampleInvestigators = () => {
        // For demo purposes - add sample investigators
        setInvestigators([
            {
                id: '1',
                name: 'Abdul Ghaffar',
                email: 'abdul@example.com',
                role: 'Investigator',
                contactNo: '1234567890',
                type: 'internal',
            },
            {
                id: '2',
                name: 'Kshitij Rasal',
                email: 'kshitij@example.com',
                role: 'Investigator',
                contactNo: '0987654321',
                type: 'internal',
            },
        ]);
    };

    const handleAddCondition = () => {
        const newCondition: Condition = {
            id: Date.now().toString(),
            condition: '',
            act: '',
            description: '',
        };
        setConditions([...conditions, newCondition]);
    };

    const handleAddRootCause = () => {
        const newCause: RootCause = {
            id: Date.now().toString(),
            causeId: '',
            description: '',
        };
        setRootCauses([...rootCauses, newCause]);
    };

    const updateRootCause = (id: string, field: string, value: any) => {
        setRootCauses(rootCauses.map(cause =>
            cause.id === id ? { ...cause, [field]: value } : cause
        ));
    };

    const removeRootCause = (id: string) => {
        setRootCauses(rootCauses.filter(cause => cause.id !== id));
    };

    const handleAddInjuredPerson = () => {
        const newPerson: InjuredPerson = {
            id: Date.now().toString(),
            type: 'internal',
            name: '',
            age: '',
            company: '',
            role: '',
            bodyParts: {
                head: false,
                neck: false,
                arms: false,
                eyes: false,
                legs: false,
                skin: false,
                mouth: false,
                ears: false,
            },
            attachments: [],
        };
        setInjuredPersons([...injuredPersons, newPerson]);
    };

    const updateInjuredPerson = (id: string, field: string, value: any) => {
        setInjuredPersons(injuredPersons.map(person =>
            person.id === id ? { ...person, [field]: value } : person
        ));
    };

    const updateInjuredPersonBodyPart = (id: string, part: keyof InjuredPerson['bodyParts']) => {
        setInjuredPersons(injuredPersons.map(person => {
            if (person.id === id) {
                return {
                    ...person,
                    bodyParts: {
                        ...person.bodyParts,
                        [part]: !person.bodyParts[part]
                    }
                };
            }
            return person;
        }));
    };

    const handleInjuredPersonFileChange = (id: string, files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files);
            setInjuredPersons(injuredPersons.map(person =>
                person.id === id ? { ...person, attachments: [...person.attachments, ...newFiles] } : person
            ));
        }
    };

    const handleAddCorrectiveAction = () => {
        const newAction: CorrectiveAction = {
            id: Date.now().toString(),
            action: '',
            responsiblePerson: '',
            targetDate: '',
            description: '',
        };
        setCorrectiveActions([...correctiveActions, newAction]);
    };

    const handleAddPreventiveAction = () => {
        const newAction: PreventiveAction = {
            id: Date.now().toString(),
            action: '',
            responsiblePerson: '',
            targetDate: '',
            description: '',
        };
        setPreventiveActions([...preventiveActions, newAction]);
    };

    // Memoized handlers for textarea inputs to prevent focus loss
    const handleInvestigationDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInvestigationDescription(e.target.value);
    }, []);

    const handleRootCauseDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRootCauseDescription(e.target.value);
    }, []);

    const handleCorrectiveActionDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCorrectiveActionDescription(e.target.value);
    }, []);

    const handlePreventiveActionDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPreventiveActionDescription(e.target.value);
    }, []);

    const handleFinalClosureCorrectiveDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFinalClosureCorrectiveDescription(e.target.value);
    }, []);

    const handleFinalClosurePreventiveDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFinalClosurePreventiveDescription(e.target.value);
    }, []);

    const handleNext = async () => {
        try {
            setLoading(true);

            // If moving from Report step (step 1), save incident_over_time
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

            // Move to next step
            if (currentStep < 4) {
                setCurrentStep(currentStep + 1);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        } finally {
            setLoading(false);
        }
    }; const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const handleSaveAsDraft = () => {
        console.log('Saving as draft...');
    };

    const handleSubmit = async () => {
        console.log('Submitting...');
        try {
            if (currentStep === 2) {
                // Submit investigation details
                setLoading(true);

                if (!id) {
                    alert('Incident ID not found');
                    return;
                }

                let baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';

                if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                    baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                }

                // Prepare investigator details - properly handle internal vs external
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

                // Prepare incident investigations (sub-standard conditions and acts)
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

                // Prepare root causes
                const inc_root_causes = [];
                if (selectedRootCause && rootCauseDescription) {
                    inc_root_causes.push({
                        rca_category_id: parseInt(selectedRootCause),
                        description: rootCauseDescription
                    });
                }

                // Prepare property damages
                const property_damages = [];
                if (hasPropertyDamage && selectedPropertyDamage) {
                    property_damages.push({
                        property_type_id: parseInt(selectedPropertyDamage)
                    });
                }

                // Prepare injuries
                const injuries = [];
                if (hasInjury && injuredPersonName) {
                    injuries.push({
                        injury_type: injuryType,
                        injury_number: injuryNumber,
                        who_got_injured_id: injuredUserType === 'internal' && investigators[0]?.id
                            ? parseInt(investigators[0].id)
                            : null,
                        name: injuredPersonName,
                        mobile: injuredPersonMobile,
                        age: parseInt(injuredPersonAge) || 0,
                        company_name: injuredPersonCompany,
                        role: injuredPersonRole,
                        injured_user_type: injuredUserType,
                        types: injuryTypes,
                        injury_types: injuryType
                    });
                }

                const payload: any = {
                    incident_id: parseInt(id),
                    investigator_details
                };

                // Add optional fields only if they have data
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

                alert('Investigation details submitted successfully!');
                setShowInvestigateDetails(true);

            } else if (currentStep === 3) {
                // Submit provisional closure
                setLoading(true);
                let baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';

                if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                    baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                }

                // Prepare corrective actions
                const corrective_fields = [];
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

                // Prepare preventive actions
                const preventive_fields = [];
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

                console.log('Sending provisional closure payload:', payload);

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

                // Move to final closure
                setCurrentStep(4);
            } else if (currentStep === 4) {
                // Final submission
                alert('Incident closed successfully!');
            }
        } catch (error) {
            console.error('Error submitting:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Progress Stepper Component
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

    // Report Step Component
    const ReportStep = () => {
        if (loading) {
            return (
                <div className="p-4 flex items-center justify-center">
                    <div className="text-gray-600">Loading incident details...</div>
                </div>
            );
        }

        if (error || !incident) {
            return (
                <div className="p-4 flex items-center justify-center">
                    <div className="text-red-600">{error || 'Incident not found'}</div>
                </div>
            );
        }

        return (
            <div className="p-4 space-y-4">
                {/* Select Incident Over Time */}
                <div className="shadow-sm rounded-md p-3 flex items-center gap-3">
                    <span className="text-sm font-medium whitespace-nowrap">Select Incident Over Time</span>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="HH:MM"
                                value={incidentOverTime ? dayjs(incidentOverTime, "HH:mm") : null}
                                onChange={(newValue) => {
                                    if (newValue && dayjs.isDayjs(newValue)) {
                                        setIncidentOverTime(newValue.format("HH:mm"));
                                    }
                                }}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        sx: { backgroundColor: 'white', borderRadius: 1 }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <Clock className="w-5 h-5 text-gray-600" />
                </div>

                <div className="bg-white shadow-md rounded-md p-6">
                    <h3 className="text-lg font-semibold text-[#BF213E] mb-4">Report</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-2">Reported By</label>
                            <div className="border border-gray-300 rounded-md p-2">{incident.created_by || '-'}</div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-2">Occurred On</label>
                            <div className="border border-gray-300 rounded-md p-2">
                                {incident.inc_time ? new Date(incident.inc_time).toLocaleString() : '-'}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-2">Reported On</label>
                            <div className="border border-gray-300 rounded-md p-2">
                                {incident.created_at ? new Date(incident.created_at).toLocaleString() : '-'}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-2">Incident Level</label>
                            <div className="border border-gray-300 rounded-md p-2">{incident.inc_level_name || '-'}</div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-2">Support Required</label>
                            <div className="border border-gray-300 rounded-md p-2">{incident.support_required ? 'Yes' : 'No'}</div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-2">Current Status</label>
                            <div className="border border-gray-300 rounded-md p-2">{incident.current_status || '-'}</div>
                        </div>
                    </div>
                </div>

                {/* Primary Category */}
                <div className="bg-white shadow-md rounded-md p-6 mt-4">
                    <h3 className="text-lg font-semibold text-[#BF213E] mb-4">Primary Category</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {incident.category_name && (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">Category</label>
                                <div className="border border-gray-300 rounded-md p-2">{incident.category_name}</div>
                            </div>
                        )}
                        {incident.sub_category_name && (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">Sub-Category</label>
                                <div className="border border-gray-300 rounded-md p-2">{incident.sub_category_name}</div>
                            </div>
                        )}
                        {incident.sub_sub_category_name && (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">Sub-Sub-Category</label>
                                <div className="border border-gray-300 rounded-md p-2">{incident.sub_sub_category_name}</div>
                            </div>
                        )}
                        {incident.sub_sub_sub_category_name && (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">Sub-Sub-Sub-Category</label>
                                <div className="border border-gray-300 rounded-md p-2">{incident.sub_sub_sub_category_name}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secondary Category (if exists) */}
                {incident.sec_category_name && (
                    <div className="bg-white shadow-md rounded-md p-6 mt-4">
                        <h3 className="text-lg font-semibold text-[#BF213E] mb-4">Secondary Category</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">Category</label>
                                <div className="border border-gray-300 rounded-md p-2">{incident.sec_category_name}</div>
                            </div>
                            {incident.sec_sub_category_name && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-2">Sub-Category</label>
                                    <div className="border border-gray-300 rounded-md p-2">{incident.sec_sub_category_name}</div>
                                </div>
                            )}
                            {incident.sec_sub_sub_category_name && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-2">Sub-Sub-Category</label>
                                    <div className="border border-gray-300 rounded-md p-2">{incident.sec_sub_sub_category_name}</div>
                                </div>
                            )}
                            {incident.sec_sub_sub_sub_category_name && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-2">Sub-Sub-Sub-Category</label>
                                    <div className="border border-gray-300 rounded-md p-2">{incident.sec_sub_sub_sub_category_name}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="bg-white shadow-md rounded-md p-6 mt-4">
                    <h3 className="text-lg font-semibold text-[#BF213E] mb-4">Description</h3>
                    <div className="border border-gray-300 rounded-md p-4">{incident.description || '-'}</div>
                </div>

                {/* Attachments */}
                {incident.attachments && incident.attachments.length > 0 && (
                    <div className="bg-white shadow-md rounded-md p-6 mt-4">
                        <h3 className="text-lg font-semibold text-[#BF213E] mb-4">Attachments</h3>
                        <div className="flex gap-4 flex-wrap">
                            {incident.attachments.map((att) => (
                                <div key={att.id} className="w-20 h-20 bg-gray-200 rounded overflow-hidden">
                                    <img src={att.url} alt={`Attachment ${att.id}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Location Details */}
                <div className="bg-white shadow-md rounded-md p-6 mt-4">
                    <h3 className="text-lg font-semibold text-[#BF213E] mb-4">Location Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {incident.site_name && (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">Site</label>
                                <div className="border border-gray-300 rounded-md p-2">{incident.site_name}</div>
                            </div>
                        )}
                        {incident.building_name && (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">Building</label>
                                <div className="border border-gray-300 rounded-md p-2">{incident.building_name}</div>
                            </div>
                        )}
                        {incident.tower_name && (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">Tower</label>
                                <div className="border border-gray-300 rounded-md p-2">{incident.tower_name}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Investigate Step Component
    const InvestigateStep = () => {
        // Sample filled data for display
        const hasFilledData = investigators.length > 0 || showInvestigateDetails;

        if (hasFilledData) {
            return <InvestigateStepSummary />;
        }

        return <InvestigateStepForm />;
    };

    // Summary View (Images 9-10)
    const InvestigateStepSummary = () => (
        <div className="p-4 space-y-4">
            {/* Time and Duration */}
            <div className="flex items-center justify-between  p-3 rounded">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Occurred Time</span>
                    <span className="font-medium text-sm">09:26 AM</span>
                </div>
                <div className="text-sm">
                    <span className="text-red-500 font-medium">Total Duration</span>
                    <span className="ml-2">18 Hrs. 24 Min.</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Incident Over Time</span>
                    <span className="font-medium text-sm">09:26 AM</span>
                </div>
            </div>

            {/* Investigators */}
            <div className=" p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                        {investigators.length > 0 ? (
                            <>
                                {investigators.slice(0, 2).map(inv => inv.name).join(', ')}
                                {investigators.length > 2 && ` +${investigators.length - 2} other${investigators.length > 3 ? 's' : ''}`}
                            </>
                        ) : (
                            'No investigators added yet'
                        )}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-[#BF213E] text-[#BF213E]"
                        onClick={() => setShowInvestigatorForm(true)}
                    >
                        + Investigator
                    </Button>
                </div>
            </div>

            {/* Inline Investigator Form */}
            {showInvestigatorForm && (
                <InvestigatorRepeater
                    internalUsers={internalUsers}
                    onInvestigatorsChange={(data) => {
                        // Convert InvestigatorData[] to Investigator[]
                        const newInvestigators = data.map((inv, idx) => {
                            if (inv.type === 'internal' && inv.internal) {
                                return {
                                    id: inv.internal.userId || Date.now().toString() + idx,
                                    name: inv.internal.name,
                                    email: inv.internal.email,
                                    role: inv.internal.role,
                                    contactNo: inv.internal.contactNo,
                                    type: 'internal' as const,
                                };
                            } else if (inv.type === 'external' && inv.external) {
                                return {
                                    id: Date.now().toString() + idx,
                                    name: inv.external.name,
                                    email: inv.external.email,
                                    role: inv.external.role,
                                    contactNo: inv.external.contactNo,
                                    type: 'external' as const,
                                };
                            }
                            return null;
                        }).filter(Boolean) as Investigator[];

                        setInvestigators([...investigators, ...newInvestigators]);
                    }}
                />
            )}

            {/* Investigate Section */}
            <div className="rounded">
                <div className="flex items-center justify-between p-3 border-b border-gray-300">
                    <h3 className="font-semibold">Investigate</h3>
                    <Button variant="ghost" size="sm" className="text-xs bg-gray-800 text-white hover:bg-gray-700 h-7">
                        Open
                    </Button>
                </div>

                <div className="p-3 space-y-4">
                    {/* Substandard Condition */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Substandard Condition</div>
                        <FormControl fullWidth size="small">
                            <MuiSelect
                                value={subStandardConditionId}
                                onChange={(e) => setSubStandardConditionId(e.target.value)}
                                displayEmpty
                                sx={{ backgroundColor: 'white' }}
                            >
                                <MenuItem value="" disabled>
                                    <span className="text-gray-400">Select condition...</span>
                                </MenuItem>
                                {substandardConditionCategories.length > 0 ? (
                                    substandardConditionCategories.map((category) => (
                                        <MenuItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="no-data" disabled>
                                        No conditions available
                                    </MenuItem>
                                )}
                            </MuiSelect>
                        </FormControl>
                    </div>

                    {/* Substandard Act */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Substandard Act</div>
                        <FormControl fullWidth size="small">
                            <MuiSelect
                                value={subStandardActId}
                                onChange={(e) => setSubStandardActId(e.target.value)}
                                displayEmpty
                                sx={{ backgroundColor: 'white' }}
                            >
                                <MenuItem value="" disabled>
                                    <span className="text-gray-400">Select act...</span>
                                </MenuItem>
                                {substandardActCategories.length > 0 ? (
                                    substandardActCategories.map((category) => (
                                        <MenuItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="no-data" disabled>
                                        No acts available
                                    </MenuItem>
                                )}
                            </MuiSelect>
                        </FormControl>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Description</div>
                        <div className="relative">
                            <Textarea
                                value={investigationDescription}
                                onChange={handleInvestigationDescriptionChange}
                                placeholder="Give a brief description of the issue..."
                                className="bg-white min-h-[80px] pr-10"
                            />

                        </div>
                    </div>

                    {/* Add Condition Button */}
                    <Button
                        variant="outline"
                        className="w-full border-gray-800 text-gray-800 bg-white"
                    >
                        + Add Condition
                    </Button>

                    {/* Root Cause */}
                    <div className="space-y-2 border-t border-gray-300 pt-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Root Cause:</span>

                        </div>
                        <div className="space-y-3">
                            <FormControl fullWidth size="small">
                                <InputLabel>Select root cause</InputLabel>
                                <MuiSelect
                                    value={selectedRootCause}
                                    onChange={(e) => setSelectedRootCause(e.target.value)}
                                    label="Select root cause"
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    {rcaCategories.length > 0 ? (
                                        rcaCategories.map((category) => (
                                            <MenuItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="no-data" disabled>
                                            No root causes available
                                        </MenuItem>
                                    )}
                                </MuiSelect>
                            </FormControl>
                        </div>
                    </div>

                    {/* Description for Root Cause */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Description:</span>

                        </div>
                        <div className="bg-white p-3 rounded text-sm">
                            <Textarea
                                value={rootCauseDescription}
                                onChange={handleRootCauseDescriptionChange}
                                placeholder="Give a brief description of the issue..."
                                className="bg-white min-h-[80px]"
                            />
                        </div>
                    </div>

                    {/* Injury Section */}
                    <div className="border-t border-gray-300 pt-3">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold">Injury</span>
                            <Switch checked={hasInjury} onCheckedChange={setHasInjury} />
                        </div>

                        {hasInjury && (
                            <div className="space-y-4">
                                {injuredPersons.map((person, index) => (
                                    <div key={person.id} className="p-4 rounded-lg border border-gray-200 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold">Person #{index + 1}</h4>
                                            {injuredPersons.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setInjuredPersons(injuredPersons.filter(p => p.id !== person.id))}
                                                    className="h-6 text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <Tabs
                                            value={person.type}
                                            onValueChange={(value) => updateInjuredPerson(person.id, 'type', value)}
                                            className="w-full"
                                        >
                                            <TabsList className="grid w-full grid-cols-2 bg-transparent">
                                                <TabsTrigger
                                                    value="internal"
                                                    className="data-[state=active]:bg-[#D4A574] data-[state=inactive]:bg-white"
                                                >
                                                    Internal
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="external"
                                                    className="data-[state=active]:bg-[#D4A574] data-[state=inactive]:bg-white"
                                                >
                                                    External
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="internal" className="space-y-3 mt-4">
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Enter Name"
                                                    value={person.name}
                                                    onChange={(e) => updateInjuredPerson(person.id, 'name', e.target.value)}
                                                    sx={{ backgroundColor: 'white' }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Enter Age"
                                                    value={person.age}
                                                    onChange={(e) => updateInjuredPerson(person.id, 'age', e.target.value)}
                                                    sx={{ backgroundColor: 'white' }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Enter Role"
                                                    value={person.role}
                                                    onChange={(e) => updateInjuredPerson(person.id, 'role', e.target.value)}
                                                    sx={{ backgroundColor: 'white' }}
                                                />

                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium">Body Parts:</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {[
                                                            { key: 'head', label: 'Head' },
                                                            { key: 'neck', label: 'Neck' },
                                                            { key: 'legs', label: 'Legs' },
                                                            { key: 'skin', label: 'Skin' },
                                                            { key: 'arms', label: 'Arms' },
                                                            { key: 'mouth', label: 'Mouth' },
                                                            { key: 'eyes', label: 'Eyes' },
                                                            { key: 'ears', label: 'Ears' },
                                                        ].map(({ key, label }) => (
                                                            <label key={key} className="flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4"
                                                                    checked={person.bodyParts[key as keyof InjuredPerson['bodyParts']]}
                                                                    onChange={() => updateInjuredPersonBodyPart(person.id, key as keyof InjuredPerson['bodyParts'])}
                                                                />
                                                                <span>{label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium">Attachment:</div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="file"
                                                            id={`injury-attachment-internal-${person.id}`}
                                                            className="hidden"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={(e) => handleInjuredPersonFileChange(person.id, e.target.files)}
                                                        />
                                                        <label
                                                            htmlFor={`injury-attachment-internal-${person.id}`}
                                                            className="w-16 h-16 bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400"
                                                        >
                                                            <Plus className="w-6 h-6 text-gray-400" />
                                                        </label>
                                                        {person.attachments.map((file, idx) => (
                                                            <div key={idx} className="w-16 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                                                                <span className="text-xs truncate px-1">{file.name.substring(0, 8)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="external" className="space-y-3 mt-4">
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Enter Name"
                                                    value={person.name}
                                                    onChange={(e) => updateInjuredPerson(person.id, 'name', e.target.value)}
                                                    sx={{ backgroundColor: 'white' }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Enter Age"
                                                    value={person.age}
                                                    onChange={(e) => updateInjuredPerson(person.id, 'age', e.target.value)}
                                                    sx={{ backgroundColor: 'white' }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Enter Company"
                                                    value={person.company || ''}
                                                    onChange={(e) => updateInjuredPerson(person.id, 'company', e.target.value)}
                                                    sx={{ backgroundColor: 'white' }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Enter Role"
                                                    value={person.role}
                                                    onChange={(e) => updateInjuredPerson(person.id, 'role', e.target.value)}
                                                    sx={{ backgroundColor: 'white' }}
                                                />

                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium">Body Parts:</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {[
                                                            { key: 'head', label: 'Head' },
                                                            { key: 'neck', label: 'Neck' },
                                                            { key: 'legs', label: 'Legs' },
                                                            { key: 'skin', label: 'Skin' },
                                                            { key: 'arms', label: 'Arms' },
                                                            { key: 'mouth', label: 'Mouth' },
                                                            { key: 'eyes', label: 'Eyes' },
                                                            { key: 'ears', label: 'Ears' },
                                                        ].map(({ key, label }) => (
                                                            <label key={key} className="flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4"
                                                                    checked={person.bodyParts[key as keyof InjuredPerson['bodyParts']]}
                                                                    onChange={() => updateInjuredPersonBodyPart(person.id, key as keyof InjuredPerson['bodyParts'])}
                                                                />
                                                                <span>{label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium">Attachment:</div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="file"
                                                            id={`injury-attachment-external-${person.id}`}
                                                            className="hidden"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={(e) => handleInjuredPersonFileChange(person.id, e.target.files)}
                                                        />
                                                        <label
                                                            htmlFor={`injury-attachment-external-${person.id}`}
                                                            className="w-16 h-16 bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400"
                                                        >
                                                            <Plus className="w-6 h-6 text-gray-400" />
                                                        </label>
                                                        {person.attachments.map((file, idx) => (
                                                            <div key={idx} className="w-16 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                                                                <span className="text-xs truncate px-1">{file.name.substring(0, 8)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    className="w-full border-gray-800 text-gray-800"
                                    onClick={handleAddInjuredPerson}
                                >
                                    + Add Person
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Property Damage Section */}
                    <div className="border-t border-gray-300 pt-3">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold">Property Damage</span>

                        </div>

                        <div className="bg-white p-3 rounded space-y-3">
                            <div>
                                <div className="text-sm text-gray-600 mb-2">Property Type :</div>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Select Property Type</InputLabel>
                                    <MuiSelect
                                        value={selectedPropertyDamage}
                                        onChange={(e) => setSelectedPropertyDamage(e.target.value)}
                                        label="Select Property Type"
                                        sx={{ backgroundColor: 'white' }}
                                    >
                                        {propertyDamageCategories.length > 0 ? (
                                            propertyDamageCategories.map((category) => (
                                                <MenuItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="no-data" disabled>
                                                No property types available
                                            </MenuItem>
                                        )}
                                    </MuiSelect>
                                </FormControl>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600">Attachment:</span>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="file"
                                        id="property-damage-attachment"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                    />
                                    <label
                                        htmlFor="property-damage-attachment"
                                        className="w-16 h-16 bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400"
                                    >
                                        <Plus className="w-6 h-6 text-gray-400" />
                                    </label>
                                    <label
                                        htmlFor="property-damage-attachment"
                                        className="w-16 h-16 bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400"
                                    >
                                        <Plus className="w-6 h-6 text-gray-400" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Form View (Original)
    const InvestigateStepForm = () => (
        <div className="p-4 space-y-4">
            {/* Time and Duration */}
            <div className="flex items-center justify-between  p-3 rounded">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Occurred Time</span>
                    <span className="font-medium text-sm">09:26 AM</span>
                </div>
                <div className="text-sm">
                    <span className="text-red-500 font-medium">Total Duration</span>
                    <span className="ml-2">18 Hrs. 24 Min.</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Incident Over Time</span>
                    <span className="font-medium text-sm">09:26 AM</span>
                </div>
            </div>

            {/* Add Investigator */}
            <div className="flex items-center gap-2">
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter investigator name..."
                    onClick={() => setShowInvestigatorForm(true)}
                    InputProps={{ readOnly: true }}
                    sx={{ backgroundColor: 'white', flex: 1 }}
                />
                <Button
                    variant="outline"
                    className="border-[#BF213E] text-[#BF213E]"
                    onClick={() => setShowInvestigatorForm(true)}
                >
                    + Investigator
                </Button>
            </div>

            {/* Inline Investigator Form */}
            {showInvestigatorForm && (
                <InvestigatorRepeater
                    internalUsers={internalUsers}
                    onInvestigatorsChange={(data) => {
                        // Convert InvestigatorData[] to Investigator[]
                        const newInvestigators = data.map((inv, idx) => {
                            if (inv.type === 'internal' && inv.internal) {
                                return {
                                    id: inv.internal.userId || Date.now().toString() + idx,
                                    name: inv.internal.name,
                                    email: inv.internal.email,
                                    role: inv.internal.role,
                                    contactNo: inv.internal.contactNo,
                                    type: 'internal' as const,
                                };
                            } else if (inv.type === 'external' && inv.external) {
                                return {
                                    id: Date.now().toString() + idx,
                                    name: inv.external.name,
                                    email: inv.external.email,
                                    role: inv.external.role,
                                    contactNo: inv.external.contactNo,
                                    type: 'external' as const,
                                };
                            }
                            return null;
                        }).filter(Boolean) as Investigator[];

                        setInvestigators([...investigators, ...newInvestigators]);
                    }}
                />
            )}

            {/* Quick action for demo */}
            {investigators.length === 0 && !showInvestigatorForm && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={handleAddSampleInvestigators}
                >
                    Add Sample Investigators (Demo)
                </Button>
            )}

            {/* Investigators List */}
            {investigators.length > 0 && (
                <div className=" p-3 rounded">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                            {investigators.map(inv => inv.name).join(', ')}
                            {investigators.length > 2 && ` +${investigators.length - 2} other`}
                        </span>
                        <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
                            + Investigator
                        </Button>
                    </div>
                </div>
            )}

            {/* Investigate Section */}
            <div className=" rounded">
                <div className="flex items-center justify-between p-3 border-b border-gray-300">
                    <h3 className="font-semibold">Investigate</h3>
                    <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">WIP</span>
                </div>

                <div className="p-3 space-y-4">
                    {/* Conditions */}
                    {conditions.map((condition, idx) => (
                        <div key={condition.id} className="space-y-2">
                            <FormControl fullWidth size="small">
                                <InputLabel>Select condition</InputLabel>
                                <MuiSelect
                                    value=""
                                    onChange={(e) => { }}
                                    label="Select condition"
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    <MenuItem value="exposed-wires">Exposed live electrical wires near a control panel.</MenuItem>
                                    <MenuItem value="other">Other conditions...</MenuItem>
                                </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Select act</InputLabel>
                                <MuiSelect
                                    value=""
                                    onChange={(e) => { }}
                                    label="Select act"
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    <MenuItem value="no-isolation">Started maintenance without isolating the power...</MenuItem>
                                    <MenuItem value="other">Other acts...</MenuItem>
                                </MuiSelect>
                            </FormControl>

                            <Textarea
                                value={condition.description}
                                onChange={(e) =>
                                    setConditions(prev =>
                                        prev.map((item, i) =>
                                            i === idx ? { ...item, description: e.target.value } : item
                                        )
                                    )
                                }
                                placeholder="Give a brief description of the issue..."
                                className="bg-white min-h-[80px]"
                            />

                            {idx === 0 && (
                                <Button
                                    variant="outline"
                                    className="w-full border-[#BF213E] text-[#BF213E]"
                                    onClick={handleAddCondition}
                                >
                                    + Add Condition
                                </Button>
                            )}
                        </div>
                    ))}

                    {conditions.length === 0 && (
                        <div className="space-y-2">
                            <div className="text-sm text-gray-500 mb-2">Substandard Condition</div>
                            <FormControl fullWidth size="small">
                                <InputLabel>Select condition</InputLabel>
                                <MuiSelect
                                    value={subStandardConditionId}
                                    onChange={(e) => setSubStandardConditionId(e.target.value)}
                                    label="Select condition"
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    {substandardConditionCategories.length > 0 ? (
                                        substandardConditionCategories.map((category) => (
                                            <MenuItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="no-data" disabled>
                                            No conditions available
                                        </MenuItem>
                                    )}
                                </MuiSelect>
                            </FormControl>

                            <div className="text-sm text-gray-500 mb-2 mt-3">Substandard Act</div>
                            <FormControl fullWidth size="small">
                                <InputLabel>Select act</InputLabel>
                                <MuiSelect
                                    value={subStandardActId}
                                    onChange={(e) => setSubStandardActId(e.target.value)}
                                    label="Select act"
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    {substandardActCategories.length > 0 ? (
                                        substandardActCategories.map((category) => (
                                            <MenuItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="no-data" disabled>
                                            No acts available
                                        </MenuItem>
                                    )}
                                </MuiSelect>
                            </FormControl>

                            <div className="text-sm text-gray-500 mb-2 mt-3">Description</div>
                            <div className="relative">
                                <Textarea
                                    value={investigationDescription}
                                    onChange={handleInvestigationDescriptionChange}
                                    placeholder="Give a brief description of the issue..."
                                    className="bg-white min-h-[80px]"
                                />
                                <button className="absolute right-3 bottom-3">

                                </button>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full border-[#BF213E] text-[#BF213E] mt-2"
                                onClick={handleAddCondition}
                            >
                                + Add Condition
                            </Button>
                        </div>
                    )}

                    {/* Root Cause */}
                    <div className="mt-4">
                        <div className="text-sm font-semibold mb-2">Root Cause:</div>

                        <div className="space-y-4">
                            {rootCauses.map((rootCause, index) => (
                                <div key={rootCause.id} className="p-4 rounded-lg border border-gray-200 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold">Root Cause #{index + 1}</h4>
                                        {rootCauses.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeRootCause(rootCause.id)}
                                                className="h-6 text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <FormControl fullWidth size="small">
                                        <InputLabel>Select root cause</InputLabel>
                                        <MuiSelect
                                            value={rootCause.causeId}
                                            onChange={(e) => updateRootCause(rootCause.id, 'causeId', e.target.value)}
                                            label="Select root cause"
                                            sx={{ backgroundColor: 'white' }}
                                        >
                                            {rcaCategories.length > 0 ? (
                                                rcaCategories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="no-data" disabled>
                                                    No root causes available
                                                </MenuItem>
                                            )}
                                        </MuiSelect>
                                    </FormControl>

                                    <div>
                                        <div className="text-sm text-gray-500 mb-2">Description</div>
                                        <div className="relative">
                                            <Textarea
                                                value={rootCause.description}
                                                onChange={(e) => updateRootCause(rootCause.id, 'description', e.target.value)}
                                                placeholder="Give a brief description of the issue..."
                                                className="bg-white min-h-[80px]"
                                            />
                                            <button className="absolute right-3 bottom-3">

                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                className="w-full border-[#BF213E] text-[#BF213E]"
                                onClick={handleAddRootCause}
                            >
                                + Add Cause
                            </Button>
                        </div>
                    </div>

                    {/* Injury Toggle */}
                    <div className="flex items-center justify-between py-3 border-t border-gray-300">
                        <span className="font-medium">Injury</span>
                        <Switch checked={hasInjury} onCheckedChange={setHasInjury} />
                    </div>

                    {/* Injury Form */}
                    {hasInjury && (
                        <div className="space-y-4">
                            {injuredPersons.map((person, index) => (
                                <div key={person.id} className="p-4 rounded-lg border border-gray-200 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold">Person #{index + 1}</h4>
                                        {injuredPersons.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setInjuredPersons(injuredPersons.filter(p => p.id !== person.id))}
                                                className="h-6 text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <Tabs
                                        value={person.type}
                                        onValueChange={(value) => updateInjuredPerson(person.id, 'type', value)}
                                    >
                                        <TabsList className="grid w-full grid-cols-2 bg-white">
                                            <TabsTrigger value="internal" className="data-[state=active]:bg-[#F5E6D3]">
                                                Internal
                                            </TabsTrigger>
                                            <TabsTrigger value="external" className="data-[state=active]:bg-[#F5E6D3]">
                                                External
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="internal" className="space-y-3 mt-3">
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Name"
                                                value={person.name}
                                                onChange={(e) => updateInjuredPerson(person.id, 'name', e.target.value)}
                                                sx={{ backgroundColor: 'white' }}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Age"
                                                value={person.age}
                                                onChange={(e) => updateInjuredPerson(person.id, 'age', e.target.value)}
                                                sx={{ backgroundColor: 'white' }}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Role"
                                                value={person.role}
                                                onChange={(e) => updateInjuredPerson(person.id, 'role', e.target.value)}
                                                sx={{ backgroundColor: 'white' }}
                                            />

                                            {/* Body Parts */}
                                            <div>
                                                <div className="text-sm font-medium mb-2">Body Parts:</div>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[
                                                        { key: 'head', label: 'Head' },
                                                        { key: 'neck', label: 'Neck' },
                                                        { key: 'arms', label: 'Arms' },
                                                        { key: 'eyes', label: 'Eyes' },
                                                        { key: 'legs', label: 'Legs' },
                                                        { key: 'skin', label: 'Skin' },
                                                        { key: 'mouth', label: 'Mouth' },
                                                        { key: 'ears', label: 'Ears' },
                                                    ].map(({ key, label }) => (
                                                        <label key={key} className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded"
                                                                checked={person.bodyParts[key as keyof InjuredPerson['bodyParts']]}
                                                                onChange={() => updateInjuredPersonBodyPart(person.id, key as keyof InjuredPerson['bodyParts'])}
                                                            />
                                                            <span>{label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Attachments */}
                                            <div>
                                                <div className="text-sm font-medium mb-2">Attachment:</div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="file"
                                                        id={`injury-attachment-internal-${person.id}`}
                                                        className="hidden"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => handleInjuredPersonFileChange(person.id, e.target.files)}
                                                    />
                                                    <label
                                                        htmlFor={`injury-attachment-internal-${person.id}`}
                                                        className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400"
                                                    >
                                                        <Plus className="w-6 h-6 text-gray-400" />
                                                    </label>
                                                    {person.attachments.map((file, idx) => (
                                                        <div key={idx} className="w-12 h-12 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                                                            <span className="text-xs truncate px-1">{file.name.substring(0, 6)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="external" className="space-y-3 mt-3">
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Name"
                                                value={person.name}
                                                onChange={(e) => updateInjuredPerson(person.id, 'name', e.target.value)}
                                                sx={{ backgroundColor: 'white' }}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Age"
                                                value={person.age}
                                                onChange={(e) => updateInjuredPerson(person.id, 'age', e.target.value)}
                                                sx={{ backgroundColor: 'white' }}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Company"
                                                value={person.company || ''}
                                                onChange={(e) => updateInjuredPerson(person.id, 'company', e.target.value)}
                                                sx={{ backgroundColor: 'white' }}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Role"
                                                value={person.role}
                                                onChange={(e) => updateInjuredPerson(person.id, 'role', e.target.value)}
                                                sx={{ backgroundColor: 'white' }}
                                            />

                                            {/* Body Parts */}
                                            <div>
                                                <div className="text-sm font-medium mb-2">Body Parts:</div>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[
                                                        { key: 'head', label: 'Head' },
                                                        { key: 'neck', label: 'Neck' },
                                                        { key: 'arms', label: 'Arms' },
                                                        { key: 'eyes', label: 'Eyes' },
                                                        { key: 'legs', label: 'Legs' },
                                                        { key: 'skin', label: 'Skin' },
                                                        { key: 'mouth', label: 'Mouth' },
                                                        { key: 'ears', label: 'Ears' },
                                                    ].map(({ key, label }) => (
                                                        <label key={key} className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded"
                                                                checked={person.bodyParts[key as keyof InjuredPerson['bodyParts']]}
                                                                onChange={() => updateInjuredPersonBodyPart(person.id, key as keyof InjuredPerson['bodyParts'])}
                                                            />
                                                            <span>{label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Attachments */}
                                            <div>
                                                <div className="text-sm font-medium mb-2">Attachment:</div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="file"
                                                        id={`injury-attachment-external-${person.id}`}
                                                        className="hidden"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => handleInjuredPersonFileChange(person.id, e.target.files)}
                                                    />
                                                    <label
                                                        htmlFor={`injury-attachment-external-${person.id}`}
                                                        className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400"
                                                    >
                                                        <Plus className="w-6 h-6 text-gray-400" />
                                                    </label>
                                                    {person.attachments.map((file, idx) => (
                                                        <div key={idx} className="w-12 h-12 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                                                            <span className="text-xs truncate px-1">{file.name.substring(0, 6)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                className="w-full border-[#BF213E] text-[#BF213E]"
                                onClick={handleAddInjuredPerson}
                            >
                                + Add Person
                            </Button>
                        </div>
                    )}

                    {/* Property Damage Toggle */}
                    <div className="flex items-center justify-between py-3 border-t border-gray-300">
                        <span className="font-medium">Property Damage</span>
                        <Switch checked={hasPropertyDamage} onCheckedChange={setHasPropertyDamage} />
                    </div>

                    {/* Property Damage Form */}
                    {hasPropertyDamage && (
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm font-medium mb-2">Property type</div>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Select Property Type</InputLabel>
                                    <MuiSelect
                                        value={selectedPropertyDamage}
                                        onChange={(e) => setSelectedPropertyDamage(e.target.value)}
                                        label="Select Property Type"
                                        sx={{ backgroundColor: 'white' }}
                                    >
                                        {propertyDamageCategories.length > 0 ? (
                                            propertyDamageCategories.map((category) => (
                                                <MenuItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="no-data" disabled>
                                                No property types available
                                            </MenuItem>
                                        )}
                                    </MuiSelect>
                                </FormControl>
                            </div>

                            <div>
                                <div className="text-sm font-medium mb-2">Attachment:</div>
                                <div className="flex gap-2">
                                    <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-gray-400" />
                                    </button>
                                    <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Provisional Step Component (Step 3)
    const ProvisionalStep = () => {
        console.log('ProvisionalStep - Corrective Actions Categories:', correctiveActionsCategories);
        console.log('ProvisionalStep - Preventive Actions Categories:', preventiveActionsCategories);

        return (
            <div className="p-4 space-y-4">
                {/* Time and Duration */}
                <div className="flex items-center justify-between  p-3 rounded">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Occurred Time</span>
                        <span className="font-medium text-sm">09:26 AM</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-red-500 font-medium">Total Duration</span>
                        <span className="ml-2">18 Hrs. 24 Min.</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Incident Over Time</span>
                        <span className="font-medium text-sm">09:26 AM</span>
                    </div>
                </div>

                {/* Investigators */}
                <div className=" p-3 rounded">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                            Abdul Ghaffar, Kshitij Rasal, Aman +2
                        </span>
                        <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
                            + Investigator
                        </Button>
                    </div>
                </div>

                {/* Provisional Section */}
                <div className=" rounded">
                    <div className="flex items-center justify-between p-3 border-b border-gray-300">
                        <h3 className="font-semibold">Provisional</h3>
                        <Button variant="ghost" size="sm" className="text-xs bg-gray-800 text-white hover:bg-gray-700">
                            Open
                        </Button>
                    </div>

                    <div className="p-3 space-y-4">
                        {/* Corrective Actions */}
                        <div>
                            <h4 className="font-semibold text-sm mb-3">Corrective Actions:</h4>

                            {correctiveActions.length === 0 && (
                                <div className="space-y-3">
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Select corrective action</InputLabel>
                                        <MuiSelect
                                            value={selectedCorrectiveAction}
                                            onChange={(e) => setSelectedCorrectiveAction(e.target.value)}
                                            label="Select corrective action"
                                            sx={{ backgroundColor: 'white' }}
                                        >
                                            {correctiveActionsCategories.length > 0 ? (
                                                correctiveActionsCategories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="" disabled>
                                                    No corrective actions available
                                                </MenuItem>
                                            )}
                                        </MuiSelect>
                                    </FormControl>

                                    <FormControl fullWidth size="small">
                                        <InputLabel>Responsible Person</InputLabel>
                                        <MuiSelect
                                            value=""
                                            onChange={(e) => { }}
                                            label="Responsible Person"
                                            sx={{ backgroundColor: 'white' }}
                                        >
                                            <MenuItem value="person1">John Doe</MenuItem>
                                            <MenuItem value="person2">Jane Smith</MenuItem>
                                        </MuiSelect>
                                    </FormControl>

                                    <div className="flex items-center gap-2">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="date"
                                            defaultValue="2025-08-24"
                                            sx={{ backgroundColor: 'white', flex: 1 }}
                                        />
                                        <Button variant="ghost" size="icon">
                                            <span className="text-xl">📅</span>
                                        </Button>
                                    </div>

                                    <div className="text-sm text-gray-600 mb-1">Description:</div>
                                    <Textarea
                                        value={correctiveActionDescription}
                                        onChange={handleCorrectiveActionDescriptionChange}
                                        placeholder="This is how description will look like if the user has put description at the time of creation."
                                        className="bg-white min-h-[80px]"
                                    />

                                    <Button
                                        variant="outline"
                                        className="w-full border-[#BF213E] text-[#BF213E]"
                                        onClick={handleAddCorrectiveAction}
                                    >
                                        + Add Action
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Preventive Actions */}
                        <div className="border-t border-gray-300 pt-4">
                            <h4 className="font-semibold text-sm mb-3">Preventive Actions:</h4>

                            {preventiveActions.length === 0 && (
                                <div className="space-y-3">
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Select preventive action</InputLabel>
                                        <MuiSelect
                                            value={selectedPreventiveAction}
                                            onChange={(e) => setSelectedPreventiveAction(e.target.value)}
                                            label="Select preventive action"
                                            sx={{ backgroundColor: 'white' }}
                                        >
                                            {preventiveActionsCategories.length > 0 ? (
                                                preventiveActionsCategories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="" disabled>
                                                    No preventive actions available
                                                </MenuItem>
                                            )}
                                        </MuiSelect>
                                    </FormControl>

                                    <FormControl fullWidth size="small">
                                        <InputLabel>Responsible Person</InputLabel>
                                        <MuiSelect
                                            value=""
                                            onChange={(e) => { }}
                                            label="Responsible Person"
                                            sx={{ backgroundColor: 'white' }}
                                        >
                                            <MenuItem value="person1">John Doe</MenuItem>
                                            <MenuItem value="person2">Jane Smith</MenuItem>
                                        </MuiSelect>
                                    </FormControl>

                                    <div className="flex items-center gap-2">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="date"
                                            value={preventiveActionDate}
                                            onChange={(e) => setPreventiveActionDate(e.target.value)}
                                            sx={{ backgroundColor: 'white', flex: 1 }}
                                        />
                                        <Button variant="ghost" size="icon">
                                            <span className="text-xl">📅</span>
                                        </Button>
                                    </div>

                                    <div className="text-sm text-gray-600 mb-1">Description:</div>
                                    <Textarea
                                        value={preventiveActionDescription}
                                        onChange={handlePreventiveActionDescriptionChange}
                                        placeholder="This is how description will look like if the user has put description at the time of creation."
                                        className="bg-white min-h-[80px]"
                                    />

                                    <Button
                                        variant="outline"
                                        className="w-full border-[#BF213E] text-[#BF213E]"
                                        onClick={handleAddPreventiveAction}
                                    >
                                        + Add Action
                                    </Button>
                                </div>
                            )}
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
                                        <MenuItem value="person1">John Doe</MenuItem>
                                        <MenuItem value="person2">Jane Smith</MenuItem>
                                    </MuiSelect>
                                </FormControl>

                                <div className="flex items-center gap-2">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        value={nextReviewDate}
                                        onChange={(e) => setNextReviewDate(e.target.value)}
                                        defaultValue="2025-10-30"
                                        sx={{ backgroundColor: 'white', flex: 1 }}
                                    />
                                    <Button variant="ghost" size="icon">
                                        <span className="text-xl">📅</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Final Closure Step Component (Step 4)
    const FinalClosureStep = () => (
        <div className="p-4 space-y-4">
            {/* Time and Duration */}
            <div className="flex items-center justify-between  p-3 rounded">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Occurred Time</span>
                    <span className="font-medium text-sm">09:26 AM</span>
                </div>
                <div className="text-sm">
                    <span className="text-red-500 font-medium">Total Duration</span>
                    <span className="ml-2">18 Hrs. 24 Min.</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Incident Over Time</span>
                    <span className="font-medium text-sm">09:26 AM</span>
                </div>
            </div>

            {/* Investigators */}
            <div className=" p-3 rounded">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                        Abdul Ghaffar, Kshitij Rasal, Aman +2
                    </span>
                    <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
                        + Investigator
                    </Button>
                </div>
            </div>

            {/* Final Closure Section */}
            <div className="rounded">
                <div className="flex items-center justify-between p-3 border-b border-gray-300">
                    <h3 className="font-semibold">Final Closure</h3>
                    <Button variant="ghost" size="sm" className="text-xs bg-gray-800 text-white hover:bg-gray-700">
                        Open
                    </Button>
                </div>

                <div className="p-3 space-y-4">
                    {/* 1. Corrective Actions */}
                    <div>
                        <h4 className="font-semibold text-sm mb-3">1. Corrective Actions</h4>

                        <div className="bg-white p-3 rounded mb-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Insulate or replace exposed wiring immediately.</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ChevronLeft className="w-4 h-4 rotate-[-90deg]" />
                                </Button>
                            </div>

                            <FormControl fullWidth size="small">
                                <InputLabel>Responsible Person</InputLabel>
                                <MuiSelect
                                    value=""
                                    onChange={(e) => { }}
                                    label="Responsible Person"
                                    sx={{ backgroundColor: 'rgb(249, 250, 251)' }}
                                >
                                    <MenuItem value="person1">John Doe</MenuItem>
                                    <MenuItem value="person2">Jane Smith</MenuItem>
                                </MuiSelect>
                            </FormControl>

                            <div className="flex items-center gap-2">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    defaultValue="2025-08-24"
                                    sx={{ backgroundColor: 'rgb(249, 250, 251)', flex: 1 }}
                                />
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <span className="text-lg">📅</span>
                                </Button>
                            </div>

                            <div className="text-xs text-gray-600 mb-1">Description:</div>
                            <div className="bg-gray-50 p-2 rounded text-sm">
                                This is how description will look like if the user has put description at the time of creation.
                            </div>
                        </div>
                    </div>

                    {/* 2. Corrective Actions */}
                    <div>
                        <h4 className="font-semibold text-sm mb-3">2. Corrective Actions</h4>

                        <div className="space-y-3">
                            <FormControl fullWidth size="small">
                                <InputLabel>Shut down and tag faulty circuits</InputLabel>
                                <MuiSelect
                                    value=""
                                    onChange={(e) => { }}
                                    label="Shut down and tag faulty circuits"
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    <MenuItem value="shutdown">Shut down and tag faulty circuits.</MenuItem>
                                    <MenuItem value="other">Other actions...</MenuItem>
                                </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Responsible Person</InputLabel>
                                <MuiSelect
                                    value=""
                                    onChange={(e) => { }}
                                    label="Responsible Person"
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    <MenuItem value="person1">John Doe</MenuItem>
                                    <MenuItem value="person2">Jane Smith</MenuItem>
                                </MuiSelect>
                            </FormControl>

                            <div className="flex items-center gap-2">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    defaultValue="2025-08-24"
                                    sx={{ backgroundColor: 'white', flex: 1 }}
                                />
                                <Button variant="ghost" size="icon">
                                    <span className="text-xl">📅</span>
                                </Button>
                            </div>

                            <div className="text-sm text-gray-600 mb-1">Description:</div>
                            <Textarea
                                value={finalClosureCorrectiveDescription}
                                onChange={handleFinalClosureCorrectiveDescriptionChange}
                                placeholder="This is how description will look like if the user has put description at the time of creation."
                                className="bg-white min-h-[80px]"
                            />

                            <Button
                                variant="outline"
                                className="w-full border-[#BF213E] text-[#BF213E]"
                                onClick={handleAddCorrectiveAction}
                            >
                                + Add Action
                            </Button>
                        </div>
                    </div>

                    {/* Preventive Actions */}
                    <div className="border-t border-gray-300 pt-4">
                        <h4 className="font-semibold text-sm mb-3">Preventive Actions</h4>

                        <div className="space-y-3">
                            <FormControl fullWidth size="small">
                                <InputLabel>Select preventive action</InputLabel>
                                <MuiSelect
                                    value=""
                                    onChange={(e) => { }}
                                    label="Select preventive action"
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    <MenuItem value="loto">Implement and enforce LOTO procedure.</MenuItem>
                                    <MenuItem value="training">Conduct safety training.</MenuItem>
                                    <MenuItem value="other">Other actions...</MenuItem>
                                </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Responsible Person</InputLabel>
                                <MuiSelect
                                    value=""
                                    onChange={(e) => { }}
                                    label="Responsible Person"
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    <MenuItem value="person1">John Doe</MenuItem>
                                    <MenuItem value="person2">Jane Smith</MenuItem>
                                </MuiSelect>
                            </FormControl>

                            <div className="flex items-center gap-2">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    defaultValue="2025-08-24"
                                    sx={{ backgroundColor: 'white', flex: 1 }}
                                />
                                <Button variant="ghost" size="icon">
                                    <span className="text-xl">📅</span>
                                </Button>
                            </div>

                            <div className="text-sm text-gray-600 mb-1">Description:</div>
                            <Textarea
                                value={finalClosurePreventiveDescription}
                                onChange={handleFinalClosurePreventiveDescriptionChange}
                                placeholder="This is how description will look like if the user has put description at the time of creation."
                                className="bg-white min-h-[80px]"
                            />

                            <Button
                                variant="outline"
                                className="w-full border-[#BF213E] text-[#BF213E]"
                                onClick={handleAddPreventiveAction}
                            >
                                + Add Action
                            </Button>
                        </div>
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
                                    <MenuItem value="person1">John Doe</MenuItem>
                                    <MenuItem value="person2">Jane Smith</MenuItem>
                                </MuiSelect>
                            </FormControl>

                            <div className="flex items-center gap-2">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    value={nextReviewDate}
                                    onChange={(e) => setNextReviewDate(e.target.value)}
                                    defaultValue="2025-10-30"
                                    sx={{ backgroundColor: 'white', flex: 1 }}
                                />
                                <Button variant="ghost" size="icon">
                                    <span className="text-xl">📅</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
                <button onClick={handleBack}>
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold">Incident Details</h1>
            </div>

            {/* Progress Stepper */}
            <ProgressStepper />

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {currentStep === 1 && <ReportStep />}
                {currentStep === 2 && <InvestigateStep />}
                {currentStep === 3 && <ProvisionalStep />}
                {currentStep === 4 && <FinalClosureStep />}
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
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleSaveAsDraft}
                        >
                            Save as draft
                        </Button>
                        <Button
                            className="w-full bg-[#BF213E] text-white hover:bg-[#9d1a32]"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    </>
                )}

                {currentStep === 3 && (
                    <Button
                        className="w-full bg-[#BF213E] text-white hover:bg-[#9d1a32]"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                )}

                {currentStep === 4 && (
                    <Button
                        className="w-full bg-[#BF213E] text-white hover:bg-[#9d1a32]"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                )}
            </div>
        </div>
    );
};

export default IncidentNewDetails;
