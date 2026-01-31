
import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, FileCog, NotepadText } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";

// Custom theme for MUI components
const muiTheme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
      defaultProps: {
        shrink: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiSelect-select": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
    },
  },
});

const TaxSetup: React.FC = () => {
    const [form, setForm] = useState({
        gstin: "",
        compositionScheme: false,
        reverseCharge: false,
        overseasTrading: false,
        digitalServices: false,
        gstRegisteredOn: "",
        gstinUsername: "",
        reportingPeriod: "",
        generateFirstTaxReturnFrom: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submit logic here
        alert("Saved!");
    };

    return (
<ThemeProvider theme={muiTheme}>
        {/* <div className="p-[30px] min-h-screen bg-transparent"> */}
            <form
                className="w-full bg-white p-6"
                style={{ minHeight: '100vh', boxSizing: 'border-box' }}
                onSubmit={handleSubmit}
            >
                {/* GST Section */}
                <div className="bg-white rounded-lg border-2 p-6 space-y-6 col-span-2 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">GST Info</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                        <div>
                            {/* <label className="block text-sm font-semibold text-red-700 mb-2">
                                GSTIN <span className="text-xs text-gray-500">(Maximum 15 digits)</span>
                            </label> */}
                            <TextField
                            label={<span >GSTIN <span className="text-red-600">*</span> <span className="text-xs text-gray-500">(Maximum 15 digits)</span></span>}
                                size="small"
                                variant="outlined"
                                name="gstin"
                                value={form.gstin}
                                onChange={handleChange}
                                className="w-full"
                                placeholder="Enter GSTIN"
                                inputProps={{ maxLength: 15 }}
                            />
                        </div>
                        <div>
                            <TextField
                                label={<span>GST Registered On <span className="text-red-600">*</span></span>}
                                size="small"
                                variant="outlined"
                                name="gstRegisteredOn"
                                type="date"
                                value={form.gstRegisteredOn}
                                onChange={handleChange}
                                className="w-full"
                                InputLabelProps={{ shrink: true }}
                                // required
                            />
                        </div>
                    </div>
                </div>

                {/* GST Options Section */}
                <div className="bg-white rounded-lg border-2 p-6 space-y-6 col-span-2 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                            <FileCog className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">GST Options</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="block text-sm font-semibold text-gray-700 mb-1">Composition Scheme</div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="compositionScheme"
                                    checked={form.compositionScheme}
                                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, compositionScheme: !!checked }))}
                                />
                                <label htmlFor="compositionScheme" className="text-sm">My business is registered for Composition Scheme.</label>
                            </div>
                        </div>
                        <div>
                            <div className="block text-sm font-semibold text-gray-700 mb-1">Reverse Charge</div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="reverseCharge"
                                    checked={form.reverseCharge}
                                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, reverseCharge: !!checked }))}
                                />
                                <label htmlFor="reverseCharge" className="text-sm">Enable Reverse Charge in Sales transactions</label>
                            </div>
                        </div>
                        <div>
                            <div className="block text-sm font-semibold text-gray-700 mb-1">Import / Export (Overseas Trading)</div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="overseasTrading"
                                    checked={form.overseasTrading}
                                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, overseasTrading: !!checked }))}
                                />
                                <label htmlFor="overseasTrading" className="text-sm">My business is involved in Overseas Trading</label>
                            </div>
                        </div>
                        <div>
                            <div className="block text-sm font-semibold text-gray-700 mb-1">Digital Services</div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="digitalServices"
                                    checked={form.digitalServices}
                                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, digitalServices: !!checked }))}
                                />
                                <label htmlFor="digitalServices" className="text-sm">Track export of Digital Services</label>
                            </div>
                            <div className="text-xs text-gray-500 ml-6 mt-1">
                                Enabling this option will let you record and track export of digital services to individuals.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Direct Filing Section */}
                <div className="bg-white rounded-lg border-2 p-6 space-y-6 col-span-2 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                            <NotepadText className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Direct Filing Settings</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                        <div>
                            <TextField
                                label={<span>GSTIN Username <span className="text-red-600">*</span></span>}
                                size="small"
                                variant="outlined"
                                name="gstinUsername"
                                value={form.gstinUsername}
                                onChange={handleChange}
                                className="w-full"
                                placeholder="Enter GSTIN Username"
                                // required
                            />
                        </div>
                        <div>
                            {/* <label className="block text-sm mb-2 font-medium text-gray-700">Reporting Period <span className="text-red-600">*</span></label>
                            <FormControl size="small" fullWidth>
                                <Select
                                    name="reportingPeriod"
                                    value={form.reportingPeriod}
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Select Reporting Period' }}
                                    required
                                >
                                    <MenuItem value=""><span style={{ color: '#888' }}>Select</span></MenuItem>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                    <MenuItem value="quarterly">Quarterly</MenuItem>
                                    <MenuItem value="yearly">Yearly</MenuItem>
                                </Select>
                            </FormControl> */}


                            <FormControl size="small" fullWidth sx={{ mt: 0 }}>
							<InputLabel id="reporting-period-label">Reporting Period <span style={{ color: '#C72030' }}>*</span></InputLabel>
							<Select
								labelId="reporting-period-label"
								id="reporting-period-select"
								name="reportingPeriod"
								value={form.reportingPeriod}
								label={<span>Reporting Period <span style={{ color: '#C72030' }}>*</span></span>}
								onChange={handleChange}
								displayEmpty
								// required
							>
								<MenuItem value=""><span style={{ color: '#888' }}>Select</span></MenuItem>
								<MenuItem value="monthly">Monthly</MenuItem>
								<MenuItem value="quarterly">Quarterly</MenuItem>
								<MenuItem value="yearly">Yearly</MenuItem>
							</Select>
						</FormControl>
                        </div>
                        <div>
                            <TextField
                                label={<span>Generate First Tax Return From <span className="text-red-600">*</span></span>}
                                size="small"
                                variant="outlined"
                                name="generateFirstTaxReturnFrom"
                                type="date"
                                value={form.generateFirstTaxReturnFrom}
                                onChange={handleChange}
                                className="w-full"
                                InputLabelProps={{ shrink: true }}
                                // required
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="flex justify-center col-span-2 mt-12">
					   <button
						   type="submit"
						   className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px] px-8 py-3 rounded text-lg font-semibold transition"
					   >
						   Save
					   </button>
				   </div> */}
                <div className="flex gap-3 pt-5 mt-5 mb-5 justify-center">

                    <Button
                        type="submit"
                        className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
                    >
                        Save
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => window.history.back()}
                        className="min-w-[100px]"
                    >
                        Cancel
                    </Button>
                </div>
            </form>

        {/* </div> */}
        </ThemeProvider>
    );
};

export default TaxSetup;
