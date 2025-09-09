import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import {
  createGRN,
  fetchItemDetails,
  fetchSupplierDetails,
  getPurchaseOrdersList,
} from "@/store/slices/grnSlice";
import { getInventories, getSuppliers } from "@/store/slices/materialPRSlice";
import { ArrowLeft, Upload, File, FileText, FileSpreadsheet, Eye, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";

interface GRNDetails {
  purchaseOrder: number;
  supplier: string;
  invoiceNumber: string;
  relatedTo: string;
  invoiceAmount: string;
  paymentMode: string;
  invoiceDate: string;
  postingDate: string;
  otherExpense: string;
  loadingExpense: string;
  adjustmentAmount: string;
  notes: string;
}

interface InventoryItem {
  inventoryType: string;
  expectedQuantity: string;
  receivedQuantity: string;
  approvedQuantity: string;
  rejectedQuantity: string;
  rate: string;
  cgstRate: string;
  cgstAmount: string;
  sgstRate: string;
  sgstAmount: string;
  igstRate: string;
  igstAmount: string;
  tcsRate: string;
  tcsAmount: string;
  totalTaxes: string;
  amount: string;
  totalAmount: string;
  batch: string[];
}

interface Supplier {
  id: string;
  name: string;
}

interface Inventory {
  id: string;
  name: string;
}

interface Attachment {
  id: number;
  url: string;
  document_name: string;
  document_file_name: string;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

export const AddGRNDashboard = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [grnDetails, setGrnDetails] = useState<GRNDetails>({
    purchaseOrder: 0,
    supplier: "",
    invoiceNumber: "",
    relatedTo: "",
    invoiceAmount: "",
    paymentMode: "",
    invoiceDate: "",
    postingDate: "",
    otherExpense: "",
    loadingExpense: "",
    adjustmentAmount: "",
    notes: "",
  });

  const [inventoryDetails, setInventoryDetails] = useState<InventoryItem[]>([
    {
      inventoryType: "",
      expectedQuantity: "",
      receivedQuantity: "",
      approvedQuantity: "",
      rejectedQuantity: "",
      rate: "",
      cgstRate: "",
      cgstAmount: "",
      sgstRate: "",
      sgstAmount: "",
      igstRate: "",
      igstAmount: "",
      tcsRate: "",
      tcsAmount: "",
      totalTaxes: "",
      amount: "",
      totalAmount: "",
      batch: [],
    },
  ]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<[string, number][]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Attachment | null>(null);

  useEffect(() => {
    const fetchPO = async () => {
      try {
        const response = await dispatch(getPurchaseOrdersList({ baseUrl, token })).unwrap();
        setPurchaseOrders(response.p_orders);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch purchase orders.");
      }
    };

    const fetchSupp = async () => {
      try {
        const response = await dispatch(getSuppliers({ baseUrl, token })).unwrap();
        setSuppliers(response.suppliers);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch suppliers.");
      }
    };

    const fetchInv = async () => {
      try {
        const response = await dispatch(getInventories({ baseUrl, token })).unwrap();
        setInventories(response.inventories);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch inventories.");
      }
    };

    fetchSupp();
    fetchInv();
    fetchPO();
  }, [dispatch, baseUrl, token]);

  const fetchSuppliers = async (id: number) => {
    try {
      const response = await dispatch(fetchSupplierDetails({ baseUrl, token, id })).unwrap();
      setGrnDetails((prev) => ({
        ...prev,
        supplier: response.id,
      }));
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch supplier details.");
    }
  };

  const fetchItem = async (id: number) => {
    try {
      const response = await dispatch(fetchItemDetails({ baseUrl, token, id })).unwrap();
      const updatedInventoryDetails = response.pms_po_inventories.map((item: any) => {
        const inventoryItem = {
          ...item,
          inventoryType: item.inventory.id,
          rate: item.rate || "",
          cgstRate: item.cgst_rate || "",
          cgstAmount: "",
          sgstRate: item.sgst_rate || "",
          sgstAmount: "",
          igstRate: item.igst_rate || "",
          igstAmount: "",
          tcsRate: item.tcs_rate || "",
          tcsAmount: "",
          totalTaxes: "",
          amount: "",
          totalAmount: "",
          expectedQuantity: item.quantity || "",
          receivedQuantity: "",
          approvedQuantity: "",
          rejectedQuantity: "",
          batch: item.batch || [],
        };
        return calculateInventoryTaxes(inventoryItem);
      });
      setInventoryDetails(updatedInventoryDetails);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch item details.");
    }
  };

  const calculateInventoryTaxes = (item: InventoryItem): InventoryItem => {
    const rate = parseFloat(item.rate) || 0;
    const approvedQty = parseFloat(item.approvedQuantity) || 0;
    const cgstRate = parseFloat(item.cgstRate) || 0;
    const sgstRate = parseFloat(item.sgstRate) || 0;
    const igstRate = parseFloat(item.igstRate) || 0;
    const tcsRate = parseFloat(item.tcsRate) || 0;

    const amount = rate * approvedQty;
    const cgstAmount = (amount * cgstRate) / 100;
    const sgstAmount = (amount * sgstRate) / 100;
    const igstAmount = (amount * igstRate) / 100;
    const tcsAmount = (amount * tcsRate) / 100;
    const totalTaxes = cgstAmount + sgstAmount + igstAmount + tcsAmount;
    const totalAmount = amount + totalTaxes;

    return {
      ...item,
      amount: amount.toFixed(2),
      cgstAmount: cgstAmount.toFixed(2),
      sgstAmount: sgstAmount.toFixed(2),
      igstAmount: igstAmount.toFixed(2),
      tcsAmount: tcsAmount.toFixed(2),
      totalTaxes: totalTaxes.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const handleInventoryChange = (
    index: number,
    field: keyof InventoryItem,
    value: string,
    batchIndex?: number
  ) => {
    setInventoryDetails((prev) => {
      const newDetails = [...prev];
      if (field === "batch" && batchIndex !== undefined) {
        const newBatch = [...newDetails[index].batch];
        newBatch[batchIndex] = value;
        newDetails[index] = { ...newDetails[index], batch: newBatch };
      } else {
        newDetails[index] = { ...newDetails[index], [field]: value };
        if (field === "receivedQuantity") {
          newDetails[index].approvedQuantity = value;
          const expected = parseFloat(newDetails[index].expectedQuantity) || 0;
          const approved = parseFloat(value) || 0;
          const rejected = expected - approved;
          newDetails[index].rejectedQuantity = rejected >= 0 ? rejected.toFixed(0) : "0";
        }
        newDetails[index] = calculateInventoryTaxes(newDetails[index]);
      }
      return newDetails;
    });
  };

  const addBatchField = (index: number) => {
    setInventoryDetails((prev) => {
      const newDetails = [...prev];
      newDetails[index] = {
        ...newDetails[index],
        batch: [...newDetails[index].batch, ""],
      };
      return newDetails;
    });
    toast.success("Batch field added successfully");
  };

  const removeBatchField = (inventoryIndex: number, batchIndex: number) => {
    setInventoryDetails((prev) => {
      const newDetails = [...prev];
      newDetails[inventoryIndex] = {
        ...newDetails[inventoryIndex],
        batch: newDetails[inventoryIndex].batch.filter((_, i) => i !== batchIndex),
      };
      return newDetails;
    });
    toast.success("Batch field removed successfully");
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("No files selected.");
      return;
    }
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`File ${file.name} has an unsupported type.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.size} exceeds the 5MB size limit.`);
        return false;
      }
      if (selectedFiles.some((existing: File) => existing.name === file.name)) {
        toast.error(`File ${file.name} is already uploaded.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`File ${file.name} has an unsupported type.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} exceeds the 5MB size limit.`);
        return false;
      }
      if (selectedFiles.some((existing: File) => existing.name === file.name)) {
        toast.error(`File ${file.name} is already uploaded.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) uploaded via drag & drop`);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("File removed successfully");
  };

  const handleDashedBorderClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    if (!grnDetails.purchaseOrder) {
      toast.error("Please select a Purchase Order");
      return false;
    }
    if (!grnDetails.supplier) {
      toast.error("Please select a Supplier");
      return false;
    }
    if (!grnDetails.invoiceNumber) {
      toast.error("Please enter Invoice Number");
      return false;
    }
    if (!grnDetails.invoiceDate || !grnDetails.postingDate) {
      toast.error("Please provide valid Invoice and Posting Dates");
      return false;
    }
    for (const [index, item] of inventoryDetails.entries()) {
      if (!item.inventoryType) {
        toast.error(`Please select an Inventory Type for item ${index + 1}`);
        return false;
      }
      if (
        !item.expectedQuantity ||
        isNaN(parseFloat(item.expectedQuantity)) ||
        parseFloat(item.expectedQuantity) < 0
      ) {
        toast.error(`Please enter a valid Expected Quantity for item ${index + 1}`);
        return false;
      }
      if (
        !item.receivedQuantity ||
        isNaN(parseFloat(item.receivedQuantity)) ||
        parseFloat(item.receivedQuantity) < 0
      ) {
        toast.error(`Please enter a valid Received Quantity for item ${index + 1}`);
        return false;
      }
      if (
        !item.approvedQuantity ||
        isNaN(parseFloat(item.approvedQuantity)) ||
        parseFloat(item.approvedQuantity) < 0
      ) {
        toast.error(`Please enter a valid Approved Quantity for item ${index + 1}`);
        return false;
      }
    }
    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one attachment");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const payload = {
      pms_grn: {
        pms_purchase_order_id: grnDetails.purchaseOrder,
        supplier_id: grnDetails.supplier,
        invoice_no: grnDetails.invoiceNumber,
        related_to: grnDetails.relatedTo,
        invoice_amount: grnDetails.invoiceAmount,
        payment_mod: grnDetails.paymentMode,
        bill_date: grnDetails.invoiceDate,
        posting_date: grnDetails.postingDate,
        other_expenses: grnDetails.otherExpense,
        loading_expense: grnDetails.loadingExpense,
        adj_amount: grnDetails.adjustmentAmount,
        notes: grnDetails.notes,
        pms_grn_inventories_attributes: inventoryDetails.map((item) => ({
          pms_inventory_id: item.inventoryType,
          quantity: item.expectedQuantity,
          unit: item.receivedQuantity,
          approved_qty: item.approvedQuantity,
          rejected_qty: item.rejectedQuantity,
          rate: item.rate,
          cgst_rate: item.cgstRate,
          cgst_amount: item.cgstAmount,
          sgst_rate: item.sgstRate,
          sgst_amount: item.sgstAmount,
          igst_rate: item.igstRate,
          igst_amount: item.igstAmount,
          tcs_rate: item.tcsRate,
          tcs_amount: item.tcsAmount,
          taxable_value: item.totalTaxes,
          total_value: item.amount,
          pms_products_attributes: item.batch.map((batch) => ({ batch_no: batch })),
        })),
      },
      attachments: selectedFiles,
    };

    setIsSubmitting(true);
    try {
      await dispatch(createGRN({ data: payload, baseUrl, token })).unwrap();
      toast.success("GRN submitted successfully!");
      navigate("/finance/grn-srn");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit GRN.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-6">ADD GRN</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center">
              <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                1
              </h2>
              GRN DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Purchase Order*</InputLabel>
              <MuiSelect
                label="Purchase Order*"
                value={grnDetails.purchaseOrder}
                onChange={(e) => {
                  const poId = Number(e.target.value);
                  setGrnDetails({ ...grnDetails, purchaseOrder: poId });
                  fetchSuppliers(poId);
                  fetchItem(poId);
                }}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value={0}>
                  <em>Select Purchase Order</em>
                </MenuItem>
                {purchaseOrders.map((option) => (
                  <MenuItem key={option[1]} value={option[1]}>
                    {option[0]}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Supplier*</InputLabel>
              <MuiSelect
                label="Supplier*"
                value={grnDetails.supplier}
                onChange={(e) => setGrnDetails({ ...grnDetails, supplier: e.target.value })}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Supplier</em>
                </MenuItem>
                {suppliers.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <TextField
              label="Invoice Number*"
              placeholder="Enter Invoice Number"
              value={grnDetails.invoiceNumber}
              onChange={(e) => setGrnDetails({ ...grnDetails, invoiceNumber: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Related To"
              placeholder="Enter Related To"
              value={grnDetails.relatedTo}
              onChange={(e) => setGrnDetails({ ...grnDetails, relatedTo: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Invoice Amount"
              type="number"
              placeholder="Enter Invoice Amount"
              value={grnDetails.invoiceAmount}
              onChange={(e) => setGrnDetails({ ...grnDetails, invoiceAmount: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
              inputProps={{ min: 0 }}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Payment Mode</InputLabel>
              <MuiSelect
                label="Payment Mode"
                value={grnDetails.paymentMode}
                onChange={(e) => setGrnDetails({ ...grnDetails, paymentMode: e.target.value })}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Payment Mode</em>
                </MenuItem>
                <MenuItem value="1">Cheque</MenuItem>
                <MenuItem value="2">RTGS</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Invoice Date*"
              type="date"
              value={grnDetails.invoiceDate}
              onChange={(e) => setGrnDetails({ ...grnDetails, invoiceDate: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
              inputProps={{ max: new Date().toISOString().split("T")[0] }}
            />

            <TextField
              label="Posting Date*"
              type="date"
              value={grnDetails.postingDate}
              onChange={(e) => setGrnDetails({ ...grnDetails, postingDate: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
              inputProps={{ max: new Date().toISOString().split("T")[0] }}
            />

            <TextField
              label="Other Expense"
              type="number"
              placeholder="Enter Other Expense"
              value={grnDetails.otherExpense}
              onChange={(e) => setGrnDetails({ ...grnDetails, otherExpense: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Loading Expense"
              type="number"
              placeholder="Enter Loading Expense"
              value={grnDetails.loadingExpense}
              onChange={(e) => setGrnDetails({ ...grnDetails, loadingExpense: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Adjustment Amount"
              type="number"
              placeholder="Enter Adjustment Amount"
              value={grnDetails.adjustmentAmount}
              onChange={(e) => setGrnDetails({ ...grnDetails, adjustmentAmount: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Notes"
              value={grnDetails.notes}
              onChange={(e) => setGrnDetails({ ...grnDetails, notes: e.target.value })}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              placeholder="Enter any additional notes..."
              InputLabelProps={{ shrink: true }}
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  height: "auto !important",
                  padding: "2px !important",
                },
              }}
            />
          </CardContent>
        </Card>

        {inventoryDetails.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-[#C72030] flex items-center">
                <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                  2
                </h2>
                INVENTORY DETAILS {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Inventory Type*</InputLabel>
                <MuiSelect
                  label="Inventory Type*"
                  value={item.inventoryType}
                  onChange={(e) => handleInventoryChange(index, "inventoryType", e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Inventory Type</em>
                  </MenuItem>
                  {inventories.map((inventory) => (
                    <MenuItem key={inventory.id} value={inventory.id}>
                      {inventory.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <TextField
                label="Expected Quantity*"
                type="number"
                placeholder="Enter Expected Quantity"
                value={item.expectedQuantity}
                onChange={(e) => handleInventoryChange(index, "expectedQuantity", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Received Quantity*"
                type="number"
                placeholder="Enter Received Quantity"
                value={item.receivedQuantity}
                onChange={(e) => handleInventoryChange(index, "receivedQuantity", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Approved Quantity*"
                type="number"
                placeholder="Enter Approved Quantity"
                value={item.approvedQuantity}
                onChange={(e) => handleInventoryChange(index, "approvedQuantity", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Rejected Quantity"
                type="number"
                placeholder="Enter Rejected Quantity"
                value={item.rejectedQuantity}
                onChange={(e) => handleInventoryChange(index, "rejectedQuantity", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Rate"
                type="number"
                placeholder="Enter Rate"
                value={item.rate}
                onChange={(e) => handleInventoryChange(index, "rate", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="CGST Rate"
                type="number"
                placeholder="Enter CGST Rate"
                value={item.cgstRate}
                onChange={(e) => handleInventoryChange(index, "cgstRate", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="CGST Amount"
                type="number"
                placeholder="Calculated Amount"
                value={item.cgstAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles, readOnly: true }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="SGST Rate"
                type="number"
                placeholder="Enter SGST Rate"
                value={item.sgstRate}
                onChange={(e) => handleInventoryChange(index, "sgstRate", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="SGST Amount"
                type="number"
                placeholder="Calculated Amount"
                value={item.sgstAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles, readOnly: true }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="IGST Rate"
                type="number"
                placeholder="Enter IGST Rate"
                value={item.igstRate}
                onChange={(e) => handleInventoryChange(index, "igstRate", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="IGST Amount"
                type="number"
                placeholder="Calculated Amount"
                value={item.igstAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles, readOnly: true }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="TCS Rate"
                type="number"
                placeholder="Enter TCS Rate"
                value={item.tcsRate}
                onChange={(e) => handleInventoryChange(index, "tcsRate", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="TCS Amount"
                type="number"
                placeholder="Calculated Amount"
                value={item.tcsAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles, readOnly: true }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Total Taxes"
                type="number"
                placeholder="Calculated Total Taxes"
                value={item.totalTaxes}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles, readOnly: true }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Amount"
                type="number"
                placeholder="Calculated Amount"
                value={item.amount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles, readOnly: true }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Total Amount"
                type="number"
                placeholder="Calculated Total Amount"
                value={item.totalAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles, readOnly: true }}
                sx={{ mt: 1 }}
              />

              <div className="col-span-1 md:col-span-4 space-y-4">
                <h3 className="text-md font-semibold">Batch Numbers</h3>
                {item.batch.map((batch, batchIndex) => (
                  <div key={batchIndex} className="flex items-center gap-4">
                    <TextField
                      label={`Batch ${batchIndex + 1}`}
                      type="text"
                      placeholder="Enter Batch Number"
                      value={batch}
                      onChange={(e) =>
                        handleInventoryChange(index, "batch", e.target.value, batchIndex)
                      }
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBatchField(index, batchIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => addBatchField(index)}
                >
                  Add Batch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex items-center justify-end">
          <Button
            className="bg-[#C72030] hover:bg-[#C72030] text-white cursor-not-allowed"
            type="button"
          >
            Total Amount: {inventoryDetails
              .reduce((sum, item) => sum + parseFloat(item.totalAmount || "0"), 0)
              .toFixed(2)}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center">
              <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                3
              </h2>
              ATTACHMENTS*
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-yellow-400 rounded-lg p-8 text-center cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleDashedBorderClick}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium">Drag & Drop or Click to Upload</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  ref={fileInputRef}
                  accept="image/*,.pdf,.doc,.docx,.xlsx,.xls"
                />
                <span className="ml-1">
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file(s) selected`
                    : "No files chosen"}
                </span>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="flex items-center flex-wrap gap-4 my-6">
                {selectedFiles.map((file, index) => {
                  const isImage = file.type.match(/image\/(jpeg|jpg|png|gif)/i);
                  const isPdf = file.type.match(/application\/pdf/i);
                  const isExcel = file.type.match(
                    /application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/i
                  );
                  const isWord = file.type.match(
                    /application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/i
                  );

                  return (
                    <div
                      key={`new-${index}`}
                      className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                    >
                      {isImage ? (
                        <>
                          <button
                            className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                            title="View"
                            onClick={() => {
                              setSelectedDoc({
                                id: index,
                                url: URL.createObjectURL(file),
                                document_name: file.name,
                                document_file_name: file.name,
                              });
                              setIsModalOpen(true);
                            }}
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                            onClick={() => {
                              setSelectedDoc({
                                id: index,
                                url: URL.createObjectURL(file),
                                document_name: file.name,
                                document_file_name: file.name,
                              });
                              setIsModalOpen(true);
                            }}
                          />
                        </>
                      ) : isPdf ? (
                        <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                          <FileText className="w-6 h-6" />
                        </div>
                      ) : isExcel ? (
                        <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                      ) : isWord ? (
                        <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                          <FileText className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                          <File className="w-6 h-6" />
                        </div>
                      )}
                      <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                        {file.name}
                      </span>
                      <button
                        className="absolute top-2 left-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                        title="Remove"
                        onClick={() => removeFile(index)}
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4">
          <Button
            type="submit"
            size="lg"
            className="bg-[#C72030] hover:bg-[#C72030] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit GRN"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="px-8"
          >
            Cancel
          </Button>
        </div>
      </form>

      <AttachmentPreviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />
    </div>
  );
};