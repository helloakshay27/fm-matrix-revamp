import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import {
  editGRN,
  fetchItemDetails,
  fetchSingleGRN,
  fetchSupplierDetails,
  getPurchaseOrdersList,
} from "@/store/slices/grnSlice";
import { getInventories, getSuppliers } from "@/store/slices/materialPRSlice";
import { ArrowLeft } from "lucide-react";

// Define interfaces for type safety
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

interface Batch {
  batch_no: string;
  id: number;
}

interface InventoryItem {
  id: string;
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
  batch: Batch[];
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
  id: string;
  name: string;
  url: string;
  size: number;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

export const EditGRNDashboard = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const navigate = useNavigate();

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
      id: "",
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
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<[string, number][]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPO = async () => {
      try {
        const response = await dispatch(
          getPurchaseOrdersList({ baseUrl, token })
        ).unwrap();
        setPurchaseOrders(response.p_orders);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch purchase orders. Please try again.");
      }
    };

    const fetchSupp = async () => {
      try {
        const response = await dispatch(
          getSuppliers({ baseUrl, token })
        ).unwrap();
        setSuppliers(response.suppliers);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch suppliers. Please try again.");
      }
    };

    const fetchInv = async () => {
      try {
        const response = await dispatch(
          getInventories({ baseUrl, token })
        ).unwrap();
        setInventories(response.inventories);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch inventories. Please try again.");
      }
    };

    fetchSupp();
    fetchInv();
    fetchPO();
  }, [dispatch, baseUrl, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchSingleGRN({ baseUrl, token, id: Number(id) })).unwrap();
        const grn = response.grn;
        setGrnDetails({
          purchaseOrder: grn.purchase_order_id,
          supplier: grn.supplier?.id,
          invoiceNumber: grn.invoice_no,
          relatedTo: grn.related_to,
          invoiceAmount: grn.invoice_amount,
          paymentMode: grn.payment_mod_id,
          invoiceDate: grn.bill_date ? grn.bill_date.split("T")[0] : "",
          postingDate: grn.posting_date ? grn.posting_date.split("T")[0] : "",
          otherExpense: grn.other_expenses,
          loadingExpense: grn.loading_expense,
          adjustmentAmount: grn.adj_amount,
          notes: grn.notes,
        });

        setInventoryDetails(
          grn.grn_inventories.map((item: any) => ({
            inventoryType: item.inventory_id,
            expectedQuantity: item.expected_quantity,
            receivedQuantity: item.received_quantity,
            approvedQuantity: item.approved_qty,
            rejectedQuantity: item.rejected_qty,
            rate: item.rate,
            cgstRate: item.cgst_rate,
            cgstAmount: item.cgst_amount,
            sgstRate: item.sgst_rate,
            sgstAmount: item.sgst_amount,
            igstRate: item.igst_rate,
            igstAmount: item.igst_amount,
            tcsRate: item.tcs_rate,
            tcsAmount: item.tcs_amount,
            totalTaxes: item.taxable_value,
            amount: item.total_value,
            totalAmount: (parseFloat(item.total_value) + parseFloat(item.taxable_value)).toFixed(2),
            batch: item.products && item.products.map((product: any) => ({
              batch_no: product.batch_no,
              id: product.id,
            })) || [],
          }))
        );

        // Assuming grn.attachments contains an array of {id, name, url, size}
        setExistingAttachments(
          grn.attachments?.general_attachments?.map((att: any) => ({
            id: att.id,
            name: att.filename,
            url: att.url,
          })) || []
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dispatch, baseUrl, token, id]);

  const fetchSuppliers = async (id: number) => {
    try {
      const response = await dispatch(
        fetchSupplierDetails({
          baseUrl,
          token,
          id,
        })
      ).unwrap();

      setGrnDetails((prev) => ({
        ...prev,
        supplier: response.id,
      }));
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to fetch supplier details.");
    }
  };

  const calculateInventoryTaxes = (item: InventoryItem): InventoryItem => {
    const rate = parseFloat(item.rate) || 0;
    const approvedQty = parseFloat(item.approvedQuantity) || 0;
    const cgstRate = parseFloat(item.cgstRate) || 0;
    const sgstRate = parseFloat(item.sgstRate) || 0;
    const igstRate = parseFloat(item.igstRate) || 0;
    const tcsRate = parseFloat(item.tcsRate) || 0;

    // Calculate Amount (rate × approved quantity)
    const amount = rate;

    // Calculate Tax Amounts (rate * qty * %)
    const cgstAmount = (amount * cgstRate) / 100;
    const sgstAmount = (amount * sgstRate) / 100;
    const igstAmount = (amount * igstRate) / 100;
    const tcsAmount = (amount * tcsRate) / 100;

    // Sum of all taxes
    const totalTaxes = cgstAmount + sgstAmount + igstAmount + tcsAmount;

    // Total payable
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

  const fetchItem = async (id: number) => {
    try {
      const response = await dispatch(
        fetchItemDetails({
          baseUrl,
          token,
          id,
        })
      ).unwrap();

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
          batch: [],
        };
        return calculateInventoryTaxes(inventoryItem);
      });

      setInventoryDetails(updatedInventoryDetails);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to fetch item details.");
    }
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
        newBatch[batchIndex] = {
          ...newBatch[batchIndex],
          batch_no: value
        };
        newDetails[index] = { ...newDetails[index], batch: newBatch };
      } else {
        newDetails[index] = { ...newDetails[index], [field]: value };
        if (field === "receivedQuantity") {
          // Set approvedQuantity to match receivedQuantity
          newDetails[index].approvedQuantity = value;
          // Calculate rejectedQuantity as expectedQuantity - approvedQuantity
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
        batch: [...newDetails[index].batch, { batch_no: "", id: 0 }],
      };
      return newDetails;
    });
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
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setSelectedFiles((prev: File[]) => [...prev, ...validFiles]);
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
      setSelectedFiles((prev: File[]) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) uploaded via drag & drop`);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("File removed successfully");
  };

  const removeExistingAttachment = (id: string) => {
    setExistingAttachments((prev) => prev.filter((att) => att.id !== id));
    toast.success("Existing attachment removed successfully");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!grnDetails.purchaseOrder) {
      toast.error("Please select a Purchase Order");
      return;
    }
    if (!grnDetails.supplier) {
      toast.error("Please select a Supplier");
      return;
    }
    if (!grnDetails.invoiceNumber) {
      toast.error("Please enter Invoice Number");
      return;
    }
    if (!grnDetails.invoiceDate || !grnDetails.postingDate) {
      toast.error("Please provide valid Invoice and Posting Dates");
      return;
    }
    for (const [index, item] of inventoryDetails.entries()) {
      if (
        !item.expectedQuantity ||
        isNaN(parseFloat(item.expectedQuantity)) ||
        parseFloat(item.expectedQuantity) < 0
      ) {
        toast.error(
          `Please enter a valid Expected Quantity for inventory item ${index + 1}`
        );
        return;
      }
      if (
        !item.receivedQuantity ||
        isNaN(parseFloat(item.receivedQuantity)) ||
        parseFloat(item.receivedQuantity) < 0
      ) {
        toast.error(
          `Please enter a valid Received Quantity for inventory item ${index + 1}`
        );
        return;
      }
      if (
        !item.approvedQuantity ||
        isNaN(parseFloat(item.approvedQuantity)) ||
        parseFloat(item.approvedQuantity) < 0
      ) {
        toast.error(
          `Please enter a valid Approved Quantity for inventory item ${index + 1}`
        );
        return;
      }
    }
    if (selectedFiles.length === 0 && existingAttachments.length === 0) {
      toast.error("Please upload at least one attachment");
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
          id: item.id,
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
          pms_products_attributes: item.batch.map(batch => ({
            batch_no: batch.batch_no,
            id: batch.id,
          })),
        })),
      },
      attachments: selectedFiles, // Only send new files
    };

    setIsSubmitting(true);
    try {
      await dispatch(editGRN({ data: payload, baseUrl, token, id: Number(id) })).unwrap();
      toast.success("GRN updated successfully!");
      navigate("/finance/grn-srn");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit GRN. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className='p-0'
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-6">Edit GRN</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* GRN Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">1</span>
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">
              GRN DETAILS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Purchase Order*</InputLabel>
              <MuiSelect
                label="Purchase Order*"
                value={grnDetails.purchaseOrder}
                onChange={(e) => {
                  const poId = Number(e.target.value);
                  setGrnDetails({
                    ...grnDetails,
                    purchaseOrder: poId,
                  });
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
                onChange={(e) =>
                  setGrnDetails({ ...grnDetails, supplier: e.target.value })
                }
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
              placeholder="Enter Number"
              value={grnDetails.invoiceNumber}
              onChange={(e) =>
                setGrnDetails({ ...grnDetails, invoiceNumber: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Related To"
              placeholder="Enter Text"
              value={grnDetails.relatedTo}
              onChange={(e) =>
                setGrnDetails({ ...grnDetails, relatedTo: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Invoice Amount"
              type="number"
              placeholder="Enter Number"
              value={grnDetails.invoiceAmount}
              onChange={(e) =>
                setGrnDetails({ ...grnDetails, invoiceAmount: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Payment Mode</InputLabel>
              <MuiSelect
                label="Payment Mode"
                value={grnDetails.paymentMode}
                onChange={(e) =>
                  setGrnDetails({ ...grnDetails, paymentMode: e.target.value })
                }
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
              onChange={(e) =>
                setGrnDetails({ ...grnDetails, invoiceDate: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Posting Date*"
              type="date"
              value={grnDetails.postingDate}
              onChange={(e) =>
                setGrnDetails({ ...grnDetails, postingDate: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Other Expense"
              type="number"
              placeholder="Other Expense"
              value={grnDetails.otherExpense}
              onChange={(e) =>
                setGrnDetails({ ...grnDetails, otherExpense: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Loading Expense"
              type="number"
              placeholder="Enter Number"
              value={grnDetails.loadingExpense}
              onChange={(e) =>
                setGrnDetails({ ...grnDetails, loadingExpense: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Adjustment Amount"
              type="number"
              placeholder="Enter Number"
              value={grnDetails.adjustmentAmount}
              onChange={(e) =>
                setGrnDetails({
                  ...grnDetails,
                  adjustmentAmount: e.target.value,
                })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="mt-6">
            <TextField
              label="Notes"
              value={grnDetails.notes}
              onChange={(e) =>
                setGrnDetails({ ...grnDetails, notes: e.target.value })
              }
              fullWidth
              variant="outlined"
              multiline
              rows={2}
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
          </div>
        </div>

        {/* Inventory Details Section */}
        {inventoryDetails.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">2</span>
                </div>
                <h2 className="text-lg font-semibold text-[#C72030]">
                  INVENTORY DETAILS {index + 1}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Inventory Type</InputLabel>
                <MuiSelect
                  label="Inventory Type"
                  value={item.inventoryType}
                  onChange={(e) =>
                    handleInventoryChange(
                      index,
                      "inventoryType",
                      e.target.value
                    )
                  }
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select</em>
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
                placeholder="Expected Quantity"
                value={item.expectedQuantity}
                onChange={(e) =>
                  handleInventoryChange(
                    index,
                    "expectedQuantity",
                    e.target.value
                  )
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Received Quantity*"
                type="number"
                placeholder="Received Quantity"
                value={item.receivedQuantity}
                onChange={(e) =>
                  handleInventoryChange(
                    index,
                    "receivedQuantity",
                    e.target.value
                  )
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Approved Quantity*"
                type="number"
                placeholder="Approved Quantity"
                value={item.approvedQuantity}
                onChange={(e) =>
                  handleInventoryChange(
                    index,
                    "approvedQuantity",
                    e.target.value
                  )
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Rejected Quantity"
                type="number"
                placeholder="Rejected Quantity"
                value={item.rejectedQuantity}
                onChange={(e) =>
                  handleInventoryChange(
                    index,
                    "rejectedQuantity",
                    e.target.value
                  )}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { ...fieldStyles },
                }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Rate"
                type="number"
                placeholder="Enter Number"
                value={item.rate}
                onChange={(e) =>
                  handleInventoryChange(index, "rate", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="CGST Rate"
                type="number"
                placeholder="Enter Number"
                value={item.cgstRate}
                onChange={(e) =>
                  handleInventoryChange(index, "cgstRate", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="CGST Amount"
                type="number"
                placeholder="Enter Number"
                value={item.cgstAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
                  readOnly: true,
                }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="SGST Rate"
                type="number"
                placeholder="Enter Number"
                value={item.sgstRate}
                onChange={(e) =>
                  handleInventoryChange(index, "sgstRate", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="SGST Amount"
                type="number"
                placeholder="Enter Number"
                value={item.sgstAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
                  readOnly: true,
                }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="IGST Rate"
                type="number"
                placeholder="Enter Number"
                value={item.igstRate}
                onChange={(e) =>
                  handleInventoryChange(index, "igstRate", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="IGST Amount"
                type="number"
                placeholder="Enter Number"
                value={item.igstAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
                  readOnly: true,
                }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="TCS Rate"
                type="number"
                placeholder="Enter Number"
                value={item.tcsRate}
                onChange={(e) =>
                  handleInventoryChange(index, "tcsRate", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="TCS Amount"
                type="number"
                placeholder="Enter Number"
                value={item.tcsAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
                  readOnly: true,
                }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Total Taxes"
                type="number"
                placeholder="Total Amount"
                value={item.totalTaxes}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
                  readOnly: true,
                }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Amount"
                type="number"
                placeholder="Enter Number"
                value={item.amount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
                  readOnly: true,
                }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Total Amount"
                type="number"
                placeholder="Total Amount"
                value={item.totalAmount}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
                  readOnly: true,
                }}
                sx={{ mt: 1 }}
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-md font-semibold">Batch Numbers</h3>
              </div>
              {item.batch.map((batch, batchIndex) => (
                <div key={batchIndex} className="flex items-center gap-4 mb-2">
                  <TextField
                    label={`Batch ${batchIndex + 1}`}
                    type="text"
                    placeholder="Enter Batch Number"
                    value={batch.batch_no}
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
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                className="bg-[#C72030] hover:bg-[#A01020] text-white mt-4"
                onClick={() => addBatchField(index)}
              >
                Add Batch
              </Button>
            </div>
          </div>
        ))}

        {/* Attachments Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">3</span>
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">
              ATTACHMENTS*
            </h2>
          </div>

          <div
            className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Drag & Drop</span> or{" "}
              <button type="button" className="text-[#C72030] underline">
                Choose File
              </button>{" "}
              No file chosen
            </p>
          </div>

          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          {(existingAttachments.length > 0 || selectedFiles.length > 0) && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
              <div className="space-y-2">
                {existingAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between bg-gray-100 p-3 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {attachment.name}
                      </a>
                      <span className="text-xs text-gray-500">
                        ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <span className="text-xs text-gray-500 italic">
                        (Existing)
                      </span>
                    </div>
                  </div>
                ))}
                {selectedFiles.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <span className="text-xs text-gray-500 italic">
                        (New)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="flex justify-end items-center gap-4">
          <div className="bg-[#C72030] text-white px-4 py-2 rounded text-right">
            Total Amount -{" "}
            {inventoryDetails
              .reduce(
                (sum, item) => sum + parseFloat(item.totalAmount || "0"),
                0
              )
              .toFixed(2)}
          </div>
          <Button
            type="submit"
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};