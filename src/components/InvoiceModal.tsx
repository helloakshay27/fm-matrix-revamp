import { useEffect, useState } from "react";
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
    Delete as DeleteIcon,
    PictureAsPdf as PdfIcon,
    TableChart as ExcelIcon
} from "@mui/icons-material";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { useParams } from "react-router-dom";
import { addWOInvoice, fetchBOQ } from "@/store/slices/workOrderSlice";
import axios from "axios";

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
    fetchWorkOrder: () => void;
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
    fetchWorkOrder
}) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    const { id } = useParams();

    const [boqs, setBoqs] = useState([]);
    const [boqDetails, setBOQDetails] = useState<BOQDetail[]>([
        {
            id: '1',
            selectedBOQ: "",
            quantity: "",
            workCompleted: "",
            rate: "",
            taxableAmount: "",
            invoiceAmount: "",
            totalInvoiceAmount: ""
        }
    ]);
    const [attachmentPreviews, setAttachmentPreviews] = useState<{ file: File, preview: string }[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);
            const newPreviews = files.map(file => ({
                file,
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
            }));
            setAttachmentPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveAttachment = (fileToRemove: File) => {
        setAttachmentPreviews(prev => prev.filter(({ file }) => file !== fileToRemove));
    };

    useEffect(() => {
        const getBoq = async () => {
            try {
                const response = await dispatch(fetchBOQ({ baseUrl, token, id: Number(id) })).unwrap();
                setBoqs(response.inventories);
            } catch (error) {
                console.log(error);
                toast.error(error);
            }
        };

        getBoq();
    }, [dispatch, baseUrl, token, id]);

    useEffect(() => {
        return () => {
            attachmentPreviews.forEach(({ preview }) => {
                if (preview) URL.revokeObjectURL(preview);
            });
        };
    }, [attachmentPreviews]);

    const fetchBOQDetails = async (boqId: string, boqDetailId: string) => {
        if (!boqId) return;

        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_orders/pms_wo_inventories?pms_wo_inventory_id=${boqId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = response.data.pms_wo_inventory;
            setBOQDetails((prevDetails) =>
                prevDetails.map((boq) =>
                    boq.id === boqDetailId
                        ? {
                            ...boq,
                            quantity: data.quantity || "",
                            rate: data.rate || "",
                            taxableAmount: data.total_tax_per || "0.00",
                            invoiceAmount: calculateInvoiceAmount(data.quantity || "", data.rate || "", data.total_tax_per || "0.00"),
                            totalInvoiceAmount: calculateTotalInvoiceAmount(data.total_tax_per || "0.00", calculateInvoiceAmount(data.quantity || "", data.rate || "", data.total_tax_per || "0.00"))
                        }
                        : boq
                )
            );
        } catch (error) {
            console.error('Error fetching BOQ details:', error);
            toast.error('Failed to fetch BOQ details');
        }
    };

    const calculateInvoiceAmount = (quantity: string, rate: string, taxableAmount: string): string => {
        const qty = parseFloat(quantity) || 0;
        const rt = parseFloat(rate) || 0;
        const tax = parseFloat(taxableAmount) || 0;
        const invoiceAmount = (qty * rt) + tax;
        return invoiceAmount.toFixed(2);
    };

    const calculateTotalInvoiceAmount = (taxableAmount: string, invoiceAmount: string): string => {
        const tax = parseFloat(taxableAmount) || 0;
        const invoice = parseFloat(invoiceAmount) || 0;
        const totalInvoiceAmount = tax + invoice;
        return totalInvoiceAmount.toFixed(2);
    };

    useEffect(() => {
        boqDetails.forEach((boq) => {
            if (boq.selectedBOQ) {
                fetchBOQDetails(boq.selectedBOQ, boq.id);
            }
        });
    }, [boqDetails.map((boq) => boq.selectedBOQ).join(',')]);

    const resetForm = () => {
        setInvoiceNumber("");
        setInvoiceDate("");
        setAdjustmentAmount("");
        setPostingDate("");
        setNotes("");
        setRelatedTo("");
        setBOQDetails([
            {
                id: Date.now().toString(),
                selectedBOQ: "",
                quantity: "",
                workCompleted: "",
                rate: "",
                taxableAmount: "0.00",
                invoiceAmount: "0.00",
                totalInvoiceAmount: "0.00"
            }
        ]);
        setAttachmentPreviews([]);
    };

    const handleSaveInvoice = async () => {
        try {
            const payload = {
                work_order_invoice: {
                    pms_work_order_id: id,
                    invoice_number: invoiceNumber,
                    invoice_date: invoiceDate,
                    related_to: relatedTo,
                    adjustment_amount: adjustmentAmount,
                    posting_date: postingDate,
                    notes: notes,
                    wo_invoice_inventories_attributes: boqDetails.map(boq => ({
                        pms_po_inventory_id: boq.selectedBOQ,
                        quantity: boq.quantity,
                        completed_percentage: boq.workCompleted,
                        amount: boq.totalInvoiceAmount
                    }))
                },
                attachments: attachmentPreviews.map(({ file }) => file)
            };

            await dispatch(addWOInvoice({ baseUrl, token, data: payload })).unwrap();
            fetchWorkOrder();
            resetForm();
            handleCloseInvoiceModal();
            toast.success('Invoice saved successfully');
        } catch (error) {
            console.error('Error saving invoice:', error);
            toast.error('Failed to save invoice');
        }
    };

    const addBOQDetail = () => {
        const newBOQ: BOQDetail = {
            id: Date.now().toString(),
            selectedBOQ: "",
            quantity: "",
            workCompleted: "",
            rate: "",
            taxableAmount: "0.00",
            invoiceAmount: "0.00",
            totalInvoiceAmount: "0.00"
        };
        setBOQDetails([...boqDetails, newBOQ]);
    };

    const removeBOQDetail = (id: string) => {
        if (boqDetails.length > 1) {
            setBOQDetails(boqDetails.filter(boq => boq.id !== id));
        }
    };

    const updateBOQDetail = (id: string, field: keyof BOQDetail, value: string) => {
        setBOQDetails(boqDetails.map(boq => {
            if (boq.id === id) {
                const updatedBOQ = { ...boq, [field]: value };
                if (field === 'quantity' || field === 'rate' || field === 'taxableAmount') {
                    updatedBOQ.invoiceAmount = calculateInvoiceAmount(
                        updatedBOQ.quantity,
                        updatedBOQ.rate,
                        updatedBOQ.taxableAmount
                    );
                    updatedBOQ.totalInvoiceAmount = calculateTotalInvoiceAmount(
                        updatedBOQ.taxableAmount,
                        updatedBOQ.invoiceAmount
                    );
                }
                return updatedBOQ;
            }
            return boq;
        }));
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
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes..."
                            variant="outlined"
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
                                accept="image/*,application/pdf,.xlsx,.xls"
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

                            {/* Attachment Previews */}
                            {attachmentPreviews.length > 0 && (
                                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {attachmentPreviews.map(({ file, preview }, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                position: 'relative',
                                                width: 100,
                                                height: 100,
                                                border: '1px solid hsl(var(--form-border))',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'hsl(var(--background))'
                                            }}
                                        >
                                            {file.type.startsWith('image/') && preview ? (
                                                <img
                                                    src={preview}
                                                    alt={file.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : file.type === 'application/pdf' ? (
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <PdfIcon sx={{ fontSize: 40, color: 'hsl(var(--invoice-primary))' }} />
                                                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                                        {file.name.slice(0, 10) + (file.name.length > 10 ? '...' : '')}
                                                    </Typography>
                                                </Box>
                                            ) : file.type.includes('spreadsheetml') || file.type.includes('ms-excel') ? (
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <ExcelIcon sx={{ fontSize: 40, color: 'hsl(var(--invoice-primary))' }} />
                                                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                                        {file.name.slice(0, 10) + (file.name.length > 10 ? '...' : '')}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="caption">{file.name}</Typography>
                                            )}
                                            <IconButton
                                                onClick={() => handleRemoveAttachment(file)}
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    backgroundColor: 'hsl(var(--background))',
                                                    '&:hover': { backgroundColor: 'hsl(var(--destructive))', color: 'white' }
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
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
                                                {
                                                    boqs.map((boq: any) => (
                                                        <MenuItem key={boq.id} value={boq.id}>
                                                            {boq.label}
                                                        </MenuItem>
                                                    ))
                                                }
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
                                            placeholder="%"
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
                                            InputProps={{ readOnly: true }}
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
                                            InputProps={{ readOnly: true }}
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