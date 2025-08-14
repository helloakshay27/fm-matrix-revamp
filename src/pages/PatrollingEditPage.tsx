import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, Type, CalendarRange, ListChecks, Clock, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
    fetchAllBuildings,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
    fetchRooms,
} from '@/store/slices/serviceLocationSlice';
import { userService, User } from '@/services/userService';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';

// Section component
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section className="bg-card rounded-lg border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {icon}
            </div>
            <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </section>
);

// Custom Location Selector for Checkpoints
const CheckpointLocationSelector: React.FC<{
    fieldStyles: any;
    onLocationChange: (location: {
        buildingId: number | null;
        wingId: number | null;
        areaId: number | null;
        floorId: number | null;
        roomId: number | null;
    }) => void;
    disabled?: boolean;
    checkpointIndex: number;
    currentLocation: {
        buildingId: number | null;
        wingId: number | null;
        areaId: number | null;
        floorId: number | null;
        roomId: number | null;
    };
}> = ({ fieldStyles, onLocationChange, disabled = false, checkpointIndex, currentLocation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        sites,
        buildings,
        wings,
        areas,
        floors,
        rooms,
        loading
    } = useSelector((state: RootState) => state.serviceLocation);

    const selectedBuildingId = currentLocation.buildingId;
    const selectedWingId = currentLocation.wingId;
    const selectedAreaId = currentLocation.areaId;
    const selectedFloorId = currentLocation.floorId;
    const selectedRoomId = currentLocation.roomId;

    useEffect(() => {
        const siteId = localStorage.getItem('selectedSiteId');
        if (siteId) {
            dispatch(fetchAllBuildings(parseInt(siteId)));
        }
    }, [dispatch]);

    const handleBuildingChange = (buildingId: number) => {
        dispatch(fetchWings(buildingId));
        onLocationChange({
            buildingId,
            wingId: null,
            areaId: null,
            floorId: null,
            roomId: null,
        });
    };

    const handleWingChange = (wingId: number) => {
        dispatch(fetchAreas(wingId));
        onLocationChange({
            buildingId: selectedBuildingId,
            wingId,
            areaId: null,
            floorId: null,
            roomId: null,
        });
    };

    const handleAreaChange = (areaId: number) => {
        dispatch(fetchFloors(areaId));
        onLocationChange({
            buildingId: selectedBuildingId,
            wingId: selectedWingId,
            areaId,
            floorId: null,
            roomId: null,
        });
    };

    const handleFloorChange = (floorId: number) => {
        dispatch(fetchRooms(floorId));
        onLocationChange({
            buildingId: selectedBuildingId,
            wingId: selectedWingId,
            areaId: selectedAreaId,
            floorId,
            roomId: null,
        });
    };

    const handleRoomChange = (roomId: number) => {
        onLocationChange({
            buildingId: selectedBuildingId,
            wingId: selectedWingId,
            areaId: selectedAreaId,
            floorId: selectedFloorId,
            roomId,
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Building */}
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Building *</InputLabel>
                <MuiSelect
                    value={selectedBuildingId || ''}
                    onChange={(e) => handleBuildingChange(Number(e.target.value))}
                    label="Building *"
                    notched
                    displayEmpty
                    disabled={disabled || loading.buildings}
                >
                    <MenuItem value="">Select Building</MenuItem>
                    {Array.isArray(buildings) && buildings.map((building) => (
                        <MenuItem key={building.id} value={building.id}>
                            {building.name}
                        </MenuItem>
                    ))}
                </MuiSelect>
            </FormControl>

            {/* Wing */}
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Wing *</InputLabel>
                <MuiSelect
                    value={selectedWingId || ''}
                    onChange={(e) => handleWingChange(Number(e.target.value))}
                    label="Wing *"
                    notched
                    displayEmpty
                    disabled={disabled || !selectedBuildingId || loading.wings}
                >
                    <MenuItem value="">Select Wing</MenuItem>
                    {Array.isArray(wings) && wings.map((wing) => (
                        <MenuItem key={wing.id} value={wing.id}>
                            {wing.name}
                        </MenuItem>
                    ))}
                </MuiSelect>
            </FormControl>

            {/* Area */}
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Area *</InputLabel>
                <MuiSelect
                    value={selectedAreaId || ''}
                    onChange={(e) => handleAreaChange(Number(e.target.value))}
                    label="Area *"
                    notched
                    displayEmpty
                    disabled={disabled || !selectedWingId || loading.areas}
                >
                    <MenuItem value="">Select Area</MenuItem>
                    {Array.isArray(areas) && areas.map((area) => (
                        <MenuItem key={area.id} value={area.id}>
                            {area.name}
                        </MenuItem>
                    ))}
                </MuiSelect>
            </FormControl>

            {/* Floor */}
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Floor *</InputLabel>
                <MuiSelect
                    value={selectedFloorId || ''}
                    onChange={(e) => handleFloorChange(Number(e.target.value))}
                    label="Floor *"
                    notched
                    displayEmpty
                    disabled={disabled || !selectedBuildingId || loading.floors}
                >
                    <MenuItem value="">Select Floor</MenuItem>
                    {Array.isArray(floors) && floors.map((floor) => (
                        <MenuItem key={floor.id} value={floor.id}>
                            {floor.name}
                        </MenuItem>
                    ))}
                </MuiSelect>
            </FormControl>

            {/* Room */}
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Room</InputLabel>
                <MuiSelect
                    value={selectedRoomId || ''}
                    onChange={(e) => handleRoomChange(Number(e.target.value))}
                    label="Room"
                    notched
                    displayEmpty
                    disabled={disabled || !selectedFloorId || loading.rooms}
                >
                    <MenuItem value="">Select Room</MenuItem>
                    {Array.isArray(rooms) && rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                            {room.name}
                        </MenuItem>
                    ))}
                </MuiSelect>
            </FormControl>
        </div>
    );
};

export const PatrollingEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { document.title = 'Edit Patrolling'; }, []);

    // Fetch buildings when component loads
    useEffect(() => {
        const siteId = localStorage.getItem('selectedSiteId');
        if (siteId) {
            dispatch(fetchAllBuildings(parseInt(siteId)));
        }
    }, [dispatch]);

    type Question = {
        id: string;
        task: string;
        inputType: string;
        mandatory: boolean;
        options?: string[];
        optionsText?: string; // Store raw input text for options
    };
    type Shift = {
        id: string;
        name: string;
        start: string;
        end: string;
        assignee: string;
        supervisor: string;
        scheduleId: string;
    };
    type Checkpoint = {
        id: string;
        name: string;
        description: string;
        buildingId: number | null;
        wingId: number | null;
        floorId: number | null;
        areaId: number | null;
        roomId: number | null;
        scheduleIds: string[];
    };

    const [autoTicket, setAutoTicket] = useState(false);
    const [patrolName, setPatrolName] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [grace, setGrace] = useState('');

    // FM Users state
    const [fmUsers, setFmUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [errors, setErrors] = useState({
        patrolName: false,
        description: false,
        estimatedDuration: false,
        startDate: false,
        endDate: false,
    });

    const [questions, setQuestions] = useState<Question[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);

    // Load patrolling data for editing
    useEffect(() => {
        if (id) {
            fetchPatrollingData(parseInt(id));
        }
    }, [id]);

    const fetchPatrollingData = async (patrollingId: number) => {
        setLoading(true);
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;

            if (!baseUrl || !token) {
                throw new Error('API configuration is missing');
            }

            const apiUrl = getFullUrl(`/patrolling/setup/${patrollingId}.json`);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': getAuthHeader()
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                const data = result.data;

                // Populate form fields
                setPatrolName(data.name);
                setDescription(data.description);
                setEstimatedDuration(data.estimated_duration_minutes.toString());
                setAutoTicket(data.auto_ticket);
                setStartDate(data.validity_start_date);
                setEndDate(data.validity_end_date);
                setGrace(data.grace_period_minutes.toString());

                // Populate questions
                setQuestions(data.questions.map((q: any) => ({
                    id: q.id.toString(),
                    task: q.task,
                    inputType: q.type === 'multiple' ? 'multiple_choice' : 'yes_no',
                    mandatory: q.mandatory,
                    options: q.options || [],
                    optionsText: q.options ? q.options.join(', ') : ''
                })));

                // Populate schedules
                setShifts(data.schedules.map((s: any) => ({
                    id: s.id.toString(),
                    name: s.name,
                    start: new Date(s.start_time).toTimeString().slice(0, 5),
                    end: '', // Need to calculate end time
                    assignee: s.assigned_guard_id.toString(),
                    supervisor: s.supervisor_id.toString(),
                    scheduleId: s.id.toString()
                })));

                // Populate checkpoints
                const checkpointsData = data.checkpoints.map((c: any) => ({
                    id: c.id.toString(),
                    name: c.name,
                    description: c.description,
                    buildingId: c.building_id,
                    wingId: c.wing_id,
                    floorId: c.floor_id,
                    areaId: c.area_id,
                    roomId: c.room_id,
                    scheduleIds: c.schedule_ids.map((id: number) => id.toString())
                }));

                setCheckpoints(checkpointsData);

                // Fetch dependent location data for existing checkpoints
                const uniqueBuildingIds = [...new Set(checkpointsData.map(c => c.buildingId).filter(id => id !== null && id !== undefined))] as number[];
                const uniqueWingIds = [...new Set(checkpointsData.map(c => c.wingId).filter(id => id !== null && id !== undefined))] as number[];
                const uniqueAreaIds = [...new Set(checkpointsData.map(c => c.areaId).filter(id => id !== null && id !== undefined))] as number[];
                const uniqueFloorIds = [...new Set(checkpointsData.map(c => c.floorId).filter(id => id !== null && id !== undefined))] as number[];

                // Fetch wings for all unique building IDs
                for (const buildingId of uniqueBuildingIds) {
                    dispatch(fetchWings(buildingId));
                }

                // Fetch areas for all unique wing IDs
                for (const wingId of uniqueWingIds) {
                    dispatch(fetchAreas(wingId));
                }

                // Fetch floors for all unique area IDs
                for (const areaId of uniqueAreaIds) {
                    dispatch(fetchFloors(areaId));
                }

                // Fetch rooms for all unique floor IDs
                for (const floorId of uniqueFloorIds) {
                    dispatch(fetchRooms(floorId));
                }

            } else {
                throw new Error('Failed to fetch patrolling data');
            }
        } catch (error: any) {
            console.error('Error fetching patrolling data:', error);
            toast.error(`Failed to load patrolling data: ${error.message}`, {
                duration: 5000,
            });
            navigate('/security/patrolling');
        } finally {
            setLoading(false);
        }
    };

    // Load FM users on component mount
    useEffect(() => {
        const loadFmUsers = async () => {
            setLoadingUsers(true);
            try {
                const users = await userService.getEscalateToUsers();
                setFmUsers(users);
            } catch (error) {
                console.error('Error loading FM users:', error);
                toast.error('Failed to load users');
            } finally {
                setLoadingUsers(false);
            }
        };
        loadFmUsers();
    }, []);

    // Input change handlers with error clearing
    const handlePatrolNameChange = (value: string) => {
        setPatrolName(value);
        if (value.trim() !== '') {
            setErrors(prev => ({ ...prev, patrolName: false }));
        }
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        if (value.trim() !== '') {
            setErrors(prev => ({ ...prev, description: false }));
        }
    };

    const handleEstimatedDurationChange = (value: string) => {
        setEstimatedDuration(value);
        if (value.trim() !== '') {
            setErrors(prev => ({ ...prev, estimatedDuration: false }));
        }
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        if (value !== '') {
            setErrors(prev => ({ ...prev, startDate: false }));
        }
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
        if (value !== '') {
            setErrors(prev => ({ ...prev, endDate: false }));
        }
    };



    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };

    // Update functions
    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        setQuestions(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const updateShift = (index: number, field: keyof Shift, value: any) => {
        setShifts(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const updateCheckpoint = (index: number, field: keyof Checkpoint, value: any) => {
        setCheckpoints(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const addQuestion = () => setQuestions(prev => [...prev, {
        id: Date.now().toString(),
        task: '',
        inputType: '',
        mandatory: false,
        options: [],
        optionsText: ''
    }]);
    const addShift = () => setShifts(prev => [...prev, {
        id: Date.now().toString(),
        name: '',
        start: '',
        end: '',
        assignee: '',
        supervisor: '',
        scheduleId: Date.now().toString()
    }]);
    const addCheckpoint = () => setCheckpoints(prev => [...prev, {
        id: Date.now().toString(),
        name: '',
        description: '',
        buildingId: null,
        wingId: null,
        floorId: null,
        areaId: null,
        roomId: null,
        scheduleIds: []
    }]);

    const removeCheckpoint = (idx: number) => setCheckpoints(prev => prev.filter((_, i) => i !== idx));
    const removeQuestion = (idx: number) => setQuestions(prev => prev.filter((_, i) => i !== idx));
    const removeShift = (idx: number) => {
        const shiftToRemove = shifts[idx];
        if (shiftToRemove) {
            setShifts(prev => prev.filter((_, i) => i !== idx));
            setCheckpoints(prev => prev.map(checkpoint => ({
                ...checkpoint,
                scheduleIds: checkpoint.scheduleIds.filter(scheduleId => scheduleId !== shiftToRemove.scheduleId)
            })));
        }
    };

    // Handle location changes for checkpoints
    const handleLocationChange = (checkpointIndex: number, location: {
        buildingId: number | null;
        wingId: number | null;
        areaId: number | null;
        floorId: number | null;
        roomId: number | null;
    }) => {
        setCheckpoints(prev => prev.map((item, i) =>
            i === checkpointIndex ? {
                ...item,
                buildingId: location.buildingId,
                wingId: location.wingId,
                floorId: location.floorId,
                areaId: location.areaId,
                roomId: location.roomId
            } : item
        ));
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Basic field validation
        const hasPatrolNameError = patrolName.trim() === '';
        const hasDescriptionError = description.trim() === '';
        const hasEstimatedDurationError = estimatedDuration.trim() === '';
        const hasStartDateError = startDate === '';
        const hasEndDateError = endDate === '';
        const hasGraceError = grace.trim() === '';

        if (hasPatrolNameError || hasDescriptionError || hasEstimatedDurationError || hasStartDateError || hasEndDateError || hasGraceError) {
            setErrors({
                patrolName: hasPatrolNameError,
                description: hasDescriptionError,
                estimatedDuration: hasEstimatedDurationError,
                startDate: hasStartDateError,
                endDate: hasEndDateError,
            });

            const errorFields = [];
            if (hasPatrolNameError) errorFields.push('Patrol Name');
            if (hasDescriptionError) errorFields.push('Description');
            if (hasEstimatedDurationError) errorFields.push('Grace Period');
            if (hasStartDateError) errorFields.push('Start Date');
            if (hasEndDateError) errorFields.push('End Date');

            toast.error(`Please fill in the following required fields: ${errorFields.join(', ')}`, {
                duration: 5000,
            });

            setIsSubmitting(false);
            return;
        }

        // Validity validation
        if (new Date(endDate) <= new Date(startDate)) {
            toast.error('End date must be after start date', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }


        const estimatedDurationNum = parseInt(estimatedDuration);
        if (isNaN(estimatedDurationNum) || estimatedDurationNum <= 0) {
            toast.error('Estimated duration must be a valid positive number', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Questions validation
        const validQuestions = questions.filter(q => q.task.trim() !== '');
        if (validQuestions.length === 0) {
            toast.error('At least one question is required', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Validate question input types
        const questionsWithoutInputType = validQuestions.filter(q => !q.inputType || q.inputType.trim() === '');
        if (questionsWithoutInputType.length > 0) {
            toast.error('All questions must have an input type selected', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Validate multiple choice questions have at least 2 options
        const invalidMultipleChoiceQuestions = validQuestions.filter(q =>
            q.inputType === 'multiple_choice' &&
            (!q.options || q.options.length < 2)
        );

        if (invalidMultipleChoiceQuestions.length > 0) {
            toast.error('Multiple choice questions must have at least 2 options', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Shifts/Schedules validation
        const validShifts = shifts.filter(s => s.name.trim() !== '');
        if (validShifts.length === 0) {
            toast.error('At least one schedule is required', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Validate shift times
        const shiftsWithoutStartTime = validShifts.filter(s => !s.start || s.start.trim() === '');
        if (shiftsWithoutStartTime.length > 0) {
            toast.error('All schedules must have a start time', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Validate shift assignees
        const shiftsWithoutAssignee = validShifts.filter(s => !s.assignee || s.assignee.trim() === '');
        if (shiftsWithoutAssignee.length > 0) {
            toast.error('All schedules must have an assignee', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Validate shift supervisors
        const shiftsWithoutSupervisor = validShifts.filter(s => !s.supervisor || s.supervisor.trim() === '');
        if (shiftsWithoutSupervisor.length > 0) {
            toast.error('All schedules must have a supervisor', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Checkpoints validation
        const validCheckpoints = checkpoints.filter(c => c.name.trim() !== '');
        if (validCheckpoints.length === 0) {
            toast.error('At least one checkpoint is required', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Validate checkpoint descriptions
        const checkpointsWithoutDescription = validCheckpoints.filter(c => !c.description || c.description.trim() === '');
        if (checkpointsWithoutDescription.length > 0) {
            toast.error('All checkpoints must have a description', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }


        // Validate checkpoint schedule assignments
        const checkpointsWithoutSchedules = validCheckpoints.filter(c =>
            !c.scheduleIds || c.scheduleIds.length === 0
        );
        if (checkpointsWithoutSchedules.length > 0) {
            toast.error('All checkpoints must be assigned to at least one schedule', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Validate that assigned schedules exist and are valid
        const allScheduleIds = validShifts.map(s => s.scheduleId);
        const checkpointsWithInvalidSchedules = validCheckpoints.filter(c =>
            c.scheduleIds.some(scheduleId => !allScheduleIds.includes(scheduleId))
        );
        if (checkpointsWithInvalidSchedules.length > 0) {
            toast.error('Some checkpoints are assigned to invalid schedules. Please reassign them.', {
                duration: 5000,
            });
            setIsSubmitting(false);
            return;
        }

        // Build the payload structure to match API
        const payload = {
            "patrolling": {
                "name": patrolName,
                "description": description,
                "auto_ticket": autoTicket,
                "validity_start_date": startDate,
                "validity_end_date": endDate,
                "grace_period_minutes": parseInt(estimatedDuration) || 0,
                "questions": questions.filter(q => q.task.trim() !== '').map(q => {
                    const questionData: any = {
                        "task": q.task,
                        "inputType": q.inputType,
                        "mandatory": q.mandatory,
                        ...(q.inputType === 'multiple_choice' && q.options && q.options.length > 0 && { "options": q.options })
                    };

                    // Only include ID if it's an existing question (not a Date.now() timestamp)
                    const parsedId = parseInt(q.id);
                    if (!isNaN(parsedId) && parsedId < Date.now() - 1000000000000) {
                        questionData.id = parsedId;
                    }

                    return questionData;
                }),
                "schedules": shifts.filter(s => s.name.trim() !== '').map(s => {
                    const scheduleData: any = {
                        "name": s.name,
                        "start_time": s.start,
                        "end_time": s.end,
                        "assigned_guard_id": s.assignee ? parseInt(s.assignee) : null,
                        "supervisor_id": s.supervisor ? parseInt(s.supervisor) : null
                    };

                    // Only include ID if it's an existing schedule (not a Date.now() timestamp)
                    const parsedId = parseInt(s.id);
                    if (!isNaN(parsedId) && parsedId < Date.now() - 1000000000000) {
                        scheduleData.id = parsedId;
                        scheduleData.schedule_id = parsedId;
                    }

                    return scheduleData;
                }),
                "checkpoints": checkpoints.filter(c => c.name.trim() !== '').map(c => {
                    const validScheduleIds = c.scheduleIds.filter(scheduleId => {
                        const correspondingShift = shifts.find(s => s.scheduleId === scheduleId);
                        return correspondingShift && correspondingShift.name.trim() !== '';
                    });

                    const checkpointData: any = {
                        "name": c.name,
                        "description": c.description,
                        "building_id": c.buildingId?.toString() || "",
                        "wing_id": c.wingId?.toString() || "",
                        "floor_id": c.floorId?.toString() || "",
                        "area_id": c.areaId?.toString() || "",
                        "room_id": c.roomId?.toString() || "",
                        "schedule_ids": validScheduleIds.map(scheduleId => {
                            // Map schedule IDs to the actual schedule IDs from shifts
                            const shift = shifts.find(s => s.scheduleId === scheduleId);
                            if (shift) {
                                const parsedId = parseInt(shift.id);
                                // Only use real IDs, not timestamps
                                if (!isNaN(parsedId) && parsedId < Date.now() - 1000000000000) {
                                    return parsedId;
                                }
                            }
                            return null;
                        }).filter(id => id !== null)
                    };

                    // Only include ID if it's an existing checkpoint (not a Date.now() timestamp)
                    const parsedId = parseInt(c.id);
                    if (!isNaN(parsedId) && parsedId < Date.now() - 1000000000000) {
                        checkpointData.id = parsedId;
                    }

                    return checkpointData;
                })
            }
        };

        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;

            if (!baseUrl || !token) {
                throw new Error('API configuration is missing');
            }

            const apiUrl = getFullUrl(`/patrolling/setup/${id}.json`);

            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': getAuthHeader()
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ API Response:', result);

            toast.success('Patrolling updated successfully!', {
                duration: 3000,
            });

            setTimeout(() => {
                navigate('/security/patrolling');
            }, 1000);
        } catch (error: any) {
            console.error('Error updating patrolling:', error.message || error);
            toast.error(`Failed to update patrolling: ${error.message || 'Unknown error'}`, {
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                    <span className="ml-2 text-gray-600">Loading patrolling data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 relative">
            {isSubmitting && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                </div>
            )}

            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/security/patrolling')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-xl font-bold tracking-wide uppercase">Edit Patrolling</h1>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span>Auto-ticket</span>
                    <Switch checked={autoTicket} onCheckedChange={setAutoTicket} />
                </div>
            </header>

            <Section title="Patrol Details" icon={<Type className="w-3.5 h-3.5" />}>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <TextField
                                label={<>Name<span className="text-red-500">*</span></>}
                                placeholder="Enter Patrol Name"
                                value={patrolName}
                                onChange={(e) => handlePatrolNameChange(e.target.value)}
                                fullWidth
                                variant="outlined"
                                error={errors.patrolName}
                                helperText={errors.patrolName ? 'Patrol Name is required' : ''}
                                slotProps={{ inputLabel: { shrink: true } }}
                                InputProps={{ sx: fieldStyles }}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <TextField
                                label={<>Description<span className="text-red-500">*</span></>}
                                value={description}
                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                fullWidth
                                variant="outlined"
                                error={errors.description}
                                helperText={errors.description ? 'Description is required' : ''}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                InputProps={{
                                    sx: fieldStyles,
                                }}
                                disabled={isSubmitting}
                            />
                        </div>

                    </div>


                </div>
            </Section>

            <Section title="Validity" icon={<CalendarRange className="w-3.5 h-3.5" />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <TextField
                            type="date"
                            label={<>Start Date<span className="text-red-500">*</span></>}
                            value={startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            fullWidth
                            variant="outlined"
                            error={errors.startDate}
                            helperText={errors.startDate ? 'Start Date is required' : ''}
                            slotProps={{ inputLabel: { shrink: true } }}
                            InputProps={{ sx: fieldStyles }}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <TextField
                            type="date"
                            label={<>End Date<span className="text-red-500">*</span></>}
                            value={endDate}
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            fullWidth
                            variant="outlined"
                            error={errors.endDate}
                            helperText={errors.endDate ? 'End Date is required' : ''}
                            slotProps={{ inputLabel: { shrink: true } }}
                            InputProps={{ sx: fieldStyles }}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <TextField
                            type="number"
                            label={<>Grace Period (minutes)<span className="text-red-500">*</span></>}
                            placeholder="Enter grace period in minutes"
                            value={estimatedDuration}
                            onChange={(e) => handleEstimatedDurationChange(e.target.value)}
                            fullWidth
                            variant="outlined"
                            error={errors.estimatedDuration}
                            helperText={errors.estimatedDuration ? 'Grace Period is required' : ''}
                            slotProps={{ inputLabel: { shrink: true } }}
                            InputProps={{ sx: fieldStyles }}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </Section>

            <Section title="Question" icon={<ListChecks className="w-3.5 h-3.5" />}>
                <div className="space-y-4">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="relative rounded-md border border-dashed bg-muted/30 p-4">
                            {idx > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(idx)}
                                    className="absolute -right-2 -top-2 rounded-full p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Remove question"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div>
                                    <Label className="mb-1 block">Mandatory</Label>
                                    <div className="flex items-center gap-2 bg-muted rounded-md p-2 border border-border">
                                        <Switch checked={q.mandatory} onCheckedChange={(v) => updateQuestion(idx, 'mandatory', Boolean(v))} />
                                    </div>
                                </div>
                                <div>
                                    <TextField
                                        label="Task"
                                        placeholder="Enter Task"
                                        value={q.task}
                                        onChange={(e) => updateQuestion(idx, 'task', e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        InputProps={{ sx: fieldStyles }}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                                        <InputLabel shrink>Input Type</InputLabel>
                                        <MuiSelect
                                            value={q.inputType}
                                            onChange={(e) => updateQuestion(idx, 'inputType', String(e.target.value))}
                                            label="Input Type"
                                            notched
                                            displayEmpty
                                            disabled={isSubmitting}
                                        >
                                            <MenuItem value="">Select Input Type</MenuItem>
                                            <MenuItem value="yes_no">Yes/No</MenuItem>
                                            <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                                        </MuiSelect>
                                    </FormControl>
                                </div>
                            </div>

                            {q.inputType === 'multiple_choice' && (
                                <div className="mt-4">
                                    <Label className="mb-2 block">Options (comma separated)</Label>
                                    <div className="relative">
                                        <div className="w-full">
                                            {/* Simple comma-separated input that works */}
                                            <input
                                                type="text"
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                                placeholder="Option 1, Option 2, Option 3"
                                                value={q.optionsText || ''}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    // Parse options for preview/validation
                                                    const optionsArray = inputValue
                                                        .split(',')
                                                        .map(opt => opt.trim())
                                                        .filter(opt => opt !== '');

                                                    // Update both raw text and parsed options
                                                    updateQuestion(idx, 'optionsText', inputValue);
                                                    updateQuestion(idx, 'options', optionsArray);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const inputValue = e.currentTarget.value;
                                                        const optionsArray = inputValue
                                                            .split(',')
                                                            .map(opt => opt.trim())
                                                            .filter(opt => opt !== '');
                                                        updateQuestion(idx, 'options', optionsArray);
                                                    }
                                                }}
                                                autoComplete="off"
                                                spellCheck={false}
                                                disabled={isSubmitting}
                                                style={{
                                                    height: '45px',
                                                    fontSize: '14px',
                                                }}
                                            />

                                            {/* Help text and examples */}
                                            <div className="mt-1 text-xs text-gray-600">
                                                Enter options separated by commas. At least 2 options required for multiple choice.
                                            </div>

                                            {/* Show examples when field is empty */}
                                            {(!q.options || q.options.length === 0) && (
                                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                                    <p className="font-medium text-blue-800 mb-1">💡 Examples:</p>
                                                    <div className="text-blue-700 space-y-1">
                                                        <div>• <code>Yes, No, Maybe</code></div>
                                                        <div>• <code>Secure, Issues Found, Needs Attention</code></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show parsed options preview */}
                                            {q.options && q.options.length > 0 && (
                                                <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs">
                                                    <p className="font-medium text-gray-800 mb-1">
                                                        ✅ Multi-Options ({q.options.length}):
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {q.options.map((option, optIdx) => (
                                                            <span
                                                                key={optIdx}
                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded group"
                                                            >
                                                                {option}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newOptions = q.options?.filter((_, i) => i !== optIdx) || [];
                                                                        const newOptionsText = newOptions.join(', ');
                                                                        updateQuestion(idx, 'options', newOptions);
                                                                        updateQuestion(idx, 'optionsText', newOptionsText);
                                                                    }}
                                                                    className="ml-1 text-gray-600 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    disabled={isSubmitting}
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {q.options.length < 2 && (
                                                        <p className="text-amber-600 mt-1">
                                                            ⚠️ Add at least {2 - q.options.length} more option(s)
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={addQuestion} disabled={isSubmitting}>
                            <Plus className="w-4 h-4 mr-2" /> Add Question
                        </Button>
                    </div>
                </div>
            </Section>

            <Section title="Schedule Setup" icon={<Clock className="w-3.5 h-3.5" />}>
                <div className="space-y-4">
                    {shifts.map((s, idx) => (
                        <div key={s.id} className="relative rounded-md border border-dashed bg-muted/30 p-4">
                            {idx > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeShift(idx)}
                                    className="absolute -right-2 -top-2 rounded-full p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Remove shift"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <p className="mb-3 text-sm font-medium text-muted-foreground">Schedule {idx + 1}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <TextField
                                        label="Schedule Name"
                                        placeholder="Enter Schedule Name"
                                        value={s.name}
                                        onChange={(e) => updateShift(idx, 'name', e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        InputProps={{ sx: fieldStyles }}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        type="time"
                                        label="Start Time"
                                        value={s.start}
                                        onChange={(e) => updateShift(idx, 'start', e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        InputProps={{ sx: fieldStyles }}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        type="time"
                                        label="End Time"
                                        value={s.end}
                                        onChange={(e) => updateShift(idx, 'end', e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        InputProps={{ sx: fieldStyles }}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                                        <InputLabel shrink>Assignee</InputLabel>
                                        <MuiSelect
                                            value={s.assignee}
                                            onChange={(e) => updateShift(idx, 'assignee', String(e.target.value))}
                                            label="Assignee"
                                            notched
                                            displayEmpty
                                            disabled={isSubmitting || loadingUsers}
                                        >
                                            <MenuItem value="">Select Assignee</MenuItem>
                                            {loadingUsers ? (
                                                <MenuItem disabled>
                                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                                    Loading users...
                                                </MenuItem>
                                            ) : (
                                                fmUsers.map((user) => (
                                                    <MenuItem key={user.id} value={user.id.toString()}>
                                                        {user.full_name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </MuiSelect>
                                    </FormControl>
                                </div>
                                <div>
                                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                                        <InputLabel shrink>Supervisor</InputLabel>
                                        <MuiSelect
                                            value={s.supervisor}
                                            onChange={(e) => updateShift(idx, 'supervisor', String(e.target.value))}
                                            label="Supervisor"
                                            notched
                                            displayEmpty
                                            disabled={isSubmitting || loadingUsers}
                                        >
                                            <MenuItem value="">Select Supervisor</MenuItem>
                                            {loadingUsers ? (
                                                <MenuItem disabled>
                                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                                    Loading users...
                                                </MenuItem>
                                            ) : (
                                                fmUsers.map((user) => (
                                                    <MenuItem key={user.id} value={user.id.toString()}>
                                                        {user.full_name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </MuiSelect>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={addShift} disabled={isSubmitting}>
                            <Plus className="w-4 h-4 mr-2" /> Add Schedule
                        </Button>
                    </div>
                </div>
            </Section>

            <Section title="Checkpoint Setup" icon={<MapPin className="w-3.5 h-3.5" />}>
                <div className="space-y-6">
                    {checkpoints.map((c, idx) => (
                        <div key={c.id} className="relative rounded-md border border-dashed bg-muted/30 p-4">
                            {idx > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeCheckpoint(idx)}
                                    className="absolute -right-2 -top-2 rounded-full p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Remove checkpoint"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <p className="mb-3 text-sm font-medium text-muted-foreground">Checkpoint {idx + 1}</p>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <TextField
                                            label="Checkpoint Name"
                                            placeholder="Enter checkpoint name"
                                            value={c.name}
                                            onChange={(e) => updateCheckpoint(idx, 'name', e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            InputProps={{ sx: fieldStyles }}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            label="Description"
                                            placeholder="Enter checkpoint description"
                                            value={c.description}
                                            onChange={(e) => updateCheckpoint(idx, 'description', e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            InputProps={{ sx: fieldStyles }}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <CheckpointLocationSelector
                                    fieldStyles={fieldStyles}
                                    onLocationChange={(location) => handleLocationChange(idx, location)}
                                    disabled={isSubmitting}
                                    checkpointIndex={idx}
                                    currentLocation={{
                                        buildingId: c.buildingId,
                                        wingId: c.wingId,
                                        areaId: c.areaId,
                                        floorId: c.floorId,
                                        roomId: c.roomId,
                                    }}
                                />

                                {shifts.some(s => s.name.trim() !== '') && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                                                <InputLabel shrink>Schedules</InputLabel>
                                                <MuiSelect
                                                    multiple
                                                    value={c.scheduleIds.filter(scheduleId => {
                                                        const shift = shifts.find(s => s.scheduleId === scheduleId);
                                                        return shift && shift.name.trim() !== '';
                                                    })}
                                                    onChange={(e) => {
                                                        const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                                                        const validScheduleIds = value.filter(scheduleId => {
                                                            const shift = shifts.find(s => s.scheduleId === scheduleId);
                                                            return shift && shift.name.trim() !== '';
                                                        });
                                                        updateCheckpoint(idx, 'scheduleIds', validScheduleIds);
                                                    }}
                                                    label="Schedules"
                                                    notched
                                                    displayEmpty
                                                    disabled={isSubmitting}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) return 'Select Schedules';
                                                        return selected.map(scheduleId => {
                                                            const shift = shifts.find(s => s.scheduleId === scheduleId);
                                                            return shift?.name || 'Unknown';
                                                        }).filter(name => name !== 'Unknown').join(', ');
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Schedules</em>
                                                    </MenuItem>
                                                    {shifts.filter(s => s.name.trim() !== '').map((s) => (
                                                        <MenuItem key={s.scheduleId} value={s.scheduleId}>
                                                            {s.name}
                                                        </MenuItem>
                                                    ))}
                                                </MuiSelect>
                                            </FormControl>
                                        </div>
                                    </div>
                                )}

                                {!shifts.some(s => s.name.trim() !== '') && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex items-center justify-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                                            <p className="text-sm text-gray-500">
                                                Create shifts in the Schedule Setup section to assign them to checkpoints
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={addCheckpoint} disabled={isSubmitting}>
                            <Plus className="w-4 h-4 mr-2" /> Add Checkpoint
                        </Button>
                    </div>
                </div>
            </Section>

            <div className="flex items-center gap-3 justify-center pt-2">
                <Button
                    variant="destructive"
                    className="px-8"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        'Update'
                    )}
                </Button>
                <Button
                    variant="outline"
                    className="px-8"
                    onClick={() => navigate('/security/patrolling')}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};
