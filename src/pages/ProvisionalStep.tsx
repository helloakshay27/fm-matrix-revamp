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
        <div className="p-4 space-y-4">

            <div className="flex items-center justify-between p-3 rounded">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Occurred Time</span>
                    <span className="font-medium text-sm">{incident?.inc_time ? formatTime(incident.inc_time) : '-'}</span>
                </div>
                <div className="text-sm">
                    <span className="text-red-500 font-medium">Total Duration</span>
                    <span className="ml-2">{calculateTotalDuration(incident, incidentOverTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Incident Over Time</span>
                    <span className="font-medium text-sm">
                        {formatIncidentOverTime(incidentOverTime)}
                    </span>
                </div>
            </div>

            {/* Investigators */}
            <div className="p-3 rounded">
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2 items-center">
                        {investigators.length > 0 ? (
                            investigators.map((inv, idx) => (
                                <React.Fragment key={inv.id}>
                                    <span className="font-medium text-sm">{inv.name}</span>
                                    {idx < investigators.length - 1 && <span className="text-gray-400">,</span>}
                                </React.Fragment>
                            ))
                        ) : (
                            <span className="font-medium text-sm text-gray-400">No investigators added yet</span>
                        )}
                    </div>
                    <Button variant="outline" size="sm" className="border-[#BF213E] text-[#BF213E]">
                        + Investigator
                    </Button>
                </div>
            </div>

            {/* Provisional Section */}
            <div className="rounded">
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

                        {correctiveActions.length > 0 && (
                            <div className="space-y-4">
                                {correctiveActions.map((action, index) => (
                                    <div key={action.id} className="p-4 rounded-lg border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold">Action #{index + 1}</h4>
                                            {correctiveActions.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeCorrectiveAction(action.id)}
                                                    className="h-6 text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Select corrective action</InputLabel>
                                            <MuiSelect
                                                value={action.action}
                                                onChange={(e) => updateCorrectiveAction(action.id, 'action', e.target.value)}
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
                                                value={action.responsiblePerson}
                                                onChange={(e) => updateCorrectiveAction(action.id, 'responsiblePerson', e.target.value)}
                                                label="Responsible Person"
                                                sx={{ backgroundColor: 'white' }}
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

                                        <div className="text-sm text-gray-600 mb-1">Description:</div>
                                        <Textarea
                                            value={action.description}
                                            onChange={(e) => updateCorrectiveAction(action.id, 'description', e.target.value)}
                                            placeholder="This is how description will look like if the user has put description at the time of creation."
                                            className="bg-white min-h-[80px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full border-[#BF213E] text-[#BF213E] mt-3"
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
                                            <h4 className="text-sm font-semibold">Action #{index + 1}</h4>
                                            {preventiveActions.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePreventiveAction(action.id)}
                                                    className="h-6 text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Select preventive action</InputLabel>
                                            <MuiSelect
                                                value={action.action}
                                                onChange={(e) => updatePreventiveAction(action.id, 'action', e.target.value)}
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
                                                value={action.responsiblePerson}
                                                onChange={(e) => updatePreventiveAction(action.id, 'responsiblePerson', e.target.value)}
                                                label="Responsible Person"
                                                sx={{ backgroundColor: 'white' }}
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

                                        <div className="text-sm text-gray-600 mb-1">Description:</div>
                                        <Textarea
                                            value={action.description}
                                            onChange={(e) => updatePreventiveAction(action.id, 'description', e.target.value)}
                                            placeholder="This is how description will look like if the user has put description at the time of creation."
                                            className="bg-white min-h-[80px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full border-[#BF213E] text-[#BF213E] mt-3"
                            onClick={handleAddPreventiveAction}
                        >
                            + Add Action
                        </Button>
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
    );
};

export default ProvisionalStep;