import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Edit, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";
import { addCurrency, getCurrency, updateCurrency } from "@/store/slices/currencySlice";

const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
    { key: "name", label: "Name", sortable: true, draggable: true, defaultVisible: true },
    { key: "symbol", label: "Symbol", sortable: true, draggable: true, defaultVisible: true },
    { key: "createdBy", label: "Created By", sortable: true, draggable: true, defaultVisible: true },
];

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

interface FormData {
    currency: string;
    symbol: string;
    sites: number[];
}

const CurrencyPage = () => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const { sites } = useAppSelector((state) => state.site);
    const { data: currencyData } = useAppSelector((state) => state.getCurrency);

    const dispatch = useAppDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<any | null>(null);
    const [formData, setFormData] = useState<FormData>({
        currency: "",
        symbol: "",
        sites: [],
    });

    const tableData = useMemo(() => {
        const arr = Array.isArray(currencyData) ? currencyData : [];
        return arr.map((item: any, idx: number) => ({
            id: item?.id ?? idx + 1,
            name: item?.name ?? item?.currency ?? "-",
            symbol: item?.symbol ?? "-",
            createdBy: item?.created_by_name ?? "-",
            raw: item,
        }));
    }, [currencyData]);

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                currency: {
                    currency: formData.currency,
                    symbol: formData.symbol,
                },
            };

            if (editingCurrency) {
                await dispatch(
                    updateCurrency({
                        baseUrl,
                        token,
                        id: editingCurrency.id,
                        data: payload,
                    }) as any
                );
                toast.success("Currency updated successfully");
                await dispatch(getCurrency({ baseUrl, token, id: localStorage.getItem('selectedSiteId') }));
            } else {
                await dispatch(
                    addCurrency({ data: payload, baseUrl: baseUrl!, token: token! }) as any
                );
                toast.success("Currency added successfully");
                await dispatch(getCurrency({ baseUrl, token, id: localStorage.getItem('selectedSiteId') }));
            }

            setIsOpen(false);
            setFormData({ currency: "", symbol: "", sites: [] });
            setEditingCurrency(null);
        } catch (error) {
            console.log(error);
            toast.error("Failed to save currency");
        }
    };

    const handleEdit = (item: any) => {
        setEditingCurrency(item.raw);
        setFormData({
            currency: item.raw.currency || item.raw.name || "",
            symbol: item.raw.symbol || "",
            sites: item.raw.sites || [],
        });
        setIsOpen(true);
    };

    const leftActions = (
        <>
            {tableData?.length === 0 && (
                <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={() => setIsOpen(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
            )}
        </>
    );

    const renderCell = (item: any, columnKey: string) => item[columnKey] || "-";

    const renderActions = (item: any) => (
        <div className="flex gap-2">
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={() => handleEdit(item)}
            >
                <Edit className="w-4 h-4" />
            </Button>
        </div>
    );

    return (
        <div className="p-6">
            <EnhancedTable
                data={tableData}
                columns={columns}
                renderCell={renderCell}
                leftActions={leftActions}
                renderActions={renderActions}
                storageKey="currency-table-columns"
            />

            <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setEditingCurrency(null);
                    setFormData({ currency: "", symbol: "", sites: [] });
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogContent>
                    <h1 className="text-xl mb-6 mt-2 font-semibold">
                        {editingCurrency ? "Edit Currency" : "Add Currency"}
                    </h1>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <TextField
                            label="Currency Name*"
                            name="currency"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.currency}
                            onChange={(e) => handleChange("currency", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                            sx={{ mt: 1 }}
                        />

                        <TextField
                            label="Symbol*"
                            name="symbol"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.symbol}
                            onChange={(e) => handleChange("symbol", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                            sx={{ mt: 1 }}
                        />

                        {
                            !editingCurrency && (
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel id="select-sites-label">Select Sites*</InputLabel>
                                    <Select
                                        labelId="select-sites-label"
                                        multiple
                                        value={formData.sites}
                                        onChange={(e) => handleChange("sites", e.target.value)}
                                        renderValue={(selected) =>
                                            sites
                                                .filter((site) => selected.includes(site.id))
                                                .map((site) => site.name)
                                                .join(", ")
                                        }
                                        sx={fieldStyles}
                                    >
                                        {sites.map((site) => (
                                            <MenuItem key={site.id} value={site.id}>
                                                {site.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )
                        }

                        <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                        >
                            {editingCurrency ? "Update" : "Submit"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CurrencyPage;
