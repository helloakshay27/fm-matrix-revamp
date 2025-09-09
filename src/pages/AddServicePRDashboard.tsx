import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Upload, Eye, File, FileSpreadsheet, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Box,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  changePlantDetails,
  fetchWBS,
  getAddresses,
  getPlantDetails,
  getSuppliers,
} from "@/store/slices/materialPRSlice";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createServicePR, getServices } from "@/store/slices/servicePRSlice";
import { getWorkOrderById } from "@/store/slices/workOrderSlice";
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

export const AddServicePRDashboard = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data = [] } = useAppSelector((state) => state.changePlantDetails) as { data: any[] };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cloneId = searchParams.get("clone");
  const shouldFetch = Boolean(cloneId);

  const [suppliers, setSuppliers] = useState([]);
  const [plantDetails, setPlantDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [services, setServices] = useState([]);
  const [wbsSelection, setWbsSelection] = useState("");
  const [overallWbs, setOverallWbs] = useState("");
  const [wbsCodes, setWbsCodes] = useState([]);
  const [showRadio, setShowRadio] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [slid, setSlid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Attachment | null>(null);

  const [formData, setFormData] = useState({
    contractor: "",
    plantDetail: "",
    woDate: "",
    billingAddress: "",
    retention: "",
    tds: "",
    qc: "",
    paymentTenure: "",
    advanceAmount: "",
    relatedTo: "",
    kindAttention: "",
    subject: "",
    description: "",
    termsConditions: "",
  });

  const [detailsForms, setDetailsForms] = useState([
    {
      id: 1,
      service: "",
      productDescription: "",
      quantityArea: "",
      uom: "",
      expectedDate: "",
      rate: "",
      cgstRate: "",
      cgstAmt: "",
      sgstRate: "",
      sgstAmt: "",
      igstRate: "",
      igstAmt: "",
      tcsRate: "",
      tcsAmt: "",
      taxAmount: "",
      amount: "",
      totalAmount: "",
      wbsCode: "",
    },
  ]);

  const [attachedFiles, setAttachedFiles] = useState([]);

  useEffect(() => {
    const createSystemLog = async () => {
      try {
        const response = await axios.post(
          `https://${baseUrl}/pms/work_orders/create_system_log_for_wo.json`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSlid(response.data.id);
      } catch (error) {
        console.error("Error creating system log:", error);
        toast.error("Failed to create system log");
      }
    };
    createSystemLog();
  }, [baseUrl, token]);

  useEffect(() => {
    if (!slid) return;

    const interval = setInterval(async () => {
      const payload = {
        pms_work_order: {
          letter_of_indent: true,
          pms_supplier_id: formData.contractor,
          plant_detail_id: formData.plantDetail,
          wo_date: formData.woDate,
          billing_address_id: formData.billingAddress,
          retention: formData.retention,
          tds: formData.tds,
          quality_holding: formData.qc,
          payment_tenure: formData.paymentTenure,
          advance_amount: formData.advanceAmount,
          related_to: formData.relatedTo,
          address_to: formData.kindAttention,
          subject: formData.subject,
          description: formData.description,
          term_condition: formData.termsConditions,
          ...(wbsSelection === "overall" && { wbs_code: overallWbs }),
          pms_wo_inventories_attributes: detailsForms.map((item) => ({
            pms_service_id: item.service,
            prod_desc: item.productDescription,
            quantity: item.quantityArea,
            unit: item.uom,
            expected_date: item.expectedDate,
            rate: item.rate,
            cgst_rate: item.cgstRate,
            cgst_amount: item.cgstAmt,
            sgst_rate: item.sgstRate,
            sgst_amount: item.sgstAmt,
            igst_rate: item.igstRate,
            igst_amount: item.igstAmt,
            tcs_rate: item.tcsRate,
            tcs_amount: item.tcsAmt,
            taxable_value: item.taxAmount,
            total_value: item.amount,
            total_amount: item.totalAmount,
            ...(wbsSelection === "individual" && { wbs_code: item.wbsCode }),
          })),
        },
        attachments: attachedFiles,
        apply_wbs: wbsSelection === "overall" ? "overall" : "individual",
        slid,
      };

      try {
        await axios.put(
          `https://${baseUrl}/pms/work_orders/update_temp_records.json`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Auto saved successfully");
      } catch (error) {
        console.error("Error updating system log:", error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [slid, formData, detailsForms, attachedFiles, wbsSelection, overallWbs, baseUrl, token]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await dispatch(getSuppliers({ baseUrl, token })).unwrap();
        setSuppliers(response.suppliers);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    const fetchPlantDetails = async () => {
      try {
        const response = await dispatch(getPlantDetails({ baseUrl, token })).unwrap();
        setPlantDetails(response);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await dispatch(getAddresses({ baseUrl, token })).unwrap();
        setAddresses(response.admin_invoice_addresses);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await dispatch(getServices({ baseUrl, token })).unwrap();
        setServices(response);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    fetchSuppliers();
    fetchPlantDetails();
    fetchAddresses();
    fetchServices();
  }, [dispatch, baseUrl, token]);

  useEffect(() => {
    if (shouldFetch) {
      const cloneData = async () => {
        try {
          const response = await dispatch(getWorkOrderById({ baseUrl, token, id: cloneId })).unwrap();
          const data = response.page;
          setFormData({
            contractor: data.pms_supplier_id,
            plantDetail: data.work_order.plant_detail_id,
            woDate: data.work_order.date ? data.work_order.date.split("T")[0] : "",
            billingAddress: data.work_order.billing_address_id,
            retention: data.work_order?.payment_terms?.retention,
            tds: data.work_order?.payment_terms?.tds,
            qc: data.work_order?.payment_terms?.quality_holding,
            paymentTenure: data.work_order.payment_terms?.payment_tenure,
            advanceAmount: data.work_order.advance_amount,
            relatedTo: data.work_order.related_to,
            kindAttention: data.work_order.kind_attention,
            subject: data.work_order.subject,
            description: data.work_order.description,
            termsConditions: data.work_order.term_condition,
          });

          setWbsSelection(
            data.inventories?.every(item => item.wbs_code !== null) ? "individual" : "overall"
          );

          setDetailsForms(data.inventories.map((item, index) => ({
            id: index + 1,
            service: item.pms_service_id,
            productDescription: item.product_description,
            quantityArea: item.quantity,
            uom: item.unit,
            expectedDate: item.expected_date ? item.expected_date.split("T")[0] : "",
            rate: item.rate,
            cgstRate: item.cgst_rate,
            cgstAmt: item.cgst_amount,
            sgstRate: item.sgst_rate,
            sgstAmt: item.sgst_amount,
            igstRate: item.igst_rate,
            igstAmt: item.igst_amount,
            tcsRate: item.tcs_rate,
            tcsAmt: item.tcs_amount,
            taxAmount: item.tax_amount,
            amount: item.total_value,
            totalAmount: (Number(item.tax_amount) + Number(item.total_value)).toFixed(2),
            wbsCode: item.wbs_code || "",
          })));
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      };
      cloneData();
    }
  }, [shouldFetch, cloneId, dispatch, baseUrl, token]);

  useEffect(() => {
    if (data.length > 0) {
      setShowRadio(true);
    }
  }, [data]);

  useEffect(() => {
    if (showRadio) {
      const fetchData = async () => {
        try {
          const response = await dispatch(fetchWBS({ baseUrl, token })).unwrap();
          setWbsCodes(response.wbs);
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      };
      fetchData();
    }
  }, [showRadio, dispatch, baseUrl, token]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateItem = (item) => {
    const quantity = parseFloat(item.quantityArea) || 0;
    const rate = parseFloat(item.rate) || 0;
    const cgstRate = parseFloat(item.cgstRate) || 0;
    const sgstRate = parseFloat(item.sgstRate) || 0;
    const igstRate = parseFloat(item.igstRate) || 0;
    const tcsRate = parseFloat(item.tcsRate) || 0;

    const amount = quantity * rate;
    const cgstAmt = (amount * cgstRate) / 100;
    const sgstAmt = (amount * sgstRate) / 100;
    const igstAmt = (amount * igstRate) / 100;
    const tcsAmt = (amount * tcsRate) / 100;
    const taxAmount = cgstAmt + sgstAmt + igstAmt + tcsAmt;
    const totalAmount = amount + taxAmount;

    return {
      ...item,
      amount: amount.toFixed(2),
      cgstAmt: cgstAmt.toFixed(2),
      sgstAmt: sgstAmt.toFixed(2),
      igstAmt: igstAmt.toFixed(2),
      tcsAmt: tcsAmt.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const handleDetailsChange = (id, field, value) => {
    setDetailsForms((prev) =>
      prev.map((form) => {
        if (form.id === id) {
          const updatedForm = { ...form, [field]: value };
          if (
            ["quantityArea", "rate", "cgstRate", "sgstRate", "igstRate", "tcsRate"].includes(field)
          ) {
            return calculateItem(updatedForm);
          }
          return updatedForm;
        }
        return form;
      })
    );
  };

  const addNewDetailsForm = () => {
    const newId = Math.max(...detailsForms.map((form) => form.id)) + 1;
    const newForm = {
      id: newId,
      service: "",
      productDescription: "",
      quantityArea: "",
      uom: "",
      expectedDate: "",
      rate: "",
      cgstRate: "",
      cgstAmt: "",
      sgstRate: "",
      sgstAmt: "",
      igstRate: "",
      igstAmt: "",
      tcsRate: "",
      tcsAmt: "",
      taxAmount: "",
      amount: "",
      totalAmount: "",
      wbsCode: "",
    };
    setDetailsForms((prev) => [...prev, newForm]);
  };

  const removeDetailsForm = (id) => {
    if (detailsForms.length > 1) {
      setDetailsForms((prev) => prev.filter((form) => form.id !== id));
    }
  };

  const handlePlantDetailsChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, plantDetail: value }));
    dispatch(changePlantDetails({ baseUrl, id: value, token }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setAttachedFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDashedBorderClick = () => {
    fileInputRef.current?.click();
  };

  const grandTotal = detailsForms
    .reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0)
    .toFixed(2);

  const validateForm = () => {
    if (!formData.contractor) {
      toast.error("Contractor is required");
      return false;
    }
    if (!formData.woDate) {
      toast.error("WO Date is required");
      return false;
    }
    if (!formData.billingAddress) {
      toast.error("Billing Address is required");
      return false;
    }
    if (!formData.relatedTo) {
      toast.error("Related To is required");
      return false;
    }

    for (const item of detailsForms) {
      if (!item.service) {
        toast.error("Service is required for all items");
        return false;
      }
      if (!item.productDescription) {
        toast.error("Product Description is required for all items");
        return false;
      }
      if (!item.quantityArea || isNaN(parseFloat(item.quantityArea)) || parseFloat(item.quantityArea) <= 0) {
        toast.error("Quantity/Area must be a valid positive number for all items");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitting(true);
    const payload = {
      pms_work_order: {
        letter_of_indent: true,
        pms_supplier_id: formData.contractor,
        plant_detail_id: formData.plantDetail,
        wo_date: formData.woDate,
        billing_address_id: formData.billingAddress,
        retention: formData.retention,
        tds: formData.tds,
        quality_holding: formData.qc,
        payment_tenure: formData.paymentTenure,
        advance_amount: formData.advanceAmount,
        related_to: formData.relatedTo,
        address_to: formData.kindAttention,
        subject: formData.subject,
        description: formData.description,
        term_condition: formData.termsConditions,
        ...(wbsSelection === "overall" && { wbs_code: overallWbs }),
        pms_wo_inventories_attributes: detailsForms.map((item) => ({
          pms_service_id: item.service,
          prod_desc: item.productDescription,
          quantity: item.quantityArea,
          unit: item.uom,
          expected_date: item.expectedDate,
          rate: item.rate,
          cgst_rate: item.cgstRate,
          cgst_amount: item.cgstAmt,
          sgst_rate: item.sgstRate,
          sgst_amount: item.sgstAmt,
          igst_rate: item.igstRate,
          igst_amount: item.igstAmt,
          tcs_rate: item.tcsRate,
          tcs_amount: item.tcsAmt,
          taxable_value: item.taxAmount,
          total_value: item.amount,
          total_amount: item.totalAmount,
          ...(wbsSelection === "individual" && { wbs_code: item.wbsCode }),
        })),
      },
      attachments: attachedFiles,
      apply_wbs: wbsSelection === "overall" ? "overall" : "individual",
    };

    try {
      await dispatch(createServicePR({ data: payload, baseUrl, token })).unwrap();
      toast.success("Service PR created successfully");
      navigate("/finance/service-pr");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to create Service PR");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="p-0"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-6">ADD SERVICE PR</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] flex items-center">
                <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                  1
                </h2>
                WORK ORDER DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Contractor*</InputLabel>
                <MuiSelect
                  label="Contractor*"
                  value={formData.contractor}
                  onChange={(e) => handleInputChange("contractor", e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Contractor</em>
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
                  onChange={handlePlantDetailsChange}
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
                label="WO Date*"
                type="date"
                value={formData.woDate}
                onChange={(e) => handleInputChange("woDate", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
              />

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Billing Address*</InputLabel>
                <MuiSelect
                  label="Billing Address*"
                  value={formData.billingAddress}
                  onChange={(e) => handleInputChange("billingAddress", e.target.value)}
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

              <TextField
                label="Retention(%)"
                value={formData.retention}
                onChange={(e) => handleInputChange("retention", e.target.value)}
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
                onChange={(e) => handleInputChange("tds", e.target.value)}
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
                onChange={(e) => handleInputChange("qc", e.target.value)}
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
                onChange={(e) => handleInputChange("paymentTenure", e.target.value)}
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
                onChange={(e) => handleInputChange("advanceAmount", e.target.value)}
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
                label="Related To*"
                value={formData.relatedTo}
                onChange={(e) => handleInputChange("relatedTo", e.target.value)}
                placeholder="Related To"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Kind Attention"
                value={formData.kindAttention}
                onChange={(e) => handleInputChange("kindAttention", e.target.value)}
                placeholder="Kind Attention"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Subject"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter description here..."
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

              <TextField
                label="Terms & Conditions"
                value={formData.termsConditions}
                onChange={(e) => handleInputChange("termsConditions", e.target.value)}
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

              {showRadio && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <FormLabel component="legend" sx={{ minWidth: "80px", fontSize: "14px" }}>
                    Apply WBS
                  </FormLabel>
                  <RadioGroup
                    row
                    value={wbsSelection}
                    onChange={(e) => setWbsSelection(e.target.value)}
                  >
                    <FormControlLabel value="individual" control={<Radio />} label="Individual" />
                    <FormControlLabel value="overall" control={<Radio />} label="All Items" />
                  </RadioGroup>
                </Box>
              )}

              {wbsSelection === "overall" && (
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>WBS Code*</InputLabel>
                  <MuiSelect
                    label="WBS Code*"
                    value={overallWbs}
                    onChange={(e) => setOverallWbs(e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select WBS Code</em>
                    </MenuItem>
                    {wbsCodes.map((wbs) => (
                      <MenuItem key={wbs.wbs_code} value={wbs.wbs_code}>
                        {wbs.wbs_code}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              )}
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
                  onClick={addNewDetailsForm}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                  type="button"
                >
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {detailsForms.map((detailsData) => (
                <div
                  key={detailsData.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg relative"
                >
                  {detailsForms.length > 1 && (
                    <Button
                      onClick={() => removeDetailsForm(detailsData.id)}
                      size="sm"
                      className="absolute -top-3 -right-3 p-1 h-8 w-8 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Service*</InputLabel>
                    <MuiSelect
                      label="Service*"
                      value={detailsData.service}
                      onChange={(e) =>
                        handleDetailsChange(detailsData.id, "service", e.target.value)
                      }
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="">
                        <em>Select Service</em>
                      </MenuItem>
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.service_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  <TextField
                    label="Product Description*"
                    value={detailsData.productDescription}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "productDescription", e.target.value)
                    }
                    placeholder="Product Description"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Quantity/Area*"
                    value={detailsData.quantityArea}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "quantityArea", e.target.value)
                    }
                    placeholder="Enter Number"
                    fullWidth
                    type="number"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="UOM"
                    value={detailsData.uom}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "uom", e.target.value)
                    }
                    placeholder="Enter UOM"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Expected Date*"
                    type="date"
                    value={detailsData.expectedDate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "expectedDate", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Rate*"
                    value={detailsData.rate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "rate", e.target.value)
                    }
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
                    value={detailsData.cgstRate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "cgstRate", e.target.value)
                    }
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
                    value={detailsData.cgstAmt}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="SGST Rate"
                    value={detailsData.sgstRate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "sgstRate", e.target.value)
                    }
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
                    value={detailsData.sgstAmt}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="IGST Rate"
                    value={detailsData.igstRate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "igstRate", e.target.value)
                    }
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
                    value={detailsData.igstAmt}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="TCS Rate"
                    value={detailsData.tcsRate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "tcsRate", e.target.value)
                    }
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
                    value={detailsData.tcsAmt}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Tax Amount"
                    value={detailsData.taxAmount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Amount"
                    value={detailsData.amount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Total Amount"
                    value={detailsData.totalAmount}
                    placeholder="Calculated Amount"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles, readOnly: true }}
                    sx={{ mt: 1 }}
                  />

                  {wbsSelection === "individual" && (
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                      <InputLabel shrink>WBS Code*</InputLabel>
                      <MuiSelect
                        label="WBS Code*"
                        value={detailsData.wbsCode}
                        onChange={(e) =>
                          handleDetailsChange(detailsData.id, "wbsCode", e.target.value)
                        }
                        displayEmpty
                        sx={fieldStyles}
                      >
                        <MenuItem value="">
                          <em>Select WBS Code</em>
                        </MenuItem>
                        {wbsCodes.map((wbs) => (
                          <MenuItem key={wbs.wbs_code} value={wbs.wbs_code}>
                            {wbs.wbs_code}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex items-center justify-end">
            <Button className="bg-[#C72030] hover:bg-[#C72030] text-white cursor-not-allowed" type="button">
              Total Amount: {grandTotal}
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
                  />
                  <span className="ml-1">
                    {attachedFiles.length > 0
                      ? `${attachedFiles.length} file(s) selected`
                      : "No files chosen"}
                  </span>
                </div>
              </div>

              {attachedFiles.length > 0 && (
                <div className="flex items-center flex-wrap gap-4 my-6">
                  {attachedFiles.map((file, index) => {
                    const isImage = file.type.match(/image\/(jpeg|jpg|png)/i);
                    const isPdf = file.type.match(/application\/pdf/i);
                    const isExcel = file.type.match(/application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/i);
                    const isWord = file.type.match(/application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/i);

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
              disabled={submitting}
            >
              Save Work Order
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