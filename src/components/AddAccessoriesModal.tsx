import { useState } from "react";
import React from "react";
import { Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const AddAccessoriesModal = ({ open, onOpenChange, editingAccessory = null }) => {
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
        setIsSubmitting(true)
        const payload = {
            pms_inventory: {
                name: formData.name,
                quantity: formData.quantity,
                unit: formData.unit,
                max_stock_level: formData.maxStockLevel,
                cost: formData.costPerUnit
            }
        }


         console.log('Accessories API Request:', 
               
                payload,
            );
        try {
            if (editingAccessory) {
                // Update existing accessory
                await axios.put(`https://${baseUrl}/pms/inventories/${editingAccessory.id}.json`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                toast.success("Accessories updated successfully")
            } else {
                // Create new accessory
                await axios.post(`https://${baseUrl}/pms/inventories.json`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                toast.success("Accessories added successfully")
            }
            onOpenChange(false)

           
        } catch (error) {
            console.log(error)
            toast.error(editingAccessory ? "Failed to update accessories" : "Failed to add accessories")
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <Dialog open={open} onClose={onOpenChange} fullWidth>
            <div className="flex items-center justify-between px-6 pt-6">
                <h5 className="text-lg font-semibold">{editingAccessory ? "Edit Accessories" : "Add Accessories"}</h5>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="h-6 w-6 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <DialogContent>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <div className="flex items-center justify-between gap-4">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Quantity"
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            // Block minus, plus, exponent, and non-numeric inputs
                            const blockedKeys = ['-', '+', 'e', 'E'];
                            if (blockedKeys.includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            min: 0
                        }}
                        required
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Unit</InputLabel>
                        <Select
                            label="Unit"
                            value={formData.unit}
                            onChange={handleSelectChange}
                            required
                        >
                            <MenuItem value="">Select Unit</MenuItem>
                            <MenuItem value="pcs">Pcs</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Maximum Stock Level"
                        type="number"
                        name="maxStockLevel"
                        value={formData.maxStockLevel}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Cost Per Unit"
                        type="number"
                        name="costPerUnit"
                        value={formData.costPerUnit}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{ backgroundColor: "#C72030" }}
                        className="text-white hover:bg-[#C72030]/90 flex-1"
                    >
                        {isSubmitting ? (editingAccessory ? "Updating..." : "Adding...") : (editingAccessory ? "Update" : "Add")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddAccessoriesModal;
