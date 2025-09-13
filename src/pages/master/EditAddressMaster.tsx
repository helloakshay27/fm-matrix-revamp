import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createAddress } from "@/store/slices/addressMasterSlice";
import { toast } from "sonner";

const states = {
    "01": "JAMMU AND KASHMIR",
    "02": "HIMACHAL PRADESH",
    "03": "PUNJAB",
    "04": "CHANDIGARH",
    "05": "UTTARAKHAND",
    "06": "HARYANA",
    "07": "DELHI",
    "08": "RAJASTHAN",
    "09": "UTTAR  PRADESH",
    "10": "BIHAR",
    "11": "SIKKIM",
    "12": "ARUNACHAL PRADESH",
    "13": "NAGALAND",
    "14": "MANIPUR",
    "15": "MIZORAM",
    "16": "TRIPURA",
    "17": "MEGHLAYA",
    "18": "ASSAM",
    "19": "WEST BENGAL",
    "20": "JHARKHAND",
    "21": "ODISHA",
    "22": "CHATTISGARH",
    "23": "MADHYA PRADESH",
    "24": "GUJARAT",
    "25": "DAMAN AND DIU",
    "26": "DADRA AND NAGAR HAVELI",
    "27": "MAHARASHTRA",
    "28": "ANDHRA PRADESH (BEFORE DIVISION)",
    "29": "KARNATAKA",
    "30": "GOA",
    "31": "LAKSHWADEEP",
    "32": "KERALA",
    "33": "TAMIL NADU",
    "34": "PUDUCHERRY",
    "35": "ANDAMAN AND NICOBAR ISLANDS",
    "36": "TELANGANA",
    "37": "ANDHRA PRADESH (NEW)",
};

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const EditAddressMaster = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        addressTitle: '',
        buildingName: '',
        email: '',
        state: '',
        phoneNumber: '',
        faxNumber: '',
        panNumber: '',
        gstNumber: '',
        address: '',
        note: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            admin_invoice_address: {
                title: formData.addressTitle,
                building_name: formData.buildingName,
                email: formData.email,
                state_code: formData.state,
                phone: formData.phoneNumber,
                fax: formData.faxNumber,
                pan_number: formData.panNumber,
                gst_number: formData.gstNumber,
                address: formData.address,
                notes: formData.note
            }
        }
        try {
            setIsSubmitting(true);
            await dispatch(createAddress({ token, baseUrl, data: payload })).unwrap();
            toast.success('Address created successfully');
            navigate('/master/address');
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 mx-auto">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-0"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            <h1 className="text-2xl font-bold mb-6">EDIT ADDRESS</h1>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[#C72030] flex items-center">
                                Address Setup
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <TextField
                                label="Address Title"
                                name="addressTitle"
                                value={formData.addressTitle}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                label="Building Name"
                                name="buildingName"
                                value={formData.buildingName}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                            />
                            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                                <InputLabel shrink>State*</InputLabel>
                                <Select
                                    label="State*"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="">
                                        <em>Select State</em>
                                    </MenuItem>
                                    {Object.entries(states).map(([code, name]) => (
                                        <MenuItem key={code} value={code}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                label="Fax Number"
                                name="faxNumber"
                                value={formData.faxNumber}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                label="Pan Number"
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                label="GST Number"
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder=""
                                fullWidth
                                variant="outlined"
                                multiline
                                minRows={2}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    mt: 1,
                                    "& .MuiOutlinedInput-root": {
                                        height: "auto !important",
                                        padding: "2px !important",
                                    },
                                }}
                            />
                            <TextField
                                label="Note"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder=""
                                fullWidth
                                variant="outlined"
                                multiline
                                minRows={2}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    mt: 1,
                                    "& .MuiOutlinedInput-root": {
                                        height: "auto !important",
                                        padding: "2px !important",
                                    },
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-[#C72030] hover:bg-[#C72030] text-white"
                        disabled={isSubmitting}
                    >
                        Update
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default EditAddressMaster