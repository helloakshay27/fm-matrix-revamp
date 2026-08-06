import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";
import { ArrowLeft, Plus, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

interface GDNInventoryItem {
  inventory: string;
  currentStock: string;
  quantity: string;
  companyStaffId: string;
  assetId: string;
  consumingIn: string;
  reason: string;
  comment: string;
}

interface InventoryOption {
  id: string;
  name: string;
  currentStock: string;
}

const INVENTORIES_ENDPOINT =
  "/pms/inventories/get_inventories_for_purchase_order.json";
const BRAND_RED = "#C72030";

const compactFieldSx = {
  mt: 1,
  "& .MuiInputBase-root": {
    minHeight: 38,
    borderRadius: "0px",
    fontSize: "13px",
    backgroundColor: "#fff",
  },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: "9px 10px",
    fontSize: "13px",
  },
  "& .MuiInputLabel-root": {
    fontSize: "14px",
    color: "#111827",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND_RED,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d6dce3",
    },
    "&:hover fieldset": {
      borderColor: "#b8c0cc",
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND_RED,
    },
  },
};

const multilineFieldSx = {
  mt: 1,
  "& .MuiInputBase-root": {
    minHeight: 58,
    borderRadius: "0px",
    fontSize: "13px",
    backgroundColor: "#fff",
    alignItems: "flex-start",
  },
  "& .MuiInputBase-input": {
    padding: "9px 10px",
    fontSize: "13px",
  },
  "& .MuiInputLabel-root": {
    fontSize: "14px",
    color: "#111827",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND_RED,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d6dce3",
    },
    "&:hover fieldset": {
      borderColor: "#b8c0cc",
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND_RED,
    },
  },
};

const basicDateFieldSx = {
  marginTop: "6px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  "& .MuiInputBase-root": {
    minHeight: 38,
    borderRadius: "0px",
    backgroundColor: "#fff",
    fontSize: "13px",
  },
  "& .MuiInputBase-input": {
    boxSizing: "border-box",
    padding: "9px 10px",
    fontSize: "13px",
  },
  "& .MuiInputLabel-root": {
    backgroundColor: "#fff",
    color: "#111827",
    fontSize: "13px",
    lineHeight: 1,
    px: "4px",
    top: "-8px",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND_RED,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d6dce3",
    },
    "&:hover fieldset": {
      borderColor: "#b8c0cc",
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND_RED,
      borderWidth: "1px",
    },
  },
};

const basicDescriptionFieldSx = {
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  "& .MuiInputBase-root": {
    minHeight: 80,
    borderRadius: "0px",
    backgroundColor: "#fff",
    alignItems: "flex-start",
    fontSize: "13px",
  },
  "& .MuiOutlinedInput-root": {
    padding: "0px",
    "& fieldset": {
      borderColor: "#d6dce3",
    },
    "&:hover fieldset": {
      borderColor: "#b8c0cc",
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND_RED,
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input": {
    boxSizing: "border-box",
    minHeight: "78px !important",
    overflow: "auto",
    padding: "9px 10px",
    fontSize: "13px",
    lineHeight: "20px",
    resize: "none",
  },
  "& .MuiInputLabel-root": {
    backgroundColor: "#fff",
    color: "#111827",
    fontSize: "13px",
    lineHeight: 1,
    px: "4px",
    top: "-8px",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND_RED,
  },
};

const inventoryMenuProps = {
  disablePortal: true,
  PaperProps: {
    sx: {
      mt: 0.5,
      maxHeight: 260,
      overflowX: "hidden",
      boxShadow: "0 8px 18px rgba(15, 23, 42, 0.16)",
      "& .MuiMenuItem-root": {
        minHeight: 34,
        whiteSpace: "normal",
        wordBreak: "break-word",
        fontSize: "13px",
      },
    },
  },
  MenuListProps: {
    dense: true,
  },
};

const requiredLabel = (label: string) => (
  <>
    {label}
    <span style={{ color: BRAND_RED }}>*</span>
  </>
);

const getInventoryName = (option: any) =>
  String(
    option?.name ??
      option?.inventory_name ??
      option?.label ??
      option?.title ??
      option?.material_name ??
      ""
  );

const getInventoryStock = (option: any) =>
  String(
    option?.current_stock ??
      option?.closing_stock ??
      option?.available_stock ??
      option?.stock ??
      option?.quantity ??
      ""
  );

const normalizeInventoryOptions = (items: any[]): InventoryOption[] =>
  items
    .map((item) => {
      if (Array.isArray(item)) {
        return {
          id: String(item[1] ?? item[0] ?? ""),
          name: String(item[0] ?? item[1] ?? ""),
          currentStock: String(item[2] ?? ""),
        };
      }

      return {
        id: String(item?.id ?? item?.value ?? item?.pms_inventory_id ?? ""),
        name: getInventoryName(item),
        currentStock: getInventoryStock(item),
      };
    })
    .filter((item) => item.id && item.name);

const emptyInventoryItem = (): GDNInventoryItem => ({
  inventory: "",
  currentStock: "",
  quantity: "",
  companyStaffId: "",
  assetId: "",
  consumingIn: "",
  reason: "",
  comment: "",
});

const getCurrentStockQuantity = (currentStock: string) => {
  const normalizedStock = currentStock.replace(/,/g, "");
  const stockMatch = normalizedStock.match(/-?\d+(?:\.\d+)?/);

  return stockMatch ? Number(stockMatch[0]) : NaN;
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C72030]">
      <Settings className="w-4 h-4 text-white" />
    </div>
    <h2 className="text-lg font-semibold uppercase tracking-normal text-[#C72030]">
      {title}
    </h2>
  </div>
);

export const AddGDNPage = () => {
  const navigate = useNavigate();
  const [gdnDate, setGdnDate] = useState("");
  const [description, setDescription] = useState("");
  const [inventoryOptions, setInventoryOptions] = useState<InventoryOption[]>(
    []
  );
  const [inventoryItems, setInventoryItems] = useState<GDNInventoryItem[]>([
    emptyInventoryItem(),
  ]);
  const [openInventoryIndex, setOpenInventoryIndex] = useState<number | null>(
    null
  );
  const [inventorySearch, setInventorySearch] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    const fetchInventoryOptions = async () => {
      try {
        const url = getFullUrl(INVENTORIES_ENDPOINT);
        const response = await fetch(url, {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch inventories (${response.status})`);
        }

        const result = await response.json();
        const source = Array.isArray(result.inventories)
          ? result.inventories
          : Array.isArray(result.data)
            ? result.data
            : [];
        setInventoryOptions(normalizeInventoryOptions(source));
      } catch (error) {
        console.error("Error fetching inventories:", error);
        toast.error("Failed to load inventories. Please try again.");
      }
    };

    fetchInventoryOptions();
  }, []);

  const addInventoryItem = () => {
    setInventoryItems((prev) => [...prev, emptyInventoryItem()]);
  };

  const removeInventoryItem = (index: number) => {
    setInventoryItems((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
    setOpenInventoryIndex(null);
  };

  const updateInventoryItem = (
    index: number,
    updates: Partial<GDNInventoryItem>
  ) => {
    setInventoryItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item
      )
    );
  };

  const handleInventorySelect = async (index: number, inventoryId: string) => {
    if (!inventoryId) {
      updateInventoryItem(index, {
        inventory: "",
        currentStock: "",
      });
      return;
    }

    updateInventoryItem(index, {
      inventory: inventoryId,
      currentStock: "Loading...",
    });

    try {
      const url = getFullUrl(`/pms/inventories/${inventoryId}/tax_categories`);
      const response = await fetch(url, {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch inventory details (${response.status})`
        );
      }

      const details = await response.json();
      const quantity = details?.quantity ?? details?.current_stock ?? "0";
      const unit = details?.unit ? ` ${details.unit}` : "";

      updateInventoryItem(index, {
        inventory: inventoryId,
        currentStock: `${quantity}${unit}`,
      });
    } catch (error) {
      console.error("Error fetching inventory details:", error);
      toast.error("Failed to load inventory stock.");
      updateInventoryItem(index, {
        currentStock: "Error",
      });
    }
  };

  const getFilteredInventoryOptions = (index: number) => {
    const query = (inventorySearch[index] || "").trim().toLowerCase();

    if (!query) {
      return inventoryOptions;
    }

    return inventoryOptions.filter(
      (inventory) =>
        inventory.name.toLowerCase().includes(query) ||
        inventory.id.toLowerCase().includes(query)
    );
  };

  const handleSubmit = async () => {
    const hasMissingInventory = inventoryItems.some(
      (item) => !item.inventory || !item.quantity
      // !item.assetId ||
      // !item.consumingIn.trim() ||
      // !item.reason.trim()
    );

    if (!gdnDate || !description.trim() || hasMissingInventory) {
      toast.error("Please fill all required GDN details.");
      return;
    }

    const hasInvalidNumbers = inventoryItems.some(
      (item) => {
        const quantity = Number(item.quantity);
        return !Number.isFinite(quantity) || quantity <= 0;
      }
      // Number(item.assetId) <= 0
    );

    if (hasInvalidNumbers) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    const hasUnavailableStock = inventoryItems.some(
      (item) => !Number.isFinite(getCurrentStockQuantity(item.currentStock))
    );

    if (hasUnavailableStock) {
      toast.error("Please wait for current stock to load before submitting.");
      return;
    }

    const stockExceededIndex = inventoryItems.findIndex(
      (item) =>
        Number(item.quantity) > getCurrentStockQuantity(item.currentStock)
    );

    if (stockExceededIndex !== -1) {
      toast.error("Quantity cannot be more than current stock");
      return;
    }

    try {
      const url = getFullUrl("/pms/srns/srn_create.json");
      const inventoryAttributes = inventoryItems.reduce<
        Record<
          string,
          {
            pms_inventory_id: number;
            // company_staff_id: number;
            quantity: number;
            // pms_asset_id: number;
            gdn_status: string;
            reason: string;
            // consuming_in: string;
            // reason: string;
          }
        >
      >((attributes, item, index) => {
        attributes[String(index)] = {
          pms_inventory_id: Number(item.inventory),
          // company_staff_id: Number(item.companyStaffId),
          quantity: Number(item.quantity),
          // pms_asset_id: Number(item.assetId),
          gdn_status: "Pending",
          reason: item.comment.trim(),
          // consuming_in: item.consumingIn.trim(),
          // reason: item.reason.trim(),
        };

        return attributes;
      }, {});

      const payload = {
        pms_srn: {
          s_date: gdnDate,
          comment: description.trim(),
          pms_srn_inventories2_attributes: inventoryAttributes,
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.message ||
            errorData?.error ||
            `Failed to submit GDN request (${response.status})`
        );
      }

      toast.success("GDN request submitted successfully.");
      navigate("/finance/gdn/request-list");
    } catch (error: any) {
      console.error("Error submitting GDN request:", error);
      toast.error(
        error.message || "Failed to submit GDN request. Please try again."
      );
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-4 text-sm text-gray-600">
        GDN Generation &gt; GDN Request Add
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/finance/gdn/request-list")}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">ADD GDN</h1>
      </div>

      <div className="space-y-4">
        <section className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
          <SectionHeader title="Basic Details" />

          <div className="border border-gray-200 rounded-md shadow-sm p-3 md:ml-2 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pr-0 md:pr-9">
              <TextField
                label={requiredLabel("GDN Date")}
                type="date"
                value={gdnDate}
                onChange={(event) => setGdnDate(event.target.value)}
                placeholder="Enter Date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={compactFieldSx}
              />

              <TextField
                label={requiredLabel("Description")}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={compactFieldSx}
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
          <SectionHeader title="Inventory Details" />

          <div className="border border-gray-200 rounded-md shadow-sm p-3 md:ml-2 max-w-5xl">
            <div className="space-y-4">
              {inventoryItems.map((item, index) => (
                <div
                  key={index}
                  className="relative border border-gray-100 rounded-md p-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start pr-0 md:pr-9">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={compactFieldSx}
                    >
                      <InputLabel shrink>
                        {requiredLabel("Inventory")}
                      </InputLabel>
                      <MuiSelect
                        label={requiredLabel("Inventory")}
                        value={item.inventory}
                        open={openInventoryIndex === index}
                        onOpen={() => {
                          setInventorySearch((prev) => ({
                            ...prev,
                            [index]: "",
                          }));
                          setOpenInventoryIndex(index);
                        }}
                        onClose={() => setOpenInventoryIndex(null)}
                        onChange={(event) => {
                          const inventoryId = String(event.target.value);
                          setOpenInventoryIndex(null);
                          setInventorySearch((prev) => ({
                            ...prev,
                            [index]: "",
                          }));
                          handleInventorySelect(index, inventoryId);
                        }}
                        displayEmpty
                        MenuProps={inventoryMenuProps}
                        renderValue={(selected) => {
                          const selectedId = String(selected || "");
                          const selectedInventory = inventoryOptions.find(
                            (inventory) => inventory.id === selectedId
                          );

                          if (!selectedInventory) {
                            return (
                              <span className="text-gray-400">
                                Select Inventory
                              </span>
                            );
                          }

                          return selectedInventory.name;
                        }}
                      >
                        <ListSubheader
                          disableSticky
                          sx={{
                            px: 1,
                            py: 1,
                            bgcolor: "white",
                          }}
                        >
                          <TextField
                            value={inventorySearch[index] || ""}
                            onChange={(event) =>
                              setInventorySearch((prev) => ({
                                ...prev,
                                [index]: event.target.value,
                              }))
                            }
                            onClick={(event) => event.stopPropagation()}
                            onMouseDown={(event) => event.stopPropagation()}
                            onKeyDown={(event) => {
                              if (event.key === "Escape") {
                                setOpenInventoryIndex(null);
                              }

                              event.stopPropagation();
                            }}
                            placeholder="Type to search..."
                            size="small"
                            fullWidth
                            autoFocus={openInventoryIndex === index}
                            sx={{
                              "& .MuiInputBase-root": {
                                height: 36,
                                borderRadius: "4px",
                                fontSize: "13px",
                              },
                              "& .MuiInputBase-input": {
                                py: 0.75,
                              },
                            }}
                          />
                        </ListSubheader>
                        {getFilteredInventoryOptions(index).length ? (
                          getFilteredInventoryOptions(index).map(
                            (inventory) => (
                              <MenuItem key={inventory.id} value={inventory.id}>
                                {inventory.name}
                              </MenuItem>
                            )
                          )
                        ) : (
                          <MenuItem value="" disabled>
                            No inventories found
                          </MenuItem>
                        )}
                      </MuiSelect>
                    </FormControl>

                    <TextField
                      label="Current Stock"
                      value={item.currentStock}
                      placeholder="Current Stock"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true }}
                      sx={{
                        ...compactFieldSx,
                        "& .MuiInputBase-root": {
                          minHeight: 38,
                          borderRadius: "0px",
                          fontSize: "13px",
                          backgroundColor: "#f7f7f7",
                        },
                      }}
                    />

                    <TextField
                      label={requiredLabel("Quantity")}
                      type="number"
                      value={item.quantity}
                      onChange={(event) =>
                        updateInventoryItem(index, {
                          quantity: event.target.value,
                        })
                      }
                      placeholder="Quantity"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={compactFieldSx}
                    />

                    <TextField
                      label="Comment"
                      value={item.comment}
                      onChange={(event) =>
                        updateInventoryItem(index, {
                          comment: event.target.value,
                        })
                      }
                      placeholder="Enter Comment"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={compactFieldSx}
                    />

                    {/* <TextField
                      label={requiredLabel("Company Staff ID")}
                      type="number"
                      value={item.companyStaffId}
                      onChange={(event) =>
                        updateInventoryItem(index, {
                          companyStaffId: event.target.value,
                        })
                      }
                      placeholder="Company Staff ID"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={compactFieldSx}
                    /> */}

                    {/*
                    <TextField
                      label={requiredLabel("Asset ID")}
                      type="number"
                      value={item.assetId}
                      onChange={(event) =>
                        updateInventoryItem(index, {
                          assetId: event.target.value,
                        })
                      }
                      placeholder="Asset ID"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={compactFieldSx}
                    />

                    <TextField
                      label={requiredLabel("Consuming In")}
                      value={item.consumingIn}
                      onChange={(event) =>
                        updateInventoryItem(index, {
                          consumingIn: event.target.value,
                        })
                      }
                      placeholder="Consuming In"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={compactFieldSx}
                    />

                    <TextField
                      label={requiredLabel("Reason")}
                      value={item.reason}
                      onChange={(event) =>
                        updateInventoryItem(index, {
                          reason: event.target.value,
                        })
                      }
                      placeholder="Reason"
                      fullWidth
                      multiline
                      minRows={2}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={multilineFieldSx}
                      className="lg:col-span-2"
                    />
                    */}
                  </div>

                  <div className="absolute right-2 top-4">
                    {inventoryItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInventoryItem(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addInventoryItem}
              className="mt-5 gap-2 !bg-[#DA7756] hover:!bg-[#C45F40]"
            >
              <Plus className="w-4 h-4 !text-white" />
              <span className="!text-white font-medium">Add Inventory</span>
            </Button>
          </div>
        </section>
      </div>

      <div className="flex justify-center pt-14">
        <Button
          type="button"
          onClick={handleSubmit}
          className="px-6 !bg-[#DA7756] hover:!bg-[#C45F40]"
        >
          <span className="!text-white font-medium">Submit</span>
        </Button>
      </div>
    </div>
  );
};
