import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  Autocomplete,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changePlantDetails,
  createMaterialPR,
  fetchWBS,
  getAddresses,
  getInventories,
  getPlantDetails,
  getSuppliers,
} from "@/store/slices/materialPRSlice";
import { toast } from "sonner";
import axios from "axios";

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

export const AddMaterialPRDashboard = () => {
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
  const [items, setItems] = useState([
    {
      id: 1,
      itemDetails: "",
      sacHsnCode: "",
      productDescription: "",
      each: "",
      quantity: "",
      expectedDate: "",
      amount: "",
      wbsCode: "",
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
          console.log(error)
          toast.error(error)
        }
      }

      fetchData()
    }
  }, [showRadio])

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

    const fetchInventories = async () => {
      try {
        const response = await dispatch(
          getInventories({ baseUrl, token })
        ).unwrap();
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
  }, []);

  const handleSupplierChange = (e) => {
    const { name, value } = e.target;
    setSupplierDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlantDetailsChange = (e) => {
    const { name, value } = e.target;
    setSupplierDetails((prev) => ({ ...prev, [name]: value }));
    dispatch(changePlantDetails({ baseUrl, id: value, token }));
  };

  const handleItemChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "each" || field === "quantity") {
            const rate = field === "each" ? parseFloat(value) || 0 : parseFloat(item.each) || 0;
            const quantity = field === "quantity" ? parseFloat(value) || 0 : parseFloat(item.quantity) || 0;
            updatedItem.amount = (rate * quantity).toFixed(2);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDashedBorderClick = () => {
    fileInputRef.current?.click();
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        itemDetails: "",
        sacHsnCode: "",
        productDescription: "",
        each: "",
        quantity: "",
        expectedDate: "",
        amount: "",
        wbsCode: "",
      },
    ]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
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
            ? {
              ...item,
              sacHsnCode: response.data.hsn?.id || "",
              each: response.data.rate || "",
              amount: ((parseFloat(response.data.rate) || 0) * (parseFloat(item.quantity) || 0)).toFixed(2),
            }
            : item
        )
      );
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const calculateTotalAmount = () => {
    return items
      .reduce((total, item) => total + (parseFloat(item.amount) || 0), 0)
      .toFixed(2);
  };

  const validateForm = () => {
    // Supplier Details Validation
    if (!supplierDetails.supplier) {
      toast.error("Supplier is required");
      return false;
    }
    if (!supplierDetails.plantDetail) {
      toast.error("Plant Detail is required");
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

    // Item Details Validation
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
      return
    }
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
          pms_inventory_id: item.itemDetails,
          quantity: item.quantity,
          rate: item.each,
          total_value: item.amount,
          expected_date: item.expectedDate,
          hsn_code_name: item.sacHsnCode,
          prod_desc: item.productDescription,
          ...(wbsSelection === "individual" && { wbs_code: overallWbs }),
        }))
      },
      attachments: files,
    };

    try {
      await dispatch(
        createMaterialPR({ baseUrl, token, data: payload })
      ).unwrap();
      toast.success("Material PR created successfully");
      navigate("/finance/material-pr");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="p-6 mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/finance/material-pr")}
        className='p-0'
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-6">NEW MATERIAL PR</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Supplier Details */}
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
                <InputLabel shrink>Plant Detail*</InputLabel>
                <MuiSelect
                  label="Plant Detail*"
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
                label="Transportation"
                name="transportation"
                value={supplierDetails.transportation}
                onChange={handleSupplierChange}
                placeholder="Enter Number"
                fullWidth
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
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="TDS(%)"
                name="tds"
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
                label="Terms & Conditions*"
                name="termsConditions"
                value={supplierDetails.termsConditions}
                onChange={handleSupplierChange}
                placeholder=""
                fullWidth
                variant="outlined"
                multiline
                minRows={4}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 1 }}
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
                <Autocomplete
                  options={wbsCodes}
                  getOptionLabel={(wbs) => wbs.wbs_code}
                  value={wbsCodes.find((wbs) => wbs.id === overallWbs) || null}
                  onChange={(event, newValue) => {
                    setOverallWbs(newValue ? newValue.id : "");
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
              {items.map((item) => (
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
                    label="Rate"
                    value={item.each}
                    onChange={(e) =>
                      handleItemChange(item.id, "each", e.target.value)
                    }
                    placeholder="Enter Number"
                    fullWidth
                    variant="outlined"
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
                    <Autocomplete
                      options={wbsCodes}
                      getOptionLabel={(wbs) => wbs.wbs_code}
                      value={wbsCodes.find((wbs) => wbs.id === item.wbsCode) || null}
                      onChange={(event, newValue) => {
                        setOverallWbs(newValue ? newValue.id : "");
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
              ))}
            </CardContent>
          </Card>

          <div className="flex items-center justify-end">
            <Button className="bg-[#C72030] hover:bg-[#C72030] text-white">
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
                  <span className="font-medium">
                    Drag & Drop or Click to Upload
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    ref={fileInputRef}
                  />
                  <span className="ml-1">
                    {files.length > 0
                      ? `${files.length} image(s) selected`
                      : "No images chosen"}
                  </span>
                </div>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-10 gap-4 my-6">
                  {files.map((file, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        onClick={() => removeFile(index)}
                        size="sm"
                        className="absolute -top-2 -right-2 p-1 h-7 w-7 rounded-full bg-red-500 hover:bg-red-600"
                      >
                        <X className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-[#C72030] hover:bg-[#C72030] text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};