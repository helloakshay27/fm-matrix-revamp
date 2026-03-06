import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CheckIcon from "@mui/icons-material/Check";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

/* ===================== MOCK TREE DATA (API READY) ===================== */

const incomeTreeData = [
    {
        id: 1,
        group_name: "Income",
        children: [],
        ledgers: [
            { id: 11, name: "Membership Fees" },
            { id: 12, name: "Donations" },
        ],
    },
];

const expenseTreeData = [
    {
        id: 4,
        group_name: "Expenses",
        children: [
            {
                id: 90,
                group_name: "Indirect Expense",
                children: [],
                ledgers: [
                    { id: 34, name: "Interest Paid" },
                    { id: 35, name: "Interest Payable" },
                    { id: 36, name: "Bank Charges" },
                    { id: 37, name: "Salaries and Allowances of Staff" },
                ],
            },
        ],
        ledgers: [],
    },
];

const assetTreeData = [
    {
        id: 2,
        group_name: "Assets",
        children: [],
        ledgers: [
            { id: 21, name: "Cash" },
            { id: 22, name: "Bank Account" },
        ],
    },
];

const liabilityTreeData = [
    {
        id: 3,
        group_name: "Liabilities",
        children: [],
        ledgers: [
            { id: 31, name: "Loans Payable" },
            { id: 32, name: "Outstanding Expenses" },
        ],
    },
];

const equityTreeData = [
    {
        id: 5,
        group_name: "Equity",
        children: [],
        ledgers: [
            { id: 51, name: "Capital Account" },
            { id: 52, name: "Retained Earnings" },
            { id: 53, name: "General Reserve" },
        ],
    },
];


/* ===================== TREE COMPONENT ===================== */

const AccountTree = ({
    nodes,
    selected,
    toggle,
    level = 0,
}: {
    nodes: any[];
    selected: any[];
    toggle: (ledger: any) => void;
    level?: number;
}) => {
    return (
        <div>
            {nodes.map((node) => (
                <div key={node.id} style={{ marginLeft: level * 16 }}>
                    <div className="font-medium text-sm text-gray-700 py-1">
                        {node.group_name}
                    </div>

                    {/* Ledgers */}
                    {node.ledgers?.map((ledger: any) => {
                        const checked = selected.some((l) => l.id === ledger.id);
                        return (
                            <div
                                key={ledger.id}
                                className="flex items-center justify-between pl-6 pr-2 py-1 cursor-pointer hover:bg-gray-50 rounded"
                                onClick={() => toggle(ledger)}
                            >
                                <span className="text-sm">{ledger.name}</span>
                                {checked && <CheckIcon fontSize="small" color="success" />}
                            </div>
                        );
                    })}

                    {/* Children */}
                    {node.children?.length > 0 && (
                        <AccountTree
                            nodes={node.children}
                            selected={selected}
                            toggle={toggle}
                            level={level + 1}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

/* ===================== MAIN COMPONENT ===================== */

const BudgetAddNew: React.FC = () => {
    const [form, setForm] = useState({
        name: "",
        financialYear: "",
        budgetPeriod: "Monthly",
        incomeAccounts: [] as any[],
        expenseAccounts: [] as any[],
        assetAccounts: [] as any[],
        liabilityAccounts: [] as any[],
        equityAccounts: [] as any[], // ✅ ADD THIS
    });

    const [accountModal, setAccountModal] = useState<{
        open: boolean;
        label: string;
        options: any[];
        values: any[];
        onSave?: (vals: any[]) => void;
    }>({
        open: false,
        label: "",
        options: [],
        values: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...form,
            incomeAccounts: form.incomeAccounts.map((a) => a.id),
            expenseAccounts: form.expenseAccounts.map((a) => a.id),
            assetAccounts: form.assetAccounts.map((a) => a.id),
            liabilityAccounts: form.liabilityAccounts.map((a) => a.id),
            equityAccounts: form.equityAccounts.map((a) => a.id),
        };

        console.log("FINAL PAYLOAD", payload);
        alert("Budget Saved");
    };

    /* ===================== ACCOUNT FIELD ===================== */

    const AccountField = ({
        label,
        values,
        onOpen,
    }: {
        label: string;
        values: any[];
        onOpen: () => void;
    }) => (
        <div className="grid grid-cols-3 gap-6 items-start py-3">
            <div className="text-sm font-medium text-gray-700">{label}</div>

            <div className="col-span-2 border border-dashed rounded-md p-3 bg-[#fafafa]">
                <div className="flex flex-wrap gap-2 mb-2">
                    {values.map((v) => (
                        <span
                            key={v.id}
                            className="px-2 py-1 text-xs rounded bg-[#FCE8EA] text-[#C72030]"
                        >
                            {v.name}
                        </span>
                    ))}
                </div>

                <Button type="button" variant="outline" size="sm" onClick={onOpen}>
                    Add Accounts
                </Button>
            </div>
        </div>
    );

    const [showAccounts, setShowAccounts] = useState(false);
    const getAllLedgers = (nodes: any[]): any[] => {
        let result: any[] = [];

        nodes.forEach((node) => {
            if (node.ledgers?.length) {
                result = result.concat(node.ledgers);
            }
            if (node.children?.length) {
                result = result.concat(getAllLedgers(node.children));
            }
        });

        return result;
    };

    return (
        <>
            <form
                className="w-full bg-[#f9f7f2] p-6"
                style={{ minHeight: "100vh" }}
                onSubmit={handleSubmit}
            >
                {/* HEADER */}
                <div className="bg-white rounded-lg border-2 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                            <NotepadText className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold uppercase">
                            Budget - New Budget
                        </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <TextField
                            label="Name *"
                            value={form.name}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, name: e.target.value }))
                            }
                            fullWidth
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel>Financial Year *</InputLabel>
                            <Select
                                value={form.financialYear}
                                label="Financial Year *"
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        financialYear: e.target.value,
                                    }))
                                }
                            >
                                <MenuItem value="Apr 2025 - Mar 2026">
                                    Apr 2025 - Mar 2026
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Budget Period *</InputLabel>
                            <Select
                                value={form.budgetPeriod}
                                label="Budget Period *"
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        budgetPeriod: e.target.value,
                                    }))
                                }
                            >
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="Quarterly">Quarterly</MenuItem>
                                <MenuItem value="Yearly">Yearly</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {/* ACCOUNTS */}
                <div className="bg-white rounded-lg border-2 p-6 mb-6 space-y-6">
                    <h4 className="text-s font-semibold text-gray-500 uppercase">
                        Income and Expense Accounts
                    </h4>

                    <AccountField
                        label="Income Accounts"
                        values={form.incomeAccounts}
                        onOpen={() =>
                            setAccountModal({
                                open: true,
                                label: "Income Accounts",
                                options: incomeTreeData,
                                values: form.incomeAccounts,
                                onSave: (vals) =>
                                    setForm((p) => ({ ...p, incomeAccounts: vals })),
                            })
                        }
                    />

                    <AccountField
                        label="Expense Accounts"
                        values={form.expenseAccounts}
                        onOpen={() =>
                            setAccountModal({
                                open: true,
                                label: "Expense Accounts",
                                options: expenseTreeData,
                                values: form.expenseAccounts,
                                onSave: (vals) =>
                                    setForm((p) => ({ ...p, expenseAccounts: vals })),
                            })
                        }
                    />

                    <div className="flex items-center gap-3 mb-3">
                        {!showAccounts ? (
                            <span
                                className="text-[#1a73e8] font-medium cursor-pointer"
                                onClick={() => setShowAccounts(true)}
                            >
                                + Include Asset, Liability, and Equity Accounts in Budget
                            </span>
                        ) : (
                            <span
                                className="text-[#C72030] font-medium cursor-pointer"
                                onClick={() => {
                                    setShowAccounts(false);

                                    // OPTIONAL: clear selected accounts on exclude
                                    setForm((p) => ({
                                        ...p,
                                        assetAccounts: [],
                                        liabilityAccounts: [],
                                        equityAccounts: [],
                                    }));
                                }}
                            >
                                ✕  Remove Asset, Liability, and Equity Accounts in Budget
                            </span>
                        )}
                    </div>

                    {showAccounts && (
                        <>

                            <h4 className="text-s font-semibold text-gray-500 uppercase">
                                Asset, Liability, and Equity Accounts
                            </h4>
                            <AccountField
                                label="Asset Accounts"
                                values={form.assetAccounts}
                                onOpen={() =>
                                    setAccountModal({
                                        open: true,
                                        label: "Asset Accounts",
                                        options: assetTreeData,
                                        values: form.assetAccounts,
                                        onSave: (vals) =>
                                            setForm((p) => ({ ...p, assetAccounts: vals })),
                                    })
                                }
                            />

                            <AccountField
                                label="Liability Accounts"
                                values={form.liabilityAccounts}
                                onOpen={() =>
                                    setAccountModal({
                                        open: true,
                                        label: "Liability Accounts",
                                        options: liabilityTreeData,
                                        values: form.liabilityAccounts,
                                        onSave: (vals) =>
                                            setForm((p) => ({ ...p, liabilityAccounts: vals })),
                                    })
                                }
                            />

                            <AccountField
                                label="Equity Accounts"
                                values={form.equityAccounts}
                                onOpen={() =>
                                    setAccountModal({
                                        open: true,
                                        label: "Equity Accounts",
                                        options: equityTreeData,
                                        values: form.equityAccounts,
                                        onSave: (vals) =>
                                            setForm((p) => ({ ...p, equityAccounts: vals })),
                                    })
                                }
                            />
                        </>
                    )}

                </div>
                
                {/* ACTIONS */}
                <div className="flex gap-3 justify-center">
                    <Button className="bg-[#C72030] text-white" type="submit">
                        Create Budget
                    </Button>
                    <Button variant="outline" type="button">
                        Cancel
                    </Button>
                </div>
            </form>

            {/* MODAL */}
            <Dialog
                open={accountModal.open}
                onClose={() => setAccountModal({ ...accountModal, open: false })}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <div className="flex items-center justify-between">
                        <span>{accountModal.label}</span>

                        {(() => {
                            const allLedgers = getAllLedgers(accountModal.options);
                            const isAllSelected =
                                allLedgers.length > 0 &&
                                allLedgers.every((l) =>
                                    accountModal.values.some((v) => v.id === l.id)
                                );

                            return (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setAccountModal((prev) => ({
                                            ...prev,
                                            values: isAllSelected ? [] : allLedgers,
                                        }))
                                    }
                                >
                                    {isAllSelected ? "Unselect All" : "Select All"}
                                </Button>
                            );
                        })()}
                    </div>
                </DialogTitle>


                <DialogContent dividers>
                    <AccountTree
                        nodes={accountModal.options}
                        selected={accountModal.values}
                        toggle={(ledger) => {
                            setAccountModal((prev) => ({
                                ...prev,
                                values: prev.values.some((l) => l.id === ledger.id)
                                    ? prev.values.filter((l) => l.id !== ledger.id)
                                    : [...prev.values, ledger],
                            }));
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setAccountModal({ ...accountModal, open: false })
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-[#C72030] text-white"
                        onClick={() => {
                            accountModal.onSave?.(accountModal.values);
                            setAccountModal({ ...accountModal, open: false });
                        }}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BudgetAddNew;
