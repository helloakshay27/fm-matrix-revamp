import React, { useCallback } from 'react';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { FormControl, Select as MuiSelect, MenuItem, InputLabel, TextField } from '@mui/material';
import { Incident } from '@/services/incidentService';
import { InvestigatorRepeater } from '@/components/InvestigatorRepeater';
import dayjs from 'dayjs';
// Define types locally
export interface Investigator {
    id: string;
    name: string;
    email?: string;
    role?: string;
    contactNo?: string;
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

interface InvestigateStepProps {
    incident: Incident | null;
    investigators: Investigator[];
    setInvestigators: React.Dispatch<React.SetStateAction<Investigator[]>>;
    incidentOverTime: string;
    showInvestigateDetails: boolean;
    showInvestigatorForm: boolean;
    setShowInvestigatorForm: React.Dispatch<React.SetStateAction<boolean>>;
    internalUsers: any[];
    conditions: Condition[];
    setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
    subStandardConditionId: string;
    setSubStandardConditionId: React.Dispatch<React.SetStateAction<string>>;
    subStandardActId: string;
    setSubStandardActId: React.Dispatch<React.SetStateAction<string>>;
    investigationDescription: string;
    setInvestigationDescription: React.Dispatch<React.SetStateAction<string>>;
    substandardConditionCategories: any[];
    substandardActCategories: any[];
    rootCauses: RootCause[];
    setRootCauses: React.Dispatch<React.SetStateAction<RootCause[]>>;
    rcaCategories: any[];
    hasInjury: boolean;
    setHasInjury: React.Dispatch<React.SetStateAction<boolean>>;
    injuredPersons: InjuredPerson[];
    setInjuredPersons: React.Dispatch<React.SetStateAction<InjuredPerson[]>>;
    hasPropertyDamage: boolean;
    setHasPropertyDamage: React.Dispatch<React.SetStateAction<boolean>>;
    selectedPropertyDamage: string;
    setSelectedPropertyDamage: React.Dispatch<React.SetStateAction<string>>;
    propertyDamageCategories: any[];
    propertyDamages: PropertyDamage[];
    setPropertyDamages: React.Dispatch<React.SetStateAction<PropertyDamage[]>>;
}

const InvestigateStep: React.FC<InvestigateStepProps> = ({
    incident,
    investigators,
    setInvestigators,
    incidentOverTime,
    showInvestigateDetails,
    showInvestigatorForm,
    setShowInvestigatorForm,
    internalUsers,
    conditions,
    setConditions,
    subStandardConditionId,
    setSubStandardConditionId,
    subStandardActId,
    setSubStandardActId,
    investigationDescription,
    setInvestigationDescription,
    substandardConditionCategories,
    substandardActCategories,
    rootCauses,
    setRootCauses,
    rcaCategories,
    hasInjury,
    setHasInjury,
    injuredPersons,
    setInjuredPersons,
    hasPropertyDamage,
    setHasPropertyDamage,
    selectedPropertyDamage,
    setSelectedPropertyDamage,
    propertyDamageCategories,
    propertyDamages,
    setPropertyDamages
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

    const calculateTotalDuration = (
        incident: Incident | null,
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

            // 🔑 handle next-day case
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


    const handleAddCondition = useCallback(() => {
        const newCondition: Condition = {
            id: Date.now().toString(),
            condition: '',
            act: '',
            description: '',
        };
        setConditions(prev => [...prev, newCondition]);
    }, [setConditions]);

    const updateCondition = useCallback((id: string, field: string, value: any) => {
        setConditions(prev => prev.map(cond =>
            cond.id === id ? { ...cond, [field]: value } : cond
        ));
    }, [setConditions]);

    const removeCondition = useCallback((id: string) => {
        setConditions(prev => prev.filter(cond => cond.id !== id));
    }, [setConditions]);

    const handleAddRootCause = useCallback(() => {
        const newCause: RootCause = {
            id: Date.now().toString(),
            causeId: '',
            description: '',
        };
        setRootCauses(prev => [...prev, newCause]);
    }, [setRootCauses]);

    const updateRootCause = useCallback((id: string, field: string, value: any) => {
        setRootCauses(prev => prev.map(cause =>
            cause.id === id ? { ...cause, [field]: value } : cause
        ));
    }, [setRootCauses]);

    const removeRootCause = useCallback((id: string) => {
        setRootCauses(prev => prev.filter(cause => cause.id !== id));
    }, [setRootCauses]);

    const handleAddInjuredPerson = useCallback(() => {
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
        setInjuredPersons(prev => [...prev, newPerson]);
    }, [setInjuredPersons]);

    const updateInjuredPerson = useCallback((id: string, field: string, value: any) => {
        setInjuredPersons(prev => prev.map(person =>
            person.id === id ? { ...person, [field]: value } : person
        ));
    }, [setInjuredPersons]);

    const updateInjuredPersonBodyPart = useCallback((id: string, part: keyof InjuredPerson['bodyParts']) => {
        setInjuredPersons(prev => prev.map(person => {
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
    }, [setInjuredPersons]);

    const handleInjuredPersonFileChange = useCallback((id: string, files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files);
            setInjuredPersons(prev => prev.map(person =>
                person.id === id ? { ...person, attachments: [...person.attachments, ...newFiles] } : person
            ));
        }
    }, [setInjuredPersons]);

    const handleRemoveInjuredPersonAttachment = useCallback((personId: string, fileIdx: number) => {
        setInjuredPersons(prev => prev.map(person =>
            person.id === personId
                ? { ...person, attachments: person.attachments.filter((_, idx) => idx !== fileIdx) }
                : person
        ));
    }, [setInjuredPersons]);

    // Property Damage Attachments synced with parent
    const handlePropertyDamageFileChange = useCallback((files: FileList | null) => {
        if (!selectedPropertyDamage) return;
        if (files) {
            setPropertyDamages(prev => {
                const idx = prev.findIndex(pd => pd.propertyType === selectedPropertyDamage);
                if (idx !== -1) {
                    // Update existing
                    const updated = [...prev];
                    updated[idx] = {
                        ...updated[idx],
                        attachments: [...updated[idx].attachments, ...Array.from(files)]
                    };
                    return updated;
                } else {
                    // Add new
                    return [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            propertyType: selectedPropertyDamage,
                            attachments: Array.from(files)
                        }
                    ];
                }
            });
        }
    }, [selectedPropertyDamage, setPropertyDamages]);

    const handleRemovePropertyDamageAttachment = useCallback((fileIdx: number) => {
        if (!selectedPropertyDamage) return;
        setPropertyDamages(prev => {
            const idx = prev.findIndex(pd => pd.propertyType === selectedPropertyDamage);
            if (idx !== -1) {
                const updated = [...prev];
                updated[idx] = {
                    ...updated[idx],
                    attachments: updated[idx].attachments.filter((_, i) => i !== fileIdx)
                };
                return updated;
            }
            return prev;
        });
    }, [selectedPropertyDamage, setPropertyDamages]);

    const handleInvestigationDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInvestigationDescription(e.target.value);
    }, [setInvestigationDescription]);

    const handleInvestigatorsChange = useCallback((data: any[]) => {
        const newInvestigators = data.map((inv, idx) => {
            if (inv.type === 'internal' && inv.internal) {
                return {
                    id: inv.internal.userId || Date.now().toString() + idx,
                    name: inv.internal.name || 'Unknown',
                    email: inv.internal.email,
                    role: inv.internal.role,
                    contactNo: inv.internal.contactNo,
                    type: 'internal' as const,
                };
            } else if (inv.type === 'external' && inv.external) {
                return {
                    id: Date.now().toString() + idx,
                    name: inv.external.name || 'Unknown',
                    email: inv.external.email,
                    role: inv.external.role,
                    contactNo: inv.external.contactNo,
                    type: 'external' as const,
                    company: inv.external.company || '',
                };
            }
            return null;
        }).filter(Boolean) as Investigator[];

        setInvestigators(prev => [...prev, ...newInvestigators]);
        setShowInvestigatorForm(false);
    }, [setInvestigators, setShowInvestigatorForm]);

    const hasFilledData = investigators.length > 0 || showInvestigateDetails;

    return (
        <div className="p-4 space-y-4">
            {/* Time and Duration */}
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

            {/* Add/Show Investigators */}
            {!hasFilledData && (
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
            )}

            {/* Investigators List */}
            {investigators.length > 0 && (
                <div className="p-3 rounded">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2 items-center">
                            {investigators.map((inv, idx) => (
                                <React.Fragment key={inv.id}>
                                    <span className="font-medium text-sm">{inv.name}</span>
                                    {idx < investigators.length - 1 && <span className="text-gray-400">,</span>}
                                </React.Fragment>
                            ))}
                        </div>
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
            )}

            {/* Investigator Form */}
            {showInvestigatorForm && (
                <InvestigatorRepeater
                    internalUsers={internalUsers}
                    onInvestigatorsChange={handleInvestigatorsChange}
                />
            )}

            {/* Investigate Section */}
            <div className="rounded">
                <div className="flex items-center justify-between p-3 border-b border-gray-300">
                    <h3 className="font-semibold">Investigate</h3>
                    <Button variant="ghost" size="sm" className="text-xs bg-gray-800 text-white hover:bg-gray-700 h-7">
                        {hasFilledData ? 'Open' : 'WIP'}
                    </Button>
                </div>

                <div className="p-3 space-y-4">
                    {/* Dynamic Condition Blocks */}
                    {conditions.length > 0 && (
                        <div className="space-y-4">
                            {conditions.map((condition, index) => (
                                <div key={condition.id} className="p-4 rounded-lg border border-gray-200 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold">Condition #{index + 1}</h4>
                                        {conditions.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeCondition(condition.id)}
                                                className="h-6 text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    {/* Substandard Condition */}
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Substandard Condition</div>
                                        <FormControl fullWidth size="small">
                                            <MuiSelect
                                                value={condition.condition}
                                                onChange={(e) => updateCondition(condition.id, 'condition', e.target.value)}
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
                                                value={condition.act}
                                                onChange={(e) => updateCondition(condition.id, 'act', e.target.value)}
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
                                        <Textarea
                                            value={condition.description}
                                            onChange={(e) => updateCondition(condition.id, 'description', e.target.value)}
                                            placeholder="Give a brief description of the issue..."
                                            className="bg-white min-h-[80px]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Condition Button */}
                    <Button
                        variant="outline"
                        className="w-full border-gray-800 text-gray-800 bg-white"
                        onClick={handleAddCondition}
                    >
                        + Add Condition
                    </Button>

                    {/* Root Cause */}
                    <div className="mt-4 border-t border-gray-300 pt-3">
                        <div className="text-sm font-semibold mb-3">Root Cause:</div>

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
                                        <Textarea
                                            value={rootCause.description}
                                            onChange={(e) => updateRootCause(rootCause.id, 'description', e.target.value)}
                                            placeholder="Give a brief description of the issue..."
                                            className="bg-white min-h-[80px]"
                                        />
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                className="w-full border-[#BF213E] text-[#BF213E]"
                                onClick={handleAddRootCause}
                            >
                                + Add Clause
                            </Button>
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
                                                            <div key={idx} className="w-16 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center relative">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={file.name}
                                                                    className="w-full h-full object-cover rounded"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="absolute top-0 right-0 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                                    onClick={() => handleRemoveInjuredPersonAttachment(person.id, idx)}
                                                                >
                                                                    ×
                                                                </button>
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
                                                            <div key={idx} className="w-16 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center relative">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={file.name}
                                                                    className="w-full h-full object-cover rounded"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="absolute top-0 right-0 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                                    onClick={() => handleRemoveInjuredPersonAttachment(person.id, idx)}
                                                                >
                                                                    ×
                                                                </button>
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
                            <Switch checked={hasPropertyDamage} onCheckedChange={setHasPropertyDamage} />
                        </div>

                        {hasPropertyDamage && (
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
                                            onChange={e => handlePropertyDamageFileChange(e.target.files)}
                                        />
                                        <label
                                            htmlFor="property-damage-attachment"
                                            className="w-16 h-16 bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400"
                                        >
                                            <Plus className="w-6 h-6 text-gray-400" />
                                        </label>
                                        {(propertyDamages?.find(pd => pd.propertyType === selectedPropertyDamage)?.attachments || []).map((file, idx) => (
                                            <div key={idx} className="w-16 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-0 right-0 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                    onClick={() => handleRemovePropertyDamageAttachment(idx)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestigateStep;