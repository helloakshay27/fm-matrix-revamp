import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import axios from "axios";
import { FileText, Share2, File, Info, XCircle, Pencil, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const EditSosDirectory = () => {
    const { id } = useParams();
    const attachmentInputRef = useRef<HTMLInputElement>(null);
    const darkImageInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<{
        title: string;
        category: string;
        contact_number: string;
        shareWith: string;
        image: File | null;
        darkImage: File | null;
    }>({
        title: "",
        category: "",
        contact_number: "",
        shareWith: "all",
        image: null,
        darkImage: null,
    });

    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [darkImagePreview, setDarkImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Tech Park Modal State
    const [isTechParkModalOpen, setIsTechParkModalOpen] = useState(false);
    const [techParks, setTechParks] = useState<any[]>([]);
    const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
    const [isLoadingTechParks, setIsLoadingTechParks] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    console.log(techParks)
    console.log(selectedTechParks)

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const response = await axios.get(`https://${baseUrl}/sos_directories/get_sos_directory_category.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data.sos_directory_categories || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast.error("Failed to load categories");
        } finally {
            setIsLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://${baseUrl}/sos_directories/${id}.json`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const dirData = response.data;

            setFormData({
                title: dirData.title || "",
                category: dirData.sos_category_id || "",
                contact_number: dirData.contact_number || "",
                shareWith: dirData.share_with || "all",
                image: null,
                darkImage: null,
            });

            if (dirData.sos_directory_lite_url) {
                setImagePreview(dirData.sos_directory_lite_url);
            }
            if (dirData.sos_directory_dark_url) {
                setDarkImagePreview(dirData.sos_directory_dark_url);
            }

            if (dirData.share_with === 'individual' && dirData.shared_sos_directories) {
                setSelectedTechParks(dirData.shared_sos_directories.map((dir: any) => dir.site_id));
            }

        } catch (error) {
            console.error("Error fetching details:", error);
            toast.error("Failed to fetch details");
        } finally {
            setLoading(false);
        }
    };

    const fetchTechParks = async () => {
        if (techParks.length > 0) return;

        setIsLoadingTechParks(true);
        try {
            const response = await axios.get(`https://${baseUrl}/pms/sites/allowed_sites.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTechParks(response.data.sites || []);
        } catch (error) {
            console.error("Failed to fetch tech parks", error);
            toast.error("Failed to load tech parks");
        } finally {
            setIsLoadingTechParks(false);
        }
    };

    useEffect(() => {
        fetchTechParks();
        fetchCategories();
    }, []);

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

    const handleDarkImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                darkImage: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setDarkImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        attachmentInputRef.current?.click();
    };

    const triggerDarkImageInput = () => {
        darkImageInputRef.current?.click();
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData((prev) => ({
            ...prev,
            image: null,
        }));
        setImagePreview(null);
        if (attachmentInputRef.current) {
            attachmentInputRef.current.value = "";
        }
    };

    const handleRemoveDarkImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData((prev) => ({
            ...prev,
            darkImage: null,
        }));
        setDarkImagePreview(null);
        if (darkImageInputRef.current) {
            darkImageInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        // Validate
        if (!formData.title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (!formData.category) {
            toast.error("Category is required");
            return;
        }
        if (!formData.contact_number.trim()) {
            toast.error("Contact Number is required");
            return;
        }
        if (formData.shareWith === 'individual' && selectedTechParks.length === 0) {
            toast.error("Please select at least one Tech Park");
            return;
        }
        // Image is required only if creating new, or if we want to enforce it always being present.
        // For edit, if imagePreview exists, it means there is an image (either old or new).
        if (!imagePreview) {
            toast.error("Cover Image is required");
            return;
        }

        const payload = {
            sos_directory: {
                title: formData.title,
                sos_category_id: formData.category, // Assuming backend accepts this
                contact_number: formData.contact_number,
                status: "true",
                directory_type: type, // Or use formData.category if that's what it means? keeping type for now as in original code
                resource_id: localStorage.getItem('selectedSiteId'),
                resource_type: "Pms::Site",
                share_with: formData.shareWith // Assuming backend accepts this
            },
            site_ids: formData.shareWith === 'all'
                ? techParks.map(park => park.id)
                : selectedTechParks
        }

        setSubmitting(true)
        const submitData = new FormData();
        Object.keys(payload.sos_directory).forEach(key => {
            submitData.append(`sos_directory[${key}]`, payload.sos_directory[key]);
        });
        payload.site_ids.forEach(id => {
            submitData.append('site_ids[]', id);
        });
        if (formData.image) {
            submitData.append('sos_directory_lite', formData.image);
        }
        if (formData.darkImage) {
            submitData.append('sos_directory_dark', formData.darkImage);
        }

        try {
            await axios.put(`https://${baseUrl}/sos_directories/${id}.json`, submitData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                }
            })

            toast.success('Directory Updated Successfully')
            navigate(-1)
        } catch (error) {
            console.log(error)
            toast.error('Failed to update directory')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-0"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            <h1 className="text-2xl font-bold mb-6 text-black">Edit SOS Directory</h1>
            <div className="space-y-6">
                {/* Details Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <FileText size={16} />
                        </div>
                        <span className="font-semibold text-lg text-gray-800">Details</span>
                    </div>
                    <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <TextField
                                label={<>Title<span className="text-[#C72030]">*</span></>}
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter Title (Max 25 Character)"
                                inputProps={{ maxLength: 25 }}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#FAFAFA',
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#C72030',
                                        },
                                    },
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <FormControl fullWidth size="small">
                                <InputLabel shrink>Category<span className="text-[#C72030]">*</span></InputLabel>
                                <Select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    label="Category*"
                                    displayEmpty
                                    disabled={isLoadingCategories}
                                    sx={{
                                        backgroundColor: '#FAFAFA',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#C72030',
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        {isLoadingCategories ? "Loading categories..." : "Select Category"}
                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <TextField
                                label={<>Contact Number<span className="text-[#C72030]">*</span></>}
                                id="contact_number"
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleInputChange}
                                placeholder="Enter Number"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#FAFAFA',
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#C72030',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Share Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <Share2 size={16} />
                        </div>
                        <span className="font-semibold text-lg text-gray-800">Share</span>
                    </div>
                    <div className="p-6 bg-white">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <Label className="text-sm text-gray-700 whitespace-nowrap">
                                Share With<span className="text-red-500">*</span> :
                            </Label>
                            <FormControl>
                                <RadioGroup
                                    row
                                    name="shareWith"
                                    value={formData.shareWith}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({ ...prev, shareWith: value }));
                                        if (value === "individual") {
                                            setIsTechParkModalOpen(true);
                                        }
                                    }}
                                    className="gap-6"
                                >
                                    <FormControlLabel
                                        value="all"
                                        control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                                        label={<span className="font-normal text-gray-600">All Tech Park</span>}
                                    />
                                    <FormControlLabel
                                        value="individual"
                                        control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                                        label={<span className="font-normal text-gray-600">Individual Tech Parks</span>}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        {formData.shareWith === "individual" && selectedTechParks.length > 0 && (
                            <div className="mt-2 flex items-center gap-2 text-[#C72030] text-sm font-medium">
                                <span>
                                    {techParks
                                        .filter(park => selectedTechParks.includes(park.id))
                                        .map(park => park.name)
                                        .join(", ")}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsTechParkModalOpen(true)}
                                    className="hover:text-red-700 transition-colors"
                                >
                                    <Pencil size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Attachment Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <File size={16} />
                        </div>
                        <span className="font-semibold text-lg text-gray-800">Attachment</span>
                    </div>
                    <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-5 gap-8">
                        <div>
                            <Label className="text-sm font-bold text-gray-700 mb-4 block">
                                Upload Light Mode Image <span className="text-red-500">*</span>
                            </Label>

                            {imagePreview ? (
                                <div className="relative border-2 border-dashed border-gray-400 rounded-lg w-full max-w-[200px] h-40 flex items-center justify-center bg-white">
                                    <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 truncate max-w-[80%]">
                                        {formData.image?.name || "Current Image"}
                                    </span>
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 object-contain mt-6"
                                    />
                                </div>
                            ) : (
                                <div
                                    onClick={triggerFileInput}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-[200px] h-40 relative flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <div className="absolute top-2 right-2 text-gray-400">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info size={18} />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-white text-black border border-gray-200 shadow-md max-w-[200px] text-xs">
                                                    <p>Upload a clear, solid black image (no colors or gradients) to ensure consistent visibility on a white background.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>

                                    <input
                                        type="file"
                                        ref={attachmentInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    <div className="text-center text-gray-500 text-sm">
                                        Choose a file or<br />drag & drop it here
                                    </div>
                                    <Button
                                        type="button"
                                        className="bg-[#EBEBEB] text-[#C72030] hover:bg-[#dcdcdc] border-none font-medium px-8"
                                    >
                                        Browse
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div>
                            <Label className="text-sm font-bold text-gray-700 mb-4 block">
                                Upload Dark Mode Image <span className="text-red-500">*</span>
                            </Label>

                            {darkImagePreview ? (
                                <div className="relative border-2 border-dashed border-gray-400 rounded-lg w-full max-w-[200px] h-40 flex items-center justify-center bg-white">
                                    <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 truncate max-w-[80%]">
                                        {formData.darkImage?.name || "Current Dark Image"}
                                    </span>
                                    <button
                                        onClick={handleRemoveDarkImage}
                                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                    <img
                                        src={darkImagePreview}
                                        alt="Dark Preview"
                                        className="w-20 h-20 object-contain mt-6"
                                    />
                                </div>
                            ) : (
                                <div
                                    onClick={triggerDarkImageInput}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-[200px] h-40 relative flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <div className="absolute top-2 right-2 text-gray-400">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info size={18} />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-white text-black border border-gray-200 shadow-md max-w-[200px] text-xs">
                                                    <p>Upload a clear, solid white image (no colors or gradients) to ensure consistent visibility on a dark background.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>

                                    <input
                                        type="file"
                                        ref={darkImageInputRef}
                                        onChange={handleDarkImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    <div className="text-center text-gray-500 text-sm">
                                        Choose a file or<br />drag & drop it here
                                    </div>
                                    <Button
                                        type="button"
                                        className="bg-[#EBEBEB] text-[#C72030] hover:bg-[#dcdcdc] border-none font-medium px-8"
                                    >
                                        Browse
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8 pb-8 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/pulse/sos-directory')}
                        className="min-w-[150px] h-10"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="disabled:!bg-[#DF808B] !bg-[#C72030] hover:bg-[#d0606e] !text-white min-w-[150px] h-10"
                    >
                        {submitting ? "Updating..." : "Update"}
                    </Button>
                </div>
            </div>

            <Dialog open={isTechParkModalOpen} onOpenChange={(open) => {
                setIsTechParkModalOpen(open);
                if (!open && selectedTechParks.length === 0) {
                    setFormData(prev => ({ ...prev, shareWith: "all" }));
                }
            }}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle className="text-xl font-bold">Select Tech Park</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {isLoadingTechParks ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : techParks.length > 0 ? (
                            techParks.map((park) => (
                                <div key={park.id} className="flex items-start space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Checkbox
                                        checked={selectedTechParks.includes(park.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedTechParks(prev => [...prev, park.id]);
                                            } else {
                                                setSelectedTechParks(prev => prev.filter(id => id !== park.id));
                                            }
                                        }}
                                        className="mt-1 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                    />
                                    <div className="flex gap-3">
                                        <img
                                            src={park.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                                            alt={park.name}
                                            className="w-16 h-16 rounded-md object-cover bg-gray-200"
                                        />
                                        <div>
                                            <h4 className="font-medium text-gray-900">{park.name}</h4>
                                            <p className="text-sm text-[#F47521]">{park.tower_name || "Tower Name"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">No Tech Parks found</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditSosDirectory;
