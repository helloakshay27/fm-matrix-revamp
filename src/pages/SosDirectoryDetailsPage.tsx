import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextField, Box, Switch, Typography } from "@mui/material";
import axios from "axios";
import { FileText, Loader2, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

interface SosDirectory {
    id: number;
    title: string;
    contact_number: string;
    status: boolean | string;
    image_url?: string;
    created_at?: string;
    created_by?: string;
    user?: {
        name: string;
    }
}

const SosDirectoryDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState<SosDirectory | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        contact_number: string;
        status: boolean;
        image: File | null;
    }>({
        title: "",
        contact_number: "",
        status: true,
        image: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/sos_directories/${id}.json`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const dirData = response.data;

            setData(dirData);
            setFormData({
                title: dirData.title || "",
                contact_number: dirData.contact_number || "",
                status: dirData.status === true || dirData.status === "true",
                image: dirData.document_url
            });
            if (dirData.document_url) {
                setImagePreview(dirData.document_url);
            }
        } catch (error) {
            console.error("Error fetching details:", error);
            toast.error("Failed to fetch details");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            status: e.target.checked,
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

    const handleUpdate = async () => {
        setSubmitting(true);
        try {
            const payload = new FormData();
            payload.append("sos_directory[title]", formData.title);
            payload.append("sos_directory[contact_number]", formData.contact_number);
            payload.append("sos_directory[status]", String(formData.status));

            if (formData.image) {
                payload.append("sos_directory[image]", formData.image);
            }

            await axios.put(`https://${baseUrl}/sos_directories/${id}.json`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success("Directory Updated Successfully");
            navigate(-1);
        } catch (error) {
            console.error("Error updating:", error);
            toast.error("Failed to update directory");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <Card className="bg-[#FAF9F6]">
                <div className="bg-[#F5F5F0] p-4 border-b flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8E6E1] flex items-center justify-center text-[#C72030]">
                        <FileText size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">View Detail</h2>
                </div>

                <CardContent className="p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            variant="outlined"
                            value={formData.title}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                        />
                        <TextField
                            label="Contact Number"
                            name="contact_number"
                            fullWidth
                            variant="outlined"
                            value={formData.contact_number}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                        />
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-4">Upload Image</h3>
                        <div className="flex flex-col md:flex-row gap-16">
                            <Box
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    // border: "2px dashed #ccc",
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    "&:hover": { borderColor: "#999" }
                                }}
                            >
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Directory"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <User size={48} className="text-gray-400" strokeWidth={1} />
                                )}
                            </Box>

                            <div className="grid grid-cols-1 md:grid-cols-2 items-start">
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-sm">Created By</span>
                                    <span className="font-medium text-gray-900">
                                        {data?.user?.name || data?.created_by || "Admin"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500 text-sm">Status</span>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={formData.status}
                                            onChange={handleStatusChange}
                                            color="success"
                                        />
                                        <span className="text-sm font-medium">
                                            {formData.status ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-sm">Created On</span>
                                    <span className="font-medium text-gray-900">
                                        {formatDate(data?.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50 px-8"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
                            onClick={handleUpdate}
                            disabled={submitting}
                        >
                            Update
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default SosDirectoryDetailsPage;
