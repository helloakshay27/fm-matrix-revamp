import TextField from "@mui/material/TextField";
import RuleAlert from "@/components/RuleAlert";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
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
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-4 sm:space-y-6">
            <FormSection title="RULE EDIT" icon={Settings}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <TextField
                            fullWidth
                            label="Rule Name"
                            value={formData.rule_name}
                            onChange={(e) =>
                                setFormData({ ...formData, rule_name: e.target.value })
                            }
                            variant="outlined"
                            defaultValue="New Rule"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        />
                    </div>
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
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: assetFieldStyles }}
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
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: assetFieldStyles }}
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
            </FormSection>

            <FormActionBar
                onCancel={() => {
                    setShowRuleCreateAlert(true);
                    setButtonClick("cancel");
                }}
                onSubmit={() => {
                    setShowRuleCreateAlert(true);
                    setButtonClick("submit");
                }}
                submitLabel="Update Rule"
            />

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
