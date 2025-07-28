import { AddCurrencyModal } from "@/components/AddCurrencyModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { useAppDispatch } from "@/store/hooks";
import { addCurrency, getCurrency } from "@/store/slices/currencySlice";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Currency {
    name: string;
    value: string;
}

const CurrencyDashboard = () => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    const [showActionPanel, setShowActionPanel] = useState(false);
    const [openModal, setOpenModal] = useState(false)
    const [currencyData, setCurrencyData] = useState([])

    const fetchCurrency = async () => {
        try {
            const response = await dispatch(getCurrency({ baseUrl, token })).unwrap();
            setCurrencyData(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCurrency();
    }, [])

    const handleSubmit = async (currencyData: Currency) => {
        const payload = {
            system_constant: {
                name: currencyData.name,
                value: currencyData.value,
                description: "Currency"
            }
        }
        try {
            await dispatch(addCurrency({ data: payload, baseUrl, token })).unwrap();
            toast.success('Currency added successfully');
            fetchCurrency();
        } catch (error) {
            console.log(error)
        }
    };

    const renderCell = (item: Currency, columnKey: string) => {
        switch (columnKey) {
            case 'name':
                return item.name || '';
            case 'value':
                return item.value || '';
            default:
                return item[columnKey as keyof Currency]?.toString() || '';
        }
    };

    const leftActions = (
        <Button
            onClick={() => setShowActionPanel(true)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
        >
            <Plus className="w-4 h-4" />
            Action
        </Button>
    );

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            draggable: true,
        },
        {
            key: 'value',
            label: 'Value',
            sortable: false,
            draggable: true,
        },
    ];

    return (
        <div className="p-[30px]">
            {showActionPanel && (
                <SelectionPanel
                    // actions={selectionActions}
                    onAdd={() => setOpenModal(true)}
                    onClearSelection={() => setShowActionPanel(false)}
                />
            )}
            <EnhancedTable
                data={currencyData}
                columns={columns}
                renderCell={renderCell}
                storageKey="fnb-restaurant-table"
                className="min-w-full"
                emptyMessage="No restaurants available"
                leftActions={leftActions}
                enableSearch={true}
                enableSelection={false}
                hideTableExport={true}
                pagination={true}
                pageSize={10}
            />

            <AddCurrencyModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleSubmit}
            />
        </div>
    )
}

export default CurrencyDashboard