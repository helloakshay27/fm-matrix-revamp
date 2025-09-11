import TextField from "@mui/material/TextField";
import RuleAlert from "@/components/RuleAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
    editExpiryRule,
    fetchWalletRule,
} from "@/store/slices/pointExpirySlice";
import { toast } from "sonner";

const EditCRMWalletPointExpiry = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [buttonClick, setButtonClick] = useState("");
    const [ruleData, setRuleData] = useState({});
    const [showRuleCreateAlert, setShowRuleCreateAlert] = useState(false);
    const [formData, setFormData] = useState({
        rule_name: "",
        complementary_condition: "",
        purchase_condition: "",
    });

    const fetchRule = async () => {
        try {
            const response = await dispatch(
                fetchWalletRule({ baseUrl, token })
            ).unwrap();
            setFormData({
                rule_name: response.wallet_rule?.rule_name,
                complementary_condition:
                    response.wallet_rule?.complementary_rule_condition,
                purchase_condition: response.wallet_rule?.purchase_rule_condition,
            });
            setRuleData(response?.wallet_rule);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRule();
    }, []);

    const handleSubmit = async () => {
        try {
            await dispatch(
                editExpiryRule({ baseUrl, token, ruleData, formData })
            ).unwrap();
            toast.success("Wallet rule updated successfully");
            navigate("/crm/point-expiry");
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    const handleCancel = () => {
        navigate("/crm/point-expiry");
    };

    return (
        <div className="p-[30px] min-h-screen bg-transparent">
            <Card className="mb-6" style={{ border: "1px solid #D9D9D9" }}>
                <CardHeader
                    className="bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                        <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                            R
                        </span>
                        RULE EDIT
                    </CardTitle>
                </CardHeader>
                <CardContent
                    className="px-[50px] py-[25px] bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <TextField
                        fullWidth
                        label="Rule Name"
                        value={formData.rule_name}
                        onChange={(e) =>
                            setFormData({ ...formData, rule_name: e.target.value })
                        }
                        variant="outlined"
                        defaultValue="New Rule"
                        margin="normal"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "#F6F7F7 !important",
                            },
                            "& .MuiInputLabel-root": {
                                background: "#F6F7F7 !important",
                            },
                        }}
                    />
                    <div className="flex items-center justify-between gap-4">
                        <TextField
                            fullWidth
                            value={formData.complementary_condition}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    complementary_condition: e.target.value,
                                })
                            }
                            select
                            label="Customer Complimentary Point Destruction"
                            variant="outlined"
                            defaultValue="Weekly"
                            margin="normal"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    background: "#F6F7F7 !important",
                                },
                                "& .MuiInputLabel-root": {
                                    background: "#F6F7F7 !important",
                                },
                            }}
                        >
                            <MenuItem value="" disabled>
                                Select
                            </MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            select
                            value={formData.purchase_condition}
                            onChange={(e) =>
                                setFormData({ ...formData, purchase_condition: e.target.value })
                            }
                            label="Customer Purchase Point Destruction"
                            variant="outlined"
                            defaultValue="Monthly"
                            margin="normal"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    background: "#F6F7F7 !important",
                                },
                                "& .MuiInputLabel-root": {
                                    background: "#F6F7F7 !important",
                                },
                            }}
                        >
                            <MenuItem value="" disabled>
                                Select
                            </MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </TextField>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-3">
                <Button
                    onClick={() => {
                        setShowRuleCreateAlert(true);
                        setButtonClick("submit");
                    }}
                    style={{ backgroundColor: "#C72030" }}
                    className="text-white hover:bg-[#C72030]/90"
                >
                    Update Rule
                </Button>
                <Button
                    onClick={() => {
                        setShowRuleCreateAlert(true);
                        setButtonClick("cancel");
                    }}
                    variant="outline"
                    className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                >
                    Cancel
                </Button>
            </div>

            {buttonClick === "submit" ? (
                <RuleAlert
                    open={showRuleCreateAlert}
                    onClose={() => setShowRuleCreateAlert(false)}
                    handleUpdate={handleSubmit}
                />
            ) : (
                <RuleAlert
                    open={showRuleCreateAlert}
                    onClose={() => setShowRuleCreateAlert(false)}
                    handleCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default EditCRMWalletPointExpiry;
