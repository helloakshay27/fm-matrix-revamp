import { useState, useEffect } from "react";
import React from "react";
import { Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
// import { Button } from "./ui/button";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const AddChartofAccountGroupModal = ({ open, onOpenChange, editingAccessory = null }) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        unit: "",
        maxStockLevel: "",
        costPerUnit: "",
    });
    const [parentGroups, setParentGroups] = useState([]);

    useEffect(() => {
        const fetchParentGroups = async () => {
            try {
                const res = await axios.get(`https://${baseUrl}/lock_accounts/1/lock_account_groups?format=flat`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setParentGroups(res.data.data || []);
            } catch (e) {
                setParentGroups([]);
            }
        };
        if (open) fetchParentGroups();
    }, [open, baseUrl, token]);

    const navigate = useNavigate();

    // Update form data when editingAccessory changes
    React.useEffect(() => {
        if (editingAccessory) {
            setFormData({
                name: editingAccessory.name || "",
                quantity: editingAccessory.quantity || "",
                unit: editingAccessory.unit || "",
                maxStockLevel: editingAccessory.max_stock_level || "",
                costPerUnit: editingAccessory.cost || "",
            });
        } else {
            setFormData({
                name: "",
                quantity: "",
                unit: "",
                maxStockLevel: "",
                costPerUnit: "",
            });
        }
    }, [editingAccessory, open]);

    const handleChange = (e) => {
        const { name } = e.target;
        let { value } = e.target;

        // For quantity field: allow only digits (no negative sign, no other chars)
        if (name === 'quantity') {
            // remove any non-digit characters (this strips '-' as well)
            value = String(value).replace(/[^0-9]/g, '');
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            unit: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const groupData = {
            group_name: formData.accountName || '',
            parent_group_id: formData.parentAccountId || 1,
            credit_rule: '-',
            debit_rule: '+',
            locked: formData.locked || false,
            description: formData.description || '',
            active: true
        };
        console.log('Submitting group data:', groupData);
        try {
            await axios.post(
                `https://${baseUrl}/lock_accounts/1/lock_account_groups.json`,
                { lock_account_group: groupData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Group created successfully');
            onOpenChange(false); // Only close modal, do not navigate
        } catch (e) {
            toast.error('Failed to create group');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onOpenChange} fullWidth>
            <div className="flex items-center justify-between px-6 pt-6">
                <h5 className="text-lg font-semibold">{editingAccessory ? "Edit Group" : "Create Group"}</h5>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="h-6 w-6 p-0"
                >
                    {/* <X className="h-4 w-4" /> */}
                </Button>
            </div>

            <DialogContent >
                <form className="space-y-4">
                    <div className="flex gap-8">
                        <div className="flex-1 space-y-4" style={{ minWidth: 500 }}>
                            {/* <FormControl fullWidth margin="normal" sx={{ minWidth: 500 }}>
                                <InputLabel id="account-type-label" sx={{ color: '#C72030' }}>Account Type<span style={{ color: '#C72030' }}>*</span></InputLabel>
                                <Select
                                    labelId="account-type-label"
                                    label="Account Type*"
                                    value={formData.accountType || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Select Account Type
                                    </MenuItem>
                                    <MenuItem value="Other Asset">Other Asset</MenuItem>
                                    <MenuItem value="Other Current Asset">Other Current Asset</MenuItem>
                                    <MenuItem value="Cash">Cash</MenuItem>
                                    <MenuItem value="Bank">Bank</MenuItem>
                                    <MenuItem value="Expense">Expense</MenuItem>
                                    <MenuItem value="Income">Income</MenuItem>
                                    <MenuItem value="Liability">Liability</MenuItem>
                                    <MenuItem value="Equity">Equity</MenuItem>
                                </Select>
                            </FormControl> */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label={<span>Account Name<span style={{ color: '#C72030' }}>*</span></span>}
                                name="accountName"
                                value={formData.accountName || ''}
                                onChange={e => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                            // required
                            />
                            <div className="flex items-center gap-2 pb-5">
                                <Checkbox
                                    id="isSubAccount"
                                    checked={formData.isSubAccount || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSubAccount: !!checked }))}
                                />
                                <label htmlFor="isSubAccount" className="text-sm">Make this a sub-account</label>
                                <span className="text-xs text-gray-400 ml-1" title="A sub-account is nested under a parent account">?</span>
                            </div>
                            {formData.isSubAccount && (
                                <FormControl fullWidth margin="normal" sx={{ minWidth: 300, maxWidth: 500 }}>
                                    <InputLabel id="parent-account-label" sx={{ color: '#C72030' }}>Parent Account<span style={{ color: '#C72030' }}>*</span></InputLabel>
                                    <Select
                                        labelId="parent-account-label"
                                        label="Parent Account*"
                                        value={formData.parentAccountId || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, parentAccountId: e.target.value }))}
                                        displayEmpty
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 300,
                                                    minWidth: 500,
                                                    maxWidth: 500,
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Parent Account
                                        </MenuItem>
                                        {parentGroups.map(group => (
                                            <MenuItem key={group.id} value={group.id} >
                                                {group.group_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Account Code"
                                name="accountCode"
                                value={formData.accountCode || ''}
                                onChange={e => setFormData(prev => ({ ...prev, accountCode: e.target.value }))}
                            />
                            {/* <TextField
                                fullWidth
                                margin="normal"
                                label="Description"
                                name="description"
                                value={formData.description || ''}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                multiline
                                rows={3}
                                inputProps={{ maxLength: 500 }}
                                placeholder="Max. 500 characters"
                            /> */}

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Description"
                                name="description"
                                value={formData.description || ''}
                                onChange={e =>
                                    setFormData(prev => ({ ...prev, description: e.target.value }))
                                }
                                variant="outlined"
                                multiline
                                rows={4}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ maxLength: 500 }}
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
                                helperText={
                                    <span style={{ textAlign: 'right', display: 'block' }}>
                                        {(formData.description?.length || 0)}/500 characters
                                    </span>
                                }
                                error={(formData.description?.length || 0) > 500}
                            />

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="addToWatchlist"
                                    checked={formData.addToWatchlist || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, addToWatchlist: !!checked }))}
                                />
                                <label htmlFor="addToWatchlist" className="text-sm">Add to the watchlist on my dashboard</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="locked"
                                    checked={formData.locked || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, locked: !!checked }))}
                                />
                                <label htmlFor="locked" className="text-sm">Locked</label>
                            </div>

                        </div>
                        {/* Info box on the right */}
                        <div className="flex-1 flex items-start justify-end">
                            {formData.accountType === 'Other Current Asset' && (
                                <div className="bg-gray-900 text-white text-xs rounded p-4 w-80 whitespace-pre-line">
                                    <b>Asset</b>
                                    <br />Any short term asset that can be converted into cash or cash equivalents easily
                                    <ul className="list-disc ml-4 mt-1">
                                        <li>Prepaid expenses</li>
                                        <li>Stocks and Mutual Funds</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 pt-5 flex justify-center gap-3">
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            style={{ backgroundColor: "#C72030" }}
                            className="text-white hover:bg-[#C72030]/90 min-w-[100px]"
                        >
                            Save
                        </Button>
                        {/* <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline"
                            className="min-w-[100px]"
                        >
                            Cancel
                        </Button> */}
                        <Button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            variant="outline"
                            className="min-w-[100px]"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddChartofAccountGroupModal;
