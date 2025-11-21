import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    TextField,
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const fieldStyles = {
    height: {
        xs: 28,
        sm: 36,
        md: 45
    },
    '& .MuiInputBase-input, & .MuiSelect-select': {
        padding: {
            xs: '8px',
            sm: '10px',
            md: '12px'
        }
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: 'white',
        '& fieldset': {
            borderColor: '#e5e7eb',
        },
        '&:hover fieldset': {
            borderColor: '#9ca3af',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#C72030',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#6b7280',
        '&.Mui-focused': {
            color: '#C72030',
        },
    },
};

const menuProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            zIndex: 9999,
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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

export const EditPermitPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Loading states
    const [initialLoading, setInitialLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [permitData, setPermitData] = useState({
        // Requestor Details
        name: '',
        contactNumber: '',
        department: '',
        unit: '',
        site: '',

        // Basic Details
        permitFor: '',
        building: '',
        wing: '',
        area: '',
        floor: '',
        room: '',
        clientSpecific: 'Internal',
        copyTo: [] as string[],
        listOfEntity: [] as string[],

        // Permit Details
        permitType: '',
        permitDescription: '',
        activity: '',
        subActivity: '',
        categoryOfHazards: '',
        risks: '',
        vendor: '',
        comment: '',

        // Attachments
        attachments: null as File | null
    });

    // Existing attachments from server
    const [existingAttachments, setExistingAttachments] = useState<any[]>([]);

    // State for original permit data for ID mapping
    const [originalPermitData, setOriginalPermitData] = useState<any>(null);

    // State for user account loading
    const [loadingUserAccount, setLoadingUserAccount] = useState(false);

    // State for Copy To users data
    const [copyToUsers, setCopyToUsers] = useState<{ id: string; name: string }[]>([]);
    const [loadingCopyToUsers, setLoadingCopyToUsers] = useState(false);

    // State for Entity data
    const [entityOptions, setEntityOptions] = useState<{ id: string; name: string }[]>([]);
    const [loadingEntityOptions, setLoadingEntityOptions] = useState(false);

    // State for Permit Types data
    const [permitTypes, setPermitTypes] = useState<{ id: number; name: string }[]>([]);
    const [loadingPermitTypes, setLoadingPermitTypes] = useState(false);

    // State for Permit Activities data
    const [permitActivities, setPermitActivities] = useState<{ id: number; name: string; parent_id: number }[]>([]);
    const [loadingPermitActivities, setLoadingPermitActivities] = useState(false);

    // State for Permit Sub Activities data
    const [permitSubActivities, setPermitSubActivities] = useState<{ id: number; name: string; parent_id: number }[]>([]);
    const [loadingPermitSubActivities, setLoadingPermitSubActivities] = useState(false);

    // State for Permit Hazard Categories data
    const [permitHazardCategories, setPermitHazardCategories] = useState<{ id: number; name: string; parent_id: number }[]>([]);
    const [loadingPermitHazardCategories, setLoadingPermitHazardCategories] = useState(false);

    // State for Permit Risks data
    const [permitRisks, setPermitRisks] = useState<{ id: number; name: string; parent_id: number }[]>([]);
    const [loadingPermitRisks, setLoadingPermitRisks] = useState(false);

    // State for Suppliers/Vendors data
    const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    // State for buildings data
    const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
    const [loadingBuildings, setLoadingBuildings] = useState(false);

    // State for wings, areas, floors, rooms
    const [wings, setWings] = useState<{ id: number; name: string }[]>([]);
    const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
    const [floors, setFloors] = useState<{ id: number; name: string }[]>([]);
    const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);

    // Loading states
    const [loadingWings, setLoadingWings] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(false);
    const [loadingFloors, setLoadingFloors] = useState(false);
    const [loadingRooms, setLoadingRooms] = useState(false);

    const [activities, setActivities] = useState([
        {
            id: '', // To store existing permit detail ID for updates
            activity: '',
            subActivity: '',
            categoryOfHazards: '',
            selectedRisks: [] as string[],
            originalActivityName: '',
            originalSubActivityName: '',
            originalHazardCategoryName: ''
        }
    ]);

    // API helper functions
    const getFullUrl = (endpoint: string) => {
        let baseUrl = localStorage.getItem('baseUrl') || '';
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
        }
        return `${baseUrl}${endpoint}`;
    };

    const getAuthenticatedFetchOptions = (method: string, body?: any) => {
        const token = localStorage.getItem('token') || '';
        const options: RequestInit = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        return options;
    };

    // Handler for multi-select changes
    const handleMultiSelectChange = (field: string, value: string[]) => {
        setPermitData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleInputChange = (field: string, value: string) => {
        if (field === 'clientSpecific') {
            // Reset copy to and list of entity when client specific changes
            setPermitData(prev => ({
                ...prev,
                [field]: value,
                copyTo: [],
                listOfEntity: []
            }));
        } else {
            setPermitData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    // Fetch permit details
    const fetchPermitDetails = async () => {
        try {
            setInitialLoading(true);
            const url = getFullUrl(`/pms/permits/${id}.json`);
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const permit = data.permit || data;

            // Store original data for mapping
            setOriginalPermitData(data);

            // Map created_by information to requestor details
            const createdBy = permit.created_by || {};

            // Update permit data with all available info
            setPermitData(prev => ({
                ...prev,
                // Requestor Details
                name: createdBy.full_name || '',
                contactNumber: createdBy.mobile || '',
                department: createdBy.department_name || '',
                unit: '', // Not provided in API response
                site: '', // Not provided in API response

                // Basic Details
                permitFor: permit.permit_for || '',
                building: permit.building_id ? permit.building_id.toString() : '',
                wing: permit.wing_id ? permit.wing_id.toString() : '',
                area: permit.area_id ? permit.area_id.toString() : '',
                floor: permit.floor_id ? permit.floor_id.toString() : '',
                room: permit.room_id ? permit.room_id.toString() : '',
                clientSpecific: permit.client_specific || 'Internal',
                copyTo: permit.intimate_to || [],
                listOfEntity: permit.entity_id ? [permit.entity_id.toString()] : [],

                // Permit Details - will be populated after dropdowns load
                permitType: '',
                vendor: '',
                comment: permit.comment || ''
            }));

            // Set existing attachments from main_attachments
            if (data.main_attachments && Array.isArray(data.main_attachments)) {
                setExistingAttachments(data.main_attachments);
            }

            // Handle activities from activity_details - store raw data for later mapping
            if (data.activity_details && data.activity_details.length > 0) {
                const activitiesData = data.activity_details.map((detail: any) => ({
                    id: detail.id,
                    activity: '', // Will be mapped after dropdowns load
                    subActivity: '', // Will be mapped after dropdowns load  
                    categoryOfHazards: '', // Will be mapped after dropdowns load
                    selectedRisks: detail.risks || [],
                    // Store original names for mapping after dropdowns load
                    originalActivityName: detail.activity || '',
                    originalSubActivityName: detail.sub_activity || '',
                    originalHazardCategoryName: detail.hazard_category || ''
                }));
                setActivities(activitiesData);
            }

            toast.success('Permit details loaded successfully');
        } catch (error) {
            console.error('Error fetching permit details:', error);
            toast.error('Failed to fetch permit details');
            navigate('/safety/permit');
        } finally {
            setInitialLoading(false);
        }
    };

    // Fetch permit types
    const fetchPermitTypes = async () => {
        try {
            setLoadingPermitTypes(true);
            const url = getFullUrl('/pms/permit_tags.json');
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let permitTypeItems = [];

            if (data && Array.isArray(data)) {
                permitTypeItems = data
                    .filter(item => item.tag_type === 'PermitType')
                    .map(item => ({
                        id: item.id,
                        name: item.name
                    }));
            }

            setPermitTypes(permitTypeItems);
        } catch (error) {
            console.error('Error fetching permit types:', error);
            toast.error('Failed to fetch permit types');
        } finally {
            setLoadingPermitTypes(false);
        }
    };

    // Fetch permit activities based on permit type
    const fetchPermitActivities = async (permitTypeId: string) => {
        try {
            setLoadingPermitActivities(true);
            const url = getFullUrl(`/pms/permit_tags.json?q[tag_type_eq]=PermitActivity`);
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let permitActivityItems = [];

            if (data && Array.isArray(data)) {
                permitActivityItems = data
                    .filter(item => item.tag_type === 'PermitActivity' && item.parent_id?.toString() === permitTypeId)
                    .map(item => ({
                        id: item.id,
                        name: item.name,
                        parent_id: item.parent_id
                    }));
            }

            setPermitActivities(permitActivityItems);
        } catch (error) {
            console.error('Error fetching permit activities:', error);
            toast.error('Failed to fetch permit activities');
        } finally {
            setLoadingPermitActivities(false);
        }
    };

    // Fetch permit sub activities based on permit activity
    const fetchPermitSubActivities = async (permitActivityId: string) => {
        try {
            setLoadingPermitSubActivities(true);
            const url = getFullUrl(`/pms/permit_tags.json?q[tag_type_eq]=PermitSubActivity`);
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let permitSubActivityItems = [];

            if (data && Array.isArray(data)) {
                permitSubActivityItems = data
                    .filter(item => item.tag_type === 'PermitSubActivity' && item.parent_id?.toString() === permitActivityId)
                    .map(item => ({
                        id: item.id,
                        name: item.name,
                        parent_id: item.parent_id
                    }));
            }

            setPermitSubActivities(permitSubActivityItems);
        } catch (error) {
            console.error('Error fetching permit sub activities:', error);
            toast.error('Failed to fetch permit sub activities');
        } finally {
            setLoadingPermitSubActivities(false);
        }
    };

    // Fetch permit hazard categories based on permit sub activity
    const fetchPermitHazardCategories = async (permitSubActivityId: string) => {
        try {
            setLoadingPermitHazardCategories(true);
            const url = getFullUrl(`/pms/permit_tags.json?q[tag_type_eq]=PermitHazardCategory`);
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let permitHazardCategoryItems = [];

            if (data && Array.isArray(data)) {
                permitHazardCategoryItems = data
                    .filter(item => item.tag_type === 'PermitHazardCategory' && item.parent_id?.toString() === permitSubActivityId)
                    .map(item => ({
                        id: item.id,
                        name: item.name,
                        parent_id: item.parent_id
                    }));
            }

            setPermitHazardCategories(permitHazardCategoryItems);
        } catch (error) {
            console.error('Error fetching permit hazard categories:', error);
            toast.error('Failed to fetch permit hazard categories');
        } finally {
            setLoadingPermitHazardCategories(false);
        }
    };

    // Fetch permit risks based on permit hazard category
    const fetchPermitRisks = async (permitHazardCategoryId: string) => {
        try {
            setLoadingPermitRisks(true);
            const url = getFullUrl(`/pms/permit_tags.json?q[tag_type_eq]=PermitRisk`);
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let permitRiskItems = [];

            if (data && Array.isArray(data)) {
                permitRiskItems = data
                    .filter(item => item.tag_type === 'PermitRisk' && item.parent_id?.toString() === permitHazardCategoryId)
                    .map(item => ({
                        id: item.id,
                        name: item.name,
                        parent_id: item.parent_id
                    }));
            }

            setPermitRisks(permitRiskItems);
        } catch (error) {
            console.error('Error fetching permit risks:', error);
            toast.error('Failed to fetch permit risks');
        } finally {
            setLoadingPermitRisks(false);
        }
    };

    // Fetch suppliers/vendors
    const fetchSuppliers = async () => {
        try {
            setLoadingSuppliers(true);
            const url = getFullUrl('/pms/suppliers/get_suppliers.json');
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && Array.isArray(data)) {
                const supplierItems = data.map((supplier: any) => ({
                    id: supplier.id.toString(),
                    name: supplier.name
                }));
                setSuppliers(supplierItems);
            } else {
                setSuppliers([]);
                toast.error('No suppliers found');
            }
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            toast.error('Failed to fetch suppliers');
        } finally {
            setLoadingSuppliers(false);
        }
    };

    // Fetch buildings
    const fetchBuildings = async () => {
        try {
            setLoadingBuildings(true);
            const url = getFullUrl('/pms/buildings.json');
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.pms_buildings && Array.isArray(result.pms_buildings)) {
                setBuildings(result.pms_buildings.map((building: any) => ({
                    id: building.id,
                    name: building.name
                })));
            } else {
                setBuildings([]);
                toast.error('No buildings found');
            }
        } catch (error) {
            console.error('Error fetching buildings:', error);
            setBuildings([]);
            toast.error('Error fetching buildings');
        } finally {
            setLoadingBuildings(false);
        }
    };

    // Fetch wings
    const fetchWings = async (buildingId: string) => {
        if (!buildingId) {
            setWings([]);
            return Promise.resolve();
        }

        try {
            setLoadingWings(true);
            const url = getFullUrl(`/pms/buildings/${buildingId}/wings.json`);
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (response.ok) {
                const result = await response.json();
                const wingsData = Array.isArray(result)
                    ? result.map((item: any) => item.wings).filter(Boolean).flat()
                    : [];
                setWings(wingsData.map((wing: any) => ({
                    id: wing.id,
                    name: wing.name
                })));
            } else {
                setWings([]);
            }
        } catch (error) {
            console.error('Error fetching wings:', error);
            setWings([]);
        } finally {
            setLoadingWings(false);
        }
    };

    useEffect(() => {
        if (permitData.building) {
            fetchWings(permitData.building)
        }
    }, [permitData.building])

    // Fetch areas
    const fetchAreas = async (wingId: string) => {
        if (!wingId) {
            setAreas([]);
            return Promise.resolve();
        }

        try {
            setLoadingAreas(true);
            const url = getFullUrl(`/pms/wings/${wingId}/areas.json`);
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (response.ok) {
                const result = await response.json();
                if (result.areas && Array.isArray(result.areas)) {
                    setAreas(result.areas.map((area: any) => ({
                        id: area.id,
                        name: area.name
                    })));
                } else {
                    setAreas([]);
                }
            } else {
                setAreas([]);
            }
        } catch (error) {
            console.error('Error fetching areas:', error);
            setAreas([]);
        } finally {
            setLoadingAreas(false);
        }
    };

    // Fetch floors
    const fetchFloors = async (areaId: string) => {
        if (!areaId) {
            setFloors([]);
            return Promise.resolve();
        }

        try {
            setLoadingFloors(true);
            const url = getFullUrl(`/pms/areas/${areaId}/floors.json`);
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (response.ok) {
                const result = await response.json();
                if (result.floors && Array.isArray(result.floors)) {
                    setFloors(result.floors.map((floor: any) => ({
                        id: floor.id,
                        name: floor.name
                    })));
                } else {
                    setFloors([]);
                }
            } else {
                setFloors([]);
            }
        } catch (error) {
            console.error('Error fetching floors:', error);
            setFloors([]);
        } finally {
            setLoadingFloors(false);
        }
    };

    // Fetch rooms
    const fetchRooms = async (floorId: string) => {
        if (!floorId) {
            setRooms([]);
            return Promise.resolve();
        }

        try {
            setLoadingRooms(true);
            const url = getFullUrl(`/pms/floors/${floorId}/rooms.json`);
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (response.ok) {
                const result = await response.json();
                const roomsData = Array.isArray(result)
                    ? result.map((item: any) => item.rooms).filter(Boolean).flat()
                    : [];
                setRooms(roomsData.map((room: any) => ({
                    id: room.id,
                    name: room.name
                })));
            } else {
                setRooms([]);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setRooms([]);
        } finally {
            setLoadingRooms(false);
        }
    };

    // Fetch entity options
    const fetchEntityOptions = async () => {
        try {
            setLoadingEntityOptions(true);
            const url = getFullUrl('/entities.json');
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (response.ok) {
                const result = await response.json();
                if (result.entities && Array.isArray(result.entities)) {
                    setEntityOptions(result.entities.map((entity: any) => ({
                        id: entity.id.toString(),
                        name: entity.name
                    })));
                } else {
                    setEntityOptions([]);
                }
            } else {
                setEntityOptions([]);
            }
        } catch (error) {
            console.error('Error fetching entities:', error);
            setEntityOptions([]);
        } finally {
            setLoadingEntityOptions(false);
        }
    };

    // Fetch copy to users
    const fetchCopyToUsers = async () => {
        try {
            setLoadingCopyToUsers(true);
            const url = getFullUrl('/pms/users/get_escalate_to_users.json');
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (response.ok) {
                const result = await response.json();
                if (result.users && Array.isArray(result.users)) {
                    setCopyToUsers(result.users.map((user: any) => ({
                        id: user.id.toString(),
                        name: user.full_name
                    })));
                } else {
                    setCopyToUsers([]);
                }
            } else {
                setCopyToUsers([]);
            }
        } catch (error) {
            console.error('Error fetching Copy To users:', error);
            setCopyToUsers([]);
        } finally {
            setLoadingCopyToUsers(false);
        }
    };

    // useEffect hooks
    useEffect(() => {
        if (id) {
            // Fetch initial data
            Promise.all([
                fetchPermitTypes(),
                fetchSuppliers(),
                fetchBuildings(),
                fetchEntityOptions(),
                fetchCopyToUsers(),
                fetchPermitDetails()
            ]);
        }
    }, [id]);

    // Map permit type and vendor after data is loaded
    useEffect(() => {
        if (originalPermitData && originalPermitData.permit && permitTypes.length > 0 && suppliers.length > 0) {
            const permit = originalPermitData.permit;

            // Find permit type ID from permit type name
            let permitTypeId = '';
            if (permit.permit_type) {
                const foundPermitType = permitTypes.find(pt => pt.name === permit.permit_type);
                permitTypeId = foundPermitType ? foundPermitType.id.toString() : '';
            }

            // Find vendor ID from vendor data
            let vendorId = '';
            if (permit.vendor && permit.vendor.company_name) {
                const foundVendor = suppliers.find(s => s.name === permit.vendor.company_name);
                vendorId = foundVendor ? foundVendor.id : '';
            }

            // Update permit data with mapped IDs
            setPermitData(prev => ({
                ...prev,
                permitType: permitTypeId,
                vendor: vendorId
            }));
        }
    }, [originalPermitData, permitTypes, suppliers]);

    useEffect(() => {
        if (permitData.wing) {
            fetchAreas(permitData.wing);
        }
    }, [permitData.wing]);

    useEffect(() => {
        if (permitData.area) {
            fetchFloors(permitData.area);
        }
    }, [permitData.area]);

    useEffect(() => {
        if (permitData.floor) {
            fetchRooms(permitData.floor);
        }
    }, [permitData.floor]);

    // Handle permit type dependent data
    useEffect(() => {
        if (permitData.permitType && permitTypes.length > 0) {
            fetchPermitActivities(permitData.permitType);
        }
    }, [permitData.permitType, permitTypes]);

    // Map activities from original data after permit activities are loaded
    useEffect(() => {
        if (originalPermitData && originalPermitData.activity_details && permitActivities.length > 0) {
            const mappedActivities = originalPermitData.activity_details.map((detail: any) => {
                // Find activity ID from name
                const foundActivity = permitActivities.find(pa => pa.name === detail.activity);
                const activityId = foundActivity ? foundActivity.id.toString() : '';

                return {
                    id: detail.id,
                    activity: activityId,
                    subActivity: '', // Will be set after sub activities load
                    categoryOfHazards: '', // Will be set after hazard categories load
                    selectedRisks: detail.risks || [],
                    originalActivityName: detail.activity || '',
                    originalSubActivityName: detail.sub_activity || '',
                    originalHazardCategoryName: detail.hazard_category || ''
                };
            });
            setActivities(mappedActivities);

            // Fetch sub activities for each activity
            mappedActivities.forEach((activity) => {
                if (activity.activity) {
                    fetchPermitSubActivities(activity.activity);
                }
            });
        }
    }, [originalPermitData, permitActivities]);

    // Map sub activities after they are loaded
    useEffect(() => {
        if (originalPermitData && originalPermitData.activity_details && permitSubActivities.length > 0) {
            setActivities(prev => prev.map((activity, index) => {
                const originalData = originalPermitData.activity_details[index];
                if (originalData && originalData.sub_activity) {
                    const foundSubActivity = permitSubActivities.find(psa => psa.name === originalData.sub_activity);
                    const subActivityId = foundSubActivity ? foundSubActivity.id.toString() : '';

                    // Fetch hazard categories if sub activity found
                    if (subActivityId) {
                        fetchPermitHazardCategories(subActivityId);
                    }

                    return { ...activity, subActivity: subActivityId };
                }
                return activity;
            }));
        }
    }, [originalPermitData, permitSubActivities]);

    // Map hazard categories after they are loaded
    useEffect(() => {
        if (originalPermitData && originalPermitData.activity_details && permitHazardCategories.length > 0) {
            setActivities(prev => prev.map((activity, index) => {
                const originalData = originalPermitData.activity_details[index];
                if (originalData && originalData.hazard_category) {
                    const foundHazardCategory = permitHazardCategories.find(phc => phc.name === originalData.hazard_category);
                    const hazardCategoryId = foundHazardCategory ? foundHazardCategory.id.toString() : '';

                    // Fetch risks if hazard category found
                    if (hazardCategoryId) {
                        fetchPermitRisks(hazardCategoryId);
                    }

                    return { ...activity, categoryOfHazards: hazardCategoryId };
                }
                return activity;
            }));
        }
    }, [originalPermitData, permitHazardCategories]);

    // Map risks after they are loaded
    useEffect(() => {
        if (originalPermitData && originalPermitData.activity_details && permitRisks.length > 0) {
            setActivities(prev => prev.map((activity, index) => {
                const originalData = originalPermitData.activity_details[index];
                if (originalData && originalData.risks && Array.isArray(originalData.risks)) {
                    // Map risk names to IDs
                    const mappedRiskIds = originalData.risks
                        .map((riskName: string) => {
                            const foundRisk = permitRisks.find(pr => pr.name === riskName);
                            return foundRisk ? foundRisk.id.toString() : null;
                        })
                        .filter((id: string | null) => id !== null);

                    return { ...activity, selectedRisks: mappedRiskIds };
                }
                return activity;
            }));
        }
    }, [originalPermitData, permitRisks]);

    // Handle permit type change
    const handlePermitTypeChange = (permitTypeId: string) => {
        setPermitData(prev => ({
            ...prev,
            permitType: permitTypeId,
            activity: '',
            subActivity: '',
            categoryOfHazards: ''
        }));

        // Clear dependent data
        setPermitActivities([]);
        setPermitSubActivities([]);
        setPermitHazardCategories([]);
        setPermitRisks([]);

        // Update activities array to reset fields
        setActivities(prev => prev.map(activity => ({
            ...activity,
            activity: '',
            subActivity: '',
            categoryOfHazards: '',
            selectedRisks: []
        })));

        // Fetch permit activities for the selected permit type
        if (permitTypeId) {
            fetchPermitActivities(permitTypeId);
        }
    };

    // Handle activity change in the activities array
    const handleActivityChangeWithAPI = (index: number, field: string, value: string) => {
        handleActivityChange(index, field, value);

        if (field === 'activity' && value) {
            setActivities(prev => prev.map((activity, i) =>
                i === index ? { ...activity, subActivity: '', categoryOfHazards: '', selectedRisks: [] } : activity
            ));
            setPermitRisks([]);
            fetchPermitSubActivities(value);
        } else if (field === 'subActivity' && value) {
            setActivities(prev => prev.map((activity, i) =>
                i === index ? { ...activity, categoryOfHazards: '', selectedRisks: [] } : activity
            ));
            setPermitRisks([]);
            fetchPermitHazardCategories(value);
        } else if (field === 'categoryOfHazards' && value) {
            setActivities(prev => prev.map((activity, i) =>
                i === index ? { ...activity, selectedRisks: [] } : activity
            ));
            fetchPermitRisks(value);
        }
    };

    const handleAddActivity = () => {
        setActivities(prev => [...prev, { activity: '', subActivity: '', categoryOfHazards: '', selectedRisks: [] }]);
    };

    const handleRemoveActivity = (index: number) => {
        if (activities.length > 1) {
            setActivities(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleActivityChange = (index: number, field: string, value: string) => {
        setActivities(prev => prev.map((activity, i) =>
            i === index ? { ...activity, [field]: value } : activity
        ));
    };

    // Handle risk checkbox changes
    const handleRiskChange = (index: number, riskId: string, checked: boolean) => {
        setActivities(prev => prev.map((activity, i) => {
            if (i === index) {
                const updatedRisks = checked
                    ? [...activity.selectedRisks, riskId]
                    : activity.selectedRisks.filter(id => id !== riskId);
                return { ...activity, selectedRisks: updatedRisks };
            }
            return activity;
        }));
    };

    // Handle building, wing, area, floor changes
    const handleBuildingChange = (value: string) => {
        setPermitData(prev => ({
            ...prev,
            building: value,
            wing: '',
            area: '',
            floor: '',
            room: ''
        }));
    };

    const handleWingChange = (value: string) => {
        setPermitData(prev => ({
            ...prev,
            wing: value,
            area: '',
            floor: '',
            room: ''
        }));
    };

    const handleAreaChange = (value: string) => {
        setPermitData(prev => ({
            ...prev,
            area: value,
            floor: '',
            room: ''
        }));
    };

    const handleFloorChange = (value: string) => {
        setPermitData(prev => ({
            ...prev,
            floor: value,
            room: ''
        }));
        // if (value) {
        //     fetchRooms(value);
        // }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPermitData(prev => ({
                ...prev,
                attachments: file
            }));
            toast.success('File uploaded successfully');
        }
    };
    console.log(activities)
    // Handle submit with PUT method
    const handleSubmit = async () => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            // Validate required fields
            if (!permitData.permitFor.trim()) {
                toast.error('Please enter permit for field');
                return;
            }
            if (!permitData.building) {
                toast.error('Please select building');
                return;
            }
            if (!permitData.permitType) {
                toast.error('Please select permit type');
                return;
            }
            if (activities.length === 0 || !activities[0].activity) {
                toast.error('Please add at least one activity');
                return;
            }

            const formData = new FormData();

            // Basic permit data
            formData.append('pms_permit[permit_for]', permitData.permitFor);
            formData.append('pms_permit[building_id]', permitData.building);
            if (permitData.wing) formData.append('pms_permit[wing_id]', permitData.wing);
            if (permitData.area) formData.append('pms_permit[area_id]', permitData.area);
            if (permitData.floor) formData.append('pms_permit[floor_id]', permitData.floor);
            if (permitData.room) formData.append('pms_permit[room_id]', permitData.room);
            formData.append('pms_permit[client_specific]', permitData.clientSpecific);

            // Entity ID
            if (permitData.listOfEntity.length > 0) {
                formData.append('pms_permit[entity_id]', permitData.listOfEntity[0]);
            }

            // Copy To
            permitData.copyTo.forEach(userId => {
                formData.append('pms_permit[intimate_to][]', userId);
            });

            formData.append('pms_permit[permit_type_id]', permitData.permitType);

            if (permitData.vendor) {
                formData.append('pms_permit[vendor_id]', permitData.vendor);
            }

            if (permitData.comment) {
                formData.append('pms_permit[comment]', permitData.comment);
            }

            // Permit details
            // activities.forEach((activity, index) => {
            //     if (activity.activity && activity.subActivity && activity.categoryOfHazards) {
            //         formData.append(`pms_permit[permit_details_attributes][${index}][id]`, activity.id);
            //         formData.append(`pms_permit[permit_details_attributes][${index}][_destroy]`, 'false');
            //         formData.append(`pms_permit[permit_details_attributes][${index}][permit_activity_id]`, activity.activity);
            //         formData.append(`pms_permit[permit_details_attributes][${index}][permit_sub_activity_id]`, activity.subActivity);
            //         formData.append(`pms_permit[permit_details_attributes][${index}][permit_hazard_category_id]`, activity.categoryOfHazards);

            //         activity.selectedRisks.forEach((riskId, riskIndex) => {
            //             formData.append(`pms_permit[permit_details_attributes][${index}][permit_risks_attributes][${riskIndex}][permit_risk_id]`, riskId);
            //         });
            //     }
            // });
            activities.forEach((activity, index) => {
                if (activity.activity && activity.subActivity && activity.categoryOfHazards) {
                    // Append ID only if it exists
                    if (activity.id) {
                        formData.append(`pms_permit[permit_details_attributes][${index}][id]`, activity.id);
                    }

                    formData.append(`pms_permit[permit_details_attributes][${index}][_destroy]`, 'false');
                    formData.append(`pms_permit[permit_details_attributes][${index}][permit_activity_id]`, activity.activity);
                    formData.append(`pms_permit[permit_details_attributes][${index}][permit_sub_activity_id]`, activity.subActivity);
                    formData.append(`pms_permit[permit_details_attributes][${index}][permit_hazard_category_id]`, activity.categoryOfHazards);

                    activity.selectedRisks.forEach((riskId, riskIndex) => {
                        formData.append(`pms_permit[permit_details_attributes][${index}][permit_risks_attributes][${riskIndex}][permit_risk_id]`, riskId);
                    });
                }
            });


            // Attachments
            if (permitData.attachments) {
                formData.append('attachments[]', permitData.attachments);
            }

            const url = getFullUrl(`/pms/permits/${id}.json`);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Permit updated successfully:', responseData);

            toast.success('Permit updated successfully!');
            navigate('/safety/permit');

        } catch (error) {
            console.error('Error updating permit:', error);
            toast.error('Failed to update permit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/safety/permit')} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Permit List
                </Button>
                <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT PERMIT</h1>
            </div>

            {initialLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading permit details...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Permit Requestor Details */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className='bg-[#F6F4EE] mb-4'>
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
                                PERMIT REQUESTOR DETAILS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Name</label>
                                    <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                                        {permitData.name || 'N/A'}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Contact Number</label>
                                    <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                                        {permitData.contactNumber || 'N/A'}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Department</label>
                                    <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                                        {permitData.department || 'N/A'}
                                    </div>
                                </div>

                                {permitData.unit && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Unit</label>
                                        <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                                            {permitData.unit}
                                        </div>
                                    </div>
                                )}

                                {permitData.site && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Site</label>
                                        <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                                            {permitData.site}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Details */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className='bg-[#F6F4EE] mb-4'>
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
                                BASIC DETAILS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="space-y-6">
                                <TextField
                                    label="Permit For*"
                                    value={permitData.permitFor}
                                    onChange={(e) => handleInputChange('permitFor', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    sx={fieldStyles}
                                    size="small"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                        <InputLabel id="building-select-label" shrink>Building*</InputLabel>
                                        <MuiSelect
                                            labelId="building-select-label"
                                            label="Building*"
                                            value={permitData.building}
                                            onChange={(e) => handleBuildingChange(e.target.value)}
                                            displayEmpty
                                            MenuProps={menuProps}
                                            disabled={loadingBuildings}
                                            size="small"
                                        >
                                            <MenuItem value="">
                                                <em>Select Building</em>
                                            </MenuItem>
                                            {buildings.map((building) => (
                                                <MenuItem key={building.id} value={building.id.toString()}>
                                                    {building.name}
                                                </MenuItem>
                                            ))}
                                        </MuiSelect>
                                    </FormControl>

                                    <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                        <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
                                        <MuiSelect
                                            labelId="wing-select-label"
                                            label="Wing"
                                            value={permitData.wing}
                                            onChange={(e) => handleWingChange(e.target.value)}
                                            displayEmpty
                                            MenuProps={menuProps}
                                            disabled={loadingWings || !permitData.building}
                                            size="small"
                                        >
                                            <MenuItem value="">
                                                <em>Select Wing</em>
                                            </MenuItem>
                                            {wings.map((wing) => (
                                                <MenuItem key={wing.id} value={wing.id.toString()}>
                                                    {wing.name}
                                                </MenuItem>
                                            ))}
                                        </MuiSelect>
                                    </FormControl>

                                    <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                        <InputLabel id="area-select-label" shrink>Area</InputLabel>
                                        <MuiSelect
                                            labelId="area-select-label"
                                            label="Area"
                                            value={permitData.area}
                                            onChange={(e) => handleAreaChange(e.target.value)}
                                            displayEmpty
                                            MenuProps={menuProps}
                                            disabled={loadingAreas || !permitData.wing}
                                            size="small"
                                        >
                                            <MenuItem value="">
                                                <em>Select Area</em>
                                            </MenuItem>
                                            {areas.map((area) => (
                                                <MenuItem key={area.id} value={area.id.toString()}>
                                                    {area.name}
                                                </MenuItem>
                                            ))}
                                        </MuiSelect>
                                    </FormControl>

                                    <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                        <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
                                        <MuiSelect
                                            labelId="floor-select-label"
                                            label="Floor"
                                            value={permitData.floor}
                                            onChange={(e) => handleFloorChange(e.target.value)}
                                            displayEmpty
                                            MenuProps={menuProps}
                                            disabled={loadingFloors || !permitData.area}
                                            size="small"
                                        >
                                            <MenuItem value="">
                                                <em>Select Floor</em>
                                            </MenuItem>
                                            {floors.map((floor) => (
                                                <MenuItem key={floor.id} value={floor.id.toString()}>
                                                    {floor.name}
                                                </MenuItem>
                                            ))}
                                        </MuiSelect>
                                    </FormControl>

                                    <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                        <InputLabel id="room-select-label" shrink>Room</InputLabel>
                                        <MuiSelect
                                            labelId="room-select-label"
                                            label="Room"
                                            value={permitData.room}
                                            onChange={(e) => handleInputChange('room', e.target.value)}
                                            displayEmpty
                                            MenuProps={menuProps}
                                            disabled={loadingRooms || !permitData.floor}
                                            size="small"
                                        >
                                            <MenuItem value="">
                                                <em>Select Room</em>
                                            </MenuItem>
                                            {rooms.map((room) => (
                                                <MenuItem key={room.id} value={room.id.toString()}>
                                                    {room.name}
                                                </MenuItem>
                                            ))}
                                        </MuiSelect>
                                    </FormControl>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-700">Client Specific</label>
                                    <div className="flex gap-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="clientSpecific"
                                                value="Internal"
                                                checked={permitData.clientSpecific === 'Internal'}
                                                onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                                                className="mr-2 w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            />
                                            <span className="text-sm text-gray-700">Internal</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="clientSpecific"
                                                value="Client"
                                                checked={permitData.clientSpecific === 'Client'}
                                                onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                                                className="mr-2 w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            />
                                            <span className="text-sm text-gray-700">Client</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Copy To Dropdown - Shows for Internal */}
                                {permitData.clientSpecific === 'Internal' && (
                                    <div>
                                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                            <InputLabel shrink>Copy To</InputLabel>
                                            <MuiSelect
                                                multiple
                                                value={permitData.copyTo}
                                                onChange={(e) => handleMultiSelectChange('copyTo', e.target.value as string[])}
                                                label="Copy To"
                                                MenuProps={menuProps}
                                                size="small"
                                                disabled={loadingCopyToUsers}
                                                renderValue={(selected) => {
                                                    if (selected.length === 0) return '';
                                                    const selectedNames = copyToUsers
                                                        .filter(option => selected.includes(option.id))
                                                        .map(option => option.name);
                                                    return selectedNames.join(', ');
                                                }}
                                            >
                                                {loadingCopyToUsers ? (
                                                    <MenuItem disabled>Loading users...</MenuItem>
                                                ) : (
                                                    copyToUsers.map((option) => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </MuiSelect>
                                        </FormControl>
                                    </div>
                                )}

                                {/* Copy To and List of Entity Dropdowns - Shows for Client */}
                                {permitData.clientSpecific === 'Client' && (
                                    <div className="space-y-4">
                                        <div>
                                            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                                <InputLabel shrink>Copy To</InputLabel>
                                                <MuiSelect
                                                    multiple
                                                    value={permitData.copyTo}
                                                    onChange={(e) => handleMultiSelectChange('copyTo', e.target.value as string[])}
                                                    label="Copy To"
                                                    MenuProps={menuProps}
                                                    size="small"
                                                    disabled={loadingCopyToUsers}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) return '';
                                                        const selectedNames = copyToUsers
                                                            .filter(option => selected.includes(option.id))
                                                            .map(option => option.name);
                                                        return selectedNames.join(', ');
                                                    }}
                                                >
                                                    {loadingCopyToUsers ? (
                                                        <MenuItem disabled>Loading users...</MenuItem>
                                                    ) : (
                                                        copyToUsers.map((option) => (
                                                            <MenuItem key={option.id} value={option.id}>
                                                                {option.name}
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </MuiSelect>
                                            </FormControl>
                                        </div>

                                        <div>
                                            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                                <InputLabel shrink>List of Entity</InputLabel>
                                                <MuiSelect
                                                    multiple
                                                    value={permitData.listOfEntity}
                                                    onChange={(e) => handleMultiSelectChange('listOfEntity', e.target.value as string[])}
                                                    label="List of Entity"
                                                    MenuProps={menuProps}
                                                    size="small"
                                                    disabled={loadingEntityOptions}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) return '';
                                                        const selectedNames = entityOptions
                                                            .filter(option => selected.includes(option.id))
                                                            .map(option => option.name);
                                                        return selectedNames.join(', ');
                                                    }}
                                                >
                                                    {loadingEntityOptions ? (
                                                        <MenuItem disabled>Loading entities...</MenuItem>
                                                    ) : (
                                                        entityOptions.map((option) => (
                                                            <MenuItem key={option.id} value={option.id}>
                                                                {option.name}
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </MuiSelect>
                                            </FormControl>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permit Details */}
                    <Card className="mb-8 shadow-sm border-0">
                        <CardHeader className="bg-white border-b border-gray-100">
                            <CardTitle className="flex items-center text-[#C72030] text-lg font-semibold">
                                <span className="mr-3 w-2 h-2 bg-[#C72030] rounded-full"></span>
                                PERMIT DETAILS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-700">Select Permit Type*</label>
                                    {loadingPermitTypes ? (
                                        <div className="flex items-center justify-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="text-center text-gray-600">Loading permit types...</div>
                                        </div>
                                    ) : permitTypes.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {permitTypes.map((permitType) => (
                                                <div
                                                    key={permitType.id}
                                                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${permitData.permitType === permitType.id.toString()
                                                        ? 'border-[#C72030] bg-[#C72030]/5 shadow-md'
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                        }`}
                                                    onClick={() => handlePermitTypeChange(permitType.id.toString())}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {permitType.name}
                                                        </span>
                                                        <div className={`w-4 h-4 rounded-full border-2 ${permitData.permitType === permitType.id.toString()
                                                            ? 'border-[#C72030] bg-[#C72030]'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {permitData.permitType === permitType.id.toString() && (
                                                                <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {permitData.permitType === permitType.id.toString() && (
                                                        <div className="mt-2 text-xs text-[#C72030] font-medium">
                                                            Selected
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="text-center text-gray-600">No permit types available</div>
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic Activities */}
                                {activities.map((activity, index) => (
                                    <div key={index} className="space-y-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-sm font-medium text-gray-700">Activity {index + 1}</h4>
                                            {activities.length > 1 && (
                                                <Button
                                                    onClick={() => handleRemoveActivity(index)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Remove Activity
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel shrink>Activity*</InputLabel>
                                                <MuiSelect
                                                    label="Activity*"
                                                    value={activity.activity}
                                                    onChange={(e) => handleActivityChangeWithAPI(index, 'activity', e.target.value)}
                                                    displayEmpty
                                                    sx={fieldStyles}
                                                    MenuProps={menuProps}
                                                    disabled={loadingPermitActivities || !permitData.permitType}
                                                    size="small"
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Activity</em>
                                                    </MenuItem>
                                                    {permitActivities.map((activityItem) => (
                                                        <MenuItem key={activityItem.id} value={activityItem.id.toString()}>
                                                            {activityItem.name}
                                                        </MenuItem>
                                                    ))}
                                                </MuiSelect>
                                            </FormControl>

                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel shrink>Sub Activity*</InputLabel>
                                                <MuiSelect
                                                    label="Sub Activity*"
                                                    value={activity.subActivity}
                                                    onChange={(e) => handleActivityChangeWithAPI(index, 'subActivity', e.target.value)}
                                                    displayEmpty
                                                    sx={fieldStyles}
                                                    MenuProps={menuProps}
                                                    disabled={loadingPermitSubActivities || !activity.activity}
                                                    size="small"
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Sub Activity</em>
                                                    </MenuItem>
                                                    {permitSubActivities.map((subActivity) => (
                                                        <MenuItem key={subActivity.id} value={subActivity.id.toString()}>
                                                            {subActivity.name}
                                                        </MenuItem>
                                                    ))}
                                                </MuiSelect>
                                            </FormControl>

                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel shrink>Category of Hazards*</InputLabel>
                                                <MuiSelect
                                                    label="Category of Hazards*"
                                                    value={activity.categoryOfHazards}
                                                    onChange={(e) => handleActivityChangeWithAPI(index, 'categoryOfHazards', e.target.value)}
                                                    displayEmpty
                                                    sx={fieldStyles}
                                                    MenuProps={menuProps}
                                                    disabled={loadingPermitHazardCategories || !activity.subActivity}
                                                    size="small"
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Category of Hazards</em>
                                                    </MenuItem>
                                                    {permitHazardCategories.map((hazardCategory) => (
                                                        <MenuItem key={hazardCategory.id} value={hazardCategory.id.toString()}>
                                                            {hazardCategory.name}
                                                        </MenuItem>
                                                    ))}
                                                </MuiSelect>
                                            </FormControl>
                                        </div>

                                        {/* Risks Section */}
                                        {activity.categoryOfHazards && (
                                            <div className="mt-6">
                                                <h5 className="text-sm font-medium text-gray-700 mb-3">Risks*</h5>
                                                {loadingPermitRisks ? (
                                                    <div className="flex items-center justify-center py-4 border border-gray-200 rounded-lg bg-gray-50">
                                                        <div className="text-center text-gray-600">Loading risks...</div>
                                                    </div>
                                                ) : permitRisks.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                                                        {permitRisks.map((risk) => (
                                                            <FormControlLabel
                                                                key={risk.id}
                                                                control={
                                                                    <Checkbox
                                                                        checked={activity.selectedRisks.includes(risk.id.toString())}
                                                                        onChange={(e) => handleRiskChange(index, risk.id.toString(), e.target.checked)}
                                                                        sx={{
                                                                            color: '#6b7280',
                                                                            '&.Mui-checked': {
                                                                                color: '#C72030',
                                                                            },
                                                                        }}
                                                                    />
                                                                }
                                                                label={<span className="text-sm text-gray-700">{risk.name}</span>}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center py-4 border border-gray-200 rounded-lg bg-gray-50">
                                                        <div className="text-center text-gray-600">No risks available</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    onClick={handleAddActivity}
                                    className="bg-[#C72030] hover:bg-[#A61B28] text-white px-6 py-2 rounded-lg font-medium"
                                >
                                    + Add Activity
                                </Button>

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Vendor</InputLabel>
                                    <MuiSelect
                                        label="Vendor"
                                        value={permitData.vendor}
                                        onChange={(e) => handleInputChange('vendor', e.target.value)}
                                        displayEmpty
                                        sx={fieldStyles}
                                        MenuProps={menuProps}
                                        disabled={loadingSuppliers}
                                    >
                                        <MenuItem value="">
                                            <em>Select Vendor</em>
                                        </MenuItem>
                                        {suppliers.map((supplier) => (
                                            <MenuItem key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </MenuItem>
                                        ))}
                                    </MuiSelect>
                                </FormControl>

                                <TextField
                                    label="Comment (Optional)"
                                    value={permitData.comment}
                                    onChange={(e) => handleInputChange('comment', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    sx={{ ...fieldStyles, width: "100%", mb: 1 }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attachments */}
                    <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                        <CardHeader className='bg-[#F6F4EE] mb-4'>
                            <CardTitle className="text-lg text-black flex items-center">
                                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">4</span>
                                ATTACHMENTS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="space-y-4">
                                {/* Show existing attachments */}
                                {existingAttachments.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Current Attachments:</h4>
                                        <div className="space-y-2">
                                            {existingAttachments.map((attachment, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <span className="text-sm text-gray-600">{attachment.filename || `Attachment ${index + 1}`}</span>
                                                    <a
                                                        href={attachment.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#C72030] text-sm hover:underline"
                                                    >
                                                        View
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700"
                                    >
                                        {existingAttachments.length > 0 ? 'Add New File' : 'Choose Files'}
                                    </label>
                                    <span className="ml-4 text-sm text-gray-500">
                                        {permitData.attachments ? permitData.attachments.name : 'No new file chosen'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            style={{ backgroundColor: isSubmitting ? '#9ca3af' : '#C72030' }}
                            className="text-white hover:bg-[#C72030]/90 flex items-center px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Updating Permit...' : 'Update Permit'}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default EditPermitPage;