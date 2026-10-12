import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="p-[30px] min-h-screen bg-[#F6F4EE]">
            <Card className="mb-6 rounded-2xl border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-3">
                    <div className='flex items-center justify-between'>
                        <CardTitle className="flex items-center gap-3 text-sm font-semibold uppercase text-[#1A1A1A]">
                            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gray-100 text-gray-500 shrink-0"><Settings className="w-[18px] h-[18px]" /></span>
                            RULE SETUP
                        </CardTitle>

                        {
                            !addAllowed && shouldShow("Wallet", "update") && (
                                <Button
                                    variant="ghost"
                                    className="fm-button-fix fm-button-brand px-4 py-2 rounded-lg shadow-sm"
                                    onClick={() => navigate('/crm/point-expiry/edit')}
                                >
                                    <Pen size={15} /> Edit
                                </Button>
                            )
                        }
                    </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                    <TextField
                        fullWidth
                        label="Rule Name"
                        value={formData.rule_name}
                        onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                        variant="outlined"
                        defaultValue="New Rule"
                        margin="normal"
                        disabled={!addAllowed}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                    background: '#ffffff !important',
                            },
                            '& .MuiInputLabel-root': {
                                    background: '#ffffff !important',
                            },
                        }}
                    />
                    <div className="flex items-center justify-between gap-4">
                        <TextField
                            fullWidth
                            value={formData.complementary_condition}
                            onChange={(e) => setFormData({ ...formData, complementary_condition: e.target.value })}
                            select
                            label="Customer Complimentary Point Destruction"
                            variant="outlined"
                            defaultValue="Weekly"
                            margin="normal"
                            disabled={!addAllowed}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    background: '#ffffff !important',
                                },
                                '& .MuiInputLabel-root': {
                                    background: '#ffffff !important',
                                },
                            }}
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
                            margin="normal"
                            disabled={!addAllowed}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    background: '#ffffff !important',
                                },
                                '& .MuiInputLabel-root': {
                                    background: '#ffffff !important',
                                },
                            }}
                        >
                            <MenuItem value="" disabled>Select</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </TextField>
                    </div>
                </CardContent>
            </Card>

            {
                addAllowed && (
                    <div className="fm-action-bar mt-6">
                        <Button
                            onClick={resetForm}
                            variant="outline"
                            className="h-[42px] sm:h-[42px] px-[22px] text-[13px] font-semibold rounded-[8px]"
                        >
                            Cancel
                        </Button>
                        {shouldShow("Wallet", "create") && (
                        <Button
                            onClick={() => setShowRuleCreateAlert(true)}
                            className="fm-action-primary"
                        >
                            Create Rule
                        </Button>
                        )}
                    </div>
                )
            }

            {!addAllowed &&
                <Card className="mb-6 rounded-2xl border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-sm font-semibold uppercase text-[#1A1A1A]">
                            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gray-100 text-gray-500 shrink-0"><History className="w-[18px] h-[18px]" /></span>
                            LOGS
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0">
                        <div className="">
                            <div className="relative">
                                {/* Background gradient */}
                                <div className="absolute inset-0 bg-gradient-glow opacity-30" />

                                {/* Content */}
                                <div className="relative z-10">
                                    <LogsTimeline logs={logs} title="Activity Logs" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
