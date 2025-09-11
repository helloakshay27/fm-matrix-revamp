import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { StatsCard } from "@/components/StatsCard";
import TopupModal from "@/components/TopupModal";
import { Button } from "@/components/ui/button";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
    fetchCardCount,
    fetchTransactionHistory,
    fetchWalletList,
} from "@/store/slices/walletListSlice";
import axios from "axios";
import { format } from "date-fns";
import { Coins, Download, Eye, Plus, Star, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const columns: ColumnConfig[] = [
    { key: "entity_name", label: "Entity Name", sortable: true, draggable: true },
    {
        key: "current_balance",
        label: "Current Balance (Points)",
        sortable: true,
        draggable: true,
    },
    {
        key: "active_users",
        label: "Active Users",
        sortable: true,
        draggable: true,
    },
    {
        key: "last_transaction_value",
        label: "Last Transaction Value",
        sortable: true,
        draggable: true,
    },
    {
        key: "last_transaction_date",
        label: "Last Transaction Date",
        sortable: true,
        draggable: true,
    },
];

const transactionColumns: ColumnConfig[] = [
    {
        key: "id",
        label: "Transaction Id",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "company_name",
        label: "Company Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "user_name",
        label: "User Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "amount",
        label: "Transaction Value",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "remaining_amount",
        label: "Remaining Value",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "created_at",
        label: "Transaction Date & Time",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "transaction_type",
        label: "Transaction Type",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
];

const CRMWalletList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [showActionPanel, setShowActionPanel] = useState<boolean>(false);
    const [isTransactionHistoryVisible, setIsTransactionHistoryVisible] =
        useState(false);
    const [walletList, setWalletList] = useState([]);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [walletCardCount, setWalletCardCount] = useState({
        total_users: 0,
        total_amount: 0,
        paid_points: 0,
        complimentary_points: 0,
        expiry_points: 0,
    });

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await dispatch(
                    fetchCardCount({ baseUrl, token })
                ).unwrap();
                setWalletCardCount(response);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchWallets = async () => {
            try {
                const response = await dispatch(
                    fetchWalletList({ baseUrl, token })
                ).unwrap();
                setWalletList(response.wallets);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await dispatch(
                    fetchTransactionHistory({ baseUrl, token })
                ).unwrap();
                setTransactionHistory(response.transactions);
            } catch (error) {
                console.log(error);
            }
        };

        fetchWallets();
        fetchCount();
        fetchTransactions();
    }, []);

    const renderActions = (item: any) => (
        <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100"
            onClick={() => navigate(`/crm/wallet-list/${item.entity_id}`)}
        >
            <Eye className="w-4 h-4" />
        </Button>
    );

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "last_transaction_date":
                return item[columnKey] ? format(item[columnKey], "dd/MM/yyyy") : "-";
            default:
                return item[columnKey] || "-";
        }
    };

    const renderTransactionCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "created_at":
                return item[columnKey]
                    ? format(item[columnKey], "dd/MM/yyyy hh:mm a")
                    : "-";
            case "amount":
                if (!item[columnKey]) return "-";
                const isCredit = item.transaction_type?.toLowerCase() === "credit";
                return (
                    <span
                        className={`font-medium ${isCredit ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {isCredit ? `+${item[columnKey]}` : `-${item[columnKey]}`}
                    </span>
                );
            case "transaction_type":
                return item[columnKey]
                    ? item[columnKey].charAt(0).toUpperCase() + item[columnKey].slice(1)
                    : "-";
            default:
                return item[columnKey] || "-";
        }
    };

    const leftActions = (
        <>
            <Button
                onClick={() => setShowActionPanel(true)}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
            >
                <Plus className="w-4 h-4" />
                Action
            </Button>
            <Button
                onClick={() =>
                    setIsTransactionHistoryVisible(!isTransactionHistoryVisible)
                }
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
            >
                {isTransactionHistoryVisible ? "Wallet List" : "Transaction History"}
            </Button>
        </>
    );

    const handleOpenTopupDialog = () => {
        setShowTopupModal(true);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/admin_wallet_transactions.xlsx`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "transactions.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const selectedActions = [
        {
            label: "Topup Wallet",
            icon: Wallet,
            onClick: handleOpenTopupDialog,
        },
        {
            label: "Export",
            icon: Download,
            onClick: handleExport,
        },
    ];

    return (
        <div className="w-full p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-[#1a1a1a]">Wallet List</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <StatsCard
                    title="Total Wallet Users"
                    value={walletCardCount.total_users}
                    icon={<Users className="w-6 h-6" />}
                    className="cursor-pointer"
                />
                <StatsCard
                    title="Total Wallet Balance"
                    value={walletCardCount.total_amount}
                    icon={<Wallet className="w-6 h-6" />}
                    className="cursor-pointer"
                />
                <StatsCard
                    title="Paid Points"
                    value={walletCardCount.paid_points}
                    icon={<Coins className="w-6 h-6" />}
                    className="cursor-pointer"
                />
                <StatsCard
                    title="Complimentary Points"
                    value={walletCardCount.complimentary_points}
                    icon={<Star className="w-6 h-6" />}
                    className="cursor-pointer"
                />
                <StatsCard
                    title="Expired Points"
                    value={walletCardCount.expiry_points}
                    icon={<Users className="w-6 h-6" />}
                    className="cursor-pointer"
                />
            </div>

            {showActionPanel && (
                <SelectionPanel
                    actions={selectedActions}
                    onClearSelection={() => setShowActionPanel(false)}
                />
            )}

            {isTransactionHistoryVisible && (
                <EnhancedTable
                    data={transactionHistory}
                    columns={transactionColumns}
                    renderCell={renderTransactionCell}
                    storageKey="wallet-list-transactions-table"
                    searchPlaceholder="Search..."
                    hideTableExport={true}
                    leftActions={leftActions}
                    selectable={false}
                    pagination={true}
                    pageSize={10}
                />
            )}

            {!isTransactionHistoryVisible && (
                <EnhancedTable
                    data={walletList}
                    columns={columns}
                    renderActions={renderActions}
                    renderCell={renderCell}
                    storageKey="wallet-list-table"
                    searchPlaceholder="Search..."
                    hideTableExport={true}
                    leftActions={leftActions}
                    selectable={false}
                    pagination={true}
                    pageSize={10}
                />
            )}

            <TopupModal
                open={showTopupModal}
                onClose={() => setShowTopupModal(false)}
            />
        </div>
    );
};

export default CRMWalletList;