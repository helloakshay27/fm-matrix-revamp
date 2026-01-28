import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { fetchBookingDetails } from '@/store/slices/facilityBookingsSlice';
import { fetchActiveFacilities } from '@/store/slices/facilitySetupsSlice';
import { MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner';

const fieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '0.375rem',
        backgroundColor: 'white',
        height: {
            xs: '36px',
            sm: '45px'
        },
        '& fieldset': {
            borderColor: '#d1d5db',
        },
        '&:hover fieldset': {
            borderColor: '#9ca3af',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#3b82f6',
        },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: '#3b82f6',
        },
    },
};

const EditFacilityBookingPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams();

    const token = localStorage.getItem('token') || ''
    const baseUrl = localStorage.getItem('baseUrl') || ''

    const [selectedUser, setSelectedUser] = useState("")
    const [users, setUsers] = useState<any[]>([])
    const [selectedFacility, setSelectedFacility] = useState<any>("")
    const [facilities, setFacilities] = useState<any[]>([])
    const [facilitySetupsLoading, setFacilitySetupsLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState("")
    const [comment, setComment] = useState("")
    const [subTotal, setSubTotal] = useState("")
    const [gstPercentage, setGstPercentage] = useState("")
    const [sgstPercentage, setSgstPercentage] = useState("")
    const [amountFull, setAmountFull] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentStatus, setCurrentStatus] = useState<string>("");
    const [statusUpdating, setStatusUpdating] = useState(false);
    const gstAmount = (parseFloat(subTotal) * Number(gstPercentage)) / 100 || 0
    const sgstAmount = (parseFloat(subTotal) * Number(sgstPercentage)) / 100 || 0
    const grandTotal = parseFloat(subTotal) + gstAmount + sgstAmount || 0

    const getUsers = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Asset`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers(response.data.users || []);

        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    const getFacilitySetups = async () => {
        setFacilitySetupsLoading(true);
        try {
            const response = await dispatch(fetchActiveFacilities({ baseUrl, token })).unwrap();
            setFacilities(response.facility_setups);
        } catch (error) {
            console.log(error)
        } finally {
            setFacilitySetupsLoading(false);
        }
    }

    const fetchDetails = async () => {
        try {
            const response = await dispatch(
                fetchBookingDetails({ baseUrl, token, id })
            ).unwrap();

            const bookingDetails = (response as any) || response as any;
            setSelectedUser(bookingDetails.user_id?.toString() || "");
            setSelectedFacility(bookingDetails.facility_id?.toString() || "");
            if (bookingDetails.startdate) {
                const dateStr = bookingDetails.startdate.split(' ')[0];
                setSelectedDate(dateStr);
            }
            setComment(bookingDetails.comment || "");
            setSubTotal(bookingDetails.sub_total || "");
            setGstPercentage(bookingDetails.gst?.toString() || "");
            setSgstPercentage(bookingDetails.sgst?.toString() || "");
            setAmountFull(bookingDetails.amount_full || "");
            setCurrentStatus(bookingDetails.current_status || "");
        } catch (error) {
            console.error("Error fetching booking details:", error);
            toast.error("Failed to fetch booking details");
        }
    };

    useEffect(() => {
        getUsers();
        fetchDetails();
        getFacilitySetups();
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!id) {
            toast.error('Booking ID is missing');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                facility_booking: {
                    sgst: sgstPercentage ? parseFloat(sgstPercentage) : '',
                    gst: gstPercentage ? parseFloat(gstPercentage) : '',
                    sub_total: Number(subTotal),
                    amount_full: grandTotal,
                    amount_paid: grandTotal,
                }
            };

            const response = await axios.put(
                `https://${baseUrl}/pms/facility_bookings/${id}.json`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );

            if (response.status === 200 || response.status === 204) {
                toast.success('Facility booking updated successfully');
                navigate(-1);
            }
        } catch (error: any) {
            console.error('Error updating booking:', error);
            toast.error(error.response?.data?.message || 'Failed to update facility booking');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        setStatusUpdating(true);
        try {
            await axios.patch(
                `https://${baseUrl}/pms/admin/facility_bookings/${id}.json`,
                { current_status: newStatus.toLowerCase() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCurrentStatus(newStatus);
            toast.success(`Booking status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating booking status:', error);
            toast.error('Failed to update booking status');
        } finally {
            setStatusUpdating(false);
        }
    };

    return (
        <div className="p-6 mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>
                    </div>
                    {currentStatus && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-200">
                            <span className="text-sm text-gray-600">Status</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <Select
                                value={currentStatus}
                                onValueChange={(newStatus) => handleStatusChange(newStatus)}
                                disabled={statusUpdating}
                            >
                                <SelectTrigger className="border-none bg-transparent p-0 h-auto [&>svg]:hidden">
                                    <div
                                        className={`text-sm px-2 py-[2px] flex items-center gap-2 cursor-pointer font-medium ${currentStatus === "Cancelled"
                                            ? "text-red-600 bg-red-50"
                                            : currentStatus === "Confirmed"
                                                ? "text-green-600 bg-green-50"
                                                : "text-yellow-600 bg-yellow-50"
                                            }`}
                                        style={{ borderRadius: "4px" }}
                                    >
                                        <span
                                            className={`rounded-full w-2 h-2 inline-block ${currentStatus === "Cancelled"
                                                ? "bg-[#D92E14]"
                                                : currentStatus === "Confirmed"
                                                    ? "bg-[#16B364]"
                                                    : "bg-[#D9CA20]"
                                                }`}
                                        ></span>
                                        {currentStatus}
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="Confirmed">
                                        Confirmed
                                    </SelectItem>
                                    <SelectItem value="Cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <TextField
                            select
                            required
                            label="User"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            variant="outlined"
                            fullWidth
                            SelectProps={{ displayEmpty: true }}
                            InputLabelProps={{
                                classes: {
                                    asterisk: "text-red-500", // Tailwind class for red color
                                },
                                shrink: true
                            }}
                            sx={fieldStyles}
                            disabled
                        >
                            <MenuItem value="" disabled>
                                <em>
                                    Select User
                                </em>
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id.toString()}>
                                    {user.full_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div className="space-y-2">
                        <TextField
                            select
                            required
                            label="Facility"
                            value={selectedFacility}
                            variant="outlined"
                            fullWidth
                            SelectProps={{ displayEmpty: true }}
                            InputLabelProps={{
                                classes: {
                                    asterisk: "text-red-500", // Tailwind class for red color
                                },
                                shrink: true
                            }}
                            sx={fieldStyles}
                            disabled
                        >
                            <MenuItem value="" disabled>
                                <em>
                                    Select Facility
                                </em>
                            </MenuItem>
                            {facilitySetupsLoading && (
                                <MenuItem value="" disabled>
                                    Loading facilities...
                                </MenuItem>
                            )}
                            {!facilitySetupsLoading && facilities.length === 0 && (
                                <MenuItem value="" disabled>
                                    No facilities available
                                </MenuItem>
                            )}
                            {facilities.map((facility) => (
                                <MenuItem key={facility.id} value={facility.id}>
                                    {facility.fac_name} ({facility.fac_type.charAt(0).toUpperCase() + facility.fac_type.slice(1)})
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div className="space-y-2">
                        <TextField
                            type="date"
                            label="Date"
                            required
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            variant="outlined"
                            fullWidth
                            disabled
                            InputLabelProps={{
                                classes: {
                                    asterisk: "text-red-500", // Tailwind class for red color
                                },
                                shrink: true
                            }}
                            inputProps={{
                                min: new Date().toISOString().split("T")[0],
                            }}
                            sx={fieldStyles}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <TextField
                        label="Comment"
                        value={comment}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        disabled
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            mt: 1,
                            "& .MuiOutlinedInput-root": {
                                height: "auto !important",
                                padding: "2px !important",
                                display: "flex",
                            },
                            "& .MuiInputBase-input[aria-hidden='true']": {
                                flex: 0,
                                width: 0,
                                height: 0,
                                padding: "0 !important",
                                margin: 0,
                                display: "none",
                            },
                            "& .MuiInputBase-input": {
                                resize: "none !important",
                            },
                        }}
                        helperText={<span style={{ textAlign: 'right', display: 'block' }}>{`${comment.length}/255 characters`}</span>}
                        error={comment.length > 255}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Cost Summary</h2>
                    <div className="space-y-3">

                        {/* Subtotal Before Discount */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700 font-medium">Subtotal</span>
                            <span className="font-medium">
                                ₹ <input
                                    type="number"
                                    value={subTotal}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^[0-9]*(\.[0-9]{0,2})?$/.test(value) && !value.includes('-'))) {
                                            setSubTotal(value);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    className='w-20 text-right border border-gray-300 rounded-md px-2 py-1'
                                    min="0"
                                />
                            </span>
                        </div>

                        {/* GST */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700">GST</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm text-gray-500">
                                    <input
                                        type="number"
                                        value={gstPercentage}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (value === '' || (!value.includes('-') && /^[0-9]*(\.[0-9]{0,2})?$/.test(value))) {
                                                const numValue = parseFloat(value);
                                                if (value === '' || numValue <= 100) {
                                                    setGstPercentage(value);
                                                }
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        className='w-16 text-right border border-gray-300 rounded-md px-2 py-1 ml-2'
                                        min="0"
                                        max="100"
                                    /> %
                                </span>
                                <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* SGST */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700">SGST</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm text-gray-500">
                                    <input
                                        type="number"
                                        value={sgstPercentage}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (value === '' || (!value.includes('-') && /^[0-9]*(\.[0-9]{0,2})?$/.test(value))) {
                                                const numValue = parseFloat(value);
                                                if (value === '' || numValue <= 100) {
                                                    setSgstPercentage(value);
                                                }
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        className='w-16 text-right border border-gray-300 rounded-md px-2 py-1 ml-2'
                                        min="0"
                                        max="100"
                                    /> %
                                </span>
                                <span className="font-medium">₹{sgstAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Grand Total */}
                        <div className="flex justify-between items-center py-3 bg-[#8B4B8C] bg-opacity-10 px-4 rounded-lg mt-2">
                            <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>Grand Total</span>
                            <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        onClick={() => navigate(-1)}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Booking'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default EditFacilityBookingPage