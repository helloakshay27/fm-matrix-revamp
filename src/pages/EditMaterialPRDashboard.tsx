import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, File, FileSpreadsheet, FileText, Upload, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changePlantDetails,
  fetchWBS,
  getAddresses,
  getInventories,
  getMaterialPRById,
  getPlantDetails,
  getSuppliers,
  updateMaterialPR,
} from "@/store/slices/materialPRSlice";
import { toast } from "sonner";
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

export const EditMaterialPRDashboard = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data } = useAppSelector((state) => state.changePlantDetails);

  const [suppliers, setSuppliers] = useState([]);
  const [plantDetails, setPlantDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [showRadio, setShowRadio] = useState(false);
  const [wbsSelection, setWbsSelection] = useState("");
  const [wbsCodes, setWbsCodes] = useState([]);
  const [overallWbs, setOverallWbs] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState([
    {
      id: 1,
      item_id: null,
      itemDetails: "",
      sacHsnCode: "",
      sacHsnCodeId: "",
      productDescription: "",
      each: "",
      quantity: "",
      expectedDate: "",
      amount: "",
      wbsCode: "",
      _destroy: 0,
    },
  ]);
  const [supplierDetails, setSupplierDetails] = useState({
    supplier: "",
    plantDetail: "",
    prDate: "",
    billingAddress: "",
    deliveryAddress: "",
    transportation: "",
    retention: "",
    tds: "",
    qc: "",
    paymentTenure: "",
    advanceAmount: "",
    relatedTo: "",
    termsConditions: "",
    wbsCode: "",
  });
  const [files, setFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Attachment | null>(null);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await dispatch(getMaterialPRById({ baseUrl, token, id: id })).unwrap();

        setWbsSelection("individual");

        setSupplierDetails({
          supplier: response.supplier?.id,
          plantDetail: response.plant_detail?.id,
          prDate: response.po_date ? response.po_date.split("T")[0] : "",
          billingAddress: response.billing_address_id,
          deliveryAddress: response.shipping_address_id,
          transportation: response.transportation,
          retention: response.retention,
          tds: response.tds,
          qc: response.quality_holding,
          paymentTenure: response.payment_tenure,
          advanceAmount: response.advance_amount,
          relatedTo: response.related_to,
          termsConditions: response.terms_conditions,
          wbsCode: "",
        });

        setItems(
          response.pms_po_inventories.map((item, index) => ({
            id: index + 1, // Unique local ID
            item_id: item.id,
            itemDetails: item.inventory?.id,
            sacHsnCodeId: item.hsn_id,
            sacHsnCode: item.sac_hsn_code,
            productDescription: item.prod_desc,
            each: item.rate,
            quantity: item.quantity,
            expectedDate: item.expected_date ? item.expected_date.split("T")[0] : "",
            amount: item.total_value,
            wbsCode: item.wbs_code,
          }))
        );

        setExistingAttachments(
          response.attachments?.map((attachment) => ({
            id: attachment.id,
            url: attachment.url,
            name: attachment.file_name || `Attachment-${attachment.id}`,
          })) || []
        );
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };

    getData();
  }, [id, dispatch, baseUrl, token]);

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

    const fetchInventories = async () => {
      try {
        const response = await dispatch(getInventories({ baseUrl, token })).unwrap();
        setInventories(response.inventories);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    fetchSuppliers();
    fetchPlantDetails();
    fetchAddresses();
    fetchInventories();
  }, [dispatch, baseUrl, token]);

  const handleSupplierChange = (e) => {
    const { name, value } = e.target;
    setSupplierDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlantDetailsChange = (e) => {
    const { name, value } = e.target;
    setSupplierDetails((prev) => ({ ...prev, [name]: value }));
    dispatch(changePlantDetails({ baseUrl, id: value, token }));
  };

  useEffect(() => {
    if (supplierDetails.plantDetail) {
      handlePlantDetailsChange({ target: { name: "plantDetail", value: supplierDetails.plantDetail } });
    }
  }, [supplierDetails.plantDetail, dispatch, baseUrl, token]);

  const handleItemChange = useCallback((id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, [field]: value };
        if (field === "each" || field === "quantity") {
          const rate = field === "each" ? parseFloat(value) || 0 : parseFloat(item.each) || 0;
          const quantity = field === "quantity" ? parseFloat(value) || 0 : parseFloat(item.quantity) || 0;
          updatedItem.amount = (rate * quantity).toFixed(2);
        }
        return updatedItem;
      })
    );
  }, []);

  const onInventoryChange = useCallback(async (inventoryId, itemId) => {
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
        prevItems.map((item) => {
          if (item.id !== itemId) return item;

          const newQuantity = parseFloat(item.quantity) || 0;
          const newRate = parseFloat(response.data.rate) || 0;
          const newAmount = (newRate * newQuantity).toFixed(2);

          return {
            ...item,
            sacHsnCode: response.data.hsn?.code || "",
            sacHsnCodeId: response.data.hsn?.id || "",
            each: response.data.rate || "",
            amount: newAmount,
          };
        })
      );
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }, [baseUrl, token]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index, type) => {
    if (type === "existing") {
      setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
      setAttachmentsToDelete((prev) => [...prev, existingAttachments[index].id]);
    } else {
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
  };

  const handleDashedBorderClick = () => {
    fileInputRef.current?.click();
  };

  const addItem = () => {
    const nextId = Math.max(...items.map(item => item.id || 0)) + 1;
    setItems([
      ...items,
      {
        id: nextId,
        item_id: null,
        itemDetails: "",
        sacHsnCode: "",
        sacHsnCodeId: "",
        productDescription: "",
        each: "",
        quantity: "",
        expectedDate: "",
        amount: "",
        wbsCode: "",
        _destroy: 0
      },
    ]);
  };

  const removeItem = (id) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, _destroy: 1 } : item
      )
    );
  };

  const calculateTotalAmount = () => {
    return items
      .reduce((total, item) => total + (parseFloat(item.amount) || 0), 0)
      .toFixed(2);
  };

  const validateForm = () => {
    if (!supplierDetails.supplier) {
      toast.error("Supplier is required");
      return false;
    }
    if (!supplierDetails.prDate) {
      toast.error("PR Date is required");
      return false;
    }
    if (!supplierDetails.billingAddress) {
      toast.error("Billing Address is required");
      return false;
    }
    if (!supplierDetails.deliveryAddress) {
      toast.error("Delivery Address is required");
      return false;
    }
    if (!supplierDetails.relatedTo) {
      toast.error("Related To is required");
      return false;
    }
    if (!supplierDetails.termsConditions) {
      toast.error("Terms & Conditions are required");
      return false;
    }

    for (const item of items) {
      if (!item.itemDetails) {
        toast.error("Item Details is required for all items");
        return false;
      }
      if (!item.productDescription) {
        toast.error("Product Description is required for all items");
        return false;
      }
      if (!item.quantity) {
        toast.error("Quantity is required for all items");
        return false;
      }
      if (!item.expectedDate) {
        toast.error("Expected Date is required for all items");
        return false;
      }
      if (!item.each) {
        toast.error("Rate is required for all items");
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
      pms_purchase_order: {
        pms_supplier_id: supplierDetails.supplier,
        plant_detail_id: supplierDetails.plantDetail,
        billing_address_id: supplierDetails.billingAddress,
        shipping_address_id: supplierDetails.deliveryAddress,
        po_date: supplierDetails.prDate,
        letter_of_indent: true,
        terms_conditions: supplierDetails.termsConditions,
        retention: supplierDetails.retention,
        tds: supplierDetails.tds,
        transportation: supplierDetails.transportation,
        quality_holding: supplierDetails.qc,
        payment_tenure: supplierDetails.paymentTenure,
        related_to: supplierDetails.relatedTo,
        advance_amount: supplierDetails.advanceAmount,
        ...(wbsSelection === "overall" && { wbs_code: overallWbs }),
        pms_po_inventories_attributes: items.map((item) => ({
          id: item.item_id,
          pms_inventory_id: item.itemDetails,
          quantity: item.quantity,
          rate: item.each,
          total_value: item.amount,
          expected_date: item.expectedDate,
          sac_hsn_code: item.sacHsnCodeId,
          prod_desc: item.productDescription,
          _destroy: item._destroy,
          ...(wbsSelection === "individual" && { wbs_code: item.wbsCode }),
        })),
      },
      attachments: files,
    };

    try {
      await dispatch(updateMaterialPR({ baseUrl, token, data: payload, id: Number(id) })).unwrap();
      toast.success("Material PR updated successfully");
      navigate("/finance/material-pr");
    } catch (error) {
      toast.error(error);
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
      <h1 className="text-2xl font-bold mb-6">EDIT MATERIAL PR</h1>
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
                <InputLabel shrink>Supplier*</InputLabel>
                <MuiSelect
                  label="Supplier*"
                  name="supplier"
                  value={supplierDetails.supplier}
                  onChange={handleSupplierChange}
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
                  name="plantDetail"
                  value={supplierDetails.plantDetail}
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
                label="PR Date*"
                type="date"
                name="prDate"
                value={supplierDetails.prDate}
                onChange={handleSupplierChange}
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
                  name="billingAddress"
                  value={supplierDetails.billingAddress}
                  onChange={handleSupplierChange}
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
                  name="deliveryAddress"
                  value={supplierDetails.deliveryAddress}
                  onChange={handleSupplierChange}
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
                label="Related To*"
                name="relatedTo"
                value={supplierDetails.relatedTo}
                onChange={handleSupplierChange}
                placeholder="Related To"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Transportation"
                name="transportation"
                value={supplierDetails.transportation}
                onChange={handleSupplierChange}
                placeholder="Enter Number"
                fullWidth
                type="number"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Retention(%)"
                name="retention"
                value={supplierDetails.retention}
                onChange={handleSupplierChange}
                placeholder="Enter Number"
                fullWidth
                type="number"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="TDS(%)"
                name="tds"
                type="number"
                value={supplierDetails.tds}
                onChange={handleSupplierChange}
                placeholder="Enter Number"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="QC(%)"
                name="qc"
                type="number"
                value={supplierDetails.qc}
                onChange={handleSupplierChange}
                placeholder="Enter number"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Payment Tenure(In Days)"
                name="paymentTenure"
                type="number"
                value={supplierDetails.paymentTenure}
                onChange={handleSupplierChange}
                placeholder="Enter Number"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Advance Amount"
                name="advanceAmount"
                type="number"
                value={supplierDetails.advanceAmount}
                onChange={handleSupplierChange}
                placeholder="Enter Number"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Terms & Conditions*"
                name="termsConditions"
                value={supplierDetails.termsConditions}
                onChange={handleSupplierChange}
                placeholder=""
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
              <CardTitle className="text-orange-600 flex items-center justify-between">
                <div className="flex items-center text-[#C72030]">
                  <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                    2
                  </h2>
                  ITEM DETAILS
                </div>
                <Button
                  onClick={addItem}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                  type="button"
                >
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items
                .filter(item => !item._destroy) // Only render items that are not marked for destruction
                .map((item) => (
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
                        onChange={(e) => {
                          handleItemChange(item.id, "itemDetails", e.target.value);
                          onInventoryChange(e.target.value, item.id);
                        }}
                        displayEmpty
                        sx={fieldStyles}
                      >
                        <MenuItem value="">
                          <em>Select Inventory</em>
                        </MenuItem>
                        {inventories.map((inventory) => (
                          <MenuItem key={inventory.id} value={inventory.id}>
                            {inventory.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    <TextField
                      label="SAC/HSN Code"
                      value={item.sacHsnCode}
                      onChange={(e) =>
                        handleItemChange(item.id, "sacHsnCode", e.target.value)
                      }
                      placeholder="Enter Code"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />

                    <TextField
                      label="Product Description*"
                      value={item.productDescription}
                      onChange={(e) =>
                        handleItemChange(item.id, "productDescription", e.target.value)
                      }
                      placeholder="Product Description"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />

                    <TextField
                      label="Expected Date*"
                      type="date"
                      value={item.expectedDate}
                      onChange={(e) =>
                        handleItemChange(item.id, "expectedDate", e.target.value)
                      }
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />

                    <TextField
                      label="Rate"
                      value={item.each}
                      onChange={(e) =>
                        handleItemChange(item.id, "each", e.target.value)
                      }
                      placeholder="Enter Number"
                      fullWidth
                      variant="outlined"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />

                    <TextField
                      label="Quantity*"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, "quantity", e.target.value)
                      }
                      placeholder="Enter Number"
                      fullWidth
                      variant="outlined"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />

                    <TextField
                      label="Amount*"
                      value={item.amount}
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
                          value={item.wbsCode}
                          onChange={(e) => handleItemChange(item.id, "wbsCode", e.target.value)}
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
                  />
                  <span className="ml-1">
                    {(files.length + existingAttachments.length) > 0
                      ? `${files.length + existingAttachments.length} file(s) selected`
                      : "No files chosen"}
                  </span>
                </div>
              </div>

              {(files.length > 0 || existingAttachments.length > 0) && (
                <div className="flex items-center flex-wrap gap-4 my-6">
                  {existingAttachments.map((attachment, index) => {
                    const isImage = attachment.url.match(/\.(jpeg|jpg|png)$/i);
                    const isPdf = attachment.url.match(/\.pdf$/i);
                    const isExcel = attachment.url.match(/\.(xls|xlsx)$/i);
                    const isWord = attachment.url.match(/\.(doc|docx)$/i);

                    return (
                      <div
                        key={`existing-${attachment.id}`}
                        className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                      >
                        {isImage ? (
                          <>
                            <button
                              className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                              title="View"
                              onClick={() => {
                                setSelectedDoc({
                                  id: attachment.id,
                                  url: attachment.url,
                                  document_name: attachment.name,
                                  document_file_name: attachment.name,
                                });
                                setIsModalOpen(true);
                              }}
                              type="button"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                              onClick={() => {
                                setSelectedDoc({
                                  id: attachment.id,
                                  url: attachment.url,
                                  document_name: attachment.name,
                                  document_file_name: attachment.name,
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
                          {attachment.name}
                        </span>
                        <button
                          className="absolute top-2 left-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                          title="Remove"
                          onClick={() => removeFile(index, "existing")}
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                  {files.map((file, index) => {
                    const isImage = file.type === "image/jpeg" || file.type === "image/png";
                    const isPdf = file.type === "application/pdf";
                    const isExcel = file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    const isWord = file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

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
                          onClick={() => removeFile(index, "new")}
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

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-[#C72030] hover:bg-[#C72030] text-white"
              disabled={submitting}
            >
              Submit
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