import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, BadgeCheck, Users, Hash, CalendarCheck2 } from 'lucide-react';

const LMCUserDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Data passed from LMCDashboard via state
    const data = location.state?.row || {};

    // Fallback/mock data for direct access (for dev/testing)
    const fallback = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gender: 'Male',
        bloodGroup: 'A+',
        dob: '1990-01-01',
        lmcDoneBy: {
            uniqueId: 'LMC123',
            name: 'Operator 1',
            email: 'operator1@example.com',
            mobile: '9876543210',
            circle: 'Circle 1',
            function: 'Function 1',
            role: 'Role 1',
        },
        lmcDoneOn: {
            name: 'User 1',
            vendorName: 'Vendor 1',
            email: 'user1@example.com',
            mobile: '9123456789',
        },
        uniqueNumber: 'UNQ-001',
        lmcDate: '2025-08-08',
        checkpoints: [
            { question: 'Do you face any challenges in your workplace/field work with regards to Health Safety & Wellbeing?', answer: '' },
            { question: 'Did you Undergo any Major Medical Treatment in the past year?', answer: '' },
            { question: 'Are you clear about Absolute Safety Rules and Consequence Management?', answer: '' },
            { question: 'Do you know that you must report unsafe acts and Unsafe condition ?', answer: '' },
            { question: 'Are you familiar with job specific risks and control measures ?', answer: '' },
            { question: 'Are you familiar with risk assessment and permit to work system?', answer: '' },
            { question: 'Riding 2 wheeler for work', answer: '' },
            { question: 'Usage/ Condition of Full Faced ISI Helmet?', answer: '' },
            { question: 'Usage and condition of Reflective jacket?', answer: '' },
            { question: 'Is reflective Sticker on Bike and Helmet?', answer: '' },
            { question: 'Do the rider need to travel more than 120 Kilometers in a day for work?', answer: '' },
            { question: 'Is he/she aware that rider should take 20 minutes break after 3 hours of continuous driving?', answer: '' },
            { question: 'Are the rear view mirrors available and properly fixed?', answer: '' },
            { question: 'Are there any visible wear and tear of tires?', answer: '' },
            { question: 'When was the last maintenance of 2W (Date)?', answer: '' },
            { question: 'Are you planning to change mode of transport?', answer: '' },
            { question: 'If Yes (give data as per selection from drop down)', answer: '' },
            { question: 'Riding a 4 wheeler', answer: '' },
            { question: 'Are all seat belts (Front & Rear) having retractable Seat belts?', answer: '' },
            { question: 'Is the GPS available in the vehicle?', answer: '' },
            { question: 'Visible check if all body lights including brake, head, tail indicators in working condition?', answer: '' },
            { question: 'Are there any visible wear and tear of tyres?', answer: '' },
            { question: 'Is he/she aware that driving for business purposes between 22:00 to 05:00 hours on highways is restricted?', answer: '' },
            { question: 'Is he/she aware that driver should take a 20 minutes break after 3 hours of continuous driving?', answer: '' },
            { question: 'When was the last maintenance of 4W (Date)?', answer: '' },
            { question: 'Are you planning to change mode of transport?', answer: '' },
            { question: 'If Yes (give data as per selection from drop down)?', answer: '' },
            { question: 'Riding a bicycle', answer: '' },
            { question: 'Does he/she have reflective jackets', answer: '' },
            { question: 'Is there reflective stickers on bicycle', answer: '' },
            { question: 'Are you planning to change mode of transport', answer: '' },
            { question: 'If Yes (give data as per selection from drop down)', answer: '' },
            { question: 'Work with electrical/electronic system', answer: '' },
            { question: 'Is he/she aware of LOTOTO (Lock out Tag out Try out) Process?', answer: '' },
            { question: 'Is the PPE Used as per VIL Standards?', answer: '' },
            { question: 'Is there any Damage in PPE being used?', answer: '' },
            { question: 'Is the Person aware of PTW system and Login credentials available?', answer: '' },
            { question: 'Is the person aware of site-specific risks?', answer: '' },
            { question: 'Work at height', answer: '' },
            { question: 'Is the safety Harness as per the VIL standards?', answer: '' },
            { question: 'Is there Safety shoes, Helmet, gloves and reflective wear in good condition?', answer: '' },
            { question: 'Check the awareness on proper way of anchoring?', answer: '' },
            { question: 'Is the right set of anchoring hooks available along with safety Harness Kit?', answer: '' },
            { question: 'Is the Material lifting rope in good condition?', answer: '' },
            { question: 'Is the person aware of site-specific risks?', answer: '' },
            { question: 'Is the person aware of PTW system and Login credentials available?', answer: '' },
            { question: 'Work at Underground', answer: '' },
            { question: 'Are you working more than 1.8 meters below at any time?', answer: '' },
            { question: 'Are you working on aerial cabling?', answer: '' },
            { question: 'Is the PPE used as per VIL Standards?', answer: '' },
            { question: 'Do you have required PPE, Non-Metallic ladder and undergone W@H Training?', answer: '' },
            { question: 'Is there any damage in PPE being used?', answer: '' },
            { question: 'Is the person aware of site-specific risks and PPE?', answer: '' },
            { question: 'Operate MHE', answer: '' },
            { question: 'Are all body lights including brake, head, tail, indicators in working condition?', answer: '' },
            { question: 'Is the reverse horn in working condition?', answer: '' },
            { question: 'Is the interlock between ignition and seat belts working?', answer: '' },
            { question: 'When was the last maintenance done?', answer: '' },
            { question: 'Have you received a Driving License?', answer: '' },
            { question: 'Is there any Training Requirements/refresher required?', answer: '' },
            { question: 'List of training selected', answer: '' },
            { question: 'Any Positive / improvement observations on safe behaviour you want to comment', answer: '' },
            { question: 'Action taken on observation', answer: '' },
        ]
    };

    // Use data from navigation or fallback
    const user = { ...fallback, ...data };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header with back button */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
                    <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">PERSONAL DETAILS</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <span className="text-gray-500 text-sm">First Name</span>
                            <p className="text-gray-900 font-medium">{user.firstName}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Last Name</span>
                            <p className="text-gray-900 font-medium">{user.lastName}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Email ID</span>
                            <p className="text-gray-900 font-medium">{user.email}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Gender</span>
                            <p className="text-gray-900 font-medium">{user.gender}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Blood Group</span>
                            <p className="text-gray-900 font-medium">{user.bloodGroup}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">DOB</span>
                            <p className="text-gray-900 font-medium">{user.dob}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LMC Details - Done By */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
                    <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                        <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">LMC DETAILS</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <span className="text-gray-500 text-sm">LMC Done By (Unique ID)</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneBy?.uniqueId}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Name</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneBy?.name}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Email</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneBy?.email}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Mobile Number</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneBy?.mobile}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Circle</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneBy?.circle}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Function</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneBy?.function}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Role</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneBy?.role}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LMC Details - Done On (with Unique Number) */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
                    <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">LMC DONE ON</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <span className="text-gray-500 text-sm">Name</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneOn?.name}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Vendor Name</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneOn?.vendorName}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Email</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneOn?.email}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Mobile Number</span>
                            <p className="text-gray-900 font-medium">{user.lmcDoneOn?.mobile}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Unique Number</span>
                            <p className="text-gray-900 font-medium">{user.uniqueNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LMC Date & Checkpoints */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
                    <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                        <CalendarCheck2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">LMC DATE: {user.lmcDate}</h2>
                </div>
                <div className="p-6">
                    <div className="mb-4 font-semibold">Checkpoints:</div>
                    <div className="border rounded-lg p-4">
                        {user.checkpoints && user.checkpoints.length > 0 ? (
                            <ul className="space-y-4">
                                {user.checkpoints.map((cp, idx) => {
                                    // Section headers to highlight
                                    const sectionHeaders = [
                                        'Riding 2 wheeler for work',
                                        'Riding a 4 wheeler',
                                        'Riding a bicycle',
                                        'Work with electrical/electronic system',
                                        'Work at height',
                                        'Work at Underground',
                                        'Operate MHE',
                                    ];
                                    if (sectionHeaders.includes(cp.question)) {
                                        return (
                                            <li key={idx} className="mt-6">
                                                <div className="font-bold tePERSONAL DExt-base text-[#C72030]">{cp.question}</div>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li key={idx}>
                                            <div className="font-medium">- {cp.question}</div>
                                            <div className="text-gray-700">Ans: {cp.answer || <span className="italic text-gray-400">Not answered</span>}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-gray-500">No checkpoints available.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LMCUserDetail;
