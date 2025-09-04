import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  ListChecks,
  Paperclip,
  Upload,
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

const fieldStyles = {
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
};

export const AddPODashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const cloneId = searchParams.get("clone");

  const shouldFetch = Boolean(cloneId);

  const [materialPR, setMaterialPR] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [plantDetails, setPlantDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [units, setUnits] = useState([]);
  const [submitting, setSubmitting] = useState(false);

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
        const response = await dispatch(
          getMaterialPR({ baseUrl, token })
        ).unwrap();
        setMaterialPR(response.purchase_orders);
      } catch (error) {
        console.log(error);
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
        toast.error(error);
      }
    };

    const fetchInventories = async () => {
      try {
        const response = await dispatch(
          getInventories({ baseUrl, token })
        ).unwrap();
        setInventories(response.inventories);
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };

    const fetchUnits = async () => {
      try {
        const response = await dispatch(getUnits({ baseUrl, token })).unwrap();
        setUnits(response.units);
        setSuppliers(response.pms_suppliers);
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };

    fetchMaterialPR();
    fetchPlantDetails();
    fetchAddresses();
    fetchInventories();
    fetchUnits();
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      const cloneData = async () => {
        try {
          const response = await dispatch(
            getMaterialPRById({ baseUrl, token, id: cloneId })
          ).unwrap();
          setFormData({
            materialPR: "",
            supplier: response.pms_supplier_id || "",
            plantDetail: response.plant_detail?.id || "",
            poDate: response.po_date || "",
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
              quantity: item.quantity || "",
              unit: item.unit || "",
              expectedDate: item.expected_date || "",
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
              totalAmount: item.total_value || "",
            }))
          );
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      };

      cloneData();
    }
  }, [shouldFetch]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await dispatch(
        createPurchaseOrder({ baseUrl, token, data: payload })
      ).unwrap();
      toast.success("Purchase Order created successfully");
      navigate("/finance/po");
    } catch (error) {
      console.log(error);
      toast.error(error);
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

      // update formData with supplier
      setFormData({
        ...formData,
        materialPR: materialPRId,
        supplier: response.supplier?.id,
      });

      // map all items from pms_po_inventories
      const newItems =
        response.pms_po_inventories?.map((inv: any, index: number) => ({
          id: index + 1,
          itemDetails: inv?.inventory?.id || "",
          sacHsnCode: "",
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

      // optionally call onInventoryChange for each
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

  const onInventoryChange = async (inventoryId, itemId) => {
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
      toast.error(error);
    }
  };

  const removeItem = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-6">NEW PURCHASE ORDER</h1>

      <form onSubmit={handleSubmit}>
        <div className="">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
                  <FileText className="text-white w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold text-[#C72030]">
                  SUPPLIER DETAILS
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Select Material PR*</InputLabel>
                  <MuiSelect
                    label="Select Material PR*"
                    value={formData.materialPR}
                    onChange={handleMaterialPRChange}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select...</em>
                    </MenuItem>
                    {materialPR.map((materialPR) => (
                      <MenuItem value={materialPR.id}>{materialPR.id}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Supplier*</InputLabel>
                  <MuiSelect
                    label="Supplier*"
                    value={formData.supplier}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier: e.target.value,
                      })
                    }
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select...</em>
                    </MenuItem>
                    {suppliers.map((supplier) => (
                      <MenuItem value={supplier.id}>{supplier.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Plant Detail*</InputLabel>
                  <MuiSelect
                    label="Plant Detail*"
                    value={formData.plantDetail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plantDetail: e.target.value,
                      })
                    }
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select...</em>
                    </MenuItem>
                    {plantDetails.map((plantDetail) => (
                      <MenuItem value={plantDetail.id}>
                        {plantDetail.plant_name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <TextField
                  label="PO Date*"
                  type="date"
                  value={formData.poDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      poDate: e.target.value,
                    })
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Billing Address*</InputLabel>
                  <MuiSelect
                    label="Billing Address*"
                    value={formData.billingAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billingAddress: e.target.value,
                      })
                    }
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select...</em>
                    </MenuItem>
                    {addresses.map((address) => (
                      <MenuItem value={address.id}>{address.title}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Delivery Address*</InputLabel>
                  <MuiSelect
                    label="Delivery Address*"
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryAddress: e.target.value,
                      })
                    }
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select...</em>
                    </MenuItem>
                    {addresses.map((address) => (
                      <MenuItem value={address.id}>{address.title}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <TextField
                  label="Related To"
                  value={formData.relatedTo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      relatedTo: e.target.value,
                    })
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Retention(%)"
                  value={formData.retention}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      retention: e.target.value,
                    })
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="TDS(%)"
                  value={formData.tds}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tds: e.target.value,
                    })
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="QC(%)"
                  value={formData.qc}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qc: e.target.value,
                    })
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Payment Tenure(In Days)"
                  value={formData.paymentTenure}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentTenure: e.target.value,
                    })
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Advance Amount"
                  value={formData.advanceAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      advanceAmount: e.target.value,
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
                  label="Terms & Conditions"
                  value={formData.termsConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      termsConditions: e.target.value,
                    })
                  }
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  placeholder="Enter..."
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 1 }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
                    <ListChecks className="text-white w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#C72030]">
                    ITEM DETAILS
                  </h2>
                </div>

                <Button
                  type="button"
                  onClick={addItem}
                  className="bg-[#C72030] hover:bg-[#A01020] text-white mb-4"
                >
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-700">
                        Item {index + 1}
                      </h3>
                      {items.length > 1 && (
                        <Button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:bg-red-100"
                        >
                          <X />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel shrink>Item Details</InputLabel>
                        <MuiSelect
                          label="Item Details"
                          value={item.itemDetails}
                          onChange={(e) =>
                            updateItem(item.id, "itemDetails", e.target.value)
                          }
                          displayEmpty
                          sx={fieldStyles}
                        >
                          <MenuItem value="">
                            <em>Select...</em>
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
                        onChange={(e) =>
                          updateItem(item.id, "sacHsnCode", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, "quantity", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel shrink>Select Unit</InputLabel>
                        <MuiSelect
                          label="Select Unit"
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(item.id, "unit", e.target.value)
                          }
                          displayEmpty
                          sx={fieldStyles}
                        >
                          <MenuItem value="">
                            <em>Select...</em>
                          </MenuItem>
                          {units.map((unit) => (
                            <MenuItem key={unit[0]} value={unit[0]}>
                              {unit[0]}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>

                      <TextField
                        label="Expected Date"
                        type="date"
                        value={item.expectedDate}
                        onChange={(e) =>
                          updateItem(item.id, "expectedDate", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="Rate"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(item.id, "rate", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="CGST Rate"
                        value={item.cgstRate}
                        onChange={(e) =>
                          updateItem(item.id, "cgstRate", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="CGST Amt"
                        value={item.cgstAmount}
                        fullWidth
                        disabled
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="SGST Rate"
                        value={item.sgstRate}
                        onChange={(e) =>
                          updateItem(item.id, "sgstRate", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="SGST Amount"
                        value={item.sgstAmount}
                        fullWidth
                        disabled
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="IGST Rate"
                        value={item.igstRate}
                        onChange={(e) =>
                          updateItem(item.id, "igstRate", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="IGST Amount"
                        value={item.igstAmount}
                        fullWidth
                        disabled
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="TCS Rate"
                        value={item.tcsRate}
                        onChange={(e) =>
                          updateItem(item.id, "tcsRate", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="TCS Amount"
                        value={item.tcsAmount}
                        fullWidth
                        disabled
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="Tax Amount"
                        value={item.taxAmount}
                        fullWidth
                        disabled
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="Amount"
                        value={item.amount}
                        fullWidth
                        disabled
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="Total Amount"
                        value={item.totalAmount}
                        fullWidth
                        disabled
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  ATTACHMENTS
                </h2>
              </div>

              <div
                className="border-2 border-dashed border-yellow-400 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Drag & Drop or Click to Upload{" "}
                  <span className="text-gray-500">
                    {formData.attachments.length > 0
                      ? `${formData.attachments.length} file(s) selected`
                      : "No files chosen"}
                  </span>
                </p>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>

              {formData.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Selected Files
                  </h3>
                  <div className="grid grid-cols-6 gap-4">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-2 flex flex-col items-center relative"
                      >
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-32 h-32 object-cover rounded-lg mb-2"
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-2">
                            <Paperclip className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <p className="text-sm text-gray-600 truncate w-full text-center">
                          {file.name}
                        </p>
                        <Button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            size="lg"
            disabled={submitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
