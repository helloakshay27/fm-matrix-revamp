import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { FormSection, FormActionBar, assetFieldStyles } from '@/components/common/FormSection';
import { DetailCard } from '@/components/ui/detail-card';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createExpiryRule, fetchLogs, fetchWalletRule } from '@/store/slices/pointExpirySlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Pen, History, Settings } from 'lucide-react';
import RuleAlert from '@/components/RuleAlert';
import { useNavigate } from 'react-router-dom';
import { LogEntry, LogsTimeline } from '@/components/LogTimeline';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

const formattedLogs = (logs) => {
    return logs.map((log, index) => {
        return {
            id: index,
            description: log.text,
            timestamp: log.date + " " + log.time
        }
    })
}

const CRMWalletPointExpiry = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { shouldShow } = useDynamicPermissions();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [showRuleCreateAlert, setShowRuleCreateAlert] = useState(false);
    const [addAllowed, setAddAllowed] = useState(true);
    const [ruleID, setRuleID] = useState()
    const [logs, setLogs] = useState<LogEntry[]>([
        {
            id: "1",
            description: "",
            timestamp: ""
        }
    ])
    const [formData, setFormData] = useState({
        rule_name: "",
        complementary_condition: "",
        purchase_condition: "",
    });

    const fetchRule = async () => {
        try {
            const response = await dispatch(fetchWalletRule({ baseUrl, token })).unwrap();
            setFormData({
                rule_name: response.wallet_rule?.rule_name,
                complementary_condition:
                    response.wallet_rule?.complementary_rule_condition,
                purchase_condition:
                    response.wallet_rule?.purchase_rule_condition,
            });
            setRuleID(response?.wallet_rule?.id)
            setAddAllowed(false);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchRule();
    }, [])

    useEffect(() => {
        const getLogs = async () => {
            if (!ruleID) {
                return
            }
            try {
                const response = await dispatch(fetchLogs({ baseUrl, token, id: ruleID })).unwrap();
                setLogs(formattedLogs(response.logs))
            } catch (error) {
                toast.error("Failed to fetch logs");
            }
        }

        getLogs()
    }, [ruleID])

    const handleSubmit = async () => {
        if (!formData.rule_name) {
            toast.error("Rule name is required");
            return
        }

        const payload = {
            rule_name: formData.rule_name,
            complementary_condition: formData.complementary_condition,
            purchase_condition: formData.purchase_condition,
        }

        try {
            await dispatch(createExpiryRule({ baseUrl, token, data: payload })).unwrap();
            toast.success("Rule Created Successfully");
            setShowRuleCreateAlert(false);
            fetchRule()
        } catch (error) {
            toast.error("Failed to create wallet rule");
            console.log(error)
        }
    }

    const resetForm = () => {
        setFormData({
            rule_name: "",
            complementary_condition: "",
            purchase_condition: "",
        })
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-4 sm:space-y-6">
            <FormSection
                title="RULE SETUP"
                icon={Settings}
                headerActions={
                    !addAllowed && shouldShow("Wallet", "update") ? (
                        <Button
                            variant="ghost"
                            className="fm-button-fix fm-button-brand px-4 py-2 rounded-lg shadow-sm"
                            onClick={() => navigate('/crm/point-expiry/edit')}
                        >
                            <Pen size={15} /> Edit
                        </Button>
                    ) : undefined
                }
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <TextField
                            fullWidth
                            label="Rule Name"
                            value={formData.rule_name}
                            onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                            variant="outlined"
                            defaultValue="New Rule"
                            disabled={!addAllowed}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        />
                    </div>
                    <TextField
                        fullWidth
                        value={formData.complementary_condition}
                        onChange={(e) => setFormData({ ...formData, complementary_condition: e.target.value })}
                        select
                        label="Customer Complimentary Point Destruction"
                        variant="outlined"
                        defaultValue="Weekly"
                        disabled={!addAllowed}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: assetFieldStyles }}
                    >
                            <MenuItem value="" disabled>Select</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        select
                        value={formData.purchase_condition}
                        onChange={(e) => setFormData({ ...formData, purchase_condition: e.target.value })}
                        label="Customer Purchase Point Destruction"
                        variant="outlined"
                        defaultValue="Monthly"
                        disabled={!addAllowed}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: assetFieldStyles }}
                    >
                            <MenuItem value="" disabled>Select</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                    </TextField>
                </div>
            </FormSection>

            {
                addAllowed && (
                    shouldShow("Wallet", "create") ? (
                        <FormActionBar
                            onCancel={resetForm}
                            onSubmit={() => setShowRuleCreateAlert(true)}
                            submitLabel="Create Rule"
                        />
                    ) : (
                        <div className="fm-action-bar pt-4 sm:pt-6">
                            <button type="button" onClick={resetForm} className="fm-action-secondary min-w-[120px]">
                                Cancel
                            </button>
                        </div>
                    )
                )
            }

            {!addAllowed &&
                <DetailCard title="Logs" icon={<History className="w-[18px] h-[18px] text-gray-500" />} className="mb-6">
                    <div className="relative">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-glow opacity-30" />

                        {/* Content */}
                        <div className="relative z-10">
                            <LogsTimeline logs={logs} title="Activity Logs" />
                        </div>
                    </div>
                </DetailCard>
            }

            <RuleAlert
                open={showRuleCreateAlert}
                onClose={() => setShowRuleCreateAlert(false)}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default CRMWalletPointExpiry;
