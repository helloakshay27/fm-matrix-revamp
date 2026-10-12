import React, { useCallback } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, Select as MuiSelect, MenuItem, InputLabel, TextField } from '@mui/material';
import { Incident } from '@/services/incidentService';
import dayjs from 'dayjs';
import type { Investigator, CorrectiveAction, PreventiveAction } from '../IncidentNewDetails';

interface ProvisionalStepProps {
    incident: Incident | null;
    investigators: Investigator[];
    incidentOverTime: string;
    correctiveActions: CorrectiveAction[];
    setCorrectiveActions: React.Dispatch<React.SetStateAction<CorrectiveAction[]>>;
    preventiveActions: PreventiveAction[];
    setPreventiveActions: React.Dispatch<React.SetStateAction<PreventiveAction[]>>;
    selectedCorrectiveAction: string;
    setSelectedCorrectiveAction: React.Dispatch<React.SetStateAction<string>>;
    correctiveActionDescription: string;
    setCorrectiveActionDescription: React.Dispatch<React.SetStateAction<string>>;
    correctiveActionResponsiblePerson: string;
    setCorrectiveActionResponsiblePerson: React.Dispatch<React.SetStateAction<string>>;
    correctiveActionDate: string;
    setCorrectiveActionDate: React.Dispatch<React.SetStateAction<string>>;
    selectedPreventiveAction: string;
    setSelectedPreventiveAction: React.Dispatch<React.SetStateAction<string>>;
    preventiveActionDescription: string;
    setPreventiveActionDescription: React.Dispatch<React.SetStateAction<string>>;
    preventiveActionResponsiblePerson: string;
    setPreventiveActionResponsiblePerson: React.Dispatch<React.SetStateAction<string>>;
    preventiveActionDate: string;
    setPreventiveActionDate: React.Dispatch<React.SetStateAction<string>>;
    nextReviewDate: string;
    setNextReviewDate: React.Dispatch<React.SetStateAction<string>>;
    nextReviewResponsible: string;
    setNextReviewResponsible: React.Dispatch<React.SetStateAction<string>>;
    correctiveActionsCategories: any[];
    preventiveActionsCategories: any[];
    internalUsers: any[];
}

const ProvisionalStep: React.FC<ProvisionalStepProps> = ({
    incident,
    investigators,
    incidentOverTime,
    correctiveActions,
    setCorrectiveActions,
    preventiveActions,
    setPreventiveActions,
    selectedCorrectiveAction,
    setSelectedCorrectiveAction,
    correctiveActionDescription,
    setCorrectiveActionDescription,
    correctiveActionResponsiblePerson,
    setCorrectiveActionResponsiblePerson,
    correctiveActionDate,
    setCorrectiveActionDate,
    selectedPreventiveAction,
    setSelectedPreventiveAction,
    preventiveActionDescription,
    setPreventiveActionDescription,
    preventiveActionResponsiblePerson,
    setPreventiveActionResponsiblePerson,
    preventiveActionDate,
    setPreventiveActionDate,
    nextReviewDate,
    setNextReviewDate,
    nextReviewResponsible,
    setNextReviewResponsible,
    correctiveActionsCategories,
    preventiveActionsCategories,
    internalUsers
}) => {

    const formatTime = (dateTimeString: string | null | undefined) => {
        if (!dateTimeString) return '-';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            });
        } catch (e) {
            return '-';
        }
    };

    const formatIncidentOverTime = (timeString: string | null | undefined) => {
        if (!timeString) return '-';
        try {
            if (timeString.includes(':') && !timeString.includes('T')) {
                return dayjs(timeString, "HH:mm").format("hh:mm A");
            }
            const date = new Date(timeString);
            return date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            });
        } catch (e) {
            return '-';
        }
    };

    // Use the same calculateTotalDuration logic as InvestigateStep
    const calculateTotalDuration = (
        incident: any,
        incidentOverTime: string
    ) => {
        if (!incident?.inc_time || !incidentOverTime) return '-';

        const occurredDate = dayjs(incident.inc_time);
        if (!occurredDate.isValid()) return '-';

        let overDate: dayjs.Dayjs;

        // If only time (HH:mm)
        if (incidentOverTime.includes(':') && !incidentOverTime.includes('T')) {
            const [h, m] = incidentOverTime.split(':').map(Number);

            overDate = occurredDate
                .hour(h)
                .minute(m)
                .second(0)
                .millisecond(0);

            // handle next-day case
            if (overDate.isBefore(occurredDate)) {
                overDate = overDate.add(1, 'day');
            }
        } else {
            overDate = dayjs(incidentOverTime);
        }

        if (!overDate.isValid()) return '-';

        const diffMinutes = overDate.diff(occurredDate, 'minute');
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        return `${hours} Hrs. ${minutes} Min.`;
    };

    const handleAddCorrectiveAction = useCallback(() => {
        const newAction: CorrectiveAction = {
            id: Date.now().toString(),
            action: '',
            responsiblePerson: '',
            targetDate: '',
            description: '',
        };
        setCorrectiveActions(prev => [...prev, newAction]);
    }, [setCorrectiveActions]);

    const updateCorrectiveAction = useCallback((id: string, field: string, value: any) => {
        // Character limit for description field (240 characters)
        if (field === 'description' && value.length > 240) {
            return; // Don't update state if exceeds 240 characters
        }
        setCorrectiveActions(prev => prev.map(action =>
            action.id === id ? { ...action, [field]: value } : action
        ));
    }, [setCorrectiveActions]);

    const removeCorrectiveAction = useCallback((id: string) => {
        setCorrectiveActions(prev => prev.filter(action => action.id !== id));
    }, [setCorrectiveActions]);

    const handleAddPreventiveAction = useCallback(() => {
        const newAction: PreventiveAction = {
            id: Date.now().toString(),
            action: '',
            responsiblePerson: '',
            targetDate: '',
            description: '',
        };
        setPreventiveActions(prev => [...prev, newAction]);
    }, [setPreventiveActions]);

    const updatePreventiveAction = useCallback((id: string, field: string, value: any) => {
        // Character limit for description field (240 characters)
        if (field === 'description' && value.length > 240) {
            return; // Don't update state if exceeds 240 characters
        }
        setPreventiveActions(prev => prev.map(action =>
            action.id === id ? { ...action, [field]: value } : action
        ));
    }, [setPreventiveActions]);

    const removePreventiveAction = useCallback((id: string) => {
        setPreventiveActions(prev => prev.filter(action => action.id !== id));
    }, [setPreventiveActions]);

    const handleCorrectiveActionDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCorrectiveActionDescription(e.target.value);
    }, [setCorrectiveActionDescription]);

    const handlePreventiveActionDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPreventiveActionDescription(e.target.value);
    }, [setPreventiveActionDescription]);

    return (
        <div className="p-4 space-y-4 bg-[#FDFDFB] min-h-full">

            <div className="flex items-center justify-between bg-white border border-[#E7E1D4] rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Occurred Time</span>
                    <span className="font-semibold text-sm text-gray-800">{incident?.inc_time ? formatTime(incident.inc_time) : '-'}</span>
                </div>
                <div className="text-sm">
                    <span className="text-brand font-semibold">Total Duration</span>
                    <span className="ml-2 text-gray-800">{calculateTotalDuration(incident, incidentOverTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Incident Over Time</span>
                    <span className="font-semibold text-sm text-gray-800">
                        {formatIncidentOverTime(incidentOverTime)}
                    </span>
                </div>
            </div>

            {/* Investigators */}
            <div className="bg-white border border-[#E7E1D4] rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2 items-center">
                        {investigators.length > 0 ? (
                            investigators.map((inv, idx) => (
                                <React.Fragment key={inv.id}>
                                    <span className="font-medium text-sm text-gray-800">{inv.name}</span>
                                    {idx < investigators.length - 1 && <span className="text-gray-400">,</span>}
                                </React.Fragment>
                            ))
                        ) : (
                            <span className="font-medium text-sm text-gray-400">No investigators added yet</span>
                        )}
                    </div>
                    <Button variant="outline" size="sm" className="border-brand text-brand hover:bg-[#FFF3EE]">
                        + Investigator
                    </Button>
                </div>
            </div>

            {/* Provisional Section */}
            <div className="bg-white border border-[#E7E1D4] rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0EAE2] bg-[#FAF9F7]">
                    <h3 className="font-bold text-gray-900">Provisional</h3>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#107A5B] border border-[#BAE6D3]">
                        Open
                    </span>
                </div>

                <div className="p-4 space-y-4">
                    {/* Corrective Actions */}
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Corrective Actions:</h4>

                        {correctiveActions.length > 0 && (
                            <div className="space-y-4">
                                {correctiveActions.map((action, index) => (
                                    <div key={action.id} className="p-4 rounded-lg border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold">Action {index + 1}</h4>
                                            {correctiveActions.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeCorrectiveAction(action.id)}
                                                    className="h-6 text-gray-500 hover:text-gray-700"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-[#2D2D2D]">Select corrective action</label>
                                            <FormControl fullWidth size="small">
                                                <MuiSelect
                                                    value={action.action}
                                                    onChange={(e) => updateCorrectiveAction(action.id, 'action', e.target.value)}
                                                    displayEmpty
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D0D5DD' },
                                                        '& .MuiSelect-icon': { color: '#DA7756' }
                                                    }}
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
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-[#2D2D2D]">Responsible Person</label>
                                            <FormControl fullWidth size="small">
                                                <MuiSelect
                                                    value={action.responsiblePerson}
                                                    onChange={(e) => updateCorrectiveAction(action.id, 'responsiblePerson', e.target.value)}
                                                    displayEmpty
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D0D5DD' },
                                                        '& .MuiSelect-icon': { color: '#DA7756' }
                                                    }}
                                                >
                                                    {internalUsers.length > 0 ? (
                                                        internalUsers.map((user) => (
                                                            <MenuItem key={user.id} value={user.id?.toString() || ''}>
                                                                {user.full_name || user.name}
                                                            </MenuItem>
                                                        ))
                                                    ) : (
                                                        <MenuItem value="" disabled>
                                                            No users available
                                                        </MenuItem>
                                                    )}
                                                </MuiSelect>
                                            </FormControl>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-[#2D2D2D]">Target Date</label>
                                            <div className="flex items-center gap-2">
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="date"
                                                    value={action.targetDate}
                                                    onChange={(e) => updateCorrectiveAction(action.id, 'targetDate', e.target.value)}
                                                    sx={{ backgroundColor: 'white', flex: 1 }}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-sm font-semibold text-[#2D2D2D] mb-1">Description</div>
                                        <Textarea
                                            value={action.description}
                                            onChange={(e) => updateCorrectiveAction(action.id, 'description', e.target.value)}
                                            placeholder="This is how description will look like if the user has put description at the time of creation."
                                            className="bg-white min-h-[80px] border border-[#E5E7EB]"
                                        />
                                        <div className="mt-1 text-xs text-gray-600">
                                            {action.description.length} / 240
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full border-brand text-brand mt-3 hover:bg-[#FFF3EE]"
                            onClick={handleAddCorrectiveAction}
                        >
                            + Add Action
                        </Button>
                    </div>

                    {/* Preventive Actions */}
                    <div className="border-t border-gray-300 pt-4">
                        <h4 className="font-semibold text-sm mb-3">Preventive Actions:</h4>

                        {preventiveActions.length > 0 && (
                            <div className="space-y-4">
                                {preventiveActions.map((action, index) => (
                                    <div key={action.id} className="p-4 rounded-lg border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold">Action {index + 1}</h4>
                                            {preventiveActions.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePreventiveAction(action.id)}
                                                    className="h-6 text-gray-500 hover:text-gray-700"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-[#2D2D2D]">Select preventive action</label>
                                            <FormControl fullWidth size="small">
                                                <MuiSelect
                                                    value={action.action}
                                                    onChange={(e) => updatePreventiveAction(action.id, 'action', e.target.value)}
                                                    displayEmpty
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D0D5DD' },
                                                        '& .MuiSelect-icon': { color: '#DA7756' }
                                                    }}
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
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-[#2D2D2D]">Responsible Person</label>
                                            <FormControl fullWidth size="small">
                                                <MuiSelect
                                                    value={action.responsiblePerson}
                                                    onChange={(e) => updatePreventiveAction(action.id, 'responsiblePerson', e.target.value)}
                                                    displayEmpty
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D0D5DD' },
                                                        '& .MuiSelect-icon': { color: '#DA7756' }
                                                    }}
                                                >
                                                    {internalUsers.length > 0 ? (
                                                        internalUsers.map((user) => (
                                                            <MenuItem key={user.id} value={user.id?.toString() || ''}>
                                                                {user.full_name || user.name}
                                                            </MenuItem>
                                                        ))
                                                    ) : (
                                                        <MenuItem value="" disabled>
                                                            No users available
                                                        </MenuItem>
                                                    )}
                                                </MuiSelect>
                                            </FormControl>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-[#2D2D2D]">Target Date</label>
                                            <div className="flex items-center gap-2">
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="date"
                                                    value={action.targetDate}
                                                    onChange={(e) => updatePreventiveAction(action.id, 'targetDate', e.target.value)}
                                                    sx={{ backgroundColor: 'white', flex: 1 }}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-sm font-semibold text-[#2D2D2D] mb-1">Description</div>
                                        <Textarea
                                            value={action.description}
                                            onChange={(e) => updatePreventiveAction(action.id, 'description', e.target.value)}
                                            placeholder="This is how description will look like if the user has put description at the time of creation."
                                            className="bg-white min-h-[80px] border border-[#E5E7EB]"
                                        />
                                        <div className="mt-1 text-xs text-gray-600">
                                            {action.description.length} / 240
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full border-brand text-brand mt-3 hover:bg-[#FFF3EE]"
                            onClick={handleAddPreventiveAction}
                        >
                            + Add Action
                        </Button>
                    </div>

                    {/* Schedule Next Review */}
                    <div className="border-t border-[#E5E7EB] pt-4">
                        <h4 className="font-semibold text-sm mb-3 text-brand">Schedule Next Review</h4>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-[#2D2D2D]">Responsible Person</label>
                                <FormControl fullWidth size="small">
                                    <MuiSelect
                                        value={nextReviewResponsible}
                                        onChange={(e) => setNextReviewResponsible(e.target.value)}
                                        displayEmpty
                                        sx={{
                                            backgroundColor: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D0D5DD' },
                                            '& .MuiSelect-icon': { color: '#DA7756' }
                                        }}
                                    >
                                        {internalUsers.length > 0 ? (
                                            internalUsers.map((user) => (
                                                <MenuItem key={user.id} value={user.id?.toString() || ''}>
                                                    {user.full_name || user.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="" disabled>
                                                No users available
                                            </MenuItem>
                                        )}
                                    </MuiSelect>
                                </FormControl>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-[#2D2D2D]">Review Date</label>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProvisionalStep;