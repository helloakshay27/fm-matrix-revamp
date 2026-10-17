import {
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { assetFieldStyles } from "@/components/common/FormSection";

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

const EMPTY_FILTERS: FilterParams = {
    status: "",
    created_at: "",
    created_by: "",
};

// AssetFilterDialog jaisa dropdown menu — dialog ke upar dikhe, focus conflict na ho
const selectMenuProps = {
    PaperProps: {
        style: {
            maxHeight: 224,
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            zIndex: 9999,
        },
    },
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
};

export const CommunityFilterModal = ({ open, onOpenChange, onApply }: CommunityFilterModalProps) => {
    const [filters, setFilters] = useState<FilterParams>(EMPTY_FILTERS);
    const [fmUsers, setFmUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

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
        setFilters(EMPTY_FILTERS);
        onApply({});
        onOpenChange(false);
    };

    const handleApply = () => {
        onApply(filters);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="community-filter-dialog-description">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                        aria-label="Close filter"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <div id="community-filter-dialog-description" className="sr-only">
                        Filter communities by created date, created by and status
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div>
                        <h3 className="text-sm font-medium text-brand mb-4">Community Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <TextField
                                fullWidth
                                label="Created Date"
                                type="date"
                                variant="outlined"
                                value={filters.created_at || ''}
                                onChange={(e) => handleFieldChange('created_at', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={assetFieldStyles}
                            />

                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="community-created-by-label" shrink>Created By</InputLabel>
                                <MuiSelect
                                    labelId="community-created-by-label"
                                    label="Created By"
                                    notched
                                    displayEmpty
                                    value={filters.created_by || ''}
                                    onChange={(e) => handleFieldChange('created_by', String(e.target.value))}
                                    MenuProps={selectMenuProps}
                                    sx={assetFieldStyles}
                                    disabled={loadingUsers}
                                >
                                    <MenuItem value="">
                                        <em>{loadingUsers ? 'Loading users...' : 'Select User'}</em>
                                    </MenuItem>
                                    {fmUsers.map((user) => (
                                        <MenuItem key={user.id} value={String(user.id)}>
                                            {user.full_name}
                                        </MenuItem>
                                    ))}
                                </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="community-status-label" shrink>Status</InputLabel>
                                <MuiSelect
                                    labelId="community-status-label"
                                    label="Status"
                                    notched
                                    displayEmpty
                                    value={filters.status || ''}
                                    onChange={(e) => handleFieldChange('status', String(e.target.value))}
                                    MenuProps={selectMenuProps}
                                    sx={assetFieldStyles}
                                >
                                    <MenuItem value=""><em>Select Status</em></MenuItem>
                                    <MenuItem value="1">Active</MenuItem>
                                    <MenuItem value="0">Inactive</MenuItem>
                                </MuiSelect>
                            </FormControl>
                        </div>
                    </div>
                </div>

                <div className="fm-action-bar pt-2">
                    <button type="button" onClick={handleReset} className="fm-action-secondary">
                        Reset
                    </button>
                    <button type="button" onClick={handleApply} className="fm-action-primary">
                        Apply
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
