import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    FileText,
    Shield,
    ClipboardCheck
} from "lucide-react";
import { toast } from "sonner";

interface JSAActivity {
    id: string;
    activity: string;
    subActivity: string;
    hazard: string;
    risk: string;
    controlMeasures: {
        useSafetyShoes: 'yes' | 'no' | '';
        safetyHelmet: 'yes' | 'no' | '';
        reflectiveJacket: 'yes' | 'no' | '';
        electricalGloves: 'yes' | 'no' | '';
    };
}

export const FillJSAForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    // JSA Form Basic Information
    const [jsaInfo, setJsaInfo] = useState({
        permitId: '307',
        nameOfDepartment: '',
        date: '28/08/2025',
        checkedByName: '',
        location: 'Site - Panchshil Test / Building - TOWER B / Wing - NA / Floor - NA / Area - NA / Room - NA',
        permitFor: '🏢',
        workPermitType: 'Cold Work',
        checkedBySign: ''
    });

    // JSA Activities
    const [jsaActivities, setJsaActivities] = useState<JSAActivity[]>([
        {
            id: '1',
            activity: 'Asbestos survey & removing work',
            subActivity: 'Isolating power supply',
            hazard: 'Expose to current',
            risk: 'Physical injury',
            controlMeasures: {
                useSafetyShoes: '',
                safetyHelmet: '',
                reflectiveJacket: '',
                electricalGloves: ''
            }
        }
    ]);

    // Comments
    const [comments, setComments] = useState('');

    useEffect(() => {
        if (id) {
            console.log('Permit ID for JSA:', id);
            fetchJSADetails(id);
        }
    }, [id]);

    const fetchJSADetails = async (permitId: string) => {
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                toast.error('Authentication required');
                return;
            }

            setLoading(true);
            // This would be the JSA-specific API endpoint
            const response = await fetch(`${baseUrl}/pms/permits/${permitId}/jsa.json`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('JSA Details:', data);

                // Map API data to JSA info fields
                setJsaInfo(prev => ({
                    ...prev,
                    permitId: data.permit_id?.toString() || permitId,
                    nameOfDepartment: data.department_name || '',
                    date: data.date || '28/08/2025',
                    location: data.location || prev.location,
                    workPermitType: data.work_permit_type || 'Cold Work'
                }));

                // Map activities if provided by API
                if (data.activities && data.activities.length > 0) {
                    setJsaActivities(data.activities.map((activity: any, index: number) => ({
                        id: (index + 1).toString(),
                        activity: activity.activity || '',
                        subActivity: activity.sub_activity || '',
                        hazard: activity.hazard || '',
                        risk: activity.risk || '',
                        controlMeasures: {
                            useSafetyShoes: activity.control_measures?.use_safety_shoes || '',
                            safetyHelmet: activity.control_measures?.safety_helmet || '',
                            reflectiveJacket: activity.control_measures?.reflective_jacket || '',
                            electricalGloves: activity.control_measures?.electrical_gloves || ''
                        }
                    })));
                }

            } else {
                console.error('Failed to fetch JSA details');
                toast.error('Failed to load JSA details');
            }
        } catch (error) {
            console.error('Error fetching JSA details:', error);
            toast.error('Error loading JSA details');
        } finally {
            setLoading(false);
        }
    };

    const handleControlMeasureChange = (activityId: string, measure: keyof JSAActivity['controlMeasures'], value: 'yes' | 'no') => {
        setJsaActivities(prev =>
            prev.map(activity =>
                activity.id === activityId
                    ? {
                        ...activity,
                        controlMeasures: {
                            ...activity.controlMeasures,
                            [measure]: value
                        }
                    }
                    : activity
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Here you would implement the API call to submit the JSA form
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

            toast.success('JSA form submitted successfully!');
            navigate('/safety/permit');
        } catch (error) {
            toast.error('Failed to submit JSA form');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="p-0"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Fill JSA Form
                            {id && <span className="text-sm text-gray-600 ml-2">(Permit ID: {id})</span>}
                        </h1>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                        JSA FORM
                    </Badge>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
                                    <span className="ml-2 text-gray-600">Loading JSA details...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600">Permit ID</Label>
                                            <span className="text-sm font-medium text-gray-900">
                                                {jsaInfo.permitId}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600">Name Of Department</Label>
                                            <span className="text-sm font-medium text-gray-900">
                                                {jsaInfo.nameOfDepartment || '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600">Date</Label>
                                            <span className="text-sm font-medium text-gray-900">
                                                {jsaInfo.date}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="checkedByName" className="text-sm font-medium text-gray-600">
                                                Checked By Name
                                            </Label>
                                            <Input
                                                id="checkedByName"
                                                value={jsaInfo.checkedByName}
                                                onChange={(e) => setJsaInfo(prev => ({ ...prev, checkedByName: e.target.value }))}
                                                placeholder="Enter Name"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="md:col-span-3 space-y-4">
                                        <div className="flex items-start py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600 w-20">Location</Label>
                                            <span className="text-sm font-medium text-gray-900 ml-4">
                                                {jsaInfo.location}
                                            </span>
                                        </div>

                                        <div className="flex items-center py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600 w-20">Permit For</Label>
                                            <span className="text-sm font-medium text-gray-900 ml-4">
                                                {jsaInfo.permitFor}
                                            </span>
                                        </div>

                                        <div className="flex items-center py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600 w-20">Work Permit Type/No</Label>
                                            <span className="text-sm font-medium text-gray-900 ml-4">
                                                {jsaInfo.workPermitType}
                                            </span>
                                        </div>

                                        <div className="flex items-center py-2 border-b border-gray-100">
                                            <Label className="text-sm font-medium text-gray-600 w-20">Checked By Sign</Label>
                                            <span className="text-sm font-medium text-gray-900 ml-4">
                                                {jsaInfo.checkedBySign || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* JSA Activities Table */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5" />
                                Job Safety Analysis Activities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900 w-16">Sr No</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Activity</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Sub Activity</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Hazard</th>
                                            <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Risk</th>
                                            <th className="border border-gray-300 p-3 text-center text-xs font-medium text-gray-900">Control Measures (Yes/No)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jsaActivities.map((activity, index) => (
                                            <tr key={activity.id}>
                                                <td className="border border-gray-300 p-3 text-sm text-center font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-gray-300 p-3 text-sm">
                                                    {activity.activity}
                                                </td>
                                                <td className="border border-gray-300 p-3 text-sm">
                                                    {activity.subActivity}
                                                </td>
                                                <td className="border border-gray-300 p-3 text-sm">
                                                    {activity.hazard}
                                                </td>
                                                <td className="border border-gray-300 p-3 text-sm">
                                                    {activity.risk}
                                                </td>
                                                <td className="border border-gray-300 p-3">
                                                    <div className="space-y-3">
                                                        {/* Use Safety Shoes */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-700">Use Safety Shoes(EN-345/IS15298)</span>
                                                            <div className="flex gap-4">
                                                                <RadioGroup
                                                                    value={activity.controlMeasures.useSafetyShoes}
                                                                    onValueChange={(value) => handleControlMeasureChange(activity.id, 'useSafetyShoes', value as 'yes' | 'no')}
                                                                    className="flex gap-4"
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="yes" id={`safety-shoes-yes-${activity.id}`} />
                                                                        <Label htmlFor={`safety-shoes-yes-${activity.id}`} className="text-xs">Yes</Label>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="no" id={`safety-shoes-no-${activity.id}`} />
                                                                        <Label htmlFor={`safety-shoes-no-${activity.id}`} className="text-xs">No</Label>
                                                                    </div>
                                                                </RadioGroup>
                                                            </div>
                                                        </div>

                                                        {/* Safety Helmet */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-700">Safety Helmet IS 2925:1984)</span>
                                                            <div className="flex gap-4">
                                                                <RadioGroup
                                                                    value={activity.controlMeasures.safetyHelmet}
                                                                    onValueChange={(value) => handleControlMeasureChange(activity.id, 'safetyHelmet', value as 'yes' | 'no')}
                                                                    className="flex gap-4"
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="yes" id={`helmet-yes-${activity.id}`} />
                                                                        <Label htmlFor={`helmet-yes-${activity.id}`} className="text-xs">Yes</Label>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="no" id={`helmet-no-${activity.id}`} />
                                                                        <Label htmlFor={`helmet-no-${activity.id}`} className="text-xs">No</Label>
                                                                    </div>
                                                                </RadioGroup>
                                                            </div>
                                                        </div>

                                                        {/* Reflective Jacket */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-700">Reflective Jacket (EN20471:2013)</span>
                                                            <div className="flex gap-4">
                                                                <RadioGroup
                                                                    value={activity.controlMeasures.reflectiveJacket}
                                                                    onValueChange={(value) => handleControlMeasureChange(activity.id, 'reflectiveJacket', value as 'yes' | 'no')}
                                                                    className="flex gap-4"
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="yes" id={`jacket-yes-${activity.id}`} />
                                                                        <Label htmlFor={`jacket-yes-${activity.id}`} className="text-xs">Yes</Label>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="no" id={`jacket-no-${activity.id}`} />
                                                                        <Label htmlFor={`jacket-no-${activity.id}`} className="text-xs">No</Label>
                                                                    </div>
                                                                </RadioGroup>
                                                            </div>
                                                        </div>

                                                        {/* Electrical Gloves */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-700">Electrical Gloves (EN 60903/ IS 4270:1991)</span>
                                                            <div className="flex gap-4">
                                                                <RadioGroup
                                                                    value={activity.controlMeasures.electricalGloves}
                                                                    onValueChange={(value) => handleControlMeasureChange(activity.id, 'electricalGloves', value as 'yes' | 'no')}
                                                                    className="flex gap-4"
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="yes" id={`gloves-yes-${activity.id}`} />
                                                                        <Label htmlFor={`gloves-yes-${activity.id}`} className="text-xs">Yes</Label>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="no" id={`gloves-no-${activity.id}`} />
                                                                        <Label htmlFor={`gloves-no-${activity.id}`} className="text-xs">No</Label>
                                                                    </div>
                                                                </RadioGroup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="pb-4 bg-blue-50 rounded-t-lg">
                            <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Comments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div>
                                <Textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Enter Comments"
                                    rows={4}
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-center pt-6">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-8 py-2 text-sm font-medium rounded"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FillJSAForm;
