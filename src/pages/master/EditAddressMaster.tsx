import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ArrowLeft, FileText, MapPin, Receipt } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getAddressById, updateAddress } from "@/store/slices/addressMasterSlice";
import { toast } from "sonner";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";

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

const multilineFieldStyles = {
    "& .MuiOutlinedInput-root": {
        height: "auto !important",
    },
};

const EditAddressMaster = () => {
    const { id } = useParams();
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(getAddressById({ baseUrl, token, id })).unwrap();
                setFormData({
                    addressTitle: response.title,
                    buildingName: response.building_name,
                    email: response.email,
                    state: response.state_code,
                    phoneNumber: response.phone,
                    faxNumber: response.fax,
                    panNumber: response.pan_number,
                    gstNumber: response.gst_number,
                    address: response.address,
                    note: response.notes
                })
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])

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
            await dispatch(updateAddress({ token, baseUrl, data: payload, id: Number(id) })).unwrap();
            toast.success('Address updated successfully');
            navigate('/master/address');
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    };

    const requiredLabel = (text: string) => (
        <span>
            {text}
            <span className="fm-required-mark">*</span>
        </span>
    );

    return (
        <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span>Address List</span>
                    <span>{">"}</span>
                    <span className="text-gray-900 font-medium">Edit Address</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    EDIT ADDRESS
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4 sm:space-y-6">
                    {/* Address Details */}
                    <FormSection title="ADDRESS DETAILS" icon={MapPin}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <TextField
                                label="Address Title"
                                name="addressTitle"
                                placeholder="Enter Address Title"
                                value={formData.addressTitle}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="Building Name"
                                name="buildingName"
                                placeholder="Enter Building Name"
                                value={formData.buildingName}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <FormControl fullWidth variant="outlined">
                                <InputLabel shrink>{requiredLabel("State")}</InputLabel>
                                <Select
                                    label="State*"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    displayEmpty
                                    sx={assetFieldStyles}
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
                            <div className="sm:col-span-2 lg:col-span-3">
                                <TextField
                                    label="Address"
                                    name="address"
                                    placeholder="Enter Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    InputLabelProps={{ shrink: true }}
                                    sx={multilineFieldStyles}
                                />
                            </div>
                        </div>
                    </FormSection>

                    {/* Contact & Tax Details */}
                    <FormSection title="CONTACT & TAX DETAILS" icon={Receipt}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <TextField
                                label="Email"
                                name="email"
                                placeholder="Enter Email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                placeholder="Enter Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="Fax Number"
                                name="faxNumber"
                                placeholder="Enter Fax Number"
                                value={formData.faxNumber}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="Pan Number"
                                name="panNumber"
                                placeholder="Enter PAN Number"
                                value={formData.panNumber}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="GST Number"
                                name="gstNumber"
                                placeholder="Enter GST Number"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                        </div>
                    </FormSection>

                    {/* Notes */}
                    <FormSection title="ADDITIONAL NOTES" icon={FileText}>
                        <TextField
                            label="Note"
                            name="note"
                            placeholder="Enter Note"
                            value={formData.note}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            InputLabelProps={{ shrink: true }}
                            sx={multilineFieldStyles}
                        />
                    </FormSection>
                </div>

                <FormActionBar
                    onCancel={() => navigate(-1)}
                    submitLabel="Update"
                    isSubmitting={isSubmitting}
                    submitAsFormSubmit
                />
            </form>
        </div>
    )
}

export default EditAddressMaster
