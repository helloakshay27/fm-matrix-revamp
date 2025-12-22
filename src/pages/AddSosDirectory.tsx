import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { TextField, IconButton, Box } from "@mui/material"
import axios from "axios";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const AddSosDirectory = () => {
    const attachmentInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<{
        title: string;
        contact_number: string;
        image: File | null;
    }>({
        title: "",
        contact_number: "",
        image: null,
    });
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
        }));
        setImagePreview(null);
        if (attachmentInputRef.current) {
            attachmentInputRef.current.value = "";
        }
    };

    const isFormValid = formData.title.trim() !== "" && formData.contact_number.trim() !== "" && formData.image !== null;

    const handleSubmit = async () => {
        const payload = {
            sos_directory: {
                title: formData.title,
                contact_number: formData.contact_number,
                status: "true",
                directory_type: type,
                resource_id: localStorage.getItem('selectedSiteId'),
                resource_type: "Pms::Site"
            }
        }

        setSubmitting(true)

        try {
            await axios.post(`https://${baseUrl}/sos_directories.json`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                }
            })

            toast.success('Directory Added Successfully')
            navigate(-1)
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <div className="p-6">
            <Card>
                <CardContent>
                    <div className="flex items-center gap-3 pt-6 pb-3">
                        <h3 className="text-lg font-semibold text-[#1A1A1A]">Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField
                            label="Title*"
                            name="title"
                            placeholder="Enter Title"
                            fullWidth
                            variant="outlined"
                            value={formData.title}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            label="Contact Number*"
                            name="contact_number"
                            placeholder="Enter Number"
                            fullWidth
                            variant="outlined"
                            value={formData.contact_number}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                            sx={{ mt: 1 }}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-6 pb-3">
                        <h3 className="text-lg font-semibold text-[#1A1A1A]">Upload Image</h3>
                    </div>

                    <div className="mt-3">
                        <input
                            type="file"
                            hidden
                            ref={attachmentInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {!imagePreview ? (
                            <Button
                                onClick={() => attachmentInputRef.current?.click()}
                            >
                                <Plus className="w-4 h-4 mr-2" color="#C72030" />
                                Add
                            </Button>
                        ) : (
                            <Box sx={{ position: "relative", width: "fit-content" }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                    }}
                                />
                                <IconButton
                                    onClick={handleRemoveImage}
                                    sx={{
                                        position: "absolute",
                                        top: -10,
                                        right: -10,
                                        backgroundColor: "white",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                        padding: "4px",
                                    }}
                                    size="small"
                                >
                                    <X size={16} color="red" />
                                </IconButton>
                            </Box>
                        )}
                    </div>

                    {isFormValid && (
                        <div className="flex justify-center mt-6">
                            <Button
                                className="!bg-[#C72030] !hover:bg-[#A01020] !text-white px-8"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                Submit
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default AddSosDirectory