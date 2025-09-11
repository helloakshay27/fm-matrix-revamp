import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

const CRMWalletPointExpiry = () => {
    const [formData, setFormData] = useState({
        rule_name: "",
        complementary_condition: "",
        purchase_condition: "",
    });

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
                        RULE SETUP
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
                        onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                        variant="outlined"
                        defaultValue="New Rule"
                        margin="normal"
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
        </div>
    );
};

export default CRMWalletPointExpiry;
