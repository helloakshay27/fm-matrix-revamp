import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createExpiryRule, fetchLogs, fetchWalletRule } from '@/store/slices/pointExpirySlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Pen } from 'lucide-react';
import RuleAlert from '@/components/RuleAlert';
import { useNavigate } from 'react-router-dom';
import { LogEntry, LogsTimeline } from '@/components/LogTimeline';
import { id } from 'date-fns/locale';

const sampleLogs: LogEntry[] = [
    {
        id: "1",
        description: "Complimentary condition updated to 'Weekly' by Ankit Gupta",
        timestamp: "5 June 2025  2:09PM"
    },
    {
        id: "2",
        description: "Complimentary condition created with 'Monthly', Purchase condition created with 'Monthly' by Ankit Gupta",
        timestamp: "5 June 2025  2:08PM"
    }
];

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
        <div className="p-[30px] min-h-screen bg-transparent">
            <Card className="mb-6" style={{ border: "1px solid #D9D9D9" }}>
                <CardHeader
                    className="bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <div className='flex items-center justify-between'>
                        <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                            <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                                R
                            </span>
                            RULE SETUP
                        </CardTitle>

                        {
                            !addAllowed && (
                                <Button
                                    variant="outline"
                                    className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 flex items-center gap-3"
                                    onClick={() => navigate('/crm/point-expiry/edit')}
                                >
                                    <Pen size={15} /> Edit
                                </Button>
                            )
                        }
                    </div>
                </CardHeader>
                <CardContent
                    className="px-[50px] py-[25px] bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
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
                                background: '#F6F7F7 !important',
                            },
                            '& .MuiInputLabel-root': {
                                background: '#F6F7F7 !important',
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
                                    background: '#F6F7F7 !important',
                                },
                                '& .MuiInputLabel-root': {
                                    background: '#F6F7F7 !important',
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
                                    background: '#F6F7F7 !important',
                                },
                                '& .MuiInputLabel-root': {
                                    background: '#F6F7F7 !important',
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
                    <div className='flex items-center justify-center gap-3'>
                        <Button
                            onClick={() => setShowRuleCreateAlert(true)}
                            style={{ backgroundColor: "#C72030" }}
                            className="text-white hover:bg-[#C72030]/90"
                        >
                            Create Rule
                        </Button>
                        <Button
                            onClick={resetForm}
                            variant="outline"
                            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                        >
                            Cancel
                        </Button>
                    </div>
                )
            }

            {!addAllowed &&
                <Card className="mb-6" style={{ border: "1px solid #D9D9D9" }}>
                    <CardHeader
                        className="bg-[#F6F4EE]"
                        style={{ border: "1px solid #D9D9D9" }}
                    >
                        <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                            <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                                L
                            </span>
                            LOGS
                        </CardTitle>
                    </CardHeader>
                    <CardContent
                        className="px-[50px] py-[25px] bg-[#F6F7F7]"
                        style={{ border: "1px solid #D9D9D9" }}
                    >
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
