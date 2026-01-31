// Asset Accounts data for tab 2
const assetSections = [
    {
        label: 'Current Assets',
        items: ['Accounts Receivable']
    },
    {
        label: 'Other Current Assets',
        items: ['Advance Tax', 'Employee Advance', 'Inventory Assets', 'Prepaid Expense', 'TDS Receivable', 'Advance Tax', 'Employee Advance', 'Inventory Assets']
    },
    {
        label: 'Cash & Equivalents',
        items: ['Petty Cash', 'Undeposited Funds']
    },
    {
        label: 'Bank',
        items: []
    },
    {
        label: 'Other Assets',
        items: []
    },
    {
        label: 'Fixed Assets',
        items: ['Furniture & Equipment']
    },
];

import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, FileCog, NotepadText } from "lucide-react";

const accountTabs = [
    "Income Accounts",
    "Expense Accounts",
    "Asset Accounts",
    "Liability Accounts",
    "Equity Accounts"
];

const costOfGoodsSold = [
    "Cost Of Goods Sold",
    "Job Costing",
    "Labour",
    "Materials",
    "Subcontractor"
];

const expenseAccounts = [
    "Advertising And Marketing",
    "Automobile Expense",
    "Bad Debt",
    "Bank Fees & Charges",
    "Consultant Expense",
    "Contract Assets",
    "Credit Card Charges",
    "Depreciation & Amortisation",

    // ...add more as needed
];

const otherExpense = [
    "Exchange Gain or Loss"
];

const BudgetAdd: React.FC = () => {
    const [form, setForm] = useState(() => {
        const assetSectionState = {};
        assetSections.forEach(section => {
            assetSectionState[section.label] = [];
        });
        return {
            name: "",
            financialYear: "",
            budgetPeriod: "Monthly",
            costOfGoods: [],
            expense: [],
            otherExpense: [],
            ...assetSectionState
        };
    });
    const [activeTab, setActiveTab] = useState(1); // 1 = Expense Accounts

    // For native input/select (non-MUI)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // For MUI TextField/Select (event.target.value, event.target.name)
    const handleMuiInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        const { name, value } = event.target as HTMLInputElement & { name: string; value: string };
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (section: string, value: string) => {
        setForm((prev) => {
            const arr = prev[section as keyof typeof form] as string[];
            return {
                ...prev,
                [section]: arr.includes(value)
                    ? arr.filter((v) => v !== value)
                    : [...arr, value],
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Save logic here
        alert("Budget Saved!");
    };

    return (
        <form className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: '100vh', boxSizing: 'border-box' }} onSubmit={handleSubmit}>
            {/* Budget Details Section - styled like Bill Cycle Setup */}
            <div className="bg-white rounded-lg border-2 p-6 space-y-6 col-span-2 mb-6">
                <div className="flex items-center gap-3 mb-4">

                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <NotepadText className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Budget - New Budget</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                    {/* Name Field */}
                    <TextField
                        label={<span>Name <span className="text-red-600">*</span></span>}
                        name="name"
                        value={form.name}
                        onChange={handleMuiInputChange}
                        variant="outlined"
                        fullWidth
                        placeholder="Enter name"
                        required
                    />
                    {/* Financial Year Dropdown */}
                    <FormControl size="small" fullWidth>
                        <InputLabel id="financial-year-label">Financial Year <span style={{ color: '#C72030' }}>*</span></InputLabel>
                        <Select
                            labelId="financial-year-label"
                            id="financial-year-select"
                            name="financialYear"
                            value={form.financialYear}
                            label={<span>Financial Year <span style={{ color: '#C72030' }}>*</span></span>}
                            onChange={handleMuiInputChange}
                            required
                        >
                            <MenuItem value=""><span style={{ color: '#888' }}>Select</span></MenuItem>
                            <MenuItem value="Apr 2025 - Mar 2026">Apr 2025 - Mar 2026</MenuItem>
                            <MenuItem value="Apr 2024 - Mar 2025">Apr 2024 - Mar 2025</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Budget Period Dropdown */}
                    <FormControl size="small" fullWidth>
                        <InputLabel id="budget-period-label">Budget Period <span style={{ color: '#C72030' }}>*</span></InputLabel>
                        <Select
                            labelId="budget-period-label"
                            id="budget-period-select"
                            name="budgetPeriod"
                            value={form.budgetPeriod}
                            label={<span>Budget Period <span style={{ color: '#C72030' }}>*</span></span>}
                            onChange={handleMuiInputChange}
                            required
                        >
                            <MenuItem value="Monthly">Monthly</MenuItem>
                            <MenuItem value="Quarterly">Quarterly</MenuItem>
                            <MenuItem value="Yearly">Yearly</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>

            {/* Tabs for account types */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                {/* <div className="grid grid-cols-5 gap-2 w-full mb-6">
                    {accountTabs.map((tab, idx) => (
                        <button
                            key={tab}
                            type="button"
                            className={`w-full px-4 py-2 rounded-full transition-colors duration-150 text-sm
                                ${activeTab === idx
                                    ? 'bg-[#f9f7f2] text-[#C72030] font-semibold shadow border border-[#C72030]'
                                    : 'bg-[#f6f4ee] text-gray-600 border border-transparent hover:bg-[#ede9dd]'}
                            `}
                            onClick={() => setActiveTab(idx)}
                        >
                            {tab}
                        </button>
                    ))}
                </div> */}

                {/* <div className="bg-white rounded-lg border p-6 mb-6">
  <div className="grid grid-cols-5 gap-2 w-full mb-6">
    {accountTabs.map((tab, idx) => (
      <button
        key={tab}
        type="button"
        onClick={() => setActiveTab(idx)}
        className={`w-full px-4 py-2 rounded-full text-sm transition-all duration-150
          ${
            activeTab === idx
              ? 'bg-[#f9f7f2] text-[#C72030] font-semibold border border-[#C72030] shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#f9f7f2]/50'
          }
        `}
      >
        {tab}
      </button>
    ))}
  </div>
</div> */}

                {/* <div className="bg-white rounded-lg border p-6 mb-6"> */}
                <div className="grid grid-cols-5 gap-0 w-full mb-6 border border-gray-200">
                    {accountTabs.map((tab, idx) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(idx)}
                            className={`w-full px-4 py-2 text-sm transition-all duration-150
          ${activeTab === idx
                                    ? 'bg-[#f9f7f2] text-[#C72030] font-semibold border-b-2 border-[#C72030]'
                                    : 'bg-white text-gray-600 hover:bg-[#f9f7f2]/40'
                                }
        `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                {/* </div> */}


                {/* Only Expense Accounts tab is implemented for demo */}
                {activeTab === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {/* Cost Of Goods Sold */}
                        <div className="bg-[#f6f4ee] rounded-xl p-4 border border-[#e5e0d3] min-w-[180px]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#e5e0d3]">
                                    <span className="block w-3 h-3 bg-[#b6a98c] rounded-full"></span>
                                </div>
                                <span className="font-semibold text-base text-[#b6a98c]">Cost Of Goods Sold</span>
                            </div>
                            <div className="max-h-40 overflow-y-auto pr-1">
                                {costOfGoodsSold.map((item) => (
                                    <div key={item} className="flex items-center mb-2">
                                        <Checkbox
                                            checked={form.costOfGoods.includes(item)}
                                            onCheckedChange={() => handleCheckboxChange('costOfGoods', item)}
                                        />
                                        <span className="ml-2 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Expense */}
                        <div className="bg-[#f6f4ee] rounded-xl p-4 border border-[#e5e0d3] min-w-[180px]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#e5e0d3]">
                                    <span className="block w-3 h-3 bg-[#b6a98c] rounded-full"></span>
                                </div>
                                <span className="font-semibold text-base text-[#b6a98c]">Expense</span>
                            </div>
                            <div className="max-h-40 overflow-y-auto pr-1">
                                {expenseAccounts.map((item) => (
                                    <div key={item} className="flex items-center mb-2">
                                        <Checkbox
                                            checked={form.expense.includes(item)}
                                            onCheckedChange={() => handleCheckboxChange('expense', item)}
                                        />
                                        <span className="ml-2 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Other Expense */}
                        <div className="bg-[#f6f4ee] rounded-xl p-4 border border-[#e5e0d3] min-w-[180px]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#e5e0d3]">
                                    <span className="block w-3 h-3 bg-[#b6a98c] rounded-full"></span>
                                </div>
                                <span className="font-semibold text-base text-[#b6a98c]">Other Expense</span>
                            </div>
                            <div className="max-h-40 overflow-y-auto pr-1">
                                {otherExpense.map((item) => (
                                    <div key={item} className="flex items-center mb-2">
                                        <Checkbox
                                            checked={form.otherExpense.includes(item)}
                                            onCheckedChange={() => handleCheckboxChange('otherExpense', item)}
                                        />
                                        <span className="ml-2 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {/* Asset Accounts tab */}
                {activeTab === 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {assetSections.map((section) => (
                            <div key={section.label} className="bg-[#f6f4ee] rounded-xl p-4 border border-[#e5e0d3] min-w-[180px] min-h-[260px] flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#e5e0d3]">
                                            <span className="block w-3 h-3 bg-[#b6a98c] rounded-full"></span>
                                        </div>
                                        <span className="font-semibold text-base text-[#b6a98c]">{section.label}</span>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto pr-1">
                                        {section.items.length === 0 ? (
                                            <span className="text-xs text-gray-400">No items</span>
                                        ) : (
                                            section.items.map((item) => (
                                                <div key={item} className="flex items-center mb-2">
                                                    <Checkbox
                                                        checked={form[section.label] && form[section.label].includes(item)}
                                                        onCheckedChange={() => handleCheckboxChange(section.label, item)}
                                                    />
                                                    <span className="ml-2 text-sm">{item}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* You can add similar sections for other tabs as needed */}
            </div>

            <div className="flex gap-3 pt-5 mt-5 justify-center">
                <Button
                    type="submit"
                    className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
                >
                    Create Budget
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
    );
};

export default BudgetAdd;
