// --- AccountTree component (recursive tree for modal) ---
const AccountTree = ({
    nodes,
    selected,
    toggle,
    level = 0,
}) => {
    return (
        <div>
            {nodes.map((node) => (
                <div key={node.id} style={{ marginLeft: level * 16 }}>
                    <div className="font-medium text-sm text-gray-700 py-1">
                        {node.group_name}
                    </div>
                    {node.ledgers?.map((ledger) => {
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

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CheckIcon from "@mui/icons-material/Check";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

/* ---------------- CONSTANTS ---------------- */

const MONTHS = [
    "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025",
    "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"
];

type Ledger = {
    id: string;
    name: string;
    values: number[];
};




type Group = {
    id: string;
    name: string;
    expanded: boolean;
    ledgers: Ledger[];
    children?: Group[];
};

/* ---------------- MOCK DATA ---------------- */

const incomeExpenseData: Group[] = [
    {
        id: "income",
        name: "Income",
        expanded: true,
        ledgers: [
            {
                id: "general-income",
                name: "General Income",
                values: [1000, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                id: "interest-income",
                name: "Interest Income",
                values: [1000, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ],
        children: []
    },
    {
        id: "expense",
        name: "Expense",
        expanded: true,
        ledgers: [
            // {
            //     id: "bank-fees",
            //     name: "Bank Fees and Charges",
            //     values: [20000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            // }
        ],


        children: [
            {
                id: "indirect-expense",
                name: "Indirect Expense",
                expanded: true,
                ledgers: [
                    { id: "consultant", name: "Consultant Expense", values: Array(12).fill(0) },
                    { id: "bank-fees", name: "Bank Fees and Charges", values: [20000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
                ],
                children: []
            }
        ]
    }
];



const assetLiabilityEquityData: Group[] = [
    {
        id: "asset",
        name: "Assets",
        expanded: true,
        ledgers: [
            { id: "cash", name: "Cash", values: Array(12).fill(0) }
        ]
    },
    {
        id: "liability",
        name: "Liabilities",
        expanded: true,
        ledgers: [
            { id: "loan", name: "Loan Payable", values: Array(12).fill(0) }
        ]
    },
    {
        id: "equity",
        name: "Equity",
        expanded: true,
        ledgers: [
            { id: "capital", name: "Owner Capital", values: Array(12).fill(0) }
        ]
    }
];


const getRootGroupId = (groupId: string): string => {
    if (groupId.includes("expense")) return "expense";
    if (groupId.includes("income")) return "income";
    if (groupId.includes("asset")) return "asset";
    if (groupId.includes("liability")) return "liability";
    if (groupId.includes("equity")) return "equity";
    return groupId;
};



/* ---------------- COMPONENT ---------------- */

export default function EditBudget() {
    const [activeTab, setActiveTab] = useState<"IE" | "ALE">("IE");
    const [groups, setGroups] = useState<Group[]>(incomeExpenseData);
    const [selectedAccountType, setSelectedAccountType] = useState<string>("");
    const accountTypeOptions =
        activeTab === "IE"
            ? [
                { value: "income", label: "Income" },
                { value: "expense", label: "Expense" },
            ]
            : [
                { value: "asset", label: "Asset" },
                { value: "liability", label: "Liability" },
                { value: "equity", label: "Equity" },
            ];

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

    /* Autofill State */
    const [autofill, setAutofill] = useState<{
        open: boolean;
        groupId?: string;
        ledger?: Ledger;
    }>({ open: false });

    const [autofillAmount, setAutofillAmount] = useState<number>(0);

    const switchTab = (tab: "IE" | "ALE") => {
        setActiveTab(tab);
        setGroups(tab === "IE" ? incomeExpenseData : assetLiabilityEquityData);
    };

    const toggleGroup = (id: string) => {
        setGroups(prev =>
            prev.map(g =>
                g.id === id ? { ...g, expanded: !g.expanded } : g
            )
        );
    };

    // const updateValue = (
    //     groupId: string,
    //     ledgerId: string,
    //     month: number,
    //     value: number
    // ) => {
    //     setGroups(prev =>
    //         prev.map(g =>
    //             g.id !== groupId
    //                 ? g
    //                 : {
    //                     ...g,
    //                     ledgers: g.ledgers.map(l =>
    //                         l.id !== ledgerId
    //                             ? l
    //                             : {
    //                                 ...l,
    //                                 values: l.values.map((v, i) =>
    //                                     i === month ? value : v
    //                                 )
    //                             }
    //                     )
    //                 }
    //         )
    //     );
    // };




    const updateValueRecursive = (
        groups: Group[],
        ledgerId: string,
        month: number,
        value: number
    ): Group[] =>
        groups.map(g => ({
            ...g,
            ledgers: g.ledgers.map(l =>
                l.id === ledgerId
                    ? {
                        ...l,
                        values: l.values.map((v, i) =>
                            i === month ? value : v
                        ),
                    }
                    : l
            ),
            children: g.children
                ? updateValueRecursive(g.children, ledgerId, month, value)
                : g.children,
        }));

    const ledgerTotal = (vals: number[]) =>
        vals.reduce((a, b) => a + b, 0);

    const mockAccountOptions: Record<string, Ledger[]> = {
        income: [
            { id: "general-income", name: "General Income", values: Array(12).fill(0) },
            { id: "interest-income", name: "Interest Income", values: Array(12).fill(0) },
            { id: "late-fee-income", name: "Late Fee Income", values: Array(12).fill(0) },
        ],
        expense: [
            { id: "consultant", name: "Consultant Expense", values: Array(12).fill(0) },
            { id: "bank-fees", name: "Bank Fees and Charges", values: Array(12).fill(0) },
        ],
        asset: [
            { id: "cash", name: "Cash", values: Array(12).fill(0) },
        ],
        liability: [
            { id: "loan", name: "Loan Payable", values: Array(12).fill(0) },
        ],
        equity: [
            { id: "capital", name: "Owner Capital", values: Array(12).fill(0) },
        ],
    };

    const addLedgersToGroup = (groupId: string, ledgers: Ledger[]) => {
        setGroups(prev =>
            prev.map(g =>
                g.id !== groupId
                    ? g
                    : {
                        ...g,
                        ledgers: [
                            ...g.ledgers,
                            ...ledgers.filter(
                                l => !g.ledgers.some(existing => existing.id === l.id)
                            ),
                        ],
                    }
            )
        );
    };

    // Modal logic for Add Account (multi-select, tree UI)
    // Tree data for modal (replace with your API data if needed)
    const accountTreeData = {
        income: [
            {
                id: 1,
                group_name: "Income",
                children: [],
                ledgers: [
                    { id: "general-income", name: "General Income" },
                    { id: "interest-income", name: "Interest Income" },
                    { id: "late-fee-income", name: "Late Fee Income" },
                ],
            },
        ],
        expense: [
            {
                id: 4,
                group_name: "Expenses",
                children: [
                    {
                        id: 90,
                        group_name: "Indirect Expense",
                        children: [],
                        ledgers: [
                            { id: "consultant", name: "Consultant Expense" },
                            { id: "bank-fees", name: "Bank Fees and Charges" },
                        ],
                    },
                ],
                ledgers: [],
            },
        ],
        asset: [
            {
                id: 2,
                group_name: "Assets",
                children: [],
                ledgers: [
                    { id: "cash", name: "Cash" },
                ],
            },
        ],
        liability: [
            {
                id: 3,
                group_name: "Liabilities",
                children: [],
                ledgers: [
                    { id: "loan", name: "Loan Payable" },
                ],
            },
        ],
        equity: [
            {
                id: 5,
                group_name: "Equity",
                children: [],
                ledgers: [
                    { id: "capital", name: "Owner Capital" },
                ],
            },
        ],
    };

    // Helper to flatten all ledgers from tree
    const getAllLedgers = (nodes) => {
        let result = [];
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

    const [accountModal, setAccountModal] = useState({
        open: false,
        groupId: '',
        label: '',
        options: [],
        values: [],
    });

    // Helper to add selected ledgers to group
    const handleAddAccounts = () => {
        if (!accountModal.groupId) return;
        // Add all selected ledgers with full data
        addLedgersToGroup(accountModal.groupId, accountModal.values.map(l => ({ ...l, values: Array(12).fill(0) })));
        setAccountModal({ ...accountModal, open: false, values: [] });
    };

    const collectAllLedgersFromGroup = (group: Group): Ledger[] => {
        let result: Ledger[] = [...group.ledgers];

        if (group.children?.length) {
            group.children.forEach(child => {
                result = result.concat(collectAllLedgersFromGroup(child));
            });
        }

        return result;
    };


    const updateGroupById = (
        groups: Group[],
        id: string,
        updater: (g: Group) => Group
    ): Group[] =>
        groups.map(g =>
            g.id === id
                ? updater(g)
                : {
                    ...g,
                    children: g.children
                        ? updateGroupById(g.children, id, updater)
                        : g.children,
                }
        );
    const getAffectedGroupIds = (type: string): string[] => {
        switch (type) {
            case "income":
                return ["income"];
            case "expense":
                return ["expense", "indirect-expense"];
            case "asset":
                return ["asset"];
            case "liability":
                return ["liability"];
            case "equity":
                return ["equity"];
            default:
                return [];
        }
    };
    const removeUnselectedScoped = (
        groups: Group[],
        allowedIds: string[],
        selectedLedgers: Ledger[]
    ): Group[] =>
        groups.map(g => {
            const shouldClean = allowedIds.includes(g.id);

            return {
                ...g,
                ledgers: shouldClean
                    ? g.ledgers.filter(l =>
                        selectedLedgers.some(v => v.id === l.id)
                    )
                    : g.ledgers, // ⬅️ untouched
                children: g.children
                    ? removeUnselectedScoped(g.children, allowedIds, selectedLedgers)
                    : g.children,
            };
        });



    const renderGroupRows = (group: Group, level = 0) => {
        const indent = { paddingLeft: `${level * 18}px` };

        const allLedgers = collectAllLedgersFromGroup(group);

        return (
            <React.Fragment key={group.id}>
                {/* GROUP HEADER */}
                <tr className="group-row">
                    <td style={indent} onClick={() => toggleGroup(group.id)} >
                        <strong className="ps-4">
                            {group.expanded ? "▼" : "▶"} {group.name}
                        </strong>
                    </td>
                    {MONTHS.map((_, i) => <td key={i}></td>)}
                    <td></td>
                </tr>

                {/* LEDGERS */}
                {group.expanded &&
                    group.ledgers.map(ledger => (
                        <tr key={ledger.id}>
                            <td className="ledger-cell" style={indent}>
                                <span className="ms-4">{ledger.name}</span>

                                <Button
                                    variant="outline"
                                    className="autofill-btn"
                                    onClick={() => {
                                        setAutofill({
                                            open: true,
                                            groupId: group.id,
                                            ledger,
                                        });

                                        setAutofillConfig({
                                            mode: "FIXED",
                                            base: "FIRST_PERIOD",
                                            value: ledger.values[0] ?? 0,
                                            firstPeriod: ledger.values[0] ?? 0,
                                        });
                                    }}

                                >
                                    Autofill
                                </Button>
                            </td>

                            {ledger.values.map((v, i) => (
                                <td key={i}>
                                    <input
                                        type="number"
                                        value={v}
                                        // onChange={e =>
                                        //     updateValue(group.id, ledger.id, i, Number(e.target.value))
                                        // }


                                        onChange={e =>
                                            setGroups(prev =>
                                                updateValueRecursive(
                                                    prev,
                                                    ledger.id,
                                                    i,
                                                    Number(e.target.value)
                                                )
                                            )
                                        }
                                    />
                                </td>
                            ))}
                            <td>{ledgerTotal(ledger.values)}</td>
                        </tr>
                    ))}

                {/* CHILD GROUPS */}
                {group.expanded &&
                    group.children?.map(child =>
                        renderGroupRows(child, level + 1)
                    )}

                {/* GROUP TOTAL */}
                {/* <tr className="group-total-row">
                    <td style={indent} ><span className="ps-4">Total for {group.name}</span></td>
                    {MONTHS.map((_, i) => (
                        <td key={i}>
                            {allLedgers.reduce((s, l) => s + (l.values[i] || 0), 0)}
                        </td>
                    ))}
                    <td>
                        {allLedgers.reduce((s, l) => s + ledgerTotal(l.values), 0)}
                    </td>
                </tr> */}

                <tr className="group-total-row">
                    <td style={{ ...indent, fontWeight: 700, paddingLeft: (typeof indent.paddingLeft === 'number' ? indent.paddingLeft : 0) + 16 }}>
                        Total for {group.name}
                    </td>
                    {MONTHS.map((_, i) => (
                        <td key={i} style={{ fontWeight: 700 }}>
                            {allLedgers.reduce((s, l) => s + (l.values[i] || 0), 0)}
                        </td>
                    ))}
                    <td style={{ fontWeight: 700 }}>
                        {allLedgers.reduce((s, l) => s + ledgerTotal(l.values), 0)}
                    </td>
                </tr>
            </React.Fragment>
        );
    };

    const resolveGroupForLedger = (ledgerId: string, groups: Group[]): string | null => {
        for (const g of groups) {
            if (g.ledgers.some(l => l.id === ledgerId)) return g.id;
            if (g.children) {
                const found = resolveGroupForLedger(ledgerId, g.children);
                if (found) return found;
            }
        }
        return null;
    };

    const filteredTreeData =
        selectedAccountType && accountTreeData[selectedAccountType]
            ? accountTreeData[selectedAccountType]
            : [];

    const collectAllCurrentLedgers = (groups: Group[]): Ledger[] => {
        let result: Ledger[] = [];

        const walk = (g: Group) => {
            result.push(...g.ledgers);
            g.children?.forEach(walk);
        };

        groups.forEach(walk);
        return result;
    };


    // const allModalLedgers = getAllLedgers(accountModal.options);
    const allModalLedgers = getAllLedgers(filteredTreeData);


    const isAllSelected =
        allModalLedgers.length > 0 &&
        allModalLedgers.every(l =>
            accountModal.values.some(v => v.id === l.id)
        );
    const removeUnselected = (groups: Group[]): Group[] =>
        groups.map(g => ({
            ...g,
            ledgers: g.ledgers.filter(l =>
                accountModal.values.some(v => v.id === l.id)
            ),
            children: g.children ? removeUnselected(g.children) : g.children,
        }));

    type AutofillMode =
        | "FIXED"
        | "ADJUST_AMOUNT"
        | "ADJUST_PERCENT";

    type AdjustmentBase =
        | "FIRST_PERIOD"
        | "EACH_PERIOD";




    const [autofillConfig, setAutofillConfig] = useState({
        mode: "FIXED" as AutofillMode,
        base: "FIRST_PERIOD" as AdjustmentBase,
        value: 0,                // amount or %
        firstPeriod: 0,          // ✅ ADD THIS
    });


    const calculateAutofillValues = (
        originalValues: number[],
        config: {
            mode: AutofillMode;
            base: AdjustmentBase;
            value: number;
            firstPeriod: number;
        }
    ): number[] => {
        const months = originalValues.length;
        const result: number[] = [];

        // FIXED MODE
        if (config.mode === "FIXED") {
            return Array(months).fill(config.value);
        }

        // FIRST PERIOD BASE (running adjustment)
        if (config.base === "FIRST_PERIOD") {
            let current = config.firstPeriod;

            for (let i = 0; i < months; i++) {
                if (i !== 0) {
                    const adjustment =
                        config.mode === "ADJUST_PERCENT"
                            ? (current * config.value) / 100
                            : config.value;

                    current = current + adjustment;
                }
                result[i] = current;
            }

            return result;
        }

        // EACH PERIOD EXISTING AMOUNT (independent)
        for (let i = 0; i < months; i++) {
            const base = originalValues[i] ?? 0;

            const adjustment =
                config.mode === "ADJUST_PERCENT"
                    ? (base * config.value) / 100
                    : config.value;

            result[i] = base + adjustment;
        }

        return result;
    };



    const autofillLedgerRecursive = (
        groups: Group[],
        groupId: string,
        ledgerId: string,
        config: typeof autofillConfig
    ): Group[] =>
        groups.map(g => ({
            ...g,
            ledgers:
                g.id === groupId
                    ? g.ledgers.map(l =>
                        l.id === ledgerId
                            ? {
                                ...l,
                                values: calculateAutofillValues(l.values, config),
                            }
                            : l
                    )
                    : g.ledgers,
            children: g.children
                ? autofillLedgerRecursive(g.children, groupId, ledgerId, config)
                : g.children,
        }));


    const previewValues =
        autofill.ledger
            ? calculateAutofillValues(
                autofill.ledger.values,
                autofillConfig
            )
            : [];


    return (
        <div style={{ padding: 20 }}>
            {/* HEADER */}
            <div className="bg-white rounded-lg border-2 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <NotepadText className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase">
                        Edit Budget
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

            {/* TABS */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <div className="grid grid-cols-2 border mb-4">
                    <button
                        type="button"
                        onClick={() => switchTab("IE")}
                        className={`px-4 py-2 text-sm font-medium
        ${activeTab === "IE"
                                ? "bg-[#f9f7f2] text-[#C72030] border-b-2 border-[#C72030]"
                                : "bg-white text-gray-600 hover:bg-[#f9f7f2]/40"
                            }
      `}
                    >
                        Income and Expense Accounts
                    </button>

                    <button
                        type="button"
                        onClick={() => switchTab("ALE")}
                        className={`px-4 py-2 text-sm font-medium
        ${activeTab === "ALE"
                                ? "bg-[#f9f7f2] text-[#C72030] border-b-2 border-[#C72030]"
                                : "bg-white text-gray-600 hover:bg-[#f9f7f2]/40"
                            }
      `}
                    >
                        Asset, Liability, and Equity Accounts
                    </button>
                </div>

                {/* TABLE */}
                <div className="table-scroll">
                    <table className="budget-table">
                        <thead>
                            <tr className="budget-head  ledger-row">
                                <th className="flex items-center justify-between gap-2">
                                    <span>ACCOUNT</span>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => {
                                            const alreadySelected = collectAllCurrentLedgers(groups);

                                            setSelectedAccountType(""); // ✅ reset
                                            setAccountModal({
                                                open: true,
                                                groupId: activeTab === "IE" ? "IE" : "ALE",
                                                label:
                                                    activeTab === "IE"
                                                        ? "Add Income / Expense Accounts"
                                                        : "Add Asset / Liability / Equity Accounts",
                                                options: [], // ⛔ no tree yet
                                                values: alreadySelected,
                                            });
                                        }}
                                    >
                                        + Add Accounts
                                    </Button>


                                </th>
                                {MONTHS.map(m => <th key={m}>{m}</th>)}
                                <th>TOTAL</th>
                            </tr>
                        </thead>

                        <tbody>
                            {groups.map(group => renderGroupRows(group))}
                        </tbody>

                    </table>
                </div>
            </div>

            <div className="flex gap-3 pt-5 mt-5 justify-center">
                <Button
                    type="submit"
                    className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
                >
                    Edit Budget
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


            {/* ADD ACCOUNT MODAL */}
            <Dialog
                open={accountModal.open}
                onClose={() => setAccountModal({ ...accountModal, open: false })}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <div className="flex items-center justify-between">
                        <span>{accountModal.label}</span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setAccountModal(prev => ({
                                    ...prev,
                                    values: isAllSelected ? [] : allModalLedgers,
                                }))
                            }
                        >
                            {isAllSelected ? "Unselect All" : "Select All"}
                        </Button>

                    </div>
                </DialogTitle>
                <DialogContent dividers>


                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Account Type</InputLabel>
                        <Select
                            value={selectedAccountType}
                            label="Account Type"
                            onChange={(e) => {
                                setSelectedAccountType(e.target.value);
                                //   setAccountModal(prev => ({ ...prev, values: [] }));
                            }}
                        >
                            {accountTypeOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedAccountType ? (
                        <AccountTree
                            nodes={filteredTreeData}
                            selected={accountModal.values}
                            toggle={(ledger) => {
                                setAccountModal(prev => ({
                                    ...prev,
                                    values: prev.values.some(l => l.id === ledger.id)
                                        ? prev.values.filter(l => l.id !== ledger.id)
                                        : [...prev.values, ledger],
                                }));
                            }}
                        />
                    ) : (
                        <div className="text-sm text-gray-500 text-center py-6">
                            Please select an account type to continue
                        </div>
                    )}

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outline"
                        onClick={() => setAccountModal({ ...accountModal, open: false })}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-[#C72030] text-white"
                        onClick={() => {
                            setGroups(prev => {
                                // ✅ STEP 1: REMOVE unselected everywhere
                                // let cleaned = removeUnselected(prev);


                                const affectedGroupIds = getAffectedGroupIds(selectedAccountType);

                                let cleaned = removeUnselectedScoped(
                                    prev,
                                    affectedGroupIds,
                                    accountModal.values
                                );


                                // ✅ STEP 2: ADD selected to correct group
                                accountModal.values.forEach(ledger => {
                                    const targetGroupId =
                                        ledger.id.includes("income")
                                            ? "income"
                                            : ledger.id.includes("expense") ||
                                                ledger.id.includes("consultant") ||
                                                ledger.id.includes("bank")
                                                ? "indirect-expense"
                                                : ledger.id.includes("cash")
                                                    ? "asset"
                                                    : ledger.id.includes("loan")
                                                        ? "liability"
                                                        : "equity";

                                    cleaned = updateGroupById(cleaned, targetGroupId, g => ({
                                        ...g,
                                        ledgers: g.ledgers.some(l => l.id === ledger.id)
                                            ? g.ledgers
                                            : [...g.ledgers, { ...ledger, values: Array(12).fill(0) }],
                                    }));
                                });

                                return cleaned;
                            });

                            setAccountModal({
                                open: false,
                                groupId: "",
                                label: "",
                                options: [],
                                values: [],
                            });
                        }}
                    >
                        Update
                    </Button>



                </DialogActions>
            </Dialog>

            {/* AUTOFILL MODAL */}
            <Dialog
                open={autofill.open}
                onClose={() => setAutofill({ open: false })}
                fullWidth
                maxWidth="md"
            >
                {/* HEADER */}
                <DialogTitle>
                    <div className="flex items-center justify-between">
                        <span>Autofill for {autofill.ledger?.name}</span>

                        <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => setAutofill({ open: false })}
                        >
                            ✕
                        </button>
                    </div>
                </DialogTitle>

                {/* BODY */}
                <DialogContent dividers>
                    <div className="space-y-5">

                        {/* Autofill Type */}
                        <div className="grid grid-cols-[220px_1fr] items-center gap-4">
                            <label className="text-sm text-gray-700">
                                Autofill Amount By
                            </label>

                            <select
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                value={autofillConfig.mode}
                                onChange={(e) =>
                                    setAutofillConfig(p => ({
                                        ...p,
                                        mode: e.target.value as AutofillMode,
                                    }))
                                }
                            >
                                <option value="FIXED">Apply fixed amount for each period</option>
                                <option value="ADJUST_AMOUNT">Adjustment Amount</option>
                                <option value="ADJUST_PERCENT">Adjustment Percentage</option>
                            </select>

                        </div>

                        {/* Amount */}
                        <div className="grid grid-cols-[220px_1fr] items-center gap-4">
                            <label className="text-sm text-gray-700">
                                Amount


                                {autofillConfig.mode === "ADJUST_PERCENT"
                                    ? " Amount (%)"
                                    : "Amount"}

                            </label>

                            <input
                                type="number"
                                value={autofillConfig.value}
                                onChange={(e) =>
                                    setAutofillConfig(p => ({
                                        ...p,
                                        value: Number(e.target.value),
                                    }))
                                }
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-40"
                            />

                            {/* <div className="relative grid grid-cols-[220px_1fr] items-center gap-4">
                               

                                {autofillConfig.mode === "ADJUST_PERCENT" && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                        %
                                    </span>
                                )}
                            </div> */}

                        </div>



                        {autofillConfig.mode !== "FIXED" && (
                            <div className="grid grid-cols-[220px_1fr] items-center gap-4">
                                <label className="text-sm text-gray-700">
                                    {/* Add the calculated amount to */}

                                    {autofillConfig.mode === "ADJUST_PERCENT"
                                        ? "Add the amount calculated from the percentage to"
                                        : "Add the calculated amount to"}
                                </label>

                                <select
                                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    value={autofillConfig.base}
                                    onChange={(e) =>
                                        setAutofillConfig(p => ({
                                            ...p,
                                            base: e.target.value as AdjustmentBase,
                                        }))
                                    }
                                >
                                    <option value="FIRST_PERIOD">First period’s amount</option>
                                    <option value="EACH_PERIOD">Each period’s existing amount</option>
                                </select>
                            </div>
                        )}

                        {autofillConfig.mode !== "FIXED" &&
                            autofillConfig.base === "FIRST_PERIOD" && (
                                <div className="grid grid-cols-[220px_1fr] items-center gap-4">
                                    <label className="text-sm text-gray-700">
                                        First period’s amount
                                    </label>

                                    <input
                                        type="number"
                                        value={autofillConfig.firstPeriod}
                                        onChange={(e) =>
                                            setAutofillConfig(p => ({
                                                ...p,
                                                firstPeriod: Number(e.target.value),
                                            }))
                                        }
                                        className="border border-gray-300 rounded px-2 py-1 text-sm w-40"
                                    />
                                </div>
                            )}

                        {/* PREVIEW */}
                        <div className="bg-gray-50 border rounded p-3">
                            <div className="text-xs font-semibold text-gray-500 mb-2">
                                PREVIEW
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border px-2 py-1 text-left bg-white">
                                                ACCOUNT
                                            </th>
                                            {MONTHS.map((m) => (
                                                <th
                                                    key={m}
                                                    className="border px-2 py-1 bg-white"
                                                >
                                                    {m.toUpperCase()}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td className="border px-2 py-1 text-left">
                                                {autofill.ledger?.name}
                                            </td>
                                            {previewValues.map((v, i) => (
                                                <td key={i} className="text-center font-semibold text-amber-700">
                                                    {v.toFixed(2)}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </DialogContent>

                {/* FOOTER */}
                <DialogActions>
                    <Button
                        variant="outline"
                        onClick={() => setAutofill({ open: false })}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-[#2563eb] text-white"
                        onClick={() => {
                            setGroups(prev =>
                                autofillLedgerRecursive(
                                    prev,
                                    autofill.groupId!,
                                    autofill.ledger!.id,
                                    autofillConfig
                                )
                            );


                            setAutofill({ open: false });
                            setAutofillAmount(0);
                        }}
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>

            {/* STYLES */}
            <style>{`
        .tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 12px;
        }
        .tabs button {
          padding: 10px 14px;
          border: none;
          background: none;
          cursor: pointer;
        }
        .tabs button.active {
          border-bottom: 2px solid #2563eb;
          font-weight: 600;
          color: #2563eb;
        }

        .table-scroll {
          overflow-x: auto;
          border: 1px solid #e5e7eb;
        }

        .budget-table {
          min-width: 1400px;
          border-collapse: collapse;
          font-size: 13px;
        }

        th, td {
          border: 1px solid #e5e7eb;
          padding: 6px;
          white-space: nowrap;
          text-align: right;
        }

        th:first-child, td:first-child {
          text-align: left;
          width: 260px;
          position: sticky;
          left: 0;
          background: white;
          z-index: 1;
        }

        .group-row {
          background: #f9fafb;
          cursor: pointer;
        }

        input {
          width: 80px;
          text-align: right;
        }

        .ledger-cell {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .autofill-btn {
          display: none;
          background: none;
          border: none;
          color: #2563eb;
          cursor: pointer;
          font-size: 12px;
        }

        .ledger-cell:hover .autofill-btn {
          display: inline;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal {
          background: white;
          width: 420px;
          border-radius: 6px;
        }

        .modal-header, .modal-footer {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
        }

        .modal-footer {
          border-top: 1px solid #e5e7eb;
        }

        .modal-body {
          padding: 12px;
        }

        .apply-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 4px;
        }



.table-scroll {
  overflow-x: auto;
  border: 1px solid #d1d5db; /* same as gray-300 */
 
}

.budget-table {
  width: 100%;
  min-width: 1400px;
  border-collapse: collapse;
  font-size: 13px;
}

/* HEADER */
.budget-table th {
  background: #E5E0D3;           /* ✅ same as Charge Details */
  border: 1px solid #d1d5db;     /* gray-300 */
  padding: 12px 10px;
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
}

.budget-table th:first-child {
  text-align: left;
}

/* BODY CELLS */
.budget-table td {
  border: 1px solid #d1d5db;     /* gray-300 */
  padding: 10px;
  text-align: right;
  background: #fff;
}

/* FIRST COLUMN */
.budget-table td:first-child {
  text-align: left;
  width: 260px;
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 1;
}

/* GROUP ROW */
.group-row td {
  background: #f5f3ec;          /* softer variant of header */
  font-weight: 600;
  cursor: pointer;
}

/* LEDGER ROW */
.ledger-row:hover td {
  background: #f9fafb;          /* same hover as your table */
}

/* LEDGER CELL */
.ledger-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* INPUT */
.budget-table input {
  width: 80px;
  text-align: right;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 6px;
  background: #fff;
}

/* AUTOFILL BUTTON */
.autofill-btn {
  font-size: 11px;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
}

.autofill-btn:hover {
  text-decoration: underline;
}

      `}</style>
        </div>
    );
}
