// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ArrowLeft, Plus, Upload } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAppDispatch } from '@/store/hooks';
// import { fetchFacilitySetup } from '@/store/slices/facilitySetupsSlice';
// import { facilityBookingSetupDetails } from '@/store/slices/facilityBookingsSlice';

// export const BookingSetupDetailPage = () => {
//   const dispatch = useAppDispatch();
//   const baseUrl = localStorage.getItem('baseUrl');
//   const token = localStorage.getItem('token');
//   const { id } = useParams();

//   const navigate = useNavigate();

//   // Mock data - in real app this would come from API based on id
//   const [bookingData, setBookingData] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await dispatch(facilityBookingSetupDetails({ baseUrl, token, id })).unwrap();
//         setBookingData(response);
//       } catch (error) {
//         console.log(error)
//       }
//     }

//     fetchData();
//   }, [])

//   const handleBack = () => {
//     navigate('/vas/booking/setup');
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           {/* <Button
//             variant="ghost"
//             onClick={handleBack}
//             className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Booking Setup &gt; Booking Setup List
//           </Button> */}
//           <h1 className="text-2xl font-bold text-[#1a1a1a]">BOOKING SETUP DETAIL</h1>
//         </div>

//         <div className="space-y-6">
//           {/* Basic Info */}
//           <Card>
//             <CardContent className="p-6">
//               {/* Radio buttons */}
//               <div className="flex items-center space-x-6 mb-6">
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     id="bookable"
//                     name="type"
//                     value="bookable"
//                     defaultChecked
//                     disabled
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <label htmlFor="bookable" className="text-sm font-medium">Bookable</label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     id="request"
//                     name="type"
//                     value="request"
//                     disabled
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <label htmlFor="request" className="text-sm font-medium">Request</label>
//                 </div>
//               </div>

//               {/* Form fields */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <Label className="text-sm font-medium">
//                     Facility Name<span className="text-red-500">*</span>
//                   </Label>
//                   <Input value={bookingData.fac_name} className="mt-1" readOnly />
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">
//                     Active<span className="text-red-500">*</span>
//                   </Label>
//                   <Select value="Yes" disabled>
//                     <SelectTrigger className="mt-1" value={bookingData.active}>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Yes">Yes</SelectItem>
//                       <SelectItem value="No">No</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">Department</Label>
//                   <Select value={bookingData.department} disabled>
//                     <SelectTrigger className="mt-1">
//                       <SelectValue placeholder="Select Department" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Slot">Slot</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Configure App Key */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
//                 CONFIGURE APP KEY
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div>
//                 <Label className="text-sm font-medium">App Key</Label>
//                 <Input value={bookingData.appKey} className="mt-1" readOnly />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Configure Payment */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
//                 CONFIGURE PAYMENT
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <div className="flex items-center space-x-2">
//                   <Switch checked={bookingData.paymentPortland} disabled />
//                   <Label className="text-sm">Portland</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch checked={bookingData.prepaid} disabled />
//                   <Label className="text-sm">Prepaid</Label>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">Complimentary</Label>
//                   <div className="mt-1 text-sm text-gray-500">Not configured</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">GST(%) :</Label>
//                   <Input value={bookingData.gst} className="mt-1" readOnly />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Configure Slot */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
//                 CONFIGURE SLOT
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="mb-4">
//                 <Button size="sm" className="bg-purple-800 hover:bg-purple-900 text-white px-6">
//                   Add
//                 </Button>
//               </div>

//               <div className="bg-gray-100 p-4 rounded-lg">
//                 <div className="grid grid-cols-7 gap-4 mb-4">
//                   <div>
//                     <Label className="text-sm font-medium text-gray-700">Start Time</Label>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-700">Break Time Start</Label>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-700">Break Time End</Label>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-700">End Time</Label>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-700">Concurrent Slots</Label>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-700">Slot by</Label>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-700">Wrap Time</Label>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-7 gap-4">
//                   <div className="flex gap-1">
//                     <Select value="09" disabled>
//                       <SelectTrigger className="h-8 w-16">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="09">09</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Select value="00" disabled>
//                       <SelectTrigger className="h-8 w-16">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="00">00</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex gap-1">
//                     <Select value="13" disabled>
//                       <SelectTrigger className="h-8 w-16">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="13">13</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Select value="00" disabled>
//                       <SelectTrigger className="h-8 w-16">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="00">00</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex gap-1">
//                     <Select value="14" disabled>
//                       <SelectTrigger className="h-8 w-16">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="14">14</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Select value="00" disabled>
//                       <SelectTrigger className="h-8 w-16">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="00">00</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex gap-1">
//                     <Select value="19" disabled>
//                       <SelectTrigger className="h-8 w-16">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="19">19</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Select value="00" disabled>
//                       <SelectTrigger className="h-8 w-16">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="00">00</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Select disabled>
//                       <SelectTrigger className="h-8">
//                         <SelectValue />
//                       </SelectTrigger>
//                     </Select>
//                   </div>

//                   <div>
//                     <Select value="15 Minutes" disabled>
//                       <SelectTrigger className="h-8">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="15 Minutes">15 Minutes</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Select disabled>
//                       <SelectTrigger className="h-8">
//                         <SelectValue />
//                       </SelectTrigger>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Charge Setup */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">4</span>
//                 CHARGE SETUP
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-6">
//                 <div>
//                   <Label className="text-sm font-medium text-gray-700">Per Slot Charge:</Label>
//                   <Input value={bookingData.perSlotCharge} className="mt-1 w-64" readOnly />
//                 </div>

//                 <div>
//                   <Label className="text-sm font-medium text-gray-700">Booking Allowed before :</Label>
//                   <div className="text-xs text-gray-500 mt-1">(Enter Time: DD Days, HH Hours, MM Minutes)</div>
//                   <div className="flex items-center gap-2 mt-2">
//                     <Input placeholder="Day" className="w-20" readOnly />
//                     <span className="text-gray-500">d</span>
//                     <Input placeholder="Hour" className="w-20" readOnly />
//                     <span className="text-gray-500">h</span>
//                     <Input placeholder="Mins" className="w-20" readOnly />
//                     <span className="text-gray-500">m</span>
//                   </div>
//                 </div>

//                 <div>
//                   <Label className="text-sm font-medium text-gray-700">Advance Booking :</Label>
//                   <div className="flex items-center gap-2 mt-2">
//                     <Input placeholder="Day" className="w-20" readOnly />
//                     <span className="text-gray-500">d</span>
//                     <Input placeholder="Hour" className="w-20" readOnly />
//                     <span className="text-gray-500">h</span>
//                     <Input placeholder="Mins" className="w-20" readOnly />
//                     <span className="text-gray-500">m</span>
//                   </div>
//                 </div>

//                 <div>
//                   <Label className="text-sm font-medium text-gray-700">Can Cancel Before Schedule :</Label>
//                   <div className="flex items-center gap-2 mt-2">
//                     <Input placeholder="Day" className="w-20" readOnly />
//                     <span className="text-gray-500">d</span>
//                     <Input placeholder="Hour" className="w-20" readOnly />
//                     <span className="text-gray-500">h</span>
//                     <Input placeholder="Mins" className="w-20" readOnly />
//                     <span className="text-gray-500">m</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Slot Setup */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">5</span>
//                 SLOT SETUP
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={bookingData.allowMultipleSlots}
//                       disabled
//                       className="w-4 h-4 text-blue-600"
//                     />
//                     <Label className="text-sm font-medium">Allow Multiple Slots</Label>
//                   </div>
//                   <Input value="15" className="w-20" readOnly />
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <Label className="text-sm font-medium">Facility can be booked</Label>
//                   <Input value="10" className="w-20" readOnly />
//                   <span className="text-sm">times per day by User</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Cover Image & Booking Summary Image */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                   <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">6</span>
//                   COVER IMAGE
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                   <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
//                   <p className="text-sm text-gray-500">Drop & Drop or Choose file</p>
//                   <p className="text-xs text-gray-400 mt-1">Accepted file formats: JPG/JPEG (format: 516px, width: 516px), max 2 MB</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                   <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">6</span>
//                   Booking Summary Image
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                   <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
//                   <p className="text-sm text-gray-500">Drop & Drop or Choose file</p>
//                   <p className="text-xs text-gray-400 mt-1">Accepted file formats: JPG/JPEG (format: 516px, width: 516px), max 2 MB</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Description */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">7</span>
//                 DESCRIPTION
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Textarea
//                 placeholder="Enter description..."
//                 className="min-h-[100px]"
//                 readOnly
//               />
//             </CardContent>
//           </Card>

//           {/* Terms & Conditions and Cancellation Text */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                   <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">8</span>
//                   TERMS & CONDITIONS
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Textarea
//                   placeholder="Enter terms and conditions..."
//                   className="min-h-[100px]"
//                   readOnly
//                 />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                   <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">8</span>
//                   CANCELLATION TEXT
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Textarea
//                   placeholder="Enter cancellation text..."
//                   className="min-h-[100px]"
//                   readOnly
//                 />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Block Days */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">9</span>
//                 BLOCK DAYS
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <Input placeholder="Select Date" className="w-full" readOnly />
//                   </div>
//                   <div className="flex items-center space-x-6">
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="radio"
//                         id="entireDay"
//                         name="blockType"
//                         value="entireDay"
//                         disabled
//                         className="w-4 h-4"
//                       />
//                       <label htmlFor="entireDay" className="text-sm">Entire Day</label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="radio"
//                         id="selectedSlots"
//                         name="blockType"
//                         value="selectedSlots"
//                         disabled
//                         className="w-4 h-4"
//                       />
//                       <label htmlFor="selectedSlots" className="text-sm">Selected Slots</label>
//                     </div>
//                   </div>
//                   <div>
//                     <Textarea
//                       placeholder="Please mention block reason"
//                       className="min-h-[80px] resize-none"
//                       readOnly
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <div className="grid grid-cols-3 gap-4 py-3 bg-gray-100 px-4 font-semibold text-sm">
//                     <div>Block Days</div>
//                     <div>Blocked Slot</div>
//                     <div>Block Reason</div>
//                   </div>
//                   <div className="min-h-[100px] border border-gray-200 p-4">
//                     {/* Empty state - no blocked days */}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Configure Amenity Info */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">10</span>
//                 CONFIGURE AMENITY INFO
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div className="flex items-center space-x-2">
//                   <input type="checkbox" disabled />
//                   <Label className="text-sm">TV</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <input type="checkbox" disabled />
//                   <Label className="text-sm">Whiteboard</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <input type="checkbox" disabled />
//                   <Label className="text-sm">Cooking</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <input type="checkbox" disabled />
//                   <Label className="text-sm">Sound bar for TV</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <input type="checkbox" disabled />
//                   <Label className="text-sm">Wireless Charging</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <input type="checkbox" disabled />
//                   <Label className="text-sm">Meeting Room - Hartomy</Label>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Seater Info */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">11</span>
//                 SEATER INFO
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div>
//                 <Label className="text-sm font-medium">Seater Info</Label>
//                 <Select value={bookingData.seaterInfo} disabled>
//                   <SelectTrigger className="mt-1 w-48">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="8 Seater">8 Seater</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Floor Info */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">12</span>
//                 FLOOR INFO
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div>
//                 <Label className="text-sm font-medium">Floor Info</Label>
//                 <Select disabled>
//                   <SelectTrigger className="mt-1 w-48">
//                     <SelectValue placeholder="1st Floor" />
//                   </SelectTrigger>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Shared Content Info */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
//                 <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">13</span>
//                 Shared Content Info
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-gray-600 mb-3">
//                 Text content will appear on booking room share icon in Application
//               </p>
//               <Textarea
//                 placeholder="Enter shared content text..."
//                 className="min-h-[100px]"
//                 readOnly
//               />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };




import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { getAuthHeader } from "@/config/apiConfig";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Custom theme for MUI components
const muiTheme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
      defaultProps: {
        shrink: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiSelect-select": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
    },
  },
});

export const BookingSetupDetailPage = () => {
  const coverImageRef = useRef(null);
  const bookingImageRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [selectedBookingFiles, setSelectedBookingFiles] = useState<File[]>([]);

  const [additionalOpen, setAdditionalOpen] = useState(false);

  const [formData, setFormData] = useState({
    facilityName: "",
    isBookable: true,
    isRequest: false,
    active: "Select",
    department: "Select Department",
    appKey: "",
    postpaid: false,
    prepaid: false,
    payOnFacility: false,
    complimentary: false,
    gstPercentage: "",
    sgstPercentage: "",
    perSlotCharge: "",
    bookingAllowedBefore: { day: "", hour: "", minute: "" },
    advanceBooking: { day: "", hour: "", minute: "" },
    canCancelBefore: { day: "", hour: "", minute: "" },
    allowMultipleSlots: false,
    maximumSlots: "",
    facilityBookedTimes: "",
    description: "",
    termsConditions: "",
    cancellationText: "",
    amenities: {
      tv: false,
      whiteboard: false,
      casting: false,
      smartPenForTV: false,
      wirelessCharging: false,
      meetingRoomInventory: false,
    },
    seaterInfo: "Select a seater",
    floorInfo: "Select a floor",
    sharedContentInfo: "",
    slots: [
      {
        startTime: { hour: "00", minute: "00" },
        breakTimeStart: { hour: "00", minute: "00" },
        breakTimeEnd: { hour: "00", minute: "00" },
        endTime: { hour: "00", minute: "00" },
        concurrentSlots: "",
        slotBy: 15,
        wrapTime: "",
      },
    ],
  });

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [cancellationRules, setCancellationRules] = useState([
    {
      description:
        "If user cancels the booking selected hours/days prior to schedule, a percentage of the amount will be deducted",
      time: { type: "Hr", value: "00", day: "0" },
      deduction: "",
    },
    {
      description:
        "If user cancels the booking selected hours/days prior to schedule, a percentage of the amount will be deducted",
      time: { type: "Hr", value: "00", day: "0" },
      deduction: "",
    },
    {
      description:
        "If user cancels the booking selected hours/days prior to schedule, a percentage of the amount will be deducted",
      time: { type: "Hr", value: "00", day: "0" },
      deduction: "",
    },
  ]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFile(files);
  };

  const handleBookingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedBookingFiles(files);
  };

  const triggerFileSelect = () => {
    coverImageRef.current?.click();
  };

  const triggerBookingImgSelect = () => {
    bookingImageRef.current?.click();
  };

  const handleAdditionalOpen = () => {
    setAdditionalOpen(!additionalOpen);
  };

  const fetchDepartments = async () => {
    if (departments.length > 0) return; // Don't fetch if already loaded

    setLoadingDepartments(true);
    try {
      const response = await fetch(
        "https://fm-uat-api.lockated.com/pms/departments.json",
        {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      // Handle different response structures
      let departmentsList = [];
      if (Array.isArray(data)) {
        departmentsList = data;
      } else if (data && Array.isArray(data.departments)) {
        departmentsList = data.departments;
      } else if (data && data.length !== undefined) {
        // Handle case where data might be array-like
        departmentsList = Array.from(data);
      }

      setDepartments(departmentsList);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [])

  const addSlot = () => {
    const newSlot = {
      startTime: { hour: "00", minute: "00" },
      breakTimeStart: { hour: "00", minute: "00" },
      breakTimeEnd: { hour: "00", minute: "00" },
      endTime: { hour: "00", minute: "00" },
      concurrentSlots: "",
      slotBy: 15,
      wrapTime: "",
    };
    setFormData({ ...formData, slots: [...formData.slots, newSlot] });
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="px-5 bg-white min-h-screen">
        <div className="bg-white rounded-lg max-w-6xl mx-auto">
          {/* Header */}
          {/* <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                FACILITY BOOKING SETUP
              </h2>
            </div>
          </div> */}

          <div className="p-6 space-y-8">
            <div className="border border-[#C72030]/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  Basic Info
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextField
                  label="Facility Name*"
                  placeholder="Enter Facility Name"
                  value={formData.facilityName}
                  onChange={(e) =>
                    setFormData({ ...formData, facilityName: e.target.value })
                  }
                  variant="outlined"
                />
                <FormControl>
                  <InputLabel>Active*</InputLabel>
                  <Select
                    value={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.value })
                    }
                    label="Active*"
                  >
                    <MenuItem value="Select">Select</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                    <MenuItem value="0">No</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    label="Department"
                  >
                    <MenuItem value="Select Department">
                      {loadingDepartments ? "Loading..." : "Select Department"}
                    </MenuItem>
                    {Array.isArray(departments) &&
                      departments.map((dept, index) => (
                        <MenuItem key={index} value={dept.id}>
                          {dept.department_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>

              {/* Radio Buttons */}
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="bookable"
                    name="type"
                    checked={formData.isBookable}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        isBookable: true,
                        isRequest: false,
                      })
                    }
                    className="text-blue-600"
                  />
                  <label htmlFor="bookable">Bookable</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="request"
                    name="type"
                    checked={formData.isRequest}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        isBookable: false,
                        isRequest: true,
                      })
                    }
                    className="text-blue-600"
                  />
                  <label htmlFor="request">Request</label>
                </div>
              </div>
            </div>

            {/* Configure Slot */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  CONFIGURE SLOT
                </h3>
              </div>
              <Button
                onClick={addSlot}
                className="mb-4 bg-purple-600 hover:bg-purple-700"
              >
                Add
              </Button>

              {/* Slot Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-sm font-medium text-gray-600">
                <div>Start Time</div>
                <div>Break Time Start</div>
                <div>Break Time End</div>
                <div>End Time</div>
                <div>Concurrent Slots</div>
                <div>Slot by</div>
                <div>Wrap Time</div>
              </div>

              {/* Slot Rows */}
              {formData.slots.map((slot, index) => (
                <div key={index} className="grid grid-cols-7 gap-2 mb-2">
                  {/* Start Time */}
                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select
                        value={slot.startTime.hour}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].startTime.hour = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select
                        value={slot.startTime.minute}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].startTime.minute = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Break Time Start */}
                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select
                        value={slot.breakTimeStart.hour}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].breakTimeStart.hour = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select
                        value={slot.breakTimeStart.minute}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].breakTimeStart.minute =
                            e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Break Time End */}
                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select
                        value={slot.breakTimeEnd.hour}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].breakTimeEnd.hour = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select
                        value={slot.breakTimeEnd.minute}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].breakTimeEnd.minute = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* End Time */}
                  <div className="flex gap-1">
                    <FormControl size="small">
                      <Select
                        value={slot.endTime.hour}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].endTime.hour = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <Select
                        value={slot.endTime.minute}
                        onChange={(e) => {
                          const newSlots = [...formData.slots];
                          newSlots[index].endTime.minute = e.target.value;
                          setFormData({ ...formData, slots: newSlots });
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Concurrent Slots */}
                  <TextField
                    size="small"
                    value={slot.concurrentSlots}
                    onChange={(e) => {
                      const newSlots = [...formData.slots];
                      newSlots[index].concurrentSlots = e.target.value;
                      setFormData({ ...formData, slots: newSlots });
                    }}
                    variant="outlined"
                  />

                  {/* Slot By */}
                  <FormControl size="small">
                    <Select
                      value={slot.slotBy}
                      onChange={(e) => {
                        const newSlots = [...formData.slots];
                        newSlots[index].slotBy = e.target.value;
                        setFormData({ ...formData, slots: newSlots });
                      }}
                    >
                      <MenuItem value={15}>15 Minutes</MenuItem>
                      <MenuItem value={30}>Half hour</MenuItem>
                      <MenuItem value={45}>45 Minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={90}>1 and a half hours</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Wrap Time */}
                  <TextField
                    size="small"
                    value={slot.wrapTime}
                    onChange={(e) => {
                      const newSlots = [...formData.slots];
                      newSlots[index].wrapTime = e.target.value;
                      setFormData({ ...formData, slots: newSlots });
                    }}
                    variant="outlined"
                  />
                </div>
              ))}

              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Booking Allowed before :
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    (Enter Time: DD Days, HH Hours, MM Minutes)
                  </p>
                  <div className="flex gap-2 items-center">
                    <TextField
                      placeholder="Day"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.bookingAllowedBefore.day}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bookingAllowedBefore: {
                            ...formData.bookingAllowedBefore,
                            day: e.target.value,
                          },
                        })
                      }
                    />
                    <span>d</span>
                    <TextField
                      placeholder="Hour"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.bookingAllowedBefore.hour}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bookingAllowedBefore: {
                            ...formData.bookingAllowedBefore,
                            hour: e.target.value,
                          },
                        })
                      }
                    />
                    <span>h</span>
                    <TextField
                      placeholder="Mins"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.bookingAllowedBefore.minute}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bookingAllowedBefore: {
                            ...formData.bookingAllowedBefore,
                            minute: e.target.value,
                          },
                        })
                      }
                    />
                    <span>m</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Advance Booking :
                  </label>
                  <div className="flex gap-2 items-center">
                    <TextField
                      placeholder="Day"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.advanceBooking.day}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          advanceBooking: {
                            ...formData.advanceBooking,
                            day: e.target.value,
                          },
                        })
                      }
                    />
                    <span>d</span>
                    <TextField
                      placeholder="Hour"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.advanceBooking.hour}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          advanceBooking: {
                            ...formData.advanceBooking,
                            hour: e.target.value,
                          },
                        })
                      }
                    />
                    <span>h</span>
                    <TextField
                      placeholder="Mins"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.advanceBooking.minute}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          advanceBooking: {
                            ...formData.advanceBooking,
                            minute: e.target.value,
                          },
                        })
                      }
                    />
                    <span>m</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Can Cancel Before Schedule :
                  </label>
                  <div className="flex gap-2 items-center">
                    <TextField
                      placeholder="Day"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.canCancelBefore.day}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          canCancelBefore: {
                            ...formData.canCancelBefore,
                            day: e.target.value,
                          },
                        })
                      }
                    />
                    <span>d</span>
                    <TextField
                      placeholder="Hour"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.canCancelBefore.hour}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          canCancelBefore: {
                            ...formData.canCancelBefore,
                            hour: e.target.value,
                          },
                        })
                      }
                    />
                    <span>h</span>
                    <TextField
                      placeholder="Mins"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={formData.canCancelBefore.minute}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          canCancelBefore: {
                            ...formData.canCancelBefore,
                            minute: e.target.value,
                          },
                        })
                      }
                    />
                    <span>m</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex items-center justify-between mt-4  ">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowMultipleSlots"
                      checked={formData.allowMultipleSlots}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          allowMultipleSlots: !!checked,
                        })
                      }
                    />
                    <label htmlFor="allowMultipleSlots">
                      Allow Multiple Slots
                    </label>
                  </div>

                  {formData.allowMultipleSlots && (
                    <div>
                      <TextField
                        label="Maximum no. of slots"
                        placeholder="Maximum no. of slots"
                        value={formData.maximumSlots}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maximumSlots: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                        style={{ width: "200px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Facility can be booked</span>
                  <TextField
                    placeholder=""
                    value={formData.facilityBookedTimes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        facilityBookedTimes: e.target.value,
                      })
                    }
                    variant="outlined"
                    size="small"
                    style={{ width: "80px" }}
                  />
                  <span>times per day by User</span>
                </div>
              </div>
            </div>

            {/* Configure Payment */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  CONFIGURE PAYMENT
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="postpaid"
                    checked={formData.postpaid}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, postpaid: !!checked })
                    }
                  />
                  <label htmlFor="postpaid">Postpaid</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prepaid"
                    checked={formData.prepaid}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, prepaid: !!checked })
                    }
                  />
                  <label htmlFor="prepaid">Prepaid</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payOnFacility"
                    checked={formData.payOnFacility}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, payOnFacility: !!checked })
                    }
                  />
                  <label htmlFor="payOnFacility">Pay on Facility</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="complimentary"
                    checked={formData.complimentary}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, complimentary: !!checked })
                    }
                  />
                  <label htmlFor="complimentary">Complimentary</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextField
                  label="SGST(%)"
                  value={formData.sgstPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, sgstPercentage: e.target.value })
                  }
                  variant="outlined"
                />
                <TextField
                  label="GST(%)"
                  value={formData.gstPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, gstPercentage: e.target.value })
                  }
                  variant="outlined"
                />
              </div>

              <TextField
                label="Per Slot Charge"
                value={formData.perSlotCharge}
                onChange={(e) =>
                  setFormData({ ...formData, perSlotCharge: e.target.value })
                }
                variant="outlined"
              />
            </div>

            {/* Cover Image */}
            <div className="flex items-center justify-between gap-4">
              {/* Cover Image */}
              <div className="border border-[#C72030]/20 rounded-lg p-4 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    COVER IMAGE
                  </h3>
                </div>
                <div
                  className="border-2 border-dashed border-[#C72030]/30 rounded-lg p-8 text-center"
                  onClick={triggerFileSelect}
                >
                  <div className="text-[#C72030] mb-2">
                    <Upload className="h-8 w-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Drag & Drop or{" "}
                    <span className="text-[#C72030] cursor-pointer">
                      Choose File
                    </span>{" "}
                    No file chosen
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted file formats: PNG/JPEG (height: 142px, width:
                    328px) (max 5 mb)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleCoverImageChange}
                  ref={coverImageRef}
                  hidden
                />
                {selectedFile.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {selectedFile.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`cover-preview-${index}`}
                        className="h-[80px] w-20 rounded border border-gray-200"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Summary Image */}
              <div className="border border-[#C72030]/20 rounded-lg p-4 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    5
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    Booking Summary Image
                  </h3>
                </div>
                <div
                  className="border-2 border-dashed border-[#C72030]/30 rounded-lg p-8 text-center"
                  onClick={triggerBookingImgSelect}
                >
                  <div className="text-[#C72030] mb-2">
                    <Upload className="h-8 w-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Drag & Drop or{" "}
                    <span className="text-[#C72030] cursor-pointer">
                      Choose File
                    </span>{" "}
                    No file chosen
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted file formats: PNG/JPEG (height: 91px, width: 108px)
                    (max 5 mb)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleBookingImageChange}
                  ref={bookingImageRef}
                  multiple
                  hidden
                />
                {selectedBookingFiles.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {selectedBookingFiles.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`cover-preview-${index}`}
                        className="h-[80px] w-20 rounded border border-gray-200 bg-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  6
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  DESCRIPTION
                </h3>
              </div>
              <Textarea
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>

            {/* Terms & Conditions and Cancellation Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-[#C72030]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    7
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    TERMS & CONDITIONS
                  </h3>
                </div>
                <Textarea
                  placeholder="Enter terms and conditions"
                  value={formData.termsConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      termsConditions: e.target.value,
                    })
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div className="border border-[#C72030]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    8
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    CANCELLATION TEXT
                  </h3>
                </div>
                <Textarea
                  placeholder="Enter cancellation text"
                  value={formData.cancellationText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cancellationText: e.target.value,
                    })
                  }
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Cancellation Rules */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  9
                </div>
                <h3 className="text-lg font-semibold text-[#C72030]">
                  RULE SETUP
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="font-medium text-gray-700">
                  Rules Description
                </div>
                <div className="font-medium text-gray-700">Time</div>
                <div className="font-medium text-gray-700">Deduction</div>
              </div>
              {cancellationRules.map((rule, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 mb-2 items-center"
                >
                  {/* Description */}
                  <div className="text-sm text-gray-600">
                    {rule.description}
                  </div>

                  {/* Time Type & Value */}
                  <div className="flex gap-2">
                    {/* Day Input */}
                    <TextField
                      placeholder="Day"
                      size="small"
                      style={{ width: "80px" }}
                      variant="outlined"
                      value={rule.time.day}
                      onChange={(e) => {
                        const newRules = [...cancellationRules];
                        newRules[index].time.day = e.target.value;
                        setCancellationRules(newRules);
                      }}
                    />

                    {/* Type: Hr or Day */}
                    <FormControl size="small" style={{ width: "80px" }}>
                      <Select
                        value={rule.time.type}
                        onChange={(e) => {
                          const newRules = [...cancellationRules];
                          newRules[index].time.type = e.target.value;
                          setCancellationRules(newRules);
                        }}
                      >
                        <MenuItem value="Hr">Hr</MenuItem>
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Value: 0 - 23 */}
                    <FormControl size="small" style={{ width: "80px" }}>
                      <Select
                        value={rule.time.value}
                        onChange={(e) => {
                          const newRules = [...cancellationRules];
                          newRules[index].time.value = e.target.value;
                          setCancellationRules(newRules);
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Percentage Input */}
                  <TextField
                    placeholder="%"
                    size="small"
                    variant="outlined"
                    value={rule.deduction}
                    onChange={(e) => {
                      const newRules = [...cancellationRules];
                      newRules[index].deduction = e.target.value;
                      setCancellationRules(newRules);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className={`border border-[#C72030]/20 rounded-lg p-4 space-y-4 overflow-hidden ${additionalOpen ? 'h-auto' : 'h-[3.8rem]'}`}>
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold"></div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    ADDITIONAL SETUP
                  </h3>
                </div>
                {additionalOpen ? (
                  <ChevronUp
                    onClick={handleAdditionalOpen}
                    className="cursor-pointer"
                  />
                ) : (
                  <ChevronDown
                    onClick={handleAdditionalOpen}
                    className="cursor-pointer"
                  />
                )}
              </div>
              {/* Configure Amenity Info */}
              <div className="border border-[#C72030]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    11
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    CONFIGURE AMENITY INFO
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tv"
                      checked={formData.amenities.tv}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: { ...formData.amenities, tv: !!checked },
                        })
                      }
                    />
                    <label htmlFor="tv">TV</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whiteboard"
                      checked={formData.amenities.whiteboard}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            whiteboard: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="whiteboard">Whiteboard</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="casting"
                      checked={formData.amenities.casting}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            casting: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="casting">Casting</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smartPenForTV"
                      checked={formData.amenities.smartPenForTV}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            smartPenForTV: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="smartPenForTV">Smart Pen for TV</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wirelessCharging"
                      checked={formData.amenities.wirelessCharging}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            wirelessCharging: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="wirelessCharging">Wireless Charging</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meetingRoomInventory"
                      checked={formData.amenities.meetingRoomInventory}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            meetingRoomInventory: !!checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="meetingRoomInventory">
                      Meeting Room Inventory
                    </label>
                  </div>
                </div>
              </div>

              {/* Seater Info */}
              <div className="border border-[#C72030]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    12
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    SEATER INFO
                  </h3>
                </div>
                <FormControl>
                  <InputLabel>Seater Info</InputLabel>
                  <Select
                    value={formData.seaterInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, seaterInfo: e.target.value })
                    }
                    label="Seater Info"
                  >
                    <MenuItem value="Select a seater">Select a seater</MenuItem>
                    <MenuItem value="1 Seater">1 Seater</MenuItem>
                    <MenuItem value="2 Seater">2 Seater</MenuItem>
                    <MenuItem value="3 Seater">3 Seater</MenuItem>
                    <MenuItem value="4 Seater">4 Seater</MenuItem>
                    <MenuItem value="5 Seater">5 Seater</MenuItem>
                    <MenuItem value="6 Seater">6 Seater</MenuItem>
                    <MenuItem value="7 Seater">7 Seater</MenuItem>
                    <MenuItem value="8 Seater">8 Seater</MenuItem>
                    <MenuItem value="9 Seater">9 Seater</MenuItem>
                    <MenuItem value="10 Seater">10 Seater</MenuItem>
                    <MenuItem value="11 Seater">11 Seater</MenuItem>
                    <MenuItem value="12 Seater">12 Seater</MenuItem>
                    <MenuItem value="13 Seater">13 Seater</MenuItem>
                    <MenuItem value="14 Seater">14 Seater</MenuItem>
                    <MenuItem value="15 Seater">15 Seater</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Floor Info */}
              <div className="border border-[#C72030]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    13
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    FLOOR INFO
                  </h3>
                </div>
                <FormControl>
                  <InputLabel>Floor Info</InputLabel>
                  <Select
                    value={formData.floorInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, floorInfo: e.target.value })
                    }
                    label="Floor Info"
                  >
                    <MenuItem value="Select a floor">Select a floor</MenuItem>
                    <MenuItem value="1st Floor">1st Floor</MenuItem>
                    <MenuItem value="2nd Floor">2nd Floor</MenuItem>
                    <MenuItem value="3rd Floor">3rd Floor</MenuItem>
                    <MenuItem value="4th Floor">4th Floor</MenuItem>
                    <MenuItem value="5th Floor">5th Floor</MenuItem>
                    <MenuItem value="6th Floor">6th Floor</MenuItem>
                    <MenuItem value="7th Floor">7th Floor</MenuItem>
                    <MenuItem value="8th Floor">8th Floor</MenuItem>
                    <MenuItem value="9th Floor">9th Floor</MenuItem>
                    <MenuItem value="10th Floor">10th Floor</MenuItem>
                    <MenuItem value="11th Floor">11th Floor</MenuItem>
                    <MenuItem value="12th Floor">12th Floor</MenuItem>
                    <MenuItem value="13th Floor">13th Floor</MenuItem>
                    <MenuItem value="14th Floor">14th Floor</MenuItem>
                    <MenuItem value="15th Floor">15th Floor</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Shared Content Info */}
              <div className="border border-[#C72030]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    14
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    Shared Content Info
                  </h3>
                </div>
                <Textarea
                  placeholder="Text content will appear on meeting room share icon in Application"
                  value={formData.sharedContentInfo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sharedContentInfo: e.target.value,
                    })
                  }
                  className="min-h-[100px]"
                />
              </div>

              {/* Configure App Key */}
              <div className="border border-[#C72030]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-[#C72030]">
                    CONFIGURE APP KEY
                  </h3>
                </div>
                <TextField
                  label="App Key"
                  placeholder="Enter Alphanumeric Key"
                  value={formData.appKey}
                  onChange={(e) =>
                    setFormData({ ...formData, appKey: e.target.value })
                  }
                  variant="outlined"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
