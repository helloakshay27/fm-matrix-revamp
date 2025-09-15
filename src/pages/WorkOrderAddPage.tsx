import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, File, FileSpreadsheet, FileText, Settings, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAddresses,
  getPlantDetails,
  getSuppliers,
} from "@/store/slices/materialPRSlice";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { createServicePR, getServices } from "@/store/slices/servicePRSlice";
import { getWorkOrderById } from "@/store/slices/workOrderSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";

interface Attachment {
  id: number;
  url: string;
  document_name: string;
  document_file_name: string;
}

export const WorkOrderAddPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const cloneId = searchParams.get("clone");

  const shouldFetch = Boolean(cloneId);

  const [suppliers, setSuppliers] = useState([]);
  const [plantDetails, setPlantDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [services, setServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Attachment | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    },
  ]);

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

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
          const response = await dispatch(
            getWorkOrderById({ baseUrl, token, id: cloneId })
          ).unwrap();

          const data = response.page

          setFormData({
            contractor: data.pms_supplier_id,
            plantDetail: data.work_order?.plant_detail_id,
            woDate: data.work_order?.wo_date,
            billingAddress: data.work_order?.billing_address_id,
            retention: data.work_order?.payment_terms?.retention,
            tds: data.work_order?.payment_terms?.tds,
            qc: data.work_order?.payment_terms?.quality_holding,
            paymentTenure: data.work_order?.payment_terms?.payment_tenure,
            advanceAmount: data.work_order.advance_amount,
            relatedTo: data.work_order?.related_to,
            kindAttention: data.work_order?.kind_attention,
            subject: data.work_order.subject,
            description: data.work_order.description,
            termsConditions: data.work_order.term_condition,
          });

          setDetailsForms(
            data.inventories.map((item, index) => ({
              id: index + 1,
              service: item.pms_service_id,
              productDescription: item.product_description,
              quantityArea: item.quantity,
              uom: item.uom,
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
              amount: item.total_amount,
              totalAmount: item.total_value,
            })))
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      };

      cloneData();
    }
  }, [shouldFetch]);

  const handleInputChange = (field: string, value: string | Date) => {
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

    // Calculate total amount
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

  const handleDashedBorderClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleDetailsChange = (
    id: number,
    field: string,
    value: string | Date
  ) => {
    setDetailsForms((prev) =>
      prev.map((form) =>
        form.id === id
          ? calculateItem({ ...form, [field]: value })
          : form
      )
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
    };
    setDetailsForms((prev) => [...prev, newForm]);
  };

  const removeDetailsForm = (id: number) => {
    if (detailsForms.length > 1) {
      setDetailsForms((prev) => prev.filter((form) => form.id !== id));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setAttachedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const grandTotal = detailsForms
    .reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0)
    .toFixed(2);

  const validateForm = () => {
    if (!formData.contractor) {
      toast.error("Please select a contractor");
      return false;
    } else if (!formData.woDate) {
      toast.error("Please select a work order date");
      return false;
    } else if (!formData.billingAddress) {
      toast.error("Please select a billing address");
      return false;
    }
    for (const item of detailsForms) {
      if (!item.service) {
        toast.error("Please select a service");
        return false;
      } else if (!item.productDescription) {
        toast.error("Please enter a product description");
        return false;
      } else if (!item.expectedDate) {
        toast.error("Please enter an expected date");
        return false;
      } else if (!item.rate) {
        toast.error("Please enter a rate");
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const payload = {
      pms_work_order: {
        letter_of_indent: false,
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
        })),
      },
      attachments: attachedFiles,
    };

    try {
      setSubmitting(true);
      await dispatch(createServicePR({ data: payload, baseUrl, token })).unwrap();
      toast.success("Work Order created successfully");
      navigate('/finance/wo');
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Form Content */}
      <div className="p-6 mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className='p-0 mb-4'
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
              {/* First Row */}
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1,
                }}
              >
                <InputLabel shrink>Select Contractor*</InputLabel>
                <MuiSelect
                  label="Select Contractor*"
                  value={formData.contractor}
                  onChange={(e) =>
                    handleInputChange("contractor", e.target.value)
                  }
                  displayEmpty
                  sx={{
                    height: {
                      xs: 28,
                      sm: 36,
                      md: 45,
                    },
                    "& .MuiInputBase-input, & .MuiSelect-select": {
                      padding: {
                        xs: "8px",
                        sm: "10px",
                        md: "12px",
                      },
                    },
                  }}
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

              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1,
                }}
              >
                <InputLabel shrink>Plant Detail</InputLabel>
                <MuiSelect
                  label="Plant Detail"
                  value={formData.plantDetail}
                  onChange={(e) =>
                    handleInputChange("plantDetail", e.target.value)
                  }
                  displayEmpty
                  sx={{
                    height: {
                      xs: 28,
                      sm: 36,
                      md: 45,
                    },
                    "& .MuiInputBase-input, & .MuiSelect-select": {
                      padding: {
                        xs: "8px",
                        sm: "10px",
                        md: "12px",
                      },
                    },
                  }}
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
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  mt: 1,
                  "& .MuiInputBase-input": {
                    padding: {
                      xs: "8px",
                      sm: "10px",
                      md: "12px",
                    },
                  },
                  height: {
                    xs: 28,
                    sm: 36,
                    md: 45,
                  },
                }}
              />

              {/* Second Row */}
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1,
                }}
              >
                <InputLabel shrink>Select Billing Address*</InputLabel>
                <MuiSelect
                  label="Select Billing Address*"
                  value={formData.billingAddress}
                  onChange={(e) =>
                    handleInputChange("billingAddress", e.target.value)
                  }
                  displayEmpty
                  sx={{
                    height: {
                      xs: 28,
                      sm: 36,
                      md: 45,
                    },
                    "& .MuiInputBase-input, & .MuiSelect-select": {
                      padding: {
                        xs: "8px",
                        sm: "10px",
                        md: "12px",
                      },
                    },
                  }}
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
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                }}
                sx={{
                  mt: 1,
                  "& .MuiInputBase-input": {
                    padding: {
                      xs: "8px",
                      sm: "10px",
                      md: "12px",
                    },
                  },
                  height: {
                    xs: 28,
                    sm: 36,
                    md: 45,
                  },
                }}
              />

              <TextField
                label="TDS(%)"
                placeholder="TDS"
                value={formData.tds}
                onChange={(e) => handleInputChange("tds", e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                }}
                sx={{
                  mt: 1,
                  "& .MuiInputBase-input": {
                    padding: {
                      xs: "8px",
                      sm: "10px",
                      md: "12px",
                    },
                  },
                  height: {
                    xs: 28,
                    sm: 36,
                    md: 45,
                  },
                }}
              />

              {/* Third Row */}
              <TextField
                label="QC(%)"
                placeholder="QC"
                value={formData.qc}
                onChange={(e) => handleInputChange("qc", e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                }}
                sx={{
                  mt: 1,
                  "& .MuiInputBase-input": {
                    padding: {
                      xs: "8px",
                      sm: "10px",
                      md: "12px",
                    },
                  },
                  height: {
                    xs: 28,
                    sm: 36,
                    md: 45,
                  },
                }}
              />

              <TextField
                label="Payment Tenure(In Days)"
                placeholder="Payment Tenure"
                value={formData.paymentTenure}
                onChange={(e) =>
                  handleInputChange("paymentTenure", e.target.value)
                }
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: 0,
                }}
                sx={{
                  mt: 1,
                  "& .MuiInputBase-input": {
                    padding: {
                      xs: "8px",
                      sm: "10px",
                      md: "12px",
                    },
                  },
                  height: {
                    xs: 28,
                    sm: 36,
                    md: 45,
                  },
                }}
              />

              <TextField
                label="Advance Amount"
                placeholder="Advance Amount"
                value={formData.advanceAmount}
                onChange={(e) =>
                  handleInputChange("advanceAmount", e.target.value)
                }
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: 0,
                }}
                sx={{
                  mt: 1,
                  "& .MuiInputBase-input": {
                    padding: {
                      xs: "8px",
                      sm: "10px",
                      md: "12px",
                    },
                  },
                  height: {
                    xs: 28,
                    sm: 36,
                    md: 45,
                  },
                }}
              />

              {/* Full Width Field */}
              <div className="md:col-span-3">
                <TextField
                  label="Related To*"
                  placeholder="Related To"
                  value={formData.relatedTo}
                  onChange={(e) =>
                    handleInputChange("relatedTo", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
              </div>
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
                  {/* First Row */}
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{
                      mt: 1,
                    }}
                  >
                    <InputLabel shrink>Select Service*</InputLabel>
                    <MuiSelect
                      label="Select Service*"
                      value={detailsData.service}
                      onChange={(e) =>
                        handleDetailsChange(
                          detailsData.id,
                          "service",
                          e.target.value
                        )
                      }
                      displayEmpty
                      sx={{
                        height: {
                          xs: 28,
                          sm: 36,
                          md: 45,
                        },
                        "& .MuiInputBase-input, & .MuiSelect-select": {
                          padding: {
                            xs: "8px",
                            sm: "10px",
                            md: "12px",
                          },
                        },
                      }}
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  {/* Second Row */}
                  <TextField
                    label="UOM"
                    value={detailsData.uom}
                    onChange={(e) =>
                      handleDetailsChange(detailsData.id, "uom", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  <TextField
                    label="Rate*"
                    value={detailsData.rate}
                    onChange={(e) =>
                      handleDetailsChange(
                        detailsData.id,
                        "rate",
                        e.target.value
                      )
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  {/* Third Row */}
                  <TextField
                    label="CGST Rate"
                    value={detailsData.cgstRate}
                    onChange={(e) =>
                      handleDetailsChange(
                        detailsData.id,
                        "cgstRate",
                        e.target.value
                      )
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  <TextField
                    label="CGST Amt"
                    value={detailsData.cgstAmt}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                        backgroundColor: "#f5f5f5",
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  <TextField
                    label="SGST Rate"
                    value={detailsData.sgstRate}
                    onChange={(e) =>
                      handleDetailsChange(
                        detailsData.id,
                        "sgstRate",
                        e.target.value
                      )
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  {/* Fourth Row */}
                  <TextField
                    label="SGST Amt"
                    value={detailsData.sgstAmt}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                        backgroundColor: "#f5f5f5",
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  <TextField
                    label="IGST Rate"
                    value={detailsData.igstRate}
                    onChange={(e) =>
                      handleDetailsChange(
                        detailsData.id,
                        "igstRate",
                        e.target.value
                      )
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  <TextField
                    label="IGST Amt"
                    value={detailsData.igstAmt}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                        backgroundColor: "#f5f5f5",
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  {/* Fifth Row */}
                  <TextField
                    label="TCS Rate"
                    value={detailsData.tcsRate}
                    onChange={(e) =>
                      handleDetailsChange(
                        detailsData.id,
                        "tcsRate",
                        e.target.value
                      )
                    }
                    fullWidth
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  <TextField
                    label="TCS Amt"
                    value={detailsData.tcsAmt}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                        backgroundColor: "#f5f5f5",
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  <TextField
                    label="Tax Amount"
                    value={detailsData.taxAmount}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                        backgroundColor: "#f5f5f5",
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  {/* Sixth Row */}
                  <TextField
                    label="Amount"
                    value={detailsData.amount}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                        backgroundColor: "#f5f5f5",
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />

                  <TextField
                    label="Total Amount"
                    value={detailsData.totalAmount}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        padding: {
                          xs: "8px",
                          sm: "10px",
                          md: "12px",
                        },
                        backgroundColor: "#f5f5f5",
                      },
                      height: {
                        xs: 28,
                        sm: 36,
                        md: 45,
                      },
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Add Items Button inside details card */}
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

        {/* Total Amount Display - Outside the card */}
        <div className="flex items-center justify-end mt-4">
          <Button className="bg-[#C72030] hover:bg-[#C72030] text-white">
            Total Amount: {grandTotal}
          </Button>
        </div>

        {/* Details Section Card */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
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
              <div>
                <TextField
                  label="Kind Attention"
                  placeholder="Kind Attention"
                  fullWidth
                  variant="outlined"
                  onChange={(e) =>
                    handleInputChange("kindAttention", e.target.value)
                  }
                  value={formData.kindAttention}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    mt: 1,
                    "& .MuiInputBase-input": {
                      padding: {
                        xs: "8px",
                        sm: "10px",
                        md: "12px",
                      },
                    },
                    height: {
                      xs: 28,
                      sm: 36,
                      md: 45,
                    },
                  }}
                />
              </div>

              <div>
                <TextField
                  label="Subject"
                  placeholder="Subject"
                  fullWidth
                  value={formData.subject}
                  variant="outlined"
                  onChange={(e) =>
                    handleInputChange("subject", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    mt: 1,
                    "& .MuiInputBase-input": {
                      padding: {
                        xs: "8px",
                        sm: "10px",
                        md: "12px",
                      },
                    },
                    height: {
                      xs: 28,
                      sm: 36,
                      md: 45,
                    },
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <TextField
                  label="Description"
                  placeholder="Enter description here..."
                  fullWidth
                  value={formData.description}
                  variant="outlined"
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  multiline
                  rows={6}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      height: "auto !important",
                      padding: "2px !important",
                    },
                  }}
                />
              </div>

              <div>
                <TextField
                  label="Terms & Conditions"
                  placeholder="Enter terms and conditions here..."
                  fullWidth
                  value={formData.termsConditions}
                  variant="outlined"
                  onChange={(e) =>
                    handleInputChange("termsConditions", e.target.value)
                  }
                  multiline
                  rows={6}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      width: "100% !important",
                      height: "auto !important",
                      padding: "2px !important",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attachments Section Card */}
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
                  {attachedFiles.length > 0
                    ? `${attachedFiles.length} file(s) selected`
                    : "No files chosen"}
                </span>
              </div>
            </div>

            {attachedFiles.length > 0 && (
              <div className="flex items-center flex-wrap gap-4 my-6">
                {attachedFiles.map((file, index) => {
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

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
            disabled={submitting}
          >
            Save Work Order
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="px-8"
          >
            Cancel
          </Button>
        </div>
      </div>

      <AttachmentPreviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />
    </div>
  );
};