import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, Type, CalendarRange, ListChecks, Clock, MapPin, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, InputAdornment, CircularProgress, Radio, RadioGroup, FormControlLabel, Autocomplete } from '@mui/material';
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
  setSelectedSite,
  setSelectedBuilding,
  setSelectedWing,
  setSelectedArea,
  setSelectedFloor,
  setSelectedRoom,
  clearAllSelections,
} from '@/store/slices/serviceLocationSlice';
import { userService, User } from '@/services/userService';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { TimeSetupStep } from '@/components/schedule/TimeSetupStep';

// Section component defined outside to prevent re-creation on every render
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

// Custom Location Selector for Checkpoints (without Groups)
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

  // Use currentLocation from props instead of Redux state to avoid conflicts between checkpoints
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
        {loading.buildings && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <CircularProgress size={16} />
          </div>
        )}
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
        {loading.wings && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <CircularProgress size={16} />
          </div>
        )}
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
        {loading.areas && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <CircularProgress size={16} />
          </div>
        )}
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
        {loading.floors && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <CircularProgress size={16} />
          </div>
        )}
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
        {loading.rooms && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <CircularProgress size={16} />
          </div>
        )}
      </FormControl>
    </div>
  );
};

export const PatrollingCreatePage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'Create Patrolling'; }, []);

  type Question = {
    id: string;
    task: string;
    inputType: string;
    mandatory: boolean;
    options?: string[];
    optionsText?: string; // Store raw input text for options
  };
  type TimeSetupDataType = {
    hourMode: string;
    minuteMode: string;
    dayMode: string;
    monthMode: string;
    selectedHours: string[];
    selectedMinutes: string[];
    selectedWeekdays: string[];
    selectedDays: string[];
    selectedMonths: string[];
    betweenMinuteStart: string;
    betweenMinuteEnd: string;
    betweenMonthStart: string;
    betweenMonthEnd: string;
  };
  type Shift = {
    id: string;
    start: string;
    end: string;
    assignee: string;
    supervisor: string;
    scheduleId: string;
    timeSetup: TimeSetupDataType;
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

  const [patrolName, setPatrolName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [grace, setGrace] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [questions, setQuestions] = useState<Question[]>([{
    id: `q-${Date.now()}`,
    task: '',
    inputType: '',
    mandatory: false,
    options: [],
    optionsText: ''
  }]);

  // Checklist dropdown state
  const [checklistOptions, setChecklistOptions] = useState<{ id: string; name: string; raw?: any }[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<{ id: string; name: string; raw?: any } | null>(null);
  const [isChecklistLoading, setIsChecklistLoading] = useState(false);

  // Fetch checklist options on mount
  useEffect(() => {
    const fetchChecklists = async () => {
      setIsChecklistLoading(true);
      try {
        const url = `${API_CONFIG.BASE_URL}/pms/admin/snag_checklists.json?q[check_type_eq]=patrolling`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch checklists');
        const data = await response.json();
        // Support both array and single object response
        let checklists = [];
        if (Array.isArray(data)) {
          checklists = data;
        } else if (Array.isArray(data.snag_checklists)) {
          checklists = data.snag_checklists;
        } else if (data.id && data.name) {
          checklists = [data];
        }
        const options = checklists.map((item) => ({ id: item.id.toString(), name: item.name, raw: item }));
        setChecklistOptions(options);
      } catch (error) {
        setChecklistOptions([]);
      } finally {
        setIsChecklistLoading(false);
      }
    };
    fetchChecklists();
  }, []);

  // When checklist is selected, fill questions and disable editing
  useEffect(() => {
    if (selectedChecklist && selectedChecklist.raw && selectedChecklist.raw.snag_questions) {
      const filledQuestions = selectedChecklist.raw.snag_questions.map((q: any) => {
        // Map API question types to UI input types
        let inputType = '';
        switch (q.qtype) {
          case 'multiple':
            inputType = 'multiple_choice';
            break;
          case 'yesno':
            inputType = 'yes_no';
            break;
          case 'rating':
            inputType = 'rating';
            break;
          case 'input':
            inputType = 'text_input';
            break;
          case 'description':
            inputType = 'description';
            break;
          case 'emoji':
            inputType = 'emoji';
            break;
          default:
            inputType = '';
        }

        return {
          id: q.id.toString(),
          task: q.descr,
          inputType,
          mandatory: !!q.quest_mandatory,
          options: q.snag_quest_options ? q.snag_quest_options.map((opt: any) => opt.qname) : [],
          optionsText: q.snag_quest_options ? q.snag_quest_options.map((opt: any) => opt.qname).join(', ') : ''
        };
      });
      setQuestions(filledQuestions);
    }
  }, [selectedChecklist]);
  const defaultTimeSetup: TimeSetupDataType = {
    hourMode: 'specific',
    minuteMode: 'specific',
    dayMode: 'weekdays',
    monthMode: 'all',
    selectedHours: ['12'],
    selectedMinutes: ['00'],
    selectedWeekdays: [],
    selectedDays: [],
    selectedMonths: [],
    betweenMinuteStart: '00',
    betweenMinuteEnd: '59',
    betweenMonthStart: 'January',
    betweenMonthEnd: 'December'
  };
  const [shifts, setShifts] = useState<Shift[]>([{
    id: `s-${Date.now()}`,
    start: '',
    end: '',
    assignee: '',
    supervisor: '',
    scheduleId: Date.now().toString(),
    timeSetup: { ...defaultTimeSetup }
  }]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    {
      id: `c-${Date.now()}`,
      name: '',
      description: '',
      buildingId: null,
      wingId: null,
      floorId: null,
      areaId: null,
      roomId: null,
      scheduleIds: []
    },
  ]);

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

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  // Input change handlers for controlled fields
  const handlePatrolNameChange = (value: string) => setPatrolName(value);
  const handleDescriptionChange = (value: string) => setDescription(value);
  const handleEstimatedDurationChange = (value: string) => setEstimatedDuration(value);
  const handleStartDateChange = (value: string) => setStartDate(value);
  const handleEndDateChange = (value: string) => setEndDate(value);

  // Time setup validation for each shift (copied from AddSchedulePage)
  const validateTimeSetup = (timeSetup) => {
    if (timeSetup.hourMode === 'specific' && (!Array.isArray(timeSetup.selectedHours) || timeSetup.selectedHours.length === 0)) {
      return 'At least one hour must be selected when using specific hours';
    }
    if (timeSetup.minuteMode === 'specific' && (!Array.isArray(timeSetup.selectedMinutes) || timeSetup.selectedMinutes.length === 0)) {
      return 'At least one minute must be selected when using specific minutes';
    }
    if (timeSetup.minuteMode === 'between') {
      if (!timeSetup.betweenMinuteStart || !timeSetup.betweenMinuteEnd) {
        return 'Both start and end minutes are required for between minute range';
      }
    }
    if (timeSetup.dayMode === 'weekdays' && (!Array.isArray(timeSetup.selectedWeekdays) || timeSetup.selectedWeekdays.length === 0)) {
      return 'At least one weekday must be selected when using weekdays';
    }
    if (timeSetup.dayMode === 'specific' && (!Array.isArray(timeSetup.selectedDays) || timeSetup.selectedDays.length === 0)) {
      return 'At least one day must be selected when using specific days';
    }
    if (timeSetup.monthMode === 'specific' && (!Array.isArray(timeSetup.selectedMonths) || timeSetup.selectedMonths.length === 0)) {
      return 'At least one month must be selected when using specific months';
    }
    if (timeSetup.monthMode === 'between') {
      if (!timeSetup.betweenMonthStart || !timeSetup.betweenMonthEnd) {
        return 'Both start and end months are required for between month range';
      }
    }
    return null;
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
    start: '',
    end: '',
    assignee: '',
    supervisor: '',
    scheduleId: Date.now().toString(),
    timeSetup: { ...defaultTimeSetup }
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
      // Remove the shift
      setShifts(prev => prev.filter((_, i) => i !== idx));

      // Clean up references to this shift in all checkpoints
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

  // Helper function to get shift names by schedule IDs
  const getShiftNamesByScheduleIds = (scheduleIds: string[]) => {
    return scheduleIds.map(scheduleId => {
      const shift = shifts.find(s => s.scheduleId === scheduleId);
      return shift ? `Shift ${shift.id}` : 'Unknown Shift';
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Basic field validation
    const hasPatrolNameError = patrolName.trim() === '';
    const hasEstimatedDurationError = estimatedDuration.trim() === '';
    const hasStartDateError = startDate === '';
    const hasEndDateError = endDate === '';

    if (hasPatrolNameError || hasEstimatedDurationError || hasStartDateError || hasEndDateError) {
      setErrors({
        patrolName: hasPatrolNameError,
        description: false, // Description is now optional
        estimatedDuration: hasEstimatedDurationError,
        startDate: hasStartDateError,
        endDate: hasEndDateError,
      });

      const errorFields = [];
      if (hasPatrolNameError) errorFields.push('Patrol Name');
      if (hasEstimatedDurationError) errorFields.push('Estimated Duration');
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
    const validShifts = shifts;

    // Validate shift times
    // Validate time setup for each shift
    for (const s of validShifts) {
      const timeSetupError = validateTimeSetup(s.timeSetup);
      if (timeSetupError) {
        toast.error(`Schedule time setup error: ${timeSetupError}`, { duration: 5000 });
        setIsSubmitting(false);
        return;
      }
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

    // Validate checkpoint locations
    const checkpointsWithoutLocation = validCheckpoints.filter(c => {
      const hasBuilding = c.buildingId && c.buildingId > 0;
      const hasWing = c.wingId && c.wingId > 0;
      const hasArea = c.areaId && c.areaId > 0;
      const hasFloor = c.floorId && c.floorId > 0;
      return !(hasBuilding && hasWing && hasArea && hasFloor);
    });
    if (checkpointsWithoutLocation.length > 0) {
      toast.error('All checkpoints must have Building, Wing, Area, and Floor selected', {
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    // Validate checkpoint schedule assignments
    // Removed checkpoint schedule assignment validation

    // Validate that assigned schedules exist and are valid
    // Removed checkpoint schedule ID validation

    // Clear all errors
    setErrors({
      patrolName: false,
      description: false,
      estimatedDuration: false,
      startDate: false,
      endDate: false,
    });


    // Helper function for cron expression
    const buildCronExpression = (setup) => {
      let minute = '*';
      let hour = '*';
      let dayOfMonth = '?';
      let month = '*';
      let dayOfWeek = '?';

      if (setup.minuteMode === 'specific' && setup.selectedMinutes.length > 0) {
        minute = setup.selectedMinutes.join(',');
      } else if (setup.minuteMode === 'between') {
        const start = parseInt(setup.betweenMinuteStart);
        const end = parseInt(setup.betweenMinuteEnd);
        minute = `${start}-${end}`;
      }
      if (setup.hourMode === 'specific' && setup.selectedHours.length > 0) {
        hour = setup.selectedHours.join(',');
      }
      if (setup.dayMode === 'weekdays' && setup.selectedWeekdays.length > 0) {
        const weekdayMap = {
          'Sunday': '1',
          'Monday': '2',
          'Tuesday': '3',
          'Wednesday': '4',
          'Thursday': '5',
          'Friday': '6',
          'Saturday': '7'
        };
        dayOfWeek = setup.selectedWeekdays.map(day => weekdayMap[day]).join(',');
        dayOfMonth = '?';
      } else if (setup.dayMode === 'specific' && setup.selectedDays.length > 0) {
        dayOfMonth = setup.selectedDays.join(',');
        dayOfWeek = '?';
      }
      if (setup.monthMode === 'specific' && setup.selectedMonths.length > 0) {
        const monthMap = {
          'January': '1', 'February': '2', 'March': '3', 'April': '4',
          'May': '5', 'June': '6', 'July': '7', 'August': '8',
          'September': '9', 'October': '10', 'November': '11', 'December': '12'
        };
        month = setup.selectedMonths.map(m => monthMap[m]).join(',');
      } else if (setup.monthMode === 'between') {
        const monthMap = {
          'January': 1, 'February': 2, 'March': 3, 'April': 4,
          'May': 5, 'June': 6, 'July': 7, 'August': 8,
          'September': 9, 'October': 10, 'November': 11, 'December': 12
        };
        const startMonth = monthMap[setup.betweenMonthStart];
        const endMonth = monthMap[setup.betweenMonthEnd];
        month = `${startMonth}-${endMonth}`;
      }
      return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    };

    

    // Build the payload structure to match API
    const payload = {
      "patrolling": {
        "name": patrolName,
        "description": description,
        "validity_start_date": startDate,
        ...(selectedChecklist && { "checklist_id": selectedChecklist.id }),
        "validity_end_date": endDate,
        "grace_period_minutes": parseInt(estimatedDuration) || 0,
       
        "schedules": shifts.map(s => {
          const assigneeUser = fmUsers.find(u => u.id.toString() === s.assignee);
          const supervisorUser = fmUsers.find(u => u.id.toString() === s.supervisor);

          // Build cron fields for this shift's time setup
          let cronMinute = "off";
          let cronMinuteSpecificSpecific = "";
          if (s.timeSetup.minuteMode === 'specific' && s.timeSetup.selectedMinutes.length > 0) {
            cronMinute = "on";
            cronMinuteSpecificSpecific = s.timeSetup.selectedMinutes.join(',');
          }

          let cronHour = "off";
          let cronHourSpecificSpecific = "";
          if (s.timeSetup.hourMode === 'specific' && s.timeSetup.selectedHours.length > 0) {
            cronHour = "on";
            cronHourSpecificSpecific = s.timeSetup.selectedHours.join(',');
          }

          let cronDay = "off";
          if (s.timeSetup.dayMode === 'weekdays' && s.timeSetup.selectedWeekdays.length > 0) {
            cronDay = "on";
          } else if (s.timeSetup.dayMode === 'specific' && s.timeSetup.selectedDays.length > 0) {
            cronDay = "on";
          }

          let cronMonth = "off";
          if (s.timeSetup.monthMode === 'specific' && s.timeSetup.selectedMonths.length > 0) {
            cronMonth = "on";
          } else if (s.timeSetup.monthMode === 'between') {
            cronMonth = "on";
          } else if (s.timeSetup.monthMode === 'all') {
            cronMonth = "on";
          }

          // Build cron expression for this shift
          const buildCronExpression = (setup) => {
            let minute = '*';
            let hour = '*';
            let dayOfMonth = '?';
            let month = '*';
            let dayOfWeek = '?';

            if (setup.minuteMode === 'specific' && setup.selectedMinutes.length > 0) {
              minute = setup.selectedMinutes.join(',');
            } else if (setup.minuteMode === 'between') {
              const start = parseInt(setup.betweenMinuteStart);
              const end = parseInt(setup.betweenMinuteEnd);
              minute = `${start}-${end}`;
            }
            if (setup.hourMode === 'specific' && setup.selectedHours.length > 0) {
              hour = setup.selectedHours.join(',');
            }
            if (setup.dayMode === 'weekdays' && setup.selectedWeekdays.length > 0) {
              const weekdayMap = {
                'Sunday': '1',
                'Monday': '2',
                'Tuesday': '3',
                'Wednesday': '4',
                'Thursday': '5',
                'Friday': '6',
                'Saturday': '7'
              };
              dayOfWeek = setup.selectedWeekdays.map(day => weekdayMap[day]).join(',');
              dayOfMonth = '?';
            } else if (setup.dayMode === 'specific' && setup.selectedDays.length > 0) {
              dayOfMonth = setup.selectedDays.join(',');
              dayOfWeek = '?';
            }
            if (setup.monthMode === 'specific' && setup.selectedMonths.length > 0) {
              const monthMap = {
                'January': '1', 'February': '2', 'March': '3', 'April': '4',
                'May': '5', 'June': '6', 'July': '7', 'August': '8',
                'September': '9', 'October': '10', 'November': '11', 'December': '12'
              };
              month = setup.selectedMonths.map(m => monthMap[m]).join(',');
            } else if (setup.monthMode === 'between') {
              const monthMap = {
                'January': 1, 'February': 2, 'March': 3, 'April': 4,
                'May': 5, 'June': 6, 'July': 7, 'August': 8,
                'September': 9, 'October': 10, 'November': 11, 'December': 12
              };
              const startMonth = monthMap[setup.betweenMonthStart];
              const endMonth = monthMap[setup.betweenMonthEnd];
              month = `${startMonth}-${endMonth}`;
            }
            return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
          };

          const cron_expression = buildCronExpression(s.timeSetup);

          return {
            // Removed schedule name
            "assigned_guard_id": s.assignee ? parseInt(s.assignee) : null,
            "supervisor_id": s.supervisor ? parseInt(s.supervisor) : null,
            "schedule_id": parseInt(s.scheduleId) || Date.now(),
            "time_setup": {
              hour_mode: s.timeSetup.hourMode,
              minute_mode: s.timeSetup.minuteMode,
              day_mode: s.timeSetup.dayMode,
              month_mode: s.timeSetup.monthMode,
              selected_hours: s.timeSetup.selectedHours,
              selected_minutes: s.timeSetup.selectedMinutes,
              selected_weekdays: s.timeSetup.selectedWeekdays,
              selected_days: s.timeSetup.selectedDays,
              selected_months: s.timeSetup.selectedMonths,
              between_minute_start: s.timeSetup.betweenMinuteStart,
              between_minute_end: s.timeSetup.betweenMinuteEnd,
              between_month_start: s.timeSetup.betweenMonthStart,
              between_month_end: s.timeSetup.betweenMonthEnd,
              cronMinute,
              cronMinuteSpecificSpecific,
              cronHour,
              cronHourSpecificSpecific,
              cronDay,
              cronMonth,
              cron_expression
            }
          };
        }),
        "checkpoints": checkpoints.filter(c => c.name.trim() !== '').map(c => {
          const validScheduleIds = c.scheduleIds.filter(scheduleId => {
            const correspondingShift = shifts.find(s => s.scheduleId === scheduleId);
            return !!correspondingShift;
          });
          return {
            "name": c.name,
            "description": c.description,
            "building_id": c.buildingId?.toString() || "",
            "wing_id": c.wingId?.toString() || "",
            "floor_id": c.floorId?.toString() || "",
            "area_id": c.areaId?.toString() || "",
            "room_id": c.roomId?.toString() || "",
            "schedule_ids": validScheduleIds.map(id => parseInt(id)).filter(id => !isNaN(id))
          };
        })
      }
    };

    console.log('📤 Payload Structure:', JSON.stringify(payload, null, 2));
    // Removed payload summary logging for questions and schedule name

    try {
      // Dynamic API Configuration
      // The base URL and token are retrieved from localStorage dynamically
      // This allows the app to work with different environments and users
      // without hardcoding URLs or tokens
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      console.log('🔧 API Configuration Check:', {
        baseUrl: baseUrl ? 'Present' : 'Missing',
        token: token ? 'Present' : 'Missing',
        baseUrlValue: baseUrl,
        tokenLength: token?.length || 0
      });

      if (!baseUrl || !token) {
        const missingItems = [];
        if (!baseUrl) missingItems.push('Base URL');
        if (!token) missingItems.push('Authentication Token');

        throw new Error(`API configuration is missing: ${missingItems.join(', ')}. Please ensure you are logged in.`);
      }

      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.PATROLLING_SETUP);
      console.log('🔗 Final API URL:', apiUrl);
      console.log('🔑 Authorization Header:', getAuthHeader().substring(0, 20) + '...');

      // API call to create patrolling
      const response = await fetch(apiUrl, {
        method: 'POST',
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

      toast.success('Patrolling created successfully!', {
        duration: 3000,
      });

      setTimeout(() => {
        navigate('/security/patrolling');
      }, 1000);
    } catch (error: any) {
      console.error('Error creating patrolling:', error.message || error);
      toast.error(`Failed to create patrolling: ${error.message || 'Unknown error'}`, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      )}
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide uppercase">Patrolling</h1>
      </header>

      <Section title="Patrol Details" icon={<Type className="w-3.5 h-3.5" />}>
        <div className="space-y-6">
          {/* Name and Duration on first row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TextField
                label={
                  <>
                    Name<span className="text-red-500">*</span>
                  </>
                }
                placeholder="Enter Patrol Name"
                value={patrolName}
                onChange={(e) => handlePatrolNameChange(e.target.value)}
                fullWidth
                variant="outlined"
                error={errors.patrolName}
                helperText={errors.patrolName ? 'Patrol Name is required' : ''}
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
            <div>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                fullWidth
                variant="outlined"
                error={errors.description}
                helperText={errors.description ? 'Patrol Description is required' : ''}
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

          {/* Description on second row - full width */}

        </div>
      </Section>

      <Section title="Validity" icon={<CalendarRange className="w-3.5 h-3.5" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <TextField
              type="date"
              label={
                <>
                  Start Date<span className="text-red-500">*</span>
                </>
              }
              placeholder="Select Start Date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.startDate}
              helperText={errors.startDate ? 'Start Date is required' : ''}
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
          <div>
            <TextField
              type="date"
              label={
                <>
                  End Date<span className="text-red-500">*</span>
                </>
              }
              placeholder="Select End Date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.endDate}
              helperText={errors.endDate ? 'End Date is required' : ''}
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

          <div>
            <TextField
              type="number"
              label={
                <>
                  Grace Period (minutes)<span className="text-red-500">*</span>
                </>
              }
              placeholder="Enter grace period in minutes"
              value={estimatedDuration}
              onChange={(e) => handleEstimatedDurationChange(e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.estimatedDuration}
              helperText={errors.estimatedDuration ? 'Grace Period is required' : ''}
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
      </Section>

      <Section title="Question" icon={<ListChecks className="w-3.5 h-3.5" />}>
        <div className="space-y-4">
          {/* Checklist Dropdown */}
          <div className="mb-4">
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Checklist</InputLabel>
              <MuiSelect
                value={selectedChecklist?.id || ''}
                onChange={e => {
                  const selected = checklistOptions.find(opt => opt.id === e.target.value);
                  setSelectedChecklist(selected || null);
                }}
                label="Checklist"
                notched
                displayEmpty
                disabled={isSubmitting || isChecklistLoading}
              >
                <MenuItem value="">Select Checklist</MenuItem>
                {checklistOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            {selectedChecklist && (
              <div className="mt-2 text-xs text-gray-600">Selected: <span className="font-semibold">{selectedChecklist.name}</span></div>
            )}
          </div>
          {questions.map((q, idx) => (
            <div key={q.id} className="relative rounded-md border border-dashed bg-muted/30 p-4">
              {/* First Row - Mandatory Checkbox */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`mandatory-${idx}`}
                    checked={q.mandatory}
                    className="w-4 h-4 text-[#C72030] bg-white border-gray-300 rounded focus:ring-[#C72030] focus:ring-2 accent-[#C72030]"
                    disabled
                  />
                  <label 
                    htmlFor={`mandatory-${idx}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    Mandatory
                  </label>
                </div>
              </div>

              {/* Second Row - Task and Input Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <TextField
                    label={
                      <>
                        Question<span className="text-red-500">*</span>
                      </>
                    }
                    placeholder="Enter Task"
                    value={q.task}
                    fullWidth
                    variant="outlined"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    InputProps={{
                      sx: fieldStyles,
                    }}
                    disabled
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Input Type<span className="text-red-500">*</span></InputLabel>
                    <MuiSelect
                      value={q.inputType}
                      label="Input Type*"
                      notched
                      displayEmpty
                      disabled
                    >
                      <MenuItem value="">Select Input Type</MenuItem>
                      <MenuItem value="yes_no">Yes/No</MenuItem>
                      <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="text_input">Text Input</MenuItem>
                      <MenuItem value="description">Description</MenuItem>
                      <MenuItem value="emoji">Emoji</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>

              {/* Options for multiple choice */}
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
                        disabled
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
                            ✅ Multi-Options  ({q.options.length}):
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {q.options.map((option, optIdx) => (
                              <span
                                key={optIdx}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded group"
                              >
                                {option}
                              {/* Remove button not shown, always read-only */}
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
          {/* Add Question button removed, always read-only */}
        </div>
      </Section>



      <Section title="Assignment" icon={<Clock className="w-3.5 h-3.5" />}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assignee Dropdown */}
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Assignee<span className="text-red-500">*</span></InputLabel>
                    <MuiSelect
                      value={s.assignee}
                      onChange={(e) => updateShift(idx, 'assignee', String(e.target.value))}
                      label="Assignee*"
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
                      <MenuItem value="bhai">bhai</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                {/* Supervisor Dropdown */}
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Supervisor<span className="text-red-500">*</span></InputLabel>
                    <MuiSelect
                      value={s.supervisor}
                      onChange={(e) => updateShift(idx, 'supervisor', String(e.target.value))}
                      label="Supervisor*"
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
                      <MenuItem value="bhai">bhai</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                {/* Time Setup UI for each shift */}
               
              </div>
               <div>
                  <TimeSetupStep
                    data={s.timeSetup}
                    onChange={(field, value) => {
                      updateShift(idx, 'timeSetup', { ...s.timeSetup, [field]: value });
                    }}
                    disabled={isSubmitting}
                    hideTitle={true}
                  />
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
                {/* Checkpoint Name and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <TextField
                      label={
                        <>
                          Checkpoint Name<span className="text-red-500">*</span>
                        </>
                      }
                      placeholder="Enter checkpoint name"
                      value={c.name}
                      onChange={(e) => updateCheckpoint(idx, 'name', e.target.value)}
                      fullWidth
                      variant="outlined"
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
                  <div>
                    <TextField
                      label="Description"
                      placeholder="Enter checkpoint description"
                      value={c.description}
                      onChange={(e) => updateCheckpoint(idx, 'description', e.target.value)}
                      fullWidth
                      variant="outlined"
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

                {/* Location Selector (without Groups) */}
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

                {/* Schedule Selection - Only show if there are named shifts */}
            

                {/* Message when no shifts are available */}
           
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
              Creating...
            </>
          ) : (
            'Submit'
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
