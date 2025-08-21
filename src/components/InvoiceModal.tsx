import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Typography,
    Box,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Paper,
    styled
} from "@mui/material";
import {
    Close as CloseIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";
import { Button } from "./ui/button";

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'hsl(var(--background))',
        borderRadius: '8px',
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'hsl(var(--invoice-primary))',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'hsl(var(--invoice-primary))',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'hsl(var(--label-text))',
        '&.Mui-focused': {
            color: 'hsl(var(--invoice-primary))',
        },
    },
}));

interface BOQDetail {
    id: string;
    selectedBOQ: string;
    quantity: string;
    workCompleted: string;
    rate: string;
    taxableAmount: string;
    invoiceAmount: string;
    totalInvoiceAmount: string;
}

interface InvoiceModalProps {
    openInvoiceModal: boolean;
    handleCloseInvoiceModal: () => void;
    invoiceNumber: string;
    setInvoiceNumber: (value: string) => void;
    invoiceDate: string;
    setInvoiceDate: (value: string) => void;
    adjustmentAmount: string;
    setAdjustmentAmount: (value: string) => void;
    postingDate: string;
    setPostingDate: (value: string) => void;
    notes: string;
    setNotes: (value: string) => void;
    relatedTo: string;
    setRelatedTo: (value: string) => void;
    attachment: File | null;
    setAttachment: (file: File | null) => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
    openInvoiceModal,
    handleCloseInvoiceModal,
    invoiceNumber,
    setInvoiceNumber,
    invoiceDate,
    setInvoiceDate,
    adjustmentAmount,
    setAdjustmentAmount,
    postingDate,
    setPostingDate,
    notes,
    setNotes,
    relatedTo,
    setRelatedTo,
    attachment,
    setAttachment,
}) => {
    const [boqDetails, setBOQDetails] = useState<BOQDetail[]>([
        {
            id: '1',
            selectedBOQ: "",
            quantity: "",
            workCompleted: "",
            rate: "",
            taxableAmount: "0.00",
            invoiceAmount: "0",
            totalInvoiceAmount: "0"
        }
    ]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setAttachment(event.target.files[0]);
        }
    };

    const handleSaveInvoice = () => {
        console.log({
            invoiceNumber,
            invoiceDate,
            adjustmentAmount,
            postingDate,
            notes,
            attachment,
            boqDetails,
        });
        handleCloseInvoiceModal();
    };

    const addBOQDetail = () => {
        const newBOQ: BOQDetail = {
            id: Date.now().toString(),
            selectedBOQ: "",
            quantity: "",
            workCompleted: "",
            rate: "",
            taxableAmount: "0.00",
            invoiceAmount: "0",
            totalInvoiceAmount: "0"
        };
        setBOQDetails([...boqDetails, newBOQ]);
    };

    const removeBOQDetail = (id: string) => {
        if (boqDetails.length > 1) {
            setBOQDetails(boqDetails.filter(boq => boq.id !== id));
        }
    };

    const updateBOQDetail = (id: string, field: keyof BOQDetail, value: string) => {
        setBOQDetails(boqDetails.map(boq =>
            boq.id === id ? { ...boq, [field]: value } : boq
        ));
    };

    return (
        <StyledDialog
            open={openInvoiceModal}
            onClose={handleCloseInvoiceModal}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid hsl(var(--form-border))',
                pb: 2,
                color: 'hsl(var(--foreground))'
            }}>
                <Typography variant="h5" component="span" fontWeight="600">
                    Invoice
                </Typography>
                <IconButton
                    onClick={handleCloseInvoiceModal}
                    size="small"
                    sx={{ color: 'hsl(var(--muted-foreground))' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: '24px', maxHeight: '70vh', overflow: 'auto' }}>
                <Box sx={{ mt: 2 }}>
                    {/* Basic Invoice Fields */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                            <StyledTextField
                                fullWidth
                                label="Invoice Number"
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                variant="outlined"
                            />
                        </Box>

                        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                            <StyledTextField
                                fullWidth
                                label="Invoice Date"
                                type="date"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                            <StyledTextField
                                fullWidth
                                label="Related To"
                                value={relatedTo}
                                onChange={(e) => setRelatedTo(e.target.value)}
                                variant="outlined"
                            />
                        </Box>

                        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                            <StyledTextField
                                fullWidth
                                label="Adjustment Amount"
                                type="number"
                                value={adjustmentAmount}
                                onChange={(e) => setAdjustmentAmount(e.target.value)}
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                            <StyledTextField
                                fullWidth
                                label="Posting Date*"
                                type="date"
                                value={postingDate}
                                onChange={(e) => setPostingDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                            />
                            {postingDate && (
                                <Typography variant="caption" sx={{ color: 'hsl(var(--muted-foreground))', mt: 1, display: 'block' }}>
                                    {new Date(postingDate).toLocaleDateString('en-GB')}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Notes */}
                    <Box sx={{ mb: 4 }}>
                        <StyledTextField
                            fullWidth
                            label="Notes"
                            multiline
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes..."
                            variant="outlined"
                        />
                    </Box>

                    {/* Attachment */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="body1" sx={{ mb: 2, color: 'hsl(var(--label-text))', fontWeight: 500 }}>
                            Attachment
                        </Typography>

                        <div className="">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                id="file-upload"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file-upload" className="block cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors">
                                    <span className="text-gray-600">
                                        Drag & Drop or{" "}
                                        <span className="text-red-500 underline">Choose files</span>{" "}
                                    </span>
                                </div>
                            </label>
                        </div>
                    </Box>

                    {/* BOQ Details Section */}
                    <Divider sx={{ my: 3, borderColor: 'hsl(var(--form-border))' }} />

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'hsl(var(--foreground))', fontWeight: 600 }}>
                            BOQ Details
                        </Typography>

                        {boqDetails.map((boq, index) => (
                            <Paper
                                key={boq.id}
                                elevation={1}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}>
                                        BOQ Entry {index + 1}
                                    </Typography>
                                    {boqDetails.length > 1 && (
                                        <IconButton
                                            onClick={() => removeBOQDetail(boq.id)}
                                            size="small"
                                            sx={{ color: 'hsl(var(--destructive))' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Box>

                                {/* BOQ and Quantity Row */}
                                <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel sx={{ color: 'hsl(var(--label-text))' }}>BOQ</InputLabel>
                                            <Select
                                                value={boq.selectedBOQ}
                                                onChange={(e) => updateBOQDetail(boq.id, 'selectedBOQ', e.target.value)}
                                                label="BOQ"
                                                sx={{
                                                    backgroundColor: 'hsl(var(--background))',
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'hsl(var(--invoice-primary))',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'hsl(var(--invoice-primary))',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="boq1">BOQ Item 1</MenuItem>
                                                <MenuItem value="boq2">BOQ Item 2</MenuItem>
                                                <MenuItem value="boq3">BOQ Item 3</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Quantity/Area(per Sq. ft)"
                                            value={boq.quantity}
                                            onChange={(e) => updateBOQDetail(boq.id, 'quantity', e.target.value)}
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>

                                {/* Work Completed and Rate Row */}
                                <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                                        <StyledTextField
                                            fullWidth
                                            label="% of Work Completed"
                                            value={boq.workCompleted}
                                            onChange={(e) => updateBOQDetail(boq.id, 'workCompleted', e.target.value)}
                                            placeholder="NaN"
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Rate"
                                            value={boq.rate}
                                            onChange={(e) => updateBOQDetail(boq.id, 'rate', e.target.value)}
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>

                                {/* Taxable and Invoice Amount Row */}
                                <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Taxable Amount"
                                            value={boq.taxableAmount}
                                            onChange={(e) => updateBOQDetail(boq.id, 'taxableAmount', e.target.value)}
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Invoice Amount"
                                            value={boq.invoiceAmount}
                                            onChange={(e) => updateBOQDetail(boq.id, 'invoiceAmount', e.target.value)}
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>

                                {/* Total Invoice Amount Row */}
                                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Total Invoice Amount"
                                            value={boq.totalInvoiceAmount}
                                            onChange={(e) => updateBOQDetail(boq.id, 'totalInvoiceAmount', e.target.value)}
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        ))}

                        <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white sap_button mr-2 px-8" onClick={addBOQDetail}>
                            Add
                        </Button>
                    </Box>

                    {/* Action Buttons */}
                    <Divider sx={{ my: 3, borderColor: 'hsl(var(--form-border))' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                        <Button
                            className="px-8"
                            onClick={handleCloseInvoiceModal}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveInvoice}
                            className="bg-red-600 hover:bg-red-700 text-white px-8"
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
};

export default InvoiceModal;