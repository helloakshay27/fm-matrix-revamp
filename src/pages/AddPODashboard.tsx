import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  File,
  FileSpreadsheet,
  FileText,
  Upload,
  Eye,
  X,
} from "lucide-react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppDispatch } from "@/store/hooks";
import {
  getAddresses,
  getInventories,
  getMaterialPR,
  getMaterialPRById,
  getPlantDetails,
} from "@/store/slices/materialPRSlice";
import {
  createPurchaseOrder,
  getUnits,
  materialPRChange,
} from "@/store/slices/purchaseOrderSlice";
import axios from "axios";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

interface Attachment {
  id: number;
  url: string;
  document_name?: string;
  document_file_name?: string;
}

export const AddPODashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = new URLSearchParams(location.search);
  const cloneId = searchParams.get("clone");
  const shouldFetch = Boolean(cloneId);

  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const [materialPR, setMaterialPR] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [plantDetails, setPlantDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [units, setUnits] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Attachment | null>(null);

  const [formData, setFormData] = useState({
    materialPR: "",
    supplier: "",
    plantDetail: "",
    poDate: "",
    billingAddress: "",
    deliveryAddress: "",
    relatedTo: "",
    retention: "",
    tds: "",
    qc: "",
    paymentTenure: "",
    advanceAmount: "",
    termsConditions: "",
    attachments: [] as File[],
  });

  const [items, setItems] = useState([
    {
      id: 1,
      itemDetails: "",
      sacHsnCode: "",
      sacHsnCodeId: "",
      quantity: "",
      unit: "",
      expectedDate: "",
      rate: "",
      cgstRate: "",
      cgstAmount: "",
      sgstRate: "",
      sgstAmount: "",
      igstRate: "",
      igstAmount: "",
      tcsRate: "",
      tcsAmount: "",
      taxAmount: "",
      amount: "",
      totalAmount: "",
    },
  ]);

  useEffect(() => {
    const fetchMaterialPR = async () => {
      try {
        const response = await dispatch(getMaterialPR({ baseUrl, token })).unwrap();
        setMaterialPR(response.purchase_orders);
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to fetch material PRs");
      }
    };

    const fetchPlantDetails = async () => {
      try {
        const response = await dispatch(getPlantDetails({ baseUrl, token })).unwrap();
        setPlantDetails(response);
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to fetch plant details");
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await dispatch(getAddresses({ baseUrl, token })).unwrap();
        setAddresses(response.admin_invoice_addresses);
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to fetch addresses");
      }
    };

    const fetchInventories = async () => {
      try {
        const response = await dispatch(getInventories({ baseUrl, token })).unwrap();
        setInventories(response.inventories);
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to fetch inventories");
      }
    };

    const fetchUnits = async () => {
      try {
        const response = await dispatch(getUnits({ baseUrl, token })).unwrap();
        setUnits(response.units);
        setSuppliers(response.pms_suppliers);
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to fetch units");
      }
    };

    fetchMaterialPR();
    fetchPlantDetails();
    fetchAddresses();
    fetchInventories();
    fetchUnits();
  }, [dispatch, baseUrl, token]);

  useEffect(() => {
    if (shouldFetch && cloneId) {
      const cloneData = async () => {
        try {
          const response = await dispatch(getMaterialPRById({ baseUrl, token, id: cloneId })).unwrap();
          setFormData({
            materialPR: "",
            supplier: response.pms_supplier_id || "",
            plantDetail: response.plant_detail?.id || "",
            poDate: response.po_date ? response.po_date.split("T")[0] : "",
            billingAddress: response.billing_address_id || "",
            deliveryAddress: response.shipping_address_id || "",
            relatedTo: response.related_to || "",
            retention: response.retention || "",
            tds: response.tds || "",
            qc: response.quality_holding || "",
            paymentTenure: response.payment_tenure || "",
            advanceAmount: response.advance_amount || "",
            termsConditions: response.terms_conditions || "",
            attachments: [],
          });

          setItems(
            response.pms_po_inventories?.map((item, index) => ({
              id: index + 1,
              itemDetails: item.inventory?.id || "",
              sacHsnCode: item.sac_hsn_code || "",
              sacHsnCodeId: item.hsn_id || "",
              quantity: item.quantity || "",
              unit: item.unit || "",
              expectedDate: item.expected_date ? item.expected_date.split("T")[0] : "",
              rate: item.rate || "",
              cgstRate: item.cgst_rate || "",
              cgstAmount: item.cgst_amount || "",
              sgstRate: item.sgst_rate || "",
              sgstAmount: item.sgst_amount || "",
              igstRate: item.igst_rate || "",
              igstAmount: item.igst_amount || "",
              tcsRate: item.tcs_rate || "",
              tcsAmount: item.tcs_amount || "",
              taxAmount: item.taxable_value || "",
              amount: item.total_value || "",
              totalAmount: (Number(item.taxable_value) + Number(item.total_value)).toFixed(2) || "",
            })) || []
          );
        } catch (error) {
          console.log(error);
          toast.error(error.message || "Failed to clone purchase order");
        }
      };

      cloneData();
    }
  }, [shouldFetch, cloneId, dispatch, baseUrl, token]);

  const calculateItem = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    const baseAmount = rate * quantity;
    const cgstRate = parseFloat(item.cgstRate) || 0;
    const sgstRate = parseFloat(item.sgstRate) || 0;
    const igstRate = parseFloat(item.igstRate) || 0;
    const tcsRate = parseFloat(item.tcsRate) || 0;
    const cgstAmount = (baseAmount * cgstRate) / 100;
    const sgstAmount = (baseAmount * sgstRate) / 100;
    const igstAmount = (baseAmount * igstRate) / 100;
    const tcsAmount = (baseAmount * tcsRate) / 100;
    const taxAmount = cgstAmount + sgstAmount + igstAmount + tcsAmount;
    const totalAmount = baseAmount + taxAmount;
    return {
      ...item,
      amount: baseAmount.toFixed(2),
      cgstAmount: cgstAmount.toFixed(2),
      sgstAmount: sgstAmount.toFixed(2),
      igstAmount: igstAmount.toFixed(2),
      tcsAmount: tcsAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + (parseFloat(item.totalAmount) || 0), 0).toFixed(2);
  };

  const validateForm = () => {
    if (!formData.supplier) {
      toast.error("Please select a supplier");
      return false;
    }
    if (!formData.poDate) {
      toast.error("Please select a PO date");
      return false;
    }
    if (!formData.billingAddress) {
      toast.error("Please select a billing address");
      return false;
    }
    if (!formData.deliveryAddress) {
      toast.error("Please select a delivery address");
      return false;
    }
    for (const item of items) {
      if (!item.itemDetails) {
        toast.error("Item Details is required for all items");
        return false;
      }
      if (!item.quantity || isNaN(parseFloat(item.quantity)) || parseFloat(item.quantity) <= 0) {
        toast.error("Quantity must be a valid positive number for all items");
        return false;
      }
      if (!item.unit) {
        toast.error("Unit is required for all items");
        return false;
      }
      if (!item.expectedDate) {
        toast.error("Expected Date is required for all items");
        return false;
      }
      if (!item.rate || isNaN(parseFloat(item.rate)) || parseFloat(item.rate) <= 0) {
        toast.error("Rate must be a valid positive number for all items");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitting(true);
    const payload = {
      pms_purchase_order: {
        reference_id: formData.materialPR,
        pms_supplier_id: formData.supplier,
        plant_detail_id: formData.plantDetail,
        billing_address_id: formData.billingAddress,
        shipping_address_id: formData.deliveryAddress,
        po_date: formData.poDate,
        letter_of_indent: false,
        terms_conditions: formData.termsConditions,
        retention: formData.retention,
        tds: formData.tds,
        quality_holding: formData.qc,
        payment_tenure: formData.paymentTenure,
        related_to: formData.relatedTo,
        advance_amount: formData.advanceAmount,
        pms_po_inventories_attributes: items.map((item) => ({
          pms_inventory_id: item.itemDetails,
          sac_hsn_code: item.sacHsnCodeId,
          quantity: item.quantity,
          unit: item.unit,
          unit_type: "Each",
          expected_date: item.expectedDate,
          rate: item.rate,
          cgst_rate: item.cgstRate,
          cgst_amount: item.cgstAmount,
          sgst_rate: item.sgstRate,
          sgst_amount: item.sgstAmount,
          igst_rate: item.igstRate,
          igst_amount: item.igstAmount,
          tcs_rate: item.tcsRate,
          tcs_amount: item.tcsAmount,
          taxable_value: item.taxAmount,
          total_value: item.amount,
          total_amount: item.totalAmount,
        })),
      },
      attachments: formData.attachments,
    };

    try {
      await dispatch(createPurchaseOrder({ baseUrl, token, data: payload })).unwrap();
      toast.success("Purchase Order created successfully");
      navigate("/finance/po");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to create purchase order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files],
    });
  };

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index),
    });
  };

  const handleDashedBorderClick = () => {
    fileInputRef.current?.click();
  };

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      itemDetails: "",
      sacHsnCode: "",
      sacHsnCodeId: "",
      quantity: "",
      unit: "",
      expectedDate: "",
      rate: "",
      cgstRate: "",
      cgstAmount: "",
      sgstRate: "",
      sgstAmount: "",
      igstRate: "",
      igstAmount: "",
      tcsRate: "",
      tcsAmount: "",
      taxAmount: "",
      amount: "",
      totalAmount: "",
    };
    setItems([...items, newItem]);
  };

  const updateItem = (itemId: number, field: string, value: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? calculateItem({ ...item, [field]: value }) : item
      )
    );
    if (field === "itemDetails") {
      onInventoryChange(value, itemId);
    }
  };

  const handleMaterialPRChange = async (e: SelectChangeEvent<string>) => {
    const materialPRId = e.target.value;

    try {
      const response = await dispatch(
        materialPRChange({ baseUrl, token, id: parseInt(materialPRId) })
      ).unwrap();

      setFormData({
        ...formData,
        materialPR: materialPRId,
        supplier: response.supplier?.id || "",
      });

      const newItems =
        response.pms_po_inventories?.map((inv: any, index: number) => ({
          id: index + 1,
          itemDetails: inv?.inventory?.id || "",
          sacHsnCode: "",
          sacHsnCodeId: "",
          quantity: inv?.quantity || "",
          unit: "",
          expectedDate: "",
          rate: "",
          cgstRate: "",
          cgstAmount: "",
          sgstRate: "",
          sgstAmount: "",
          igstRate: "",
          igstAmount: "",
          tcsRate: "",
          tcsAmount: "",
          taxAmount: "",
          amount: "",
          totalAmount: "",
        })) || [];

      setItems(newItems);

      if (newItems.length > 0) {
        newItems.forEach((item) => {
          if (item.itemDetails) {
            onInventoryChange(item.itemDetails, item.id);
          }
        });
      }
    } catch (error) {
      console.error("Error in handleMaterialPRChange:", error);
      toast.error("Failed to fetch material PR details");
    }
  };

  const onInventoryChange = async (inventoryId: string, itemId: number) => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/purchase_orders/${inventoryId}/hsn_code_categories.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? calculateItem({
              ...item,
              sacHsnCode: response.data.hsn?.code || "",
              sacHsnCodeId: response.data.hsn?.id || "",
              rate: response.data.rate || "",
            })
            : item
        )
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch HSN code");
    }
  };

  const removeItem = (itemId: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  return (
    <div className="p-6 mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-6">NEW PURCHASE ORDER</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] flex items-center">
                <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                  1
                </h2>
                SUPPLIER DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Material PR*</InputLabel>
                <MuiSelect
                  label="Material PR*"
                  value={formData.materialPR}
                  onChange={handleMaterialPRChange}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Material PR</em>
                  </MenuItem>
                  {materialPR.map((materialPR) => (
                    <MenuItem key={materialPR.id} value={materialPR.id}>
                      {materialPR.id}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Supplier*</InputLabel>
                <MuiSelect
                  label="Supplier*"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Supplier</em>
                  </MenuItem>
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Plant Detail</InputLabel>
                <MuiSelect
                  label="Plant Detail"
                  value={formData.plantDetail}
                  onChange={(e) =>
                    setFormData({ ...formData, plantDetail: e.target.value })
                  }
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Plant Detail</em>
                  </MenuItem>
                  {plantDetails.map((plantDetail) => (
                    <MenuItem key={plantDetail.id} value={plantDetail.id}>
                      {plantDetail.plant_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <TextField
                label="PO Date*"
                type="date"
                value={formData.poDate}
                onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
              />

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Billing Address*</InputLabel>
                <MuiSelect
                  label="Billing Address*"
                  value={formData.billingAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, billingAddress: e.target.value })
                  }
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Billing Address</em>
                  </MenuItem>
                  {addresses.map((address) => (
                    <MenuItem key={address.id} value={address.id}>
                      {address.title}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Delivery Address*</InputLabel>
                <MuiSelect
                  label="Delivery Address*"
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryAddress: e.target.value })
                  }
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Delivery Address</em>
                  </MenuItem>
                  {addresses.map((address) => (
                    <MenuItem key={address.id} value={address.id}>
                      {address.title}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <TextField
                label="Related To"
                value={formData.relatedTo}
                onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                placeholder="Enter Related To"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Retention(%)"
                value={formData.retention}
                onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
                placeholder="Enter Number"
                fullWidth
                type="number"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0, max: 100 }}
              />

              <TextField
                label="TDS(%)"
                value={formData.tds}
                onChange={(e) => setFormData({ ...formData, tds: e.target.value })}
                placeholder="Enter Number"
                fullWidth
                type="number"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0, max: 100 }}
              />

              <TextField
                label="QC(%)"
                value={formData.qc}
                onChange={(e) => setFormData({ ...formData, qc: e.target.value })}
                placeholder="Enter Number"
                fullWidth
                type="number"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0, max: 100 }}
              />

              <TextField
                label="Payment Tenure(In Days)"
                value={formData.paymentTenure}
                onChange={(e) => setFormData({ ...formData, paymentTenure: e.target.value })}
                placeholder="Enter Number"
                fullWidth
                type="number"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Advance Amount"
                value={formData.advanceAmount}
                onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
                placeholder="Enter Number"
                fullWidth
                type="number"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Terms & Conditions"
                value={formData.termsConditions}
                onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
                placeholder="Enter terms and conditions here..."
                fullWidth
                variant="outlined"
                multiline
                minRows={2}
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

          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                    2
                  </h2>
                  ITEM DETAILS
                </div>
                <Button
                  type="button"
                  onClick={addItem}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg relative"
                >
                  {items.length > 1 && (
                    <Button
                      onClick={() => removeItem(item.id)}
                      size="sm"
                      className="absolute -top-3 -right-3 p-1 h-8 w-8 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Item Details*</InputLabel>
                    <MuiSelect
                      label="Item Details*"
                      value={item.itemDetails}
                      onChange={(e) => updateItem(item.id, "itemDetails", e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="">
                        <em>Select Item Details</em>
                      </MenuItem>
                      {inventories.map((inventory) => (
                        <MenuItem key={inventory.id} value={inventory.id}>
                          {inventory.inventory_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  <TextField
                    label="SAC/HSN Code"
                    value={item.sacHsnCode}
                    onChange={(e) => updateItem(item.id, "sacHsnCode", e.target.value)}
                    placeholder="Enter SAC/HSN Code"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Quantity*"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                    placeholder="Enter Number"
                    fullWidth
                    type="number"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Unit*</InputLabel>
                    <MuiSelect
                      label="Unit*"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="">
                        <em>Select Unit</em>
                      </MenuItem>
                      {units.map((unit) => (
                        <MenuItem key={unit[0]} value={unit[0]}>
                          {unit[0]}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  <TextField
                    label="Expected Date*"
                    type="date"
                    value={item.expectedDate}
                    onChange={(e) => updateItem(item.id, "expectedDate", e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Rate*"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                    placeholder="Enter Number"
                    fullWidth
                    type="number"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="CGST Rate"
                    value={item.cgstRate}
                    onChange={(e) => updateItem(item.id, "cgstRate", e.target.value)}
                    placeholder="Enter Number"
                    fullWidth
                    type="number"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="CGST Amount"
                    value={item.cgstAmount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="SGST Rate"
                    value={item.sgstRate}
                    onChange={(e) => updateItem(item.id, "sgstRate", e.target.value)}
                    placeholder="Enter Number"
                    fullWidth
                    type="number"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="SGST Amount"
                    value={item.sgstAmount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="IGST Rate"
                    value={item.igstRate}
                    onChange={(e) => updateItem(item.id, "igstRate", e.target.value)}
                    placeholder="Enter Number"
                    fullWidth
                    type="number"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="IGST Amount"
                    value={item.igstAmount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="TCS Rate"
                    value={item.tcsRate}
                    onChange={(e) => updateItem(item.id, "tcsRate", e.target.value)}
                    placeholder="Enter Number"
                    fullWidth
                    type="number"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="TCS Amount"
                    value={item.tcsAmount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Tax Amount"
                    value={item.taxAmount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Amount"
                    value={item.amount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Total Amount"
                    value={item.totalAmount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex items-center justify-end">
            <Button
              className="bg-[#C72030] hover:bg-[#C72030] text-white cursor-not-allowed"
              type="button"
            >
              Total Amount: {calculateTotalAmount()}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] flex items-center">
                <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                  3
                </h2>
                ATTACHMENTS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-yellow-400 rounded-lg p-8 text-center cursor-pointer"
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
                    {formData.attachments.length > 0
                      ? `${formData.attachments.length} file(s) selected`
                      : "No files chosen"}
                  </span>
                </div>
              </div>

              {formData.attachments.length > 0 && (
                <div className="flex items-center flex-wrap gap-4 my-6">
                  {formData.attachments.map((file, index) => {
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
                        key={index}
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
              disabled={submitting}
            >
              Submit
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