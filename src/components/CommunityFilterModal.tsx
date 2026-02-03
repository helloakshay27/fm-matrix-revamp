import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import axios from "axios";

interface CommunityFilterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (data: { status?: string; created_at?: string; created_by?: string }) => void;
}

interface FilterParams {
    status?: string;
    created_at?: string;
    created_by?: string;
}

export const CommunityFilterModal = ({ open, onOpenChange, onApply }: CommunityFilterModalProps) => {
    const [filters, setFilters] = useState<FilterParams>({
        status: "",
        created_at: "",
        created_by: "",
    });
    const [fmUsers, setFmUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const fieldStyles = {
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: '10px 12px',
        },
    };

    const menuProps = {
        PaperProps: {
            style: {
                maxHeight: 300,
            },
        },
        disablePortal: false,
        style: {
            zIndex: 10000,
        },
    };

    useEffect(() => {
        if (open && fmUsers.length === 0) {
            fetchFmUsers();
        }
    }, [open]);

    const fetchFmUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFmUsers(response.data.users || []);
        } catch (error) {
            console.error('Failed to fetch FM users', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleFieldChange = (field: keyof FilterParams, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleReset = () => {
        setFilters({
            status: "",
            created_at: "",
            created_by: "",
        });
        onApply({});
        //onOpenChange(false);
    };

    const handleApply = async () => {
        onApply(filters);
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => onOpenChange(false)} />
            <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden flex flex-col border-l-[6px] border-[#C72030]">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-900 tracking-wide">FILTER BY</h2>
                        <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Created Date */}
                        <div>
                            <TextField
                                fullWidth
                                label="Created Date"
                                type="date"
                                variant="outlined"
                                size="small"
                                value={filters.created_at || ''}
                                onChange={(e) => handleFieldChange('created_at', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                placeholder="Select Created Date"
                                sx={fieldStyles}
                            />
                        </div>

                        {/* Created By */}
                        <div>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel shrink>Created By</InputLabel>
                                <Select
                                    label="Created By"
                                    value={filters.created_by || ''}
                                    onChange={(e) => handleFieldChange('created_by', e.target.value)}
                                    MenuProps={menuProps}
                                    sx={fieldStyles}
                                    displayEmpty
                                    disabled={loadingUsers}
                                >
                                    <MenuItem value=""><em>{loadingUsers ? 'Loading users...' : 'Select User'}</em></MenuItem>
                                    {fmUsers.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.full_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Status */}
                        <div>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel shrink>Status</InputLabel>
                                <Select
                                    label="Status"
                                    value={filters.status || ''}
                                    onChange={(e) => handleFieldChange('status', e.target.value)}
                                    MenuProps={menuProps}
                                    sx={fieldStyles}
                                    displayEmpty
                                >
                                    <MenuItem value=""><em>Select Status</em></MenuItem>
                                    <MenuItem value="1">Active</MenuItem>
                                    <MenuItem value="0">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                        <Button variant="outline" onClick={handleReset} className="px-8">
                            Reset
                        </Button>
                        <Button onClick={handleApply} className="bg-[#C72030] hover:bg-[#A01020] text-white px-8">
                            Apply
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
