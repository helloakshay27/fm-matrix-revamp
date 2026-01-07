import React from 'react';
import { Clock } from 'lucide-react';
import { FormControl } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Incident } from '@/services/incidentService';

interface ReportStepProps {
    loading: boolean;
    error: string | null;
    incident: Incident | null;
    incidentOverTime: string;
    setIncidentOverTime: (value: string) => void;
}

const ReportStep: React.FC<ReportStepProps> = ({
    loading,
    error,
    incident,
    incidentOverTime,
    setIncidentOverTime
}) => {
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
                <span className="text-sm font-medium whitespace-nowrap">Select Incident Date & Time</span>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Date & Time"
                            minutesStep={1}
                            value={incidentOverTime ? dayjs(incidentOverTime, "YYYY-MM-DD HH:mm") : null}
                            onChange={(newValue) => {
                                if (newValue && dayjs.isDayjs(newValue)) {
                                    setIncidentOverTime(newValue.format("YYYY-MM-DD HH:mm"));
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

export default ReportStep;