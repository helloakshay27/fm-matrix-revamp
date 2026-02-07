import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, Box, Clock, Link, Mail, MapPin, Loader2, Download, Eye } from "lucide-react";
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from "sonner";

export const ViewOperationalAuditSchedulePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Tab state
    const [activeTab, setActiveTab] = useState("basic");

    // Modal states
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    // API data state
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Get custom_form_code from location state
    const customFormCode = location.state?.formCode;

    // Fetch form details
    useEffect(() => {
        const fetchFormDetails = async () => {
            if (!customFormCode) {
                toast.error("Form code is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(
                    `${API_CONFIG.BASE_URL}/pms/custom_forms/${customFormCode}/custom_form_preview.json`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': getAuthHeader(),
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch form details: ${response.status}`);
                }

                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error('Error fetching form details:', error);
                toast.error("Failed to load form details");
            } finally {
                setLoading(false);
            }
        };

        fetchFormDetails();
    }, [customFormCode]);

    // Use API data
    const customForm = formData?.custom_form;
    const assetTask = formData?.asset_task;
    const emailRules = formData?.email_rules;

    // Toggle states
    const createTicketEnabled = customForm?.create_ticket || false;
    const weightageEnabled = customForm?.weightage_enabled || false;

    const selectedGroupId = customForm?.content?.[0]?.group_id || '';
    const selectedSubGroupId = customForm?.content?.[0]?.sub_group_id || '';

    // Format date function
    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Format date with time
    const formatDateTime = (dateStr: string | null | undefined) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleViewPerformance = () => {
        navigate(`/maintenance/audit/operational/scheduled/performance/${id}`, {
            state: { formCode: customFormCode }
        });
    };

    const handleBack = () => navigate('/maintenance/audit/operational/scheduled');

    // Loading state
    if (loading) {
        return (
            <div className="p-4 sm:p-6 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
                    <p className="text-gray-600">Loading form details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-1 hover:text-gray-800 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Schedule
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                                {customForm?.form_name}
                            </h1>
                        </div>
                        <div className="text-sm text-gray-600">
                            Schedule #{assetTask?.id || id} • Created by {assetTask?.created_by || 'Unknown'} • Last updated {formatDate(assetTask?.start_date || assetTask?.services?.[0]?.created_at)}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {/* Create Ticket Toggle */}
                        <div className="flex items-center space-x-2">
                            <RadioGroup value={createTicketEnabled ? "enabled" : "disabled"}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="enabled" id="create-ticket-enabled" disabled />
                                    <Label htmlFor="create-ticket-enabled">Create Ticket</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Weightage Toggle */}
                        <div className="flex items-center space-x-2">
                            <RadioGroup value={weightageEnabled ? "enabled" : "disabled"}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="enabled" id="weightage-enabled" disabled />
                                    <Label htmlFor="weightage-enabled">Weightage</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Button
                            onClick={handleViewPerformance}
                            variant="outline"
                            className="border-[#C72030] text-[#C72030]"
                        >
                            View Performance
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
                        <TabsTrigger
                            value="basic"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Basic Configuration
                        </TabsTrigger>

                        <TabsTrigger
                            value="task"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Task
                        </TabsTrigger>

                        <TabsTrigger
                            value="time"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Time Setup
                        </TabsTrigger>

                        <TabsTrigger
                            value="schedule"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Schedule
                        </TabsTrigger>

                        <TabsTrigger
                            value="association"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Association
                        </TabsTrigger>

                        <TabsTrigger
                            value="email"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Email Trigger Rules
                        </TabsTrigger>

                        <TabsTrigger
                            value="mapping"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Asset Mapping List
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="p-4 sm:p-6">
                        <div className="space-y-6">
                            {/* Basic Configuration Card */}
                            <Card className="w-full">
                                <CardHeader className="pb-4 lg:pb-6">
                                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                            <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                                        </div>
                                        <span className="uppercase tracking-wide">Basic Configuration</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Type</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{customForm?.schedule_type || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Schedule For</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{customForm?.sch_type || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Activity Name</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{customForm?.form_name || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Form Code</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{customForm?.form_code || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Create Ticket</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{customForm?.create_ticket ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Weightage</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{customForm?.weightage_enabled ? 'Enabled' : 'Disabled'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Ticket Level</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{customForm?.ticket_level || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Observations</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{customForm?.observations_enabled ? 'Enabled' : 'Disabled'}</span>
                                        </div>
                                        {customForm?.description && (
                                            <div className="flex items-start col-span-2">
                                                <span className="text-gray-500 min-w-[140px]">Description</span>
                                                <span className="text-gray-500 mx-2">:</span>
                                                <span className="text-gray-900 font-medium">{customForm.description}</span>
                                            </div>
                                        )}
                                        {customForm?.attachments && customForm.attachments.length > 0 && (
                                            <div className="flex items-start col-span-2">
                                                <span className="text-gray-500 min-w-[140px]">Attachments</span>
                                                <span className="text-gray-500 mx-2">:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {customForm.attachments.map((doc) => {
                                                        const isImage = doc.content_type?.startsWith('image/');
                                                        const isPdf = doc.content_type === 'application/pdf';

                                                        return (
                                                            <div
                                                                key={doc.id}
                                                                className="group relative flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-all cursor-pointer"
                                                                onClick={() => {
                                                                    setSelectedDoc(doc);
                                                                    setShowImagePreview(true);
                                                                }}
                                                            >
                                                                {isImage ? (
                                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                                ) : (
                                                                    <Download className="w-4 h-4 text-gray-600" />
                                                                )}
                                                                <span className="text-sm text-gray-700 max-w-[200px] truncate">
                                                                    {doc.name}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="task" className="p-4 sm:p-6">
                        <div className="space-y-6">
                            {/* Task Information Card */}
                            <Card className="w-full">
                                <CardHeader className="pb-4 lg:pb-6">
                                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                            <Box className="w-6 h-6" style={{ color: '#C72030' }} />
                                        </div>
                                        <span className="uppercase tracking-wide">Task Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Group</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">
                                                {selectedGroupId || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Sub Group</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">
                                                {selectedSubGroupId || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Dynamic Tasks Card */}
                            {customForm?.content && customForm.content.length > 0 && (
                                <Card className="w-full">
                                    <CardHeader className="pb-4 lg:pb-6">
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                                <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                                            </div>
                                            <span className="uppercase tracking-wide">Task Details</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-6">
                                            {customForm.content.map((task, index) => (
                                                <div key={task.name || index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                                                    <div className="mb-4">
                                                        <h3 className="font-semibold text-gray-900 mb-3">Question {index + 1}</h3>
                                                        <p className="text-sm text-gray-700">{task.label}</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        <div className="flex items-start">
                                                            <span className="text-gray-500 min-w-[120px]">Input Type</span>
                                                            <span className="text-gray-500 mx-2">:</span>
                                                            <span className="text-gray-900 font-medium capitalize">{task.type}</span>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <span className="text-gray-500 min-w-[120px]">Mandatory</span>
                                                            <span className="text-gray-500 mx-2">:</span>
                                                            <span className="text-gray-900 font-medium">{task.required === 'true' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <span className="text-gray-500 min-w-[120px]">Reading</span>
                                                            <span className="text-gray-500 mx-2">:</span>
                                                            <span className="text-gray-900 font-medium">{task.is_reading === 'true' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        {task.weightage && (
                                                            <div className="flex items-start">
                                                                <span className="text-gray-500 min-w-[120px]">Weightage</span>
                                                                <span className="text-gray-500 mx-2">:</span>
                                                                <span className="text-gray-900 font-medium">{task.weightage}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-start">
                                                            <span className="text-gray-500 min-w-[120px]">Rating Enabled</span>
                                                            <span className="text-gray-500 mx-2">:</span>
                                                            <span className="text-gray-900 font-medium">{task.rating_enabled === 'true' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        {task.hint && (
                                                            <div className="flex items-start col-span-2">
                                                                <span className="text-gray-500 min-w-[120px]">Help Text</span>
                                                                <span className="text-gray-500 mx-2">:</span>
                                                                <span className="text-gray-900 font-medium">{task.hint}</span>
                                                            </div>
                                                        )}

                                                        {/* Values for select/radio/checkbox */}
                                                        {task.values && task.values.length > 0 && (
                                                            <div className="flex items-start col-span-2">
                                                                <span className="text-gray-500 min-w-[120px]">Options</span>
                                                                <span className="text-gray-500 mx-2">:</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {task.values.map((option, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className={`px-2 py-1 rounded text-xs ${option.type === 'positive'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : option.type === 'negative'
                                                                                    ? 'bg-red-100 text-red-700'
                                                                                    : 'bg-gray-100 text-gray-700'
                                                                                }`}
                                                                        >
                                                                            {option.label}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="time" className="p-4 sm:p-6">
                        {/* Time Setup */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <Clock className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Time Setup</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Parse cron expression and show as Table */}
                                {(() => {
                                    const cron = assetTask?.cron_expression || '';
                                    let minutes: string[] = [], hours: string[] = [], dayOfMonth: string[] = [], months: string[] = [], weekdays: string[] = [];
                                    let isDayOfMonth = false;
                                    if (cron) {
                                        const parts = cron.split(' ');
                                        if (parts.length >= 5) {
                                            minutes = parts[0].split(',');
                                            hours = parts[1].split(',');
                                            dayOfMonth = parts[2] === '*' ? [] : parts[2].split(',');
                                            months = parts[3] === '*' ? ['All'] : parts[3].split(',');
                                            weekdays = parts[4] === '*' ? [] : parts[4].split(',');

                                            isDayOfMonth = parts[2] !== '*' && dayOfMonth.length > 0;
                                        }
                                    }
                                    if (!hours.length || (hours.length === 1 && hours[0] === '*')) hours = ['All'];
                                    if (!minutes.length || (minutes.length === 1 && minutes[0] === '*')) minutes = ['All'];
                                    if (!months.length) months = ['All'];

                                    let dayColumnHeader = '';
                                    let dayColumnValue = '';

                                    if (isDayOfMonth) {
                                        dayColumnHeader = 'Date of Month';
                                        dayColumnValue = dayOfMonth.join(', ');
                                    } else {
                                        dayColumnHeader = 'Day of Week';
                                        if (weekdays.length === 0) {
                                            dayColumnValue = 'All';
                                        } else {
                                            const dayMap: { [key: string]: string } = {
                                                '0': 'Sunday', '1': 'Monday', '2': 'Tuesday',
                                                '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday'
                                            };
                                            dayColumnValue = weekdays.map(d => dayMap[d] || d).join(', ');
                                        }
                                    }

                                    return (
                                        <div className="rounded-lg border border-gray-200 overflow-hidden">
                                            <Table className="border-separate">
                                                <TableHeader>
                                                    <TableRow className="bg-gray-50">
                                                        <TableHead className="font-semibold text-gray-700">Hour</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Minute</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">{dayColumnHeader}</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Month</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>{hours.join(', ')}</TableCell>
                                                        <TableCell>{minutes.join(', ')}</TableCell>
                                                        <TableCell>{dayColumnValue}</TableCell>
                                                        <TableCell>{months.join(', ')}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="schedule" className="p-4 sm:p-6">
                        <div className="space-y-6">
                            {/* Schedule Configuration Card */}
                            <Card className="w-full">
                                <CardHeader className="pb-4 lg:pb-6">
                                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                            <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                                        </div>
                                        <span className="uppercase tracking-wide">Schedule Configuration</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Assignment Type</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium capitalize">{assetTask?.assignment_type || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Assigned To</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">
                                                {assetTask?.assigned_to?.map(u => u.name).join(', ') || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Scan Type</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{assetTask?.scan_type || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Plan Duration</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">
                                                {assetTask?.plan_value} {assetTask?.plan_type}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Priority</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{assetTask?.priority || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Category</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{assetTask?.category || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Lock Overdue Task</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">
                                                {assetTask?.overdue_task_start_status ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Frequency</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{assetTask?.frequency || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Start Date</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{formatDate(assetTask?.start_date)}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">End Date</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{formatDate(assetTask?.end_date)}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Submission Time</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">
                                                {customForm?.submission_time_value && customForm?.submission_time_type
                                                    ? `${customForm.submission_time_value} ${customForm.submission_time_type}`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Grace Time</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">
                                                {assetTask?.grace_time_value && assetTask?.grace_time_type
                                                    ? `${assetTask.grace_time_value} ${assetTask.grace_time_type}`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Supervisors</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">
                                                {customForm?.supervisors?.join(', ') || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Supplier</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{assetTask?.supplier?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="association" className="p-4 sm:p-6">
                        {/* Association */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <Link className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Association</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {customForm?.sch_type === 'Service' ? (
                                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                                        <Table className="border-separate">
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold text-gray-700">Service ID</TableHead>
                                                    <TableHead className="font-semibold text-gray-700">Service Name</TableHead>
                                                    <TableHead className="font-semibold text-gray-700">Created Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {assetTask?.services?.map((service) => (
                                                    <TableRow key={service.id}>
                                                        <TableCell>{service.id}</TableCell>
                                                        <TableCell>{service.service_name}</TableCell>
                                                        <TableCell>{formatDateTime(service.created_at)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                                        <Table className="border-separate">
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold text-gray-700">Asset ID</TableHead>
                                                    <TableHead className="font-semibold text-gray-700">Asset Name</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {assetTask?.assets?.map((asset) => (
                                                    <TableRow key={asset.id}>
                                                        <TableCell>{asset.id}</TableCell>
                                                        <TableCell>{asset.name}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="email" className="p-4 sm:p-6">
                        {/* Email Trigger Rules */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <Mail className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Email Trigger Rules</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                    <Table className="border-separate">
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="font-semibold text-gray-700">Rule Name</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Trigger Type</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Trigger To</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Period</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Created By</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {emailRules?.map((rule) => (
                                                <TableRow key={rule.id}>
                                                    <TableCell>{rule.rule_name}</TableCell>
                                                    <TableCell>{rule.trigger_type}</TableCell>
                                                    <TableCell>{rule.trigger_to || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        {rule.period_value} {rule.period_type}
                                                    </TableCell>
                                                    <TableCell>{rule.created_by || 'N/A'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mapping" className="p-4 sm:p-6">
                        {/* Asset Mapping List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <MapPin className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Asset Mapping List</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                    <Table className="border-separate">
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="font-semibold text-gray-700">Asset Name</TableHead>
                                                <TableHead className="font-semibold text-gray-700">QR Code</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Bar Code</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {assetTask?.assets?.map((asset) => (
                                                <TableRow key={asset.id}>
                                                    <TableCell>{asset.name}</TableCell>
                                                    <TableCell>{asset.qr_code || 'N/A'}</TableCell>
                                                    <TableCell>{asset.bar_code || 'N/A'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
