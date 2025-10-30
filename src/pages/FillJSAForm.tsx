// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Badge } from "@/components/ui/badge";
// import {
//     ArrowLeft,
//     FileText,
//     Shield,
//     ClipboardCheck
// } from "lucide-react";
// import { toast } from "sonner";
// import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";

// interface JSAActivity {
//     id: string;
//     activity: string;
//     subActivity: string;
//     hazard: string;
//     risks: string[];
//     controlMeasures: Record<string, 'yes' | 'no' | null>;
// }

// export const FillJSAForm = () => {
//     const navigate = useNavigate();
//     const { id } = useParams<{ id: string }>();
//     const [loading, setLoading] = useState(false);

//     // JSA Form Basic Information
//     const [jsaInfo, setJsaInfo] = useState({
//         permitId: '',
//         nameOfDepartment: '',
//         date: '',
//         checkedByName: '',
//         location: '',
//         permitFor: '',
//         workPermitType: '',
//         checkedBySign: ''
//     });

//     // JSA Activities
//     const [jsaActivities, setJsaActivities] = useState<JSAActivity[]>([]);

//     // Comments
//     const [comments, setComments] = useState('');

//     useEffect(() => {
//         if (id) {
//             fetchJSADetails(id);
//         }
//     }, [id]);

//     const fetchJSADetails = async (permitId: string) => {
//         try {
//             setLoading(true);

//             const response = await fetch(`${API_CONFIG.BASE_URL}/pms/permits/${permitId}/fill_jsa_form.json`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': getAuthHeader(),
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log('JSA API Response:', data);

//                 const jsaFormData = data.jsa_form;

//                 if (!jsaFormData) {
//                     toast.error('Invalid response format from server');
//                     return;
//                 }

//                 // Map API data to JSA info fields according to the response structure
//                 setJsaInfo(prev => ({
//                     ...prev,
//                     permitId: jsaFormData.permit_id?.toString() || permitId,
//                     nameOfDepartment: jsaFormData.department_name || '',
//                     date: jsaFormData.date || '',
//                     location: jsaFormData.location || '',
//                     permitFor: jsaFormData.permit_for || '',
//                     workPermitType: jsaFormData.permit_type || '',
//                     checkedByName: jsaFormData.checked_by_name || ''
//                 }));

//                 // Map permit details to JSA activities
//                 if (jsaFormData.permit_details && Array.isArray(jsaFormData.permit_details)) {
//                     const mappedActivities = jsaFormData.permit_details.map((detail: any) => ({
//                         id: detail.id?.toString() || '',
//                         activity: detail.activity || '',
//                         subActivity: detail.sub_activity || '',
//                         hazard: detail.hazard || '',
//                         risks: Array.isArray(detail.risks) ? detail.risks : [],
//                         controlMeasures: detail.control_measures || {}
//                     }));

//                     console.log('Mapped JSA Activities:', mappedActivities);
//                     setJsaActivities(mappedActivities);
//                 } else {
//                     console.log('No permit details found in response');
//                     setJsaActivities([]);
//                 }

//                 // Set comments
//                 setComments(jsaFormData.comments || '');

//                 toast.success('JSA form data loaded successfully');

//             } else {
//                 const errorText = await response.text();
//                 console.error('Failed to fetch JSA details:', response.status, response.statusText, errorText);
//                 toast.error(`Failed to load JSA details: ${response.status} ${response.statusText}`);
//             }
//         } catch (error) {
//             console.error('Error fetching JSA details:', error);
//             toast.error('Error loading JSA details. Please check your connection.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleControlMeasureChange = (activityId: string, measure: string, value: 'yes' | 'no') => {
//         setJsaActivities(prev =>
//             prev.map(activity =>
//                 activity.id === activityId
//                     ? {
//                         ...activity,
//                         controlMeasures: {
//                             ...activity.controlMeasures,
//                             [measure]: value
//                         }
//                     }
//                     : activity
//             )
//         );
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             if (!id) {
//                 toast.error('Permit ID is required');
//                 return;
//             }

//             // Build control measures payload
//             const controlMeasures: Record<string, Record<string, string>> = {};

//             jsaActivities.forEach(activity => {
//                 const activityMeasures: Record<string, string> = {};
//                 Object.entries(activity.controlMeasures || {}).forEach(([measureName, value]) => {
//                     if (value) {
//                         activityMeasures[measureName] = value.toUpperCase();
//                     }
//                 });

//                 if (Object.keys(activityMeasures).length > 0) {
//                     controlMeasures[activity.id] = activityMeasures;
//                 }
//             });

//             const response = await fetch(`${API_CONFIG.BASE_URL}/pms/permits/${id}/submit_jsa_form.json`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     'Authorization': getAuthHeader(),
//                 },
//                 body: JSON.stringify({
//                     pms_permit_jsa_form: {
//                         checked_by_name: jsaInfo.checkedByName,
//                         control_measures: controlMeasures,
//                         comments: comments
//                     }
//                 })
//             }); if (response.ok) {
//                 const data = await response.json();
//                 console.log('JSA form submitted successfully:', data);
//                 toast.success('JSA form submitted successfully!');
//                 navigate(`/safety/permit/details/${id}`);
//             } else {
//                 const errorText = await response.text();
//                 console.error('Failed to submit JSA form:', response.status, response.statusText, errorText);
//                 toast.error(`Failed to submit JSA form: ${response.status} ${response.statusText}`);
//             }
//         } catch (error) {
//             toast.error('Failed to submit JSA form');
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className=" mx-auto">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-4">
//                         <Button
//                             variant="ghost"
//                             onClick={() => navigate(-1)}
//                             className="p-0"
//                         >
//                             <ArrowLeft className="w-4 h-4 mr-2" />
//                             Back
//                         </Button>
//                         <h1 className="text-2xl font-bold text-gray-900">
//                             Fill JSA Form
//                             {id && <span className="text-sm text-gray-600 ml-2">(Permit ID: {id})</span>}
//                         </h1>
//                     </div>
//                     <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
//                         JSA FORM
//                     </Badge>
//                 </div>

//                 <Card className="shadow-sm border border-gray-200 p-5 ">
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* Basic Information */}
//                         <Card className="shadow-sm border border-gray-200">
//                             <CardContent className="p-6">
//                                 {loading ? (
//                                     <div className="flex items-center justify-center py-8">
//                                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
//                                         <span className="ml-2 text-gray-600">Loading JSA details...</span>
//                                     </div>
//                                 ) : (
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                         {/* Left Column */}
//                                         <div className="space-y-4">
//                                             <div className="flex justify-between items-center">
//                                                 <Label className="text-sm font-medium text-gray-600">Permit ID</Label>
//                                                 <span className="text-sm font-medium text-gray-900">{jsaInfo.permitId}</span>
//                                             </div>

//                                             <div className="flex justify-between items-center">
//                                                 <Label className="text-sm font-medium text-gray-600">Name Of Department</Label>
//                                                 <span className="text-sm font-medium text-gray-900">{jsaInfo.nameOfDepartment || '-'}</span>
//                                             </div>

//                                             <div className="flex justify-between items-center">
//                                                 <Label className="text-sm font-medium text-gray-600">Date</Label>
//                                                 <span className="text-sm font-medium text-gray-900">{jsaInfo.date}</span>
//                                             </div>

//                                             <div>
//                                                 <Label htmlFor="checkedByName" className="text-sm font-medium text-gray-600">
//                                                     Checked By Name
//                                                 </Label>
//                                                 <Input
//                                                     id="checkedByName"
//                                                     value={jsaInfo.checkedByName}
//                                                     onChange={(e) => {
//                                                         const value = e.target.value;
//                                                         // Only allow alphabets and spaces
//                                                         if (/^[a-zA-Z ]*$/.test(value)) {
//                                                             setJsaInfo((prev) => ({ ...prev, checkedByName: value }));
//                                                         }
//                                                     }}
//                                                     placeholder="Enter Name"
//                                                     className="mt-1"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Right Column */}
//                                         <div className="space-y-4">
//                                             <div className="flex justify-between items-start">
//                                                 <Label className="text-sm font-medium text-gray-600">Location</Label>
//                                                 <span className="text-sm font-medium text-gray-900 text-right ml-4">
//                                                     {jsaInfo.location}
//                                                 </span>
//                                             </div>

//                                             <div className="flex justify-between items-center">
//                                                 <Label className="text-sm font-medium text-gray-600">Permit For</Label>
//                                                 <span className="text-sm font-medium text-gray-900 text-right ml-4">
//                                                     {jsaInfo.permitFor}
//                                                 </span>
//                                             </div>

//                                             <div className="flex justify-between items-center">
//                                                 <Label className="text-sm font-medium text-gray-600">Work Permit Type/No</Label>
//                                                 <span className="text-sm font-medium text-gray-900 text-right ml-4">
//                                                     {jsaInfo.workPermitType}
//                                                 </span>
//                                             </div>

//                                             <div className="flex justify-between items-center">
//                                                 <Label className="text-sm font-medium text-gray-600">Checked By Sign</Label>
//                                                 <span className="text-sm font-medium text-gray-900 text-right ml-4">
//                                                     {jsaInfo.checkedBySign || '-'}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </CardContent>

//                         </Card>

//                         {/* JSA Activities Table */}
//                         <Card className="shadow-sm border border-gray-200">
//                             <CardHeader className="pb-4 bg-[#f6f4ee] rounded-t-lg">
//                                 <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                     <ClipboardCheck className="w-5 h-5" />
//                                     Job Safety Analysis Activities
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="p-6">
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full border-collapse border border-gray-300">
//                                         <thead>
//                                             <tr className="bg-gray-50">
//                                                 <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900 w-16">Sr No</th>
//                                                 <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Activity</th>
//                                                 <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Sub Activity</th>
//                                                 <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Hazard</th>
//                                                 <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Risk</th>
//                                                 <th className="border border-gray-300 p-3 text-center text-xs font-medium text-gray-900">Control Measures (Yes/No)</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {jsaActivities.length > 0 ? (
//                                                 jsaActivities.map((activity, index) => (
//                                                     <tr key={activity.id}>
//                                                         <td className="border border-gray-300 p-3 text-sm text-center font-medium">
//                                                             {index + 1}
//                                                         </td>
//                                                         <td className="border border-gray-300 p-3 text-sm">
//                                                             {activity.activity}
//                                                         </td>
//                                                         <td className="border border-gray-300 p-3 text-sm">
//                                                             {activity.subActivity}
//                                                         </td>
//                                                         <td className="border border-gray-300 p-3 text-sm">
//                                                             {activity.hazard}
//                                                         </td>
//                                                         <td className="border border-gray-300 p-3 text-sm">
//                                                             {activity.risks && activity.risks.length > 0
//                                                                 ? activity.risks.join(', ')
//                                                                 : '-'
//                                                             }
//                                                         </td>
//                                                         <td className="border border-gray-300 p-3">
//                                                             <div className="space-y-3">
//                                                                 {Object.keys(activity.controlMeasures || {}).map((measure) => (
//                                                                     <div key={measure} className="flex items-center justify-between">
//                                                                         <span className="text-xs text-gray-700">{measure}</span>
//                                                                         <div className="flex gap-4">
//                                                                             <RadioGroup
//                                                                                 value={activity.controlMeasures[measure] || ''}
//                                                                                 onValueChange={(value) => handleControlMeasureChange(activity.id, measure, value as 'yes' | 'no')}
//                                                                                 className="flex gap-4"
//                                                                             >
//                                                                                 <div className="flex items-center space-x-2">
//                                                                                     <RadioGroupItem value="yes" id={`${measure}-yes-${activity.id}`} />
//                                                                                     <Label htmlFor={`${measure}-yes-${activity.id}`} className="text-xs">Yes</Label>
//                                                                                 </div>
//                                                                                 <div className="flex items-center space-x-2">
//                                                                                     <RadioGroupItem value="no" id={`${measure}-no-${activity.id}`} />
//                                                                                     <Label htmlFor={`${measure}-no-${activity.id}`} className="text-xs">No</Label>
//                                                                                 </div>
//                                                                             </RadioGroup>
//                                                                         </div>
//                                                                     </div>
//                                                                 ))}
//                                                                 {(!activity.controlMeasures || Object.keys(activity.controlMeasures).length === 0) && (
//                                                                     <div className="text-xs text-gray-500 text-center">
//                                                                         No control measures available
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             ) : (
//                                                 <tr>
//                                                     <td colSpan={6} className="border border-gray-300 p-8 text-center text-gray-500">
//                                                         {loading ? 'Loading activities...' : 'No JSA activities found'}
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {/* Comments Section */}
//                         <Card className="shadow-sm border border-gray-200">
//                             <CardHeader className="pb-4 bg-[#f6f4ee] rounded-t-lg">
//                                 <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
//                                     <FileText className="w-5 h-5" />
//                                     Comments
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="p-6">
//                                 <div>
//                                     <Textarea
//                                         value={comments}
//                                         onChange={(e) => setComments(e.target.value)}
//                                         placeholder="Enter Comments"
//                                         rows={4}
//                                         className="w-full"
//                                     />
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {/* Save Button */}
//                         <div className="flex justify-center pt-6">
//                             <Button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-8 py-2 text-sm font-medium rounded"
//                             >
//                                 {loading ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                         Saving...
//                                     </>
//                                 ) : (
//                                     'Save'
//                                 )}
//                             </Button>
//                         </div>
//                     </form>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default FillJSAForm;





import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, Radio } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    FileText,
    ClipboardCheck
} from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";

interface JSAActivity {
    id: string;
    activity: string;
    subActivity: string;
    hazard: string;
    risks: string[];
    controlMeasures: Record<string, 'yes' | 'no' | null>;
}

export const FillJSAForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    const [jsaInfo, setJsaInfo] = useState({
        permitId: '',
        nameOfDepartment: '',
        date: '',
        checkedByName: '',
        location: '',
        permitFor: '',
        workPermitType: '',
        checkedBySign: ''
    });

    const [jsaActivities, setJsaActivities] = useState<JSAActivity[]>([]);
    const [comments, setComments] = useState('');

    useEffect(() => {
        if (id) fetchJSADetails(id);
    }, [id]);

    const fetchJSADetails = async (permitId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_CONFIG.BASE_URL}/pms/permits/${permitId}/fill_jsa_form.json`, {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const jsaFormData = data.jsa_form;
                if (!jsaFormData) {
                    toast.error('Invalid response format from server');
                    return;
                }

                setJsaInfo({
                    permitId: jsaFormData.permit_id?.toString() || permitId,
                    nameOfDepartment: jsaFormData.department_name || '',
                    date: jsaFormData.date || '',
                    location: jsaFormData.location || '',
                    permitFor: jsaFormData.permit_for || '',
                    workPermitType: jsaFormData.permit_type || '',
                    checkedByName: jsaFormData.checked_by_name || '',
                    checkedBySign: jsaFormData.checked_by_sign || ''
                });

                if (jsaFormData.permit_details && Array.isArray(jsaFormData.permit_details)) {
                    const mappedActivities = jsaFormData.permit_details.map((detail: any) => ({
                        id: detail.id?.toString() || '',
                        activity: detail.activity || '',
                        subActivity: detail.sub_activity || '',
                        hazard: detail.hazard || '',
                        risks: Array.isArray(detail.risks) ? detail.risks : [],
                        controlMeasures: detail.control_measures || {}
                    }));
                    setJsaActivities(mappedActivities);
                } else {
                    setJsaActivities([]);
                }

                setComments(jsaFormData.comments || '');
                toast.success('JSA form data loaded successfully');
            } else {
                toast.error('Failed to load JSA details');
            }
        } catch (error) {
            toast.error('Error loading JSA details');
        } finally {
            setLoading(false);
        }
    };

    const handleControlMeasureChange = (activityId: string, measure: string, value: 'yes' | 'no') => {
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

    const validateForm = (): boolean => {
        // Check Checked By Name
        if (!jsaInfo.checkedByName.trim()) {
            toast.error("Checked By Name is required");
            return false;
        }

        // Check all control measures are answered
        for (const activity of jsaActivities) {
            for (const [measure, value] of Object.entries(activity.controlMeasures || {})) {
                if (!value) {
                    toast.error(`Please select Yes or No for all control measures in "${activity.activity}"`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            if (!id) {
                toast.error('Permit ID is required');
                return;
            }

            const controlMeasures: Record<string, Record<string, string>> = {};

            jsaActivities.forEach(activity => {
                const activityMeasures: Record<string, string> = {};
                Object.entries(activity.controlMeasures || {}).forEach(([measureName, value]) => {
                    if (value) {
                        activityMeasures[measureName] = value.toUpperCase();
                    }
                });
                if (Object.keys(activityMeasures).length > 0) {
                    controlMeasures[activity.id] = activityMeasures;
                }
            });

            const response = await fetch(`${API_CONFIG.BASE_URL}/pms/permits/${id}/submit_jsa_form.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': getAuthHeader(),
                },
                body: JSON.stringify({
                    pms_permit_jsa_form: {
                        checked_by_name: jsaInfo.checkedByName,
                        control_measures: controlMeasures,
                        comments: comments
                    }
                })
            });

            if (response.ok) {
                toast.success('JSA form submitted successfully!');
                navigate(`/safety/permit/details/${id}`);
            } else {
                toast.error('Failed to submit JSA form');
            }
        } catch (error) {
            toast.error('Error submitting JSA form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Fill JSA Form
                            {id && <span className="text-sm text-gray-600 ml-2">(Permit ID: {id})</span>}
                        </h1>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1">JSA FORM</Badge>
                </div>

                <Card className="shadow-sm border border-gray-200 p-5 h-full">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-medium text-gray-600">Permit ID :</Label>
                                                <span className="text-sm font-medium text-gray-900">{jsaInfo.permitId}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-medium text-gray-600">Name Of Department :</Label>
                                                <span className="text-sm font-medium text-gray-900">{jsaInfo.nameOfDepartment || '-'}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-medium text-gray-600">Date :</Label>
                                                <span className="text-sm font-medium text-gray-900">{jsaInfo.date}</span>
                                            </div>

                                            <div>
                                                <Label htmlFor="checkedByName" className="text-sm font-medium text-gray-600">
                                                    Checked By Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="checkedByName"
                                                    value={jsaInfo.checkedByName}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z ]*$/.test(value)) {
                                                            setJsaInfo((prev) => ({ ...prev, checkedByName: value }));
                                                        }
                                                    }}
                                                    placeholder="Enter Name"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <Label className="text-sm font-medium text-gray-600">Location:</Label>
                                                <span className="text-sm font-medium text-gray-900 text-right ml-4 max-w-[30rem] truncate cursor-pointer" title={jsaInfo.location}>
                                                    {jsaInfo.location}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-medium text-gray-600">Permit For :</Label>
                                                <span className="text-sm font-medium text-gray-900 text-right ml-4">
                                                    {jsaInfo.permitFor}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-medium text-gray-600">Work Permit Type/No :</Label>
                                                <span className="text-sm font-medium text-gray-900 text-right ml-4">
                                                    {jsaInfo.workPermitType}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-medium text-gray-600">Checked By Sign :</Label>
                                                <span className="text-sm font-medium text-gray-900 text-right ml-4">
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
                            <CardHeader className="pb-4 bg-[#f6f4ee] rounded-t-lg">
                                <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5" />
                                    Job Safety Analysis Activities
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300 ">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900 w-16">Sr No</th>
                                                <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Activity</th>
                                                <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Sub Activity</th>
                                                <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Hazard</th>
                                                <th className="border border-gray-300 p-3 text-left text-xs font-medium text-gray-900">Risk</th>
                                                <th className="border border-gray-300 p-3 text-center text-xs font-medium text-gray-900">
                                                    Control Measures (Yes/No) <span className="text-red-500">*</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jsaActivities.length > 0 ? (
                                                jsaActivities.map((activity, index) => (
                                                    <tr key={activity.id}>
                                                        <td className="border border-gray-300 p-3 text-sm text-center font-medium">{index + 1}</td>
                                                        <td className="border border-gray-300 p-3 text-sm">{activity.activity}</td>
                                                        <td className="border border-gray-300 p-3 text-sm">{activity.subActivity}</td>
                                                        <td className="border border-gray-300 p-3 text-sm">{activity.hazard}</td>
                                                        <td className="border border-gray-300 p-3 text-sm">
                                                            {activity.risks?.length ? activity.risks.join(', ') : '-'}
                                                        </td>
                                                        <td className="border border-gray-300">
                                                            <div className="space-y-3">
                                                                {Object.keys(activity.controlMeasures || {}).map((measure) => (
                                                                    <div key={measure} className="flex items-center justify-between">
                                                                        <span className="text-xs text-gray-700">{measure}</span>
                                                                        <div className="flex gap-4">
                                                                            <RadioGroup
                                                                                row
                                                                                value={activity.controlMeasures[measure] || ''}
                                                                                onChange={(e) =>
                                                                                    handleControlMeasureChange(activity.id, measure, e.target.value as 'yes' | 'no')
                                                                                }
                                                                                className="flex gap-4"
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <Radio
                                                                                        className="!pl-2"
                                                                                        value="yes"
                                                                                        id={`${measure}-yes-${activity.id}`}
                                                                                        sx={{
                                                                                            "& .MuiSvgIcon-root": {
                                                                                                left: "2px !important"
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <Label htmlFor={`${measure}-yes-${activity.id}`} className="text-xs">Yes</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <Radio
                                                                                        className="!pl-2"
                                                                                        value="no"
                                                                                        id={`${measure}-no-${activity.id}`}
                                                                                        sx={{
                                                                                            "& .MuiSvgIcon-root": {
                                                                                                left: "2px !important"
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <Label htmlFor={`${measure}-no-${activity.id}`} className="text-xs">No</Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {(!activity.controlMeasures ||
                                                                    Object.keys(activity.controlMeasures).length === 0) && (
                                                                        <div className="text-xs text-gray-500 text-center">
                                                                            No control measures available
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="border border-gray-300 p-8 text-center text-gray-500">
                                                        {loading ? 'Loading activities...' : 'No JSA activities found'}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comments */}
                        <Card className="shadow-sm border border-gray-200">
                            <CardHeader className="pb-4 bg-[#f6f4ee] rounded-t-lg">
                                <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Comments
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Enter Comments"
                                    rows={4}
                                />
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
                </Card>
            </div>
        </div>
    );
};

export default FillJSAForm;
