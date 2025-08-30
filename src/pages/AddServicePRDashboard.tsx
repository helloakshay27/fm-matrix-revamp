import { useEffect, useState } from "react";
import { ArrowLeft, Settings, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Box,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Autocomplete,
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

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

export const AddServicePRDashboard = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    contractor: "",
    plantDetail: "",
    woDate: new Date(),
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
      expectedDate: new Date(),
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await dispatch(
          getSuppliers({ baseUrl, token })
        ).unwrap();
        setSuppliers(response.suppliers);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    const fetchPlantDetails = async () => {
      try {
        const response = await dispatch(
          getPlantDetails({ baseUrl, token })
        ).unwrap();
        setPlantDetails(response);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await dispatch(
          getAddresses({ baseUrl, token })
        ).unwrap();
        setAddresses(response.admin_invoice_addresses);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await dispatch(
          getServices({ baseUrl, token })
        ).unwrap();
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
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      const cloneData = async () => {
        try {
          const response = await dispatch(getWorkOrderById({ baseUrl, token, id: cloneId })).unwrap();
          const data = response.page;
          setFormData({
            contractor: data.pms_supplier_id,
            plantDetail: data.work_order.plant_detail_id,
            woDate: data.work_order.wo_date,
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

          setDetailsForms(data.inventories.map((item, index) => ({
            id: index + 1,
            service: item.pms_service_id,
            productDescription: item.product_description,
            quantityArea: item.quantity,
            uom: item.unit,
            expectedDate: item.expected_date,
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
            totalAmount: item.total_amount,
            wbsCode: "",
          })));
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      };

      cloneData();
    }
  }, [shouldFetch]);

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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateItem = (item) => {
    const quantity = parseFloat(item.quantityArea) || 0;
    const rate = parseFloat(item.rate) || 0;
    const cgstRate = parseFloat(item.cgstRate) || 0;
    const sgstRate = parseFloat(item.sgstRate) || 0;
    const igstRate = parseFloat(item.igstRate) || 0;
    const tcsRate = parseFloat(item.tcsRate) || 0;

    // Calculate base amount
    const amount = quantity * rate;

    // Calculate tax amounts
    const cgstAmt = (amount * cgstRate) / 100;
    const sgstAmt = (amount * sgstRate) / 100;
    const igstAmt = (amount * igstRate) / 100;
    const tcsAmt = (amount * tcsRate) / 100;

    // Calculate total tax amount
    const taxAmount = cgstAmt + sgstAmt + igstAmt + tcsAmt;

    // Calculate total amount including taxes
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
          // Recalculate only if relevant fields are changed
          if (
            [
              "quantityArea",
              "rate",
              "cgstRate",
              "sgstRate",
              "igstRate",
              "tcsRate",
            ].includes(field)
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
      expectedDate: new Date(),
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

  useEffect(() => {
    if (formData.plantDetail) {
      handlePlantDetailsChange({ target: { name: "plantDetail", value: formData.plantDetail } });
    }
  }, [formData.plantDetail]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setAttachedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const grandTotal = detailsForms
    .reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0)
    .toFixed(2);

  const validateForm = () => {
    // Work Order Details Validation
    if (!formData.contractor) {
      toast.error("Contractor is required");
      return false;
    }
    if (!formData.plantDetail) {
      toast.error("Plant Detail is required");
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

    // Details Forms Validation
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

  const handleSubmit = async () => {
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
          tax_amount: item.taxAmount,
          total_value: item.amount,
          total_amount: item.totalAmount,
          ...(wbsSelection === "individual" && { wbs_code: item.wbsCode }),
        })),
      },
      attachments: attachedFiles,
    };

    try {
      await dispatch(createServicePR({ data: payload, baseUrl, token })).unwrap();
      toast.success("Service PR created successfully");
      navigate("/finance/service-pr");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-0 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {/* Work Order Details Section Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                WORK ORDER DETAILS
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Select Contractor*</InputLabel>
                <MuiSelect
                  label="Select Contractor*"
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
                <InputLabel shrink>Plant Detail*</InputLabel>
                <MuiSelect
                  label="Plant Detail*"
                  value={formData.plantDetail}
                  onChange={handlePlantDetailsChange}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Plant Id</em>
                  </MenuItem>
                  {plantDetails.map((plantDetail) => (
                    <MenuItem key={plantDetail.id} value={plantDetail.id}>
                      {plantDetail.plant_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <TextField
                label="Select WO Date*"
                value={
                  formData.woDate instanceof Date
                    ? formData.woDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("woDate", new Date(e.target.value))
                }
                fullWidth
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Select Billing Address*</InputLabel>
                <MuiSelect
                  label="Select Billing Address*"
                  value={formData.billingAddress}
                  onChange={(e) =>
                    handleInputChange("billingAddress", e.target.value)
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

              <TextField
                label="Retention(%)"
                placeholder="Retention"
                value={formData.retention}
                onChange={(e) => handleInputChange("retention", e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, max: 100 }}
                sx={fieldStyles}
              />

              <TextField
                label="TDS(%)"
                placeholder="TDS"
                value={formData.tds}
                onChange={(e) => handleInputChange("tds", e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, max: 100 }}
                sx={fieldStyles}
              />

              <TextField
                label="QC(%)"
                placeholder="QC"
                value={formData.qc}
                onChange={(e) => handleInputChange("qc", e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, max: 100 }}
                sx={fieldStyles}
              />

              <TextField
                label="Payment Tenure(In Days)"
                placeholder="Payment Tenure"
                value={formData.paymentTenure}
                onChange={(e) => handleInputChange("paymentTenure", e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0 }}
                sx={fieldStyles}
              />

              <TextField
                label="Advance Amount"
                placeholder="Advance Amount"
                value={formData.advanceAmount}
                onChange={(e) => handleInputChange("advanceAmount", e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0 }}
                sx={fieldStyles}
              />

              <TextField
                label="Related To*"
                placeholder="Related To"
                value={formData.relatedTo}
                onChange={(e) => handleInputChange("relatedTo", e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 1 }}
              />

              {showRadio && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    mt: 2,
                  }}
                >
                  <FormLabel
                    component="legend"
                    sx={{ minWidth: "80px", fontSize: "14px" }}
                  >
                    Apply WBS
                  </FormLabel>
                  <RadioGroup
                    row
                    value={wbsSelection}
                    onChange={(e) => setWbsSelection(e.target.value)}
                  >
                    <FormControlLabel
                      value="individual"
                      control={<Radio />}
                      label="Individual"
                    />
                    <FormControlLabel
                      value="overall"
                      control={<Radio />}
                      label="All Items"
                    />
                  </RadioGroup>
                </Box>
              )}

              {wbsSelection === "overall" && (
                <Autocomplete
                  options={wbsCodes}
                  getOptionLabel={(wbs) => wbs.wbs_code}
                  value={wbsCodes.find((wbs) => wbs.wbs_code === overallWbs) || null}
                  onChange={(event, newValue) => {
                    setOverallWbs(newValue ? newValue.wbs_code : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="WBS Code*"
                      variant="outlined"
                      sx={{
                        height: { xs: 28, sm: 36 },
                        "& .MuiInputBase-input, & .MuiSelect-select": {
                          padding: { xs: "8px", sm: "10px" },
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                      placeholder="Search WBS Code"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              )}
            </div>
          </div>
        </div>

        {/* Details Section Card */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">DETAILS</h2>
            </div>
          </div>

          <div className="p-6">
            {detailsForms.map((detailsData, index) => (
              <div
                key={detailsData.id}
                className={`${index > 0 ? "mt-8 pt-8 border-t border-gray-200" : ""}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-md font-medium text-foreground">
                    Item {index + 1}
                  </h3>
                  {detailsForms.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDetailsForm(detailsData.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Select Service*</InputLabel>
                    <MuiSelect
                      label="Select Service*"
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
                      handleDetailsChange(
                        detailsData.id,
                        "productDescription",
                        e.target.value
                      )
                    }
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="Quantity/Area*"
                    value={detailsData.quantityArea}
                    onChange={(e) =>
                      handleDetailsChange(
                        detailsData.id,
                        "quantityArea",
                        e.target.value
                      )
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="UOM"
                    value={detailsData.uom}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "uom", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="Expected Date*"
                    value={
                      detailsData.expectedDate instanceof Date
                        ? detailsData.expectedDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleDetailsChange(
                        detailsData.id,
                        "expectedDate",
                        new Date(e.target.value)
                      )
                    }
                    fullWidth
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="Rate*"
                    value={detailsData.rate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "rate", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="CGST Rate"
                    value={detailsData.cgstRate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "cgstRate", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="CGST Amt"
                    value={detailsData.cgstAmt}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: { xs: "8px", sm: "10px", md: "12px" },
                        backgroundColor: "#f5f5f5",
                      },
                      height: { xs: 28, sm: 36, md: 45 },
                    }}
                  />

                  <TextField
                    label="SGST Rate"
                    value={detailsData.sgstRate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "sgstRate", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="SGST Amt"
                    value={detailsData.sgstAmt}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: { xs: "8px", sm: "10px", md: "12px" },
                        backgroundColor: "#f5f5f5",
                      },
                      height: { xs: 28, sm: 36, md: 45 },
                    }}
                  />

                  <TextField
                    label="IGST Rate"
                    value={detailsData.igstRate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "igstRate", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="IGST Amt"
                    value={detailsData.igstAmt}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: { xs: "8px", sm: "10px", md: "12px" },
                        backgroundColor: "#f5f5f5",
                      },
                      height: { xs: 28, sm: 36, md: 45 },
                    }}
                  />

                  <TextField
                    label="TCS Rate"
                    value={detailsData.tcsRate}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "tcsRate", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />

                  <TextField
                    label="TCS Amt"
                    value={detailsData.tcsAmt}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: { xs: "8px", sm: "10px", md: "12px" },
                        backgroundColor: "#f5f5f5",
                      },
                      height: { xs: 28, sm: 36, md: 45 },
                    }}
                  />

                  <TextField
                    label="Tax Amount"
                    value={detailsData.taxAmount}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: { xs: "8px", sm: "10px", md: "12px" },
                        backgroundColor: "#f5f5f5",
                      },
                      height: { xs: 28, sm: 36, md: 45 },
                    }}
                  />

                  <TextField
                    label="Amount"
                    value={detailsData.amount}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: { xs: "8px", sm: "10px", md: "12px" },
                        backgroundColor: "#f5f5f5",
                      },
                      height: { xs: 28, sm: 36, md: 45 },
                    }}
                  />

                  <TextField
                    label="Total Amount"
                    value={detailsData.totalAmount}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: { xs: "8px", sm: "10px", md: "12px" },
                        backgroundColor: "#f5f5f5",
                      },
                      height: { xs: 28, sm: 36, md: 45 },
                    }}
                  />

                  {wbsSelection === "individual" && (
                    <Autocomplete
                      options={wbsCodes}
                      getOptionLabel={(wbs) => wbs.wbs_code}
                      value={wbsCodes.find((wbs) => wbs.wbs_code === detailsData.wbsCode) || null}
                      onChange={(event, newValue) => {
                        handleDetailsChange(detailsData.id, "wbsCode", newValue ? newValue.wbs_code : "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="WBS Code*"
                          variant="outlined"
                          sx={{
                            height: { xs: 28, sm: 36 },
                            "& .MuiInputBase-input, & .MuiSelect-select": {
                              padding: { xs: "8px", sm: "10px" },
                            },
                          }}
                          InputLabelProps={{ shrink: true }}
                          placeholder="Search WBS Code"
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2"
                onClick={addNewDetailsForm}
              >
                Add Items
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end mt-4">
          <Button className="bg-[#C72030] hover:bg-[#C72030] text-white">
            Total Amount: {grandTotal}
          </Button>
        </div>

        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">DETAILS</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                label="Kind Attention"
                placeholder="Kind Attention"
                fullWidth
                variant="outlined"
                onChange={(e) => handleInputChange("kindAttention", e.target.value)}
                InputLabelProps={{ shrink: true }}
                value={formData.kindAttention}
                sx={fieldStyles}
              />

              <TextField
                label="Subject"
                placeholder="Subject"
                fullWidth
                variant="outlined"
                onChange={(e) => handleInputChange("subject", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
                value={formData.subject}
              />

              <TextField
                label="Description"
                placeholder="Enter description here..."
                fullWidth
                variant="outlined"
                onChange={(e) => handleInputChange("description", e.target.value)}
                multiline
                rows={6}
                InputLabelProps={{ shrink: true }}
                value={formData.description}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Terms & Conditions"
                placeholder="Enter terms and conditions here..."
                fullWidth
                variant="outlined"
                onChange={(e) =>
                  handleInputChange("termsConditions", e.target.value)
                }
                multiline
                rows={6}
                InputLabelProps={{ shrink: true }}
                value={formData.termsConditions}
                sx={{ mt: 1 }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">ATTACHMENTS</h2>
            </div>
          </div>

          <div className="p-6">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors">
                <span className="text-gray-600">
                  Drag & Drop or{" "}
                  <span className="text-red-500 underline">Choose files</span>{" "}
                  {attachedFiles.length === 0
                    ? "No file chosen"
                    : `${attachedFiles.length} file(s) selected`}
                </span>
              </div>
            </label>

            {attachedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-foreground mb-4">
                  Selected Files:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 z-10 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-500 text-xs text-center p-2">
                            {file.name}
                          </span>
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate" title={file.name}>
                          {file.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
            disabled={submitting}
          >
            Save Work Order
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="px-8">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};