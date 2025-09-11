import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import RuleAlert from "@/components/RuleAlert";
import RuleCreateForm from "@/components/RuleCreateForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
    createRule,
    fetchCustomers,
    fetchRecurringRules,
    fetchWalletDetails,
    fetchWalletDetailsTransactionHistory,
} from "@/store/slices/walletListSlice";
import { Switch } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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
        label: "Facility Name",
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
    {
        key: "transaction_points",
        label: "Transaction Points",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "date",
        label: "Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "transaction_id",
        label: "Transaction Id (CCAVENUE)",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
];

const CRMWalletDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [customerNames, setCustomerNames] = useState([]);
    const [showRuleCreateAlert, setShowRuleCreateAlert] = useState(false);
    const [showNewRuleForm, setShowNewRuleForm] = useState(false);
    const [recurringRules, setRecurringRules] = useState([]);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [ruleFormData, setRuleFormData] = useState({
        points: "",
        transaction_note: "",
    });
    const [walletDetails, setWalletDetails] = useState({
        entity_id: "",
        entity_name: "",
        customer_code: "",
        mobile: "",
        email: "",
        wallet_id: "",
        wallet_access: "",
        total_wallet_balance: "",
        current_balance: "",
        complementary_points: "",
        wallet_updated_date_and_time: "",
        wallet_created_date_and_time: "",
        wallet_complementary_points_expiry_date: "",
        top_up_by: "",
        wallet_rule_status: "",
    });

    const fetchData = async () => {
        try {
            const response = await dispatch(
                fetchWalletDetails({ baseUrl, token, id: Number(id) })
            ).unwrap();
            setWalletDetails(response);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchRules = async () => {
        try {
            const response = await dispatch(
                fetchRecurringRules({ baseUrl, token, id: Number(id) })
            ).unwrap();
            setRecurringRules(response.recurring_rules);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCustomersData = async () => {
        try {
            const response = await dispatch(
                fetchCustomers({
                    baseUrl,
                    token,
                    id: Number(localStorage.getItem("selectedSiteId")),
                })
            ).unwrap();
            setCustomerNames(response.entities);
        } catch (error) {
            console.log(error);
        }
    };

    const getTransactionHistory = async () => {
        try {
            const response = await dispatch(
                fetchWalletDetailsTransactionHistory({ baseUrl, token, id: Number(id) })
            ).unwrap();
            setTransactionHistory(response.transactions);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchRules();
        fetchCustomersData();
        getTransactionHistory();
    }, []);

    const changeRuleStatus = async (id, status) => {
        try {
            await axios.put(
                `https://${baseUrl}/update_wallet_recurring_rule.json?recurring_rule_id=${id}&active=${!status}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newStatus = !status;
            let updatedRules = recurringRules.map((rule) =>
                rule.id === id ? { ...rule, active: newStatus } : rule
            );

            if (newStatus) {
                updatedRules = updatedRules.map((rule) =>
                    rule.id !== id ? { ...rule, active: false } : rule
                );
            }

            setRecurringRules(updatedRules);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreateRule = async () => {
        if (!ruleFormData.points) {
            toast.error("Please enter a value for Credit Points.");
            return;
        }
        const payload = {
            recurring_rule: {
                points: ruleFormData.points,
                transaction_note: ruleFormData.transaction_note,
            },
        };
        try {
            await dispatch(
                createRule({ baseUrl, token, data: payload, id: Number(id) })
            ).unwrap();
            toast.success("Rule created successfully");
            setShowNewRuleForm(false);
            setRuleFormData({
                points: "",
                transaction_note: "",
            });
            fetchRules();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-[30px] min-h-screen bg-transparent">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <Button
                    className="bg-[#C72030] hover:bg-[#C72030] text-white cursor-not-allowed"
                    type="button"
                >
                    Available Balance: {walletDetails.total_wallet_balance}
                </Button>
            </div>
            <Card className="mb-6">
                <CardHeader
                    className="bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                        <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                            C
                        </span>
                        CUSTOMER DETAILS
                    </CardTitle>
                </CardHeader>
                <CardContent
                    className="px-[70px] py-[31px] bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Customer ID
                                </span>
                                <span className="font-medium text-16">
                                    {" "}
                                    {walletDetails.entity_id}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Customer Name
                                </span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    {walletDetails.entity_name}
                                </span>
                            </div>

                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Customer Code
                                </span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    {walletDetails.customer_code || "-"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Mobile No.
                                </span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    {" "}
                                    {walletDetails.mobile}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Email ID</span>
                                <span className="font-medium text-16">
                                    {" "}
                                    {walletDetails.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader
                    className="bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                        <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                            W
                        </span>
                        WALLET DETAILS
                    </CardTitle>
                </CardHeader>
                <CardContent
                    className="px-[70px] py-[31px] bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Wallet ID</span>
                                <span className="font-medium text-16">
                                    {" "}
                                    {walletDetails.wallet_id}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Wallet Access
                                </span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    {walletDetails.wallet_access}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Total Wallet Balance
                                </span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    {walletDetails.total_wallet_balance}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Remaining Wallet Points
                                </span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    {walletDetails.current_balance}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Complimentary Points
                                </span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    {walletDetails.complementary_points}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Updated Date & Time
                                </span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    {" "}
                                    {walletDetails.wallet_updated_date_and_time
                                        ? format(
                                            walletDetails.wallet_updated_date_and_time,
                                            "dd-MM-yyyy hh:mm a"
                                        )
                                        : ""}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Created Date & Time
                                </span>
                                <span className="font-medium text-16">
                                    {" "}
                                    {walletDetails.wallet_created_date_and_time
                                        ? format(
                                            walletDetails.wallet_created_date_and_time,
                                            "dd-MM-yyyy hh:mm a"
                                        )
                                        : ""}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Expired On
                                </span>
                                <span className="font-medium text-16">
                                    {" "}
                                    {walletDetails.wallet_complementary_points_expiry_date}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Top-Up By</span>
                                <span className="font-medium text-16">
                                    {" "}
                                    {walletDetails.top_up_by}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">
                                    Rule Status
                                </span>
                                <span className="font-medium text-16">
                                    {" "}
                                    {walletDetails.wallet_rule_status ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader
                    className="bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                            <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                                R
                            </span>
                            RECURRING RULE STATUS
                        </CardTitle>

                        <Button
                            onClick={() => setShowRuleCreateAlert(true)}
                            variant="outline"
                            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                        >
                            + Add
                        </Button>
                    </div>
                </CardHeader>
                <CardContent
                    className="px-[70px] bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    {recurringRules.length > 0 ? (
                        recurringRules.map((rule, index) => (
                            <Fragment key={rule.id}>
                                {rule.active ? (
                                    <div className="px-1 flex items-center gap-3 my-4">
                                        Inactive
                                        <Switch
                                            checked={rule.active}
                                            onChange={() => changeRuleStatus(rule.id, rule.active)}
                                            color="success"
                                        />
                                        Active
                                    </div>
                                ) : (
                                    <div className="flex items-center ms-1 my-3">
                                        Rule Status : Inactive
                                    </div>
                                )}

                                <div className="flex items-center gap-5 px-1">
                                    <div>
                                        Start Date : {format(rule.start_date, "dd/MM/yyyy")}
                                    </div>
                                    <div>Created By : {rule.user_name}</div>
                                    <div>
                                        Points :{" "}
                                        {rule.points && rule.points.toLocaleString("en-IN")}
                                    </div>
                                </div>

                                <div className="px-1 mt-2">
                                    <div>Transaction Note : {rule.transaction_note}</div>
                                </div>

                                {index < recurringRules.length - 1 &&
                                    recurringRules.length > 1 && <hr className="mt-2" />}
                            </Fragment>
                        ))
                    ) : (
                        <div className="flex items-center justify-center pt-6 text-muted-foreground">
                            No rules found
                        </div>
                    )}
                </CardContent>
            </Card>

            <EnhancedTable
                data={transactionHistory}
                columns={transactionColumns}
                storageKey="wallet-details-transactions"
                hideTableSearch={true}
                hideTableExport={true}
                hideColumnsButton={true}
                pagination={true}
                pageSize={5}
            />

            <RuleAlert
                open={showRuleCreateAlert}
                onClose={() => setShowRuleCreateAlert(false)}
                setShowNewRuleForm={setShowNewRuleForm}
            />

            <RuleCreateForm
                id={id}
                customerNames={customerNames}
                ruleFormData={ruleFormData}
                setRuleFormData={setRuleFormData}
                open={showNewRuleForm}
                onClose={() => setShowNewRuleForm(false)}
                handleSubmit={handleCreateRule}
            />
        </div>
    );
};

export default CRMWalletDetails;