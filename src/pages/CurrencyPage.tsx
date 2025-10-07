import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addCurrency } from "@/store/slices/currencySlice";

const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
    { key: "name", label: "Name", sortable: true, draggable: true, defaultVisible: true },
    { key: "code", label: "Code", sortable: true, draggable: true, defaultVisible: true },
    { key: "symbol", label: "Symbol", sortable: true, draggable: true, defaultVisible: true },
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
    // No local dispatching; read-only via useSelector
    const baseUrl = localStorage.getItem('baseUrl')
    const token = localStorage.getItem('token')

    const { sites } = useAppSelector(state => state.site)
    const { data: currencyData } = useAppSelector(state => state.getCurrency)

    // Use globally-fetched currencies from Redux; avoid local API calls here
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        currency: "",
        symbol: "",
        sites: [],
    })

    const dispatch = useDispatch();

    // Use global currencyData from Redux; App-level fetch should have populated it

    const tableData = useMemo(() => {
        const arr = Array.isArray(currencyData) ? currencyData : [];
        return arr.map((item: any, idx: number) => ({
            id: item?.id ?? idx + 1,
            name: item?.name ?? item?.currency ?? "-",
            code: item?.code ?? item?.currency_code ?? "-",
            symbol: item?.symbol ?? "-",
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
                    pms_company_setup_id: localStorage.getItem('selectedCompanyId'),
                    currency: formData.currency,
                    symbol: formData.symbol,
                },
                pms_site_ids: formData.sites
            }

            

            // if (!baseUrl || !token) throw new Error("Missing auth context");
            // await axios.post(`https://${baseUrl}/currencies.json`, payload, {
            //     headers: { Authorization: `Bearer ${token}` },
            // });

            dispatch(addCurrency({ data: payload, baseUrl: baseUrl!, token: token! }) as any)

            toast.success("Currency added successfully")
            setIsOpen(false)
            setFormData({
                currency: "",
                symbol: "",
                sites: [],
            })
            // No local fetch; App-level effect owns refreshing global currency list if needed
        } catch (error) {
            console.log(error)
        }
    };

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => setIsOpen(true)}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    );

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            default:
                return item[columnKey] || "-";
        }
    };

    return (
        <div className="p-6">
            <EnhancedTable
                data={tableData}
                columns={columns}
                renderCell={renderCell}
                leftActions={leftActions}
                hideColumnsButton={true}
                hideTableSearch={true}
            />

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm" fullWidth>
                <DialogContent>
                    <div>
                        <h1 className="text-xl mb-6 mt-2 font-semibold">Add Currency</h1>
                    </div>

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

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CurrencyPage;
